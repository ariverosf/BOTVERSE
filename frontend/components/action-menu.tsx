import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "./ui/button";
import { AudioLinesIcon, EarIcon, FileIcon, GitBranchIcon, GitPullRequestArrowIcon, ImageIcon, MapPinIcon, Share2Icon, SparkleIcon, TableIcon, TextIcon, VideoIcon, ZapIcon } from "lucide-react";
import { useCallback } from "react";

// Action types for better type safety
export type ActionType = 
  | 'send-text' | 'send-video' | 'send-audio' | 'send-action' | 'send-file' | 'send-location' | 'send-image'
  | 'execute-code' | 'get-record' | 'insert-record' | 'update-record' | 'delete-record' | 'find-record'
  | 'configure-webchat' | 'show-webchat' | 'hide-webchat' | 'toggle-webchat' | 'get-user-data' | 'send-custom-event'
  | 'ai-task' | 'ai-generate-text' | 'ai-transition'
  | 'intent' | 'expression'
  | 'single-option' | 'multiple-options' | 'boolean' | 'confirmation';

interface ActionItem {
  id: ActionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  description: string;
}

type ActionMenuProps = {
  hidden?: boolean;
  onAddNode?: (actionType: ActionType) => void;
};

export default function ActionMenu({ hidden, onAddNode }: ActionMenuProps) {
  // Action items configuration
  const actionItems: ActionItem[] = [
    // Send Message Actions
    { id: 'send-text', label: 'Texto', icon: TextIcon, category: 'mensaje', description: 'Enviar mensaje de texto' },
    { id: 'send-video', label: 'Video', icon: VideoIcon, category: 'mensaje', description: 'Enviar video' },
    { id: 'send-audio', label: 'Audio', icon: AudioLinesIcon, category: 'mensaje', description: 'Enviar audio' },
    { id: 'send-action', label: 'Acción', icon: TextIcon, category: 'mensaje', description: 'Enviar acción' },
    { id: 'send-file', label: 'Archivo', icon: FileIcon, category: 'mensaje', description: 'Enviar archivo' },
    { id: 'send-location', label: 'Ubicación', icon: MapPinIcon, category: 'mensaje', description: 'Enviar ubicación' },
    { id: 'send-image', label: 'Imagen', icon: ImageIcon, category: 'mensaje', description: 'Enviar imagen' },
    
    // Execute Actions
    { id: 'execute-code', label: 'Ejecutar código', icon: ZapIcon, category: 'ejecutar', description: 'Ejecutar código' },
    { id: 'get-record', label: 'Get record', icon: TableIcon, category: 'ejecutar', description: 'Obtener registro' },
    { id: 'insert-record', label: 'Insert record', icon: TableIcon, category: 'ejecutar', description: 'Insertar registro' },
    { id: 'update-record', label: 'Update record', icon: TableIcon, category: 'ejecutar', description: 'Actualizar registro' },
    { id: 'delete-record', label: 'Delete record', icon: TableIcon, category: 'ejecutar', description: 'Eliminar registro' },
    { id: 'find-record', label: 'Find record', icon: TableIcon, category: 'ejecutar', description: 'Buscar registro' },
    
    // WebChat Actions
    { id: 'configure-webchat', label: 'Configurar webchat', icon: Share2Icon, category: 'webchat', description: 'Configurar webchat' },
    { id: 'show-webchat', label: 'Mostrar webchat', icon: Share2Icon, category: 'webchat', description: 'Mostrar webchat' },
    { id: 'hide-webchat', label: 'Ocultar webchat', icon: Share2Icon, category: 'webchat', description: 'Ocultar webchat' },
    { id: 'toggle-webchat', label: 'Alternar webchat', icon: Share2Icon, category: 'webchat', description: 'Alternar webchat' },
    { id: 'get-user-data', label: 'Obtener datos de usuario', icon: Share2Icon, category: 'webchat', description: 'Obtener datos de usuario' },
    { id: 'send-custom-event', label: 'Enviar evento personalizado', icon: Share2Icon, category: 'webchat', description: 'Enviar evento personalizado' },
    
    // AI Actions
    { id: 'ai-task', label: 'Tarea con IA', icon: SparkleIcon, category: 'ia', description: 'Tarea con IA' },
    { id: 'ai-generate-text', label: 'Generar texto con IA', icon: SparkleIcon, category: 'ia', description: 'Generar texto con IA' },
    { id: 'ai-transition', label: 'Transición con IA', icon: GitPullRequestArrowIcon, category: 'ia', description: 'Transición con IA' },
    
    // Flow Logic Actions
    { id: 'intent', label: 'Intent', icon: GitBranchIcon, category: 'flujo', description: 'Intent' },
    { id: 'expression', label: 'Expression', icon: GitBranchIcon, category: 'flujo', description: 'Expression' },
    
    // Information Capture Actions
    { id: 'single-option', label: 'Única opción', icon: EarIcon, category: 'info', description: 'Captura única opción' },
    { id: 'multiple-options', label: 'Múltiples opciones', icon: EarIcon, category: 'info', description: 'Captura múltiples opciones' },
    { id: 'boolean', label: 'Boolean', icon: EarIcon, category: 'info', description: 'Captura booleana' },
    { id: 'confirmation', label: 'Confirmación', icon: EarIcon, category: 'info', description: 'Captura confirmación' },
  ];

  // Handle action click
  const handleActionClick = useCallback((actionType: ActionType) => {
    onAddNode?.(actionType);
  }, [onAddNode]);

  // Group actions by category
  const actionsByCategory = actionItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ActionItem[]>);

  const categoryLabels: Record<string, string> = {
    mensaje: 'Enviar mensaje',
    ejecutar: 'Ejecutar',
    webchat: 'WebChat',
    ia: 'IA',
    flujo: 'Lógica de flujo',
    info: 'Captura de información',
  };

  return (
    <Accordion hidden={hidden} type="multiple" className="overflow-y-auto p-4 w-80 border-r">
      {Object.entries(actionsByCategory).map(([category, items]) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger>{categoryLabels[category]}</AccordionTrigger>
          <AccordionContent className="grid gap-2 grid-cols-2">
            {items.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="justify-start"
                size="sm"
                onClick={() => handleActionClick(item.id)}
                title={item.description}
              >
                <item.icon className="w-4 h-4 mr-2" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}