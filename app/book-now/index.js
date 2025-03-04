"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger);

const LeftColumn = () => {
  return (
    <div className="flex px-4">

      <div >
        <div className="">
          <h1 className="pb-10 font-helvetica-neue-light text-[1.6rem] mb-6">
            <span>CONTACT </span>
          </h1>
          
        </div>
    <a
            href="#general"
            className="font-neue-montreal inline-block px-10 py-3 border border-black rounded-full hover:bg-black hover:text-white transition whitespace-nowrap flex items-center"
          >
            CONTACT 
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
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10 w-full">
  <p className="font-neue-montreal text-[.9em] text-gray-400 w-1/2 text-left">
    NUMBER
  </p>
  <a
    href="facetime://6104374748"
    className="whitespace-nowrap font-neue-montreal text-[1em] hover:text-blue-500 w-1/2 text-left"
  >
    (610) 437-4748
  </a>
</div>

<div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10 w-full">
  <p className="font-neue-montreal text-[.9em] text-gray-400 w-1/2 text-left">
    EMAIL
  </p>
  <a
    className="font-neue-montreal text-[1em] hover:text-blue-500 w-1/2 text-left"
    href="mailto:info@freysmiles.com"
  >
    info@freysmiles.com
  </a>
</div>

      </div>
    </div>
  );
};

const RightColumn = () => {
  return (
    <div className="relative top-0 my-auto flex items-end justify-end h-full lg:col-span-2">
    <iframe
      src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
      title="Schedule Appointment"
      className="w-3/4 min-h-[960px] max-h-[100vh] h-full"
    ></iframe>
  </div>
  
  );
};

