"use client"
import { useAuth } from "../contexts/AuthContext"

export default function KitchenDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[var(--gm-heading)]">Mendos Cocina</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Panel de Cocina</h2>
        <p className="text-gray-600">Gestión de reservas diarias, inventario y menús semanales.</p>
      </div>
    </div>
  )
}
