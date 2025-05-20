'use client'
import { useTheme } from "next-themes"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { MonitorIcon, CloudIcon, MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeButtons() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-[24px] right-[24px] z-50">
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`w-24 rounded-full flex shadow-lg relative bg-gradient-to-b ${
          theme === "light"
            ? "justify-end from-blue-500 to-sky-300"
            : "justify-start from-indigo-600 to-indigo-400"
        }`}
      >
        <Thumb theme={theme} />
        {theme === "light" && <Clouds />}
        {theme === "dark" && <Stars />}
      </Button>
    </div>
  )
}

const Thumb = ({ theme }) => {
  return (
    <motion.div
      layout
      transition={{
        duration: 0.75,
        type: "spring",
      }}
      className={`relative w-8 h-8 overflow-hidden rounded-full shadow-lg ${
        theme === "dark"
        ? "-ml-2.5"
        : "-mr-2.5"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-slate-100"
            : "animate-pulse bg-gradient-to-tr from-amber-300 to-yellow-500 rounded-full"
        }`}
      />
      {theme === "light" && <SunCenter />}
      {theme === "dark" && <MoonSpots />}
    </motion.div>
  )
}

const SunCenter = () => (
  <div className="absolute inset-1.5 rounded-full bg-amber-300" />
)

const MoonSpots = () => (
  <>
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="w-3 h-3 rounded-full bg-slate-300 absolute right-2.5 bottom-1"
    />
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.35 }}
      className="absolute w-3 h-3 rounded-full bg-slate-300 left-1 bottom-4"
    />
    <motion.div
      initial={{ x: -4, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className="absolute w-2 h-2 rounded-full bg-slate-300 right-2 top-2"
    />
  </>
)

const Stars = () => {
  return (
    <>
      <motion.span
        animate={{
          scale: [0.75, 1, 0.75],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeIn",
        }}
        className="absolute text-xs text-slate-300 right-9 top-1"
      >
        <StarIcon className="w-4 h-4" />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.75, 1],
          opacity: [0.5, 0.25, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeIn",
        }}
        style={{ rotate: "-45deg" }}
        className="absolute text-lg text-slate-300 right-3 top-2"
      >
        <StarIcon className="w-4 h-4" />
      </motion.span>
      <motion.span
        animate={{
          scale: [1, 0.5, 1],
          opacity: [1, 0.5, 1],
        }}
        style={{ rotate: "45deg" }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeIn",
        }}
        className="absolute text-slate-300 right-6 top-5"
      >
        <StarIcon className="w-4 h-4" />
      </motion.span>
    </>
  )
}

const Clouds = () => {
  return (
    <>
      <motion.span
        animate={{ x: [-20, -15, -10, -5, 0], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 0.25,
        }}
        className="absolute text-xs text-white top-1 left-10"
      >
        <CloudIcon className="w-4 h-4" />
      </motion.span>
      <motion.span
        animate={{ x: [-10, 0, 10, 20, 30], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          delay: 0.5,
        }}
        className="absolute text-lg text-white left-3 top-3"
      >
        <CloudIcon className="w-4 h-4" />
      </motion.span>
      <motion.span
        animate={{ x: [-7, 0, 7, 14, 21], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 12.5,
          repeat: Infinity,
        }}
        className="absolute text-white left-6 top-5"
      >
        <CloudIcon className="w-4 h-4" />
      </motion.span>
      <motion.span
        animate={{ x: [-15, 0, 15, 30, 45], opacity: [0, 1, 0.75, 1, 0] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          delay: 0.75,
        }}
        className="absolute text-xs text-white left-12 top-4"
      >
        <CloudIcon className="w-4 h-4" />
      </motion.span>
    </>
  )
}

// const ThemeButtonsOld = () => {
// const { theme, setTheme } = useTheme()

//   return (
//     <div className="fixed bottom-[24px] right-[24px]">
//       <Button
//         className={cn(
//           "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
//           theme === "light" ? "bg-primary/15 text-primary/100" : ""
//         )}
//         onClick={() => { setTheme("light") }}
//       >
//         <SunIcon className="h-[1.2rem] w-[1.2rem]" />
//       </Button>
//       <Button
//         className={cn(
//           "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
//           theme === "system" ? "bg-primary/15 text-primary/100" : ""
//         )}
//         onClick={() => { setTheme("system") }}
//       >
//         <MonitorIcon className="h-[1.2rem] w-[1.2rem]" />
//       </Button>
//       <Button
//         className={cn(
//           "size-6 px-0 aspect-square rounded-full bg-transparent text-primary/50 hover:bg-primary/25 hover:text-primary/75",
//           theme === "dark" ? "bg-primary/15 text-primary/100" : ""
//         )}
//         onClick={() => { setTheme("dark") }}
//       >
//         <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
//       </Button>
//     </div>
//   )
// }