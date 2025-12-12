from pydantic import BaseModel

class SimulateFlowRequest(BaseModel):
    value: str
    node_id: str