from typing import Optional
from pydantic import BaseModel, Field
from .common import BaseDBModel

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    description: Optional[str] = Field(default=None, max_length=300)

class ProjectDB(BaseDBModel):
    name: str
    description: Optional[str] = None
    owner_id: Optional[str] = None
