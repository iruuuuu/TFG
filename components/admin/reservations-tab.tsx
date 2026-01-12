"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export function ReservationsTab() {
  const reservations = [
    {
      id: "1",
      userName: "Profesor García",
      date: "2026-01-12",
      items: ["Pollo al Horno", "Ensalada", "Flan"],
      status: "confirmada" as const,
    },
    {
      id: "2",
      userName: "Profesor Martínez",
      date: "2026-01-12",
      items: ["Paella de Verduras", "Gazpacho"],
      status: "pendiente" as const,
    },
    {
      id: "3",
      userName: "Profesor López",
      date: "2026-01-13",
      items: ["Pollo al Horno", "Fruta"],
      status: "confirmada" as const,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmada":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelada":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmada":
        return "default"
      case "cancelada":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservas Recientes</CardTitle>
        <CardDescription>Gestiona las reservas de los usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Platos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.userName}</TableCell>
                <TableCell>{new Date(reservation.date).toLocaleDateString("es-ES")}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-sm text-muted-foreground">{reservation.items.join(", ")}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(reservation.status)} className="flex w-fit items-center gap-1">
                    {getStatusIcon(reservation.status)}
                    <span className="capitalize">{reservation.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {reservation.status === "pendiente" && (
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
