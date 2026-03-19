"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UtensilsCrossed, Calendar, Star } from "lucide-react"

export function StatsTab() {
  const stats = [
    {
      title: "Reservas Hoy",
      value: "24",
      description: "+12% desde ayer",
      icon: Calendar,
      color: "text-[#4A3B32]",
      bgColor: "bg-[#FAD85D]",
      highlight: true,
    },
    {
      title: "Total Usuarios",
      value: "156",
      description: "3 nuevos esta semana",
      icon: Users,
      color: "text-[#4A3B32]",
      bgColor: "bg-[#FDF1B6]",
      highlight: false,
    },
    {
      title: "Platos Disponibles",
      value: "8",
      description: "Menú de esta semana",
      icon: UtensilsCrossed,
      color: "text-[#4A3B32]",
      bgColor: "bg-[#FAD85D]",
      highlight: false,
    },
    {
      title: "Valoración Media",
      value: "4.5",
      description: "Basado en 48 opiniones",
      icon: Star,
      color: "text-[#4A3B32]",
      bgColor: "bg-[#FDF1B6]",
      highlight: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#FAD85D] bg-[#FFFFFF]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#4A3B32]">{stat.title}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? "text-[#E8654D]" : "text-[#4A3B32]"}`}>{stat.value}</div>
                <p className="text-xs text-[#877669]">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-[#FAD85D] bg-[#FFFFFF]">
          <CardHeader>
            <CardTitle className="text-[#4A3B32]">Platos Más <span className="text-[#E8654D]">Populares</span></CardTitle>
            <CardDescription className="text-[#877669]">Esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Pollo al Horno con Patatas", orders: 45 },
                { name: "Paella de Verduras", orders: 38 },
                { name: "Ensalada Mediterránea", orders: 32 },
              ].map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-[#4A3B32]">{item.name}</span>
                  <span className={`text-sm font-semibold ${idx === 0 ? "text-[#E8654D]" : "text-[#877669]"}`}>{item.orders} pedidos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
