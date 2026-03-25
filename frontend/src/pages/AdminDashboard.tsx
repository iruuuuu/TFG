"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { dishService, type Dish } from "../services/dishService"
import { reservationService, type Reservation } from "../services/reservationService"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [dishes, setDishes] = useState<Dish[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [activeTab, setActiveTab] = useState<"stats" | "dishes" | "reservations">("stats")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [dishesData, reservationsData] = await Promise.all([dishService.getAll(), reservationService.getAll()])
      setDishes(dishesData)
      setReservations(reservationsData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const stats = {
    totalDishes: dishes.length,
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((r) => r.status === "pending").length,
    confirmedReservations: reservations.filter((r) => r.status === "confirmed").length,
  }

  return (
    <div className="min-h-screen bg-md-page-bg">
      <nav className="bg-md-surface shadow-md border-b border-md-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[var(--gm-heading)]">Mendos Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-md-body font-medium">{user?.name}</span>
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
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "stats" ? "bg-md-accent text-md-heading shadow-sm" : "bg-md-surface text-md-body hover:bg-md-accent/30 border border-md-accent/20"
            }`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "dishes" ? "bg-md-accent text-md-heading shadow-sm" : "bg-md-surface text-md-body hover:bg-md-accent/30 border border-md-accent/20"
            }`}
          >
            Platos
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "reservations" ? "bg-md-accent text-md-heading shadow-sm" : "bg-md-surface text-md-body hover:bg-md-accent/30 border border-md-accent/20"
            }`}
          >
            Reservas
          </button>
        </div>

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-md-surface p-6 rounded-lg shadow-sm border border-md-accent/30">
              <h3 className="text-sm font-medium text-md-body">Total Platos</h3>
              <p className="text-3xl font-bold text-md-coral mt-2">{stats.totalDishes}</p>
            </div>
            <div className="bg-md-surface p-6 rounded-lg shadow-sm border border-md-accent/30">
              <h3 className="text-sm font-medium text-md-body">Total Reservas</h3>
              <p className="text-3xl font-bold text-md-coral mt-2">{stats.totalReservations}</p>
            </div>
            <div className="bg-md-surface p-6 rounded-lg shadow-sm border border-md-accent/30">
              <h3 className="text-sm font-medium text-md-body">Pendientes</h3>
              <p className="text-3xl font-bold text-md-heading mt-2">{stats.pendingReservations}</p>
            </div>
            <div className="bg-md-surface p-6 rounded-lg shadow-sm border border-md-accent/30">
              <h3 className="text-sm font-medium text-md-body">Confirmadas</h3>
              <p className="text-3xl font-bold text-md-heading mt-2 opacity-80">{stats.confirmedReservations}</p>
            </div>
          </div>
        )}

        {activeTab === "dishes" && (
          <div className="bg-md-surface rounded-lg shadow-sm overflow-hidden border border-md-accent/30">
            <table className="min-w-full divide-y divide-md-accent/20">
              <thead className="bg-md-accent/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-md-surface divide-y divide-md-accent/10">
                {dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{dish.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                        {dish.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{dish.price.toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reservations" && (
          <div className="bg-md-surface rounded-lg shadow-sm overflow-hidden border border-md-accent/30">
            <table className="min-w-full divide-y divide-md-accent/20">
              <thead className="bg-md-accent/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Plato</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-md-heading uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-md-surface divide-y divide-md-accent/10">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.dish.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{reservation.reservationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          reservation.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
