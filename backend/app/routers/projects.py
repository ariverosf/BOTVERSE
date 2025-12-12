from datetime import datetime
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Path
from bson import ObjectId

from app.config import db
from app.deps import pagination_params
from app.schemas.project import ProjectCreate, ProjectDB
from app.utils import format_mongo_document
from app.routers.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectDB)
def create_project(payload: ProjectCreate, user=Depends(get_current_user)):
    now = datetime.utcnow()
    doc = payload.model_dump()
    doc.update({"created_at": now, "updated_at": now, "owner_id": user["id"]})
    res = db.projects.insert_one(doc)
    created = db.projects.find_one({"_id": res.inserted_id})
    return format_mongo_document(created)

@router.get("/", response_model=List[ProjectDB])
def list_projects(p=Depends(pagination_params), user=Depends(get_current_user)):
    cur = db.projects.find({"owner_id": user["id"]}).skip(p["skip"]).limit(p["limit"])
    return [format_mongo_document(d) for d in cur]

@router.get("/{project_id}", response_model=ProjectDB)
def get_project(project_id: str = Path(...), user=Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(400, "project_id inválido")
    doc = db.projects.find_one({"_id": ObjectId(project_id), "owner_id": user["id"]})
    if not doc:
        raise HTTPException(404, "Proyecto no encontrado")
    return format_mongo_document(doc)

@router.put("/{project_id}", response_model=ProjectDB)
def update_project(project_id: str, updated: dict = Body(...), user=Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(400, "project_id inválido")
    updated = {k: v for k, v in updated.items() if k != "_id"}
    updated["updated_at"] = datetime.utcnow()
    doc = db.projects.find_one_and_update(
        {"_id": ObjectId(project_id), "owner_id": user["id"]},
        {"$set": updated},
        return_document=True,
    )
    if not doc:
        raise HTTPException(404, "Proyecto no encontrado")
    return format_mongo_document(doc)
