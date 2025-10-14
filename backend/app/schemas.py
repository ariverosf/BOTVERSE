"""
Pydantic schemas for data validation and serialization

This module contains all the Pydantic models used throughout the application
for request/response validation and data serialization.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime


class NodePosition(BaseModel):
    """Position coordinates for a node in the canvas"""
    x: float = Field(..., description="X coordinate")
    y: float = Field(..., description="Y coordinate")


class WorkflowNode(BaseModel):
    """Model for a workflow node"""
    id: str = Field(..., description="Unique node identifier")
    type: str = Field(..., description="Node type (start, end, action, condition, response)")
    content: str = Field("", max_length=1000, description="Node content/text")
    connections: List[str] = Field(default_factory=list, description="List of connected node IDs")
    position: Optional[NodePosition] = Field(None, description="Node position in canvas")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional node data")
    
    @validator('type')
    def validate_node_type(cls, v):
        valid_types = ['start', 'end', 'action', 'condition', 'response', 'defaultNode']
        if v not in valid_types:
            raise ValueError(f'Node type must be one of: {", ".join(valid_types)}')
        return v


class FlowCreate(BaseModel):
    """Model for creating a new flow"""
    name: str = Field(..., min_length=1, max_length=100, description="Flow name")
    project_id: Optional[str] = Field(None, description="Associated project ID")
    nodes: List[WorkflowNode] = Field(default_factory=list, description="Flow nodes")
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Flow name cannot be empty')
        return v.strip()


class FlowUpdate(BaseModel):
    """Model for updating a flow"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    nodes: Optional[List[WorkflowNode]] = None
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Flow name cannot be empty')
        return v.strip() if v else v


class FlowResponse(BaseModel):
    """Model for flow response"""
    id: str
    name: str
    project_id: Optional[str] = None
    nodes: List[WorkflowNode]
    created_at: datetime
    updated_at: Optional[datetime] = None


class ProjectStats(BaseModel):
    """Model for project statistics"""
    total_flows: int = Field(..., description="Total number of flows")
    total_nodes: int = Field(..., description="Total number of nodes across all flows")
    created_at: datetime = Field(..., description="Project creation date")


# Legacy model for backward compatibility
class Node(BaseModel):
    """Legacy node model (deprecated, use WorkflowNode instead)"""
    id: str
    type: str
    content: str
    connections: List[str] = []


class Flow(BaseModel):
    """Legacy flow model (deprecated, use FlowCreate/FlowUpdate instead)"""
    name: str
    project_id: Optional[str] = None
    nodes: List[Node]
    created_at: datetime = Field(default_factory=datetime.utcnow)
