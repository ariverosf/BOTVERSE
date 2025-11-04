import clsx from "clsx";

type FlowItemProps = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
};

const selectedClasses = "bg-white border-allox-teal/20 hover:border-allox-teal/40";
const notSelectedClasses = "bg-gray-50 border-gray-200 hover:border-gray-300";

export default function FlowItem({ title, isSelected, onClick }: FlowItemProps) {
  return (
    <div className={clsx("p-2 border rounded-lg cursor-pointer transition-colors", isSelected ? selectedClasses : notSelectedClasses)} onClick={onClick}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-allox-dark-gray">{ title }</p>
      </div>
    </div>
  );
}