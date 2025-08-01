import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "@/components/ui/button";
import { LucideProps } from "lucide-react";

type SidebarContentProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHandler?: () => void;
  buttonIcon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  children: React.ReactNode;
};

export default function SidebarContent({ title, description, buttonLabel, buttonIcon, buttonHandler, children }: SidebarContentProps) {
  const ButtonIcon = buttonIcon ?? (() => (<span></span>));
  const buttonHidden = !buttonLabel && !buttonHandler;
  
  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-allox-dark-gray">{ title }</h3>
          <Button hidden={buttonHidden} size="sm" className="cursor-pointer bg-allox-lime hover:bg-allox-lime text-allox-dark-gray" onClick={buttonHandler}>
            <ButtonIcon />
            { buttonLabel }
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          { description }
        </p>
        { children }
      </div>
    </div>
  );
}