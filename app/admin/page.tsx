"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTab } from "@/components/admin/users-tab"
import { MenusTab } from "@/components/admin/menus-tab"
import { ReservationsTab } from "@/components/admin/reservations-tab"
import { StatsTab } from "@/components/admin/stats-tab"
import { ActivityLogsTab } from "@/components/cocina/activity-logs-tab"
import { Menu, BarChart3, Utensils, CalendarDays, Users, Activity } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("stats")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
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
    <div className="min-h-screen bg-gradient-to-br from-(--md-page-bg) to-(--md-accent-light)/20">
      <Navbar />
      <main className="px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Sticky Header Wrapper */}
          <div className="md:hidden sticky top-0 z-40 -mx-6 px-6 pt-[10px] pb-0 mb-6 bg-(--md-page-bg)/80 backdrop-blur-xl">
            {/* Menu Box */}
            <div className="bg-(--md-surface)/95 border border-(--md-accent)/80 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-(--md-accent)/20">
              <div>
                <h1 className="text-xl font-bold text-(--md-heading)">Panel <span className="text-(--md-coral)">Admin</span></h1>
              </div>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-(--md-accent) bg-(--md-surface) text-(--md-heading) hover:bg-(--md-accent)/50">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-r-(--md-accent) bg-(--md-page-bg)">
                  <SheetHeader className="mb-6 mt-4">
                    <SheetTitle className="text-left text-2xl font-bold text-(--md-heading)">
                      Panel <span className="text-(--md-coral)">Admin</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-1 gap-1 rounded-md">
                    <button 
                      onClick={() => { setActiveTab("stats"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "stats" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      Estadísticas
                    </button>
                    <button 
                      onClick={() => { setActiveTab("menus"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "menus" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}
                    >
                      <Utensils className="h-4 w-4" />
                      Menús
                    </button>
                    <button 
                      onClick={() => { setActiveTab("reservations"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "reservations" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Reservas
                    </button>
                    <button 
                      onClick={() => { setActiveTab("users"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "users" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}
                    >
                      <Users className="h-4 w-4" />
                      Usuarios
                    </button>
                    <button 
                      onClick={() => { setActiveTab("activity"); setIsMobileMenuOpen(false) }} 
                      className={`text-left px-4 py-3 rounded-sm font-medium flex items-center gap-3 transition-colors ${activeTab === "activity" ? "bg-(--md-accent) text-(--md-heading)" : "text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading)"}`}
                    >
                      <Activity className="h-4 w-4" />
                      Actividad
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-(--md-heading)">Panel <span className="text-(--md-coral)">Admin</span></h1>
              <p className="text-(--md-body)">Gestión global del sistema</p>
            </div>

            <TabsList className="flex flex-col h-auto w-full bg-(--md-surface) border border-(--md-accent) p-1 gap-1">
              <TabsTrigger value="stats" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5 gap-3">
                <BarChart3 className="h-4 w-4" />
                Estadísticas
              </TabsTrigger>
              <TabsTrigger value="menus" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5 gap-3">
                <Utensils className="h-4 w-4" />
                Menús
              </TabsTrigger>
              <TabsTrigger value="reservations" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5 gap-3">
                <CalendarDays className="h-4 w-4" />
                Reservas
              </TabsTrigger>
              <TabsTrigger value="users" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5 gap-3">
                <Users className="h-4 w-4" />
                Usuarios
              </TabsTrigger>
              <TabsTrigger value="activity" className="w-full justify-start data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2.5 gap-3">
                <Activity className="h-4 w-4" />
                Actividad
              </TabsTrigger>
            </TabsList>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="stats" className="mt-0">
              <StatsTab />
            </TabsContent>

            <TabsContent value="menus" className="mt-0">
              <MenusTab />
            </TabsContent>

            <TabsContent value="reservations" className="mt-0">
              <ReservationsTab />
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <UsersTab />
            </TabsContent>

            <TabsContent value="activity" className="mt-0">
              <ActivityLogsTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

