"use client"
import { Bot, ChevronRight, Download, Home, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useWorkflowStore } from "@/store/workflowStore";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function Header() {
  const { updateFlow, getSelectedProject, getSelectedFlow } = useWorkflowStore();

  const onSave = async () => {
    try {
      await updateFlow();
      toast.success("Flujo guardado exitosamente", { position: "bottom-center" });
    } catch(err) {
      console.error(err);
      toast.error("Ocurrió un error guardando el flujo", { position: "bottom-center" });
    }
  };

  const downloadFile = (data: any, fileName: string) => {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', data);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  }

  const onExportJSON = () => {
    const project = getSelectedProject();
    const flow = getSelectedFlow();

    if (!project || !flow) {
      return toast.error("Debes tener seleccionado un Flujo.", { position: "bottom-center" });
    }

    const exportData = {
      project,
      flow
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileName = `workflow-${flow.name.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(dataUri, exportFileName);

    toast.success("El flujo ha sido exportado exitosamente", { position: "bottom-center" });
  }
  
  const onExportRASA = () => {
    // TODO
    toast.error("Esta funcionalidad no esta disponible por el momento...", { position: "bottom-center" });
  }

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1FBEBA] rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-allox-dark-gray">BOTVERSE</h1>
              <p className="text-xs text-gray-500 font-medium">Bot Editor</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center text-sm text-gray-500">
            <Home className="w-4 h-4 mr-2" />
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-allox-dark-gray font-semibold">Mi Bot de Atención</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download /> Exportar...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onExportRASA}>
                  Exportar RASA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportJSON}>
                  Exportar JSON
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onSave} size="sm" className="border border-allox-dark-gray bg-allox-lime hover:bg-[#B5EC5D] text-allox-dark-gray">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </header>
  );
}