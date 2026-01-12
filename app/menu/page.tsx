"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeeklyMenuView } from "@/components/menu/weekly-menu-view"
import { MyReservations } from "@/components/menu/my-reservations"
import { RatingsView } from "@/components/menu/ratings-view"

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Menú Semanal</h1>
          <p className="text-muted-foreground">Consulta el menú y gestiona tus reservas</p>
        </div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="menu">Menú de la Semana</TabsTrigger>
            <TabsTrigger value="reservations">Mis Reservas</TabsTrigger>
            <TabsTrigger value="ratings">Valoraciones</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <WeeklyMenuView />
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
