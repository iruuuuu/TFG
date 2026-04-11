"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useDatos } from "@/lib/data-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Activity, Clock } from "lucide-react"

export function ActivityLogsTab() {
  const { registrosActividad } = useDatos()

  return (
    <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-(--md-heading)">Registro de <span className="text-(--md-coral)">Actividad</span></CardTitle>
            <CardDescription className="text-(--md-body)">
              Monitorea las acciones de creación y eliminación realizadas en el panel por usuarios autorizados.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {registrosActividad.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-(--md-accent)">
            <Activity className="h-12 w-12 text-(--md-accent) mb-4" />
            <h3 className="text-lg font-medium text-(--md-heading)">No hay actividad reciente</h3>
            <p className="text-(--md-body) mt-1">Las acciones realizadas en el panel por el personal de cocina aparecerán aquí.</p>
          </div>
        ) : (
          <div className="rounded-md border border-(--md-accent)/50 overflow-x-auto">
            <Table className="min-w-[600px] sm:min-w-0">
              <TableHeader className="bg-(--md-surface)">
                <TableRow className="hover:bg-transparent border-(--md-accent)/50">
                  <TableHead className="font-bold text-(--md-heading)">Fecha y Hora</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Usuario</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Rol Involucrado</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Acción</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosActividad.map((log) => (
                  <TableRow key={log.id} className="border-(--md-accent)/30 hover:bg-(--md-accent-light)/10 transition-colors">
                    <TableCell className="text-(--md-body) whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(log.marcaTemporal), "d MMM, HH:mm", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-(--md-heading)">{log.nombreUsuario}</TableCell>
                    <TableCell>
                      <Badge className={log.rolUsuario === 'cocina' ? "bg-(--md-accent) text-(--md-body) shadow-none border-none" : "bg-(--md-muted-bg) text-(--md-body) shadow-none border-none"}>
                        <span className="capitalize">{log.rolUsuario === 'cocina' ? "Cocinero Titular" : log.rolUsuario}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-(--md-coral) font-medium">{log.accion}</TableCell>
                    <TableCell className="text-(--md-body) max-w-xs truncate" title={log.detalles}>
                      {log.detalles}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

