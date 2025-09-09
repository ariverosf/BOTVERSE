import { Button } from "@/components/ui/button";
import { HelpCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Flow } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type DebugPanelProps = {
  currentFlow: Flow | null
}

export default function DebugPanel({ currentFlow }: DebugPanelProps) {
  return (
    <div className="bg-white border-t border-slate-200 shadow-lg">
      <Tabs defaultValue="logs" className="h-full">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-gradient-to-r from-gray-50 to-white">
          <TabsList className="h-9 bg-white shadow-sm">
            <TabsTrigger
              value="logs"
              className="text-xs font-medium data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Registros
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-xs font-medium data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              Eventos
            </TabsTrigger>
            <TabsTrigger
              value="json"
              className="text-xs font-medium data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              JSON
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-teal-500 hover:bg-teal-500 hover:text-white font-medium"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        </div>

        <TabsContent value="logs" className="p-4">
          <ScrollArea className="h-32">
            <div className="space-y-1 text-xs font-mono">
              <div className="text-gray-500 flex items-center space-x-2">
                <span className="text-teal-500">[14:32:15]</span>
                <span>Bot iniciado correctamente</span>
              </div>
              <div className="text-teal-500 flex items-center space-x-2">
                <span className="text-teal-500">[14:32:16]</span>
                <span>Nodo 'Inicio' ejecutado</span>
              </div>
              <div className="text-gray-500 flex items-center space-x-2">
                <span className="text-teal-500">[14:32:17]</span>
                <span>Esperando interacción del usuario</span>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="events" className="p-4">
          <div className="text-xs text-gray-500 text-center py-8">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            No hay eventos recientes
          </div>
        </TabsContent>

        <TabsContent value="json" className="p-4">
          <ScrollArea className="h-32">
            <pre className="text-xs text-allox-dark-gray bg-gray-50 p-3 rounded-lg">
              { JSON.stringify(currentFlow) }
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}