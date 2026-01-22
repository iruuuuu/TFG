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
      color: "text-[#5C5C5C]",
      bgColor: "bg-[#F2EDA2]",
      highlight: true,
    },
    {
      title: "Total Usuarios",
      value: "156",
      description: "3 nuevos esta semana",
      icon: Users,
      color: "text-[#5C5C5C]",
      bgColor: "bg-[#F2EFC2]",
      highlight: false,
    },
    {
      title: "Platos Disponibles",
      value: "8",
      description: "Menú de esta semana",
      icon: UtensilsCrossed,
      color: "text-[#5C5C5C]",
      bgColor: "bg-[#F2EDA2]",
      highlight: false,
    },
    {
      title: "Valoración Media",
      value: "4.5",
      description: "Basado en 48 opiniones",
      icon: Star,
      color: "text-[#5C5C5C]",
      bgColor: "bg-[#F2EFC2]",
      highlight: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-[#F2EDA2] bg-[#FFFEF9]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5C5C5C]">{stat.title}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.highlight ? "text-[#F2594B]" : "text-[#5C5C5C]"}`}>{stat.value}</div>
                <p className="text-xs text-[#737373]">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#F2EDA2] bg-[#FFFEF9]">
          <CardHeader>
            <CardTitle className="text-[#5C5C5C]">Platos Más <span className="text-[#F2594B]">Populares</span></CardTitle>
            <CardDescription className="text-[#737373]">Esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Pollo al Horno con Patatas", orders: 45 },
                { name: "Paella de Verduras", orders: 38 },
                { name: "Ensalada Mediterránea", orders: 32 },
              ].map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-[#5C5C5C]">{item.name}</span>
                  <span className={`text-sm font-semibold ${idx === 0 ? "text-[#F2594B]" : "text-[#737373]"}`}>{item.orders} pedidos</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#F2EDA2] bg-[#FFFEF9]">
          <CardHeader>
            <CardTitle className="text-[#5C5C5C]">Alertas de <span className="text-[#F2594B]">Inventario</span></CardTitle>
            <CardDescription className="text-[#737373]">Productos con stock bajo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Arroz", stock: "5 kg", status: "Bajo" },
                { name: "Aceite de Oliva", stock: "8 litros", status: "Medio" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#5C5C5C]">{item.name}</p>
                    <p className="text-xs text-[#737373]">{item.stock}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "Bajo" ? "bg-[#FFF5F4] text-[#F2594B] font-semibold" : "bg-[#F2EDA2] text-[#5C5C5C]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
