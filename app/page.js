'use client'
import Link from 'next/link'
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { Application, Sprite, Assets, Container, WRAP_MODES, DisplacementFilter } from 'pixi.js'
import { TweenMax, Power0, Power1, Power3 } from 'gsap';
// import gsap
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
// framer motion
import { motion, stagger, useAnimate, useAnimation, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
// headless ui
import { Disclosure, Transition } from '@headlessui/react'
// components
import ArrowRightIcon from './_components/ui/ArrowRightIcon'
import ChevronRightIcon from './_components/ui/ChevronRightIcon'
import MapPin from './_components/ui/MapPin'
import Shape01 from './_components/shapes/shape01'

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);

export default function Home() {

  return (
    <>
      <Hero />
      <ParallaxScroll />
      <Locations />
      <GiftCards />
    </>
  )
}

function Hero() {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const listItemsRef = useRef(null);

  ScrollTrigger.create({
    trigger: listItemsRef.current,
    start: "top top",
    end: "+=100%",
    pin: true,
    pinSpacing: false,
  });

  useEffect(() => {
    gsap.set(div1Ref.current, { x: -100, y: -100 });
    gsap.set(div2Ref.current, { x: 100, y: -100 });
    gsap.set(div3Ref.current, { x: -100, y: 100 });
    gsap.set(div4Ref.current, { x: 100, y: 100 });
    gsap.to(div1Ref.current, {
      x: 0,
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    });

    gsap.to(div2Ref.current, {
      x: 0,
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    });

    gsap.to(div3Ref.current, {
      x: 0,
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    });
    gsap.to(div4Ref.current, {
      x: 0,
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
    });
  }, []);

  const heroContentRef = useRef(null);
  const bookButtonRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.5, 1], [10, 40]);
  
  function animateHeroContent() {
    if (!heroContentRef.current) return;
    const lines = heroContentRef.current.querySelectorAll(".hero-content-line");
    lines.forEach((line, index) => {
      gsap.fromTo(
        line,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          delay: index * 0.2,
        }
      );
    });
  }
  +
  function animateBookButton() {
    if (!bookButtonRef.current) return;

    gsap.fromTo(
      bookButtonRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );
  }

  useLayoutEffect(() => {
    animateHeroContent();
    animateBookButton();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateElement(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (heroContentRef.current) {
      observer.observe(heroContentRef.current);
    }

    if (bookButtonRef.current) {
      observer.observe(bookButtonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  function animateElement(element) {
    if (element === heroContentRef.current) {
      const lines =
        heroContentRef.current.querySelectorAll(".hero-content-line");
      lines.forEach((line, index) => {
        gsap.fromTo(
          line,
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.2,
          }
        );
      });
    } else if (element === bookButtonRef.current) {
      const button = bookButtonRef.current.querySelector(".book-button");
      const arrowIcon = bookButtonRef.current.querySelector(".arrow-icon");

      gsap.fromTo(
        button,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        arrowIcon,
        { scale: 0 },
        { scale: 1, duration: 1, ease: "power3.out" }
      );
    }
  }

  const [isScaled, setIsScaled] = useState(false);
  const [showBookNow, setShowBookNow] = useState(false);

  const handleClick = () => {
    setIsScaled(true);

    setTimeout(() => {
      setShowBookNow(true);
    }, 3500);
  };

  const itemRefs = useRef([]);
  itemRefs.current = [];
  const setMultipleRefs = (element) => {
    if (typeof listItemsRef === "function") {
      listItemsRef(element);
    } else if (listItemsRef) {
      listItemsRef.current = element;
    }

    if (typeof addToRefs === "function") {
      addToRefs(element);
    } else if (addToRefs) {
      addToRefs.current = element;
    }
  };

  const addToRefs = (el) => {
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
  };

  const listRef = useRef(null);

  const imageItems = [
    {
      imgSrc: "/images/patient25k.png",
      text: "25k+ Patients",
    },
    {
      imgSrc: "/images/lehigh.png",
      text: "4 Bespoke Locations",
    },
    {
      imgSrc: "/images/topsortho.png",
      text: "50+ Years Experience",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const items = listRef.current.querySelectorAll(".list__item");

    items.forEach((item) => {
      const itemTitle = item.querySelector(".list__item__title");
      const itemTitleOutline = item.querySelector(".list__item__titleOutline");
      const itemImg = item.querySelector("img");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: "0% 75%",
            end: "25% 50%",
            scrub: 3,
          },
        })
        .fromTo(
          [itemTitle, itemTitleOutline],
          { scale: 2, y: "100%" },
          { scale: 1, y: "0%", ease: "power2.inOut" }
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: "50% 100%",
            end: "100% 50%",
            scrub: 3,
            onEnter: () =>
              gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
            onLeave: () =>
              gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
            onEnterBack: () =>
              gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
            onLeaveBack: () =>
              gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
          },
        })
        .fromTo(
          itemImg,
          { x: "60vw", y: "60vh", rotate: -30 },
          {
            x: "-60vw",
            y: "-60vh",
            rotate: 30,
            ease: "none",
          }
        );
    });
  }, []);

  const titleRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const titleSpans = titleRef.current.querySelectorAll("h1 > span");
    const titleSpansAfters = titleRef.current.querySelectorAll("h1 .after");

    const animSpanFrom = {
      "will-change": "opacity, transform",
      opacity: 0,
    };
    const animSpanTo = {
      duration: 0.62,
      opacity: 1,
      rotationX: 0,
      yPercent: 0,
      ease: "power1.inOut",
      stagger: {
        each: 0.1,
      },
    };

    gsap
      .timeline()
      .fromTo(
        titleSpans[0],
        { ...animSpanFrom, rotationX: 90, yPercent: -50 },
        animSpanTo
      )
      .fromTo(
        titleSpans[1],
        { ...animSpanFrom, rotationX: -90, yPercent: 50 },
        animSpanTo,
        "<"
      )
      .fromTo(
        titleSpansAfters,
        { width: "100%" },
        { duration: 0.72, ease: "expo.inOut", width: "0%" },
        "end"
      );
  }, []);
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeSpans = marqueeRef.current.querySelectorAll(
      ".marquee__inner > span"
    );

    marqueeSpans.forEach((span, index) => {
      gsap.fromTo(
        span,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          x: -50,
        },
        {
          duration: 0.62,
          opacity: 1,
          x: 0,
          ease: "power1.inOut",
          stagger: 0.1,
          delay: index * 0.1,
        }
      );
    });
  }, []);

  const pixiContainerRef = useRef();

  const mobileRef = useRef(null)
  const isInView = useInView(mobileRef)

  return (
    <section>
      {/* DESKTOP VIEW */}
      <div className="relative hidden lg:block">
        <div className="-z-10 absolute w-[100dvw] h-full bg-rose-100" />
        <header className="pt-16 m-auto w-max">
          {/* #fec49b */}{/* #FEBA76 */}{/* #fdba74 orange-300 */}
          {/* #fda4af rose-300 */}{/*  #FDBA74, #FDB67E, #FDB388, #FDAF92, #FDAB9B, #FDA8A5, #FDA4AF */}
          <div className="bg-[rgba(253,_192,_129,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(253,_192,_129,_0.8),_0px_0px_0px_16px_rgba(253,_199,_143,0.6),_0px_0px_0px_24px_rgba(253,_206,_157,_0.4),_0px_0px_0px_32px_rgba(253,_213,_171,_0.2),_0px_0px_0px_40px_rgba(254,_220,_185,_0.1)]">
            <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
          </div>
        </header>
        <section className="px-8 xl:px-0 flex flex-col-reverse justify-center md:gap-8 md:flex-row md:h-[100vh] mx-auto max-w-7xl py-16">
          <div className="relative flex items-center justify-center md:w-[25dvw] lg:w-[40dvw] xl:w-[25dvw]">
            <Shape01 className="w-full" />
            <div className="absolute left-0 right-0 w-3/4 mx-auto space-y-6 text-white">
              <h2 className="capitalize text-primary-50">Because every smile is unique</h2>
              {/* <h2 className="capitalize text-primary-50">Oral health.<br/>Our passion.<br/>Our pride.</h2> */}
              <span className="flex items-center gap-4">
                <Link href="/book-now" className="flex items-center gap-2 p-4 transition-colors duration-300 ease-in-out rounded-md text-zinc-100 bg-primary-50 hover:bg-primary-30 group">
                  Book Now
                  {/* <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" /> */}
                </Link>
                <Link href="/our-team" className="p-4 rounded-md text-primary-30 group">
                  <span className="flex items-center gap-2">
                    Our Team <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" />
                  </span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-50 ease-in-out" />
                </Link>
              </span>
            </div>
          </div>
          <div className="bg-center bg-no-repeat bg-cover rounded-full w-[20dvw]" style={{
            backgroundImage: "url(/../../images/mainsectionimage.jpg)",
            minHeight: "80vh",
          }} />
        </section>
      </div>
      {/* MOBILE VIEW */}
      <div className="relative overflow-hidden lg:hidden w-dvw h-dvh">
        <header className="z-0 pt-16 m-auto w-max">
          <div className="bg-[rgba(230,_123,_142,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(230,_123,_142,_0.8),_0px_0px_0px_16px_rgba(234,_144,_160,_0.6),_0px_0px_0px_24px_rgba(238,_166,_179,_0.4),_0px_0px_0px_32px_rgba(238,_166,_179,_0.2),_0px_0px_0px_40px_rgba(246,_208,_215,_0.05)]">
            <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
          </div>
        </header>
        <img className="absolute inset-0 object-cover w-full h-full mx-auto -z-10" src="/../../images/mainsectionimage_glass.jpg" />
        <div ref={mobileRef} style={{
            transform: isInView ? "none" : "translateX(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
          }}
          className="absolute right-4 flex flex-col items-center justify-center  bg-gray-400 border border-gray-200 rounded-full bottom-[8vh] w-[85dvw] md:w-[50dvw] aspect-square backdrop-filter bg-clip-padding backdrop-blur-md bg-opacity-30"
        >
          <div className="flex flex-col items-start justify-center w-2/3 ml-4 rounded-full aspect-square">
            <h2 className="text-transparent capitalize font-helvetica-now-thin bg-clip-text bg-gradient-to-br from-primary-70 to-primary-100">Because every smile is unique</h2>
            <span className="flex items-center justify-between gap-4 mt-8">
              <Link href="/book-now" className="flex items-center gap-2 p-4 transition-colors duration-300 ease-in-out rounded-md text-zinc-100 bg-primary-40 hover:bg-primary-50 group">
                Book Now
                {/* <ArrowRightIcon className="hidden w-4 h-4 group-hover:block" /> */}
              </Link>
              <Link href="/our-team" className="p-4 rounded-md text-primary-50 group">
                <span className="flex items-center gap-2">
                  Our Team <ArrowRightIcon className="w-4 h-4" />
                </span>
                <span className="block max-w-0 group-hover:max-w-full transition-all delay-150 duration-300 h-0.5 bg-primary-50 ease-in-out" />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ParallaxScroll() {
  const main = useRef()

  useGSAP(() => {
    const sections = gsap.utils.toArray(".panel")
    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: () => section.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      })
  })}, { scope: main })

  return (
    <div ref={main}>
      <div className="panel h-[100dvh] bg-[#a3bba3]">
        <Invisalign />
      </div>
      <div className="panel h-[100dvh] bg-[#a3bba3] border-t-2 border-zinc-700 rounded-t-3xl">
        <DamonBraces />
      </div>
      <div className="panel h-[100dvh] bg-white border-t-2 border-zinc-700 rounded-t-3xl overflow-hidden">
        <AdvancedTech />
      </div>
    </div>
  )
}

  return (
    <main className="relative">

<div ref={pixiContainerRef} id="pixi-container"></div>
      <div className="px-8 isolate  lg:px-8">
        <div className="relative grid rounded-lg  max-w-screen-xl grid-cols-1 mx-auto sm:py-10 place-items-center lg:grid-cols-2">
          <div className="absolute inset-0 flex justify-center items-center">
            <svg>
              <defs>
                <clipPath
                  id="myClipPath"
                  clipPathUnits="objectBoundingBox"
                  transform="scale(0.0004 0.0007)"
                >
                  <path d="M1746.43,38.94C849.17-212.65-120.14,825.24,12.19,1135.81c101.84,239,679.67,189.43,1132.31,162.51,448.32-26.66,958.25,402.35,1298.59-122.64C2733.65,727.5,2258.09,182.41,1746.43,38.94Z" />
                </clipPath>
              </defs>
            </svg>

            {/* <img
              src="/images/texturedpanel2.jpg"
              alt="Description"
              style={{
                width: "800px",
                height: "600px",
                clipPath: "url(#myClipPath)",
              }}
            /> */}
          </div>

          <div className="relative z-10 mx-auto lg:mt-0">
            <div className="flex items-center justify-center flex-wrap">
              <div className="relative">
                <div className="hero">
                  <div className="hero-content  " ref={heroContentRef}>
                    <div className=" marquee_features ">
                      <div className="marquee__inner first">
                        <span>Because</span>
                        <span>Every</span>
                        <span>Smile</span>
                        <span>Is</span>
                        <span>Unique</span>
                      </div>
                      <div className="marquee__inner second">
                        <span>Because</span>
                        <span>Every</span>
                        <span>Smile</span>
                        <span>Is</span>
                        <span>Unique</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <div
              className={`absolute z-20 inline-block ${
                isScaled ? "scale-up" : "scale-100"
              }`}
              onClick={handleClick}
              style={{ top: "10%", left: "-20%" }}
            >
              <Link
                href="/book-now"
                className="inline-flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 480 480"
                  className="w-48 h-48"
                >
                  <path fill="#C8A2C8">
                    <animate
                      attributeName="d"
                      values="
          M20,248c0,57.7,21.4,114.4,56.8,154.6C118.6,450,181.8,476,250,476c63,0,122-23.5,163.2-64.8
          C454.5,370,480,315,480,252c0-68.1-29.9-133.3-77.2-175c-40.2-35.5-97-57-154.8-57C167.1,20,96,66.2,55.5,129.7
          C33,165,20,203,20,248z;
          M24,248c0,57.7,19.4,112.4,54.8,152.6C120.6,448,183.8,478,252,478c63,0,118-27.5,159.2-68.8
          C452.5,368,482,317,482,254c0-68.1-29.9-137.3-77.2-179c-40.2-35.5-101-53-158.8-53C165.1,22,94,64.2,53.5,127.7
          C31,163,24,203,24,248z;
          M20,248c0,57.7,25.4,110.4,60.8,150.6C122.6,446,185.8,480,254,480c63,0,114-31.5,155.2-72.8
          C450.5,366,484,319,484,256c0-68.1-29.9-139.3-77.2-181c-40.2-35.5-105-55-162.8-55C163.1,20,92,62.2,51.5,125.7
          C29,161,20,203,20,248z;
          M20,248c6.7,58.1,19.2,116.9,60.8,150.6c53.4,43.3,105.5,73,173.2,81.4c64,8,109.2-36.8,155.2-72.8
          C453,373,494.2,318.1,484,256c-11-67-21.5-151.4-77.2-181C358,49,301.5,14.4,244,20C162,28,85.6,58.5,51.5,125.7
          C31.2,165.9,14.8,203.3,20,248z;
          M20,248c0,57.7,21.4,114.4,56.8,154.6C118.6,450,181.8,476,250,476c63,0,122-23.5,163.2-64.8
          C454.5,370,480,315,480,252c0-68.1-29.9-133.3-77.2-175c-40.2-35.5-97-57-154.8-57C167.1,20,96,66.2,55.5,129.7
          C33,165,20,203,20,248z"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
                <span className="font-HelveticaNowPro font-thin tracking-tight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-white">
                  Book
                  <br />
                  Now
                </span>
              </Link>
            </div>

            <img
              className="rounded-full max-w-md z-10"
              src="../../images/mainsectionimage.jpg"
              alt="girl smiling"
            />
          </div>
        </div>
      </div>
      <div>
        <section
          ref={listRef}
          className="flex flex-col items-center justify-center"
        >
          {imageItems &&
            imageItems.map((item, index) => (
              <div
                key={index}
                className="list__item relative w-full h-screen flex items-end pb-10"
              >
                <img
                  src={item.imgSrc}
                  alt={`Description ${index + 1}`}
                  className="absolute z-20 object-cover"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "33%",
                    height: "auto",
                    aspectRatio: "10 / 14",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <div
                  className="list__item__title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold z-10"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "12vw",
                    fontFamily: '"Playfair Display"',
                    lineHeight: "80%",
                    color: "#221608",
                  }}
                >
                  {item.text}
                </div>
                <div
                  className="list__item__titleOutline absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold z-30"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "12vw",
                    fontFamily: '"Playfair Display"',
                    lineHeight: "80%",
                    color: "transparent",
                    WebkitTextStroke: "2px #221608",
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
        </section>
      </div>
      {/* <div className="rounded-full  mt-20 flex" 
 
      >
        <div className="flex flex-col w-1/3">
     
          <div className="text-container">
            <span className="rotate-text neon subtitle font-Yellowtail-Regular font-thin">
              Why Patients Choose Us
            </span>
     
          </div>
          <div className="h-64 "></div>

          <button className="text-3xl font-HelveticaNowPro font-thin tracking-tight inline-flex items-center justify-center">
            <Link
              to="/why-choose-us"
              className="circle-wipe-button  text-2xl rounded-full border border-white text-white p-4 mt-10 font-normal leading-6 transition-colors duration-300 ease-linear text-primary50 hover:text-primary30"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            >
              <span aria-hidden="true circle-wipe-text"></span>
            </Link>
          </button>
        </div>
        <div ref={containerRef} className="flex h-full">
          <div className="flex flex-col w-1/3 ml-60">
            <div
              ref={div1Ref}
              className="justify text-center border border-white py-20 mx-10 h-64 w-96"
            >
              <span className="text-7xl font-HelveticaNowPro font-thin">
                50+
              </span>{" "}
              <span className="text-4xl font-HelveticaNowPro font-thin">
                Years of Experience
              </span>
            </div>
            <div
              ref={div3Ref}
              className="justify text-center border border-white py-20 mx-10 h-64 w-96 mt-6"
            >
              <span className="text-7xl font-HelveticaNowPro font-thin">
                25k+
              </span>
              <span className="text-4xl font-HelveticaNowPro font-thin">
                Patients
              </span>
            </div>
          </div>
          <div className="flex flex-col w-1/3 mr-20">
            <div
              ref={div2Ref}
              className="justify text-center border border-white py-20 mx-10 h-64 w-96"
            >
              <span className="text-7xl font-HelveticaNowPro font-thin">
                20+
              </span>{" "}
              <span className="text-4xl font-HelveticaNowPro font-thin">
                Years of Education
              </span>
            </div>
            <div
              ref={div4Ref}
              className="justify text-center border border-white py-20 mx-10 h-64 w-96 mt-6 font-HelveticaNowPro font-thin"
            >
              4 Bespoke Locations
            </div>
          </div>
        </div>
      </div> */}

      {/* <Logo />
      <LandingTestimonials /> */}
    </main>
  );
}

  function Section({ children, color, zIndex, position }) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      amount: 0.1,
    });

    return (
      <div
        ref={ref}
        className="relative flex flex-col items-center justify-center min-h-screen text-primary95"
        style={{
          backgroundColor: color,
          transform: isInView ? "translateY(-10)" : "translateY(100px)",
          transition: "transform 0.5s ease-in-out",
          zIndex: zIndex,
          position: position,
        }}
      >
        {children}
      </div>
    );
      <section ref={sectionRef} className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start">
        <motion.div style={{ translateY: transformText }} className="py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max lg:w-1/2 md:py-0">
          <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Invisalign</h1>
          <h4>Top 1% Invisalign providers</h4>
          {/* <h4>As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</h4> */}
          <Link href="/invisalign" className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group">
            <span>Learn More</span>
            <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
              <span>Learn More</span>
            </div>
          </Link>
        </motion.div>
        <div className="lg:w-1/2">
          <motion.img style={{ translateY: transformCase }} className="object-cover w-full h-auto mx-auto object-start" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
          <motion.img style={{ translateY: transformRetainer, scale }} className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
        </div>
      </section>
    )
  }
}

