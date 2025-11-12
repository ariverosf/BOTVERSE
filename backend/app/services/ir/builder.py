from typing import Dict, Any

def build_ir(diagram: Dict[str, Any], language: str = "es") -> Dict[str, Any]:
    """
    Normaliza el diagrama a un IR mínimo que consume el generador Rasa.
    Este IR es agnóstico de plataforma.
    """
    # Asumimos que el diagrama trae nodos / intents simples.
    # Si tu JSON real es distinto, aquí mapeas a este formato.
    intents = []
    utterances = {}
    stories = []

    # Ejemplo: nodos -> intents/utterances/stories muy básicos
    for node in diagram.get("nodes", []):
        ntype = node.get("type")
        name = node.get("name") or node.get("id")
        if ntype == "intent":
            intents.append({
                "name": name,
                "examples": node.get("examples", [])
            })
        elif ntype == "utter":
            utterances.setdefault(name, []).extend(node.get("texts", []))
        # Historias demo: si hay edges, construimos un camino [intent -> utter]
    edges = diagram.get("edges", [])
    for e in edges:
        src = e.get("source")
        dst = e.get("target")
        if not src or not dst:
            continue
        # historia simple: si source es intent y target es utter, creamos un paso
        src_node = _find_node(diagram, src)
        dst_node = _find_node(diagram, dst)
        if src_node and dst_node and src_node.get("type") == "intent" and dst_node.get("type") == "utter":
            stories.append({
                "intent": src_node.get("name") or src,
                "utter": dst_node.get("name") or dst
            })

    return {
        "language": language,
        "intents": intents,
        "utterances": utterances,
        "stories": stories,
        # Acciones IR (el generador puede añadir demo si flag)
        "actions": diagram.get("actions", []),
    }

def _find_node(diagram: Dict[str, Any], node_id: str):
    for n in diagram.get("nodes", []):
        if n.get("id") == node_id:
            return n
    return None
