"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type {
  MenuItem,
  Reservation,
  InventoryItem,
  Rating,
  User,
  WeeklyMenu,
  GastroEvent,
  EventReservation,
  ActivityLog,
} from "./types"
import { fetchApi } from "./api"

interface DataContextType {
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, "id">) => void
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  reservations: Reservation[]
  addReservation: (reservation: Omit<Reservation, "id" | "shortCode">) => void
  updateReservation: (id: string, updates: Partial<Reservation>) => void
  updateReservationKitchenStatus: (id: string, status: "pending" | "preparing" | "completed") => void
  cancelReservation: (id: string) => void
  clearCompletedReservations: () => void
  inventory: InventoryItem[]
  updateInventoryItem: (id: string, quantity: number) => void
  addInventoryItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => void
  ratings: Rating[]
  addRating: (rating: Omit<Rating, "id" | "date">) => void
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  weeklyMenu: WeeklyMenu
  toggleWeeklyMenuItem: (day: string, category: "entrante" | "principal" | "postre", itemId: string) => void
  clearWeeklyMenu: () => void
  gastroEvents: GastroEvent[]
  addGastroEvent: (event: Omit<GastroEvent, "id" | "createdAt" | "currentAttendees">) => void
  updateGastroEvent: (id: string, updates: Partial<GastroEvent>) => void
  cancelGastroEvent: (id: string) => void
  eventReservations: EventReservation[]
  reserveEventSpot: (eventId: string, userId: string, userName: string) => boolean
  cancelEventReservation: (eventId: string, userId: string) => void
  getEventAttendees: (eventId: string) => EventReservation[]
  markEventAttendance: (reservationId: string, attended: boolean) => void
  activityLogs: ActivityLog[]
  logActivity: (action: string, details: string, userName: string, userRole: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>({
    Lunes: { entrante: [], principal: [], postre: [] },
    Martes: { entrante: [], principal: [], postre: [] },
    Miércoles: { entrante: [], principal: [], postre: [] },
    Jueves: { entrante: [], principal: [], postre: [] },
    Viernes: { entrante: [], principal: [], postre: [] },
  })
  const [gastroEvents, setGastroEvents] = useState<GastroEvent[]>([])
  const [eventReservations, setEventReservations] = useState<EventReservation[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])

  useEffect(() => {
    const initData = async () => {
      try {
        const [dishesRes, resRes, invRes, ratRes, evtRes, logRes, usrRes] = await Promise.all([
          fetchApi<any[]>('/dishes').catch(() => []),
          fetchApi<any[]>('/reservations').catch(() => []),
          fetchApi<any[]>('/inventory').catch(() => []),
          fetchApi<any[]>('/ratings').catch(() => []),
          fetchApi<any[]>('/events').catch(() => []),
          fetchApi<any[]>('/logs').catch(() => []),
          fetchApi<any[]>('/auth/users').catch(() => [])
        ]);

        const mappedUsers = usrRes.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: Array.isArray(u.roles) ? u.roles[0].replace('ROLE_', '').toLowerCase() : 'user',
          createdAt: new Date()
        }));
        setUsers(mappedUsers);

        const newWeeklyMenu: WeeklyMenu = {
          Lunes: { entrante: [], principal: [], postre: [] },
          Martes: { entrante: [], principal: [], postre: [] },
          Miércoles: { entrante: [], principal: [], postre: [] },
          Jueves: { entrante: [], principal: [], postre: [] },
          Viernes: { entrante: [], principal: [], postre: [] },
        };

        const daysMap = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        const mappedDishes = dishesRes.map(d => {
          const dishId = d.id.toString();
          const backendCat = (d.categoria || d.category || "main").toLowerCase();
          const categoryMap: Record<string, "entrante" | "principal" | "postre"> = {
            "starter": "entrante",
            "main": "principal", 
            "dessert": "postre",
            "entrante": "entrante",
            "principal": "principal",
            "postre": "postre"
          };
          const category = categoryMap[backendCat] || "principal";
          
          let date = new Date();
          if (d.fecha_disponibilidad) {
             const parts = d.fecha_disponibilidad.split('-');
             date = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          }
          const dayName = daysMap[date.getDay()];
          
          if (newWeeklyMenu[dayName as keyof WeeklyMenu]) {
             if (!newWeeklyMenu[dayName as keyof WeeklyMenu][category]) {
                newWeeklyMenu[dayName as keyof WeeklyMenu][category] = [];
             }
             newWeeklyMenu[dayName as keyof WeeklyMenu][category].push(dishId);
          }

          return {
            id: dishId,
            name: d.nombre,
            description: d.descripcion || "",
            category: category,
            imageUrl: d.url_imagen || "/placeholder.jpg",
            allergens: d.alergenos || [],
            available: d.esta_activo
          }
        });

        setMenuItems(mappedDishes);
        setWeeklyMenu(newWeeklyMenu);

        const groupedRes = resRes.reduce((acc, curr) => {
          const key = `${curr.id_usuario}_${curr.fecha_reserva.split('T')[0]}`;
          if (!acc[key]) {
            acc[key] = {
              id: curr.id.toString(),
              userId: curr.id_usuario.toString(),
              userName: mappedUsers.find(u => u.id === curr.id_usuario.toString())?.name || "Usuario",
              date: new Date(curr.fecha_reserva),
              menuItems: [],
              status: curr.estado,
              kitchenStatus: curr.estado === 'completed' ? 'completed' : curr.estado === 'confirmed' ? 'preparing' : 'pending',
              createdAt: new Date(curr.creado_en),
              shortCode: curr.id.toString().padStart(6, '0')
            };
          }
          acc[key].menuItems.push(curr.id_plato.toString());
          return acc;
        }, {} as Record<string, Reservation>);
        setReservations(Object.values(groupedRes));

        setInventory(invRes.map(i => ({
          id: i.id.toString(),
          name: i.ingredient_name,
          quantity: i.quantity,
          unit: i.unit,
          minStock: i.minimum_stock,
          category: 'General',
          lastUpdated: new Date(i.created_at || new Date())
        })));

        setRatings(ratRes.map(r => ({
          id: r.id.toString(),
          userId: r.user_id?.toString() || "0",
          userName: "Usuario",
          menuItemId: r.dish_id?.toString() || "0",
          rating: r.rating,
          comment: r.comment || "",
          date: new Date(r.created_at || new Date())
        })));

        setGastroEvents(evtRes.map(e => ({
          id: e.id,
          name: e.name,
          description: e.description || "",
          date: new Date(e.date),
          maxCapacity: e.maxCapacity,
          currentAttendees: e.currentAttendees,
          dishes: e.dishes || [],
          status: e.status,
          createdBy: e.createdBy || "admin",
          createdAt: new Date(e.createdAt),
          lastModified: e.lastModified ? new Date(e.lastModified) : new Date(e.createdAt)
        })));

        setActivityLogs(logRes.map(l => ({
          id: l.id,
          action: l.action,
          details: l.details || "",
          userName: l.userName || "System",
          userRole: l.userRole || "User",
          timestamp: new Date(l.timestamp)
        })));

        // Event Reservations are fetched on demand or dynamically mapped here if needed.
        // For simplicity, we just won't load global eventReservations initially, or we fetch them when entering event view.

      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    initData();
  }, [])

  const logActivity = async (action: string, details: string, userName: string, userRole: string) => {
    try {
      const res = await fetchApi<any>('/logs', {
        method: 'POST',
        body: JSON.stringify({ action, details, userName, userRole })
      });
      const newLog: ActivityLog = { ...res, timestamp: new Date(res.timestamp) };
      setActivityLogs(prev => [newLog, ...prev]);
    } catch (e) { console.error(e) }
  }

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      const res = await fetchApi<any>('/dishes', {
        method: 'POST',
        body: JSON.stringify({
          nombre: item.name,
          descripcion: item.description,
          categoria: item.category,
          precio: 0,
          url_imagen: item.imageUrl,
          alergenos: item.allergens,
          informacion_nutricional: {},
        })
      });
      setMenuItems([...menuItems, { ...item, id: res.id.toString(), available: res.esta_activo }]);
    } catch (e) { console.error(e) }
  }

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      await fetchApi(`/dishes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: updates.name,
          descripcion: updates.description,
          categoria: updates.category,
          esta_activo: updates.available
        })
      });
      setMenuItems(menuItems.map(item => (item.id === id ? { ...item, ...updates } : item)));
    } catch (e) { console.error(e) }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      await fetchApi(`/dishes/${id}`, { method: 'DELETE' });
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (e) { console.error(e) }
  }

  const addReservation = async (reservation: Omit<Reservation, "id" | "shortCode">) => {
    try {
      const promises = reservation.menuItems.map(dishId => 
        fetchApi<any>('/reservations', {
          method: 'POST',
          body: JSON.stringify({
            id_usuario: reservation.userId,
            id_plato: dishId,
            fecha_reserva: reservation.date.toISOString(),
            cantidad: 1,
            estado: 'pending'
          })
        })
      );
      const results = await Promise.all(promises);
      if (results.length > 0) {
        setReservations([...reservations, { 
          ...reservation, 
          id: results[0].id.toString(), 
          shortCode: results[0].id.toString().padStart(6, '0') 
        }]);
      }
    } catch(e) { console.error(e) }
  }

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(reservations.map(res => (res.id === id ? { ...res, ...updates } : res)))
  }

  const updateReservationKitchenStatus = async (id: string, status: "pending" | "preparing" | "completed") => {
    try {
      const stateMapping = { "pending": "pending", "preparing": "confirmed", "completed": "completed" };
      await fetchApi(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: stateMapping[status] })
      });
      setReservations(reservations.map(res => {
        if (res.id === id) {
          return { ...res, kitchenStatus: status, status: status === "completed" ? "confirmed" : res.status }
        }
        return res
      }))
    } catch(e) { console.error(e) }
  }

  const cancelReservation = async (id: string) => {
    try {
      await fetchApi(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: 'cancelled' })
      });
      setReservations(reservations.map(res => (res.id === id ? { ...res, status: "cancelled" } : res)))
    } catch(e) { console.error(e) }
  }

  const clearCompletedReservations = () => {
    setReservations(prev => prev.filter(r => r.kitchenStatus !== "completed"))
  }

  const updateInventoryItem = async (id: string, quantity: number) => {
    try {
      await fetchApi(`/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      setInventory(inventory.map(item => (item.id === id ? { ...item, quantity, lastUpdated: new Date() } : item)))
    } catch(e) { console.error(e) }
  }

  const addInventoryItem = async (item: Omit<InventoryItem, "id" | "lastUpdated">) => {
    try {
      const res = await fetchApi<any>('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ingredient_name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          minimum_stock: item.minStock
        })
      });
      setInventory([...inventory, { ...item, id: res.id.toString(), lastUpdated: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const addRating = async (rating: Omit<Rating, "id" | "date">) => {
    try {
      const res = await fetchApi<any>('/ratings', {
        method: 'POST',
        body: JSON.stringify(rating)
      });
      setRatings([...ratings, { ...rating, id: res.id, date: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser = { ...user, id: Date.now().toString(), createdAt: new Date() }
    setUsers([...users, newUser])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(user => (user.id === id ? { ...user, ...updates } : user)))
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const toggleWeeklyMenuItem = (day: string, category: "entrante" | "principal" | "postre", itemId: string) => {
    setWeeklyMenu(prevMenu => {
      const curr = prevMenu[day]?.[category] || []
      const next = curr.includes(itemId) ? curr.filter(id => id !== itemId) : [...curr, itemId]
      return { ...prevMenu, [day]: { ...prevMenu[day], [category]: next } }
    })
  }

  const clearWeeklyMenu = () => {
    setWeeklyMenu({
      Lunes: { entrante: [], principal: [], postre: [] },
      Martes: { entrante: [], principal: [], postre: [] },
      Miércoles: { entrante: [], principal: [], postre: [] },
      Jueves: { entrante: [], principal: [], postre: [] },
      Viernes: { entrante: [], principal: [], postre: [] },
    })
  }

  const addGastroEvent = async (event: Omit<GastroEvent, "id" | "createdAt" | "currentAttendees">) => {
    try {
      const res = await fetchApi<any>('/events', {
        method: 'POST',
        body: JSON.stringify({ ...event, maxCapacity: event.maxCapacity })
      });
      setGastroEvents([...gastroEvents, { ...event, id: res.id, currentAttendees: 0, createdAt: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const updateGastroEvent = async (id: string, updates: Partial<GastroEvent>) => {
    try {
      await fetchApi(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setGastroEvents(gastroEvents.map(event =>
        event.id === id ? { ...event, ...updates, lastModified: new Date(), status: updates.status || "modified" } : event
      ))
    } catch(e) { console.error(e) }
  }

  const cancelGastroEvent = async (id: string) => {
    try {
      await fetchApi(`/events/${id}`, { method: 'DELETE' });
      setGastroEvents(gastroEvents.map(event =>
        event.id === id ? { ...event, status: "cancelled", lastModified: new Date() } : event
      ))
    } catch(e) { console.error(e) }
  }

  const reserveEventSpot = (eventId: string, userId: string, userName: string): boolean => {
    const event = gastroEvents.find((e) => e.id === eventId)
    if (!event || event.status !== "active" || event.currentAttendees >= event.maxCapacity) return false
    
    // Fire and forget API call for simplicity mapping 
    fetchApi(`/events/${eventId}/reservations`, {
      method: 'POST',
      body: JSON.stringify({ userId, userName })
    }).catch(console.error);

    setEventReservations([...eventReservations, {
      id: Date.now().toString(),
      eventId, userId, userName,
      reservedAt: new Date(),
      status: "confirmed",
      attended: false
    }]);

    setGastroEvents(gastroEvents.map(e =>
      e.id === eventId ? { ...e, currentAttendees: e.currentAttendees + 1, status: (e.currentAttendees + 1) >= e.maxCapacity ? "full" : "active" } : e
    ));

    return true
  }

  const cancelEventReservation = (eventId: string, userId: string) => {
    setEventReservations(eventReservations.map(res =>
      res.eventId === eventId && res.userId === userId ? { ...res, status: "cancelled" } : res
    ))
    setGastroEvents(gastroEvents.map(event => {
      if (event.id === eventId) {
        const newAttendees = Math.max(0, event.currentAttendees - 1)
        return { ...event, currentAttendees: newAttendees, status: newAttendees < event.maxCapacity ? "active" : event.status }
      }
      return event
    }))
  }

  const getEventAttendees = (eventId: string): EventReservation[] => {
    return eventReservations.filter((r) => r.eventId === eventId && r.status === "confirmed")
  }

  const markEventAttendance = async (reservationId: string, attended: boolean) => {
    try {
      await fetchApi(`/events/reservations/${reservationId}`, {
        method: 'PUT',
        body: JSON.stringify({ attended })
      });
      setEventReservations(prev => prev.map(res => 
        res.id === reservationId ? { ...res, attended } : res
      ))
    } catch(e) { console.error(e) }
  }

  return (
    <DataContext.Provider
      value={{
        menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
        reservations, addReservation, updateReservation, updateReservationKitchenStatus, cancelReservation, clearCompletedReservations,
        inventory, updateInventoryItem, addInventoryItem,
        ratings, addRating,
        users, addUser, updateUser, deleteUser,
        weeklyMenu, toggleWeeklyMenuItem, clearWeeklyMenu,
        gastroEvents, addGastroEvent, updateGastroEvent, cancelGastroEvent,
        eventReservations, reserveEventSpot, cancelEventReservation, getEventAttendees, markEventAttendance,
        activityLogs, logActivity
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error("useData must be used within a DataProvider")
  return context
}
