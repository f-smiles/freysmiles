"use client";
import { useState } from "react";
import * as motion from "motion/react-client";
import { momentum } from "ldrs";
import { HomeIcon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { AnimatePresence } from "framer-motion";
import CartComponent from "@/components/cart/cart-component";

momentum.register()

export default function MobileNav() {

  const [show, setShow] = useState(null)
  const [isHovered, setIsHovered] = useState(null)

  const { cart } = useCartStore()

  const handleToggleMobileNav = () => {
    // setShow((prevState) => !prevState)
    setShow(!show)
  }

  const about_us_links = [
    { name: "Our Team", href: "/our-team" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Locations", href: "/#locations-section", hashLink: true },
  ]

  const patient_links = [
    { name: "Your Care", href: "/your-care" },
    { name: "Financing Treatment", href: "/financing-treatment" },
    {
      name: "Patient Login",
      href: "https://my.orthoblink.com/bLink/Login",
      external: true,
    },
  ]

  const treatments_links = [
    { name: "Invisalign", href: "/invisalign" },
    { name: "Braces", href: "/braces" },
    { name: "Early & Adult Orthodontics", href: "/early-adult-orthodontics" },
  ]

  const sidebarVariants = {
    open: {
      clipPath: "circle(125vh at calc(100% - 48px) 48px)",
      opacity: 1,
      transition: { type: "linear", stiffness: 400, damping: 400 },
      backgroundColor: "#fafafa",
    },
    closed: {
      clipPath: "circle(24px at calc(100% - 48px) 48px)",
      opacity: 0,
      transition: { delay: 0.2, type: "linear", stiffness: 400, damping: 400 },
    },
  }

  const staggerVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }

  const itemVariants = {
    open: {
      y: 0,
      transition: { type: "linear", stiffness: 1500, damping: 1000 },
    },
    closed: {
      y: 10,
      transition: { type: "linear", stiffness: 1500, damping: 1000 },
    },
  }

  return (
    <motion.nav id="mobile-nav">
      <motion.div
        className="relative block md:hidden"
        initial={false}
        animate={show ? "open" : "closed"}
      >
        <motion.div id="sidebarBackground" className="fixed top-0 left-0 z-10 w-screen h-screen" variants={sidebarVariants} />

        {cart.length > 0 && (
          <div className="ml-2 fixed top-[24px] right-[96px] w-[50px] h-[50px] cursor-pointer flex items-center justify-center rounded-full z-50 transition duration-300 ease-in-out hover:bg-transparent">
            <CartComponent />
          </div>
        )}

        <motion.div
          id="sidebarMenuToggle"
          onClick={handleToggleMobileNav}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileTap={{ scale: 0.80 }}
          className={`${show ? "" : ""} fixed top-[24px] right-[24px] w-[50px] h-[50px] cursor-pointer flex items-center justify-center rounded-full z-50 transition duration-300 ease-in-out bg-zinc-50 hover:bg-transparent`}
        >
          {show ? (
            <motion.svg className={`${show ? "rotate-90" : "rotate-0"} transition duration-300`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </motion.svg>
          ) : isHovered ? (
            <l-momentum size="22" speed="1.1" color="black"></l-momentum>
          ) : (
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </motion.svg>
          )}
        </motion.div>

        <AnimatePresence>
          {show && (
            <motion.ul
              className="fixed top-[12vh] left-0 right-0 z-20 w-full my-auto text-2xl max-h-[70vh] overflow-y-auto md:top-[16vh]"
              initial={{
                y: 50,
                opacity: 0,
                transition: {
                  duration: 0.4,
                  scale: { type: "linear", visualDuration: 0.4, bounce: 0.5 },
                }
              }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.4,
                  scale: { type: "linear", visualDuration: 0.4, bounce: 0.5 },
                }
              }}
            >
              <div className="space-y-4 group text-primary-40">
                {/* <li className="py-2 uppercase border-b border-secondary-50/30">
                  <Link href="/">Home</Link>
                </li> */}
                <motion.div initial="closed" animate="open" exit="closed" variants={staggerVariants}>
                  <motion.li variants={itemVariants} className="relative px-8 py-2 border-b border-secondary-50/30">
                    <motion.a
                      className="block text-secondary-50"
                      href="/shop/products"
                      whileHover={{ scale: 1.01, x: "8px" }}
                      whileTap={{ scale: 0.99 }}
                      transition={{
                        type: "easeInOut",
                        duration: 0.01,
                      }}
                    >
                      <span className="flex gap-2">
                        <p className="text-sm"><HomeIcon className="w-4 h-4" /></p>
                        <p className="flex items-center gap-2 text-2xl uppercase">Home</p>
                      </span>
                    </motion.a>
                  </motion.li>
                </motion.div>

                <li className="relative px-8 py-2 border-b staggerLink border-secondary-50/30">
                  {/* <li className="py-2 border-b border-secondary-50/30" onClick={() => setAbout(!about)}> */}
                  {/* <motion.div initial={{ width: "0%", originX: 1 }} animate={{ width: "100%", originX: 1 }} transition={{ duration: 1, delay: 0.2 }} className="absolute bottom-0 right-0 h-[1px] bg-secondary-50/30" /> */}
                  <span className="flex gap-2">
                    <p className="text-sm">01</p>
                    <p className="flex items-center gap-2 text-2xl uppercase">About</p>
                  </span>
                  {/* About <ChevronDownIcon className="w-4 h-4" /> */}
                  {/* {about && ( */}
                  <motion.div initial="closed" animate="open" exit="closed" variants={staggerVariants} className="flex flex-col w-full mt-2 mb-4 space-y-1 capitalize font-helvetica-neue-light">
                    {about_us_links &&
                      about_us_links.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          className="ml-10 text-xl text-secondary-50"
                          onClick={() => setShow(!show)}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {link.name}
                        </motion.a>
                      ))}
                  </motion.div>
                  {/* )} */}
                </li>
                <li className="relative px-8 py-2 border-b staggerLink border-secondary-50/30">
                  {/* <motion.div initial={{ width: "0%", originX: 0 }} animate={{ width: "100%", originX: 0 }} transition={{ duration: 1, delay: 0.9 }} className="absolute bottom-0 left-0 h-[1px] bg-secondary-50/30" /> */}

                  <span className="flex gap-2">
                    <p className="text-sm -translate-y-1">02</p>
                    <p className="flex items-center gap-2 text-2xl uppercase">Patient</p>
                  </span>
                  {/* {patient && ( */}
                  <motion.div initial="closed" animate="open" exit="closed" variants={staggerVariants} className="flex flex-col w-full mt-2 mb-4 space-y-1 capitalize font-helvetica-neue-light">
                    {patient_links &&
                      patient_links.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          className="ml-10 text-xl text-secondary-50"
                          onClick={() => setShow(!show)}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {link.name}
                        </motion.a>
                      ))}
                  </motion.div>
                  {/* )} */}
                </li>
                <li className="relative px-8 py-2 border-b staggerLink border-secondary-50/30">
                  {/* <motion.div initial={{ width: "0%", originX: 1 }} animate={{ width: "100%", originX: 1 }} transition={{ duration: 1, delay: 1.6 }} className="absolute bottom-0 right-0 h-[1px] bg-secondary-50/30" /> */}

                  <span className="flex gap-2">
                    <p className="text-sm -translate-y-1">03</p>
                    <p className="flex items-center gap-2 text-2xl uppercase">Treatments</p>
                  </span>
                  {/* {treatments && ( */}
                  <motion.div initial="closed" animate="open" exit="closed" variants={staggerVariants} className="flex flex-col w-full mt-2 mb-4 space-y-1 capitalize font-helvetica-neue-light">
                    {treatments_links &&
                      treatments_links.map((link) => (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          className="ml-10 text-xl text-secondary-50"
                          onClick={() => setShow(!show)}
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {link.name}
                        </motion.a>
                      ))}
                  </motion.div>
                  {/* )} */}
                </li>
              </div>
              <motion.div initial="closed" animate="open" exit="closed" variants={staggerVariants}
                className="space-y-2 uppercase font-helvetica-neue-light"
                onClick={() => setShow(!show)}
              >
                <motion.li variants={itemVariants} className="relative px-8 py-2 border-b border-secondary-50/30">
                  {/* <motion.div initial={{ width: "0%", originX: 1 }} animate={{ width: "100%", originX: 1 }} transition={{ duration: 0.5, delay: 1.6 }} className="absolute bottom-0 left-0 h-[1px] bg-secondary-50/30" /> */}

                  <motion.a
                    className="block text-secondary-50"
                    href="/shop/products"
                    whileHover={{ scale: 1.01, x: "8px" }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      type: "easeInOut",
                      duration: 0.01,
                    }}
                  >
                    Shop
                  </motion.a>
                </motion.li>
                <motion.li variants={itemVariants} className="relative px-8 py-2 border-b border-secondary-50/30">
                  {/* <motion.div initial={{ width: "0%", originX: 1 }} animate={{ width: "100%", originX: 1 }} transition={{ duration: 0.5, delay: 1.6 }} className="absolute bottom-0 left-0 h-[1px] bg-secondary-50/30" /> */}

                  <motion.a
                    className="block text-secondary-50"
                    href="/auth/login"
                    whileHover={{ scale: 1.01, x: "8px" }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      type: "easeInOut",
                      duration: 0.01,
                    }}
                  >
                    Login
                  </motion.a>
                </motion.li>
                <motion.li variants={itemVariants} className="relative px-8 py-2 border-b border-secondary-50/30">
                  {/* <motion.div initial={{ width: "0%", originX: 1 }} animate={{ width: "100%", originX: 1 }} transition={{ duration: 0.5, delay: 2.3 }} className="absolute bottom-0 left-0 h-[1px] bg-secondary-50/30" /> */}

                  <motion.a
                    className="block text-secondary-50" href="/book-now"
                    whileHover={{ scale: 1.01, x: "8px" }}
                    whileTap={{ scale: 0.99 }}
                    transition={{
                      type: "easeInOut",
                      duration: 0.01,
                    }}
                  >
                    Book Now
                  </motion.a>
                </motion.li>
              </motion.div>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  )
}