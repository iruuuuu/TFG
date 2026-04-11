"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"
import type { PlatoMenu } from "@/lib/types"

export function MenusTab() {
  const { platosMenu, añadirPlatoMenu, actualizarPlatoMenu, eliminarPlatoMenu } = useDatos()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PlatoMenu | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "entrante" as "entrante" | "principal" | "postre",
    alergenos: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const itemData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      alergenos: formData.alergenos
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      disponible: true,
    }

    if (editingItem) {
      actualizarPlatoMenu(editingItem.id, itemData)
      toast({
        title: "Plato actualizado",
        description: `${formData.nombre} ha sido actualizado correctamente.`,
      })
    } else {
      añadirPlatoMenu(itemData)
      toast({
        title: "Plato añadido",
        description: `${formData.nombre} ha sido añadido al menú.`,
      })
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ nombre: "", descripcion: "", categoria: "entrante", alergenos: "" })
  }

  const handleEdit = (item: PlatoMenu) => {
    setEditingItem(item)
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria: item.categoria,
      alergenos: item.alergenos.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (item: PlatoMenu) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${item.nombre}"?`)) {
      eliminarPlatoMenu(item.id)
      toast({
        title: "Plato eliminado",
        description: `${item.nombre} ha sido eliminado del menú.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-md-heading">Gestión de <span className="text-md-coral">Platos</span></h2>
          <p className="text-md-body font-medium">Añade, edita o elimina platos del menú</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm"
              onClick={() => {
                setEditingItem(null)
                setFormData({ nombre: "", descripcion: "", categoria: "entrante", alergenos: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-md-accent bg-md-surface p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-md-heading">{editingItem ? "Editar Plato" : "Añadir Nuevo Plato"}</DialogTitle>
              <DialogDescription className="text-md-body">Completa la información del plato</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del plato</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Paella valenciana"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value as any })}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrante">Entrante</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="postre">Postre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el plato..."
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergens">Alérgenos</Label>
                <Input
                  id="allergens"
                  placeholder="Ej: gluten, lácteos (separados por comas)"
                  value={formData.alergenos}
                  onChange={(e) => setFormData({ ...formData, alergenos: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm">
                  {editingItem ? "Actualizar Plato" : "Guardar Plato"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platosMenu.map((item) => (
          <Card key={item.id} className="border-(--md-accent) bg-(--md-surface)">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-(--md-heading)">{item.nombre}</CardTitle>
                  <CardDescription className="mt-1 text-(--md-body)">{item.descripcion}</CardDescription>
                </div>
                <Badge variant={item.disponible ? "default" : "secondary"} className={`ml-2 ${item.disponible ? "bg-(--md-accent) text-(--md-heading)" : "bg-(--md-muted-bg) text-(--md-body)"}`}>
                  {item.disponible ? "Disponible" : "No disponible"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-(--md-body)">Categoría</p>
                  <p className="text-sm capitalize text-(--md-heading)">{item.categoria}</p>
                </div>
                {item.alergenos.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-(--md-coral)">Alérgenos</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.alergenos.map((allergen) => (
                        <Badge key={allergen} variant="outline" className="text-xs border-(--md-accent) text-(--md-body)">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-(--md-accent-light)/50 border-(--md-accent) text-(--md-heading) hover:bg-(--md-accent)"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-(--md-coral) border-(--md-accent) bg-transparent hover:bg-(--md-coral-bg)"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

