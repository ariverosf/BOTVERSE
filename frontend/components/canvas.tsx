import CanvasToolbar from "@/components/canvas-toolbar";
import { FullWorkflowProject } from "@/lib/types";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection, Node, Background, Controls, Edge } from '@xyflow/react';
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import DefaultNode from "./default-node";

type CanvasProps = {
  workflow?: FullWorkflowProject | null;
  nodes: Node[];
  edges?: Edge[];
  onNodeChange: (workflowId: string, nodes: Node[]) => void;
  onAddNode?: (position?: { x: number; y: number }, connectionInfo?: { sourceNodeId: string; sourceHandle: string }) => void;
  onNodeUpdate?: (nodeId: string, updates: Record<string, unknown>) => void;
  onTestFlow?: () => void;
  onEdgesChange?: (edges: Edge[]) => void;
};

// Empty state component
function NoWorkspaceAvailable() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full">
      <h2 className="font-bold">No ha seleccionado ningún flujo de trabajo</h2>
      <p>Crea un flujo desde panel izquierdo o selecciona uno disponible</p>
    </div>
  );
}

// Default node types configuration
const defaultNodeTypes = {
  defaultNode: DefaultNode
};

// Canvas component with improved error handling and performance
export default function Canvas({ workflow, nodes, edges = [], onNodeChange, onAddNode, onTestFlow, onEdgesChange }: CanvasProps) {

  // Use ref to access current nodes without dependency
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // Fixed node change handler to prevent ResizeObserver issues
  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      if (!workflow) return;
      const updatedNodes = applyNodeChanges(changes, nodesRef.current);
      onNodeChange(workflow.id, updatedNodes);
    },
    [onNodeChange, workflow] // No nodes dependency
  );

  // Handle node click to select
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (!workflow) return;
    // Deselect all nodes first
    const updatedNodes = nodesRef.current.map(n => ({ ...n, selected: false }));
    // Select the clicked node
    const nodeToSelect = updatedNodes.find(n => n.id === node.id);
    if (nodeToSelect) {
      nodeToSelect.selected = true;
    }
    onNodeChange(workflow.id, updatedNodes);
  }, [onNodeChange, workflow]); // No nodes dependency

  const onEdgesChangeCallback = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      onEdgesChange?.(updatedEdges);
    },
    [edges, onEdgesChange]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: params.source!,
        sourceHandle: params.sourceHandle || 'source',
        target: params.target!,
        targetHandle: params.targetHandle || 'target',
        type: 'default',
      };
      const updatedEdges = addEdge(newEdge, edges);
      onEdgesChange?.(updatedEdges);
    },
    [edges, onEdgesChange]
  );

  // Handle adding new nodes from toolbar
  const handleAddNode = useCallback(() => {
    if (onAddNode) {
      onAddNode();
    }
  }, [onAddNode]);

  // Handle drag and drop to create new nodes
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    // Create a new node at the drop position
    if (onAddNode) {
      onAddNode(position);
    }
  }, [onAddNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const [connectionStart, setConnectionStart] = useState<{ nodeId: string; handleId: string } | null>(null);

  // Handle connection creation with automatic node creation
  const onConnectStart = useCallback((event: MouseEvent | TouchEvent, params: { nodeId: string | null; handleId: string | null }) => {
    if (params.nodeId && params.handleId) {
      // Store the source node and handle for connection
      setConnectionStart({ nodeId: params.nodeId, handleId: params.handleId });
    }
  }, []);


  // Handle mouse up events to create nodes when dragging to empty areas
  const onMouseUp = useCallback((event: MouseEvent) => {
    if (!connectionStart) return;

    // Check if we're over the ReactFlow canvas
    const reactFlowElement = (event.target as Element).closest('.react-flow');
    if (!reactFlowElement) {
      setConnectionStart(null);
      return;
    }

    // Check if we're over a node (if so, don't create a new node)
    const nodeElement = (event.target as Element).closest('.react-flow__node');
    if (nodeElement) {
      // We're over a node, so a connection should be made instead of creating a new node
      setConnectionStart(null);
      return;
    }

    const reactFlowBounds = reactFlowElement.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    // Create a new node at the drop position only if we're over empty space
    if (onAddNode) {
      // Create the new node with connection information
      onAddNode(position, {
        sourceNodeId: connectionStart.nodeId,
        sourceHandle: connectionStart.handleId
      });
    }

    setConnectionStart(null);
  }, [connectionStart, onAddNode]);

  // Add mouse up event listener
  useEffect(() => {
    if (connectionStart) {
      document.addEventListener('mouseup', onMouseUp);
      return () => document.removeEventListener('mouseup', onMouseUp);
    }
  }, [connectionStart, onMouseUp]);

  // Auto-connect new nodes to the last node (but not start/end nodes)
  // Only run when nodes are added, not when edges change
  useEffect(() => {
    if (nodes.length > 1) {
      const lastNode = nodes[nodes.length - 1];
      const previousNode = nodes[nodes.length - 2];
      
      // Don't auto-connect start and end nodes
      const isStartNode = lastNode.data?.isStartNode || lastNode.id === 'start';
      const isEndNode = lastNode.data?.isEndNode || lastNode.id === 'end';
      const isPreviousStartNode = previousNode.data?.isStartNode || previousNode.id === 'start';
      const isPreviousEndNode = previousNode.data?.isEndNode || previousNode.id === 'end';
      
      // Skip auto-connection if either node is start or end
      if (isStartNode || isEndNode || isPreviousStartNode || isPreviousEndNode) {
        return;
      }
      
      // Check if edge already exists
      const edgeExists = edges.some(
        edge => edge.source === previousNode.id && edge.target === lastNode.id
      );
      
      if (!edgeExists) {
        const newEdge: Edge = {
          id: `edge-${previousNode.id}-${lastNode.id}`,
          source: previousNode.id,
          sourceHandle: 'source',
          target: lastNode.id,
          targetHandle: 'target',
          type: 'default',
        };
        onEdgesChange?.([...edges, newEdge]);
      }
    }
  }, [nodes.length, edges, onEdgesChange]); // Depend on edges and onEdgesChange for auto-connection


  // Use the default node types
  const nodeTypes = defaultNodeTypes;

  const reactFlowProps = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange: onEdgesChangeCallback,
      onConnect,
      onConnectStart,
      onNodeClick,
      onDrop,
      onDragOver,
      nodeTypes,
      fitView: false,
      minZoom: 0.1,
      maxZoom: 4,
      // Prevent ResizeObserver issues
      onlyRenderVisibleElements: false,
      nodesDraggable: true,
      nodesConnectable: true,
      elementsSelectable: true,
    }),
    [edges, onNodesChange, onEdgesChangeCallback, onConnect, onConnectStart, onNodeClick, onDrop, onDragOver, nodeTypes] // Remove nodes dependency
  );

  return (
    <div className="flex-1 flex flex-col">
      {workflow ? (
        <>
          <CanvasToolbar onAddNode={handleAddNode} onTestFlow={onTestFlow} />
          <div className="flex-1 relative">
            <ReactFlow {...reactFlowProps} className="bg-gray-50">
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </>
      ) : (
        <NoWorkspaceAvailable />
      )}
    </div>
  );
}
