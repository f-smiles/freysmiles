"use client";
import Image from 'next/image';
import Lenis from '@studio-freight/lenis'
import React, { useEffect, useState, useRef } from "react";
import { SplitText } from "gsap-trial/all";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const Card = ({ i, title, description, src, url, color, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="uniqueCardContainer">
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="uniqueCard"
      >
        <h2>{title}</h2>
        <div className="uniqueBody">
          <div className="uniqueDescription">
            <p>{description}</p>
            <span>
              <a href={url} target="_blank">
                See more
              </a>
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>

          <div className="uniqueImageContainer">
            <motion.div className="uniqueInner" style={{ scale: imageScale }}>
              <Image fill src={`/images/${src}`} alt="image" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const Layer = ({ colorClass }) => {
  return (
    <div
      className={`absolute top-0 left-0 right-0 h-full w-full ${colorClass}`}
    />
  );
};

export default function OurTeam() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  const [index, setIndex] = useState(1);
  const [switchDoctor, setSwitchDoctor] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const doctorBioRef = useRef(null);

  const toggleSwitchDoctor = () => {
    setSwitchDoctor((prevState) => !prevState);
    setAnimationPlayed(false);
  };

  useEffect(() => {
    const clearAnimation = () => {
      gsap.killTweensOf(doctorBioRef.current);
    };

    const startAnimation = () => {
      setTimeout(() => {
        const doctorBio = doctorBioRef.current;
        if (doctorBio) {
          const splitText = new SplitText(doctorBio, { type: "lines" });
          gsap.from(splitText.lines, {
            duration: 2,
            xPercent: 20,
            autoAlpha: 0,
            ease: "Expo.easeOut",
            stagger: 0.12,
          });
        }
      }, 100);
    };

    if (doctorBioRef.current) {
      clearAnimation();
      startAnimation();
    }
    return () => clearAnimation();
  }, [switchDoctor]);


  useEffect(() => {
    const container = document.querySelector(".horizontalScroller");
    const containerWidth =
      container.scrollWidth - document.documentElement.clientWidth;

    gsap.to(container, {
      x: () => -containerWidth,
      scrollTrigger: {
        markers: false,
        trigger: ".horizontalWrapper",
        start: "top top",
        scrub: 0.5,
        pin: ".horizontalContainer",
        end: () => `+=${containerWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }, []);

  const imagesRef = useRef([]);
  imagesRef.current = [];

  const addToRefs = (el) => {
    if (el && !imagesRef.current.includes(el)) {
      imagesRef.current.push(el);
    }
  };

  useEffect(() => {
    imagesRef.current.forEach((img, index) => {
      gsap.fromTo(
        img,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: img,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
            ease: "power3.out",
          },
        }
      );
    });
  }, []);

  const svgRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    gsap.set('.layer', { clipPath: 'circle(0% at 50% 50%)' });
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('.contentTeam', { opacity: 1, duration: 1 });
      }
    });
    tl.to('.layer', {
      clipPath: 'circle(71% at 50% 50%)',
      duration: 1,
      ease: 'power1.inOut',
    });
    tl.to('.layer', {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 1,
      ease: 'power1.inOut'
    });
  }, []);

  const [svgs, setSvgs] = useState([]);
  const svgWidth = 200;
  useEffect(() => {
    setSvgs((prevSvgs) => {
      const newSvg = {
        id: `svg-${Date.now()}`,
        right: svgWidth * 4,
      };

      const overlapAdjustment = 1;

      const updatedSvgs = prevSvgs
        .map((svg) => ({
          ...svg,
          right: svg.right - svgWidth + overlapAdjustment,
        }))
        .filter((svg) => svg.right >= -svgWidth)
        .concat(newSvg);

      return updatedSvgs;
    });

    const intervalId = setInterval(() => {
      setSvgs((prevSvgs) => {
        const newSvg = {
          id: `svg-${Date.now()}`,
          right: svgWidth * 4,
        };

        const updatedSvgs = prevSvgs
          .map((svg) => ({ ...svg, right: svg.right - svgWidth }))
          .filter((svg) => svg.right >= -svgWidth)
          .concat(newSvg);

        return updatedSvgs;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);


  const projects = [
    {
      title: "Adriana",
      description: "Insurance Coordinator",
      src: "team_members/Adriana-Photoroom.jpg",
      color: "#BBACAF",
    },
    {
      title: "Alyssa",
      description: "Treatment Coordinator",
      src: "team_members/Alyssascan.png",
      color: "#c4aead",
    },
    {
      title: "Elizabeth",
      description: "Patient Services",
      src: "team_members/Elizabethaao.png",
      color: "#998d8f",
    },
    {
      title: "Grace",
      description: "Specialized Orthodontic Assistant",
      src: "team_members/Grace-Photoroom.jpg",
      color: "#e5e4e2",
    },
    {
      title: "Lexi",
      description: "Treatment Coordinator",
      src: "team_members/lexigreen.png",
      color: "#cbc4c5",
    },
    {
      title: "Nicolle",
      description: "Specialized Orthodontic Assistant",
      src: "team_members/nicollewaving.png",
      color: "#c9c0bb",
    },
  ];

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // const items = [
  //   {
  //     title: "5",
  //     num: "Adriana",
  //     imgSrc: "/../../images/team_members/Adriana-Photoroom.jpg",
  //   },
  //   {
  //     title: "7",
  //     num: "Alyssa",
  //     imgSrc: "/../../images/team_members/Alyssascan.png",
  //   },
  //   {
  //     title: "6",
  //     num: "Dana",
  //     imgSrc: "/../../images/team_members/Dana-Photoroom.png",
  //   },

  //   {
  //     title: "2",
  //     num: "Elizabeth",
  //     imgSrc: "/../../images/team_members/Elizabethaao.png",
  //   },

  //   {
  //     title: "4",
  //     num: "Grace",
  //     imgSrc: "/../../images/team_members/Grace-Photoroom.jpg",
  //   },
  //   {
  //     title: "1",
  //     num: "Lexi",
  //     imgSrc: "/../../images/team_members/Lexigreen.png",
  //   },

  //   {
  //     title: "3",
  //     num: "Nicolle",
  //     imgSrc: "/../../images/team_members/Nicollewaving.png",
  //   },
  //   {
  //     title: "9",
  //     num: "x",
  //     imgSrc: "/../../images/team_members/Kayli-Photoroom.png",
  //   },
  // ];

  const [progress, setProgress] = useState(0);
  const carouselRef = useRef();
  const cursorRef = useRef();

  const speedWheel = 0.02;
  const speedDrag = -0.1;
  let startX = 0;
  let isDown = false;

  // const getZindex = (length, active) => {
  //   return Array.from({ length }, (_, i) =>
  //     active === i ? length : length - Math.abs(active - i)
  //   );
  // };

  // const displayItems = (index, active, length) => {
  //   const zIndex = getZindex(length, active)[index];
  //   const activeFactor = (index - active) / length;
  //   return {
  //     "--zIndex": zIndex,
  //     "--active": activeFactor,
  //   };
  // };

  // const animate = () => {
  //   const boundedProgress = Math.max(0, Math.min(progress, 100));
  //   const active = Math.floor(
  //     (boundedProgress / 100) * (carouselRef.current.children.length - 1)
  //   );
  //   Array.from(carouselRef.current.children).forEach((item, index) => {
  //     const styles = displayItems(
  //       index,
  //       active,
  //       carouselRef.current.children.length
  //     );
  //     Object.keys(styles).forEach((key) =>
  //       item.style.setProperty(key, styles[key])
  //     );
  //   });
  // };

  // useEffect(animate, [progress]);

  useEffect(() => {
    const handleWheel = (e) => {
      const wheelProgress = e.deltaY * speedWheel;
      setProgress((progress) => progress + wheelProgress);
    };

    const handleMouseMove = (e) => {
      if (e.type === "mousemove" && cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      if (!isDown) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const mouseProgress = (x - startX) * speedDrag;
      setProgress((progress) => progress + mouseProgress);
      startX = x;
    };

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    document.addEventListener("wheel", handleWheel);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [className, setClassName] = useState("");

  useEffect(() => {
    const updatePosition = (e) => {
      if (carouselRef.current) {
        const rect = carouselRef.current.getBoundingClientRect();
        const isInCarousel =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (isInCarousel) {
          setPosition({ x: e.clientX, y: e.clientY });
          setClassName("");
        } else {
          setClassName("hidden");
        }
      }
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     setPosition({ x: e.clientX, y: e.clientY });
  //   };

  //   const handleMouseDown = () => {
  //     setIsDragging(true);
  //   };

  //   const handleMouseUp = () => {
  //     setIsDragging(false);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mousedown", handleMouseDown);
  //   document.addEventListener("mouseup", handleMouseUp);

  //   return () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mousedown", handleMouseDown);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, []);

  // const cursorStyle = {
  //   position: "fixed",
  //   left: `${position.x}px`,
  //   top: `${position.y}px`,
  //   transform: "translate(-50%, -50%)",
  //   pointerEvents: "none",
  //   zIndex: 99,
  //   willChange: "transform",
  // };

  // const cursorCircleStyle = {
  //   width: isDragging ? "64px" : "128px",
  //   height: isDragging ? "64px" : "128px",
  //   marginTop: "-50%",
  //   marginLeft: "-50%",
  //   borderRadius: "50%",
  //   border: "solid 1px #0058EF",
  //   backgroundColor: "#0058EF",
  //   color: "white",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   fontSize: "20px",
  //   transition:
  //     "width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
  // };

  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isFocused, setIsFocused] = useState(false);
  const isTouchDevice = 'ontouchstart' in window

  useEffect(() => {
    if (!isTouchDevice) {
      const moveCursor = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", moveCursor);
      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    }
  }, []);

  const greenCursorStyle = {
    position: "fixed",
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    width: isFocused ? "100px" : "40px",
    height: isFocused ? "100px" : "40px",
    borderRadius: "50%",
    backgroundColor: isFocused ? "rgb(190,255,3)" : "#FFFFFF",
    pointerEvents: "none",
    opacity: 0.7,
    transform: "translate(-50%, -50%)",
    transition: "width 0.5s, height 0.5s, background-color 0.25s",
    zIndex: 9999,
  };


  
  return (
    <div className="relative w-full min-h-screen wrapper">
      <div
        className="fixed top-0 left-0 z-10 w-full h-full layer gradient-green "
 
        
        style={{ width: "100vw", height: "100vh" }}
        ref={circleRef}
      />
      <div className="min-h-screen bg-[#E2E2E2] contentTeam relative ">
        <section className="py-24 sm:py-32">
          <div className="mx-auto mb-12 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 ">
              <div className="flex flex-col items-start justify-center">
                <div className="font-neue-montreal text-[80px] tracking-tight relative z-10">
                  Meet Our
                </div>
                <div className="font-neue-montreal text-[80px] tracking-tight relative z-10">
                  Doctors
                </div>
              </div>
              <div className="flex items-center">
              <motion.div
            className="h-px bg-gray-700"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{
              duration: 1, 
              ease: "easeInOut",
              delay: 2, 
            }}
          ></motion.div>

   
      <span className="text-[13px] block w-3/5 ml-4">
        Our experience spans over 50 years, a testament to the precision,
        accuracy, and relevance of our vision, demonstrating our ability to
        adapt to the ever-changing nature of our industry.
      </span>
    </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 px-6 mx-auto max-w-7xl lg:px-8">
            <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
              {/* slider controls */}
              <div
                id="controls"
                className="font-helvetica-now-thin flex items-center justify-start row-span-1 row-start-1 space-x-4 "
              >
                <button
                  className=" z-0 p-3 transition-all duration-200 ease-linear border rounded-full border-stone-600 hover:text-white hover:bg-black"
                  onClick={toggleSwitchDoctor}
                >
                  <ArrowLeftIcon className="w-5 h-5 text-stone-600 font-helvetica-now-thin" />
                </button>
                <span className="text-stone-600">
                  0{!switchDoctor ? index : index + 1} / 02
                </span>
                <button
                  className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white border-stone-600 hover:bg-black"
                  onClick={toggleSwitchDoctor}
                >
                  <ArrowRightIcon className="w-5 h-5 text-stone-600 font-helvetica-now-thin" />
                </button>
              </div>
              <div className="row-span-1 row-start-2">
                {/* doctor bio */}
                {switchDoctor ? (
                  <p
                    ref={doctorBioRef}
                    className="font-helvetica-now-thin heading"
                  >
                    Dr. Daniel Frey pursued his pre-dental requisites at the
                    University of Pittsburgh, majoring in Biology. Dr. Frey
                    excelled in his studies and was admitted to Temple
                    University&apos;s dental school, graduating at the top of
                    his class with the prestigious Summa Cum Laude designation.
                    Continuing his education, Dr. Frey was admitted to the
                    esteemed orthodontic residency program at the University of
                    the Pacific in San Francisco where he worked with students
                    and faculty from around the world and utilized cutting-edge
                    orthodontic techniques. During his time in San Francisco, he
                    conducted research in three-dimensional craniofacial
                    analysis and earned his Master of Science degree. Dr. Frey
                    is a member of the American Association of Orthodontists and
                    the American Dental Association. In his leisure time, he
                    enjoys staying active outdoors, camping, playing music, and
                    spending time with loved ones.
                  </p>
                ) : (
                  <p
                    ref={doctorBioRef}
                    className="font-helvetica-now-thin heading"
                  >
                    Dr. Gregg Frey is an orthodontist based in Pennsylvania, who
                    graduated from Temple University School of Dentistry with
                    honors and served in the U.S. Navy Dental Corps before
                    establishing his practice in the Lehigh Valley. He is a
                    Diplomat of the American Board of Orthodontics and has
                    received numerous distinctions, accreditations, and honors,
                    including being named one of America&apos;s Top
                    Orthodontists by the Consumer Review Council of America.
                    This distinction is held by fewer than 25% of orthodontists
                    nationwide. ABO certification represents the culmination of
                    5-10 years of written and oral examinations and independent
                    expert review of actual treated patients. Recently Dr. Frey
                    voluntarily re-certified. Dr. Frey enjoys coaching soccer,
                    vintage car racing, and playing the drums.
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-5 lg:col-span-3 lg:col-start-7">
              <figure className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  style={{
                    position: "absolute",
                    width: "100%",
                    transition: "transform 1s",
                    transform: switchDoctor
                      ? "translateX(100%)"
                      : "translateX(0)",
                  }}
                  src="../../images/team_members/GreggFrey.png"
                  alt="Dr. Gregg Frey"
                />
                <img
                  style={{
                    position: "absolute",
                    width: "100%",
                    transition: "transform 1s",
                    transform: switchDoctor
                      ? "translateX(0)"
                      : "translateX(-100%)",
                  }}
                  src="../../images/team_members/DanFrey.png"
                  alt="Dr. Daniel Frey"
                />
              </figure>
              <figcaption>
                <h5 className="mt-5 font-neue-montreal text-[14px]">
                  {!switchDoctor ? "Dr. Gregg Frey" : "Dr. Dan Frey"}
                </h5>
                <p className="font-neue-montreal text-[14px]">
                  {!switchDoctor ? "DDS" : "DMD, MSD"}
                </p>
              </figcaption>
            </div>
            <div className="col-span-5 lg:col-span-2 lg:col-start-11">
              <figure
                className="relative grayscale w-full aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={toggleSwitchDoctor}
              >
                <img
                  style={{
                    position: "absolute",
                    width: "100%",
                    transition: "transform 1s",
                    transform: switchDoctor
                      ? "translateX(0)"
                      : "translateX(-100%)",
                  }}
                  src="../../images/team_members/GreggFrey.png"
                  alt="Dr. Daniel Frey"
                />
                <img
                  style={{
                    position: "absolute",
                    width: "100%",
                    transition: "transform 1s",
                    transform: switchDoctor
                      ? "translateX(100%)"
                      : "translateX(0)",
                  }}
                  src="../../images/team_members/DanFrey.png"
                  alt="Dr. Gregg Frey"
                />
              </figure>
            </div>
          </div>
        </section>

        <div style={greenCursorStyle}>
          {isFocused && (
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Click
            </span>
          )}
        </div>

        <section className='overflow-x-auto overflow-y-hidden lg:overflow-hidden'>
          <div
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className=" horizontalContainer"
          >
            <div className="horizontalWrapper">
              <div className="horizontalScroller">
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalFilled">
                    <a
                      href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/"
                      className="horizontalItemLink"
                    >
                      <p className="sm:text-left md:text-center">
                        Our members have received the designation of Specialized
                        Orthodontic Assistant. This is a voluntary certification
                        program started by the American Association of
                        Orthodontists to recognize those in the profession for
                        their knowledge and experience.
                      </p>
                    </a>
                  </div>

                  <div className=" horizontalItem horizontalFilled">
                    <p>
                      {" "}
                      Fun fact-our team is made up of former FreySmiles
                      patients, something we think is important, because we have
                      all experienced treatment and can help guide you through
                      it.
                    </p>
                    <img
                      className="absolute bottom-0 w-90 h-90"
                      src="../images/threedots.svg"
                      alt="Green Squiggle"
                    />
                  </div>
                  <a
                    href="https://g.co/kgs/Sds93Ha"
                    className="horizontalItem horizontalBig"
                  >
                    <p>
                      This office is on 🔥! The orthodontists as well as every
                      single staff member.
                    </p>
                    <span className="link-text" data-text="Check it out">
                      Keary Riddick
                    </span>
                  </a>
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <div className="svg-container">
                      {svgs.map((svg) => (
                        <div
                          key={svg.id}
                          className="svg-wrapper"
                          style={{
                            position: "absolute",
                            right: `${svg.right}px`,
                            transition: "right 2s ease-out",
                          }}
                        >
                          <svg
                            width={svgWidth}
                            height={svgWidth}
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100,0 A100,100 0 0,1 100,200 A100,100 0 0,1 100,0 Z"
                              fill="#F3F2ED"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalBig">
                    <p>Trained in CPR and first aid</p>
                  </div>
                  <div className="horizontalItem horizontalFilled ">
                    <a
                      href="https://g.co/kgs/YkknjNg"
                      className="horizontalItemLink"
                    >
                      <p className>
                        Had a wonderful experience at FreySmiles. Everyone is
                        extremely professional, polite, timely. Would highly
                        recommend! -TK
                      </p>
                      <span>
                        {" "}
                        <img
                          className="h-auto w-90 -mt-80 "
                          src="../images/fivestars.svg"
                          alt="Green Squiggle"
                        />
                      </span>
                    </a>
                  </div>

                  <div className="horizontalItem horizontalFilled">
                    <p>Our team members are X-ray certified.</p>
                  </div>

                  <div className="horizontalItem horizontalFilled">
                    <p>
                      We’ve invested in in-office trainings with leading
                      clinical consultants that have helped us develop systems
                      and protocols streamlining our processes
                    </p>
                    <a className="horizontalItemLink">
                      <span className="link-text" data-text="Learn More">
                        Learn More
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={container}
          style={{ position: "relative", marginTop: "50vh" }}
        >
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                {...project}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>

        {/* <div
          ref={carouselRef}
          className="relative z-10 min-h-[150vh]  pointer-events-none"
        >
          <div id="cursor" style={cursorStyle} className={className}>
            <div className="cursor__circle" style={cursorCircleStyle}>
              {!isDragging && (
                <>
                  Drag
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </div>
          </div>
          {items.map((item) => (
            <div key={item.num} className="carousel-item">
              <div className="carousel-box">
                <div className="titleCard">{item.title}</div>
                <div className="nameCard">{item.num}</div>
                <img src={item.imgSrc} alt={item.title} />
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};
