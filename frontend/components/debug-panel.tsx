"use client"
import { useWorkflowStore } from "@/store/workflowStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AlertCircle, AlertTriangle, CheckCircle, Copy, Download, GripHorizontalIcon, HelpCircle, Info, Terminal, Trash2, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export default function DebugPanel() {
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [panelHeight, setPanelHeight] = useState(200); // Default height in pixels
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { getSelectedFlow, flows } = useWorkflowStore();

  const currentFlow = getSelectedFlow();

  const addLog = useCallback((log: any) => {
    const newLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
  };
  // Clear all events
  const clearEvents = () => {
    setEvents([]);
  };
  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newHeight = window.innerHeight - e.clientY;
    const minHeight = 150;
    const maxHeight = window.innerHeight * 0.8;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setPanelHeight(newHeight);
    }
  }, [isResizing]);

  const handleMouseUp = () => {
    setIsResizing(false);
  };
  
  // Add event to the events list
  const addEvent = useCallback((event: any) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
  }, []);

  // Add event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


  // Track flow changes
  useEffect(() => {
    if (currentFlow) {
      addEvent({
        type: 'workflow',
        action: 'Flujo cargado',
        details: `Flujo cargado: ${currentFlow.name} con ${currentFlow.nodes?.length || 0} nodos`,
        status: 'success',
        icon: '🔄'
      });

      addLog({
        level: 'success',
        message: `Flujo cargado: ${currentFlow.name}`,
        source: 'Administrador de flujos',
        details: `Nodos: ${currentFlow.nodes?.length || 0}`
      });
    }
  }, [currentFlow]);

  const handleCopyJSON = async () => {
    if (currentFlow) {
      await navigator.clipboard.writeText(JSON.stringify(currentFlow, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadJSON = () => {
    if (currentFlow) {
      const dataStr = JSON.stringify(currentFlow, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `workflow-${currentFlow.id || 'data'}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };
  return (
    <div 
      className="bg-white border-t border-slate-200 shadow-lg relative overflow-auto"
      style={{ height: `${panelHeight}px` }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className={`absolute top-0 left-0 right-0 h-1 bg-teal-500 cursor-ns-resize hover:bg-teal-600 transition-colors ${
          isResizing ? 'bg-teal-600' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
          <GripHorizontalIcon className="w-4 h-2 text-teal-600" />
        </div>
      </div>

      <Tabs defaultValue="logs" className="h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-linear-to-r from-gray-50 to-white  sticky top-0 z-10">
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
            onClick={() => {
              clearEvents();
              clearLogs();
            }}
            className="text-xs text-teal-500 hover:bg-teal-500 hover:text-white font-medium"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Limpiar
          </Button>
        </div>

        <TabsContent value="logs" className="flex-1 flex flex-col p-4">
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Logs Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium text-gray-700">
                  Registros del Sistema
                </span>
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                  {logs.length} logs
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLog({
                    level: 'debug',
                    message: 'Log de prueba agregado manualmente',
                    source: 'Debug Panel'
                  })}
                  className="text-xs h-7"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Test Log
                </Button>
              </div>
            </div>

            {/* Logs Display */}
            <ScrollArea className="flex-1">
              {logs.length === 0 ? (
                <div className="text-xs text-gray-500 text-center py-8">
                  <Terminal className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  No hay registros disponibles
                </div>
              ) : (
                <div className="space-y-1 text-xs font-mono">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start space-x-2 p-2 rounded ${
                        log.level === 'error' 
                          ? 'bg-red-50 text-red-800' 
                          : log.level === 'warning'
                          ? 'bg-yellow-50 text-yellow-800'
                          : log.level === 'success'
                          ? 'bg-green-50 text-green-800'
                          : log.level === 'debug'
                          ? 'bg-purple-50 text-purple-800'
                          : 'bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {log.level === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                        {log.level === 'warning' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                        {log.level === 'success' && <CheckCircle className="w-3 h-3 text-green-500" />}
                        {log.level === 'debug' && <Terminal className="w-3 h-3 text-purple-500" />}
                        {log.level === 'info' && <Info className="w-3 h-3 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-teal-500">
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.level === 'error' 
                              ? 'bg-red-100 text-red-700' 
                              : log.level === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : log.level === 'success'
                              ? 'bg-green-100 text-green-700'
                              : log.level === 'debug'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-xs opacity-75">
                            [{log.source}]
                          </span>
                        </div>
                        <div className="mt-1">
                          {log.message}
                        </div>
                        {log.details && (
                          <div className="mt-1 text-xs opacity-75">
                            {log.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Logs Summary */}
            {logs.length > 0 && (
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Total:</span> {logs.length} logs
                  </div>
                  <div>
                    <span className="font-medium">Último:</span> {logs[0] ? new Date(logs[0].timestamp).toLocaleString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Info:</span> {logs.filter(l => l.level === 'info').length}
                  </div>
                  <div>
                    <span className="font-medium">Éxitos:</span> {logs.filter(l => l.level === 'success').length}
                  </div>
                  <div>
                    <span className="font-medium">Advertencias:</span> {logs.filter(l => l.level === 'warning').length}
                  </div>
                  <div>
                    <span className="font-medium">Errores:</span> {logs.filter(l => l.level === 'error').length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="flex-1 flex flex-col p-4">
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Events Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Eventos del Sistema
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {events.length} eventos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addEvent({
                    type: 'info',
                    action: 'Test Event',
                    details: 'This is a test event to demonstrate the system',
                    status: 'info',
                    icon: '🧪'
                  })}
                  className="text-xs h-7"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Test
                </Button>
              </div>
            </div>

            {/* Events List */}
            <ScrollArea className="flex-1 min-h-0">
              {events.length === 0 ? (
                <div className="text-xs text-gray-500 text-center py-8">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  No hay eventos recientes
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border text-xs ${
                        event.status === 'success' 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : event.status === 'error'
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : event.status === 'warning'
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">{event.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{event.action}</span>
                            <span className="text-xs opacity-75">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="mt-1 text-xs opacity-90">
                            {event.details}
                          </div>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              event.status === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : event.status === 'error'
                                ? 'bg-red-100 text-red-700'
                                : event.status === 'warning'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {event.status}
                            </span>
                            <span className="text-xs opacity-75">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Events Summary */}
            {events.length > 0 && (
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Total:</span> {events.length} eventos
                  </div>
                  <div>
                    <span className="font-medium">Último:</span> {events[0] ? new Date(events[0].timestamp).toLocaleString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Éxitos:</span> {events.filter(e => e.status === 'success').length}
                  </div>
                  <div>
                    <span className="font-medium">Errores:</span> {events.filter(e => e.status === 'error').length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="json" className="flex-1 flex flex-col p-4">
          <div className="space-y-3 flex-1 flex flex-col">
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Flow Data
                </span>
                {currentFlow && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Live Data
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyJSON}
                  className="text-xs h-7"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadJSON}
                  className="text-xs h-7"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            {/* JSON Display */}
            <ScrollArea className="flex-1 min-h-0">
              <pre className="text-xs text-allox-dark-gray bg-gray-50 p-4 rounded-lg border overflow-x-auto">
                {JSON.stringify(currentFlow ?? {}, null, 2)}
              </pre>
            </ScrollArea>

            {/* Data Summary */}
            {currentFlow && (
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">ID:</span> {currentFlow.id}
                  </div>
                  <div>
                    <span className="font-medium">Nombre:</span> {currentFlow.name}
                  </div>
                  <div>
                    <span className="font-medium">Flujos:</span> {flows?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Creado:</span> {currentFlow?.created_at ? new Date(currentFlow.created_at).toLocaleString() : 'N/A'}
                  </div>
                </div>
                {flows && flows.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Nodos en flujo:</span> {currentFlow.nodes?.length || 0}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}