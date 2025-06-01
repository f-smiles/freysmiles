"use client";
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
          <div key={index} className="px-4 py-4 text-[12px] whitespace-nowrap">
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

  // useEffect(() => {
  //   const triggers: ScrollTrigger[] = [];

  //   gsap.utils.toArray<HTMLElement>(".img-container").forEach((container) => {
  //     const img = container.querySelector("img") as HTMLImageElement | null;

  //     if (img) {
  //       const trigger = gsap.fromTo(
  //         img,
  //         { yPercent: -20, ease: "none" },
  //         {
  //           yPercent: 20,
  //           ease: "none",
  //           scrollTrigger: {
  //             trigger: container,
  //             scrub: true,
  //           },
  //         }
  //       ).scrollTrigger as ScrollTrigger;

  //       triggers.push(trigger);
  //     }
  //   });

  //   return () => {
  //     triggers.forEach((trigger) => trigger.kill());
  //   };
  // }, []);
  return (
    <section className="w-full min-h-screen bg-[#E3B66F] text-white py-40">
      <div className="max-w-7xl justify-center items-center mx-auto flex flex-wrap md:flex-nowrap gap-16">
        <div className="w-full md:w-1/2">
          <div className="bg-white text-black overflow-hidden">
            <div className="relative">
              <img
                src="/images/cardtest.png"
                alt="Featured"
                className="w-full h-auto object-cover"
              />
              <span className="absolute top-4 left-4 font-neuehaas45 bg-gray-100 text-black px-3 py-1 text-xs rounded-full">
                NEW
              </span>
            </div>

            <div className="p-6">
              <p className="text-[18px] leading-[1.2] font-neuehaas45 text-gray-700 mb-4">
                Frey Smiles gift cards can be used toward any part of
                treatment—and they never expire.
              </p>
              <p className="text-[14px] leading-[1.5] font-neuehaas45 text-gray-700 mb-4">
                Send one digitally or choose a physical card.
              </p>
              <button className="font-neuehaas45 mt-4 inline-block bg-[#B7CFFF] text-[#363636] px-6 py-2 text-sm uppercase tracking-wide hover:bg-neutral-800 transition">
                Send A Card
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="text-center mb-8">
            <div className="text-center">
              <h2 className="text-[48px] font-neuehaas45 uppercase">THE</h2>
              <h2 className="text-[46px] font-sinistre mt-2">ESSENTIALS</h2>
              <h2 className="text-[48px] font-neuehaas45 uppercase mt-[6px]">
                EDIT
              </h2>
            </div>

            <div className="max-w-[400px] mx-auto mt-8">
              <p className="text-[11px] leading-[1.3] text-white font-khteka">
                We’ve curated a handful of products to elevate your routine—from
                effective whitening solutions to a few practical additions.
                Nothing extra.
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-center gap-6">
            <div className="w-1/2 min-w-0 flex flex-col bg-white text-black overflow-hidden">
              <img
                src="/images/shoptest1.png"
                alt="Card 1"
                className="w-full h-auto object-cover max-w-full"
              />
              <div className="p-4">
                <h4 className="font-neuehaas45 text-[14px] mb-2">
                  Ember Light Therapy
                </h4>
                <div className="flex justify-between text-[12px] text-gray-600 font-neuehaas45">
                  <a href="#" className="underline">
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            <div className="w-1/2 min-w-0 flex flex-col bg-white text-black overflow-hidden">
              <img
                src="/images/cutout.jpg"
                alt="Card 2"
                className="w-full h-auto object-cover max-w-full"
              />
              <div className="p-4">
                <h4 className="font-neuehaas45 text-[14px] mb-2">
                  How Whitening Works
                </h4>
                <div className="font-neuehaas45 flex justify-between text-[12px] text-gray-600">
                  <span>Date</span>
                  <a href="#" className="underline">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-10">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white" />
            <span className="font-neuehaas45 text-xs mt-2 underline">
              SCROLL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
