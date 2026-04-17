"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useDatos } from "@/lib/data-context"
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
  const {todosLosUsuarios, actualizarUsuario, añadirUsuario, eliminarUsuario, usuario: usuarioActual} = useAuth()
  const { valoraciones, platosMenu } = useDatos()
  
  // Filter for students based on their roles
  const alumnos = useMemo(() => {
    return todosLosUsuarios.filter(u => u.rol === 'alumno-cocina' || u.rol === 'alumno-cocina-titular')
  }, [todosLosUsuarios])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const [editingUser, setEditingUser] = useState<{ id: string; nombre: string; email: string; rol: string; password?: string } | null>(null)
  const [newUser, setNewUser] = useState({ nombre: "", email: "", password: "" })

  const handleDeleteUser = (id: string, nombre: string) => {
    eliminarUsuario(id)
    toast({
      title: "Alumno eliminado",
      description: `El alumno ${name} ha sido dado de baja correctamente.`,
      variant: "destructive",
    })
  }

  const getStudentRating = (studentId: string) => {
    const studentDishIds = platosMenu.filter(item => item.idAutor === studentId).map(item => item.id)
    if (studentDishIds.length === 0) return null
    
    const studentRatings = valoraciones.filter(r => studentDishIds.includes(r.idPlatoMenu))
    if (studentRatings.length === 0) return null
    
    const avg = studentRatings.reduce((acc, r) => acc + r.puntuacion, 0) / studentRatings.length
    return { avg, count: studentRatings.length }
  }

  const handleEditUser = (usuario: typeof alumnos[0]) => {
    setEditingUser({ ...usuario, password: "" })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const updates: any = {
      nombre: editingUser.nombre,
      email: editingUser.email,
      rol: editingUser.rol,
    }
    
    if (editingUser.password && editingUser.password.trim() !== "") {
      updates.password = editingUser.password
    }

    actualizarUsuario(editingUser.id, updates)
    
    setIsEditDialogOpen(false)
    setEditingUser(null)

    toast({
      title: "Alumno actualizado",
      description: `Los datos de ${editingUser.nombre} han sido actualizados.`,
    })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    añadirUsuario({
      nombre: newUser.nombre,
      email: newUser.email,
      password: newUser.password,
      rol: "alumno-cocina",
    })

    setIsAddDialogOpen(false)
    setNewUser({ nombre: "", email: "", password: "" })

    toast({
      title: "Alumno registrado",
      description: `${newUser.nombre} ahora tiene acceso como alumno de cocina.`,
    })
  }

  return (
    <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-(--md-heading)">Gestión de <span className="text-(--md-coral)">Alumnos</span></CardTitle>
            <CardDescription className="text-(--md-body)">Administra los permisos de tus estudiantes de cocina</CardDescription>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-light) gap-2 w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Dar Permiso a Alumno
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-(--md-surface) border-(--md-accent)">
              <DialogHeader>
                <DialogTitle className="text-2xl text-(--md-heading)">Nuevo <span className="text-(--md-coral)">Alumno</span></DialogTitle>
                <DialogDescription className="text-(--md-body)">
                  Crea una cuenta para que un estudiante acceda al panel de cocina.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="add-name" className="text-(--md-heading)">Nombre Completo</Label>
                  <Input 
                    id="add-name" 
                    value={newUser.nombre} 
                    onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                    placeholder="Ej: Laura Gómez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-email" className="text-(--md-heading)">Correo Electrónico</Label>
                  <Input 
                    id="add-email" 
                    type="email"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                    placeholder="alumno@iesmendoza.es"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-password" className="text-(--md-heading)">Contraseña Inicial</Label>
                  <Input 
                    id="add-password" 
                    type="password"
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50">
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-light)">
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
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed border-(--md-accent)">
            <Users className="h-12 w-12 text-(--md-accent) mb-4" />
            <h3 className="text-lg font-medium text-(--md-heading)">Aún no hay alumnos</h3>
            <p className="text-(--md-body) mt-1">Añade a tus estudiantes para que puedan ayudarte en la cocina.</p>
          </div>
        ) : (
          <div className="rounded-md border border-(--md-accent)/50 overflow-x-auto">
            <Table className="min-w-[600px] sm:min-w-0">
              <TableHeader className="bg-(--md-surface)">
                <TableRow className="hover:bg-transparent border-(--md-accent)/50">
                  <TableHead className="font-bold text-(--md-heading)">Nombre</TableHead>
                  <TableHead className="font-bold text-(--md-heading) hidden md:table-cell">Email</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Rol</TableHead>
                  <TableHead className="font-bold text-(--md-heading)">Valoración Pública</TableHead>
                  <TableHead className="font-bold text-(--md-heading) text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnos.map((alumno) => (
                  <TableRow key={alumno.id} className="border-(--md-accent)/30 hover:bg-(--md-accent-light)/10 transition-colors">
                    <TableCell className="font-medium text-(--md-heading)">{alumno.nombre}</TableCell>
                    <TableCell className="text-(--md-body)">{alumno.email}</TableCell>
                    <TableCell>
                      <Badge className={alumno.rol === 'alumno-cocina-titular' ? "bg-(--md-accent) text-(--md-body) shadow-none border-none" : "bg-(--md-muted-bg) text-(--md-body) shadow-none border-none"}>
                        <span className="capitalize">{alumno.rol === 'alumno-cocina-titular' ? "Cocinero Titular" : "Alumno Cocina"}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const rating = getStudentRating(alumno.id)
                        if (!rating) return <span className="text-xs text-(--md-body) italic">Sin valoraciones</span>
                        return (
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-(--md-accent) text-(--md-accent)" />
                            <span className="font-medium text-(--md-heading)">{rating.avg.toFixed(1)}</span>
                            <span className="text-xs text-(--md-body)">({rating.count})</span>
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
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          {editingUser?.id === alumno.id && (
                            <DialogContent className="bg-(--md-surface) border-(--md-accent)">
                              <DialogHeader>
                                <DialogTitle className="text-2xl text-(--md-heading)">Editar <span className="text-(--md-coral)">Alumno</span></DialogTitle>
                                <DialogDescription className="text-(--md-body)">
                                  Modifica los datos del alumno seleccionado.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name" className="text-(--md-heading)">Nombre Completo</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={editingUser.nombre} 
                                    onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-email" className="text-(--md-heading)">Correo Electrónico</Label>
                                  <Input 
                                    id="edit-email" 
                                    type="email"
                                    value={editingUser.email} 
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-role" className="text-(--md-heading)">Permisos (Rol)</Label>
                                  <Select 
                                    value={editingUser.rol} 
                                    onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, rol: value } : null)}
                                  >
                                    <SelectTrigger id="edit-role" className="border-(--md-accent) focus:ring-(--md-coral)/20">
                                      <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="alumno-cocina">Alumno Cocina (Restringido)</SelectItem>
                                      <SelectItem value="alumno-cocina-titular">Cocinero Titular (Editor de Menús)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-password" className="text-(--md-heading)">Nueva Contraseña</Label>
                                  <Input 
                                    id="edit-password" 
                                    type="password"
                                    placeholder="Dejar en blanco para mantener actual"
                                    value={editingUser.password || ""} 
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                    className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                                  />
                                </div>
                                <DialogFooter className="pt-4">
                                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50">
                                    Cancelar
                                  </Button>
                                  <Button type="submit" className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-light)">
                                    Guardar Cambios
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          )}
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-(--md-coral) border-(--md-accent) bg-transparent hover:bg-(--md-coral-bg)">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-(--md-surface) border-(--md-accent)">
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 text-(--md-coral) mb-2">
                                <AlertTriangle className="h-6 w-6" />
                                <AlertDialogTitle>¿Eliminar acceso?</AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-(--md-body)">
                                Esta acción retirará el acceso a la cocina para <span className="font-bold text-(--md-heading)">{alumno.nombre}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50">Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(alumno.id, alumno.nombre)}
                                className="bg-(--md-coral) text-white hover:bg-(--md-coral-hover)"
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

