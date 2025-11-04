import clsx from "clsx";
import { BookOpenIcon, EarIcon } from "lucide-react";

type CaptureInfoProps = {
  type: string;
  choices: string[];
};

export default function CaptureInfo({ type, choices = [] }: CaptureInfoProps) {
  const text = {
    "single-choice": "Opción única",
    "multiple-choice": "Multiples opciones",
    "boolean": "Boolean",
    "confirmation": "Confirmación",
  }
  return (
    <div className="text-xs bg-gray-50 border-gray-200 border rounded text-gray-700 items-center">
      <header className={clsx("flex gap-2 justify-between border-gray-200 px-2 py-1", {"border-b": choices.length})}>
        <div className="flex gap-2">
          <EarIcon className="text-yellow-600" size={14} />
          { text[type as keyof typeof text] }
        </div>
        <BookOpenIcon size={14} />
      </header>
      {
        Boolean(choices.length) && choices.map((c,i) => (
          <p data-name={`${c}-${i}`} key={`${c}-${i}`} className="text-gray-700 text-right px-2 py-1 text-[0.5rem]/[0.5rem]">{ c }</p>
        ))
      }
    </div>
  );
}