export default function Features() {
  const damonImageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      damonImageRef.current,
      { y: () => -window.innerHeight * 0.2 },
      {
        y: () => window.innerHeight * 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: damonImageRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);
  const spring = {
    type: "spring",
    damping: 20,
    stiffness: 300,
  };

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const arcContainerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (arcContainerRef.current) {
      gsap.fromTo(
        arcContainerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: arcContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  
  useEffect(() => {
    animate("div", isInView
      ? { opacity: 1, transform: "translateX(0px)", scale: 1,
      } // filter: "blur(0px)"
      : { opacity: 0, transform: "translateX(-50px)", scale: 0.3,
      }, // filter: "blur(20px)"
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], ["600%", "40%"]);
  const translateY = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  const arcStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    height: "100%",
    border: "45px solid white",
    borderTop: "none",
    borderBottomLeftRadius: "175px",
    borderBottomRightRadius: "175px",
    transformOrigin: "50% 0",
    animation: "rotate-arc .4s linear forwards",
  };

  return (
    <>
      <div style={{ backgroundColor }}>
        <div style={{ backgroundColor, position: "relative" }}>
          <div className="absolute pl-20 pt-10">
            <header className=" m-auto w-max">
              {/* #fec49b */}
              {/* #FEBA76 */}
              {/* #fdba74 orange-300 */}
              {/* #fda4af rose-300 */}
              {/*  #FDBA74, #FDB67E, #FDB388, #FDAF92, #FDAB9B, #FDA8A5, #FDA4AF */}
              <div className="bg-[rgba(253,_192,_129,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(253,_192,_129,_0.8),_0px_0px_0px_16px_rgba(253,_199,_143,0.6),_0px_0px_0px_24px_rgba(253,_206,_157,_0.4),_0px_0px_0px_32px_rgba(253,_213,_171,_0.2),_0px_0px_0px_40px_rgba(254,_220,_185,_0.1)]">
                <img
                  className="w-16 h-16 p-4"
                  src="/../../logo_icon.png"
                  alt="FreySmiles Orthodontists"
                />
              </div>
            </header>
          </div>
    <section ref={ref} id="locations" className="mt-[100vh] flex flex-col justify-center w-full mx-auto my-32 lg:flex-row max-w-7xl">
      {/* LEFT */}
        <div className="z-10 lg:w-1/2 lg:py-0">
          <motion.div
            className="p-6 space-y-10"
            style={{
              transform: isInView ? "none" : "translateY(-50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
            }}
          >
            <span className="flex items-baseline mt-4">
              <h1 className="tracking-tight uppercase font-helvetica-now-thin text-primary-50">Our Locations</h1>
              <MapPin className="ml-2 transition-all duration-300 hover:animate-bounce hover:cursor-pointer" />
            </span>
            <p>We have 4 incredible offices for your ultimate convenience. Our orthodontists and FreySmiles Team are excited to serve families in the Allentown, Bethlehem, Easton, Schnecksville and Lehighton communities.</p>
            <Link
              href="/book-now"
              className="inline-block px-6 py-4 text-white transition duration-300 ease-linear rounded-full underline-offset-8 bg-primary-50 hover:bg-secondary-50 group"
            >
              Schedule an evaluation today
              <span className="block h-[1px] transition-all duration-300 ease-linear bg-white rounded-full max-w-0 group-hover:max-w-full"></span>
            </Link>
          </motion.div>

          <div className="flex items-center justify-center text-5xl">
            <Hero />
          </div>
        </div>

        <div ref={invisalignRef} className="section ">
          <div className="text-2xl w-screen h-screen relative">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="flex w-full">
                <div
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/blobpurple.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="min-h-screen w-1/2 flex flex-col justify-center items-center text-black text-center relative"
                >
                  <div className="relative">
                    <img
                      src="../images/ellipse.svg"
                      alt="Ellipse"
                      className="md:h-40"
                      style={{
                        filter: "invert(100%)",
                        transform: "rotate(250deg)",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />

                    <h1
                      className="text-violet-700 -mt-60 text-5xl font-thin mx-auto leading-tight"
                      style={{
                        width: "200px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      Top 1% of Invisalign providers.
                      <br />
                      Experience matters.
                    </h1>
                  </div>
                  {/* <img
          className="absolute  left-1/2 transform -translate-x-1/2 w-64 h-auto"
          src="../images/invisalign-tray.png"
          alt="clear aligner"
        /> */}
                </div>

                <div className="relative w-1/2 flex justify-center items-center"></div>
                <button className="text-3xl font-HelveticaNowPro font-thin tracking-tight inline-flex items-center justify-center">
                  <Link href="/invisalign">
                    <div
                      className="circle-wipe-button text-xl rounded-full border border-white text-white p-4 mt-10 font-normal leading-6 transition-colors duration-300 ease-linear text-primary50 hover:text-primary30"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                      }}
                    >
                      <span aria-hidden="true" className="circle-wipe-text">
                        Learn More
                      </span>
                    </div>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div ref={damonRef} className="rounded-3xl section bg-a3bba3 ">
          <div class="w-screen  h-screen  ">
            <div className="flex items-center justify-center max-w-screen-xl mx-auto lg:flex-row">
              <div className="w-1/2 flex flex-col justify-center items-center">
                <div className="flex items-center justify-center h-screen">
                  <figure className="relative m-[75vh_0] w-[24rem] h-[32rem] overflow-hidden">
                    <img
                      ref={damonImageRef}
                      src="/images/monse.jpg"
                      alt="Description"
                      className=" absolute top-[-10rem] left-0 h-[calc(100%_+_20rem)] w-full object-cover"
                    />
                  </figure>
                </div>
                <div className="absolute  z-10 flex justify-center items-center">
                  {/* <Arc triggerRef={damonRef} /> */}
                </div>
                <div className=" p-4 "></div>
              </div>

              <figure className="flex flex-col items-center justify-center w-1/2 relative">
                <h1
                  className="text-3xl font-thin w-64 text-center mx-auto "
                  style={{}}
                >
                  Damon Bracket: less appointments faster treatment time
                  {/* Combining self-ligating braces with advanced archwires
                clinically proven to move teeth quickly and comfortably. */}
                </h1>
      {/* RIGHT */}
        <motion.div className="h-screen min-h-max lg:w-1/2 lg:h-auto" style={{
          opacity: isInView ? 1 : 0,
          filter: isInView ? "blur(0px)" : "blur(16px)",
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
        }}>
          <iframe width="100%" height="100%"
            src={
              selectedLocation === "All"
              ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
              : locations.find((l) => l.location === selectedLocation).mapbox_iframe_url
            }
            title={
              selectedLocation === "All"
              ? "FreySmiles All Locations [w/ Colors]"
              : locations.find((l) => l.location === selectedLocation).mapbox_map_title
            }
            style={{ border: "none" }}
          />
        </motion.div>
    </section>
  )
}

                <div className="playing">
                  <div className="mt-4 flex justify-center">
                    <Link href="/braces">
                      <div
                        className={`flex items-center justify-center px-6 py-4 transition-colors duration-300 ease-linear border rounded-full border-[#7781d9] hover:bg-gray-800 hover:border-0 hover:text-white ${
                          isVisible ? "ball-animation" : ""
                        }`}
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          display: "inline-block",
                          textAlign: "center",
                          lineHeight: "120px",
                        }}
                      >
                        Explore
                      </div>
                    </Link>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>


  return (
    <section ref={ref} className="z-10 h-[60dvh] relative my-24 group overflow-hidden hover:cursor-pointer" style={{
      transform: isInView ? "none" : "translateY(100px)",
      opacity: isInView ? 1 : 0,
      transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s"
    }}>
      <div className="absolute inset-0 w-full h-full flex justify-start items-start bg-primary-30 bg-opacity-80 text-white [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(30%_at_0%_0%)] lg:group-hover:[clip-path:circle(35%_at_0%_0%)] group-hover:bg-opacity-100 motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out" />
      <Link href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`} target='_blank' className="absolute inset-0 w-full h-full pl-[12%] pt-[18%] lg:pl-[6%] lg:pt-[8%] lg:group-hover:pl-[8%] lg:group-hover:pt-[12%] group-hover:duration-[1s] text-white">Send a Gift Card</Link>
      <img src="/../../images/giftcards/gift_cards_mockup.jpg" alt="gift cards mockup" className="absolute inset-0 object-cover object-center w-full h-full -z-10" />
    </section>
  )
}

