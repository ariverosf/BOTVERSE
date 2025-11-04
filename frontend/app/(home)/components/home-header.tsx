"use server"
import useUser from "@/hooks/user-user";

export default async function HomeHeader() {
  const { user } = await useUser();

  return (
    <header className="border-b-border border-b p-4 space-y-2">
      <h1 className="text-3xl text-foreground font-semibold">
        ¡Bienvenido {user.fullName}!
      </h1>
      <p className="text-muted-foreground">Selecciona una opción para comenzar</p>
    </header>
  );
}