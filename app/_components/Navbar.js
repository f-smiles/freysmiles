"use client";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { gsap } from "gsap";
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
  ];

  const patient_links = [
    { name: "Your Care", href: "/your-care" },
    { name: "Financing Treatment", href: "/financing-treatment" },
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

  useGSAP(() => {
    const isTouchDevice = "ontouchstart" in window;

    const createCustomCursor = () => {
      const desktopNavbar = document.querySelector("#desktop-nav");
      const customCursor = document.querySelector(".custom-navbar-cursor");

      // Each time the mouse coordinates are updated, we need to pass the values to gsap in order to animate the element
      desktopNavbar.addEventListener("mousemove", (e) => {
        const { target, x, y } = e;

        const isTargetLinkOrButton =
          target?.closest("a") ||
          target?.closest("button") ||
          target?.closest(".target-link");

        gsap.to(customCursor, {
          x: x + 3,
          y: y + 3,
          duration: 0.7,
          ease: "power4",
          opacity: isTargetLinkOrButton ? 0.6 : 1,
          transform: `scale(${isTargetLinkOrButton ? 4 : 1})`,
        });
      });

      desktopNavbar.addEventListener("mouseleave", (e) => {
        gsap.to(customCursor, {
          duration: 0.7,
          opacity: 0,
        });
      });
    };

    // Only create the custom cursor if device isn't touchable
    if (!isTouchDevice) {
      createCustomCursor();
    }
  });
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

  return (
    <header className="overflow-hidden">
      {/* DESKTOP NAVBAR */}
      <nav
    id="desktop-nav"
    className=" fixed top-10 left-0 hidden w-full mb-[6vh] lg:block"
  >
    <div className="custom-navbar-cursor" />
    <div className="border border-black rounded-full text-[#00314F] py-6 px-4 mx-auto text-sm transition duration-300 ease-in-out max-w-screen-xl flex justify-between items-center">


<div className="flex items-center justify-start space-x-2">
        <Link href="/">
          <img src="images/logo_icon.png" alt="FreySmiles Orthodontics" className="w-6 h-6" />
        </Link>
      </div>
      <div className="absolute transform -translate-x-1/2 left-1/2">
          <ul className="flex items-center gap-8 lg:gap-10 justify-evenly">


            <li onClick={handleToggleAbout} className="target-link">
              <p className="text-sm font-medium transition-all duration-500 ease-linear rounded-full cursor-pointer font-helvetica-neue hover:text-primary-40 group">
                ABOUT
              </p>
            </li>
            {/* ABOUT PANEL */}
            <Transition.Root show={about} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={setAbout}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setAbout(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {about_us_links.map((link) => (
                                  <li key={link.name}>
                                    <Link
                                      href={link.href}
                                      className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                      onClick={(e) => {
                                        if (link.name === "Testimonials") {
                                          handleTestimonialsClick(e, link.href);
                                        }
                                        setAbout(false);
                                      }}
                                    >
                                      <h4>{link.name}</h4>
                                    </Link>
                                  </li>
                                ))}
                              </ul>

                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li onClick={handleTogglePatient} className="target-link">
              <p className="text-sm font-medium transition-all duration-500 ease-linear rounded-full cursor-pointer font-helvetica-neue hover:text-primary-40 group">
                PATIENT
              </p>
            </li>
            {/* PATIENT PANEL */}
            <Transition.Root show={patient} as={Fragment}>
              <Dialog as="div" className="relative z-50" onClose={setPatient}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setPatient(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {patient_links &&
                                  patient_links.map((link, index) => (
                                    <li key={link.name}>
                                      <Link
                                        href={link.href}
                                        className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                        onClick={handleTogglePatient}
                                      >
                                        <h4>{link.name}</h4>
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li onClick={handleToggleTreatments} className="target-link">
              <p className="text-sm font-medium uppercase transition-all duration-500 ease-linear rounded-full cursor-pointer font-helvetica-neue hover:text-primary-40 group">
                Treatments
              </p>
            </li>
            {/* TREATMENTS PANEL */}
            <Transition.Root show={treatments} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={setTreatments}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                      <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="relative w-screen max-w-md pointer-events-auto">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                              <button
                                type="button"
                                className="relative text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setTreatments(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XIcon className="w-6 h-6" aria-hidden="true" />
                              </button>
                            </div>
                          </Transition.Child>
                          <div className="flex flex-col h-full py-6 overflow-y-auto bg-white shadow-xl">
                            {/* <div className="px-4 sm:px-6">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Panel title
                              </Dialog.Title>
                            </div> */}
                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                              <ul className="px-4 space-y-2">
                                {treatments_links &&
                                  treatments_links.map((link, index) => (
                                    <li key={link.name}>
                                      <Link
                                        href={link.href}
                                        className="block transition-all duration-300 ease-in-out cursor-pointer text-primary-50 hover:text-secondary-60 hover:pl-8"
                                        onClick={handleToggleTreatments}
                                      >
                                        <h4>{link.name}</h4>
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                              {/* <Sphere /> */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>

            <li>
              <Link href="https://my.orthoblink.com/bLink/Login">
                <p className="text-sm leading-4 text-center uppercase font-helvetica-neue">Patient Login</p>
              </Link>
            </li>

            <li>
              <Link href="/#locations-section">
                <p className="text-sm leading-4 text-center uppercase font-helvetica-neue">Locations</p>
              </Link>
            </li>

            <li>
              <Link href="/shop/products">
                <p className="text-sm font-helvetica-neue">SHOP</p>
              </Link>
            </li>

            <li className='flex items-center gap-4 md:gap-6'>
            </li>

          </ul>
          </div>

          <div className="flex items-center gap-2">
            <CartComponent />

            {user?.id && user?.email ? (
              <UserButton user={user} />
            ) : (
              <SignInButton />
            )}

            <Link href="/book-now">
              <button className="px-4 py-2 font-helvetica-neue">
                BOOK
              </button>
            </Link>
          </div>

        </div>
      </nav>

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
