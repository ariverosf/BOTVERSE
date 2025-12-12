from typing import Dict, Any, List
from app.schemas.flow import FlowDB
from fastapi import HTTPException

def simulate_flow(node_id: str, value: str, flow: FlowDB):
    nodes = {n.id: n for n in flow.nodes}
    edges = flow.metadata.get("edges")
    
    current_node = nodes.get(node_id)

    if not current_node:
        raise HTTPException(status_code=404, detail="Nodo no encontrado")

    # Si es EndNode, devolver mensaje de finalización
    if current_node.type == "EndNode":
        return {"messages": ["El flujo ha finalizado."], "choices": [], "node_id": node_id}
    
    if current_node.type == "StartNode":
        target = next(e.get("target") for e in edges if e.get("source") == "start-node")
        current_node = nodes.get(target)
        node_id = target

    # Preparar respuesta
    response = {"messages": [], "choices": [], "node_id": node_id}

    # Extraer mensajes y generar choices dinámicamente
    if current_node.type == "ActionNode":
        actions = current_node.data.get("actions", [])
        capture_infos = [i for i, a in enumerate(actions) if a["type"] == "capture-info" and a.get("subtype") == "choice"]

        # Agregar mensajes
        for action in actions:
            if action["type"] == "message":
                response["messages"].append(action["value"])

        # Generar choices
        for capture_idx in capture_infos:
            choice_action = actions[capture_idx]
            choices_list = []
            for option_idx, choice_value in enumerate(choice_action["value"]["choices"]):
                target_id = None
                for edge in edges:
                    if edge["source"] == node_id and edge.get("sourceHandle"):
                        if f"choice-{capture_idx}-{option_idx}" in edge["sourceHandle"]:
                            target_id = edge["target"]
                            break
                # Si no se encontró edge con handle, usar primer edge sin sourceHandle
                if not target_id:
                    for edge in edges:
                        if edge["source"] == node_id and not edge.get("sourceHandle"):
                            target_id = edge["target"]
                            break
                choices_list.append({"id": target_id, "value": choice_value})
            response["choices"].extend(choices_list)

    # Determinar según la elección enviada
    for choice in response["choices"]:
        if choice["value"] == value:
            return simulate_flow(choice["id"], value=value, flow=flow)


    return response