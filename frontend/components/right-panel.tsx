import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit3, Plus, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Node } from "@xyflow/react";

type RightPanelProps = {
  selectedNode?: Node | null;
}

export default function RightPanel({ selectedNode }: RightPanelProps) {
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?" },
  ])
  const [nodeName, setNodeName] = useState("")
  const [inputMessage, setInputMessage] = useState("")
  const sendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { type: "user", message: inputMessage },
        { type: "bot", message: "Gracias por tu mensaje. Esta es una respuesta de prueba del bot." },
      ])
      setInputMessage("")
    }
  }

  useEffect(() => {
    setNodeName(selectedNode?.data?.label as string ?? "");
  }, [selectedNode]);

  return (
    <div hidden={!selectedNode} className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-allox-teal data-[state=active]:text-white font-medium"
            >
              Propiedades
            </TabsTrigger>
            <TabsTrigger
              value="emulator"
              className="data-[state=active]:bg-allox-teal data-[state=active]:text-white font-medium"
            >
              Emulador
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="flex-1 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-allox-dark-gray mb-2">
              {selectedNode?.id === "start" ? "Configuración de Inicio" : "Configuración de Fin"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {selectedNode?.id === "start"
                ? "Configura cómo iniciará la conversación con tus usuarios"
                : "Define cómo terminará la conversación con tus usuarios"}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="node-name" className="text-sm font-semibold text-allox-dark-gray mb-2 block">
                Nombre del Nodo
              </Label>
              <Input
                id="node-name"
                className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20 font-medium"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                disabled={["start", "end"].includes(selectedNode?.id ?? "")}
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-semibold text-allox-dark-gray mb-2 block">
                Mensaje
              </Label>
              <textarea
                id="message"
                className="w-full p-4 border border-gray-200 rounded-lg resize-none h-28 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none font-medium"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emulator" className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-allox-teal/5 to-allox-lime/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-allox-lime rounded-full animate-pulse shadow-sm"></div>
                <div>
                  <span className="text-sm font-semibold text-allox-dark-gray">Emulador Activo</span>
                  <p className="text-xs text-gray-600">Prueba tu bot en tiempo real</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-allox-teal hover:bg-allox-teal hover:text-white">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-4 rounded-2xl text-sm font-medium shadow-sm ${
                      msg.type === "user"
                        ? "bg-allox-teal text-white rounded-br-md"
                        : "bg-gray-100 text-allox-dark-gray border border-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-200 bg-gray-50">
            <div className="flex space-x-3">
              <Input
                placeholder="Escribe un mensaje de prueba..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20 font-medium"
              />
              <Button
                size="sm"
                onClick={sendMessage}
                className="bg-allox-teal hover:bg-allox-dark-teal text-white px-4 shadow-md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}