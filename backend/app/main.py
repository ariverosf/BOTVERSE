from fastapi import FastAPI
from app.config import db
from app.schemas import Flow
from bson import ObjectId
from fastapi import Body
from fastapi import HTTPException
from app.routers import projects
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app = FastAPI(title="BotVerse API")
# Agregar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
 )

app.include_router(projects.router)

@app.get("/")
def root():
    return {"message": "BotVerse API funcionando"}

@app.post("/flows/")
def create_flow(flow: Flow):
    new_flow = flow.dict()
    result = db.flows.insert_one(new_flow)
    return {"id": str(result.inserted_id)}
@app.get("/flows/")
def get_flows():
    flows = []
    for flow in db.flows.find():
        flow["_id"] = str(flow["_id"])  # Convertir ObjectId a string
        flows.append(flow)
    return flows
from fastapi import HTTPException

@app.get("/flows/{flow_id}")
def get_flow(flow_id: str):
    print(f"Recibí el ID: {flow_id}")  # Esto muestra en la terminal lo que llega
    try:
        obj_id = ObjectId(flow_id)
    except Exception as e:
        print(f"Error al convertir a ObjectId: {e}")  # Mensaje detallado en consola
        raise HTTPException(status_code=400, detail="ID inválido")
    
    flow = db.flows.find_one({"_id": obj_id})
    if not flow:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    flow["_id"] = str(flow["_id"])
    return flow


@app.delete("/flows/{flow_id}")
def delete_flow(flow_id: str):
    result = db.flows.delete_one({"_id": ObjectId(flow_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return {"message": "Flujo eliminado"}

@app.put("/flows/{flow_id}")
def update_flow(flow_id: str, updated_data: dict = Body(...)):
    result = db.flows.update_one(
        {"_id": ObjectId(flow_id)},
        {"$set": updated_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Flujo no encontrado")
    return {"message": "Flujo actualizado"}
