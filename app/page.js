'use client'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
// import gsap
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
// framer motion
import { motion, stagger, useAnimate, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
// headless ui
import { Disclosure, Transition } from '@headlessui/react'
// components
import ArrowRightIcon from './_components/ui/ArrowRightIcon'
import ChevronRightIcon from './_components/ui/ChevronRightIcon'
import MapPin from './_components/ui/MapPin'
import Shape01 from './_components/shapes/shape01'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {

  return (
    <>
      <Hero />
      <ParallaxScroll />
      <Locations />
      <GiftCards />
    </>
  )
}

function Hero() {
  const mobileRef = useRef(null)
  const isInView = useInView(mobileRef)

  return (
    <section>
      {/* DESKTOP VIEW */}
      <div className="relative hidden lg:block">
        <div className="-z-10 absolute w-[100dvw] h-full bg-rose-100" />
        <header className="pt-16 m-auto w-max">
          {/* #fec49b */}{/* #FEBA76 */}{/* #fdba74 orange-300 */}
          {/* #fda4af rose-300 */}{/*  #FDBA74, #FDB67E, #FDB388, #FDAF92, #FDAB9B, #FDA8A5, #FDA4AF */}
          <div className="bg-[rgba(253,_192,_129,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(253,_192,_129,_0.8),_0px_0px_0px_16px_rgba(253,_199,_143,0.6),_0px_0px_0px_24px_rgba(253,_206,_157,_0.4),_0px_0px_0px_32px_rgba(253,_213,_171,_0.2),_0px_0px_0px_40px_rgba(254,_220,_185,_0.1)]">
            <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
          </div>
        </header>
        <section className="px-8 xl:px-0 flex flex-col-reverse justify-center md:gap-8 md:flex-row md:h-[100vh] mx-auto max-w-7xl py-16">
          <div className="relative flex items-center justify-center md:w-[25dvw] lg:w-[40dvw] xl:w-[25dvw]">
            <Shape01 className="w-full" />
            <div className="absolute left-0 right-0 w-3/4 mx-auto space-y-6 text-white">
              <h2 className="capitalize text-primary-50">Because every smile is unique</h2>
              {/* <h2 className="capitalize text-primary-50">Oral health.<br/>Our passion.<br/>Our pride.</h2> */}
              <span className="flex items-center gap-4">
                <Link href="/book-now" className="flex items-center gap-2 p-4 transition-colors duration-300 ease-in-out rounded-md text-zinc-100 bg-primary-50 hover:bg-primary-30 group">
                  Book Now
                  {/* <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" /> */}
                </Link>
                <Link href="/our-team" className="p-4 rounded-md text-primary-30 group">
                  <span className="flex items-center gap-2">
                    Our Team <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" />
                  </span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-50 ease-in-out" />
                </Link>
              </span>
            </div>
          </div>
          <div className="bg-center bg-no-repeat bg-cover rounded-full w-[20dvw]" style={{
            backgroundImage: "url(/../../images/mainsectionimage.jpg)",
            minHeight: "80vh",
          }} />
        </section>
      </div>
      {/* MOBILE VIEW */}
      <div className="relative overflow-hidden lg:hidden w-dvw h-dvh">
        <header className="z-0 pt-16 m-auto w-max">
          <div className="bg-[rgba(230,_123,_142,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(230,_123,_142,_0.8),_0px_0px_0px_16px_rgba(234,_144,_160,_0.6),_0px_0px_0px_24px_rgba(238,_166,_179,_0.4),_0px_0px_0px_32px_rgba(238,_166,_179,_0.2),_0px_0px_0px_40px_rgba(246,_208,_215,_0.05)]">
            <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
          </div>
        </header>
        <img className="absolute inset-0 object-cover w-full h-full mx-auto -z-10" src="/../../images/mainsectionimage_glass.jpg" />
        <div ref={mobileRef} style={{
            transform: isInView ? "none" : "translateX(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}
          className="absolute right-4 flex flex-col items-center justify-center  bg-gray-400 border border-gray-200 rounded-full bottom-[8vh] w-[85dvw] md:w-[50dvw] aspect-square backdrop-filter bg-clip-padding backdrop-blur-md bg-opacity-30"
        >
          <div className="flex flex-col items-start justify-center w-2/3 ml-4 rounded-full aspect-square">
            <h2 className="text-transparent capitalize font-helvetica-now-thin bg-clip-text bg-gradient-to-br from-primary-70 to-primary-100">Because every smile is unique</h2>
            <span className="flex items-center justify-between gap-4 mt-8">
              <Link href="/book-now" className="flex items-center gap-2 p-4 transition-colors duration-300 ease-in-out rounded-md text-zinc-100 bg-primary-40 hover:bg-primary-50 group">
                Book Now
                {/* <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" /> */}
              </Link>
              <Link href="/our-team" className="p-4 rounded-md text-primary-50 group">
                <span className="flex items-center gap-2">
                  Our Team <ArrowRightIcon className="w-4 h-4" />
                </span>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-50 ease-in-out" />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ParallaxScroll() {
  const main = useRef()

  useGSAP(() => {
    const sections = gsap.utils.toArray(".panel")
    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: () => section.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      })
  })}, { scope: main })

  return (
    <div ref={main}>
      <div className="panel h-[100dvh] bg-[#a3bba3]">
        <Invisalign />
      </div>
      <div className="panel h-[100dvh] bg-[#a3bba3] border-t-2 border-zinc-700 rounded-t-3xl">
        <DamonBraces />
      </div>
      <div className="panel h-[100dvh] bg-white border-t-2 border-zinc-700 rounded-t-3xl overflow-hidden">
        <AdvancedTech />
      </div>
    </div>
  )
}

