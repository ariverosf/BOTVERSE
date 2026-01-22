import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BOTVERSE - Autenticación"
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-secondary">
      <div className="flex gap-2 items-center">
        <Image
          src="/images/logo.png"
          width={125}
          height={103}
          alt="BOTVERSE"
        />
        <h3 className="text-3xl text-shadow-lime-200 font-semibold italic text-emerald-600" style={{ fontFamily: "Poppins" }}>BOTVERSE</h3>
      </div>
      <section className="sm:shadow-md sm:rounded-lg sm:border border-accent p-4 max-w-sm w-full bg-primary-foreground">
        { children }
      </section>
    </div>
  );
}