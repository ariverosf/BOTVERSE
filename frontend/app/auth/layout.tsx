import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BOTVERSE - Autenticación"
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-secondary">
      <h1>BOTVERSE</h1>
      <section className="sm:shadow-md sm:rounded-lg sm:border border-accent p-4 max-w-sm w-full bg-primary-foreground">
        { children }
      </section>
    </div>
  );
}