"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Pencil, Trash2, ShieldCheck, ChefHat, GraduationCap, Users, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
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

export function UsersTab() {
  const { toast } = useToast()
  const { allUsers: users, addUser, updateUser, deleteUser } = useAuth()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string; password?: string } | null>(null)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "alumno-cocina" })

  const filteredUsers = (role: string | "all") => {
    if (role === "all") return users
    if (role === "alumno-cocina") {
      return users.filter(u => u.role === "alumno-cocina" || u.role === "alumno-cocina-titular")
    }
    return users.filter((u) => u.role === role)
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-(--md-coral)/10 text-(--md-coral)",
      cocina: "bg-(--md-accent) text-(--md-body)",
      "alumno-cocina": "bg-(--md-success-bg) text-[#2E7D32]",
      maestro: "bg-(--md-accent-light) text-(--md-body)",
    }
    return variants[role as keyof typeof variants] || "bg-(--md-muted-bg) text-(--md-body)"
  }

  const handleDeleteUser = (id: string, name: string) => {
    deleteUser(id)
    toast({
      title: "Usuario eliminado",
      description: `El usuario ${name} ha sido eliminado correctamente.`,
      variant: "destructive",
    })
  }

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUser({ ...user, password: "" })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      ...(editingUser.password ? { password: editingUser.password } : {})
    })
    
    setIsEditDialogOpen(false)
    setEditingUser(null)

    toast({
      title: "Usuario actualizado",
      description: `Los datos de ${editingUser.name} han sido guardados.`,
    })
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await addUser({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role as "admin" | "cocina" | "maestro" | "alumno-cocina",
    })

    setIsAddDialogOpen(false)
    setNewUser({ name: "", email: "", password: "", role: "alumno-cocina" })

    toast({
      title: "Usuario creado",
      description: `El usuario ${newUser.name} ha sido registrado exitosamente.`,
    })
  }

  const UserTable = ({ role }: { role: string | "all" }) => (
    <div className="rounded-md border border-(--md-accent)/50 overflow-x-auto">
      <Table className="min-w-[600px] sm:min-w-0">
        <TableHeader className="bg-(--md-surface)">
          <TableRow className="hover:bg-transparent border-(--md-accent)/50">
            <TableHead className="font-bold text-(--md-heading)">Nombre</TableHead>
            <TableHead className="font-bold text-(--md-heading)">Email</TableHead>
            <TableHead className="font-bold text-(--md-heading)">Rol</TableHead>
            <TableHead className="text-right font-bold text-(--md-heading)">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers(role).map((user) => (
            <TableRow key={user.id} className="border-(--md-accent)/30 hover:bg-(--md-accent-light)/10 transition-colors">
              <TableCell className="font-medium text-(--md-heading)">{user.name}</TableCell>
              <TableCell className="text-(--md-body)">{user.email}</TableCell>
              <TableCell>
                <Badge className={`${getRoleBadge(user.role)} shadow-none border-none`}>
                  <span className="capitalize">{user.role}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog 
                    open={isEditDialogOpen && editingUser?.id === user.id} 
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditDialogOpen(false);
                        setTimeout(() => setEditingUser(null), 150);
                      } else {
                        handleEditUser(user);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    {editingUser?.id === user.id && (
                      <DialogContent className="bg-(--md-surface) border-(--md-accent)">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-(--md-heading)">Editar <span className="text-(--md-coral)">Usuario</span></DialogTitle>
                          <DialogDescription className="text-(--md-body)">
                            Modifica los datos del usuario seleccionado.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-(--md-heading)">Nombre Completo</Label>
                            <Input 
                              id="name" 
                              value={editingUser.name} 
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-(--md-heading)">Correo Electrónico</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={editingUser.email} 
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                              className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-(--md-heading)">Nueva Contraseña</Label>
                            <Input 
                              id="password" 
                              type="password"
                              placeholder="Dejar en blanco para mantener actual"
                              value={editingUser.password || ""} 
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-(--md-heading)">Rol de Usuario</Label>
                            <Select 
                              value={editingUser.role} 
                              onValueChange={(val) => setEditingUser({ ...editingUser, role: val })}
                            >
                              <SelectTrigger className="border-(--md-accent) focus:ring-(--md-coral)/20">
                                <SelectValue placeholder="Seleccionar rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="cocina">Cocina</SelectItem>
                                <SelectItem value="alumno-cocina">Alumno Cocina</SelectItem>
                                <SelectItem value="maestro">Profesor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter className="pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsEditDialogOpen(false)}
                              className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50"
                            >
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
                          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-(--md-body)">
                          ¿Estás seguro de que deseas eliminar a <span className="font-bold text-(--md-heading)">{user.name}</span>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="bg-(--md-coral) text-white hover:bg-(--md-coral-hover)"
                        >
                          Eliminar Permanentemente
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
  )

  return (
    <div className="space-y-6">
      <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl text-(--md-heading)">Gestión de <span className="text-(--md-coral)">Usuarios</span></CardTitle>
              <CardDescription className="text-(--md-body)">Administra y organiza los perfiles del centro</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-light) gap-2 w-full sm:w-auto">
                  <UserPlus className="h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-(--md-surface) border-(--md-accent)">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-(--md-heading)">Nuevo <span className="text-(--md-coral)">Usuario</span></DialogTitle>
                  <DialogDescription className="text-(--md-body)">
                    Crea un nuevo usuario y asígnale un rol en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-name" className="text-(--md-heading)">Nombre Completo</Label>
                    <Input 
                      id="add-name" 
                      value={newUser.name} 
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-password" className="text-(--md-heading)">Contraseña</Label>
                    <Input 
                      id="add-password" 
                      type="password"
                      value={newUser.password} 
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="border-(--md-accent) focus-visible:ring-(--md-coral)/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-role" className="text-(--md-heading)">Rol de Usuario</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                    >
                      <SelectTrigger className="border-(--md-accent) focus:ring-(--md-coral)/20">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="cocina">Cocina</SelectItem>
                        <SelectItem value="alumno-cocina">Alumno Cocina</SelectItem>
                        <SelectItem value="maestro">Profesor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/50"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-(--md-accent) text-(--md-heading) hover:bg-(--md-accent-light)">
                      Crear Usuario
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto bg-md-surface border border-md-accent/50 p-1 gap-1 h-auto justify-start sm:justify-center">
              <TabsTrigger value="all" className="flex-1 min-w-[100px] data-[state=active]:bg-md-accent data-[state=active]:text-md-heading text-md-body py-2 gap-2">
                <Users className="h-4 w-4" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="cocina" className="flex-1 min-w-[100px] data-[state=active]:bg-md-accent data-[state=active]:text-md-heading text-md-body py-2 gap-2">
                <ChefHat className="h-4 w-4" />
                Cocina
              </TabsTrigger>
              <TabsTrigger value="alumno-cocina" className="flex-1 min-w-[100px] data-[state=active]:bg-md-accent data-[state=active]:text-md-heading text-md-body py-2 gap-2">
                <Users className="h-4 w-4" />
                Alumnos
              </TabsTrigger>
              <TabsTrigger value="maestro" className="flex-1 min-w-[100px] data-[state=active]:bg-md-accent data-[state=active]:text-md-heading text-md-body py-2 gap-2">
                <GraduationCap className="h-4 w-4" />
                Profesores
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 min-w-[100px] data-[state=active]:bg-md-accent data-[state=active]:text-md-heading text-md-body py-2 gap-2">
                <ShieldCheck className="h-4 w-4" />
                Admins
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <UserTable role="all" />
            </TabsContent>
            <TabsContent value="cocina" className="mt-0">
              <UserTable role="cocina" />
            </TabsContent>
            <TabsContent value="alumno-cocina" className="mt-0">
              <UserTable role="alumno-cocina" />
            </TabsContent>
            <TabsContent value="maestro" className="mt-0">
              <UserTable role="maestro" />
            </TabsContent>
            <TabsContent value="admin" className="mt-0">
              <UserTable role="admin" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

