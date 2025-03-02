'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as motion from 'motion/react-client'
import { AnimatePresence } from 'motion/react'
import { XIcon } from 'lucide-react'
import { background, height, opacity } from './anim'
import { links } from './links'
import styles from './style.module.css'
import CartComponent from '@/components/cart/cart-component';
import UserButton from '@/components/auth/user-button';

export default function DesktopNav({ user }) {
  const pathname = usePathname();
  
  const [isActive, setIsActive] = useState(false)

  const [selectedLink, setSelectedLink] = useState(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const delayAnimation = setTimeout(() => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.scroll-nav',
          start: 'top top',
          end: 'bottom 64px',
          scrub: true,
        },
      });

      timeline.to('.scroll-nav', { width: '80%', padding: '0px' });

    }, 250); // delay for next to finish rendering

    return () => {
      clearTimeout(delayAnimation); 
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); 
    };
  }, [pathname]); // rerun gsap on route change

  // reset navbar
  useEffect(() => {
    setIsActive(false);
    setSelectedLink(null);
  }, [pathname]);

  return (
    <motion.nav
      id="desktop-nav"
      className={`${styles.header} ${isActive ? "bg-[#e1f672]" : ""} hidden md:block`}
      transition={{ duration: 1, scale: { type: "spring", visualDuration: 1 }}}
    >
      <motion.div className="pt-[16px] flex items-center justify-between uppercase m-auto transition-all duration-1000 ease-in-out scroll-nav" variants={opacity} animate={!isActive ? "open" : "closed"}>
        <Link href="/">
          <motion.div className={`${isActive ? "hidden" : "block"} bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3`}>
            <img src="../../images/logo_icon.png" alt="Logo Icon" className="w-full h-full icon-replacement" />
          </motion.div>
        </Link>

        <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}> {/* styles.el */}
          <motion.div className="flex items-center gap-4"> {/* styles.label */}
            {links.map((link, i) => (
              <motion.p
                key={`${i} + ${link}`}
                className="text-black text-md hover:cursor-pointer"
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
            <CartComponent />
            {user 
              ? <UserButton user={user} /> 
              : (
                <Link href="/auth/login">
                  <p className="text-md">Login</p>
                </Link>
              )
            }
          </motion.div>
        </motion.div>

        <motion.div variants={opacity} animate={!isActive ? "open" : "closed"} className="flex items-center gap-4">
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
              <button type="button" onClick={() => setIsActive(!isActive)} className="flex items-start self-end cursor-pointer h2-menu-row">
                <XIcon className="w-4 h-4 top-3 -left-5 text-primary-700 h2-menu-text-number" />
                {/* <h1 className="mb-4 text-[40px] text-zinc-700">Close</h1> */}
              </button>
              {links.map((link) => (
                <div key={link.title}>
                  {selectedLink === link.title && link.sublinks.map((sublink, i) => (
                    <Link key={sublink} href={link.hrefs[i]} onClick={() => setIsActive(false)} className={`h2-menu-row h2-menu-row-${i + 1} hover:cursor-pointer ${isActive ? "open" : ""}`}>
                      <div className="cursor-pointer h2-menu-wrapper-top">
                        <p className="h2-menu-text-number">{`0${i + 1}`}</p>
                        <h1 className="h2-menu-heading">{sublink}</h1>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}