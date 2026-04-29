"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type {
  PlatoMenu,
  Reserva,
  ArticuloInventario,
  Valoracion,
  Usuario,
  MenuSemanal,
  EventoGastro,
  ReservaEvento,
  RegistroActividad,
} from "./types"
import { peticionApi } from "./api"

interface TipoContextoDatos {
  platosMenu: PlatoMenu[]
  añadirPlatoMenu: (item: Omit<PlatoMenu, "id">) => void
  actualizarPlatoMenu: (id: string, item: Partial<PlatoMenu>) => void
  eliminarPlatoMenu: (id: string) => void
  
  reservas: Reserva[]
  añadirReserva: (reserva: Omit<Reserva, "id" | "codigoCorto">) => void
  actualizarReserva: (id: string, actualizaciones: Partial<Reserva>) => void
  actualizarEstadoCocinaReserva: (id: string, estado: "pendiente" | "preparando" | "completada") => void
  cancelarReserva: (id: string) => void
  limpiarReservasCompletadas: () => void
  
  inventario: ArticuloInventario[]
  actualizarArticuloInventario: (id: string, cantidad: number) => void
  añadirArticuloInventario: (item: Omit<ArticuloInventario, "id" | "ultimaActualizacion">) => void
  
  valoraciones: Valoracion[]
  añadirValoracion: (valoracion: Omit<Valoracion, "id" | "fecha">) => void
  
  usuarios: Usuario[]
  añadirUsuario: (usuario: Omit<Usuario, "id" | "creadoEn">) => void
  actualizarUsuario: (id: string, actualizaciones: Partial<Usuario>) => void
  eliminarUsuario: (id: string) => void
  
  menuSemanal: MenuSemanal
  alternarPlatoMenuSemanal: (dia: string, categoria: "entrante" | "principal" | "postre", idItem: string) => void
  limpiarMenuSemanal: () => void
  
  eventosGastro: EventoGastro[]
  añadirEventoGastro: (evento: Omit<EventoGastro, "id" | "creadoEn" | "asistentesActuales">) => void
  actualizarEventoGastro: (id: string, actualizaciones: Partial<EventoGastro>) => void
  cancelarEventoGastro: (id: string) => void
  
  reservasEventos: ReservaEvento[]
  reservarPuestoEvento: (idEvento: string, idUsuario: string, nombreUsuario: string) => boolean
  cancelarReservaEvento: (idEvento: string, idUsuario: string) => void
  obtenerAsistentesEvento: (idEvento: string) => ReservaEvento[]
  marcarAsistenciaEvento: (idReserva: string, asistio: boolean) => void
  
  registrosActividad: RegistroActividad[]
  registrarActividad: (accion: string, detalles: string, nombreUsuario: string, rolUsuario: string) => void
}

const ContextoDatos = createContext<TipoContextoDatos | undefined>(undefined)

