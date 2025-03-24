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

gsap.registerPlugin(Physics2DPlugin, SplitText);

const YourCare = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRefs = useRef([]);
  const splitRefs = useRef([]);
  const isAnimating = useRef(false);

  useEffect(() => {
    splitRefs.current = textRefs.current.map((el) =>
      new SplitText(el, { type: "words" })
    );
  }, []);

  useEffect(() => {
    if (!splitRefs.current.length) return;
    animateSplitText(activeIndex);
  }, [activeIndex]);


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

  const animateSplitText = (newIndex) => {
    const currentIndex = splitRefs.current.findIndex((split, i) =>
      textRefs.current[i].classList.contains("current")
    );
    if (currentIndex === newIndex || currentIndex === -1) {
      textRefs.current[newIndex].classList.add("current");
      return;
    }

    const currentWords = splitRefs.current[currentIndex].words;
    const nextWords = splitRefs.current[newIndex].words;

    const tl = gsap.timeline({
      defaults: { ease: "expo", duration: 0.05 },
      onComplete: () => {
        textRefs.current[currentIndex].classList.remove("current");
        textRefs.current[newIndex].classList.add("current");
      },
    });

    tl.fromTo(
      currentWords,
      {
        yPercent: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        duration: 0.15,
        yPercent: -125,
        rotation: 3,
        opacity: 0,
        ease: "power1.in",
        stagger: 0.02,
      }
    ).fromTo(
      nextWords,
      {
        yPercent: 125,
        rotation: -3,
        opacity: 0,
      },
      {
        duration: 0.6,
        yPercent: 0,
        rotation: 0,
        opacity: 1,
        ease: "back.out(1.4)",
        stagger: 0.02,
      },
      ">-=0.4"
    );
  };


  const SECTIONS = [
    "Book an initial consultation in person or virtually. Discover your treatment plan at no fee.",
    "Your first appointment will consist of a thorough orthodontic examination, including photos and a digital radiograph of your teeth.",
    // "  Taking the first step towards treatment can sometimes feel overwhelming, especially when it comes to discussing <span>personalized</span> treatment plans. That&apos;s why we kindly request that all decision-makers be present during the initial visit. <span>Our goal</span> is for every patient to walk out of our office fully informed with answers to all their questions about their treatment path."
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

  return (
    <>
       
    <div className="wrappersection">

    <div className="diagonal-page">

      <div className="section-container">
      <div className="h-full flex items-center justify-center gap-32 px-32 w-full">
  
      <div className="min-w-[500px]">
  <div className="relative w-full h-[300px]">
    <AnimatePresence initial={false}>
      {activeIndex === 0 && (
        <motion.div
          key="layout1"
          className="absolute inset-0 flex gap-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6 }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              layoutId={`circle-${i}`}
              className="w-20 h-20 bg-[#F5E318] rounded-full flex-shrink-0"
            />
          ))}
        </motion.div>
      )}

{activeIndex === 1 && (
  <motion.div
    key="layout2"
    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.6 }}
  >

    <motion.div
      layoutId="circle-4"
      className="w-20 h-20 bg-[#F0FF3D] rounded-full"
    />


    <div className="flex gap-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          layoutId={`circle-${i}`}
          className="w-20 h-20 bg-[#F0FF3D] rounded-full"
        />
      ))}
    </div>
  </motion.div>
)}
{activeIndex === 2 && (
  <motion.div
    key="layout3"
    className="absolute inset-0 flex flex-col items-center justify-center gap-4"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    transition={{ duration: 0.6 }}
  >

    <motion.div
      layoutId="circle-4"
      className="w-20 h-20 bg-[#F0FF3D] rounded-full"
    />


    <div className="flex gap-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          layoutId={`circle-${i}`}
          className="w-20 h-20 bg-[#F0FF3D] rounded-full"
        />
      ))}
    </div>
  </motion.div>
)}

    </AnimatePresence>
  </div>
</div>


<div className="overflow-hidden h-[100px] relative">
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
</footer>

      <div
        style={{
          height: "400vh",
          background: `linear-gradient(180deg, rgba(212, 212, 212, ${
            1 - scroll
          }) 0%, #FBC705 100%)`,
          transition: "background 0.3s ease-out",
          padding: "min(8vw, 40px) 0",
        }}
      >

      </div>

          <div className="bg-[#F1F1F1] relative ">
            <img
              className="py-40 px-40 rounded-full"
              src="../images/skyclouds.jpeg"
            ></img>
          </div> */}
 

    </>
  );
};

export default YourCare;
