import DebugPanel from "@/components/debug-panel";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar/sidebar";
import useUser from "@/hooks/user-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BOTVERSE - Diseña tus flujos conversacionales"
};

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userInitials } = await useUser();
  
  return (
    <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      <Header />
      <div className="flex">
        <Sidebar userInitials={userInitials} />
        <div className="w-full">
          { children }
        </div>
      </div>
      <DebugPanel />
    </div>
  );
}