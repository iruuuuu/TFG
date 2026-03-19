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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--gm-page-bg)] to-[var(--gm-accent-light)]/30 p-4">
      <Card className="w-full max-w-md border-[var(--gm-accent)] bg-[var(--gm-surface)] shadow-lg shadow-[var(--gm-accent)]/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gm-accent)]">
            <ChefHat className="h-8 w-8 text-[var(--gm-heading)]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[var(--gm-heading)]">GuMip - IES Mendoza</CardTitle>
          <CardDescription className="text-[var(--gm-body)]">Sistema de Gestión de Cocina Escolar</CardDescription>
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[var(--gm-accent)] bg-[var(--gm-surface)] text-[var(--gm-heading)] focus:border-[var(--gm-accent)] focus:ring-[var(--gm-accent)]"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-[var(--gm-coral)]/30 bg-[var(--gm-coral-bg)] text-[var(--gm-coral)]">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-[var(--gm-accent)] text-[var(--gm-heading)] font-semibold hover:bg-[var(--gm-accent-hover)] shadow-sm" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg bg-[var(--gm-accent-light)]/50 border border-[var(--gm-accent)] p-4 text-sm">
            <p className="font-semibold text-[var(--gm-heading)]">Usuarios de demostración:</p>
            <div className="space-y-1 text-[var(--gm-body)]">
              <p><span className="text-[var(--gm-coral)] font-medium">Admin:</span> admin@iesmendoza.es / admin123</p>
              <p><span className="text-[var(--gm-coral)] font-medium">Cocina:</span> cocina@iesmendoza.es / cocina123</p>
              <p><span className="text-[var(--gm-coral)] font-medium">Alumno:</span> alumno@iesmendoza.es / alumno123</p>
              <p><span className="text-[var(--gm-coral)] font-medium">Maestro:</span> maestro@iesmendoza.es / maestro123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
