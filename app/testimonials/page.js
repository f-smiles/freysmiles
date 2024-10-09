'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap-trial/SplitText";

gsap.registerPlugin(SplitText);

export default function Home() {
  const textRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const transitionDuration = 1000;

    if (textRef.current) {
      const splitText = new SplitText(textRef.current, { type: "chars" });

      gsap.from(splitText.chars, {
        duration: 1,
        y: -100,
        stagger: 0.05,
        ease: "power3.out",
        delay: transitionDuration / 1000,
        onComplete: () => {
          const handleScroll = () => {
            const logo = textRef.current;
            const scroll = document.scrollingElement.scrollTop;
            const maxScroll = 300; 
            const minScale = 0.5;

            let scale = 1 - Math.min(scroll / maxScroll, 1); 

            if (scale < minScale) {
              scale = minScale;
            }

            logo.style.transform = `scale(${scale})`;
            logo.style.transformOrigin = "center";
          };

          window.addEventListener('scroll', handleScroll);

          return () => {
            window.removeEventListener('scroll', handleScroll);
          };
        },
      });
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, []);

  return (
    <main className="relative h-[200vh]">
      <div
        className={`fixed inset-0 bg-black z-50 transform transition-transform duration-1000 ${
          isTransitioning ? "translate-y-0" : "translate-y-full"
        }`}
      ></div>

      <div className="h-screen flex justify-center items-center">
        <div
          ref={textRef}
          className="text-[24vw] uppercase whitespace-nowrap leading-none absolute inset-0 flex justify-center items-center"
          style={{ transformOrigin: "center center", position: "fixed" }}
        >
          Testimonials
        </div>
      </div>
    </main>
  );
}
