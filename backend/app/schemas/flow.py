from typing import Any, Dict, List
from pydantic import BaseModel, Field, field_validator
from .common import BaseDBModel, NodeType

class Node(BaseModel):
    id: str
    type: NodeType
    data: Dict[str, Any] = {}
    next: List[str] = []

class FlowCreate(BaseModel):
    project_id: str = Field(min_length=1)
    name: str = Field(min_length=1, max_length=80)
    nodes: List[Node] = []
    start: str | None = None
    metadata: Dict[str, Any] = {}

    @field_validator("start")
    @classmethod
    def check_start(cls, v, info):
        values = info.data
        nodes = values.get("nodes", [])
        if nodes:
            node_ids = {n.id for n in nodes}
            if not v or v not in node_ids:
                raise ValueError("start debe ser un nodo existente")
        return v

class FlowDB(BaseDBModel):
    project_id: str
    name: str
    nodes: List[Node]
    start: str | None = None
    metadata: Dict[str, Any] = {}
    owner_id: str | None = None
