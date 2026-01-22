"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTab } from "@/components/admin/users-tab"
import { MenusTab } from "@/components/admin/menus-tab"
import { ReservationsTab } from "@/components/admin/reservations-tab"
import { StatsTab } from "@/components/admin/stats-tab"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
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
          <h1 className="text-3xl font-bold text-[#5C5C5C]">Panel de <span className="text-[#F2594B]">Administración</span></h1>
          <p className="text-[#737373]">Gestiona todos los aspectos del sistema</p>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-[#FFFEF9] border border-[#F2EDA2]">
            <TabsTrigger value="stats" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Estadísticas</TabsTrigger>
            <TabsTrigger value="menus" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Menús</TabsTrigger>
            <TabsTrigger value="reservations" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Reservas</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373]">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>

          <TabsContent value="menus">
            <MenusTab />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationsTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
