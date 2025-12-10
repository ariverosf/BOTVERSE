import { useWorkflowStore } from "@/store/workflowStore";
import FlowItem from "./flow-item";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

export default function FlowList() {
  const { projects, selectedProject, selectedFlow, getFlowsFromSelectedProject, setSelectedProject, createProject, createFlow, setFlow } = useWorkflowStore();
  const [createProjectDialog, setCreateProjectDialog] = useState(false);
  const [createFlowDialog, setCreateFlowDialog] = useState(false);

  const formSchema = z.object({
    name: z.string().min(6, { error: "El nombre del proyecto debe tener al menos 6 caracteres" }),
    description: z.string().min(6, { error: "La descripción del proyecto debe tener al menos 6 caracteres." })
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    },
  });

  const flujoSchema = z.object({
    name: z.string().min(3, { error: "El nombre del flujo debe tener al menos 3 caracteres" })
  });

  const flujoForm = useForm<z.infer<typeof flujoSchema>>({
    resolver: zodResolver(flujoSchema),
    defaultValues: {
      name: ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const project = await createProject(values.name, values.description);
      toast.success("Proyecto creado exitosamente", { position: "bottom-center" });
      setCreateProjectDialog(false);
      setSelectedProject(project.id)
    } catch(err) {
      toast.success("Ocurrió un error creando el proyecto", { position: "bottom-center" });
    }
  }

  const onSubmitFlujo = async (values: z.infer<typeof flujoSchema>) => {
    try {
      const flow = await createFlow(values.name);
      toast.success("Flujo creado exitosamente", { position: "bottom-center" });
      setCreateFlowDialog(false);
      setFlow(flow.id!);
    } catch(err) {
      toast.success("Ocurrió un error creando el flujo", { position: "bottom-center" });
    }
  }

  return (
    <div className="bg-gray-100 h-full w-72 border-r py-4">
      <h3 className="text-sm font-bold text-gray-500 px-2 mb-4">Lista de proyectos</h3>
      <div className="flex gap-2 px-2">
        <Select value={selectedProject ?? undefined} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Proyectos</SelectLabel>
              {
                projects?.map(p => (
                  <SelectItem key={`project-${p.id}-${p.owner_id}`} value={p.id}>{ p.name }</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <Dialog open={createProjectDialog} onOpenChange={setCreateProjectDialog}>
          <DialogTrigger asChild>
            <Button variant="outline"><PlusIcon /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear proyecto</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del proyecto</FormLabel>
                      <FormControl>
                        <Input  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Crear</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {
        selectedProject && (
          <div className="flex gap-2 px-2 items-center border-b pb-4">
            <Dialog open={createFlowDialog} onOpenChange={setCreateFlowDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full mt-2 justify-start"><PlusIcon /> Crear flujo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear flujo</DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                <Form {...flujoForm}>
                  <form onSubmit={flujoForm.handleSubmit(onSubmitFlujo)} className="space-y-4">
                    <FormField
                      control={flujoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del flujo</FormLabel>
                          <FormControl>
                            <Input  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button type="submit">Crear</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )
      }
      <div className="text-sm mt-4 px-2 space-y-1">
        {
          getFlowsFromSelectedProject()?.map((flow) => (
            <FlowItem onClick={() => setFlow(flow.id!)} key={flow.id!} title={flow.name} isSelected={selectedFlow === flow.id!} />
          ))
        }
      </div>
    </div>
  );
}