export function ProveedorDatos({ children }: { children: ReactNode }) {
  const [platosMenu, setPlatosMenu] = useState<PlatoMenu[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [inventario, setInventario] = useState<ArticuloInventario[]>([])
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [menuSemanal, setMenuSemanal] = useState<MenuSemanal>({
    Lunes: { entrante: [], principal: [], postre: [] },
    Martes: { entrante: [], principal: [], postre: [] },
    Miércoles: { entrante: [], principal: [], postre: [] },
    Jueves: { entrante: [], principal: [], postre: [] },
    Viernes: { entrante: [], principal: [], postre: [] },
  })
  const [eventosGastro, setEventosGastro] = useState<EventoGastro[]>([])
  const [reservasEventos, setReservasEventos] = useState<ReservaEvento[]>([])
  const [registrosActividad, setRegistrosActividad] = useState<RegistroActividad[]>([])

  useEffect(() => {
    const initData = async () => {
      try {
        const [dishesRes, resRes, invRes, ratRes, evtRes, logRes, usrRes] = await Promise.all([
          peticionApi<any[]>('/dishes').catch(() => []),
          peticionApi<any[]>('/reservations').catch(() => []),
          peticionApi<any[]>('/inventory').catch(() => []),
          peticionApi<any[]>('/ratings').catch(() => []),
          peticionApi<any[]>('/events').catch(() => []),
          peticionApi<any[]>('/logs').catch(() => []),
          peticionApi<any[]>('/auth/usuarios').catch(() => [])
        ]);

        const mappedUsers: Usuario[] = usrRes.map(u => ({
          id: u.id.toString(),
          email: u.email,
          nombre: u.nombre,
          rol: Array.isArray(u.roles) ? u.roles[0].replace('ROLE_', '').toLowerCase() : 'usuario',
          creadoEn: new Date()
        }));
        setUsuarios(mappedUsers);

        const newWeeklyMenu: MenuSemanal = {
          Lunes: { entrante: [], principal: [], postre: [] },
          Martes: { entrante: [], principal: [], postre: [] },
          Miércoles: { entrante: [], principal: [], postre: [] },
          Jueves: { entrante: [], principal: [], postre: [] },
          Viernes: { entrante: [], principal: [], postre: [] },
        };

        const daysMap = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        const mappedDishes: PlatoMenu[] = dishesRes.map(d => {
          const dishId = d.id.toString();
          const backendCat = (d.categoria || d.categoria || "main").toLowerCase();
          const categoryMap: Record<string, "entrante" | "principal" | "postre"> = {
            "starter": "entrante",
            "main": "principal", 
            "dessert": "postre",
            "entrante": "entrante",
            "principal": "principal",
            "postre": "postre"
          };
          const categoria = categoryMap[backendCat] || "principal";
          
          let date = new Date();
          if (d.fecha_disponibilidad) {
             const parts = d.fecha_disponibilidad.split('-');
             date = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          }
          const dayName = daysMap[date.getDay()];
          
          if (newWeeklyMenu[dayName as keyof MenuSemanal]) {
             if (!newWeeklyMenu[dayName as keyof MenuSemanal][categoria]) {
                newWeeklyMenu[dayName as keyof MenuSemanal][categoria] = [];
             }
             newWeeklyMenu[dayName as keyof MenuSemanal][categoria].push(dishId);
          }

          return {
            id: dishId,
            nombre: d.nombre,
            descripcion: d.descripcion || "",
            categoria: categoria,
            urlImagen: d.url_imagen || "/placeholder.jpg",
            alergenos: d.alergenos || [],
            disponible: d.esta_activo,
            precio: d.precio ? parseFloat(d.precio) : 0,
            stock: d.stock || 0
          }
        });

        setPlatosMenu(mappedDishes);
        setMenuSemanal(newWeeklyMenu);

        const groupedRes = resRes.reduce((acc, curr) => {
          const key = `${curr.id_usuario}_${curr.fecha_reserva.split('T')[0]}`;
          if (!acc[key]) {
            acc[key] = {
              id: curr.id.toString(),
              idUsuario: curr.id_usuario.toString(),
              nombreUsuario: mappedUsers.find(u => u.id === curr.id_usuario.toString())?.nombre || "Usuario",
              fecha: new Date(curr.fecha_reserva),
              platosMenu: [],
              estado: (curr.estado?.toLowerCase() === 'pending') ? 'pendiente' : (curr.estado?.toLowerCase() === 'confirmed') ? 'confirmada' : (curr.estado?.toLowerCase() === 'completed') ? 'completada' : (curr.estado?.toLowerCase() === 'cancelled') ? 'cancelada' : (curr.estado?.toLowerCase() || 'pendiente'),
              estadoCocina: (curr.estado?.toLowerCase() === "completed" || curr.estado?.toLowerCase() === "completada") ? 'completada' : (curr.estado?.toLowerCase() === 'confirmed' || curr.estado?.toLowerCase() === 'preparando' || curr.estado?.toLowerCase() === 'confirmada') ? 'preparando' : 'pendiente',
              creadoEn: new Date(curr.creado_en),
              codigoCorto: curr.id.toString().padStart(6, '0')
            };
          }
          acc[key].platosMenu.push(curr.id_plato.toString());
          return acc;
        }, {} as Record<string, Reserva>);
        setReservas(Object.values(groupedRes));

        setInventario(invRes.map(i => ({
          id: i.id.toString(),
          nombre: i.ingredient_name,
          cantidad: i.quantity,
          unidad: i.unit,
          stockMinimo: i.minimum_stock,
          categoria: 'General',
          ultimaActualizacion: new Date(i.created_at || new Date())
        })));

        setValoraciones(ratRes.map(r => ({
          id: r.id.toString(),
          idUsuario: (r.user_id || r.userId)?.toString() || "0",
          nombreUsuario: "Usuario",
          idPlatoMenu: (r.dish_id || r.dishId)?.toString() || "0",
          idReserva: (r.reservation_id || r.reservationId)?.toString() || undefined,
          puntuacion: r.rating || r.puntuacion || 0,
          comentario: r.comment || "",
          fecha: new Date(r.date || r.created_at || new Date())
        })));

        setEventosGastro(evtRes.map(e => ({
          id: e.id.toString(),
          nombre: e.nombre,
          descripcion: e.description || "",
          fecha: new Date(e.date),
          capacidadMaxima: e.maxCapacity,
          asistentesActuales: e.currentAttendees,
          platos: e.dishes || [],
          estado: e.estado,
          creadoPor: e.createdBy || "admin",
          creadoEn: new Date(e.createdAt),
          ultimaModificacion: e.lastModified ? new Date(e.lastModified) : new Date(e.createdAt)
        })));

        if (evtRes.length > 0) {
          const eventReservationsPromises = evtRes.map(e => 
            peticionApi<any[]>(`/events/${e.id}/reservations`).catch(() => [])
          );
          const allReservationsArrays = await Promise.all(eventReservationsPromises);
          
          const mappedEventReservations: ReservaEvento[] = allReservationsArrays.flat().map((er: any) => ({
            id: er.id.toString(),
            idEvento: er.event_id?.toString() || "",
            idUsuario: er.user_id?.toString() || "",
            nombreUsuario: er.user_name || mappedUsers.find(u => u.id === er.user_id?.toString())?.nombre || "Usuario",
            reservadoEn: new Date(er.created_at || new Date()),
            estado: er.status || "confirmada",
            asistio: !!er.attended
          }));
          
          setReservasEventos(mappedEventReservations);
        }

        setRegistrosActividad(logRes.map(l => ({
          id: l.id.toString(),
          accion: l.action,
          detalles: l.details || "",
          nombreUsuario: l.userName || l.nombreUsuario || "System",
          rolUsuario: l.userRole || l.rolUsuario || "Usuario",
          marcaTemporal: new Date(l.timestamp)
        })));

      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    initData();
  }, [])

  const registrarActividad = async (accion: string, detalles: string, nombreUsuario: string, rolUsuario: string) => {
    try {
      const res = await peticionApi<any>('/logs', {
        method: 'POST',
        body: JSON.stringify({ action: accion, details: detalles, userName: nombreUsuario, userRole: rolUsuario })
      });
      const newLog: RegistroActividad = {
        id: res.id.toString(),
        accion: res.action,
        detalles: res.details || "",
        nombreUsuario: res.userName || "System",
        rolUsuario: res.userRole || "Usuario",
        marcaTemporal: new Date(res.timestamp)
      };
      setRegistrosActividad(prev => [newLog, ...prev]);
    } catch (e) { console.error(e) }
  }

  const añadirPlatoMenu = async (item: Omit<PlatoMenu, "id">) => {
    try {
      const res = await peticionApi<any>('/dishes', {
        method: 'POST',
        body: JSON.stringify({
          nombre: item.nombre,
          descripcion: item.descripcion,
          categoria: item.categoria,
          precio: item.precio || 0,
          stock: item.stock || 0,
          url_imagen: item.urlImagen,
          alergenos: item.alergenos,
          informacion_nutricional: {},
        })
      });
      setPlatosMenu([...platosMenu, { ...item, id: res.id.toString(), disponible: res.esta_activo }]);
    } catch (e) { console.error(e) }
  }

  const actualizarPlatoMenu = async (id: string, actualizaciones: Partial<PlatoMenu>) => {
    try {
      await peticionApi(`/dishes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: actualizaciones.nombre,
          descripcion: actualizaciones.descripcion,
          categoria: actualizaciones.categoria,
          esta_activo: actualizaciones.disponible,
          precio: actualizaciones.precio,
          stock: actualizaciones.stock
        })
      });
      setPlatosMenu(platosMenu.map(item => (item.id === id ? { ...item, ...actualizaciones } : item)));
    } catch (e) { console.error(e) }
  }

  const eliminarPlatoMenu = async (id: string) => {
    try {
      await peticionApi(`/dishes/${id}`, { method: 'DELETE' });
      setPlatosMenu(platosMenu.filter(item => item.id !== id));
    } catch (e) { console.error(e) }
  }

  const añadirReserva = async (reserva: Omit<Reserva, "id" | "codigoCorto">) => {
    try {
      const promises = reserva.platosMenu.map(dishId => 
        peticionApi<any>('/reservations', {
          method: 'POST',
          body: JSON.stringify({
            id_usuario: reserva.idUsuario,
            id_plato: dishId,
            fecha_reserva: reserva.fecha.toISOString(),
            cantidad: 1,
            estado: "pending"
          })
        })
      );
      const results = await Promise.all(promises);
      if (results.length > 0) {
        setReservas([...reservas, { 
          ...reserva, 
          id: results[0].id.toString(), 
          codigoCorto: results[0].id.toString().padStart(6, '0') 
        }]);

        // Reducir stock localmente
        setPlatosMenu(prevPlatos => prevPlatos.map(plato => {
          const count = reserva.platosMenu.filter(id => id === plato.id).length;
          if (count > 0) {
            return { ...plato, stock: Math.max(0, plato.stock - count) };
          }
          return plato;
        }));
      }
    } catch(e) { console.error(e) }
  }

  const actualizarReserva = (id: string, actualizaciones: Partial<Reserva>) => {
    setReservas(reservas.map(res => (res.id === id ? { ...res, ...actualizaciones } : res)))
  }

  const actualizarEstadoCocinaReserva = async (id: string, estado: "pendiente" | "preparando" | "completada") => {
    try {
      const stateMapping: any = { "pendiente": "pending", "preparando": "confirmed", "completada": "completed" };
      await peticionApi(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: stateMapping[estado] })
      });
      setReservas(reservas.map(res => {
        if (res.id === id) {
          return { ...res, estadoCocina: estado, estado: estado === "completada" ? "confirmada" : res.estado }
        }
        return res
      }))
    } catch(e) { console.error(e) }
  }

  const cancelarReserva = async (id: string) => {
    try {
      await peticionApi(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ estado: 'cancelled' })
      });
      setReservas(reservas.map(res => (res.id === id ? { ...res, estado: "cancelada" } : res)))
    } catch(e) { console.error(e) }
  }

  const limpiarReservasCompletadas = () => {
    setReservas(prev => prev.filter(r => r.estadoCocina !== "completada"))
  }

  const actualizarArticuloInventario = async (id: string, cantidad: number) => {
    try {
      await peticionApi(`/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: cantidad })
      });
      setInventario(inventario.map(item => (item.id === id ? { ...item, cantidad, ultimaActualizacion: new Date() } : item)))
    } catch(e) { console.error(e) }
  }

  const añadirArticuloInventario = async (item: Omit<ArticuloInventario, "id" | "ultimaActualizacion">) => {
    try {
      const res = await peticionApi<any>('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ingredient_name: item.nombre,
          quantity: item.cantidad,
          unit: item.unidad,
          minimum_stock: item.stockMinimo
        })
      });
      setInventario([...inventario, { ...item, id: res.id.toString(), ultimaActualizacion: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const añadirValoracion = async (valoracion: Omit<Valoracion, "id" | "fecha">) => {
    try {
      const res = await peticionApi<any>('/ratings', {
        method: 'POST',
        body: JSON.stringify({
          userId: valoracion.idUsuario,
          dishId: valoracion.idPlatoMenu,
          reservationId: valoracion.idReserva,
          rating: valoracion.puntuacion,
          comment: valoracion.comentario
        })
      });
      setValoraciones(prev => [...prev, { ...valoracion, id: res.id.toString(), fecha: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const añadirUsuario = (usuario: Omit<Usuario, "id" | "creadoEn">) => {
    const nuevoUsuario = { ...usuario, id: Date.now().toString(), creadoEn: new Date() }
    setUsuarios([...usuarios, nuevoUsuario])
  }

  const actualizarUsuario = (id: string, actualizaciones: Partial<Usuario>) => {
    setUsuarios(usuarios.map(usuario => (usuario.id === id ? { ...usuario, ...actualizaciones } : usuario)))
  }

  const eliminarUsuario = (id: string) => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== id))
  }

  const alternarPlatoMenuSemanal = (dia: string, categoria: "entrante" | "principal" | "postre", idItem: string) => {
    setMenuSemanal(prevMenu => {
      const curr = prevMenu[dia]?.[categoria] || []
      const next = curr.includes(idItem) ? curr.filter(id => id !== idItem) : [...curr, idItem]
      return { ...prevMenu, [dia]: { ...prevMenu[dia], [categoria]: next } }
    })
  }

  const limpiarMenuSemanal = () => {
    setMenuSemanal({
      Lunes: { entrante: [], principal: [], postre: [] },
      Martes: { entrante: [], principal: [], postre: [] },
      Miércoles: { entrante: [], principal: [], postre: [] },
      Jueves: { entrante: [], principal: [], postre: [] },
      Viernes: { entrante: [], principal: [], postre: [] },
    })
  }

  const añadirEventoGastro = async (evento: Omit<EventoGastro, "id" | "creadoEn" | "asistentesActuales">) => {
    try {
      const res = await peticionApi<any>('/events', {
        method: 'POST',
        body: JSON.stringify({ 
          name: evento.nombre, 
          description: evento.descripcion, 
          date: evento.fecha.toISOString(), 
          maxCapacity: evento.capacidadMaxima, 
          dishes: evento.platos, 
          status: evento.estado, 
          createdBy: evento.creadoPor 
        })
      });
      setEventosGastro([...eventosGastro, { ...evento, id: res.id.toString(), asistentesActuales: 0, creadoEn: new Date() }]);
    } catch(e) { console.error(e) }
  }

  const actualizarEventoGastro = async (id: string, actualizaciones: Partial<EventoGastro>) => {
    try {
      const bodyUpdate: any = {};
      if(actualizaciones.nombre) bodyUpdate.name = actualizaciones.nombre;
      if(actualizaciones.descripcion !== undefined) bodyUpdate.description = actualizaciones.descripcion;
      if(actualizaciones.fecha) bodyUpdate.date = actualizaciones.fecha.toISOString();
      if(actualizaciones.capacidadMaxima !== undefined) bodyUpdate.maxCapacity = actualizaciones.capacidadMaxima;
      if(actualizaciones.platos) bodyUpdate.dishes = actualizaciones.platos;
      if(actualizaciones.estado) bodyUpdate.status = actualizaciones.estado;

      await peticionApi(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bodyUpdate)
      });
      setEventosGastro(eventosGastro.map(event =>
        event.id === id ? { ...event, ...actualizaciones, ultimaModificacion: new Date(), estado: actualizaciones.estado || "modificado" } : event
      ))
    } catch(e) { console.error(e) }
  }

  const cancelarEventoGastro = async (id: string) => {
    try {
      await peticionApi(`/events/${id}`, { method: 'DELETE' });
      setEventosGastro(eventosGastro.map(event =>
        event.id === id ? { ...event, estado: "cancelado", ultimaModificacion: new Date() } : event
      ))
    } catch(e) { console.error(e) }
  }

  const reservarPuestoEvento = (idEvento: string, idUsuario: string, nombreUsuario: string): boolean => {
    const evento = eventosGastro.find((e) => e.id === idEvento)
    if (!evento || evento.estado !== "activo" || evento.asistentesActuales >= evento.capacidadMaxima) return false
    
    peticionApi(`/events/${idEvento}/reservations`, {
      method: 'POST',
      body: JSON.stringify({ userId: idUsuario, userName: nombreUsuario })
    }).catch(console.error);

    setReservasEventos([...reservasEventos, {
      id: Date.now().toString(),
      idEvento, idUsuario, nombreUsuario,
      reservadoEn: new Date(),
      estado: "confirmada",
      asistio: false
    }]);

    setEventosGastro(eventosGastro.map(e =>
      e.id === idEvento ? { ...e, asistentesActuales: e.asistentesActuales + 1, estado: (e.asistentesActuales + 1) >= e.capacidadMaxima ? "lleno" : "activo" } : e
    ));

    return true
  }

  const cancelarReservaEvento = (idEvento: string, idUsuario: string) => {
    setReservasEventos(reservasEventos.map(res =>
      res.idEvento === idEvento && res.idUsuario === idUsuario ? { ...res, estado: "cancelada" } : res
    ))
    setEventosGastro(eventosGastro.map(evento => {
      if (evento.id === idEvento) {
        const nuevosAsistentes = Math.max(0, evento.asistentesActuales - 1)
        return { ...evento, asistentesActuales: nuevosAsistentes, estado: nuevosAsistentes < evento.capacidadMaxima ? "activo" : evento.estado }
      }
      return evento
    }))
  }

  const obtenerAsistentesEvento = (idEvento: string): ReservaEvento[] => {
    return reservasEventos.filter((r) => r.idEvento === idEvento && r.estado === "confirmada")
  }

  const marcarAsistenciaEvento = async (idReserva: string, asistio: boolean) => {
    try {
      await peticionApi(`/events/reservations/${idReserva}`, {
        method: 'PUT',
        body: JSON.stringify({ attended: asistio })
      });
      setReservasEventos(prev => prev.map(res => 
        res.id === idReserva ? { ...res, asistio } : res
      ))
    } catch(e) { console.error(e) }
  }

  return (
    <ContextoDatos.Provider
      value={{
        platosMenu, añadirPlatoMenu, actualizarPlatoMenu, eliminarPlatoMenu,
        reservas, añadirReserva, actualizarReserva, actualizarEstadoCocinaReserva, cancelarReserva, limpiarReservasCompletadas,
        inventario, actualizarArticuloInventario, añadirArticuloInventario,
        valoraciones, añadirValoracion,
        usuarios, añadirUsuario, actualizarUsuario, eliminarUsuario,
        menuSemanal, alternarPlatoMenuSemanal, limpiarMenuSemanal,
        eventosGastro, añadirEventoGastro, actualizarEventoGastro, cancelarEventoGastro,
        reservasEventos, reservarPuestoEvento, cancelarReservaEvento, obtenerAsistentesEvento, marcarAsistenciaEvento,
        registrosActividad, registrarActividad
      }}
    >
      {children}
    </ContextoDatos.Provider>
  )
}

export function useDatos() {
  const contexto = useContext(ContextoDatos)
  if (contexto === undefined) throw new Error("useDatos debe usarse dentro de un ProveedorDatos")
  return contexto
}
