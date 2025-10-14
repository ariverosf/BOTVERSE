"use client"

import { Node, Position, Edge } from '@xyflow/react';
import Sidebar from "@/components/sidebar/sidebar"
import RightPanel from "@/components/right-panel";
import Header from "@/components/header";
import DebugPanel from "@/components/debug-panel";
import Canvas from "@/components/canvas";
import '@xyflow/react/dist/style.css';
import ActionMenu from "@/components/action-menu";
import SidebarContent from "@/components/sidebar/sidebar-content";
import { Button } from "@/components/ui/button";
import { GitMerge, GitPullRequestIcon } from "lucide-react";
import clsx from "clsx";
import SettingsDialog from "@/components/settings-dialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useCurrentTab, useWorkflows, useNodes, useEdges, useSettings, useActionMenu, useApp } from "@/contexts/AppContext";
import { useWorkflowData, useWorkflowSelection } from "@/hooks/useWorkflows";
import { useEffect, useMemo, useCallback, useState } from "react";
// import { FullWorkflowProject } from "@/lib/types";
import { ACTION_LABELS } from "@/lib/constants";
import { workflowApi } from "@/lib/api";
import { convertToBackendNode, convertToReactFlowNode, convertBackendConnectionsToEdges } from "@/lib/utils";

// Main content component that uses the context
function BotEditorContent() {
  const { setCurrentTab } = useCurrentTab();
  const { workflows, addWorkflow, updateWorkflow } = useWorkflows();
  const { selectedWorkflow, selectWorkflow } = useWorkflowSelection();
  const { getNodes, setNodes } = useNodes();
  const { getEdges, setEdges } = useEdges();
  const { settingsOpen, setSettingsOpen } = useSettings();
  const { actionMenuVisible, setActionMenuVisible } = useActionMenu();
  const { state } = useApp();

  // Fetch workflow data
  const { loading } = useWorkflowData();

  // State for save operation
  const [isSaving, setIsSaving] = useState(false);
  
  // State for export operation
  const [isExporting, setIsExporting] = useState(false);

  // Handle node updates from right panel
  const handleNodeUpdate = useCallback((nodeId: string, updates: Record<string, unknown>) => {
    if (!selectedWorkflow) return;
    setNodes(selectedWorkflow.id, (prev: Node[]) => 
      prev.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, [setNodes, selectedWorkflow?.id]);

  // Initial nodes for the canvas - must have start and end nodes (no actions, no auto-connection)
  const initialNodes: Node[] = useMemo(() => [
    {
      id: "start",
      type: "defaultNode",
      position: { x: 100, y: 100 },
      data: {
        actions: [], // Start node has no actions
        label: "Inicio",
        nodeType: "start",
        isStartNode: true, // Special flag for start node
        onAddClick: () => setActionMenuVisible(true),
        onNameChange: (newName: string) => handleNodeUpdate("start", { label: newName })
      },
      sourcePosition: Position.Right,
    },
    {
      id: "end",
      type: "defaultNode",
      position: { x: 400, y: 100 },
      data: {
        actions: [], // End node has no actions
        label: "Fin",
        nodeType: "end",
        isEndNode: true, // Special flag for end node
        onAddClick: () => setActionMenuVisible(true),
        onNameChange: (newName: string) => handleNodeUpdate("end", { label: newName })
      },
      targetPosition: Position.Left,
    }
  ], [setActionMenuVisible, handleNodeUpdate]);

  // Initial edges for the canvas - no automatic connection between start and end
  const initialEdges: Edge[] = useMemo(() => [
    // No automatic connection - users must manually connect nodes
  ], []);

  // Initialize nodes for new workflows OR load from backend
  useEffect(() => {
    if (!selectedWorkflow) return;
    
    const existingNodes = getNodes(selectedWorkflow.id);
    
    // If no nodes in local state
    if (!existingNodes.length) {
      // Check if workflow has flows with nodes from backend
      if (selectedWorkflow.flows && selectedWorkflow.flows.length > 0) {
        const flow = selectedWorkflow.flows[0];
        
        if (flow.nodes && flow.nodes.length > 0) {
          // Convert backend nodes to ReactFlow format
          const loadedNodes: Node[] = flow.nodes.map(backendNode => 
            convertToReactFlowNode(
              backendNode,
              () => setActionMenuVisible(true),
              (newName: string) => handleNodeUpdate(backendNode.id, { label: newName })
            )
          );
          
          setNodes(selectedWorkflow.id, loadedNodes);
          
          // Convert backend connections to ReactFlow edges
          const loadedEdges = convertBackendConnectionsToEdges(flow.nodes);
          setEdges(selectedWorkflow.id, loadedEdges);
          return;
        }
      }
      
      // No backend nodes, initialize with default start and end nodes
      setNodes(selectedWorkflow.id, initialNodes);
      setEdges(selectedWorkflow.id, initialEdges);
    }
  }, [selectedWorkflow, getNodes, setNodes, getEdges, setEdges, initialNodes, initialEdges, setActionMenuVisible]);

  // Get current workflow's nodes
  const nodes = useMemo(() => {
    return selectedWorkflow ? getNodes(selectedWorkflow.id) : [];
  }, [selectedWorkflow, getNodes]);
  
  // Get current workflow's edges
  const edges = useMemo(() => {
    return selectedWorkflow ? getEdges(selectedWorkflow.id) : [];
  }, [selectedWorkflow, getEdges]);
  
  // Memoize edges to prevent unnecessary re-renders
  const memoizedEdges = useMemo(() => edges, [edges]);
  
  // Find selected node - use ref to prevent re-renders when node data changes
  // Get the currently selected node for the right panel
  const selectedNode = useMemo(() => {
    return nodes.find(node => node.selected) || null;
  }, [nodes]);

  // Handle workflow creation
  const handleAddWorkflow = () => {
    // Use the context action to add workflow to global state
    addWorkflow();
  };

  // Handle save workspace
  const handleSaveWorkspace = useCallback(async () => {
    if (!selectedWorkflow) {
      alert('No hay workflow seleccionado para guardar');
      return;
    }

    setIsSaving(true);

    try {
      // Get current nodes for this workflow
      const currentNodes = getNodes(selectedWorkflow.id);
      
      // Check if workflow has a backend ID (saved before) or is local only
      const isNewWorkflow = selectedWorkflow.id.startsWith('draft-') || 
                           selectedWorkflow.id.length < 15 || 
                           !selectedWorkflow.created_at?.includes('T');

      if (isNewWorkflow) {
        // Create new project in backend
        const projectResponse = await workflowApi.createProject({
          name: selectedWorkflow.name,
          description: selectedWorkflow.description
        });

        const newProject = projectResponse.data;

        // Create flow with nodes
        if (currentNodes.length > 0) {
          // Get current edges for this workflow
          const currentEdges = getEdges(selectedWorkflow.id);
          
          // Convert ReactFlow nodes to backend format with connections
          const backendNodes = currentNodes.map(node => {
            const converted = convertToBackendNode(node, currentEdges);
            return {
              ...converted,
              type: converted.type as 'start' | 'end' | 'action' | 'condition' | 'response'
            };
          });
          await workflowApi.createFlow(newProject.id, {
            name: `${selectedWorkflow.name} - Flow`,
            nodes: backendNodes
          });
        }

        // Update local state with backend ID
        updateWorkflow(selectedWorkflow.id, {
          id: newProject.id,
          created_at: newProject.created_at
        });

        alert('✅ Workflow guardado exitosamente!');
      } else {
        // Update existing project
        await workflowApi.updateProject(selectedWorkflow.id, {
          name: selectedWorkflow.name,
          description: selectedWorkflow.description
        });

        // Update or create flow
        if (selectedWorkflow.flows && selectedWorkflow.flows.length > 0) {
          const flow = selectedWorkflow.flows[0];
          
          // Get current edges for this workflow
          const currentEdges = getEdges(selectedWorkflow.id);
          
          // Convert ReactFlow nodes to backend format with connections
          const backendNodes = currentNodes.map(node => {
            const converted = convertToBackendNode(node, currentEdges);
            return {
              ...converted,
              type: converted.type as 'start' | 'end' | 'action' | 'condition' | 'response'
            };
          });
          await workflowApi.updateFlow(selectedWorkflow.id, flow.id, {
            name: flow.name,
            nodes: backendNodes
          });
        } else if (currentNodes.length > 0) {
          // Create new flow for existing project
          // Get current edges for this workflow
          const currentEdges = getEdges(selectedWorkflow.id);
          
          // Convert ReactFlow nodes to backend format with connections
          const backendNodes = currentNodes.map(node => {
            const converted = convertToBackendNode(node, currentEdges);
            return {
              ...converted,
              type: converted.type as 'start' | 'end' | 'action' | 'condition' | 'response'
            };
          });
          await workflowApi.createFlow(selectedWorkflow.id, {
            name: `${selectedWorkflow.name} - Flow`,
            nodes: backendNodes
          });
        }

        alert('✅ Workflow actualizado exitosamente!');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('❌ Error al guardar el workflow: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsSaving(false);
    }
  }, [selectedWorkflow, getNodes, updateWorkflow]);

  // Handle adding new nodes from toolbar or drag and drop
  const handleAddNewNode = useCallback((position?: { x: number; y: number }, connectionInfo?: { sourceNodeId: string; sourceHandle: string }) => {
    if (!selectedWorkflow) return;
    
    const newNode: Node = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "defaultNode",
      position: position || { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 200 + 100 
      },
      data: {
        actions: [],
        onAddClick: () => setActionMenuVisible(true),
        onNameChange: (newName: string) => handleNodeUpdate(newNode.id, { label: newName })
      }
    };
    
    // Add the new node
    setNodes(selectedWorkflow.id, (prev: Node[]) => [...prev, newNode]);
    
    // Create connection if connectionInfo is provided
    if (connectionInfo) {
      const newEdge: Edge = {
        id: `edge-${connectionInfo.sourceNodeId}-${newNode.id}`,
        source: connectionInfo.sourceNodeId,
        sourceHandle: connectionInfo.sourceHandle,
        target: newNode.id,
        targetHandle: 'target',
        type: 'default',
      };
      
      setEdges(selectedWorkflow.id, (prevEdges) => [...prevEdges, newEdge]);
    }
  }, [setNodes, setEdges, setActionMenuVisible, handleNodeUpdate, selectedWorkflow]);

  // Handle adding actions to existing nodes from action menu
  const handleAddNodeFromAction = useCallback((actionType: string) => {
    if (!selectedWorkflow) return;
    
    // Find the selected node (the one with the "Añadir acción" button)
    const selectedNode = nodes.find(node => node.selected);
    
    if (selectedNode) {
      // Add the new action to the existing node's actions list
      const currentActions = Array.isArray(selectedNode.data?.actions) ? selectedNode.data.actions : [];
      const newAction = {
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: actionType,
        label: ACTION_LABELS[actionType] || actionType
      };
      
      setNodes(selectedWorkflow.id, (prev: Node[]) => 
        prev.map(node => 
          node.id === selectedNode.id 
            ? {
                ...node,
                data: {
                  ...node.data,
                  actions: [...currentActions, newAction],
                  onAddClick: () => setActionMenuVisible(true),
                  onNameChange: (newName: string) => handleNodeUpdate(node.id, { label: newName })
                }
              }
            : node
        )
      );
    } else {
      // If no node is selected, create a new node with the action
      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "defaultNode",
        position: { 
          x: Math.random() * 300 + 100, 
          y: Math.random() * 200 + 100 
        },
        data: {
          actions: [{
            id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: actionType,
            label: ACTION_LABELS[actionType] || actionType
          }],
          onAddClick: () => setActionMenuVisible(true),
          onNameChange: (newName: string) => handleNodeUpdate(newNode.id, { label: newName })
        }
      };
      
      setNodes(selectedWorkflow.id, (prev: Node[]) => [...prev, newNode]);
    }
    
    setActionMenuVisible(false);
  }, [setNodes, setActionMenuVisible, nodes, selectedWorkflow]);

  // Handle export workspace
  const handleExportWorkspace = useCallback(async () => {
    if (!selectedWorkflow) {
      alert('No hay workflow seleccionado para exportar');
      return;
    }

    setIsExporting(true);

    try {
      const currentNodes = getNodes(selectedWorkflow.id);
      
      // Create export data
      const exportData = {
        workflow: {
          id: selectedWorkflow.id,
          name: selectedWorkflow.name,
          description: selectedWorkflow.description,
          created_at: selectedWorkflow.created_at,
          updated_at: selectedWorkflow.updated_at
        },
        nodes: currentNodes.map(node => convertToBackendNode(node)),
        edges: memoizedEdges,
        export_info: {
          exported_at: new Date().toISOString(),
          version: '1.0.0',
          tool: 'BOTVERSE Bot Editor'
        }
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileName = `workflow-${selectedWorkflow.name.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();

      alert('✅ Workflow exportado exitosamente!');
    } catch (error) {
      console.error('Error exporting workflow:', error);
      alert('❌ Error al exportar el workflow: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsExporting(false);
    }
  }, [selectedWorkflow, getNodes, memoizedEdges]);

  // Remove error handling - let the app work offline

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-nunito">
      <Header 
        onSaveWorkspace={handleSaveWorkspace} 
        isSaving={isSaving}
        selectedWorkflowName={selectedWorkflow?.name}
        onExportWorkspace={handleExportWorkspace}
        isExporting={isExporting}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onChange={setCurrentTab} onSettingsClick={() => setSettingsOpen(true)}>
          <SidebarContent tab="workflows" title="Workflows">
            <Button 
              onClick={handleAddWorkflow} 
              className="justify-start w-min" 
              size="sm"
              disabled={loading}
            >
              <GitPullRequestIcon />Crear Workflow
            </Button>
            
            <div className="flex flex-col gap-1 mt-2">
              {workflows.map(workflow => (
                <Button 
                  onClick={() => selectWorkflow(workflow)} 
                  className={clsx(
                    "justify-start hover:bg-gray-200", 
                    { "bg-gray-200": selectedWorkflow?.id === workflow.id }
                  )} 
                  size="sm" 
                  variant="ghost" 
                  key={workflow.id}
                >
                  <GitMerge /> {workflow.name}
                </Button>
              ))}
            </div>
          </SidebarContent>
        </Sidebar>
        
        {/* Main Canvas Area */}
        {selectedWorkflow && (
          <ActionMenu 
            hidden={!actionMenuVisible} 
            onAddNode={handleAddNodeFromAction}
          />
        )}
        <Canvas 
          nodes={nodes} 
          edges={memoizedEdges}
          onNodeChange={(workflowId, nodes) => setNodes(workflowId, nodes)} 
          workflow={selectedWorkflow}
          onAddNode={handleAddNewNode}
          onNodeUpdate={handleNodeUpdate}
          onTestFlow={() => {
            // This will be handled by the RightPanel
          }}
          onEdgesChange={(edges) => {
            if (selectedWorkflow) {
              setEdges(selectedWorkflow.id, edges);
            }
          }}
        />
        <RightPanel 
          selectedNode={selectedNode} 
          onNodeUpdate={handleNodeUpdate}
          workflow={selectedWorkflow}
          nodes={nodes}
          edges={memoizedEdges}
          onTestFlow={useCallback(() => {
            // Switch to emulator tab
          }, [])}
        />
      </div>

      {/* Bottom Debug Panel */}
      <DebugPanel 
        currentFlow={null} 
        selectedWorkflow={selectedWorkflow}
      />

      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsOpen} 
        closeDialog={() => setSettingsOpen(false)} 
      />
    </div>
  );
}

// Main component with providers
export default function BotEditor() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BotEditorContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
