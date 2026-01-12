"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Pencil, Trash2 } from "lucide-react"

export function UsersTab() {
  const users = [
    {
      id: "1",
      name: "Administrador",
      email: "admin@iesmendoza.es",
      role: "admin" as const,
    },
    {
      id: "2",
      name: "Personal de Cocina",
      email: "cocina@iesmendoza.es",
      role: "cocina" as const,
    },
    {
      id: "3",
      name: "Profesor García",
      email: "maestro@iesmendoza.es",
      role: "maestro" as const,
    },
  ]

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-100 text-purple-700",
      cocina: "bg-blue-100 text-blue-700",
      maestro: "bg-green-100 text-green-700",
    }
    return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-700"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>Administra los usuarios del sistema</CardDescription>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Añadir Usuario
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadge(user.role)}>
                    <span className="capitalize">{user.role}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
