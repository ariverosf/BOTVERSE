import clsx from "clsx";
import { Button } from "./ui/button";
import { useWorkflowStore } from "@/store/workflowStore";
import { useRef } from "react";

type SimulationMessageProps = {
  position: "left" | "right";
  message: string;
};

function SimulationMessage({ message, position }: SimulationMessageProps) {
  const classes = {
    "bg-green-100 text-green-900 ml-auto": position === "right",
    "bg-gray-100 mr-auto text-gray-700": position === "left"
  }

  return (
    <div className={clsx("rounded-lg p-2 max-w-10/12", classes)}>
      { message }
    </div>
  );
}


type SimulationChatProps = {
  messages: {
    position: "left" | "right",
    text: string;
  }[];
  choices: string[]
}

export default function SimulationChat({ messages, choices }: SimulationChatProps) {
  const { simulateFlow, getSelectedFlow, simulationNodeId } = useWorkflowStore();
  const simulationRef = useRef<HTMLDivElement>(null);

  const onSimulate = (choice: string) => {
    simulateFlow(getSelectedFlow()!.id!, { node_id: simulationNodeId!, value: choice })
    if (simulationRef.current) {
      setTimeout(() => {
        simulationRef.current!.scrollTo({ behavior: "smooth", top: simulationRef.current!.scrollHeight})
      }, 100);
    };
  }

  return (
    <div ref={simulationRef} className="flex flex-col p-2 gap-2 overflow-auto max-h-96">
      <div className="flex flex-col gap-2">
        {
          messages.map((m, i) => (
            <SimulationMessage key={"simulation-message-" + i} position={m.position} message={m.text} />
          ))
        }
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {
          choices.length > 0 && <p className="w-full text-xs mt-2">Opciones a seleccionar:</p>
        }
        {
          choices.map((c, i) => <Button key={`button-${i}-choice-${c}`} size="sm" onClick={() => onSimulate(c)} variant="outline">{c}</Button>)
        }
      </div>
    </div>
  );
}