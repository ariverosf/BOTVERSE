from datetime import datetime
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query
from bson import ObjectId

from app.config import db
from app.schemas.flow import FlowCreate, FlowDB
from app.deps import pagination_params  
from app.utils import format_mongo_document 
from app.routers.auth import get_current_user

router = APIRouter(prefix="/flows", tags=["flows"])


@router.post("/", response_model=FlowDB)
def create_flow(payload: FlowCreate):
    # Validar que el project_id sea un ObjectId válido y que el proyecto exista
    if not ObjectId.is_valid(payload.project_id):
        raise HTTPException(status_code=400, detail="project_id inválido")
    project = db.projects.find_one({"_id": ObjectId(payload.project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    now = datetime.utcnow()
    doc = payload.model_dump()
    # Mantén project_id como string si tu FE lo espera así (consistente con tu código previo)
    doc["project_id"] = str(payload.project_id)
    doc["created_at"] = now
    doc["updated_at"] = now

    res = db.flows.insert_one(doc)
    created = db.flows.find_one({"_id": res.inserted_id})
    # Normaliza _id a string y devuelve con el schema
    return format_mongo_document(created)


@router.get("/", response_model=List[FlowDB])
def list_flows(p=Depends(pagination_params)):
    cur = db.flows.find().skip(p["skip"]).limit(p["limit"])
    items = [format_mongo_document(d) for d in cur]
    return items


@router.get("/by-project/{project_id}", response_model=List[FlowDB])
def list_flows_by_project(
    project_id: str = Path(..., description="ID de proyecto"),
    p=Depends(pagination_params),
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="project_id inválido")
    cur = (
        db.flows.find({"project_id": str(project_id)})
        .skip(p["skip"])
        .limit(p["limit"])
    )
    items = [format_mongo_document(d) for d in cur]
    return items


@router.get("/{flow_id}", response_model=FlowDB)
def get_flow(flow_id: str = Path(...)):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    doc = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(doc)


@router.put("/{flow_id}", response_model=FlowDB)
def update_flow(flow_id: str, updated_data: dict = Body(...)):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    updated_data = {k: v for k, v in updated_data.items() if k != "_id"}
    updated_data["updated_at"] = datetime.utcnow()

    res = db.flows.find_one_and_update(
        {"_id": ObjectId(flow_id)},
        {"$set": updated_data},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(res)


@router.delete("/{flow_id}")
def delete_flow(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    res = db.flows.delete_one({"_id": ObjectId(flow_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return {"ok": True}


@router.put("/{flow_id}/nodes", response_model=FlowDB)
def update_flow_nodes(flow_id: str, nodes: list = Body(...)):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    res = db.flows.find_one_and_update(
        {"id": ObjectId(flow_id)},
        {"$set": {"nodes": nodes, "updated_at": datetime.utcnow()}},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(res)


@router.get("/{flow_id}/detail", response_model=FlowDB)
def get_flow_detail(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    doc = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return format_mongo_document(doc)


@router.post("/{flow_id}/duplicate", response_model=FlowDB)
def duplicate_flow(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    doc = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")

    doc.pop("id")
    doc["name"] = f"{doc.get('name','flujo')} (copia)"
    now = datetime.utcnow()
    doc["created_at"] = now
    doc["updated_at"] = now

    res = db.flows.insert_one(doc)
    new_doc = db.flows.find_one({"_id": res.inserted_id})
    return format_mongo_document(new_doc)
