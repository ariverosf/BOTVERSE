from typing import Dict, Any, List
from io import StringIO
import textwrap

def generate_rasa_project(ir: Dict[str, Any], include_demo_actions: bool, pipeline_preset: str) -> Dict[str, bytes]:
    """
    Devuelve un dict {ruta: contenido_bytes} con los archivos del proyecto Rasa.
    """
    files: Dict[str, bytes] = {}

    # config.yml
    config_yml = _render_config(pipeline_preset)
    files["platforms/rasa/config.yml"] = config_yml.encode("utf-8")

    # domain.yml
    domain_yml = _render_domain(ir, include_demo_actions)
    files["platforms/rasa/domain.yml"] = domain_yml.encode("utf-8")

    # data/nlu.yml
    nlu_yml = _render_nlu(ir)
    files["platforms/rasa/data/nlu.yml"] = nlu_yml.encode("utf-8")

    # data/stories.yml
    stories_yml = _render_stories(ir)
    files["platforms/rasa/data/stories.yml"] = stories_yml.encode("utf-8")

    # rules.yml mínimo (fallback)
    rules_yml = _render_rules()
    files["platforms/rasa/data/rules.yml"] = rules_yml.encode("utf-8")

    # endpoints.yml
    endpoints_yml = textwrap.dedent("""\
    action_endpoint:
      url: "http://localhost:5055/webhook"
    """)
    files["platforms/rasa/endpoints.yml"] = endpoints_yml.encode("utf-8")

    # actions/
    actions_py = _render_actions_py(include_demo_actions)
    files["platforms/rasa/actions/actions.py"] = actions_py.encode("utf-8")
    files["platforms/rasa/actions/requirements.txt"] = b"rasa-sdk>=3.0.0\n"

    # IR y manifest (encapsulado)
    files["ir/bot.json"] = _json_bytes(ir)
    manifest = textwrap.dedent("""\
    {
      "name": "botpack",
      "specVersion": "1.0",
      "targets": ["rasa"],
      "language": "%s"
    }
    """ % ir.get("language", "es"))
    files["manifest.json"] = manifest.encode("utf-8")

    # README.md rápido
    readme = textwrap.dedent("""\
    # BotPack (Rasa)
    1) cd platforms/rasa
    2) rasa train
    3) rasa run actions & rasa run --enable-api -p 5005
    """)
    files["platforms/rasa/README.md"] = readme.encode("utf-8")

    return files

def _render_config(preset: str) -> str:
    # Pipelines mínimas para demo
    if preset == "spacy":
        return textwrap.dedent("""\
        language: es
        pipeline:
          - name: SpacyNLP
          - name: SpacyTokenizer
          - name: SpacyFeaturizer
          - name: DIETClassifier
          - name: EntitySynonymMapper
          - name: ResponseSelector
        policies:
          - name: RulePolicy
          - name: MemoizationPolicy
          - name: TEDPolicy
        """)
    elif preset == "hf":
        return textwrap.dedent("""\
        language: es
        pipeline:
          - name: WhitespaceTokenizer
          - name: LanguageModelFeaturizer
            model_name: "distilbert"
            model_weights: "distilbert-base-multilingual-cased"
          - name: DIETClassifier
          - name: EntitySynonymMapper
          - name: ResponseSelector
        policies:
          - name: RulePolicy
          - name: MemoizationPolicy
          - name: TEDPolicy
        """)
    # basic
    return textwrap.dedent("""\
    language: es
    pipeline:
      - name: WhitespaceTokenizer
      - name: CountVectorsFeaturizer
      - name: DIETClassifier
      - name: EntitySynonymMapper
      - name: ResponseSelector
    policies:
      - name: RulePolicy
      - name: MemoizationPolicy
      - name: TEDPolicy
    """)

def _render_domain(ir: Dict[str, Any], include_demo_actions: bool) -> str:
    intents = [i["name"] for i in ir.get("intents", [])]
    responses = {}
    for utter_name, texts in ir.get("utterances", {}).items():
        responses["utter_" + _slug(utter_name)] = [{"text": t} for t in texts]

    # Demo actions
    actions = []
    if include_demo_actions:
        actions = [
            "action_greet","action_goodbye","action_help","action_fallback",
            "action_collect_name","action_collect_email","action_collect_phone",
            "action_confirm_data","action_show_hours","action_show_location",
            "action_create_ticket","action_order_status","action_book_appointment",
            "action_cancel_appointment","action_smalltalk_thanks","action_smalltalk_sorry",
            "action_faq_general","action_escalate_emergency","action_reset_conversation",
            "action_handoff"
        ]

    # Yaml render simple
    from io import StringIO
    buf = StringIO()
    buf.write("version: \"3.1\"\n")
    if intents:
        buf.write("intents:\n")
        for it in intents:
            buf.write(f"  - {_slug(it)}\n")
    if responses:
        buf.write("responses:\n")
        for k, v in responses.items():
            buf.write(f"  {k}:\n")
            for entry in v:
                buf.write(f"  - text: \"{entry['text']}\"\n")
    if actions:
        buf.write("actions:\n")
        for a in actions:
            buf.write(f"  - {a}\n")
    return buf.getvalue()

