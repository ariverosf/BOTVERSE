import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useMemo, useCallback } from "react";
import { BookOpen, GitBranch, GitCommit, HelpCircle, Puzzle, Search, Settings, Table, Users, Zap } from "lucide-react";
import type { SidebarContentProps, SidebarProps } from "./sidebar-types";
import { cn } from "@/lib/utils";

// Sidebar item interface for better type safety
interface SidebarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
  description: string;
  disabled?: boolean;
}

interface SidebarEndItem extends SidebarItem {
  onClick?: () => void;
}

export default function Sidebar({ onChange, children, onSettingsClick }: SidebarProps) {
  // Memoized sidebar items to prevent unnecessary re-renders
  const sidebarItems: SidebarItem[] = useMemo(() => [
    {
      id: "workflows",
      icon: GitBranch,
      label: "Workflows",
      tooltip: "Gestionar flujos de conversación",
      description: "Diseña y edita los flujos de conversación de tu bot",
    },
    {
      id: "knowledge",
      icon: BookOpen,
      label: "Bases de conocimientos",
      tooltip: "Administrar base de conocimientos",
      description: "Gestiona documentos, FAQ y contenido del bot",
      disabled: true, // Disabled for now
    },
    {
      id: "tables",
      icon: Table,
      label: "Tablas",
      tooltip: "Gestionar tablas de datos",
      description: "Administra datos estructurados y variables",
      disabled: true, // Disabled for now
    },
    {
      id: "agents",
      icon: Users,
      label: "Agentes",
      tooltip: "Configurar agentes virtuales",
      description: "Configura diferentes personalidades del bot",
      disabled: true, // Disabled for now
    },
    {
      id: "hooks",
      icon: Zap,
      label: "Hooks",
      tooltip: "Configurar webhooks y eventos",
      description: "Integra eventos y disparadores externos",
      disabled: true, // Disabled for now
    },
    {
      id: "integrations",
      icon: Puzzle,
      label: "Integraciones instaladas",
      tooltip: "Ver integraciones activas",
      description: "Gestiona conexiones con servicios externos",
      disabled: true, // Disabled for now
    },
    {
      id: "versions",
      icon: GitCommit,
      label: "Versiones",
      tooltip: "Historial de versiones",
      description: "Control de versiones y respaldos del bot",
      disabled: true, // Disabled for now
    }
  ], []);

  const sidebarEndItems: SidebarEndItem[] = useMemo(() => [
    {
      id: "config",
      icon: Settings,
      label: "Configuración del Bot",
      tooltip: "Configuración general",
      description: "Ajustes generales y configuración avanzada",
      onClick: onSettingsClick
    },
    {
      id: "search",
      icon: Search,
      label: "Buscar",
      tooltip: "Buscar en el proyecto",
      description: "Busca elementos en todo el proyecto",
      disabled: true, // Disabled for now
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Ayuda",
      tooltip: "Centro de ayuda",
      description: "Documentación y soporte técnico",
      disabled: true, // Disabled for now
    }
  ], [onSettingsClick]);

  const [itemActive, setItemActive] = useState(sidebarItems[0].id);

  // Memoized change handler
  const handleChange = useCallback((tabId: string) => {
    const itemClick = sidebarEndItems.find(item => item.id === tabId)?.onClick;
    if (itemClick) return itemClick();

    setItemActive(tabId);
    onChange(tabId);
  }, [onChange, sidebarEndItems]);

  // Memoized sidebar button component
  const SidebarButton = useCallback(({ item, isActive, onClick }: { 
    item: SidebarItem | SidebarEndItem; 
    isActive: boolean; 
    onClick: () => void;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      disabled={item.disabled}
      className={cn(
        "w-12 h-12 p-0 transition-all duration-200",
        isActive
          ? "bg-allox-teal text-teal-500 hover:bg-allox-dark-teal shadow-md"
          : "text-allox-dark-gray hover:bg-allox-teal/10 hover:text-allox-teal",
        item.disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      title={item.tooltip}
    >
      <item.icon className="w-5 h-5" />
    </Button>
  ), []);

  // Memoized content finder
  const activeContent = useMemo(() => {
    if (Array.isArray(children)) {
      return children.find(
        (child) =>
          (child as React.ReactElement<SidebarContentProps>).props.tab === itemActive
      );
    }
    return (children as React.ReactElement<SidebarContentProps>).props.tab === itemActive && children;
  }, [children, itemActive]);

  return (
    <div className="flex">
      <div className="w-16 border-r border-slate-200 flex flex-col items-center py-4 space-y-2">
        {/* Main sidebar items */}
        {sidebarItems.map((item) => (
          <SidebarButton
            key={item.id}
            item={item}
            isActive={itemActive === item.id}
            onClick={() => handleChange(item.id)}
          />
        ))}
        
        {/* Bottom sidebar items */}
        <div className="flex flex-col gap-2 mt-auto">
          {sidebarEndItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={itemActive === item.id}
              onClick={() => handleChange(item.id)}
            />
          ))}
        </div>
        
        {/* User avatar */}
        <div className="flex flex-col gap-2 border-t pt-2">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-teal-100 text-teal-900">AR</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Sidebar content */}
      {activeContent}
    </div>
  );
}