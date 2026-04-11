"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario } from "./types"
import { peticionApi } from "./api"

interface TipoContextoAutenticacion {
  usuario: Usuario | null
  iniciarSesion: (email: string, password: string) => Promise<Usuario | null>
  cerrarSesion: () => void
  cargando: boolean
  todosLosUsuarios: (Usuario & { password?: string })[]
  actualizarUsuario: (id: string, actualizaciones: Partial<Usuario> & { password?: string }) => void
  añadirUsuario: (usuario: Omit<Usuario, "id" | "creadoEn"> & { password?: string }) => void
  eliminarUsuario: (id: string) => void
}

const ContextoAutenticacion = createContext<TipoContextoAutenticacion | undefined>(undefined)

const mapearRolDb = (roleStr: any): "admin" | "cocina" | "maestro" | "alumno-cocina" | "alumno-cocina-titular" => {
  if (!roleStr) return 'alumno-cocina';
  let r = String(roleStr);
  
  if (r.startsWith('[') && r.endsWith(']')) {
    try {
      const parsed = JSON.parse(r);
      if (Array.isArray(parsed) && parsed.length > 0) {
        r = String(parsed[0]);
      }
    } catch(e) {}
  }

  r = r.replace(/^"|"$/g, '');

  if (r === 'ROLE_ADMIN' || r === 'admin') return 'admin';
  if (r === 'ROLE_KITCHEN' || r === 'cocina') return 'cocina';
  if (r === 'ROLE_USER' || r === 'maestro') return 'maestro';
  if (r === 'alumno-cocina-titular') return 'alumno-cocina-titular';
  return 'alumno-cocina';
}

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const [listaUsuarios, setListaUsuarios] = useState<(Usuario & { password?: string })[]>([])

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      try { setUsuario(JSON.parse(usuarioGuardado)) } catch {}
    }

    peticionApi<any[]>('/auth/users')
      .then(datos => {
        const mapeados = datos.map(u => ({
          id: u.id.toString(),
          email: u.email,
          nombre: u.nombre || u.name,
          rol: Array.isArray(u.roles) ? mapearRolDb(u.roles[0]) : mapearRolDb(u.roles),
          creadoEn: new Date(),
        }))
        setListaUsuarios(mapeados)
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const comprobarYResetearRoles = () => {
      const ahora = new Date()
      const ultimoReinicioStr = localStorage.getItem('ultimoReinicioRol')
      const ultimoReinicio = ultimoReinicioStr ? parseInt(ultimoReinicioStr) : 0
      const objetivo = new Date(ahora)
      objetivo.setHours(14, 30, 0, 0)
      if (ahora.getTime() < objetivo.getTime()) objetivo.setDate(objetivo.getDate() - 1)
      while (objetivo.getDay() === 0 || objetivo.getDay() === 6) objetivo.setDate(objetivo.getDate() - 1)

      if (ultimoReinicio < objetivo.getTime()) {
        setListaUsuarios(prev => {
          const actualizados = prev.map(u =>
            u.rol === "alumno-cocina-titular" ? { ...u, rol: "alumno-cocina" as const } : u
          )
          setUsuario(usuarioPrev => {
            if (usuarioPrev?.rol === "alumno-cocina-titular") {
              const usuarioActualizado = { ...usuarioPrev, rol: "alumno-cocina" as const }
              localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
              return usuarioActualizado
            }
            return usuarioPrev
          })
          return actualizados
        })
        localStorage.setItem('ultimoReinicioRol', ahora.getTime().toString())
      }
    }
    comprobarYResetearRoles()
    const intervalo = setInterval(comprobarYResetearRoles, 60000)
    return () => clearInterval(intervalo)
  }, [])

  const iniciarSesion = async (email: string, password: string): Promise<Usuario | null> => {
    try {
      const res = await peticionApi<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      const u = res.usuario || res.user
      const usuarioLogueado: Usuario = {
        id: u.id.toString(),
        email: u.email,
        nombre: u.nombre || u.name,
        rol: Array.isArray(u.roles) ? mapearRolDb(u.roles[0]) : mapearRolDb(u.roles),
        creadoEn: new Date(),
      }
      setUsuario(usuarioLogueado)
      localStorage.setItem("usuario", JSON.stringify(usuarioLogueado))
      return usuarioLogueado
    } catch {
      return null
    }
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  const actualizarUsuario = async (id: string, actualizaciones: Partial<Usuario> & { password?: string }) => {
    try {
      const cuerpo: any = {}
      if (actualizaciones.nombre) cuerpo.name = actualizaciones.nombre
      if (actualizaciones.email) cuerpo.email = actualizaciones.email
      if (actualizaciones.password) cuerpo.password = actualizaciones.password
      if (actualizaciones.rol) cuerpo.roles = [actualizaciones.rol]
      await peticionApi(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(cuerpo) })
      setListaUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...actualizaciones } : u))
      if (usuario && usuario.id === id) {
        const usuarioActualizado = { ...usuario, ...actualizaciones }
        setUsuario(usuarioActualizado as Usuario)
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado))
      }
    } catch (e) { console.error(e) }
  }

  const añadirUsuario = async (nuevoUsuario: Omit<Usuario, "id" | "creadoEn"> & { password?: string }) => {
    try {
      const res = await peticionApi<any>('/auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email: nuevoUsuario.email,
          name: nuevoUsuario.nombre,
          password: nuevoUsuario.password || '123456',
          roles: [nuevoUsuario.rol]
        })
      })
      const creado: Usuario = {
        id: res.id.toString(),
        email: res.email,
        nombre: res.nombre || res.name,
        rol: Array.isArray(res.roles) ? mapearRolDb(res.roles[0]) : mapearRolDb(res.roles),
        creadoEn: new Date(),
      }
      setListaUsuarios(prev => [...prev, creado])
    } catch (e) { console.error(e) }
  }

  const eliminarUsuario = async (id: string) => {
    try {
      await peticionApi(`/auth/users/${id}`, { method: 'DELETE' })
      setListaUsuarios(prev => prev.filter(u => u.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <ContextoAutenticacion.Provider value={{
      usuario, iniciarSesion, cerrarSesion, cargando,
      todosLosUsuarios: listaUsuarios,
      actualizarUsuario, añadirUsuario, eliminarUsuario
    }}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(ContextoAutenticacion)
  if (contexto === undefined) throw new Error("useAuth debe usarse dentro de un ProveedorAutenticacion")
  return contexto
}
