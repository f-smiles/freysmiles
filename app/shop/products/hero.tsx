'use client'

import { useRef, useEffect, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import FlutedGlassEffect from "./glass";




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

  

  return (
    
<div className="bg-[#FCFAF5]">
   <section className="font-neueroman uppercase flex justify-center overflow-hidden">
    <Marquee />
  </section>
  <div className="flex justify-center px-4">
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
    <div className="relative w-full h-[50vh] md:h-full">
  <FlutedGlassEffect
    imageUrl="/images/GIFTCARD1.png"
    mode="mouse" 
    motionFactor={-50}
    rotationAngle={45}
    segments={60}
    overlayOpacity={50}
    style={{ width: "100%", height: "100%" }}
  />

        {/* <div className="shop-sectionslice">
          <div className="flex relative flex-col justify-center text-center items-center z-10">
            {slices.map((slice, index) => (
              <div
                key={slice.id}
                style={{
                  height: `${slice.containerHeight}px`,
                  overflow: "hidden",
                }}
              >
                <h1
                  style={{
                    fontFamily: "NeueHaasRoman",
                    fontSize: "100px",
                    color: "#0249FD",
                  }}
                >
                  SHOP
                </h1>
              </div>
            ))}
          </div>
        </div> */}
      </div>


      <div className="flex flex-col items-center justify-center px-12 h-[50vh] md:h-auto">
      {/* <div className="w-[64px]">
  <img src="https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c23233f1a330defe27c954_Icon%20Quality%20Pura.webp" />
</div> */}
        <div className="text-[12px] text-center font-neueroman uppercase mb-10 text-[#0249FD]">
          Shop smarter, smile brighter.
        </div>
        <h1 className="text-[12px] font-neueroman uppercase leading-tight max-w-[500px]">
        We’ve carefully curated a selection of premium products designed to elevate your 
      experience during treatment. From gentle yet effective whitening solutions to 
      comfort-enhancing essentials, each product is handpicked to support your journey 
      to a healthier, more confident smile. 
        </h1>
     
      </div>
    </section>
  </div>

 
</div>

  );
};

export default Hero;


;
