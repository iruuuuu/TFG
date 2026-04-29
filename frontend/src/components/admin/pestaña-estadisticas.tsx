"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UtensilsCrossed, Calendar, Star } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useMemo } from "react"

export function StatsTab() {
  const { reservas, platosMenu, valoraciones } = useDatos()
  const { todosLosUsuarios } = useAuth()

  const statsCalculated = useMemo(() => {
    // 1. Reservas Hoy
    const today = new Date().toISOString().split('T')[0]
    const hoyReservas = reservas.filter(r => {
      const resDate = new Date(r.fecha).toISOString().split('T')[0]
      return resDate === today
    }).length

    // 2. Total Usuarios
    const totalUsuarios = todosLosUsuarios.length

    // 3. Platos Disponibles
    const platosDisponibles = platosMenu.filter(p => p.disponible).length

    // 4. Valoración Media
    const avgRating = valoraciones.length > 0 
      ? (valoraciones.reduce((acc, v) => acc + v.puntuacion, 0) / valoraciones.length).toFixed(1)
      : "0.0"

    // 5. Platos Populares (Count occurrences of dish IDs in all reservations)
    const dishCounts: Record<string, number> = {}
    reservas.forEach(r => {
      r.platosMenu.forEach(id => {
        dishCounts[id] = (dishCounts[id] || 0) + 1
      })
    })

    const popularDishes = Object.entries(dishCounts)
      .map(([id, count]) => ({
        nombre: platosMenu.find(p => p.id === id)?.nombre || "Plato desconocido",
        orders: count
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)

    return {
      hoyReservas,
      totalUsuarios,
      platosDisponibles,
      avgRating,
      popularDishes,
      totalOpiniones: valoraciones.length
    }
  }, [reservas, platosMenu, valoraciones, todosLosUsuarios])

  const stats = [
    {
      title: "Reservas Hoy",
      value: statsCalculated.hoyReservas.toString(),
      descripcion: "Total para la fecha actual",
      icon: Calendar,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent)",
      highlight: true,
    },
    {
      title: "Total Usuarios",
      value: statsCalculated.totalUsuarios.toString(),
      descripcion: "Usuarios registrados en el sistema",
      icon: Users,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent-light)",
      highlight: false,
    },
    {
      title: "Platos Disponibles",
      value: statsCalculated.platosDisponibles.toString(),
      descripcion: "En el catálogo activo",
      icon: UtensilsCrossed,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent)",
      highlight: false,
    },
    {
      title: "Valoración Media",
      value: statsCalculated.avgRating,
      descripcion: `Basado en ${statsCalculated.totalOpiniones} opiniones`,
      icon: Star,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent-light)",
      highlight: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-md-accent bg-md-surface shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-md-heading uppercase tracking-tight">{stat.title}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-inner ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? "text-md-coral" : "text-md-heading"}`}>{stat.value}</div>
                <p className="text-xs text-md-body/80 font-medium">{stat.descripcion}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-md-accent bg-md-surface shadow-sm">
          <CardHeader>
            <CardTitle className="text-md-heading">Platos Más <span className="text-md-coral">Populares</span></CardTitle>
            <CardDescription className="text-md-body">Basado en el histórico de reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsCalculated.popularDishes.length > 0 ? (
                statsCalculated.popularDishes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-(--md-accent)/20 pb-2 last:border-0">
                    <span className="text-sm text-(--md-heading) font-medium">{item.nombre}</span>
                    <span className={`text-sm font-semibold ${idx === 0 ? "text-(--md-coral)" : "text-(--md-body)"}`}>{item.orders} reservas</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No hay datos de reservas todavía.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

