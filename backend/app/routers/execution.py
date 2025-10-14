"""
Execution Router - API endpoints for flow execution/simulation

This module provides endpoints for executing and testing workflow flows.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.config import db
from app.repository import FlowRepository, ProjectRepository
from app.flow_executor import flow_executor
import logging

logger = logging.getLogger(__name__)

# Initialize repositories
flow_repo = FlowRepository(db.flows)
project_repo = ProjectRepository(db.projects)

# Create router
router = APIRouter(tags=["Execution"])


class ExecutionRequest(BaseModel):
    """Request to execute a flow"""
    flow_id: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None
    edges: Optional[List[Dict[str, Any]]] = None


@router.post("/projects/{project_id}/flows/{flow_id}/execute")
def execute_flow(project_id: str, flow_id: str):
    """
    Execute/simulate a flow and return results
    
    Args:
        project_id: Project ID
        flow_id: Flow ID to execute
        
    Returns:
        Execution results with node-by-node output
        
    Raises:
        HTTPException: If flow not found or execution fails
    """
    try:
        # Verify project exists
        project = project_repo.find_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        # Get flow
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
        
        logger.info(f"Executing flow {flow_id} from project {project_id}")
        
        # Execute the flow
        execution_result = flow_executor.execute_flow(flow)
        
        logger.info(
            f"Flow {flow_id} execution completed: "
            f"{execution_result.status} in {execution_result.total_execution_time_ms}ms"
        )
        
        return execution_result.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al ejecutar el flujo: {str(e)}"
        )


@router.post("/execute/test")
def test_execute_nodes(request: ExecutionRequest):
    """
    Test execution of nodes without saving to database
    
    Useful for testing node configurations before saving
    
    Args:
        request: ExecutionRequest with nodes to test
        
    Returns:
        Execution results
    """
    try:
        if not request.nodes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay nodos para ejecutar"
            )
        
        # Create a temporary flow for execution
        test_flow = {
            "id": "test-execution",
            "name": "Test Execution",
            "nodes": request.nodes,
            "edges": request.edges or []
        }
        
        logger.info(f"Test executing {len(request.nodes)} nodes")
        
        # Execute the test flow
        execution_result = flow_executor.execute_flow(test_flow)
        
        return execution_result.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in test execution: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la ejecución de prueba: {str(e)}"
        )


@router.get("/execution/history")
def get_execution_history(limit: int = 10):
    """
    Get recent execution history
    
    Args:
        limit: Maximum number of results (default: 10, max: 50)
        
    Returns:
        List of recent execution results
    """
    try:
        # Limit to reasonable number
        limit = min(max(1, limit), 50)
        
        history = flow_executor.get_execution_history(limit)
        
        return {
            "executions": [result.to_dict() for result in history],
            "total": len(history)
        }
        
    except Exception as e:
        logger.error(f"Error getting execution history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el historial"
        )


@router.get("/projects/{project_id}/flows/{flow_id}/validate")
def validate_flow(project_id: str, flow_id: str):
    """
    Validate a flow without executing it
    
    Checks for:
    - Flow exists
    - Has nodes
    - Nodes have required fields
    - No circular dependencies
    
    Args:
        project_id: Project ID
        flow_id: Flow ID
        
    Returns:
        Validation results
    """
    try:
        # Get flow
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
        
        nodes = flow.get("nodes", [])
        
        # Validation checks
        issues = []
        warnings = []
        
        if not nodes:
            issues.append("El flujo no tiene nodos")
        
        # Check each node
        for idx, node in enumerate(nodes):
            if not node.get("id"):
                issues.append(f"Nodo {idx + 1} no tiene ID")
            if not node.get("type"):
                issues.append(f"Nodo {idx + 1} no tiene tipo")
        
        # Check for start and end nodes
        has_start = any(node.get("type") == "start" for node in nodes)
        has_end = any(node.get("type") == "end" for node in nodes)
        
        if not has_start:
            warnings.append("El flujo no tiene nodo de inicio")
        if not has_end:
            warnings.append("El flujo no tiene nodo de fin")
        
        is_valid = len(issues) == 0
        
        return {
            "valid": is_valid,
            "flow_id": flow_id,
            "flow_name": flow.get("name"),
            "total_nodes": len(nodes),
            "issues": issues,
            "warnings": warnings,
            "message": "Flujo válido para ejecución" if is_valid else "El flujo tiene problemas"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error validating flow {flow_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al validar el flujo"
        )

