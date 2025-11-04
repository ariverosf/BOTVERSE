from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class NodeType(str, Enum):
    message = "message"
    input = "input"
    decision = "decision"
    tool = "tool"

class BaseDBModel(BaseModel):
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
        
    }
