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
    <nav className="border-b border-[#F2EDA2] bg-[#FFFEF9]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2EDA2]">
            <ChefHat className="h-6 w-6 text-[#5C5C5C]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#5C5C5C]">GuMip</h1>
            <p className="text-xs text-[#737373]">IES Mendoza</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-[#5C5C5C] hover:bg-[#F2EDA2]/50">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[#F2EDA2] bg-[#FFFEF9]">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-[#5C5C5C]">{user?.name}</span>
                <span className="text-xs text-[#737373]">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#F2EDA2]" />
            <DropdownMenuItem onClick={handleLogout} className="text-[#F2594B] font-medium focus:text-[#F2594B] focus:bg-[#FFF5F4]">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
