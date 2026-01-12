import { api } from "./api"

export interface Dish {
  id: number
  name: string
  description: string
  category: "starter" | "main" | "dessert"
  allergens: string[]
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  price: number
  imageUrl?: string
}

export const dishService = {
  async getAll(): Promise<Dish[]> {
    const response = await api.get("/dishes")
    return response.data
  },

  async getById(id: number): Promise<Dish> {
    const response = await api.get(`/dishes/${id}`)
    return response.data
  },

  async create(data: Partial<Dish>): Promise<Dish> {
    const response = await api.post("/dishes", data)
    return response.data
  },

  async update(id: number, data: Partial<Dish>): Promise<Dish> {
    const response = await api.put(`/dishes/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/dishes/${id}`)
  },
}
