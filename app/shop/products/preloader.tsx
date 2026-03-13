"use client"

import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import Lenis from "@studio-freight/lenis";
import { useRef, useEffect, useMemo, useLayoutEffect, useState } from "react";

gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "0.9, 0, 0.1, 1");

const Preloader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const svgRef = useRef(null);
  const counterTextRef = useRef(null);

  const animationRefs = useRef([]);

  useEffect(() => {
    requestAnimationFrame(() => {
      initializeAnimations();
    });

    return () => {
      animationRefs.current.forEach((anim) => {
        if (anim && anim.kill) anim.kill();
      });
      animationRefs.current = [];
    };
  }, []);

  const initializeAnimations = () => {
    const textPaths = document.querySelectorAll(".wheelloader svg textPath");
    if (textPaths.length === 0) {
      return;
    }

    const startTextLengths = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("textLength")),
    );

    const startTextOffsets = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("startOffset")),
    );

    const targetTextLengths = [3800, 3600, 3400, 3200, 3000, 3200, 2600, 2400];
    const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];

    const maxOrbitRadius = orbitRadii[0];
    const maxAnimDuration = 1.25;
    const minAnimDuration = 1;

    textPaths.forEach((textPath, index) => {
      const animationDelay = (textPaths.length - 1 - index) * 0.1;
      const currentOrbitRadius = orbitRadii[index];

      const currentDuration =
        minAnimDuration +
        (currentOrbitRadius / maxOrbitRadius) *
          (maxAnimDuration - minAnimDuration);

      const pathLength = 2 * Math.PI * currentOrbitRadius * 3;
      const textLengthIncrease =
        targetTextLengths[index] - startTextLengths[index];
      const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
      const targetOffset = startTextOffsets[index] - offsetAdjustment;

      const anim = gsap.to(textPath, {
        attr: {
          textLength: targetTextLengths[index],
          startOffset: targetOffset + "%",
        },
        duration: currentDuration,
        delay: animationDelay,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0,
      });

      animationRefs.current.push(anim);
    });

    let loaderRotation = 0;

    function animateRotation() {
      const spinDirection = Math.random() < 0.5 ? 1 : -1;
      loaderRotation += 25 * spinDirection;

      const anim = gsap.to(svgRef.current, {
        rotation: loaderRotation,
        duration: 2,
        ease: "power2.inOut",
        onComplete: animateRotation,
      });

      animationRefs.current.push(anim);
    }

    animateRotation();

    const count = { value: 0 };

    const counterAnim = gsap.to(count, {
      value: 100,
      duration: 4,
      delay: 1,
      ease: "power1.out",
      onUpdate: function () {
        if (counterTextRef.current) {
          counterTextRef.current.textContent = Math.floor(count.value);
        }
      },
      onComplete: function () {
        const opacityAnim = gsap.to(".counter", {
          opacity: 0,
          duration: 0.5,
          delay: 1,
        });
        animationRefs.current.push(opacityAnim);
      },
    });

    animationRefs.current.push(counterAnim);

    const orbitTextElements = document.querySelectorAll(".orbit-text");
    if (orbitTextElements.length > 0) {
      gsap.set(orbitTextElements, { opacity: 0 });

      const orbitTextsReversed = Array.from(orbitTextElements).reverse();

      const fadeInAnim = gsap.to(orbitTextsReversed, {
        opacity: 1,
        duration: 0.75,
        stagger: 0.125,
        ease: "power1.out",
      });

      animationRefs.current.push(fadeInAnim);

      const fadeOutAnim = gsap.to(orbitTextsReversed, {
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        delay: 6,
        ease: "power1.out",
        onComplete: function () {
          const removeLoaderAnim = gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 1,
onComplete: () => {
  requestAnimationFrame(() => {
    onComplete();
  });
}
          });

          animationRefs.current.push(removeLoaderAnim);
        },
      });

      animationRefs.current.push(fadeOutAnim);
    }
  };

  return (
    <>
    
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100svh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
       background: `
radial-gradient(
  55% 55% at 70% 35%,
  rgba(255, 255, 0, 0.95) 0%,
  rgba(255, 255, 0, 0.6) 20%,
  rgba(255, 255, 0, 0.25) 40%,
  rgba(255, 255, 0, 0.08) 60%,
  rgba(255, 255, 0, 0.0) 75%
),
radial-gradient(
  70% 60% at 25% 65%,
  rgba(255, 255, 160, 0.5) 0%,
  rgba(255, 255, 160, 0.2) 40%,
  rgba(255, 255, 160, 0.0) 70%
),
#f6f6f2
`,
          color: "#0f0f0f",
          willChange: "opacity",
          zIndex: 9999,
        }}
        className="wheelloader"
        ref={loaderRef}
      >
        
        <svg
          ref={svgRef}
          viewBox="-425 -425 1850 1850"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="wheelloader-orbit-1"
            d="M 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 499.99,-275"
          />
          <path
            id="wheelloader-orbit-2"
            d="M 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 499.99,-200"
          />
          <path
            id="wheelloader-orbit-3"
            d="M 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 499.99,-125"
          />
          <path
            id="wheelloader-orbit-4"
            d="M 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 499.99,-50"
          />
          <path
            id="wheelloader-orbit-5"
            d="M 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 499.99,25"
          />
          <path
            id="wheelloader-orbit-6"
            d="M 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 499.99,100"
          />
          <path
            id="wheelloader-orbit-7"
            d="M 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 499.99,175"
          />
          <path
            id="wheelloader-orbit-8"
            d="M 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 499.99,250"
          />
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-1"
              startOffset="30%"
              textLength="280"
            >
              Shop
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-2"
              startOffset="31%"
              textLength="270"
            >
              Your
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-3"
              startOffset="33%"
              textLength="300"
            >
              Smile
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-4"
              startOffset="32%"
              textLength="280"
            >
              Here
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-5"
              startOffset="30%"
              textLength="250"
            >
              Buy
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-6"
              startOffset="31%"
              textLength="380"
            >
              Something
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-7"
              startOffset="33%"
              textLength="180"
            >
              Or
            </textPath>
          </text>
          <text className="orbit-text">
            <textPath
              href="#wheelloader-orbit-8"
              startOffset="32%"
              textLength="300"
            >
              Don't
            </textPath>
          </text>
        </svg>

        <div className="counter">
          <p className="font-canelathin" ref={counterTextRef}>
            0
          </p>
        </div>
      </div>
    </>
  );
};
export default Preloader;