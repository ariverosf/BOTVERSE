from app.services.zipper import make_zip
import json
import textwrap

# --------------------------------------------------------
# RASA GENERATOR (MENU FLOW - FSM)
# --------------------------------------------------------
def generate_rasa_project(flow: dict) -> bytes:
    nodes = {n["id"]: n for n in flow["nodes"]}
    edges = flow["metadata"]["edges"]

    # --------------------------------------------------------
    # DETECT START NODE
    # --------------------------------------------------------
    start_edge = next(e for e in edges if e["source"] == "start-node")
    first_node_id = start_edge["target"]

    # --------------------------------------------------------
    # BUILD CHOICES MAP
    # --------------------------------------------------------
    choices_map = {}
    for node in flow["nodes"]:
        if node["type"] != "ActionNode":
            continue

        node_id = node["id"]
        choices = []

        for a in node["data"]["actions"]:
            if a["type"] == "capture-info" and a["subtype"] == "choice":
                choices.extend(a["value"]["choices"])

        if choices:
            choices_map[node_id] = choices

    # --------------------------------------------------------
    # BUILD TRANSITIONS (FSM)
    # --------------------------------------------------------
    transitions = {}

    for e in edges:
        src = e["source"]
        tgt = e["target"]
        handle = e.get("sourceHandle", "")

        if src not in choices_map:
            continue

        if "choice" in handle:
            idx = int(handle.split("-")[-1])
            label = choices_map[src][idx]
            transitions[f"{src}|{label}"] = tgt

    # --------------------------------------------------------
    # CONFIG.YML (SIN FALLBACK)
    # --------------------------------------------------------
    config_yml = """version: "3.1"
language: es

pipeline:
  - name: WhitespaceTokenizer
  - name: RegexFeaturizer
  - name: DIETClassifier
    epochs: 1
    constrain_similarities: true

policies:
  - name: RulePolicy
"""

    # --------------------------------------------------------
    # DOMAIN.YML
    # --------------------------------------------------------
    intents = set()
    utterances = {}

    for node_id, choices in choices_map.items():
        for c in choices:
            intents.add(f"choice_{c.lower().replace(' ', '_')}")

    for node in flow["nodes"]:
        if node["type"] != "ActionNode":
            continue

        node_id = node["id"]
        utter_key = f"utter_node_{node_id}"
        utterances[utter_key] = []

        texts = []
        buttons = []

        for a in node["data"]["actions"]:
            if a["type"] == "message" and a["subtype"] == "text":
                texts.append(a["value"])

            if a["type"] == "capture-info" and a["subtype"] == "choice":
                for c in a["value"]["choices"]:
                    intent = f"choice_{c.lower().replace(' ', '_')}"
                    buttons.append({
                        "title": c,
                        "payload": f"/{intent}",
                    })

        for t in texts:
            msg = {"text": t}
            if buttons:
                msg["buttons"] = buttons
            utterances[utter_key].append(msg)

    domain_yml = "version: '3.1'\n\nintents:\n"
    for i in sorted(intents):
        domain_yml += f"  - {i}\n"

    domain_yml += """
slots:
  current_node:
    type: text
    mappings:
      - type: custom

responses:
"""

    for k, msgs in utterances.items():
        domain_yml += f"  {k}:\n"
        for m in msgs:
            domain_yml += f'    - text: "{m["text"]}"\n'
            if "buttons" in m:
                domain_yml += "      buttons:\n"
                for b in m["buttons"]:
                    domain_yml += f'        - title: "{b["title"]}"\n'
                    domain_yml += f'          payload: "{b["payload"]}"\n'

    domain_yml += """
  utter_end:
    - text: "Flujo finalizado."

actions:
  - action_session_start
  - action_route_flow
"""

    # --------------------------------------------------------
    # NLU.YML (MÍNIMO – SOLO SOPORTE MANUAL)
    # --------------------------------------------------------
    nlu_yml = "version: '3.1'\nnlu:\n"
    for i in intents:
        label = i.replace("choice_", "")
        nlu_yml += f"""
- intent: {i}
  examples: |
    - {label}
"""

    # --------------------------------------------------------
    # RULES.YML (FSM PURO)
    # --------------------------------------------------------
    rules_yml = "version: '3.1'\nrules:\n\n"
    rules_yml += """
- rule: start flow
  steps:
    - action: action_session_start
"""

    for i in sorted(intents):
        rules_yml += f"""
- rule: route {i}
  steps:
    - intent: {i}
    - action: action_route_flow
"""

    # --------------------------------------------------------
    # ACTIONS.PY (FSM DETERMINISTA)
    # --------------------------------------------------------
    actions_py = textwrap.dedent(f"""
from rasa_sdk import Action
from rasa_sdk.events import SessionStarted, SlotSet, ActionExecuted

TRANSITIONS = {json.dumps(transitions, indent=2)}

class ActionSessionStart(Action):
    def name(self):
        return "action_session_start"

    def run(self, dispatcher, tracker, domain):
        events = []
        events.append(SessionStarted())

        dispatcher.utter_message(response="utter_node_{first_node_id}")
        events.append(SlotSet("current_node", "{first_node_id}"))
        events.append(ActionExecuted("action_listen"))

        return events


class ActionRouteFlow(Action):
    def name(self):
        return "action_route_flow"

    def run(self, dispatcher, tracker, domain):
        current = tracker.get_slot("current_node")
        intent = tracker.latest_message.get("intent", {{}}).get("name")

        for key, tgt in TRANSITIONS.items():
            src, label = key.split("|")
            expected_intent = "choice_" + label.lower().replace(" ", "_")

            if src == current and intent == expected_intent:
                if tgt == "end-node":
                    dispatcher.utter_message(response="utter_end")
                    return [SlotSet("current_node", None)]

                dispatcher.utter_message(response=f"utter_node_{{tgt}}")
                return [SlotSet("current_node", tgt)]

        dispatcher.utter_message(response=f"utter_node_{{current}}")
        return []
    """).strip()

    # --------------------------------------------------------
    # PACKAGE FILES
    # --------------------------------------------------------
    files = {
        "project/config.yml": config_yml.encode(),
        "project/domain.yml": domain_yml.encode(),
        "project/data/nlu.yml": nlu_yml.encode(),
        "project/data/rules.yml": rules_yml.encode(),
        "project/actions/actions.py": actions_py.encode(),
        "project/actions/__init__.py": b"",
        "project/endpoints.yml": b"action_endpoint:\n  url: http://localhost:5055/webhook",
        "project/models/.gitkeep": b"",
    }

    return make_zip(files)
