'use client'
import "./theme-buttons.css"
import { useState } from "react"
import { useTheme } from "next-themes"
import { motion} from "motion/react"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = [
  { id: "light", label: "light" },
  { id: "dark", label: "dark" },
]

export default function ThemeButtons() {
  const { theme, setTheme } = useTheme()
  
  const [activeTab, setActiveTab] = useState(theme)

  return (
    <div className={`${theme === "dark" ? "GlassEffect-dark" : "GlassEffect"} fixed overflow-hidden lex items-center space-x-1 p-1.5 bottom-[20px] right-[40px] rounded-full z-50`}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id)
            setTheme(tab.label)
          }}
          className={`${
            activeTab === tab.id ? "" : "hover:text-blue-500 dark:hover:text-blue-500"
          } relative rounded-full bg-transparent px-3 py-1.5 text-sm font-medium text-black outline-sky-400 transition dark:text-white hover:bg-transparent focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className={`${theme === "dark" ? "GlassEffect-dark": "GlassEffect GlassEffect-light"} absolute inset-0 z-10`}
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label === "light" ? <SunIcon className="size-4 transition hover:scale-125" /> : <MoonIcon className="size-4 transition hover:scale-125" />}
        </Button>
      ))}
    </div>
  )
}