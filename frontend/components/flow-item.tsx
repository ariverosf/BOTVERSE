import clsx from "clsx";
import { GitPullRequest } from "lucide-react";

type FlowItemProps = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
};

const selectedClasses = "bg-gray-200";
const notSelectedClasses = "hover:bg-gray-200";

export default function FlowItem({ title, isSelected, onClick }: FlowItemProps) {
  return (
    <div className={clsx("p-2 rounded-lg cursor-pointer transition", isSelected ? selectedClasses : notSelectedClasses)} onClick={onClick}>
      <div className="flex items-center gap-2">
        <GitPullRequest size={14} />
        <p className="text-xs font-medium text-allox-dark-gray">{ title }</p>
      </div>
    </div>
  );
}