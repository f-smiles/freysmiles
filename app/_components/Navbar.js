"use client";
import Link from "next/link";

import {
  motion,
  useScroll,
  AnimatePresence,
  useTransform,
  stagger,
  useAnimate,
  useInView,
} from "framer-motion";
import { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { selectBag, removeFromBag } from "../_store/reducers/bagReducer";
import BagIcon from "./ui/BagIcon";
import Bars2Icon from "./ui/Bars2Icon";
import XIcon from "./ui/XIcon";
import CartComponent from "@/components/cart/cart-component";
import UserButton from "@/components/auth/user-button";
import { SignInButton } from "@/components/auth/signin-button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ user }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTestimonialsClick = (e, href) => {
    e.preventDefault();
    setIsTransitioning(true);

    setTimeout(() => {
      window.location.href = href;
      setIsTransitioning(false);
    }, 1000);
  };

  const dispatch = useDispatch();

  const bag = useSelector(selectBag);

  const [isBagOpen, setIsBagOpen] = useState(false);
  const [about, setAbout] = useState(false);
  const [patient, setPatient] = useState(false);
  const [treatments, setTreatments] = useState(false);

  const about_us_links = [
    { name: "Our Team", href: "/our-team" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Locations", href: "/#locations-section", hashLink: true },
  ];

  const patient_links = [
    { name: "Your Care", href: "/your-care" },
    { name: "Financing Treatment", href: "/financing-treatment" },
    {
      name: "Patient Login",
      href: "https://my.orthoblink.com/bLink/Login",
      external: true,
    },
  ];

  const treatments_links = [
    { name: "Invisalign", href: "/invisalign" },
    { name: "Braces", href: "/braces" },
    { name: "Early & Adult Orthodontics", href: "/early-adult-orthodontics" },
  ];

  const handleToggleBagPanel = () => {
    setIsBagOpen(!isBagOpen);
  };

  const handleToggleAbout = () => {
    setAbout(!about);
  };

  const handleTogglePatient = () => {
    setPatient(!patient);
  };

  const handleToggleTreatments = () => {
    setTreatments(!treatments);
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    subtotal = bag
      .map((item) => item.product.price * item.quantity)
      .reduce((acc, cur) => acc + cur, 0);
    return subtotal;
  };

  // const calculateItemsQuantity = () => {
  //   let itemsQuantity = 0
  //   itemsQuantity = bag
  //     .map((item) => item.quantity)
  //     .reduce((acc, cur) => acc + cur, 0)
  //   return itemsQuantity
  // }

  const handleCheckout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/checkout/checkout-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bag),
      }
    );
    const data = await res.json();
    window.location.assign(data);
  };

  /* mobile nav */
  const [show, setShow] = useState(null);
  const handleToggleMobileNav = () => {
    // setShow((prevState) => !prevState)
    setShow(!show);
  };

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".showcase_navigation",
      { width: "5rem" },
      { width: "30rem", duration: 1.5, ease: "power2.inOut" }
    )
      .fromTo(
        ".showcase_navigation_start",
        { rotation: 0 },
        { rotation: 360, duration: 1.5, ease: "power1.inOut" },
        0
      )
      .fromTo(
        ".showcase_navigation_action",
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      )
      .fromTo(
        ".showcase_navigation_nav-link_wrapper",
        { width: 0 },
        { width: "auto", duration: 0.6, ease: "power1.inOut", stagger: 0.2 }
      );
  }, []);




  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      return !prev;
    });
  };

  const cursorBigRef = useRef(null);
  const cursorSmallRef = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      if (cursorBigRef.current) {
        cursorBigRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (cursorSmallRef.current) {
        cursorSmallRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header className="overflow-hidden">
      <div className="h2-page-wrapper">
        <div
          className="h2-hero-cursor-wrapper"
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={cursorBigRef}
            className="h2-hero-cursor-big"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 0, 0.7)",
              position: "absolute",
              transform: "translate3d(0, 0, 0)",
              transition: "transform 0.1s ease-out",
            }}
          ></div>
          <div
            ref={cursorSmallRef}
            className="h2-hero-cursor-small"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 0, 0.7)",
              position: "absolute",
              transform: "translate3d(0, 0, 0)",
              transition: "transform 0.05s ease-out",
            }}
          ></div>
        </div>

        <nav className="h2-navbar">
          <div className="h2-navbar-container">
          <div>
  <a
    href="#"
    className="h2-navbar-menu-button w-inline-block"
    onClick={toggleMenu}
    style={{
      position: "absolute",
      top: "20px",
      left: "20px",
      cursor: "pointer",
      zIndex: 9999,
      textDecoration: "none",
    }}
  >
    <p
      className="h2-navbar-text-absolute"
      style={{
        display: isMenuOpen ? "block" : "none",
      }}
    >
      Close
    </p>
    <p
      className="h2-navbar-text"
      style={{
        display: isMenuOpen ? "none" : "block", 
      }}
    >
      Menu
    </p>
  </a>
</div>

          </div>
        </nav>

        <div
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
        </div>
      </div>

      <div>
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
                  <a
                    href="#"
                    className="showcase_navigation_nav-link"
                    onClick={() => toggleMenu("submenu-about")}
                  >
                    ABOUT
                  </a>
                </div>
                <div className="showcase_navigation_nav-link_wrapper">
                  <a href="#" className="showcase_navigation_nav-link">
                    PATIENT
                  </a>
                </div>
                <div className="showcase_navigation_nav-link_wrapper">
                  <a href="#" className="showcase_navigation_nav-link">
                    TREATMENTS
                  </a>
                </div>
                <div className="showcase_navigation_nav-link_wrapper">
                  <a href="#" className="showcase_navigation_nav-link">
                    SHOP
                  </a>
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
            </div>
          </div>
        </section>
      </div>
      {/* DESKTOP NAVBAR */}

      {/* MOBILE NAVBAR */}
      <nav
        id="mobile-nav"
        className={`${
          show
            ? "top-0 flex flex-col-reverse gap-6 justify-between h-full bg-white"
            : "bottom-0 max-w-[75vw] rounded-full bg-gray-100/60"
        } fixed left-0 right-0 mb-[4vh] p-4 w-full mx-auto text-gray-600 backdrop-blur-md shadow-md z-50 lg:hidden`}
      >
        <section
          className={`${
            show ? "px-4 py-6" : ""
          } flex items-center justify-between`}
        >
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
                  <span className="flex items-center gap-2 uppercase">
                    About
                  </span>
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
                  <span className="flex items-center gap-2 uppercase">
                    Patient
                  </span>
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
                  <span className="flex items-center gap-2 uppercase">
                    Treatments
                  </span>
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
              <div
                className="px-4 mt-10 space-y-2 cursor-pointer"
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
                  <Link className="block text-secondary-50" href="/products">
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
                        <p className="absolute text-sm text-white -translate-x-2/4 -translate-y-2/4">
                          {bag.length}
                        </p>
                        {/* <p className="absolute text-sm text-white -translate-x-2/4 -translate-y-2/4">{calculateItemsQuantity()}</p> */}
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
  );
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