function Invisalign() {
  const sectionRef = useRef()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "center center"],
  })
  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  const scale = useTransform(springScroll, [0, 1], [1.2, 0.9])
  const transformText = useTransform(springScroll, [0, 1], ["0%", "150%"])
  const transformCase = useTransform(springScroll, [0, 1], ["150%", "0%"])
  const transformRetainer = useTransform(springScroll, [0, 1], ["-150%", "-100%"])

  return (
    <section ref={sectionRef} className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start">
      <motion.div style={{ translateY: transformText }} className="py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max lg:w-1/2 md:py-0">
        <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Invisalign</h1>
        <h4>Top 1% Invisalign providers</h4>
        {/* <h4>As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</h4> */}
        <Link href="/invisalign" className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group">
          <span>Learn More</span>
          <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
            <span>Learn More</span>
          </div>
        </Link>
      </motion.div>
      <div className="lg:w-1/2">
        <motion.img style={{ translateY: transformCase }} className="object-cover w-full h-auto mx-auto object-start" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
        <motion.img style={{ translateY: transformRetainer, scale }} className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
      </div>
    </section>
  )
}

function DamonBraces() {
  return (
    <section className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-center">
      <div className="h-auto lg:w-1/2">
        {/* <img className="object-cover object-center w-full h-full mx-auto"  src="/../../../images/faster_treatment_time.gif" alt="faster treatment time" /> */}
      </div>
      <div className="py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max lg:w-1/2 md:py-0">
        <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Damon Bracket</h1>
        <h4>Less appointments. Faster treatment time</h4>
        <Link href="/braces" className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group">
          <span>Explore</span>
          <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
            <span>Explore</span>
          </div>
        </Link>
      </div>
    </section>
  )
}

function AdvancedTech() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], ["500%", "-100%"])

  return (
    <section className="relative flex flex-col py-24 mx-auto overflow-hidden lg:justify-center lg:flex-row lg:items-center h-[100dvh]">
      <div className="relative max-w-2xl py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max md:py-0">
        <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Advanced Technology</h1>
        <h4>Our doctors have been pioneering the most comfortable appliances for your treatment since 2005</h4>
        <Link href="/invisalign" className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group">
          <span>Learn More</span>
          <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
            <span>Learn More</span>
          </div>
        </Link>
        <motion.img  className="absolute bottom-0 right-0 z-0 w-3/4 h-auto translate-x-1/2 translate-y-1/2" src="/../../images/dotcircle.png" alt="" />
      </div>
      <motion.div style={{ scale }} className="absolute inset-0 top-0 left-0 w-full h-full -z-10">
        <svg viewBox="0 0 256 256" className="w-full h-full">
          <g>
            <path
              fill="#a3bba3"
              d="M10,71.6c0,17.2,4.5,36.1,12.3,52c17,34.7,49.9,58.6,88.4,64.6c8.9,1.4,25.9,1.4,34.5,0c28.3-4.4,53.7-18.4,71.8-39.4c13.2-15.4,22.2-33.4,26.2-52.4c1.7-8,2.8-18.3,2.8-25.2v-4.5H128H10V71.6z"
            />
          </g>
        </svg>
      </motion.div>
    </section>
  )
}

