"use client";
import { Item } from "../../utils/Item";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import React, { useEffect, useState, useRef } from "react";
import { SplitText } from "gsap-trial/all";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

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



  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
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

  // const [progress, setProgress] = useState(0);
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

  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isFocused, setIsFocused] = useState(false);
  const isTouchDevice = "ontouchstart" in window;

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
    width: isFocused ? "100px" : "10px",
    height: isFocused ? "100px" : "10px",
    borderRadius: "50%",
    backgroundColor: isFocused ? "rgb(210,246,90)" : "#FFFFFF",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    transition: "width 0.5s, height 0.5s, background-color 0.25s",
    zIndex: 9999,
    fontFamily: "NeueMontrealBook",
  };

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");

    lines.forEach((line) => {
      gsap.fromTo(
        line.querySelectorAll(".stagger-letter"),
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "-10%",
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  const textLines = [{ text: "Meet Our Team" }];

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");

    lines.forEach((line) => {
      const letters = line.querySelectorAll(".stagger-letter");

      gsap.fromTo(
        letters,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  const lines = [
    "Our experience spans over 50 years-a testament to the precision,",
    "accuracy, and relevance of our vision, demonstrating our ability to adapt",
    "to the ever-changing nature of our industry.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);


  const imageRefs = useRef([]);
  useEffect(() => {
    if (imageRefs.current[currentIndex]) {
      gsap.fromTo(
        imageRefs.current[currentIndex],
        {
          y: "100%",  
          scale: 1.6,

        },
        {
          y: "0%",     
          scale: 1,     
          opacity: 1,  
          duration: 1,  
          ease: "power3.out"
        }
      );
    }
  }, [currentIndex]);
  
  


  const teamMembers = [
   {
    id: 1,
    name: "Alyssa",
    src: "../images/team_members/Alyssascan.png",
    alt: "Image 1",
    description: "Treatment Coordinator",
  },
  {
    id: 2,
    name: "Nicolle",
    src: "../images/team_members/Nicollewaving.png",
    alt: "Image 2",
    description: "Specialized Orthodontic Assistant",
  },
  {
    id: 3,
    name: "Lexi",
    src: "../images/team_members/Lexiworking.png",
    alt: "Image 3",
    description: "Treatment Coordinator",
  },
  {
    id: 4,
    name: "Elizabeth",
    src: "../images/team_members/Elizabethaao.png",
    alt: "Image 4",
    description: "Patient Services",
  },
  {
    id: 5,
    name: "Adriana",
    src: "../images/team_members/Adriana-Photoroom.jpg",
    alt: "Image 5",
    description: "Insurance Coordinator",
  },
  ];
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMember = teamMembers[selectedIndex];
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
        const title = titleRef.current;
        
        const splitTitle = new SplitText(title, {
            type: "chars",
            charsClass: "char",
        });

        splitTitle.chars.forEach((char) => {
            const wrapEl = document.createElement("span");
            wrapEl.classList.add("char-wrap");

            if (char.textContent === " ") {
                char.innerHTML = "&nbsp;"; 
            }

            char.parentNode.insertBefore(wrapEl, char);
            wrapEl.appendChild(char);
        });

        gsap.fromTo(
            splitTitle.chars,
            {
                xPercent: 105,
                opacity: 0,
                transformOrigin: "0% 50%",
            },
            {
                xPercent: 0,
                opacity: 1,
                duration: 1,
                ease: "expo.out",
                stagger: 0.042,
                delay: 0.5,
            }
        );
    }
}, []);

  return (
    <div>
      
      <div className="bg-[#f4f0ed] relative ">
      <section className="py-[12em] sm:py-[12em]">
          
          <div className="mx-auto mb-12 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 ">

              <div className="flex flex-col overflow-hidden">
     
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    className="font-neuehaasdisplaylight  text-[14px] overflow-hidden"
                    initial={{
                      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                      y: 20,
                    }}
                    animate={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      y: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              <div >
      <h2 className="content__title1" ref={titleRef}>
        <span style={{lineHeight: "1.2"}}>Our Team</span>
      </h2>
    </div>

            </div>
          </div>
   
          <div className="grid grid-cols-12 gap-8 px-6 py-12 mx-auto max-w-7xl lg:px-8">
            
            <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
              {/* slider controls */}
           
              <div className="row-span-1 row-start-2">
              <motion.div
                  className="h-px mb-10 bg-gray-300"
                  initial={{ width: 0, transformOrigin: "left" }}
                  animate={{ width: "40vw" }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                ></motion.div>
                {/* doctor bio */}
                {switchDoctor ? (
                  <p ref={doctorBioRef} className="font-neuehaasdisplaylight ">
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
                  <p ref={doctorBioRef} className="font-neuehaasdisplaylight">
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
              <div
                id="controls"
                className="font-neuehaasdisplaylight  flex items-center justify-start row-span-1 row-start-1 space-x-4 "
              >
                <button
                  className=" z-0 p-3 transition-all duration-200 ease-linear border rounded-full border-stone-600 hover:text-white hover:bg-black"
                  onClick={toggleSwitchDoctor}
                >
     <svg width="20" height="20" viewBox="0 0 100 267" xmlns="http://www.w3.org/2000/svg"
                stroke="black" fill="none" strokeWidth="10" transform="rotate(-90)">
                <path d="M49.894 2.766v262.979" strokeLinecap="square"></path>
                <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
              </svg>
                </button>
                <span className="text-[12px] t">
                  0{!switchDoctor ? index : index + 1} / 02
                </span>
                <button
                  className="z-0 p-3 transition-all duration-200 ease-linear border rounded-full hover:text-white border-stone-600 hover:bg-black"
                  onClick={toggleSwitchDoctor}
                >
  <svg width="20" height="20" viewBox="0 0 100 267" xmlns="http://www.w3.org/2000/svg"
                stroke="black" fill="none" strokeWidth="10" transform="rotate(90)">
                <path d="M49.894 2.766v262.979" strokeLinecap="square"></path>
                <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
              </svg>
                </button>
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
              View
            </span>
          )}
        </div>

        <section className="overflow-x-auto overflow-y-hidden lg:overflow-hidden">
          <div
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className=" horizontalContainer"
          >
            <div className="horizontalWrapper">
              <div className="horizontalScroller">
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalFilled">
                    <a href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/">
                      <p>
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
                      Fun fact-our team is made up of former FreySmiles
                      patients, something we think is important, because we have
                      all experienced treatment and can help guide you through
                      it.
                    </p>

                    {/* <img
                      className="absolute bottom-0 w-90 h-90"
                      src="../images/threedots.svg"
                      alt="Green Squiggle"
                    /> */}
                  </div>
                  <a
                    href="https://g.co/kgs/Sds93Ha"
                    className="horizontalItem horizontalBig"
                  >
                    <p>
                      This office is on 🔥! The orthodontists as well as every
                      single staff member.
                    </p>
                  </a>
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {/* <div className="svg-container">
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
                    </div> */}
                  </div>
                </div>
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalBig">
                    <p>Trained in CPR and first aid</p>
                  </div>
                  <div className="horizontalItem horizontalFilled ">
                    <a
                      href="https://g.co/kgs/YkknjNg"
                      // className="horizontalItemLink"
                    >
                      <p className>
                        Had a wonderful experience at FreySmiles. Everyone is
                        extremely professional, polite, timely. Would highly
                        recommend! -TK
                      </p>
                     
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
                 
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*   
        <section ref={container} style={{ marginTop: "50vh" }}>
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
        </section> */}

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
      <div>
      </div>
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f4f0ed] px-10 relative">
      <div
  className="absolute top-10 right-10 text-right text-gray-900"
  style={{
    fontSize: "72px",
    fontWeight: "200",
    fontFamily: "NeueMontrealBook",
  }}
>
<div className="w-[60px]">
            <svg
      
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M63.93 30.1793H63.9983V0H31.999V0.0690724C49.052 0.0690724 62.9842 13.3921 63.93 30.1793Z"
        fill="currentColor"
      />
      <path
        d="M63.9315 33.8208C62.9858 50.608 49.0536 63.931 32.0006 63.931V64.0001H63.9999V33.8208H63.9315Z"
        fill="currentColor"
      />
      <path
        d="M31.9309 30.1793H31.9993V0H0V0.0690724C17.053 0.0690724 30.9852 13.3921 31.9309 30.1793Z"
        fill="currentColor"
      />
      <path
        d="M31.9309 33.8208C30.9852 50.608 17.053 63.931 0 63.931V64.0001H31.9993V33.8208H31.9309Z"
        fill="currentColor"
      />
    </svg>
    </div>
</div>

      <div className="flex items-center justify-between w-full max-w-5xl">

        <div className="text-left text-gray-900">
          <h2 className="text-xl font-editorial-new-italic">
            {teamMembers[currentIndex].name}
          </h2>
          <p className="text-md font-neue-montreal">
            {teamMembers[currentIndex].description}
          </p>
        </div>


        <div className="w-[300px] h-[400px] relative overflow-hidden flex-shrink-0">
          {teamMembers.map((member, index) => (
            <img
              key={member.id}
              ref={(el) => (imageRefs.current[index] = el)}
              src={member.src}
              alt={member.alt}
              className="absolute w-full h-full object-cover"
              style={{
                top: 0,
                left: 0,
                zIndex: index === currentIndex ? 2 : 1, 
              }}
            />
          ))}
        </div>



        <div
          style={{
            fontSize: "28px",
            fontWeight: "200",
            fontFamily: "HelveticaNeue-Light",
          }}
          className="text-right"
        >
          We're here to support you
          <br /> <span className="font-saolitalic">every</span> step of the way
        </div>
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
      </div>


      <div className="absolute bottom-5 w-full flex left-10 space-x-4">
  {teamMembers.slice(0, 5).map((member, index) => (
    <div
      key={member.id}
      onClick={() => setCurrentIndex(index)}
      className={`w-20 h-20 border rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
        currentIndex === index ? "border-black" : "border-gray-300 opacity-50"
      }`}
    >
      <img
        src={member.src}
        alt={member.alt}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          currentIndex === index ? "scale-75" : "hover:scale-75"
        }`}
      />
    </div>
  ))}
</div>

    </div>

    </div>
  );
}

      {/* <div className="bg-black h-screen flex items-center justify-center relative">
      <div className="top-10 h-screen relative w-full mx-auto border-l-[1px] border-r-[1px] border-b-[1px] border-white border-opacity-50 rounded-r-2xl rounded-l-2xl rounded-b-2xl overflow-hidden">
<svg
  width="100%"
  height="60" 
  viewBox="0 0 100 40" 
  preserveAspectRatio="none"
  className="absolute top-0 left-0 w-full"
>
<path
  d="M0,0 H45 C47,0 47,30 50,30 C53,30 53,0 55,0 H100"
  fill="none"
  stroke="white"
  strokeWidth=".5"
  strokeLinecap="round"
    vectorEffect="non-scaling-stroke" 
  />
</svg>
  <div className="flex w-full max-w-5xl justify-between px-10">

    <div className="flex items-center justify-start w-[500px] h-[400px] relative gap-x-6">

  <div className="w-[300px] h-[400px] relative overflow-hidden flex-shrink-0">
    {images.map((image, index) => (
      <img
        key={image.id}
        ref={(el) => (imageRefs.current[index] = el)}
        src={image.src}
        alt={image.alt}
        className="absolute w-full h-full object-cover"
        style={{
          top: 0,
          left: 0,
          zIndex: index === currentIndex ? 2 : 1,
        }}
      />
    ))}
  </div>

  
  <div className="text-white flex flex-col justify-center">
    <h2 className="text-xl font-neue-montreal ">{images[currentIndex].name}</h2>
    <p className="text-sm font-neue-montreal text-gray-300">{images[currentIndex].description}</p>
  </div>
</div>



    <div className="flex flex-col items-center text-white text-center gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`relative w-14 h-14 rounded-full overflow-hidden cursor-pointer ${
            index === currentIndex ? "border-2 border-yellow-400" : ""
          }`}
          onClick={() => setCurrentIndex(index)}
        >
          {index === currentIndex && (
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
              <circle
                stroke="#E8F724"
                cx="18"
                cy="18"
                r="18"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="113"
                strokeDashoffset={113 - (progress / 100) * 113}
                strokeLinecap="round"
                transition="stroke-dashoffset 0.1s linear"
              />
            </svg>
          )}
          <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
        </div>
      ))}


      <div className="flex space-x-4 mt-4">
        <button onClick={handlePrev} className="p-2 border rounded-full text-white">
          ◀
        </button>
        <button onClick={handleNext} className="p-2 border rounded-full text-white">
          ▶
        </button>
      </div>


      <div className="text-gray-400 text-sm font-neue-montreal mt-2">
        0{currentIndex + 1} - 0{images.length}
      </div>
    </div>
  </div>


</div>

</div> */}