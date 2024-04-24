"use client"
import { useEffect, useRef, useState } from "react"
import { motion, stagger, useAnimate, useInView } from "framer-motion"
import { Disclosure, Transition } from "@headlessui/react"
import ChevronRightIcon from "../_components/ui/ChevronRightIcon"

export default function Test() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const [scope, animate] = useAnimate()
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [activeDisclosurePanel, setActiveDisclosurePanel] = useState(null)

  function toggleDisclosurePanels(newPanel) {
    if (activeDisclosurePanel) {
      if (
        activeDisclosurePanel.key !== newPanel.key &&
        activeDisclosurePanel.open
      ) {
        activeDisclosurePanel.close()
      }
    }
    setActiveDisclosurePanel({
      ...newPanel,
      open: !newPanel.open,
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
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Wed: "8:00 AM - 5:30 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Bethlehem",
      addressLine1: "2901 Emrick Boulevard",
      addressLine2: "Bethlehem, PA 18020",
      mapbox_map_title: "FreySmiles Bethlehem [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_BETHLEHEM,
      hours: [{ Tue: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
    {
      location: "Schnecksville",
      addressLine1: "4155 Independence Drive",
      addressLine2: "Schnecksville, PA 18078",
      mapbox_map_title: "FreySmiles Schnecksville [w/ Colors]",
      mapbox_iframe_url:
        process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_SCHNECKSVILLE,
      hours: [
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Lehighton",
      addressLine1: "1080 Blakeslee Blvd Dr E",
      addressLine2: "Lehighton, PA 18235",
      mapbox_map_title: "FreySmiles Lehighton [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_LEHIGHTON,
      hours: [{ Mon: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
  ]

  const handleShowAllLocations = () => {
    activeDisclosurePanel.close()
    setSelectedLocation("All")
  }

  useEffect(() => {
    animate(
      "div",
      isInView
        ? { opacity: 1, transform: "translateX(0px)", scale: 1, filter: "blur(0px)"}
        : { opacity: 0, transform: "translateX(-50px)", scale: 0.3, filter: "blur(2px)" },
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    )
  }, [isInView])

  return (
    <>
      {/*
        --beige: #f8f1de;
        --black: #171616;
        --orange: #ff6432; hsl(14 100% 52%)
        --white: white;
        --rosemary: #147b5d;
        --rosemary-text: #fee5e1;
        bg-[#ff6432]
        ```
      */}
      <section className="bg-[#f8f1de]">
        <div id="locations-heading" className="relative block max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-[100rem] lg:px-8 lg:py-32">
          <h1 className="lg:text-6xl font-agrandir-bold text-[#171616]">
            Come see us at any of our{" "}
            <span className="relative inline-block my-8 leading-tight lowercase font-editorial-new underline-offset-8">
              four convenient locations
              <img className="absolute w-full h-auto -ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src="/../../images/ellipse.svg" />
            </span>{" "}
            or opt for a{" "}
            <span className="relative leading-tight lowercase font-editorial-new decoration-wavy underline-offset-8 decoration-[#147b5d] underline inline-block">virtual consultation</span>
          </h1>
          <svg className="absolute bottom-0 translate-y-1/2 left-0 translate-x-64 w-36 h-36 rotate-[120deg] text-[#ff6432]" viewBox="0 0 77 85" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.33755 84.3973C0.297616 62.7119 2.93494 39.8181 19.4192 23.8736C28.2211 15.3599 42.4944 12.5723 47.6281 26.2359C51.1245 35.5419 51.542 51.9945 41.0605 57.0865C29.486 62.7095 40.2945 35.2221 41.9942 32.4952C49.9497 19.7313 59.7772 11.6122 72.2699 3.78281C76.9496 0.849879 73.7108 0.477284 70.0947 1.13476C66.9572 1.7052 63.4035 2.43717 60.5291 3.81975C59.6524 4.24143 65.7349 2.73236 66.6827 2.44768C70.7471 1.22705 75.4874 -0.0219285 75.9527 5.60812C76.0274 6.5127 75.9956 14.9844 74.7481 15.2963C74.099 15.4586 71.0438 10.27 70.4642 9.65288C66.6996 5.64506 63.5835 4.42393 58.2726 5.11792" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div ref={ref} className="relative lg:min-h-full">
          <motion.div
            id="locations-map"
            className="overflow-hidden h-80 lg:absolute lg:right-0 lg:h-full lg:w-1/2"
            style={{
              opacity: isInView ? 1 : 0,
              filter: isInView ? "blur(0px)" : "blur(16px)",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <iframe
              className="w-full h-full rounded-lg"
              width="100%"
              height="100%"
              src={
                selectedLocation === "All"
                  ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_iframe_url
              }
              title={
                selectedLocation === "All"
                  ? "FreySmiles All Locations [w/ Colors]"
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_map_title
              }
            />
          </motion.div>

          <div id="locations-details">
            <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
              {/* LOCATIONS LIST */}
              <motion.div
                className="flex flex-col mt-10"
                style={{
                  transform: isInView ? "none" : "translateX(-50px)",
                  opacity: isInView ? 1 : 0,
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
              >
                <button
                  className={`${
                    selectedLocation === "All" ? "text-[#147b5d]" : ""
                  } self-end transition-all duration-300 ease-linear w-max mr-6 mb-6 underline underline-offset-4 hover:text-[#147b5d]`}
                  onClick={handleShowAllLocations}
                >
                  {selectedLocation === "All"
                    ? "Showing All Locations"
                    : "Show All Locations"}
                </button>

                <dl ref={scope}>
                  {locations.map((l, i) => (
                    <Disclosure
                      as="div"
                      key={l.location}
                      className={`${
                        selectedLocation === l.location ? "text-white" : ""
                      } px-4 py-6 transition-all duration-300 ease-linear cursor-pointer hover:text-white group text-white`}
                    >
                      {(panel) => {
                        const { open, close } = panel
                        return (
                          <>
                            <BezierCurve />

                            <Disclosure.Button
                              className="grid w-full grid-cols-12 grid-rows-1 text-left sm:px-0"
                              onClick={() => {
                                if (!open) close()
                                toggleDisclosurePanels({ ...panel, key: i })
                                setSelectedLocation(l.location)
                              }}
                            >
                              <dt className="col-span-5 row-start-1">
                                <h6 className="text-xl text-[#171616] uppercase font-agrandir-bold">{l.location}</h6>
                              </dt>
                              <dd className="col-span-7 row-start-1">
                                <span className="flex items-center justify-between">
                                  <p className="text-[#171616]">
                                    {l.addressLine1}
                                    <br />
                                    {l.addressLine2}
                                  </p>
                                  <ChevronRightIcon className="w-6 h-6 ui-open:rotate-90 ui-open:transform text-[#ff6432]" />
                                </span>
                              </dd>
                            </Disclosure.Button>
                            <Transition
                              show={open}
                              enter="transition-transform ease-out duration-300"
                              enterFrom="transform scale-y-0 opacity-0"
                              enterTo="transform scale-y-100 opacity-100"
                              leave="transition-transform ease-in duration-200"
                              leaveFrom="transform scale-y-100 opacity-100"
                              leaveTo="transform scale-y-0 opacity-0"
                            >
                              <Disclosure.Panel
                                as="div"
                                className="grid grid-cols-12"
                              >
                                <ul className="col-span-7 col-start-6 text-left text-[#147b5d] mt-4 mb-2">
                                  <h6 className="font-medium uppercase">
                                    Office Hours:
                                  </h6>
                                  {l.hours.map((hour, index) => (
                                    <li key={index}>
                                      {Object.keys(hour)[0]}:{" "}
                                      {Object.values(hour)[0]}
                                    </li>
                                  ))}
                                </ul>
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )
                      }}
                    </Disclosure>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function BezierCurve() {
  const container = useRef(null)
  const path = useRef(null)
  let progress = 0
  let time = Math.PI / 2 // want the initial time value to be 1; in sine graph y = 1 when x = pi / 2
  let reqId = null // everytime mouse enters and leaves line's bounding box, animation gets called causing simultaneous chains of it being called (this is bad), only want one request animation running at the same time
  let x = 0.5 // middle point is 1/2

  useEffect(() => {
    setPath(progress)
    window.addEventListener('resize', () => {
      setPath(progress)
    })
  }, [])

  {/*
    use svg container's width to get control point (center point) of quadratic bezier curve; control point = svg container's width / 2
    30 ==> svg height(60) divided by 2 to align the path within the center of the svg
  */}
  const setPath = (progress) => {
    const width = container.current.offsetWidth
    path.current.setAttributeNS(null, "d", `M 0 30 Q${width * x} ${30 + progress} ${width} 30`)
  }

  const manageMouseEnter = () => {
    if (reqId) {
      window.cancelAnimationFrame(reqId)
      resetAnimation()
    }
  }

  const manageMouseMove = (e) => {
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
  const lerp = (x, y, a) => x * (1 - a) + y * a

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
      <div ref={container} className="mb-[30px] col-span-12 row-start-2 h-[1px] w-full relative">
        {/* box for event listeners overlays the svg element */}
        <div
          onMouseEnter={manageMouseEnter}
          onMouseMove={(e) => {manageMouseMove(e)}}
          onMouseLeave={manageMouseLeave}
          className="h-[30px] relative -top-[15px] z-10 hover:h-[60px] hover:-top-[30px]"
        />
        <svg className="w-full h-[60px] -top-[30px] absolute">
          <path ref={path} strokeWidth={1} stroke="#147b5d" fill="none" />
        </svg>
      </div>
    </>
  )
}