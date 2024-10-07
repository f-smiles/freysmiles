'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap-trial/SplitText";

gsap.registerPlugin(SplitText);

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const textRef = useRef(null);

  useEffect(() => {
    const transitionDuration = 1000;

    if (typeof window !== "undefined" && textRef.current) {
      const splitText = new SplitText(textRef.current, { type: "chars" });

      gsap.from(splitText.chars, {
        duration: 1,
        y: -200,
        stagger: 0.05,
        ease: "power3.out",
        delay: transitionDuration / 1000,
      });
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, []);

  return (
    <main className="relative">
      <div
        className={`fixed inset-0 bg-black z-50 transform transition-transform duration-1000 ${
          isTransitioning ? "translate-y-0" : "translate-y-full"
        }`}
      ></div>

      <div id="text">
        <div ref={textRef} className="h-[50vh] text-[22rem] uppercase text-center">
          Testimonials
        </div>
      </div>
    </main>
  );
}
