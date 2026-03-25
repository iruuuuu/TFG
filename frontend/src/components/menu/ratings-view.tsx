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
import { useData } from "@/lib/data-context"
import { Star, MessageSquare, Plus } from "lucide-react"
import type { Rating } from "@/lib/types"

export function RatingsView() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { ratings, menuItems, addRating } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRating, setNewRating] = useState({
    menuItemId: "",
    rating: 0,
    comment: "",
  })

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newRating.menuItemId || newRating.rating === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un plato y una puntuación.",
        variant: "destructive",
      })
      return
    }

    const menuItem = menuItems.find((item) => item.id === newRating.menuItemId)

    const rating: Omit<Rating, "id" | "date"> = {
      userId: user?.id || "",
      userName: user?.name || "",
      menuItemId: newRating.menuItemId,
      rating: newRating.rating,
      comment: newRating.comment,
    }

    addRating(rating)
    setIsDialogOpen(false)
    setNewRating({ menuItemId: "", rating: 0, comment: "" })

    toast({
      title: "Valoración enviada",
      description: `Tu valoración de "${menuItem?.name}" ha sido registrada.`,
    })
  }

  const getAverageRating = (menuItemId: string) => {
    const itemRatings = ratings.filter((r) => r.menuItemId === menuItemId)
    if (itemRatings.length === 0) return 0
    return itemRatings.reduce((acc, r) => acc + r.rating, 0) / itemRatings.length
  }

  const StarRating = ({
    rating,
    onRatingChange,
    interactive = false,
  }: { rating: number; onRatingChange?: (rating: number) => void; interactive?: boolean }) => {
    const [hover, setHover] = useState(0)

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${interactive ? "cursor-pointer" : ""} ${
              star <= (interactive ? hover || rating : rating) ? "fill-md-accent text-md-accent" : "text-[#E5E5E5]"
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
                      value={newRating.menuItemId}
                      onValueChange={(value) => setNewRating({ ...newRating, menuItemId: value })}
                    >
                      <SelectTrigger id="dish">
                        <SelectValue placeholder="Selecciona un plato" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Puntuación</Label>
                    <StarRating
                      rating={newRating.rating}
                      onRatingChange={(rating) => setNewRating({ ...newRating, rating })}
                      interactive
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Comentario (opcional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Cuéntanos tu experiencia..."
                      value={newRating.comment}
                      onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
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
        {menuItems
          .filter((item) => ratings.some((r) => r.menuItemId === item.id))
          .map((item) => {
            const itemRatings = ratings.filter((r) => r.menuItemId === item.id)
          const avgRating = getAverageRating(item.id)

          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <div className="flex items-center justify-between pt-2">
                  <StarRating rating={Math.round(avgRating)} />
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
                      {itemRatings.slice(0, 2).map((rating) => (
                        <div key={rating.id} className="rounded-lg bg-muted p-3 text-sm">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-medium">{rating.userName}</span>
                            <StarRating rating={rating.rating} />
                          </div>
                          {rating.comment && <p className="text-muted-foreground">{rating.comment}</p>}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {rating.date.toLocaleDateString("es-ES")}
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
            {ratings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Todavía no hay valoraciones</p>
              </div>
            ) : (
              ratings.map((rating) => {
                const menuItem = menuItems.find((item) => item.id === rating.menuItemId)
                return (
                  <div key={rating.id} className="rounded-lg border bg-background p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{rating.userName}</span>
                          <span className="text-sm text-muted-foreground">valoró</span>
                          <span className="font-medium text-md-coral">{menuItem?.name}</span>
                        </div>
                        <StarRating rating={rating.rating} />
                        {rating.comment && <p className="text-sm text-muted-foreground">{rating.comment}</p>}
                        <p className="text-xs text-muted-foreground">
                          {rating.date.toLocaleDateString("es-ES")} a las{" "}
                          {rating.date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
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

