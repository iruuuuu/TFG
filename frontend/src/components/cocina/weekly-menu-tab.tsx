"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { CreateDishDialog } from "./create-dish-dialog"

const daysOfWeek = [
  { key: "Lunes", label: "Lunes" },
  { key: "Martes", label: "Martes" },
  { key: "Miércoles", label: "Miércoles" },
  { key: "Jueves", label: "Jueves" },
  { key: "Viernes", label: "Viernes" },
]

type Category = "entrante" | "principal" | "postre"

export function WeeklyMenuTab() {
  const { menuItems, weeklyMenu, toggleWeeklyMenuItem, clearWeeklyMenu, logActivity } = useData()
  const { user } = useAuth()
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = useState<{ day: string; category: Category } | null>(null)
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" })
    }
  }

  const getItemsByCategory = (category: string) => {
    return menuItems.filter((item) => item.category === category)
  }

  const getCurrentItems = (day: string, category: Category) => {
    const itemIds = weeklyMenu[day]?.[category] || []
    return menuItems.filter((item) => itemIds.includes(item.id))
  }

  const isItemSelected = (day: string, category: Category, itemId: string) => {
    return weeklyMenu[day]?.[category]?.includes(itemId) || false
  }

  const handleSelectItem = (day: string, category: Category, itemId: string) => {
    toggleWeeklyMenuItem(day, category, itemId)
    toast({
      title: "Menú actualizado",
      description: `Se ha actualizado el ${category} del ${day}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--gm-heading)]">Menú Semanal</h2>
          <p className="text-[var(--gm-body)]">Planifica el menú de la semana y gestiona los platos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
            <>
              <CreateDishDialog />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-[var(--gm-accent)] text-[var(--gm-heading)] hover:bg-[var(--gm-accent)]/50 shadow-sm bg-[var(--gm-surface)]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Nueva Semana
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Comenzar nueva semana?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto eliminará todos los platos planificados para la semana actual **y limpiará el catálogo de platos disponibles**. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      clearWeeklyMenu()
                      if (user) {
                        logActivity("Vació el Menú Semanal", "Se reinició el menú completo", user.name, user.role)
                      }
                      toast({
                        title: "Semana reiniciada",
                        description: "El menú semanal ha sido limpiado con éxito.",
                      })
                    }} className="bg-[var(--gm-coral)] text-white hover:bg-[var(--gm-coral-hover)]">
                      Sí, vaciar menú
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="Lunes" className="space-y-4">
        <div className="relative flex items-center w-full">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollLeft}
            className="absolute left-1 z-10 h-8 w-8 bg-[var(--gm-surface)] border-[var(--gm-accent)] text-[var(--gm-heading)] shadow-sm hover:bg-[var(--gm-accent)]/50 md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <TabsList 
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto justify-start h-fit min-h-[48px] items-stretch bg-[var(--gm-surface)] border border-[var(--gm-accent)] p-1 gap-1 rounded-lg px-10 md:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {daysOfWeek.map((day) => (
              <TabsTrigger 
                key={day.key} 
                value={day.key}
                className="flex-1 min-w-[110px] h-full data-[state=active]:bg-[var(--gm-accent)] data-[state=active]:text-[var(--gm-heading)] text-[var(--gm-body)] hover:bg-[var(--gm-accent)]/50 hover:text-[var(--gm-heading)] transition-colors py-2 rounded-md font-medium whitespace-nowrap"
              >
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollRight}
            className="absolute right-1 z-10 h-8 w-8 bg-[var(--gm-surface)] border-[var(--gm-accent)] text-[var(--gm-heading)] shadow-sm hover:bg-[var(--gm-accent)]/50 md:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

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
                    {(user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
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
                            Gestionar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Seleccionar Entrante para {day.label}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getItemsByCategory("entrante").map((item) => {
                              const selected = isItemSelected(day.key, "entrante", item.id);
                              return (
                                <Button
                                  key={item.id}
                                  variant="outline"
                                  className={`w-full justify-start h-auto p-3 ${selected ? 'bg-[var(--gm-accent)]/50 ring-2 ring-[var(--gm-accent)]' : 'bg-transparent'}`}
                                  onClick={() => handleSelectItem(day.key, "entrante", item.id)}
                                >
                                  <div className="text-left w-full flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-[var(--gm-heading)]">{item.name}</p>
                                      <p className="text-xs text-[var(--gm-body)]">{item.description}</p>
                                    </div>
                                    {selected && <Badge className="bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent)]">Añadido</Badge>}
                                  </div>
                                </Button>
                              )
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="space-y-2">
                    {getCurrentItems(day.key, "entrante").length > 0 ? (
                      getCurrentItems(day.key, "entrante").map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {item.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay entrantes seleccionados</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Principales</h3>
                    {(user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
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
                            Gestionar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Seleccionar Principal para {day.label}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getItemsByCategory("principal").map((item) => {
                              const selected = isItemSelected(day.key, "principal", item.id);
                              return (
                                <Button
                                  key={item.id}
                                  variant="outline"
                                  className={`w-full justify-start h-auto p-3 ${selected ? 'bg-[var(--gm-accent)]/50 ring-2 ring-[var(--gm-accent)]' : 'bg-transparent'}`}
                                  onClick={() => handleSelectItem(day.key, "principal", item.id)}
                                >
                                  <div className="text-left w-full flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-[var(--gm-heading)]">{item.name}</p>
                                      <p className="text-xs text-[var(--gm-body)]">{item.description}</p>
                                    </div>
                                    {selected && <Badge className="bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent)]">Añadido</Badge>}
                                  </div>
                                </Button>
                              )
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="space-y-2">
                    {getCurrentItems(day.key, "principal").length > 0 ? (
                      getCurrentItems(day.key, "principal").map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {item.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay platos principales seleccionados
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Postres</h3>
                    {(user?.role === "cocina" || user?.role === "alumno-cocina-titular") && (
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
                            Gestionar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Seleccionar Postre para {day.label}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {getItemsByCategory("postre").map((item) => {
                              const selected = isItemSelected(day.key, "postre", item.id);
                              return (
                                <Button
                                  key={item.id}
                                  variant="outline"
                                  className={`w-full justify-start h-auto p-3 ${selected ? 'bg-[var(--gm-accent)]/50 ring-2 ring-[var(--gm-accent)]' : 'bg-transparent'}`}
                                  onClick={() => handleSelectItem(day.key, "postre", item.id)}
                                >
                                  <div className="text-left w-full flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-[var(--gm-heading)]">{item.name}</p>
                                      <p className="text-xs text-[var(--gm-body)]">{item.description}</p>
                                    </div>
                                    {selected && <Badge className="bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent)]">Añadido</Badge>}
                                  </div>
                                </Button>
                              )
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="space-y-2">
                    {getCurrentItems(day.key, "postre").length > 0 ? (
                      getCurrentItems(day.key, "postre").map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex gap-1">
                              {item.allergens.map((allergen) => (
                                <Badge key={allergen} variant="outline" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay postres seleccionados</p>
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
