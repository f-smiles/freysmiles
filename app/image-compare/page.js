'use client'
import './style.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

const MainComponent = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const distObj = { x: 0, maxY: 0 }
      let tween, ST, drag
      const updateHandler = () => {
        distObj.x = innerWidth - gsap.getProperty('.ImageComparison-handler', 'width')
        distObj.maxY = ScrollTrigger.maxScroll(window)
    
        let progress = 0
        if (tween) {
          progress = tween.progress()
          ST.kill()
          drag.applyBounds({ minX: 0, maxX: innerWidth })
        }
    
        tween = gsap.fromTo('.ImageComparison-handler', { x: 0 }, {
          x: distObj.x,
          ease: 'none',
          paused: true,
          overwrite: 'auto'
        }).progress(progress)
    
        ST = ScrollTrigger.create({
          animation: tween,
          trigger: '.ImageComparison-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        })
    
        drag = Draggable.create('.ImageComparison-handler', {
          trigger: '.ImageComparison-handler',
          type: 'x',
          bounds: { minX: 0, maxX: innerWidth },
          onDrag: function() {
            const progress = this.x / distObj.x
            tween.progress(progress)
            ST.scroll(progress * distObj.maxY)
          }
        })[0]
      }
      updateHandler()  
      ScrollTrigger.addEventListener('refreshInit', updateHandler)
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className='ImageComparison-container'>
      <div className='ImageComparison-after'>
        <div className='ImageComparison-handler'>
          <img src='/images/test/base.jpg' alt='after image' />
        </div>
      </div>
      <div className='ImageComparison-before'>
        <img src='/images/test/hover.jpg' alt='before image' />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <>
      {/* <TestComponent /> */}
      <MainComponent />
    </>
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