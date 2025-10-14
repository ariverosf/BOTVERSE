import type { SidebarContentProps } from "./sidebar-types";

export default function SidebarContent({ children, title }: SidebarContentProps) {
  return (
    <div className="bg-gray-100 h-full w-60 border-r px-4 py-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}