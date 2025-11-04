import { useWorkflowStore } from "@/store/workflowStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export default function RightPanel() {
  const { selectedNode, getSelectedNode, changeNode } = useWorkflowStore();
  const [nodeName, setNodeName] = useState("");

  const node = getSelectedNode();
  useEffect(() => {
    if (node) {
      setNodeName(node.data?.label as string ?? "");
    }
  }, [node])

  const handleNodeName = () => {
    if (node && node.data?.label && selectedNode) {
      changeNode(selectedNode, {
        ...node,
        data: {
          ...node.data,
          label: nodeName
        }
      })
    }
  };

  useEffect(() => {
    if (nodeName) {
      handleNodeName();
    }
  }, [nodeName]);

  const dict = {
    "text": "Configuración de mensaje",
    "video": "Configuración de video",
    "audio": "Configuración de audio",
    "action": "Configuración de accion",
    "file": "Configuración de archivo",
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="properties">Propiedades</TabsTrigger>
            <TabsTrigger value="emulator">Emulador</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="panel-node-name">Nombre del Nodo</Label>
            <Input id="panel-node-name" value={nodeName} onChange={(e) => setNodeName(e.currentTarget.value)} />
          </div>
            {
              (node?.data?.actions as { type: keyof typeof dict, value: string }[])?.map((action, i) => (
                <div key={`action-${action.type}-${i}`} className="flex flex-col gap-2">
                  <Label>{ dict[action.type] ?? "Configuración" }</Label>
                  <Input />
                </div>
              ))
            }
        </TabsContent>
      </Tabs>

    </div>
  );
}