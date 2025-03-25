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
    <>If treatment isn’t yet needed, your child will be enrolled in our complimentary Future Smiles Club. These fun, no-cost visits — typically every 6 to 12 months — include growth checkups, birthday surprises, and a chance to spin our prize wheel, all while keeping you informed and prepared.</>,
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
      end: '+=200',
      pin: true,
      scrub: true,
    });
  
    return () => {
      trigger.kill(); 
    };
  }, []);
  

  return (
    <>
    
      <div  ref={diagonalRef} className="wrappersection py-10">
        <div className="diagonal-page">
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
                    <circle ref={ballRef} id="ball" r="10" fill="orange" />
                  </svg>
                  <div className="absolute left-[200px] top-[50px] flex flex-col gap-4">
                    {BUTTONS.map((step, i) => (
                      <button
                        key={i}
                        className={`px-6 py-2 border rounded-full transition ${
                          activeIndex === i
                            ? "bg-[#FF3C00] text-white transition duration-300 ease-in-out"
                            : "bg-white text-black hover:bg-black hover:text-white"
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>

                  <div class="absolute left-[430px] top-[220px] w-[180px] h-[140px] bg-[#FF3C00] rounded-[32px] flex flex-col justify-between px-4 py-6 text-white">
                    <div class="text-sm leading-tight font-medium">
                      1 hour is all
                      <br />
                      it takes to get
                      <br />
                      clear answers.
                    </div>

                    <div class="flex justify-between items-center mt-2">
                      <button class="text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                        Book →
                      </button>
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
