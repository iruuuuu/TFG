"use client"

import { useData } from "@/lib/data-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function TodoListTab() {
  const { reservations, menuItems, updateReservationKitchenStatus, clearCompletedReservations } = useData()

  // Mapped reservations to include item names
  const KanbanCards = reservations.map((res) => {
    return {
      id: res.id,
      userName: res.userName,
      time: new Date(res.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: res.menuItems.map((itemId) => menuItems.find((m) => m.id === itemId)?.name || "Plato desconocido"),
      status: res.kitchenStatus || "pending",
    }
  })

  const pending = KanbanCards.filter((c) => c.status === "pending")
  const preparing = KanbanCards.filter((c) => c.status === "preparing")
  const completed = KanbanCards.filter((c) => c.status === "completed")

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("reservationId", id)
  }

  const handleDrop = (e: React.DragEvent, targetStatus: "pending" | "preparing" | "completed") => {
    e.preventDefault()
    const id = e.dataTransfer.getData("reservationId")
    if (id) {
      updateReservationKitchenStatus(id, targetStatus)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const renderCard = (card: any) => (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => handleDragStart(e, card.id)}
      className="bg-background cursor-grab active:cursor-grabbing border rounded-lg p-4 shadow-sm flex flex-col gap-3 hover:border-[#F2EDA2] transition-colors"
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold text-sm text-[#5C5C5C]">{card.userName}</p>
        <span className="text-xs font-medium text-[#737373] bg-[#F2EDA2]/40 px-2 py-0.5 rounded">{card.time}</span>
      </div>
      <ul className="space-y-1.5">
        {card.items.map((item: string, idx: number) => (
          <li key={idx} className="text-xs text-[#737373]">
            • {item}
          </li>
        ))}
      </ul>
      {card.status !== "completed" ? (
        <button
          onClick={() => updateReservationKitchenStatus(card.id, "completed")}
          className="mt-2 text-xs font-medium w-full bg-[#FFFEF9] border border-[#F2EDA2] hover:bg-[#F2EDA2]/50 text-[#5C5C5C] py-2 rounded transition-colors"
        >
          Marcar como Completado
        </button>
      ) : (
        <Badge className="mt-2 bg-green-600 text-white w-fit mx-auto">Completado</Badge>
      )}
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px] items-start">
      {/* Pendientes Column */}
      <div
        className="flex flex-col bg-gray-50/50 rounded-xl p-4 border border-gray-100 min-h-[400px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "pending")}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-[#5C5C5C]">Pendientes</h3>
          <Badge variant="secondary">{pending.length}</Badge>
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {pending.map(renderCard)}
          {pending.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-8">No hay pedidos pendientes</p>
          )}
        </div>
      </div>

      {/* Preparando Column */}
      <div
        className="flex flex-col bg-blue-50/30 rounded-xl p-4 border border-blue-100/50 min-h-[400px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "preparing")}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-[#5C5C5C]">Preparando</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {preparing.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {preparing.map(renderCard)}
          {preparing.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-8">Arrastra aquí los pedidos en preparación</p>
          )}
        </div>
      </div>

      {/* Completados Column */}
      <div
        className="flex flex-col bg-green-50/30 rounded-xl p-4 border border-green-100/50 min-h-[400px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "completed")}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#5C5C5C]">Completados</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {completed.length}
            </Badge>
          </div>
          {completed.length > 0 && (
            <Button 
              onClick={clearCompletedReservations} 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-green-700 hover:bg-green-200/50 hover:text-green-800"
              title="Limpiar completados"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {completed.map(renderCard)}
          {completed.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-8">No hay pedidos completados</p>
          )}
        </div>
      </div>
    </div>
  )
}
