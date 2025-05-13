"use client";
import { ScrambleTextPlugin } from "gsap-trial/ScrambleTextPlugin";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Text } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger, ScrambleTextPlugin);


const ScrambleText = ({ 
  text, 
  className, 
  scrambleOnLoad = true,
  charsType = "default" // 'default' | 'numbers' | 'letters'
}) => {
  const scrambleRef = useRef(null);
  const originalText = useRef(text);

  
  const charSets = {
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    numbers: "0123456789",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  };

  const scrambleAnimation = () => {
    return gsap.to(scrambleRef.current, {
      duration: 0.8,
      scrambleText: {
        text: originalText.current,
        characters: charSets[charsType],
        speed: 1,
        revealDelay: 0.1,
        delimiter: "",
        tweenLength: false,
      },
      ease: "power1.out",
    });
  };

  
  useEffect(() => {
    const element = scrambleRef.current;
    if (!element) return;

    if (scrambleOnLoad) {
      gsap.set(element, {
        scrambleText: {
          text: originalText.current,
          chars: charSets[charsType], 
          revealDelay: 0.5,
        }
      });
      scrambleAnimation();
    }

    const handleMouseEnter = () => scrambleAnimation();
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [scrambleOnLoad, charsType]);

  return (
    <span 
      ref={scrambleRef} 
      className={`scramble-text ${className || ''}`}
    >
      {text}
    </span>
  );
};
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

  const starRef = useRef(null);
  const containerRef = useRef(null);
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
  //     defaults: { duration: 2.8, ease: "power2.inOut" },
  //   });

  //   tl.set(starRef.current, {
  //     scale: 0.1,
  //     transformOrigin: "50% 50%",
  //   })
  //   .to(starRef.current, {
  //     scale: targetScale,
  //     duration: 2.5,
  //   })
  //   .to(contentRef.current, {
  //     opacity: 1,
  //     duration: 1.8,
  //   }, "-=2.6")
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

  const sectionRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(panelRef.current, {
        rotate: 7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1000",
          scrub: true,
          pin: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])
  return (
<>
<section
ref ={sectionRef}
  className="relative w-full min-h-screen bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/portraitglass.jpg)' }}

>

  <div className="relative z-10 pl-10 pt-10 flex min-h-screen">

    <div
      ref={panelRef}
       className="w-full backdrop-blur-md bg-white/80 border border-white/20 shadow-md p-10 lg:p-20 flex justify-between">
      <div className="w-1/2">
        <p className="mt-20 uppercase font-neueroman text-xs mb-4">/ Contact Us</p>
        <h1 className="text-[48px] font-neuehaas45 leading-[1.1] uppercase">
        CONNECT 
        </h1>
        <div className="mt-10 uppercase text-sm flex flex-col gap-6">
        <div>
          <p className="text-[12px] mb-1 font-neueroman uppercase"> <ScrambleText text="GENERAL" className="mr-10" /></p>
          <p className="font-ibmregular text-sm leading-snug">
          <ScrambleText  text="info@freysmiles.com" />
            <br />
            <ScrambleText className="font-ibmregular"
      text="(610)437-4748" 
      charsType="numbers"
    />
          </p>
        </div>

        <div>
        <p className="text-[12px] mb-1 font-neueroman uppercase"> <ScrambleText text="ADDRESS" className="mr-10" /></p>
          <p className="font-ibmregular text-sm leading-tight">
          <ScrambleText className="font-ibmregular"
      text="Frey Smiles" 
      charsType="numbers"
    />
            <br />
            <ScrambleText className="font-ibmregular"
      text="1250 S Cedar Crest Blvd" 
      charsType="numbers"
    />
            <br />
            <ScrambleText className="font-ibmregular"
      text="Allentown PA" 
      charsType="numbers"
    />
          </p>
        </div>
      </div>

      <div className="mt-10">
        <span className="text-3xl">↓</span>
      </div>
      

      </div>



    <div className="w-1/2  flex items-center justify-center">
  <iframe
    src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
    title="Schedule Appointment"
    className="w-full max-w-[820px] min-h-[90vh] "
  />
</div>
    </div>



  </div>
</section>


{/* <div ref={containerRef} className="fixed inset-0 flex items-center justify-center bg-black z-50">
<svg ref={starRef} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_116_153)"> <path d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z" fill="url(#paint0_linear_116_153)"/> </g> <defs> <linearGradient id="paint0_linear_116_153" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse"> <stop stop-color="#DF99F7"/> <stop offset="1" stop-color="#FFDBB0"/> </linearGradient> <clipPath id="clip0_116_153"> <rect width="200" height="200" fill="white"/> </clipPath> </defs> </svg>
</div> */}



 
</>


  );
}
