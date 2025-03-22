"use client";
import * as THREE from "three";
import * as PIXI from "pixi.js";
import Layout from "./layout.js";
import { SplitText } from "gsap-trial/all";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap-trial/Physics2DPlugin";
import { gsap, TweenLite, TimelineMax, Sine } from "gsap";

gsap.registerPlugin(Physics2DPlugin);

const YourCare = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      setScroll(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const circleRefs = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      circleRefs.current,
      {
        y: -100, // Start above the section
        opacity: 0,
      },
      {
        y: 0, // Drop to the bottom
        opacity: 1,
        ease: "bounce.out",
        duration: 1.5,
        stagger: 0.1,
        physics2D: {
          velocity: Math.random() * 200 + 100, // Random fall speed
          angle: 90, // Straight down
          friction: 0.1,
        },
      }
    );
  
  }, []);
  const textRef = useRef(null);
  const sectionRef = useRef(null);
  const bookNowRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    const bookNow = bookNowRef.current;

    gsap.to(text, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      scale: 0.5,
      x: -160,
      ease: "none",
    });


    gsap.fromTo(
      bookNow,
      {
        opacity: 0,
        x: 0, 
      },
      {
        opacity: 1,
        x: 0, 
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
        ease: "none",
      }
    );
  }, []);
  return (
    <>
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
      
      <div
      ref={sectionRef}
      className="sticky top-0 h-screen flex flex-col items-center justify-center text-black"
    >

      <h1
        ref={textRef}
        className="text-[5em] md:text-[5em] font-neuehaasdisplaythin text-center leading-tight"
      >
        Your smile journey is unique. <br /> Your treatment should reflect that.
      </h1>

      <div ref={bookNowRef} className="w-1/2 opacity-0">
        BOOK NOW IN PERSON OR VIRTUAL
      </div>
    </div>
    <div className="h-screen"/>
      </div>
      <div>
       Your first appointment will consist of a
        thorough orthodontic examination, including photos and a digital
        radiograph of your teeth., Discover your treatment plan at no fee
      </div>
      <div className="flex items-center justify-center py-20">
        <div className="container text-center">
          <p className="font-helvetica-neue text-xl">
            <span className="text-6xl block mb-6">Pricing</span>
            <span >Taking</span> the first step towards
            treatment can sometimes feel overwhelming, especially when it comes
            to discussing
            <span> personalized </span> treatment plans.
            That&apos;s why we kindly request that all decision-makers be
            present during the initial visit.
            <span>Our goal</span> is for every patient to
            walk out of our office fully informed with answers to all their
            questions about their treatment path.
          </p>
        </div>
      </div>

      <Layout>
        <div className="section-wrapper">
          <div id="stage" />
          <div className="bg-[#F1F1F1] relative pagesection">
            <img
              className="py-40 px-40 rounded-full"
              src="../images/skyclouds.jpeg"
            ></img>
          </div>
          <div className="relative pagesection">
            <div className="min-h-screen   relative"></div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default YourCare;