export default function BookNow() {
  // const starRef = useRef(null);
  // const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // useEffect(() => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const maxSize = Math.max(width, height);
  
  //   const starRect = starRef.current.getBoundingClientRect();
  //   const starWidth = starRect.width;
  //   const targetScale = (maxSize * 4) / starWidth;
  
  //   gsap.set(contentRef.current, { opacity: 0 });
  
  //   const tl = gsap.timeline({
  //     defaults: { duration: 1.2, ease: "power2.inOut" },
  //   });
  
  //   tl.set(starRef.current, {
  //     scale: 0.1,
  //     transformOrigin: "50% 50%",
  //   })
  //   .to(starRef.current, {
  //     scale: targetScale,
  //     duration: 1.5,
  //   })
  //   .to(contentRef.current, {
  //     opacity: 1,
  //     duration: 0.8,
  //   }, "-=0.6")
  //   .set(containerRef.current, { zIndex: -1 });
  // }, []);



  const pathRef = useRef(null);
  const cardsectionRef =useRef(null)
  
  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    console.log("Path Length:", length); // Debugging

    // Ensure path is fully hidden before animation
    pathRef.current.style.strokeDasharray = length;
    pathRef.current.style.strokeDashoffset = length;
    pathRef.current.style.transition = "stroke-dashoffset 3s ease-out";

    // Directly trigger animation on mount
    setTimeout(() => {
      console.log("Triggering Animation!");
      pathRef.current.style.strokeDashoffset = "0"; // Start animation
    }, 500); // Small delay to ensure styles are applied first

  }, []);
  
  
  return (
    <section className="h-[800px]">
<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1959.45 996.54">
  <defs>
    <linearGradient id="sq4-jlnyqzqb" x1="2031.41" x2="53.12" y1="2148.11" y2="2909.85" gradientTransform="matrix(1 0 0 -1 -8.36 2957.07)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF"></stop>
      <stop offset="1" stop-color="#CEFF00"></stop>
    </linearGradient>
    <linearGradient id="sq4-jfusknal" x1="2031.41" x2="53.12" y1="2148.11" y2="2909.85" gradientTransform="matrix(1 0 0 -1 -8.36 2957.07)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF"></stop>
      <stop offset="1" stop-color="#C8F700"></stop>
    </linearGradient>
    <linearGradient id="sq4-snaiohks" x1="1918.15" y1="721" x2="522.46" y2="462.02" gradientTransform="translate(-148.87 492.19) rotate(25.96) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF"></stop>
      <stop offset="1" stop-color="#ceff00"></stop>
    </linearGradient>
    <linearGradient id="sq4-mopmlljl" x1="1918.15" y1="721" x2="522.46" y2="462.02" gradientTransform="translate(-148.87 492.19) rotate(25.96) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF"></stop>
      <stop offset="1" stop-color="#C8F700"></stop>
    </linearGradient>
  

  
  

  </defs>
  <g >
    <path ref={pathRef}  d="M1416.9 875.81c5.28-29.31 2.34-61.2-1.03-93.61-9.77-87.82-35.49-216.02-51.26-304.47-16.88-85.53-20.08-172.56 3.23-258.03 20.1-71.29 68.18-132.76 146.03-143.54 33.53-4.64 69.79-3.12 102.59 10.13 63.1 23.42 100.7 89.24 119.66 147.83 13.29 38.97 21.19 77.58 31.03 115.97 17.49 61.91 39.67 122.07 62.42 183.23l55.78 147.29c1.26 3.27-.39 6.93-3.62 8.16-2.79 1.06-5.84 0-7.39-2.33l-.06-.07c-59.64-88.33-113.27-178.89-158.74-275.81-22.59-46.76-37.1-99.51-58.13-145.84-17.7-37.24-36.06-74.13-74.64-87.25-14.6-4.46-32.53-4.31-52.55-.52-15.25 3.56-25.21 10.07-34.83 21.79-34.69 47.71-34.29 128.51-30.33 187.52 1.29 21.26 6.38 51.58 9.76 72.6 8.47 51.35 15.67 105.65 20.96 157.69 6.45 66.55 11.03 135.14 6.86 203.27-3.39 35.76-5.78 85.99-37.97 110.83l-47.77-54.88Z M1490.53 892.5c-5.93 16.73-15.2 31.6-30.35 41.36-31.52 19.27-65.61-1.61-85.14-25.54-31.46-37.5-53.49-81.57-75.57-124.18-23.91-46.15-44.22-96.62-68.26-142.4-23.62-45.51-49.55-90.63-81.23-130.67-15.1-19.03-32.14-37.85-51.67-51.55-28.65-20.45-52.96-19.38-72.5 11.29-15.97 24.68-24.93 55.02-31.84 83.95-10 43.11-14.98 87.9-18.55 132.1-2.56 52.64 1.91 105.45-3.36 159.09-2.48 21.59-6.3 44.73-19.37 64.35a61.276 61.276 0 0 1-21.93 20.3l-48.07-71.08.41.05c9.07-18.15 11.14-40.83 14.48-61.82 4.08-30.87 7.04-65.5 11.02-97.73 6.46-47.13 17.46-93.42 30.21-139.4 11.96-39.76 25.64-80.87 51.07-115.54 50.16-66.63 114.5-41.87 162.89 11.38 46.09 49.54 80.5 108.77 113.8 166.1 26.21 45.29 49.14 92.42 77.39 136.43 20.48 32.04 41.49 63.73 66.75 91.28 2.7 2.69 5.49 5.62 8.37 8.44l71.45 33.79Z
M960.88 895.01c-2.24 5.27-4.92 10.39-8.19 15.29-16.67 25.57-49.77 34.93-77.59 22.71-56.39-23.73-111.94-125.42-142.57-177.63-64.93-117.43-124.49-236.09-173.49-361.67-3.63-9.66-7.19-19.3-10.65-28.94l121.65-33.91c32.94 104.37 77.86 205.5 123.64 305.15 19.4 40.18 46.03 99.68 67.16 138 9.62 17.8 20.2 36.89 31.98 53.93L960.88 895Z
M644.73 156.49s-2.15-.45-4.94-.62c-5.66 17.37-1.86 35.08.77 55.22 3.12 22.11 8.34 45.5 14.53 69.09 5.49 20.1 15.41 52.05 21.82 71.9L556.78 387.7c-17.25-47.06-36.59-105.48-45.42-156.4-7.07-43.34-10.5-89.45 7.52-133.31 15.33-38.94 53.69-69.05 95.3-74.56 24.2-3.95 48.38-1.83 71.48 4.75l-40.93 128.31Z
M675.74 25.65c54.59 12.32 104.11 50.22 135.18 93.44 81.71 109.96 79.89 263.48-7.3 369.28-138.96 174.04-399.87 172.14-540.17 1.47-58.79-67.03-100.74-146.64-133.4-228.91-19.51-49.81-35.45-100.55-48.28-151.87-.82-3.38 1.2-6.77 4.58-7.59 2.93-.71 5.87.76 7.17 3.33 23.14 47.17 47.01 93.66 73.6 138.05 45.79 76.29 96.79 148.49 164.6 205.44 110.44 99.48 288.6 89.76 375.24-33.48 31.2-43.93 42.3-94.51 30.41-144.63-5.52-25.61-17.22-50.29-33.11-71.02-16.43-20.3-38.22-41.2-64.46-43.28l35.95-130.22Z"></path>

  </g>
</svg>
  {/* <div ref={containerRef} className="fixed inset-0 flex justify-center items-center bg-[#FE2F01] z-50">
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
          fill="#FFF"
        />
      </svg>
    </div> */}
        <div 
        ref={contentRef}
        className="grid gap-8 py-24 lg:py-36 lg:grid-cols-3">
          <LeftColumn />
          <RightColumn />
        </div>
  <div className="bottom-0 h-1/2 w-3/4">
<img src ="../images/checkered.svg" />
  </div>
    </section>
  );
}
