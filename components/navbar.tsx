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
import { ChefHat, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
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
            <DropdownMenuItem onClick={handleLogout} className="text-[var(--gm-coral)] font-medium focus:text-[var(--gm-coral)] focus:bg-[var(--gm-coral-bg)]">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
