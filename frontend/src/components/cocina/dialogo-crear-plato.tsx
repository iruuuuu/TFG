"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const COMMON_ALLERGENS = [
  "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", 
  "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza", 
  "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
]

export function CreateDishDialog() {
  const { añadirPlatoMenu, registrarActividad } = useDatos()
  const { usuario, todosLosUsuarios } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    categoria: string;
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
  })

  // Students available for attribution
  const students = todosLosUsuarios.filter(u => u.rol === 'alumno-cocina' || u.rol === 'alumno-cocina-titular')

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

    añadirPlatoMenu({
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria as "entrante" | "principal" | "postre",
      alergenos: formData.alergenos,
      idAutor: formData.idAutor,
      nombreAutor: authorName,
      precio: formData.precio,
      stock: formData.stock,
      disponible: true,
    })

    if (usuario) {
      registrarActividad(
        "Añadió Plato al Catálogo", 
        `Plato: ${formData.nombre} (${formData.categoria})`, 
        usuario.nombre, 
        usuario.rol
      )
    }

    toast({
      title: "Plato creado",
      description: `Se ha añadido "${formData.nombre}" al catálogo.`,
    })

    setFormData({ nombre: "", descripcion: "", categoria: "entrante", alergenos: [], precio: 0, stock: 0, idAutor: undefined })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Plato al Catálogo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-(--md-heading)">Añadir Nuevo Plato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-(--md-heading)">Nombre del plato</Label>
            <Input 
              id="name" 
              required 
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-(--md-heading)">Descripción</Label>
            <Textarea 
              id="description" 
              required 
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-(--md-heading)">Categoría</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, categoria: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-(--md-coral) text-white hover:bg-(--md-coral-hover)">Crear Plato</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