function Locations() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false})
  const [scope, animate] = useAnimate()
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [activeDisclosurePanel, setActiveDisclosurePanel] = useState(null)

  function toggleDisclosurePanels(newPanel) {
    if (activeDisclosurePanel) {
      if (activeDisclosurePanel.key !== newPanel.key && activeDisclosurePanel.open) {
        activeDisclosurePanel.close()
      }
    }
    setActiveDisclosurePanel({
      ...newPanel,
      open: !newPanel.open
    })
  }

  const locations = [
    {
      location: "Allentown",
      addressLine1: "1251 S Cedar Crest Blvd",
      addressLine2: "Suite 210 Allentown, PA 18103",
      mapbox_map_title: "FreySmiles Allentown [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALLENTOWN,
      hours: [
        { "Mon": "11:00 AM - 7:00 PM" },
        { "Tue": "11:00 AM - 7:00 PM" },
        { "Wed": "8:00 AM - 5:30 PM" },
        { "Thu": "7:00 AM - 4:30 PM" },
      ]
    },
    {
      location: "Bethlehem",
      addressLine1: "2901 Emrick Boulevard",
      addressLine2: "Bethlehem, PA 18020",
      mapbox_map_title: "FreySmiles Bethlehem [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_BETHLEHEM,
      hours: [
        { "Tue": "11:00 AM - 7:00 PM" },
        { "Thu": "7:00 AM - 4:30 PM" },
      ]
    },
    {
      location: "Schnecksville",
      addressLine1: "4155 Independence Drive",
      addressLine2: "Schnecksville, PA 18078",
      mapbox_map_title: "FreySmiles Schnecksville [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_SCHNECKSVILLE,
      hours: [
        { "Mon": "11:00 AM - 7:00 PM" },
        { "Tue": "11:00 AM - 7:00 PM" },
        { "Thu": "7:00 AM - 4:30 PM" },
      ]
    },
    {
      location: "Lehighton",
      addressLine1: "1080 Blakeslee Blvd Dr E",
      addressLine2: "Lehighton, PA 18235",
      mapbox_map_title: "FreySmiles Lehighton [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_LEHIGHTON,
      hours: [
        { "Mon": "11:00 AM - 7:00 PM" },
        { "Thu": "7:00 AM - 4:30 PM" },
      ]
    }
  ]

  useEffect(() => {
    animate("div", isInView
      ? { opacity: 1, transform: "translateX(0px)", scale: 1,
      } // filter: "blur(0px)"
      : { opacity: 0, transform: "translateX(-50px)", scale: 0.3,
      }, // filter: "blur(20px)"
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    )
  }, [isInView])

  return (
    <section ref={ref} id="locations" className="mt-[100vh] flex flex-col justify-center w-full mx-auto my-32 lg:flex-row max-w-7xl">
      {/* LEFT */}
        <div className="z-10 lg:w-1/2 lg:py-0">
          <motion.div
            className="p-6 space-y-10"
            style={{
              transform: isInView ? "none" : "translateY(-50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
            }}
          >
            <span className="flex items-baseline mt-4">
              <h1 className="tracking-tight uppercase font-helvetica-now-thin text-primary-50">Our Locations</h1>
              <MapPin className="ml-2 transition-all duration-300 hover:animate-bounce hover:cursor-pointer" />
            </span>
            <p>We have 4 incredible offices for your ultimate convenience. Our orthodontists and FreySmiles Team are excited to serve families in the Allentown, Bethlehem, Easton, Schnecksville and Lehighton communities.</p>
            <Link
              href="/book-now"
              className="inline-block px-6 py-4 text-white transition duration-300 ease-linear rounded-full underline-offset-8 bg-primary-50 hover:bg-secondary-50 group"
            >
              Schedule an evaluation today
              <span className="block h-[1px] transition-all duration-300 ease-linear bg-white rounded-full max-w-0 group-hover:max-w-full"></span>
            </Link>
          </motion.div>

          {/* LOCATIONS LIST */}
          <motion.div className="flex flex-col space-y-4" style={{
            transform: isInView ? "none" : "translateX(-50px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
          }}>
            <button
              className={`${
                selectedLocation === "All" ? "text-secondary-50 underline" : ""
              } self-end transition-all duration-300 ease-linear w-max text-primary-20 hover:text-secondary-50 mr-6`}
              onClick={() => setSelectedLocation("All")}
            >
              {selectedLocation === "All" ? "Showing All Locations" : "Show All Locations"}
            </button>
            <dl ref={scope} className="divide-y divide-primary-70">
              {locations.map((l, i) => (
                <Disclosure as="div" key={l.location} className={`${selectedLocation === l.location ? "bg-primary-30 text-primary-95" : ""} px-4 py-6 transition-all duration-300 ease-linear cursor-pointer hover:bg-primary-50 hover:text-white group text-primary-20`}>
                  {(panel) => {
                    const { open, close } = panel
                    return (<>
                      <Disclosure.Button className="grid w-full grid-cols-12 text-left sm:px-0" onClick={() => {
                        if (!open) close()
                        toggleDisclosurePanels({...panel, key: i})
                        setSelectedLocation(l.location)
                      }}>
                        <dt className="col-span-5 uppercase">
                          <h6>{l.location}</h6>
                        </dt>
                        <dd className="col-span-7">
                          <span className="flex items-center justify-between">
                            <p>
                              {l.addressLine1}
                              <br />
                              {l.addressLine2}
                            </p>
                            <ChevronRightIcon className="w-4 h-4 ui-open:rotate-90 ui-open:transform" />
                          </span>
                        </dd>
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel as="div" className="grid grid-cols-12 mt-6">
                          <ul className="col-span-7 col-start-6 text-left">
                            <h6 className="mb-2 font-medium uppercase">Office Hours:</h6>
                            {l.hours.map((hour, index) => (
                              <li key={index}>{Object.keys(hour)[0]}: {Object.values(hour)[0]}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </Transition>
                    </>)
                  }}
                </Disclosure>
              ))}
            </dl>
          </motion.div>
        </div>

      {/* RIGHT */}
        <motion.div className="h-screen min-h-max lg:w-1/2 lg:h-auto" style={{
          opacity: isInView ? 1 : 0,
          filter: isInView ? "blur(0px)" : "blur(16px)",
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }}>
          <iframe width="100%" height="100%"
            src={
              selectedLocation === "All"
              ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
              : locations.find((l) => l.location === selectedLocation).mapbox_iframe_url
            }
            title={
              selectedLocation === "All"
              ? "FreySmiles All Locations [w/ Colors]"
              : locations.find((l) => l.location === selectedLocation).mapbox_map_title
            }
            style={{ border: "none" }}
          />
        </motion.div>
    </section>
  )
}

function GiftCards() {
  const ref = useRef()
  const isInView = useInView(ref)

  return (
    <section ref={ref} className="z-10 h-[60dvh] relative my-24 group overflow-hidden hover:cursor-pointer" style={{
      transform: isInView ? "none" : "translateY(100px)",
      opacity: isInView ? 1 : 0,
      transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
    }}>
      <div className="absolute inset-0 w-full h-full flex justify-start items-start bg-primary-30 bg-opacity-80 text-white [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(30%_at_0%_0%)] lg:group-hover:[clip-path:circle(35%_at_0%_0%)] group-hover:bg-opacity-100 motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out" />
      <Link href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`} target='_blank' className="absolute inset-0 w-full h-full pl-[12%] pt-[18%] lg:pl-[6%] lg:pt-[8%] lg:group-hover:pl-[8%] lg:group-hover:pt-[12%] group-hover:duration-[1s] text-white">Send a Gift Card</Link>
      <img src="/../../images/giftcards/gift_cards_mockup.jpg" alt="gift cards mockup" className="absolute inset-0 object-cover object-center w-full h-full -z-10" />
    </section>
  )
}