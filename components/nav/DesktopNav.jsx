'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { XIcon } from 'lucide-react'
import * as motion from 'motion/react-client'
import { AnimatePresence } from 'motion/react'
import { background, height, opacity } from './anim'
import { links } from './links'
import styles from './style.module.css'
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation';
export default function DesktopNav({ user }) {
  const pathname = usePathname();
  
  const [isActive, setIsActive] = useState(false)

  const [selectedLink, setSelectedLink] = useState(null)

  //old useEffect
  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger)

  //   const timeline = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: ".scroll-nav",
  //       start: "top top",
  //       end: "bottom 64px",
  //       scrub: true,
  //     },
  //   })
  //   timeline.to(".scroll-nav", {
  //     width: "80%",
  //     padding: "0px",
  //   })

  //   return () => {
  //     timeline.to(".scroll-nav", { width: "100%", padding: "16px" })
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  //   }
  // }, [])

  // bg-[rgb(225,_246,_114)]


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
// make gsap wait until next loads new page before animating it.
    const delayAnimation = setTimeout(() => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // now make sure that element exists before applying gsap
      const navbar = document.querySelector('.scroll-nav');
      if (!navbar) {
        return;
      }
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: navbar,
          start: 'top top',
          end: 'bottom 64px',
          scrub: true,
        },
      });

      timeline.to(navbar, { width: '80%', padding: '0px' });

    }, 250); // delay for next to finish rendering

    return () => {
      clearTimeout(delayAnimation); 
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); 
    };
  }, [pathname]); // rerun gsap on route change

  // now reset navbar
  useEffect(() => {
    setIsActive(false);
    setSelectedLink(null);
  }, [pathname]);

  return (
    <motion.div
      className={`${styles.header} ${isActive ? "rounded-none bg-[#e0ff33]" : ""} hidden lg:block`}
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
  )
}