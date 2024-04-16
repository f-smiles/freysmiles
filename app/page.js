"use client";
import Matter from "matter-js";
import Link from "next/link";
import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import LocomotiveScroll from "locomotive-scroll";
// gsap
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
// framer motion
import {
  motion,
  stagger,
  useAnimate,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
// headless ui
import { Disclosure, Transition } from "@headlessui/react";
import ChevronRightIcon from "./_components/ui/ChevronRightIcon";
import MapPin from "./_components/ui/MapPin";
import { SplitText } from "gsap-trial/all";
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

SwiperCore.use([Navigation]);

gsap.registerPlugin(ScrollTrigger);


export default function LandingComponent() {
  // const [backgroundColor, setBackgroundColor] = useState("transparent");
  // useEffect(() => {
  //   setBackgroundColor("rgb(223,190,196)");
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     const transitionStart = 40;
  //     const transitionEnd =
  //       document.documentElement.scrollHeight - window.innerHeight;

  //     const colorTransitions = [
  //       {
  //         start: transitionStart,
  //         end: transitionEnd * 0.25,
  //         colorStart: [223, 190, 196],
  //         colorEnd: [255, 197, 184],
  //       },
  //       {
  //         start: transitionEnd * 0.25,
  //         end: transitionEnd * 0.5,
  //         colorStart: [255, 197, 184],
  //         colorEnd: [216, 191, 215],
  //       },
  //       {
  //         start: transitionEnd * 0.5,
  //         end: transitionEnd * 0.75,
  //         colorStart: [216, 191, 215],
  //         colorEnd: [241, 239, 235],
  //       },
  //       {
  //         start: transitionEnd * 0.75,
  //         end: transitionEnd,
  //         colorStart: [241, 239, 235],
  //         colorEnd: [241, 239, 234],
  //       },
  //     ];

  //     const currentTransition = colorTransitions.find((transition) => {
  //       return (
  //         scrollPosition >= transition.start && scrollPosition < transition.end
  //       );
  //     });

  //     if (currentTransition) {
  //       const progress =
  //         (scrollPosition - currentTransition.start) /
  //         (currentTransition.end - currentTransition.start);
  //       const scrollPercentage = Math.min(1, Math.max(0, progress));

  //       const interpolatedColor = currentTransition.colorStart.map(
  //         (start, i) => {
  //           const end = currentTransition.colorEnd[i];
  //           return Math.round(start + (end - start) * scrollPercentage);
  //         }
  //       );

  //       setBackgroundColor(`rgb(${interpolatedColor.join(",")})`);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const { scrollYProgress } = useScroll();
  gsap.registerPlugin(ScrollTrigger);

  const logoGrid = document.getElementById('logoGrid'); 
  

  let initialScale = 0.8; 
  let maxScale = 1;    
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: logoGrid,               
      start: "top bottom",           
      end: "bottom bottom",        
      scrub: 0.8,

      onLeaveBack: () => gsap.set(logoGrid, { clearProps: "transform" }),
    }
  });
  

  tl.fromTo(logoGrid, 
    { scale: initialScale }, 
    { scale: maxScale, ease: "power1.out" } 
  );
  

  gsap.set(logoGrid, { clearProps: "transform" });
  const locationGallery = document.getElementById('locationGallery'); 
const tlLocationGallery = gsap.timeline({
  scrollTrigger: {
    trigger: locationGallery,
    start: "top bottom",
    end: "bottom bottom",
    scrub: 0.8,
    onLeaveBack: () => gsap.set(locationGallery, { clearProps: "transform" }),
  }
});

tlLocationGallery.fromTo(locationGallery, 
  { scale: 0.8 }, 
  { scale: maxScale, ease: "power1.out" } 
);

gsap.set(locationGallery, { clearProps: "transform" });
  
const locations = document.getElementById('locations'); 
const tlLocations = gsap.timeline({
  scrollTrigger: {
    trigger: locations,
    start: "top bottom",
    end: "bottom bottom",
    scrub: 0.8,
    onLeaveBack: () => gsap.set(locations, { clearProps: "transform" }),
  }
});

tlLocations.fromTo(locations, 
  { scale: 0.8 }, 
{ scale: maxScale, ease: "power1.out" } 
);

gsap.set(locations, { clearProps: "transform" });
  return (
    <>
      <div className="bg-[#E5DDDE] bg-[#E0D175]"
      // style={{ backgroundColor }}
      >
        <LogoHeader />
        <Hero />
        <Mask />
        <GSAPAnimateScrollSections />
        <ImageGrid />

        <div className="sticky top-0 z-2">
        <LocationGallery />
</div>
<div className="sticky bg-[#D8BFD7] top-0 h-screen z-3" id="logoGrid">
    <LogoGrid />
</div>
<div className=" bg-[#F1F1F1]  sticky top-0 z-1" id="locationGallery">
<ParallaxOutline />

</div>

<div className="bg-[#20282D] z-4 relative" id="locations">
    <Locations />
</div>
        <GiftCards />
      </div>
    </>
  );
}

