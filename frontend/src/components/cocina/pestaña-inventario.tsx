"use client"

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
import { useDatos } from "@/lib/data-context"
import type { ArticuloInventario } from "@/lib/types"

export function InventoryTab() {
  const { inventario, actualizarArticuloInventario } = useDatos()

  const updateQuantity = (id: string, change: number) => {
    const item = inventario.find(i => i.id === id)
    if (item) actualizarArticuloInventario(id, Math.max(0, item.cantidad + change))
  }


  const getStockStatus = (item: ArticuloInventario) => {
    if (item.cantidad <= item.stockMinimo) {
      return { label: "Bajo", color: "bg-(--md-coral)/10 text-(--md-coral)", icon: true }
    }
    if (item.cantidad <= item.stockMinimo * 1.5) {
      return { label: "Medio", color: "bg-(--md-accent) text-(--md-body)", icon: true }
    }
    return { label: "Óptimo", color: "bg-(--md-accent-light) text-(--md-body)", icon: false }
  }

  const lowStockItems = inventario.filter((item) => item.cantidad <= item.stockMinimo)

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-(--md-heading)" />
              <CardTitle className="text-(--md-heading)">Alertas de <span className="text-(--md-coral)">Stock</span></CardTitle>
            </div>
            <CardDescription className="text-(--md-body)">
              Hay <span className="text-(--md-coral) font-semibold">{lowStockItems.length}</span> producto(s) con stock bajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md bg-(--md-accent-light)/30 border border-(--md-accent) p-3">
                  <div>
                    <p className="font-medium text-(--md-heading)">{item.nombre}</p>
                    <p className="text-sm text-(--md-body)">
                      Stock actual: <span className="text-(--md-coral) font-medium">{item.cantidad} {item.unidad}</span> (Mínimo: {item.stockMinimo} {item.unidad})
                    </p>
                  </div>
                  <Badge className="bg-(--md-coral-bg) text-(--md-coral) font-semibold">Reponer</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-(--md-heading)"><span className="text-(--md-coral)">Inventario</span></h2>
          <p className="text-(--md-body)">Gestiona el stock de ingredientes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm">
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
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input id="categoria" placeholder="Ej: Verduras" />
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
                <Button type="submit" className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm">
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inventario.map((item) => {
          const estado = getStockStatus(item)
          return (
            <Card key={item.id} className="border-(--md-accent) bg-(--md-surface)">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-(--md-heading)">{item.nombre}</CardTitle>
                    <CardDescription className="text-(--md-body)">{item.categoria}</CardDescription>
                  </div>
                  <Badge className={estado.color}>
                    {estado.icon && <AlertCircle className="mr-1 h-3 w-3" />}
                    {estado.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-(--md-body)">Cantidad actual:</span>
                    <span className="font-semibold text-(--md-heading)">
                      {item.cantidad} {item.unidad}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-(--md-body)">Stock mínimo:</span>
                    <span className="text-(--md-heading)">
                      {item.stockMinimo} {item.unidad}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => {
                      const newQuantity = Number.parseInt(e.target.value) || 0
                      actualizarArticuloInventario(item.id, newQuantity)
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

