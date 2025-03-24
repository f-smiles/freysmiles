"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger);

export default function BookNow() {
  const fadeUpMaskedVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        transition: { duration: 1, ease: "easeOut", delay: 2 },
      },
    },
  };

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

  const cardsectionRef = useRef(null);
  const [linesComplete, setLinesComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  return (
    <div className="pt-20 flex flex-col items-center relative">
      
      <motion.div
        className="absolute left-0 top-0 h-full w-[1px] bg-gray-400"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-[1px] bg-gray-400"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        onAnimationComplete={() => setLinesComplete(true)}
      />
<motion.div className="relative w-full overflow-hidden">
  {/* Top Border */}
  <motion.div
    className="absolute top-0 left-0 h-[1px] w-0 bg-gray-400 z-10"
    initial={{ width: 0 }}
    animate={{ width: "100%" }}
    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
  />


  <motion.div className="relative w-full">
    <motion.div
      className="absolute top-0 left-0 w-full bg-[#FEEA27]"
      initial={{ height: "0%" }}
      animate={linesComplete ? { height: "180px" } : {}} 
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
    
<div className="relative flex justify-center items-center h-[180px] text-center text-[4em] font-neue-montreal">
  <div className="relative overflow-hidden">
    <motion.div
      variants={fadeUpMaskedVariants}
      initial="hidden"
      animate={linesComplete ? "visible" : "hidden"}
    >
      Let's Talk
    </motion.div>
  </div>
</div>

  </motion.div>

  {/* Bottom Border */}
  <motion.div
    className="absolute bottom-0 left-0 h-[1px] w-0 bg-gray-400 z-10"
    initial={{ width: 0 }}
    animate={{ width: "100%" }}
    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
  />
</motion.div>


      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 relative"
        initial="hidden"
        animate={linesComplete ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Left Column */}
        <div className="p-8 relative">
          <motion.div
            className="absolute right-0 top-0 h-full w-[1px] bg-gray-400"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          />

          <div className="relative overflow-hidden">
            <motion.h1
              className="pb-10 font-helvetica-neue-light text-[1.6rem]"
              variants={fadeUpMaskedVariants}
            >
              Contact
            </motion.h1>
          </div>

          <div className="relative overflow-hidden">
          <div className="relative overflow-hidden border-b border-gray-300 pb-6 mb-6" />
            <motion.div
              className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-2 w-full"
              variants={fadeUpMaskedVariants}
            >
              <div className="relative overflow-hidden w-1/2">
                <motion.p
                  className="font-helvetica-neue-light text-[.9em] text-[#0101F5] text-left"
                  variants={fadeUpMaskedVariants}
                >
                  NUMBER
                </motion.p>
              </div>

              <div className="relative overflow-hidden w-1/2">
                <motion.div variants={fadeUpMaskedVariants}>
                  <a
                    href="facetime://6104374748"
                    className="relative inline-flex font-helvetica-neue-light text-[1em] text-left"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    (610) 437-4748
                    <motion.div
                      className="absolute left-0 bottom-0 h-[1px] bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: isHovered ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="relative overflow-hidden">
          <div className="relative overflow-hidden border-b border-gray-300 pb-6 mb-6" />
            <motion.div
              className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 mb-10 w-full"
              variants={fadeUpMaskedVariants}
            >
              <div className="relative overflow-hidden w-1/2">
                <motion.p
                  className="font-helvetica-neue-light text-[.9em] text-[#0101F5] text-left"
                  variants={fadeUpMaskedVariants}
                >
                  EMAIL
                </motion.p>
              </div>

              <div className="relative overflow-hidden w-1/2">
                <motion.div variants={fadeUpMaskedVariants}>
                  <a
                    onMouseEnter={() => setIsEmailHovered(true)}
                    onMouseLeave={() => setIsEmailHovered(false)}
                    className="relative inline-flex font-helvetica-neue-light text-[1em] text-left"
                    href="mailto:info@freysmiles.com"
                  >
                    info@freysmiles.com
                    <motion.div
                      className="absolute left-0 bottom-0 w-full h-[1px] bg-blue-500"
                      animate={{ scaleX: isEmailHovered ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column */}
        <motion.div
          className="p-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={linesComplete ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
        >
          <div className="relative top-0 my-auto flex items-end justify-end h-full lg:col-span-2">
            <iframe
              src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
              title="Schedule Appointment"
              className="w-3/4 min-h-[960px] max-h-[100vh] h-full"
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