function LogoHeader() {
  return (
    <header className="pt-16 m-auto w-max">
      {/* <div className="bg-[rgba(253,_192,_129,_1)] rounded-full shadow-[0px_0px_0px_8px_rgba(253,_192,_129,_0.8),_0px_0px_0px_16px_rgba(253,_199,_143,0.6),_0px_0px_0px_24px_rgba(253,_206,_157,_0.4),_0px_0px_0px_32px_rgba(253,_213,_171,_0.2),_0px_0px_0px_40px_rgba(254,_220,_185,_0.1)]">
        <img
          className="w-16 h-16 p-4"
          src="/../../logo_icon.png"
          alt="FreySmiles Orthodontists"
        />
      </div> */}
    </header>
  );
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

  const pixiContainerRef = useRef();

  return (
    <section className="mt-6 relative">
      
      <div ref={pixiContainerRef} id="pixi-container"></div>
      <div className="px-8 isolate lg:px-8">
        <div className="relative grid max-w-screen-xl grid-cols-1 mx-auto rounded-lg sm:py-10 place-items-center lg:grid-cols-2">
          <div className="absolute inset-0 flex items-center justify-center">
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
          </div>

          <div className="relative z-10 mx-auto lg:mt-0">
            <div className="flex flex-wrap items-center justify-center">
              <div className="relative">
                <div className="hero">
                  <div className="hero-content " ref={heroContentRef}>
                    <div className=" marquee_features">
                      <div className="marquee__inner first ">
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
          <div className="relative flex items-center justify-center">
            <div
              className={`absolute z-20 inline-block ${
                isScaled ? "scale-up" : "scale-100"
              }`}
              onClick={handleClick}
              style={{ top: "10%", left: "-20%" }}
            >
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 480 480"
                  className="w-48 h-48"
                >
                  <path fill="#C8A2C8">
                    <animate
                      attributeName="d"
                      values="M20,248c0,57.7,21.4,114.4,56.8,154.6C118.6,450,181.8,476,250,476c63,0,122-23.5,163.2-64.8
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
                <span className="uppercase absolute text-2xl font-thin tracking-tight text-white transform -translate-x-1/2 -translate-y-1/2 font-HelveticaNowPro top-1/2 left-1/2">
                  Book
                  <br />
                  Now
                </span>
              </Link>
            </div>

            <img
              className="z-10 max-w-md rounded-full"
              src="../../images/mainsectionimage.jpg"
              alt="girl smiling"
            />
          </div>
        </div>
      </div>
      <div></div>
    </section>
  );
}

