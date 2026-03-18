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
        className={`cursor-pointer transition-all border-[#F2EDA2] bg-[#FFFEF9] ${
          selected ? "ring-2 ring-[#F2EDA2] bg-[#F2EFC2]/50" : "hover:bg-[#F2EFC2]/30"
        }`}
        onClick={() => toggleItem(day, category, item.id)}
      >
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-[#5C5C5C]">{item.name}</h4>
              {selected && <Badge className="bg-[#F2EDA2] text-[#5C5C5C] font-semibold">Seleccionado</Badge>}
            </div>
            <p className="text-sm text-[#737373]">{item.description}</p>
            {item.authorName && (
              <div className="flex items-center gap-1.5 pt-1">
                <ChefHat className="h-3.5 w-3.5 text-[#F2594B]" />
                <span className="text-xs font-medium text-[#737373]">Creado por: <span className="text-[#5C5C5C]">{item.authorName}</span></span>
              </div>
            )}
            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                <span className="text-xs text-[#F2594B] font-medium">Alérgenos:</span>
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-xs border-[#F2EDA2] text-[#737373]">
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
      <Card className="border-[#F2EDA2] bg-[#FFFEF9] shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#5C5C5C]" />
            <CardTitle className="text-[#5C5C5C]">Semana del <span className="text-[#F2594B]">{weekRange || "..."}</span></CardTitle>
          </div>
          <CardDescription className="text-[#737373]">Selecciona tus platos favoritos para cada día y haz tu reserva</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedDay} onValueChange={setSelectedDay} className="space-y-4">
        <div className="relative flex items-center w-full">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollLeft}
            className="absolute left-1 z-10 h-8 w-8 bg-[#FFFEF9] border-[#F2EDA2] text-[#5C5C5C] shadow-sm hover:bg-[#F2EDA2]/50 md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <TabsList 
            ref={scrollContainerRef}
            className="flex w-full overflow-x-auto justify-start h-fit min-h-[56px] items-stretch bg-[#FFFEF9] border border-[#F2EDA2] p-1 gap-1 rounded-lg px-10 md:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {daysOfWeek.map((day) => (
              <TabsTrigger 
                key={day.key} 
                value={day.key} 
                className="flex-1 min-w-[110px] h-full flex flex-col gap-1 data-[state=active]:bg-[#F2EDA2] data-[state=active]:text-[#5C5C5C] text-[#737373] hover:bg-[#F2EDA2]/50 hover:text-[#5C5C5C] transition-colors py-2 rounded-md whitespace-nowrap"
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
            className="absolute right-1 z-10 h-8 w-8 bg-[#FFFEF9] border-[#F2EDA2] text-[#5C5C5C] shadow-sm hover:bg-[#F2EDA2]/50 md:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {daysOfWeek.map((day) => (
          <TabsContent key={day.key} value={day.key} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#5C5C5C]"><span className="text-[#F2594B]">Entrantes</span></h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.entrantes.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="entrantes" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#5C5C5C]">Platos <span className="text-[#F2594B]">Principales</span></h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.principales.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="principales" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#5C5C5C]"><span className="text-[#F2594B]">Postres</span></h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyMenu[day.key as keyof typeof weeklyMenu]?.postres.map((item) => (
                    <MenuItemCard key={item.id} item={item} day={day.key} category="postres" />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  className="border-[#F2EDA2] text-[#737373] hover:bg-[#F2EFC2]/50 bg-transparent"
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
                <Button onClick={makeReservation} className="bg-[#F2EDA2] text-[#5C5C5C] font-semibold hover:bg-[#E8E398] shadow-sm">
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
