"use client"

import { useState } from "react"
import { useData } from "@/lib/data-context"
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
import { Calendar, Users, ChefHat, Edit, XCircle, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { GastroEvent } from "@/lib/types"

export function GastroEventsTab() {
  const { gastroEvents, addGastroEvent, updateGastroEvent, cancelGastroEvent, getEventAttendees } = useData()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<GastroEvent | null>(null)

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
      toast({
        title: "Evento cancelado",
        description: "Los usuarios reservados serán notificados",
      })
    }
  }

  const getStatusBadge = (status: GastroEvent["status"]) => {
    const styles = {
      active: "bg-[#F2EFC2] text-[#737373]",
      full: "bg-[#F2EDA2] text-[#737373]",
      modified: "bg-[#BF726B]/20 text-[#BF726B]",
      cancelled: "bg-[#F2594B]/10 text-[#F2594B]",
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]">
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
              <Button onClick={handleAddEvent} className="bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]">
                Publicar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

                <div className="text-xs text-muted-foreground">{attendees.length} reservas confirmadas</div>

                {event.status !== "cancelled" && (
                  <div className="flex gap-2 pt-2">
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
            <Button onClick={handleEditEvent} className="bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
