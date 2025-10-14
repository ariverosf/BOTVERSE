import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { Node, NodeProps, Handle, Position } from "@xyflow/react";

type Action = {
  id: string;
  type: string;
  label: string;
};

type DefaultNodeProps = Node<{
  actions?: Action[];
  label?: string;
  onAddClick?: () => void;
  onNameChange?: (newName: string) => void;
  isStartNode?: boolean;
  isEndNode?: boolean;
}, 'label'>;

export default function DefaultNode(props: NodeProps<DefaultNodeProps>) {
  const [editingNodeName, setEditingNodeName] = useState(false);
  const actions = props.data?.actions || [];
  const nodeName = props.data?.label || "Nodo";
  const isStartNode = props.data?.isStartNode || false;
  const isEndNode = props.data?.isEndNode || false;

  // Different styling for start and end nodes
  const getNodeStyling = () => {
    if (isStartNode) {
      return "flex flex-col gap-2 bg-green-50 border-green-200 rounded-lg border-2 p-2 relative";
    } else if (isEndNode) {
      return "flex flex-col gap-2 bg-red-50 border-red-200 rounded-lg border-2 p-2 relative";
    }
    return "flex flex-col gap-2 bg-white/70 rounded-lg border p-2 relative";
  };

  return (
    <div className={getNodeStyling()}>
      {/* Source handle for outgoing connections - only for start and action nodes */}
      {!isEndNode && (
        <Handle
          type="source"
          position={Position.Right}
          id="source"
          className="w-3 h-3 bg-allox-teal border-2 border-white cursor-crosshair"
          style={{ cursor: 'crosshair' }}
        />
      )}
      
      {/* Target handle for incoming connections - only for end and action nodes */}
      {!isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          id="target"
          className="w-3 h-3 bg-allox-lime border-2 border-white cursor-crosshair"
          style={{ cursor: 'crosshair' }}
        />
      )}
      
      <header className="flex flex-col gap-2">
        <h4 className={`flex text-sm items-center transition ${isStartNode ? 'text-green-700 hover:text-green-900' : isEndNode ? 'text-red-700 hover:text-red-900' : 'text-gray-500 hover:text-black'}`} hidden={editingNodeName} onClick={() => setEditingNodeName(true)}>
          <EllipsisVerticalIcon className="w-4" /> {nodeName}
        </h4>
        <Input 
          onBlur={() => setEditingNodeName(false)} 
          placeholder="Nombre del nodo" 
          hidden={!editingNodeName} 
          value={nodeName} 
          onChange={(e) => {
            if (props.data?.onNameChange) {
              props.data.onNameChange(e.target.value);
            }
          }} 
        />
      </header>
      
      {/* Display list of actions - only for action nodes */}
      {actions.length > 0 && (
        <div className="flex flex-col gap-1">
          {actions.map((action) => (
            <div key={action.id} className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-700">
              {action.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Show "Añadir acción" button only for action nodes (not start/end) */}
      {!isStartNode && !isEndNode && (
        <Button onClick={props.data.onAddClick} className="justify-start border-dashed text-gray-500" variant="outline" size="sm">
          <PlusIcon /> Añadir acción
        </Button>
      )}
      
      {/* Show special text for start and end nodes */}
      {(isStartNode || isEndNode) && (
        <div className={`text-xs px-2 py-1 rounded ${isStartNode ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isStartNode ? '🚀 Punto de inicio del flujo' : '🏁 Punto final del flujo'}
        </div>
      )}
    </div>
  );
}