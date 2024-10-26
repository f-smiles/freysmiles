'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"


export default function DashboardNav({
  allLinks
}: {
  allLinks: { label: string; href: string; icon: JSX.Element }[]
}) {

  const pathname = usePathname()

  return (
    <nav className="p-6 overflow-auto border rounded-lg shadow-sm">
      <ul className="flex gap-8 text-xs font-medium">
        <AnimatePresence>
          {allLinks.map((link, index) => (
            <motion.li
              key={index}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className={cn(
                  "relative flex flex-col items-center gap-1",
                  pathname === link.href && "text-primary/100"
                )}
              >
                {link.icon}
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    className="h-[2px] bg-primary w-full rounded-full absolute left-0 -bottom-1 z-0"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 40 }}
                    layoutId="underline"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  )
}