from pydantic import BaseModel, Field
from .common import BaseDBModel

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    description: str | None = Field(default=None, max_length=300)

class ProjectDB(BaseDBModel):
    name: str
    description: str | None = None
    owner_id: str | None = None
