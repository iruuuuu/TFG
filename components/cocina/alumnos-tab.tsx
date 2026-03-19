"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, UserPlus, Users, Pencil, Trash2, AlertTriangle } from "lucide-react"

export function AlumnosTab() {
  const { toast } = useToast()
  const { allUsers, updateUser, addUser, deleteUser, user: currentUser } = useAuth()
  const { ratings, menuItems } = useData()
  
  // Filter for students (id > 3 ensures we don't list admin/maestro/main cocina in the students tab)
  const alumnos = useMemo(() => {
    return allUsers.filter(u => parseInt(u.id) > 3)
  }, [allUsers])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string; password?: string } | null>(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" })

  const handleDeleteUser = (id: string, name: string) => {
    deleteUser(id)
    toast({
      title: "Alumno eliminado",
      description: `El alumno ${name} ha sido dado de baja correctamente.`,
      variant: "destructive",
    })
  }

  const getStudentRating = (studentId: string) => {
    const studentDishIds = menuItems.filter(item => item.authorId === studentId).map(item => item.id)
    if (studentDishIds.length === 0) return null
    
    const studentRatings = ratings.filter(r => studentDishIds.includes(r.menuItemId))
    if (studentRatings.length === 0) return null
    
    const avg = studentRatings.reduce((acc, r) => acc + r.rating, 0) / studentRatings.length
    return { avg, count: studentRatings.length }
  }

  const handleEditUser = (user: typeof alumnos[0]) => {
    setEditingUser({ ...user, password: "" })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const updates: any = {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
    }
    
    if (editingUser.password && editingUser.password.trim() !== "") {
      updates.password = editingUser.password
    }

    updateUser(editingUser.id, updates)
    
    setIsEditDialogOpen(false)
    setEditingUser(null)

    toast({
      title: "Alumno actualizado",
      description: `Los datos de ${editingUser.name} han sido actualizados.`,
    })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    addUser({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: "alumno-cocina",
    })

    setIsAddDialogOpen(false)
    setNewUser({ name: "", email: "", password: "" })

    toast({
      title: "Alumno registrado",
      description: `${newUser.name} ahora tiene acceso como alumno de cocina.`,
    })
  }

  return (
    <Card className="border-[var(--gm-accent)] bg-[var(--gm-surface)] shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-[var(--gm-heading)]">Gestión de <span className="text-[var(--gm-coral)]">Alumnos</span></CardTitle>
            <CardDescription className="text-[var(--gm-body)]">Administra los permisos de tus estudiantes de cocina</CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-light)] gap-2 w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Dar Permiso a Alumno
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--gm-surface)] border-[var(--gm-accent)]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[var(--gm-heading)]">Nuevo <span className="text-[var(--gm-coral)]">Alumno</span></DialogTitle>
                <DialogDescription className="text-[var(--gm-body)]">
                  Crea una cuenta para que un estudiante acceda al panel de cocina.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name" className="text-[var(--gm-heading)]">Nombre Completo</Label>
                  <Input 
                    id="add-name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                    placeholder="Ej: Laura Gómez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email" className="text-[var(--gm-heading)]">Correo Electrónico</Label>
                  <Input 
                    id="add-email" 
                    type="email"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                    placeholder="alumno@iesmendoza.es"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-password" className="text-[var(--gm-heading)]">Contraseña Inicial</Label>
                  <Input 
                    id="add-password" 
                    type="password"
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-light)]">
                    Registrar Alumno
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </CardHeader>
      
      <CardContent>
        {alumnos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-[var(--gm-accent)]">
            <Users className="h-12 w-12 text-[var(--gm-accent)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--gm-heading)]">Aún no hay alumnos</h3>
            <p className="text-[var(--gm-body)] mt-1">Añade a tus estudiantes para que puedan ayudarte en la cocina.</p>
          </div>
        ) : (
          <div className="rounded-md border border-[var(--gm-accent)]/50 overflow-x-auto">
            <Table className="min-w-[600px] sm:min-w-0">
              <TableHeader className="bg-[var(--gm-surface)]">
                <TableRow className="hover:bg-transparent border-[var(--gm-accent)]/50">
                  <TableHead className="font-bold text-[var(--gm-heading)]">Nombre</TableHead>
                  <TableHead className="font-bold text-[var(--gm-heading)] hidden md:table-cell">Email</TableHead>
                  <TableHead className="font-bold text-[var(--gm-heading)]">Rol</TableHead>
                  <TableHead className="font-bold text-[var(--gm-heading)]">Valoración Pública</TableHead>
                  <TableHead className="font-bold text-[var(--gm-heading)] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnos.map((alumno) => (
                  <TableRow key={alumno.id} className="border-[var(--gm-accent)]/30 hover:bg-[var(--gm-accent-light)]/10 transition-colors">
                    <TableCell className="font-medium text-[var(--gm-heading)]">{alumno.name}</TableCell>
                    <TableCell className="text-[var(--gm-body)]">{alumno.email}</TableCell>
                    <TableCell>
                      <Badge className={alumno.role === 'alumno-cocina-titular' ? "bg-[var(--gm-accent)] text-[var(--gm-body)] shadow-none border-none" : "bg-[var(--gm-muted-bg)] text-[var(--gm-body)] shadow-none border-none"}>
                        <span className="capitalize">{alumno.role === 'alumno-cocina-titular' ? "Cocinero Titular" : "Alumno Cocina"}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const rating = getStudentRating(alumno.id)
                        if (!rating) return <span className="text-xs text-[var(--gm-body)] italic">Sin valoraciones</span>
                        return (
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-[var(--gm-accent)] text-[var(--gm-accent)]" />
                            <span className="font-medium text-[var(--gm-heading)]">{rating.avg.toFixed(1)}</span>
                            <span className="text-xs text-[var(--gm-body)]">({rating.count})</span>
                          </div>
                        )
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog 
                          open={isEditDialogOpen && editingUser?.id === alumno.id} 
                          onOpenChange={(open) => {
                            if (!open) {
                              setIsEditDialogOpen(false);
                              setTimeout(() => setEditingUser(null), 150);
                            } else {
                              handleEditUser(alumno);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          {editingUser?.id === alumno.id && (
                            <DialogContent className="bg-[var(--gm-surface)] border-[var(--gm-accent)]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl text-[var(--gm-heading)]">Editar <span className="text-[var(--gm-coral)]">Alumno</span></DialogTitle>
                                <DialogDescription className="text-[var(--gm-body)]">
                                  Modifica los datos del alumno seleccionado.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name" className="text-[var(--gm-heading)]">Nombre Completo</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={editingUser.name} 
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email" className="text-[var(--gm-heading)]">Correo Electrónico</Label>
                                  <Input 
                                    id="edit-email" 
                                    type="email"
                                    value={editingUser.email} 
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-role" className="text-[var(--gm-heading)]">Permisos (Rol)</Label>
                                  <Select 
                                    value={editingUser.role} 
                                    onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}
                                  >
                                    <SelectTrigger id="edit-role" className="border-[var(--gm-accent)] focus:ring-[var(--gm-coral)]/20">
                                      <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="alumno-cocina">Alumno Cocina (Restringido)</SelectItem>
                                      <SelectItem value="alumno-cocina-titular">Cocinero Titular (Editor de Menús)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-password" className="text-[var(--gm-heading)]">Nueva Contraseña</Label>
                                  <Input 
                                    id="edit-password" 
                                    type="password"
                                    placeholder="Dejar en blanco para mantener actual"
                                    value={editingUser.password || ""} 
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                    className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                                  />
                                </div>
                                <DialogFooter className="pt-4">
                                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50">
                                    Cancelar
                                  </Button>
                                  <Button type="submit" className="bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-light)]">
                                    Guardar Cambios
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          )}
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-[var(--gm-coral)] border-[var(--gm-accent)] bg-transparent hover:bg-[var(--gm-coral-bg)]">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[var(--gm-surface)] border-[var(--gm-accent)]">
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 text-[var(--gm-coral)] mb-2">
                                <AlertTriangle className="h-6 w-6" />
                                <AlertDialogTitle>¿Eliminar acceso?</AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-[var(--gm-body)]">
                                Esta acción retirará el acceso a la cocina para <span className="font-bold text-[var(--gm-heading)]">{alumno.name}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(alumno.id, alumno.name)}
                                className="bg-[var(--gm-coral)] text-white hover:bg-[var(--gm-coral-hover)]"
                              >
                                Revocar Permiso
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
