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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFFDF7] to-[#F2EFC2]/30 p-4">
      <Card className="w-full max-w-md border-[#F2EDA2] bg-[#FFFEF9] shadow-lg shadow-[#F2EDA2]/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2EDA2]">
            <ChefHat className="h-8 w-8 text-[#5C5C5C]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#5C5C5C]">GuMip - IES Mendoza</CardTitle>
          <CardDescription className="text-[#737373]">Sistema de Gestión de Cocina Escolar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#5C5C5C]">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@iesmendoza.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#F2EDA2] bg-[#FFFEF9] text-[#5C5C5C] focus:border-[#F2EDA2] focus:ring-[#F2EDA2]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#5C5C5C]">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#F2EDA2] bg-[#FFFEF9] text-[#5C5C5C] focus:border-[#F2EDA2] focus:ring-[#F2EDA2]"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-[#F2594B]/30 bg-[#FFF5F4] text-[#F2594B]">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-[#F2EDA2] text-[#5C5C5C] font-semibold hover:bg-[#E8E398] shadow-sm" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg bg-[#F2EFC2]/50 border border-[#F2EDA2] p-4 text-sm">
            <p className="font-semibold text-[#5C5C5C]">Usuarios de demostración:</p>
            <div className="space-y-1 text-[#737373]">
              <p><span className="text-[#F2594B] font-medium">Admin:</span> admin@iesmendoza.es / admin123</p>
              <p><span className="text-[#F2594B] font-medium">Cocina:</span> cocina@iesmendoza.es / cocina123</p>
              <p><span className="text-[#F2594B] font-medium">Alumno:</span> alumno@iesmendoza.es / alumno123</p>
              <p><span className="text-[#F2594B] font-medium">Maestro:</span> maestro@iesmendoza.es / maestro123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
