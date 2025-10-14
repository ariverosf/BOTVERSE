import { Separator } from "@radix-ui/react-separator";
import { Bot, ChevronRight, Download, Home, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onSaveWorkspace: () => void;
  isSaving?: boolean;
  selectedWorkflowName?: string;
  onExportWorkspace?: () => void;
  isExporting?: boolean;
}

export default function Header({ onSaveWorkspace, isSaving, selectedWorkflowName, onExportWorkspace, isExporting }: HeaderProps) {
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
            <span className="text-allox-dark-gray font-semibold">
              {selectedWorkflowName || 'Mi Bot de Atención'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportWorkspace}
            disabled={isExporting}
            className="border-allox-dark-gray text-allox-dark-gray hover:bg-allox-dark-gray hover:text-white bg-transparent font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
          <Button 
            onClick={onSaveWorkspace} 
            size="sm" 
            disabled={isSaving}
            className="bg-allox-lime hover:bg-[#B5EC5D] text-allox-dark-gray font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}