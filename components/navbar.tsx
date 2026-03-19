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
    <nav className="border-b border-[#FAD85D] bg-[#FFFFFF]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAD85D]">
            <ChefHat className="h-6 w-6 text-[#4A3B32]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#4A3B32]">GuMip</h1>
            <p className="text-xs text-[#877669]">IES Mendoza</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-[#4A3B32] hover:bg-[#FAD85D]/50">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[#FAD85D] bg-[#FFFFFF]">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-[#4A3B32]">{user?.name}</span>
                <span className="text-xs text-[#877669]">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#FAD85D]" />
            <DropdownMenuItem onClick={handleLogout} className="text-[#E8654D] font-medium focus:text-[#E8654D] focus:bg-[#FDF0EC]">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
