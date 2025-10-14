"""
Flows Router - API endpoints for flow management within projects

This module handles flow operations nested under projects.
Flows are now managed as part of projects with proper relationships.
"""

from fastapi import APIRouter, HTTPException, Body, Path, status
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List
from app.config import db
from app.repository import ProjectRepository, FlowRepository
from app.schemas import FlowCreate, FlowUpdate, WorkflowNode
from app.utils import create_success_response
import logging

logger = logging.getLogger(__name__)

# Initialize repositories
project_repo = ProjectRepository(db.projects)
flow_repo = FlowRepository(db.flows)

# Create router - flows are nested under projects
router = APIRouter(tags=["Flows"])


@router.post("/projects/{project_id}/flows/", status_code=status.HTTP_201_CREATED)
def create_flow(project_id: str, flow: FlowCreate):
    """
    Create a new flow within a project
    
    Args:
        project_id: Project ID
        flow: Flow data
        
    Returns:
        Created flow with ID
        
    Raises:
        HTTPException: If project not found or creation fails
    """
    try:
        # Verify project exists
        project = project_repo.find_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        # Prepare flow data
        flow_data = flow.dict()
        flow_data["project_id"] = project_id
        flow_data["created_at"] = datetime.utcnow()
        
        # Create flow
        flow_id = flow_repo.create(flow_data)
        logger.info(f"Created flow {flow_id} for project {project_id}")
        
        # Return created flow
        created_flow = flow_repo.find_by_id(flow_id)
        return created_flow
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating flow for project {project_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear el flujo"
        )


@router.get("/projects/{project_id}/flows/{flow_id}")
def get_flow(project_id: str, flow_id: str):
    """
    Get a specific flow
    
    Args:
        project_id: Project ID
        flow_id: Flow ID
        
    Returns:
        Flow data
        
    Raises:
        HTTPException: If flow not found or doesn't belong to project
    """
    try:
        flow = flow_repo.find_by_id(flow_id)
        
        if not flow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        # Verify flow belongs to project
        if flow.get("project_id") != project_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El flujo no pertenece a este proyecto"
            )
        
        logger.info(f"Retrieved flow {flow_id} from project {project_id}")
        return flow
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el flujo"
        )


@router.patch("/projects/{project_id}/flows/{flow_id}")
def update_flow(project_id: str, flow_id: str, flow_update: FlowUpdate):
    """
    Update a flow
    
    Args:
        project_id: Project ID
        flow_id: Flow ID
        flow_update: Fields to update
        
    Returns:
        Updated flow
        
    Raises:
        HTTPException: If flow not found or update fails
    """
    try:
        # Verify flow exists and belongs to project
        flow = flow_repo.find_by_id(flow_id)
        if not flow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        if flow.get("project_id") != project_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El flujo no pertenece a este proyecto"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in flow_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay datos para actualizar"
            )
        
        # Add updated_at timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # Update flow
        updated = flow_repo.update(flow_id, update_data)
        
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        logger.info(f"Updated flow {flow_id} in project {project_id}")
        
        # Return updated flow
        updated_flow = flow_repo.find_by_id(flow_id)
        return updated_flow
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar el flujo"
        )


@router.delete("/projects/{project_id}/flows/{flow_id}")
def delete_flow(project_id: str, flow_id: str):
    """
    Delete a flow
    
    Args:
        project_id: Project ID
        flow_id: Flow ID
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If flow not found or deletion fails
    """
    try:
        # Verify flow exists and belongs to project
        flow = flow_repo.find_by_id(flow_id)
        if not flow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        if flow.get("project_id") != project_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El flujo no pertenece a este proyecto"
            )
        
        # Delete flow
        deleted = flow_repo.delete(flow_id)
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        logger.info(f"Deleted flow {flow_id} from project {project_id}")
        return create_success_response("Flujo eliminado exitosamente")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar el flujo"
        )


@router.post("/projects/{project_id}/flows/{flow_id}/duplicate")
def duplicate_flow(project_id: str, flow_id: str):
    """
    Duplicate a flow within the same project
    
    Args:
        project_id: Project ID
        flow_id: Flow ID to duplicate
        
    Returns:
        Duplicated flow
        
    Raises:
        HTTPException: If flow not found or duplication fails
    """
    try:
        # Get original flow
        flow = flow_repo.find_by_id(flow_id)
        if not flow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Flujo no encontrado"
            )
        
        if flow.get("project_id") != project_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El flujo no pertenece a este proyecto"
            )
        
        # Prepare duplicated flow data
        duplicated_data = {
            "name": f"{flow['name']} (copia)",
            "project_id": project_id,
            "nodes": flow.get("nodes", []),
            "created_at": datetime.utcnow()
        }
        
        # Create duplicated flow
        new_flow_id = flow_repo.create(duplicated_data)
        logger.info(f"Duplicated flow {flow_id} as {new_flow_id}")
        
        # Return duplicated flow
        duplicated_flow = flow_repo.find_by_id(new_flow_id)
        return duplicated_flow
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error duplicating flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al duplicar el flujo"
        )
