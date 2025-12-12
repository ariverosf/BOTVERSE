from fastapi import APIRouter, HTTPException, Response
from bson import ObjectId
from app.config import db
from app.services.simulate import simulate_flow
from app.schemas.simulation import SimulateFlowRequest
from app.schemas.flow import FlowDB

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.post("/{flow_id}")
def simulate(flow_id: str, req: SimulateFlowRequest):
    if not ObjectId.is_valid(flow_id):
        raise HTTPException(status_code=400, detail="ID inválido")

    doc = db.flows.find_one({"_id": ObjectId(flow_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    
    flow = FlowDB(**doc)
    return simulate_flow(req.node_id, req.value, flow)