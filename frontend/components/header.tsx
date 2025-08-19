import { Separator } from "@radix-ui/react-separator";
import { Bot, ChevronRight, Download, Eye, Home, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

type HeaderProps = {
  onSaveWorkspace: () => void;
}

export default function Header({ onSaveWorkspace }: HeaderProps) {
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
            <span>Cliente Workspace</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-allox-dark-gray font-semibold">Mi Bot de Atención</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="border-allox-teal text-allox-teal hover:bg-allox-teal hover:text-white bg-transparent font-medium"
          >
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-allox-dark-gray text-allox-dark-gray hover:bg-allox-dark-gray hover:text-white bg-transparent font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={onSaveWorkspace} size="sm" className="bg-allox-lime hover:bg-[#B5EC5D] text-allox-dark-gray font-semibold shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Avatar className="w-9 h-9 border-2 border-allox-teal/20">
            <AvatarFallback className="bg-allox-teal text-white font-semibold">UB</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}