export type UserRole = "admin" | "cocina" | "maestro" | "alumno-cocina" | "alumno-cocina-titular"

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
  category: "entrante" | "principal" | "postre"
  allergens: string[]
  imageUrl?: string
  authorId?: string
  authorName?: string
  available: boolean
}

export interface WeeklyMenu {
  [day: string]: {
    entrante: string[]
    principal: string[]
    postre: string[]
  }
}

export interface Reservation {
  id: string
  shortCode?: string
  userId: string
  userName: string
  date: Date
  menuItems: string[]
  status: "pending" | "confirmed" | "cancelled"
  kitchenStatus?: "pending" | "preparing" | "completed"
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
  attended?: boolean
}

export interface ActivityLog {
  id: string
  action: string
  details: string
  userName: string
  userRole: string
  timestamp: Date
}
