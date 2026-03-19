"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyMenuView } from "@/components/menu/weekly-menu-view"
import { MyReservations } from "@/components/menu/my-reservations"
import { RatingsView } from "@/components/menu/ratings-view"
import { GastroEventsView } from "@/components/menu/gastro-events-view"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function MenuPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("menu")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "maestro")) {
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
    <div className="min-h-screen bg-gradient-to-br from-[var(--gm-page-bg)] to-[var(--gm-accent-light)]/20">
      <Navbar />
      <main className="px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Sticky Header Wrapper */}
          <div className="md:hidden sticky top-0 z-40 -mx-6 px-6 pt-[10px] pb-0 mb-6 bg-[var(--gm-page-bg)]/80 backdrop-blur-xl">
            {/* Menu Box */}
            <div className="bg-[var(--gm-surface)]/95 border border-[var(--gm-accent)]/80 rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-[var(--gm-accent)]/20">
            <div>
              <h1 className="text-xl font-bold text-[var(--gm-heading)]">Menú <span className="text-[var(--gm-coral)]">Semanal</span></h1>
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-[var(--gm-accent)] bg-[var(--gm-surface)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent)]/50">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r-[var(--gm-accent)] bg-[var(--gm-page-bg)]">
                <SheetHeader className="mb-6 mt-4">
                  <SheetTitle className="text-left text-2xl font-bold text-[var(--gm-heading)]">
                    Menú <span className="text-[var(--gm-coral)]">Semanal</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-auto w-full bg-[var(--gm-surface)] border border-[var(--gm-accent)] p-1 gap-1 rounded-md">
                  <button 
                    onClick={() => { setActiveTab("menu"); setIsMobileMenuOpen(false) }} 
                    className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "menu" ? "bg-[var(--gm-accent)] text-[var(--gm-heading)]" : "text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)]"}`}
                  >Menú de la Semana</button>
                  <button 
                    onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false) }} 
                    className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "events" ? "bg-[var(--gm-accent)] text-[var(--gm-heading)]" : "text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)]"}`}
                  >Eventos</button>
                  <button 
                    onClick={() => { setActiveTab("reservations"); setIsMobileMenuOpen(false) }} 
                    className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "reservations" ? "bg-[var(--gm-accent)] text-[var(--gm-heading)]" : "text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)]"}`}
                  >Mis Reservas</button>
                  <button 
                    onClick={() => { setActiveTab("ratings"); setIsMobileMenuOpen(false) }} 
                    className={`text-left px-4 py-3 rounded-sm font-medium transition-colors ${activeTab === "ratings" ? "bg-[var(--gm-accent)] text-[var(--gm-heading)]" : "text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)]"}`}
                  >Valoraciones</button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </div>

          <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--gm-heading)]">Menú <span className="text-[var(--gm-coral)]">Semanal</span></h1>
              <p className="text-[var(--gm-body)]">Consulta el menú y gestiona tus reservas</p>
            </div>

            <TabsList className="flex flex-col h-auto w-full bg-[var(--gm-surface)] border border-[var(--gm-accent)] p-1 gap-1">
              <TabsTrigger value="menu" className="w-full justify-start data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)] transition-colors py-2.5">Menú de la Semana</TabsTrigger>
              <TabsTrigger value="events" className="w-full justify-start data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)] transition-colors py-2.5">Eventos</TabsTrigger>
              <TabsTrigger value="reservations" className="w-full justify-start data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)] transition-colors py-2.5">Mis Reservas</TabsTrigger>
              <TabsTrigger value="ratings" className="w-full justify-start data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)] transition-colors py-2.5">Valoraciones</TabsTrigger>
            </TabsList>
          </aside>

          <div className="flex-1 w-full min-w-0">
            <TabsContent value="menu" className="mt-0">
              <WeeklyMenuView />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <GastroEventsView />
            </TabsContent>

            <TabsContent value="reservations" className="mt-0">
              <MyReservations />
            </TabsContent>

            <TabsContent value="ratings" className="mt-0">
              <RatingsView />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
