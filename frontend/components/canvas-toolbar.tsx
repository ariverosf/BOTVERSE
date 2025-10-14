import { GitBranch, Play, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CanvasToolbarProps = {
  onAddNode: () => void;
  onTestFlow?: () => void;
}

export default function CanvasToolbar({ onAddNode, onTestFlow }: CanvasToolbarProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="bg-allox-teal/10 text-allox-teal border-allox-teal/20 font-medium">
          <GitBranch className="w-3 h-3 mr-2" />
          Flujo Principal
        </Badge>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="border-allox-lime text-allox-dark-gray hover:bg-allox-lime hover:text-allox-dark-gray bg-transparent font-medium"
            onClick={onAddNode}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Nodo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-allox-teal text-allox-teal hover:bg-allox-teal hover:text-white bg-transparent font-medium"
            onClick={onTestFlow}
          >
            <Play className="w-4 h-4 mr-2" />
            Probar Flujo
          </Button>
        </div>
      </div>
    </div>
  );
}