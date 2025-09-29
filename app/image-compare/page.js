'use client'
import './style.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

const MainComponent = () => {
  const container = useRef(null)
  const after = useRef(null)
  const afterImg = useRef(null)
  const slider = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: () => `+=${container.current.offsetHeight}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          markers: true,
        },
        defaults: { ease: 'none' },
      })

      Draggable.create(slider.current, {
        type: 'x',
        bounds: container.current,
        inertia: true,
        onDrag: function() {
          const progress = gsap.utils.clamp(0, 1, this.x / this.maxX)
          tl.progress(progress)
        },
      })

      tl.fromTo(after.current, { xPercent: 0, x: 0 }, { xPercent: 50 }, 0)
      tl.fromTo(afterImg.current, { xPercent: 0, x: 0 }, { xPercent: -50 }, 0)
      tl.fromTo(after.current, { xPercent: 50, x: 0 }, { xPercent: 100 }, 1)
      tl.fromTo(afterImg.current, { xPercent: -50, x: 0 }, { xPercent: -100 }, 1)
    })
    
    return () => ctx.revert()
  }, [])

  return (
    <>
    <div className='h-screen w-full bg-zinc-300' />
    <div ref={container} className='ImageComparison-container'>
      <div className='ImageComparisonItem ImageComparisonItem-before'>
        <img src='/images/test/base.jpg' alt='before image' />
      </div>
      <div ref={after} className='ImageComparisonItem ImageComparisonItem-after'>
        <img ref={afterImg} src='/images/test/hover.jpg' alt='after image' />
      </div>
      <div ref={slider} className='ImageComparison-slider'>
        <div className='ImageComparisonSlider-dot' />
        <div className='ImageComparisonSlider-line' />
      </div>
    </div>
    </>
  )
}

export default function Page() {
  return (
    <MainComponent />
  )
}

// export default function Page() {
//   const container = useRef(null)
//   const afterRef = useRef(null)

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       let tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: container.current,
//           start: 'top top',
//           end: '+=100%',
//           pin: true,
//           scrub: 1,
//           markers: true,
//         },
//         defaults: { ease: 'none' },
//       })
//       tl.fromTo('.ImageComparison-after', { xPercent: 50, x: 0 }, { xPercent: 0 }, 0)
//       tl.fromTo('.ImageComparison-after img', { xPercent: -50, x: 0 }, { xPercent: 0 }, 0)

//     }, container.current)
//     return () => ctx.revert()
//   }, [])

//   return (
//     <>
//       <div className='h-screen bg-blue-400' />
//       <div ref={container} className='ImageComparison-container'>
//         <div className='ImageComparison-before'>
//           <img src='/images/test/base.jpg' alt='Before stage' />
//         </div>
//         <div ref={afterRef} className='ImageComparison-after'>
//           <img src='/images/test/base.jpg' alt='After stage' />
//         </div>
//       </div>
//       <div className='h-screen bg-green-500' />
//     </>
//   )
// }

// let tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: container.current,
//     start: 'top top',
//     end: '+=100%',
//     pin: true,
//     scrub: 1,
//     markers: true,
//   },
//   defaults: { ease: 'none' },
// })
// tl.fromTo('.ImageComparison-after', { xPercent: 50, x: 0 }, { xPercent: 0 }, 0)
// tl.fromTo('.ImageComparison-after img', { xPercent: -50, x: 0 }, { xPercent: 0 }, 0)