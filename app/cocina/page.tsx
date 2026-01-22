"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TodayReservationsTab } from "@/components/cocina/today-reservations-tab"
import { InventoryTab } from "@/components/cocina/inventory-tab"
import { WeeklyMenuTab } from "@/components/cocina/weekly-menu-tab"
import { GastroEventsTab } from "@/components/cocina/gastro-events-tab"

export default function CocinaPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "cocina")) {
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
          <h1 className="text-3xl font-bold text-[#5C5C5C]">Panel de <span className="text-[#F2594B]">Cocina</span></h1>
          <p className="text-[#737373]">Gestiona el menú semanal, inventario y reservas</p>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-[#FFFEF9] border border-[#F2EDA2]">
            <TabsTrigger value="today" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Reservas Hoy</TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Menú Semanal</TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Eventos</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Inventario</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <TodayReservationsTab />
          </TabsContent>

          <TabsContent value="menu">
            <WeeklyMenuTab />
          </TabsContent>

          <TabsContent value="events">
            <GastroEventsTab />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
