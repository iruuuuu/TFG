"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
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
import type { GastroEvent } from "@/lib/types"

export function GastroEventsTab() {
  const { gastroEvents, addGastroEvent, updateGastroEvent, cancelGastroEvent, getEventAttendees, markEventAttendance, users, logActivity } = useData()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<GastroEvent | null>(null)
  const [selectedAttendanceEvent, setSelectedAttendanceEvent] = useState<GastroEvent | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    maxCapacity: 20,
    dishes: ["", "", "", "", ""],
  })

  const handleAddEvent = () => {
    if (!formData.name || !formData.date || !formData.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const eventDate = new Date(`${formData.date}T${formData.time}:00`)
    const validDishes = formData.dishes.filter((d) => d.trim() !== "")

    addGastroEvent({
      name: formData.name,
      description: formData.description,
      date: eventDate,
      maxCapacity: formData.maxCapacity,
      dishes: validDishes,
      status: "active",
      createdBy: "cocina@iesmendoza.es",
    })

    if (user) {
      logActivity("Publicó Nuevo Evento", `Evento: ${formData.name}`, user.name, user.role)
    }

    toast({
      title: "Evento creado",
      description: `${formData.name} ha sido publicado correctamente`,
    })

    setIsAddDialogOpen(false)
    setFormData({
      name: "",
      description: "",
      date: "",
      time: "",
      maxCapacity: 20,
      dishes: ["", "", "", "", ""],
    })
  }

  const handleEditEvent = () => {
    if (!selectedEvent) return

    const eventDate = new Date(`${formData.date}T${formData.time}:00`)
    const validDishes = formData.dishes.filter((d) => d.trim() !== "")

    updateGastroEvent(selectedEvent.id, {
      name: formData.name,
      description: formData.description,
      date: eventDate,
      maxCapacity: formData.maxCapacity,
      dishes: validDishes,
    })

    toast({
      title: "Evento actualizado",
      description: "Los cambios han sido guardados y el estado marcado como modificado",
    })

    setIsEditDialogOpen(false)
    setSelectedEvent(null)
  }

  const openEditDialog = (event: GastroEvent) => {
    setSelectedEvent(event)
    const date = new Date(event.date)
    setFormData({
      name: event.name,
      description: event.description,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5),
      maxCapacity: event.maxCapacity,
      dishes: [...event.dishes, "", "", "", "", ""].slice(0, 5),
    })
    setIsEditDialogOpen(true)
  }

  const handleCancelEvent = (eventId: string, eventName: string) => {
    if (confirm(`¿Estás seguro de cancelar el evento "${eventName}"?`)) {
      cancelGastroEvent(eventId)
      if (user) {
        logActivity("Canceló Evento", `Evento: ${eventName}`, user.name, user.role)
      }
      toast({
        title: "Evento cancelado",
        description: "Los usuarios reservados serán notificados",
      })
    }
  }

  const handleScanAttendance = (text: string, eventId: string) => {
    if (!text) return

    // Find user by email (from QR)
    const foundUser = users.find(u => u.email.toLowerCase() === text.toLowerCase())
    if (!foundUser) {
      toast({ title: "QR Inválido", description: "El QR no corresponde a un maestro registrado.", variant: "destructive" })
      return
    }

    const attendees = getEventAttendees(eventId)
    const reservation = attendees.find(r => r.userId === foundUser.id)

    if (!reservation) {
      toast({ title: "Acceso Denegado", description: `${foundUser.name} no está en la lista de invitados.`, variant: "destructive" })
      return
    }

    if (reservation.attended) {
      toast({ title: "Aviso", description: `${foundUser.name} ya había hecho el Check-In.`, variant: "default" })
      return
    }

    // Mark as attended
    markEventAttendance(reservation.id, true)
    
    // Auto-close scanner and show success
    setIsScanning(false)
    toast({
      title: "Check-In Exitoso",
      description: `Acceso concedido a ${foundUser.name}.`,
    })
  }

  const getStatusBadge = (status: GastroEvent["status"]) => {
    const styles = {
      active: "bg-[var(--gm-accent-light)] text-[var(--gm-body)]",
      full: "bg-[var(--gm-accent)] text-[var(--gm-body)]",
      modified: "bg-[var(--gm-coral-hover)]/20 text-[var(--gm-coral-hover)]",
      cancelled: "bg-[var(--gm-coral)]/10 text-[var(--gm-coral)]",
    }
    const labels = {
      active: "Activo",
      full: "Completo",
      modified: "Modificado",
      cancelled: "Cancelado",
    }
    return <Badge className={styles[status]}>{labels[status]}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Eventos Gastronómicos</h2>
          <p className="text-muted-foreground">Gestiona menús degustación y experiencias especiales</p>
        </div>
        {(user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]">
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe la experiencia gastronómica..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platos del Menú</Label>
                  <p className="text-sm text-muted-foreground">Añade hasta 5 platos para el menú degustación</p>
                  {formData.dishes.map((dish, index) => (
                    <Input
                      key={index}
                      placeholder={`Plato ${index + 1}`}
                      value={dish}
                      onChange={(e) => {
                        const newDishes = [...formData.dishes]
                        newDishes[index] = e.target.value
                        setFormData({ ...formData, dishes: newDishes })
                      }}
                    />
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddEvent} className="bg-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]">
                  Publicar Evento
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gastroEvents.map((event) => {
          const attendees = getEventAttendees(event.id)
          const availableSpots = event.maxCapacity - event.currentAttendees

          return (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(event.date).toLocaleDateString("es-ES", {
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
                      {event.currentAttendees}/{event.maxCapacity}
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
                    {event.dishes.map((dish, idx) => (
                      <li key={idx}>{dish}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-muted-foreground mb-4">{attendees.length} reservas confirmadas</div>

                {event.status !== "cancelled" && (user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        setSelectedAttendanceEvent(event)
                        setIsAttendanceDialogOpen(true)
                        setIsScanning(false)
                      }}
                      className="w-full bg-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]"
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
                        onClick={() => handleCancelEvent(event.id, event.name)}
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Platos del Menú</Label>
              {formData.dishes.map((dish, index) => (
                <Input
                  key={index}
                  placeholder={`Plato ${index + 1}`}
                  value={dish}
                  onChange={(e) => {
                    const newDishes = [...formData.dishes]
                    newDishes[index] = e.target.value
                    setFormData({ ...formData, dishes: newDishes })
                  }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditEvent} className="bg-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{`Asistencia: ${selectedAttendanceEvent?.name || ""}`}</DialogTitle>
            <DialogDescription>
              Escanea el QR del invitado o marca su asistencia manualmente.
            </DialogDescription>
          </DialogHeader>

          {selectedAttendanceEvent && (
            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center bg-[var(--gm-surface)] p-4 rounded-lg border border-[var(--gm-accent)]">
                <div>
                  <h4 className="font-semibold text-[var(--gm-heading)]">Lector Automático</h4>
                  <p className="text-xs text-muted-foreground">Utiliza la cámara para escanear el QR del maestro</p>
                </div>
                <Button 
                  variant={isScanning ? "outline" : "default"}
                  onClick={() => setIsScanning(!isScanning)}
                  className={!isScanning ? "bg-[var(--gm-coral)] hover:bg-[var(--gm-coral-hover)] text-white" : "text-destructive border-destructive hover:bg-destructive/10"}
                >
                  {isScanning ? <XCircle className="mr-2 h-4 w-4" /> : <QrCode className="mr-2 h-4 w-4" />}
                  {isScanning ? "Cerrar Escáner" : "Activar Escáner"}
                </Button>
              </div>

              {isScanning && (
                <div className="w-full max-w-sm mx-auto aspect-square overflow-hidden rounded-lg border-2 border-[var(--gm-accent)] relative">
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
                <h4 className="text-lg font-bold border-b pb-2 text-[var(--gm-heading)]">Lista de Invitados</h4>
                {(() => {
                  const attendees = getEventAttendees(selectedAttendanceEvent.id)
                  if (attendees.length === 0) {
                    return <p className="text-sm text-muted-foreground text-center py-4">No hay reservas confirmadas para este evento.</p>
                  }
                  return (
                    <div className="space-y-2">
                      {attendees.map(res => (
                        <div key={res.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${res.attended ? "bg-blue-50/50 border-blue-200" : "bg-background"}`}>
                          <div>
                            <p className="font-semibold text-sm">{res.userName}</p>
                            <p className="text-xs text-muted-foreground">ID: {res.userId}</p>
                          </div>
                          <Button 
                            variant={res.attended ? "outline" : "default"}
                            className={res.attended ? "" : "bg-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]"}
                            size="sm"
                            onClick={() => {
                              markEventAttendance(res.id, !res.attended)
                              toast({ 
                                title: "Actualizado", 
                                description: res.attended ? "Asistencia cancelada" : "Check-In realizado",
                              })
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {res.attended ? "Desmarcar" : "Hacer Check-In"}
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
