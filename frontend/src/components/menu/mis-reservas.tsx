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
import { Calendar, Clock, UtensilsCrossed, Trash2, Star, Plus, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useDatos } from "@/lib/data-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function MyReservations() {
  const { toast } = useToast()
  const { usuario } = useAuth()
  const { reservas: globalReservations, cancelarReserva: globalCancel, platosMenu, añadirValoracion, valoraciones: globalValoraciones } = useDatos()
  
  const [ratingDialogRes, setRatingDialogRes] = useState<any>(null)
  const [dishRatings, setDishRatings] = useState<Record<string, { puntuacion: number; comentario: string }>>({})
  const [reservasValoradasLocal, setReservasValoradasLocal] = useState<string[]>([])

  // Ensure usuarios only see their own reservas
  const reservas = globalReservations.filter(r => r.idUsuario === usuario?.id).map(r => {
    // Determine day string from date
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const day = days[new Date(r.fecha).getDay()]
    
    const counts: Record<string, number> = {}
    r.platosMenu.forEach(id => { counts[id] = (counts[id] || 0) + 1 })
    
    let totalPrice = 0
    const items = Object.entries(counts).map(([id, cantidad]) => {
      const item = platosMenu.find(m => m.id === id)
      if (item && item.precio) totalPrice += item.precio * cantidad
      return { id, nombre: item ? item.nombre : "Plato Desconocido", cantidad }
    })

    // Check if any of these items has been rated by the user (globally or locally in this session)
    const estaValorada = reservasValoradasLocal.includes(r.id) || items.some(it => 
      globalValoraciones.some(v => String(v.idUsuario) === String(usuario?.id) && String(v.idPlatoMenu) === String(it.id))
    )

    return {
      id: r.id,
      codigoCorto: r.codigoCorto,
      fecha: new Date(r.fecha).toISOString().split('T')[0],
      day,
      items,
      estado: (r.estado?.toLowerCase() === "pendiente" || r.estado?.toLowerCase() === "pending") ? "pendiente" : (r.estado?.toLowerCase() === "confirmada" || r.estado?.toLowerCase() === "confirmed" || r.estado?.toLowerCase() === "completed" || r.estado?.toLowerCase() === "completada") ? "confirmada" : "cancelada",
      time: "14:00",
      totalPrice,
      estaValorada
    }
  })



  const cancelarReserva = (id: string) => {
    globalCancel(id)
    toast({
      title: "Reserva cancelada",
      description: "Tu reserva ha sido cancelada correctamente.",
    })
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-md-accent-light text-md-body"
      case "cancelada":
        return "bg-md-coral/10 text-md-coral"
      default:
        return "bg-md-accent text-md-body"
    }
  }

  const upcomingReservations = reservas.filter((r) => r.estado !== "cancelada" && !r.estaValorada)
  const pastReservations = reservas.filter((r) => r.estado === "cancelada" || r.estaValorada)

  const submitRatings = (e: React.FormEvent) => {
    e.preventDefault()
    let ratingsCount = 0

    Object.entries(dishRatings).forEach(([idPlatoMenu, data]) => {
      if (data.puntuacion > 0) {
        añadirValoracion({
          idUsuario: usuario?.id || "",
          nombreUsuario: usuario?.nombre || "",
          idPlatoMenu,
          idReserva: ratingDialogRes?.id,
          puntuacion: data.puntuacion,
          comentario: data.comentario,
        })
        ratingsCount++
      }
    })

    if (ratingsCount > 0) {
      if (ratingDialogRes) {
        setReservasValoradasLocal(prev => [...prev, ratingDialogRes.id])
      }
      toast({
        title: "Valoración enviada",
        description: `Se han registrado ${ratingsCount} valoraciones de tus platos.`,
      })
      setRatingDialogRes(null)
      setDishRatings({})
    } else {
      toast({
        title: "Error",
        description: "Por favor, asigna al menos una estrella a un plato.",
        variant: "destructive"
      })
    }
  }

  const InteractiveStars = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
    const [hover, setHover] = useState(0)
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${star <= (hover || value) ? "fill-(--md-accent) text-(--md-accent)" : "text-[#E5E5E5]"}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-(--md-heading)" />
            <CardTitle className="text-(--md-heading)">Mis <span className="text-(--md-coral)">Reservas</span></CardTitle>
          </div>
          <CardDescription className="text-(--md-body)">Gestiona tus reservas de comida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-(--md-accent)/50 border border-(--md-accent) p-4">
              <div className="text-2xl font-bold text-(--md-coral)">{upcomingReservations.length}</div>
              <p className="text-sm text-(--md-body)">Reservas activas</p>
            </div>
            <div className="rounded-lg bg-(--md-accent-light)/50 border border-(--md-accent) p-4">
              <div className="text-2xl font-bold text-(--md-heading)">
                {reservas.filter((r) => r.estado === "confirmada").length}
              </div>
              <p className="text-sm text-(--md-body)">Confirmadas</p>
            </div>
            <div className="rounded-lg bg-(--md-surface) border border-(--md-accent) p-4">
              <div className="text-2xl font-bold text-(--md-coral)">
                {reservas.filter((r) => r.estado === "pendiente").length}
              </div>
              <p className="text-sm text-(--md-body)"><span className="text-(--md-coral)">Pendientes</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-(--md-heading)">Próximas <span className="text-(--md-coral)">Reservas</span></h2>
          <div className="grid gap-4">
            {upcomingReservations.map((reservation) => (
              <Card key={reservation.id} className="border-(--md-accent) bg-(--md-surface)">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-(--md-heading)">
                        <Calendar className="h-5 w-5 text-(--md-heading)" />
                        {reservation.day}, {new Date(reservation.fecha).toLocaleDateString("es-ES")}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 text-(--md-body)">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Hora: <span className="text-(--md-coral) font-medium">{reservation.time}</span></span>
                        </div>
                        {reservation.codigoCorto && (
                          <span className="px-2 py-0.5 bg-(--md-accent)/20 border border-(--md-accent) rounded text-xs font-mono text-(--md-heading)">
                            {reservation.codigoCorto}
                          </span>
                        )}
                        {reservation.totalPrice > 0 && (
                          <span className="px-2 py-0.5 bg-green-100/50 border border-green-200 rounded text-xs font-bold text-green-700">
                            Total a pagar: {reservation.totalPrice.toFixed(2)} €
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(reservation.estado)} w-fit`}>
                      <span className="capitalize">{reservation.estado}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-(--md-coral)">Platos seleccionados:</p>
                      <ul className="space-y-1">
                        {reservation.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-(--md-heading)">
                            <div className="h-1.5 w-1.5 rounded-full bg-(--md-accent)" />
                            {item.nombre}
                            {item.cantidad > 1 && (
                              <span className="ml-1 font-bold text-(--md-coral)">x{item.cantidad}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog 
                        open={ratingDialogRes?.id === reservation.id} 
                        onOpenChange={(op) => {
                          if (!op) setRatingDialogRes(null)
                          else {
                            setRatingDialogRes(reservation)
                            const initialRatings: Record<string, any> = {}
                            reservation.items.forEach(it => initialRatings[it.id] = { puntuacion: 0, comentario: "" })
                            setDishRatings(initialRatings)
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={reservation.estado !== "confirmada"}
                            className={`flex-1 border-(--md-accent) ${reservation.estaValorada ? "bg-green-50 text-green-700 border-green-300" : "bg-(--md-accent-light)/50 text-(--md-heading)"} hover:opacity-80 transition-all`}
                          >
                            {reservation.estaValorada ? <Check className="mr-1 h-3 w-3" /> : <Star className="mr-1 h-3 w-3" />}
                            {reservation.estado !== "confirmada" 
                              ? "Esperando Cocina..." 
                              : reservation.estaValorada 
                                ? "valorado" 
                                : "Valorar Platos"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Valorar platos: {reservation.day}</DialogTitle>
                            <DialogDescription>¿Qué te han parecido los platos de tu reserva?</DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[60vh] overflow-y-auto pr-2 py-2">
                            <form onSubmit={submitRatings} className="space-y-4">
                              {ratingDialogRes?.items.map((item: any) => (
                                <div key={item.id} className="space-y-2 p-3 border rounded-lg bg-(--md-accent-light)/20">
                                  <div className="flex justify-between items-center">
                                    <Label className="font-semibold text-md text-(--md-coral)">{item.nombre}</Label>
                                    {item.cantidad > 1 && (
                                      <Badge variant="outline" className="text-xs font-bold border-(--md-coral) text-(--md-coral)">x{item.cantidad}</Badge>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-(--md-body)">Puntuación</Label>
                                    <InteractiveStars 
                                      value={dishRatings[item.id]?.puntuacion || 0} 
                                      onChange={(v) => setDishRatings(prev => ({...prev, [item.id]: {...prev[item.id], puntuacion: v}}))} 
                                    />
                                  </div>
                                  <div className="space-y-1 mt-2">
                                    <Label className="text-xs text-(--md-body)">Comentario (Opcional)</Label>
                                    <Textarea 
                                      placeholder="¡Estaba riquísimo!" 
                                      value={dishRatings[item.id]?.comentario || ""}
                                      onChange={(e) => setDishRatings(prev => ({...prev, [item.id]: {...prev[item.id], comentario: e.target.value}}))}
                                      className="h-16 resize-none"
                                    />
                                  </div>
                                </div>
                              ))}
                              <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background py-2">
                                <Button type="button" variant="outline" onClick={() => setRatingDialogRes(null)}>Cancelar</Button>
                                <Button type="submit" className="bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)">Enviar Valoraciones</Button>
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-(--md-coral) border-(--md-accent) bg-transparent hover:bg-(--md-coral-bg)">
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
                              onClick={() => cancelarReserva(reservation.id)}
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
          <h2 className="text-xl font-semibold text-(--md-heading)">Historial de <span className="text-(--md-coral)">Reservas</span></h2>
          <div className="grid gap-4">
            {pastReservations.map((reservation) => (
              <Card key={reservation.id} className="opacity-60">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {reservation.day}, {new Date(reservation.fecha).toLocaleDateString("es-ES")}
                      </CardTitle>
                    </div>
                    <Badge className={`${reservation.estaValorada ? "bg-green-100 text-green-700 border-green-200" : getStatusColor(reservation.estado)} w-fit text-xs`}>
                      <span className="capitalize">{reservation.estaValorada ? "Valorada" : reservation.estado}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-(--md-body)">{reservation.items.map(it => it.nombre).join(", ")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {upcomingReservations.length === 0 && pastReservations.length === 0 && (
        <Card className="border-(--md-accent) bg-(--md-surface)">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-(--md-body)" />
            <h3 className="mt-4 text-lg font-semibold text-(--md-heading)">No tienes reservas</h3>
            <p className="text-sm text-(--md-body)">Consulta el menú semanal para hacer una reserva</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

