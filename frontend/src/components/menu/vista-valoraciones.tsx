"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useDatos } from "@/lib/data-context"
import { Star, MessageSquare, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function RatingsView() {
  const { usuario } = useAuth()
  const { valoraciones, platosMenu } = useDatos()
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])

  // Filtrar solo las valoraciones del usuario actual
  const misValoraciones = valoraciones.filter(v => {
    if (!v.idUsuario || !usuario?.id) return false
    return v.idUsuario.toString().trim() === usuario.id.toString().trim()
  })

  // Agrupar valoraciones por pedido (idReserva o fecha si no hay ID)
  const groupedValoraciones = misValoraciones.reduce((acc, v) => {
    const key = v.idReserva || `legacy-${v.fecha.toISOString().split('T')[0]}`
    if (!acc[key]) {
      acc[key] = {
        id: key,
        idReserva: v.idReserva,
        fecha: v.fecha,
        items: []
      }
    }
    acc[key].items.push(v)
    return acc;
  }, {} as Record<string, { id: string, idReserva?: string, fecha: Date, items: any[] }>);

  const sortedOrders = Object.values(groupedValoraciones).sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  const toggleOrder = (id: string) => {
    setExpandedOrders(prev => prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id])
  }

  const StarRating = ({ puntuacion, size = "h-4 w-4" }: { puntuacion: number, size?: string }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= puntuacion ? "fill-(--md-accent) text-(--md-accent)" : "text-gray-300"}`}
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
            <MessageSquare className="h-5 w-5 text-(--md-coral)" />
            <CardTitle className="text-(--md-heading)">Historial de Valoraciones</CardTitle>
          </div>
          <CardDescription className="text-(--md-body)">Tus opiniones agrupadas por pedido</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-(--md-accent)/50 bg-(--md-accent-light)/10">
                <Star className="h-12 w-12 text-(--md-body)/50 mb-3" />
                <p className="text-(--md-heading) font-medium">Aún no tienes valoraciones</p>
                <p className="text-(--md-body) text-sm mt-1">Valora tus platos desde "Mis Reservas" para verlos aquí.</p>
              </div>
            ) : (
              sortedOrders.map((order) => {
                const isExpanded = expandedOrders.includes(order.id);
                const avgRating = (order.items.reduce((sum, i) => sum + i.puntuacion, 0) / order.items.length).toFixed(1);
                
                return (
                  <div key={order.id} className="rounded-xl border border-(--md-accent) bg-(--md-surface) overflow-hidden shadow-sm transition-all">
                    {/* Order Header */}
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-(--md-accent-light)/20 transition-colors"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-(--md-accent)/10">
                          <Calendar className="h-5 w-5 text-(--md-coral)" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-(--md-heading)">
                            Pedido del {new Date(order.fecha).toLocaleDateString("es-ES")}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating puntuacion={Math.round(Number(avgRating))} />
                            <span className="text-xs font-medium text-(--md-body)">Media: {avgRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs bg-(--md-accent-light)/30 border-(--md-accent)">
                          {order.items.length} {order.items.length === 1 ? "plato" : "platos"}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-(--md-body)" /> : <ChevronDown className="h-5 w-5 text-(--md-body)" />}
                      </div>
                    </div>

                    {/* Order Details (Collapsible) */}
                    {isExpanded && (
                      <div className="border-t border-(--md-accent)/30 bg-(--md-accent-light)/10 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {order.items.map((rating) => {
                          const plato = platosMenu.find(p => p.id === rating.idPlatoMenu)
                          return (
                            <div key={rating.id} className="bg-(--md-surface) border border-(--md-accent)/30 rounded-lg p-3 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-(--md-heading) text-sm">{plato?.nombre || "Plato Desconocido"}</p>
                                <div className="flex items-center gap-1.5">
                                  <StarRating puntuacion={rating.puntuacion} size="h-3.5 w-3.5" />
                                  <span className="text-xs font-bold text-(--md-coral)">{rating.puntuacion}</span>
                                </div>
                              </div>
                              {rating.comentario && (
                                <p className="text-sm text-(--md-body) italic bg-(--md-page-bg)/50 p-2 rounded border-l-2 border-(--md-coral)">
                                  "{rating.comentario}"
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
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

