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
    <Card className="border-[#FAD85D] bg-[#FFFFFF] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-[#4A3B32]">Registro de <span className="text-[#E8654D]">Actividad</span></CardTitle>
            <CardDescription className="text-[#877669]">
              Monitorea las acciones de creación y eliminación realizadas en el panel por usuarios autorizados.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activityLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-[#FAD85D]">
            <Activity className="h-12 w-12 text-[#FAD85D] mb-4" />
            <h3 className="text-lg font-medium text-[#4A3B32]">No hay actividad reciente</h3>
            <p className="text-[#877669] mt-1">Las acciones realizadas en el panel por el personal de cocina aparecerán aquí.</p>
          </div>
        ) : (
          <div className="rounded-md border border-[#FAD85D]/50 overflow-x-auto">
            <Table className="min-w-[600px] sm:min-w-0">
              <TableHeader className="bg-[#FFFFFF]">
                <TableRow className="hover:bg-transparent border-[#FAD85D]/50">
                  <TableHead className="font-bold text-[#4A3B32]">Fecha y Hora</TableHead>
                  <TableHead className="font-bold text-[#4A3B32]">Usuario</TableHead>
                  <TableHead className="font-bold text-[#4A3B32]">Rol Involucrado</TableHead>
                  <TableHead className="font-bold text-[#4A3B32]">Acción</TableHead>
                  <TableHead className="font-bold text-[#4A3B32]">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log) => (
                  <TableRow key={log.id} className="border-[#FAD85D]/30 hover:bg-[#FDF1B6]/10 transition-colors">
                    <TableCell className="text-[#877669] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(log.timestamp), "d MMM, HH:mm", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#4A3B32]">{log.userName}</TableCell>
                    <TableCell>
                      <Badge className={log.userRole === 'cocina' ? "bg-[#FAD85D] text-[#877669] shadow-none border-none" : "bg-[#F0F1F2] text-[#877669] shadow-none border-none"}>
                        <span className="capitalize">{log.userRole === 'cocina' ? "Cocinero Titular" : log.userRole}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#E8654D] font-medium">{log.action}</TableCell>
                    <TableCell className="text-[#877669] max-w-xs truncate" title={log.details}>
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
