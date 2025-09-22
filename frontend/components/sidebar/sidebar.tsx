import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from "react";
import { BookOpen, GitBranch, GitCommit, HelpCircle, Puzzle, Search, Settings, Table, Users, Zap } from "lucide-react";
import type { SidebarContentProps, SidebarProps } from "./sidebar-types";

export default function Sidebar({ onChange, children, onSettingsClick }: SidebarProps) {
  const sidebarItems = [
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
    },
    {
      id: "tables",
      icon: Table,
      label: "Tablas",
      tooltip: "Gestionar tablas de datos",
      description: "Administra datos estructurados y variables",
    },
    {
      id: "agents",
      icon: Users,
      label: "Agentes",
      tooltip: "Configurar agentes virtuales",
      description: "Configura diferentes personalidades del bot",
    },
    {
      id: "hooks",
      icon: Zap,
      label: "Hooks",
      tooltip: "Configurar webhooks y eventos",
      description: "Integra eventos y disparadores externos",
    },
    {
      id: "integrations",
      icon: Puzzle,
      label: "Integraciones instaladas",
      tooltip: "Ver integraciones activas",
      description: "Gestiona conexiones con servicios externos",
    },
    {
      id: "versions",
      icon: GitCommit,
      label: "Versiones",
      tooltip: "Historial de versiones",
      description: "Control de versiones y respaldos del bot",
    }
  ];

  const sidebarEndItems = [
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
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Ayuda",
      tooltip: "Centro de ayuda",
      description: "Documentación y soporte técnico",
    }
  ];
  const [itemActive, setItemActive] = useState(sidebarItems[0].id);

  const handleChange = (tabdId: string) => {
    const itemClick = sidebarEndItems.find(item => item.id === tabdId)?.onClick;
    if (itemClick) return itemClick();

    setItemActive(tabdId);
    onChange(tabdId);
  };

  return(
    <div className="flex">
      <div className="w-16 border-r border-slate-200 flex flex-col items-center py-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`w-12 h-12 p-0 transition-all duration-200 ${
              itemActive === item.id
                ? "bg-allox-teal text-teal-500 hover:bg-allox-dark-teal shadow-md"
                : "text-allox-dark-gray hover:bg-allox-teal/10 hover:text-allox-teal"
            }`}
            onClick={() => handleChange(item.id)}
            title={item.tooltip}
          >
            <item.icon className="w-5 h-5" />
          </Button>
        ))}
        <div className="flex flex-col gap-2 mt-auto">
          {
            sidebarEndItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`w-12 h-12 p-0 transition-all duration-200 ${
                  itemActive === item.id
                    ? "bg-allox-teal text-teal-500 hover:bg-allox-dark-teal shadow-md"
                    : "text-allox-dark-gray hover:bg-allox-teal/10 hover:text-allox-teal"
                }`}
                onClick={() => handleChange(item.id)}
                title={item.tooltip}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            ))
          }
        </div>
        <div className="flex flex-col gap-2 border-t">
          <Avatar className="w-12 h-12 mt-2">
            <AvatarFallback className="bg-teal-100 text-teal-900">AR</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {
        Array.isArray(children)
          ? children.find(
              (child) =>
                (child as React.ReactElement<SidebarContentProps>).props.tab ===
                itemActive
            )
          : (children as React.ReactElement<SidebarContentProps>).props.tab ===
              itemActive && children
      }
    </div>
  );
}