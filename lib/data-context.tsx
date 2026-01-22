"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type {
  MenuItem,
  Reservation,
  InventoryItem,
  Rating,
  User,
  WeeklyMenu,
  GastroEvent,
  EventReservation,
} from "./types"
import { mockMenuItems, mockInventory, mockRatings } from "./mock-data"

interface DataContextType {
  // Menu Items
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void

  // Reservations
  reservations: Reservation[]
  addReservation: (reservation: Omit<Reservation, "id">) => void
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  cancelReservation: (id: string) => void

  // Inventory
  inventory: InventoryItem[]
  updateInventoryItem: (id: string, quantity: number) => void
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => void

  // Ratings
  ratings: Rating[]
  addRating: (rating: Omit<Rating, "id" | "date">) => void

  // Users
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void

  // Weekly Menu
  weeklyMenu: WeeklyMenu
  updateWeeklyMenu: (day: string, category: "entrante" | "principal" | "postre", itemId: string) => void

  // Gastro Events
  gastroEvents: GastroEvent[]
  addGastroEvent: (event: Omit<GastroEvent, "id" | "createdAt" | "currentAttendees">) => void
  updateGastroEvent: (id: string, updates: Partial<GastroEvent>) => void
  cancelGastroEvent: (id: string) => void

  // Event Reservations
  eventReservations: EventReservation[]
  reserveEventSpot: (eventId: string, userId: string, userName: string) => boolean
  cancelEventReservation: (eventId: string, userId: string) => void
  getEventAttendees: (eventId: string) => EventReservation[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Mock users
const initialUsers: User[] = [
  {
    id: "1",
    email: "admin@iesmendoza.es",
    name: "Administrador",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "cocina@iesmendoza.es",
    name: "Personal de Cocina",
    role: "cocina",
    createdAt: new Date(),
  },
  {
    id: "3",
    email: "maestro@iesmendoza.es",
    name: "Profesor García",
    role: "maestro",
    createdAt: new Date(),
  },
]

// Mock reservations
const initialReservations: Reservation[] = [
  {
    id: "1",
    userId: "3",
    userName: "Profesor García",
    date: new Date("2026-01-13"),
    menuItems: ["3", "1", "5"],
    status: "confirmed",
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "2",
    userId: "3",
    userName: "Profesor García",
    date: new Date("2026-01-14"),
    menuItems: ["4", "2", "6"],
    status: "pending",
    createdAt: new Date("2026-01-11"),
  },
]

// Initial weekly menu
const initialWeeklyMenu: WeeklyMenu = {
  Lunes: { entrante: "1", principal: "3", postre: "5" },
  Martes: { entrante: "2", principal: "4", postre: "6" },
  Miércoles: { entrante: "1", principal: "3", postre: "5" },
  Jueves: { entrante: "2", principal: "4", postre: "6" },
  Viernes: { entrante: "1", principal: "3", postre: "5" },
}

const initialGastroEvents: GastroEvent[] = [
  {
    id: "1",
    name: "Menú Degustación Mediterráneo",
    description: "Experiencia culinaria con lo mejor de la cocina mediterránea. Incluye 5 platos de autor.",
    date: new Date("2026-01-20T13:00:00"),
    maxCapacity: 20,
    currentAttendees: 12,
    dishes: [
      "Ensalada caprese con tomate de temporada",
      "Carpaccio de pulpo con aceite de ajo negro",
      "Risotto de setas con trufa",
      "Lubina al horno con verduras asadas",
      "Tiramisú artesanal",
    ],
    status: "active",
    createdBy: "cocina@iesmendoza.es",
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "2",
    name: "Cocina Asiática Fusión",
    description: "Viaje gastronómico por Asia con técnicas modernas.",
    date: new Date("2026-01-25T14:00:00"),
    maxCapacity: 15,
    currentAttendees: 15,
    dishes: [
      "Gyozas caseras al vapor",
      "Sushi roll especial de la casa",
      "Pad Thai con langostinos",
      "Pato laqueado con salsa hoisin",
      "Mochi de té verde",
    ],
    status: "full",
    createdBy: "cocina@iesmendoza.es",
    createdAt: new Date("2026-01-08"),
  },
]

const initialEventReservations: EventReservation[] = [
  {
    id: "1",
    eventId: "1",
    userId: "3",
    userName: "Profesor García",
    reservedAt: new Date("2026-01-12"),
    status: "confirmed",
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [ratings, setRatings] = useState<Rating[]>(mockRatings)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>(initialWeeklyMenu)
  const [gastroEvents, setGastroEvents] = useState<GastroEvent[]>(initialGastroEvents)
  const [eventReservations, setEventReservations] = useState<EventReservation[]>(initialEventReservations)

  // Menu Items
  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    }
    setMenuItems([...menuItems, newItem])
  }

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  // Reservations
  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now().toString(),
    }
    setReservations([...reservations, newReservation])
  }

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(reservations.map((res) => (res.id === id ? { ...res, ...updates } : res)))
  }

  const cancelReservation = (id: string) => {
    setReservations(reservations.map((res) => (res.id === id ? { ...res, status: "cancelled" as const } : res)))
  }

  // Inventory
  const updateInventoryItem = (id: string, quantity: number) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, quantity, lastUpdated: new Date() } : item)))
  }

  const addInventoryItem = (item: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    }
    setInventory([...inventory, newItem])
  }

  // Ratings
  const addRating = (rating: Omit<Rating, "id" | "date">) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      date: new Date(),
    }
    setRatings([...ratings, newRating])
  }

  // Users
  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setUsers([...users, newUser])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...updates } : user)))
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Weekly Menu
  const updateWeeklyMenu = (day: string, category: "entrante" | "principal" | "postre", itemId: string) => {
    setWeeklyMenu({
      ...weeklyMenu,
      [day]: {
        ...weeklyMenu[day],
        [category]: itemId,
      },
    })
  }

  const addGastroEvent = (event: Omit<GastroEvent, "id" | "createdAt" | "currentAttendees">) => {
    const newEvent: GastroEvent = {
      ...event,
      id: Date.now().toString(),
      currentAttendees: 0,
      createdAt: new Date(),
    }
    setGastroEvents([...gastroEvents, newEvent])
  }

  const updateGastroEvent = (id: string, updates: Partial<GastroEvent>) => {
    setGastroEvents(
      gastroEvents.map((event) =>
        event.id === id
          ? { ...event, ...updates, lastModified: new Date(), status: updates.status || "modified" }
          : event,
      ),
    )
  }

  const cancelGastroEvent = (id: string) => {
    setGastroEvents(
      gastroEvents.map((event) =>
        event.id === id ? { ...event, status: "cancelled" as const, lastModified: new Date() } : event,
      ),
    )
  }

  const reserveEventSpot = (eventId: string, userId: string, userName: string): boolean => {
    const event = gastroEvents.find((e) => e.id === eventId)

    if (!event) return false
    if (event.status !== "active") return false
    if (event.currentAttendees >= event.maxCapacity) return false

    // Check if user already has a reservation
    const existingReservation = eventReservations.find(
      (r) => r.eventId === eventId && r.userId === userId && r.status === "confirmed",
    )
    if (existingReservation) return false

    // Create reservation
    const newReservation: EventReservation = {
      id: Date.now().toString(),
      eventId,
      userId,
      userName,
      reservedAt: new Date(),
      status: "confirmed",
    }

    setEventReservations([...eventReservations, newReservation])

    // Update event capacity
    const newAttendees = event.currentAttendees + 1
    const newStatus = newAttendees >= event.maxCapacity ? "full" : "active"

    setGastroEvents(
      gastroEvents.map((e) =>
        e.id === eventId ? { ...e, currentAttendees: newAttendees, status: newStatus as any } : e,
      ),
    )

    return true
  }

  const cancelEventReservation = (eventId: string, userId: string) => {
    setEventReservations(
      eventReservations.map((res) =>
        res.eventId === eventId && res.userId === userId ? { ...res, status: "cancelled" as const } : res,
      ),
    )

    // Update event capacity
    setGastroEvents(
      gastroEvents.map((event) => {
        if (event.id === eventId) {
          const newAttendees = Math.max(0, event.currentAttendees - 1)
          return {
            ...event,
            currentAttendees: newAttendees,
            status: newAttendees < event.maxCapacity ? ("active" as const) : event.status,
          }
        }
        return event
      }),
    )
  }

  const getEventAttendees = (eventId: string): EventReservation[] => {
    return eventReservations.filter((r) => r.eventId === eventId && r.status === "confirmed")
  }

  return (
    <DataContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        reservations,
        addReservation,
        updateReservation,
        cancelReservation,
        inventory,
        updateInventoryItem,
        addInventoryItem,
        ratings,
        addRating,
        users,
        addUser,
        updateUser,
        deleteUser,
        weeklyMenu,
        updateWeeklyMenu,
        gastroEvents,
        addGastroEvent,
        updateGastroEvent,
        cancelGastroEvent,
        eventReservations,
        reserveEventSpot,
        cancelEventReservation,
        getEventAttendees,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
