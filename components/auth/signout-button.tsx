'use client'

import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"

export const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className={cn(
        "w-full h-full cursor-pointer group",
        `relative z-0 px-3 py-1.5 flex items-center gap-2 overflow-hidden whitespace-nowrap
        border-[1px] border-zinc-300 rounded-lg
        font-medium text-zinc-700
        transition-all duration-300
        before:transition-transform before:duration-1000
        before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%]
        before:bg-primary before:content-[""]
        hover:scale-105 hover:border-primary hover:text-zinc-50 hover:before:translate-y-[0%]
        active:scale-100`
      )}
    >
      <LogOut className="w-5 mr-1 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-90" />
      Sign Out
    </button>
  )
}
