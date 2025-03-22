"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { XIcon } from "lucide-react";
import { background, height, opacity, translate } from "./desktop-anim";
import { links } from "./desktop-links";
import styles from "./style.module.css";
import CartComponent from "@/components/cart/cart-component";
import UserButton from "@/components/auth/user-button";
import { useCartStore } from "@/lib/cart-store";

gsap.registerPlugin(ScrollTrigger);

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

  return (
    <>
      <motion.nav
        id="desktop-nav"
        className={`${styles.header} ${
          isScrolled
            ? "bg-opacity-80 text-[#000]"
            : "text-[#000] bg-transparent"
        } fixed top-0 w-full z-50 transition-all duration-300 ease-in-out`}
      >
        <motion.div
          className="pt-[16px] flex items-center justify-between uppercase m-auto transition-[width] duration-1000 ease-in-out scroll-nav"
          variants={opacity}
          animate={!isActive ? "open" : "closed"}
        >
          <motion.div
            variants={opacity}
            animate={!isActive ? "open" : "closed"}
          >
            {" "}
            {/* styles.el */}
            <motion.div className="bg-[#C2C1C7]/50 shadow-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
              {" "}
              {/* styles.label */}
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
            <motion.div
              className={`${
                isActive ? "hidden" : "block"
              }  font-calyx  text-[48px] text-black flex justify-center items-center   p-3`}
            >
              {/* <img src="../../images/logo_icon.png" alt="Logo Icon" className="w-full h-full icon-replacement" /> */}
              FS
            </motion.div>
          </Link>

          <motion.div
            variants={opacity}
            animate={!isActive ? "open" : "closed"}
          >
            {" "}
            {/* styles.el */}
            <motion.div className=" flex items-center gap-4">
              {" "}
              {/* styles.label */}
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
                <p className="bg-[#F2F2F2]/50 backdrop-blur-lg shadow-lg shadow-white/10 text-black rounded-2xl px-6 py-3 font-helvetica-neue-light tracking-wider text-[13px] tracking-wider">
                  Book Now
                </p>
              </Link>
              <Link href="/shop/products">
                <motion.div
                  className="bg-[#C2C1C7]/50 backdrop-blur-lg shadow-lg shadow-white/10  rounded-full px-6 flex items-center cursor-pointer transition-all h-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-helvetica-neue-light tracking-wider text-[13px]">
                    Shop
                  </span>
                  <div className="ml-2 flex items-center justify-center h-full">
                    <motion.div
                      className="py-2 px-4 flex justify-center items-center bg-white rounded-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-[#C8C8C8] text-lg">&rarr;</span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
              {cart.length > 0 && <CartComponent isScrolled={isScrolled} />}
              {user ? (
                <UserButton user={user} />
              ) : (
                <Link href="/auth/login">
                  <p className="font-helvetica-neue-light tracking-wider text-[13px] ">
                    Login
                  </p>
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
          className="fixed top-0 left-0 w-screen h-[90vh] z-40 bg-white backdrop-blur-2xl"
          style={{ overflow: "hidden" }}
        >
          <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <p className="card__text text-[14vw] font-neueroman tracking-tight select-none leading-[1.1]">
              2025
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
            className={`${styles.nav} z-50  `}
          >
            <button
              onClick={() => setIsActive(false)}
              className="absolute top-6 right-6 text-6xl font-neuehaasdisplay15light hover:opacity-70 transition-opacity z-50"
            >
              ×
            </button>
            <div className="flex  w-full px-12 py-24">
              {/* LEFT */}
              <div className="flex flex-col gap-6 w-1/2">
                {links.map(
                  (link, i) =>
                    selectedLink === link.title &&
                    link.sublinks.map((sublink, j) => (
                      <motion.div
                        key={sublink}
                        whileHover="hover"
                        initial="initial"
                        className="relative flex flex-col cursor-pointer py-4"
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
                              className="absolute left-0 top-0 h-full bg-black"
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
                    ))
                )}
              </div>

              {/* RIGHT */}
              <div className="flex font-neuehaasdisplaylight justify-center text-center flex-col text-sm gap-8 w-1/2">
                <div>
                  <p className="uppercase text-xs mb-2 opacity-70">E:</p>
                  <div className="flex flex-col gap-1 underline underline-offset-2">
                    <a href="mailto:info@email.com">info@freysmiles.com</a>
                  </div>
                </div>

                <div>
                  <p className="uppercase text-xs mb-2 opacity-70">T:</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-neuehaasdisplaylight">
                      (610) 437-4748
                    </p>
                  </div>
                </div>

                <div>
                  <p className="uppercase text-xs mb-2 opacity-70">SOCIAL</p>
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
