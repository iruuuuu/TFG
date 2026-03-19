"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodayReservationsTab } from "@/components/cocina/today-reservations-tab"
import { WeeklyMenuTab } from "@/components/cocina/weekly-menu-tab"
import { GastroEventsTab } from "@/components/cocina/gastro-events-tab"
import { TodoListTab } from "@/components/cocina/todo-list-tab"
import { AlumnosTab } from "@/components/cocina/alumnos-tab"
import { ActivityLogsTab } from "@/components/cocina/activity-logs-tab"
import { Menu, CalendarDays, ClipboardList, Utensils, Star, Users, Activity } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function CocinaPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("todo")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "cocina" && user.role !== "alumno-cocina" && user.role !== "alumno-cocina-titular"))) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F0] to-[#FDF1B6]/20">
      <Navbar />
      <main className="px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Sticky Header Wrapper */}
          <div className="md:hidden sticky top-0 z-40 -mx-6 px-6 pt-[10px] pb-0 mb-6 bg-[#FAF7F0]/80 backdrop-blur-xl">
            {/* Menu Box */}
            <div className="bg-[#FFFFFF]/95 border border-[#FAD85D]/80 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-[#FAD85D]/20">
              <div>
                <h1 className="text-xl font-bold text-[#4A3B32]">Panel <span className="text-[#E8654D]">Cocina</span></h1>
              </div>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-[#FAD85D] bg-[#FFFFFF] text-[#4A3B32] hover:bg-[#FAD85D]/50">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-[#FAD85D] bg-[#FAF7F0]">
                  <SheetHeader className="mb-6 mt-4">
                    <SheetTitle className="text-left text-2xl font-bold text-[#4A3B32]">
                      Panel <span className="text-[#E8654D]">Cocina</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-auto w-full bg-[#FFFFFF] border border-[#FAD85D] p-1 gap-1 rounded-md">
                    <button 
                      onClick={() => { setActiveTab("todo"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "todo" ? "bg-[#FAD85D] text-[#4A3B32]" : "text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32]"}`}
                    >
                      <ClipboardList className="h-4 w-4" />
                      Gestión de Pedidos
                    </button>
                    <button 
                      onClick={() => { setActiveTab("today"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "today" ? "bg-[#FAD85D] text-[#4A3B32]" : "text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32]"}`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Reservas Hoy
                    </button>
                    <button 
                      onClick={() => { setActiveTab("menu"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "menu" ? "bg-[#FAD85D] text-[#4A3B32]" : "text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32]"}`}
                    >
                      <Utensils className="h-4 w-4" />
                      Menú Semanal
                    </button>
                    <button 
                      onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "events" ? "bg-[#FAD85D] text-[#4A3B32]" : "text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32]"}`}
                    >
                      <Star className="h-4 w-4" />
                      Eventos
                    </button>
                    {user?.role === "cocina" && (
                      <button 
                        onClick={() => { setActiveTab("alumnos"); setIsMobileMenuOpen(false) }} 
                        className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "alumnos" ? "bg-[#FAD85D] text-[#4A3B32]" : "text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32]"}`}
                      >
                        <Users className="h-4 w-4" />
                        Alumnos
                      </button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#4A3B32]">Panel de <span className="text-[#E8654D]">Cocina</span></h1>
              <p className="text-[#877669] mt-2">Gestiona el menú semanal, eventos y reservas</p>
            </div>

            <TabsList className="flex flex-col h-auto w-full bg-[#FFFFFF] border border-[#FAD85D] p-1 gap-1">
              <TabsTrigger value="todo" className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3">
                <ClipboardList className="h-4 w-4" />
                Gestión de Pedidos
              </TabsTrigger>
              <TabsTrigger value="today" className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3">
                <CalendarDays className="h-4 w-4" />
                Reservas Hoy
              </TabsTrigger>
              <TabsTrigger value="menu" className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3">
                <Utensils className="h-4 w-4" />
                Menú Semanal
              </TabsTrigger>
              <TabsTrigger value="events" className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3">
                <Star className="h-4 w-4" />
                Eventos
                </TabsTrigger>
                {user?.role === "cocina" && (
                  <>
                    <TabsTrigger
                      value="alumnos"
                      className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3"
                    >
                      <Users className="h-4 w-4" />
                      Alumnos
                    </TabsTrigger>
                    <TabsTrigger
                      value="activity"
                      className="w-full justify-start data-[state=active]:bg-[#FAD85D] data-[state=active]:text-[#4A3B32] text-[#877669] hover:bg-[#FAD85D]/50 hover:text-[#4A3B32] transition-colors py-2.5 gap-3"
                    >
                      <Activity className="h-4 w-4" />
                      Actividad
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="todo" className="mt-0">
              <TodoListTab />
            </TabsContent>

            <TabsContent value="today" className="mt-0">
              <TodayReservationsTab />
            </TabsContent>

            <TabsContent value="menu" className="mt-0">
              <WeeklyMenuTab />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <GastroEventsTab />
            </TabsContent>

            {user?.role === "cocina" && (
              <>
                <TabsContent value="alumnos" className="mt-0">
                  <AlumnosTab />
                </TabsContent>
                <TabsContent value="activity" className="mt-0">
                  <ActivityLogsTab />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  )
}
