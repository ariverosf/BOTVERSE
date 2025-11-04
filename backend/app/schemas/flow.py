from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator
from .common import BaseDBModel, NodeType

class Position(BaseModel):
    x: float
    y: float

class Node(BaseModel):
    id: str
    type: str
    position: Position
    data: Dict[str, Any] = {}

class FlowCreate(BaseModel):
    project_id: str = Field(min_length=1)
    name: str = Field(min_length=1, max_length=80)
    nodes: List[Node] = []
    metadata: Dict[str, Any] = {}

class FlowDB(BaseDBModel):
    project_id: str
    name: str
    nodes: List[Node]
    metadata: Dict[str, Any] = {}
    owner_id: Optional[str] = None
