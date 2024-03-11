'use client'
import Link from 'next/link'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, stagger, useAnimate, useMotionValue, useSpring } from 'framer-motion'
import { Dialog, Transition } from '@headlessui/react'
import { selectBag, removeFromBag } from '../_store/reducers/bagReducer'
import BagIcon from './ui/BagIcon'
import Bars2Icon from './ui/Bars2Icon'
import ChevronDownIcon from './ui/ChevronDownIcon'
import XIcon from './ui/XIcon'
import Sphere from './Sphere'

export default function Navbar() {
  const dispatch = useDispatch()

  const bag = useSelector(selectBag)

  const [isBagOpen, setIsBagOpen] = useState(false)
  const [about, setAbout] = useState(false)
  const [patient, setPatient] = useState(false)
  const [treatments, setTreatments] = useState(false)

  const about_us_links = [
    { name: "Our Team", href: "/our-team" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Testimonials", href: "/testimonials" },
  ]

  const patient_links = [
    { name: "Your Care", href: "/your-care" },
    { name: "Financing Treatment", href: "/financing-treatment" },
    { name: "Virtual Consultation", href: "/virtual-consultation" },
    { name: "Caring For Your Braces", href: "/caring-for-your-braces" },
  ]

  const treatments_links = [
    { name: "Invisalign", href: "/invisalign" },
    { name: "Braces", href: "/braces" },
    { name: "Early & Adult Orthodontics", href: "/early-adult-orthodontics" },
  ]

  const handleToggleBagPanel = () => {
    setIsBagOpen(!isBagOpen)
  }

  const handleToggleAbout = () => {
    setAbout(!about)
  }

  const handleTogglePatient = () => {
    setPatient(!patient)
  }

  const handleToggleTreatments = () => {
    setTreatments(!treatments)
  }

  const calculateSubtotal = () => {
    let subtotal = 0
    subtotal = bag
      .map((item) => (item.product.price) * item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
    return subtotal
  }

  const calculateItemsQuantity = () => {
    let itemsQuantity = 0
    itemsQuantity = bag
      .map((item) => item.quantity)
      .reduce((acc, cur) => acc + cur, 0)
    return itemsQuantity
  }

  const handleCheckout = async () => {
    const { data } = await axios.post("/api/checkout/checkout-sessions",
    bag,
    { "headers": {
        "Content-Type": "application/json"
      }
    })
    window.location.assign(data)
  }

  /* mobile nav */
  const [show, setShow] = useState(null)
  const handleToggleMobileNav = () => {
    // setShow((prevState) => !prevState)
    setShow(!show)
  }
  // const scope = useMobileNavAnimation(show)

  /* mouse cursor */
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 200 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }
    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
    }
  }, [])

  const variants = {
    default: {
      width: 32,
      height: 32,
    },
    hover: {
      width: 64,
      height: 64,
    }
  }

  const hoverEnter = () => setCursorVariant("hover")
  const hoverLeave = () => setCursorVariant("default")

  return (
    <header>
      <motion.div
        className="cursor"
        variants={variants}
        animate={cursorVariant}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* DESKTOP NAVBAR */}

      <nav id="desktop-nav" className="fixed bottom-0 left-0 right-0 z-20 hidden w-full mb-[6vh] lg:block">
        <div className="p-4 mx-auto text-sm transition duration-300 ease-in-out rounded-full shadow-md justify-evenly bg-gray-100/60 backdrop-blur-md hover:bg-white/70 hover:shadow-sm max-w-max">
          <ul className="relative flex items-center gap-8 justify-evenly">
            <li className="flex items-center font-medium tracking-wider uppercase transition duration-300 ease-in-out bg-white rounded-full shadow-md hover:bg-primary-50/60 active:bg-primary-50/80" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <Link href="/" className="inline-block p-4">
                {/* <HomeIcon className="w-4 h-4" /> */}
                <img className="w-4 h-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontics" />
              </Link>
            </li>
            <li onClick={handleToggleAbout} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <p className="font-medium uppercase transition-all duration-500 ease-linear rounded-full hover:text-primary-40 group">
                About
                <span className="block max-w-0 :max-w-full transition-all delay-150 duration-300 h-0.5 bg-secondary-60 ease-in-out"></span>
              </p>
            </li>
            {/* ABOUT PANEL */}
            <Transition.Root show={about} as={Fragment}>
              <Dialog as="div" className="relative z-20" onClose={setAbout}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setAbout(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {about_us_links && about_us_links.map((link, index) => (
                                  <li key={link.name}>
                                    <Link
                                      href={link.href}
                                      className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                      onClick={handleToggleAbout}
                                    >
                                      <h4>{link.name}</h4>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li onClick={handleTogglePatient} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <p className="font-medium uppercase transition-all duration-500 ease-linear rounded-full hover:text-primary-40 group">
                Patient
                <span className="block max-w-0 :max-w-full transition-all delay-150 duration-300 h-0.5 bg-secondary-60 ease-in-out"></span>
              </p>
            </li>
            {/* PATIENT PANEL */}
            <Transition.Root show={patient} as={Fragment}>
              <Dialog as="div" className="relative z-20" onClose={setPatient}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setPatient(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {patient_links && patient_links.map((link, index) => (
                                  <li key={link.name}>
                                    <Link
                                      href={link.href}
                                      className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                      onClick={handleTogglePatient}
                                    >
                                      <h4>{link.name}</h4>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li onClick={handleToggleTreatments} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <p className="font-medium uppercase transition-all duration-500 ease-linear rounded-full hover:text-primary-40 group">
                Treatments
                <span className="block max-w-0 :max-w-full transition-all delay-150 duration-300 h-0.5 bg-secondary-60 ease-in-out"></span>
              </p>
            </li>
            {/* TREATMENTS PANEL */}
            <Transition.Root show={treatments} as={Fragment}>
              <Dialog as="div" className="relative z-20" onClose={setTreatments}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setTreatments(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {treatments_links && treatments_links.map((link, index) => (
                                  <li key={link.name}>
                                    <Link
                                      href={link.href}
                                      className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                      onClick={handleToggleTreatments}
                                    >
                                      <h4>{link.name}</h4>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:right-0 before:translate-x-0 before:w-0 before:h-0.5 before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50 hover:text-primary-50 ease-in-out" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <Link
                href="https://my.orthoblink.com/bLink/Login"
                className="inline-block relative transition-all duration-500 before:content-[''] before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50"
              >
                <p className="text-sm custom-cursor-target">Patient Login</p>
              </Link>
            </li>

            <li className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:right-0 before:translate-x-0 before:w-0 before:h-0.5 before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50 hover:text-primary-50 ease-in-out" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <Link
                href="/#locations"
                className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50"
              >
                <p className="custom-cursor-target text-sm">Our Locations</p>
              </Link>
            </li>

            <li className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:-bottom-1 before:right-0 before:translate-x-0 before:w-0 before:h-0.5 before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50 hover:text-primary-50 ease-in-out" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <Link
                href="/products"
                className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50"
              >
                <p className="custom-cursor-target text-sm">Shop</p>
              </Link>
            </li>

						{bag.length > 0 && (
              <li
                onClick={handleToggleBagPanel}
                className="inline-block relative transition-all duration-500 before:content-[''] before:absolute before:-bottom-2 before:right-0 before:translate-x-0 before:w-0 before:h-[2px] before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50 hover:text-primary-50 ease-in-out" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}
          		>
          		  <span className="flex items-center relative transition-all duration-500 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:translate-x-0 before:w-0 before:h-[2px] before:opacity-0 hover:before:w-1/2 hover:before:opacity-100 before:transition-all before:duration-500 before:bg-primary-50">
                  <BagIcon className="w-6 h-6 ml-1" />
                  {calculateItemsQuantity()}
                </span>
              </li>
            )}
						{/* BagSidePanel */}
            <Transition.Root show={isBagOpen} as={Fragment}>
            	<Dialog as="div" className="relative z-50" onClose={setIsBagOpen}>
            		<Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>
            		<div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md bg-primary-40 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setIsBagOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                            <div className="px-4 sm:px-6">
                              <Dialog.Title className="pb-4 text-gray-900 border-b border-gray-200">
                                <h4>Shopping Bag</h4>
                              </Dialog.Title>
                            </div>
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="space-y-6 divide-y divide-gray-200">
                                {bag.length === 0 ? (
                                  <li className="px-4 space-y-8 sm:px-0">
                                    <p className='text-sm leading-6 text-gray-500'>You currently do not have any items in your bag.</p>
                                  </li>
                                  ) : (
																		bag.length > 0 && bag.map((item, index) => (
            	                        <li key={index} className="flex py-6">
            	                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
            	                            <img
            	                              src={item.product.images[0]}
            	                              alt={item.product.name}    className="object-cover object-center w-full h-full" />
            														</div>
            	                          <div className="flex flex-col flex-1 ml-4">
                                          <span className="flex justify-between text-base font-medium text-gray-900">
                                            <p><Link href={`/products/${item.product.id}`}>{item.product.name}</Link></p>
            	                              <p className="ml-4">${item.product.price * item.quantity}</p>
                                          </span>
                                          <p className="text-gray-500">${item.product.price}</p>
                                          <span className="flex items-center justify-between flex-1 text-sm">
            																<p className="text-gray-500">Qty: {item.quantity}</p>
                                        		<div className="flex">
                                            	<button type="button" className="font-medium text-secondary-50 hover:underline hover:underline-offset-4" onClick={() => dispatch(removeFromBag(item))}>Remove</button>
                                            </div>
                                          </span>
                                        </div>
                                      </li>
                                  )))}
                                 </ul>
                               </div>
                               <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <p>Subtotal: ({calculateItemsQuantity()} items)</p>
                                  <p>${calculateSubtotal()}</p>
                               	</div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                  <button className="flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition-colors duration-300 ease-in-out border border-transparent rounded-md shadow-sm bg-primary-50 hover:bg-primary-30"
                                  onClick={handleCheckout}
                                  >Checkout</button>
                                </div>
                                <div className="mt-6">
                                  <Link href="/bag" className="flex items-center justify-center px-6 py-3 text-base font-medium transition-colors duration-300 ease-in-out border rounded-md shadow-sm border-primary-50 text-primary-50 hover:text-white hover:bg-primary-30" onClick={handleToggleBagPanel}>View Bag</Link>
            	                  </div>
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

						<li className="flex items-center font-medium tracking-wider uppercase transition duration-300 ease-in-out rounded-full shadow-sm cursor-pointer shadow-primary-30 text-primary-95 bg-primary-30 hover:bg-secondary-50/60 hover:text-secondary-95 active:bg-secondary-50/80" onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>
              <Link href="/book-now" className="inline-block px-6 py-3">
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav id="mobile-nav" className={`${show ? "top-0 flex flex-col-reverse gap-6 justify-between h-full bg-white" : "bottom-0 max-w-[75vw] rounded-full bg-gray-100/60"} fixed left-0 right-0 mb-[4vh] p-4 w-full mx-auto text-gray-600 backdrop-blur-md shadow-md z-50 lg:hidden`}>
        <section className={`${show ? "px-4 py-6" : ""} flex items-center justify-between`}>
          <Link href="/">
            <img
              src="/../../../logo_full.png"
              alt="FreySmiles Orthodontics logo"
              className="w-auto h-8"
            />
          </Link>
          <div
            onClick={handleToggleMobileNav}
            className="transition duration-300 ease-linear cursor-pointer text-primary-50 hover:text-secondary-50"
          >
            {show ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <Bars2Icon className="w-6 h-6" />
            )}
          </div>
        </section>
        {/* <section ref={scope} className="overflow-y-scroll"> */}
        <section className="overflow-y-scroll">
          {show && (
            <ul className="relative text-2xl">
              <div className="px-4 mt-10 cursor-pointer group text-primary-40">
                {/* <li className="py-2 uppercase border-b border-secondary-50/30">
                  <Link href="/">Home</Link>
                </li> */}
                <li className="py-2 border-b border-secondary-50/30">
                {/* <li className="py-2 border-b border-secondary-50/30" onClick={() => setAbout(!about)}> */}
                  <span className="flex items-center gap-2 uppercase">About</span>
                  {/* About <ChevronDownIcon className="w-4 h-4" /> */}
                  {/* {about && ( */}
                    <div className="flex flex-col w-full my-4 space-y-1 capitalize">
                      {about_us_links &&
                        about_us_links.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="mx-6 text-xl text-secondary-50"
                            onClick={() => setShow(!show)}
                          >
                            {link.name}
                          </Link>
                        ))}
                    </div>
                  {/* )} */}
                </li>
                <li className="py-2 border-b border-secondary-50/30">
                  <span className="flex items-center gap-2 uppercase">Patient</span>
                  {/* {patient && ( */}
                    <div className="flex flex-col w-full my-4 space-y-1 capitalize">
                      {patient_links &&
                        patient_links.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="mx-6 text-xl text-secondary-50"
                            onClick={() => setShow(!show)}
                          >
                            {link.name}
                          </Link>
                        ))}
                    </div>
                  {/* )} */}
                </li>
                <li className="py-2 border-b border-secondary-50/30">
                  <span className="flex items-center gap-2 uppercase">Treatments</span>
                  {/* {treatments && ( */}
                    <div className="flex flex-col w-full my-4 space-y-1 capitalize">
                      {treatments_links &&
                        treatments_links.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="mx-6 text-xl text-secondary-50"
                            onClick={() => setShow(!show)}
                          >
                            {link.name}
                          </Link>
                        ))}
                    </div>
                  {/* )} */}
                </li>
              </div>
              <div className="px-4 mt-10 space-y-2 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                <li>
                  <Link
                    className="block text-secondary-50"
                    href="https://my.orthoblink.com/bLink/Login"
                  >
                    Patient Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="block text-secondary-50"
                    href="/products"
                  >
                    Shop
                  </Link>
                </li>
                {bag.length > 0 && (
                  <li
                    onClick={handleToggleBagPanel}
                    className="flex items-center gap-x-1 text-primary-50"
                  >
                    Bag
                    <div className="relative">
                      <BagIcon className="w-10 h-10" />
                      <span className="absolute top-0 right-0 p-3 bg-black rounded-full -translate-y-1/4 translate-x-2/4">
                        <p className="absolute text-sm text-white -translate-x-2/4 -translate-y-2/4">{calculateItemsQuantity()}</p>
                      </span>
                    </div>
                  </li>
                )}
                <li className="pt-6">
                  <div className="px-3 py-2 rounded-md w-max bg-primary-40 active:bg-primary-30">
                    <Link
                      href="/book-now"
                      className="font-normal text-white uppercase"
                    >
                      Book Now
                    </Link>
                  </div>
                </li>
              </div>
            </ul>
          )}
        </section>
      </nav>
    </header>
  )
}

// function useMobileNavAnimation(show) {
//   const [scope, animate] = useAnimate()

//   useEffect(() => {
//     const mobileNavAnimations = show
//       ? [
//           [
//             "ul",
//             { transform: "translateX(0%)" },
//             { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.6 },
//           ],
//           [
//             "li",
//             { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
//             { delay: stagger(0.05), at: "-0.5" },
//           ],
//           [
//             "a",
//             { transform: "scale(1)", opacity: 1, filter: "blur(0px)" },
//             { delay: stagger(0.05), at: "-0.5" },
//           ],
//         ]
//       : [
//           [
//             "li",
//             { transform: "scale(0.5)", opacity: 0, filter: "blur(10px)" },
//             { delay: stagger(0.05, { from: "last" }) },
//           ],
//           [
//             "a",
//             { transform: "scale(0.5)", opacity: 0, filter: "blur(10px)" },
//             { delay: stagger(0.05, { from: "last" }) },
//           ],
//           ["ul", { transform: "translateX(-100%)" }, { at: "-0.1" }],
//         ]
//     animate([...mobileNavAnimations])
//   }, [show, animate])

//   return scope
// }