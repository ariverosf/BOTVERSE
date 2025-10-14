import { Input } from "@/components/ui/input";
import { FileText, Video, AudioLines, Image, MapPin, Code, Database, Share2, Sparkle, GitBranch, Ear } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Node } from "@xyflow/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import ExecutionPanel from "./execution-panel";

type RightPanelProps = {
  selectedNode?: Node | null;
  onNodeUpdate?: (nodeId: string, updates: any) => void;
  workflow?: any;
  nodes?: Node[];
  edges?: any[];
  onTestFlow?: () => void;
}

// Action configuration components
const SendTextConfig = React.memo(({ action, onConfigChange }: { action: any; onConfigChange: (config: any) => void }) => {
  const [message, setMessage] = useState(action?.config?.message || '');
  const [delay, setDelay] = useState(action?.config?.delay || 0);
  const actionIdRef = useRef(action?.id);

  // Sync local state with action data only when action ID changes (not during typing)
  useEffect(() => {
    if (actionIdRef.current !== action?.id) {
      actionIdRef.current = action?.id;
      setMessage(action?.config?.message || '');
      setDelay(action?.config?.delay || 0);
    }
  }, [action?.id, action?.config?.message, action?.config?.delay]);

  const handleConfigChange = useCallback((field: string, value: any) => {
    const newConfig = { ...action?.config, [field]: value };
    onConfigChange(newConfig);
  }, [action?.config, onConfigChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-message">Mensaje de texto</Label>
        <textarea
          id="text-message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleConfigChange('message', e.target.value);
          }}
          className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none"
          placeholder="Escribe el mensaje que enviará el bot..."
        />
      </div>
      <div>
        <Label htmlFor="text-delay">Retraso (segundos)</Label>
        <Input
          id="text-delay"
          type="number"
          value={delay}
          onChange={(e) => {
            setDelay(Number(e.target.value));
            handleConfigChange('delay', Number(e.target.value));
          }}
          placeholder="0"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
});

const SendVideoConfig = React.memo(({ action, onConfigChange }: { action: any; onConfigChange: (config: any) => void }) => {
  const [url, setUrl] = useState(action?.config?.url || '');
  const [caption, setCaption] = useState(action?.config?.caption || '');
  const actionIdRef = useRef(action?.id);

  // Sync local state with action data only when action ID changes (not during typing)
  useEffect(() => {
    if (actionIdRef.current !== action?.id) {
      actionIdRef.current = action?.id;
      setUrl(action?.config?.url || '');
      setCaption(action?.config?.caption || '');
    }
  }, [action?.id, action?.config?.url, action?.config?.caption]);

  const handleConfigChange = useCallback((field: string, value: any) => {
    const newConfig = { ...action?.config, [field]: value };
    onConfigChange(newConfig);
  }, [action?.config, onConfigChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="video-url">URL del video</Label>
        <Input
          id="video-url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            handleConfigChange('url', e.target.value);
          }}
          placeholder="https://example.com/video.mp4"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="video-caption">Descripción del video</Label>
        <Input
          id="video-caption"
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            handleConfigChange('caption', e.target.value);
          }}
          placeholder="Descripción opcional del video"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
});

const SendAudioConfig = React.memo(({ action, onConfigChange }: { action: any; onConfigChange: (config: any) => void }) => {
  const [url, setUrl] = useState(action?.config?.url || '');
  const [duration, setDuration] = useState(action?.config?.duration || 0);
  const actionIdRef = useRef(action?.id);

  // Sync local state with action data only when action ID changes (not during typing)
  useEffect(() => {
    if (actionIdRef.current !== action?.id) {
      actionIdRef.current = action?.id;
      setUrl(action?.config?.url || '');
      setDuration(action?.config?.duration || 0);
    }
  }, [action?.id, action?.config?.url, action?.config?.duration]);

  const handleConfigChange = useCallback((field: string, value: any) => {
    const newConfig = { ...action?.config, [field]: value };
    onConfigChange(newConfig);
  }, [action?.config, onConfigChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audio-url">URL del audio</Label>
        <Input
          id="audio-url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            handleConfigChange('url', e.target.value);
          }}
          placeholder="https://example.com/audio.mp3"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="audio-duration">Duración (segundos)</Label>
        <Input
          id="audio-duration"
          type="number"
          value={duration}
          onChange={(e) => {
            setDuration(Number(e.target.value));
            handleConfigChange('duration', Number(e.target.value));
          }}
          placeholder="0"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
});

