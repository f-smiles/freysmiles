"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import DotPattern from "../svg/DotPattern";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";

import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";

// function Invisalign() {
//   const sectionRef = useRef()
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["end end", "center center"],
//   })
//   const springScroll = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   })
//   const scale = useTransform(springScroll, [0, 1], [1.2, 0.9])
//   const transformText = useTransform(springScroll, [0, 1], ["0%", "150%"])
//   const transformCase = useTransform(springScroll, [0, 1], ["150%", "0%"])
//   const transformRetainer = useTransform(springScroll, [0, 1], ["-150%", "-100%"])

//   return (
//     <section ref={sectionRef} className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start">

//       <div className="lg:w-1/2">
//         <motion.img style={{ translateY: transformCase }} className="object-cover w-full h-auto mx-auto object-start" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
//         <motion.img style={{ translateY: transformRetainer, scale }} className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
//       </div>
//     </section>
//   )
// }

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const Invisalign = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.killTweensOf(".lineChild, .lineParent");

    const split = new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });
    new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top bottom",
        toggleActions: "restart pause resume pause",
      },
    });
    tl.from(".lineChild", {
      y: 50,
      duration: 0.75,
      stagger: 0.25,
      autoAlpha: 0,
    });

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
  return (
    <div className=" bg-[#FFF8EF]">
      <div
        style={{
          backgroundImage: "url('../images/invisalignset.png')",
          backgroundSize: "30%",
        }}
        className="bg-contain bg-no-repeat  h-screen p-10"
      >
        <main className="flex flex-col items-center justify-end h-screen relative">
          <div
            style={{
              position: "absolute",
              top: "0%",
              left: "50%",
              width: "50%",
              height: "50%",
              backgroundImage: "url('../images/alignercase.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <div className="z-10 flex flex-col items-center">
            <div className="w-full pb-20 ">
              <h1 className="text-[8em] font-bold leading-none">
                <div>SOLUTIONS</div>
                <div>DESIGNED TO FIT</div>
                <div className="flex items-baseline">
                  <span>YOUR NEEDS</span>

                  <Link href="/book-now">
                    <button
                      data-text="BOOK CONSULT"
                      className="link link--leda font-cera-bold bg-[#F5FF7D] font-bold py-6 px-16 rounded-full ml-4 text-[.3em]"
                    >
                      BOOK CONSULT
                    </button>
                  </Link>
                </div>
              </h1>
            </div>
          </div>
        </main>
      </div>
      <div className="rounded-[50px] bg-[#FFFFFF] text-white min-h-screen flex relative">
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            style={{
              width: "60%",
              height: "80%",
              objectFit: "contain",
            }}
          >
            <source src="../images/invisfullvideo.mov" type="video/mp4" /> Your
            browser does not support the video tag.
          </video>{" "}
        </div>
      </div>
      <div className="flex items-center h-screen bg-black">
        <h1
          ref={headingRef}
          className="text-white  max-w-xl text-xl overflow-hidden"
        >
          Our team, led by the skilled Dr. Gregg and Dr. Daniel, possesses the
          expertise required to achieve the smile you desire. Countless
          individuals have already experienced the transformative effects of our
          advanced orthodontic treatments
        </h1>
      </div>
      {/* <div className="rounded-[40px] ContentContainer flex-grow grid grid-cols-3 grid-rows-3 gap-4 p-4">
    <div className="col-start-2 col-end-3 row-start-2 row-end-3 border-r-2 border-white">

</div>
    <div className="h-screen flex justify-center">


 
      </div>


    <div className="flex">
  <div className="w-1/2">
    <div className="text-[5em] leading-none">TREATED <span className="font-saol"> THOUSANDS</span> OF PATIENTS</div>
   
  </div>
  
  <div className="w-1/2">
    <p className="text-xl">
    As Diamond Plus providers of Invisalign and Invisalign Teen—ranked within the top 1% of practitioners nationwide—we are equipped with the expertise necessary to deliver the smile you aspire to attain. Under the skilled guidance of Dr. Gregg and Dr. Daniel, countless individuals have experienced the transformative benefits of this advanced orthodontic treatment.
    </p>
    <div class="circle">
  
  </div>
  </div>
</div>

  </div> */}
    </div>
  );
};
export default Invisalign;
