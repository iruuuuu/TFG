"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import KitchenDashboard from "./pages/KitchenDashboard"
import UserDashboard from "./pages/UserDashboard"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      <Route
        path="/"
        element={
          user ? (
            user.roles.includes("ROLE_ADMIN") ? (
              <AdminDashboard />
            ) : user.roles.includes("ROLE_KITCHEN") ? (
              <KitchenDashboard />
            ) : (
              <UserDashboard />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App

