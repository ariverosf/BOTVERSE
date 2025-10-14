"""
Flow Executor - Executes workflow flows and returns simulation results

This module handles the execution of workflow flows, processing nodes in sequence
and generating execution results.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
import json
from enum import Enum

logger = logging.getLogger(__name__)


class NodeExecutionStatus(str, Enum):
    """Node execution status"""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    ERROR = "error"
    SKIPPED = "skipped"


class NodeExecutionResult:
    """Result of executing a single node"""
    
    def __init__(
        self,
        node_id: str,
        node_type: str,
        status: NodeExecutionStatus,
        output: Optional[str] = None,
        error: Optional[str] = None,
        execution_time_ms: Optional[int] = None,
        timestamp: Optional[datetime] = None
    ):
        self.node_id = node_id
        self.node_type = node_type
        self.status = status
        self.output = output
        self.error = error
        self.execution_time_ms = execution_time_ms
        self.timestamp = timestamp or datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "node_id": self.node_id,
            "node_type": self.node_type,
            "status": self.status.value,
            "output": self.output,
            "error": self.error,
            "execution_time_ms": self.execution_time_ms,
            "timestamp": self.timestamp.isoformat(),
        }


class FlowExecutionResult:
    """Result of executing an entire flow"""
    
    def __init__(
        self,
        flow_id: str,
        flow_name: str,
        status: str,
        node_results: List[NodeExecutionResult],
        total_execution_time_ms: int,
        started_at: datetime,
        completed_at: datetime,
        error: Optional[str] = None
    ):
        self.flow_id = flow_id
        self.flow_name = flow_name
        self.status = status
        self.node_results = node_results
        self.total_execution_time_ms = total_execution_time_ms
        self.started_at = started_at
        self.completed_at = completed_at
        self.error = error
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "flow_id": self.flow_id,
            "flow_name": self.flow_name,
            "status": self.status,
            "node_results": [result.to_dict() for result in self.node_results],
            "total_execution_time_ms": self.total_execution_time_ms,
            "total_nodes": len(self.node_results),
            "successful_nodes": sum(1 for r in self.node_results if r.status == NodeExecutionStatus.SUCCESS),
            "failed_nodes": sum(1 for r in self.node_results if r.status == NodeExecutionStatus.ERROR),
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat(),
            "error": self.error,
        }


class FlowExecutor:
    """Executes workflow flows and returns results"""
    
    def __init__(self):
        self.execution_history: List[FlowExecutionResult] = []
    
    def execute_node(self, node: Dict[str, Any]) -> NodeExecutionResult:
        """
        Execute a single node and return result
        
        Args:
            node: Node data including id, type, content, data
            
        Returns:
            NodeExecutionResult with execution details
        """
        start_time = datetime.utcnow()
        node_id = node.get("id", "unknown")
        node_type = node.get("type", "unknown")
        node_content = node.get("content", "")
        
        try:
            # Simulate node execution based on type
            output = self._simulate_node_execution(node_type, node_content, node.get("data", {}))
            
            end_time = datetime.utcnow()
            execution_time = int((end_time - start_time).total_seconds() * 1000)
            
            logger.info(f"Executed node {node_id} ({node_type}) successfully in {execution_time}ms")
            
            return NodeExecutionResult(
                node_id=node_id,
                node_type=node_type,
                status=NodeExecutionStatus.SUCCESS,
                output=output,
                execution_time_ms=execution_time,
                timestamp=start_time
            )
            
        except Exception as e:
            end_time = datetime.utcnow()
            execution_time = int((end_time - start_time).total_seconds() * 1000)
            
            logger.error(f"Error executing node {node_id}: {e}")
            
            return NodeExecutionResult(
                node_id=node_id,
                node_type=node_type,
                status=NodeExecutionStatus.ERROR,
                error=str(e),
                execution_time_ms=execution_time,
                timestamp=start_time
            )
    
    def _simulate_node_execution(self, node_type: str, content: str, data: Dict[str, Any]) -> str:
        """
        Simulate node execution and return output
        
        This is a simulation - in production, this would call actual services/APIs
        """
        
        # Get actions from node data
        actions = data.get("actions", [])
        
        outputs = []
        
        # Handle different node types
        if node_type == "start":
            return f"✅ Flow iniciado: {content or 'Inicio del flujo'}"
        
        elif node_type == "end":
            return f"✅ Flow completado: {content or 'Fin del flujo'}"
        
        elif node_type == "defaultNode":
            # Process each action in the node
            if actions:
                # Return actions in JSON format for frontend parsing
                return json.dumps({
                    "actions": actions,
                    "node_content": content,
                    "node_type": node_type
                })
            else:
                return f"✅ Nodo ejecutado: {content or 'Nodo sin acciones'}"
        
        elif node_type == "action":
            if actions:
                # Return actions in JSON format for frontend parsing
                return json.dumps({
                    "actions": actions,
                    "node_content": content,
                    "node_type": node_type
                })
            return f"✅ Acción ejecutada: {content}"
        
        elif node_type == "condition":
            return f"🔀 Condición evaluada: {content or 'Condición sin definir'}"
        
        elif node_type == "response":
            return f"💬 Respuesta generada: {content or 'Respuesta sin definir'}"
        
        else:
            return f"✅ Nodo procesado ({node_type}): {content}"
    
    def _simulate_action(self, action_type: str, action_label: str, content: str) -> str:
        """Simulate a specific action execution"""
        
        action_outputs = {
            "send-text": f"📨 Texto enviado: {content or 'Mensaje de texto'}",
            "send-video": f"🎥 Video enviado: {content or 'video.mp4'}",
            "send-audio": f"🎵 Audio enviado: {content or 'audio.mp3'}",
            "send-image": f"🖼️ Imagen enviada: {content or 'image.jpg'}",
            "send-file": f"📎 Archivo enviado: {content or 'documento.pdf'}",
            "send-location": f"📍 Ubicación enviada: {content or 'Ubicación actual'}",
            "execute-code": f"💻 Código ejecutado: {content or 'script.js'}",
            "get-record": f"📊 Registro obtenido: {content or 'ID: 12345'}",
            "insert-record": f"➕ Registro insertado: {content or 'Nuevo registro creado'}",
            "update-record": f"✏️ Registro actualizado: {content or 'Registro modificado'}",
            "delete-record": f"🗑️ Registro eliminado: {content or 'Registro borrado'}",
            "find-record": f"🔍 Registro encontrado: {content or 'Búsqueda completada'}",
            "ai-task": f"🤖 Tarea IA ejecutada: {content or 'Procesamiento completado'}",
            "ai-generate-text": f"✍️ Texto IA generado: {content or 'Texto generado por IA'}",
            "get-user-data": f"👤 Datos de usuario obtenidos: {content or 'Usuario: John Doe'}",
        }
        
        return action_outputs.get(action_type, f"✅ {action_label}: {content or 'Ejecutado'}")
    
    def _execute_flow_with_connections(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[NodeExecutionResult]:
        """
        Execute flow following connections from start to end nodes
        
        Args:
            nodes: List of nodes in the flow
            edges: List of connections between nodes
            
        Returns:
            List of NodeExecutionResult in execution order
        """
        node_results = []
        executed_nodes = set()
        
        # Create node lookup
        node_map = {node["id"]: node for node in nodes}
        
        # Create edge lookup (source -> target)
        edge_map = {}
        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")
            if source and target:
                if source not in edge_map:
                    edge_map[source] = []
                edge_map[source].append(target)
        
        # Find start nodes
        start_nodes = [node for node in nodes if node.get("type") == "start"]
        
        if not start_nodes:
            logger.error("No start nodes found in flow")
            return node_results
        
        # Execute from each start node
        for start_node in start_nodes:
            if start_node["id"] not in executed_nodes:
                self._execute_node_path(start_node["id"], node_map, edge_map, executed_nodes, node_results)
        
        return node_results
    
    def _execute_node_path(self, node_id: str, node_map: Dict[str, Dict], edge_map: Dict[str, List[str]], 
                          executed_nodes: set, node_results: List[NodeExecutionResult]):
        """
        Recursively execute nodes following the path from the given node
        
        Args:
            node_id: ID of the current node to execute
            node_map: Dictionary mapping node IDs to node data
            edge_map: Dictionary mapping source nodes to target nodes
            executed_nodes: Set of already executed node IDs
            node_results: List to append execution results
        """
        if node_id in executed_nodes:
            return  # Avoid infinite loops
        
        executed_nodes.add(node_id)
        
        if node_id not in node_map:
            logger.error(f"Node {node_id} not found in node map")
            return
        
        node = node_map[node_id]
        
        # Execute the current node
        result = self.execute_node(node)
        node_results.append(result)
        
        logger.info(f"Executed node {node_id} ({node.get('type', 'unknown')}) with status {result.status}")
        
        # If node executed successfully, continue to connected nodes
        if result.status == NodeExecutionStatus.SUCCESS and node_id in edge_map:
            for target_id in edge_map[node_id]:
                if target_id in node_map:
                    self._execute_node_path(target_id, node_map, edge_map, executed_nodes, node_results)
    
    def execute_flow(self, flow: Dict[str, Any]) -> FlowExecutionResult:
        """
        Execute an entire flow following connections from start to end
        
        Args:
            flow: Flow data with nodes and connections
            
        Returns:
            FlowExecutionResult with all execution details
        """
        flow_id = flow.get("id", "unknown")
        flow_name = flow.get("name", "Unnamed Flow")
        nodes = flow.get("nodes", [])
        edges = flow.get("edges", [])
        
        started_at = datetime.utcnow()
        node_results = []
        overall_status = "success"
        error_message = None
        
        logger.info(f"Starting execution of flow {flow_id} with {len(nodes)} nodes")
        
        try:
            # Validate flow has start and end nodes
            start_nodes = [n for n in nodes if n.get("type") == "start"]
            end_nodes = [n for n in nodes if n.get("type") == "end"]
            
            if not start_nodes:
                overall_status = "error"
                error_message = "Flow must have at least one start node"
                logger.error("Flow execution failed: No start node found")
            elif not end_nodes:
                overall_status = "error"
                error_message = "Flow must have at least one end node"
                logger.error("Flow execution failed: No end node found")
            else:
                # Execute flow following connections
                node_results = self._execute_flow_with_connections(nodes, edges)
                
                # Check if any node failed
                for result in node_results:
                    if result.status == NodeExecutionStatus.ERROR:
                        overall_status = "failed"
                        if not error_message:
                            error_message = f"Node {result.node_id} failed: {result.error}"
                        break
            
            if len(nodes) == 0:
                overall_status = "empty"
                error_message = "No nodes to execute"
                
        except Exception as e:
            logger.error(f"Error executing flow {flow_id}: {e}")
            overall_status = "error"
            error_message = str(e)
        
        completed_at = datetime.utcnow()
        total_time = int((completed_at - started_at).total_seconds() * 1000)
        
        execution_result = FlowExecutionResult(
            flow_id=flow_id,
            flow_name=flow_name,
            status=overall_status,
            node_results=node_results,
            total_execution_time_ms=total_time,
            started_at=started_at,
            completed_at=completed_at,
            error=error_message
        )
        
        # Store in history
        self.execution_history.append(execution_result)
        
        logger.info(
            f"Completed execution of flow {flow_id}: "
            f"{overall_status} in {total_time}ms, "
            f"{len(node_results)} nodes executed"
        )
        
        return execution_result
    
    def get_execution_history(self, limit: int = 10) -> List[FlowExecutionResult]:
        """
        Get recent execution history
        
        Args:
            limit: Maximum number of results to return
            
        Returns:
            List of recent FlowExecutionResults
        """
        return self.execution_history[-limit:]


# Global executor instance
flow_executor = FlowExecutor()

