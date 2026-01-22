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
    [day: string]: {
      entrante: string
      principal: string
      postre: string
    }
  }
}

export interface Reservation {
  id: string
  userId: string
  userName: string
  date: Date
  menuItems: string[]
  status: "pending" | "confirmed" | "cancelled"
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

export interface GastroEvent {
  id: string
  name: string
  description: string
  date: Date
  maxCapacity: number
  currentAttendees: number
  dishes: string[] // Array of dish descriptions
  status: "active" | "modified" | "cancelled" | "full"
  createdBy: string
  createdAt: Date
  lastModified?: Date
}

export interface EventReservation {
  id: string
  eventId: string
  userId: string
  userName: string
  reservedAt: Date
  status: "confirmed" | "cancelled"
}
