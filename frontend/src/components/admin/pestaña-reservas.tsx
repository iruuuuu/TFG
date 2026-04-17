import { useDatos } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock, Trash2 } from "lucide-react"

export function ReservationsTab() {
  const { reservas: rawReservas, platosMenu, actualizarEstadoCocinaReserva, cancelarReserva } = useDatos()

  const mappedReservas = rawReservas.map(r => ({
    id: r.id,
    nombreUsuario: r.nombreUsuario,
    fecha: r.fecha instanceof Date ? r.fecha.toISOString().split('T')[0] : r.fecha,
    items: r.platosMenu.map(id => platosMenu.find(m => m.id === id)?.nombre || "Plato desconocido"),
    estado: r.estado,
  })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const getStatusIcon = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "confirmada":
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelada":
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (estado: string) => {
    const s = estado?.toLowerCase()
    if (s === "confirmada" || s === "confirmed") return "default"
    if (s === "cancelada" || s === "cancelled") return "destructive"
    return "secondary"
  }

  return (
    <Card className="border-md-accent bg-md-surface shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-md-heading uppercase tracking-tight">Reservas <span className="text-md-coral">Recientes</span></CardTitle>
        <CardDescription className="text-md-body font-medium">Gestiona las reservas de los usuarios en tiempo real</CardDescription>
      </CardHeader>
      <CardContent>
        {mappedReservas.length > 0 ? (
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
              {mappedReservas.map((reservation) => (
                <TableRow key={reservation.id} className="hover:bg-md-accent/5 transition-colors">
                  <TableCell className="font-bold text-md-heading">{reservation.nombreUsuario}</TableCell>
                  <TableCell className="text-md-body">{new Date(reservation.fecha).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-md-body/80 font-medium">{reservation.items.join(", ")}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(reservation.estado)} 
                      className={`flex w-fit items-center gap-1 shadow-sm font-bold ${
                        (reservation.estado === 'confirmada' || reservation.estado === 'confirmed') ? 'bg-md-accent text-md-heading' : 
                        (reservation.estado === 'cancelada' || reservation.estado === 'cancelled') ? 'bg-md-coral/20 text-md-coral border-md-coral/30' : 
                        'bg-md-surface text-md-body border-md-accent/30'
                      }`}
                    >
                      {getStatusIcon(reservation.estado)}
                      <span className="capitalize">{reservation.estado}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(reservation.estado === "pendiente" || reservation.estado === "pending") && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 bg-transparent"
                            onClick={() => actualizarEstadoCocinaReserva(reservation.id, "preparando")}
                          >
                            Confirmar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-md-coral border-md-coral/20 hover:bg-md-coral/10 bg-transparent"
                            onClick={() => cancelarReserva(reservation.id)}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      {(reservation.estado === "confirmada" || reservation.estado === "confirmed") && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-md-coral hover:bg-md-coral/10"
                          onClick={() => cancelarReserva(reservation.id)}
                          title="Cancelar reserva confirmada"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-12 text-center text-md-body space-y-2">
            <Clock className="h-10 w-10 mx-auto text-md-accent mb-2" />
            <p className="font-medium text-lg">No hay reservas registradas</p>
            <p className="text-sm opacity-70">Las reservas aparecerán aquí cuando los usuarios seleccionen sus platos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

