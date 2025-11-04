import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";
import { EqualIcon, FileIcon, HeadphonesIcon, PlusIcon, TextIcon, TypeIcon, VideoIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useWorkflowStore } from "@/store/workflowStore";
import clsx from "clsx";
import Message from "../actions/message";
import CaptureInfo from "../actions/capture-info";
import { useEffect, useRef } from "react";

type ActionNodeProps = {
  data: {
    label: string;
    actions: {type: string, subtype: string, value: any}[];
  }
};

export default function ActionNode({ data }: ActionNodeProps) {
  const { toggleActionMenu, selectedNode } = useWorkflowStore();
  const actionNodeRef = useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(selectedNode ?? "");    
  }, [data, selectedNode])

  return (
    <div className={clsx("flex flex-col gap-2 rounded-lg p-2 bg-white border border-border hover:border-blue-500 transition")} ref={actionNodeRef}>
      <header className="flex gap-2 items-center">
        <EqualIcon className="text-gray-500" size={14} />
        <h4 className="font-semibold text-sm text-gray-500">{ data.label }</h4>
      </header>
      {
        data?.actions?.map((action, i) => (
          <div className="flex flex-col" key={`${action.type}-${action.subtype}-${i}-${action.value}`}>
            { action.type === "message" && <Message type={action.subtype} /> }
            { action.type === "capture-info" && <CaptureInfo type={action.subtype} choices={action.value?.choices ?? ["Bienvenido"]} /> }
            { action.type === "capture-info" && (action.value?.choices ?? ["Bienvenido"])?.map((c,i) => (
              <Handle
                key={`${c}-${i}`}
                type="source"
                position={Position.Right}
                id={`${c}-${i}`}
                style={{ top: actionNodeRef.current?.querySelector?.(`[data-name="${c}-${i}"]`)?.offsetTop + 8 ?? 0}}
              />
            ))}
          </div>
        ))
      }
      <Button onClick={toggleActionMenu} className="justify-start border-dashed border rounded border-gray-300 text-gray-400 items-center text-[0.75rem]/[0.75rem] hover:text-blue-500 hover:border-blue-500 transition-all" variant="ghost" size="sm">
        <PlusIcon size={14} />
        Añadir acción
      </Button>
      <Handle
        type="target"
        position={Position.Left}
      />
    </div>
  );
}