def _render_nlu(ir: Dict[str, Any]) -> str:
    out = StringIO()
    out.write("version: \"3.1\"\n")
    out.write("nlu:\n")
    for it in ir.get("intents", []):
        name = _slug(it["name"])
        out.write(f"- intent: {name}\n")
        out.write("  examples: |\n")
        for ex in it.get("examples", []):
            out.write(f"    - {ex}\n")
    return out.getvalue()

def _render_stories(ir: Dict[str, Any]) -> str:
    out = StringIO()
    out.write("version: \"3.1\"\n")
    out.write("stories:\n")
    # Historias: intent -> utter_*
    for s in ir.get("stories", []):
        intent = _slug(s["intent"])
        utter = "utter_" + _slug(s["utter"])
        out.write(f"- story: {intent}_to_{utter}\n")
        out.write("  steps:\n")
        out.write(f"  - intent: {intent}\n")
        out.write(f"  - action: {utter}\n")
    return out.getvalue()

def _render_rules() -> str:
    return textwrap.dedent("""\
    version: "3.1"
    rules:
    - rule: Fallback
      steps:
      - intent: nlu_fallback
      - action: action_fallback
    """)

def _render_actions_py(include_demo_actions: bool) -> str:
    if not include_demo_actions:
        return "from rasa_sdk import Action\n"

    # 20 acciones demo sencillas
    return textwrap.dedent("""\
    from typing import Any, Text, Dict, List
    from rasa_sdk import Action, Tracker
    from rasa_sdk.executor import CollectingDispatcher

    class action_greet(Action):
        def name(self) -> Text: return "action_greet"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¡Hola! ¿En qué puedo ayudarte?")
            return []

    class action_goodbye(Action):
        def name(self) -> Text: return "action_goodbye"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¡Hasta luego!")
            return []

    class action_help(Action):
        def name(self) -> Text: return "action_help"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Puedo ayudarte con horario, ubicación o crear un ticket.")
            return []

    class action_fallback(Action):
        def name(self) -> Text: return "action_fallback"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="No entendí bien. ¿Puedes reformular?")
            return []

    class action_collect_name(Action):
        def name(self) -> Text: return "action_collect_name"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¿Cuál es tu nombre?")
            return []

    class action_collect_email(Action):
        def name(self) -> Text: return "action_collect_email"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¿Cuál es tu correo?")
            return []

    class action_collect_phone(Action):
        def name(self) -> Text: return "action_collect_phone"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¿Cuál es tu teléfono?")
            return []

    class action_confirm_data(Action):
        def name(self) -> Text: return "action_confirm_data"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Gracias, confirmo tus datos.")
            return []

    class action_show_hours(Action):
        def name(self) -> Text: return "action_show_hours"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Nuestro horario es Lun-Vie 9:00 a 18:00.")
            return []

    class action_show_location(Action):
        def name(self) -> Text: return "action_show_location"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Estamos en Santiago Centro.")
            return []

    class action_create_ticket(Action):
        def name(self) -> Text: return "action_create_ticket"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Ticket creado (demo).")
            return []

    class action_order_status(Action):
        def name(self) -> Text: return "action_order_status"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Tu pedido está en preparación (demo).")
            return []

    class action_book_appointment(Action):
        def name(self) -> Text: return "action_book_appointment"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Cita agendada (demo).")
            return []

    class action_cancel_appointment(Action):
        def name(self) -> Text: return "action_cancel_appointment"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Cita cancelada (demo).")
            return []

    class action_smalltalk_thanks(Action):
        def name(self) -> Text: return "action_smalltalk_thanks"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="¡De nada!")
            return []

    class action_smalltalk_sorry(Action):
        def name(self) -> Text: return "action_smalltalk_sorry"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Perdón por las molestias.")
            return []

    class action_faq_general(Action):
        def name(self) -> Text: return "action_faq_general"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Aquí va una respuesta demo de FAQ.")
            return []

    class action_escalate_emergency(Action):
        def name(self) -> Text: return "action_escalate_emergency"
        def run(self, dispatcher, domain, tracker):
            dispatcher.utter_message(text="Escalando emergencia (demo).")
            return []

    class action_reset_conversation(Action):
        def name(self) -> Text: return "action_reset_conversation"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Reseteando la conversación (demo).")
            return []

    class action_handoff(Action):
        def name(self) -> Text: return "action_handoff"
        def run(self, dispatcher, tracker, domain):
            dispatcher.utter_message(text="Derivando a humano (demo).")
            return []
    """)

def _json_bytes(obj: Any) -> bytes:
    import json
    return json.dumps(obj, ensure_ascii=False, indent=2).encode("utf-8")

def _slug(s: str) -> str:
    return "".join(c.lower() if c.isalnum() else "_" for c in s).strip("_")
