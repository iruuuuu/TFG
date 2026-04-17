"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useDatos } from "@/lib/data-context"
import { Star, MessageSquare } from "lucide-react"

export function RatingsView() {
  const { usuario } = useAuth()
  const { valoraciones, platosMenu } = useDatos()

  // Filtrar solo las valoraciones del usuario actual con una comparación robusta
  const misValoraciones = valoraciones.filter(v => {
    if (!v.idUsuario || !usuario?.id) return false
    return v.idUsuario.toString().trim() === usuario.id.toString().trim()
  })

  const StarRating = ({
    puntuacion,
  }: { puntuacion: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= puntuacion ? "fill-md-accent text-md-accent" : "text-[#E5E5E5]"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-md-accent bg-md-surface shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-md-coral" />
            <CardTitle className="text-md-heading">Historial de Valoraciones</CardTitle>
          </div>
          <CardDescription className="text-md-body">Tus opiniones y puntuaciones de los platos que has probado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {misValoraciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-md-accent/50 bg-md-accent-light/10">
                <Star className="h-12 w-12 text-md-body/50 mb-3" />
                <p className="text-md-heading font-medium">Aún no has valorado ningún plato</p>
                <p className="text-md-body text-sm mt-1">Podrás dejar tu opinión en la pestaña "Mis Reservas" una vez hayas probado los platos.</p>
                {valoraciones.length > 0 && <p className="text-xs text-md-body/40 mt-4">(Sistema: hay {valoraciones.length} valoraciones registradas en total)</p>}
              </div>
            ) : (
              misValoraciones.map((puntuacion) => {
                const menuItem = platosMenu.find((item) => item.id === puntuacion.idPlatoMenu)
                return (
                  <div key={puntuacion.id} className="rounded-xl border border-md-accent/50 bg-md-surface p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div>
                          <h4 className="font-bold text-lg text-md-heading">{menuItem?.nombre || "Plato Desconocido"}</h4>
                          <div className="mt-1 flex items-center gap-3">
                            <StarRating puntuacion={puntuacion.puntuacion} />
                            <span className="text-sm font-medium text-md-coral">{puntuacion.puntuacion} / 5</span>
                          </div>
                        </div>
                        {puntuacion.comentario && (
                          <div className="rounded-lg bg-md-accent-light/30 p-3 text-md-body text-sm italic border-l-2 border-md-accent">
                            "{puntuacion.comentario}"
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-md-body/70 whitespace-nowrap bg-md-page-bg px-3 py-1.5 rounded-full border border-md-accent/30 flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3" />
                        {puntuacion.fecha.toLocaleDateString("es-ES")}
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

