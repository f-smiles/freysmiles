'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import * as motion from "motion/react-client"
import { DotIcon } from 'lucide-react'
import { background } from './anim'
import { links } from './links'


export default function MobileNav({ user }) {
  const container = {
    position: "relative",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flex: 1,
    width: "100%",
    maxWidth: "75vw",
    overflow: "hidden",
    zIndex: 9999,
  }

  // const nav = {
  //   width: 300,
  //   height: 300,
  // }

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
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      style={container}
      // style={nav}
    >
      <motion.div style={background} variants={sidebarVariants} />
      <Navigation />
      <MenuToggle toggle={() => setIsOpen(!isOpen)} />
    </motion.nav>
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
  // const toggleContainer = {
  //   outline: "none",
  //   border: "none",
  //   WebkitUserSelect: "none",
  //   MozUserSelect: "none",
  //   cursor: "pointer",
  //   position: "absolute",
  //   top: 18,
  //   right: 15,
  //   width: 50,
  //   height: 50,
  //   borderRadius: "50%",
  //   zIndex: 9999,
  //   color: "black",
  //   background: "transparent",
  // }

  return (
    <button onClick={toggle} className="flex items-center justify-center absolute top-[18] right-[15] w-[50] h-[50] z-50 text-black"> {/* style={toggleContainer} */}
      <span className="flex items-center justify-center pl-4">
        <DotIcon className="w-8 h-8" />
        <DotIcon className="w-8 h-8 -translate-x-4" />
      </span>
    </button>
  )
}