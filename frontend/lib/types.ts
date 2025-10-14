import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Node, Edge } from '@xyflow/react';

export type SidebarItem = {
  id: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  label: string;
  tooltip: string;
  description: string;
};

// Enhanced API types with better type safety
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Enhanced Node types for better type safety
export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'action' | 'condition' | 'response';
  content: string;
  connections: string[];
  position: { x: number; y: number };
  data?: Record<string, unknown>;
}

export interface WorkflowFlow {
  id: string;
  name: string;
  project_id: string;
  nodes: WorkflowNode[];
  created_at: string;
  updated_at?: string;
}

export interface WorkflowProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface FullWorkflowProject extends WorkflowProject {
  flows: WorkflowFlow[];
}

// State management types
export interface AppState {
  currentTab: string;
  selectedWorkflow: FullWorkflowProject | null;
  workflows: FullWorkflowProject[];
  workflowNodes: Record<string, Node[]>; // Store nodes per workflow ID
  workflowEdges: Record<string, Edge[]>; // Store edges per workflow ID
  settingsOpen: boolean;
  actionMenuVisible: boolean;
}

export interface AppActions {
  setCurrentTab: (tab: string) => void;
  setSelectedWorkflow: (workflow: FullWorkflowProject | null) => void;
  setWorkflows: (workflows: FullWorkflowProject[]) => void;
  setNodes: (workflowId: string, nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  getNodes: (workflowId: string) => Node[];
  setEdges: (workflowId: string, edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  getEdges: (workflowId: string) => Edge[];
  setSettingsOpen: (open: boolean) => void;
  setActionMenuVisible: (visible: boolean) => void;
  addWorkflow: () => void;
  updateWorkflow: (id: string, updates: Partial<FullWorkflowProject>) => void;
  deleteWorkflow: (id: string) => void;
}

// Flow Execution Types
export interface NodeExecutionResult {
  node_id: string;
  node_type: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped';
  output?: string;
  error?: string;
  execution_time_ms?: number;
  timestamp: string;
}

export interface FlowExecutionResult {
  flow_id: string;
  flow_name: string;
  status: 'success' | 'failed' | 'error' | 'empty';
  node_results: NodeExecutionResult[];
  total_execution_time_ms: number;
  total_nodes: number;
  successful_nodes: number;
  failed_nodes: number;
  started_at: string;
  completed_at: string;
  error?: string;
}

export interface FlowValidationResult {
  valid: boolean;
  flow_id: string;
  flow_name?: string;
  total_nodes: number;
  issues: string[];
  warnings: string[];
  message: string;
}

export interface ExecutionHistoryResponse {
  executions: FlowExecutionResult[];
  total: number;
}