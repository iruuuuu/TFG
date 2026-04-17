"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useDatos } from "@/lib/data-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, QrCode, ScanLine, XCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SearchReservationsTab() {
  const { reservas, reservasEventos, platosMenu, eventosGastro, actualizarEstadoCocinaReserva, marcarAsistenciaEvento } = useDatos()
  const { todosLosUsuarios } = useAuth()
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

    // Check if it's an email / maestro usuario
    const foundUser = todosLosUsuarios.find(u => u.email.toLowerCase() === term)
    if (foundUser) {
      setFoundUserId(String(foundUser.id))
      return
    }

    // Check if it's a shortCode
    const foundRes = reservas.find(r => r.codigoCorto?.toLowerCase() === term)
    if (foundRes) {
      setFoundShortCode(foundRes.codigoCorto!)
      setFoundUserId(String(foundRes.idUsuario))
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
      const cleanText = text.trim();
      setSearchTerm(cleanText)
      setIsScanning(false)
      
      const term = cleanText.toLowerCase();

      // Ensure we match the usuario correctly and store ID as string just in case
      const foundUser = todosLosUsuarios.find(u => u.email.toLowerCase() === term)
      if (foundUser) {
        setFoundUserId(String(foundUser.id))
        setFoundShortCode(null)
        toast({ title: "QR Escaneado", description: `Usuario: ${foundUser.nombre}` })
        return
      }

      // Allow QR to be a shortCode as well
      const foundRes = reservas.find(r => r.codigoCorto?.toLowerCase() === term)
      if (foundRes) {
        setFoundShortCode(foundRes.codigoCorto!)
        setFoundUserId(String(foundRes.idUsuario))
        toast({ title: "QR Escaneado", description: `Código de reserva: ${foundRes.codigoCorto}` })
        return
      }

      toast({ 
        title: "QR Inválido", 
        description: "El QR no corresponde a un maestro registrado", 
        variant: "destructive" 
      })
    }
  }

  // Filter reservas for the found usuario for TODAY
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const userReservations = foundUserId 
    ? reservas.filter(r => {
        return r.idUsuario === foundUserId && 
          (foundShortCode ? r.codigoCorto?.toLowerCase() === foundShortCode.toLowerCase() : true)
      })
    : []

  const userEvents = foundUserId
    ? reservasEventos.filter(er => {
        const e = eventosGastro.find(ge => ge.id === er.idEvento)
        if (!e) return false
        return er.idUsuario === foundUserId && er.estado === "confirmada"
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
              <p className="text-(--md-heading) font-semibold text-lg">Sin reservas encontradas</p>
              <p className="text-muted-foreground">Este usuario no tiene platos ni eventos en su registro actual.</p>
            </div>
          )}

          {hasResults && !isScanning && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-xl font-bold border-b pb-2">Resultados de la Búsqueda</h3>
              
              {userReservations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-(--md-coral) flex items-center gap-2">Platos Reservados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userReservations.map(res => {
                      const prepared = res.estadoCocina === "completada"
                      const actualUser = todosLosUsuarios.find(u => String(u.id) === String(res.idUsuario))
                      const displayName = actualUser?.nombre || res.nombreUsuario
                      return (
                        <Card key={res.id} className={prepared ? "bg-green-50/50 border-green-200" : ""}>
                          <CardHeader className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{displayName}</CardTitle>
                                <CardDescription>Fecha: {new Date(res.fecha).toLocaleDateString("es-ES")} <span className="ml-2">Código: <span className="font-mono bg-(--md-accent)/20 px-1 rounded">{res.codigoCorto || "N/A"}</span></span></CardDescription>
                              </div>
                              <Badge className={prepared ? "bg-green-600 hover:bg-green-700" : "bg-(--md-accent) text-(--md-body)"}>
                                {prepared ? "Preparada" : "Pendiente"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 pb-4">
                            <ul className="list-disc ml-5 space-y-1 text-sm mb-4">
                              {res.platosMenu.map((itemId, i) => {
                                const m = platosMenu.find(x => x.id === itemId)
                                return <li key={i}>{m ? m.nombre : "Desconocido"}</li>
                              })}
                            </ul>
                            {!prepared && (
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                size="sm"
                                onClick={() => {
                                  actualizarEstadoCocinaReserva(res.id, "completada")
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
                      const event = eventosGastro.find(ge => ge.id === er.idEvento)!
                      const checkedIn = er.asistio
                      const actualUser = todosLosUsuarios.find(u => String(u.id) === String(er.idUsuario))
                      const displayName = actualUser?.nombre || er.nombreUsuario
                      return (
                        <Card key={er.id} className={checkedIn ? "bg-blue-50/50 border-blue-200" : ""}>
                          <CardHeader className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{event.nombre}</CardTitle>
                                <CardDescription>{new Date(event.fecha).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</CardDescription>
                              </div>
                              <Badge className={checkedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"}>
                                {checkedIn ? "Presente" : "Sin llegar"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0 pb-4">
                            <p className="text-sm text-muted-foreground mb-4">A nombre de: {displayName}</p>
                            <Button 
                              variant={checkedIn ? "outline" : "default"}
                              className={checkedIn ? "w-full" : "w-full bg-blue-600 hover:bg-blue-700 text-white"} 
                              size="sm"
                              onClick={() => {
                                marcarAsistenciaEvento(er.id, !checkedIn)
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

