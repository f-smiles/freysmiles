"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { XIcon } from "lucide-react";
import { background, height, opacity, translate, sublinkVariants } from "./desktop-anim";
import { links } from "./desktop-links";
import styles from "./style.module.css";
import CartComponent from "@/components/cart/cart-component";
import UserButton from "@/components/auth/user-button";
import { useCartStore } from "@/lib/cart-store";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function DesktopNav({ user }) {

  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCartStore();

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
        .filter(
          (trigger) => trigger.trigger === document.querySelector(".scroll-nav")
        )
        .forEach((trigger) => trigger.kill());

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-nav",
          start: "top top",
          end: "bottom 64px",
          scrub: true,
        },
      });

      timeline.to(".scroll-nav", { width: "80%", padding: "0px" });
    }, 250); // delay for next to finish rendering

    return () => {
      clearTimeout(delayAnimation);
      ScrollTrigger.getAll()
        .filter(
          (trigger) => trigger.trigger === document.querySelector(".scroll-nav")
        )
        .forEach((trigger) => trigger.kill());
    };
  }, [pathname]); // rerun gsap on route change

  // reset navbar

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  // Reset nav when route changes
  useEffect(() => {
    setIsActive(false);
    setSelectedLink(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsActive(false);
      }
    }

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);

  const navRef = useRef();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const currentYearElements = document.querySelectorAll(
      "[data-current-year]"
    );
    currentYearElements.forEach((currentYearElement) => {
      currentYearElement.textContent = currentYear;
    });
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
const bgRef = useRef(null);

// useEffect(() => {
//   const wrapper = wrapperRef.current;
//   const buttons = wrapper.querySelectorAll("[data-flip-button='button']");
//   const bg = bgRef.current;

//   const moveBg = (target) => {
//     const state = Flip.getState(bg);
//     target.appendChild(bg);
//     Flip.from(state, {
//       duration: 0.4,
//       ease: "power2.out",
//       absolute: true,
//     });
//   };

//   buttons.forEach((button, index) => {
//     button.addEventListener("mouseenter", () => moveBg(button));
//     button.addEventListener("focus", () => moveBg(button));
//     button.addEventListener("mouseleave", () => moveBg(buttons[activeIndex]));
//     button.addEventListener("blur", () => moveBg(buttons[activeIndex]));
//   });


