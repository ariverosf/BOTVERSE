"use client"

import { BookOpen, GitBranchIcon, GitCommit, HelpCircle, HomeIcon, LogOutIcon, Puzzle, Search, Settings, Table, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { redirect } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";

type SidebarProps = {
  fullName: string;
  userInitials: string;
}
export default function Sidebar({ fullName, userInitials }: SidebarProps) {
  const handleRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
    const route = e.currentTarget.name;
    redirect(`/${route}`);
  }

  const logout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      toast.success("Sesión cerrada con éxito", { position: "bottom-center" });
      redirect("/login");
    } else {
      toast.error("Error al cerrar sesión", { position: "bottom-center" });
    }
  }

  return (
    <nav className="border-r border-border flex flex-col">
      <div className="flex flex-col gap-2 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleRoute} variant="ghost" size="icon" title="Inicio">
              <HomeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Inicio</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon" title="Flujos">
              <GitBranchIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Flujos</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <BookOpen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Table />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Users />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Zap />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Puzzle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <GitCommit />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Bottom side */}
      <div className="flex flex-col gap-2 p-2 mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Settings />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <Search />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
              <HelpCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>No disponible</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-2 border-border border-t p-2 cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <Avatar>
              <AvatarFallback>{ userInitials }</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{ fullName }</p>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOutIcon className="mr-4" />
                Cerrar sesión
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}