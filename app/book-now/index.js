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
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);
  return (
    <div className="pt-40">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        onAnimationComplete={() => setLinesComplete(true)}
      />

          <div className="flex flex-col lg:flex-row items-center w-full text-center">
          <div className="relative flex justify-start items-center text-center text-[5em] font-neuehaas35 leading-none">

              <div className="relative overflow-hidden">
                <motion.div
                  variants={fadeUpMaskedVariants}
                  initial="hidden"
                  animate={linesComplete ? "visible" : "hidden"}
                >
                  Get In Touch
                </motion.div>
              </div>
            </div>
            <motion.div
  className="flex flex-row items-end gap-4"
  variants={fadeUpMaskedVariants}
  initial="hidden"
  animate={linesComplete ? "visible" : "hidden"}
>

  <div className="flex flex-col items-start gap-1">
    <span className="font-neuehaas35 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium">
      NUMBER
    </span>
    <motion.div variants={fadeUpMaskedVariants}>
      <a
        href="facetime://6104374748"
        className="relative font-neuehaas35 inline-flex text-[1em]"
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


  <div className="flex flex-col items-start gap-1">
    <span className="font-neuehaas35 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md font-medium">
      EMAIL
    </span>
    <motion.div variants={fadeUpMaskedVariants}>
      <a
        href="mailto:info@freysmiles.com"
        className="relative font-neuehaas35 inline-flex text-[1em]"
        onMouseEnter={() => setIsEmailHovered(true)}
        onMouseLeave={() => setIsEmailHovered(false)}
      >
        info@freysmiles.com
        <motion.div
          className="absolute left-0 bottom-0 h-[1px] bg-blue-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isEmailHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />
      </a>
    </motion.div>
  </div>
</motion.div>


          </div>


        <div className=" w-full px-10">
          <motion.div
            className="h-[1px] w-full bg-gray-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
            style={{ transformOrigin: "left" }}
          />
        </div>


      <motion.div
        className="w-full grid grid-cols-1 md:grid-cols-2 relative"
        initial="hidden"
        animate={linesComplete ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Left Column */}
        <div className="p-8 relative">
        <video
        ref={videoRef}
        src="../images/adobetest.mov"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />


 
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
