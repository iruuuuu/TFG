"use client"

import { useState } from "react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, ChefHat, Edit, XCircle, Plus, QrCode, CheckCircle } from "lucide-react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useToast } from "@/hooks/use-toast"
import type { EventoGastro } from "@/lib/types"

export function GastroEventsTab() {
  const { eventosGastro, añadirEventoGastro, actualizarEventoGastro, cancelarEventoGastro, obtenerAsistentesEvento, marcarAsistenciaEvento, usuarios, registrarActividad } = useDatos()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventoGastro | null>(null)
  const [selectedAttendanceEvent, setSelectedAttendanceEvent] = useState<EventoGastro | null>(null)

  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    fecha: string;
    time: string;
    capacidadMaxima: number | string;
    platos: string[];
  }>({
    nombre: "",
    descripcion: "",
    fecha: "",
    time: "",
    capacidadMaxima: 20,
    platos: ["", "", "", "", ""],
  })

  const handleAddEvent = () => {
    if (!formData.nombre || !formData.fecha || !formData.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const eventDate = new Date(`${formData.fecha}T${formData.time}:00`)
    const validDishes = formData.platos.filter((d) => d.trim() !== "")

    añadirEventoGastro({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha: eventDate,
      capacidadMaxima: Number(formData.capacidadMaxima) || 20,
      platos: validDishes,
      estado: "activo",
      creadoPor: "cocina@iesmendoza.es",
    })

    if (usuario) {
      registrarActividad("Publicó Nuevo Evento", `Evento: ${formData.nombre}`, usuario.nombre, usuario.rol)
    }

    toast({
      title: "Evento creado",
      description: `${formData.nombre} ha sido publicado correctamente`,
    })

    setIsAddDialogOpen(false)
    setFormData({
      nombre: "",
      descripcion: "",
      fecha: "",
      time: "",
      capacidadMaxima: 20,
      platos: ["", "", "", "", ""],
    })
  }

  const handleEditEvent = () => {
    if (!selectedEvent) return

    const eventDate = new Date(`${formData.fecha}T${formData.time}:00`)
    const validDishes = formData.platos.filter((d) => d.trim() !== "")

    actualizarEventoGastro(selectedEvent.id, {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha: eventDate,
      capacidadMaxima: Number(formData.capacidadMaxima) || 20,
      platos: validDishes,
    })

    toast({
      title: "Evento actualizado",
      description: "Los cambios han sido guardados y el estado marcado como modificado",
    })

    setIsEditDialogOpen(false)
    setSelectedEvent(null)
  }

  const openEditDialog = (event: EventoGastro) => {
    setSelectedEvent(event)
    const date = new Date(event.fecha)
    setFormData({
      nombre: event.nombre,
      descripcion: event.descripcion,
      fecha: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
      capacidadMaxima: event.capacidadMaxima,
      platos: [...event.platos, "", "", "", "", ""].slice(0, 5),
    })
    setIsEditDialogOpen(true)
  }

  const handleCancelEvent = (idEvento: string, eventName: string) => {
    if (confirm(`¿Estás seguro de cancelar el evento "${eventName}"?`)) {
      cancelarEventoGastro(idEvento)
      if (usuario) {
        registrarActividad("Canceló Evento", `Evento: ${eventName}`, usuario.nombre, usuario.rol)
      }
      toast({
        title: "Evento cancelado",
        description: "Los usuarios reservados serán notificados",
      })
    }
  }

  const handleScanAttendance = (text: string, idEvento: string) => {
    if (!text) return

    const cleanText = text.trim()
    const term = cleanText.toLowerCase()

    // Find usuario by email (from QR)
    const foundUser = usuarios.find(u => u.email.toLowerCase() === term)
    if (!foundUser) {
      toast({ title: "QR Inválido", description: "El QR no corresponde a un maestro registrado.", variant: "destructive" })
      return
    }

    const attendees = obtenerAsistentesEvento(idEvento)
    const reservation = attendees.find(r => r.idUsuario === String(foundUser.id))

    if (!reservation) {
      toast({ title: "Acceso Denegado", description: `${foundUser.nombre} no está en la lista de invitados.`, variant: "destructive" })
      return
    }

    if (reservation.asistio) {
      toast({ title: "Aviso", description: `${foundUser.nombre} ya había hecho el Check-In.`, variant: "default" })
      return
    }

    // Mark as attended
    marcarAsistenciaEvento(reservation.id, true)
    
    // Auto-close scanner and show success
    setIsScanning(false)
    toast({
      title: "Check-In Exitoso",
      description: `Acceso concedido a ${foundUser.nombre}.`,
    })
  }

  const getStatusBadge = (estado: EventoGastro["estado"]) => {
    const styles = {
      activo: "bg-(--md-accent-light) text-(--md-body)",
      lleno: "bg-(--md-accent) text-(--md-body)",
      modificado: "bg-(--md-coral-hover)/20 text-(--md-coral-hover)",
      cancelado: "bg-(--md-coral)/10 text-(--md-coral)",
    }
    const labels = {
      activo: "Activo",
      lleno: "Completo",
      modificado: "Modificado",
      cancelado: "Cancelado",
    }
    return <Badge className={styles[estado]}>{labels[estado]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Eventos Gastronómicos</h2>
          <p className="text-muted-foreground">Gestiona menús degustación y experiencias especiales</p>
        </div>
        {(usuario?.rol === "cocina" || usuario?.rol === "alumno-cocina-titular") && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)">
                <Plus className="mr-2 h-4 w-4" />
                Crear Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Menú Degustación</DialogTitle>
                <DialogDescription>Publica un nuevo evento gastronómico con aforo limitado</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Evento *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Menú Degustación Mediterráneo"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe la experiencia gastronómica..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Aforo Máximo</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.capacidadMaxima}
                    onChange={(e) => setFormData({ ...formData, capacidadMaxima: e.target.value === "" ? "" : Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platos del Menú</Label>
                  <p className="text-sm text-muted-foreground">Añade hasta 5 platos para el menú degustación</p>
                  {formData.platos.map((dish, index) => (
                    <Input
                      key={index}
                      placeholder={`Plato ${index + 1}`}
                      value={dish}
                      onChange={(e) => {
                        const newDishes = [...formData.platos]
                        newDishes[index] = e.target.value
                        setFormData({ ...formData, platos: newDishes })
                      }}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddEvent} className="bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)">
                  Publicar Evento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {eventosGastro.map((event) => {
          const attendees = obtenerAsistentesEvento(event.id)
          const availableSpots = event.capacidadMaxima - event.asistentesActuales

          return (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{event.nombre}</CardTitle>
                    <CardDescription>{event.descripcion}</CardDescription>
                  </div>
                  {getStatusBadge(event.estado)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(event.fecha).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {event.asistentesActuales}/{event.capacidadMaxima}
                    </span>
                    {availableSpots > 0 ? (
                      <span className="text-green-600">({availableSpots} disponibles)</span>
                    ) : (
                      <span className="text-red-600">(Completo)</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ChefHat className="h-4 w-4" />
                    Platos del menú:
                  </div>
                  <ul className="text-sm space-y-1 ml-6 list-disc">
                    {event.platos.map((dish, idx) => (
                      <li key={idx}>{dish}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-muted-foreground mb-4">{attendees.length} reservas confirmadas</div>

                {event.estado !== "cancelado" && (usuario?.rol === "cocina" || usuario?.rol === "alumno-cocina-titular") && (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        setSelectedAttendanceEvent(event)
                        setIsAttendanceDialogOpen(true)
                        setIsScanning(false)
                      }}
                      className="w-full bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)"
                    >
                      <Users className="mr-2 h-4 w-4" /> Gestionar Asistencia
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(event)} className="flex-1">
                        <Edit className="mr-2 h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelEvent(event.id, event.nombre)}
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-3 w-3" />
                        Cancelar Evento
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>Al modificar el evento, su estado se marcará como "Modificado"</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Evento *</Label>
              <Input
                id="edit-name"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Hora *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Aforo Máximo</Label>
              <Input
                id="edit-capacity"
                type="number"
                min="1"
                max="100"
                value={formData.capacidadMaxima}
                onChange={(e) => setFormData({ ...formData, capacidadMaxima: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Platos del Menú</Label>
              {formData.platos.map((dish, index) => (
                <Input
                  key={index}
                  placeholder={`Plato ${index + 1}`}
                  value={dish}
                  onChange={(e) => {
                    const newDishes = [...formData.platos]
                    newDishes[index] = e.target.value
                    setFormData({ ...formData, platos: newDishes })
                  }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEvent} className="bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{`Asistencia: ${selectedAttendanceEvent?.nombre || ""}`}</DialogTitle>
            <DialogDescription>
              Escanea el QR del invitado o marca su asistencia manualmente.
            </DialogDescription>
          </DialogHeader>

          {selectedAttendanceEvent && (
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center bg-(--md-surface) p-4 rounded-lg border border-(--md-accent)">
                <div>
                  <h4 className="font-semibold text-(--md-heading)">Lector Automático</h4>
                  <p className="text-xs text-muted-foreground">Utiliza la cámara para escanear el QR del maestro</p>
                </div>
                <Button 
                  variant={isScanning ? "outline" : "default"}
                  onClick={() => setIsScanning(!isScanning)}
                  className={!isScanning ? "bg-(--md-coral) hover:bg-(--md-coral-hover) text-white" : "text-destructive border-destructive hover:bg-destructive/10"}
                >
                  {isScanning ? <XCircle className="mr-2 h-4 w-4" /> : <QrCode className="mr-2 h-4 w-4" />}
                  {isScanning ? "Cerrar Escáner" : "Activar Escáner"}
                </Button>
              </div>

              {isScanning && (
                <div className="w-full max-w-sm mx-auto aspect-square overflow-hidden rounded-lg border-2 border-(--md-accent) relative">
                  <Scanner 
                    onScan={(detectedCodes) => {
                      if (detectedCodes && detectedCodes.length > 0) {
                        handleScanAttendance(detectedCodes[0].rawValue, selectedAttendanceEvent.id)
                      }
                    }}
                  />
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-lg font-bold border-b pb-2 text-(--md-heading)">Lista de Invitados</h4>
                {(() => {
                  const attendees = obtenerAsistentesEvento(selectedAttendanceEvent.id)
                  if (attendees.length === 0) {
                    return <p className="text-sm text-muted-foreground text-center py-4">No hay reservas confirmadas para este evento.</p>
                  }
                  return (
                    <div className="space-y-2">
                      {attendees.map(res => (
                        <div key={res.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${res.asistio ? "bg-blue-50/50 border-blue-200" : "bg-background"}`}>
                          <div>
                            <p className="font-semibold text-sm">{res.nombreUsuario}</p>
                            <p className="text-xs text-muted-foreground">ID: {res.idUsuario}</p>
                          </div>
                          <Button 
                            variant={res.asistio ? "outline" : "default"}
                            className={res.asistio ? "" : "bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)"}
                            size="sm"
                            onClick={() => {
                              marcarAsistenciaEvento(res.id, !res.asistio)
                              toast({ 
                                title: "Actualizado", 
                                description: res.asistio ? "Asistencia cancelada" : "Check-In realizado",
                              })
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {res.asistio ? "Desmarcar" : "Hacer Check-In"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
              Cerrar Panel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

