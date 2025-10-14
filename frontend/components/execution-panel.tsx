"use client"

import { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { workflowApi } from '@/lib/api';
import { FlowExecutionResult, NodeExecutionResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, XCircle, Loader2, Bot, User, MessageSquare } from 'lucide-react';

interface ExecutionPanelProps {
  projectId?: string;
  flowId?: string;
  flowName?: string;
  nodes?: Node[];
  edges?: Edge[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  nodeId?: string;
  nodeType?: string;
  status?: 'success' | 'error' | 'running' | 'pending' | 'skipped';
}

export default function ExecutionPanel({ projectId, flowId, flowName, nodes, edges }: ExecutionPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [, setExecutionResult] = useState<FlowExecutionResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to create message content from action
  const createMessageFromAction = (action: Record<string, unknown>): string | null => {
    if (!action || !action.type) return null;

    // Debug: Log the action to see what data we have
    console.log('Processing action:', action);

    switch (action.type) {
      case 'send-text':
        const textContent = action.text || action.content || action.message || action.label || 'Mensaje de texto';
        return `💬 ${textContent}`;
      
      case 'send-video':
        const videoUrl = action.videoUrl || action.url || action.video || 'video.mp4';
        return `🎥 Video enviado: ${videoUrl}`;
      
      case 'send-audio':
        const audioUrl = action.audioUrl || action.url || action.audio || 'audio.mp3';
        return `🎵 Audio enviado: ${audioUrl}`;
      
      case 'send-image':
        const imageUrl = action.imageUrl || action.url || action.image || 'imagen.jpg';
        return `🖼️ Imagen enviada: ${imageUrl}`;
      
      case 'send-file':
        const fileName = action.fileName || action.name || action.file || 'archivo.pdf';
        return `📎 Archivo enviado: ${fileName}`;
      
      case 'send-location':
        const lat = action.latitude || action.lat || '0';
        const lng = action.longitude || action.lng || '0';
        return `📍 Ubicación enviada: ${lat}, ${lng}`;
      
      case 'ai-task':
        const taskContent = action.task || action.prompt || action.message || action.label || 'Tarea de IA ejecutada';
        return `🤖 ${taskContent}`;
      
      case 'ai-generate-text':
        const generatedText = action.generatedText || action.text || action.content || action.message || 'Texto generado por IA';
        return `✨ ${generatedText}`;
      
      case 'get-record':
        const recordId = action.recordId || action.id || action.record || 'ID: 12345';
        return `📊 Registro obtenido: ${recordId}`;
      
      case 'insert-record':
        const tableName = action.tableName || action.table || action.name || 'tabla';
        return `➕ Registro insertado: ${tableName}`;
      
      case 'update-record':
        const updateId = action.recordId || action.id || action.record || 'ID: 12345';
        return `✏️ Registro actualizado: ${updateId}`;
      
      case 'delete-record':
        const deleteId = action.recordId || action.id || action.record || 'ID: 12345';
        return `🗑️ Registro eliminado: ${deleteId}`;
      
      case 'find-record':
        const query = action.query || action.search || action.filter || 'consulta';
        return `🔍 Búsqueda realizada: ${query}`;
      
      case 'configure-webchat':
        const config = action.config || action.configuration || action.settings || 'configuración';
        return `⚙️ WebChat configurado: ${config}`;
      
      case 'show-webchat':
        return `👁️ WebChat mostrado`;
      
      case 'hide-webchat':
        return `🙈 WebChat ocultado`;
      
      case 'toggle-webchat':
        return `🔄 WebChat alternado`;
      
      case 'get-user-data':
        const userId = action.userId || action.id || action.user || 'ID: 12345';
        return `👤 Datos de usuario obtenidos: ${userId}`;
      
      case 'send-custom-event':
        const eventName = action.eventName || action.event || action.name || 'evento';
        return `🎯 Evento personalizado: ${eventName}`;
      
      case 'intent':
        const intentName = action.intentName || action.intent || action.name || 'intención';
        return `🎯 Intención detectada: ${intentName}`;
      
      case 'expression':
        const expression = action.expression || action.expr || action.formula || 'x + y';
        return `🧮 Expresión evaluada: ${expression}`;
      
      case 'single-option':
        const option = action.option || action.choice || action.value || 'opción';
        return `☑️ Opción única: ${option}`;
      
      case 'multiple-options':
        const options = action.options || action.choices || action.values || ['opciones'];
        return `☑️ Múltiples opciones: ${Array.isArray(options) ? options.join(', ') : options}`;
      
      case 'boolean':
        const boolValue = action.value !== undefined ? action.value : action.boolean;
        return `✅ Booleano: ${boolValue ? 'Verdadero' : 'Falso'}`;
      
      case 'confirmation':
        const confirmMessage = action.message || action.text || action.content || '¿Confirmar?';
        return `❓ Confirmación: ${confirmMessage}`;
      
      default:
        // Try to get any meaningful content from the action
        const fallbackContent = action.message || action.text || action.content || action.label || action.name || 'Acción ejecutada';
        return `🔧 ${action.type}: ${fallbackContent}`;
    }
  };

  const handleExecute = async () => {
    if (!projectId || !flowId) {
      setError('No hay flujo seleccionado para ejecutar');
      return;
    }

    setIsExecuting(true);
    setError(null);
    setExecutionResult(null);
    setChatMessages([]);

    // Add initial system message
    const initialMessage: ChatMessage = {
      id: 'system-start',
      type: 'system',
      content: '🚀 Iniciando simulación del flujo...',
      timestamp: new Date().toISOString(),
    };
    setChatMessages([initialMessage]);

    try {
      let response;
      
      // Use test execution if we have nodes and edges, otherwise use flow execution
      if (nodes && nodes.length > 0) {
        // Convert ReactFlow nodes to backend format
        const backendNodes = nodes.map(node => {
          const nodeType: string = (typeof node.data?.nodeType === 'string' ? node.data.nodeType : null) || 
                               (node.id === 'start' ? 'start' : 
                                node.id === 'end' ? 'end' : 
                                'action');
          return {
            id: node.id,
            type: nodeType as 'start' | 'end' | 'action' | 'condition' | 'response',
            content: (node.data?.label as string) || '',
            connections: [],
            position: node.position,
            data: {
              actions: node.data?.actions || [],
              label: node.data?.label,
              nodeType: nodeType,
              ...node.data
            }
          };
        });
        
        response = await workflowApi.testExecuteNodes(backendNodes, edges);
      } else if (projectId && flowId) {
        response = await workflowApi.executeFlow(projectId, flowId);
      } else {
        throw new Error('No workflow data available for execution');
      }
      
      setExecutionResult(response.data);
      
      // Convert execution results to chat messages
      const messages: ChatMessage[] = [initialMessage];
      
      response.data.node_results.forEach((nodeResult: NodeExecutionResult) => {
        // Add user input simulation for start nodes
        if (nodeResult.node_type === 'start') {
          messages.push({
            id: `user-${nodeResult.node_id}`,
            type: 'user',
            content: '👤 Usuario inicia conversación',
            timestamp: new Date().toISOString(),
            nodeId: nodeResult.node_id,
            status: 'success'
          });
        }

        // Parse node output to create proper message bubbles
        if (nodeResult.output) {
          // Debug: Log the raw output
          console.log('Raw node output:', nodeResult.output);
          
          // Try to parse the output as JSON to extract action details
          try {
            const outputData = JSON.parse(nodeResult.output);
            console.log('Parsed output data:', outputData);
            
            // Handle different action types
            if (outputData.actions && Array.isArray(outputData.actions)) {
              console.log('Found actions:', outputData.actions);
              outputData.actions.forEach((action: Record<string, unknown>, actionIndex: number) => {
                const messageContent = createMessageFromAction(action);
                if (messageContent) {
                  messages.push({
                    id: `bot-${nodeResult.node_id}-${actionIndex}`,
                    type: 'bot',
                    content: messageContent,
                    timestamp: new Date().toISOString(),
                    nodeId: nodeResult.node_id,
                    nodeType: nodeResult.node_type,
                    status: nodeResult.status
                  });
                }
              });
            } else {
              // Fallback to raw output
              console.log('No actions found, using raw output');
              messages.push({
                id: `bot-${nodeResult.node_id}`,
                type: 'bot',
                content: nodeResult.output,
                timestamp: new Date().toISOString(),
                nodeId: nodeResult.node_id,
                nodeType: nodeResult.node_type,
                status: nodeResult.status
              });
            }
          } catch (error) {
            console.log('Failed to parse JSON, using raw output:', error);
            // If not JSON, treat as plain text message
            messages.push({
              id: `bot-${nodeResult.node_id}`,
              type: 'bot',
              content: nodeResult.output,
              timestamp: new Date().toISOString(),
              nodeId: nodeResult.node_id,
              nodeType: nodeResult.node_type,
              status: nodeResult.status
            });
          }
        }

        // Add system messages for errors
        if (nodeResult.error) {
          messages.push({
            id: `error-${nodeResult.node_id}`,
            type: 'system',
            content: `❌ Error: ${nodeResult.error}`,
            timestamp: new Date().toISOString(),
            nodeId: nodeResult.node_id,
            status: 'error'
          });
        }
      });

      // Add completion message
      messages.push({
        id: 'system-complete',
        type: 'system',
        content: `✅ Simulación completada (${response.data.total_execution_time_ms}ms)`,
        timestamp: new Date().toISOString(),
      });

      setChatMessages(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ejecutar el flujo');
      setChatMessages(prev => [...prev, {
        id: 'system-error',
        type: 'system',
        content: `❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`,
        timestamp: new Date().toISOString(),
        status: 'error'
      }]);
    } finally {
      setIsExecuting(false);
    }
  };

  const getMessageIcon = (type: string, status?: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'bot':
        return <Bot className="w-4 h-4 text-green-500" />;
      case 'system':
        if (status === 'error') {
          return <XCircle className="w-4 h-4 text-red-500" />;
        }
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  // const getMessageStyle = (type: string, status?: string) => {
  //   switch (type) {
  //     case 'user':
  //       return 'bg-blue-500 text-white';
  //     case 'bot':
  //       return status === 'error' 
  //         ? 'bg-red-100 text-red-800 border-red-200' 
  //         : 'bg-green-100 text-green-800 border-green-200';
  //     case 'system':
  //       return status === 'error'
  //         ? 'bg-red-50 text-red-700 border-red-200'
  //         : 'bg-gray-50 text-gray-700 border-gray-200';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-allox-teal/5 to-allox-lime/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-allox-dark-gray">Simulación de ChatBot</h3>
            {flowName && <p className="text-sm text-gray-500">{flowName}</p>}
          </div>
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !projectId || !flowId}
            className="gap-2 bg-allox-teal hover:bg-allox-dark-teal text-white shadow-md border-0 min-w-[140px] h-10"
            style={{ 
              backgroundColor: '#10B981', 
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Simular Conversación
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Fallback Button - Always Visible */}
      <div className="p-4 bg-yellow-50 border-b border-yellow-200">
        <button
          onClick={handleExecute}
          disabled={isExecuting || !projectId || !flowId}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Simulando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Simular Conversación
            </span>
          )}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {chatMessages.length > 0 ? (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-4 rounded-2xl text-sm font-medium shadow-sm border ${
                      message.type === 'user'
                        ? 'bg-allox-teal text-white rounded-br-md'
                        : message.type === 'bot'
                        ? 'bg-gray-100 text-allox-dark-gray border-gray-200 rounded-bl-md'
                        : 'bg-yellow-50 text-yellow-800 border-yellow-200 rounded-lg'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {getMessageIcon(message.type, message.status)}
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.nodeId && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs opacity-75">
                              <span className="font-mono">{message.nodeType}</span> • {message.nodeId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay conversación simulada</p>
              <p className="text-sm text-gray-400">
                {projectId && flowId 
                  ? 'Haz clic en "Simular Conversación" para ver el flujo del ChatBot'
                  : 'Selecciona un flujo para comenzar'}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 border-t border-red-200 bg-red-50">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error en la simulación</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

