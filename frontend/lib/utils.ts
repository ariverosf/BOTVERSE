import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Edge, Node } from '@xyflow/react';
import { ACTION_LABELS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// ID Generation Utilities
// ============================================

/**
 * Generates a unique ID using timestamp and random string
 * @returns {string} Unique identifier
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates a node ID with prefix
 * @param {string} prefix - Optional prefix for the ID (default: 'node')
 * @returns {string} Unique node ID
 */
export function generateNodeId(prefix: string = 'node'): string {
  return `${prefix}-${generateUniqueId()}`;
}

/**
 * Generates an action ID with prefix
 * @returns {string} Unique action ID
 */
export function generateActionId(): string {
  return `action-${generateUniqueId()}`;
}

/**
 * Generates an edge ID from source and target node IDs
 * @param {string} sourceId - Source node ID
 * @param {string} targetId - Target node ID
 * @returns {string} Unique edge ID
 */
export function generateEdgeId(sourceId: string, targetId: string): string {
  return `edge-${sourceId}-${targetId}`;
}

// ============================================
// Node Operations
// ============================================

/**
 * Gets the display label for an action type
 * @param {string} actionType - The action type identifier
 * @returns {string} Human-readable label
 */
export function getActionLabel(actionType: string): string {
  return ACTION_LABELS[actionType] || actionType;
}

/**
 * Creates a new action object
 * @param {string} actionType - The type of action
 * @returns {Object} Action object with id, type, and label
 */
export function createAction(actionType: string) {
  return {
    id: generateActionId(),
    type: actionType,
    label: getActionLabel(actionType),
  };
}

/**
 * Creates a new node with default properties
 * @param {Object} options - Node configuration options
 * @param {string} options.type - Node type (default: 'defaultNode')
 * @param {Object} options.position - Node position {x, y}
 * @param {Array} options.actions - Initial actions for the node
 * @param {Object} options.data - Additional node data
 * @param {Function} options.onAddClick - Callback for add action button
 * @param {Function} options.onNameChange - Callback for name change
 * @returns {Node} New node object
 */
export function createNode(options: {
  type?: string;
  position?: { x: number; y: number };
  actions?: Array<any>;
  data?: Record<string, any>;
  onAddClick?: () => void;
  onNameChange?: (newName: string) => void;
}): Node {
  const {
    type = 'defaultNode',
    position = { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
    actions = [],
    data = {},
    onAddClick,
    onNameChange,
  } = options;

  return {
    id: generateNodeId(),
    type,
    position,
    data: {
      actions,
      onAddClick,
      onNameChange,
      ...data,
    },
  };
}

/**
 * Updates a specific node in the nodes array
 * @param {Node[]} nodes - Array of nodes
 * @param {string} nodeId - ID of node to update
 * @param {Object} updates - Updates to apply to the node
 * @returns {Node[]} Updated nodes array
 */
export function updateNode(nodes: Node[], nodeId: string, updates: Record<string, any>): Node[] {
  return nodes.map(node =>
    node.id === nodeId
      ? { ...node, data: { ...node.data, ...updates } }
      : node
  );
}

/**
 * Adds an action to a specific node
 * @param {Node[]} nodes - Array of nodes
 * @param {string} nodeId - ID of node to add action to
 * @param {string} actionType - Type of action to add
 * @returns {Node[]} Updated nodes array
 */
export function addActionToNode(nodes: Node[], nodeId: string, actionType: string): Node[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      const currentActions = Array.isArray(node.data?.actions) ? node.data.actions : [];
      const newAction = createAction(actionType);
      
      return {
        ...node,
        data: {
          ...node.data,
          actions: [...currentActions, newAction],
        },
      };
    }
    return node;
  });
}

/**
 * Selects a specific node and deselects all others
 * @param {Node[]} nodes - Array of nodes
 * @param {string} nodeId - ID of node to select
 * @returns {Node[]} Updated nodes array
 */
export function selectNode(nodes: Node[], nodeId: string): Node[] {
  return nodes.map(node => ({
    ...node,
    selected: node.id === nodeId,
  }));
}

/**
 * Deselects all nodes
 * @param {Node[]} nodes - Array of nodes
 * @returns {Node[]} Updated nodes array
 */
export function deselectAllNodes(nodes: Node[]): Node[] {
  return nodes.map(node => ({ ...node, selected: false }));
}

/**
 * Finds the selected node
 * @param {Node[]} nodes - Array of nodes
 * @returns {Node | null} Selected node or null
 */
export function getSelectedNode(nodes: Node[]): Node | null {
  return nodes.find(node => node.selected) || null;
}

// ============================================
// Position Utilities
// ============================================

