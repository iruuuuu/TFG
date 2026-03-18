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
import { Calendar, Clock, UtensilsCrossed, Trash2, Star, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function MyReservations() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { reservations: globalReservations, cancelReservation: globalCancel, menuItems, addRating } = useData()

  // Ensure users only see their own reservations
  const reservations = globalReservations.filter(r => r.userId === user?.id).map(r => {
    // Determine day string from date
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const day = days[new Date(r.date).getDay()]
    
    // Map items from IDs to Names
    const items = r.menuItems.map(id => {
      const item = menuItems.find(m => m.id === id)
      return { id, name: item ? item.name : "Plato Desconocido" }
    })

    return {
      id: r.id,
      date: new Date(r.date).toISOString().split('T')[0],
      day,
      items,
      rawStatus: r.status,
      status: r.status === "pending" ? "pendiente" : r.status === "confirmed" ? "confirmada" : "cancelada",
      time: "14:00",
    }
  })

  const [ratingDialogRes, setRatingDialogRes] = useState<any>(null)
  const [dishRatings, setDishRatings] = useState<Record<string, { rating: number; comment: string }>>({})

  const cancelReservation = (id: string) => {
    globalCancel(id)
    toast({
      title: "Reserva cancelada",
      description: "Tu reserva ha sido cancelada correctamente.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "bg-[#F2EFC2] text-[#737373]"
      case "cancelada":
        return "bg-[#F2594B]/10 text-[#F2594B]"
      default:
        return "bg-[#F2EDA2] text-[#737373]"
    }
  }

  const upcomingReservations = reservations.filter((r) => r.status !== "cancelada")
  const pastReservations = reservations.filter((r) => r.status === "cancelada")

  const submitRatings = (e: React.FormEvent) => {
    e.preventDefault()
    let ratingsCount = 0

    Object.entries(dishRatings).forEach(([menuItemId, data]) => {
      if (data.rating > 0) {
        addRating({
          userId: user?.id || "",
          userName: user?.name || "",
          menuItemId,
          rating: data.rating,
          comment: data.comment,
        })
        ratingsCount++
      }
    })

    if (ratingsCount > 0) {
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
            className={`h-5 w-5 cursor-pointer ${star <= (hover || value) ? "fill-[#F2EDA2] text-[#F2EDA2]" : "text-[#E5E5E5]"}`}
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
      <Card className="border-[#F2EDA2] bg-[#FFFEF9] shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-[#5C5C5C]" />
            <CardTitle className="text-[#5C5C5C]">Mis <span className="text-[#F2594B]">Reservas</span></CardTitle>
          </div>
          <CardDescription className="text-[#737373]">Gestiona tus reservas de comida</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-[#F2EDA2]/50 border border-[#F2EDA2] p-4">
              <div className="text-2xl font-bold text-[#F2594B]">{upcomingReservations.length}</div>
              <p className="text-sm text-[#737373]">Reservas activas</p>
            </div>
            <div className="rounded-lg bg-[#F2EFC2]/50 border border-[#F2EDA2] p-4">
              <div className="text-2xl font-bold text-[#5C5C5C]">
                {reservations.filter((r) => r.status === "confirmada").length}
              </div>
              <p className="text-sm text-[#737373]">Confirmadas</p>
            </div>
            <div className="rounded-lg bg-[#FFFEF9] border border-[#F2EDA2] p-4">
              <div className="text-2xl font-bold text-[#F2594B]">
                {reservations.filter((r) => r.status === "pendiente").length}
              </div>
              <p className="text-sm text-[#737373]"><span className="text-[#F2594B]">Pendientes</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {upcomingReservations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#5C5C5C]">Próximas <span className="text-[#F2594B]">Reservas</span></h2>
          <div className="grid gap-4">
            {upcomingReservations.map((reservation) => (
              <Card key={reservation.id} className="border-[#F2EDA2] bg-[#FFFEF9]">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-[#5C5C5C]">
                        <Calendar className="h-5 w-5 text-[#5C5C5C]" />
                        {reservation.day}, {new Date(reservation.date).toLocaleDateString("es-ES")}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-[#737373]">
                        <Clock className="h-4 w-4" />
                        Hora: <span className="text-[#F2594B] font-medium">{reservation.time}</span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(reservation.status)} w-fit`}>
                      <span className="capitalize">{reservation.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-medium text-[#F2594B]">Platos seleccionados:</p>
                      <ul className="space-y-1">
                        {reservation.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-[#5C5C5C]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#F2EDA2]" />
                            {item.name}
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
                            reservation.items.forEach(it => initialRatings[it.id] = { rating: 0, comment: "" })
                            setDishRatings(initialRatings)
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={reservation.status !== "confirmada"}
                            className="flex-1 border-[#F2EDA2] bg-[#F2EFC2]/50 text-[#5C5C5C] hover:bg-[#F2EDA2]"
                          >
                            <Star className="mr-1 h-3 w-3" />
                            {reservation.status === "confirmada" ? "Valorar Platos" : "Esperando Cocina..."}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Valorar platos: {reservation.day}</DialogTitle>
                            <DialogDescription>¿Qué te han parecido los platos de tu reserva?</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={submitRatings} className="space-y-4">
                            {ratingDialogRes?.items.map((item: any) => (
                              <div key={item.id} className="space-y-2 p-3 border rounded-lg bg-gray-50/50">
                                <Label className="font-semibold text-md text-[#F2594B]">{item.name}</Label>
                                <div className="space-y-1">
                                  <Label className="text-xs text-[#737373]">Puntuación</Label>
                                  <InteractiveStars 
                                    value={dishRatings[item.id]?.rating || 0} 
                                    onChange={(v) => setDishRatings(prev => ({...prev, [item.id]: {...prev[item.id], rating: v}}))} 
                                  />
                                </div>
                                <div className="space-y-1 mt-2">
                                  <Label className="text-xs text-[#737373]">Comentario (Opcional)</Label>
                                  <Textarea 
                                    placeholder="¡Estaba riquísimo!" 
                                    value={dishRatings[item.id]?.comment || ""}
                                    onChange={(e) => setDishRatings(prev => ({...prev, [item.id]: {...prev[item.id], comment: e.target.value}}))}
                                    className="h-16 resize-none"
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-end gap-2 pt-2">
                              <Button type="button" variant="outline" onClick={() => setRatingDialogRes(null)}>Cancelar</Button>
                              <Button type="submit" className="bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]">Enviar Valoraciones</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-[#F2594B] border-[#F2EDA2] bg-transparent hover:bg-[#FFF5F4]">
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
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {reservation.day}, {new Date(reservation.date).toLocaleDateString("es-ES")}
                      </CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(reservation.status)} w-fit text-xs`}>
                      <span className="capitalize">{reservation.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reservation.items.map(it => it.name).join(", ")}</p>
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
