"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, UtensilsCrossed } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"

export function TodayReservationsTab() {
  const { reservas, platosMenu } = useDatos()
  const { todosLosUsuarios } = useAuth()

  const todayReservations = reservas.map(res => {
    const actualUser = todosLosUsuarios.find(u => String(u.id) === String(res.idUsuario))
    
    let totalPrice = 0
    const itemsWithPrices = res.platosMenu.map(itemId => {
      const p = platosMenu.find(m => m.id === itemId)
      if (p && p.precio) totalPrice += p.precio
      return p?.nombre || "Plato desconocido"
    })

    return {
      id: res.id,
      nombreUsuario: actualUser?.nombre || res.nombreUsuario,
      time: new Date(res.creadoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: itemsWithPrices,
      totalPrice,
      prepared: res.estadoCocina === "completada",
    }
  })

  const preparedCount = todayReservations.filter((r) => r.prepared).length
  const totalCount = todayReservations.length

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
          <CardDescription>Visualiza el estado de las reservas (se actualiza desde la To Do List)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {todayReservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors h-fit ${
                  reservation.prepared ? "border-green-200 bg-green-50 opacity-70" : "bg-background"
                }`}
              >
                <Checkbox
                  checked={reservation.prepared}
                  disabled
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{reservation.nombreUsuario}</p>
                      <p className="text-sm text-muted-foreground">Hora: {reservation.time}</p>
                      {reservation.totalPrice > 0 && (
                        <p className="text-sm font-bold text-(--md-coral)">Total: {reservation.totalPrice.toFixed(2)} €</p>
                      )}
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

