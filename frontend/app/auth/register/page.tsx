"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function RegisterPage() {
  const onGoBackClick = () => {
    redirect("/auth/login");
  };

  const formSchema = z.object({
    fullName: z.string().min(3, { error: "El nombre debe tener mínimo 3 caracteres." }),
    email: z.email({ error: "Debes ingresar una dirección de correo electrónico válido." }),
    password: z.string()
               .min(8, { error: "La contraseña debe tener mínimo 8 caracteres." })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: 'POST',
      headers: { "Content-type": "application/json"},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      // router.push('/dashboard')
      toast.success("Cuenta creada éxitosamente", { position: "bottom-center" });
      redirect("/auth/login");
    } else {
      toast.error("Credenciales incorrectas", { position: "bottom-center" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
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
          <Button type="button" variant="outline" onClick={onGoBackClick}>Volver</Button>
          <Button type="submit">Crear cuenta</Button>
        </div>
      </form>
    </Form>
  )
}