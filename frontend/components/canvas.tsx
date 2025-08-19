import CanvasToolbar from "@/components/canvas-toolbar";
import { FullProject } from "@/lib/api";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection, Node, Viewport, Background, Controls } from '@xyflow/react';
import { SetStateAction, useCallback, useEffect, useState } from "react";
import DefaultNode from "./default-node";

type CanvasProps = {
  workflow?: FullProject | null;
  nodes: Node[];
  onNodeChange: (node: SetStateAction<Node[]>) => void;
};

function NoWorkspaceAvailable() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full">
      <h2 className="font-bold">No ha seleccionado ningún flujo de trabajo</h2>
      <p>Crea un flujo desde panel izquierdo o selecciona uno disponible</p>
    </div>
  );
}

const nodeTypes = {
  defaultNode: DefaultNode
};

export default function Canvas({ workflow, nodes, onNodeChange }: CanvasProps) {
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes: NodeChange<Node>[]) => onNodeChange((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), []);
  const onEdgesChange = useCallback((changes: EdgeChange<never>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), []);
  const onConnect = useCallback((params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const onAddNode = () => {
    onNodeChange(prev => {
      const n = prev.length - 1;
      return [
        ...prev,
        {
          id: `node-${n}`,
          position: { x: 0, y: 0 },
          type: "defaultNode",
          data: { label: `Nodo ${n}` }
        }
      ];
    });
  };

  useEffect(() =>{
    if (workflow) {
      onNodeChange(workflow.flows[0].nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: {
          label: node.content
        },
        position: { x: 0, y: 0 }
      })));
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      { !!workflow && <CanvasToolbar onAddNode={onAddNode} /> }
      <ReactFlow
        hidden={!workflow}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onViewportChange={(v) => console.log(v)}
      >
        <Background />
        <Controls />
      </ReactFlow>
      { !workflow && <NoWorkspaceAvailable /> }
    </div>
  );
}