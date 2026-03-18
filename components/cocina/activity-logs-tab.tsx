"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/lib/data-context"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Activity, Clock } from "lucide-react"

export function ActivityLogsTab() {
  const { activityLogs } = useData()

  return (
    <Card className="border-[#F2EDA2] bg-[#FFFEF9] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-[#5C5C5C]">Registro de <span className="text-[#F2594B]">Actividad</span></CardTitle>
            <CardDescription className="text-[#737373]">
              Monitorea las acciones de creación y eliminación realizadas en el panel por usuarios autorizados.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-[#F2EDA2]">
            <Activity className="h-12 w-12 text-[#F2EDA2] mb-4" />
            <h3 className="text-lg font-medium text-[#5C5C5C]">No hay actividad reciente</h3>
            <p className="text-[#737373] mt-1">Las acciones realizadas en el panel por el personal de cocina aparecerán aquí.</p>
          </div>
        ) : (
          <div className="rounded-md border border-[#F2EDA2]/50 overflow-x-auto">
            <Table className="min-w-[600px] sm:min-w-0">
              <TableHeader className="bg-[#FFFEF9]">
                <TableRow className="hover:bg-transparent border-[#F2EDA2]/50">
                  <TableHead className="font-bold text-[#5C5C5C]">Fecha y Hora</TableHead>
                  <TableHead className="font-bold text-[#5C5C5C]">Usuario</TableHead>
                  <TableHead className="font-bold text-[#5C5C5C]">Rol Involucrado</TableHead>
                  <TableHead className="font-bold text-[#5C5C5C]">Acción</TableHead>
                  <TableHead className="font-bold text-[#5C5C5C]">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id} className="border-[#F2EDA2]/30 hover:bg-[#F2EFC2]/10 transition-colors">
                    <TableCell className="text-[#737373] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(log.timestamp), "d MMM, HH:mm", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#5C5C5C]">{log.userName}</TableCell>
                    <TableCell>
                      <Badge className={log.userRole === 'cocina' ? "bg-[#F2EDA2] text-[#737373] shadow-none border-none" : "bg-[#F0F1F2] text-[#737373] shadow-none border-none"}>
                        <span className="capitalize">{log.userRole === 'cocina' ? "Cocinero Titular" : log.userRole}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#F2594B] font-medium">{log.action}</TableCell>
                    <TableCell className="text-[#737373] max-w-xs truncate" title={log.details}>
                      {log.details}
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
