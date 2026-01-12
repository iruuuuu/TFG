"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, AlertCircle } from "lucide-react"
import { mockMenuItems } from "@/lib/mock-data"
import type { MenuItem } from "@/lib/types"

const daysOfWeek = [
  { key: "lunes", label: "Lunes", date: "15 Ene" },
  { key: "martes", label: "Martes", date: "16 Ene" },
  { key: "miercoles", label: "Miércoles", date: "17 Ene" },
  { key: "jueves", label: "Jueves", date: "18 Ene" },
  { key: "viernes", label: "Viernes", date: "19 Ene" },
]

export function WeeklyMenuView() {
  const { toast } = useToast()
  const [selectedDay, setSelectedDay] = useState("lunes")
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({})

  const weeklyMenu = {
    lunes: {
      entrantes: [mockMenuItems[0], mockMenuItems[1]],
      principales: [mockMenuItems[2], mockMenuItems[3]],
      postres: [mockMenuItems[4], mockMenuItems[5]],
    },
    martes: {
      entrantes: [mockMenuItems[1], mockMenuItems[0]],
      principales: [mockMenuItems[3], mockMenuItems[2]],
      postres: [mockMenuItems[5], mockMenuItems[4]],
    },
    miercoles: {
      entrantes: [mockMenuItems[0], mockMenuItems[1]],
      principales: [mockMenuItems[2], mockMenuItems[3]],
      postres: [mockMenuItems[4], mockMenuItems[5]],
    },
    jueves: {
      entrantes: [mockMenuItems[1], mockMenuItems[0]],
      principales: [mockMenuItems[3], mockMenuItems[2]],
      postres: [mockMenuItems[5], mockMenuItems[4]],
    },
    viernes: {
      entrantes: [mockMenuItems[0], mockMenuItems[1]],
      principales: [mockMenuItems[2], mockMenuItems[3]],
      postres: [mockMenuItems[4], mockMenuItems[5]],
    },
  }

  const toggleItem = (day: string, category: string, itemId: string) => {
    setSelectedItems((prev) => {
      const dayKey = `${day}-${category}`
      const current = prev[dayKey] || []
      if (current.includes(itemId)) {
        return { ...prev, [dayKey]: current.filter((id) => id !== itemId) }
      }
      return { ...prev, [dayKey]: [itemId] }
    })
  }

  const isSelected = (day: string, category: string, itemId: string) => {
    const dayKey = `${day}-${category}`
    return selectedItems[dayKey]?.includes(itemId) || false
  }

  const makeReservation = () => {
    const daySelections = selectedItems[`${selectedDay}-entrantes`]?.length || 0
    const mainSelections = selectedItems[`${selectedDay}-principales`]?.length || 0
    const dessertSelections = selectedItems[`${selectedDay}-postres`]?.length || 0

    if (daySelections === 0 && mainSelections === 0 && dessertSelections === 0) {
      toast({
        title: "Selección vacía",
        description: "Por favor, selecciona al menos un plato para hacer la reserva.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Reserva confirmada",
      description: `Tu reserva para el ${daysOfWeek.find((d) => d.key === selectedDay)?.label} ha sido registrada.`,
    })

    // Clear selections for this day
    setSelectedItems((prev) => {
      const newState = { ...prev }
      delete newState[`${selectedDay}-entrantes`]
      delete newState[`${selectedDay}-principales`]
      delete newState[`${selectedDay}-postres`]
      return newState
    })
  }

  const MenuItemCard = ({
    item,
    day,
    category,
  }: {
    item: MenuItem
    day: string
    category: string
  }) => {
    const selected = isSelected(day, category, item.id)

    return (
      <Card
        className={`cursor-pointer transition-all ${
          selected ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500" : "hover:border-orange-300"
        }`}
        onClick={() => toggleItem(day, category, item.id)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold">{item.name}</h4>
              {selected && <Badge className="bg-orange-600">Seleccionado</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-xs">
                    {allergen}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <CardTitle>Semana del 15 al 19 de Enero</CardTitle>
          </div>
          <CardDescription>Selecciona tus platos favoritos para cada día y haz tu reserva</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {daysOfWeek.map((day) => (
            <TabsTrigger key={day.key} value={day.key} className="flex flex-col gap-1">
              <span className="font-medium">{day.label}</span>
              <span className="text-xs text-muted-foreground">{day.date}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {daysOfWeek.map((day) => (
          <TabsContent key={day.key} value={day.key} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Entrantes</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="entrantes" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">Platos Principales</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="principales" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">Postres</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="postres" />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedItems((prev) => {
                      const newState = { ...prev }
                      delete newState[`${day.key}-entrantes`]
                      delete newState[`${day.key}-principales`]
                      delete newState[`${day.key}-postres`]
                      return newState
                    })
                  }}
                >
                  Limpiar Selección
                </Button>
                <Button onClick={makeReservation} className="bg-orange-600 hover:bg-orange-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Hacer Reserva
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
