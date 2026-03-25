"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, QrCode, ScanLine, XCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SearchReservationsTab() {
  const { reservations, eventReservations, menuItems, gastroEvents, users, updateReservationKitchenStatus, markEventAttendance } = useData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [foundUserId, setFoundUserId] = useState<string | null>(null)
  const [foundShortCode, setFoundShortCode] = useState<string | null>(null)

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return

    setIsScanning(false)
    setFoundUserId(null)
    setFoundShortCode(null)

    // Check if it's an email / maestro user
    const foundUser = users.find(u => u.email.toLowerCase() === term)
    if (foundUser) {
      setFoundUserId(foundUser.id)
      return
    }

    // Check if it's a shortCode
    const foundRes = reservations.find(r => r.shortCode?.toLowerCase() === term)
    if (foundRes) {
      setFoundShortCode(foundRes.shortCode!)
      setFoundUserId(foundRes.userId)
      return
    }

    toast({
      title: "No encontrado",
      description: "No se encontraron reservas con ese código o usuario.",
      variant: "destructive"
    })
  }

  const handleScan = (text: string) => {
    if (text) {
      setSearchTerm(text)
      setIsScanning(false)
      const foundUser = users.find(u => u.email.toLowerCase() === text.toLowerCase())
      if (foundUser) {
        setFoundUserId(foundUser.id)
        toast({ title: "QR Escaneado", description: `Usuario: ${foundUser.name}` })
      } else {
        toast({ title: "QR Inválido", description: "El QR no corresponde a un maestro registrado", variant: "destructive" })
      }
    }
  }

  // Filter reservations for the found user for TODAY
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const userReservations = foundUserId 
    ? reservations.filter(r => {
        const d = new Date(r.date)
        d.setHours(0, 0, 0, 0)
        return r.userId === foundUserId && d.getTime() === today.getTime() && 
          (foundShortCode ? r.shortCode?.toLowerCase() === foundShortCode.toLowerCase() : true)
      })
    : []

  const userEvents = foundUserId
    ? eventReservations.filter(er => {
        const e = gastroEvents.find(ge => ge.id === er.eventId)
        if (!e) return false
        const d = new Date(e.date)
        d.setHours(0, 0, 0, 0)
        return er.userId === foundUserId && d.getTime() === today.getTime() && er.status === "confirmed"
      })
    : []

  const hasResults = userReservations.length > 0 || userEvents.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-(--md-coral)" />
            Buscador de Entregas
          </CardTitle>
          <CardDescription>Busca por el código alfanumérico o escanea el QR del maestro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input 
                placeholder="Introducir código (ej. A1B2C3) o email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-(--md-accent) text-(--md-body) hover:bg-(--md-accent-light)">
                <Search className="h-4 w-4 mr-2" /> Buscar
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground mx-2 hidden md:inline">ó</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsScanning(!isScanning)}
              className={isScanning ? "border-(--md-coral) text-(--md-coral) bg-transparent" : "border-(--md-accent) text-(--md-body) hover:bg-(--md-accent)/20"}
            >
              {isScanning ? <XCircle className="h-4 w-4 mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
              {isScanning ? "Cancelar Escáner" : "Escanear QR"}
            </Button>
          </div>

          {isScanning && (
            <div className="w-full max-w-sm mx-auto aspect-square overflow-hidden rounded-lg border-2 border-(--md-accent) relative">
              <Scanner 
                onScan={(detectedCodes) => {
                  if (detectedCodes && detectedCodes.length > 0) {
                    handleScan(detectedCodes[0].rawValue);
                  }
                }}
              />
            </div>
          )}

          {foundUserId && !hasResults && !isScanning && (
            <div className="text-center py-8">
              <p className="text-(--md-heading) font-semibold text-lg">Sin reservas hoy</p>
              <p className="text-muted-foreground">Este usuario no tiene platos ni eventos reservados para el día de hoy.</p>
            </div>
          )}

          {hasResults && !isScanning && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-xl font-bold border-b pb-2">Resultados para hoy</h3>
              
              {userReservations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-(--md-coral) flex items-center gap-2">Platos Reservados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userReservations.map(res => {
                      const prepared = res.kitchenStatus === "completed"
                      return (
                        <Card key={res.id} className={prepared ? "bg-green-50/50 border-green-200" : ""}>
                          <CardHeader className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{res.userName}</CardTitle>
                                <CardDescription>Código: <span className="font-mono bg-(--md-accent)/20 px-1 rounded">{res.shortCode || "N/A"}</span></CardDescription>
                              </div>
                              <Badge className={prepared ? "bg-green-600 hover:bg-green-700" : "bg-(--md-accent) text-(--md-body)"}>
                                {prepared ? "Preparada" : "Pendiente"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 pb-4">
                            <ul className="list-disc ml-5 space-y-1 text-sm mb-4">
                              {res.menuItems.map((itemId, i) => {
                                const m = menuItems.find(x => x.id === itemId)
                                return <li key={i}>{m ? m.name : "Desconocido"}</li>
                              })}
                            </ul>
                            {!prepared && (
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                size="sm"
                                onClick={() => {
                                  updateReservationKitchenStatus(res.id, "completed")
                                  toast({ title: "Actualizado", description: "Reserva marcada como preparada" })
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" /> Marcar como Preparada
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {userEvents.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-(--md-coral) flex items-center gap-2">Eventos Gastronómicos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userEvents.map(er => {
                      const event = gastroEvents.find(ge => ge.id === er.eventId)!
                      const checkedIn = er.attended
                      return (
                        <Card key={er.id} className={checkedIn ? "bg-blue-50/50 border-blue-200" : ""}>
                          <CardHeader className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{event.name}</CardTitle>
                                <CardDescription>{new Date(event.date).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</CardDescription>
                              </div>
                              <Badge className={checkedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}>
                                {checkedIn ? "Presente" : "Sin llegar"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 pb-4">
                            <p className="text-sm text-muted-foreground mb-4">A nombre de: {er.userName}</p>
                            <Button 
                              variant={checkedIn ? "outline" : "default"}
                              className={checkedIn ? "w-full" : "w-full bg-blue-600 hover:bg-blue-700 text-white"} 
                              size="sm"
                              onClick={() => {
                                markEventAttendance(er.id, !checkedIn)
                                toast({ title: "Actualizado", description: checkedIn ? "Check-In cancelado" : "Check-In realizado correctamente" })
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" /> {checkedIn ? "Desmarcar Asistencia" : "Hacer Check-In"}
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

