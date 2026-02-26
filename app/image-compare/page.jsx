'use client'
import './style.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'


export default function Page() {
  return (
    <>
      <div className="w-full h-screen" />
      <SectionOne />
      <div className="w-full h-screen" />
      <SectionTwo />
      <div className="w-full h-screen" />
    </>
  )
}

const SectionOne = () => {
  const sectionRef = useRef(null)
  const beforeDiv = useRef(null)
  const beforeImg = useRef(null)
  const afterDiv = useRef(null)
  const afterImg = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !beforeDiv.current || !beforeImg.current || !afterDiv.current || !afterImg.current) return

    const ctx = gsap.context(() => {
      gsap.set(afterDiv.current, { xPercent: 100, x: 0 })
      gsap.set(afterImg.current, { xPercent: -100, x: 0 })

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top+=200",
          end: "bottom+=1500 bottom",
          // end: "+=1000",
          scrub: 1,
          pin: true,
          // markers: true,
        },
        defaults: { ease: "none" },
      })
      
      tl.fromTo(sectionRef.current,
        {
          transform: "perspective(1200px) rotateX(10deg) rotateY(-10deg) rotateZ(-3deg)",
          scale: 0.85,
          opacity: 0.75,
        },
        {
          transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
          scale: 1,
          opacity: 1,
        },
      0)
      tl.fromTo(afterDiv.current, { xPercent: 100, x: 0 }, { xPercent: 0 }, 1)
        .fromTo(afterImg.current, { xPercent: -100, x: 0 }, { xPercent: 0 }, 1)
        .to(afterDiv.current, { borderLeft: "0px" }, 1.5)
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ImageCompare__Section"
    >
      <div ref={beforeDiv} className="ImageCompare__Before-Div">
        <img
          ref={beforeImg}
          className="ImageCompare__Before-Img"
          src="/images/jayden_before_smile.jpg"
          alt="before image"
        />
      </div>
      <div ref={afterDiv} className="ImageCompare__After-Div">
        <img
          ref={afterImg}
          className="ImageCompare__After-Img"
          src="/images/jayden_after_smile.jpg"
          alt="after image"
        />
      </div>
    </section>
  )
}

const SectionTwo = () => {
  const sectionRef = useRef(null)
  const beforeDiv = useRef(null)
  const beforeImg = useRef(null)
  const afterDiv = useRef(null)
  const afterImg = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !beforeDiv.current || !beforeImg.current || !afterDiv.current || !afterImg.current) return

    const ctx = gsap.context(() => {
      gsap.set(afterDiv.current, { xPercent: 100, x: 0 })
      gsap.set(afterImg.current, { xPercent: -100, x: 0 })

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top+=200",
          end: "bottom+=1500 bottom",
          // end: "+=1000",
          scrub: 1,
          pin: true,
          // markers: true,
        },
        defaults: { ease: "none" },
      })
      
      tl.fromTo(sectionRef.current,
        {
          transform: "perspective(1200px) rotateX(-10deg) rotateY(10deg) rotateZ(3deg)",
          scale: 0.85,
          opacity: 0.75,
        },
        {
          transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
          scale: 1,
          opacity: 1,
        },
      0)
      tl.fromTo(afterDiv.current, { xPercent: 100, x: 0 }, { xPercent: 0 }, 1)
        .fromTo(afterImg.current, { xPercent: -100, x: 0 }, { xPercent: 0 }, 1)
        .to(afterDiv.current, { borderLeft: "0px" }, 1.5)
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="ImageCompare__Section"
    >
      <div ref={beforeDiv} className="ImageCompare__Before-Div">
        <img
          ref={beforeImg}
          className="ImageCompare__Before-Img"
          src="/images/karoun_bite_b.jpg"
          alt="before image"
        />
      </div>
      <div ref={afterDiv} className="ImageCompare__After-Div">
        <img
          ref={afterImg}
          className="ImageCompare__After-Img"
          src="/images/karoun_bite_final.jpg"
          alt="after image"
        />
      </div>
    </section>
  )
}