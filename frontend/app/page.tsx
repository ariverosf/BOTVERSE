"use client"

import { useEffect, useState } from "react"
import { Node, Position } from '@xyflow/react';
import Sidebar from "@/components/sidebar/sidebar"
import RightPanel from "@/components/right-panel";
import Header from "@/components/header";
import DebugPanel from "@/components/debug-panel";
import Canvas from "@/components/canvas";
import '@xyflow/react/dist/style.css';
import useQuery from "@/hooks/use-query";
import { FullProject } from "@/lib/api";
import ActionMenu from "@/components/action-menu";
import SidebarContent from "@/components/sidebar/sidebar-content";
import { Button } from "@/components/ui/button";
import { GitMerge, GitPullRequestIcon } from "lucide-react";
import clsx from "clsx";

export default function BotEditor() {
  const { data, loading, error } = useQuery<FullProject[]>(
    "http://127.0.0.1:8000/projects/",
    "GET"
  );

  const initialNodes: Node[] = [
    {
      id: "start",
      type: "defaultNode",
      position: { x: 0, y: 0 },
      data: {
        label: `Inicio`,
        onAddClick: () => setActionMenuVisible(true)
      },
      sourcePosition: Position.Right,
    }
  ];
  const [currentTab, setCurrentTab] = useState("workflows")
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<FullProject | null>(null);
  const selectedNode = nodes.find(node => node.selected);
  const [workflows, setWorkflows] = useState<FullProject[]>([]);


  const onAddWorkflow = () => {
    let workflow: FullProject | null = null;

    setWorkflows(prev => {
      workflow = {
        id: Date.now().toString(),
        name: "Borrador " + (prev.length + 1),
        description: "Nuevo flujo",
        flows: [],
        created_at: new Date().toString()
      };
      return [workflow, ...prev];
    });

    setSelectedWorkflow(workflow);
  }

  useEffect(() => {
    if (data) {
      setWorkflows(data);
    }
  }, [data]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-nunito">
      <Header onSaveWorkspace={() => {}} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onChange={setCurrentTab}>
          <SidebarContent tab="workflows" title="Workflows">
            <Button onClick={onAddWorkflow} className="justify-start w-min" size="sm"><GitPullRequestIcon />Crear Workflow</Button>
            <div className="flex flex-col gap-1 mt-2">
              { workflows.map(workflow => (
                <Button onClick={() => setSelectedWorkflow(workflow)} className={clsx("justify-start hover:bg-gray-200", {"bg-gray-200": selectedWorkflow?.id === workflow.id })} size="sm" variant="ghost" key={workflow.id}>
                  <GitMerge /> { workflow.name }
                </Button>
              )) }
            </div>
          </SidebarContent>
        </Sidebar>
        {/* Main Canvas Area */}
        <ActionMenu hidden={!actionMenuVisible} />
        <Canvas nodes={nodes} onNodeChange={setNodes} workflow={selectedWorkflow} />
        <RightPanel selectedNode={selectedNode} />
      </div>

      {/* Bottom Debug Panel */}
      <DebugPanel currentFlow={null} />
    </div>
  )
}
