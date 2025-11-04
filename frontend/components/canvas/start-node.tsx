import { Handle, Position } from '@xyflow/react';
import { EqualIcon, MenuIcon } from 'lucide-react';

export default function StartNode() {
  return (
    <div className="flex flex-col gap-2 bg-green-50 border-green-200 rounded-lg border-2 p-2 relative">
      <header className="flex gap-2 items-center">
        <EqualIcon className="text-green-700 hover:text-green-900" size={14} />
        <h4 className="font-semibold text-sm text-green-700 hover:text-green-900">Inicio</h4>
      </header>
      <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
        🚀 Punto de inicio del flujo
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