function Mask(){

  const headerRef = useRef(null);
  
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
   
      const timer = (duration, interval, from, to, minStep, callback) => {
          let value = from;
          const forward = from < to;
          const range = Math.abs(to - from);
          const steps = duration / interval;
          const step = range / steps;
          let last = from;

          const handle = setInterval(() => {
              value += step * (forward ? 1 : -1);
              if (forward ? value > to : value < to) {
                  value = to;
                  clearInterval(handle);
              }
              if (!minStep || !handle || Math.abs(last - value) >= minStep) {
                  last = value;
                  callback(value, from, to);
              }
          }, interval);
          return handle;
      };


      const loading = () => {
          headerRef.current.classList.add('header--active');
          setTimeout(() => {
              timer(450, 20, 0, 300, 1, (value) => {
                  headerRef.current.style.setProperty('--s', `${Math.floor(value)}px`);
              });
          }, 800);
      };

      loading();


      const updateCoordinates = (e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
      };

      document.addEventListener('mousemove', updateCoordinates);

      return () => {
          document.removeEventListener('mousemove', updateCoordinates);
      };
  }, []);

  useEffect(() => {
      headerRef.current.style.setProperty('--x', `${mousePosition.x}px`);
      headerRef.current.style.setProperty('--y', `${mousePosition.y}px`);
  }, [mousePosition]);


  return(
    <div >
  

    <div className=" maskHeader">
    <div ref={headerRef} >
       <div className="maskHeader__main">
           <div className="maskHeader__content">
               <h1 className="maskHeader__title">
                   We are your go-to provider for advanced and discerning orthodontic care.
               </h1>
           </div>
       </div>
       <div className="maskHeader__hover">
           <div className="maskHeader__content">
               <h1 className="maskHeader__title">
INVISALIGN DAMON BRACES ADVANCED ORTHONDOTIC CARE INVISALIGN DAMON BRACES ADVANCED ORTHONDOTIC CARE 
INVISALIGN DAMON BRACES ADVANCED ORTHONDOTIC CARE 
               </h1>
           </div>
       </div>
   </div>
   </div>
   {/* <div className="bg-[#292929] min-h-screen min-w-full flex justify-center items-center">
        <div className="relative my-[10vh] mx-auto p-0 rounded-[5rem] overflow-hidden w-[90vw] h-[80vh] bg-[#E8E8E4]">
<div style={{ backgroundImage: 'url("../images/bauhauspattern.svg")', objectFit: 'contain', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center' }} className="bg-[#E6E7E9] h-full w-full"></div>


        <div className=" flex flex-wrap w-[80vw] h-[70vh] mx-auto">
  <div className="w-full md:w-1/2">
    <div style={{ backgroundImage: 'url("../images/bauhauspattern.svg")' }} className="bg-[#E6E7E9] rounded-l-full h-full"></div>
  </div>
  <div className="w-full md:w-1/2 relative">
    <div className="bg-[#E6E7E9] h-full"></div>
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center"> 
      <p className="text-center text-xl font-bold">LEARN MORE</p>
    </div>
  </div>
</div>
        </div>
      </div> */}
  

   </div>
  )
}
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
    gsap.registerPlugin(ScrollTrigger);

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


  return (
    <>

      <section className="relative home-main">
   

        <div className="home-main__content">
     
          <div className="home-main__content-sphere">
            <div className="container">
              <ul>
                <li
                  className="font-grandslang "
                  id="first-circle"
                  style={{ opacity: 0, filter: "blur(10px)" }}
                >
                  <figure>
                    <h3>60+</h3>
                    <p className="font-didot mt-10 ">
                      years of experience
                    </p>
                  </figure>
                </li>
                <li
                  className=" font-bold"
                  id="middle-circle"
                  style={{ boxShadow: "inset 0 0 300px #fff" }}
                >
                  <figure
                    id="figure2"
                    style={{ opacity: 0, filter: "blur(10px)" }}
                  >
                    <h3 className="font-grandslang  font-bold">25k</h3>
                    <p className="font-didot  mt-10 tracking-wide">
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
                    <h3 className="font-grandslang  font-bold">4</h3>
                    <p className="mt-10 font-didot tracking-wide">
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
        </div>
        <div className="font-horizon large-text">
      <h2 className="text-[300px]">ABOUT</h2>
    </div>
      </section>

      <style>
        {`
          body {
            overflow: visible;
            overflow-x: hidden;
          }

          .flex {
            display: flex;
          }
          .items-center {
            align-items: center;
          }
          .justify-between {
            justify-content: space-between;
          }

          .inline-flex {
            display: inline-flex;
          }
          .justify-end {
            justify-content: flex-end;
          }

          @media (min-width: 768px) {
            .home-fly {

              height: 100vh;
              left: 0;
              position: fixed;
              top: 0;
              width: 100vw;
            }
            .home-hero {
              overflow: unset;
              position: relative;
              z-index: 1;
            }
            .home-hero__content {
              align-items: center;
              display: flex;
              height: 100vh;
              left: 0;
              position: absolute;
              text-align: center;
              top: 0;
              width: 100%;
            }

            .home-main {
              min-height: 250vh;
              overflow: unset;
              padding-bottom: 100px;
            }
            .home-main__content {
              align-items: center;
              display: flex;
              height: 100vh;
              overflow: unset;
              position: sticky;
              top: 0;
            }

            .container {
              margin: 0 auto;
              width: 100%;
            }

            .home-main__content-sphere {
              align-items: center;
              color: #fff;
              display: flex;
              height: 100%;
              left: 0;
              position: absolute;
              top: 0;
              width: 100%;
            }

            .home-main__content-sphere ul {
              position: relative;
            }
            .home-main__content-sphere ul li:first-child, 
            .home-main__content-sphere ul li:nth-child(3) {
              border: 1px solid #fff;
              filter: blur(10px);
              height: 363px;
              opacity: 0;
              width: 363px;
            }
            .home-main__content-sphere ul li {
              align-items: center;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              left: 50%;
              position: absolute;
              text-align: center;
              top: 50%;
              transform: translate(-50%,-50%);
            }
            .home-main__content-sphere ul li figure h3 {
              font-size: 100px;
              font-weight: 500;
              margin-bottom: 15px;
            }
            .home-main__content-sphere ul li figure p {
              font-size: 30px;
              line-height: 24px;
              max-width: 277px;
            }
            .home-main__content-sphere ul li:nth-child(2) {
              box-shadow: inset 0 0 300px #fff;
              height: 518px;
              transform: translate(-50%,-50%) scale(.0579150579);
              width: 518px;
              z-index: 1;
            }
            .home-main__content-sphere-desc p {
              display: block;
              font-size: 40px;
              line-height: 30px;
              margin: 0 auto 27px;
              max-width: 724px;
            }
          }
        `}
      </style>
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

const HorizontalGrid =() =>{
  return(
    <div className="relative">
<div class="containerH">
 
  <div class="content-wrapper">
  
    <div class="childCon">
      <h1>CSS-only horizontal scroll tentative</h1>
      <p>The idea is to create an horizontal scroll layout and to allow the user to scroll up/down the mouse to scroll left/right.</p>
      <p>So… please scroll <strong>down</strong> with your mouse.</p>
    </div>

    <div class="childCon">
      <h2>The trick</h2>
      <p>Rotate -90deg the container, and 90deg its children blocks.</p>
      <p>You have to fix container and children dimensions. :(</p>
      <p>See CSS for rather correct positioning.</p>
    </div>

    <div class="childCon">
      <h2>Desktop browsers</h2>
      <p>Vertical scroll… scrolls. :)</p>
      <p>But horizontal scroll (e.g. with a trackpad) doesn’t. :(</p>
    </div>

    <div class="childCon">
      <h2>Mobile browsers</h2>
      <p>Only horizontal touchmove works on Chrome. :)</p>
      <p>Only vertical touchmove works on Safari and Firefox.</p>
    </div>


    <div class="childCon">
      <h2>Conclusion</h2>
      <p>Without JavaScript: no good idea.</p>
    </div>

  </div>
  
</div>
</div>
  )
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
    gsap.registerPlugin(SplitText);

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
    <div>

    <div
  
      className="container flex flex-col py-24 mx-auto overflow-hidden lg:flex-row lg:items-start text-white"
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
      <div className="flex flex-wrap justify-center items-center p-0 min-h-screen">
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
            <img src={image.src} className="block w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </div>
    </div>
  );
};
const ParallaxOutline = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const onMouseDown = (e) => {
    setIsDragging(true);
    ref.current.style.cursor = "grabbing";
    ref.current.style.userSelect = "none";
    setPosition({
      x: e.clientX - ref.current.getBoundingClientRect().left,
      y: e.clientY - ref.current.getBoundingClientRect().top,
    });
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const left = e.clientX - position.x;
      const top = e.clientY - position.y;
      ref.current.style.left = `${left}px`;
      ref.current.style.top = `${top}px`;
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    ref.current.style.cursor = "grab";
    ref.current.style.userSelect = "auto";
  };
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
    <div className="flex pt-10 justify-center uppercase tracking tracking-widest">
        Testimonials
      </div>
    <div className="flex flex-col items-center justify-center h-screen ">
  
      <div className="relative flex items-center">
        <div className="absolute right-0 top-0 z-20 flex">
          <button
            onClick={() => scroll("left")}
            className="p-4"
            aria-label="Previous"
          >
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="13" viewBox="0 0 40 13" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.1483 6.84393C-0.0494335 6.65398 -0.0494335 6.34602 0.1483 6.15608L6.40853 0.142458C6.60627 -0.0474861 6.92686 -0.0474861 7.12459 0.142458C7.32233 0.332403 7.32233 0.640364 7.12459 0.830308L1.72872 6.01362L40 6.01362V6.98639L1.72872 6.98638L7.12459 12.1697C7.32233 12.3596 7.32233 12.6676 7.12459 12.8575C6.92686 13.0475 6.60627 13.0475 6.40853 12.8575L0.1483 6.84393Z" fill="white"/>
        </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-4 "
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="13" viewBox="0 0 40 13" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.8517 6.15607C40.0494 6.34602 40.0494 6.65398 39.8517 6.84392L33.5915 12.8575C33.3937 13.0475 33.0731 13.0475 32.8754 12.8575C32.6777 12.6676 32.6777 12.3596 32.8754 12.1697L38.2713 6.98638L5.25728e-07 6.98637L6.10769e-07 6.01361L38.2713 6.01362L32.8754 0.830304C32.6777 0.64036 32.6777 0.332401 32.8754 0.142457C33.0731 -0.0474879 33.3937 -0.0474878 33.5915 0.142457L39.8517 6.15607Z" fill="white"/>
        </svg>
          </button>
        </div>
        <div className="relative flex items-center justify-center">
          <div
            ref={carouselRef}
            className="flex overflow-hidden scroll-smooth snap-x snap-mandatory"
            style={{ width: "60vw", height: "auto" }}
          >
            <div
              className="snap-start shrink-0 w-full h-48 flex items-center justify-center "
              style={{
                height: "500px",
                backgroundImage:
                  "linear-gradient(to right, #bccdcd,#c2d6d6, #92B9AB)",
              }}
            >
              <div className="flex flex-col justify-center items-center mx-[7vw] ">
                <p className="font-helvetica-now-thin text-[24px] text-center">
                  You will receive top notch orthodontic care at Frey Smiles.
                  Dr. Frey and his entire staff make every visit a pleasure. It
                  is apparent at each appointment that Dr. Frey truly cares
                  about his patients. He has treated both of our kids and my
                  husband, and they all have beautiful smiles! I highly
                  recommend!
                </p>
                <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">Lisa Moyer</p>
              </div>
            </div>
            <div
              className="snap-start shrink-0 w-full h-48 flex items-center justify-center "
              style={{
                height: "500px",
                backgroundImage:
                  "linear-gradient(to right, #92B9AB, #94ACB1,#98A6B0",
              }}
            >
              <div className=" flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] ">
                <p className="font-helvetica-now-thin text-[24px] text-center">
                  My experience at FreySmiles has been amazing! I recently just
                  completed my Invisalign and my teeth look perfect! Dr. Frey
                  truly cares about his patients and the staff are always
                  friendly, as well as always accommodating to my schedule.
                  They're the best around!
                </p>
                <p className="font-helvetica-now-thin text-[20px] mt-10  text-center">Kailee</p>
              </div>
            </div>
            <div
              className="snap-start shrink-0 w-full h-48 flex items-center justify-center "
              style={{
                height: "500px",
                backgroundImage:
                  "linear-gradient(to right, #98A6B0,#A6A19C, #C59573)",
              }}
            >
              <div className="flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] ">
                <p className="text-2xl text-center">
                  <h1 className="font-helvetica-now-thin font-normal text-[24px] relative overflow-hidden">
                    I had an open bite and misaligned teeth most of my life. Dr
                    Frey fixed it and in record time. 1 1/2 yrs with
                    Invisalign’s. Highly recommended! Friendly staff and easy to
                    make appointments!
                
         
                  </h1>
                </p>
                <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">Karen Oneill</p>
              </div>
            </div>
            <div
              className="snap-start shrink-0 w-full h-48 flex items-center justify-center "
              style={{
                height: "500px",
                backgroundImage: "linear-gradient(to right, #C59573,#D7844F)",
              }}
            >
              <div className="flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] ">
                <h1 className="font-helvetica-now-thin text-[24px] text-center">
                  Dr. Frey was my orthodontist when I was 11 years old, Im now
                  42. I still talk about how amazing he was and the great work
                  he did with my teeth. Thank you so much for giving the most
                  beautiful smile!
                </h1>
                <p className="font-helvetica-now-thin text-[20px] mt-10 text-center">Tanya Burnhauser</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <span className="absolute text-white font-serif text-[10vw] custom-text" data-text="Happy Patients">
 Happy Patients
    </span>
    <div className="w-full overflow-hidden custom-marquee">
    <div className="flex w-max animate-marquee" style={{ '--offset': '20vw' }}>
  {[...Array(4)].map((_, i) => (
  <div key={i} className="flex">
  <div className="flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] bg-gray-300">
    <p className="text-center">You will receive top notch orthodontic care at Frey Smiles. Dr. Frey and his entire staff make every visit a pleasure. It is apparent at each appointment that Dr. Frey truly cares about his patients. He has treated both of our kids and my husband, and they all have beautiful smiles! I highly recommend!</p>
    <p className="text-center">Lisa Moyer</p>
  </div>
  <div className="flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] bg-gray-300">
    <p className="text-center">My experience at FreySmiles has been amazing! I recently just completed my Invisalign and my teeth look perfect! Dr. Frey truly cares about his patients and the staff are always friendly, as well as always accommodating to my schedule. They're the best around!</p>
    <p className="text-center">Kailee</p>
  </div>
  <div className="flex flex-col justify-center items-center w-[40vw] h-[28vw] mx-[7vw] bg-gray-300">
    <p className="text-center">Text Block 1</p>
    <p className="text-center">Text Block 2</p>
  </div>
</div>

  ))}
