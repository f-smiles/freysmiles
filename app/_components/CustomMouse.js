import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function CustomMouse() {

  useGSAP(() => {

    gsap.set('.cursor-dot', {scale: 0.1})
    gsap.set('.cursor-outline', {scale: 0.5})

    document.addEventListener("mousemove", mouseMove)

    let xCircleTo = gsap.quickTo(".cursor-outline", "left", {
      duration: 0.2,
      ease: "power3"
    })
    let yCircleTo = gsap.quickTo(".cursor-outline", "top", {
      duration: 0.2,
      ease: "power3"
    })

    let xDotTo = gsap.quickTo(".cursor-dot", "left", {
      duration: 0.6,
      ease: "power3"
    })
    let yDotTo = gsap.quickTo(".cursor-dot", "top", {
      duration: 0.6,
      ease: "power3"
    })

    let isVisible = false

    function mouseMove(e) {
      if (!isVisible) {
        gsap.set(".cursor-outline, .cursor-dot", { opacity: 1 })
        isVisible = true
      }

      const cursorPosition = {
        left: e.clientX,
        top: e.clientY
      }

      xCircleTo(cursorPosition.left)
      yCircleTo(cursorPosition.top)
      xDotTo(cursorPosition.left)
      yDotTo(cursorPosition.top)
    }

    let targetLinks = gsap.utils.toArray(".target-link")

    let scaleAnimation = gsap.timeline({ paused: true })

    scaleAnimation
      .to(".cursor-outline", {
        scale: 1
      })
      .to(".cursor-dot", {
        scale: 1,
        duration: 0.35
      }, 0)

    targetLinks.forEach((targetLink) => {
      targetLink.addEventListener("mouseenter", (e) => {
        console.log('play')
        scaleAnimation.play()
      })

      targetLink.addEventListener("mouseleave", (e) => {
        console.log('reverse')
        scaleAnimation.reverse()
      })
    })

  })

  return (
    <>
      <div className="cursor-outline"></div>
      <div className="cursor-dot"></div>
    </>
  )
}
