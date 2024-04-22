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

  useEffect(() => {
    animate(
      "div",
      isInView
        ? { opacity: 1, transform: "translateX(0px)", scale: 1 } // filter: "blur(0px)"
        : { opacity: 0, transform: "translateX(-50px)", scale: 0.3 }, // filter: "blur(20px)"
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    )
  }, [isInView])

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <section className="bg-[#E0D175]">
        <div className="block max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-[120rem] lg:px-8 lg:py-32">
          <h1 className="space-y-4 border lg:text-6xl font-agrandir-bold border-zinc-800">
            Come see us at any of our <br />
            <span className="relative inline-block lowercase border border-white font-editorial-new">
              four convenient locations<br/>
              <svg className="absolute h-1/2 bottom-0 left-0 text-[hsl(14_100%_52%)]" viewBox="0 0 229 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 19L29.4 39L57.7 19L86.1 39L114.5 19L142.8 39L171.2 19L199.6 39L228 19" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 19L29.4 39L57.7 19L86.1 39L114.5 19L142.8 39L171.2 19L199.6 39L228 19" stroke="currentColor" stroke-opacity="0.2" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 1L29.4 21L57.7 1L86.1 21L114.5 1L142.8 21L171.2 1L199.6 21L228 1" stroke="#9D9D9D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            or opt for a <br />
            <span className="relative inline-block lowercase border border-white font-editorial-new">virtual consultation</span>
          </h1>
          {/* hsl(14 100% 52%) */}
        </div>

        <div ref={ref} className="relative lg:min-h-full">
          <motion.div
            className="overflow-hidden h-80 lg:absolute lg:right-0 lg:h-full lg:w-1/2"
            style={{
              opacity: isInView ? 1 : 0,
              filter: isInView ? "blur(0px)" : "blur(16px)",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <iframe
              className="w-full h-full rounded-lg"
              // width="100%"
              // height="100%"
              src={process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS}
              // src={
              //   selectedLocation === "All"
              //     ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
              //     : locations.find((l) => l.location === selectedLocation)
              //         .mapbox_iframe_url
              // }
              title={
                selectedLocation === "All"
                  ? "FreySmiles All Locations [w/ Colors]"
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_map_title
              }
            />
          </motion.div>

          <div>
            <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
              <div className="relative gap-8 lg:gap-16">
                {/* <h1 className="font-neue-montreal text-[40px] uppercase">Come see us at any of our four convenient locations or opt for a virtual consultation</h1> */}
                <svg className="absolute -top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-36 h-36 text-[hsl(14_100%_52%)] rotate-[110deg]" viewBox="0 0 77 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.33755 84.3973C0.297616 62.7119 2.93494 39.8181 19.4192 23.8736C28.2211 15.3599 42.4944 12.5723 47.6281 26.2359C51.1245 35.5419 51.542 51.9945 41.0605 57.0865C29.486 62.7095 40.2945 35.2221 41.9942 32.4952C49.9497 19.7313 59.7772 11.6122 72.2699 3.78281C76.9496 0.849879 73.7108 0.477284 70.0947 1.13476C66.9572 1.7052 63.4035 2.43717 60.5291 3.81975C59.6524 4.24143 65.7349 2.73236 66.6827 2.44768C70.7471 1.22705 75.4874 -0.0219285 75.9527 5.60812C76.0274 6.5127 75.9956 14.9844 74.7481 15.2963C74.099 15.4586 71.0438 10.27 70.4642 9.65288C66.6996 5.64506 63.5835 4.42393 58.2726 5.11792" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {/* <svg
                  className="absolute top-0 left-0 right-0 border border-white w-36 h-36 text-[hsl(14_100%_52%)]"
                  viewBox="0 0 254 107"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 103.824C45.3292 106.086 85.2951 90.8282 118.182 63.953C129.508 54.6969 140.763 42.4172 147.387 29.1688C150.391 23.1616 154.398 11.338 149.274 5.78786C140.768 -3.42746 129.585 13.6307 125.893 19.9805C119.22 31.4586 124.234 53.8078 136.148 60.2613C158.264 72.2407 191.043 69.3799 215.315 68.3011C225.006 67.8703 234.869 65.4297 244.439 65.4297C248.152 65.4297 239.179 60.7699 237.794 59.5229C229.618 52.165 229.186 52.3018 239.27 58.7846C240.667 59.6823 250.92 65.2052 250.92 66.168C250.92 66.84 233.48 79.6822 231.887 81.6733"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                  />
                </svg> */}
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
                      selectedLocation === "All" ? "text-white " : ""
                    } self-end transition-all duration-300 ease-linear w-max  hover:text-secondary-50 mr-6`}
                    onClick={() => setSelectedLocation("All")}
                  >
                    {selectedLocation === "All"
                      ? "Showing All Locations"
                      : "Show All Locations"}
                  </button>

                  <dl ref={scope} className="divide-y ">
                    {locations.map((l, i) => (
                      <Disclosure
                        as="div"
                        key={l.location}
                        className={`${
                          selectedLocation === l.location ? "text-primary-95" : ""
                        } px-4 py-6 transition-all duration-300 ease-linear cursor-pointer  hover:text-white group text-white`}
                      >
                        {(panel) => {
                          const { open, close } = panel
                          return (
                            <>
                              <Disclosure.Button
                                className="grid w-full grid-cols-12 text-left sm:px-0"
                                onClick={() => {
                                  if (!open) close()
                                  toggleDisclosurePanels({ ...panel, key: i })
                                  setSelectedLocation(l.location)
                                }}
                              >
                                <dt className="col-span-5 ">
                                  <h6 className="text-xl">{l.location}</h6>
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
                                  className="grid grid-cols-12 mt-6"
                                >
                                  <ul className="col-span-7 col-start-6 text-left">
                                    <h6 className="mb-2 font-medium uppercase">
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
        </div>
      </section>
    </>
  )
}