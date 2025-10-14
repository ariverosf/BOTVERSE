"""
Projects Router - API endpoints for project management

This module handles all project-related operations including CRUD operations
and flow associations.
"""

from fastapi import APIRouter, HTTPException, Body, Path, status
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from app.config import db
from app.repository import ProjectRepository, FlowRepository
from app.utils import create_success_response
import logging

logger = logging.getLogger(__name__)

# Initialize repositories
project_repo = ProjectRepository(db.projects)
flow_repo = FlowRepository(db.flows)

# Pydantic models for request/response validation
class ProjectCreate(BaseModel):
    """Model for creating a new project"""
    name: str = Field(..., min_length=1, max_length=100, description="Project name")
    description: Optional[str] = Field(None, max_length=500, description="Project description")
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Project name cannot be empty')
        return v.strip()


class ProjectUpdate(BaseModel):
    """Model for updating a project"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError('Project name cannot be empty')
        return v.strip() if v else v


class ProjectResponse(BaseModel):
    """Model for project response"""
    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime


# Initialize router
router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate):
    """
    Create a new project
    
    Args:
        project: Project data
        
    Returns:
        Created project with ID
        
    Raises:
        HTTPException: If creation fails
    """
    try:
        project_data = project.dict()
        project_data["created_at"] = datetime.utcnow()
        
        project_id = project_repo.create(project_data)
        logger.info(f"Created project: {project_id}")
        
        return {"id": project_id}
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el proyecto"
        )


@router.get("/", response_model=List[dict])
def get_projects():
    """
    Get all projects with their flows
    
    Returns:
        List of projects with associated flows
    """
    try:
        projects = project_repo.find_all()
        
        # Add flows to each project
        for project in projects:
            flows = flow_repo.find_by_project(project["id"])
            project["flows"] = flows
        
        logger.info(f"Retrieved {len(projects)} projects")
        return projects
    except Exception as e:
        logger.error(f"Error retrieving projects: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener los proyectos"
        )


@router.get("/{project_id}")
def get_project(project_id: str):
    """
    Get a specific project with its flows
    
    Args:
        project_id: Project ID
        
    Returns:
        Project with flows
        
    Raises:
        HTTPException: If project not found
    """
    try:
        project = project_repo.find_with_flows(project_id, db.flows)
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        logger.info(f"Retrieved project: {project_id}")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el proyecto"
        )


@router.patch("/{project_id}")
def update_project(project_id: str, project_update: ProjectUpdate):
    """
    Update a project
    
    Args:
        project_id: Project ID
        project_update: Fields to update
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If project not found or update fails
    """
    try:
        # Only include non-None fields in update
        update_data = {k: v for k, v in project_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay datos para actualizar"
            )
        
        updated = project_repo.update(project_id, update_data)
        
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        logger.info(f"Updated project: {project_id}")
        return create_success_response("Proyecto actualizado")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el proyecto"
        )


@router.delete("/{project_id}")
def delete_project(project_id: str):
    """
    Delete a project and all its flows
    
    Args:
        project_id: Project ID
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If project not found or deletion fails
    """
    try:
        # Delete associated flows first
        deleted_flows = flow_repo.delete_by_project(project_id)
        logger.info(f"Deleted {deleted_flows} flows for project {project_id}")
        
        # Delete project
        deleted = project_repo.delete(project_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        logger.info(f"Deleted project: {project_id}")
        return create_success_response(
            f"Proyecto eliminado junto con {deleted_flows} flujo(s)"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el proyecto"
        )


@router.get("/{project_id}/flows")
def get_project_flows(project_id: str = Path(..., description="Project ID")):
    """
    Get all flows for a specific project
    
    Args:
        project_id: Project ID
        
    Returns:
        List of flows
        
    Raises:
        HTTPException: If project not found
    """
    try:
        # Verify project exists
        project = project_repo.find_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        flows = flow_repo.find_by_project(project_id)
        logger.info(f"Retrieved {len(flows)} flows for project {project_id}")
        
        return flows
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving flows for project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener los flujos"
        )
