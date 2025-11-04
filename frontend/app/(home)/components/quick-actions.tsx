"use client"

import QuickAccessCard from "@/components/quick-access-card";
import { ClockIcon, CodeIcon, DatabaseIcon, GitBranchIcon, LayoutDashboardIcon } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="p-4">
      <h3 className="text-xl text-foreground font-semibold mb-4">Acceso Rápido</h3>
      <div className="grid grid-cols-3 gap-4">
        <QuickAccessCard to="workflows" label="Flujos" description="Administra tus flujos de conversación" icon={GitBranchIcon} />
        <QuickAccessCard to="workflows" label="Tablas" description="Organiza tus datos" icon={DatabaseIcon} />
        <QuickAccessCard to="workflows" label="Agentes" description="Crea agentes de inteligencia artificial" icon={DatabaseIcon} />
        <QuickAccessCard to="workflows" label="Integraciones" description="Conecta servicios externos" icon={CodeIcon} />
        <QuickAccessCard to="workflows" label="Hooks" description="Activación de automatizaciones" icon={LayoutDashboardIcon} />
        <QuickAccessCard to="workflows" label="Versiones" description="Rastrea tus cambios" icon={ClockIcon} />
      </div>
    </section>
  );
}