const SendImageConfig = React.memo(({ action, onConfigChange }: { action: any; onConfigChange: (config: any) => void }) => {
  const [url, setUrl] = useState(action?.config?.url || '');
  const [caption, setCaption] = useState(action?.config?.caption || '');
  const actionIdRef = useRef(action?.id);

  // Sync local state with action data only when action ID changes (not during typing)
  useEffect(() => {
    if (actionIdRef.current !== action?.id) {
      actionIdRef.current = action?.id;
      setUrl(action?.config?.url || '');
      setCaption(action?.config?.caption || '');
    }
  }, [action?.id, action?.config?.url, action?.config?.caption]);

  const handleConfigChange = useCallback((field: string, value: any) => {
    const newConfig = { ...action?.config, [field]: value };
    onConfigChange(newConfig);
  }, [action?.config, onConfigChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-url">URL de la imagen</Label>
        <Input
          id="image-url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            handleConfigChange('url', e.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="image-caption">Descripción de la imagen</Label>
        <Input
          id="image-caption"
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            handleConfigChange('caption', e.target.value);
          }}
          placeholder="Descripción opcional de la imagen"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
});

const ExecuteCodeConfig = React.memo(({ action, onConfigChange }: { action: any; onConfigChange: (config: any) => void }) => {
  const [language, setLanguage] = useState(action?.config?.language || 'javascript');
  const [script, setScript] = useState(action?.config?.script || '');
  const actionIdRef = useRef(action?.id);

  // Sync local state with action data only when action ID changes (not during typing)
  useEffect(() => {
    if (actionIdRef.current !== action?.id) {
      actionIdRef.current = action?.id;
      setLanguage(action?.config?.language || 'javascript');
      setScript(action?.config?.script || '');
    }
  }, [action?.id, action?.config?.language, action?.config?.script]);

  const handleConfigChange = useCallback((field: string, value: any) => {
    const newConfig = { ...action?.config, [field]: value };
    onConfigChange(newConfig);
  }, [action?.config, onConfigChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="code-language">Lenguaje de programación</Label>
        <select
          id="code-language"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            handleConfigChange('language', e.target.value);
          }}
          className="w-full p-3 border border-gray-200 rounded-lg focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
        </select>
      </div>
      <div>
        <Label htmlFor="code-script">Código a ejecutar</Label>
        <textarea
          id="code-script"
          value={script}
          onChange={(e) => {
            setScript(e.target.value);
            handleConfigChange('script', e.target.value);
          }}
          className="w-full p-3 border border-gray-200 rounded-lg resize-none h-32 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none font-mono"
          placeholder="console.log('Hello World');"
        />
      </div>
    </div>
  );
});

function DatabaseConfig() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="db-connection">Conexión a base de datos</Label>
        <Input
          id="db-connection"
          placeholder="mysql://user:pass@localhost:3306/db"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="db-query">Consulta SQL</Label>
        <textarea
          id="db-query"
          className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none font-mono"
          placeholder="SELECT * FROM users WHERE id = ?"
        />
      </div>
    </div>
  );
}

function WebChatConfig() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="webchat-title">Título del chat</Label>
        <Input
          id="webchat-title"
          placeholder="¿En qué puedo ayudarte?"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="webchat-color">Color del chat</Label>
        <Input
          id="webchat-color"
          type="color"
          defaultValue="#3B82F6"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
}

function AIConfig() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ai-prompt">Prompt para IA</Label>
        <textarea
          id="ai-prompt"
          className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none"
          placeholder="Escribe el prompt que se enviará a la IA..."
        />
      </div>
      <div>
        <Label htmlFor="ai-model">Modelo de IA</Label>
        <select
          id="ai-model"
          className="w-full p-3 border border-gray-200 rounded-lg focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-3">Claude 3</option>
        </select>
      </div>
    </div>
  );
}

function FlowLogicConfig() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="flow-condition">Condición</Label>
        <Input
          id="flow-condition"
          placeholder="user.age > 18"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="flow-true-path">Ruta si es verdadero</Label>
        <Input
          id="flow-true-path"
          placeholder="node-id-1"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="flow-false-path">Ruta si es falso</Label>
        <Input
          id="flow-false-path"
          placeholder="node-id-2"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
}

function InformationCaptureConfig() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="capture-question">Pregunta</Label>
        <Input
          id="capture-question"
          placeholder="¿Cuál es tu nombre?"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
      <div>
        <Label htmlFor="capture-validation">Validación</Label>
        <Input
          id="capture-validation"
          placeholder="required|min:2|max:50"
          className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20"
        />
      </div>
    </div>
  );
}

