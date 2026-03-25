"use client"
import { useAuth } from "../contexts/AuthContext"

export default function UserDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-md-page-bg">
      <nav className="bg-md-surface shadow-md border-b border-md-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-md-heading shadow-sm">Mendos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-md-body font-medium">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-md-accent text-md-heading hover:bg-md-accent-hover rounded-lg transition-colors font-semibold shadow-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-md-heading mb-6 drop-shadow-sm">Menú y Reservas</h2>
        <p className="text-md-body font-medium">Consulta el menú semanal y gestiona tus reservas.</p>
      </div>
    </div>
  )
}
