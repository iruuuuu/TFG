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
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { PlatoMenu } from "@/lib/types"

const COMMON_ALLERGENS = [
  "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", 
  "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza", 
  "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
]

export function MenusTab() {
  const { platosMenu, añadirPlatoMenu, actualizarPlatoMenu, eliminarPlatoMenu } = useDatos()
  const { todosLosUsuarios } = useAuth()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PlatoMenu | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    categoria: "entrante" | "principal" | "postre";
    alergenos: string[];
    precio: number;
    stock: number;
    idAutor?: string;
  }>({
    nombre: "",
    descripcion: "",
    categoria: "entrante",
    alergenos: [],
    precio: 0,
    stock: 0,
    idAutor: undefined,
  })

  // Students available for attribution
  const students = todosLosUsuarios.filter(u => u.rol === 'alumno-cocina' || u.rol === 'alumno-cocina-titular')

  const platosFiltrados = platosMenu.filter((plato) => 
    plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    plato.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      alergenos: prev.alergenos.includes(allergen) 
        ? prev.alergenos.filter(a => a !== allergen)
        : [...prev.alergenos, allergen]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Comprobar duplicados por nombre
    const nombreNormalizado = formData.nombre.trim().toLowerCase()
    const esDuplicado = platosMenu.some(p => 
      p.nombre.trim().toLowerCase() === nombreNormalizado && 
      p.id !== editingItem?.id
    )

    if (esDuplicado) {
      toast({
        title: "Plato duplicado",
        description: `Ya existe un plato con el nombre "${formData.nombre}".`,
        variant: "destructive",
      })
      return
    }

    if (formData.stock <= 0) {
      toast({
        title: "Cantidad no válida",
        description: "El plato debe tener al menos 1 unidad existente.",
        variant: "destructive",
      })
      return
    }

    const authorName = formData.idAutor 
      ? todosLosUsuarios.find(u => u.id === formData.idAutor)?.nombre 
      : undefined

    const itemData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      alergenos: formData.alergenos,
      idAutor: formData.idAutor,
      nombreAutor: authorName,
      precio: formData.precio,
      stock: formData.stock,
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
    setFormData({ nombre: "", descripcion: "", categoria: "entrante", alergenos: [], precio: 0, stock: 0, idAutor: undefined })
  }

  const handleEdit = (item: PlatoMenu) => {
    setEditingItem(item)
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion,
      categoria: item.categoria,
      alergenos: item.alergenos || [],
      precio: item.precio || 0,
      stock: item.stock || 0,
      idAutor: item.idAutor,
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
                setFormData({ nombre: "", descripcion: "", categoria: "entrante", alergenos: [], precio: 0, stock: 0, idAutor: undefined })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md border-md-accent bg-md-surface p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-(--md-heading)">{editingItem ? "Editar Plato" : "Añadir Nuevo Plato"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-(--md-heading)">Nombre del plato</Label>
                <Input
                  id="name"
                  placeholder="Ej: Paella valenciana"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-(--md-heading)">Descripción</Label>
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
                <Label htmlFor="categoria" className="text-(--md-heading)">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value as "entrante" | "principal" | "postre" })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-(--md-heading)">Precio por Unidad (€)</Label>
                  <Input 
                    id="precio" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    required 
                    value={formData.precio}
                    onChange={(e) => setFormData(prev => ({ ...prev, precio: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-(--md-heading)">Unidades Existentes</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    min="0"
                    required 
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-(--md-heading)">Alérgenos</Label>
                <Select 
                  value="" 
                  onValueChange={(val) => {
                    if (val && !formData.alergenos.includes(val)) {
                      toggleAllergen(val)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar alérgeno para añadir" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {COMMON_ALLERGENS.filter(a => !formData.alergenos.includes(a)).map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.alergenos.map(a => (
                    <Badge key={a} variant="secondary" className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-hover) flex items-center gap-1 px-3 py-1">
                      {a}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAllergen(a)} />
                    </Badge>
                  ))}
                  {formData.alergenos.length === 0 && (
                    <span className="text-xs text-muted-foreground">Ningún alérgeno seleccionado</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-(--md-heading)">Autor (Opcional - Atribuir a un Alumno)</Label>
                <Select 
                  value={formData.idAutor || "none"} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, idAutor: val === "none" ? undefined : val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No atribuido / Plato Tradicional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No atribuido / Plato Tradicional</SelectItem>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-(--md-body)">Las valoraciones de este plato se sumarán al perfil de este estudiante</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-(--md-coral) text-white hover:bg-(--md-coral-hover)">
                  {editingItem ? "Actualizar Plato" : "Guardar Plato"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-md-body" />
        <Input
          placeholder="Buscar platos por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10 border-md-accent bg-md-surface focus:ring-md-accent"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platosFiltrados.map((item) => (
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
                {item.alergenos && item.alergenos.length > 0 && (
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


