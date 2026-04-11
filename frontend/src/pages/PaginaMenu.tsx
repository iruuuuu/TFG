import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { BarraNavegacion } from "@/components/barra-navegacion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyMenuView } from "@/components/menu/vista-menu-semanal"
import { MyReservations } from "@/components/menu/mis-reservas"
import { RatingsView } from "@/components/menu/vista-valoraciones"
import { GastroEventsView } from "@/components/menu/vista-eventos-gastro"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function PaginaMenu() {
  const { usuario, cargando } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("menu")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!cargando && usuario && usuario.rol !== "maestro" && usuario.rol !== "alumno-cocina" && usuario.rol !== "admin") {
      navigate("/iniciarSesion")
    }
  }, [usuario, cargando, navigate])

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--md-page-bg)">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--md-accent) border-r-transparent"></div>
          <p className="mt-4 text-(--md-body)">Cargando Menú...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-(--md-page-bg) to-(--md-accent-light)/20">
      <BarraNavegacion />
      <main className="px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">

          {/* Mobile Sticky Header */}
          <div className="md:hidden sticky top-0 z-40 -mx-6 px-6 pt-[10px] pb-0 mb-6 bg-(--md-page-bg)/80 backdrop-blur-xl">
            <div className="bg-(--md-surface)/95 border border-(--md-accent)/80 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-(--md-accent)/20">
              <h1 className="text-xl font-bold text-(--md-heading)">Menú <span className="text-(--md-coral)">Semanal</span></h1>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-(--md-accent) bg-(--md-surface) text-(--md-heading) hover:bg-(--md-accent)/50">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-(--md-accent) bg-(--md-page-bg)">
                  <SheetHeader className="mb-6 mt-4">
                    <SheetTitle className="text-left text-2xl font-bold text-(--md-heading)">
                      Menú <span className="text-(--md-coral)">Semanal</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-1 gap-1 rounded-md">
                    <button onClick={() => { setActiveTab("menu"); setIsMobileMenuOpen(false) }}
                      className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "menu" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                      Menú de la Semana
                    </button>
                    <button onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false) }}
                      className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "events" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                      Eventos
                    </button>
                    {usuario && (
                      <>
                        <button onClick={() => { setActiveTab("reservas"); setIsMobileMenuOpen(false) }}
                          className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "reservas" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                          Mis Reservas
                        </button>
                        <button onClick={() => { setActiveTab("valoraciones"); setIsMobileMenuOpen(false) }}
                          className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "valoraciones" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}>
                          Valoraciones
                        </button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-(--md-heading)">Menú <span className="text-(--md-coral)">Semanal</span></h1>
              <p className="text-(--md-body)">Consulta el menú y gestiona tus reservas</p>
            </div>

            <TabsList className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-1 gap-1">
              <TabsTrigger value="menu" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5">Menú de la Semana</TabsTrigger>
              <TabsTrigger value="events" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5">Eventos</TabsTrigger>
              {usuario && (
                <>
                  <TabsTrigger value="reservas" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5">Mis Reservas</TabsTrigger>
                  <TabsTrigger value="valoraciones" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5">Valoraciones</TabsTrigger>
                </>
              )}
            </TabsList>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="menu" className="mt-0"><WeeklyMenuView /></TabsContent>
            <TabsContent value="events" className="mt-0"><GastroEventsView /></TabsContent>
            <TabsContent value="reservas" className="mt-0"><MyReservations /></TabsContent>
            <TabsContent value="valoraciones" className="mt-0"><RatingsView /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
