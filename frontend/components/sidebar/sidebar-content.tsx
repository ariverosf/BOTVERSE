import type { SidebarContentProps } from "./sidebar-types";

export default function SidebarContent({ tab, children, title }: SidebarContentProps) {
  return (
    <div className="bg-gray-100 h-full w-60 border-r px-2 py-4">
      <h3 className="text-sm font-bold text-gray-500 mb-4">{ title }</h3>
      <div className="text-sm">
        { children }
      </div>
    </div>
  );
}