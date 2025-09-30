from enum import Enum
from datetime import datetime
from pydantic import BaseModel

class NodeType(str, Enum):
    message = "message"
    input = "input"
    decision = "decision"
    tool = "tool"

class BaseDBModel(BaseModel):
    id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
        
    }
