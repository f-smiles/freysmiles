'use client'
import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
// import LandingTestimonials from "../svg/LandingTestimonials.js";
import { useInView } from "framer-motion";
// import Logo from "../svg/Logo.js";
// import Arc from "../svg/Arc";
import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { gsap } from "gsap-trial";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SplitText from "gsap-trial/SplitText";
// import { useNavigate } from "react-router-dom";
// import { shuffle } from "lodash";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);
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

  //   const signs = document.querySelectorAll(".neon");

  //   const randomIn = (min, max) =>
  //     Math.floor(Math.random() * (max - min + 1) + min);

  //   const mixupInterval = (el) => {
  //     const ms = randomIn(2000, 4000);
  //     el.style.setProperty("--interval", `${ms}ms`);
  //   };

  //   signs.forEach((el) => {
  //     mixupInterval(el);
  //     el.addEventListener("webkitAnimationIteration", () => {
  //       mixupInterval(el);
  //     });
  //   });
  // }, []);

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
      imgSrc: "/images/happypatient.png",
      text: "25k+ Patients",
    },
    {
      imgSrc: "/images/lehighvalley.jpg",
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

  return (
    <main
      className="relative"
      // style={{
      //   background:
      //     "linear-gradient(45deg, rgba(170,212,192,1) 0%, rgba(232,232,230,1) 100%)",
      // }}
    >
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
        <Link href="/book-now" className="inline-flex justify-center items-center">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" className="w-48 h-48">
    <path fill="#C8A2C8">
      <animate attributeName="d" values="
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
          {imageItems && imageItems.map((item, index) => (
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
                  aspectRatio: "9 / 14",
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

  const [scrollY, setScrollY] = useState(0);

  const [startArcAnimation, setStartArcAnimation] = useState(false);
  const invisalignRef = useRef(null);

  const damonRef = useRef(null);
  const advancedTechRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    });

    if (damonRef.current) {
      observer.observe(damonRef.current);
    }

    return () => {
      if (damonRef.current) {
        observer.unobserve(damonRef.current);
      }
    };
  }, [damonRef]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    let tl = gsap.timeline();
    tl.from(invisalignRef.current, {});

    let shrinkTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: damonRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });

    shrinkTimeline.to(invisalignRef.current, {
      scale: 0.5,
      ease: "none",
    });

    let damonTitle = new SplitText(".damon-title", {
      type: "lines, chars",
      linesClass: "line",
      charsClass: "char",
    });
    damonTitle.chars.forEach((char) => {
      gsap.from(char, {
        scrollTrigger: {
          trigger: damonRef.current,
          start: "top center",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
      });
    });

    // ScrollTrigger for pinning sections
    // ScrollTrigger.create({
    //   trigger: invisalignRef.current,
    //   start: "top top",
    //   end: "+=100%",
    //   pin: true,
    //   pinSpacing: false,
    // });

    // [damonRef, advancedTechRef].forEach((ref) => {
    //   ScrollTrigger.create({
    //     trigger: ref.current,
    //     start: "top top",
    //     end: "+=100%",
    //     pin: true,
    //     pinSpacing: false,
    //   });
    // });

    ScrollTrigger.create({
      trigger: damonRef.current,
      start: "top center",
      onEnter: () => setStartArcAnimation(true),
      onLeaveBack: () => setStartArcAnimation(false),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // const sectionHeight = window.innerHeight;

  // const invisalignStyle = {
  //   position: "relative",
  //   zIndex: 1,
  //   top: 0,
  // };

  // const damonStartScroll = sectionHeight * 1.4;
  // const advancedTechStartScroll = damonStartScroll + sectionHeight;

  // const damonStyle = {
  //   position: "relative",
  //   zIndex: 2,
  //   top:
  //     scrollY >= damonStartScroll
  //       ? `${-(scrollY - damonStartScroll)}px`
  //       : `${sectionHeight}px`,
  // };

  // const advancedTechStyle = {
  //   position: "relative",
  //   zIndex: 3,
  //   top:
  //     scrollY >= advancedTechStartScroll
  //       ? `${-(scrollY - advancedTechStartScroll)}px`
  //       : `${sectionHeight}px`,
  // };


  const [backgroundColor, setBackgroundColor] = useState("transparent");
  useEffect(() => {
    setBackgroundColor("rgb(234,222,219)");
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const transitionStart = 40;
      const transitionEnd =
        document.documentElement.scrollHeight - window.innerHeight;

      const colorTransitions = [
        {
          start: transitionStart,
          end: transitionEnd * 0.25,
          colorStart: [234,222,219],
          colorEnd: [227, 217, 225],
        },
        {
          start: transitionEnd * 0.25,
          end: transitionEnd * 0.5,
          colorStart: [227, 217, 225],
          colorEnd: [221, 220, 220],
        },
        {
          start: transitionEnd * 0.5,
          end: transitionEnd * 0.75,
          colorStart: [221, 220, 220],
          colorEnd: [175, 167, 181],
        },
        {
          start: transitionEnd * 0.75,
          end: transitionEnd,
          colorStart: [175, 167, 181],
          colorEnd: [209, 188, 204],
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

          <div className="bg-[rgba(253,_192,_129,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(253,_192,_129,_0.8),_0px_0px_0px_16px_rgba(253,_199,_143,0.6),_0px_0px_0px_24px_rgba(253,_206,_157,_0.4),_0px_0px_0px_32px_rgba(253,_213,_171,_0.2),_0px_0px_0px_40px_rgba(254,_220,_185,_0.1)]">
            <img className="w-16 h-16 p-4" src="/../../logo_icon.png" alt="FreySmiles Orthodontists" />
          </div>
        </header>
          </div>

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
    <span aria-hidden="true" className="circle-wipe-text">Learn More</span>
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

                <div className="playing">
                  <div className="mt-4 flex justify-center">

                  <Link href="/braces">
  <div
    className={`flex items-center justify-center px-6 py-4 transition-colors duration-300 ease-linear border rounded-full border-[#7781d9] hover:bg-gray-800 hover:border-0 hover:text-white ${isVisible ? "ball-animation" : ""}`}
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

        <div ref={advancedTechRef} className="h-[100vh] relative">
          <motion.div
            style={{ scale }}
            className="absolute top-0 right-0 w-full h-full -translate-y-1/2"
          >
            <svg viewBox="0 0 256 256" className="w-full h-full">
              <g>
                <path
                  fill="#a3bba3"
                  d="M10,71.6c0,17.2,4.5,36.1,12.3,52c17,34.7,49.9,58.6,88.4,64.6c8.9,1.4,25.9,1.4,34.5,0c28.3-4.4,53.7-18.4,71.8-39.4c13.2-15.4,22.2-33.4,26.2-52.4c1.7-8,2.8-18.3,2.8-25.2v-4.5H128H10V71.6z"
                />
              </g>
            </svg>
          </motion.div>
          <div className="tech-background flex flex-col items-center justify-center max-w-screen-xl mx-auto lg:flex-row">
            <div className="flex items-center justify-center relative w-1/2 flex-col">
              <figure className="flex items-center justify-center ">
                {/* <img src="../images/circletdot.svg" alt="dot" /> */}
              </figure>
            </div>

            <div className="flex items-center justify-center h-screen relative w-1/3 flex-col">
              <img
                src="../images/dotcircle.png"
                alt="invis"
                className="relative w-96 h-auto"
                style={{
                  zIndex: 1,
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <p className="text-3xl pb-4 absolute" style={{ zIndex: 2 }}>
                Our doctor have been pioneering the most comfortable appliances
                for your treatment since 2005
              </p>
              <Link href="/invisalign">
  <div
    className="inline-block px-6 py-4 transition-colors duration-300 ease-linear border rounded-full border-[#f2ab79] hover:bg-gray-800 hover:border-0 hover:border-secondary50 hover:text-white"
    style={{ zIndex: 1 }}
  >
    Learn More
  </div>
</Link>

            </div>

            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}