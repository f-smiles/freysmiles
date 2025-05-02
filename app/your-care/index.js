"use client";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import * as PIXI from "pixi.js";
import { SplitText } from "gsap-trial/all";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap-trial/Physics2DPlugin";
import { gsap, TweenLite, TimelineMax, Sine } from "gsap";
import { MotionPathPlugin } from "gsap-trial/MotionPathPlugin";

gsap.registerPlugin(Physics2DPlugin, SplitText, MotionPathPlugin);

const YourCare = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);

  const handleScroll = (deltaY) => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setTimeout(() => (isAnimating.current = false), 1200);

    setActiveIndex((prev) => {
      const next = deltaY > 0 ? prev + 1 : prev - 1;
      return Math.max(0, Math.min(SECTIONS.length - 1, next));
    });
  };

  useEffect(() => {
    const onWheel = (e) => handleScroll(e.deltaY);
    window.addEventListener("wheel", onWheel);
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  const textRef = useRef();
  const currentSplitRef = useRef();
  const textPrevIndexRef = useRef(activeIndex);
  useLayoutEffect(() => {
    if (!textRef.current) return;

    const nextText = SECTIONS[activeIndex];

    textPrevIndexRef.current = activeIndex;

    if (currentSplitRef.current) {
      gsap.to(currentSplitRef.current.words, {
        opacity: 0,
        duration: 0.01,
      });
      currentSplitRef.current.revert();
    }

    textRef.current.textContent = nextText;

    const split = new SplitText(textRef.current, {
      type: "words",
      wordsClass: "word",
    });

    currentSplitRef.current = split;

    gsap.fromTo(
      split.words,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        stagger: {
          each: 0.03,
          from: "random",
        },
        ease: "power2.out",
      }
    );
  }, [activeIndex]);

  const SECTIONS = [
    "Experience your initial consultation — in person or virtually — at no cost.",
    "This initial visit includes an in-depth orthodontic evaluation, digital radiographs, and professional imaging.",
    "We encourage all decision-makers to attend the initial visit so we can discuss the path ahead with clarity and transparency — ensuring everyone is aligned on expectations, preferences, and the ideal time to begin.",
    "If treatment isn’t yet needed, no cost observation check-ups will be coordinated every 6-12 months until treatment is needed. These are shorter and fun visits where you'll have access to all four of our locations to play video games and get to know our team.",
  ];

  const ellipsesRef = useRef([]);

  useEffect(() => {
    ellipsesRef.current.forEach((el, i) => {
      gsap.to(el, {
        yPercent: i * 60,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-down",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
  }, []);

  const ELLIPSE_COUNT = 7;

  const ballRef = useRef(null);
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const path3Ref = useRef(null);
  const revealRef = useRef(null);
  useEffect(() => {
    if (!ballRef.current || !path1Ref.current) return;

    gsap.set(ballRef.current, {
      motionPath: {
        path: path1Ref.current,
        align: path1Ref.current,
        alignOrigin: [0.5, 0.5],
        start: 0,
      },
    });
  }, []);

  const prevIndexRef = useRef(activeIndex);

  const whiteTextRef = useRef();

  useLayoutEffect(() => {
    if (!ballRef.current) return;

    const prevIndex = prevIndexRef.current;
    prevIndexRef.current = activeIndex;

    if (activeIndex === prevIndex) return;

    let pathRef = null;
    let start = 1;
    let end = 0;

    if (
      (prevIndex === 0 && activeIndex === 1) ||
      (prevIndex === 1 && activeIndex === 0)
    ) {
      pathRef = path1Ref.current;
    } else if (
      (prevIndex === 1 && activeIndex === 2) ||
      (prevIndex === 2 && activeIndex === 1)
    ) {
      pathRef = path2Ref.current;
    } else if (
      (prevIndex === 2 && activeIndex === 3) ||
      (prevIndex === 3 && activeIndex === 2)
    ) {
      pathRef = path3Ref.current;
    }

    if (!pathRef) return;

    if (activeIndex < prevIndex) {
      start = 0;
      end = 1;
    }

    const tl = gsap.timeline();

    if (prevIndex === 3 && activeIndex === 2) {
      tl.set(ballRef.current, { zIndex: 10 });

      tl.to(ballRef.current, {
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      });

      tl.to(
        ".svg-text-wrapper",
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      );

      tl.to(
        ballRef.current,
        {
          duration: 1.2,
          motionPath: {
            path: path3Ref.current,
            align: path3Ref.current,
            alignOrigin: [0.5, 0.5],
            start: 0,
            end: 1,
            autoRotate: true,
          },
          ease: "power2.inOut",
        },
        ">"
      );
    } else {
      tl.to(ballRef.current, {
        duration: 1.2,
        motionPath: {
          path: pathRef,
          align: pathRef,
          alignOrigin: [0.5, 0.5],
          start,
          end,
          autoRotate: true,
        },
        ease: "power2.inOut",
      });
    }

    if (activeIndex === 3) {
      gsap.fromTo(
        ".text-slide:nth-child(4)",
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }
      );

      const prevTrigger = ScrollTrigger.getById("scaleScrollSequence");
      if (prevTrigger) prevTrigger.kill();

      gsap.set(ballRef.current, { scale: 1, zIndex: 999 });
      gsap.set(".svg-text-wrapper", { opacity: 0, x: 0 });
      gsap.set(".sticky-shift", { x: 0 });

      const scrollTL = gsap.timeline({
        scrollTrigger: {
          id: "scaleScrollSequence",
          trigger: ".fake-scroll-wrapper",
          start: "top top",
          end: "+=2500",
          scrub: true,
          pin: true,
          markers: true,
        },
      });

      scrollTL.to(ballRef.current, {
        scale: 125,
        ease: "power2.inOut",
      });

      scrollTL.to(
        ".svg-text-wrapper",
        {
          opacity: 1,
          ease: "power2.out",
        },
        ">"
      );

      scrollTL.to(
        ".svg-text-wrapper",
        {
          x: "-200px",
          ease: "power2.inOut",
        },
        ">"
      );

      scrollTL.fromTo(
        ".sticky-shift",
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 50% 0% 0%)", ease: "power4.inOut" },
        ">"
      );

      scrollTL.fromTo(
        revealRef.current,
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 50%)", ease: "power4.inOut" },
        ">+0.2"
      );
    } else {
      const prevTrigger = ScrollTrigger.getById("scaleScrollSequence");
      if (prevTrigger) {
        prevTrigger.revert();
        prevTrigger.kill();
      }
      gsap.set(".sticky-shift", { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(".svg-text-wrapper", { opacity: 0, x: 0 });
      gsap.set(ballRef.current, { scale: 1 });
    }
  }, [activeIndex]);

  const BUTTONS = [
    "Initial Consultation",
    "Full Evaluation",
    "Plan & Prepare",
    "Treatment Roadmap",
  ];

  const sectionRef = useRef(null);
  const pixelRefs = useRef([]);

  const NUM_ROWS = 4;
  const NUM_COLS = 10;
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    const rowStagger = 0.02,
      overlapDelay = 0.2,
      columnDuration = 2 * rowStagger + overlapDelay;
    const NUM_COLS = pixelRefs.current.length;
    const [skips, fills] = [[], []];

    for (let i = NUM_COLS - 1; i >= 0; i -= 2) skips.push(i);
    for (let i = NUM_COLS - 2; i >= 0; i -= 2) fills.push(i);

    const orderedCols = [];
    while (skips.length || fills.length) {
      if (skips.length) orderedCols.push(skips.shift());
      if (fills.length) orderedCols.push(fills.shift());
    }

    const getOrigin = (colIndex, rowIndex) =>
      colIndex % 2 !== 0
        ? rowIndex % 2 === 0
          ? "left center"
          : "right center"
        : rowIndex % 2 === 0
        ? "right center"
        : "left center";

    const rowOrder = [3, 1],
      finalPair = [0, 2];

    orderedCols.forEach((colIndex, stepIndex) => {
      const column = pixelRefs.current[colIndex];
      const columnStart = stepIndex * columnDuration;

      rowOrder.forEach((rowIdx, i) => {
        if (column[rowIdx])
          tl.to(
            column[rowIdx],
            {
              width: "120%",
              scaleX: 1,
              transformOrigin: getOrigin(colIndex, rowIdx),
              ease: "power2.out",
            },
            columnStart + i * rowStagger
          );
      });

      finalPair.forEach((rowIdx) => {
        if (column[rowIdx])
          tl.to(
            column[rowIdx],
            {
              width: "120%",
              scaleX: 1,
              transformOrigin: getOrigin(colIndex, rowIdx),
              ease: "power2.out",
            },
            columnStart + rowOrder.length * rowStagger + overlapDelay
          );
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const svgRef = useRef();
const pathRef = useRef();
const dotRef = useRef();
useEffect(() => {
  if (!pathRef.current || !dotRef.current) return;

  gsap.set(dotRef.current, {
    motionPath: {
      path: pathRef.current,
      align: pathRef.current,
      alignOrigin: [0.5, 0.5],
      start: 0,
      end: 0,
    },
  });

  gsap.to(dotRef.current, {
    scrollTrigger: {
      trigger: svgRef.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
    motionPath: {
      path: pathRef.current,
      align: pathRef.current,
      autoRotate: false,
      alignOrigin: [0.5, 0.5],
    },
    duration: 1,
    ease: "none",
  });
}, []);
  return (
    <>
      <svg
        ref={svgRef}
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 1484 3804"
  width="1484"
  height="3804"
  preserveAspectRatio="xMidYMid meet"
  style={{
    width: '100%',
    height: '100%',
    transform: 'translate3d(0px, 0px, 0px)',
    contentVisibility: 'visible',
  }} 
      >
        <defs>
          <clipPath id="__lottie_element_2">
            <rect width="1484" height="3804" x="0" y="0"></rect>
          </clipPath>
        </defs>
        <g clip-path="url(#__lottie_element_2)">
          <g
            transform="matrix(1,0,0,1,742,1902)"
            opacity="1"
            style={{display: "block"}}
          >
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path
                  ref={pathRef}
                stroke-linecap="butt"
                stroke-linejoin="miter"
                fill-opacity="0"
                stroke-miterlimit="4"
                stroke="rgb(0,0,19)"
                stroke-opacity="1"
                stroke-width="1"
                d=" M-110,-1890 C-110,-1890 -110,-1780 -110,-1780 C-110,-1780 -630,-1780 -630,-1780 C-685.22900390625,-1780 -730,-1735.22900390625 -730,-1680 C-730,-1680 -730,-1310 -730,-1310 C-730,-1254.77099609375 -685.22900390625,-1210 -630,-1210 C-630,-1210 -10,-1210 -10,-1210 C45.229000091552734,-1210 90,-1165.22900390625 90,-1110 C90,-1110 90,-1050 90,-1050 C90,-1050 630,-1050 630,-1050 C685.22802734375,-1050 730,-1005.22900390625 730,-950 C730,-950 730,240 730,240 C730,295.22900390625 685.22802734375,340 630,340 C630,340 -270,340 -270,340 C-270,340 -270,1000 -270,1000 C-270,1000 390,1000 390,1000 C445.22900390625,1000 490,1044.77099609375 490,1100 C490,1100 490,1630 490,1630 C490,1685.22900390625 445.22900390625,1730 390,1730 C390,1730 -110,1730 -110,1730 C-110,1730 -110,1890 -110,1890"
              ></path>
            </g>
          </g>
          <g
            transform="matrix(1,0,0,1,132.8538055419922,692)"
            opacity="1"
            style={{display: "block"}}
          >
            <g opacity="1" transform="matrix(1,0,0,1,0,0)">
              <path
                ref={dotRef}
                fill="rgb(0,0,254)"
                fill-opacity="1"
                d=" M0,-12 C6.622799873352051,-12 12,-6.622799873352051 12,0 C12,6.622799873352051 6.622799873352051,12 0,12 C-6.622799873352051,12 -12,6.622799873352051 -12,0 C-12,-6.622799873352051 -6.622799873352051,-12 0,-12z"
              ></path>
            </g>
          </g>
        </g>
      </svg>
      <div
        className="h-screen w-full font-neuehaas35"
        style={{ background: "#EFEFEF" }}
      >
        <div className="bg-[#EFEFEF] fake-scroll-wrapper h-[100vh]">
          <div
            ref={revealRef}
            className="z-[60] absolute inset-[10px] bg-[#FF4411] origin-right"
            style={{ clipPath: "inset(0% 0% 0% 100%)" }}
          ></div>
          <div
            className="sticky-shift sticky top-0 h-screen w-full"
            style={{ padding: "10px" }}
          >
            <div className="relative overflow-hidden h-full w-full bg-[#EFEFEF] ">
              <div
                ref={ballRef}
                className="absolute top-1/2 left-1/2 w-[16px] h-[16px] bg-[#1127FF] rounded-full pointer-events-none z-[10]"
                style={{ transform: "translate(-50%, -50%)" }}
              />

              <div className="text-white text-[28px] svg-text-wrapper fixed inset-0 flex items-center justify-center opacity-0 z-[1000] pointer-events-none">
                State-of-the-Art Technology
              </div>

              <div className=" pointer-events-none">
                <div
                  className="z-[100] section-container absolute top-1/2 left-1/2 w-full"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  <div className="h-full flex items-center justify-center gap-20 px-20 w-full">
                    <div className="min-w-[800px]">
                      <div className="relative w-full h-[300px]">
                        <svg
                          viewBox="-20 -300 1600 900"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g transform="scale(1, -1) translate(0, -600)">
                            <path
                              ref={path1Ref}
                              d="M443.381 520.542H343.312V172.031a171.281 171.281 0 1 0-342.562 0v79.556"
                              fill="none"
                              stroke="black"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g transform="translate(550, -300)">
                            <path
                              ref={path2Ref}
                              d="M443.381 520.542H343.312V172.031a171.281 171.281 0 1 0-342.562 0v79.556"
                              fill="none"
                              stroke="black"
                              strokeWidth="1.5"
                            />
                          </g>
                          <g transform="scale(1, -1) translate(1100, -600)">
                            <path
                              ref={path3Ref}
                              d="M443.381 520.542H343.312V172.031a171.281 171.281 0 1 0-342.562 0v79.556"
                              fill="none"
                              stroke="black"
                              strokeWidth="1.5"
                            />
                          </g>
                        </svg>
                        <div className="z-[50] absolute left-[200px] top-[50px] flex flex-col gap-4">
                          {BUTTONS.map((step, i) => (
                            <button
                              key={i}
                              className={`px-6 py-2 border rounded-full transition-all duration-300 ease-in-out ${
                                activeIndex === i
                                  ? "bg-[#1127FF] text-white"
                                  : "bg-[#EFEFEF] text-black"
                              }`}
                            >
                              {step}
                            </button>
                          ))}
                        </div>
                        <div className="absolute left-[430px] top-[220px] w-[180px] h-[140px] bg-[#1127FF] rounded-[32px] flex flex-col justify-between px-4 py-6 text-white">
                          <div className="text-sm leading-tight font-medium">
                            1 hour is all
                            <br />
                            it takes to get
                            <br />
                            clear answers.
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <a href="/book-now">
                              <button className="text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                                Book →
                              </button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden h-[300px] relative">
                      <div className="text-slide">
                        <div
                          ref={textRef}
                          className="text-sliderinner text-[18px] leading-snug"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div ref={sectionRef} className="relative h-[200vh] bg-[#EFEFEF]">

  <div className="sticky top-0 h-screen flex items-center justify-center z-50">
    
    <div className="grid grid-cols-10 grid-rows-4 w-full h-full">
      {Array.from({ length: NUM_ROWS }).flatMap((_, row) =>
        Array.from({ length: NUM_COLS }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            ref={(el) => {
              if (!pixelRefs.current[col]) pixelRefs.current[col] = [];
              pixelRefs.current[col][row] = el;
            }}
            className="bg-[#0119FF] w-full h-full scale-x-0 transform"
          />
        ))
      )}
    </div>
  </div>
</div> */}

      {/* <footer id="scroll-down" className="bg-[#082B9D] relative overflow-hidden h-[100vh]">
  <div className="relative w-full h-full">
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateX(70deg) translateZ(1px) scaleY(.6)",
        height: "100%",
        width: "100%",
        position: "relative",
        transformOrigin: "center",
        perspective: "2000px",
        backfaceVisibility: "hidden",
      }}
      className="w__oval-animations relative w-full h-full"
    >
      {[...Array(ELLIPSE_COUNT)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (ellipsesRef.current[i] = el)}
          className="absolute w-[60vw] h-[24vw] rounded-full"
          style={{
            left: "50%",
            marginLeft: "-45vw",
            border: "3px solid #f7f5f7",
            boxSizing: "border-box",
            // willChange: "transform",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformOrigin: "center",
            filter: "contrast(1.1)",
          
          }}
        />
      ))}
    </div>
    <div className="w__scroll-down__trigger" />
  </div>
</footer> */}
    </>
  );
};

export default YourCare;
