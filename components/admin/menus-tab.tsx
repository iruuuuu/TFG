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
import { useData } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"
import type { MenuItem } from "@/lib/types"

export function MenusTab() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "entrante" as "entrante" | "principal" | "postre",
    allergens: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const itemData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      allergens: formData.allergens
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      available: true,
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData)
      toast({
        title: "Plato actualizado",
        description: `${formData.name} ha sido actualizado correctamente.`,
      })
    } else {
      addMenuItem(itemData)
      toast({
        title: "Plato añadido",
        description: `${formData.name} ha sido añadido al menú.`,
      })
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ name: "", description: "", category: "entrante", allergens: "" })
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      allergens: item.allergens.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (item: MenuItem) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${item.name}"?`)) {
      deleteMenuItem(item.id)
      toast({
        title: "Plato eliminado",
        description: `${item.name} ha sido eliminado del menú.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#4A3B32]">Gestión de <span className="text-[#E8654D]">Platos</span></h2>
          <p className="text-[#877669]">Añade, edita o elimina platos del menú</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#FAD85D] text-[#4A3B32] font-semibold hover:bg-[#E8E398] shadow-sm"
              onClick={() => {
                setEditingItem(null)
                setFormData({ name: "", description: "", category: "entrante", allergens: "" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-[#FAD85D] bg-[#FFFFFF]">
            <DialogHeader>
              <DialogTitle className="text-[#4A3B32]">{editingItem ? "Editar Plato" : "Añadir Nuevo Plato"}</DialogTitle>
              <DialogDescription className="text-[#877669]">Completa la información del plato</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del plato</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Paella valenciana"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger id="category">
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergens">Alérgenos</Label>
                <Input
                  id="allergens"
                  placeholder="Ej: gluten, lácteos (separados por comas)"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#FAD85D] text-[#4A3B32] font-semibold hover:bg-[#E8E398] shadow-sm">
                  {editingItem ? "Actualizar Plato" : "Guardar Plato"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className="border-[#FAD85D] bg-[#FFFFFF]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-[#4A3B32]">{item.name}</CardTitle>
                  <CardDescription className="mt-1 text-[#877669]">{item.description}</CardDescription>
                </div>
                <Badge variant={item.available ? "default" : "secondary"} className={`ml-2 ${item.available ? "bg-[#FAD85D] text-[#4A3B32]" : "bg-[#F0F1F2] text-[#877669]"}`}>
                  {item.available ? "Disponible" : "No disponible"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-[#877669]">Categoría</p>
                  <p className="text-sm capitalize text-[#4A3B32]">{item.category}</p>
                </div>
                {item.allergens.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#E8654D]">Alérgenos</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.allergens.map((allergen) => (
                        <Badge key={allergen} variant="outline" className="text-xs border-[#FAD85D] text-[#877669]">
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
                    className="flex-1 bg-[#FDF1B6]/50 border-[#FAD85D] text-[#4A3B32] hover:bg-[#FAD85D]"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#E8654D] border-[#FAD85D] bg-transparent hover:bg-[#FDF0EC]"
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
