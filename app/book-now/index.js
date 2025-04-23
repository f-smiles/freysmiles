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


gsap.registerPlugin(ScrambleTextPlugin);

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

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const maxSize = Math.max(width, height);

    const starRect = starRef.current.getBoundingClientRect();
    const starWidth = starRect.width;
    const targetScale = (maxSize * 4) / starWidth;

    gsap.set(contentRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      defaults: { duration: 2.8, ease: "power2.inOut" },
    });

    tl.set(starRef.current, {
      scale: 0.1,
      transformOrigin: "50% 50%",
    })
    .to(starRef.current, {
      scale: targetScale,
      duration: 2.5,
    })
    .to(contentRef.current, {
      opacity: 1,
      duration: 1.8,
    }, "-=2.6")
    .set(containerRef.current, { zIndex: -1 });
  }, []);

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
<>
<div ref={containerRef} className="fixed inset-0 flex items-center justify-center bg-black z-50">
<svg ref={starRef} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_119_243)"> <path d="M99.995 200V143.969L0 99.995H56.0313L99.995 0V56.0313L200 99.995H143.969L99.995 200Z" fill="url(#paint0_linear_119_243)"/> </g> <defs> <linearGradient id="paint0_linear_119_243" x1="177" y1="-9.23648e-06" x2="39.5" y2="152.5" gradientUnits="userSpaceOnUse"> <stop stop-color="#B0B9FF"/> <stop offset="1" stop-color="#E7E9FF"/> </linearGradient> <clipPath id="clip0_119_243"> <rect width="200" height="200" fill="white"/> </clipPath> </defs> </svg>
</div>
<div className="pt-40">

<div className="font-neuehaas45 scramble-wrapper flex flex-col gap-4">

  <div className="ml-10 flex flex-row">
    <ScrambleText text="NUMBER" className="mr-10" />
    <ScrambleText 
      text="(610)437-4748" 
      charsType="numbers"
    />
  </div>


  <div className="ml-10 flex flex-row">
    <ScrambleText text="EMAIL" className="mr-10" />
    <ScrambleText text="info@freysmiles.com" />
  </div>
</div>

    <div className="flex flex-col items-start gap-1">
      <span className="font-neuehaas35 px-2 py-1 rounded-md font-medium">
     
      </span>
    </div>
  </div>
</>

    //   <div className="relative top-0 my-auto flex items-end justify-end h-full lg:col-span-2">
    //   <iframe
    //     src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
    //     title="Schedule Appointment"
    //     className="w-3/4 min-h-[960px] max-h-[100vh] h-full"
    //   ></iframe>
    // </div>
  );
}
