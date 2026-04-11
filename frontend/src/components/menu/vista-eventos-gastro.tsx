"use client"

import { useState } from "react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, ChefHat, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { EventoGastro } from "@/lib/types"

export function GastroEventsView() {
  const { eventosGastro, reservasEventos, reservarPuestoEvento, cancelarReservaEvento } = useDatos()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [filter, setFilter] = useState<"all" | "upcoming" | "available">("upcoming")

  const handleReserve = (event: EventoGastro) => {
    if (!usuario) return

    const success = reservarPuestoEvento(event.id, usuario.id, usuario.nombre)

    if (success) {
      toast({
        title: "¡Plaza Garantizada!",
        description: `Tu reserva para "${event.nombre}" ha sido confirmada`,
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

  const handleCancelReservation = (idEvento: string, eventName: string) => {
    if (!usuario) return

    if (confirm(`¿Deseas cancelar tu reserva para "${eventName}"?`)) {
      cancelarReservaEvento(idEvento, usuario.id)
      toast({
        title: "Reserva cancelada",
        description: "Tu plaza ha sido liberada",
      })
    }
  }

  const hasUserReserved = (idEvento: string): boolean => {
    if (!usuario) return false
    return reservasEventos.some((r) => r.idEvento === idEvento && r.idUsuario === usuario.id && r.estado === "confirmada")
  }

  const filteredEvents = eventosGastro
    .filter((event) => {
      const now = new Date()
      const eventDate = new Date(event.fecha)

      if (filter === "upcoming") {
        return eventDate > now && event.estado !== "cancelado"
      }
      if (filter === "available") {
        return eventDate > now && (event.estado === "activo" || event.estado === "modificado") && event.asistentesActuales < event.capacidadMaxima
      }
      return true
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  const getStatusBadge = (estado: EventoGastro["estado"]) => {
    const styles = {
      activo: "bg-(--md-accent-light) text-(--md-body)",
      lleno: "bg-(--md-accent) text-(--md-body)",
      modificado: "bg-(--md-accent-light) text-(--md-body)",
      cancelado: "bg-(--md-coral)/10 text-(--md-coral)",
    }
    const labels = {
      activo: "Activo",
      lleno: "Completo",
      modificado: "Activo",
      cancelado: "Cancelado",
    }
    return <Badge className={styles[estado]}>{labels[estado]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Eventos Gastronómicos</h2>
        <p className="text-muted-foreground">Reserva tu plaza en nuestros menús degustación</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          onClick={() => setFilter("upcoming")}
          size="sm"
          className="w-full sm:w-auto"
        >
          Próximos Eventos
        </Button>
        <Button
          variant={filter === "available" ? "default" : "outline"}
          onClick={() => setFilter("available")}
          size="sm"
          className="w-full sm:w-auto"
        >
          Con Plazas Disponibles
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
          className="w-full sm:w-auto"
        >
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
            const availableSpots = event.capacidadMaxima - event.asistentesActuales
            const isFull = event.estado === "lleno" || availableSpots <= 0
            const isPast = new Date(event.fecha) < new Date()
            const canReserve = !hasReserved && !isFull && !isPast && (event.estado === "activo" || event.estado === "modificado")

            return (
              <Card key={event.id} className={hasReserved ? "border-(--md-coral) border-2" : ""}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl text-(--md-body)">{event.nombre}</CardTitle>
                      <CardDescription className="text-(--md-body)/70">{event.descripcion}</CardDescription>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end flex-wrap">
                      {getStatusBadge(event.estado)}
                      {hasReserved && (
                        <Badge className="bg-(--md-accent) text-(--md-body)">
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
                        {new Date(event.fecha).toLocaleDateString("es-ES", {
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
                        {new Date(event.fecha).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {event.asistentesActuales}/{event.capacidadMaxima}
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
                      {event.platos.map((dish, idx) => (
                        <li key={idx}>{dish}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    {hasReserved ? (
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleCancelReservation(event.id, event.nombre)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancelar mi Reserva
                      </Button>
                    ) : canReserve ? (
                      <Button className="w-full bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)" onClick={() => handleReserve(event)}>
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

