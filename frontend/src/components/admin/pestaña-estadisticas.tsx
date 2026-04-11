"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UtensilsCrossed, Calendar, Star } from "lucide-react"

export function StatsTab() {
  const stats = [
    {
      title: "Reservas Hoy",
      value: "24",
      descripcion: "+12% desde ayer",
      icon: Calendar,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent)",
      highlight: true,
    },
    {
      title: "Total Usuarios",
      value: "156",
      descripcion: "3 nuevos esta semana",
      icon: Users,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent-light)",
      highlight: false,
    },
    {
      title: "Platos Disponibles",
      value: "8",
      descripcion: "Menú de esta semana",
      icon: UtensilsCrossed,
      color: "text-(--md-heading)",
      bgColor: "bg-(--md-accent)",
      highlight: false,
    },
    {
      title: "Valoración Media",
      value: "4.5",
      descripcion: "Basado en 48 opiniones",
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
            <CardDescription className="text-md-body">Esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nombre: "Pollo al Horno con Patatas", orders: 45 },
                { nombre: "Paella de Verduras", orders: 38 },
                { nombre: "Ensalada Mediterránea", orders: 32 },
              ].map((item, idx) => (
                <div key={item.nombre} className="flex items-center justify-between">
                  <span className="text-sm text-(--md-heading)">{item.nombre}</span>
                  <span className={`text-sm font-semibold ${idx === 0 ? "text-(--md-coral)" : "text-(--md-body)"}`}>{item.orders} pedidos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

