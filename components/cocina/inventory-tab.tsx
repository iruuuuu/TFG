"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Plus, Minus, Package } from "lucide-react"
import { mockInventory } from "@/lib/mock-data"
import type { InventoryItem } from "@/lib/types"

export function InventoryTab() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)

  const updateQuantity = (id: string, change: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)),
    )
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) {
      return { label: "Bajo", color: "bg-red-100 text-red-700", icon: true }
    }
    if (item.quantity <= item.minStock * 1.5) {
      return { label: "Medio", color: "bg-yellow-100 text-yellow-700", icon: true }
    }
    return { label: "Óptimo", color: "bg-green-100 text-green-700", icon: false }
  }

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock)

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Alertas de Stock</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              Hay {lowStockItems.length} producto(s) con stock bajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md bg-white p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock actual: {item.quantity} {item.unit} (Mínimo: {item.minStock} {item.unit})
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">Reponer</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventario</h2>
          <p className="text-muted-foreground">Gestiona el stock de ingredientes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Package className="mr-2 h-4 w-4" />
              Añadir Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
              <DialogDescription>Registra un nuevo ingrediente en el inventario</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Nombre</Label>
                  <Input id="product-name" placeholder="Ej: Tomates" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input id="category" placeholder="Ej: Verduras" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Input id="unit" placeholder="kg, litros..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">Stock Mínimo</Label>
                  <Input id="min-stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((item) => {
          const status = getStockStatus(item)
          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <Badge className={status.color}>
                    {status.icon && <AlertCircle className="mr-1 h-3 w-3" />}
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cantidad actual:</span>
                    <span className="font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock mínimo:</span>
                    <span>
                      {item.minStock} {item.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = Number.parseInt(e.target.value) || 0
                      setInventory((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i)))
                    }}
                    className="h-8 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
