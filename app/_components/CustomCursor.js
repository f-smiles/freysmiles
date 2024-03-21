import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

export default function CustomCursor() {

  useGSAP(() => {
    const isTouchDevice = 'ontouchstart' in window

    const createCustomCursor = () => {
      const customCursor = document.querySelector('.custom-cursor') 
      
      // Each time the mouse coordinates are updated, we need to pass the values to gsap in order to animate the element
      window.addEventListener('mousemove', (e) => {
        const { target, x, y } = e

        const isTargetLinkOrButton = target?.closest('a') || target?.closest('button')
        
        gsap.to(customCursor, {
          x: x + 3,
          y: y + 3,
          duration: 0.7,
          ease: "power4",
          opacity: isTargetLinkOrButton ? 0.6 : 1,
          transform: `scale(${isTargetLinkOrButton ? 4 : 1})`,
        })
      })

      document.addEventListener('mouseleave', (e) => {
        gsap.to(customCursor, {
          duration: 0.7,
          opacity: 0,
        })
      })
    }

    // Only create the custom cursor if device isn't touchable
    if (!isTouchDevice) {
      createCustomCursor()
    }
  })

  return (
    <div className="custom-cursor" />
  )
}