</div>

    </div> */}
    </div>
    </div>
  );
};

const LogoGrid = () => {
  const logos = [
    [
      "../../images/movingbannerfiles/diamondplus.svg",
      "../../images/movingbannerfiles/readers.png",
      "../../images/movingbannerfiles/damonsystem.svg",
    ],
    [
      "../../images/movingbannerfiles/topDentist_logo.png",
      "../../images/movingbannerfiles/invisalign_invert.png",
      "../../images/movingbannerfiles/ajodo.svg",
      "../../images/movingbannerfiles/ABO_invert.png",
    ],
    [
      "../../images/movingbannerfiles/valley.png",
      "../../images/movingbannerfiles/top-Dentist.png",
      "../../images/movingbannerfiles/aao_invert.png",
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
    const createSphere = () => {
      let majorPlatformVersion;
      const canvasSphereWrapp = document.querySelector("#ballcanvas");

      if (navigator.userAgentData) {
        if (navigator.userAgentData.platform === "Windows") {
          let ua = navigator.userAgentData.getHighEntropyValues([
            "platformVersion",
          ]);
          majorPlatformVersion = parseInt(ua.platformVersion.split(".")[0]);
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
    <div className="bg-[#DDDCDC] h-screen flex justify-center items-center">
      <div className="grid grid-cols-2 p-4">
        <div class="horizontal-item">
          <div className="z-10" id="ballcanvas"></div>
        </div>

        <div className="flex items-center justify-center flex-col">
          <div className="font-poppins font-bold text-8xl uppercase">
            Awards & Recognition
          </div>
          <div class="mt-10 flex items-center">
            <div class="w-48 h-px bg-gray-700"></div>
            <div class="text-[15px] pl-4">
              Our greatest award is the success of our patients
            </div>
          </div>
        </div>

        <div className="h-80 flex">
          <div
            className="bg-[#20282D] w-full"
            style={{ position: "absolute", bottom: 0 }}
          >
            <h1 className=" animate-locationsCardMarquee tracking-wide text-white text-3xl font-neue-montreal font-bold  uppercase">
              &bull; COME SEE US AT ANY OF OUR FOUR LOCATIONS &bull; COME SEE US
              AT ANY OF OUR FOUR LOCATIONS &bull;
            </h1>
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            {logos.map((columnLogos, columnIndex) => (
              <div key={columnIndex} className="flex flex-col items-center">
                {columnLogos.map((logo, logoIndex) => (
                  <div key={logoIndex} className="p-2">
                    <img
                      src={logo}
                      alt={`Logo ${logoIndex + 1}`}
                      className="h-14 w-auto"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

function LocationGallery() {


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let revealContainers = document.querySelectorAll(".reveal");
    revealContainers.forEach((container) => {
      let image = container.querySelector("img");
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          toggleActions: "restart none none reset",
        },
      });

      tl.set(container, { autoAlpha: 1 })
        .from(container, { xPercent: -100, duration: 1.5, ease: "power2.out" })
        .from(image, {
          xPercent: 100,
          scale: 1.3,
          duration: 1.5,
          ease: "power2.out",
          delay: -1.5,
        });
    });
  }, []);
  
  return (

    <div className="bg-[#161818]">
      <section className="sliderMainPage-projects">
  <div className="sliderMainPage-container w-dyn-list">
  <div role="list" className="sliderMainPage-wrapper mainProjects w-dyn-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '20px' }}>
      {/* First Project Item (Odd) */}
      <div role="listitem" className="sliderMainPage-item sliderMainPage-projectItem" style={{ gridColumn: '1 / 3', gridRow: '1', marginTop: '100px' }}>
        <div className="sliderMainPage-labelGroup">
          <div className="sliderMainPage-textSmall sliderMainPage-label text-white">01 — 01</div>
        </div>
        <div className="sliderMainPage-imageContainer">
        <video
  autoPlay
  loop
  muted
  style={{
    width: '100%',
    height: '200px',
    objectFit: 'cover' 
  }}
  className="sliderMainPage-images sliderMainPage-projectImage">
  <source
    src="../images/invisalignglowup.mp4"
    type="video/mp4"
  />
  Your browser does not support the video tag.
</video>

        </div>
        <div className="sliderMainPage-descr">
          <div className="sliderMainPage-text">2023</div>
          <div className="sliderMainPage-info">
            <div className="sliderMainPage-text">Real estate — Chyrnaya Rechka, 41</div>

          </div>
        </div>
      </div>
      
      {/* Second Project Item (Even) */}
      <div role="listitem" className="sliderMainPage-item sliderMainPage-projectItem" style={{ gridColumn: '5 / -1', gridRow: '1', marginLeft: '1.3vw' }}>
        <div className="sliderMainPage-labelGroup">
          <div className="sliderMainPage-textSmall sliderMainPage-label text-white">02 — 02</div>
        </div>
        <div className="sliderMainPage-imageContainer">
          <img 
            src="../images/sch.png" 
            loading="lazy" 
            alt="Brand identity concept, Vladivostok" 
            className="sliderMainPage-images sliderMainPage-projectImage" 
            style={{ width: '100%', height: '450px', objectFit: 'cover' }}
          />
        </div>
        <div className="sliderMainPage-descr">
          <div className="sliderMainPage-text text-white">est. 2023</div>
          <div className="sliderMainPage-info">
            <div className="sliderMainPage-text text-white">Schnecksville</div>

          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-start items-center mt-4 space-x-4">
      <button id="next" className="sliderMainPage-buttonRight">
        {/* SVG Right Arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="13" viewBox="0 0 40 13" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.1483 6.84393C-0.0494335 6.65398 -0.0494335 6.34602 0.1483 6.15608L6.40853 0.142458C6.60627 -0.0474861 6.92686 -0.0474861 7.12459 0.142458C7.32233 0.332403 7.32233 0.640364 7.12459 0.830308L1.72872 6.01362L40 6.01362V6.98639L1.72872 6.98638L7.12459 12.1697C7.32233 12.3596 7.32233 12.6676 7.12459 12.8575C6.92686 13.0475 6.60627 13.0475 6.40853 12.8575L0.1483 6.84393Z" fill="white"/>
        </svg>
      </button>
      <button id="prev" className="sliderMainPage-buttonLeft">
        {/* SVG Left Arrow */}
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="13" viewBox="0 0 40 13" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M39.8517 6.15607C40.0494 6.34602 40.0494 6.65398 39.8517 6.84392L33.5915 12.8575C33.3937 13.0475 33.0731 13.0475 32.8754 12.8575C32.6777 12.6676 32.6777 12.3596 32.8754 12.1697L38.2713 6.98638L5.25728e-07 6.98637L6.10769e-07 6.01361L38.2713 6.01362L32.8754 0.830304C32.6777 0.64036 32.6777 0.332401 32.8754 0.142457C33.0731 -0.0474879 33.3937 -0.0474878 33.5915 0.142457L39.8517 6.15607Z" fill="white"/>
        </svg>
      </button>
    </div>
  </div>
</section>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          position: "relative",
          // background: "#20282D",
          // background: '#b6916d'
        }}
      >
        <div
          className="reveal"
          style={{
            visibility: "hidden",
            position: "relative",
            width: "80%",
            height: "80%",
            maxWidth: "500px",
            overflow: "hidden",
          }}
        >
          <img
            src="../images/sch.png"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              transformOrigin: "left",
            }}
            alt="Description"
          />
        </div>
       
      </div>
    </div>
  );
}

// function Invisalign() {
//   const sectionRef = useRef();
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["end end", "center center"],
//   });
//   const springScroll = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001,
//   });
//   const scale = useTransform(springScroll, [0, 1], [1.2, 0.9]);
//   const transformText = useTransform(springScroll, [0, 1], ["0%", "150%"]);
//   const transformCase = useTransform(springScroll, [0, 1], ["150%", "0%"]);
//   const transformRetainer = useTransform(
//     springScroll,
//     [0, 1],
//     ["-150%", "-100%"]
//   );

//   return (
//     <section
//       ref={sectionRef}
//       className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start"
//     >
//       <motion.div
//         style={{ translateY: transformText }}
//         className="py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max lg:w-1/2 md:py-0"
//       >
//         <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
//           Invisalign
//         </h1>
//         <h4>Top 1% Invisalign providers</h4>
//         {/* <h4>As part of the top 1% of Invisalign providers in the US, we have the experience to deliver the smile you deserve.</h4> */}
//         <Link
//           href="/invisalign"
//           className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group"
//         >
//           <span>Learn More</span>
//           <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
//             <span>Learn More</span>
//           </div>
//         </Link>
//       </motion.div>
//       <div className="lg:w-1/2">
//         <motion.img
//           style={{ translateY: transformCase }}
//           className="object-cover w-full h-auto mx-auto object-start"
//           src="/../../../images/invisalign_case_transparent.png"
//           alt="invisalign case"
//         />
//         <motion.img
//           style={{ translateY: transformRetainer, scale }}
//           className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36"
//           src="/../../../images/invisalign_bottom.png"
//           alt="invisalign bottom"
//         />
//       </div>
//     </section>
//   );
// }

// function DamonBraces() {
//   return (
//     <section className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-center">
//       <div className="h-auto lg:w-1/2">
//         {/* <img className="object-cover object-center w-full h-full mx-auto"  src="/../../../images/faster_treatment_time.gif" alt="faster treatment time" /> */}
//       </div>
//       <div className="py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max lg:w-1/2 md:py-0">
//         <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
//           Damon Bracket
//         </h1>
//         <h4>Less appointments. Faster treatment time</h4>
//         <Link
//           href="/braces"
//           className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group"
//         >
//           <span>Explore</span>
//           <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
//             <span>Explore</span>
//           </div>
//         </Link>
//       </div>
//     </section>
//   );
// }

// function AdvancedTech() {
//   const { scrollYProgress } = useScroll();
//   const scale = useTransform(scrollYProgress, [0, 1], ["500%", "-100%"]);

//   return (
//     <section className="relative flex flex-col py-24 mx-auto overflow-hidden lg:justify-center lg:flex-row lg:items-center h-[100dvh]">
//       <div className="relative max-w-2xl py-12 pl-6 ml-12 space-y-6 border-l-4 border-pink-500 h-max md:py-0">
//         <h1 className="text-transparent uppercase font-helvetica-now-thin bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
//           Advanced Technology
//         </h1>
//         <h4>
//           Our doctors have been pioneering the most comfortable appliances for
//           your treatment since 2005
//         </h4>
//         <Link
//           href="/invisalign"
//           className="relative inline-flex px-8 py-4 border-2 rounded-full border-zinc-700 group"
//         >
//           <span>Learn More</span>
//           <div className="absolute inset-0 px-8 py-4 bg-primary-30 text-white [clip-path:circle(20%_at_50%_150%)] group-hover:[clip-path:circle(170%_at_50%_150%)] motion-safe:transition-[clip-path] motion-safe:duration-700 ease-in-out rounded-full">
//             <span>Learn More</span>
//           </div>
//         </Link>
//         <motion.img
//           className="absolute bottom-0 right-0 z-0 w-full h-auto translate-x-1/2 translate-y-1/2"
//           src="/../../images/lime_worm.svg"
//           alt=""
//         />
//       </div>
//       <motion.div
//         style={{ scale }}
//         className="absolute inset-0 top-0 left-0 w-full h-full -z-10"
//       >
//         <svg viewBox="0 0 256 256" className="w-full h-full">
//           <g>
//             <path
//               fill="#a3bba3"
//               d="M10,71.6c0,17.2,4.5,36.1,12.3,52c17,34.7,49.9,58.6,88.4,64.6c8.9,1.4,25.9,1.4,34.5,0c28.3-4.4,53.7-18.4,71.8-39.4c13.2-15.4,22.2-33.4,26.2-52.4c1.7-8,2.8-18.3,2.8-25.2v-4.5H128H10V71.6z"
//             />
//           </g>
//         </svg>
//       </motion.div>
//     </section>
//   );
// }

function Locations() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    animate(
      "div",
      isInView
        ? { opacity: 1, transform: "translateX(0px)", scale: 1 } // filter: "blur(0px)"
        : { opacity: 0, transform: "translateX(-50px)", scale: 0.3 }, // filter: "blur(20px)"
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    );
  }, [isInView]);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

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
    gsap.registerPlugin(SplitText);

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
            repeat: -1
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
      <div className="h-screen">
      <div className="flex flex-col   w-[50vw] h-[15vw] mx-[7vw] "  ref={targetRef}>
          <p className="text-2xl ">
            <div className=" w-[900px]">
              <h1 className="font-sans font-normal text-[40px] uppercase relative overflow-hidden">
             Come see us at any of our four convenient locations or opt for a virtual consultation


              </h1>
            </div>
          </p>

        </div>
        <div></div>

        {/* <img className="w-20 " src="../images/mappin.png" alt="Map Pin"></img>  */}
        <section
          ref={ref}
          id="locations"
          className="flex flex-col justify-center w-full mx-auto  lg:flex-row max-w-7xl"
        >
          {/* LEFT */}
          <div className="z-10 lg:w-1/2 lg:py-0">
            <motion.div
              className="p-6 "
              style={{
                transform: isInView ? "none" : "translateY(-50px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
              }}
            >
              <span className="flex items-baseline ">
                {/* <MapPin className="ml-2 transition-all duration-300 hover:animate-bounce hover:cursor-pointer" /> */}
              </span>

              {/* <Link
              href="/book-now"
              className="inline-block px-6 py-4 text-white transition duration-300 ease-linear rounded-full underline-offset-8 bg-primary-50 hover:bg-secondary-50 group"
            >
              Schedule an evaluation today
              <span className="block h-[1px] transition-all duration-300 ease-linear bg-white rounded-full max-w-0 group-hover:max-w-full"></span>
            </Link> */}
            </motion.div>

            {/* LOCATIONS LIST */}
            <motion.div
              className="flex flex-col space-y-4"
              style={{
                transform: isInView ? "none" : "translateX(-50px)",
                opacity: isInView ? 1 : 0,
                transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
              }}
            >
              <button
                className={`${
                  selectedLocation === "All" ? "text-white " : ""
                } self-end transition-all duration-300 ease-linear w-max  hover:text-secondary-50 mr-6`}
                onClick={() => setSelectedLocation("All")}
              >
                {selectedLocation === "All"
                  ? "Showing All Locations"
                  : "Show All Locations"}
              </button>

              <dl ref={scope} className=" divide-y ">
                {locations.map((l, i) => (
                  <Disclosure
                    as="div"
                    key={l.location}
                    className={`${
                      selectedLocation === l.location ? "text-primary-95" : ""
                    } px-4 py-6 transition-all duration-300 ease-linear cursor-pointer  hover:text-white group text-white`}
                  >
                    {(panel) => {
                      const { open, close } = panel;
                      return (
                        <>
                          <Disclosure.Button
                            className="grid w-full grid-cols-12 text-left sm:px-0"
                            onClick={() => {
                              if (!open) close();
                              toggleDisclosurePanels({ ...panel, key: i });
                              setSelectedLocation(l.location);
                            }}
                          >
                            <dt className="col-span-5 ">
                              <h6 className="text-xl">{l.location}</h6>
                            </dt>
                            <dd className="col-span-7">
                              <span className="flex items-center justify-between">
                                <p>
                                  {l.addressLine1}
                                  <br />
                                  {l.addressLine2}
                                </p>
                                <ChevronRightIcon className="w-4 h-4 ui-open:rotate-90 ui-open:transform" />
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
                              className="grid grid-cols-12 mt-6"
                            >
                              <ul className="col-span-7 col-start-6 text-left">
                                <h6 className="mb-2 font-medium uppercase">
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

          {/* RIGHT */}
          <motion.div
            className="h-screen min-h-max lg:w-1/2 lg:h-auto"
            style={{
              opacity: isInView ? 1 : 0,
              filter: isInView ? "blur(0px)" : "blur(16px)",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <iframe
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
              style={{ border: "none", borderRadius: "3rem" }}
            />
          </motion.div>
        </section>
      </div>
    </>
  );
}

function GiftCards() {
  const ref = useRef();
  const isInView = useInView(ref);

  return (
    <section
      ref={ref}
      className="z-10 h-[60dvh] relative my-24 group overflow-hidden hover:cursor-pointer"
      style={{
        transform: isInView ? "none" : "translateY(100px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
    >
      <div className="absolute inset-0 w-full h-full flex justify-start items-start bg-primary-30 bg-opacity-80 text-white [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(30%_at_0%_0%)] lg:group-hover:[clip-path:circle(35%_at_0%_0%)] group-hover:bg-opacity-100 motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out" />
      <Link
        href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`}
        target="_blank"
        className="text-2xl absolute inset-0 w-full h-full pl-[12%] pt-[18%] lg:pl-[6%] lg:pt-[8%] lg:group-hover:pl-[8%] lg:group-hover:pt-[12%] group-hover:duration-[1s] text-white"
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
