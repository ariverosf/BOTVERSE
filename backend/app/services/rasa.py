from app.services.zipper import make_zip
import json

# --------------------------------------------------------
# RASA GENERATOR
# --------------------------------------------------------
def generate_rasa_project(flow: dict) -> bytes:
    nodes = {n["id"]: n for n in flow["nodes"]}
    edges = flow["metadata"]["edges"]

    # Detect start node
    start_edge = next(e for e in edges if e["source"] == "start-node")
    first_node_id = start_edge["target"]

    # Mapping for choice transitions
    transitions = {}
    

    # For each ActionNode build mapping of: node_id -> list of choices
    choices_map = {}

    for node in flow["nodes"]:
        if node["type"] != "ActionNode":
            continue

        node_id = node["id"]
        choices = []

        for a in node["data"]["actions"]:
            if a["type"] == "capture-info" and a["subtype"] == "choice":
                for c in a["value"]["choices"]:
                    choices.append(c)

        choices_map[node_id] = choices

    # Build transitions based on edges
    for e in edges:
        src = e["source"]
        tgt = e["target"]
        src_handle = e.get("sourceHandle", "")

        if src not in choices_map:
            continue  # skip start-node or non-choice nodes

        # Extract index from handle text
        # Example: "handle-<id>-capture-info-choice-0-1"
        if "choice" in src_handle:
            idx = int(src_handle.split("-")[-1])
            label = choices_map[src][idx]
            transitions[(src, label)] = tgt

    # --------------------------------------------------------
    # BUILD RASA FILES
    # --------------------------------------------------------

    # ----------------- config.yml -----------------
    config_yml = """language: es
pipeline:
  - name: WhitespaceTokenizer
  - name: RegexFeaturizer
  - name: LexicalSyntacticFeaturizer
  - name: CountVectorsFeaturizer
  - name: CountVectorsFeaturizer
    analyzer: char_wb
    min_ngram: 1
    max_ngram: 4
  - name: DIETClassifier
    epochs: 40
  - name: EntitySynonymMapper

policies:
  - name: RulePolicy
"""


    # ----------------- domain.yml -----------------
    intents = set()
    utterances = {}
    rules = []

    invalid_message = "Opción no válida, intenta nuevamente."

    # Generate intents and utterances
    for node in flow["nodes"]:
        if node["type"] != "ActionNode":
            continue

        node_id = node["id"]
        utter_key = f"utter_node_{node_id}"
        utterances[utter_key] = []

        for a in node["data"]["actions"]:
            if a["type"] == "message" and a["subtype"] == "text":
                utterances[utter_key].append(a["value"])

            if a["type"] == "capture-info" and a["subtype"] == "choice":
                for c in a["value"]["choices"]:
                    intent_name = f"choice_{c.lower().replace(' ', '_')}"
                    intents.add(intent_name)

    # Write domain
    domain_yml = "version: '3.1'\n\nintents:\n"
    for i in intents:
        domain_yml += f"  - {i}\n"

    domain_yml += """slots:
  current_node:
    type: text
    mappings:
      - type: custom
"""


    for k, msgs in utterances.items():
        domain_yml += f"responses:\n" if k == list(utterances.keys())[0] else ""
        domain_yml += f"  {k}:\n"
        for m in msgs:
            domain_yml += f"    - text: \"{m}\"\n"

    domain_yml += f"""
  utter_invalid:
    - text: "{invalid_message}"

  utter_end:
    - text: "Flujo finalizado."
"""

    domain_yml += """
actions:
  - action_start_flow
  - action_route_flow
"""


    # ----------------- NLU -----------------
    nlu_yml = "version: '3.1'\nnlu:\n"
    for i in intents:
        label = i.replace("choice_", "")
        nlu_yml += f"- intent: {i}\n  examples: |\n    - {label}\n"


    # ----------------- RULES -----------------
    rules_yml = "version: '3.1'\nrules:\n\n"

    # Start rule
    rules_yml += f"""
- rule: session_start
  steps:
    - action: action_start_flow
"""

    # Rules for transitions
    for (src, label), tgt in transitions.items():

        intent_name = f"choice_{label.lower().replace(' ', '_')}"

        if tgt == "end-node":
            rules_yml += f"""
- rule: go_from_{src}_to_end
  condition:
    - slot_was_set:
        - current_node: "{src}"
  steps:
    - intent: {intent_name}
    - action: utter_end
    - action: action_route_flow
"""
        else:
            rules_yml += f"""
- rule: go_from_{src}_to_{tgt}
  condition:
    - slot_was_set:
        - current_node: "{src}"
  steps:
    - intent: {intent_name}
    - action: action_route_flow
"""

    # Invalid option rules
    all_choice_nodes = list(choices_map.keys())
    for node_id in all_choice_nodes:
        rules_yml += f"""
- rule: invalid_choice_in_{node_id}
  condition:
    - slot_was_set:
        - current_node: "{node_id}"
  steps:
    - action: utter_invalid
    - action: action_route_flow
"""

    # Convert keys (src, label) to "src|label"
    transitions_serializable = {
        f"{src}|{label}": tgt
        for (src, label), tgt in transitions.items()
    }


    # ----------------- ACTIONS -----------------
    actions_py = f"""
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionStartFlow(Action):
    def name(self):
        return "action_start_flow"

    def run(self, dispatcher, tracker, domain):
        first_node = "{first_node_id}"
        
        # Enviar mensaje de bienvenida del primer nodo
        dispatcher.utter_message(response=f"utter_node_{{first_node}}")
        
        # Guardar current_node
        return [SlotSet("current_node", first_node)]



class ActionRouteFlow(Action):
    def name(self):
        return "action_route_flow"

    def run(self, dispatcher, tracker, domain):
        current = tracker.get_slot("current_node")
        # Inicializar flujo si aún no hay nodo activo
        if not current:
            first_node = "{first_node_id}"
            dispatcher.utter_message(response=f"utter_node_{{first_node}}")
            return [SlotSet("current_node", first_node)]

        last_intent = tracker.latest_message.get("intent", {{}}).get("name", "")

        transitions = {json.dumps(transitions_serializable, indent=2)}

        # Buscar transición válida
        for key, tgt in transitions.items():
            src, label = key.split("|")
            intent_name = "choice_" + label.lower().replace(" ", "_")

            if src == current and last_intent == intent_name:
                if tgt == "end-node":
                    dispatcher.utter_message(response="utter_end")
                    return [SlotSet("current_node", None)]

                dispatcher.utter_message(response=f"utter_node_{{tgt}}")
                return [SlotSet("current_node", tgt)]

        # Opción inválida
        dispatcher.utter_message(response="utter_invalid")
        dispatcher.utter_message(response=f"utter_node_{{current}}")
        return []
"""



    # ----------------- FILE PACKAGING -----------------
    files = {
        "project/config.yml": config_yml.encode(),
        "project/domain.yml": domain_yml.encode(),
        "project/data/nlu.yml": nlu_yml.encode(),
        "project/data/rules.yml": rules_yml.encode(),
        "project/actions/actions.py": actions_py.encode(),
        "project/actions/__init__.py": b"",
        "project/endpoints.yml": b"action_endpoint:\n  url: http://localhost:5055/webhook",
        "project/credentials.yml": b"",
        "project/models/.gitkeep": b"",
        "project/tests/.gitkeep": b"",
    }

    return make_zip(files)
