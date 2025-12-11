import { Handle, Position } from "@xyflow/react";
import clsx from "clsx";
import { BookOpenIcon, EarIcon } from "lucide-react";

type CaptureInfoProps = {
  type: string;
  choices: string[];
  id: string;
};

export default function CaptureInfo({ id, choices = [] }: CaptureInfoProps) {
  const handleId = `handle-${id}`;

  return (
    <div className="text-xs bg-gray-50 border-gray-200 border rounded text-gray-700 items-center">
      <header className={clsx("flex gap-2 justify-between border-gray-200 px-2 py-1", {"border-b": choices.length})}>
        <div className="flex gap-2">
          <EarIcon className="text-yellow-600" size={14} />
          Opción
        </div>
        <BookOpenIcon size={14} />
      </header>
      <div className="flex flex-col">
        {
          Boolean(choices.length) && choices.map((c,i) => (
            <div key={`${handleId}-${i}`} className="flex flex-col items-center relative">
              <p className="text-gray-700 text-right w-full px-2 py-1 text-[0.5rem]/[0.5rem]">{ c }</p>
              <Handle
                type="source"
                position={Position.Right}
                id={`${handleId}-${i}`}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}