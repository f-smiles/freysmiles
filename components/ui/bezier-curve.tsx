'use client'
import { useEffect, useRef } from 'react'

const BezierCurve = () => {
  const container = useRef<HTMLDivElement | null>(null)
  const path = useRef<SVGPathElement | null>(null)

  let progress = 0
  let time = Math.PI / 2 // want the initial time value to be 1 in sine graph y = 1 when x = pi / 2
  let reqId: number | null = null // everytime mouse enters and leaves line's bounding box, animation gets called causing simultaneous chains of it being called (this is bad), only want one request animation running at the same time
  let x = 0.5 // middle point is 1/2

  useEffect(() => {
    setPath(progress)
    window.addEventListener("resize", () => {
      setPath(progress)
    })
  }, [])

  {/*
    use svg container's width to get control point (center point) of quadratic bezier curve control point = svg container's width / 2
    30 ==> svg height(60) divided by 2 to align the path within the center of the svg
  */}
  const setPath = (progress: number) => {
    if (!path.current) return
    if (container.current) {
      const width = container.current.offsetWidth
      path.current.setAttributeNS(
        null,
        "d",
        `M 0 30 Q${width * x} ${30 + progress} ${width} 30`
      )
    }
  }

  const manageMouseEnter = () => {
    if (reqId) {
      window.cancelAnimationFrame(reqId)
      resetAnimation()
    }
  }

  const manageMouseMove = (e: React.MouseEvent) => {
    if (!path.current) return

    const { movementY, clientX } = e
    const { left, width } = path.current.getBoundingClientRect()
    // get value of x depending on where mouse is on the x-axis of the line
    x = (clientX - left) / width
    progress += movementY
    setPath(progress)
  }

  const manageMouseLeave = () => {
    animateOut()
  }

  {/*
    linear interpolation
    x: The value we want to interpolate from (start) => 10
    y: The target value we want to interpolate to (end) => 0
    a: The amount by which we want x to be closer to y => 10% or 0.1
    ex: value = lerp(value, 0, 0.1)
    if value = 10, bring that value close to 0 by 10% which will give 9
  */}
  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a

  // sine function, linear interpolation, recursivity
  const animateOut = () => {
    // sine function creates the "wobbly" line animation when mouse leaves the line
    const newProgress = progress * Math.sin(time)
    time += 0.25 // speed of bounce animation
    setPath(newProgress)
    progress = lerp(progress, 0, 0.05) // change 3rd lerp argument to change curve's bounce exaggeration

    // exit condition
    if (Math.abs(progress) > 0.75) {
      reqId = window.requestAnimationFrame(animateOut)
    } else {
      resetAnimation()
    }
  }

  const resetAnimation = () => {
    time = Math.PI / 2
    progress = 0
  }

  return (
    <>
      {/* line */}
      <div
        ref={container}
        className="col-span-12 row-start-2 h-[1px] w-full relative"
      >
        {/* box for event listeners overlays the svg element */}
        <div
          onMouseEnter={manageMouseEnter}
          onMouseMove={(e) => {
            manageMouseMove(e)
          }}
          onMouseLeave={manageMouseLeave}
          className="h-[30px] relative -top-[15px] z-10 hover:h-[60px] hover:-top-[30px]"
        />
        <svg className="w-full h-[60px] -top-[30px] absolute">
          <path ref={path} strokeWidth={1} stroke="#000" fill="none" />
        </svg>
      </div>
    </>
  )
}

export { BezierCurve }