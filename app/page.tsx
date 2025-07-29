"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Play,
  Square,
  Plus,
  Settings,
  Save,
  Eye,
  Zap,
  GitBranch,
  Clock,
  Search,
  HelpCircle,
  Home,
  ChevronRight,
  Send,
  BookOpen,
  Table,
  Users,
  Puzzle,
  GitCommit,
  Download,
  Upload,
  Trash2,
  Edit3,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function BotEditor() {
  const [selectedNode, setSelectedNode] = useState<string | null>("start")
  const [activeSidebarItem, setActiveSidebarItem] = useState("workflows")
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", message: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?" },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { type: "user", message: inputMessage },
        { type: "bot", message: "Gracias por tu mensaje. Esta es una respuesta de prueba del bot." },
      ])
      setInputMessage("")
    }
  }

  const sidebarItems = [
    {
      id: "workflows",
      icon: GitBranch,
      label: "Workflows",
      tooltip: "Gestionar flujos de conversación",
      description: "Diseña y edita los flujos de conversación de tu bot",
    },
    {
      id: "knowledge",
      icon: BookOpen,
      label: "Bases de conocimientos",
      tooltip: "Administrar base de conocimientos",
      description: "Gestiona documentos, FAQ y contenido del bot",
    },
    {
      id: "tables",
      icon: Table,
      label: "Tablas",
      tooltip: "Gestionar tablas de datos",
      description: "Administra datos estructurados y variables",
    },
    {
      id: "agents",
      icon: Users,
      label: "Agentes",
      tooltip: "Configurar agentes virtuales",
      description: "Configura diferentes personalidades del bot",
    },
    {
      id: "hooks",
      icon: Zap,
      label: "Hooks",
      tooltip: "Configurar webhooks y eventos",
      description: "Integra eventos y disparadores externos",
    },
    {
      id: "integrations",
      icon: Puzzle,
      label: "Integraciones instaladas",
      tooltip: "Ver integraciones activas",
      description: "Gestiona conexiones con servicios externos",
    },
    {
      id: "versions",
      icon: GitCommit,
      label: "Versiones",
      tooltip: "Historial de versiones",
      description: "Control de versiones y respaldos del bot",
    },
    {
      id: "config",
      icon: Settings,
      label: "Configuración del Bot",
      tooltip: "Configuración general",
      description: "Ajustes generales y configuración avanzada",
    },
    {
      id: "search",
      icon: Search,
      label: "Buscar",
      tooltip: "Buscar en el proyecto",
      description: "Busca elementos en todo el proyecto",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Ayuda",
      tooltip: "Centro de ayuda",
      description: "Documentación y soporte técnico",
    },
  ]

  const renderSidebarContent = () => {
    switch (activeSidebarItem) {
      case "workflows":
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-allox-dark-gray">Workflows</h3>
              <Button size="sm" className="bg-allox-lime hover:bg-allox-lime text-allox-dark-gray">
                <Plus className="w-4 h-4 mr-1" />
                Nuevo
              </Button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white border border-allox-teal/20 rounded-lg hover:border-allox-teal/40 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-allox-dark-gray">Flujo Principal</p>
                    <p className="text-sm text-gray-600">Conversación inicial del bot</p>
                  </div>
                  <Badge className="bg-allox-teal/10 text-allox-teal border-allox-teal/20">Activo</Badge>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-allox-dark-gray">Soporte Técnico</p>
                    <p className="text-sm text-gray-600">Flujo para problemas técnicos</p>
                  </div>
                  <Badge variant="secondary">Borrador</Badge>
                </div>
              </div>
            </div>
          </div>
        )
      case "knowledge":
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-allox-dark-gray">Base de Conocimientos</h3>
              <Button size="sm" className="bg-allox-lime hover:bg-allox-lime text-allox-dark-gray">
                <Upload className="w-4 h-4 mr-1" />
                Subir
              </Button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white border border-allox-teal/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-allox-teal" />
                    <div>
                      <p className="font-medium text-allox-dark-gray">FAQ Productos</p>
                      <p className="text-sm text-gray-600">25 preguntas frecuentes</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-white border border-allox-teal/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-allox-teal" />
                    <div>
                      <p className="font-medium text-allox-dark-gray">Manual de Usuario</p>
                      <p className="text-sm text-gray-600">Documentación completa</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-allox-dark-gray mb-2">
              {sidebarItems.find((item) => item.id === activeSidebarItem)?.label}
            </h3>
            <p className="text-sm text-gray-600">
              {sidebarItems.find((item) => item.id === activeSidebarItem)?.description}
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-500">Funcionalidad en desarrollo</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-nunito">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-allox-teal to-[#1FBEBA] rounded-xl flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-allox-dark-gray">Alloxentric</h1>
                <p className="text-xs text-gray-500 font-medium">Bot Editor</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center text-sm text-gray-500">
              <Home className="w-4 h-4 mr-2" />
              <span>Cliente Workspace</span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-allox-dark-gray font-semibold">Mi Bot de Atención</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-allox-teal text-allox-teal hover:bg-allox-teal hover:text-white bg-transparent font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista Previa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-allox-dark-gray text-allox-dark-gray hover:bg-allox-dark-gray hover:text-white bg-transparent font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" className="bg-allox-lime hover:bg-[#B5EC5D] text-allox-dark-gray font-semibold shadow-md">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Avatar className="w-9 h-9 border-2 border-allox-teal/20">
              <AvatarFallback className="bg-allox-teal text-white font-semibold">UB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex">
          {/* Navigation */}
          <div className="w-16 border-r border-slate-200 flex flex-col items-center py-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`w-12 h-12 p-0 transition-all duration-200 ${
                  activeSidebarItem === item.id
                    ? "bg-allox-teal text-white hover:bg-allox-dark-teal shadow-md"
                    : "text-allox-dark-gray hover:bg-allox-teal/10 hover:text-allox-teal"
                }`}
                onClick={() => setActiveSidebarItem(item.id)}
                title={item.tooltip}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 bg-gray-50">{renderSidebarContent()}</div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-allox-teal/10 text-allox-teal border-allox-teal/20 font-medium">
                <GitBranch className="w-3 h-3 mr-2" />
                Flujo Principal
              </Badge>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-allox-lime text-allox-dark-gray hover:bg-allox-lime hover:text-allox-dark-gray bg-transparent font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Nodo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-allox-teal text-allox-teal hover:bg-allox-teal hover:text-white bg-transparent font-medium"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Probar Flujo
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-allox-lime rounded-full animate-pulse"></div>
                <span>Guardado automático</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>hace 2 min</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative bg-gradient-to-br from-[#F7FDED] via-white to-[#E6F8F7] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(6,183,178,0.08)_1px,transparent_0)] bg-[length:24px_24px]"></div>

            <div className="relative h-full flex items-center justify-center">
              <div className="flex items-center space-x-40">
                {/* Start Node */}
                <Card
                  className={`w-48 cursor-pointer transition-all duration-300 border-2 shadow-lg ${
                    
                    selectedNode === "start"
                      ? "ring-4 ring-allox-lime/30 shadow-xl scale-105 border-allox-lime bg-gradient-to-br from-white to-allox-lime/5"
                      : "hover:shadow-xl hover:scale-102 border-allox-teal/30 hover:border-allox-teal bg-white"
                  }`}
                  onClick={() => setSelectedNode("start")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-allox-lime to-[#B5EC5D] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Play className="w-8 h-8 text-allox-dark-gray" />
                    </div>
                    <h3 className="text-lg font-bold text-allox-dark-gray mb-1">Inicio</h3>
                    <p className="text-sm text-gray-600 font-medium">Punto de entrada del bot</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-allox-lime rounded-full"></div>
                      <span className="text-xs text-allox-teal font-medium">Activo</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Line */}
                <div className="flex items-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-allox-teal to-[#1FBEBA] relative rounded-full shadow-sm">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-allox-teal rotate-45 rounded-sm shadow-md"></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-allox-teal"></div>
                  </div>
                </div>

                {/* End Node */}
                <Card
                  className={`w-48 cursor-pointer transition-all duration-300 border-2 shadow-lg ${
                    selectedNode === "end"
                      ? "ring-4 ring-allox-dark-gray/30 shadow-xl scale-105 border-allox-dark-gray bg-gradient-to-br from-white to-allox-dark-gray/5"
                      : "hover:shadow-xl hover:scale-102 border-allox-dark-gray/30 hover:border-allox-dark-gray bg-white"
                  }`}
                  onClick={() => setSelectedNode("end")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-allox-dark-gray to-[#435259] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Square className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-allox-dark-gray mb-1">Fin</h3>
                    <p className="text-sm text-gray-600 font-medium">Finalizar conversación</p>
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-allox-dark-gray rounded-full"></div>
                      <span className="text-xs text-allox-dark-gray font-medium">Terminal</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating Add Button */}
              <Button
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-allox-lime to-[#B5EC5D] hover:from-[#B5EC5D] hover:to-[#BDEE6F] text-allox-dark-gray shadow-xl font-semibold px-6 py-3 h-12 rounded-full border-2 border-white"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Paso
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-lg">
          <Tabs defaultValue="properties" className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="properties"
                  className="data-[state=active]:bg-allox-teal data-[state=active]:text-white font-medium"
                >
                  Propiedades
                </TabsTrigger>
                <TabsTrigger
                  value="emulator"
                  className="data-[state=active]:bg-allox-teal data-[state=active]:text-white font-medium"
                >
                  Emulador
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="flex-1 p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-allox-dark-gray mb-2">
                  {selectedNode === "start" ? "Configuración de Inicio" : "Configuración de Fin"}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {selectedNode === "start"
                    ? "Configura cómo iniciará la conversación con tus usuarios"
                    : "Define cómo terminará la conversación con tus usuarios"}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="node-name" className="text-sm font-semibold text-allox-dark-gray mb-2 block">
                    Nombre del Nodo
                  </Label>
                  <Input
                    id="node-name"
                    defaultValue={selectedNode === "start" ? "Saludo Inicial" : "Despedida"}
                    className="border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20 font-medium"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-semibold text-allox-dark-gray mb-2 block">
                    Mensaje
                  </Label>
                  <textarea
                    id="message"
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none h-28 text-sm focus:border-allox-teal focus:ring-2 focus:ring-allox-teal/20 focus:outline-none font-medium"
                    defaultValue={
                      selectedNode === "start"
                        ? "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
                        : "¡Gracias por contactarnos! Que tengas un excelente día."
                    }
                  />
                </div>

                {selectedNode === "start" && (
                  <div>
                    <Label className="text-sm font-semibold text-allox-dark-gray mb-3 block">Opciones Rápidas</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-allox-teal/5 rounded-lg border border-allox-teal/20 hover:border-allox-teal/40 transition-colors">
                        <span className="text-sm font-medium text-allox-dark-gray">Información de productos</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-allox-teal hover:bg-allox-teal hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-allox-teal/5 rounded-lg border border-allox-teal/20 hover:border-allox-teal/40 transition-colors">
                        <span className="text-sm font-medium text-allox-dark-gray">Soporte técnico</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-allox-teal hover:bg-allox-teal hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent border-allox-lime text-allox-dark-gray hover:bg-allox-lime hover:text-allox-dark-gray font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Opción
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="emulator" className="flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-allox-teal/5 to-allox-lime/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-allox-lime rounded-full animate-pulse shadow-sm"></div>
                    <div>
                      <span className="text-sm font-semibold text-allox-dark-gray">Emulador Activo</span>
                      <p className="text-xs text-gray-600">Prueba tu bot en tiempo real</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-allox-teal hover:bg-allox-teal hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs p-4 rounded-2xl text-sm font-medium shadow-sm ${
                          msg.type === "user"
                            ? "bg-allox-teal text-white rounded-br-md"
                            : "bg-gray-100 text-allox-dark-gray border border-gray-200 rounded-bl-md"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-slate-200 bg-gray-50">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Escribe un mensaje de prueba..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border-gray-200 focus:border-allox-teal focus:ring-allox-teal/20 font-medium"
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    className="bg-allox-teal hover:bg-allox-dark-teal text-white px-4 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Debug Panel */}
      <div className="h-48 bg-white border-t border-slate-200 shadow-lg">
        <Tabs defaultValue="logs" className="h-full">
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-gradient-to-r from-gray-50 to-white">
            <TabsList className="h-9 bg-white shadow-sm">
              <TabsTrigger
                value="logs"
                className="text-xs font-medium data-[state=active]:bg-allox-teal data-[state=active]:text-white"
              >
                Registros
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-xs font-medium data-[state=active]:bg-allox-teal data-[state=active]:text-white"
              >
                Eventos
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="text-xs font-medium data-[state=active]:bg-allox-teal data-[state=active]:text-white"
              >
                JSON
              </TabsTrigger>
            </TabsList>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-allox-teal hover:bg-allox-teal hover:text-white font-medium"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpiar
            </Button>
          </div>

          <TabsContent value="logs" className="p-4 h-full">
            <ScrollArea className="h-32">
              <div className="space-y-1 text-xs font-mono">
                <div className="text-gray-500 flex items-center space-x-2">
                  <span className="text-allox-teal">[14:32:15]</span>
                  <span>Bot iniciado correctamente</span>
                </div>
                <div className="text-allox-teal flex items-center space-x-2">
                  <span className="text-allox-teal">[14:32:16]</span>
                  <span>Nodo 'Inicio' ejecutado</span>
                </div>
                <div className="text-gray-500 flex items-center space-x-2">
                  <span className="text-allox-teal">[14:32:17]</span>
                  <span>Esperando interacción del usuario</span>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="events" className="p-4">
            <div className="text-xs text-gray-500 text-center py-8">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              No hay eventos recientes
            </div>
          </TabsContent>

          <TabsContent value="json" className="p-4">
            <ScrollArea className="h-32">
              <pre className="text-xs text-allox-dark-gray bg-gray-50 p-3 rounded-lg">
                {`{
  "workflow": {
    "id": "main_flow",
    "name": "Flujo Principal",
    "nodes": [
      {
        "id": "start",
        "type": "greeting",
        "message": "¡Hola! Soy tu asistente virtual...",
        "options": [
          "Información de productos",
          "Soporte técnico"
        ]
      }
    ],
    "connections": [
      {
        "from": "start",
        "to": "end"
      }
    ]
  }
}`}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
