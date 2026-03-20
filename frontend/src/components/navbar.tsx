"use client"

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
import { ChefHat, LogOut, User, QrCode } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import QRCode from "react-qr-code"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isQrOpen, setIsQrOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <>
      <nav className="border-b border-[var(--gm-accent)] bg-[var(--gm-surface)]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gm-accent)]">
            <ChefHat className="h-6 w-6 text-[var(--gm-heading)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[var(--gm-heading)]">GuMip</h1>
            <p className="text-xs text-[var(--gm-body)]">IES Mendoza</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-[var(--gm-heading)] hover:bg-[var(--gm-accent)]/50">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[var(--gm-accent)] bg-[var(--gm-surface)]">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-[var(--gm-heading)]">{user?.name}</span>
                <span className="text-xs text-[var(--gm-body)]">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--gm-accent)]" />
            {user?.role === "maestro" && (
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
      </div>
    </nav>
      
    <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
      <DialogContent className="sm:max-w-md border-[var(--gm-accent)] bg-[var(--gm-surface)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--gm-heading)]">Mi Código QR</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <QRCode value={user?.email || "maestro"} size={200} />
          </div>
          <div className="text-center mt-2">
            <p className="font-medium text-lg text-[var(--gm-heading)]">{user?.name}</p>
            <p className="text-sm text-[var(--gm-body)]">{user?.email}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
