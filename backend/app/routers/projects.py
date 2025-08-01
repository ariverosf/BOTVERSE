from fastapi import APIRouter, HTTPException, Body, Path
from bson import ObjectId
from app.config import db
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Modelo Pydantic para proyectos
class Project(BaseModel):
    name: str
    description: Optional[str] = None
    created_at: datetime = datetime.utcnow()

router = APIRouter(prefix="/projects", tags=["Projects"])

print(">>>>> ESTE ES EL PROJECTS QUE SE ESTÁ EJECUTANDO <<<<<")

# Función para transformar documentos de Mongo
def format_mongo_document(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])  # Convertimos _id a id
    del doc["_id"]               # Eliminamos el campo original
    return doc

# Crear proyecto
@router.post("/")
def create_project(project: Project):
    new_project = project.dict()
    result = db.projects.insert_one(new_project)
    return {"id": str(result.inserted_id)}

# Listar proyectos (SIEMPRE formateados)
@router.get("/")
def get_projects():
    projects = list(db.projects.find())
    return [format_mongo_document(p) for p in projects]

# Actualizar proyecto
@router.put("/{project_id}")
def update_project(project_id: str, updated_data: dict = Body(...)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    result = db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": updated_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return {"message": "Proyecto actualizado"}

# Eliminar proyecto
@router.delete("/{project_id}")
def delete_project(project_id: str):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    result = db.projects.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return {"message": "Proyecto eliminado"}

# Listar solo flujos de un proyecto
@router.get("/{project_id}/flows")
def get_project_flows(project_id: str = Path(...)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID de proyecto inválido")
    
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    flows = [format_mongo_document(flow) for flow in db.flows.find({"project_id": project_id})]
    return flows

# Obtener proyecto con sus flujos
@router.get("/{project_id}/full")
def get_project_with_flows(project_id: str):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="ID inválido")
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    project = format_mongo_document(project)
    flows = [format_mongo_document(f) for f in db.flows.find({"project_id": project_id})]
    project["flows"] = flows
    return project
