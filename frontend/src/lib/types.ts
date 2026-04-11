export type RolUsuario = "admin" | "cocina" | "maestro" | "alumno-cocina" | "alumno-cocina-titular"

export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: RolUsuario
  creadoEn: Date
}

export interface PlatoMenu {
  id: string
  nombre: string
  descripcion: string
  categoria: "entrante" | "principal" | "postre"
  alergenos: string[]
  urlImagen?: string
  idAutor?: string
  nombreAutor?: string
  disponible: boolean
}

export interface MenuSemanal {
  [dia: string]: {
    entrante: string[]
    principal: string[]
    postre: string[]
  }
}

export interface Reserva {
  id: string
  codigoCorto?: string
  idUsuario: string
  nombreUsuario: string
  fecha: Date
  platosMenu: string[]
  estado: "pendiente" | "confirmada" | "cancelada"
  estadoCocina?: "pendiente" | "preparando" | "completada"
  creadoEn: Date
}

export interface Valoracion {
  id: string
  idUsuario: string
  nombreUsuario: string
  idPlatoMenu: string
  puntuacion: number
  comentario: string
  fecha: Date
}

export interface ArticuloInventario {
  id: string
  nombre: string
  cantidad: number
  unidad: string
  stockMinimo: number
  categoria: string
  ultimaActualizacion: Date
}

export interface EventoGastro {
  id: string
  nombre: string
  descripcion: string
  fecha: Date
  capacidadMaxima: number
  asistentesActuales: number
  platos: string[] // Lista de descripciones de platos
  estado: "activo" | "modificado" | "cancelado" | "lleno"
  creadoPor: string
  creadoEn: Date
  ultimaModificacion?: Date
}

export interface ReservaEvento {
  id: string
  idEvento: string
  idUsuario: string
  nombreUsuario: string
  reservadoEn: Date
  estado: "confirmada" | "cancelada"
  asistio?: boolean
}

export interface RegistroActividad {
  id: string
  accion: string
  detalles: string
  nombreUsuario: string
  rolUsuario: string
  marcaTemporal: Date
}
