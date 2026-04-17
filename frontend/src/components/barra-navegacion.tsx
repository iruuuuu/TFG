import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChefHat, LogOut, User as Usuario, QrCode } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import QRCode from "react-qr-code"

export function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [isQrOpen, setIsQrOpen] = useState(false)

  const handleLogout = () => {
    cerrarSesion()
    navigate("/")
  }

  return (
    <>
    <nav className="border-b border-md-accent bg-md-surface shadow-md">
      <div className="flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-md-accent shadow-sm">
            <ChefHat className="h-6 w-6 text-md-heading" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-md-heading leading-none mb-0.5">Mendos</h1>
            <p className="text-[10px] text-md-body uppercase tracking-wider font-extrabold">IES Antonio de Mendoza</p>
          </div>
        </Link>

        {usuario ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-md-heading hover:bg-md-accent/50">
                <Usuario className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-md-accent bg-md-surface shadow-xl">
              <DropdownMenuLabel className="pb-3 border-b border-md-accent/20">
                <div className="flex flex-col">
                  <span className="font-bold text-md-heading">{usuario?.nombre}</span>
                  <span className="text-xs text-md-body/80">{usuario?.email}</span>
                </div>
              </DropdownMenuLabel>
              {usuario?.rol === "maestro" && (
                <>
                  <DropdownMenuItem onClick={() => setIsQrOpen(true)} className="text-[var(--gm-body)] font-medium focus:bg-[var(--gm-accent)]/50 cursor-pointer">
                    <QrCode className="mr-2 h-4 w-4" />
                    Mi Código QR
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[var(--gm-accent)]" />
                </>
              )}
              <DropdownMenuItem onClick={handleLogout} className="text-[var(--gm-coral)] font-medium focus:text-[var(--gm-coral)] focus:bg-[var(--gm-coral-bg)] cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline" className="border-md-accent text-md-heading hover:bg-md-accent/20 font-bold shadow-sm">
            <Link to="/iniciarSesion">Iniciar Sesión</Link>
          </Button>
        )}
      </div>
    </nav>
      
    {usuario && (
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-md border-md-accent bg-md-surface p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-md-heading text-center">Mi Código QR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCode value={usuario?.email || "maestro"} size={200} />
            </div>
            <div className="text-center mt-2">
              <p className="font-medium text-lg text-[var(--gm-heading)]">{usuario?.nombre}</p>
              <p className="text-sm text-[var(--gm-body)]">{usuario?.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  )
}