/**
 * Generates a random position within bounds
 * @param {Object} bounds - Position bounds
 * @param {number} bounds.minX - Minimum X coordinate (default: 100)
 * @param {number} bounds.maxX - Maximum X coordinate (default: 400)
 * @param {number} bounds.minY - Minimum Y coordinate (default: 100)
 * @param {number} bounds.maxY - Maximum Y coordinate (default: 300)
 * @returns {Object} Position {x, y}
 */
export function generateRandomPosition(bounds?: {
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
}): { x: number; y: number } {
  const {
    minX = 100,
    maxX = 400,
    minY = 100,
    maxY = 300,
  } = bounds || {};

  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}

// ============================================
// Validation Utilities
// ============================================

/**
 * Validates if a string is a valid non-empty string
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid
 */
export function isValidString(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates workflow name
 * @param {string} name - Workflow name
 * @param {number} minLength - Minimum length (default: 1)
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {boolean} True if valid
 */
export function isValidWorkflowName(name: string, minLength: number = 1, maxLength: number = 100): boolean {
  return isValidString(name) && name.length >= minLength && name.length <= maxLength;
}

/**
 * Validates workflow description
 * @param {string} description - Workflow description
 * @param {number} maxLength - Maximum length (default: 500)
 * @returns {boolean} True if valid
 */
export function isValidWorkflowDescription(description: string, maxLength: number = 500): boolean {
  return description.length <= maxLength;
}

// ============================================
// Node Format Conversion
// ============================================

/**
 * Converts a ReactFlow node to backend WorkflowNode format
 * @param {Node} node - ReactFlow node
 * @returns {Object} Backend-compatible node object
 */
/**
 * Converts ReactFlow edges to backend connections format
 * @param {Edge[]} edges - Array of ReactFlow edges
 * @param {string} nodeId - ID of the node to get connections for
 * @returns {string[]} Array of connected node IDs
 */
export function getNodeConnections(edges: Edge[], nodeId: string): string[] {
  return edges
    .filter(edge => edge.source === nodeId)
    .map(edge => edge.target);
}

export function convertToBackendNode(node: Node, edges?: Edge[]): {
  id: string;
  type: string;
  content: string;
  connections: string[];
  position: { x: number; y: number };
  data?: Record<string, any>;
} {
  // Determine node type based on data or default to action
  const nodeType: string = (typeof node.data?.nodeType === 'string' ? node.data.nodeType : null) || 
                           (node.id === 'start' ? 'start' : 
                            node.id === 'end' ? 'end' : 
                            'action');
  
  // Get connections from edges
  const connections = edges ? getNodeConnections(edges, node.id) : [];
  
  return {
    id: node.id,
    type: nodeType,
    content: (node.data?.label as string) || '',
    connections: connections,
    position: node.position,
    data: {
      actions: node.data?.actions || [],
      label: node.data?.label,
      nodeType: nodeType,
      ...node.data
    }
  };
}

/**
 * Converts backend nodes with connections to ReactFlow edges
 * @param {Array} backendNodes - Array of backend nodes with connections
 * @returns {Edge[]} Array of ReactFlow edges
 */
export function convertBackendConnectionsToEdges(backendNodes: Array<{
  id: string;
  connections: string[];
}>): Edge[] {
  const edges: Edge[] = [];
  
  backendNodes.forEach(node => {
    node.connections.forEach(targetId => {
      edges.push({
        id: `edge-${node.id}-${targetId}`,
        source: node.id,
        target: targetId,
        type: 'default',
      });
    });
  });
  
  return edges;
}

/**
 * Converts a backend WorkflowNode to ReactFlow node format
 * @param {Object} backendNode - Backend node
 * @param {Function} onAddClick - Callback for add action button
 * @param {Function} onNameChange - Callback for name change
 * @returns {Node} ReactFlow-compatible node
 */
export function convertToReactFlowNode(
  backendNode: {
    id: string;
    type: string;
    content: string;
    connections: string[];
    position?: { x: number; y: number };
    data?: Record<string, any>;
  },
  onAddClick?: () => void,
  onNameChange?: (newName: string) => void
): Node {
  return {
    id: backendNode.id,
    type: 'defaultNode', // Always use defaultNode for rendering
    position: backendNode.position || { x: 100, y: 100 },
    data: {
      actions: backendNode.data?.actions || [],
      label: backendNode.content || backendNode.data?.label || 'Nodo',
      onAddClick,
      onNameChange,
      // Preserve all other data
      ...backendNode.data
    }
  };
}

// ============================================
// Date & Time Utilities
// ============================================

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Gets relative time string (e.g., "hace 2 horas")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'justo ahora';
    if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}
