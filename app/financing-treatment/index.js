'use client'
import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useIsomorphicLayoutEffect from '@/_helpers/isomorphicEffect'

const details = [
  {
    number: "1.",
    heading: "Complimentary consultation",
    body: "Initial consultations are always free of charge.",
    img: "/../../images/firstmeeting.jpg",
    alt: "FreySmiles team member warmly greeting a FreySmiles patient and shaking their hand",
  },
  {
    number: "2.",
    heading: "Payment plans are available",
    body:"We offer a variety of payment plans at no interest.",
    img: "/../../images/drawkit_treatment_plan.jpg",
    alt: "Scene of a girl sitting on top of bags holding a percent sign representing no interest payment at FreySmiles",
  },
  {
    number: "3.",
    heading: "No hidden costs",
    body: "Fees for diagnostic records, treatment visits, appliances.",
    img: "/../../images/financing_cost.jpg",
    alt: "No hidden fees",
  },
  {
    number: "4.",
    heading: "One year post-treatment follow up",
    body: "Retainers and retention visits for one year post-treatment included.",
    img: "/../../images/undraw_booking_secondary.png",
    alt: "Booking future appointments",
  }
]

export default function FinancingTreatment() {
  const lineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  })
  const spring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  let height = useTransform(spring, [0, 1], ["0%", "100%"])

  return (
    <>
    <div className="relative w-full mx-auto max-w-7xl">
      <section id="main-container" className="md:flex md:justify-between md:gap-x-6">
        {/* LEFT HALF DESKTOP SECTION */}
        <div ref={lineRef} id="left" className="hidden md:block md:w-1/3 md:pl-12">
          <Detail>
            <span className="absolute p-5 rounded-full bg-primary-60 -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4">1.</p>
            </span>
            <h4 className="capitalize text-primary-50">Complimentary Consultation</h4>
            <p>Initial consultations are always free of charge.</p>
          </Detail>
          <Detail>
            <span className="absolute p-5 rounded-full bg-primary-60 -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4">2.</p>
            </span>
            <h4 className="capitalize text-primary-50">Payment plans are available</h4>
            <p>We offer a variety of payment plans at no interest.</p>
          </Detail>
          <Detail>
            <span className="absolute p-5 rounded-full bg-primary-60 -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4">3.</p>
            </span>
            <h4 className="capitalize text-primary-50">No hidden costs</h4>
            <p>Fees for diagnostic records, treatment visits, appliances.</p>
          </Detail>
          <Detail>
            <span className="absolute p-5 rounded-full bg-primary-60 -left-12">
              <p className="absolute text-white -translate-x-2/4 -translate-y-2/4">4.</p>
            </span>
            <h4 className="capitalize text-primary-50">One year post-treatment follow up</h4>
            <p>Retainers and retention visits for one year post-treatment included.</p>
          </Detail>
          <motion.div
            className="absolute top-0 hidden w-[2px] h-full left-[22px] md:block bg-primary-60 -z-10"
            style={{ height }}
          />
        </div>
        {/* RIGHT HALF DESKTOP SECTION */}
        <div id="right" className="md:w-2/3 md:flex md:flex-col md:justify-center md:items-center">
          {/* MOBILE VIEW */}
          <div id="mobile-view" className="block space-y-16 md:space-y-0 md:hidden">
            {details.map((detail, index) => (
              <figure key={index} className="aspect-square">
                <img
                  src={detail.img}
                  alt={detail.alt}
                  className="object-cover object-center rounded-md"
                />
                <figcaption className="mt-6">
                  <h5 className="normal-case text-primary-40">{detail.number} {detail.heading}</h5>
                  <p className="text-gray-700">{detail.body}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          {/* DESKTOP VIEW */}
          <Images />
        </div>
      </section>
    </div>
    </>
  )
}

function Detail({ children }) {
  const isInViewRef = useRef(null)
  const isInView = useInView(isInViewRef)

  return (
    <div
      ref={isInViewRef}
      id="text-content"
      className="relative flex flex-col justify-center w-full h-screen pl-4 space-y-4"
      style={{
        transform: isInView ? "translateY(0px)" : "translateY(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
    >
      {children}
    </div>
  )
}

function Images() {
  const panelsRef = useRef(null)

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    let panels = gsap.utils.toArray(".panel")

    const ctx = gsap.context(() => {
      gsap.to(panels, {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".wrapper",
          pin: true,
          scrub: true,
          snap: 1 / (panels.length - 1),
          start: "top top",
          end: "bottom bottom",
        }
      })
    }, panelsRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={panelsRef} className="hidden h-full md:block wrapper">
      {details.map((detail, index) => (
        <figure
          key={index}
          className="flex flex-col items-center justify-center w-4/5 h-screen mx-auto overflow-hidden panel"
          >
          <img
            src={detail.img}
            alt={detail.alt}
            className="w-full h-auto rounded-xl"
          />
        </figure>
      ))}
    </div>
  )
}