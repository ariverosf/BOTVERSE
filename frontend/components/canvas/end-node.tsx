import { Handle, Position } from '@xyflow/react';
import { EqualIcon } from 'lucide-react';

export default function EndNode() {
  return (
    <div className="flex flex-col gap-2 bg-red-50 border-red-200 rounded-lg border-2 p-2 relative">
      <header className="flex gap-2 items-center">
        <EqualIcon className="text-red-700 hover:text-red-900" size={14} />
        <h4 className="font-semibold text-sm text-red-700 hover:text-red-900">Fin</h4>
      </header>
      <div className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
        🏁 Punto final del flujo
      </div>
      <Handle
        type="target"
        position={Position.Left}
      />
    </div>
  );
}
