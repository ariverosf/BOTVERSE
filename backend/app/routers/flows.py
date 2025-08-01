from fastapi import APIRouter, HTTPException, Body, Path
from bson import ObjectId
from app.config import db
from app.schemas import Flow
from app.utils import format_mongo_document

router = APIRouter(prefix="/flows", tags=["Flows"])

@router.post("/")
def create_flow(flow: Flow):
    # Verificar que el project_id existe
    if not ObjectId.is_valid(flow.project_id):
        raise HTTPException(status_code=400, detail="ID de proyecto inválido")
    project = db.projects.find_one({"_id": ObjectId(flow.project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    new_flow = flow.dict()
    new_flow["project_id"] = str(flow.project_id)
    result = db.flows.insert_one(new_flow)
    # Recuperar el flujo creado para devolverlo formateado
    created_flow = db.flows.find_one({"_id": result.inserted_id})
    return format_mongo_document(created_flow)

@router.get("/")
def get_flows():
    flows = [format_mongo_document(flow) for flow in db.flows.find()]
    return flows

@router.get("/{flow_id}")
def get_flow(flow_id: str = Path(...)):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    flow = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(flow)

@router.put("/{flow_id}")
def update_flow(flow_id: str, updated_data: dict = Body(...)):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    result = db.flows.update_one({"_id": ObjectId(flow_id)}, {"$set": updated_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    updated_flow = db.flows.find_one({"_id": ObjectId(flow_id)})
    return format_mongo_document(updated_flow)

@router.delete("/{flow_id}")
def delete_flow(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    result = db.flows.delete_one({"_id": ObjectId(flow_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return {"message": "Flujo eliminado"}

@router.put("/{flow_id}/nodes")
def update_flow_nodes(flow_id: str, nodes: list = Body(...)):
    from bson import ObjectId
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    result = db.flows.update_one(
        {"_id": ObjectId(flow_id)},
        {"$set": {"nodes": nodes}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    updated_flow = db.flows.find_one({"_id": ObjectId(flow_id)})
    return format_mongo_document(updated_flow)

@router.get("/{flow_id}/detail")
def get_flow_detail(flow_id: str):
    from bson import ObjectId
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    flow = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(flow)

@router.post("/{flow_id}/duplicate")
def duplicate_flow(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    flow = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    # Eliminar el ID para que MongoDB genere uno nuevo
    flow.pop("_id")
    flow["name"] = f"{flow['name']} (copia)"
    result = db.flows.insert_one(flow)
    new_flow = db.flows.find_one({"_id": result.inserted_id})
    return format_mongo_document(new_flow)