// Separate component to handle action configuration rendering
const ActionConfigRenderer = React.memo(({ action, onConfigChange, getActionConfig }: { 
  action: any; 
  onConfigChange: (config: any) => void; 
  getActionConfig: (actionType: string) => React.ComponentType<{ action: any; onConfigChange: (config: any) => void }>;
}) => {
  const ConfigComponent = getActionConfig(action.type);
  return React.createElement(ConfigComponent, {
    action,
    onConfigChange
  });
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.action?.id === nextProps.action?.id &&
    prevProps.action?.type === nextProps.action?.type &&
    JSON.stringify(prevProps.action?.config) === JSON.stringify(nextProps.action?.config)
  );
});

// Separate component for action selection to prevent re-renders
const ActionSelector = React.memo(({ 
  actions, 
  selectedAction, 
  onActionSelect, 
  getActionIcon 
}: { 
  actions: any[]; 
  selectedAction: any; 
  onActionSelect: (action: any) => void; 
  getActionIcon: (actionType: string) => React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const ActionIcon = getActionIcon(action.type);
        return (
          <div
            key={action.id}
            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedAction?.id === action.id
                ? 'border-allox-teal bg-allox-teal/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onActionSelect(selectedAction?.id === action.id ? null : action)}
          >
            <ActionIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 flex-1">
              {action.label}
            </span>
            <span className="text-xs text-gray-500">
              {action.type}
            </span>
          </div>
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.actions.length === nextProps.actions.length &&
    prevProps.selectedAction?.id === nextProps.selectedAction?.id
  );
});

const RightPanel = React.memo(({ selectedNode, onNodeUpdate, workflow, nodes = [], edges = [], onTestFlow }: RightPanelProps) => {
  const [nodeName, setNodeName] = useState("");
  const [selectedAction, setSelectedAction] = useState<any>(null);

  // Use ref to maintain selectedAction state across re-renders
  const selectedActionRef = useRef<any>(null);
  
  // Update ref when selectedAction changes
  useEffect(() => {
    selectedActionRef.current = selectedAction;
  }, [selectedAction]);

  // Track the node ID to only reset selectedAction when switching to a different node
  const selectedNodeIdRef = useRef(selectedNode?.id);
  
  useEffect(() => {
    setNodeName(selectedNode?.data?.label as string ?? "");
    
    // Only reset selected action when switching to a different node, not when node data changes
    if (selectedNodeIdRef.current !== selectedNode?.id) {
      selectedNodeIdRef.current = selectedNode?.id;
      setSelectedAction(null);
    }
  }, [selectedNode]);

  // Handle node name change
  const handleNodeNameChange = useCallback((newName: string) => {
    setNodeName(newName);
    if (selectedNode && onNodeUpdate) {
      onNodeUpdate(selectedNode.id, { label: newName });
    }
  }, [selectedNode, onNodeUpdate]);

  const selectedNodeRef = useRef(selectedNode);
  
  // Update refs when values change
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  const handleActionConfigChange = useCallback((config: any) => {
    // Update the action in the node using refs to avoid dependency issues
    const currentNode = selectedNodeRef.current;
    const currentAction = selectedActionRef.current;
    
    if (currentNode && onNodeUpdate && currentAction) {
      const updatedActions = (currentNode.data.actions as any[]).map((action: any) => 
        action.id === currentAction.id 
          ? { ...action, config }
          : action
      );
      onNodeUpdate(currentNode.id, { actions: updatedActions });
    }
  }, [onNodeUpdate]);

  // Stable action selection callback
  const handleActionSelect = useCallback((action: any) => {
    setSelectedAction(action);
  }, []);

  // Get action configuration component based on action type
  const getActionConfig = useCallback((actionType: string) => {
    const configMap: Record<string, React.ComponentType<{ action: any; onConfigChange: (config: any) => void }>> = {
      'send-text': SendTextConfig,
      'send-video': SendVideoConfig,
      'send-audio': SendAudioConfig,
      'send-image': SendImageConfig,
      'send-file': SendTextConfig, // Use text config as fallback
      'send-location': SendTextConfig,
      'send-action': SendTextConfig,
      'execute-code': ExecuteCodeConfig,
      'get-record': DatabaseConfig,
      'insert-record': DatabaseConfig,
      'update-record': DatabaseConfig,
      'delete-record': DatabaseConfig,
      'find-record': DatabaseConfig,
      'configure-webchat': WebChatConfig,
      'show-webchat': WebChatConfig,
      'hide-webchat': WebChatConfig,
      'toggle-webchat': WebChatConfig,
      'get-user-data': WebChatConfig,
      'send-custom-event': WebChatConfig,
      'ai-task': AIConfig,
      'ai-generate-text': AIConfig,
      'ai-transition': AIConfig,
      'intent': FlowLogicConfig,
      'expression': FlowLogicConfig,
      'single-option': InformationCaptureConfig,
      'multiple-options': InformationCaptureConfig,
      'boolean': InformationCaptureConfig,
      'confirmation': InformationCaptureConfig,
    };
    
    return configMap[actionType] || SendTextConfig;
  }, []);

  // Get action icon based on action type
  const getActionIcon = (actionType: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'send-text': FileText,
      'send-video': Video,
      'send-audio': AudioLines,
      'send-image': Image,
      'send-file': FileText,
      'send-location': MapPin,
      'send-action': FileText,
      'execute-code': Code,
      'get-record': Database,
      'insert-record': Database,
      'update-record': Database,
      'delete-record': Database,
      'find-record': Database,
      'configure-webchat': Share2,
      'show-webchat': Share2,
      'hide-webchat': Share2,
      'toggle-webchat': Share2,
      'get-user-data': Share2,
      'send-custom-event': Share2,
      'ai-task': Sparkle,
      'ai-generate-text': Sparkle,
      'ai-transition': Sparkle,
      'intent': GitBranch,
      'expression': GitBranch,
      'single-option': Ear,
      'multiple-options': Ear,
      'boolean': Ear,
      'confirmation': Ear,
    };
    
    return iconMap[actionType] || FileText;
  };

  return (
    <div hidden={!selectedNode} className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white font-medium"
            >
              Propiedades
            </TabsTrigger>
            <TabsTrigger
              value="simulation"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white font-medium"
            >
              Simulación
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="flex-1 p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-allox-dark-gray mb-2">
              Configuración del Nodo
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Configura las acciones y propiedades de este nodo
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="node-name">
                Nombre del Nodo
              </Label>
              <Input
                id="node-name"
                className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20 font-medium"
                value={nodeName}
                onChange={(e) => handleNodeNameChange(e.target.value)}
              />
            </div>

            {/* Show actions list if node has actions */}
            {selectedNode?.data?.actions && Array.isArray(selectedNode.data.actions) && selectedNode.data.actions.length > 0 && (
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Acciones del Nodo
              </Label>
                <ActionSelector 
                  actions={selectedNode.data.actions}
                  selectedAction={selectedAction}
                  onActionSelect={handleActionSelect}
                  getActionIcon={getActionIcon}
                />
              </div>
            )}

            {/* Show action configuration if an action is selected */}
            {selectedAction && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {(() => {
                    const ActionIcon = getActionIcon(selectedAction.type);
                    return <ActionIcon className="w-5 h-5 text-allox-teal" />;
                  })()}
                  <h4 className="text-lg font-semibold text-allox-dark-gray">
                    Configurar {selectedAction.label}
                  </h4>
                </div>
                <ActionConfigRenderer 
                  action={selectedAction}
                  onConfigChange={handleActionConfigChange}
                  getActionConfig={getActionConfig}
              />
            </div>
            )}

            {/* Show message if no actions */}
            {(!selectedNode?.data?.actions || !Array.isArray(selectedNode.data.actions) || selectedNode.data.actions.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Este nodo no tiene acciones configuradas.</p>
                <p className="text-xs mt-1">Haz clic en "Añadir acción" para comenzar.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="flex-1 flex flex-col">
          <ExecutionPanel 
            projectId={workflow?.id}
            flowId={workflow?.flows?.[0]?.id}
            flowName={workflow?.name}
            nodes={nodes}
            edges={edges}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - re-render when node data changes (including actions)
  return (
    prevProps.selectedNode?.id === nextProps.selectedNode?.id &&
    prevProps.workflow?.id === nextProps.workflow?.id &&
    (prevProps.nodes || []).length === (nextProps.nodes || []).length &&
    (prevProps.edges || []).length === (nextProps.edges || []).length &&
    // Also check if node data (including actions) has changed
    JSON.stringify(prevProps.selectedNode?.data) === JSON.stringify(nextProps.selectedNode?.data)
  );
});

export default RightPanel;