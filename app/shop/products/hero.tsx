'use client'
import { gsap } from "gsap";
import { useRef, useEffect, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import FlutedGlassEffect from "../../../utils/glass";




const Marquee = () => {
  const items = [
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
        { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
  ];

  return (
    <div className="relative overflow-hidden w-screen bg-[#F0EF59]">
      <div className="flex animate-marquee min-w-full hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="px-4 py-4 text-[12px] whitespace-nowrap"
          >
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
};


const Hero: React.FC = () => {

  const slices = [
    { id: 1, containerHeight: 50, translateY: -420 },
    { id: 2, containerHeight: 50, translateY: -370 },
    { id: 3, containerHeight: 50, translateY: -320 },
    { id: 4, containerHeight: 320, translateY: -0 },
  ];

  
  const lineRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = lineRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
    });
  }, []);
  return (
    
<section
  className="relative h-screen flex flex-col md:flex-row px-8 md:px-24 py-20 "
>


  {/* <svg
    className="absolute inset-0 w-full h-full z-0"
    viewBox="-960 -540 1920 1080"
    preserveAspectRatio="none"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="miter"
      fillOpacity="0"
      strokeMiterlimit="4"
      stroke="rgb(248,134,63)"
      strokeOpacity="1"
      strokeWidth="1.5"
      d="M-954,-192 C-954,-192 -659,-404 -520,-431 C-379,-454 -392,-360 -588,-33 C-730,212 -926,640 -350,397 C135.86099243164062,192.0279998779297 324,-61 523,-160 C705.1939697265625,-250.63900756835938 828,-256 949,-194"
    />
  </svg> */}


  <div className="relative z-10 flex flex-col justify-between max-w-xl md:w-1/2 h-full">
    <div className="flex items-center h-1/2">
      <div>
        <h1 className="text-[14px] font-neuehaas45 leading-tight max-w-[500px]">
          We’ve carefully curated a selection of premium products designed to elevate your
          experience during treatment. From gentle yet effective whitening solutions to
          comfort-enhancing essentials, each product is handpicked to support your journey
          to a healthier, more confident smile.
        </h1>
      </div>
    </div>


    <div className="flex flex-col justify-center h-1/2">
      <h1 className="text-[48px] font-neuehaas45 mb-4">
        Ember Light <span className="text-gray-400">Therapy</span>
      </h1>
      <p className="text-sm font-neuehaas45 text-gray-600 mb-6">
        utilizes proprietary UV-Free, TripleWave™ LED technology to reveal a brighter, healthier smile.
      </p>

      <div className="text-[13px] font-neuehaas45 flex flex-wrap gap-3 mb-6">
        <span className="bg-gray-100 px-4 py-2 rounded-lg">Faster tooth alignment</span>
        <span className="bg-gray-100 px-4 py-2 rounded-lg">targets oral bacteria</span>
        <span className="bg-gray-100 px-4 py-2 rounded-lg">Reduced discomfort</span>
      </div>


      <div className="flex items-center gap-4">
        <span className="text-lg">Explore Financing</span>
        <button className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition">
          →
        </button>
      </div>
    </div>
  </div>

  <div className="relative z-0 md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
  <div className="absolute inset-0 bg-[url('/images/radialgreen.png')] bg-cover bg-center z-0" />


  <img
    src="/images/ember_transparent.png"
    alt="Ember"
    className="relative z-10 max-w-xs md:max-w-md"
  />
</div>

</section>


  );
};

export default Hero;


;
