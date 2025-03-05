'use client'
import { useTheme } from "next-themes"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


export default function ThemeButtons() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-center border border-zinc-100 bg-zinc-100/25 backdrop-blur-xs shadow-sm rounded-full z-50">
      <Button
        className={cn(
          "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
          theme === "light" ? "bg-primary/15 text-primary/100" : ""
        )}
        onClick={() => { setTheme("light") }}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        className={cn(
          "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
          theme === "system" ? "bg-primary/15 text-primary/100" : ""
        )}
        onClick={() => { setTheme("system") }}
      >
        <MonitorIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        className={cn(
          "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
          theme === "dark" ? "bg-primary/15 text-primary/100" : ""
        )}
        onClick={() => { setTheme("dark") }}
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </div>
  )
}