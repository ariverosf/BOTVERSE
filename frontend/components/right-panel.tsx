import { useWorkflowStore } from "@/store/workflowStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

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
      console.log(node?.data?.actions )
    }
  }, [nodeName]);

  const dict = {
    "text": "Configuración de mensaje",
    "video": "Configuración de video",
    "audio": "Configuración de audio",
    "action": "Configuración de accion",
    "file": "Configuración de archivo",
    "choice": "Configuración de opciones"
  };

  const onAddChoiceOption = (index: number) => {
    if (node && selectedNode) {
      const actions: any[] = (node.data?.actions as []) ?? [];
      actions[index]["value"] = {
        choices: [...(actions[index]["value"]?.choices ?? []), ""]
      };
      changeNode(selectedNode, {
        ...node,
        data: {
          ...node.data,
          actions: actions
        }
      });
    }
  }

  const onChangeChoiceText = (actionIndex: number, choiceIndex: number, text: string) => {
    if (node && selectedNode) {
      const actions: any[] = (node.data?.actions as []) ?? [];
      actions[actionIndex]["value"] = {
        choices: actions[actionIndex]["value"]?.choices ?? []
      };
      actions[actionIndex]["value"]["choices"][choiceIndex] = text;
      changeNode(selectedNode, {
        ...node,
        data: {
          ...node.data,
          actions: actions
        }
      });
    }
  }

  const onChangeMessageText = (actionIndex: number, text: string) => {
    if (node && selectedNode) {
      const actions: any[] = (node.data?.actions as []) ?? [];
      actions[actionIndex]["value"] = text;
      changeNode(selectedNode, {
        ...node,
        data: {
          ...node.data,
          actions: actions
        }
      });
    }
  }

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
              (node?.data?.actions as { subtype: keyof typeof dict, type: string, value: any }[])?.map((action, i) => (
                <div key={`action-${action.subtype}-${i}`} className="flex flex-col gap-2">
                  <Label>{ dict[action.subtype] ?? "Configuración" }</Label>
                  {
                    action.type === "message" && (
                      <Input value={action.value} onChange={(e) => onChangeMessageText(i, e.currentTarget.value)} />
                    )
                  }
                  {
                    action.type === "capture-info" && (
                      <div className="flex flex-col gap-2">
                        {
                          action.value?.choices?.map((opt, j) => (
                            <Input key={`${selectedNode}-${action.type}-${action.subtype}-${i}-${j}`} value={opt} onChange={(e) => onChangeChoiceText(i, j, e.currentTarget.value)} />
                          ))
                        }
                        <Button onClick={() => onAddChoiceOption(i)}>Agregar opción <PlusIcon /></Button>
                      </div>
                    )
                  }
                </div>
              ))
            }
        </TabsContent>
      </Tabs>

    </div>
  );
}