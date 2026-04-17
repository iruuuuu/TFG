import { useAuth } from "@/lib/auth-context"
import { LandingHero } from "@/components/landing/hero-inicio"
import { BarraNavegacion } from "@/components/barra-navegacion"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export function PaginaInicio() {
  const { usuario, cargando } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!cargando && usuario) {
      switch (usuario.rol) {
        case "admin":
          navigate("/admin")
          break
        case "cocina":
        case "alumno-cocina":
        case "alumno-cocina-titular":
          navigate("/cocina")
          break
        case "maestro":
          navigate("/menu")
          break
      }
    }
  }, [usuario, cargando, navigate])

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-md-page-bg">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-md-accent border-r-transparent"></div>
          <p className="mt-4 text-md-body">Cargando Mendos...</p>
        </div>
      </div>
    )
  }

  let primaryHref = "/iniciarSesion"
  let primaryLabel = "Acceder al Panel"

  if (usuario) {
    primaryLabel = "Ir a mi Panel"
    switch (usuario.rol) {
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
    <div className="h-screen flex flex-col overflow-hidden bg-md-page-bg">
      {usuario && <BarraNavegacion />}
      <LandingHero primaryHref={primaryHref} primaryLabel={primaryLabel} />

      <footer className="bg-md-surface py-4 border-t border-md-accent/30 flex-shrink-0">
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
