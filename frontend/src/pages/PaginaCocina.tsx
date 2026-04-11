import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { BarraNavegacion } from "@/components/barra-navegacion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodayReservationsTab } from "@/components/cocina/pestaña-reservas-hoy"
import { WeeklyMenuTab } from "@/components/cocina/pestaña-menu-semanal"
import { GastroEventsTab } from "@/components/cocina/pestaña-eventos-gastro"
import { TodoListTab } from "@/components/cocina/pestaña-lista-tareas"
import { AlumnosTab } from "@/components/cocina/pestaña-alumnos"
import { ActivityLogsTab } from "@/components/cocina/pestaña-registros-actividad"
import { SearchReservationsTab } from "@/components/cocina/pestaña-buscar-reservas"
import { Menu, CalendarDays, ClipboardList, Utensils, Star, Users, Activity, ScanLine, ChevronDown, ChevronRight, PackageOpen } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function PaginaCocina() {
  const { usuario, cargando } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("today")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPedidosOpen, setIsPedidosOpen] = useState(true)

  useEffect(() => {
    if (!cargando && (!usuario || (usuario.rol !== "cocina" && usuario.rol !== "alumno-cocina" && usuario.rol !== "alumno-cocina-titular"))) {
      navigate("/")
    }
  }, [usuario, cargando, navigate])

  if (cargando || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--md-page-bg)">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--md-accent) border-r-transparent"></div>
          <p className="mt-4 text-(--md-body)">Cargando...</p>
        </div>
      </div>
    )
  }

  const navItem = (value: string, label: string, onClick?: () => void) => {
    const isActive = activeTab === value
    const handleClick = () => {
      setActiveTab(value)
      onClick?.()
    }
    return { isActive, handleClick }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-(--md-page-bg) to-(--md-accent-light)/20">
      <BarraNavegacion />
      <main className="px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Sticky Header */}
          <div className="md:hidden sticky top-0 z-40 -mx-6 px-6 pt-[10px] pb-0 mb-6 bg-(--md-page-bg)/80 backdrop-blur-xl">
            <div className="bg-(--md-surface)/95 border border-(--md-accent)/80 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-(--md-accent)/20">
              <h1 className="text-xl font-bold text-(--md-heading)">Panel <span className="text-(--md-coral)">Cocina</span></h1>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-(--md-accent) bg-(--md-surface) text-(--md-heading) hover:bg-(--md-accent)/50">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-(--md-accent) bg-(--md-page-bg)">
                  <SheetHeader className="mb-6 mt-4">
                    <SheetTitle className="text-left text-2xl font-bold text-(--md-heading)">
                      Panel <span className="text-(--md-coral)">Cocina</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-1 gap-1 rounded-md">
                    <button onClick={() => { setActiveTab("today"); setIsMobileMenuOpen(false) }}
                      className={`text-left px-4 py-3 rounded-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === "today" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-heading) hover:bg-(--md-accent)/20"}`}>
                      <CalendarDays className="h-4 w-4 text-(--md-coral)" /> Previsión y Totales
                    </button>

                    <div className="flex flex-col gap-1 mt-1">
                      <button onClick={() => setIsPedidosOpen(!isPedidosOpen)}
                        className="text-left px-4 py-3 rounded-sm font-semibold flex items-center justify-between text-(--md-heading) hover:bg-(--md-accent)/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <PackageOpen className="h-4 w-4 text-(--md-coral)" /> Pedidos
                        </div>
                        {isPedidosOpen ? <ChevronDown className="h-4 w-4 text-(--md-body)" /> : <ChevronRight className="h-4 w-4 text-(--md-body)" />}
                      </button>
                      {isPedidosOpen && (
                        <div className="flex flex-col gap-1 pl-4 ml-2 border-l-2 border-(--md-accent)/30 mt-1">
                          <button onClick={() => { setActiveTab("todo"); setIsMobileMenuOpen(false) }}
                            className={`text-left px-4 py-2 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "todo" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                            <ClipboardList className="h-4 w-4" /> Gestión de Pedidos
                          </button>
                          <button onClick={() => { setActiveTab("search"); setIsMobileMenuOpen(false) }}
                            className={`text-left px-4 py-2 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "search" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                            <ScanLine className="h-4 w-4" /> Pasaplatos / Entregas
                          </button>
                        </div>
                      )}
                    </div>

                    <button onClick={() => { setActiveTab("menu"); setIsMobileMenuOpen(false) }}
                      className={`text-left px-4 py-3 rounded-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === "menu" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-heading) hover:bg-(--md-accent)/20"}`}>
                      <Utensils className="h-4 w-4 text-(--md-coral)" /> Menú Semanal
                    </button>
                    <button onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false) }}
                      className={`text-left px-4 py-3 rounded-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === "events" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-heading) hover:bg-(--md-accent)/20"}`}>
                      <Star className="h-4 w-4 text-(--md-coral)" /> Eventos
                    </button>
                    {usuario?.rol === "cocina" && (
                      <button onClick={() => { setActiveTab("alumnos"); setIsMobileMenuOpen(false) }}
                        className={`text-left px-4 py-3 rounded-sm font-semibold flex items-center gap-3 transition-colors ${activeTab === "alumnos" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-heading) hover:bg-(--md-accent)/20"}`}>
                        <Users className="h-4 w-4 text-(--md-coral)" /> Alumnos
                      </button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-(--md-heading)">Panel de <span className="text-(--md-coral)">Cocina</span></h1>
              <p className="text-(--md-body) mt-2">Gestiona el menú semanal, eventos y reservas</p>
            </div>

            <TabsList className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-2 gap-1 rounded-xl shadow-sm">
              <TabsTrigger value="today" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-heading) font-semibold hover:bg-(--md-accent)/20 transition-colors py-2 px-3 gap-3 rounded-md">
                <CalendarDays className="h-4 w-4 text-(--md-coral)" /> Previsión y Totales
              </TabsTrigger>

              <div className="h-px bg-(--md-accent)/30 w-full my-1"></div>

              <div className="w-full flex flex-col gap-1">
                <button onClick={() => setIsPedidosOpen(!isPedidosOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-(--md-heading) font-semibold rounded-md hover:bg-(--md-accent)/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <PackageOpen className="h-4 w-4 text-(--md-coral)" /> Pedidos
                  </div>
                  {isPedidosOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>
                {isPedidosOpen && (
                  <div className="flex flex-col gap-1 pl-4 ml-4 border-l-2 border-(--md-accent)/40 mt-1">
                    <TabsTrigger value="todo" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2 gap-3 rounded-md">
                      <ClipboardList className="h-4 w-4" /> Gestión de Pedidos
                    </TabsTrigger>
                    <TabsTrigger value="search" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2 gap-3 rounded-md">
                      <ScanLine className="h-4 w-4" /> Pasaplatos / Entregas
                    </TabsTrigger>
                  </div>
                )}
              </div>

              <div className="h-px bg-(--md-accent)/30 w-full my-1"></div>

              <TabsTrigger value="menu" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-heading) font-semibold hover:bg-(--md-accent)/20 transition-colors py-2 px-3 gap-3 rounded-md">
                <Utensils className="h-4 w-4 text-(--md-coral)" /> Menú Semanal
              </TabsTrigger>
              <TabsTrigger value="events" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-heading) font-semibold hover:bg-(--md-accent)/20 transition-colors py-2 px-3 gap-3 rounded-md">
                <Star className="h-4 w-4 text-(--md-coral)" /> Eventos
              </TabsTrigger>
              {usuario?.rol === "cocina" && (
                <>
                  <TabsTrigger value="alumnos" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-heading) font-semibold hover:bg-(--md-accent)/20 transition-colors py-2 px-3 gap-3 rounded-md">
                    <Users className="h-4 w-4 text-(--md-coral)" /> Alumnos
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-heading) font-semibold hover:bg-(--md-accent)/20 transition-colors py-2 px-3 gap-3 rounded-md">
                    <Activity className="h-4 w-4 text-(--md-coral)" /> Actividad
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="todo" className="mt-0"><TodoListTab /></TabsContent>
            <TabsContent value="today" className="mt-0"><TodayReservationsTab /></TabsContent>
            <TabsContent value="search" className="mt-0"><SearchReservationsTab /></TabsContent>
            <TabsContent value="menu" className="mt-0"><WeeklyMenuTab /></TabsContent>
            <TabsContent value="events" className="mt-0"><GastroEventsTab /></TabsContent>
            {usuario?.rol === "cocina" && (
              <>
                <TabsContent value="alumnos" className="mt-0"><AlumnosTab /></TabsContent>
                <TabsContent value="activity" className="mt-0"><ActivityLogsTab /></TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  )
}
