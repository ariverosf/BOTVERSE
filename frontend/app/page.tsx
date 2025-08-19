"use client"

import { JSX, useEffect, useState } from "react"
import { Node, Position } from '@xyflow/react';
import Sidebar from "@/components/sidebar/sidebar"
import RightPanel from "@/components/right-panel";
import Header from "@/components/header";
import DebugPanel from "@/components/debug-panel";
import SidebarContent from "@/components/sidebar/sidebar-content";
import Workflows from "@/components/workflows";
import Canvas from "@/components/canvas";
import {
  BookOpen,
  GitBranch,
  GitCommit,
  HelpCircle,
  Plus,
  Puzzle,
  Search,
  Settings,
  Table,
  Users,
  Zap
} from "lucide-react";
import '@xyflow/react/dist/style.css';
import useQuery from "@/hooks/use-query";
import { FullProject } from "@/lib/api";
import ActionMenu from "@/components/action-menu";

const sidebarItems = [
  {
    id: "workflows",
    icon: GitBranch,
    label: "Workflows",
    tooltip: "Gestionar flujos de conversación",
    description: "Diseña y edita los flujos de conversación de tu bot",
  },
  {
    id: "knowledge",
    icon: BookOpen,
    label: "Bases de conocimientos",
    tooltip: "Administrar base de conocimientos",
    description: "Gestiona documentos, FAQ y contenido del bot",
  },
  {
    id: "tables",
    icon: Table,
    label: "Tablas",
    tooltip: "Gestionar tablas de datos",
    description: "Administra datos estructurados y variables",
  },
  {
    id: "agents",
    icon: Users,
    label: "Agentes",
    tooltip: "Configurar agentes virtuales",
    description: "Configura diferentes personalidades del bot",
  },
  {
    id: "hooks",
    icon: Zap,
    label: "Hooks",
    tooltip: "Configurar webhooks y eventos",
    description: "Integra eventos y disparadores externos",
  },
  {
    id: "integrations",
    icon: Puzzle,
    label: "Integraciones instaladas",
    tooltip: "Ver integraciones activas",
    description: "Gestiona conexiones con servicios externos",
  },
  {
    id: "versions",
    icon: GitCommit,
    label: "Versiones",
    tooltip: "Historial de versiones",
    description: "Control de versiones y respaldos del bot",
  },
  {
    id: "config",
    icon: Settings,
    label: "Configuración del Bot",
    tooltip: "Configuración general",
    description: "Ajustes generales y configuración avanzada",
  },
  {
    id: "search",
    icon: Search,
    label: "Buscar",
    tooltip: "Buscar en el proyecto",
    description: "Busca elementos en todo el proyecto",
  },
  {
    id: "help",
    icon: HelpCircle,
    label: "Ayuda",
    tooltip: "Centro de ayuda",
    description: "Documentación y soporte técnico",
  },
];

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
  const [activeSidebarItem, setActiveSidebarItem] = useState("workflows")
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<FullProject | null>(null);
  const activeItem = sidebarItems.find(item => item.id === activeSidebarItem);
  const selectedNode = nodes.find(node => node.selected);
  const [workflows, setWorkflows] = useState<FullProject[]>([]);


  const onAddWorkflow = () => {
    setWorkflows(prev => [
      {
        id: Date.now().toString(),
        name: "Borrador " + (prev.length + 1),
        description: "Nuevo flujo",
        flows: [],
        created_at: new Date().toString()
      },
      ...prev
    ])
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
        <div className="w-80 bg-white border-r border-slate-200 flex">
          <Sidebar items={sidebarItems} active={activeSidebarItem} setItemActive={setActiveSidebarItem}  />
          {
            activeItem?.id === "workflows" &&
            <SidebarContent
              title={activeItem?.label ?? "No encontrado"}
              description={activeItem?.description ?? "No se encontró la opción seleccionada."}
              buttonLabel="Nuevo"
              buttonIcon={Plus}
              buttonHandler={onAddWorkflow}
            >
              <Workflows onSelect={setSelectedWorkflow} loading={loading} hasError={!!error} data={workflows} selected={selectedWorkflow} />
            </SidebarContent>
          }
          {
            activeItem?.id !== "workflows" &&
            <SidebarContent
              title={activeItem?.label ?? "No encontrado"}
              description={activeItem?.description ?? "No se encontró la opción seleccionada."}
            >
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Funcionalidad en desarrollo</p>
              </div>
            </SidebarContent>
          }
        </div>
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
