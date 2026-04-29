"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Calendar, AlertCircle, ChevronLeft, ChevronRight, ChefHat } from "lucide-react"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Link } from "react-router-dom"
import type { PlatoMenu } from "@/lib/types"

function getStaticInitialDays() {
  return [
    { key: "lunes", label: "Lunes", fecha: "" },
    { key: "martes", label: "Martes", fecha: "" },
    { key: "miercoles", label: "Miércoles", fecha: "" },
    { key: "jueves", label: "Jueves", fecha: "" },
    { key: "viernes", label: "Viernes", fecha: "" },
  ]
}

// Map day keys to their weekday index (Monday=1 ... Friday=5, matching getDay())
const DAY_INDEX_MAP: Record<string, number> = {
  lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5,
}

function getTodayDayKey(): string {
  const todayIndex = new Date().getDay() // 0=Sun, 1=Mon...5=Fri, 6=Sat
  const keys = ["lunes", "martes", "miercoles", "jueves", "viernes"]
  // If weekend (0 or 6) or outside range, no valid day — default to lunes
  if (todayIndex >= 1 && todayIndex <= 5) return keys[todayIndex - 1]
  return "lunes"
}

export function WeeklyMenuView() {
  const { toast } = useToast()
  const [selectedDay, setSelectedDay] = useState(getTodayDayKey)
  const [selectedItems, setSelectedItems] = useState<{ [day: string]: { [itemId: string]: number } }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [daysOfWeek, setDaysOfWeek] = useState(getStaticInitialDays())
  const [weekRange, setWeekRange] = useState("")

  // Determine which days are in the past (before today)
  const todayIndex = new Date().getDay() // 0=Sun, 1=Mon...6=Sat
  const isDayPast = (dayKey: string): boolean => {
    const dayNum = DAY_INDEX_MAP[dayKey]
    if (!dayNum) return false
    // If today is weekend (Sat=6 or Sun=0), all weekdays are past
    if (todayIndex === 0 || todayIndex === 6) return true
    return dayNum < todayIndex
  }

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
        fecha: `${d.getDate()} ${months[d.getMonth()]}`,
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

  const { usuario } = useAuth()
  const { platosMenu, menuSemanal: globalWeeklyMenu, añadirReserva } = useDatos()

  const menuSemanal = {
    lunes: {
      entrantes: platosMenu.filter(item => globalWeeklyMenu.Lunes.entrante.includes(item.id)),
      principales: platosMenu.filter(item => globalWeeklyMenu.Lunes.principal.includes(item.id)),
      postres: platosMenu.filter(item => globalWeeklyMenu.Lunes.postre.includes(item.id)),
    },
    martes: {
      entrantes: platosMenu.filter(item => globalWeeklyMenu.Martes.entrante.includes(item.id)),
      principales: platosMenu.filter(item => globalWeeklyMenu.Martes.principal.includes(item.id)),
      postres: platosMenu.filter(item => globalWeeklyMenu.Martes.postre.includes(item.id)),
    },
    miercoles: {
      entrantes: platosMenu.filter(item => globalWeeklyMenu.Miércoles.entrante.includes(item.id)),
      principales: platosMenu.filter(item => globalWeeklyMenu.Miércoles.principal.includes(item.id)),
      postres: platosMenu.filter(item => globalWeeklyMenu.Miércoles.postre.includes(item.id)),
    },
    jueves: {
      entrantes: platosMenu.filter(item => globalWeeklyMenu.Jueves.entrante.includes(item.id)),
      principales: platosMenu.filter(item => globalWeeklyMenu.Jueves.principal.includes(item.id)),
      postres: platosMenu.filter(item => globalWeeklyMenu.Jueves.postre.includes(item.id)),
    },
    viernes: {
      entrantes: platosMenu.filter(item => globalWeeklyMenu.Viernes.entrante.includes(item.id)),
      principales: platosMenu.filter(item => globalWeeklyMenu.Viernes.principal.includes(item.id)),
      postres: platosMenu.filter(item => globalWeeklyMenu.Viernes.postre.includes(item.id)),
    },
  }

  const updateQuantity = (day: string, itemId: string, delta: number) => {
    setSelectedItems((prev) => {
      const daySelections = prev[day] || {}
      const currentCount = daySelections[itemId] || 0
      
      const item = platosMenu.find(p => p.id === itemId)
      const maxStock = item?.stock || 0
      
      const newCount = Math.max(0, Math.min(currentCount + delta, maxStock))
      
      return {
        ...prev,
        [day]: {
          ...daySelections,
          [itemId]: newCount
        }
      }
    })
  }

  const getQuantity = (day: string, itemId: string) => {
    return selectedItems[day]?.[itemId] || 0
  }

  const makeReservation = () => {
    const daySelections = selectedItems[selectedDay] || {}
    const allSelectedItems: string[] = []
    
    Object.entries(daySelections).forEach(([itemId, count]) => {
      for (let i = 0; i < count; i++) {
        allSelectedItems.push(itemId)
      }
    })

    if (allSelectedItems.length === 0) {
      toast({
        title: "Selección vacía",
        description: "Por favor, selecciona al menos un plato para hacer la reserva.",
        variant: "destructive",
      })
      return
    }

    const today = new Date()
    const currentDayOfWeek = today.getDay() || 7
    const targetDayMap: Record<string, number> = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5 }
    const targetDayNum = targetDayMap[selectedDay] || 1
    
    const reservationDate = new Date(today)
    reservationDate.setDate(today.getDate() - currentDayOfWeek + targetDayNum)

    añadirReserva({
      idUsuario: usuario?.id || "",
      nombreUsuario: usuario?.nombre || "Desconocido",
      fecha: reservationDate,
      platosMenu: allSelectedItems,
      estado: "pendiente",
      estadoCocina: "pendiente",
      creadoEn: new Date(),
    })

    toast({
      title: "Reserva confirmada",
      description: `Tu reserva para el ${daysOfWeek.find((d) => d.key === selectedDay)?.label} ha sido registrada.`,
    })

    // Clear selections for this day
    setSelectedItems((prev) => {
      const newState = { ...prev }
      delete newState[selectedDay]
      return newState
    })
  }

  const MenuItemCard = ({
    item,
    day,
  }: {
    item: PlatoMenu
    day: string
  }) => {
    const quantity = getQuantity(day, item.id)

    return (
      <Card
        className={`transition-all border-(--md-accent) bg-(--md-surface) ${
          quantity > 0 ? "ring-2 ring-(--md-accent) bg-(--md-accent-light)/50" : ""
        } ${isDayPast(day) ? "opacity-50 cursor-not-allowed" : (usuario ? "hover:bg-(--md-accent-light)/30" : "opacity-80")}`}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="font-semibold text-(--md-heading) leading-tight">{item.nombre}</h4>
                {item.precio !== undefined && (
                  <p className="text-sm font-bold text-(--md-coral)">{item.precio.toFixed(2)} € / ud</p>
                )}
                <p className="text-xs font-medium text-(--md-body)">
                  Cantidad disponible: <span className={`font-bold ${item.stock - quantity > 0 ? "text-(--md-heading)" : "text-(--md-coral)"}`}>{item.stock - quantity}</span>
                </p>
              </div>
              
              {usuario && !isDayPast(day) && (
                <div className="flex items-center bg-(--md-surface) border border-(--md-accent) rounded-lg overflow-hidden shrink-0 shadow-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-(--md-accent)/20 rounded-none text-(--md-heading)"
                    onClick={() => updateQuantity(day, item.id, -1)}
                    disabled={quantity === 0}
                  >
                    -
                  </Button>
                  <div className="w-8 text-center text-sm font-bold text-(--md-heading)">
                    {quantity}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-(--md-accent)/20 rounded-none text-(--md-heading)"
                    onClick={() => updateQuantity(day, item.id, 1)}
                    disabled={quantity >= (item.stock || 0)}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
            
            <p className="text-sm text-(--md-body) line-clamp-2">{item.descripcion}</p>
            
            <div className="flex flex-col gap-2">
              {item.nombreAutor && (
                <div className="flex items-center gap-1.5">
                  <ChefHat className="h-3.5 w-3.5 text-(--md-coral)" />
                  <span className="text-xs font-medium text-(--md-body)">Por: <span className="text-(--md-heading)">{item.nombreAutor}</span></span>
                </div>
              )}
              
              {item.alergenos.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.alergenos.map((allergen) => (
                    <Badge key={allergen} variant="outline" className="text-[10px] h-4 border-(--md-accent) text-(--md-body) px-1.5">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
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

      <Tabs value={selectedDay} onValueChange={(val) => { if (!isDayPast(val)) setSelectedDay(val) }} className="space-y-4">
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
            {daysOfWeek.map((day) => {
              const past = isDayPast(day.key)
              const isToday = DAY_INDEX_MAP[day.key] === todayIndex
              return (
                <TabsTrigger 
                  key={day.key} 
                  value={day.key}
                  disabled={past}
                  className={`flex-1 min-w-[110px] h-full flex flex-col gap-1 data-[state=active]:bg-(--md-accent) data-[state=active]:text-(--md-heading) text-(--md-body) hover:bg-(--md-accent)/50 hover:text-(--md-heading) transition-colors py-2 rounded-md whitespace-nowrap ${
                    past ? "opacity-40 cursor-not-allowed line-through pointer-events-none" : ""
                  } ${isToday && !past ? "ring-2 ring-(--md-coral) ring-offset-1" : ""}`}
                >
                  <span className="font-medium text-[15px] leading-none">{day.label}</span>
                  <span className="text-xs">{day.fecha}</span>
                  {past && <span className="text-[10px] text-(--md-coral) font-semibold leading-none">Cerrado</span>}
                  {isToday && !past && <span className="text-[10px] text-(--md-coral) font-semibold leading-none">Hoy</span>}
                </TabsTrigger>
              )
            })}
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
                    {menuSemanal[day.key as keyof typeof menuSemanal]?.entrantes.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} />
                    ))}
                  </div>
                  {(!menuSemanal[day.key as keyof typeof menuSemanal]?.entrantes || menuSemanal[day.key as keyof typeof menuSemanal]?.entrantes.length === 0) && (
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
                    {menuSemanal[day.key as keyof typeof menuSemanal]?.principales.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} />
                    ))}
                  </div>
                  {(!menuSemanal[day.key as keyof typeof menuSemanal]?.principales || menuSemanal[day.key as keyof typeof menuSemanal]?.principales.length === 0) && (
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
                    {menuSemanal[day.key as keyof typeof menuSemanal]?.postres.map((item) => (
                      <MenuItemCard key={item.id} item={item} day={day.key} />
                    ))}
                  </div>
                  {(!menuSemanal[day.key as keyof typeof menuSemanal]?.postres || menuSemanal[day.key as keyof typeof menuSemanal]?.postres.length === 0) && (
                    <p className="text-(--md-body) text-sm italic py-2">No hay postres programados para este día.</p>
                  )}
                </CardContent>
              </Card>

              {isDayPast(day.key) && (
                <div className="bg-(--md-coral)/10 border border-(--md-coral)/30 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-(--md-coral) shrink-0" />
                  <p className="text-sm text-(--md-heading) font-medium">
                    Este día ya ha pasado. No es posible realizar reservas para fechas anteriores.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:flex sm:flex-row sm:justify-end gap-2 pt-4 items-center">
                {(() => {
                  const daySelections = selectedItems[day.key] || {}
                  const totalPrice = Object.entries(daySelections).reduce((sum, [id, count]) => {
                    const plato = platosMenu.find(p => p.id === id)
                    return sum + (plato?.precio || 0) * count
                  }, 0)
                  
                  return totalPrice > 0 ? (
                    <span className="text-(--md-heading) font-semibold mr-4 text-lg bg-(--md-accent-light)/50 px-4 py-2 rounded-lg border border-(--md-accent)">
                      Total: <span className="text-(--md-coral)">{totalPrice.toFixed(2)} €</span>
                    </span>
                  ) : null
                })()}
                <Button
                  variant="outline"
                  className="border-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)/50 bg-transparent"
                  disabled={isDayPast(day.key)}
                  onClick={() => {
                    setSelectedItems((prev) => {
                      const newState = { ...prev }
                      delete newState[day.key]
                      return newState
                    })
                  }}
                >
                  Limpiar Selección
                </Button>
                <Button 
                  onClick={makeReservation} 
                  disabled={!usuario || isDayPast(day.key)}
                  className="bg-(--md-accent) text-(--md-heading) font-semibold hover:bg-(--md-accent-hover) shadow-sm disabled:opacity-50 disabled:grayscale"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {isDayPast(day.key) ? "Día no disponible" : (usuario ? "Hacer Reserva" : "Inicia sesión para reservar")}
                </Button>
              </div>
              {!usuario && (
                <div className="bg-(--md-accent)/10 border border-(--md-accent) rounded-lg p-3 flex items-center gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-(--md-coral) shrink-0" />
                  <p className="text-sm text-(--md-heading)">
                    Estás viendo el menú como <span className="font-bold">invitado</span>. 
                    <Link to="/iniciarSesion" className="ml-1 underline font-bold hover:text-(--md-coral) transition-colors">Inicia sesión</Link> para poder seleccionar platos y realizar tu reserva.
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

