"use client"
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { AppState, AppActions, FullWorkflowProject } from '@/lib/types';
import { Node, Edge } from '@xyflow/react';

// Action types for the reducer
type AppAction =
  | { type: 'SET_CURRENT_TAB'; payload: string }
  | { type: 'SET_SELECTED_WORKFLOW'; payload: FullWorkflowProject | null }
  | { type: 'SET_WORKFLOWS'; payload: FullWorkflowProject[] }
  | { type: 'SET_NODES'; payload: { workflowId: string; nodes: Node[] } }
  | { type: 'SET_EDGES'; payload: { workflowId: string; edges: Edge[] } }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean }
  | { type: 'SET_ACTION_MENU_VISIBLE'; payload: boolean }
  | { type: 'ADD_WORKFLOW'; payload: FullWorkflowProject }
  | { type: 'UPDATE_WORKFLOW'; payload: { id: string; updates: Partial<FullWorkflowProject> } }
  | { type: 'DELETE_WORKFLOW'; payload: string };

// Initial state
const initialState: AppState = {
  currentTab: 'workflows',
  selectedWorkflow: null,
  workflows: [],
  workflowNodes: {},
  workflowEdges: {},
  settingsOpen: false,
  actionMenuVisible: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      return { ...state, currentTab: action.payload };
    
    case 'SET_SELECTED_WORKFLOW':
      return { ...state, selectedWorkflow: action.payload };
    
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload };
    
    case 'SET_NODES':
      return { 
        ...state, 
        workflowNodes: {
          ...state.workflowNodes,
          [action.payload.workflowId]: action.payload.nodes
        }
      };
    
    case 'SET_EDGES':
      return { 
        ...state, 
        workflowEdges: {
          ...state.workflowEdges,
          [action.payload.workflowId]: action.payload.edges
        }
      };
    
    case 'SET_SETTINGS_OPEN':
      return { ...state, settingsOpen: action.payload };
    
    case 'SET_ACTION_MENU_VISIBLE':
      return { ...state, actionMenuVisible: action.payload };
    
    case 'ADD_WORKFLOW':
      return { 
        ...state, 
        workflows: [action.payload, ...state.workflows],
        selectedWorkflow: action.payload 
      };
    
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow =>
          workflow.id === action.payload.id
            ? { ...workflow, ...action.payload.updates }
            : workflow
        ),
        selectedWorkflow: state.selectedWorkflow?.id === action.payload.id
          ? { ...state.selectedWorkflow, ...action.payload.updates }
          : state.selectedWorkflow,
      };
    
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(workflow => workflow.id !== action.payload),
        selectedWorkflow: state.selectedWorkflow?.id === action.payload ? null : state.selectedWorkflow,
      };
    
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  actions: AppActions;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions: AppActions = {
    setCurrentTab: useCallback((tab: string) => {
      dispatch({ type: 'SET_CURRENT_TAB', payload: tab });
    }, []),

    setSelectedWorkflow: useCallback((workflow: FullWorkflowProject | null) => {
      dispatch({ type: 'SET_SELECTED_WORKFLOW', payload: workflow });
    }, []),

    setWorkflows: useCallback((workflows: FullWorkflowProject[]) => {
      dispatch({ type: 'SET_WORKFLOWS', payload: workflows });
    }, []),

    setNodes: useCallback((workflowId: string, nodes: Node[] | ((prev: Node[]) => Node[])) => {
      const currentNodes = state.workflowNodes[workflowId] || [];
      if (typeof nodes === 'function') {
        dispatch({ type: 'SET_NODES', payload: { workflowId, nodes: nodes(currentNodes) } });
      } else {
        dispatch({ type: 'SET_NODES', payload: { workflowId, nodes } });
      }
    }, [state.workflowNodes]), // Keep dependency for setNodes

    getNodes: useCallback((workflowId: string) => {
      return state.workflowNodes[workflowId] || [];
    }, [state.workflowNodes]), // Keep dependency for getNodes

    setEdges: useCallback((workflowId: string, edges: Edge[] | ((prev: Edge[]) => Edge[])) => {
      const currentEdges = state.workflowEdges[workflowId] || [];
      if (typeof edges === 'function') {
        dispatch({ type: 'SET_EDGES', payload: { workflowId, edges: edges(currentEdges) } });
      } else {
        dispatch({ type: 'SET_EDGES', payload: { workflowId, edges } });
      }
    }, [state.workflowEdges]), // Keep dependency for setEdges

    getEdges: useCallback((workflowId: string) => {
      return state.workflowEdges[workflowId] || [];
    }, [state.workflowEdges]), // Keep dependency for getEdges

    setSettingsOpen: useCallback((open: boolean) => {
      dispatch({ type: 'SET_SETTINGS_OPEN', payload: open });
    }, []),

    setActionMenuVisible: useCallback((visible: boolean) => {
      dispatch({ type: 'SET_ACTION_MENU_VISIBLE', payload: visible });
    }, []),

    addWorkflow: useCallback(() => {
      const newWorkflow: FullWorkflowProject = {
        id: `draft-${Date.now()}`,
        name: `Borrador ${state.workflows.length + 1}`,
        description: 'Nuevo flujo',
        flows: [],
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });
    }, [state.workflows.length]),

    updateWorkflow: useCallback((id: string, updates: Partial<FullWorkflowProject>) => {
      dispatch({ type: 'UPDATE_WORKFLOW', payload: { id, updates } });
    }, []),

    deleteWorkflow: useCallback((id: string) => {
      dispatch({ type: 'DELETE_WORKFLOW', payload: id });
    }, []),
  };

  const value: AppContextType = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for specific state slices
export function useCurrentTab() {
  const { state, actions } = useApp();
  return { currentTab: state.currentTab, setCurrentTab: actions.setCurrentTab };
}

export function useSelectedWorkflow() {
  const { state, actions } = useApp();
  return { 
    selectedWorkflow: state.selectedWorkflow, 
    setSelectedWorkflow: actions.setSelectedWorkflow 
  };
}

export function useWorkflows() {
  const { state, actions } = useApp();
  return { 
    workflows: state.workflows, 
    setWorkflows: actions.setWorkflows,
    addWorkflow: actions.addWorkflow,
    updateWorkflow: actions.updateWorkflow,
    deleteWorkflow: actions.deleteWorkflow,
  };
}

export function useNodes() {
  const { state, actions } = useApp();
  return { 
    getNodes: actions.getNodes,
    setNodes: actions.setNodes 
  };
}

export function useEdges() {
  const { state, actions } = useApp();
  return { 
    getEdges: actions.getEdges,
    setEdges: actions.setEdges 
  };
}

export function useSettings() {
  const { state, actions } = useApp();
  return { 
    settingsOpen: state.settingsOpen, 
    setSettingsOpen: actions.setSettingsOpen 
  };
}

export function useActionMenu() {
  const { state, actions } = useApp();
  return { 
    actionMenuVisible: state.actionMenuVisible, 
    setActionMenuVisible: actions.setActionMenuVisible 
  };
}
