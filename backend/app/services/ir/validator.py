from typing import Dict, Any

class IRValidationError(Exception):
    pass

def validate_diagram(diagram: Dict[str, Any]) -> None:
    # Validador tolerante para demo/export
    if not isinstance(diagram, dict):
        raise IRValidationError("diagram debe ser un objeto JSON")
    nodes = diagram.get("nodes")
    edges = diagram.get("edges")
    if not isinstance(nodes, list):
        raise IRValidationError("diagram.nodes debe ser lista")
    if not isinstance(edges, list):
        raise IRValidationError("diagram.edges debe ser lista")

    # Verificación mínima de IDs y referencias (NO bloqueante en demo)
    ids = [n.get("id") for n in nodes if isinstance(n, dict)]
    if len(ids) != len(set(ids)):
        # En demo: sólo avisar en logs; no reventar
        print("[validator] Aviso: IDs de nodos duplicados (se permitirá en demo)")

    node_ids = set(ids)
    for e in edges:
        if not isinstance(e, dict):
            continue
        s = e.get("source"); t = e.get("target")
        if not s or not t:
            print("[validator] Aviso: edge sin source/target (se permite en demo)")
            continue
        if s not in node_ids or t not in node_ids:
            print(f"[validator] Aviso: edge referencia nodos inexistentes: {s}->{t} (se permite en demo)")
