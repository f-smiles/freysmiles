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



  const SECTIONS = [
    <>
    Experience your initial consultation — in person or virtually — at{" "}
    <span className="relative inline-block">
      <span className="relative z-10">no cost</span>
      <svg
        viewBox="0 0 302 31"
        className="absolute left-0 -bottom-1 w-full h-[20px] z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.3,29.2C3.9,28,6.4,26.7,9,25.5c10.3-4.9,21.2-9.4,31.6-11.4s21.2-1,31,2.8s19.1,9.5,29.3,11.9
          s20.2-0.2,30.1-4.1c9.4-3.7,18.7-8.3,28.5-9.8s19.1,1.7,28.5,5.7s19.3,8.5,28.9,6.8c9.6-1.7,17.6-10.3,26-17
          c4.2-3.3,8.3-6.1,13.1-7.6c4.8-1.6,9.8-1.7,14.7-0.9c10.4,1.8,20.3,7.4,30,13.1"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    .
  </>,
    <>This initial visit includes an in-depth orthodontic evaluation, digital radiographs, and professional imaging.
    </>,
    <>We encourage all decision-makers to attend the initial visit so we can discuss the path ahead with clarity and transparency — ensuring everyone is aligned on expectations, preferences, and the ideal time to begin.</>,
    <>If treatment isn’t yet needed, no cost observation check-ups will be coordinated every 6-12 months until treatment is needed. These are shorter and fun visits where you'll have access to all four of our locations to play video games and get to know our team. </>,
    // "Our goal is for every patient to leave fully informed, with clarity and confidence about their treatment path.
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

  useEffect(() => {
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

    gsap.to(ballRef.current, {
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
  }, [activeIndex]);

  const BUTTONS = [
    "Initial Consultation",
    "Full Evaluation",
    "Plan & Prepare",
    "Treatment Roadmap",
  ];

  const diagonalRef = useRef();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: diagonalRef.current,
      start: 'top top',
      end: '+=000',
      pin: true,
      scrub: true,
    });
  
    return () => {
      trigger.kill(); 
    };
  }, []);
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
  
    const rowStagger = 0.02, overlapDelay = 0.2, columnDuration = 2 * rowStagger + overlapDelay;
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
        ? rowIndex % 2 === 0 ? "left center" : "right center" 
        : rowIndex % 2 === 0 ? "right center" : "left center";
  
    const rowOrder = [3, 1], finalPair = [0, 2];
  
    orderedCols.forEach((colIndex, stepIndex) => {
      const column = pixelRefs.current[colIndex];
      const columnStart = stepIndex * columnDuration;
      
      rowOrder.forEach((rowIdx, i) => {
        if (column[rowIdx]) tl.to(column[rowIdx], {
          width: "120%", scaleX: 1, transformOrigin: getOrigin(colIndex, rowIdx), ease: "power2.out"
        }, columnStart + i * rowStagger);
      });
  
      finalPair.forEach(rowIdx => {
        if (column[rowIdx]) tl.to(column[rowIdx], {
          width: "120%", scaleX: 1, transformOrigin: getOrigin(colIndex, rowIdx), ease: "power2.out"
        }, columnStart + rowOrder.length * rowStagger + overlapDelay);
      });
    });
  
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);
  
  
  return (
    <>
    
      <div  ref={diagonalRef} className="wrappersection py-10 relative overflow-hidden">
      <div className="diagonal-page min-w-[100vw] relative z-10">
          <div className="section-container">
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
                        stroke-width="1.5"
                      />
                    </g>
                    <g transform="translate(550, -300)">
                      <path
                        ref={path2Ref}
                        d="M443.381 520.542H343.312V172.031a171.281 171.281 0 1 0-342.562 0v79.556"
                        fill="none"
                        stroke="black"
                        stroke-width="1.5"
                      />
                    </g>
                    <g transform="scale(1, -1) translate(1100, -600)">
                      <path
                        ref={path3Ref}
                        d="M443.381 520.542H343.312V172.031a171.281 171.281 0 1 0-342.562 0v79.556"
                        fill="none"
                        stroke="black"
                        stroke-width="1.5"
                      />
                    </g>
                    <circle ref={ballRef} id="ball" r="10" fill="#0154E5" />
                  </svg>
                  <div className="absolute left-[200px] top-[50px] flex flex-col gap-4">
                    {BUTTONS.map((step, i) => (
          <button
          key={i}
          className={`px-6 py-2 border rounded-full transition-all duration-300 ease-in-out ${
            activeIndex === i
              ? "bg-[#0154E5] text-white"
              : "bg-[#EFEFEF] text-black"
          }`}
        >
          {step}
        </button>
        
                    ))}
                  </div>

                  <div class="absolute left-[430px] top-[220px] w-[180px] h-[140px] bg-[#0154E5] rounded-[32px] flex flex-col justify-between px-4 py-6 text-white">
                    <div class="text-sm leading-tight font-medium">
                      1 hour is all
                      <br />
                      it takes to get
                      <br />
                      clear answers.
                    </div>

                    <div class="flex justify-between items-center mt-2">
                      <a   href="/book-now">
                      <button class="text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                        Book →
                      </button>
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
<line x1="25.2553" y1="1.5085e-08" x2="25.2553" y2="49.8197" stroke="#0054E5" stroke-width="0.690211"><script xmlns=""/></line>
<line x1="7.05187" y1="42.2794" x2="42.2797" y2="7.05158" stroke="#0054E5" stroke-width="0.690211"/>
<line y1="24.5646" x2="49.8197" y2="24.5646" stroke="#0054E5" stroke-width="0.690211"/>
<line x1="35.1242" y1="47.6317" x2="14.0695" y2="2.47973" stroke="#0054E5" stroke-width="0.690211"/>
<line x1="14.1632" y1="47.385" x2="35.0294" y2="2.14562" stroke="#0054E5" stroke-width="0.690211"/>
<line x1="3.16436" y1="37.0659" x2="46.3095" y2="12.156" stroke="#0054E5" stroke-width="0.690211"/>
<line x1="7.53993" y1="7.05212" x2="42.7678" y2="42.28" stroke="#0054E5" stroke-width="0.690211"/>
<line x1="48.1993" y1="33.0636" x2="1.38417" y2="16.0242" stroke="#0054E5" stroke-width="0.690211"/>
</svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden h-[300px] relative">
  <div
    className="text-slider"
    style={{
      transform: `translateY(-${activeIndex * 100}%)`,
    }}
  >
    {SECTIONS.map((text, i) => (
      <div key={i} className="text-slide">
        <div className="text-sliderinner">{text}</div>
      </div>
    ))}
  </div>
</div>

            </div>
          </div>
        </div>
        <div ref={sectionRef} className="min-w-[100vw] relative h-screen bg-[#EFEFEF]">

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
</div>

      </div>


<div >

<div>
    </div>

</div>
      <footer id="scroll-down" className="bg-[#082B9D] relative overflow-hidden h-[100vh]">
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
</footer>

      {/* <div
        style={{
          height: "400vh",
          background: `linear-gradient(180deg, rgba(212, 212, 212, ${
            1 - scroll
          }) 0%, #FBC705 100%)`,
          transition: "background 0.3s ease-out",
          padding: "min(8vw, 40px) 0",
        }}
      >

      </div> */}

    </>
  );
};

export default YourCare;
