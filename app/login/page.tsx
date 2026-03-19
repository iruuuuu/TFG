"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChefHat } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAF7F0] to-[#FDF1B6]/30 p-4">
      <Card className="w-full max-w-md border-[#FAD85D] bg-[#FFFFFF] shadow-lg shadow-[#FAD85D]/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAD85D]">
            <ChefHat className="h-8 w-8 text-[#4A3B32]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#4A3B32]">GuMip - IES Mendoza</CardTitle>
          <CardDescription className="text-[#877669]">Sistema de Gestión de Cocina Escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#4A3B32]">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@iesmendoza.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#FAD85D] bg-[#FFFFFF] text-[#4A3B32] focus:border-[#FAD85D] focus:ring-[#FAD85D]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#4A3B32]">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#FAD85D] bg-[#FFFFFF] text-[#4A3B32] focus:border-[#FAD85D] focus:ring-[#FAD85D]"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-[#E8654D]/30 bg-[#FDF0EC] text-[#E8654D]">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-[#FAD85D] text-[#4A3B32] font-semibold hover:bg-[#E8E398] shadow-sm" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg bg-[#FDF1B6]/50 border border-[#FAD85D] p-4 text-sm">
            <p className="font-semibold text-[#4A3B32]">Usuarios de demostración:</p>
            <div className="space-y-1 text-[#877669]">
              <p><span className="text-[#E8654D] font-medium">Admin:</span> admin@iesmendoza.es / admin123</p>
              <p><span className="text-[#E8654D] font-medium">Cocina:</span> cocina@iesmendoza.es / cocina123</p>
              <p><span className="text-[#E8654D] font-medium">Alumno:</span> alumno@iesmendoza.es / alumno123</p>
              <p><span className="text-[#E8654D] font-medium">Maestro:</span> maestro@iesmendoza.es / maestro123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
