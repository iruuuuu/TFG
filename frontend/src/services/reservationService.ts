import { api } from "./api"

export interface Reservation {
  id: number
  user: {
    id: number
    name: string
  }
  dish: {
    id: number
    name: string
  }
  reservationDate: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
}

export const reservationService = {
  async getAll(): Promise<Reservation[]> {
    const response = await api.get("/reservations")
    return response.data
  },

  async create(data: {
    dishId: number
    reservationDate: string
    notes?: string
  }): Promise<Reservation> {
    const response = await api.post("/reservations", data)
    return response.data
  },

  async update(id: number, data: Partial<Reservation>): Promise<void> {
    await api.put(`/reservations/${id}`, data)
  },

  async cancel(id: number): Promise<void> {
    await api.delete(`/reservations/${id}`)
  },
}
