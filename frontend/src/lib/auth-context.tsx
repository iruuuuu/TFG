"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  allUsers: (User & { password?: string })[]
  updateUser: (id: string, updates: Partial<User> & { password?: string }) => void
  addUser: (user: Omit<User, "id" | "createdAt"> & { password?: string }) => void
  deleteUser: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
let mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@iesmendoza.es",
    password: "admin123",
    name: "Administrador",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "cocina@iesmendoza.es",
    password: "cocina123",
    name: "Personal de Cocina",
    role: "cocina",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "maestro@iesmendoza.es",
    password: "maestro123",
    name: "Profesor García",
    role: "maestro",
    createdAt: new Date(),
  },
  {
    id: "4",
    email: "alumno@iesmendoza.es",
    password: "alumno123",
    name: "Carlos Estudiante",
    role: "alumno-cocina",
    createdAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [usersList, setUsersList] = useState(mockUsers)

  useEffect(() => {
    // Check for stored mock users (to persist across reloads)
    const storedUsers = localStorage.getItem("mockUsers")
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers)
        setUsersList(parsed)
        mockUsers = parsed
      } catch (e) {}
    }

    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    
    // Automatically revert student roles at 14:30 on weekdays
    const checkAndResetRoles = () => {
      const now = new Date()
      const lastResetStr = localStorage.getItem('lastRoleReset')
      const lastReset = lastResetStr ? parseInt(lastResetStr) : 0
      
      const mostRecentTarget = new Date(now)
      mostRecentTarget.setHours(14, 30, 0, 0)
      
      if (now.getTime() < mostRecentTarget.getTime()) {
        mostRecentTarget.setDate(mostRecentTarget.getDate() - 1)
      }
      
      while (mostRecentTarget.getDay() === 0 || mostRecentTarget.getDay() === 6) {
        mostRecentTarget.setDate(mostRecentTarget.getDate() - 1)
      }
      
      if (lastReset < mostRecentTarget.getTime()) {
        setUsersList(prev => {
          let hasChanges = false
          const newUsers = prev.map(u => {
            if (u.role === "alumno-cocina-titular") {
              hasChanges = true
              return { ...u, role: "alumno-cocina" as const }
            }
            return u
          })
          
          if (hasChanges) {
            mockUsers = newUsers
            localStorage.setItem("mockUsers", JSON.stringify(newUsers))
            
            setUser(prevUser => {
              if (prevUser && prevUser.role === "alumno-cocina-titular") {
                const updated = { ...prevUser, role: "alumno-cocina" as const }
                localStorage.setItem("user", JSON.stringify(updated))
                return updated
              }
              return prevUser
            })
          }
          return newUsers
        })
        
        localStorage.setItem("lastRoleReset", now.getTime().toString())
      }
    }

    checkAndResetRoles()
    const interval = setInterval(checkAndResetRoles, 60000)
    
    setIsLoading(false)
    return () => clearInterval(interval)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = usersList.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (id: string, updates: Partial<User> & { password?: string }) => {
    const newUsers = usersList.map(u => u.id === id ? { ...u, ...updates } : u)
    setUsersList(newUsers)
    mockUsers = newUsers
    localStorage.setItem("mockUsers", JSON.stringify(newUsers))
    
    // If the currently logged in user is the one being updated, update their session
    if (user && user.id === id) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser as User)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const addUser = (newUser: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    const nextId = (Math.max(...usersList.map(u => parseInt(u.id) || 0)) + 1).toString()
    const newUsers = [
      ...usersList,
      {
        ...newUser,
        id: nextId,
        password: newUser.password || "123456",
        createdAt: new Date(),
      }
    ]
    setUsersList(newUsers)
    mockUsers = newUsers
    localStorage.setItem("mockUsers", JSON.stringify(newUsers))
  }

  const deleteUser = (id: string) => {
    const newUsers = usersList.filter(u => u.id !== id)
    setUsersList(newUsers)
    mockUsers = newUsers
    localStorage.setItem("mockUsers", JSON.stringify(newUsers))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      allUsers: usersList, 
      updateUser,
      addUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
