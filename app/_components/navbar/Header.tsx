"use client"
import styles from "./style.module.css"
import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
// import { opacity } from "./anim"

export const opacity = {
  initial: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.35 },
  }
}

export default function Header() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={styles.header}>
      <div className={styles.bar}>
        <Link href="/">
          <div className="flex flex-col justify-center items-center w-[2.5rem] h-[2.5rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.1831 3.1236L6.41346 0L5.64383 3.12359C5.49365 3.73311 5.41855 4.03787 5.26216 4.28585C5.12382 4.50521 4.94023 4.69149 4.72404 4.83185C4.47963 4.99053 4.17927 5.06672 3.57854 5.2191L0.5 6L3.57854 6.7809C4.17927 6.93328 4.47963 7.00947 4.72404 7.16815C4.94023 7.30851 5.12383 7.49479 5.26216 7.71415C5.41856 7.96213 5.49365 8.26689 5.64383 8.87641L6.41346 12L7.1831 8.87641C7.33328 8.26689 7.40837 7.96213 7.56476 7.71415C7.7031 7.49479 7.8867 7.30851 8.10289 7.16815C8.3473 7.00947 8.64766 6.93328 9.24838 6.7809L12.3269 6L9.24838 5.2191C8.64766 5.06672 8.3473 4.99053 8.10289 4.83185C7.8867 4.69149 7.7031 4.50521 7.56476 4.28585C7.40837 4.03787 7.33328 3.73311 7.1831 3.1236Z"
                fill="#03450B"
              ></path>
            </svg>
          </div>
        </Link>

        <div onClick={() => { setIsActive(!isActive) }} className={styles.el}>
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`} />

          <div className={styles.label}>
            <motion.p variants={opacity} animate={!isActive ? "open" : "closed"}>
              Menu
            </motion.p>

            <motion.p variants={opacity} animate={isActive ? "open" : "closed"}>
              Close
            </motion.p>
          </div>
        </div>

        <motion.div
          variants={opacity}
          animate={!isActive ? "open" : "closed"}
          className={styles.shopContainer}
        >
          <p className={styles.shop}>Shop</p>

          <div className={styles.el}>
            <svg
              width="19"
              height="20"
              viewBox="0 0 19 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z"
                stroke="#4D3D30"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>

            <p>Cart(0)</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


export function NavbarOld() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<string | null>(null)

  return (
    <motion.div
      className={`fixed bg-[#f4f0ea] w-full rounded-full border border-primary/50 m-auto left-0 right-0 p-6 z-50`}
      animate={{ borderRadius: isOpen ? "0px" : "" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      // width: isOpen ? "100%" : "max-content",
      // border: isOpen ? "0px" : "",
    >
      <div className="flex justify-center items-center gap-8">
        <motion.div variants={opacity} animate={!isOpen ? "open" : "closed"} className={`${isOpen ? "hidden" : "block"}`}>
          <Link href="/">
            <Icon />
          </Link>
        </motion.div>

        <motion.div variants={opacity} animate={!isOpen ? "open" : "closed"} className={`${isOpen ? "hidden" : "block"} flex items-center justify-center gap-4 uppercase`}>
          {links.map((link) => (
            <motion.p className="text-sm" onClick={(e) => {
              setIsOpen(!isOpen)
              setSelectedLink(link.title)
              console.log(`clicked ${link.title}`)
              console.log(`selectedLink ${selectedLink}`)
            }}>
              {link.title}
            </motion.p>
          ))}
          <motion.p className="text-sm">Patient Portal</motion.p>
          <motion.p className="text-sm">Shop</motion.p>
          <motion.p className="text-sm">Login</motion.p>
          <motion.p className="text-sm">Book Now</motion.p>
        </motion.div>

        <motion.div variants={opacity} animate={!isOpen ? "open" : "closed"} className={`${isOpen ? "hidden" : "block"} bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3`}>
          <img src="../images/logo_icon.png" alt="Logo Icon" className="icon-replacement w-full h-full" />
        </motion.div>

        <motion.div variants={background} initial="initial" animate={isOpen ? "open" : "closed"} className={styles.background} />
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div variants={height} initial="initial" animate="enter" exit="exit" className={`${styles.nav} w-full`}>
              <div className={styles.wrapper}>
                <div className="w-full flex justify-center items-center">
                  <div className="max-w-4xl w-full m-auto border"> {/* styles.body */}
                    <motion.div onClick={() => setIsOpen(!isOpen)} className="flex justify-center">
                      <p className="h2-menu-text-number"><XIcon className="w-6 h-6" /></p>
                      <h1 className="h2-menu-heading">Close</h1>
                    </motion.div>
                    {links.map((link) => (
                      <div key={link.title}>
                        {selectedLink === link.title && link.sublinks.map((sublink, i) => (
                          <Link key={sublink} href={link.hrefs[i]} className={`h2-menu-row h2-menu-row-${i + 1} ${isOpen ? "open" : ""}`}>
                            <div className="h2-menu-wrapper-top">
                              <p className="h2-menu-text-number">{`0${i + 1}`}</p>
                              <h1 className="h2-menu-heading">{sublink}</h1>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}


{/* <div
  className="h2-menu"
  style={{
    opacity: isMenuOpen ? 1 : 0,
    visibility: isMenuOpen ? "visible" : "hidden",
  }}
>
  <div className="h2-menu-container">
    {[
      "Team",
      "Manifesto",
      "Testimonials",
      "Locations",
      "Patient Login",
    ].map((heading, index) => (
        <a
    key={index}
    href="#"
    className={`h2-menu-row h2-menu-row-${index + 1} ${
      isMenuOpen ? "open" : ""
    }`}
    style={{
      animationDelay: isMenuOpen ? `${index * 0.1}s` : "0s",
    }}
  >
        <div className="h2-menu-wrapper-top">
          <p className="h2-menu-text-number">{`0${index + 1}`}</p>
          <h1 className="h2-menu-heading">{heading}</h1>
        </div>
        <div
          className="h2-menu-wrapper-center"
          style={{
            opacity: isMenuOpen ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <img
            src="../images/greyblue.png"
            loading="lazy"
            alt=""
            className="h2-menu-image"
          />
        </div>
      </a>
    ))}
  </div>
</div> */}

// const [selectedLink, setSelectedLink] = useState({ isActive: false, index: 0 })

// return <Link key={`l_${index}`} href={href}>
//   <motion.p
//     onMouseOver={() => {setSelectedLink({isActive: true, index})}}
//     onMouseLeave={() => {setSelectedLink({isActive: false, index})}}
//     variants={blur}
//     animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}>
//   </motion.p>
// </Link>

// export default function Navbar() {

//   const [isOpen, setIsOpen] = useState(false)
//   const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0})

//   const links = [
//     {
//       title: "About",
//       hrefs: ["Team", "Manifesto", "Testimonials", "Locations", "Patient Login"],
//     },
//     {
//       title: "PATIENT",
//       hrefs: ["Your Care", "Financing Treatment"],
//     },
//     {
//       title: "TREATMENTS",
//       hrefs: ["Invisalign", "Braces", "Early & Adult Orthodontics"],
//     },
//   ]

//   return (
//     <div className={styles.header}>
//       <div className="flex justify-center items-center gap-8"> {/* styles.bar */}
//         <Link href="/">
//           <Icon />
//         </Link>

//         <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-4 uppercase"> {/* styles.el */}
//           {links.map((link) => (
//             <motion.p onClick={() => setIsOpen(!isOpen)} variants={opacity} animate={!isOpen ? "open" : "closed"} className="text-sm">{link.title}</motion.p>
//           ))}
//           <motion.p variants={opacity} animate={!isOpen ? "open" : "closed"} className="text-sm">Patient Portal</motion.p>
//           <motion.p variants={opacity} animate={!isOpen ? "open" : "closed"} className="text-sm">Shop</motion.p>
//           {/* <div className={`${styles.burger} ${isOpen ? styles.burgerActive : ""}`}></div>
//           <div className={styles.label}>
//             <motion.p variants={opacity} animate={!isOpen ? "open" : "closed"}>Menu</motion.p>
//             <motion.p variants={opacity} animate={isOpen ? "open" : "closed"}>Close</motion.p>
//           </div> */}
//         </div>

//         <motion.div variants={opacity} animate={!isOpen ? "open" : "closed"}> {/* styles.shopContainer */}
//           {/* <p className={styles.shop}>Shop</p> */}
//           <div className="flex items-center uppercase text-md gap-4"> {/* styles.el */}
//             <span className="flex items-center gap-1">
//               <ShoppingCart />
//               <p>Cart(0)</p>
//             </span>
//             <p>Login</p>
//             <p>Book Now</p>
//             <div className="bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3">
//               <img src="../images/logo_icon.png" alt="Logo Icon" className="icon-replacement w-full h-full" />
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <motion.div variants={background} initial="initial" animate={isOpen ? "open" : "closed"} className={styles.background}></motion.div>
//       <AnimatePresence mode="wait">
//         {isOpen && <Nav/>}
//       </AnimatePresence>
//     </div>
//   )
// }

// const Nav = () => {

//   const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0})

//   const links = [
//     {
//       title: "About",
//       hrefs: ["Team", "Manifesto", "Testimonials", "Locations", "Patient Login"],
//     },
//     {
//       title: "PATIENT",
//       hrefs: ["Your Care", "Financing Treatment"],
//     },
//     {
//       title: "TREATMENTS",
//       hrefs: ["Invisalign", "Braces", "Early & Adult Orthodontics"],
//     },
//   ]

//   return (
//     <motion.div variants={height} initial="initial" animate="enter" exit="exit" className={styles.nav}>
//       <div className={styles.wrapper}>
//         <div className={styles.container}>
//           <div className={styles.body}>
//             {links.map((link, index) => {
//               return  (
//                 <Link key={`l_${index}`} href={link.title}>
//                   <motion.p
//                     onMouseOver={() => {setSelectedLink({isActive: true, index})}}
//                     onMouseLeave={() => {setSelectedLink({isActive: false, index})}}
//                     variants={blur}
//                     animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}
//                   >
//                     {link.title}
//                   </motion.p>
//                 </Link>
//               )
//             })}
//           </div>
//           {/* <Footer /> */}
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// "use client"
// import Link from "next/link"
// import { useState } from "react"
// import * as motion from "motion/react-client"
// import styles from "./style.module.css"
// import { AnimatePresence } from "framer-motion"


// const transition = {duration: 1, ease: [0.76, 0, 0.24, 1]}

// const background = {
//   initial: {
//     height: 0
//   },
//   open: {
//     height: "100vh",
//     transition
//   },
//   closed: {
//     height: 0,
//     transition
//   }
// }

// const blur = {
//   initial: {
//     filter: "blur(0px)",
//     opacity: 1
//   },
//   open: {
//     filter: "blur(4px)",
//     opacity: 0.6,
//     transition: {duration: 0.3}
//   },
//   closed: {
//     filter: "blur(0px)",
//     opacity: 1,
//     transition: {duration: 0.3}
//   }
// }

// const opacity = {
//   initial: {
//     opacity: 0,
//   },
//   open: {
//     opacity: 1,
//     transition: { duration: 0.35 },
//   },
//   closed: {
//     opacity: 0,
//     transition: { duration: 0.35 },
//   }
// }

// const links = [
//   {
//     title: "About",
//     hrefs: ["Team", "Manifesto", "Testimonials", "Locations", "Patient Login"]
//   },
//   {
//     title: "PATIENT",
//     hrefs: ["Your Care", "Financing Treatment"],
//   },
//   {
//     title: "TREATMENTS",
//     hrefs: ["Invisalign", "Braces", "Early & Adult Orthodontics"],
//   },
// ]


// export default function Navbar() {

//   const [isOpen, setIsOpen] = useState(false)
//   const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});

//   return (
//     <div className={styles.header}>
//       <div className={styles.bar}>
//         <Link href="/" className="b--icon-40x40">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
//             <path fill-rule="evenodd" clip-rule="evenodd" d="M7.1831 3.1236L6.41346 0L5.64383 3.12359C5.49365 3.73311 5.41855 4.03787 5.26216 4.28585C5.12382 4.50521 4.94023 4.69149 4.72404 4.83185C4.47963 4.99053 4.17927 5.06672 3.57854 5.2191L0.5 6L3.57854 6.7809C4.17927 6.93328 4.47963 7.00947 4.72404 7.16815C4.94023 7.30851 5.12383 7.49479 5.26216 7.71415C5.41856 7.96213 5.49365 8.26689 5.64383 8.87641L6.41346 12L7.1831 8.87641C7.33328 8.26689 7.40837 7.96213 7.56476 7.71415C7.7031 7.49479 7.8867 7.30851 8.10289 7.16815C8.3473 7.00947 8.64766 6.93328 9.24838 6.7809L12.3269 6L9.24838 5.2191C8.64766 5.06672 8.3473 4.99053 8.10289 4.83185C7.8867 4.69149 7.7031 4.50521 7.56476 4.28585C7.40837 4.03787 7.33328 3.73311 7.1831 3.1236Z" fill="#03450B"></path>
//           </svg>
//         </Link>

//         <div onClick={() => { setIsOpen(!isOpen) }} className={styles.el}>
//           <div className={styles.label}>
//             <motion.div className="showcase_navigation_nav" animate={{ opacity: isOpen ? 0 : 1 }}>
//               {links.map((link) => (
//                 <div key={link.title} onClick={() => setIsOpen(!isOpen)} className="showcase_navigation_nav-link_wrapper">
//                   <p className="showcase_navigation_nav-link">{link.title}</p>
//                 </div>
//               ))}
//               <div onClick={() => setIsOpen(!isOpen)} className="showcase_navigation_nav-link_wrapper">
//                 <p className="showcase_navigation_nav-link">Patient Portal</p>
//               </div>
//               <div onClick={() => setIsOpen(!isOpen)} className="showcase_navigation_nav-link_wrapper">
//                 <p className="showcase_navigation_nav-link">Locations</p>
//               </div>
//               <div onClick={() => setIsOpen(!isOpen)} className="showcase_navigation_nav-link_wrapper">
//                 <p className="showcase_navigation_nav-link">Shop</p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//         <motion.div variants={opacity} animate={!isOpen ? "open" : "closed"} className={styles.shopContainer}>
//           <div className={styles.el}>
//             <div className=""></div>
//             <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z" stroke="#4D3D30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
//             </svg>
//             <p>Cart(0)</p>
//             <p>Login</p>
//             <p>Book Now</p>
//           </div>

//           <div className="bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3">
//             <img src="../images/logo_icon.png" alt="Logo Icon" className="icon-replacement w-full h-full" />
//           </div>
//         </motion.div>
//       </div>

//       {isOpen && (
//         <div className={styles.body}>
//           {links.map((link, index) => (
//             <div key={`l_${index}`}>
//               {/* Render the main title */}
//               <motion.p
//                 onMouseOver={() => {
//                   setSelectedLink({ isActive: true, index });
//                 }}
//                 onMouseLeave={() => {
//                   setSelectedLink({ isActive: false, index });
//                 }}
//                 variants={blur}
//                 animate={selectedLink.isActive && selectedLink.index !== index ? "open" : "closed"}
//               >
//                 {link.title}
//               </motion.p>

//               {/* Render the sublinks */}
//               <AnimatePresence mode="wait">
//                 {selectedLink.isActive && selectedLink.index === index &&
//                   link.hrefs.map((sublink, subIndex) => (
//                     <motion.div
//                       key={`sublink_${index}_${subIndex}`}
//                       initial="initial"
//                       animate="open"
//                       exit="closed"
//                       variants={opacity}
//                     >
//                       <Link href={`/${sublink}`}>
//                         <p className={styles.sublink}>{sublink}</p>
//                       </Link>
//                     </motion.div>
//                   ))}
//               </AnimatePresence>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


// ================================================================= //

{/* <motion.div variants={background} initial="initial" animate={isOpen ? "open" : "closed"} className={styles.background}></motion.div>
<AnimatePresence mode="wait">
  {links.map((link, index) => (
    selectedLink.isActive && selectedLink.index === index && link.hrefs.map((sublink, subindex) => (
      <div key={`l_${subindex}`}className={styles.body}>
        <motion.div
          key={`sublink_${index}_${subindex}`}
          initial="initial"
          animate="open"
          exit="closed"
          variants={opacity}
        >
          <Link href={`/${sublink}`}>
            <p className={styles.sublink}>{sublink}</p>
          </Link>
        </motion.div>
      </div>
    ))
  ))}
</AnimatePresence> */}

// : { links: { title: string; hrefs: string[] }[], selectedLink: { isActive: boolean; index: number }, setSelectedLink: Dispatch<SetStateAction<{ isActive: boolean; index: number }>> }

// ================================================================= //


// "use client"
// import Link from "next/link"
// import { useState } from "react"
// import * as motion from "motion/react-client"

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)

//   const [selectedLink, setSelectedLink] = useState<string | null>(null)

//   const links = [
//     {
//       title: "ABOUT",
//       sublinks: [
//         "Team",
//         "Manifesto",
//         "Testimonials",
//         "Locations",
//         "Patient Login",
//       ],
//     },
//     {
//       title: "PATIENT",
//       sublinks: ["Your Care", "Financing Treatment"],
//     },
//     {
//       title: "TREATMENTS",
//       sublinks: ["Invisalign", "Braces", "Early & Adult Orthodontics"],
//     },
//   ]

//   const navVariants = {
//     open: {
//       transition: { staggerChildren: 0.07, delayChildren: 0.2 },
//     },
//     closed: {
//       transition: { staggerChildren: 0.05, staggerDirection: -1 },
//     },
//   }

//   const itemVariants = {
//     open: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         y: { stiffness: 1000, velocity: 100 },
//       },
//     },
//     closed: {
//       y: 50,
//       opacity: 0,
//       transition: {
//         y: { stiffness: 1000 },
//       },
//     },
//   }

//   const handleLinkClick = (link: string) => {
//     if (selectedLink === link) {
//       setSelectedLink(null) // Close the sublinks if clicked again
//     } else {
//       setSelectedLink(link)
//     }
//     setIsOpen(!isOpen)
//   }

//   return (
//     <motion.div initial={false} animate={isOpen ? "open" : "closed"}>
//       <section className="section_showcase">
//         <div className="containernav">
//           <div className="showcase_navigation">
//             <div className="showcase_navigation_start">
//               <Link href="/">
//                 <div className="flex flex-col justify-center items-center w-[2.5rem] h-[2.5rem]">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 13 12"
//                     width="100%"
//                     height="100%"
//                     preserveAspectRatio="xMidYMid meet"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M7.1831 3.1236L6.41346 0L5.64383 3.12359C5.49365 3.73311 5.41855 4.03787 5.26216 4.28585C5.12382 4.50521 4.94023 4.69149 4.72404 4.83185C4.47963 4.99053 4.17927 5.06672 3.57854 5.2191L0.5 6L3.57854 6.7809C4.17927 6.93328 4.47963 7.00947 4.72404 7.16815C4.94023 7.30851 5.12383 7.49479 5.26216 7.71415C5.41856 7.96213 5.49365 8.26689 5.64383 8.87641L6.41346 12L7.1831 8.87641C7.33328 8.26689 7.40837 7.96213 7.56476 7.71415C7.7031 7.49479 7.8867 7.30851 8.10289 7.16815C8.3473 7.00947 8.64766 6.93328 9.24838 6.7809L12.3269 6L9.24838 5.2191C8.64766 5.06672 8.3473 4.99053 8.10289 4.83185C7.8867 4.69149 7.7031 4.50521 7.56476 4.28585C7.40837 4.03787 7.33328 3.73311 7.1831 3.1236Z"
//                       fill="#03450B"
//                     ></path>
//                   </svg>
//                 </div>
//               </Link>
//             </div>

//             <div className="showcase_navigation_nav">
//               {links.map((link) => (
//                 <div
//                   key={link.title}
//                   className="showcase_navigation_nav-link_wrapper"
//                 >
//                   <p
//                     className="showcase_navigation_nav-link"
//                     onClick={() => handleLinkClick(link.title)}
//                   >
//                     {link.title}
//                   </p>

//                   {selectedLink === link.title && (
//                     <motion.div
//                       className="h2-menu"
//                       animate={{ y: isOpen ? "0%" : "-100%" }}
//                       transition={{
//                         duration: 0.4,
//                         scale: {
//                           type: "spring",
//                           visualDuration: 0.4,
//                           bounce: 0.5,
//                         },
//                       }}
//                       style={{
//                         visibility: isOpen ? "visible" : "hidden",
//                       }}
//                     >
//                       <div className="h2-menu-container">
//                         <div className="h2-menu-row cursor-pointer">
//                           <div
//                             className="h2-menu-wrapper-top"
//                             onClick={() => setIsOpen(!isOpen)}
//                           >
//                             <p className="h2-menu-text-number">X</p>
//                           </div>

//                           <motion.ul variants={navVariants}>
//                             {link.sublinks.map((sublink, i) => (
//                               <motion.li
//                                 key={sublink}
//                                 variants={itemVariants}
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.95 }}
//                               >
//                                 <a
//                                   href="#"
//                                   className={`h2-menu-row h2-menu-row-${
//                                     i + 1
//                                   } ${isOpen ? "open" : ""}`}
//                                   style={{
//                                     animationDelay: isOpen
//                                       ? `${i * 0.1}s`
//                                       : "0s",
//                                   }}
//                                 >
//                                   <div className="h2-menu-wrapper-top">
//                                     <p className="h2-menu-text-number">{`0${
//                                       i + 1
//                                     }`}</p>
//                                     <h1 className="h2-menu-heading">
//                                       {sublink}
//                                     </h1>
//                                   </div>
//                                   <div
//                                     className="h2-menu-wrapper-center"
//                                     style={{
//                                       opacity: isOpen ? 1 : 0,
//                                       transition: "opacity 0.5s ease",
//                                     }}
//                                   >
//                                     <img
//                                       src="../images/greyblue.png"
//                                       loading="lazy"
//                                       alt=""
//                                       className="h2-menu-image"
//                                     />
//                                   </div>
//                                 </a>
//                               </motion.li>
//                             ))}
//                           </motion.ul>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>
//               ))}
//               <div className="showcase_navigation_nav-link_wrapper">
//                 <p
//                   className="showcase_navigation_nav-link"
//                   onClick={() => setIsOpen(!isOpen)}
//                 >
//                   SHOP
//                 </p>
//               </div>
//             </div>

//             <div className="showcase_navigation_action">
//               <div className="b--icon-32x32 w-embed">
//                 <img
//                   src="../images/logo_icon.png"
//                   alt="Logo Icon"
//                   className="icon-replacement"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </motion.div>
//   )
// }


// ================================================================= //

// "use client"
// import { useState } from "react"
// import * as motion from "motion/react-client"
// import { Session } from "next-auth"
// import Header from "./Header"

// export default function Navbar({ user }: { user: Session}) {
//   const [isOpen, setIsOpen] = useState(false)

//   const navigationLinks = [
//     {
//       title: "ABOUT",
//       sublinks: ["Team", "Manifesto", "Testimonials", "Locations", "Patient Login"],
//     },
//     {
//       title: "PATIENT",
//       sublinks: ["Your Care", "Financing Treatment"],
//     },
//     {
//       title: "TREATMENTS",
//       sublinks: ["Invisalign", "Braces", "Early & Adult Orthodontics"],
//     },
//   ]

//   const navVariants = {
//     open: {
//       transition: { staggerChildren: 0.2, delayChildren: 0.25 },
//     },
//     closed: {
//       transition: { staggerChildren: 0.05, staggerDirection: -1 },
//     },
//   }

//   const itemVariants = {
//     open: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         y: { stiffness: 1000, velocity: -100 },
//       },
//     },
//     closed: {
//       y: 50,
//       opacity: 0,
//       transition: {
//         y: { stiffness: 1000 },
//       },
//     },
//   }

//   return (
//     <>
//       <Header />
//       <motion.div className="hidden" initial={false} animate={isOpen ? "open" : "closed"}>
//         <motion.div>
//           <section className="section_showcase">
//             <div className="containernav">
//               <div className="showcase_navigation">
//                 <div className="showcase_navigation_start">
//                   <div className="b--icon-40x40 w-embed">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 13 12"
//                       width="100%"
//                       height="100%"
//                       preserveAspectRatio="xMidYMid meet"
//                     >
//                       <path
//                         fill-rule="evenodd"
//                         clip-rule="evenodd"
//                         d="M7.1831 3.1236L6.41346 0L5.64383 3.12359C5.49365 3.73311 5.41855 4.03787 5.26216 4.28585C5.12382 4.50521 4.94023 4.69149 4.72404 4.83185C4.47963 4.99053 4.17927 5.06672 3.57854 5.2191L0.5 6L3.57854 6.7809C4.17927 6.93328 4.47963 7.00947 4.72404 7.16815C4.94023 7.30851 5.12383 7.49479 5.26216 7.71415C5.41856 7.96213 5.49365 8.26689 5.64383 8.87641L6.41346 12L7.1831 8.87641C7.33328 8.26689 7.40837 7.96213 7.56476 7.71415C7.7031 7.49479 7.8867 7.30851 8.10289 7.16815C8.3473 7.00947 8.64766 6.93328 9.24838 6.7809L12.3269 6L9.24838 5.2191C8.64766 5.06672 8.3473 4.99053 8.10289 4.83185C7.8867 4.69149 7.7031 4.50521 7.56476 4.28585C7.40837 4.03787 7.33328 3.73311 7.1831 3.1236Z"
//                         fill="#03450B"
//                       ></path>
//                     </svg>
//                   </div>
//                 </div>

//                 <div className="showcase_navigation_nav">
//                   {navigationLinks.map((link, index) => (
//                     <div className="showcase_navigation_nav-link_wrapper">
//                       <p
//                         className="showcase_navigation_nav-link"
//                         onClick={() => setIsOpen(!isOpen)}
//                       >
//                         {link.title}
//                       </p>
//                     </div>
//                   ))}
//                   <div className="showcase_navigation_nav-link_wrapper">
//                     <p
//                       className="showcase_navigation_nav-link"
//                       onClick={() => setIsOpen(!isOpen)}
//                     >
//                       SHOP
//                     </p>
//                   </div>
//                 </div>

//                 <div className="showcase_navigation_action">
//                   <div className="b--icon-32x32 w-embed">
//                     <img
//                       src="../images/logo_icon.png"
//                       alt="Logo Icon"
//                       className="icon-replacement"
//                     />
//                   </div>
//                 </div>

//                 <motion.div
//                   className="h2-menu"
//                   animate={{ y: isOpen ? "0%" : "-100%" }}
//                   transition={{
//                     duration: 0.4,
//                     scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
//                   }}
//                   style={{
//                     visibility: isOpen ? "visible" : "hidden",
//                   }}
//                 >
//                   <div className="h2-menu-container">
//                     <div className="h2-menu-row py-12 cursor-pointer">
//                       <div
//                         className="h2-menu-wrapper-top"
//                         onClick={() => setIsOpen(!isOpen)}
//                       >
//                         <p className="h2-menu-text-number">X</p>
//                       </div>
//                     </div>

//                     <motion.ul variants={navVariants}>
//                       {[
//                         "Team",
//                         "Manifesto",
//                         "Testimonials",
//                         "Locations",
//                         "Patient Login",
//                       ].map((heading, index) => (
//                         <motion.li
//                           key={index}
//                           variants={itemVariants}
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.95 }}
//                         >
//                           <a
//                             href="#"
//                             className={`h2-menu-row h2-menu-row-${index + 1} ${
//                               isOpen ? "open" : ""
//                             }`}
//                             style={{
//                               animationDelay: isOpen ? `${index * 0.1}s` : "0s",
//                             }}
//                           >
//                             <div className="h2-menu-wrapper-top">
//                               <p className="h2-menu-text-number">{`0${
//                                 index + 1
//                               }`}</p>
//                               <h1 className="h2-menu-heading">{heading}</h1>
//                             </div>
//                             <div
//                               className="h2-menu-wrapper-center"
//                               style={{
//                                 opacity: isOpen ? 1 : 0,
//                                 transition: "opacity 0.5s ease",
//                               }}
//                             >
//                               <img
//                                 src="../images/greyblue.png"
//                                 loading="lazy"
//                                 alt=""
//                                 className="h2-menu-image"
//                               />
//                             </div>
//                           </a>
//                         </motion.li>
//                       ))}
//                     </motion.ul>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </section>
//         </motion.div>
//       </motion.div>
//     </>
//   )
// }


// ================================================================= //


{
  /* <motion.div initial={false} animate={isOpen ? "open" : "closed"}>
  <motion.div>
    <section className="section_showcase">
      <div className="containernav">
        <div className="showcase_navigation">
          <div className="showcase_navigation_start">
            <div class="b--icon-40x40 w-embed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 13 12"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.1831 3.1236L6.41346 0L5.64383 3.12359C5.49365 3.73311 5.41855 4.03787 5.26216 4.28585C5.12382 4.50521 4.94023 4.69149 4.72404 4.83185C4.47963 4.99053 4.17927 5.06672 3.57854 5.2191L0.5 6L3.57854 6.7809C4.17927 6.93328 4.47963 7.00947 4.72404 7.16815C4.94023 7.30851 5.12383 7.49479 5.26216 7.71415C5.41856 7.96213 5.49365 8.26689 5.64383 8.87641L6.41346 12L7.1831 8.87641C7.33328 8.26689 7.40837 7.96213 7.56476 7.71415C7.7031 7.49479 7.8867 7.30851 8.10289 7.16815C8.3473 7.00947 8.64766 6.93328 9.24838 6.7809L12.3269 6L9.24838 5.2191C8.64766 5.06672 8.3473 4.99053 8.10289 4.83185C7.8867 4.69149 7.7031 4.50521 7.56476 4.28585C7.40837 4.03787 7.33328 3.73311 7.1831 3.1236Z"
                  fill="#03450B"
                ></path>
              </svg>
            </div>
          </div>

          <div className="showcase_navigation_nav">
            <div className="showcase_navigation_nav-link_wrapper">
              <p
                className="showcase_navigation_nav-link"
                onClick={() => setIsOpen(!isOpen)}
              >
                ABOUT
              </p>
            </div>
            <div className="showcase_navigation_nav-link_wrapper">
              <p
                className="showcase_navigation_nav-link"
                onClick={() => setIsOpen(!isOpen)}
              >
                PATIENT
              </p>
            </div>
            <div className="showcase_navigation_nav-link_wrapper">
              <p
                className="showcase_navigation_nav-link"
                onClick={() => setIsOpen(!isOpen)}
              >
                TREATMENTS
              </p>
            </div>
            <div className="showcase_navigation_nav-link_wrapper">
              <p
                className="showcase_navigation_nav-link"
                onClick={() => setIsOpen(!isOpen)}
              >
                SHOP
              </p>
            </div>
          </div>

          <div className="showcase_navigation_action">
            <div className="b--icon-32x32 w-embed">
              <img
                src="../images/logo_icon.png"
                alt="Logo Icon"
                class="icon-replacement"
              />
            </div>
          </div>

          <motion.div
            className="h2-menu"
            animate={{ y: isOpen ? "0%" : "-100%" }}
            transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            style={{
              visibility: isOpen ? "visible" : "hidden",
            }}
          >
            <div className="h2-menu-container">
              <div className="h2-menu-row py-12 cursor-pointer">
                <div
                  className="h2-menu-wrapper-top"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <p className="h2-menu-text-number">X</p>
                </div>
              </div>

              <motion.ul variants={navVariants}>
                {[
                  "Team",
                  "Manifesto",
                  "Testimonials",
                  "Locations",
                  "Patient Login",
                ].map((heading, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="#"
                      className={`h2-menu-row h2-menu-row-${index + 1} ${
                        isOpen ? "open" : ""
                      }`}
                      style={{
                        animationDelay: isOpen ? `${index * 0.1}s` : "0s",
                      }}
                    >
                      <div className="h2-menu-wrapper-top">
                        <p className="h2-menu-text-number">{`0${
                          index + 1
                        }`}</p>
                        <h1 className="h2-menu-heading">{heading}</h1>
                      </div>
                      <div
                        className="h2-menu-wrapper-center"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transition: "opacity 0.5s ease",
                        }}
                      >
                        <img
                          src="../images/greyblue.png"
                          loading="lazy"
                          alt=""
                          className="h2-menu-image"
                        />
                      </div>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </motion.div>
</motion.div> */
}

