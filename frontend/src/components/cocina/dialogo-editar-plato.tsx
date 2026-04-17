"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, X } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import type { PlatoMenu } from "@/lib/types"

const COMMON_ALLERGENS = [
  "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", 
  "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza", 
  "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
]

export function EditDishDialog({ plato }: { plato: PlatoMenu }) {
  const { actualizarPlatoMenu, registrarActividad } = useDatos()
  const { usuario, todosLosUsuarios } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    categoria: string;
    alergenos: string[];
    idAutor?: string;
  }>({
    nombre: plato.nombre,
    descripcion: plato.descripcion,
    categoria: plato.categoria,
    alergenos: plato.alergenos || [],
    idAutor: plato.idAutor,
  })

  // Students available for attribution
  const students = todosLosUsuarios.filter(u => u.rol === 'alumno-cocina' || u.rol === 'alumno-cocina-titular')

  useEffect(() => {
    if (open) {
      setFormData({
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        categoria: plato.categoria,
        alergenos: plato.alergenos || [],
        idAutor: plato.idAutor,
      })
    }
  }, [open, plato])

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
    
    const authorName = formData.idAutor 
      ? todosLosUsuarios.find(u => u.id === formData.idAutor)?.nombre 
      : undefined

    actualizarPlatoMenu(plato.id, {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria as "entrante" | "principal" | "postre",
      alergenos: formData.alergenos,
      idAutor: formData.idAutor,
      nombreAutor: authorName,
    })

    if (usuario) {
      registrarActividad(
        "Editó Plato del Catálogo", 
        `Plato: ${formData.nombre} (${formData.categoria})`, 
        usuario.nombre, 
        usuario.rol
      )
    }

    toast({
      title: "Plato actualizado",
      description: `Se han guardado los cambios en "${formData.nombre}".`,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <Edit className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-(--md-heading)">Editar Plato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
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
                  <X className="h-3 w-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleAllergen(a); }} />
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
            <Button type="submit" className="bg-(--md-coral) text-white hover:bg-(--md-coral-hover)">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
