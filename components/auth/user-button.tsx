'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"
import { ShoppingBag, Settings } from "lucide-react"

import { SignOutButton } from "./signout-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export default function UserButton({ user }: Session) {

  const router = useRouter()


  if (user)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border rounded-full shadow-sm">
        <Avatar>
          {user.image && user.name ? (
            <Image src={user.image} alt={user.name} fill={true} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-4 mt-6 -mr-4 min-w-64 backdrop-blur-sm bg-white/30" align="end">
        <DropdownMenuLabel className="flex flex-col items-center gap-4 mb-4 text-center rounded-md">
          <Avatar>
            {user?.image && user?.name ? (
              <Image src={user.image} alt={user.name} fill={true} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                <p className="font-bold">{user?.name?.charAt(0).toUpperCase()}</p>
              </AvatarFallback>
            )}
          </Avatar>
          <span>
            <p className="font-medium">{user?.name}</p>
            <p className="font-normal">{user?.email}</p>
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="mt-4 space-y-2">
          <DropdownMenuItem onClick={() => router.push("/dashboard/orders")} className="px-2 cursor-pointer group">
            <ShoppingBag className="w-5 mr-3 transition-all duration-300 group-hover:translate-x-1" />
            My Orders
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="px-2 cursor-pointer group">
            <Settings className="w-5 mr-3 transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-45" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <SignOutButton />
          </DropdownMenuItem>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
