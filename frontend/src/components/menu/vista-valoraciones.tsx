"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useDatos } from "@/lib/data-context"
import { Star, MessageSquare, Plus } from "lucide-react"
import type { Valoracion } from "@/lib/types"

export function RatingsView() {
  const { toast } = useToast()
  const { usuario } = useAuth()
  const { valoraciones, platosMenu, añadirValoracion } = useDatos()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRating, setNewRating] = useState({
    idPlatoMenu: "",
    puntuacion: 0,
    comentario: "",
  })

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newRating.idPlatoMenu || newRating.puntuacion === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un plato y una puntuación.",
        variant: "destructive",
      })
      return
    }

    const menuItem = platosMenu.find((item) => item.id === newRating.idPlatoMenu)

    const puntuacion: Omit<Valoracion, "id" | "fecha"> = {
      idUsuario: usuario?.id || "",
      nombreUsuario: usuario?.nombre || "",
      idPlatoMenu: newRating.idPlatoMenu,
      puntuacion: newRating.puntuacion,
      comentario: newRating.comentario,
    }

    añadirValoracion(puntuacion)
    setIsDialogOpen(false)
    setNewRating({ idPlatoMenu: "", puntuacion: 0, comentario: "" })

    toast({
      title: "Valoración enviada",
      description: `Tu valoración de "${menuItem?.nombre}" ha sido registrada.`,
    })
  }

  const getAverageRating = (idPlatoMenu: string) => {
    const itemRatings = valoraciones.filter((r) => r.idPlatoMenu === idPlatoMenu)
    if (itemRatings.length === 0) return 0
    return itemRatings.reduce((acc, r) => acc + r.puntuacion, 0) / itemRatings.length
  }

  const StarRating = ({
    puntuacion,
    onRatingChange,
    interactive = false,
  }: { puntuacion: number; onRatingChange?: (puntuacion: number) => void; interactive?: boolean }) => {
    const [hover, setHover] = useState(0)

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${interactive ? "cursor-pointer" : ""} ${
              star <= (interactive ? hover || puntuacion : puntuacion) ? "fill-md-accent text-md-accent" : "text-[#E5E5E5]"
            }`}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-md-accent bg-md-accent-light/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-md-coral" />
                <CardTitle className="text-md-body">Valoraciones y Opiniones</CardTitle>
              </div>
              <CardDescription className="text-md-body/70">Comparte tu experiencia y lee opiniones de otros usuarios</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-md-accent text-md-body hover:bg-md-accent-light">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Valoración
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Valoración</DialogTitle>
                  <DialogDescription>Comparte tu opinión sobre un plato del menú</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dish">Plato</Label>
                    <Select
                      value={newRating.idPlatoMenu}
                      onValueChange={(value) => setNewRating({ ...newRating, idPlatoMenu: value })}
                    >
                      <SelectTrigger id="dish">
                        <SelectValue placeholder="Selecciona un plato" />
                      </SelectTrigger>
                      <SelectContent>
                        {platosMenu.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Puntuación</Label>
                    <StarRating
                      puntuacion={newRating.puntuacion}
                      onRatingChange={(puntuacion) => setNewRating({ ...newRating, puntuacion })}
                      interactive
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Comentario (opcional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Cuéntanos tu experiencia..."
                      value={newRating.comentario}
                      onChange={(e) => setNewRating({ ...newRating, comentario: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-md-accent text-md-body hover:bg-md-accent-light">
                      Enviar Valoración
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {platosMenu
          .filter((item) => valoraciones.some((r) => r.idPlatoMenu === item.id))
          .map((item) => {
            const itemRatings = valoraciones.filter((r) => r.idPlatoMenu === item.id)
          const avgRating = getAverageRating(item.id)

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.nombre}</CardTitle>
                <CardDescription>{item.descripcion}</CardDescription>
                <div className="flex items-center justify-between pt-2">
                  <StarRating puntuacion={Math.round(avgRating)} />
                  <Badge variant="outline">{avgRating > 0 ? avgRating.toFixed(1) : "Sin valorar"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total opiniones:</span>
                    <span className="font-medium">{itemRatings.length}</span>
                  </div>

                  {itemRatings.length > 0 && (
                    <div className="space-y-2 border-t pt-3">
                      <p className="text-sm font-medium">Últimas opiniones:</p>
                      {itemRatings.slice(0, 2).map((puntuacion) => (
                        <div key={puntuacion.id} className="rounded-lg bg-muted p-3 text-sm">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">{puntuacion.nombreUsuario}</span>
                            <StarRating puntuacion={puntuacion.puntuacion} />
                          </div>
                          {puntuacion.comentario && <p className="text-muted-foreground">{puntuacion.comentario}</p>}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {puntuacion.fecha.toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-md-coral" />
            <CardTitle className="text-md-body">Todas las Valoraciones</CardTitle>
          </div>
          <CardDescription className="text-md-body/70">Historial completo de opiniones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {valoraciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Todavía no hay valoraciones</p>
              </div>
            ) : (
              valoraciones.map((puntuacion) => {
                const menuItem = platosMenu.find((item) => item.id === puntuacion.idPlatoMenu)
                return (
                  <div key={puntuacion.id} className="rounded-lg border bg-background p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{puntuacion.nombreUsuario}</span>
                          <span className="text-sm text-muted-foreground">valoró</span>
                          <span className="font-medium text-md-coral">{menuItem?.nombre}</span>
                        </div>
                        <StarRating puntuacion={puntuacion.puntuacion} />
                        {puntuacion.comentario && <p className="text-sm text-muted-foreground">{puntuacion.comentario}</p>}
                        <p className="text-xs text-muted-foreground">
                          {puntuacion.fecha.toLocaleDateString("es-ES")} a las{" "}
                          {puntuacion.fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

