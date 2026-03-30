"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, AlertCircle, ChevronLeft, ChevronRight, ChefHat } from "lucide-react"
import { useData } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Link } from "react-router-dom"
import type { MenuItem } from "@/lib/types"

function getStaticInitialDays() {
  return [
    { key: "lunes", label: "Lunes", date: "" },
    { key: "martes", label: "Martes", date: "" },
    { key: "miercoles", label: "Miércoles", date: "" },
    { key: "jueves", label: "Jueves", date: "" },
    { key: "viernes", label: "Viernes", date: "" },
  ]
}

export function WeeklyMenuView() {
  const { toast } = useToast()
  const [selectedDay, setSelectedDay] = useState("lunes")
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [daysOfWeek, setDaysOfWeek] = useState(getStaticInitialDays())
  const [weekRange, setWeekRange] = useState("")

  useEffect(() => {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
    const monday = new Date(currentDate.setDate(diff))

    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
    const keys = ["lunes", "martes", "miercoles", "jueves", "viernes"]
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    const generatedDays = days.map((label, index) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + index)
      return {
        key: keys[index],
        label,
        date: `${d.getDate()} ${months[d.getMonth()]}`,
      }
    })
    
    setDaysOfWeek(generatedDays)
    
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    
    if (monday.getMonth() === friday.getMonth()) {
      setWeekRange(`${monday.getDate()} al ${friday.getDate()} de ${months[monday.getMonth()]}`)
    } else {
      setWeekRange(`${monday.getDate()} de ${months[monday.getMonth()]} al ${friday.getDate()} de ${months[friday.getMonth()]}`)
    }
  }, [])

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

  const { user } = useAuth()
  const { menuItems, weeklyMenu: globalWeeklyMenu, addReservation } = useData()

  const weeklyMenu = {
    lunes: {
      entrantes: menuItems.filter(item => globalWeeklyMenu.Lunes.entrante.includes(item.id)),
      principales: menuItems.filter(item => globalWeeklyMenu.Lunes.principal.includes(item.id)),
      postres: menuItems.filter(item => globalWeeklyMenu.Lunes.postre.includes(item.id)),
    },
    martes: {
      entrantes: menuItems.filter(item => globalWeeklyMenu.Martes.entrante.includes(item.id)),
      principales: menuItems.filter(item => globalWeeklyMenu.Martes.principal.includes(item.id)),
      postres: menuItems.filter(item => globalWeeklyMenu.Martes.postre.includes(item.id)),
    },
    miercoles: {
      entrantes: menuItems.filter(item => globalWeeklyMenu.Miércoles.entrante.includes(item.id)),
      principales: menuItems.filter(item => globalWeeklyMenu.Miércoles.principal.includes(item.id)),
      postres: menuItems.filter(item => globalWeeklyMenu.Miércoles.postre.includes(item.id)),
    },
    jueves: {
      entrantes: menuItems.filter(item => globalWeeklyMenu.Jueves.entrante.includes(item.id)),
      principales: menuItems.filter(item => globalWeeklyMenu.Jueves.principal.includes(item.id)),
      postres: menuItems.filter(item => globalWeeklyMenu.Jueves.postre.includes(item.id)),
    },
    viernes: {
      entrantes: menuItems.filter(item => globalWeeklyMenu.Viernes.entrante.includes(item.id)),
      principales: menuItems.filter(item => globalWeeklyMenu.Viernes.principal.includes(item.id)),
      postres: menuItems.filter(item => globalWeeklyMenu.Viernes.postre.includes(item.id)),
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

    const allSelectedItems = [
      ...(selectedItems[`${selectedDay}-entrantes`] || []),
      ...(selectedItems[`${selectedDay}-principales`] || []),
      ...(selectedItems[`${selectedDay}-postres`] || [])
    ]

    const today = new Date()
    const currentDayOfWeek = today.getDay() || 7
    const targetDayMap: Record<string, number> = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 }
    const targetDayNum = targetDayMap[selectedDay] || 1
    
    const reservationDate = new Date(today)
    reservationDate.setDate(today.getDate() - currentDayOfWeek + targetDayNum)

    addReservation({
      userId: user?.id || "",
      userName: user?.name || "Desconocido",
      date: reservationDate,
      menuItems: allSelectedItems,
      status: "pending",
      kitchenStatus: "pending",
      createdAt: new Date(),
    })

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
        className={`transition-all border-(--md-accent) bg-(--md-surface) ${
          selected ? "ring-2 ring-(--md-accent) bg-(--md-accent-light)/50" : ""
        } ${user ? "cursor-pointer hover:bg-(--md-accent-light)/30" : "opacity-80"}`}
        onClick={() => user && toggleItem(day, category, item.id)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-(--md-heading)">{item.name}</h4>
              {selected && <Badge className="bg-(--md-accent) text-(--md-heading) font-semibold">Seleccionado</Badge>}
            </div>
            <p className="text-sm text-(--md-body)">{item.description}</p>
            {item.authorName && (
              <div className="flex items-center gap-1.5 pt-1">
                <ChefHat className="h-3.5 w-3.5 text-(--md-coral)" />
                <span className="text-xs font-medium text-(--md-body)">Creado por: <span className="text-(--md-heading)">{item.authorName}</span></span>
              </div>
            )}
            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                <span className="text-xs text-(--md-coral) font-medium">Alérgenos:</span>
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-xs border-(--md-accent) text-(--md-body)">
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
      <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-(--md-heading)" />
            <CardTitle className="text-(--md-heading)">Semana del <span className="text-(--md-coral)">{weekRange || "..."}</span></CardTitle>
          </div>
          <CardDescription className="text-(--md-body)">Selecciona tus platos favoritos para cada día y haz tu reserva</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-4">
        <div className="relative flex items-center w-full">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollLeft}
            className="absolute left-1 z-10 h-8 w-8 bg-(--md-surface) border-(--md-accent) text-(--md-heading) shadow-sm hover:bg-(--md-accent)/50 md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <TabsList 
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto justify-start h-fit min-h-[56px] items-stretch bg-(--md-surface) border border-(--md-accent) p-1 gap-1 rounded-lg px-10 md:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {daysOfWeek.map((day) => (
              <TabsTrigger 
                key={day.key} 
                value={day.key} 
                className="flex-1 min-w-[110px] h-full flex flex-col gap-1 data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2 rounded-md whitespace-nowrap"
              >
                <span className="font-medium text-[15px] leading-none">{day.label}</span>
                <span className="text-xs">{day.date}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollRight}
            className="absolute right-1 z-10 h-8 w-8 bg-(--md-surface) border-(--md-accent) text-(--md-heading) shadow-sm hover:bg-(--md-accent)/50 md:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {daysOfWeek.map((day) => (
          <TabsContent key={day.key} value={day.key} className="space-y-6">
            <div className="space-y-6">
              {/* Entrantes Container */}
              <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm overflow-hidden">
                <CardHeader className="bg-(--md-accent)/10 pb-4 border-b border-(--md-accent)/30">
                  <h3 className="text-[1.1rem] font-semibold text-(--md-heading)"><span className="text-(--md-coral)">Entrantes</span></h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} category="entrantes" />
                    ))}
                  </div>
                  {(!weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes || weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes.length === 0) && (
                    <p className="text-(--md-body) text-sm italic py-2">No hay entrantes programados para este día.</p>
                  )}
                </CardContent>
              </Card>

              {/* Platos Principales Container */}
              <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm overflow-hidden">
                <CardHeader className="bg-(--md-accent)/10 pb-4 border-b border-(--md-accent)/30">
                  <h3 className="text-[1.1rem] font-semibold text-(--md-heading)">Platos <span className="text-(--md-coral)">Principales</span></h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} category="principales" />
                    ))}
                  </div>
                  {(!weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales || weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales.length === 0) && (
                    <p className="text-(--md-body) text-sm italic py-2">No hay platos principales programados para este día.</p>
                  )}
                </CardContent>
              </Card>

              {/* Postres Container */}
              <Card className="border-(--md-accent) bg-(--md-surface) shadow-sm overflow-hidden">
                <CardHeader className="bg-(--md-accent)/10 pb-4 border-b border-(--md-accent)/30">
                  <h3 className="text-[1.1rem] font-semibold text-(--md-heading)"><span className="text-(--md-coral)">Postres</span></h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} category="postres" />
                    ))}
                  </div>
                  {(!weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres || weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres.length === 0) && (
                    <p className="text-(--md-body) text-sm italic py-2">No hay postres programados para este día.</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)/50 bg-transparent"
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
                <Button 
                  onClick={makeReservation} 
                  disabled={!user}
                  className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm disabled:opacity-50 disabled:grayscale"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {user ? "Hacer Reserva" : "Inicia sesión para reservar"}
                </Button>
              </div>
              {!user && (
                <div className="bg-(--md-accent)/10 border border-(--md-accent) rounded-lg p-3 flex items-center gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-(--md-coral) shrink-0" />
                  <p className="text-sm text-(--md-heading)">
                    Estás viendo el menú como <span className="font-bold">invitado</span>. 
                    <Link to="/login" className="ml-1 underline font-bold hover:text-(--md-coral) transition-colors">Inicia sesión</Link> para poder seleccionar platos y realizar tu reserva.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

