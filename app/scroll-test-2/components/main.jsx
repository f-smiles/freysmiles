'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const containerRef = useRef(null)

  useEffect(() => {
    const items = gsap.utils.toArray('.container-item')

    let ctx = gsap.context(() => {

    }, containerRef.current)

    return () => { ctx.revert() }
  }, [])

  return (
    <section className='container-main'>
      <div ref={containerRef} className='container-wrapper'>
        <div className='container-items'>
          <div className='container-item item-1 border-2 border-cyan-300'>
            <div className="container-item-inner">
              <div className="container-item-inner-sticky">
                <div className="container-item-background"></div>
                <div className="container-item-content">
                  <span className="container-item-content-index">01</span>
                  <h3 className="container-item-content-title">Heading One</h3>
                  <p className="container-item-content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, asperiores. Ipsum reiciendis architecto cupiditate! Dolorum, cupiditate recusandae. Magni, obcaecati pariatur!</p>
                </div>
                <div className="container-item-imageContainer"
                  // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '100% 100% 0px', transform: 'translate3d(-60%, 0px, 0px)', }}
                >
                  <div className="container-item-imageContainer-inner"
                    // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '50% 50% 0px', transform: 'translate3d(0px, 0px, 0px)', }}
                  >
                  <div className="container-item-image">
                    <div className="placeholder" style={{ backgroundImage: 'url(https://cdn.sanity.io/images/zvxprgaj/production/f95ae49c2accec3c6f28026f270343eb5ab2cd6f-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: '0', }}/>
                    <img src="https://cdn.sanity.io/images/zvxprgaj/production/f95ae49c2accec3c6f28026f270343eb5ab2cd6f-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format" alt="" srcset="" />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-item item-2 border-2 border-fuchsia-300'>
            <div className="container-item-inner">
              <div className="container-item-inner-sticky">
                <div className="container-item-background"></div>
                <div className="container-item-content">
                  <span className="container-item-content-index">02</span>
                  <h3 className="container-item-content-title">Heading Two</h3>
                  <p className="container-item-content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, asperiores. Ipsum reiciendis architecto cupiditate! Dolorum, cupiditate recusandae. Magni, obcaecati pariatur!</p>
                </div>
                <div className="container-item-imageContainer"
                  // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '100% 100% 0px', transform: 'translate3d(-15%, 0px, 0px) scale(0.45)', }}
                >
                  <div className="container-item-imageContainer-inner"
                    // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '50% 50% 0px', transform: 'translate3d(0px, 0px, 0px) scale(1.55)', }}
                  >
                  <div className="container-item-image">
                    <div className="placeholder" style={{ backgroundImage: 'url(https://cdn.sanity.io/images/zvxprgaj/production/66c85d9f02641651fcb71673a5082f03e4605b5c-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: '0', }}/>
                    <img src="https://cdn.sanity.io/images/zvxprgaj/production/66c85d9f02641651fcb71673a5082f03e4605b5c-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format" alt="" srcset="" />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='container-item item-3 border-2 border-cyan-300'>
            <div className="container-item-inner">
              <div className="container-item-inner-sticky">
                <div className="container-item-background"></div>
                <div className="container-item-content">
                  <span className="container-item-content-index">03</span>
                  <h3 className="container-item-content-title">Heading Three</h3>
                  <p className="container-item-content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, asperiores. Ipsum reiciendis architecto cupiditate! Dolorum, cupiditate recusandae. Magni, obcaecati pariatur!</p>
                </div>
                <div className="container-item-imageContainer"
                  // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '100% 100% 0px', transform: 'translate3d(0%, 0px, 0px) scale(0.15)' }}
                >
                  <div className="container-item-imageContainer-inner"
                    // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '50% 50% 0px', transform: 'translate3d(0px, 0px, 0px) scale(1.85)', }}
                  >
                  <div className="container-item-image">
                    <div className="placeholder" style={{ backgroundImage: 'url(https://cdn.sanity.io/images/zvxprgaj/production/05d66dc16dc9f7d287f7784e1048c7d4c18f44cc-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&rect=0,0,1580,1560&fp-x=0.5&fp-y=0.4937185929648241&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: '0', }}/>
                    <img src="https://cdn.sanity.io/images/zvxprgaj/production/05d66dc16dc9f7d287f7784e1048c7d4c18f44cc-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&rect=0,0,1580,1560&fp-x=0.5&fp-y=0.4937185929648241&auto=format" alt="" srcset="" />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='hidden container-item item-4 border-2 border-fuchsia-300'>
            <div className="container-item-inner">
              <div className="container-item-inner-sticky">
                <div className="container-item-background"></div>
                <div className="container-item-content">
                  <span className="container-item-content-index">04</span>
                  <h3 className="container-item-content-title">Heading Four</h3>
                  <p className="container-item-content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, asperiores. Ipsum reiciendis architecto cupiditate! Dolorum, cupiditate recusandae. Magni, obcaecati pariatur!</p>
                </div>
                <div className="container-item-imageContainer"
                  // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '100% 100% 0px', transform: 'translate3d(0%, 0px, 0px) scale(0)' }}
                >
                  <div className="container-item-imageContainer-inner"
                    // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '50% 50% 0px', transform: 'translate3d(0px, 0px, 0px) scale(2)' }}
                  >
                  <div className="container-item-image">
                    <div className="placeholder" style={{ backgroundImage: 'url(https://cdn.sanity.io/images/zvxprgaj/production/8da3d80e45c9838650a8c587441b5475fe1b9bb1-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: '0', }}/>
                    <img src="https://cdn.sanity.io/images/zvxprgaj/production/8da3d80e45c9838650a8c587441b5475fe1b9bb1-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format" alt="" srcset="" />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='hidden container-item item-5 border-2 border-cyan-300'>
            <div className="container-item-inner">
              <div className="container-item-inner-sticky">
                <div className="container-item-background"></div>
                <div className="container-item-content">
                  <span className="container-item-content-index">05</span>
                  <h3 className="container-item-content-title">Heading Five</h3>
                  <p className="container-item-content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, asperiores. Ipsum reiciendis architecto cupiditate! Dolorum, cupiditate recusandae. Magni, obcaecati pariatur!</p>
                </div>
                <div className="container-item-imageContainer"
                  // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '100% 100% 0px', transform: 'translate3d(0px, 0px, 0px) scale(0)', }}
                >
                  <div className="container-item-imageContainer-inner"
                    // style={{ translate: 'none', rotate: 'none', scale: 'none', transformOrigin: '50% 50% 0px', transform: 'translate3d(0px, 0px, 0px) scale(2)', }}
                  >
                  <div className="container-item-image">
                    <div className="placeholder" style={{ backgroundImage: 'url(https://cdn.sanity.io/images/zvxprgaj/production/4bcc343a1d89969391cd79bf875e8481ea07ae7e-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format)', backgroundSize: 'cover', backgroundPosition: 'center center', opacity: '0', }}/>
                    <img src="https://cdn.sanity.io/images/zvxprgaj/production/4bcc343a1d89969391cd79bf875e8481ea07ae7e-1580x1580.jpg?w=1280&h=928&q=80&fit=crop&auto=format" alt="" srcset="" />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// gsap.to('.item-1', {
//   x: 0,
//   duration: 2,
// })
// gsap.to('.item-1 .container-item-imageContainer', {
//   transformOrigin: '100% 100% 0px',
//   transform: 'translate3d(-60%, 0px, 0px)',
//   duration: 2,
// })
// gsap.to('.item-2', {
//   x: 80,
//   duration: 2,
// })
// gsap.to('.item-2 .container-item-inner', {
//   x: -80,
//   duration: 2,
// })
// gsap.to('.item-3', {
//   x: 95,
//   duration: 2,
// })
// gsap.to('.item-3 .container-item-inner', {
//   x: -95,
//   duration: 2,
// })
// gsap.to('.item-4', {
//   x: 100,
//   duration: 2,
// })
// gsap.to('.item-4 .container-item-inner', {
//   x: -100,
//   duration: 2,
// })
// gsap.to('.item-5', {
//   x: 100,
//   duration: 2,
// })
// gsap.to('.item-5 .container-item-inner', {
//   x: 100,
//   duration: 2,
// })
// gsap.to('.item-2 .container-item-background', {
//   width: '100%',
//   duration: 2,
// })

function OldMain() {
  const containerRef = useRef(null)

  useEffect(() => {
    const items = gsap.utils.toArray('.item')

    let ctx = gsap.context(() => {
      gsap.to(items, {
        xPercent: -100 * (items.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${window.innerWidth * items.length}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      items.forEach((item, i) => {
        gsap.set(item, { zIndex: (i + 1) * 100 })
          // zIndex: items.length - i,
          // x: -33,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className='main'>
      <div className='main-wrapper'>
        <div className='items flex'>
          <div className='item w-[100dvw] h-[100dvh] bg-[#BFCCD8]'></div>
          <div className='item w-[100dvw] h-[100dvh] bg-[#B692A1]'></div>
        </div>
      </div>
    </div>
  )
}
