import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChefHat, Eye, EyeOff } from "lucide-react"

export function PaginaLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setIsLoading] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const usuario = await iniciarSesion(email, password)

    if (usuario) {
      if (usuario.rol === "admin") {
        navigate("/admin")
      } else if (usuario.rol === "cocina" || usuario.rol.startsWith("alumno-cocina")) {
        navigate("/cocina")
      } else if (usuario.rol === "maestro") {
        navigate("/menu")
      } else {
        navigate("/")
      }
    } else {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-[var(--gm-page-bg)] to-[var(--gm-accent-light)]/20">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--gm-accent)] border-r-transparent"></div>
          <p className="mt-4 text-[var(--gm-body)]">Cargando Mendos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-[var(--gm-page-bg)] to-[var(--gm-accent-light)]/20">
      <Card className="w-full max-w-md border-[var(--gm-accent)] bg-[var(--gm-surface)] shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-[var(--gm-accent)] flex items-center justify-center">
              <ChefHat className="h-10 w-10 text-[var(--gm-heading)]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[var(--gm-heading)] text-center">Mendos - IES Antonio de Mendoza</CardTitle>
          <CardDescription className="text-[var(--gm-body)] text-center">Sistema de Gestión de Cocina Escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--gm-heading)]">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@iesmendoza.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[var(--gm-accent)] bg-[var(--gm-surface)] text-[var(--gm-heading)] focus:border-[var(--gm-accent)] focus:ring-[var(--gm-accent)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[var(--gm-heading)]">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[var(--gm-accent)] bg-[var(--gm-surface)] text-[var(--gm-heading)] focus:border-[var(--gm-accent)] focus:ring-[var(--gm-accent)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--gm-body)] hover:text-[var(--gm-heading)] transition-colors"
                  tabIndex={-1}
                >
                  {mostrarPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-[var(--gm-coral)]/30 bg-[var(--gm-coral-bg)] text-[var(--gm-coral)]">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent-hover)] shadow-sm" disabled={cargando}>
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)} 
                className="w-full border-[var(--gm-accent)] text-[var(--gm-body)] hover:bg-[var(--gm-accent-light)]/50 hover:text-[var(--gm-heading)]"
                disabled={cargando}
              >
                Volver
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
