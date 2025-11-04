import { AudioLinesIcon, EarIcon, FileIcon, GitBranchIcon, GitPullRequestArrowIcon, ImageIcon, MapPinIcon, Share2Icon, SparkleIcon, TableIcon, TextIcon, VideoIcon, ZapIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useWorkflowStore } from "@/store/workflowStore";
import { useMemo } from "react";

export default function ActionMenu() {
  const { selectedNode, getSelectedNode, changeNode } = useWorkflowStore();
  const node = getSelectedNode();

  const onActionClick = (type: string, subtype: string, value: string) => {
    if (node && selectedNode) {
      changeNode(selectedNode, {
        ...node,
        data: {
          ...node?.data ?? [],
          actions: [
            ...node?.data?.actions as object[] ?? [],
            { type, subtype, value }
          ]
        }
      })
    }
  }

  return (
    <Accordion type="multiple" className="overflow-y-auto p-4 min-w-80 border-r h-full bg-white">
      <AccordionItem value="mensaje">
        <AccordionTrigger>Enviar mensaje</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button onClick={() => onActionClick("message", "text", "")} variant="outline" className="justify-start" size="sm">
            <TextIcon /><span className="truncate">Texto</span>
          </Button>
          <Button onClick={() => onActionClick("message", "video", "")} variant="outline" className="justify-start" size="sm">
            <VideoIcon /><span className="truncate">Video</span>
          </Button>
          <Button onClick={() => onActionClick("message", "audio", "")} variant="outline" className="justify-start" size="sm">
            <AudioLinesIcon /><span className="truncate">Audio</span>
          </Button>
          <Button onClick={() => onActionClick("message", "action", "")} variant="outline" className="justify-start" size="sm">
            <TextIcon /><span className="truncate">Acción</span>
          </Button>
          <Button onClick={() => onActionClick("message", "file", "")} variant="outline" className="justify-start" size="sm">
            <FileIcon /><span className="truncate">Archivo</span>
          </Button>
          <Button onClick={() => onActionClick("message", "location", "")} variant="outline" className="justify-start" size="sm">
            <MapPinIcon /><span className="truncate">Ubicación</span>
          </Button>
          <Button onClick={() => onActionClick("message", "image", "")} variant="outline" className="justify-start" size="sm">
            <ImageIcon /><span className="truncate">Imagen</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ejecutar">
        <AccordionTrigger>Ejecutar</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button variant="outline" className="justify-start" size="sm">
            <ZapIcon /><span className="truncate">Ejecutar codigo</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <TableIcon /><span className="truncate">Get record</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <TableIcon /><span className="truncate">Insert record</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <TableIcon /><span className="truncate">Update record</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <TableIcon /><span className="truncate">Delete record</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <TableIcon /><span className="truncate">Find record</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="webchat">
        <AccordionTrigger>WebChat</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Configurar webchat</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Mostrar webchat</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Ocultar webchat</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Alternar webchat</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Obtener datos de usuario</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <Share2Icon /><span className="truncate">Enviar evento personalizado</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ia">
        <AccordionTrigger>IA</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button variant="outline" className="justify-start" size="sm">
            <SparkleIcon /><span className="truncate">Tarea con IA</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <SparkleIcon /><span className="truncate">Generar texto con IA</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <GitPullRequestArrowIcon /><span className="truncate">Transición con IA</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="flujo">
        <AccordionTrigger>Logica de flujo</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button variant="outline" className="justify-start" size="sm">
            <GitBranchIcon /><span className="truncate">Intent</span>
          </Button>
          <Button variant="outline" className="justify-start" size="sm">
            <GitBranchIcon /><span className="truncate">Expression</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="info">
        <AccordionTrigger>Captura de información</AccordionTrigger>
        <AccordionContent className="grid gap-2 grid-cols-2">
          <Button onClick={() => onActionClick("capture-info", "single-choice", "")} variant="outline" className="justify-start" size="sm">
            <EarIcon /><span className="truncate">Opción única</span>
          </Button>
          <Button onClick={() => onActionClick("capture-info", "multiple-choice", "")} variant="outline" className="justify-start" size="sm">
            <EarIcon /><span className="truncate">Multiples opciones</span>
          </Button>
          <Button onClick={() => onActionClick("capture-info", "boolean", "")} variant="outline" className="justify-start" size="sm">
            <EarIcon /><span className="truncate">Boolean</span>
          </Button>
          <Button onClick={() => onActionClick("capture-info", "confirmation", "")} variant="outline" className="justify-start" size="sm">
            <EarIcon /><span className="truncate">Confirmación</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}