'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export default function GridOverlay() {
  const container = useRef(null)

  useGSAP(() => {
    const gridColumns = gsap.utils.toArray(".grid-column")
    gsap.set(gridColumns, {
      opacity: 0,
      scaleY: 0,
    })
    gsap.to(gridColumns, {
      opacity: 1,
      scaleY: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.out",
      transformOrigin: "top",
    })
  }, { scope: container })

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 p-[32px] pointer-events-none -z-10 bg-none">
      <div ref={container} className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-[0.75rem] h-full w-full mx-auto my-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="grid-column border-x border-[rgba(0,_0,_0,_0.15)] dark:border-[rgba(255,_255,_255,_0.15)] border-y-0 opacity-0"
          />
        ))}
      </div>
    </div>
  )
}