from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Node(BaseModel):
    id: str
    type: str
    content: str
    connections: List[str] = []

class Flow(BaseModel):
    name: str
    project_id: str = None
    nodes: List[Node]
    created_at: datetime = datetime.utcnow()
