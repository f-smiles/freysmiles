"use client";
import { Curtains, Plane } from "curtainsjs";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Keyboard, Mousewheel } from "swiper/core";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import Matter from "matter-js";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
// framer motion
import { motion, stagger, useAnimate, useInView } from "framer-motion";
// headless ui
import { Disclosure, Transition } from "@headlessui/react";
// gsap
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import { SplitText } from "gsap-trial/SplitText";
import ChevronRightIcon from "./_components/ui/ChevronRightIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, SplitText, useGSAP);
}

gsap.registerPlugin(ScrollTrigger);

export default function LandingComponent() {
  // const canvasRef = useRef(null);
  // const mouseCanvasRef = useRef(null);
  // const planeRef = useRef(null);
  // const mouseAttr = useRef([]);
  // const mouseInertia = useRef([]);

  // useEffect(() => {
  //   const pixelRatio = window.devicePixelRatio || 1.0;
  //   let mousePosition = { x: -10000, y: -10000 };

  //   const curtains = new Curtains({
  //     container: canvasRef.current,
  //     watchScroll: false,
  //   });

  //   const planeElements = document.getElementsByClassName("curtain");

  //   const params = {
  //     vertexShader: vertexShader,
  //     fragmentShader: fragmentShader,
  //     uniforms: {
  //       resolution: {
  //         name: "uResolution",
  //         type: "2f",
  //         value: [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight],
  //       },
  //       mousePosition: {
  //         name: "uMousePosition",
  //         type: "2f",
  //         value: [mousePosition.x, mousePosition.y],
  //       },
  //     },
  //   };

  //   const plane = new Plane(curtains, planeElements[0], params);
  //   planeRef.current = plane;

  //   const resizeCanvas = () => {
  //     const canvas = mouseCanvasRef.current;
  //     canvas.width = planeElements[0].clientWidth * pixelRatio;
  //     canvas.height = planeElements[0].clientHeight * pixelRatio;

  //     const ctx = canvas.getContext("2d");
  //     ctx.scale(pixelRatio, pixelRatio);
  //   };

  //   resizeCanvas();

  //   const handleMovement = (e) => {
  //     mousePosition.x = e.clientX;
  //     mousePosition.y = e.clientY;

  //     const mouseAttributes = {
  //       x: mousePosition.x - planeElements[0].getBoundingClientRect().left,
  //       y: mousePosition.y - planeElements[0].getBoundingClientRect().top,
  //       opacity: 1,
  //       velocity: { x: 0, y: 0 },
  //     };

  //     if (mouseAttr.current.length > 1) {
  //       mouseAttributes.velocity = {
  //         x: mouseAttributes.x - mouseAttr.current[mouseAttr.current.length - 1].x,
  //         y: mouseAttributes.y - mouseAttr.current[mouseAttr.current.length - 1].y,
  //       };
  //     }

  //     mouseAttr.current.push(mouseAttributes);
  //   };

  //   document.addEventListener("mousemove", handleMovement);

  //   return () => {
  //     document.removeEventListener("mousemove", handleMovement);
  //     curtains.dispose();
  //   };
  // }, []);

  const [backgroundColor, setBackgroundColor] = useState("transparent");

  useEffect(() => {
    setBackgroundColor("rgb(255, 248, 237)");
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const transitionStart = 40;
      const transitionEnd =
        document.documentElement.scrollHeight - window.innerHeight;

      const colorTransitions = [
        {
          start: transitionStart,
          end: transitionEnd * 0.25,
          colorStart: [255, 248, 237],
          colorEnd: [245, 244, 253],
        },
        {
          start: transitionEnd * 0.25,
          end: transitionEnd * 0.5,
          colorStart: [245, 244, 253],
          colorEnd: [245, 244, 253],
        },
        {
          start: transitionEnd * 0.5,
          end: transitionEnd * 0.75,
          colorStart: [211, 202, 210],
          colorEnd: [211, 202, 210],
        },
        {
          start: transitionEnd * 0.75,
          end: transitionEnd,
          colorStart: [211, 202, 210],
          colorEnd: [211, 202, 210],
        },
      ];

      const currentTransition = colorTransitions.find((transition) => {
        return (
          scrollPosition >= transition.start && scrollPosition < transition.end
        );
      });

      if (currentTransition) {
        const progress =
          (scrollPosition - currentTransition.start) /
          (currentTransition.end - currentTransition.start);
        const scrollPercentage = Math.min(1, Math.max(0, progress));

        const interpolatedColor = currentTransition.colorStart.map(
          (start, i) => {
            const end = currentTransition.colorEnd[i];
            return Math.round(start + (end - start) * scrollPercentage);
          }
        );

        setBackgroundColor(`rgb(${interpolatedColor.join(",")})`);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div>
      <div>
  <Hero />
  <MarqueeSection />
  <About />
</div>
        <div >
          <GSAPAnimateScrollSections />
          <ImageGrid />
        </div>
        {/* <Mask /> */}
        <div>
          <ParallaxOutline />
        </div>
        <div
          // ref={sectionTwoRef}
          className="sticky bg-[#D8BFD7] top-0 h-screen z-3"
          // id="logoGrid"
        >
          <LogoGrid />
        </div>
        <Testimonials />
        <Locations />
        <GiftCards />
      </div>
    </>
  );
}

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxSpeed = 0.5;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${
          scrollY * parallaxSpeed
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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


  const paragraphRef = useRef(null);

  useEffect(() => {
    const splitParent = new SplitText(paragraphRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });
    const splitChild = new SplitText(paragraphRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });

    const tl = gsap.timeline();

    tl.from(".lineChild", {
      yPercent: 100,
      autoAlpha: 0,
      delay: 0.5,
      duration: 0.65,
      stagger: 0.25,
      ease: "back",
    });

    return () => {
      splitParent.revert();
      splitChild.revert();
    };
  }, []);

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const easternTime = new Intl.DateTimeFormat("en-US", options).format(now);
      setTime(`${easternTime}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const colors = [
    ["#FAFF7E", "#E3EB91", "#D8E19A", "#EFF588"],
    ["#075043", "#2F2F2F", "#4732D5", "#FF5A5A"],
    ["#C084FC", "#0F0E45", "#F9DDDF", "#0F0E45"],
    ["#3D0075", "#0F0E45", "#808080", "#2F2F2F"],
  ];

  return (
    <section
      ref={heroRef}
      className="font-editorial-new bg-[#E1F672] flex flex-col justify-between p-8 text-black"
    >
      <div className="flex flex-row h-full relative">
        {/* Left Column */}
        <div
          className="lg:w-2/3 w-full lg:pr-8 flex flex-col justify-start"
          style={{ minHeight: "0vh" }}
        >
          <div className="flex-grow"></div>
          <div className="overflow-hidden mt-[20vh]">
            <p
              ref={paragraphRef}
              className="animate font-neue-montreal text-xl lg:text-3xl font-light leading-relaxed"
            >
              A confident smile begins with effective care tailored to each
              patient.
              <br />
              At our practice, we’re dedicated to providing treatments that are
              <br />
              not only scientifically sound but also crafted to bring out your
              <br />
              best smile.
            </p>
          </div>
          <div className="flex-grow"></div>
        </div>
        {/* <div class="parent">
  <div class="child div1"> </div>
  <div class="child div2"> </div>
  <div class="child div3"> </div>
  <div class="child div4"> </div>
  <div class="child div5"> </div>
  <div class="child div6"> </div>
  <div class="child div7"> </div>
  <div class="child div8"> </div>
  <div class="child div9"> </div>
  <div class="child div10"> </div>
  <div class="child div11"> </div>
  <div class="child div12"> </div>
</div> */}
        <div className="lg:w-1/3 w-full flex flex-col justify-center items-center lg:pl-8 mt-[14vh]">
          <div className="flex flex-col justify-center items-center h-full space-y-0">
            {colors.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-0">
                {row.map((color, circleIndex) => (
                  <div
                    key={circleIndex}
                    className={`w-[125px] h-[125px] ${
                      (rowIndex + circleIndex) % 3 === 0
                        ? "rounded-[40px]"
                        : "rounded-full"
                    } transition-transform duration-300 ease-in-out hover:scale-75`}
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="flex justify-between items-end mt-8">
        <div >
        <p className="font-neue-montreal font-bold text-sm">• EST {time}</p>
        </div>

        <div className="flex flex-col items-end text-right font-light lg:w-1/3 w-full">
          <h2 className="text-[3em] font-bold mb-4 leading-tight inline-block">
            We know
            <br />
            what works.
          </h2>
          {/* <p className="mt-2">[SCROLL TO DISCOVER]</p> */}
        </div>
      </div>
    </section>
  );
}

const MarqueeSection = () => {
  const marqueeRef = useRef(null);
  const marqueeContentRef = useRef(null);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: marqueeRef.current,
      start: "top top",
      end: "+=100%",
      scrub: 1,
      pin: true,
      pinSpacing: false,
    });

    gsap.to(marqueeContentRef.current, {
      yPercent: -50,
      scrollTrigger: {
        trigger: marqueeRef.current,
        start: "top top",
        end: "+=100%",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="uppercase rounded-tl-[40px] rounded-tr-[40px] font-altero relative h-[40vh] text-white overflow-hidden bg-[#004D43] flex items-center"
    >
      <div
        ref={marqueeContentRef}
        className="marqueeHome"
        style={{
          fontSize: "180px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div className="trackHome">
          <div className="content">
            Clinical Excellence <span className="separator">●</span>{" "}
            Unparalleled Precision <span className="separator">●</span>{" "}
            Customized Care
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  // const pathRef = useRef(null);

  // useEffect(() => {
  //   const path = pathRef.current.querySelector('path');
  //   const pathLength = path.getTotalLength();

  //   gsap.set(path, {
  //     strokeDasharray: pathLength,
  //     strokeDashoffset: pathLength,
  //   });

  //   gsap.to(path, {
  //     strokeDashoffset: 0,
  //     ease: 'power2.out',
  //     scrollTrigger: {
  //       trigger: pathRef.current,
  //       start: 'top bottom',
  //       end: 'bottom top',
  //       scrub: 1,
  //     },
  //   });
  // }, []);
  
  const aboutRef = useRef(null);

  useEffect(() => {
    gsap.to(aboutRef.current, {
      yPercent: -50,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  const isInView = useInView(aboutRef, { once: true, margin: "-50px 0px" });
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const spanVariants = {
    hidden: { opacity: 0, width: "0rem", originX: 0.5 },
    visible: {
      opacity: 1,
      width: "6.5rem",
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const projects = [
    {
      title: "Clear Aligners",
      subtitle: "INVISALIGN",
      image: "../images/handbreakout.png",
    },
    {
      title: "Braces",
      subtitle: "DAMON",
      image: "../images/maledamonbraces.png",
    },
    {
      title: "All Ages",
      subtitle: "",
      image: "../images/purplefloss.jpeg",
    },
  ];

  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };



  return (
    <section
      ref={aboutRef}
      className="rounded-tl-[40px] rounded-tr-[40px] bg-[#FBFBFB] hero relative flex flex-col justify-between z-20"
    >
      {/* <svg
      ref={pathRef}
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className="neon-line"
    >
      <path
        d="M 100 500 Q 300 100 500 500 T 900 500"
        stroke="#FFFF00"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg> */}
      <section style={{ marginTop: "12rem" }} ref={aboutRef}>
        <motion.div
          className="w-layout-blockcontainer textimagecontainer"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={textVariants}
        >
          <div className="text-images-wrapper">
            <div className="text-images">
              <h2 className="heading-2 text-weight-regular">
                #1 Diamond and{" "}
                <motion.div
                  className="spanimage one"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                Invisalign Providers in Lehigh Valley. We've treated the most
                Invisalign cases{" "}
                <motion.div
                  className="spanimage two"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                delivering straighter smiles in 12-16 months{" "}
                <motion.div
                  className="spanimage three"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                without wires
              </h2>
            </div>
          </div>
        </motion.div>

     <div
      style={{ marginTop: '8rem' }}
      className="big-numbers-wrapper flex justify-around items-center"
    >
      <div
        className="big-numbers-card group transition-all duration-500 ease-in-out"
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`big-numbers text-5xl font-bold ${
            hoveredCard && hoveredCard !== 1 ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          60+
        </div>
        <p
          className={`text-size-medium font-neue-montreal ${
            hoveredCard && hoveredCard !== 1 ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          Years of experience
        </p>
      </div>

   
      <div
        className="big-numbers-card group transition-all duration-500 ease-in-out"
        onMouseEnter={() => handleMouseEnter(2)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`big-numbers text-5xl font-bold ${
            hoveredCard === 2 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          25k+
        </div>
        <p
          className={`text-size-medium font-neue-montreal ${
            hoveredCard === 2 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          Satisfied patients
        </p>
      </div>

 
      <div
        className="big-numbers-card group transition-all duration-500 ease-in-out"
        onMouseEnter={() => handleMouseEnter(3)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`big-numbers text-5xl font-bold ${
            hoveredCard === 3 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          4+
        </div>
        <p
          className={`text-size-medium font-neue-montreal ${
            hoveredCard === 3 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          Locations
        </p>
      </div>
    </div>

        <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-[4rem] font-neue-montreal">What we do</h2>
            <span className="text-6xl font-cursive italic text-gray-700 block mt-2 font-autumnchant">
              best
            </span>


            {/* <img
              src="../images/handbreakout.png"
              className="breakout-container"
              alt="Home SVG"
            /> */}

            
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    {projects.map((project, index) => {
      const [isHovered, setIsHovered] = useState(false);

      return (
        <motion.div
          key={index}
          className="bg-white relative rounded-lg p-8 flex flex-col justify-between overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ height: "36rem" }}
        >
          <motion.div
            className="relative overflow-hidden flex items-center justify-center w-full h-full"
            animate={{
              clipPath: isHovered
                ? "circle(150% at 50% 50%)" 
                : "circle(25% at 50% 50%)", 
            }}
            transition={{
              duration: isHovered ? 1.2 : 0.6, 
              ease: [0.3, 0.0, 0.2, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              clipPath: "circle(25% at 50% 50%)", 
            }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="object-cover w-full h-full"
              animate={{
                transform: isHovered
                  ? "translate(0%, 0%) scale(1)" 
                  : "translate(-5%, -5%) scale(1.1)", 
              }}
              transition={{
                duration: isHovered ? 1.2 : 0.6, 
                ease: [0.3, 0.0, 0.2, 1],
              }}
            />
          </motion.div>

          <div className="text-left mt-auto pt-4 relative z-10 pointer-events-none">
            <h3 className="text-[2rem] font-neue-montreal tracking-wider mb-2 text-gray-800">
              {project.title}
            </h3>
            <p className="text-gray-600 uppercase tracking-wider">
              {project.subtitle}
            </p>
          </div>
        </motion.div>
      );
    })}
  </div>
</div>

      </section>
      {/* <div className="hero-wrapper flex flex-col justify-between items-center w-full pt-[15vh] pb-16 relative">

        <div className="w-layout-blockcontainer container mx-auto w-container max-w-[940px] sm:max-w-full lg:max-w-3xl">
          <div className="hero-header flex flex-col items-center text-center relative gap-4">
            <div
              className="heading opacity-0 transform translate-y-[10vh]"
              style={{
                transform: "translate3d(0, 10vh, 0) scale3d(1, 1, 1)",
                transition: "all 0.5s",
              }}
            >
            
            </div>
          </div>
        </div>

        <section className="hero relative flex justify-center items-center h-screen">
          <div className="hero-grid absolute inset-0 flex justify-center items-center z-0">
            <img
              src="../images/Hero-Background-Grid.svg"
              alt="Hero Grid"
              loading="lazy"
              className="w-[320vw] max-w-[1000px]" 
            />
          </div>

          <div className="z-20 hero-interaction-wrapper relative flex justify-center items-center z-20 space-x-2">
            <div className="hero-card bg-transparent z-30 rotate-[-4deg]">
              <img
                src="../images/freysmilepatient.jpg"
                alt="Hero Image 1"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
            <div className="hero-card bg-transparent z-20 rotate-[-2deg]">
              <img
                src="../images/blueorange.png"
                alt="Hero Image 2"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
            <div className="hero-card bg-transparent z-10 rotate-[2deg]">
              <img
                src="../images/gradientbg.jpeg"
                alt="Hero Image 3"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div> */}
    </section>
  );
};

const ParallaxOutline = () => {
  const parallaxRef = useRef(null);

  return (
    <div className="relative flex flex-col items-center justify-center bg-[#FBFBFB]">
      <section
        ref={parallaxRef}
        className="py-20 px-8 flex flex-col lg:flex-row max-w-7xl mx-auto space-y-12 lg:space-y-0 lg:space-x-8"
      >
        {/* Left Text Section */}
        <div className="flex-1 flex flex-col items-start space-y-6 relative z-20">
          <h1 className="font-oakes-regular text-[3rem] leading-tight">
            <span className="block">
              Initial <span>Consultations</span>
            </span>
            <span className="block">
              Are{" "}
              <span className="font-autumnchant bg-[#d7fa2c] text-black px-4 py-2 inline-block rounded-lg">
                always
              </span>{" "}
              Complimentary
            </span>
          </h1>
          <p className="text-[2rem] font-editorial-new-italic">
            Find out which treatment plan suits you best.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-[360px] h-[660px]">
            <img
              src="../images/mainsectionimage.jpg"
              alt="Consultation"
              className="object-cover w-full h-full rounded-full"
            />
          </div>

          <div className="absolute -left-28 top-48 bg-[#d7fa2c] z-10 w-56 h-56 rounded-full"></div>
        </div>

      
        <div className="flex flex-col items-center justify-center space-y-6 lg:pl-8 z-20">
          <button className="font-helvetica-neue-light bg-[#e0cbe8] text-black text-2xl py-6 px-12 rounded-lg">
            NEED MORE INFO? <br /> TAKE OUR QUIZ
          </button>
          <div
      data-remodal-target="form"
      className="img-wrap mod--round transform"
      style={{
        transform: 'transform: translate3d(0, 0, 0) rotateZ(-120deg);',
      }}
    >
      {/* Inner text wrapper */}
      <div className="img-wrap mod--round-text3">
        <svg
         className="circular-text-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      aria-labelledby="circular-text"
      lang="en"
    >
      <defs>
        <path
          id="textcirclenew"
          d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"
          transform="rotate(12,250,250)"
        />
      </defs>
      <g className="textcircle">
        <text style={{ fontSize: "38px" }}>
          <textPath
            xlinkHref="#textcirclenew"
            aria-label="Open for Business"
            textLength="880"
          >
            BOOK HERE TO LEARN MORE
          </textPath>
        </text>
      </g>
    </svg>
       
      </div>
      
      {/* Arrow */}
      <div className="img mod--round-arrow"></div>
    </div>
        </div>
      </section>
    </div>
  );
};

// function Mask() {
//   const useMousePosition = () => {
//     const [mousePosition, setMousePosition] = useState({ x: null, y: null });
//     const updateMousePosition = e => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     useEffect(() => {
//       window.addEventListener("mousemove", updateMousePosition);
//       return () => window.removeEventListener("mousemove", updateMousePosition);
//     }, []);

//     return mousePosition;
//   };

//   const [isHovered, setIsHovered] = useState(false);

//   const { x, y } = useMousePosition();

//   const size = isHovered ? 400 : 40;

//   return (
//     <main className="uniqueMain">
//       <motion.div
//         className="uniqueMask"
//         animate={{
//           WebkitMaskPosition: `${x - (size/2)}px ${y - (size/2)}px`,
//           WebkitMaskSize: `${size}px`,
//         }}
//         transition={{ type: "tween", ease: "backOut", duration: 0.5}}
//       >
//         <p onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}>
//           INVISALIGN DAMON BRACES ADVANCED ORTHONDOTIC CARE
//         </p>
//       </motion.div>

//       <div className="uniqueBody">
//         <p> We are your  <span>go-to provider </span> for advanced and discerning orthodontic care.</p>
//       </div>
//     </main>
//   )
// }
// SwiperCore.use([Keyboard, Mousewheel]);

function GSAPAnimateScrollSections() {
  // const listRef = useRef(null);

  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   const items = listRef.current.querySelectorAll(".list__item");

  //   items.forEach((item) => {
  //     const itemTitle = item.querySelector(".list__item__title");
  //     const itemTitleOutline = item.querySelector(".list__item__titleOutline");
  //     const itemImg = item.querySelector("img");

  //     gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: item,
  //           start: "0% 75%",
  //           end: "25% 50%",
  //           scrub: 3,
  //         },
  //       })
  //       .fromTo(
  //         [itemTitle, itemTitleOutline],
  //         { scale: 2, y: "100%" },
  //         { scale: 1, y: "0%", ease: "power2.inOut" }
  //       );

  //     gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: item,
  //           start: "50% 100%",
  //           end: "100% 50%",
  //           scrub: 3,
  //           onEnter: () =>
  //             gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
  //           onLeave: () =>
  //             gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
  //           onEnterBack: () =>
  //             gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
  //           onLeaveBack: () =>
  //             gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
  //         },
  //       })
  //       .fromTo(
  //         itemImg,
  //         { x: "60vw", y: "60vh", rotate: -30 },
  //         {
  //           x: "-60vw",
  //           y: "-60vh",
  //           rotate: 30,
  //           ease: "none",
  //         }
  //       );
  //   });
  // }, []);

  // const imageItems = [
  //   {
  //     imgSrc: "/images/patient25k.png",
  //     text: "25k+ Patients",
  //   },
  //   {
  //     imgSrc: "/images/lehighvalley.jpg",
  //     text: "4 Bespoke Locations",
  //   },
  //   {
  //     imgSrc: "/images/experiencedoctor.png",
  //     text: "50+ Years Experience",
  //   },
  // ];
  useEffect(() => {
    const viewHeight = window.innerHeight;

    document.querySelectorAll(".text-container").forEach((element) => {
      const top = element.getBoundingClientRect().top;
      const start = viewHeight - top;

      const firstText = element.querySelector(".parallax-text:first-child");
      const secondText = element.querySelector(".parallax-text:last-child");

      gsap.to(firstText, {
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: start + "px bottom",
          end: "bottom top",
        },
        x: "-54vw",
        ease: "none",
      });

      gsap.to(secondText, {
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: start + "px bottom",
          end: "bottom top",
        },
        x: "32vw",
        ease: "none",
      });
    });
  }, []);
  const textItems = [
    { title1: "50+ Years of ", title2: " Experience" },
    { title1: "4 Bespoke Locations", title2: "4 Bespoke Locations" },
    { title1: "25k Patients", title2: "25k Patients" },
  ];
  const imageStyles = [
    { width: "32vw", height: "48vw" },
    { width: "70vw", height: "auto" },
    { width: "32vw", height: "48vw" },
  ];

  useEffect(() => {
    gsap.defaults({ ease: "none" });

    const main = gsap.timeline();

    const sphereAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: ".home-main",
        start: "top 0",
        end: "bottom 100%",
        scrub: 1,
      },
    });

    sphereAnimation
      .to(".home-hero", {
        opacity: "0",
        duration: 2.4,
      })

      .to(
        "#middle-circle",
        {
          scale: 1,
          boxShadow: "rgb(255, 255, 255) 0px 3px 47px inset",
          transform: "translate(-50%, -50%) translate3d(0px, 0px, 0px)",
          duration: 2,
          transformOrigin: "50% 50%",
        },
        0
      )
      .to(
        "#first-circle",
        {
          transform: "translate(-50%, -50%) translate(-130%, 0px)",
          opacity: "1",
          filter: "blur(0px)",
          duration: 4,
          transformOrigin: "50% 50%",
        },
        3
      )
      .to(
        "#last-circle",
        {
          transform: "translate(-50%, -50%) translate(130%, 0px)",
          opacity: "1",
          filter: "blur(0px)",
          duration: 4,
          transformOrigin: "50% 50%",
        },
        3
      )
      .to(
        "#figure2",
        {
          scale: 1,
          filter: "blur(0)",
          opacity: "1",
          duration: 4,
        },
        0
      )
      .to(".home-main__content-sphere-desc", {
        scale: 1,
        transform: "translate(0px, 0px)",
        opacity: "1",
        duration: 4,
      });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(
        ".home-hero, .home-main__content-atom, #middle-circle, #first-circle, #last-circle, #figure2, .home-main__content-sphere-desc"
      );
    };
  }, []);

  const MobileLayout = () => {
    useGSAP(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#stats-section",
          start: "top 50%",
          end: "bottom 100%",
          scrub: 1,
        },
        defaults: { ease: "power1.in" },
      });

      tl.to(
        ".middle-circle",
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 4,
        },
        0
      )
        .to(
          ".middle-circle-text",
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 6,
          },
          0
        )
        .to(
          ".left-circle",
          {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translate(0%, 0%)",
            duration: 6,
          },
          3
        );
      tl.to(
        ".right-circle",
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "translate(0%, 0%)",
          duration: 6,
        },
        3
      ).to("#stats-heading", {
        opacity: 1,
        transform: "translate(0%, 0%)",
        duration: 4,
      });
    });

    

    return (
      <section
        id="stats-section"
        className="relative block w-full h-[50vh] md:h-screen place-content-center place-items-center xl:hidden"
      >
        <div className="container flex items-center justify-center gap-2 px-8 py-4 mx-auto">
          <figure className="translate-x-1/2 opacity-0 blur-sm left-circle">
            <span className="block w-32 h-32 mb-4 border rounded-full md:w-48 md:h-48 place-content-center place-items-center border-zinc-100 aspect-square">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                60+ yrs
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              experience
            </p>
          </figure>
          <figure className="scale-0 opacity-0 blur-sm middle-circle">
            <span className="block w-40 h-40 md:w-60 md:h-60 mb-4 rounded-full place-content-center place-items-center aspect-square shadow-[inset_0_0_20px_rgba(255,255,255,1)] md:shadow-[inset_0_0_30px_rgba(255,255,255,1)] middle-circle-text opacity-0 blur-sm">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider  text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                25,000
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize opacity-0 middle-circle-text blur-sm font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              patients
            </p>
          </figure>
          <figure className="-translate-x-1/2 opacity-0 blur-sm right-circle">
            <span className="block w-32 h-32 mb-4 border rounded-full md:w-48 md:h-48 place-content-center place-items-center border-zinc-100 aspect-square">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider  text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                4
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              locations
            </p>
          </figure>
        </div>
        <div
          id="stats-heading"
          className="container w-full mx-auto translate-y-1/2 opacity-0 place-content-center"
        >
          <h2 className="w-full tracking-tighter text-center uppercase text-[clamp(3.75rem,_2.6316rem_+_5.5921vw,_8rem)] leading-[clamp(3.75rem,_2.6316rem_+_5.5921vw,_8rem)] font-agrandir-grandheavy text-zinc-100">
            About
          </h2>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* <section className="relative hidden home-main xl:block">
        <div className="home-main__content">
          <div className="home-main__content-sphere">
            <ul className="container mx-auto">
              <li
                className="font-helvetica-neue "
                id="first-circle"
                style={{ opacity: 0, filter: "blur(10px)" }}
              >
                <figure>
                  <h3>60+</h3>
                  <p className="mt-10 uppercase font-poppins ">
                    years of experience
                  </p>
                </figure>
              </li>
              <li
                className="font-bold font-neue-montreal"
                id="middle-circle"
                style={{ boxShadow: "inset 0 0 300px #fff" }}
              >
                <figure
                  id="figure2"
                  style={{ opacity: 0, filter: "blur(10px)" }}
                >
                  <h3 className="font-bold font-Lato">25k</h3>
                  <p className="mt-10 tracking-wide uppercase font-Lato">
                    patients
                  </p>
                </figure>
              </li>
              <li
                className=""
                id="last-circle"
                style={{ opacity: 0, filter: "blur(10px)" }}
              >
                <figure>
                  <h3 className="font-bold font-neue-montreal">4</h3>
                  <p className="mt-10 tracking-wide font-helvetica-now-thin">
                    unique locations
                  </p>
                </figure>
              </li>
            </ul>
            <div
              className="home-main__content-sphere-desc"
              style={{ transform: "translate(0, 137px)", opacity: 0 }}
            ></div>
          </div>
        </div>
      </section> */}

      <MobileLayout />
    </>
    // <section
    //   ref={listRef}
    //   className="flex flex-col items-center justify-center"
    // >
    //   {imageItems &&
    //     imageItems.map((item, index) => (
    //       <div
    //         key={index}
    //         className="relative flex items-end w-full h-screen pb-10 list__item"
    //       >
    //         <img
    //           src={item.imgSrc}
    //           alt={`Description ${index + 1}`}
    //           className="absolute z-20 object-cover"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             width: "33%",
    //             height: "auto",
    //             aspectRatio: "10 / 14",
    //             transform: "translate(-50%, -50%)",
    //           }}
    //         />
    //         <div
    //           className="absolute z-10 font-bold transform -translate-x-1/2 -translate-y-1/2 list__item__title top-1/2 left-1/2 text-8xl"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             transform: "translate(-50%, -50%)",
    //             fontSize: "12vw",
    //             fontFamily: '"Playfair Display"',
    //             lineHeight: "80%",
    //             color: "#221608",
    //           }}
    //         >
    //           {item.text}
    //         </div>
    //         <div
    //           className="absolute z-30 font-bold transform -translate-x-1/2 -translate-y-1/2 list__item__titleOutline top-1/2 left-1/2 text-8xl"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             transform: "translate(-50%, -50%)",
    //             fontSize: "12vw",
    //             fontFamily: '"Playfair Display"',
    //             lineHeight: "80%",
    //             color: "transparent",
    //             WebkitTextStroke: "2px #221608",
    //           }}
    //         >
    //           {item.text}
    //         </div>
    //       </div>
    //     ))}
    // </section>
  );
}

const ImageGrid = () => {
  const bodyRef = useRef(null);
  const headerRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    if (isHovering) {
      window.addEventListener("mousemove", moveCursor);
    }

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [isHovering]);

  useEffect(() => {
    if (headerRef.current) {
      const tl = gsap.timeline();
      gsap.set(bodyRef.current, { autoAlpha: 1 });

      const pageHeading = headerRef.current.querySelector("h1");
      const pageBody = headerRef.current.querySelector("p");
      const separator = headerRef.current.querySelector("hr");
      const imageCards = gsap.utils.toArray(".image-card");

      gsap.set(imageCards, { autoAlpha: 0 });

      const childLines = new SplitText(pageHeading, {
        type: "lines",
        linesClass: "heading-line",
      });
      const parentLines = new SplitText(pageHeading, {
        type: "lines",
        linesClass: "heading-line-wrapper",
      });

      tl.from(childLines.lines, {
        duration: 1,
        y: 200,
        stagger: 0.25,
        delay: 1,
        ease: "power4.out",
      })
        .from(
          pageBody,
          {
            duration: 0.5,
            opacity: 0,
            x: -20,
          },
          "-=0.5"
        )
        .from(
          separator,
          {
            duration: 2,
            scale: 0,
            ease: "expo.inOut",
          },
          "-=1.1"
        )
        .to(
          imageCards,
          {
            duration: 0.75,
            autoAlpha: 1,
            y: -50,
            stagger: 0.5,
            ease: "power4.out",
          },
          "-=0.75"
        );

      // const scroll = new LocomotiveScroll({
      //   el: bodyRef.current,
      //   smooth: true,
      // });

      setTimeout(() => {
        scroll.update();
      }, 1000);
    }
  }, []);

  const images = [
    {
      title: "Top 1% of providers",
      src: "../images/invis.png",
      className: "image-portrait",

      url: "/invisalign",
    },
    {
      title: "Faster treatment times with fewer appointments",
      src: "../images/damon1.png",
      className: "image-landscape",

      url: "/braces",
    },
    {
      title: "Pioneering the most comfortable appliances since 2005",
      src: "../images/mountain.png",
      className: "image-landscape",

      url: "/why-choose-us",
    },
  ];

 
  return (
    <section className="bg-[#FBFBFB]">
   <div>
      <div
        className="container flex flex-col py-24 mx-auto overflow-hidden text-white lg:flex-row lg:items-start"
        ref={bodyRef}
      >
        <div
          className={`custom-cursor2 ${isHovering ? "rotate" : ""}`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            opacity: isHovering ? 1 : 0,
          }}
        >
          <p>CHECK </p>
          <p>IT OUT</p>
        </div>
        <div className="flex flex-wrap items-center justify-center min-h-screen p-0">
          {images.map((image, index) => (
            <a
              key={index}
              href={image.url}
              className={`group image-card relative flex items-center justify-center mb-20 ${
                image.className === "image-portrait"
                  ? "mx-4 w-[27vw] h-[37vw]"
                  : "mx-4 w-[40vw] h-[27vw]"
              }`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="image-header text-[35px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125 leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none">
                {image.title}
              </div>
              <img
                src={image.src}
                className="block object-cover w-full h-full"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};

const LogoGrid = () => {
  const logos = [
    [
      "../images/movingbannerfiles/diamondplus.svg",
      "../images/movingbannerfiles/readers.png",
      "../images/movingbannerfiles/damonsystem.svg",
      "../images/movingbannerfiles/damonsystem.svg",
    ],
    [
      "../images/movingbannerfiles/topDentist_logo.png",
      "../images/movingbannerfiles/invisalign_invert.png",
      "../images/movingbannerfiles/ajodo.svg",
      "../images/movingbannerfiles/ABO_invert.png",
      "../images/movingbannerfiles/ABO_invert.png",
    ],
    [
      "../images/movingbannerfiles/valley.png",
      "../images/movingbannerfiles/top-Dentist.png",
      "../images/movingbannerfiles/aao_invert.png",
      "../images/movingbannerfiles/aao_invert.png",
    ],
  ];

  let isSphereCreated = false;

  useEffect(() => {
    console.log("sphere");
    if (isSphereCreated) {
      return;
    }
    isSphereCreated = true;
    console.log("createsphere");
    const createSphere = async () => {
      let majorPlatformVersion;
      const canvasSphereWrapp = document.querySelector("#ballcanvas");

      if (navigator.userAgentData) {
        try {
          if (navigator.userAgentData.platform === "Windows") {
            let ua = await navigator.userAgentData.getHighEntropyValues([
              "platformVersion",
            ]);
            majorPlatformVersion = parseInt(ua.platformVersion.split(".")[0]);
          }
        } catch (error) {
          console.error("version", error);

          majorPlatformVersion = undefined;
        }
      }

      let sW = canvasSphereWrapp.offsetWidth;
      let halfsW = sW / 2;
      let circleW = sW / 12;

      let Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composite = Matter.Composite,
        World = Matter.World,
        Mouse = Matter.Mouse,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint;

      let engine = Engine.create();

      let render = Render.create({
        element: canvasSphereWrapp,
        engine: engine,
        options: {
          isSensor: true,
          width: canvasSphereWrapp.offsetWidth,
          pixelRatio: "auto",
          height: canvasSphereWrapp.offsetHeight,
          background: "transparent",
          wireframes: false,
        },
      });

      if (majorPlatformVersion >= 13) {
        engine.timing.timeScale = 0.35;
      }

      engine.gravity.y = 1;
      engine.gravity.x = 0;
      engine.gravity.scale = 0.0025;

      let stack = [];
      const texts = ["INVISALIGN", "DAMON", "DIAMOND 1%"];

      let ballsWithText = [];

      for (let i = 0; i < 12; i++) {
        const ball = Bodies.circle(halfsW, halfsW, circleW, {
          density: 0.00001,
          restitution: 0.5,
          density: 0.05,
          collisionFilter: {
            category: 0x0003,
            mask: 0x0003 | 0x0001,
          },
          render: {
            fillStyle: "#1e90ff",
            // strokeStyle: 'white',
            // lineWidth: 1,
          },
        });
        ballsWithText.push({ ball, text: texts[i] });
        Composite.add(engine.world, ball);
      }
      Events.on(render, "afterRender", function () {
        const ctx = render.context;
        ballsWithText.forEach(({ ball, text }, index) => {
          const position = ball.position;

          const image = new Image();
          image.src = logos[Math.floor(index / 4)][index % 4];
          const aspectRatio = image.width / image.height;

          let imageWidth, imageHeight;
          if (aspectRatio > 1) {
            imageWidth = circleW;
            imageHeight = circleW / aspectRatio;
          } else {
            imageWidth = circleW * aspectRatio;
            imageHeight = circleW;
          }

          const destX = position.x - imageWidth / 2;
          const destY = position.y - imageHeight / 2;

          ctx.drawImage(image, destX, destY, imageWidth, imageHeight);
        });
      });

      let mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        });

      mouseConstraint.mouse.element.removeEventListener(
        "mousewheel",
        mouseConstraint.mouse.mousewheel
      );
      mouseConstraint.mouse.element.removeEventListener(
        "DOMMouseScroll",
        mouseConstraint.mouse.mousewheel
      );

      let shakeScene = function (engine, bodies) {
        let timeScale = 1000 / 60 / engine.timing.lastDelta;

        for (let i = 0; i < bodies.length; i++) {
          let body = bodies[i];

          if (!body.isStatic) {
            let forceMagnitude = 0.03 * body.mass * timeScale;

            Body.applyForce(body, body.position, {
              x:
                (forceMagnitude + Common.random() * forceMagnitude) *
                Common.choose([1, -1]),
              y: -forceMagnitude + Common.random() * -forceMagnitude,
            });
          }
        }
      };

      Events.on(mouseConstraint, "mousemove", function (event) {
        let foundPhysics = Matter.Query.point(stack, event.mouse.position);
        shakeScene(engine, foundPhysics);
      });

      Composite.add(engine.world, mouseConstraint);

      render.mouse = mouse;

      Render.run(render);

      let r = sW / 2;
      let parts = [];
      let pegCount = 32;
      let TAU = Math.PI * 2;
      for (let i = 0; i < pegCount; i++) {
        const segment = TAU / pegCount;
        let angle2 = (i / pegCount) * TAU + segment / 2;
        let x2 = Math.cos(angle2);
        let y2 = Math.sin(angle2);
        let cx2 = x2 * r + sW / 2;
        let cy2 = y2 * r + sW / 2;
        let rect = addRect({
          x: cx2,
          y: cy2,
          w: (10 / 1000) * sW,
          h: (400 / 1000) * sW,
          options: {
            angle: angle2,
            isStatic: true,
            density: 1,
            render: {
              fillStyle: "transparent",
              strokeStyle: "transparent",
              lineWidth: 0,
            },
          },
        });
        parts.push(rect);
      }

      function addBody(...bodies) {
        World.add(engine.world, ...bodies);
      }

      function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
        let body = Bodies.rectangle(x, y, w, h, options);
        addBody(body);
        return body;
      }

      let runner = Runner.create();

      Runner.run(runner, engine);
    };

    createSphere();

    return () => {};
  }, []);

  return (
    <div className="bg-[#20282D] relative h-screen overflow-hidden">
      {/* <div className="grid grid-cols-2 gap-4">
        {logos.map((columnLogos, columnIndex) => (
          <div key={columnIndex} className="flex flex-col items-center">
            {columnLogos.map((logo, logoIndex) => (
              <div key={logoIndex} className="p-2">
                <img
                  src={logo}
                  alt={`Logo ${logoIndex + 1}`}
                  className="w-auto h-14"
                />
              </div>
            ))}
          </div>
        ))}
      </div> */}
      <div className="container flex flex-col-reverse items-center justify-center h-full gap-4 py-32 mx-auto overflow-hidden lg:py-0 lg:flex-row lg:overflow-visible">
        <div
          id="ballcanvas"
          className="z-10 w-full h-full lg:w-1/2 horizontal-item"
        />

        <div className="lg:w-1/2">
          <p className="font-helvetica-neue-light text-white leading-[clamp(1rem,_-0.4503rem_+_7.7348vw,_4.5rem)]  text-[clamp(1rem,_-0.4503rem_+_7.7348vw,_4.5rem)]">
            Awards & Recognition
          </p>
          <div className="flex items-center mt-10">
            <div className="w-48 h-px bg-white"></div>
            <p className="text-white font-neue-montreal text-[15px] pl-4">
              Our greatest award is the success of our patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Testimonials() {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current: carousel } = carouselRef;
      const scrollAmount = carousel.offsetWidth;
      if (direction === "left") {
        carousel.scrollLeft -= scrollAmount;
      } else {
        carousel.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div>
      <div className="font-neue-montreal mt-32 mb-10 flex justify-center text-4xl tracking-widest uppercase">
        Testimonials
      </div>

      {/* Carousel Section */}
      <div className="relative flex items-center justify-center">
        <div className="absolute top-0 right-0 z-20 flex space-x-4">
          <button
            onClick={() => scroll("left")}
            className="p-4"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="13"
              viewBox="0 0 40 13"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.1483 6.84393C-0.0494335 6.65398 -0.0494335 6.34602 0.1483 6.15608L6.40853 0.142458C6.60627 -0.0474861 6.92686 -0.0474861 7.12459 0.142458C7.32233 0.332403 7.32233 0.640364 7.12459 0.830308L1.72872 6.01362L40 6.01362V6.98639L1.72872 6.98638L7.12459 12.1697C7.32233 12.3596 7.32233 12.6676 7.12459 12.8575C6.92686 13.0475 6.60627 13.0475 6.40853 12.8575L0.1483 6.84393Z"
                fill="white"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-4"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="13"
              viewBox="0 0 40 13"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.8517 6.15607C40.0494 6.34602 40.0494 6.65398 39.8517 6.84392L33.5915 12.8575C33.3937 13.0475 33.0731 13.0475 32.8754 12.8575C32.6777 12.6676 32.6777 12.3596 32.8754 12.1697L38.2713 6.98638L0 6.98637V6.01361L38.2713 6.01362L32.8754 0.830304C32.6777 0.64036 32.6777 0.332401 32.8754 0.142457C33.0731 -0.0474879 33.3937 -0.0474878 33.5915 0.142457L39.8517 6.15607Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-hidden scroll-smooth snap-x snap-mandatory"
          style={{ width: "60vw" }}
        >
          {/* Slide 1 */}
          <div
            className="flex items-center justify-center w-full snap-start shrink-0"
            style={{
              height: "500px",
              backgroundImage:
                "linear-gradient(to right, #bccdcd,#c2d6d6, #92B9AB)",
            }}
          >
            <div className="flex flex-col justify-center items-center mx-[7vw] text-white">
              <p className="font-helvetica-now-thin text-[24px] text-center">
                You will receive top notch orthodontic care at Frey Smiles. Dr.
                Frey and his entire staff make every visit a pleasure. It is
                apparent at each appointment that Dr. Frey truly cares about his
                patients. He has treated both of our kids and my husband, and
                they all have beautiful smiles! I highly recommend!
              </p>
              <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">
                Lisa Moyer
              </p>
            </div>
          </div>

          {/* Slide 2 */}
          <div
            className="flex items-center justify-center w-full snap-start shrink-0"
            style={{
              height: "500px",
              backgroundImage:
                "linear-gradient(to right, #92B9AB, #94ACB1,#98A6B0)",
            }}
          >
            <div className="flex flex-col justify-center items-center mx-[7vw] text-white">
              <p className="font-helvetica-now-thin text-[24px] text-center">
                My experience at FreySmiles has been amazing! I recently just
                completed my Invisalign and my teeth look perfect! Dr. Frey
                truly cares about his patients and the staff are always
                friendly, as well as always accommodating to my schedule.
                They're the best around!
              </p>
              <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">
                Kailee
              </p>
            </div>
          </div>

          {/* Slide 3 */}
          <div
            className="flex items-center justify-center w-full snap-start shrink-0"
            style={{
              height: "500px",
              backgroundImage:
                "linear-gradient(to right, #98A6B0,#A6A19C, #C59573)",
            }}
          >
            <div className="flex flex-col justify-center items-center mx-[7vw] text-white">
              <p className="text-2xl text-center">
                I had an open bite and misaligned teeth most of my life. Dr Frey
                fixed it and in record time. 1 1/2 yrs with Invisalign's. Highly
                recommended! Friendly staff and easy to make appointments!
              </p>
              <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">
                Karen Oneill
              </p>
            </div>
          </div>

          {/* Slide 4 */}
          <div
            className="flex items-center justify-center w-full snap-start shrink-0"
            style={{
              height: "500px",
              backgroundImage: "linear-gradient(to right, #C59573,#D7844F)",
            }}
          >
            <div className="flex flex-col justify-center items-center mx-[7vw] text-white">
              <h1 className="font-helvetica-now-thin text-[24px] text-center">
                Dr. Frey was my orthodontist when I was 11 years old, Im now 42.
                I still talk about how amazing he was and the great work he did
                with my teeth. Thank you so much for giving the most beautiful
                smile!
              </h1>
              <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">
                Tanya Burnhauser
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Locations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [scope, animate] = useAnimate();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [activeDisclosurePanel, setActiveDisclosurePanel] = useState(null);

  function toggleDisclosurePanels(newPanel) {
    if (activeDisclosurePanel) {
      if (
        activeDisclosurePanel.key !== newPanel.key &&
        activeDisclosurePanel.open
      ) {
        activeDisclosurePanel.close();
      }
    }
    setActiveDisclosurePanel({
      ...newPanel,
      open: !newPanel.open,
    });
  }

  const locations = [
    {
      location: "Allentown",
      addressLine1: "1251 S Cedar Crest Blvd",
      addressLine2: "Suite 210 Allentown, PA 18103",
      mapbox_map_title: "FreySmiles Allentown [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALLENTOWN,
      hours: [
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Wed: "8:00 AM - 5:30 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Bethlehem",
      addressLine1: "2901 Emrick Boulevard",
      addressLine2: "Bethlehem, PA 18020",
      mapbox_map_title: "FreySmiles Bethlehem [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_BETHLEHEM,
      hours: [{ Tue: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
    {
      location: "Schnecksville",
      addressLine1: "4155 Independence Drive",
      addressLine2: "Schnecksville, PA 18078",
      mapbox_map_title: "FreySmiles Schnecksville [w/ Colors]",
      mapbox_iframe_url:
        process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_SCHNECKSVILLE,
      hours: [
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Lehighton",
      addressLine1: "1080 Blakeslee Blvd Dr E",
      addressLine2: "Lehighton, PA 18235",
      mapbox_map_title: "FreySmiles Lehighton [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_LEHIGHTON,
      hours: [{ Mon: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
  ];

  const handleShowAllLocations = () => {
    activeDisclosurePanel.close();
    setSelectedLocation("All");
  };

  useEffect(() => {
    animate(
      "div",
      isInView
        ? {
            opacity: 1,
            transform: "translateX(0px)",
            scale: 1,
            filter: "blur(0px)",
          }
        : {
            opacity: 0,
            transform: "translateX(-50px)",
            scale: 0.3,
            filter: "blur(2px)",
          },
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    );
  }, [isInView]);

  const DrawEllipse = (props) => {
    useGSAP(() => {
      gsap.from(".draw", {
        drawSVG: "0%",
        ease: "expo.out",
        scrollTrigger: {
          trigger: "#locations-section",
          start: "clamp(top center)",
          scrub: true,
          pinSpacing: false,
          markers: false,
        },
      });
    });

    return (
      <svg
        width="508"
        height="122"
        viewBox="0 0 508 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          className="draw"
          d="M2 23.2421C28.9079 14.5835 113.098 -1.63994 234.594 2.73493C386.464 8.20351 515.075 37.5458 505.497 77.9274C503.774 85.1946 491.815 127.145 271.535 118.942C51.2552 110.739 32.8106 78.7919 45.7824 58.053C59.4644 36.1787 112.824 27.9758 193.548 27.9758"
          stroke="#ff6432"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const BezierCurve = () => {
    const container = useRef(null);
    const path = useRef(null);
    let progress = 0;
    let time = Math.PI / 2; // want the initial time value to be 1; in sine graph y = 1 when x = pi / 2
    let reqId = null; // everytime mouse enters and leaves line's bounding box, animation gets called causing simultaneous chains of it being called (this is bad), only want one request animation running at the same time
    let x = 0.5; // middle point is 1/2

    useEffect(() => {
      setPath(progress);
      window.addEventListener("resize", () => {
        setPath(progress);
      });
    }, []);

    {
      /*
      use svg container's width to get control point (center point) of quadratic bezier curve; control point = svg container's width / 2
      30 ==> svg height(60) divided by 2 to align the path within the center of the svg
    */
    }
    const setPath = (progress) => {
      if (container.current) {
        const width = container.current.offsetWidth;
        path.current.setAttributeNS(
          null,
          "d",
          `M 0 30 Q${width * x} ${30 + progress} ${width} 30`
        );
      }
    };

    const manageMouseEnter = () => {
      if (reqId) {
        window.cancelAnimationFrame(reqId);
        resetAnimation();
      }
    };

    const manageMouseMove = (e) => {
      const { movementY, clientX } = e;
      const { left, width } = path.current.getBoundingClientRect();
      // get value of x depending on where mouse is on the x-axis of the line
      x = (clientX - left) / width;
      progress += movementY;
      setPath(progress);
    };

    const manageMouseLeave = () => {
      animateOut();
    };

    {
      /*
      linear interpolation
      x: The value we want to interpolate from (start) => 10
      y: The target value we want to interpolate to (end) => 0
      a: The amount by which we want x to be closer to y => 10% or 0.1
      ex: value = lerp(value, 0, 0.1)
      if value = 10, bring that value close to 0 by 10% which will give 9
    */
    }
    const lerp = (x, y, a) => x * (1 - a) + y * a;

    // sine function, linear interpolation, recursivity
    const animateOut = () => {
      // sine function creates the "wobbly" line animation when mouse leaves the line
      const newProgress = progress * Math.sin(time);
      time += 0.25; // speed of bounce animation
      setPath(newProgress);
      progress = lerp(progress, 0, 0.05); // change 3rd lerp argument to change curve's bounce exaggeration

      // exit condition
      if (Math.abs(progress) > 0.75) {
        reqId = window.requestAnimationFrame(animateOut);
      } else {
        resetAnimation();
      }
    };

    const resetAnimation = () => {
      time = Math.PI / 2;
      progress = 0;
    };

    return (
      <>
        {/* line */}
        <div
          ref={container}
          className="mb-[30px] col-span-12 row-start-2 h-[1px] w-full relative"
        >
          {/* box for event listeners overlays the svg element */}
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={(e) => {
              manageMouseMove(e);
            }}
            onMouseLeave={manageMouseLeave}
            className="h-[30px] relative -top-[15px] z-10 hover:h-[60px] hover:-top-[30px]"
          />
          <svg className="w-full h-[60px] -top-[30px] absolute">
            <path ref={path} strokeWidth={1} stroke="#147b5d" fill="none" />
          </svg>
        </div>
      </>
    );
  };

  useEffect(() => {
    const title = document.querySelector(".content__title");
    const split = new SplitText(title, { type: "chars" });
    const chars = split.chars;

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        transformOrigin: "50% 100%",
        opacity: 0,
        rotationX: 90,
      },
      {
        ease: "power4",
        opacity: 1,
        stagger: 0.03,
        rotationX: 0,
        scrollTrigger: {
          trigger: title,
          start: "center bottom",
          end: "bottom top+=20%",
          scrub: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    gsap.to(".marquee-track.r h1", {
      scrollTrigger: {
        trigger: ".marquee-track.r h1",
        start: "top bottom",
        end: "400% top",
        scrub: 0.6,
      },
      xPercent: 25,
      duration: 3,
      ease: "linear",
    });
  }, []);

  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const childSplit = new SplitText(".text-heading h1", {
            type: "lines",
            linesClass: "split-child",
          });

          gsap.from(childSplit.lines, {
            duration: 2,
            xPercent: 25,
            autoAlpha: 0,
            ease: "Expo.easeOut",
            stagger: 0.12,
            repeat: -1,
          });

          observer.unobserve(entry.target);
        }
      });
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section id="locations-section" className="relative bg-[#FF9831]">
        <div
          id="locations-heading"
          className="relative block max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-[100rem] lg:px-8 lg:py-32"
        >
          <h1 className="lg:text-6xl font-neue-montreal text-[#032D42]">
            Come see us at any of our{" "}
            <span className="relative inline-block my-8 leading-tight lowercase font-editorial-new underline-offset-8">
              four convenient locations
              {/* <img className="absolute w-full h-auto -ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src="/../../images/ellipse.svg" /> */}
              <DrawEllipse className="absolute w-full h-auto -ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
            </span>{" "}
            or opt for a{" "}
            <span className="relative leading-tight lowercase font-editorial-new decoration-wavy underline-offset-8 decoration-[#147b5d] underline inline-block">
              virtual consultation
            </span>
          </h1>
          {/* arrow */}
          <svg
            className="hidden lg:block absolute bottom-0 translate-y-1/2 left-0 translate-x-64 w-36 h-36 rotate-[120deg] text-[#ff6432]"
            viewBox="0 0 77 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.33755 84.3973C0.297616 62.7119 2.93494 39.8181 19.4192 23.8736C28.2211 15.3599 42.4944 12.5723 47.6281 26.2359C51.1245 35.5419 51.542 51.9945 41.0605 57.0865C29.486 62.7095 40.2945 35.2221 41.9942 32.4952C49.9497 19.7313 59.7772 11.6122 72.2699 3.78281C76.9496 0.849879 73.7108 0.477284 70.0947 1.13476C66.9572 1.7052 63.4035 2.43717 60.5291 3.81975C59.6524 4.24143 65.7349 2.73236 66.6827 2.44768C70.7471 1.22705 75.4874 -0.0219285 75.9527 5.60812C76.0274 6.5127 75.9956 14.9844 74.7481 15.2963C74.099 15.4586 71.0438 10.27 70.4642 9.65288C66.6996 5.64506 63.5835 4.42393 58.2726 5.11792"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="font-neue-montreal text-[#171616]" ref={ref}>
          <motion.div
            id="locations-map"
            className="h-[60vh] overflow-hidden lg:absolute lg:right-0 lg:h-full lg:w-1/2"
            style={{
              opacity: isInView ? 1 : 0,
              filter: isInView ? "blur(0px)" : "blur(16px)",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <iframe
              className="w-full h-full rounded-lg"
              width="100%"
              height="100%"
              src={
                selectedLocation === "All"
                  ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_iframe_url
              }
              title={
                selectedLocation === "All"
                  ? "FreySmiles All Locations [w/ Colors]"
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_map_title
              }
            />
          </motion.div>

          <div
            className="font-neue-montreal text-[#171616]"
            id="locations-details"
          >
            <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:mt-0 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:gap-x-24">
              {/* LOCATIONS LIST */}
              <motion.div
                className="flex flex-col mt-10"
                style={{
                  transform: isInView ? "none" : "translateX(-50px)",
                  opacity: isInView ? 1 : 0,
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
              >
                <button
                  className={`${
                    selectedLocation === "All" ? "text-[#147b5d]" : ""
                  } self-end transition-all duration-300 ease-linear w-max mr-6 mb-6 underline-offset-4 hover:text-[#147b5d]`}
                  onClick={handleShowAllLocations}
                >
                  {selectedLocation === "All"
                    ? "Showing All Locations"
                    : "Show All Locations"}
                </button>

                <dl ref={scope}>
                  {locations.map((l, i) => (
                    <Disclosure
                      as="div"
                      key={l.location}
                      className={`${
                        selectedLocation === l.location ? "text-white" : ""
                      } px-4 py-6 transition-all duration-300 ease-linear cursor-pointer hover:text-white group text-white`}
                    >
                      {(panel) => {
                        const { open, close } = panel;
                        return (
                          <>
                            <BezierCurve />

                            <Disclosure.Button
                              className="grid w-full grid-cols-12 grid-rows-1 text-left sm:px-0"
                              onClick={() => {
                                if (!open) close();
                                toggleDisclosurePanels({ ...panel, key: i });
                                setSelectedLocation(l.location);
                              }}
                            >
                              <dt className="col-span-5 row-start-1">
                                <h6 className="text-xl font-neue-montreal text-[#171616]">
                                  {l.location}
                                </h6>
                              </dt>
                              <dd className="col-span-7 row-start-1">
                                <span className="flex items-center justify-between">
                                  <p className="font-neue-montreal text-[#171616]">
                                    {l.addressLine1}
                                    <br />
                                    {l.addressLine2}
                                  </p>
                                  <ChevronRightIcon className="w-6 h-6 ui-open:rotate-90 ui-open:transform text-[#ff6432]" />
                                </span>
                              </dd>
                            </Disclosure.Button>
                            <Transition
                              show={open}
                              enter="transition-transform ease-out duration-300"
                              enterFrom="transform scale-y-0 opacity-0"
                              enterTo="transform scale-y-100 opacity-100"
                              leave="transition-transform ease-in duration-200"
                              leaveFrom="transform scale-y-100 opacity-100"
                              leaveTo="transform scale-y-0 opacity-0"
                            >
                              <Disclosure.Panel
                                as="div"
                                className="grid grid-cols-12"
                              >
                                <ul className="col-span-7 col-start-6 text-left text-[#147b5d] mt-4 mb-2">
                                  <h6 className="font-medium uppercase">
                                    Office Hours:
                                  </h6>
                                  {l.hours.map((hour, index) => (
                                    <li key={index}>
                                      {Object.keys(hour)[0]}:{" "}
                                      {Object.values(hour)[0]}
                                    </li>
                                  ))}
                                </ul>
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        );
                      }}
                    </Disclosure>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GiftCards() {
  return (
    <section className="z-10 h-[60dvh] relative group overflow-hidden hover:cursor-pointer">
      <div className="absolute inset-0 w-full h-full flex justify-start items-start bg-primary-30 bg-opacity-80 text-white [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(30%_at_0%_0%)] lg:group-hover:[clip-path:circle(35%_at_0%_0%)] group-hover:bg-opacity-100 motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out" />
      <Link
        href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`}
        target="_blank"
        className="text-2xl font-editorial-new absolute inset-0 w-full h-full pl-[12%] pt-[18%] lg:pl-[6%] lg:pt-[8%] lg:group-hover:pl-[8%] lg:group-hover:pt-[12%] group-hover:duration-[1s] text-white"
      >
        Send a Gift Card
      </Link>
      <img
        src="/../../images/giftcards/gift_cards_mockup.jpg"
        alt="gift cards mockup"
        className="absolute inset-0 object-cover object-center w-full h-full -z-10"
      />
    </section>
  );
}
