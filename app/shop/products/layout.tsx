"use client"

import { useState } from "react"
import Preloader from "./preloader"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [ready, setReady] = useState(false)

  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      {children}
    </>
  )
}