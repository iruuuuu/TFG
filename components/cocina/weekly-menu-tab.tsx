"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Plus } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useToast } from "@/hooks/use-toast"

const daysOfWeek = [
  { key: "Lunes", label: "Lunes" },
  { key: "Martes", label: "Martes" },
  { key: "Miércoles", label: "Miércoles" },
  { key: "Jueves", label: "Jueves" },
  { key: "Viernes", label: "Viernes" },
]

type Category = "entrante" | "principal" | "postre"

export function WeeklyMenuTab() {
  const { menuItems, weeklyMenu, updateWeeklyMenu } = useData()
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = useState<{ day: string; category: Category } | null>(null)

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category)
  }

  const getCurrentItem = (day: string, category: Category) => {
    const itemId = weeklyMenu[day]?.[category]
    return menuItems.find((item) => item.id === itemId)
  }

  const handleSelectItem = (day: string, category: Category, itemId: string) => {
    updateWeeklyMenu(day, category, itemId)
    setOpenDialog(null)
    toast({
      title: "Menú actualizado",
      description: `Se ha actualizado el ${category} del ${day}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menú Semanal</h2>
          <p className="text-muted-foreground">Planifica el menú de la semana</p>
        </div>
        <Button className="bg-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]">
          <Calendar className="mr-2 h-4 w-4" />
          Nueva Semana
        </Button>
      </div>

      <Tabs defaultValue="Lunes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {daysOfWeek.map((day) => (
            <TabsTrigger key={day.key} value={day.key}>
              {day.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {daysOfWeek.map((day) => (
          <TabsContent key={day.key} value={day.key} className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Menú del {day.label}</CardTitle>
                  <CardDescription>Platos programados para este día</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Entrantes</h3>
                    <Dialog
                      open={openDialog?.day === day.key && openDialog?.category === "entrante"}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenDialog({ day: day.key, category: "entrante" })
                        } else {
                          setOpenDialog(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" />
                          {getCurrentItem(day.key, "entrante") ? "Cambiar" : "Añadir"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Seleccionar Entrante para {day.label}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {getItemsByCategory("entrante").map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="w-full justify-start h-auto p-3 bg-transparent"
                              onClick={() => handleSelectItem(day.key, "entrante", item.id)}
                            >
                              <div className="text-left">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {getCurrentItem(day.key, "entrante") ? (
                      <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <div>
                          <p className="font-medium">{getCurrentItem(day.key, "entrante")?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getCurrentItem(day.key, "entrante")?.description}
                          </p>
                        </div>
                        {getCurrentItem(day.key, "entrante")?.allergens &&
                          getCurrentItem(day.key, "entrante")!.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {getCurrentItem(day.key, "entrante")!.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay entrante seleccionado</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Principales</h3>
                    <Dialog
                      open={openDialog?.day === day.key && openDialog?.category === "principal"}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenDialog({ day: day.key, category: "principal" })
                        } else {
                          setOpenDialog(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" />
                          {getCurrentItem(day.key, "principal") ? "Cambiar" : "Añadir"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Seleccionar Principal para {day.label}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {getItemsByCategory("principal").map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="w-full justify-start h-auto p-3 bg-transparent"
                              onClick={() => handleSelectItem(day.key, "principal", item.id)}
                            >
                              <div className="text-left">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {getCurrentItem(day.key, "principal") ? (
                      <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <div>
                          <p className="font-medium">{getCurrentItem(day.key, "principal")?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getCurrentItem(day.key, "principal")?.description}
                          </p>
                        </div>
                        {getCurrentItem(day.key, "principal")?.allergens &&
                          getCurrentItem(day.key, "principal")!.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {getCurrentItem(day.key, "principal")!.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay plato principal seleccionado
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Postres</h3>
                    <Dialog
                      open={openDialog?.day === day.key && openDialog?.category === "postre"}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenDialog({ day: day.key, category: "postre" })
                        } else {
                          setOpenDialog(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-3 w-3" />
                          {getCurrentItem(day.key, "postre") ? "Cambiar" : "Añadir"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Seleccionar Postre para {day.label}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {getItemsByCategory("postre").map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="w-full justify-start h-auto p-3 bg-transparent"
                              onClick={() => handleSelectItem(day.key, "postre", item.id)}
                            >
                              <div className="text-left">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {getCurrentItem(day.key, "postre") ? (
                      <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                        <div>
                          <p className="font-medium">{getCurrentItem(day.key, "postre")?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getCurrentItem(day.key, "postre")?.description}
                          </p>
                        </div>
                        {getCurrentItem(day.key, "postre")?.allergens &&
                          getCurrentItem(day.key, "postre")!.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {getCurrentItem(day.key, "postre")!.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay postre seleccionado</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
