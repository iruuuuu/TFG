"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export function ReservationsTab() {
  const reservas = [
    {
      id: "1",
      nombreUsuario: "Profesor García",
      fecha: "2026-01-12",
      items: ["Pollo al Horno", "Ensalada", "Flan"],
      estado: "confirmada" as const,
    },
    {
      id: "2",
      nombreUsuario: "Profesor Martínez",
      fecha: "2026-01-12",
      items: ["Paella de Verduras", "Gazpacho"],
      estado: "pendiente" as const,
    },
    {
      id: "3",
      nombreUsuario: "Profesor López",
      fecha: "2026-01-13",
      items: ["Pollo al Horno", "Fruta"],
      estado: "confirmada" as "pendiente" | "confirmada" | "cancelada",
    },
  ]

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelada":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "default"
      case "cancelada":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="border-md-accent bg-md-surface shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-md-heading uppercase tracking-tight">Reservas Recientes</CardTitle>
        <CardDescription className="text-md-body font-medium">Gestiona las reservas de los usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-md-accent/10">
            <TableRow className="border-md-accent/20">
              <TableHead className="font-bold text-md-heading uppercase text-xs tracking-wider">Usuario</TableHead>
              <TableHead className="font-bold text-md-heading uppercase text-xs tracking-wider">Fecha</TableHead>
              <TableHead className="font-bold text-md-heading uppercase text-xs tracking-wider">Platos</TableHead>
              <TableHead className="font-bold text-md-heading uppercase text-xs tracking-wider">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-bold text-md-heading">{reservation.nombreUsuario}</TableCell>
                <TableCell className="text-md-body">{new Date(reservation.fecha).toLocaleDateString("es-ES")}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-sm text-md-body/80 font-medium">{reservation.items.join(", ")}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusVariant(reservation.estado)} 
                    className={`flex w-fit items-center gap-1 shadow-sm font-bold ${
                      reservation.estado === 'confirmada' ? 'bg-md-accent text-md-heading' : 
                      reservation.estado === 'cancelada' ? 'bg-md-coral/20 text-md-coral border-md-coral/30' : 
                      'bg-md-surface text-md-body'
                    }`}
                  >
                    {getStatusIcon(reservation.estado)}
                    <span className="capitalize">{reservation.estado}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {reservation.estado === "pendiente" && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 bg-transparent">
                          Confirmar
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

