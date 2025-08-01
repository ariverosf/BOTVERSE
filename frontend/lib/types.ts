import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, JSX, RefAttributes } from "react";

export type SidebarItem = {
  id: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  label: string;
  tooltip: string;
  description: string;
};