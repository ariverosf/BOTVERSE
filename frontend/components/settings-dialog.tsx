"use client"

import { z } from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SettingsIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useEffect } from "react";

type SettingsDialogProps = {
  open: boolean;
  closeDialog: () => void;
};

const FormSchema = z.object({
  chatbotName: z.string().min(2, {
    message: "El nombre del ChatBOT debe tener al menos 2 caracteres.",
  }),
  inactivityTimeout: z.number().min(0, {
    message: "El tiempo de inactividad no puede ser negativo.",
  }),
  nodeRepeatLimit: z.number().min(0, {
    message: "El límite de repetición de nodos no puede ser negativo.",
  }),
});

export default function SettingsDialog ({ open, closeDialog }: SettingsDialogProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      chatbotName: "Asistente Virtual",
      inactivityTimeout: 0,
      nodeRepeatLimit: 3
    }
  });

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors])

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("DATA", data);
    console.log("FORM", form);
    console.log("Settings saved");
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <SettingsIcon />
            Configuración del BOT
          </DialogTitle>
          <DialogDescription>
            Ajusta las preferencias y configuraciones de tu ChatBOT
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="font-bold">General</h2>
            <section className="flex gap-2">
              <div className="w-full space-y-1">
                <h4 className="text-sm leading-none font-medium">Nombre del ChatBOT</h4>
                <p className="text-muted-foreground text-sm">
                  El nombre de tu ChatBOT, aparecerá como nombre de avatar en diferentes canales.
                </p>
              </div>
              <FormField
                control={form.control}
                name="chatbotName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Asistente Virtual" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <Separator />
            <section className="flex gap-2">
              <div className="w-full space-y-1">
                <h4 className="text-sm leading-none font-medium">Tiempo de inactividad (minutos)</h4>
                <p className="text-muted-foreground text-sm">
                  Número de minutos de inactividad antes de que finalice la sesion. Posición en el flujo de trabajo, incluidas las variables de flujo de trabajo, se borran. Establecer en 0 para que nunca caduque.
                </p>
              </div>
              <FormField
                control={form.control}
                name="inactivityTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" min={0} {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <Separator />
            <section className="flex gap-2">
              <div className="w-full space-y-1">
                <h4 className="text-sm leading-none font-medium">Límite de repetición de nodos</h4>
                <p className="text-muted-foreground text-sm">
                  Número máximo de veces que una conversación puede pasar por un nodo. Se activará un error cuando supere el límite. Por defecto en 3.
                </p>
              </div>
              <FormField
                control={form.control}
                name="nodeRepeatLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" min={0} {...field} onChange={e => field.onChange(+e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <Separator />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}