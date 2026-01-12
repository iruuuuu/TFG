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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">GuMip Admin</h1>
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
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "stats" ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Estadísticas
          </button>
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "dishes" ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Platos
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "reservations" ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reservas
          </button>
        </div>

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Platos</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalDishes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Reservas</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalReservations}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pendingReservations}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Confirmadas</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmedReservations}</p>
            </div>
          </div>
        )}

        {activeTab === "dishes" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
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
