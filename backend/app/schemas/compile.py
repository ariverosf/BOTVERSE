from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

TargetType = Literal["rasa"]

class CompileOptions(BaseModel):
    language: Literal["es", "en"] = "es"
    pipelinePreset: Literal["spacy", "hf", "basic"] = "basic"
    includeDemoActions: bool = True

class CompileRequest(BaseModel):
    target: TargetType = "rasa"
    options: CompileOptions = Field(default_factory=CompileOptions)
    # ahora es opcional; si no viene, se obtiene desde DB por bot_id
    diagram: Optional[Dict[str, Any]] = None
