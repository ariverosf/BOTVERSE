"use client"

import { useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Edge, ReactFlowProvider, FinalConnectionState, useReactFlow, Node, useUpdateNodeInternals } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from './start-node';
import EndNode from './end-node';
import { useWorkflowStore } from '@/store/workflowStore';
import ActionNode from './action-node';

const nodeTypes = { StartNode, EndNode, ActionNode };

export default function FlowCanvas() {
  const { canvasEdges, canvasNodes, setEdges, setNodes, setSelectedNode, closeActionMenu } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => {
      console.log("onEdgesChange", changes);
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
    },
    [],
  );
  const onConnect = useCallback(
    (params: any) => {
      console.log("onConnect", params);
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = crypto.randomUUID();
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode: Node = {
          id,
          type: "ActionNode",
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { id, label: `Nodo` },
          origin: [0.5, 0.0],
        };

        console.log(connectionState);
 
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) =>
          [...eds, { id, source: connectionState!.fromNode!.id, sourceHandle: connectionState?.fromHandle?.id, targetHandle: undefined, target: id }],
        );
      }
    },
    [screenToFlowPosition],
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }

  const onPaneClick = (event: React.MouseEvent) => {
    closeActionMenu();
    setSelectedNode(null);
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={canvasNodes}
        edges={canvasEdges}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}