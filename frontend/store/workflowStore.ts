import { Edge, Node } from "@xyflow/react";
import { Project } from "next/dist/build/swc/types";
import { create } from "zustand";

type TProject = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
};

type TMeta = {
  edges: Edge[];
};

type TFlow = {
  id?: string;
  project_id: string;
  name: string;
  nodes: Node[];
  metadata: TMeta;
  created_at?: string;
  updated_at?: string;
};

type WorkflowState = {
  actionMenuVisible: boolean;
  selectedNode: string | null;
  selectedProject: string | null;
  selectedFlow: string | null;
  projects: TProject[];
  flows: TFlow[];
  canvasNodes: Node[];
  canvasEdges: Edge[];
  setEdges: (fn: (edges: Edge[]) => Edge[]) => void;
  setNodes: (fn: (nodes: Node[]) => Node[]) => void;
  toggleActionMenu: () => void;
  getSelectedProject: () => TProject | undefined;
  getSelectedNode: () => Node | undefined;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedProject: (project_id: string | null) => void;
  changeNode: (nodeId: string, node: Node) => void;
  closeActionMenu: () => void;
  getFlowsFromSelectedProject: () => TFlow[];
  getSelectedFlow: () => TFlow | undefined;
  createFlow: (name: string) => Promise<TFlow>;
  updateFlow: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<TProject>;
  getProjectList: () => Promise<void>;
  getFlowsByProjectId: (projectId: string) => Promise<void>;
  setFlow: (flowId: string) => Promise<TFlow>;
};

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  actionMenuVisible: false,
  rightPanelVisible: false,
  selectedNode: null,
  selectedProject: null,
  selectedFlow: null,
  projects: [],
  flows: [],
  canvasNodes: [],
  canvasEdges: [],
  setEdges: (fn: (edges: Edge[]) => Edge[]) => {
    set((state => ({ canvasEdges: fn(state.canvasEdges)})))
  },
  setNodes: (fn: (nodes: Node[]) => Node[]) => {
    set((state => ({ canvasNodes: fn(state.canvasNodes)})))
  },
  toggleActionMenu: () => set(state => ({
    actionMenuVisible: !state.actionMenuVisible
  })),
  createNode: () => set(state => ({
    canvasNodes: [...state.canvasNodes, {
      id: crypto.randomUUID(),
      type: "ActionNode",
      data: {},
      position: {x: 0, y: 0}
    }]
  })),
  getSelectedProject: () => get().projects.find(p => p.id === get().selectedProject),
  getSelectedNode: () => get().canvasNodes.find(n => n.id === get().selectedNode),
  getSelectedFlow: () => get().flows.find(f => f.id === get().selectedFlow),
  setSelectedProject: (project_id: string | null) => {
    get().getFlowsByProjectId(project_id ?? "");
    set({ selectedProject: project_id });
  },
  setSelectedNode: (nodeId: string | null) => set({ selectedNode: nodeId }),
  setSelectedFlow: (flowId: string | null) => set({ selectedFlow: flowId }),
  changeNode: (nodeId: string, node: Node) => set(state => ({ canvasNodes: state.canvasNodes.map(c => c.id === nodeId ? node : c) })),
  closeActionMenu: () => set({ actionMenuVisible: false }),
  getFlowsFromSelectedProject: () => get().flows.filter(f => f.project_id === get().selectedProject),
  createFlow: async (name: string) => {
    const project = get().getSelectedProject();
    if (!project) throw new Error("Debes seleccionar un proyecto.");
  
    const flow: TFlow = {
      project_id: project.id,
      name,
      nodes: [
        {
          id: "start-node",
          type: "StartNode",
          position: { x: 0, y: 0 },
          data: {}
        },
        {
          id: "end-node",
          type: "EndNode",
          position: { x: 600, y: 0 },
          data: {}
        }
      ],
      metadata: {
        edges: []
      }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flows`, {
      method: 'POST',
      headers: { "Content-type": "application/json"},

      body: JSON.stringify(flow),
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) throw data;

    set({ flows: [data, ...get().flows], selectedFlow: data.id})
    return data;
  },
  updateFlow: async () => {
    const flow = get().getSelectedFlow();
    if (!flow) throw new Error("Debes seleccionar un flujo.");
  
    const flowData: TFlow = {
      name: flow.name,
      nodes: get().canvasNodes,
      metadata: {
        edges: get().canvasEdges,
      },
      project_id: flow.project_id
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flows/${flow.id}`, {
        method: 'PUT',
        headers: { "Content-type": "application/json"},

        body: JSON.stringify(flowData),
        credentials: "include"
      });
      if (!res.ok) throw res.json();


      return res.json();      
    } catch(err) {
      console.error("Create flow error:", err);
    }
  },
  createProject: async(name: string, description: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      method: 'POST',
      headers: { "Content-type": "application/json"},

      body: JSON.stringify({ name, description }),
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) throw data;

    set(state => ({ projects: [data, ...state.projects] }))
    return data;
  },
  getProjectList: async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      method: 'GET',
      headers: { "Content-type": "application/json"},
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) throw data;

    set({ projects: data });
    return data;
  },
  getFlowsByProjectId: async (projectId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flows/by-project/${projectId}`, {
      method: 'GET',
      headers: { "Content-type": "application/json"},
      credentials: "include"
    });
    const data = await res.json();
    if (!res.ok) throw data;

    set({ flows: data });
    return data;
  },
  setFlow: async (flowId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flows/${flowId}`, {
      method: 'GET',
      headers: { "Content-type": "application/json"},
      credentials: "include"
    });
    const data: TFlow = await res.json();
    if (!res.ok) throw data;

    set({
      selectedFlow: flowId,
      canvasNodes: data.nodes ?? [],
      canvasEdges: data.metadata?.edges ?? []
    });
    return data;
  }
}));

export { useWorkflowStore };