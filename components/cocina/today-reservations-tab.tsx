"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, UtensilsCrossed } from "lucide-react"

interface Reservation {
  id: string
  userName: string
  time: string
  items: string[]
  prepared: boolean
}

export function TodayReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      userName: "Profesor García",
      time: "13:00",
      items: ["Pollo al Horno con Patatas", "Ensalada Mediterránea", "Flan Casero"],
      prepared: false,
    },
    {
      id: "2",
      userName: "Profesor Martínez",
      time: "13:15",
      items: ["Paella de Verduras", "Gazpacho Andaluz", "Fruta de Temporada"],
      prepared: false,
    },
    {
      id: "3",
      userName: "Profesor López",
      time: "13:30",
      items: ["Pollo al Horno con Patatas", "Ensalada Mediterránea", "Fruta de Temporada"],
      prepared: true,
    },
    {
      id: "4",
      userName: "Profesor Sánchez",
      time: "13:45",
      items: ["Paella de Verduras", "Flan Casero"],
      prepared: false,
    },
  ])

  const togglePrepared = (id: string) => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, prepared: !res.prepared } : res)))
  }

  const preparedCount = reservations.filter((r) => r.prepared).length
  const totalCount = reservations.length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Para hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparadas</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preparedCount}</div>
            <p className="text-xs text-muted-foreground">De {totalCount} totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount - preparedCount}</div>
            <p className="text-xs text-muted-foreground">Por preparar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservas del Día</CardTitle>
          <CardDescription>Marca las reservas como preparadas una vez completadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                  reservation.prepared ? "border-green-200 bg-green-50" : "bg-background"
                }`}
              >
                <Checkbox
                  checked={reservation.prepared}
                  onCheckedChange={() => togglePrepared(reservation.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{reservation.userName}</p>
                      <p className="text-sm text-muted-foreground">Hora: {reservation.time}</p>
                    </div>
                    {reservation.prepared && <Badge className="bg-green-600 text-white">Preparada</Badge>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platos:</p>
                    <ul className="mt-1 space-y-1">
                      {reservation.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
