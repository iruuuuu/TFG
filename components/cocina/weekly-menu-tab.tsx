"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus } from "lucide-react"
import { mockMenuItems } from "@/lib/mock-data"

const daysOfWeek = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
]

export function WeeklyMenuTab() {
  const [weeklyMenu] = useState({
    lunes: {
      entrantes: [mockMenuItems[0]],
      principales: [mockMenuItems[2]],
      postres: [mockMenuItems[4]],
    },
    martes: {
      entrantes: [mockMenuItems[1]],
      principales: [mockMenuItems[3]],
      postres: [mockMenuItems[5]],
    },
    miercoles: {
      entrantes: [mockMenuItems[0]],
      principales: [mockMenuItems[2]],
      postres: [mockMenuItems[4]],
    },
    jueves: {
      entrantes: [mockMenuItems[1]],
      principales: [mockMenuItems[3]],
      postres: [mockMenuItems[5]],
    },
    viernes: {
      entrantes: [mockMenuItems[0]],
      principales: [mockMenuItems[2]],
      postres: [mockMenuItems[4]],
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menú Semanal</h2>
          <p className="text-muted-foreground">Planifica el menú de la semana</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Calendar className="mr-2 h-4 w-4" />
          Nueva Semana
        </Button>
      </div>

      <Tabs defaultValue="lunes" className="space-y-4">
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
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        {item.allergens.length > 0 && (
                          <div className="flex gap-1">
                            {item.allergens.map((allergen) => (
                              <Badge key={allergen} variant="outline" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Principales</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        {item.allergens.length > 0 && (
                          <div className="flex gap-1">
                            {item.allergens.map((allergen) => (
                              <Badge key={allergen} variant="outline" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Postres</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      Añadir
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        {item.allergens.length > 0 && (
                          <div className="flex gap-1">
                            {item.allergens.map((allergen) => (
                              <Badge key={allergen} variant="outline" className="text-xs">
                                {allergen}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
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
