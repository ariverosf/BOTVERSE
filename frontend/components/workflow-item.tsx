import clsx from "clsx";

type WorkflowItemProps = {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

const selectedClasses = "bg-white border-allox-teal/20 hover:border-allox-teal/40";
const notSelectedClasses = "bg-gray-50 border-gray-200 hover:border-gray-300";

export default function WorkflowItem({ title, description, isSelected, onClick }: WorkflowItemProps) {
  return (
    <div className={clsx("p-3 border rounded-lg cursor-pointer transition-colors", isSelected ? selectedClasses : notSelectedClasses)} onClick={onClick}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium text-allox-dark-gray">{ title }</p>
          <p className="text-sm text-gray-600">{ description }</p>
        </div>
      </div>
    </div>
  );
}