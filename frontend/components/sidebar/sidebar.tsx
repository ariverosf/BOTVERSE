import { SidebarItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  items: SidebarItem[];
  active: string;
  setItemActive: (id: string) => void;
};

export default function Sidebar({ items, active, setItemActive }: SidebarProps) {
  return(
    <div className="w-16 border-r border-slate-200 flex flex-col items-center py-4 space-y-2">
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          size="sm"
          className={`w-12 h-12 p-0 transition-all duration-200 ${
            active === item.id
              ? "bg-allox-teal text-teal-500 hover:bg-allox-dark-teal shadow-md"
              : "text-allox-dark-gray hover:bg-allox-teal/10 hover:text-allox-teal"
          }`}
          onClick={() => setItemActive(item.id)}
          title={item.tooltip}
        >
          <item.icon className="w-5 h-5" />
        </Button>
      ))}
    </div>
  );
}