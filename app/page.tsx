"use client"

import { useAuth } from "@/lib/auth-context"
import { LandingHero } from "@/components/landing/landing-hero"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      switch (user.role) {
        case "admin":
          router.push("/admin")
          break
        case "cocina":
        case "alumno-cocina":
        case "alumno-cocina-titular":
          router.push("/cocina")
          break
        case "maestro":
          router.push("/menu")
          break
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-md-page-bg">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-md-accent border-r-transparent"></div>
          <p className="mt-4 text-md-body">Cargando Mendos...</p>
        </div>
      </div>
    )
  }

  let primaryHref = "/login"
  let primaryLabel = "Acceder al Panel"

  if (user) {
    primaryLabel = "Ir a mi Panel"
    switch (user.role) {
      case "admin":
        primaryHref = "/admin"
        break
      case "cocina":
      case "alumno-cocina":
      case "alumno-cocina-titular":
        primaryHref = "/cocina"
        break
      case "maestro":
        primaryHref = "/menu"
        break
    }
  }

  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <LandingHero primaryHref={primaryHref} primaryLabel={primaryLabel} />
      
      {/* Footer / Info Section */}
      <footer className="bg-md-surface py-12 border-t border-md-accent/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-md-body text-sm">
            © {new Date().getFullYear()} Mendos - IES Antonio de Mendoza (Alcalá la Real)
          </p>
          <p className="text-md-body/60 text-xs mt-2 italic">
            Desarrollado para la excelencia en la formación gastronómica
          </p>
        </div>
      </footer>
    </div>
  )
}
