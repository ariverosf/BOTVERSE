import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { Node, NodeProps } from "@xyflow/react";

type DefaultNodeProps = Node<{
  label?: string;
  onAddClick?: () => void;
}, 'label'>;

export default function DefaultNode(props: NodeProps<DefaultNodeProps>) {
  const [nodeName, setNodeName] = useState(props.data?.label ?? "");
  const [editingNodeName, setEditingNodeName] = useState(false);

  return (
    <div className="flex flex-col gap-2 bg-white/70 rounded-lg border p-2">
      <header className="flex flex-col gap-2">
        <h4 className="flex text-sm items-center text-gray-500 hover:text-black transition" hidden={editingNodeName} onClick={() => setEditingNodeName(true)}>
          <EllipsisVerticalIcon className="w-4" /> { props.data?.label ?? "Nombre del nodo"}
        </h4>
        <Input onBlur={() => setEditingNodeName(false)} placeholder="Nombre del nodo" hidden={!editingNodeName} value={nodeName} onChange={(e) => setNodeName(e.target.value)} />
      </header>
      <Button onClick={props.data.onAddClick} className="justify-start border-dashed text-gray-500" variant="outline" size="sm">
        <PlusIcon /> Añadir acción
      </Button>
    </div>
  );
}