"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, UtensilsCrossed, Trash2, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Reservation {
  id: string
  date: string
  day: string
  items: string[]
  status: "pendiente" | "confirmada" | "cancelada"
  time: string
}

export function MyReservations() {
  const { toast } = useToast()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      date: "2026-01-15",
      day: "Lunes",
      items: ["Ensalada Mediterránea", "Pollo al Horno con Patatas", "Flan Casero"],
      status: "confirmada",
      time: "13:00",
    },
    {
      id: "2",
      date: "2026-01-16",
      day: "Martes",
      items: ["Gazpacho Andaluz", "Paella de Verduras", "Fruta de Temporada"],
      status: "pendiente",
      time: "13:15",
    },
    {
      id: "3",
      date: "2026-01-17",
      day: "Miércoles",
      items: ["Ensalada Mediterránea", "Pollo al Horno con Patatas", "Fruta de Temporada"],
      status: "confirmada",
      time: "13:00",
    },
  ])

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: "cancelada" as const } : res)))
    toast({
      title: "Reserva cancelada",
      description: "Tu reserva ha sido cancelada correctamente.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-700"
      case "cancelada":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const upcomingReservations = reservations.filter((r) => r.status !== "cancelada")
  const pastReservations = reservations.filter((r) => r.status === "cancelada")

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-orange-600" />
            <CardTitle>Mis Reservas</CardTitle>
          </div>
          <CardDescription>Gestiona tus reservas de comida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <div className="text-2xl font-bold text-orange-600">{upcomingReservations.length}</div>
              <p className="text-sm text-muted-foreground">Reservas activas</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="text-2xl font-bold text-green-600">
                {reservations.filter((r) => r.status === "confirmada").length}
              </div>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {reservations.filter((r) => r.status === "pendiente").length}
              </div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Próximas Reservas</h2>
          <div className="grid gap-4">
            {upcomingReservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        {reservation.day}, {new Date(reservation.date).toLocaleDateString("es-ES")}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Hora: {reservation.time}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      <span className="capitalize">{reservation.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">Platos seleccionados:</p>
                      <ul className="space-y-1">
                        {reservation.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          // Switch to ratings tab
                          const tabsList = document.querySelector('[role="tablist"]')
                          const ratingsTab = tabsList?.querySelector('[value="ratings"]') as HTMLButtonElement
                          ratingsTab?.click()
                        }}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Valorar
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Cancelar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Tu reserva para el {reservation.day} será cancelada.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, mantener</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelReservation(reservation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sí, cancelar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reservas Canceladas</h2>
          <div className="grid gap-4">
            {pastReservations.map((reservation) => (
              <Card key={reservation.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {reservation.day}, {new Date(reservation.date).toLocaleDateString("es-ES")}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      <span className="capitalize">{reservation.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reservation.items.join(", ")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {upcomingReservations.length === 0 && pastReservations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tienes reservas</h3>
            <p className="text-sm text-muted-foreground">Consulta el menú semanal para hacer una reserva</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
