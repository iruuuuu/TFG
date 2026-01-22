"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyMenuView } from "@/components/menu/weekly-menu-view"
import { MyReservations } from "@/components/menu/my-reservations"
import { RatingsView } from "@/components/menu/ratings-view"
import { GastroEventsView } from "@/components/menu/gastro-events-view"

export default function MenuPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF7] to-[#F2EFC2]/20">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#5C5C5C]">Menú <span className="text-[#F2594B]">Semanal</span></h1>
          <p className="text-[#737373]">Consulta el menú y gestiona tus reservas</p>
        </div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-[#FFFEF9] border border-[#F2EDA2]">
            <TabsTrigger value="menu" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Menú de la Semana</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Eventos</TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Mis Reservas</TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Valoraciones</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <WeeklyMenuView />
          </TabsContent>

          <TabsContent value="events">
            <GastroEventsView />
          </TabsContent>

          <TabsContent value="reservations">
            <MyReservations />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
