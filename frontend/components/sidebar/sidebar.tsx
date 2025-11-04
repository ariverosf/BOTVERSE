"use client"

import { BookOpen, GitBranchIcon, GitCommit, HelpCircle, HomeIcon, Puzzle, Search, Settings, Table, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { redirect } from "next/navigation";

type SidebarProps = {
  userInitials: string;
}
export default function Sidebar({ userInitials }: SidebarProps) {
  const handleRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
    const route = e.currentTarget.name;
    redirect(`/${route}`);
  }

  return (
    <nav className="border-r border-border flex flex-col">
      <div className="flex flex-col gap-2 p-2">
        <Button onClick={handleRoute} variant="ghost" size="icon" title="Inicio">
          <HomeIcon />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon" title="Flujos de trabajo">
          <GitBranchIcon />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <BookOpen />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Table />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Users />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Zap />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Puzzle />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <GitCommit />
        </Button>
      </div>

      {/* Bottom side */}
      <div className="flex flex-col gap-2 p-2 mt-auto">
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Settings />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <Search />
        </Button>
        <Button name="workflows" onClick={handleRoute} variant="ghost" size="icon">
          <HelpCircle />
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-border border-t p-2">
        <Avatar>
          <AvatarFallback>{ userInitials }</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}