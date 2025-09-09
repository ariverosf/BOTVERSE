export type SidebarProps = {
  children: React.ReactNode;
  onChange(tab: string): void;
};

export type SidebarContentProps = {
  title: string;
  tab: string;
  children: React.ReactNode;
};