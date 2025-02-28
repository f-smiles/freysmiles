"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";


gsap.registerPlugin(MorphSVGPlugin);

const LeftColumn = () => {
  return (
    <div className="flex justify-center items-center px-4">
      
      <div className="w-full lg:text-left">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-helvetica-neue-light text-[7rem] mb-6">
            <span>Say </span>
            <span className="text-[7rem]">hello</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10">
          <p className="uppercase font-neue-montreal text-[1.5em]">
            We look forward to hearing from you
          </p>

          <a
            href="#general"
            className="font-neue-montreal inline-block px-10 py-3 border border-black rounded-full hover:bg-black hover:text-white transition whitespace-nowrap flex items-center"
          >
            General
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-4 ml-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </a>
        </div>

        <div className="text-end lg:text-right space-y-4">
          <a
            className="font-neue-montreal text-lg text-center hover:text-blue-500"
            href="mailto:info@freysmiles.com"
          >
            info@freysmiles.com
          </a>
          <div className="flex text-end lg:justify-end gap-10">
            <div>
              <a
                href="facetime://6104374748"
                className="font-neue-montreal text-lg text-center hover:text-blue-500"
              >
                (610) 437-4748
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RightColumn = () => {
  return (
    <div className="relative top-0 my-auto overflow-y-auto lg:col-span-2">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
        title="Schedule Appointment"
        className="w-full min-h-[960px] max-h-[100vh] h-full"
      ></iframe>
    </div>
  );
};

export default function BookNow() {
  const starRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const maxSize = Math.max(width, height);
  
    const starRect = starRef.current.getBoundingClientRect();
    const starWidth = starRect.width;
    const targetScale = (maxSize * 4) / starWidth;
  
    gsap.set(contentRef.current, { opacity: 0 });
  
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power2.inOut" },
    });
  
    tl.set(starRef.current, {
      scale: 0.1,
      transformOrigin: "50% 50%",
    })
    .to(starRef.current, {
      scale: targetScale,
      duration: 1.5,
    })
    .to(contentRef.current, {
      opacity: 1,
      duration: 0.8,
    }, "-=0.6")
    .set(containerRef.current, { zIndex: -1 });
  }, []);

  return (
    <section className="">
  <div ref={containerRef} className="fixed inset-0 flex justify-center items-center bg-[#FE2F01] z-50">
      <svg width="100vw" height="100vh" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
        <path
          ref={starRef}
          d="M 0.5 0.0391 C 0.4727 0.2148 0.4492 0.3203 0.3828 0.3828 
                C 0.3203 0.4492 0.2148 0.4727 0.0391 0.5 
                C 0.2148 0.5273 0.3203 0.5508 0.3828 0.6172 
                C 0.4492 0.6797 0.4727 0.7852 0.5 0.9609 
                C 0.5273 0.7852 0.5508 0.6797 0.6172 0.6172 
                C 0.6797 0.5508 0.7852 0.5273 0.9609 0.5 
                C 0.7852 0.4727 0.6797 0.4492 0.6172 0.3828 
                C 0.5508 0.3203 0.5273 0.2148 0.5 0.0391 Z"
          fill="#F3DACF"
        />
      </svg>
    </div>
        <div ref={contentRef} className="grid h-full grid-cols-1 gap-8 py-24 lg:py-36 lg:grid-cols-3">
          <LeftColumn />
          <RightColumn />
        </div>
  
    </section>
  );
}
