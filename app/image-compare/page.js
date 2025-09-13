'use client'
import './style.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, Draggable)

const TestComponent = () => {
  const barRef = useRef(null)
  const handlerRef = useRef(null)
  
  useEffect(() => {
    let barLength = 0
    let maxScroll = 0
    let trigger
    let draggable
  
    function updateHandler() {
      if (handlerRef.current && trigger) {
        gsap.set(handler, {
          x: barLength * trigger.scroll() / maxScroll
        })
      }
    }
  
    function onResize() {
      if (barRef.current && handlerRef.current) {
        maxScroll = ScrollTrigger.maxScroll(window)
        barLength = document.querySelector('.bar').offsetWidth - handler.offsetWidth
        updateHandler()
      }
    }
  
    const ctx = gsap.context(() => {
      trigger = ScrollTrigger.create({
        onRefresh: onResize,
        onUpdate: updateHandler,
      })
  
      if (handlerRef.current && barRef.current) {
        draggable = Draggable.create(handlerRef.current, {
          type: 'x',
          bounds: '.bar',
          onDrag: function() {
            trigger.scroll(this.x / barLength * maxScroll)
          }
        })[0]
      }
  
      onResize()
    })
    
    return () => {
      ctx.revert()
      trigger?.kill()
      draggable?.kill()
    }
  }, [])
  
  return (
    <>
      <div className='bar' ref={barRef}>
        <div id='handler' ref={handlerRef} />
      </div>
    
      <div className='h-[2000px]' />
    </>
  )
}

const MainComponent = () => {
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.ImageComparison-container',
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 1,
          markers: true,
        },
        defaults: { ease: 'none' },
      })
      // tl.fromTo('.ImageComparison-before', { xPercent: 0, x: 0 }, { xPercent: 100 }, 0)
        // .fromTo('.ImageComparison-before img', { xPercent: 0, x: 0 }, { xPercent: -100 }, 0)
      tl.fromTo('.ImageComparison-after', { xPercent: 100, x: 0 }, { xPercent: 0 }, 0)
        .fromTo('.ImageComparison-after img', { xPercent: -100, x: 0 }, { xPercent: 0 }, 0)
    })
    
    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div className='ImageComparison-container'>
      <div className='ImageComparison-before'>
        <img src='/images/test/base.jpg' alt='Before stage' />
      </div>
      <div className='ImageComparison-after'>
        <img src='/images/test/base.jpg' alt='After stage' />
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