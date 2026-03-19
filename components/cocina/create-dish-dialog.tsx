"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const COMMON_ALLERGENS = [
  "Gluten", "Crustáceos", "Huevos", "Pescado", "Cacahuetes", 
  "Soja", "Lácteos", "Frutos de cáscara", "Apio", "Mostaza", 
  "Sésamo", "Sulfitos", "Altramuces", "Moluscos"
]

export function CreateDishDialog() {
  const { addMenuItem, logActivity } = useData()
  const { user, allUsers } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    allergens: string[];
    authorId?: string;
  }>({
    name: "",
    description: "",
    category: "entrante",
    allergens: [],
  })

  // Students available for attribution
  const students = allUsers.filter(u => parseInt(u.id) > 3)

  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen) 
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const authorName = formData.authorId 
      ? allUsers.find(u => u.id === formData.authorId)?.name 
      : undefined

    addMenuItem({
      name: formData.name,
      description: formData.description,
      category: formData.category as "entrante" | "principal" | "postre",
      allergens: formData.allergens,
      authorId: formData.authorId,
      authorName: authorName,
      available: true,
    })

    if (user) {
      logActivity(
        "Añadió Plato al Catálogo", 
        `Plato: ${formData.name} (${formData.category})`, 
        user.name, 
        user.role
      )
    }

    toast({
      title: "Plato creado",
      description: `Se ha añadido "${formData.name}" al catálogo.`,
    })

    setFormData({ name: "", description: "", category: "entrante", allergens: [], authorId: undefined })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent-hover)] shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Plato al Catálogo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[var(--gm-heading)]">Añadir Nuevo Plato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[var(--gm-heading)]">Nombre del plato</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[var(--gm-heading)]">Descripción</Label>
            <Textarea 
              id="description" 
              required 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[var(--gm-heading)]">Categoría</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
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
            <Label className="text-[var(--gm-heading)]">Alérgenos</Label>
            <Select 
              value="" 
              onValueChange={(val) => {
                if (val && !formData.allergens.includes(val)) {
                  toggleAllergen(val)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar alérgeno para añadir" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {COMMON_ALLERGENS.filter(a => !formData.allergens.includes(a)).map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.allergens.map(a => (
                <Badge key={a} variant="secondary" className="bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-hover)] flex items-center gap-1 px-3 py-1">
                  {a}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleAllergen(a)} />
                </Badge>
              ))}
              {formData.allergens.length === 0 && (
                <span className="text-xs text-muted-foreground">Ningún alérgeno seleccionado</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="author" className="text-[var(--gm-heading)]">Autor (Opcional - Atribuir a un Alumno)</Label>
            <Select 
              value={formData.authorId || "none"} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, authorId: val === "none" ? undefined : val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="No atribuido / Plato Tradicional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No atribuido / Plato Tradicional</SelectItem>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--gm-body)]">Las valoraciones de este plato se sumarán al perfil de este estudiante</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-[var(--gm-coral)] text-white hover:bg-[var(--gm-coral-hover)]">Crear Plato</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
