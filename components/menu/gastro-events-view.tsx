"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, ChefHat, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { GastroEvent } from "@/lib/types"

export function GastroEventsView() {
  const { gastroEvents, eventReservations, reserveEventSpot, cancelEventReservation } = useData()
  const { user } = useAuth()
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "upcoming" | "available">("upcoming")

  const handleReserve = (event: GastroEvent) => {
    if (!user) return

    const success = reserveEventSpot(event.id, user.id, user.name)

    if (success) {
      toast({
        title: "¡Plaza Garantizada!",
        description: `Tu reserva para "${event.name}" ha sido confirmada`,
        variant: "default",
      })
    } else {
      toast({
        title: "Error al reservar",
        description: "No hay plazas disponibles o ya tienes una reserva activa",
        variant: "destructive",
      })
    }
  }

  const handleCancelReservation = (eventId: string, eventName: string) => {
    if (!user) return

    if (confirm(`¿Deseas cancelar tu reserva para "${eventName}"?`)) {
      cancelEventReservation(eventId, user.id)
      toast({
        title: "Reserva cancelada",
        description: "Tu plaza ha sido liberada",
      })
    }
  }

  const hasUserReserved = (eventId: string): boolean => {
    if (!user) return false
    return eventReservations.some((r) => r.eventId === eventId && r.userId === user.id && r.status === "confirmed")
  }

  const filteredEvents = gastroEvents
    .filter((event) => {
      const now = new Date()
      const eventDate = new Date(event.date)

      if (filter === "upcoming") {
        return eventDate > now && event.status !== "cancelled"
      }
      if (filter === "available") {
        return eventDate > now && event.status === "active" && event.currentAttendees < event.maxCapacity
      }
      return true
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getStatusBadge = (status: GastroEvent["status"]) => {
    const styles = {
      active: "bg-[#F2EFC2] text-[#737373]",
      full: "bg-[#F2EDA2] text-[#737373]",
      modified: "bg-[#BF726B]/20 text-[#BF726B]",
      cancelled: "bg-[#F2594B]/10 text-[#F2594B]",
    }
    const labels = {
      active: "Activo",
      full: "Completo",
      modified: "Modificado",
      cancelled: "Cancelado",
    }
    return <Badge className={styles[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Eventos Gastronómicos</h2>
        <p className="text-muted-foreground">Reserva tu plaza en nuestros menús degustación</p>
      </div>

      <div className="flex gap-2">
        <Button variant={filter === "upcoming" ? "default" : "outline"} onClick={() => setFilter("upcoming")} size="sm">
          Próximos Eventos
        </Button>
        <Button
          variant={filter === "available" ? "default" : "outline"}
          onClick={() => setFilter("available")}
          size="sm"
        >
          Con Plazas Disponibles
        </Button>
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
          Todos
        </Button>
      </div>

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay eventos disponibles en este momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => {
            const hasReserved = hasUserReserved(event.id)
            const availableSpots = event.maxCapacity - event.currentAttendees
            const isFull = event.status === "full" || availableSpots <= 0
            const isPast = new Date(event.date) < new Date()
            const canReserve = !hasReserved && !isFull && !isPast && event.status === "active"

            return (
              <Card key={event.id} className={hasReserved ? "border-[#F2594B] border-2" : ""}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl text-[#737373]">{event.name}</CardTitle>
                      <CardDescription className="text-[#737373]/70">{event.description}</CardDescription>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end flex-wrap">
                      {getStatusBadge(event.status)}
                      {hasReserved && (
                        <Badge className="bg-[#F2EDA2] text-[#737373]">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Reservado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {event.currentAttendees}/{event.maxCapacity}
                      </span>
                      {availableSpots > 0 && !isFull ? (
                        <span className="text-green-600">({availableSpots} libres)</span>
                      ) : (
                        <span className="text-red-600">(Completo)</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ChefHat className="h-4 w-4" />
                      Menú degustación:
                    </div>
                    <ul className="text-sm space-y-1 ml-6 list-disc">
                      {event.dishes.map((dish, idx) => (
                        <li key={idx}>{dish}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    {hasReserved ? (
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleCancelReservation(event.id, event.name)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar mi Reserva
                      </Button>
                    ) : canReserve ? (
                      <Button className="w-full bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]" onClick={() => handleReserve(event)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Reservar Plaza
                      </Button>
                    ) : isFull ? (
                      <Button className="w-full" disabled>
                        <XCircle className="mr-2 h-4 w-4" />
                        Evento Lleno
                      </Button>
                    ) : isPast ? (
                      <Button className="w-full" disabled>
                        Evento Finalizado
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        No Disponible
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
