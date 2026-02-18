"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import Preloader from "./preloader"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready) return

    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      }
    )
  }, [pathname, ready])

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}

      <div ref={contentRef} style={{ opacity: ready ? 1 : 0 }}>
        {children}
      </div>
    </>
  )
}