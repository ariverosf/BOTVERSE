"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function LoginPage() {

  const onCreateAccountClick = () => {
    redirect("/auth/register");
  };

  const formSchema = z.object({
    email: z.email({ error: "Debes ingresar una dirección de correo electrónico válido." }),
    password: z.string().min(1, { error: "Debes ingresar tu contraseña." })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit = async (credentials: z.infer<typeof formSchema>) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { "Content-type": "application/json"},

      body: JSON.stringify(credentials),
      credentials: "include"
    });
    if (res.ok) {
      toast.success("Inicio de sesión éxitoso", { position: "bottom-center" });
      redirect("/");
    } else {
      toast.error("Credenciales incorrectas", { position: "bottom-center" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Ingresa tu contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-center">
          <Button onClick={onCreateAccountClick} type="button" variant="outline">Crear cuenta</Button>
          <Button type="submit">Iniciar sesión</Button>
        </div>
      </form>
    </Form>
  )
}