'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DotIcon, XIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { background, height, opacity } from './anim'
import { links } from './links'
import styles from './style.module.css'


export default function Navbar({ user }) {

  const [isActive, setIsActive] = useState(false)

  const [selectedLink, setSelectedLink] = useState(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-nav",
        start: "top top",
        end: "bottom 64px",
        scrub: true,
        markers: true,
      },
    })
    timeline.to(".scroll-nav", {
      width: "80%",
      padding: "0px",
    })

    return () => {
      timeline.to(".scroll-nav", { width: "100%", padding: "16px" })
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // bg-[rgb(225,_246,_114)]

  return (
    <div>
      <MobileNavbar />
      <motion.div
        className={`${styles.header} ${isActive ? "rounded-none bg-[#e0ff33] lg:block hidden" : ""}`}
        transition={{ duration: 1, scale: { type: "spring", visualDuration: 1 }}}
      >
        <motion.div className="pt-[16px] flex items-center justify-between uppercase m-auto transition-all duration-1000 ease-in-out scroll-nav" variants={opacity} animate={!isActive ? "open" : "closed"}>
          <Link href="/">
            <motion.div className={`${isActive ? "hidden" : "block"} bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3`}>
              <img src="../images/logo_icon.png" alt="Logo Icon" className="icon-replacement w-full h-full" />
            </motion.div>
          </Link>

          <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}> {/* styles.el */}
            <motion.div className="flex items-center gap-4"> {/* styles.label */}
              {links.map((link, i) => (
                <motion.p
                  key={`${i} + ${link}`}
                  className="text-md text-black"
                  onClick={() => {
                    setSelectedLink(link.title)
                    setIsActive(!isActive)
                    console.log(`clicked ${link.title}`)
                    console.log(`selectedLink ${selectedLink}`)
                  }}
                  variants={opacity}
                  animate={!isActive ? "open" : "closed"}
                >
                  {link.title}
                </motion.p>
              ))}
              <Link href="/shop/products">
                <p className="text-md">Shop</p>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={opacity} animate={!isActive ? "open" : "closed"} className="flex items-center gap-4">
            <Link href="/auth/login">
              <p className="text-md">Login</p>
            </Link>
            <Link href="/book-now">
              <p className="text-md">Book Now</p>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div onClick={() => setIsActive(false)} variants={background} initial="initial" animate={isActive ? "open" : "closed"} className={styles.background}></motion.div>

        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div variants={height} initial="initial" animate="enter" exit="exit" className={`${styles.nav} z-50`}>
              <div className="flex flex-col max-w-4xl m-auto"> {/* styles.body */}
                <>
                <div onClick={() => setIsActive(!isActive)} className="h2-menu-row flex items-start self-end">
                  <p className="h2-menu-text-number"><XIcon className="w-4 h-4" /></p>
                  <h1 className="text-[40px]">Close</h1>
                </div>
                {links.map((link) => (
                  <div key={link.title}>
                    {selectedLink === link.title && link.sublinks.map((sublink, i) => (
                      <Link
                        key={sublink}
                        href={link.hrefs[i]}
                        className={`h2-menu-row h2-menu-row-${i + 1} ${isActive ? "open" : ""}`}
                        onClick={() => setIsActive(false)}
                      >
                        <div className="h2-menu-wrapper-top cursor-pointer">
                          <p className="h2-menu-text-number">{`0${i + 1}`}</p>
                          <h1 className="h2-menu-heading">{sublink}</h1>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
                </>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

const MobileNavbar = () => {
  const container = {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
    width: "100%",
    maxWidth: "75vw",
    overflow: "hidden",
  }

  const nav = {
    width: 300,
  }

  const sidebarVariants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const useDimensions = (ref) => {
    const dimensions = useRef({ width: 0, height: 0 })

    useEffect(() => {
      if (ref.current) {
        dimensions.current.width = ref.current.offsetWidth
        dimensions.current.height = ref.current.offsetHeight
      }
    }, [ref])
    return dimensions.current
  }

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const { height } = useDimensions(containerRef)

  return (
    <div className="block lg:hidden">
      <div style={container}>
        <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          custom={height}
          ref={containerRef}
          style={nav}
        >
          <motion.div style={background} variants={sidebarVariants} />
          <Navigation />
          <MenuToggle toggle={() => setIsOpen(!isOpen)} />
        </motion.nav>
      </div>
    </div>
  )
}

const Navigation = () => {
  const list = {
    listStyle: "none",
    padding: "25px 100px 25px 50px",
    margin: 0,
    position: "absolute",
    top: 80,
    width: "100%",
  }

  const navVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }

  const listItem = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    listStyle: "none",
    marginBottom: 20,
    cursor: "pointer",
  }

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  }

  return (
    <motion.ul style={list} variants={navVariants}>
      {links.map((link, i) => (
        <MenuItem key={`${link} + ${i}`} link={link} />
      ))}
      <motion.li
        style={listItem}
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/shop/products">
          <p className="text-md">SHOP</p>
        </Link>
      </motion.li>
    </motion.ul>
  )
}

const MenuItem = ({ link, isActive, setIsActive }) => {

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  }

  const listItem = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    listStyle: "none",
    marginBottom: 20,
    marginLeft: 20,
    cursor: "pointer",
  }

  return (
    <div className="mb-12">
      <motion.p variants={itemVariants}>{link.title}</motion.p>
      <motion.li style={listItem} variants={itemVariants}>
        {(Object.values(link["sublinks"])).map((sublink, i) => (
          <Link href="#" className={`h2-menu-row h2-menu-row-${i + 1} ${isActive ? "open" : ""}`}>
            <motion.p className="text-md" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>{sublink}</motion.p>
          </Link>
        ))}
      </motion.li>
    </div>
  )
}

const MenuToggle = ({ toggle }) => {
  const toggleContainer = {
    outline: "none",
    border: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    cursor: "pointer",
    position: "absolute",
    top: 18,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "transparent",
  }

  return (
    <button style={toggleContainer} onClick={toggle} className="flex items-center justify-center">
      <span className="flex items-center justify-center pl-4">
        <DotIcon className="w-8 h-8" />
        <DotIcon className="w-8 h-8 -translate-x-4" />
      </span>
    </button>
  )
}