from fastapi import APIRouter, HTTPException
from app.config import db
from bson import ObjectId
from app.utils import format_mongo_document
from app.services.rasa import generate_rasa_project
from fastapi.responses import StreamingResponse
from io import BytesIO

router = APIRouter(prefix="/bots", tags=["export"])

@router.get("/flows/{flow_id}/export", response_class=StreamingResponse)
def export_rasa(flow_id: str):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    doc = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")

    payload = format_mongo_document(doc)
    zip_file = generate_rasa_project(payload)
    print(zip_file)

    return StreamingResponse(
        BytesIO(zip_file),
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=rasa_project.zip"}
    )