"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { fetchApi } from "./api"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
  isLoading: boolean
  allUsers: (User & { password?: string })[]
  updateUser: (id: string, updates: Partial<User> & { password?: string }) => void
  addUser: (user: Omit<User, "id" | "createdAt"> & { password?: string }) => void
  deleteUser: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [usersList, setUsersList] = useState<(User & { password?: string })[]>([])

  // Load users from Flask on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch {}
    }

    fetchApi<any[]>('/auth/users')
      .then(data => {
        const mapped = data.map(u => ({
          id: u.id.toString(),
          email: u.email,
          name: u.name,
          role: Array.isArray(u.roles) ? u.roles[0] : 'alumno-cocina',
          createdAt: new Date(),
        }))
        setUsersList(mapped)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  // Auto-reset alumno-cocina-titular roles at 14:30 on weekdays
  useEffect(() => {
    const checkAndResetRoles = () => {
      const now = new Date()
      const lastResetStr = localStorage.getItem('lastRoleReset')
      const lastReset = lastResetStr ? parseInt(lastResetStr) : 0
      const target = new Date(now)
      target.setHours(14, 30, 0, 0)
      if (now.getTime() < target.getTime()) target.setDate(target.getDate() - 1)
      while (target.getDay() === 0 || target.getDay() === 6) target.setDate(target.getDate() - 1)

      if (lastReset < target.getTime()) {
        setUsersList(prev => {
          const updated = prev.map(u =>
            u.role === "alumno-cocina-titular" ? { ...u, role: "alumno-cocina" as const } : u
          )
          setUser(prevUser => {
            if (prevUser?.role === "alumno-cocina-titular") {
              const updatedUser = { ...prevUser, role: "alumno-cocina" as const }
              localStorage.setItem("user", JSON.stringify(updatedUser))
              return updatedUser
            }
            return prevUser
          })
          return updated
        })
        localStorage.setItem('lastRoleReset', now.getTime().toString())
      }
    }
    checkAndResetRoles()
    const interval = setInterval(checkAndResetRoles, 60000)
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetchApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      const u = res.user
      const loggedIn: User = {
        id: u.id.toString(),
        email: u.email,
        name: u.name,
        role: Array.isArray(u.roles) ? u.roles[0] : 'alumno-cocina',
        createdAt: new Date(),
      }
      setUser(loggedIn)
      localStorage.setItem("user", JSON.stringify(loggedIn))
      return loggedIn
    } catch {
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = async (id: string, updates: Partial<User> & { password?: string }) => {
    try {
      const body: any = {}
      if (updates.name) body.name = updates.name
      if (updates.email) body.email = updates.email
      if (updates.password) body.password = updates.password
      if (updates.role) body.roles = [updates.role]
      await fetchApi(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
      if (user && user.id === id) {
        const updated = { ...user, ...updates }
        setUser(updated as User)
        localStorage.setItem("user", JSON.stringify(updated))
      }
    } catch (e) { console.error(e) }
  }

  const addUser = async (newUser: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    try {
      const res = await fetchApi<any>('/auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email: newUser.email,
          name: newUser.name,
          password: newUser.password || '123456',
          roles: [newUser.role]
        })
      })
      const created: User = {
        id: res.id.toString(),
        email: res.email,
        name: res.name,
        role: Array.isArray(res.roles) ? res.roles[0] : 'alumno-cocina',
        createdAt: new Date(),
      }
      setUsersList(prev => [...prev, created])
    } catch (e) { console.error(e) }
  }

  const deleteUser = async (id: string) => {
    try {
      await fetchApi(`/auth/users/${id}`, { method: 'DELETE' })
      setUsersList(prev => prev.filter(u => u.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <AuthContext.Provider value={{
      user, login, logout, isLoading,
      allUsers: usersList,
      updateUser, addUser, deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

