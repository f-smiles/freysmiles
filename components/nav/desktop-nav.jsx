'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as motion from 'motion/react-client'
import { AnimatePresence } from 'motion/react'
import { XIcon } from 'lucide-react'
import { background, height, opacity } from './desktop-anim'
import { links } from './desktop-links'
import styles from './style.module.css'
import CartComponent from '@/components/cart/cart-component';
import UserButton from '@/components/auth/user-button';

gsap.registerPlugin(ScrollTrigger);

export default function DesktopNav({ user }) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true); 
      } else {
        setIsScrolled(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const delayAnimation = setTimeout(() => {

      ScrollTrigger.getAll()
        .filter(trigger => trigger.trigger === document.querySelector('.scroll-nav'))
        .forEach((trigger) => trigger.kill());
  
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
      ScrollTrigger.getAll()
        .filter(trigger => trigger.trigger === document.querySelector('.scroll-nav'))
        .forEach((trigger) => trigger.kill());
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
      className={`${styles.header} ${
        isScrolled ? "bg-opacity-80 text-black" : "text-black bg-transparent"
      } fixed top-0 w-full z-50 transition-all duration-300 ease-in-out`}
    >
      <motion.div 
        className="pt-[16px] flex items-center justify-between uppercase m-auto transition-all duration-1000 ease-in-out scroll-nav"
        variants={opacity} 
        animate={!isActive ? "open" : "closed"}
      >
        
        <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}> {/* styles.el */}
          <motion.div className="flex items-center gap-4"> {/* styles.label */}
            {links.slice(0, 4).map((link, i) => (
              <motion.p
                key={`${i} + ${link}`}
                className="font-helvetica-neue-light tracking-wider text-[13px] hover:cursor-pointer"
                onClick={() => {
                  setSelectedLink(link.title);
                  setIsActive(!isActive);
                }}
                variants={opacity}
                animate={!isActive ? "open" : "closed"}
              >
                {link.title}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>

  
        <Link href="/">
          <motion.div className={`${isActive ? "hidden" : "block"} bg-[#e0ff33] rounded-full flex justify-center items-center w-10 h-10 p-3`}>
            <img src="../../images/logo_icon.png" alt="Logo Icon" className="w-full h-full icon-replacement" />
          </motion.div>
        </Link>

        <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}> {/* styles.el */}
          <motion.div className="flex items-center gap-4"> {/* styles.label */}
            {links.slice(4, 7).map((link, i) => (
              <motion.p
                key={`${i} + ${link}`}
                className="font-helvetica-now-display tracking-wider text-[13px] hover:cursor-pointer"
                onClick={() => {
                  setSelectedLink(link.title);
                  setIsActive(!isActive);
                }}
                variants={opacity}
                animate={!isActive ? "open" : "closed"}
              >
                {link.title}
              </motion.p>
            ))}
            

            <Link href="/book-now">
              <p className="font-helvetica-neue-light tracking-wider text-[13px] tracking-wider">Book Now</p>
            </Link>

 
            <Link href="/shop/products">
              <p className="font-helvetica-neue-light tracking-wider text-[13px] ">Shop</p>
            </Link>
            
            <CartComponent isScrolled={isScrolled}  />
            
            {user ? (
              <UserButton user={user} />
            ) : (
              <Link href="/auth/login">
                <p className="font-helvetica-neue-light tracking-wider text-[13px] ">Login</p>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        onClick={() => setIsActive(false)} 
        variants={background} 
        initial="initial" 
        animate={isActive ? "open" : "closed"} 
        className={styles.background}
      ></motion.div>

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div variants={height} initial="initial" animate="enter" exit="exit" className={`${styles.nav} z-50`}>
            <div className="flex flex-col max-w-4xl m-auto"> {/* styles.body */}
              <button type="button" onClick={() => setIsActive(!isActive)} className="flex items-start self-end cursor-pointer h2-menu-row">
                <XIcon className="w-4 h-4 top-3 -left-5 text-primary-700 h2-menu-text-number" />
              </button>
              {links.map((link) => (
                <div key={link.title}>
                  {selectedLink === link.title && link.sublinks.map((sublink, i) => (
                    <Link 
                      key={sublink} 
                      href={link.hrefs[i]} 
                      onClick={() => setIsActive(false)} 
                      className={`h2-menu-row h2-menu-row-${i + 1} hover:cursor-pointer ${isActive ? "open" : ""}`}
                    >
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