export type UserRole = "admin" | "cocina" | "maestro"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  category: "entrante" | "principal" | "postre" | "bebida"
  allergens: string[]
  imageUrl?: string
  available: boolean
}

export interface WeeklyMenu {
  id: string
  weekStart: Date
  weekEnd: Date
  days: {
    [key: string]: {
      entrantes: MenuItem[]
      principales: MenuItem[]
      postres: MenuItem[]
      bebidas: MenuItem[]
    }
  }
}

export interface Reservation {
  id: string
  userId: string
  userName: string
  date: Date
  menuItemIds: string[]
  status: "pendiente" | "confirmada" | "cancelada"
  createdAt: Date
}

export interface Rating {
  id: string
  userId: string
  userName: string
  menuItemId: string
  rating: number
  comment: string
  date: Date
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  minStock: number
  category: string
  lastUpdated: Date
}
