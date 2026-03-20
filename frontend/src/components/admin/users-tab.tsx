"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Pencil, Trash2, ShieldCheck, ChefHat, GraduationCap, Users, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
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
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Administrador Sistema",
      email: "admin@iesmendoza.es",
      role: "admin" as const,
    },
    {
      id: "2",
      name: "Juan Cocina",
      email: "juan.cocina@iesmendoza.es",
      role: "cocina" as const,
    },
    {
      id: "3",
      name: "Marta Cocina",
      email: "marta.cocina@iesmendoza.es",
      role: "cocina" as const,
    },
    {
      id: "4",
      name: "Profesor García",
      email: "garcia@iesmendoza.es",
      role: "maestro" as const,
    },
    {
      id: "5",
      name: "Profesora Martínez",
      email: "martinez@iesmendoza.es",
      role: "maestro" as const,
    },
    {
      id: "6",
      name: "Profesor López",
      email: "lopez@iesmendoza.es",
      role: "maestro" as const,
    },
    {
      id: "101",
      name: "Carlos Estudiante",
      email: "carlos.alum@iesmendoza.es",
      role: "alumno-cocina" as const,
    },
  ])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string; password?: string } | null>(null)

  const filteredUsers = (role: string | "all") => {
    if (role === "all") return users
    return users.filter((u) => u.role === role)
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-[var(--gm-coral)]/10 text-[var(--gm-coral)]",
      cocina: "bg-[var(--gm-accent)] text-[var(--gm-body)]",
      "alumno-cocina": "bg-[var(--gm-success-bg)] text-[#2E7D32]",
      maestro: "bg-[var(--gm-accent-light)] text-[var(--gm-body)]",
    }
    return variants[role as keyof typeof variants] || "bg-[var(--gm-muted-bg)] text-[var(--gm-body)]"
  }

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
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

    setUsers((prev) => 
      prev.map((u) => u.id === editingUser.id ? { ...u, ...editingUser, role: editingUser.role as any } : u)
    )
    
    setIsEditDialogOpen(false)
    setEditingUser(null)

    toast({
      title: "Usuario actualizado",
      description: `Los datos de ${editingUser.name} han sido guardados.`,
    })
  }

  const UserTable = ({ role }: { role: string | "all" }) => (
    <div className="rounded-md border border-[var(--gm-accent)]/50 overflow-x-auto">
      <Table className="min-w-[600px] sm:min-w-0">
        <TableHeader className="bg-[var(--gm-surface)]">
          <TableRow className="hover:bg-transparent border-[var(--gm-accent)]/50">
            <TableHead className="font-bold text-[var(--gm-heading)]">Nombre</TableHead>
            <TableHead className="font-bold text-[var(--gm-heading)]">Email</TableHead>
            <TableHead className="font-bold text-[var(--gm-heading)]">Rol</TableHead>
            <TableHead className="text-right font-bold text-[var(--gm-heading)]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers(role).map((user) => (
            <TableRow key={user.id} className="border-[var(--gm-accent)]/30 hover:bg-[var(--gm-accent-light)]/10 transition-colors">
              <TableCell className="font-medium text-[var(--gm-heading)]">{user.name}</TableCell>
              <TableCell className="text-[var(--gm-body)]">{user.email}</TableCell>
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
                        className="h-8 w-8 p-0 border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    {editingUser?.id === user.id && (
                      <DialogContent className="bg-[var(--gm-surface)] border-[var(--gm-accent)]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-[var(--gm-heading)]">Editar <span className="text-[var(--gm-coral)]">Usuario</span></DialogTitle>
                          <DialogDescription className="text-[var(--gm-body)]">
                            Modifica los datos del usuario seleccionado.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-[var(--gm-heading)]">Nombre Completo</Label>
                            <Input 
                              id="name" 
                              value={editingUser.name} 
                              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-[var(--gm-heading)]">Correo Electrónico</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={editingUser.email} 
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                              className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-[var(--gm-heading)]">Nueva Contraseña</Label>
                            <Input 
                              id="password" 
                              type="password"
                              placeholder="Dejar en blanco para mantener actual"
                              value={editingUser.password || ""} 
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              className="border-[var(--gm-accent)] focus-visible:ring-[var(--gm-coral)]/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role" className="text-[var(--gm-heading)]">Rol de Usuario</Label>
                            <Select 
                              value={editingUser.role} 
                              onValueChange={(val) => setEditingUser({ ...editingUser, role: val })}
                            >
                              <SelectTrigger className="border-[var(--gm-accent)] focus:ring-[var(--gm-coral)]/20">
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
                              className="border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50"
                            >
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
                          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-[var(--gm-body)]">
                          ¿Estás seguro de que deseas eliminar a <span className="font-bold text-[var(--gm-heading)]">{user.name}</span>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="bg-[var(--gm-coral)] text-white hover:bg-[var(--gm-coral-hover)]"
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
      <Card className="border-[var(--gm-accent)] bg-[var(--gm-surface)] shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl text-[var(--gm-heading)]">Gestión de <span className="text-[var(--gm-coral)]">Usuarios</span></CardTitle>
              <CardDescription className="text-[var(--gm-body)]">Administra y organiza los perfiles del centro</CardDescription>
            </div>
            <Button className="bg-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent-light)] gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="flex w-full overflow-x-auto bg-[var(--gm-surface)] border border-[var(--gm-accent)] p-1 gap-1 h-auto justify-start sm:justify-center">
              <TabsTrigger value="all" className="flex-1 min-w-[100px] data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] py-2 gap-2">
                <Users className="h-4 w-4" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="cocina" className="flex-1 min-w-[100px] data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] py-2 gap-2">
                <ChefHat className="h-4 w-4" />
                Cocina
              </TabsTrigger>
              <TabsTrigger value="alumno-cocina" className="flex-1 min-w-[100px] data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] py-2 gap-2">
                <Users className="h-4 w-4" />
                Alumnos
              </TabsTrigger>
              <TabsTrigger value="maestro" className="flex-1 min-w-[100px] data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] py-2 gap-2">
                <GraduationCap className="h-4 w-4" />
                Profesores
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 min-w-[100px] data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] py-2 gap-2">
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