//   if (buttons[activeIndex]) buttons[activeIndex].appendChild(bg);
// }, [activeIndex]);


  return (
    <>
      <motion.nav
        id="desktop-nav"
        className={`${styles.header} ${
          isScrolled
            ? "bg-opacity-80 text-[#000]"
            : "text-[#595959] bg-transparent"
        } fixed top-0 w-full z-50 transition-all duration-300 ease-in-out`}
      >
        <motion.div
          className="relative pt-[16px] flex items-center justify-between uppercase m-auto transition-[width] duration-1000 ease-in-out scroll-nav"
          variants={opacity}
          animate={!isActive ? "open" : "closed"}
        >
          <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}>
            <motion.div
              ref={wrapperRef}
              className="relative flex items-center py-4"
            >
              <div className="flex gap-1">
                {links.slice(0, 4).map((link, i) => (
                  <motion.div
                    key={`${i}-${link.title}`}
                    data-flip-button="button"
                    className="bg-[#F2F2F2]/70 text-black rounded-[8px] px-6 py-3 flex items-center relative border border-gray-300 transition-colors duration-200 hover:border-gray-500"
                    onClick={() => {
                      setSelectedLink(link.title);
                      setIsActive(!isActive);
                      setActiveIndex(i);
                    }}
                  >
                    <motion.p
                      className="text-gray-500 font-neuehaas35 tracking-wider text-[11px] cursor-pointer"
                      variants={opacity}
                      animate={!isActive ? "open" : "closed"}
                    >
                      {link.title}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <Link href="/" className="absolute mx-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg className="size-[72px]" fill="#fff" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 299.67 158">
              <g id="Layer_4" data-name="Layer 4">
                <g id="freysmiles_logo" data-name="freysmiles logo">
                  <g id="f">
                    <path d="M25,0h0C38.8,0,50,11.2,50,25v24c0,.55-.45,1-1,1H25C11.2,50,0,38.8,0,25H0C0,11.2,11.2,0,25,0Z" fill="#000" /> {/* red */}
                    <path d="M79.37,0h30C123.17,0,134.38,11.2,134.38,25h0c0,13.8-11.2,25-25,25H55.38c-.55,0-1-.45-1-1V25C54.38,11.2,65.58,0,79.37,0Z" fill="#000" /> {/* orange */}
                    <path d="M25,54h24c.55,0,1,.45,1,1v24c0,13.8-11.2,25-25,25h0C11.2,104,0,92.8,0,79H0C0,65.2,11.2,54,25,54Z" fill="#000" /> {/* yellow */}
                    <path d="M55.38,54h24c13.8,0,25,11.2,25,25h0c0,13.8-11.2,25-25,25h-24c-.55,0-1-.45-1-1V55c0-.55,.45-1,1-1Z" fill="#000" /> {/* green */}
                    <path d="M25,108h24c.55,0,1,.45,1,1v24c0,13.8-11.2,25-25,25H1C.45,158,0,157.55,0,157v-24C0,119.2,11.2,108,25,108Z" fill="#000" /> {/* light blue */}
                  </g>
                  <g id="s">
                    <path d="M180.75,0h37.96c.55,0,1,.45,1,1V74.96c0,.55-.45,1-1,1h-37.96c-20.42,0-37-16.58-37-37v-1.96C143.75,16.58,160.33,0,180.75,0Z" fill="#000" /> {/* purple */}
                    <path d="M224.71,0h37.96C283.09,0,299.67,16.58,299.67,37v37.96c0,.55-.45,1-1,1h-37.96c-20.42,0-37-16.58-37-37V1C223.71,.45,224.16,0,224.71,0Z" fill="#000" /> {/* blue */}
                    <path d="M144.75,79.96h37.96c20.42,0,37,16.58,37,37v37.96c0,.55-.45,1-1,1h-37.96c-20.42,0-37-16.58-37-37v-37.96c0-.55,.45-1,1-1Z" fill="#000" /> {/* indigo */}
                    <path d="M224.71,79.96h37.96c20.42,0,37,16.58,37,37v1.96c0,20.42-16.58,37-37,37h-37.96c-.55,0-1-.45-1-1V80.96c0-.55,.45-1,1-1Z" fill="#000" /> {/* light green */}
                  </g>
                </g>
              </g>
            </svg>
            {/* <motion.div
              className={`${
                isActive ? "hidden" : "block"
              }    text-black flex justify-center items-center  p-3`}
            >
              <div
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <video
                  id="holovideo"
                  loop
                  muted
                  autoPlay
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.25)",
                    boxShadow: "0 0 50px #ebe6ff80",
                  }}
                >
                  <source
                    src="https://cdn.refokus.com/ttr/speaking-ball.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <svg width="14" height="17" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#A3A8F0" stop-opacity="0.4" />
                    <stop offset="50%" stop-color="#C6B5F7" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#A0EACF" stop-opacity="0.2" />
                  </linearGradient>
                  <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
                  </filter>
                </defs>
                <g fill="url(#glassGradient)">
                  <path d="M0 8H8V34H0V24H8V16H0V8Z" />
                  <rect x="8" width="20" height="8" />
                  <rect x="8" y="16" width="16" height="8" />
                </g>
              </svg>
            </motion.div> */}
          </Link>

          <motion.div
            variants={opacity}
            animate={!isActive ? "open" : "closed"}
          >
            {/* styles.el */}
            <motion.div className="flex items-center">
              {cart.length > 0 && (
                <motion.div
                  className="bg-black backdrop-blur-lg shadow-lg shadow-white/10 rounded-full px-1 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CartComponent />
                </motion.div>
              )}
              <Link href="/book-now">
                <motion.div
                  className="bg-black backdrop-blur-lg shadow-lg shadow-white/10 text-[white] rounded-full px-6 py-5 font-helvetica-neue-light tracking-wider text-[11px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book
                </motion.div>
              </Link>
              <Link href="/">
                <motion.div
                  className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-[11px] font-helvetica-neue-light"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  MAIN
                </motion.div>
              </Link>
              <Link href="/shop/products">
                <motion.div
                  className="flex items-center justify-center w-10 h-16 transition-all bg-black rounded-full shadow-lg cursor-pointer backdrop-blur-lg shadow-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="rotate-90 text-white font-helvetica-neue-light text-[11px]">
                    Shop
                  </span>
                </motion.div>
              </Link>
            </motion.div>

          </motion.div>
        </motion.div>

        <motion.div
          onClick={() => setIsActive(false)}
          variants={background}
          initial="initial"
          animate={isActive ? "open" : "closed"}
          className="fixed top-0 left-0 w-screen h-[90vh] z-40 bg-white backdrop-blur-2xl"
          style={{ overflow: "hidden" }}
        >
          <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <p className="text-[14vw] font-neueroman text-black tracking-tight select-none leading-[1.1]">
              <span data-current-year=""></span>
            </p>
          </div>
        </motion.div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            ref={navRef}
            variants={height}
            initial="initial"
            animate="enter"
            exit="exit"
            className={`${styles.nav} z-50 `}
          >
            <button
              onClick={() => setIsActive(false)}
              className="absolute z-50 text-6xl transition-opacity top-6 right-6 font-neuehaasdisplay15light hover:opacity-70"
            >
              ×
            </button>
            <div className="flex w-full px-12 py-24">
              {/* LEFT */}
              <div className="flex flex-col w-1/2 gap-6">
  {links.map(
    (link, i) =>
      selectedLink === link.title && (
        <div key={link.title} className="contents">
          {link.sublinks.map((sublink, j) => (
            <motion.div
              key={sublink}
              variants={sublinkVariants}
              initial="initial"
              animate="open"
              exit="closed"
              custom={j}
              whileHover="hover"
              className="relative flex flex-col py-2 overflow-hidden cursor-pointer"
            >
              <Link
                href={link.hrefs[j]}
                onClick={() => setIsActive(false)}
                className="contents"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-saolitalic opacity-60">
                      ({j + 1})
                    </p>
                    <h2 className="text-[24px] font-light uppercase font-neueroman">
                      {sublink}
                    </h2>
                  </div>
                </div>

                <div className="relative w-full mt-2 h-[1px] bg-neutral-200 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-black"
                    variants={{
                      initial: { width: 0 },
                      hover: { width: "100%" },
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
          {link.component && link.component(user)}
        </div>
      )
  )}
</div>
              {/* RIGHT */}
              <div className="flex flex-col justify-center w-1/2 gap-8 text-sm text-center font-neuehaas35">
                <div>
                  <p className="mb-2 text-xs uppercase font-neuehaas35 opacity-70">
                    E:
                  </p>
                  <div className="flex flex-col gap-1 underline underline-offset-2">
                    <a href="mailto:info@email.com">info@freysmiles.com</a>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs uppercase font-neuehaas35 opacity-70">
                    T:
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-neuehaas35">
                      (610) 437-4748
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-neuehaas35 opacity-70">
                    Social
                  </p>
                  <div className="flex flex-col gap-1 underline underline-offset-2">
                    <a href="#">Instagram</a>
                    <a href="#">Facebook</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
