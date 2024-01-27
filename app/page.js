'use client'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
// Swiper.js
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import SwiperCore from 'swiper/core'
import { Mousewheel, Pagination } from 'swiper/modules'
// gsap
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger'
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother'
// framer motion
import { motion, stagger, useAnimate, useInView } from 'framer-motion'
// headless ui
import { Disclosure, Transition } from '@headlessui/react'
// components
import ArrowRightIcon from './_components/ui/ArrowRightIcon'
import ChevronDownIcon from './_components/ui/ChevronDownIcon'
import ChevronRightIcon from './_components/ui/ChevronRightIcon'
import MapPin from './_components/ui/MapPin'
import Shape01 from './_components/shapes/shape01'

import useIsomorphicLayoutEffect from '@/_helpers/isomorphicEffect'

SwiperCore.use([Mousewheel, Pagination])

export default function Home() {

  return (
    <>
      <Hero />
      {/* <Carousel /> */}
      <Features />
      <Locations />
      <GiftCards />
    </>
  )
}

function Hero() {

  return (
    <div className="relative">
      <div className="-z-10 absolute w-[100vw] h-full bg-rose-100" />
      <header className="pt-16 m-auto w-max">
        {/* #fec49b */}
        {/* #FEBA76 */}
        {/* #fdba74 orange-300 */}
        {/* #fda4af rose-300 */}
        {/*  #FDBA74, #FDB67E, #FDB388, #FDAF92, #FDAB9B, #FDA8A5, #FDA4AF */}
        <div className="bg-[#FDBA74]/80 rounded-full shadow-[0px_0px_0px_8px_rgba(253,_186,_116,_0.4),_0px_0px_0px_16px_rgba(253,_181,_131,_0.3),_0px_0px_0px_24px_rgba(253,_175,_146,_0.2),_0px_0px_0px_32px_rgba(253,_170,_160,_0.1),_0px_0px_0px_40px_rgba(253,_164,_175,_0.05)]">
          <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
        </div>
      </header>
      <section className="px-8 xl:px-0 flex flex-col-reverse justify-center md:gap-8 md:flex-row md:h-[100vh] mx-auto max-w-7xl py-16">
        <div className="relative flex items-center justify-center md:w-1/2">
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
        <div className="bg-center bg-no-repeat bg-cover rounded-full md:w-1/2" style={{
          backgroundImage: "url(/../../images/mainsectionimage.jpg)",
          minHeight: "80vh",
        }} />
      </section>
    </div>
  )
}

function Features() {
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    const smoother = ScrollSmoother.create({
      smooth: 1,
      normalizeScroll: true,
      ignoreMobileResize: true,
      effects: true,
      //preventDefault: true,
      //ease: 'power4.out',
      //smoothTouch: 0.1, 
    })

  }, [])
  
  return (
    <section className="container px-0 mx-auto h-[50vh] bg-white rounded-lg md:flex md:items-center md:space-x-28 bg-opacity-5 my-44">		
      <div className="relative py-12 pl-6 space-y-6 border-l-4 border-pink-500 md:py-0">
        <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Invisalign</h1>
        <h4>As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</h4>
      </div>
      <div className="relative w-full h-full rounded-lg overflow-show"> 
        {/* <img className="absolute bottom-0 mx-auto h-auto object-cover w-[100%]" data-speed="auto" src="/../../../images/blobpurple.png" alt="purple blob" /> */}
        <img className="absolute -bottom-1/2 mx-auto h-auto object-cover w-[150%]" data-speed="auto" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
        <img className="absolute -bottom-1/4 left-1/4 mx-auto h-auto object-cover w-[75%]" data-speed="auto" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
      </div>
    </section>
  )
}

function Carousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [activeIndex, setActiveIndex] = useState(0)

  const urls = [
    "url('/../../images/_mesh_gradients/39. Prelude.jpg')",
    "url('/../../images/_mesh_gradients/14. Prim.jpg')",
    "url('/../../images/_mesh_gradients/65. Prim.jpg')",
  ]

  const handleBackgroundChange = (index) => {
    setActiveIndex(index)
  }

  return (
    <div ref={ref} style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: `center / cover no-repeat ${isInView ? urls[activeIndex] : ""}`,
      opacity: isInView ? 1 : 0,
      transition: isInView ? "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s" : "",
    }}>
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={30}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
        style={{
          maxWidth: '80vw',
          maxHeight: '80vh',
          '--swiper-pagination-color': '#ad79e3', // primary-60
          transform: isInView ? "translateY(0px)" : "translateY(200px)",
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          opacity: isInView ? 1 : 0,
        }}
        onSlideChange={(swiper) => handleBackgroundChange(swiper.activeIndex)}
      >
        <SwiperSlide>
          <div className="flex items-center justify-between h-full mx-auto max-w-7xl">
            <figure className="w-1/3">
              <img
                className="object-contain object-left w-full h-full"
                src="/../../images/aligner.png"
                alt="invisalign"
              />
            </figure>
            <span className="flex flex-col-reverse items-center justify-center w-1/3 h-full text-primary-40">
              <p className="[writing-mode:vertical-lr] rotate-180 font-altero text-6xl [font-size:_clamp(2rem,5vw,6rem)]">Invis</p>
              <p className="[writing-mode:vertical-lr] rotate-180 font-altero-outline [font-size:_clamp(2rem,5vw,6rem)]">align</p>
            </span>
            <div className="flex flex-col items-center w-1/3 px-8 mr-16 space-y-4 lg:px-0 text-zinc-800">
              <p className="text-center lg:text-2xl">As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</p>
              <Link
                href="/invisalign"
                className="lg:text-xl inline-block px-6 py-2 ease-linear border rounded-full w-max border-[#7781d9] hover:bg-[#7781d9] hover:border-0 hover:text-white"
              >
                Start Your Journey
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-between h-full mx-auto max-w-7xl">
            <figure className="w-1/3">
              <img
                className="object-contain object-left w-full h-full"
                src="/../../images/damonfull.png"
                alt="damon braces on teeth"
              />
              <img
                className="object-contain object-left w-1/2 h-auto mx-auto"
                src="/../../images/damontech.png"
                alt="damon bracket"
              />
            </figure>
            <span className="flex justify-center w-1/3 h-full text-center text-primary-40">
              <p className="[writing-mode:vertical-lr] font-altero mt-48 [font-size:_clamp(1rem,5vw,4rem)] [line-height:_clamp(2rem,5vw,4rem)] rotate-180">Damon</p>
              <p className="[writing-mode:vertical-lr] font-altero-outline [font-size:_clamp(1rem,5vw,4rem)] [line-height:_clamp(2rem,5vw,4rem)] rotate-180">Bracket</p>
            </span>
            <div className="flex flex-col items-center w-2/6 px-8 mr-16 space-y-4 text-zinc-800">
              <p className="text-center lg:text-2xl">Combining self-ligating braces with advanced archwires clinically proven to move teeth quickly and comfortably.</p>
              <Link
                href="/braces"
                className="lg:text-xl inline-block px-6 py-2 ease-linear border rounded-full w-max border-[#e67fb4] hover:bg-[#e67fb4] hover:border-0 hover:text-white"
              >
                Damon System
              </Link>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-between h-full mx-auto max-w-7xl">
            <figure className="w-1/3">
              <img
                className="object-contain object-left w-2/3 h-auto mx-auto"
                src="/../../images/itero2.png"
                alt="itero2"
              />
            </figure>
            <span className="flex justify-center w-1/3 h-full text-center text-primary-40">
              <p className="[writing-mode:vertical-lr] rotate-180 font-altero mt-48 [font-size:_clamp(2rem,5vw,4rem)] [line-height:_clamp(2rem,5vw,4rem)]">Advanced</p>
              <p className="[writing-mode:vertical-lr] rotate-180 font-altero-outline [font-size:_clamp(2rem,5vw,4rem)] [line-height:_clamp(2rem,5vw,4rem)]">Technology</p>
            </span>
            <div className="flex flex-col items-center w-1/3 px-8 mr-16 space-y-4 text-zinc-800">
              <p className="text-center lg:text-2xl">
                We offer Invisalign without Impressions. Say goodbye to goopy impressions with our iTero digital scanner.
              </p>
              <Link
                href="/"
                className="lg:text-xl inline-block px-6 py-2 ease-linear border rounded-full w-max border-[#f2ab79] hover:bg-[#f2ab79] hover:border-0 hover:text-white"
              >
                Learn More
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
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
    <section ref={ref} id="locations" className="flex flex-col justify-center w-full mx-auto my-32 lg:flex-row max-w-7xl">
      {/* LEFT */}
        <div className="lg:w-1/2 lg:py-0">
          <motion.div
            className="p-6 space-y-10 overflow-auto"
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
    <section ref={ref} className="relative max-w-screen-lg mx-auto my-24 group" style={{
      transform: isInView ? "none" : "translateY(100px)",
      opacity: isInView ? 1 : 0,
      transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"    
    }}>
      <Link href={`${process.env.REACT_APP_SQUARE_GIFT_CARDS_URL}`} target='_blank'>
        <div className="absolute inset-0 w-full h-full bg-primary-30 bg-opacity-80 text-white motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(35%_at_0%_0%)] group-hover:[clip-path:circle(75%_at_0%_0%)] group-hover:bg-opacity-100 flex justify-start items-start">
          <span className='block my-[12%] mx-[6%] md:mx-[10%] md:my-[16%] lg:my-[8%] lg:mx-[3%] lg:px-12 lg:py-8 group-hover:mx-20 group-hover:my-32 transition-all group-hover:duration-[1s] ease-in-out md:group-hover:my-[20%] md:group-hover:mx-[16%]'>Send a Gift Card</span>
        </div>
        <img src="../../images/giftcards/gift_cards_mockup.jpg" alt="gift cards mockup" />
      </Link>
    </section>
  )
}