"use client";
import {
  Sphere,
  OrbitControls,
  Environment,
  shaderMaterial,
  useTexture,
  OrthographicCamera,
  Clouds,
  Cloud,
  CameraControls,
  Sky as SkyImpl,
  StatsGl,
} from "@react-three/drei";
import { useControls } from "leva";
import Link from "next/link";
import "./style.css";
import { gsap } from "gsap";
import {
  CustomEase,
  SplitText,
  Flip,
  ScrollTrigger,
  ScrambleTextPlugin,
} from "gsap/all";
import Lenis from "@studio-freight/lenis";
import React, {
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import {
  ShaderMaterial,
  PlaneGeometry,
  WebGLRenderTarget,
  Vector2,
} from "three";
import { VFX } from "@vfx-js/core";
import { useRouter, usePathname } from "next/navigation";

gsap.registerPlugin(
  CustomEase,
  SplitText,
  Flip,
  ScrollTrigger,
  ScrambleTextPlugin,
);

const ScrambleText = ({
  text,
  className,
  scrambleOnLoad = true,
  charsType = "default", // 'default' | 'numbers' | 'letters'
}) => {
  const scrambleRef = useRef(null);
  const originalText = useRef(text);

  const charSets = {
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    numbers: "0123456789",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  };

  const EASE_EXPO = "cubic-bezier(.87, 0, .13, 1)";
  const EASE_SMOOTH = "cubic-bezier(.76, 0, .24, 1)";

  const scrambleAnimation = () => {
    return new Promise((resolve) => {
      const el = scrambleRef.current;

      const tl = gsap.timeline({
        onComplete: resolve,
      });

      tl.set(el, {
        color: "rgba(0,0,0,0.25)",
      });

      tl.to(
        el,
        {
          duration: 1.4, 
          scrambleText: {
            text: originalText.current,
            characters: charSets[charsType],
            speed: gsap.utils.random(0.4, 0.9), 
            revealDelay: 0.2, 
          },
          ease: EASE_EXPO,
        },
        0,
      );

      tl.to(
        el,
        {
          color: "rgba(0,0,0,1)",
          duration: 1.1, 
          ease: EASE_SMOOTH,
        },
        0.2,
      );

      tl.to({}, { duration: 0.4 });

      tl.to(el, {
        color: "rgba(0,0,0,0.25)",
        duration: 1.2,
        ease: EASE_SMOOTH,
      });
    });
  };

  useEffect(() => {
    const element = scrambleRef.current;
    if (!element) return;

    let isActive = true;

    const runRandomScramble = async () => {
      while (isActive) {
        // random delay between cycles
        const delay = gsap.utils.random(1.2, 4.5);

        await new Promise((res) => setTimeout(res, delay * 1000));

        if (!isActive) return;

        await scrambleAnimation();
      }
    };

    // initial state (important so it doesn't flash)
    gsap.set(element, {
      textContent: originalText.current,
    });

    runRandomScramble();

    return () => {
      isActive = false;
    };
  }, [charsType]);
  return (
    <span
      ref={scrambleRef}
      className={`scramble-text inline-block ${className || ""}`}
      style={{ minWidth: `${text.length}ch` }}
    >
      {text}
    </span>
  );
};
// CustomEase.create("hop", "0.9, 0, 0.1, 1");

// const Preloader = ({ onComplete }) => {
//   const loaderRef = useRef(null);
//   const svgRef = useRef(null);
//   const counterTextRef = useRef(null);

//   const animationRefs = useRef([]);

//   useEffect(() => {
//     requestAnimationFrame(() => {
//       initializeAnimations();
//     });

//     return () => {
//       animationRefs.current.forEach((anim) => {
//         if (anim && anim.kill) anim.kill();
//       });
//       animationRefs.current = [];
//     };
//   }, []);

//   const initializeAnimations = () => {
//     const textPaths = document.querySelectorAll(".wheelloader svg textPath");
//     if (textPaths.length === 0) {
//       return;
//     }

//     const startTextLengths = Array.from(textPaths).map((tp) =>
//       parseFloat(tp.getAttribute("textLength")),
//     );

//     const startTextOffsets = Array.from(textPaths).map((tp) =>
//       parseFloat(tp.getAttribute("startOffset")),
//     );

//     const targetTextLengths = [3800, 3600, 3400, 3200, 3000, 3200, 2600, 2400];
//     const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];

//     const maxOrbitRadius = orbitRadii[0];
//     const maxAnimDuration = 1.25;
//     const minAnimDuration = 1;

//     textPaths.forEach((textPath, index) => {
//       const animationDelay = (textPaths.length - 1 - index) * 0.1;
//       const currentOrbitRadius = orbitRadii[index];

//       const currentDuration =
//         minAnimDuration +
//         (currentOrbitRadius / maxOrbitRadius) *
//           (maxAnimDuration - minAnimDuration);

//       const pathLength = 2 * Math.PI * currentOrbitRadius * 3;
//       const textLengthIncrease =
//         targetTextLengths[index] - startTextLengths[index];
//       const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
//       const targetOffset = startTextOffsets[index] - offsetAdjustment;

//       const anim = gsap.to(textPath, {
//         attr: {
//           textLength: targetTextLengths[index],
//           startOffset: targetOffset + "%",
//         },
//         duration: currentDuration,
//         delay: animationDelay,
//         ease: "power2.inOut",
//         yoyo: true,
//         repeat: -1,
//         repeatDelay: 0,
//       });

//       animationRefs.current.push(anim);
//     });

//     let loaderRotation = 0;

//     function animateRotation() {
//       const spinDirection = Math.random() < 0.5 ? 1 : -1;
//       loaderRotation += 25 * spinDirection;

//       const anim = gsap.to(svgRef.current, {
//         rotation: loaderRotation,
//         duration: 2,
//         ease: "power2.inOut",
//         onComplete: animateRotation,
//       });

//       animationRefs.current.push(anim);
//     }

//     animateRotation();

//     const count = { value: 0 };

//     const counterAnim = gsap.to(count, {
//       value: 100,
//       duration: 4,
//       delay: 1,
//       ease: "power1.out",
//       onUpdate: function () {
//         if (counterTextRef.current) {
//           counterTextRef.current.textContent = Math.floor(count.value);
//         }
//       },
//       onComplete: function () {
//         const opacityAnim = gsap.to(".counter", {
//           opacity: 0,
//           duration: 0.5,
//           delay: 1,
//         });
//         animationRefs.current.push(opacityAnim);
//       },
//     });

//     animationRefs.current.push(counterAnim);

//     const orbitTextElements = document.querySelectorAll(".orbit-text");
//     if (orbitTextElements.length > 0) {
//       gsap.set(orbitTextElements, { opacity: 0 });

//       const orbitTextsReversed = Array.from(orbitTextElements).reverse();

//       const fadeInAnim = gsap.to(orbitTextsReversed, {
//         opacity: 1,
//         duration: 0.75,
//         stagger: 0.125,
//         ease: "power1.out",
//       });

//       animationRefs.current.push(fadeInAnim);

//       const fadeOutAnim = gsap.to(orbitTextsReversed, {
//         opacity: 0,
//         duration: 0.75,
//         stagger: 0.1,
//         delay: 6,
//         ease: "power1.out",
//         onComplete: function () {
//           const removeLoaderAnim = gsap.to(loaderRef.current, {
//             opacity: 0,
//             duration: 1,
// onComplete: () => {
//   requestAnimationFrame(() => {
//     onComplete();
//   });
// }
//           });

//           animationRefs.current.push(removeLoaderAnim);
//         },
//       });

//       animationRefs.current.push(fadeOutAnim);
//     }
//   };

//   return (
//     <>

//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100svh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//     background: `
// radial-gradient(
//   55% 55% at 70% 35%,
//   rgba(255, 0, 200, 0.95) 0%,
//   rgba(255, 0, 200, 0.6) 20%,
//   rgba(255, 0, 200, 0.25) 40%,
//   rgba(255, 0, 200, 0.08) 60%,
//   rgba(255, 0, 200, 0.0) 75%
// ),
// radial-gradient(
//   70% 60% at 25% 65%,
//   rgba(255, 20, 200, 0.5) 0%,
//   rgba(255, 20, 200, 0.2) 40%,
//   rgba(255, 20, 200, 0.0) 70%
// ),
// #f6f6f2
// `,
//           color: "#0f0f0f",
//           willChange: "opacity",
//           zIndex: 9999,
//         }}
//         className="wheelloader"
//         ref={loaderRef}
//       >

//         <svg
//           ref={svgRef}
//           viewBox="-425 -425 1850 1850"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             id="wheelloader-orbit-1"
//             d="M 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 499.99,-275"
//           />
//           <path
//             id="wheelloader-orbit-2"
//             d="M 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 499.99,-200"
//           />
//           <path
//             id="wheelloader-orbit-3"
//             d="M 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 499.99,-125"
//           />
//           <path
//             id="wheelloader-orbit-4"
//             d="M 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 499.99,-50"
//           />
//           <path
//             id="wheelloader-orbit-5"
//             d="M 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 499.99,25"
//           />
//           <path
//             id="wheelloader-orbit-6"
//             d="M 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 499.99,100"
//           />
//           <path
//             id="wheelloader-orbit-7"
//             d="M 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 499.99,175"
//           />
//           <path
//             id="wheelloader-orbit-8"
//             d="M 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 499.99,250"
//           />
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-1"
//               startOffset="30%"
//               textLength="280"
//             >
//               Shop
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-2"
//               startOffset="31%"
//               textLength="270"
//             >
//               Your
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-3"
//               startOffset="33%"
//               textLength="300"
//             >
//               Smile
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-4"
//               startOffset="32%"
//               textLength="280"
//             >
//               Here
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-5"
//               startOffset="30%"
//               textLength="250"
//             >
//               Buy
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-6"
//               startOffset="31%"
//               textLength="380"
//             >
//               Something
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-7"
//               startOffset="33%"
//               textLength="180"
//             >
//               Or
//             </textPath>
//           </text>
//           <text className="orbit-text">
//             <textPath
//               href="#wheelloader-orbit-8"
//               startOffset="32%"
//               textLength="300"
//             >
//               Don't
//             </textPath>
//           </text>
//         </svg>

//         <div className="counter">
//           <p className="font-canelathin" ref={counterTextRef}>
//             0
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Preloader;

const FlameTrail = ({ children }) => {
  const containerRef = useRef(null);
  const trailRef = useRef([]);
  const isSpawningRef = useRef(false);
  const activeTimeoutsRef = useRef([]);

  const mouseState = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const flags = useRef({ isMoving: false, isCursorInContainer: false });
  const moveTimeoutRef = useRef(null);

  const config = {
    imageLifespan: 600,
    removalDelay: 16,
    inDuration: 600,
    outDuration: 1200,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    autoSpawnInterval: 5000,
    autoSpawnImageCount: 12,
    trailSpacing: 22,
    staggerDelay: 45,
    baseImageSize: 160,
    minImageSize: 60,
    maxImageSize: 200,
    mouseThreshold: 40,
    mobileBreakpoint: 768,
  };

  const images = [
    "/images/shop/giftcardmockup.png",
    "/images/shop/caracarathumb.png",
    "/images/shop/caracocomockup.png",
    "/images/shop/zimawhite.png",
    "/images/shop/blackinviscase.png",
    "/images/shop/15x12cocomint.png",
    "/images/shopisopen.png",
    "/images/shoptest1.png",
    "/images/dentalwax4.png",
    "/images/fscards.png",
    "/images/shop/pinkalignercase.png",
    "/images/shop/greenalignercase.png",
    "/images/cardsonpalm.png",
    "/images/shop/caraorange.png",
  ];

  let imageIndex = 0;
  const spawnIntervalRef = useRef(null);
  const isMobileRef = useRef(false);

  const checkIsMobile = useCallback(() => {
    return (
      window.innerWidth <= config.mobileBreakpoint ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  const getRandomPosition = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const padding = 60;
    return {
      x: rect.left + padding + Math.random() * (rect.width - padding * 2),
      y: rect.top + padding + Math.random() * (rect.height - padding * 2),
    };
  }, []);

  const getEdgeSafePosition = useCallback((x, y, size) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    return {
      x: Math.max(rect.left + size / 2, Math.min(rect.right - size / 2, x)),
      y: Math.max(rect.top + size / 2, Math.min(rect.bottom - size / 2, y)),
    };
  }, []);

  const createImage = useCallback(
    (
      x,
      y,
      speed = 0.5,
      customRotation = null,
      sizeMultiplier = 1,
      index = 0,
      totalCount = 1,
    ) => {
      const imageSrc = images[imageIndex % images.length];
      imageIndex = (imageIndex + 1) % images.length;

      const progress = index / totalCount;
      let size =
        config.minImageSize +
        (config.maxImageSize - config.minImageSize) * speed;
      size = size * sizeMultiplier * (1 - progress * 0.2);

      const img = document.createElement("img");
      img.className = "trail-img";

      let rot;
      if (customRotation !== null) {
        rot =
          customRotation +
          Math.sin(progress * Math.PI) * 15 +
          (Math.random() - 0.5) * 10;
      } else {
        const rotFactor = 1 + speed * 3;
        rot = (Math.random() - 0.5) * 30 * rotFactor;
      }

      img.src = imageSrc;
      img.width = img.height = size;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const safePos = getEdgeSafePosition(x, y, size);
      const left = safePos.x - rect.left;
      const top = safePos.y - rect.top;

      img.style.cssText = `
      position: absolute;
      left: ${left}px;
      top: ${top}px;
      transform: translate(-50%, -50%) rotate(${rot}deg) scale(0);
      transition: transform ${config.inDuration}ms ${config.inEasing};
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      will-change: transform;
    `;

      containerRef.current.appendChild(img);

      img.offsetHeight;
      requestAnimationFrame(() => {
        img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
      });

      trailRef.current.push({
        element: img,
        rotation: rot,
        removeTime: Date.now() + config.imageLifespan,
      });
    },
    [getEdgeSafePosition],
  );

  const createAutoFlameTrail = useCallback(() => {
    if (isSpawningRef.current || !containerRef.current || !isMobileRef.current)
      return;

    isSpawningRef.current = true;
    const startPos = getRandomPosition();
    const directionAngle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 0.6;

    for (let i = 0; i < config.autoSpawnImageCount; i++) {
      const distance = i * config.trailSpacing;
      const curveOffset = Math.sin(i * 0.3) * 12;
      const perpAngle = directionAngle + Math.PI / 2;

      const timeoutId = setTimeout(() => {
        const x =
          startPos.x +
          Math.cos(directionAngle) * distance +
          Math.cos(perpAngle) * curveOffset;
        const y =
          startPos.y +
          Math.sin(directionAngle) * distance +
          Math.sin(perpAngle) * curveOffset;
        const sizeMultiplier = 1 - (i / config.autoSpawnImageCount) * 0.3;
        const imageSpeed =
          speed * (0.6 + (i / config.autoSpawnImageCount) * 0.4);
        const rotation =
          directionAngle * (180 / Math.PI) + Math.sin(i * 0.5) * 15;

        createImage(
          x,
          y,
          imageSpeed,
          rotation,
          sizeMultiplier,
          i,
          config.autoSpawnImageCount,
        );

        if (i === config.autoSpawnImageCount - 1) {
          setTimeout(() => {
            isSpawningRef.current = false;
          }, 200);
        }
      }, i * config.staggerDelay);
      activeTimeoutsRef.current.push(timeoutId);
    }
  }, [getRandomPosition, createImage]);

  // Desktop: Cursor trail
  const createCursorTrail = useCallback(() => {
    if (
      !flags.current.isCursorInContainer ||
      !flags.current.isMoving ||
      isMobileRef.current
    )
      return;

    const dx = mouseState.current.x - mouseState.current.lastX;
    const dy = mouseState.current.y - mouseState.current.lastY;
    const distance = Math.hypot(dx, dy);

    if (distance > config.mouseThreshold) {
      const directionAngle = Math.atan2(dy, dx);
      const speed = Math.min(distance / 50, 1);
      const trailLength = Math.min(Math.floor(speed * 8), 5);

      for (let i = 0; i < trailLength; i++) {
        const timeoutId = setTimeout(() => {
          const backX = mouseState.current.x - dx * (i * 0.15);
          const backY = mouseState.current.y - dy * (i * 0.15);
          const imageSpeed = speed * (1 - i * 0.1);
          const rotation =
            directionAngle * (180 / Math.PI) + (Math.random() - 0.5) * 30;
          const sizeMultiplier = 1 - i * 0.1;

          createImage(
            backX,
            backY,
            imageSpeed,
            rotation,
            sizeMultiplier,
            i,
            trailLength,
          );
        }, i * config.staggerDelay);
        activeTimeoutsRef.current.push(timeoutId);
      }

      mouseState.current.lastX = mouseState.current.x;
      mouseState.current.lastY = mouseState.current.y;
    }
  }, [createImage]);

  const removeOldImages = useCallback(() => {
    const now = Date.now();
    while (
      trailRef.current.length > 0 &&
      now >= trailRef.current[0].removeTime
    ) {
      const imgObj = trailRef.current.shift();
      if (imgObj.element && imgObj.element.parentNode) {
        imgObj.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
        imgObj.element.style.transform = `translate(-50%, -50%) rotate(${imgObj.rotation + 360}deg) scale(0)`;
        setTimeout(() => imgObj.element.remove(), config.outDuration);
      }
    }
  }, []);

  const setupForDesktop = useCallback(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      mouseState.current.x = e.clientX;
      mouseState.current.y = e.clientY;
      flags.current.isCursorInContainer =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (flags.current.isCursorInContainer) {
        flags.current.isMoving = true;
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = setTimeout(() => {
          flags.current.isMoving = false;
        }, 100);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const setupForMobile = useCallback(() => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);

    setTimeout(() => createAutoFlameTrail(), 500);
    spawnIntervalRef.current = setInterval(
      createAutoFlameTrail,
      config.autoSpawnInterval,
    );
  }, [createAutoFlameTrail]);

  const handleResize = useCallback(() => {
    const wasMobile = isMobileRef.current;
    const isNowMobile = checkIsMobile();

    if (wasMobile !== isNowMobile) {
      isMobileRef.current = isNowMobile;

      trailRef.current.forEach((t) => t.element?.remove());
      trailRef.current = [];
      activeTimeoutsRef.current.forEach(clearTimeout);
      activeTimeoutsRef.current = [];
      isSpawningRef.current = false;

      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }

      if (isNowMobile) {
        setupForMobile();
      }
    }
  }, [checkIsMobile, setupForMobile]);

  useEffect(() => {
    if (!containerRef.current) return;

    isMobileRef.current = checkIsMobile();
    const cleanupDesktop = setupForDesktop();

    if (isMobileRef.current) {
      setupForMobile();
    }

    window.addEventListener("resize", handleResize);

    let animationId;
    const animate = () => {
      if (!isMobileRef.current) {
        createCursorTrail();
      }
      removeOldImages();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cleanupDesktop();
      window.removeEventListener("resize", handleResize);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (animationId) cancelAnimationFrame(animationId);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      activeTimeoutsRef.current.forEach(clearTimeout);
      trailRef.current.forEach((t) => t.element?.remove());
    };
  }, [
    setupForDesktop,
    setupForMobile,
    handleResize,
    createCursorTrail,
    removeOldImages,
  ]);

  return (
    <div ref={containerRef} className="flame-trail-container">
      {children}
    </div>
  );
};
function Sky() {
  const ref = useRef();
  const cloud0 = useRef();
  

  const config = {
    seed: 1,
    segments: 20,
    volume: 6,
    opacity: 0.8,
    fade: 10,
    growth: 4,
    speed: 0.1,
  };
  
  const color = "white";
  const x = 6;
  const y = 1;
  const z = 1;
  
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    ref.current.rotation.y = Math.cos(t * 0.1) * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.04;
    cloud0.current.rotation.y -= delta * 0.1;
  });
  
  return (
    <>
      <SkyImpl />
      <group ref={ref}>
        <Clouds
          ref={cloud0}
          {...config}
          bounds={[x, y, z]}
          position={[0, -6, -4]}
          color={color}
        >
          <Cloud ref={cloud0} {...config} bounds={[x, y, z]} color={color} />
          <Cloud
            concentrate="outside"
            growth={100}
            color="#ffccdd"
            opacity={1.25}
            seed={0.3}
            bounds={200}
            volume={200}
          />
        </Clouds>
      </group>
    </>
  );
}
CustomEase.create("slideshow-wipe", "0.625, 0.05, 0, 1");

const mobileSlidesData = [
  {
    variantId: 31,
    title: "Ember",
    subtitle: "Light technology",
    full: "/images/shop/emberfull.png",
    thumbnail: "/images/shop/embertaketwo.png",
  },
  {
    variantId: 32,
    title: "Cocofloss",
    subtitle: "Cara Cara Orange",
    description: "Woven Floss • Citrus",
    full: "/images/shop/caracocomockupfull.png",
    thumbnail: "/images/shop/caracarathumb.png",
  },
  {
    variantId: 33,
    title: "Cocofloss",
    subtitle: "Strawberry",
    description: "Woven Floss • Sweet Berry",
    full: "/images/shop/strawberryfull.png",
    thumbnail: "/images/shop/15x12cocostrawberry.png",
  },
  {
    variantId: 34,
    title: "Cocofloss",
    subtitle: "Mint",
    full: "/images/shop/mintflossfull.png",
    description: "Woven Floss • Crisp Mint",
    thumbnail: "/images/shop/mintflossfull.png",
  },
  {
    variant: null,
    title: "Gift Card",
    subtitle: "The perfect gift",
    description: "Digital Card • Any Amount",
    full: "/images/shop/giftcardmockupfull.png",
    thumbnail: "/images/giftcardmockup.png",
  },
  {
    variantId: 43,
    title: "Poladay 9.5%",
    subtitle: "At-home whitening",
    full: "/images/shop/poladay95.png",
    description: "Hydrogen Peroxide Whitening",
    thumbnail: "/images/poladaymockup.png",
  },
  {
    variantId: 44,
    title: "Poladay 35%",
    subtitle: "Professional strength",
    full: "/images/shop/pola35full.png",
    description: "Carbamide Peroxide",
    thumbnail: "/images/shop/pola35full.png",
  },
  {
    variantId: 37,
    title: "Aligner Cases",
    subtitle: "Choose your color",
    description: "Everyday Case • Color Options",
    full: "/images/shop/whiteinvisscenefull.png",
    thumbnail: "/images/shop/whiteinvisscene.png",
  },
  {
    variantId: 41,
    title: "Zima Dental Pod",
    subtitle: "Daily Clean • Ultrasonic",
    description: "A cleaner routine",
    full: "/images/shop/zimawhitefull.png",
    thumbnail: "/images/shop/zimawhitefull.png",
  },
];

const LiquidGrid = () => {
  const gridRange = 8;
  const rotations = [-270, -180, -90, 0, 90, 180, 270];

  const boxes = useMemo(() => {
    const totalBoxes = gridRange * gridRange;
    return Array.from({ length: totalBoxes }, () => ({
      delay: Math.floor(Math.random() * 5000),
      rotation: rotations[Math.floor(Math.random() * rotations.length)],
    }));
  }, [gridRange, rotations]);

  return (
    <>
      <div
        className="liquid-grid-container"
        style={
          {
            color: "#E6007E",
            "--grid-range": gridRange,
            "--grid-size": "40vmin",
          } as React.CSSProperties
        }
      >
        {boxes.map((box, index) => (
          <span
            key={index}
            className="liquid-grid-cell"
            style={{
              "--anim-delay": `-${box.delay}ms`,
              transform: `rotate(${box.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <svg className="liquid-grid-svg">
        <filter id="liquid">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
        </filter>
      </svg>
    </>
  );
};
const slidesData = [
  {
    variantId: 31,
    title: "Ember",
    subtitle: "Light technology",
    full: "/images/shop/emberfull.png",
    thumbnail: "/images/shop/embertaketwo.png",
  },
  {
    variantId: 32,
    title: "Cocofloss",
    subtitle: "Cara Cara Orange",
    description: "Woven Floss • Citrus",
    full: "/images/shop/caracocomockupfull.png",
    thumbnail: "/images/shop/caracarathumb.png",
  },
  {
    variantId: 33,
    title: "Cocofloss",
    subtitle: "Strawberry",
    description: "Woven Floss • Sweet Berry",
    full: "/images/shop/strawberryfull.png",
    thumbnail: "/images/shop/15x12cocostrawberry.png",
  },
  {
    variantId: 34,
    title: "Cocofloss",
    subtitle: "Mint",
    full: "/images/shop/mintflossfull.png",
    description: "Woven Floss • Crisp Mint",
    thumbnail: "/images/shop/mintflossfull.png",
  },
  {
    variant: null,
    title: "Gift Card",
    subtitle: "The perfect gift",
    description: "Digital Card • Any Amount",
    full: "/images/shop/giftcardmockupfull.png",
    thumbnail: "/images/giftcardmockup.png",
  },
  {
    variantId: 43,
    title: "Poladay 9.5%",
    subtitle: "At-home whitening",
    full: "/images/shop/poladay95.png",
    description: "Hydrogen Peroxide Whitening",
    thumbnail: "/images/poladaymockup.png",
  },
  {
    variantId: 44,
    title: "Poladay 35%",
    subtitle: "Professional strength",
    full: "/images/shop/pola35full.png",
    description: "Carbamide Peroxide",
    thumbnail: "/images/shop/pola35full.png",
  },
  {
    variantId: 37,
    title: "Aligner Cases",
    subtitle: "Choose your color",
    description: "Everyday Case • Color Options",
    full: "/images/shop/whiteinvisscenefull.png",
    thumbnail: "/images/shop/whiteinvisscene.png",
  },
  {
    variantId: 41,
    title: "Zima Dental Pod",
    subtitle: "Daily Clean • Ultrasonic",
    description: "A cleaner routine",
    full: "/images/shop/zimawhitefull.png",
    thumbnail: "/images/shop/zimawhitefull.png",
  },
  {
    variantId: 31,
    title: "Ember",
    subtitle: "Light technology",
    full: "/images/shop/emberfull.png",
    thumbnail: "/images/shop/embertaketwo.png",
  },
  {
    variantId: 32,
    title: "Cocofloss",
    subtitle: "Cara Cara Orange",
    description: "Woven Floss • Citrus",
    full: "/images/shop/caracocomockupfull.png",
    thumbnail: "/images/shop/caracarathumb.png",
  },
  {
    variantId: 33,
    title: "Cocofloss",
    subtitle: "Strawberry",
    description: "Woven Floss • Sweet Berry",
    full: "/images/shop/strawberryfull.png",
    thumbnail: "/images/shop/15x12cocostrawberry.png",
  },
  {
    variantId: 34,
    title: "Cocofloss",
    subtitle: "Mint",
    full: "/images/shop/mintflossfull.png",
    description: "Woven Floss • Crisp Mint",
    thumbnail: "/images/shop/mintflossfull.png",
  },
  {
    variant: null,
    title: "Gift Card",
    subtitle: "The perfect gift",
    description: "Digital Card • Any Amount",
    full: "/images/shop/giftcardmockupfull.png",
    thumbnail: "/images/giftcardmockup.png",
  },
  {
    variantId: 43,
    title: "Poladay 9.5%",
    subtitle: "At-home whitening",
    full: "/images/shop/poladay95.png",
    description: "Hydrogen Peroxide Whitening",
    thumbnail: "/images/poladaymockup.png",
  },
  {
    variantId: 44,
    title: "Poladay 35%",
    subtitle: "Professional strength",
    full: "/images/shop/pola35full.png",
    description: "Carbamide Peroxide",
    thumbnail: "/images/shop/pola35full.png",
  },
  {
    variantId: 37,
    title: "Aligner Cases",
    subtitle: "Choose your color",
    description: "Everyday Case • Color Options",
    full: "/images/shop/whiteinvisscenefull.png",
    thumbnail: "/images/shop/whiteinvisscene.png",
  },
  {
    variantId: 41,
    title: "Zima Dental Pod",
    subtitle: "Daily Clean • Ultrasonic",
    description: "A cleaner routine",
    full: "/images/shop/zimawhitefull.png",
    thumbnail: "/images/shop/zimawhitefull.png",
  },
  {
    variantId: 31,
    title: "Ember",
    subtitle: "Light technology",
    full: "/images/shop/emberfull.png",
    thumbnail: "/images/shop/embertaketwo.png",
  },
  {
    variantId: 32,
    title: "Cocofloss",
    subtitle: "Cara Cara Orange",
    description: "Woven Floss • Citrus",
    full: "/images/shop/caracocomockupfull.png",
    thumbnail: "/images/shop/caracarathumb.png",
  },
  {
    variantId: 33,
    title: "Cocofloss",
    subtitle: "Strawberry",
    description: "Woven Floss • Sweet Berry",
    full: "/images/shop/strawberryfull.png",
    thumbnail: "/images/shop/15x12cocostrawberry.png",
  },
  {
    variantId: 34,
    title: "Cocofloss",
    subtitle: "Mint",
    full: "/images/shop/mintflossfull.png",
    description: "Woven Floss • Crisp Mint",
    thumbnail: "/images/shop/mintflossfull.png",
  },
  {
    variant: null,
    title: "Gift Card",
    subtitle: "The perfect gift",
    description: "Digital Card • Any Amount",
    full: "/images/shop/giftcardmockupfull.png",
    thumbnail: "/images/giftcardmockup.png",
  },
  {
    variantId: 43,
    title: "Poladay 9.5%",
    subtitle: "At-home whitening",
    full: "/images/shop/poladay95.png",
    description: "Hydrogen Peroxide Whitening",
    thumbnail: "/images/poladaymockup.png",
  },
  {
    variantId: 44,
    title: "Poladay 35%",
    subtitle: "Professional strength",
    full: "/images/shop/pola35full.png",
    description: "Carbamide Peroxide",
    thumbnail: "/images/shop/pola35full.png",
  },
  {
    variantId: 37,
    title: "Aligner Cases",
    subtitle: "Choose your color",
    description: "Everyday Case • Color Options",
    full: "/images/shop/whiteinvisscenefull.png",
    thumbnail: "/images/shop/whiteinvisscene.png",
  },
  {
    variantId: 41,
    title: "Zima Dental Pod",
    subtitle: "Daily Clean • Ultrasonic",
    description: "A cleaner routine",
    full: "/images/shop/zimawhitefull.png",
    thumbnail: "/images/shop/zimawhitefull.png",
  },
];



const CrispLoader = ({ onComplete, slidesData, variants }) => {

  if (!variants?.length) {
    console.warn(
    );
  }

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const loaderGroupsRef = useRef(null);
  const scaleUpMediaRef = useRef(null);
  const scaleDownImagesRef = useRef([]);
  const mainGroupRef = useRef(null);
  const contentRef = useRef(null);
  const headingContainerRef = useRef(null);
  const splitInstanceRef = useRef(null);

const allSlides = slidesData;
  console.log("slides:", allSlides.length);
  const centerIndex = Math.floor(allSlides.length / 2);

  const addToScaleDown = (el) => {
    if (el && !scaleDownImagesRef.current.includes(el)) {
      scaleDownImagesRef.current.push(el);
    }
  };

  useLayoutEffect(() => {
    if (!allSlides.length) {
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const heading = headingRef.current;
    const scaleUpMedia = scaleUpMediaRef.current;
    const scaleDownImages = scaleDownImagesRef.current;
    const mainGroup = mainGroupRef.current;
    const content = contentRef.current;
    const headingContainer = headingContainerRef.current;

    const images = scaleDownImages
      .map((el) => el?.querySelector("img"))
      .filter(Boolean);

    gsap.set(images, {
      scale: 1,
      force3D: true,
      transformOrigin: "center center",
      willChange: "transform",
      backfaceVisibility: "hidden",
    });

    if (scaleUpMedia) {
      gsap.set(scaleUpMedia, {
        force3D: true,
        willChange: "transform, width, height",
        backfaceVisibility: "hidden",
        transformOrigin: "center center",
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => {
        if (container) container.classList.remove("is--hidden");
      },
      onComplete: () => {
        if (scaleUpMedia) {
          gsap.set(scaleUpMedia, { willChange: "auto" });
        }
        images.forEach((img) => {
          gsap.set(img, { willChange: "auto" });
        });

        onComplete?.();
      },
    });

    if (heading) {
      if (headingContainer) {
        gsap.set(headingContainer, { overflow: "hidden" });
      }

      splitInstanceRef.current = new SplitText(heading, {
        type: "words",
        mask: "words",
      });

      gsap.set(splitInstanceRef.current.words, {
        yPercent: 110,
        opacity: 0,
      });
    }

    if (mainGroup) gsap.set(mainGroup, { xPercent: 100 });
    if (content) gsap.set(content, { scale: 0.8, opacity: 0, yPercent: 20 });

    const allLoaderImages = container.querySelectorAll(".crisp-loader__media");
    if (allLoaderImages.length) {
      gsap.set(allLoaderImages, { opacity: 1 });
    }

    if (mainGroup) {
      tl.to(mainGroup, { xPercent: 0, duration: 2 }, 0);
    }

    if (images.length) {
      tl.to(
        images,
        {
          scale: 0.5,
          opacity: 0.9,
          duration: 1.8,
          stagger: {
            each: 0.03,
            from: "edges",
            ease: "none",
          },
          ease: "none",
          force3D: true,
          overwrite: true,
        },
        "-=1.2",
      );
    }

    if (scaleUpMedia) {
      tl.to(
        scaleUpMedia,
        {
          width: "100vw",
          height: "100dvh",
          duration: 1.5,
          ease: "power2.inOut",
          force3D: true,
          overwrite: true,
        },
        "-=1.5",
      );

      tl.to(
        scaleUpMedia,
        {
          width: "5em",
          height: "5em",
          duration: 0.9,
          ease: "none",
          force3D: true,
          clearProps: "transform",
        },
        "+=0.05",
      );
    }

    if (allLoaderImages.length) {
      tl.to(
        allLoaderImages,
        {
          opacity: 0,
          duration: 0.6,
          stagger: { each: 0.02, from: "center" },
          onStart: () => {
            const loader = container.querySelector(".crisp-loader");
            if (loader) gsap.set(loader, { pointerEvents: "none" });
          },
          onComplete: () => {
            const loader = container.querySelector(".crisp-loader");
            if (loader) gsap.set(loader, { display: "none" });
          },
        },
        "-=0.1",
      );
    }

    if (content) {
      tl.to(
        content,
        {
          scale: 1,
          opacity: 1,
          yPercent: 0,
          duration: 0.8,
          ease: "expo.out",
        },
        "-=0.4",
      );
    }

    if (splitInstanceRef.current?.words.length) {
      tl.to(
        splitInstanceRef.current.words,
        {
          yPercent: 0,
          opacity: 1,
          stagger: { each: 0.06, from: "start" },
          ease: "back.out(0.6)",
          duration: 0.6,
        },
        "-=0.5",
      );
    }

    tl.call(
      () => {
        if (container) container.classList.remove("is--loading");
      },
      null,
      "+=0.1",
    );

    return () => {
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
      }
    };
  }, [onComplete, allSlides.length]);

  if (!allSlides.length) return null;

  return (
    <div ref={containerRef} className="crisp-header is--loading ">
      <div className="crisp-loader">
        <div className="crisp-loader__wrap">
          <div className="crisp-loader__groups" ref={loaderGroupsRef}>
            <div
              className="crisp-loader__group is--relative"
              ref={mainGroupRef}
            >
              {allSlides.map((image, idx) => {
                const isCenter = idx === centerIndex;
                return (
                  <div
                    key={`loader-${idx}`}
                    className={`crisp-loader__single ${isCenter ? "is--center" : ""}`}
                  >
                    <div
                      className={`crisp-loader__media ${isCenter ? "is--scaling" : ""}`}
                      ref={
                        isCenter
                          ? (el) => {
                              scaleUpMediaRef.current = el;
                            }
                          : (el) => addToScaleDown(el)
                      }
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.alt || image.title}
                        className={`crisp-loader__cover-img ${!isCenter ? "is--scale-down" : ""}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="crisp-loader__fade"></div>
          <div className="crisp-loader__fade is--duplicate"></div>
        </div>
      </div>
    </div>
  );
};

const ShopContent = ({ isReady, variants, slidesData }) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const focusStripRef = useRef(null);
  const sliderNavLeftRef = useRef(null);
  const sliderNavRightRef = useRef(null);
  const leftMaskRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const metricsRef = useRef(null);
  const scrollWrapRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);

  const allSlides = useMemo(() => {
    if (!variants?.length || !slidesData?.length) return [];
    return slidesData.map((slide) => {
      const variant = variants.find((v) => v.id === slide.variantId);
      if (!variant && slide.variantId) {
        console.warn("No match for variantId:", slide.variantId);
      }
      return { ...slide, variant };
    });
  }, [variants, slidesData]);
// Add this useEffect to inspect your data
useEffect(() => {
  if (variants?.length && slidesData?.length) {
    console.log("=== VARIANTS DATA ===");
    console.log(variants);
    
    console.log("=== SLIDES DATA ===");
    slidesData.forEach(slide => {
      const variant = variants.find(v => v.id === slide.variantId);
      console.log(`Slide: ${slide.title} (variantId: ${slide.variantId})`);
      console.log("  - Variant found:", variant);
      if (variant) {
        console.log("  - Variant keys:", Object.keys(variant));
        console.log("  - Variant images:", variant.images || variant.image || variant.thumbnail || variant.full);
      }
    });
  }
}, [variants, slidesData]);



  // Create triple array once for all strips
  const stripSlides = useMemo(() => {
    if (!allSlides.length) return [];
    return [...allSlides, ...allSlides, ...allSlides];
  }, [allSlides]);

  const leftStripSlides = useMemo(() => {
    if (!stripSlides.length) return [];
    return [null, null, ...stripSlides];
  }, [stripSlides]);

  const rightStripSlides = stripSlides;

  const getStep = useCallback((track) => {
    if (!track?.children?.[0]) return 0;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.gap) || 0;
    return track.children[0].getBoundingClientRect().width + gap;
  }, []);

  const measureScrub = useCallback(() => {
    const container = containerRef.current;
    const focusStripEl = focusStripRef.current;
    const navLeftEl = sliderNavLeftRef.current;
    const navRightEl = sliderNavRightRef.current;
    const leftMaskEl = leftMaskRef.current;

    if (
      !container ||
      !focusStripEl ||
      !navLeftEl ||
      !navRightEl ||
      !leftMaskEl
    ) {
      return null;
    }

    if (
      !focusStripEl.children.length ||
      !navLeftEl.children.length ||
      !navRightEl.children.length ||
      !allSlides.length
    ) {
      return null;
    }

    const total = allSlides.length;
    const startIndex = total * 2;

    const focusStep = getStep(focusStripEl);
    const thumbStep = getStep(navLeftEl);

    if (!focusStep || !thumbStep) return null;

    const focusMaskEl = focusStripEl.parentElement;
    if (!focusMaskEl) return null;

    const focusFrameEl = focusMaskEl.parentElement;
    if (!focusFrameEl) return null;

    const frameStyles = getComputedStyle(focusFrameEl);
    const paddingLeft = parseFloat(frameStyles.paddingLeft) || 0;
    const paddingRight = parseFloat(frameStyles.paddingRight) || 0;

    const focusMaskRect = focusMaskEl.getBoundingClientRect();
    const focusItemRect = focusStripEl.children[0].getBoundingClientRect();

    const focusStartX =
      (focusMaskRect.width - focusItemRect.width) * 0.5 +
      (paddingLeft - paddingRight) * 0.5 -
      startIndex * focusStep;

    const leftStartX = -paddingRight;

    const rightStartX =
      -(startIndex + 1) * thumbStep +
      paddingRight +
      (focusMaskRect.width - focusItemRect.width) * 0.5;

    const focusTrackWidth = focusStripEl.scrollWidth;
    const singleLoopWidth = focusTrackWidth / 3;
    const maxFocusTravel = singleLoopWidth - focusStep;

    const lastOriginalImageIndex = startIndex + total - 1;

    const rightStopX =
      rightStartX - (lastOriginalImageIndex - startIndex) * thumbStep;

    const maxRightTravel = Math.abs(rightStartX - rightStopX);
    const rightStopProgress =
      maxRightTravel / (maxFocusTravel * (thumbStep / focusStep));

    if (scrollWrapRef.current) {
      const neededHeight = Math.ceil(window.innerHeight + maxFocusTravel + 2);
      scrollWrapRef.current.style.height = `${neededHeight}px`;
    }

    return {
      focusStripEl,
      navLeftEl,
      navRightEl,
      focusStep,
      thumbStep,
      focusStartX,
      leftStartX,
      rightStartX,
      maxFocusTravel,
      maxRightTravel,
      rightStopProgress,
      rightStopX,
    };
  }, [allSlides, getStep]);

  const applyScrubProgress = useCallback((progress) => {
    const m = metricsRef.current;
    if (!m) return;

    const focusTravel = progress * m.maxFocusTravel;
    const thumbTravel = (focusTravel / m.focusStep) * m.thumbStep;

    let rightStripX;
    if (progress >= m.rightStopProgress) {
      rightStripX = m.rightStopX;
    } else {
      rightStripX = m.rightStartX - thumbTravel;
    }

    gsap.set(m.focusStripEl, {
      x: m.focusStartX - focusTravel,
    });

    gsap.set(m.navLeftEl, {
      x: m.leftStartX - thumbTravel,
      opacity: 1,
    });

    gsap.set(m.navRightEl, {
      x: rightStripX,
      opacity: 1,
    });
  }, []);

  const initScrollScrub = useCallback(() => {
    if (!isReady || !allSlides.length) return;

    metricsRef.current = measureScrub();
    if (!metricsRef.current) return;

    applyScrubProgress(0);

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.refresh();
      return;
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${metricsRef.current?.maxFocusTravel ?? 0}`,
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        applyScrubProgress(self.progress);

        const ticks = document.querySelectorAll(".scroll-ticks");
        const velocity = self.getVelocity();
        const shift = velocity * 0.001;

        ticks.forEach((el) => {
          const current = parseFloat(el.dataset.offset || "0") + shift;
          el.dataset.offset = current;
          el.style.backgroundPosition = `${current}px 0px`;
        });
      },
      onRefreshInit: () => {
        metricsRef.current = measureScrub();
      },
      onRefresh: (self) => {
        applyScrubProgress(self.progress);
      },
    });

    ScrollTrigger.refresh();
  }, [isReady, measureScrub, applyScrubProgress, allSlides.length]);


  useLayoutEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      initScrollScrub();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, initScrollScrub]);

  useLayoutEffect(() => {
    if (!isReady) return;
    let resizeRaf;

    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        initScrollScrub();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeRaf);
    };
  }, [isReady, initScrollScrub]);

  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []);


const [hoveredId, setHoveredId] = useState(null);

const getCurrentImage = (slide) => {
  const images = slide.variant?.variantImages;

  if (!images?.length) return slide.thumbnail;

  if (hoveredId === slide.variantId && images[1]) {
    return images[1].url;
  }
  return images[0].url;
};

  const handleThumbClick = (slide) => {
    if (!slide.variant) return;
    router.push(`/shop/products/${slide.variant.id}`);
  };

  if (!isReady || !allSlides.length) return null;

  return (
    <div
      ref={scrollWrapRef}
      style={{
        height: "300vh",
        opacity: isReady ? 1 : 0,
        pointerEvents: isReady ? "auto" : "none",
      }}
    >
      <section
        ref={containerRef}
        data-slideshow="wrap"
        className="crisp-header"
      >
        <div className="crisp-header__border-wrapper">
          <div ref={contentRef} className="crisp-header__content">
                <section className="relative flex items-end justify-end py-2">
                        <div
  className="
    relative
    w-[18vw]
    h-[45vh]
    z-10 
  "
>
  <a href="https://www.amazon.com/hz/wishlist/ls/3H5ZN3KIOODT1?ref_=wl_share" target="_blank" rel="noopener noreferrer">
  <svg 
  style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%',

    zIndex: 5
  }}
  viewBox="0 0 256 256"
>
  <defs>
    <mask id="customShape">
      <path 
        d="M 65.025 143.01 C 70.813 165.5 88.518 183.205 111.008 188.993 L 111.008 254.018 C 53.108 246.796 7.22 200.909 0 143.01 Z M 254.016 143.01 C 246.796 200.909 200.907 246.798 143.008 254.018 L 143.008 188.993 C 165.498 183.205 183.203 165.5 188.991 143.01 Z M 127.008 111.01 C 135.845 111.01 143.008 118.173 143.008 127.01 C 143.008 135.847 135.845 143.01 127.008 143.01 C 118.171 143.01 111.008 135.847 111.008 127.01 C 111.008 118.173 118.171 111.01 127.008 111.01 Z M 111.008 65.026 C 88.518 70.814 70.813 88.52 65.025 111.01 L 0 111.01 C 7.22 53.11 53.109 7.221 111.008 0.001 Z M 143.008 0 C 200.907 7.221 246.796 53.111 254.016 111.01 L 188.991 111.01 C 183.203 88.52 165.498 70.814 143.008 65.026 Z" 
        fill="white"
      />
    </mask>
    

    <path
      id="innerCirclePath"
      d="
        M 120,75
        m -47,0
        a 47,47 0 1,1 94,0
        a 47,47 0 1,1 -94,0
      "
    />
  </defs>
  
  <text
    fill="black"
    fontSize="10"
    letterSpacing="2"
    fontFamily="KHTekaTrial-Light"
  >
    <textPath
      href="#innerCirclePath"
      startOffset="50%"
      textAnchor="middle"
    >
      SHOP • OUR • AMAZON • STOREFRONT •
    </textPath>
  </text>
</svg>

  </a>

  <div
    className="
      absolute
      inset-0
      overflow-hidden
    "
    style={{
      mask: "url(#customShape)",
      WebkitMask: "url(#customShape)",
    }}
  >
    <Canvas camera={{ position: [0, -10, 10], fov: 75 }}>
      <StatsGl />
      <Sky />
      <ambientLight intensity={Math.PI / 1.5} />
      <spotLight
        position={[0, 40, 0]}
        decay={0}
        distance={45}
        penumbra={1}
        intensity={100}
      />
      <spotLight
        position={[-20, 0, 10]}
        color="purple"
        angle={0.15}
        decay={0}
        penumbra={-1}
        intensity={30}
      />
      <spotLight
        position={[20, -10, 10]}
        color="red"
        angle={0.2}
        decay={0}
        penumbra={-1}
        intensity={20}
      />
      <CameraControls />
    </Canvas>
  </div>

{/* 
  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
    <div
      className="
        w-full
        leading-none
        max-w-[200px]
        justify-center items-center text-center 
      "
    >
      <h2 className="text-[11px] uppercase tracking-wider font-neuehaas45 mb-3">
        Shop our Amazon storefront
      </h2>
      <p className="text-[14px] opacity-80 font-neuehaas45">
        link
      </p>
    </div>
  </div> */}
</div>
                        </section>
            <div className="crisp-header__center">
              <div className="vertical-copy">
                <div className="vertical-copy__group vertical-copy__group--top">
                  <ScrambleText
                    text="Ember"
                    className="vertical-copy__line is-bright"
                  />
                  <ScrambleText
                    text="Cocofloss"
                    className="vertical-copy__line is-dim"
                  />
                  <ScrambleText
                    text="Whitening"
                    className="vertical-copy__line is-bright"
                  />
                </div>

                <div className="vertical-copy__group vertical-copy__group--bottom">
                  <ScrambleText
                    text="Aligners"
                    className="vertical-copy__line is-bright"
                  />
                  <ScrambleText
                    text="Zima"
                    className="vertical-copy__line is-bright"
                  />
                  <ScrambleText
                    text="Gift Cards"
                    className="vertical-copy__line is-dim"
                  />
                </div>
              </div>

              <div className="crisp-header__heading-container">
                <h1 className="crisp-header__h1" ref={headingRef}>
                  Browse our e-shop
                </h1>
              </div>
            </div>

            <div className="strip-row relative">
              <div className="fade-left" />

              <div className="nav-layer nav-layer--left">
                <div className="nav-mask nav-mask--left" ref={leftMaskRef}>
                  <div
                    className="crisp-header__slider-nav crisp-header__slider-nav--left"
                    ref={sliderNavLeftRef}
                  >
{leftStripSlides.map((slide, idx) => {
  if (!slide) {
    return (
      <div
        key={`left-empty-${idx}`}
        className="crisp-header__slider-nav-btn is--placeholder"
      />
    );
  }

  const images = slide.variant?.variantImages || [];
  const base = images[0]?.url || slide.thumbnail;
  const hover = images[1]?.url;
  const isHovered = hoveredId === slide.variantId;

  return (
    <Link
      key={`left-${slide.id}-${idx}`}
      href={`/shop/products/${slide.variant?.id}`}
className="relative w-[min(220px,20vw)] h-[min(220px,20vw)] flex-shrink-0 overflow-hidden"
      onMouseEnter={() => setHoveredId(slide.variantId)}
      onMouseLeave={() => setHoveredId(null)}
    >

      <div className="absolute inset-0 overflow-hidden">
        
        <img
          src={base}
          alt={slide.alt || slide.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {hover && (
          <img
            src={hover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1)' : 'scale(1.05)',
            }}
          />
        )}
      </div>
    </Link>
  );
})}
                  </div>
                </div>
              </div>

              <div className="crisp-header__focus">
                <div className="focus-layer">
                  <div className="focus-frame">
                    <div className="focus-mask">
                      <div className="focus-strip" ref={focusStripRef}>
                    { stripSlides.map((slide, idx) => {
  if (!slide) {
    return (
      <div
        key={`focus-empty-${idx}`}
        className="focus-item is--placeholder"
      />
    );
  }

  return (
    <Link
      key={`focus-${slide.id}-${idx}`}
      href={`/shop/products/${slide.variant?.id}`}
      className="focus-item"
      onClick={() => handleThumbClick(slide)}
    >
      <img
        src={slide.thumbnail}
        alt={slide.alt || slide.title}
      />
    </Link>
  );
})}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-layer nav-layer--right">
                <div className="nav-mask nav-mask--right">
                  <div
                    className="crisp-header__slider-nav crisp-header__slider-nav--right"
                    ref={sliderNavRightRef}
                  >
                    {rightStripSlides.map((slide, idx) => (
                      <Link
                        key={`right-${slide.id}-${idx}`}
                        href={`/shop/products/${slide.variant?.id}`}
                        className="crisp-header__slider-nav-btn"
                        onClick={() => handleThumbClick(slide)}
                      >
                        <img
                          src={slide.thumbnail}
                          alt={slide.alt || slide.title}
                          className="crisp-loader__cover-img"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fade-right" />
            </div>

            <div className="scroll-indicator">
              <div className="scroll-ticks scroll-ticks--left" />
              <div className="scroll-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 146 36"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M131.762 24.9557L144.632 1.17261L1.63232 1.17261L41.0214 35.1726H78.1505L91.3905 24.9557L131.762 24.9557Z"
                    fill="#0C5EFF"
                  />
                </svg>
                <span className="scroll-label">SCROLL</span>
              </div>
              <div className="scroll-ticks scroll-ticks--right" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
const PreloaderComponent = ({ children, variants }) => {
  const pathname = usePathname();
  const prevPathRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const prev = prevPathRef.current;

    const isInShop = pathname.startsWith("/shop");
    const cameFromOutside = prev && !prev.startsWith("/shop");

    const firstLoad = prev === null && isInShop;

    if (firstLoad || cameFromOutside) {
      setIsLoading(true);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && (
        <CrispLoader
          onComplete={handleLoaderComplete}
          slidesData={slidesData}
          variants={variants}
        />
      )}

      <div
        style={{
          opacity: isLoading ? 0 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
};
export { ShopContent, slidesData };

// function PreloaderMobile() {
//   const config = {
//     SCROLL_SPEED: 1.75,
//     LERP_FACTOR: 0.05,
//     MAX_VELOCITY: 150,
//   };
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const stripRef = useRef(null);
//   const itemsRef = useRef([]);

//   const currentPhaseRef = useRef(0);
//   const totalSlideCount = slidesData.length;
//   const trackRef = useRef(null);
//   const animationRef = useRef(null);

//   const stateRef = useRef({
//     currentX: 0,
//     targetX: 0,
//     slideWidth: 315,
//     isDragging: false,
//     startX: 0,
//     lastX: 0,
//     lastMouseX: 0,
//     lastScrollTime: Date.now(),
//     isMoving: false,
//     velocity: 0,
//     lastCurrentX: 0,
//     dragDistance: 0,
//     hasActuallyDragged: false,
//   });

//   const [slides, setSlides] = useState([]);

//  const [showSlideshow, setShowSlideshow] = useState(false);
//   const hasRunRef = useRef(false);

//   useEffect(() => {
//     if (hasRunRef.current) return;
//     hasRunRef.current = true;
//     runAnimation();
//   }, []);

// const runAnimation = () => {
//   const strip = stripRef.current;
//   const items = itemsRef.current;

//   if (!strip || !items.length) return;

//   const tl = gsap.timeline({
//     defaults: { ease: "power2.out" },
//     onComplete: () => {
//       setIsLoading(false);
//       sessionStorage.setItem("preloaderDone", "true");
//     },
//   });

//   tl.fromTo(
//     strip,
//     { x: 50 },
//     {
//       x: 0,
//       duration: 0.6,
//       ease: "none"
//     },
//     0
//   );

//   gsap.set(items, {
//     yPercent: 40,
//     xPercent: 0,
//     opacity: 0,
//   });

//   tl.to(
//     items,
//     {
//       yPercent: 0,
//       opacity: 1,
//       duration: 0.6,
//       stagger: 0.05,
//       ease: "power2.out",
//     },
//     "-=0.3"
//   );

//   tl.call(() => {
//     const state = Flip.getState(items);

//     strip.classList.add("is--horizontal");

//     strip.offsetHeight;

//     Flip.from(state, {
//       duration: 0.9,
//       ease: "power3.inOut",
//       stagger: {
//         each: 0.05,
//         from: "start"
//       },
//       absolute: true,
//       nested: true,
//         onComplete: () => {
//       setShowSlideshow(true);
//     }
//     });

//   }, null, "-=0.2");
// };

//   useEffect(() => {
//     const initTextSplit = () => {
//       const textElements = document.querySelectorAll(
//         ".gliding-card-col-3 h1, .gliding-card-col-3 p",
//       );

//       textElements.forEach((element) => {
//         const split = new SplitText(element, {
//           type: "lines",
//           linesClass: "gliding-card-line",
//         });
//         split.lines.forEach(
//           (line) => (line.innerHTML = `<span>${line.textContent}</span>`),
//         );
//       });
//     };

//     initTextSplit();

//     gsap.set(
//       ".gliding-card-col-3 .gliding-card-col-content-wrapper .gliding-card-line span",
//       { y: "0%" },
//     );
//     gsap.set(
//       ".gliding-card-col-3 .gliding-card-col-content-wrapper-2 .gliding-card-line span",
//       { y: "-125%" },
//     );

//     ScrollTrigger.create({
//       trigger: ".gliding-card-sticky-cols",
//       start: "top top",
//       end: `+=${window.innerHeight * 5}px`,
//       pin: true,
//       pinSpacing: true,
//     });

//     ScrollTrigger.create({
//       trigger: ".gliding-card-sticky-cols",
//       start: "top top",
//       end: `+=${window.innerHeight * 6}px`,
//       onUpdate: (self) => {
//         const progress = self.progress;

//         if (progress >= 0.33 && currentPhaseRef.current === 0) {
//           currentPhaseRef.current = 1;

//           gsap.to(".gliding-card-col-1", {
//             opacity: 0,
//             scale: 0.75,
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-2", { x: "0%", duration: 0.75 });
//           gsap.to(".gliding-card-col-3", { y: "0%", duration: 0.75 });

//           gsap.to(".gliding-card-col-img-1 img", {
//             scale: 1.25,
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-img-2", {
//             clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-img-2 img", { scale: 1, duration: 0.75 });
//         }

//         if (progress >= 0.66 && currentPhaseRef.current === 1) {
//           currentPhaseRef.current = 2;

//           gsap.to(".gliding-card-col-2", {
//             opacity: 0,
//             scale: 0.75,
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-3", { x: "0%", duration: 0.75 });
//           gsap.to(".gliding-card-col-4", { y: "0%", duration: 0.75 });

//           gsap.to(
//             ".gliding-card-col-3 .gliding-card-col-content-wrapper .gliding-card-line span",
//             {
//               y: "-125%",
//               duration: 0.75,
//             },
//           );
//           gsap.to(
//             ".gliding-card-col-3 .gliding-card-col-content-wrapper-2 .gliding-card-line span",
//             {
//               y: "0%",
//               duration: 0.75,
//               delay: 0.5,
//             },
//           );
//         }

//         if (progress < 0.33 && currentPhaseRef.current >= 1) {
//           currentPhaseRef.current = 0;

//           gsap.to(".gliding-card-col-1", {
//             opacity: 1,
//             scale: 1,
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-2", { x: "100%", duration: 0.75 });
//           gsap.to(".gliding-card-col-3", { y: "100%", duration: 0.75 });

//           gsap.to(".gliding-card-col-img-1 img", { scale: 1, duration: 0.75 });
//           gsap.to(".gliding-card-col-img-2", {
//             clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-img-2 img", {
//             scale: 1.25,
//             duration: 0.75,
//           });
//         }

//         if (progress < 0.66 && currentPhaseRef.current === 2) {
//           currentPhaseRef.current = 1;

//           gsap.to(".gliding-card-col-2", {
//             opacity: 1,
//             scale: 1,
//             duration: 0.75,
//           });
//           gsap.to(".gliding-card-col-3", { x: "100%", duration: 0.75 });
//           gsap.to(".gliding-card-col-4", { y: "100%", duration: 0.75 });

//           gsap.to(
//             ".gliding-card-col-3 .gliding-card-col-content-wrapper .gliding-card-line span",
//             {
//               y: "0%",
//               duration: 0.75,
//               delay: 0.5,
//             },
//           );
//           gsap.to(
//             ".gliding-card-col-3 .gliding-card-col-content-wrapper-2 .gliding-card-line span",
//             {
//               y: "-125%",
//               duration: 0.75,
//             },
//           );
//         }
//       },
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, []);

//   const createSlideElement = useCallback(
//     (index) => {
//       const dataIndex = index % totalSlideCount;
//       const slideData = slidesData[dataIndex];

//       return (
// <div
//   key={index}
//   className="slide-container rounded-full"
//   style={{ width: "315px", height: "450px" }}
//   onMouseUp={(e) => {
//     if (
//       stateRef.current.dragDistance < 10 &&
//       !stateRef.current.hasActuallyDragged
//     ) {
//       const id = slideData.variantId;

//       if (!id) {
//         console.warn("no variant", slideData);
//         return;
//       }

//       router.push(`/shop/products/${id}`);
//     }
//   }}
// >
// <div className="slide-image">
//   <div className="slide-image-inner">
//     <img src={slideData.full} alt={slideData.title} />
//   </div>
// </div>
//           <div className="slide-caption">

//             <p className="slide-caption-title">{slideData.title}</p>

//           </div>
//         </div>
//       );
//     },
//     [totalSlideCount],
//   );

//   const initializeSlides = useCallback(() => {
//     const copies = 6;
//     const totalSlides = totalSlideCount * copies;
//     const newSlides = [];

//     for (let i = 0; i < totalSlides; i++) {
//       newSlides.push(createSlideElement(i));
//     }

//     const startOffset = -(totalSlideCount * 315 * 2);

//     stateRef.current.currentX = startOffset;
//     stateRef.current.targetX = startOffset;

//     setSlides(newSlides);
//   }, [createSlideElement, totalSlideCount]);

//   const updateSlidePositions = useCallback(() => {
//     if (!trackRef.current) return;

//     const sequenceWidth = 315 * totalSlideCount;
//     let newCurrentX = stateRef.current.currentX;
//     let newTargetX = stateRef.current.targetX;

//     if (newCurrentX > -sequenceWidth * 1) {
//       newCurrentX -= sequenceWidth;
//       newTargetX -= sequenceWidth;
//       stateRef.current.currentX = newCurrentX;
//       stateRef.current.targetX = newTargetX;
//     } else if (newCurrentX < -sequenceWidth * 4) {
//       newCurrentX += sequenceWidth;
//       newTargetX += sequenceWidth;
//       stateRef.current.currentX = newCurrentX;
//       stateRef.current.targetX = newTargetX;
//     }

//     trackRef.current.style.transform = `translate3d(${stateRef.current.currentX}px, 0, 0)`;
//   }, [totalSlideCount]);

//   const updateParallax = useCallback(() => {
//     const viewportCenter = window.innerWidth / 2;
//     const slideElements = trackRef.current?.children;

//     if (!slideElements) return;

//     Array.from(slideElements).forEach((slide) => {
//       const img = slide.querySelector("img");
//       if (!img) return;

//       const slideRect = slide.getBoundingClientRect();

//       if (slideRect.right < -500 || slideRect.left > window.innerWidth + 500) {
//         return;
//       }

//       const slideCenter = slideRect.left + slideRect.width / 2;
//       const distanceFromCenter = slideCenter - viewportCenter;
//       const parallaxOffset = distanceFromCenter * -0.25;

//       img.style.transform = `translateX(${parallaxOffset}px) scale(2.25)`;
//     });
//   }, []);

//   const updateMovingState = useCallback(() => {
//     const velocity = Math.abs(
//       stateRef.current.currentX - stateRef.current.lastCurrentX,
//     );
//     const isSlowEnough = velocity < 0.1;
//     const hasBeenStillLongEnough =
//       Date.now() - stateRef.current.lastScrollTime > 200;
//     const isMoving =
//       stateRef.current.hasActuallyDragged ||
//       !isSlowEnough ||
//       !hasBeenStillLongEnough;

//     document.documentElement.style.setProperty(
//       "--slider-moving",
//       isMoving ? "1" : "0",
//     );

//     stateRef.current.velocity = velocity;
//     stateRef.current.lastCurrentX = stateRef.current.currentX;
//     stateRef.current.isMoving = isMoving;
//   }, []);

//   const animate = useCallback(() => {
//     stateRef.current.currentX +=
//       (stateRef.current.targetX - stateRef.current.currentX) *
//       config.LERP_FACTOR;

//     updateMovingState();
//     updateSlidePositions();
//     updateParallax();

//     animationRef.current = requestAnimationFrame(animate);
//   }, [updateMovingState, updateSlidePositions, updateParallax]);

//   const handleWheel = useCallback((e) => {
//     if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
//       return;
//     }

//     e.preventDefault();
//     const scrollDelta = e.deltaY * config.SCROLL_SPEED;
//     const delta = Math.max(
//       Math.min(scrollDelta, config.MAX_VELOCITY),
//       -config.MAX_VELOCITY,
//     );

//     stateRef.current.targetX -= delta;
//     stateRef.current.lastScrollTime = Date.now();
//   }, []);

//   const handleTouchStart = useCallback((e) => {
//     stateRef.current.isDragging = true;
//     stateRef.current.startX = e.touches[0].clientX;
//     stateRef.current.lastX = stateRef.current.targetX;
//     stateRef.current.dragDistance = 0;
//     stateRef.current.hasActuallyDragged = false;
//     stateRef.current.lastScrollTime = Date.now();
//   }, []);

//   const handleTouchMove = useCallback((e) => {
//     if (!stateRef.current.isDragging) return;

//     const deltaX = (e.touches[0].clientX - stateRef.current.startX) * 1.5;
//     const newDragDistance = Math.abs(deltaX);

//     stateRef.current.targetX = stateRef.current.lastX + deltaX;
//     stateRef.current.dragDistance = newDragDistance;
//     if (newDragDistance > 5) {
//       stateRef.current.hasActuallyDragged = true;
//     }
//     stateRef.current.lastScrollTime = Date.now();
//   }, []);

//   const handleTouchEnd = useCallback(() => {
//     stateRef.current.isDragging = false;
//     setTimeout(() => {
//       stateRef.current.hasActuallyDragged = false;
//     }, 100);
//   }, []);

//   const handleMouseDown = useCallback((e) => {
//     e.preventDefault();
//     stateRef.current.isDragging = true;
//     stateRef.current.startX = e.clientX;
//     stateRef.current.lastMouseX = e.clientX;
//     stateRef.current.lastX = stateRef.current.targetX;
//     stateRef.current.dragDistance = 0;
//     stateRef.current.hasActuallyDragged = false;
//     stateRef.current.lastScrollTime = Date.now();
//   }, []);

//   const handleMouseMove = useCallback((e) => {
//     if (!stateRef.current.isDragging) return;

//     e.preventDefault();
//     const deltaX = (e.clientX - stateRef.current.lastMouseX) * 2;
//     const newDragDistance = stateRef.current.dragDistance + Math.abs(deltaX);

//     stateRef.current.targetX += deltaX;
//     stateRef.current.lastMouseX = e.clientX;
//     stateRef.current.dragDistance = newDragDistance;
//     if (newDragDistance > 5) {
//       stateRef.current.hasActuallyDragged = true;
//     }
//     stateRef.current.lastScrollTime = Date.now();
//   }, []);

//   const handleMouseUp = useCallback(() => {
//     stateRef.current.isDragging = false;
//     setTimeout(() => {
//       stateRef.current.hasActuallyDragged = false;
//     }, 100);
//   }, []);

//   const handleResize = useCallback(() => {
//     initializeSlides();
//   }, [initializeSlides]);

//   useEffect(() => {
//     if (!showSlideshow) return;

//     initializeSlides();
//     animationRef.current = requestAnimationFrame(animate);

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [showSlideshow, initializeSlides, animate]);
//   useEffect(() => {
//     const slider = document.querySelector(".slider");
//     if (!slider) return;

//     slider.addEventListener("wheel", handleWheel, { passive: false });
//     slider.addEventListener("touchstart", handleTouchStart);
//     slider.addEventListener("touchmove", handleTouchMove);
//     slider.addEventListener("touchend", handleTouchEnd);
//     slider.addEventListener("mousedown", handleMouseDown);
//     slider.addEventListener("mouseleave", handleMouseUp);
//     slider.addEventListener("dragstart", (e) => e.preventDefault());

//     window.addEventListener("resize", handleResize);
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       slider.removeEventListener("wheel", handleWheel);
//       slider.removeEventListener("touchstart", handleTouchStart);
//       slider.removeEventListener("touchmove", handleTouchMove);
//       slider.removeEventListener("touchend", handleTouchEnd);
//       slider.removeEventListener("mousedown", handleMouseDown);
//       slider.removeEventListener("mouseleave", handleMouseUp);
//       slider.removeEventListener("dragstart", (e) => e.preventDefault());

//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [
//     handleWheel,
//     handleTouchStart,
//     handleTouchMove,
//     handleTouchEnd,
//     handleMouseDown,
//     handleMouseMove,
//     handleMouseUp,
//     handleResize,
//   ]);

// useEffect(() => {
//   if (!showSlideshow) return;

//   requestAnimationFrame(() => {
//     const images = trackRef.current?.querySelectorAll(".slide-image-inner");
//     if (!images) return;

//     gsap.set(images, { yPercent: 100 });

//     gsap.to(images, {
//       yPercent: 0,
//       duration: 1.1,
//       ease: "power3.out",
//       stagger: {
//         each: 0.06,
//         from: "center",
//       },
//     });
//   });

// }, [showSlideshow]);
//   return (
//     <div className="slider">
//       <section className="mobile-preloader">
//         <div ref={stripRef} className="mobile-strip">
//           {slidesData.map((slide, i) => (
//             <div
//               key={i}
//               ref={(el) => (itemsRef.current[i] = el)}
//               className="mobile-item"
//             >
//               <img src={slide.thumbnail} alt={slide.title} />
//             </div>
//           ))}
//         </div>
//       </section>
//    {showSlideshow ? (
//         <div className="slide-track" ref={trackRef}>
//           {slides}
//         </div>
//       ) : null}
//     </div>
//   );
// }

const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

const PreloaderMobile: React.FC = () => {
  const router = useRouter();
  const activeIndexRef = useRef(0);

  const spotlightRef = useRef<HTMLElement>(null);
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const titlesContainerElementRef = useRef<HTMLDivElement>(null);
  const introText1Ref = useRef<HTMLParagraphElement>(null);
  const introText2Ref = useRef<HTMLParagraphElement>(null);
  const spotlightBgImgRef = useRef<HTMLDivElement>(null);
  const spotlightBgImgInnerRef = useRef<HTMLImageElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const currentImageIndexRef = useRef(0);

  const [imageElements, setImageElements] = useState<HTMLDivElement[]>([]);
  const isInitializedRef = useRef(false);
  const listenersRef = useRef<
    { el: HTMLElement; type: string; handler: EventListener }[]
  >([]);
  const clickStartPosRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const hasMovedRef = useRef(false);
  const bgTransitionRef = useRef<gsap.core.Timeline | null>(null);
  const isTransitioningRef = useRef(false);
  const nextImagePreloadedRef = useRef<HTMLImageElement | null>(null);
  const pendingTransitionRef = useRef<number | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const currentTitleRef = useRef<HTMLDivElement>(null);
  const nextTitleRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const autoAnimationCompletedRef = useRef(false);
  const autoAnimationTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const pendingTitleTransitionRef = useRef<number | null>(null);

  const animateTitleChange = (nextIndex: number) => {
    if (!currentTitleRef.current || !nextTitleRef.current) return;
    if (activeIndexRef.current === nextIndex) return;

    const targetIndex = nextIndex;

    if (isAnimatingRef.current) {
      pendingTitleTransitionRef.current = nextIndex;
      return;
    }

    isAnimatingRef.current = true;

    const currentEl = currentTitleRef.current;
    const nextEl = nextTitleRef.current;

    if ((currentEl as any)._gsSplitText) {
      (currentEl as any)._gsSplitText.revert();
    }
    if ((nextEl as any)._gsSplitText) {
      (nextEl as any)._gsSplitText.revert();
    }

    nextEl.textContent = mobileSlidesData[targetIndex].title;

    const currentSplit = new SplitText(currentEl, { type: "chars" });
    const nextSplit = new SplitText(nextEl, { type: "chars" });

    gsap.set(nextSplit.chars, { yPercent: 100, opacity: 1 });
    gsap.set(currentSplit.chars, { yPercent: 0, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        currentSplit.revert();
        nextSplit.revert();

        currentEl.textContent = "";

        currentEl.textContent = mobileSlidesData[targetIndex].title;
        nextEl.textContent = "";

        activeIndexRef.current = nextIndex;
        isAnimatingRef.current = false;

        if (pendingTitleTransitionRef.current !== null) {
          const pending = pendingTitleTransitionRef.current;
          pendingTitleTransitionRef.current = null;
          animateTitleChange(pending);
        }
      },
      onInterrupt: () => {
        if (currentSplit && !currentSplit.reverted) currentSplit.revert();
        if (nextSplit && !nextSplit.reverted) nextSplit.revert();
        isAnimatingRef.current = false;
      },
    });

    tl.to(
      currentSplit.chars,
      {
        yPercent: -100,
        duration: 0.6,
        ease: "expo.inOut",
        stagger: 0.02,
        overwrite: true,
      },
      0,
    );

    tl.to(
      nextSplit.chars,
      {
        yPercent: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.02,
        overwrite: true,
      },
      0.08,
    );
  };
  useEffect(() => {
    return () => {
      if (
        currentTitleRef.current &&
        (currentTitleRef.current as any)._gsSplitText
      ) {
        (currentTitleRef.current as any)._gsSplitText.revert();
      }
      if (nextTitleRef.current && (nextTitleRef.current as any)._gsSplitText) {
        (nextTitleRef.current as any)._gsSplitText.revert();
      }

      pendingTitleTransitionRef.current = null;

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill(true);
        scrollTriggerRef.current = null;
      }

      ScrollTrigger.getAll().forEach((st) => st.kill(true));

      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }

      if (bgTransitionRef.current) {
        bgTransitionRef.current.kill();
        bgTransitionRef.current = null;
      }

      if (autoAnimationTimelineRef.current) {
        autoAnimationTimelineRef.current.kill();
        autoAnimationTimelineRef.current = null;
      }

      listenersRef.current.forEach(({ el, type, handler }) => {
        el.removeEventListener(type, handler);
      });
      listenersRef.current = [];

      ScrollTrigger.refresh(true);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.normalizeScroll(true);

    return () => {
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  const getBezierPosition = (t: number) => {
    const containerWidth = window.innerWidth * 0.3;
    const arcStartX = containerWidth - 220;
    const arcStartY = -280;
    const arcEndY = window.innerHeight + 280;
    const arcControlPointX = arcStartX + config.arcRadius * 1.2;
    const arcControlPointY = window.innerHeight / 2;

    const x =
      (1 - t) * (1 - t) * arcStartX +
      2 * (1 - t) * t * arcControlPointX +
      t * t * arcStartX;
    const y =
      (1 - t) * (1 - t) * arcStartY +
      2 * (1 - t) * t * arcControlPointY +
      t * t * arcEndY;
    return { x, y };
  };

  const preloadNextImage = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < mobileSlidesData.length) {
      const img = new Image();
      img.src = mobileSlidesData[nextIndex].full;
      img.onload = () => {
        nextImagePreloadedRef.current = img;
      };
    }
  };

  const smoothTransitionBackground = (
    currentIndex: number,
    nextIndex: number,
  ) => {
    if (!spotlightBgImgRef.current) return;

    const container = spotlightBgImgRef.current;
    const currentImg = container.querySelector(
      ".bg-img.current",
    ) as HTMLImageElement;
    const nextImg = container.querySelector(".bg-img.next") as HTMLImageElement;

    if (!currentImg || !nextImg || currentIndex === nextIndex) return;

    if (isTransitioningRef.current) {
      pendingTransitionRef.current = nextIndex;
      return;
    }

    console.log(`bg image from ${currentIndex} to ${nextIndex}`);

    isTransitioningRef.current = true;

    if (bgTransitionRef.current) {
      bgTransitionRef.current.kill();
    }

    nextImg.src = mobileSlidesData[nextIndex].full;

    gsap.set(nextImg, {
      opacity: 0,
      scale: 1.05,
      filter: "blur(8px)",
      zIndex: 1,
    });

    gsap.set(currentImg, {
      zIndex: 2,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        currentImg.classList.remove("current");
        currentImg.classList.add("next");
        nextImg.classList.remove("next");
        nextImg.classList.add("current");

        gsap.set(currentImg, {
          opacity: 0,
          clearProps: "all",
        });

        gsap.set(nextImg, {
          clearProps: "all",
        });

        isTransitioningRef.current = false;

        if (
          pendingTransitionRef.current !== null &&
          pendingTransitionRef.current !== nextIndex
        ) {
          const pendingIndex = pendingTransitionRef.current;
          pendingTransitionRef.current = null;
          smoothTransitionBackground(nextIndex, pendingIndex);
        } else {
          pendingTransitionRef.current = null;
          preloadNextImage(nextIndex);
        }
      },
    });

    tl.to(
      currentImg,
      {
        opacity: 0,
        scale: 0.95,
        filter: "blur(12px)",
        duration: 0.6,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      nextImg,
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
      },
      0.1,
    );

    bgTransitionRef.current = tl;
  };

  const handleNavigate = (variantId: number) => {
    ScrollTrigger.getAll().forEach((st) => st.kill(true));

    if (ctxRef.current) {
      ctxRef.current.revert();
    }

    gsap.globalTimeline.clear();

    ScrollTrigger.refresh(true);

    router.push(`/shop/products/${variantId}`);
  };

  const playAutoIntroAnimation = () => {
    if (autoAnimationCompletedRef.current) return;
    if (
      !introText1Ref.current ||
      !introText2Ref.current ||
      !spotlightBgImgRef.current ||
      !spotlightBgImgInnerRef.current
    )
      return;

    autoAnimationCompletedRef.current = true;

    const moveDistance = window.innerWidth * 0.6;
    const duration = 1.2;

    const tl = gsap.timeline({
      onComplete: () => {
        if (introText1Ref.current && introText2Ref.current) {
          gsap.set(introText1Ref.current, { x: -moveDistance, opacity: 1 });
          gsap.set(introText2Ref.current, { x: moveDistance, opacity: 1 });
        }

        if (spotlightBgImgRef.current) {
          gsap.set(spotlightBgImgRef.current, { scale: 1 });
        }

        if (spotlightBgImgInnerRef.current) {
          gsap.set(spotlightBgImgInnerRef.current, { scale: 1 });
        }

        imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

        window.dispatchEvent(new CustomEvent("introComplete"));
      },
    });

    if (titlesContainerElementRef.current) {
      tl.fromTo(
        titlesContainerElementRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.3,
      );
    }

    tl.to(
      introText1Ref.current,
      {
        x: -moveDistance,
        opacity: 1,
        duration: duration,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      introText2Ref.current,
      {
        x: moveDistance,
        opacity: 1,
        duration: duration,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      spotlightBgImgRef.current,
      {
        scale: 1,
        duration: duration,
        ease: "power2.inOut",
      },
      0,
    );

    tl.to(
      spotlightBgImgInnerRef.current,
      {
        scale: 1,
        duration: duration,
        ease: "power2.inOut",
      },
      0,
    );

    autoAnimationTimelineRef.current = tl;
  };

  useEffect(() => {
    if (!imagesContainerRef.current) return;

    if (spotlightBgImgRef.current && spotlightBgImgInnerRef.current) {
      gsap.set(spotlightBgImgRef.current, { scale: 0, opacity: 0 });
      gsap.set(spotlightBgImgInnerRef.current, { scale: 1.5 });
    }

    if (introText1Ref.current && introText2Ref.current) {
      gsap.set([introText1Ref.current, introText2Ref.current], { opacity: 0 });
    }

    if (titlesContainerElementRef.current) {
      gsap.set(titlesContainerElementRef.current, { opacity: 0 });
    }

    gsap.set(".spotlight-lines", { opacity: 0 });

    const newImageElements: HTMLDivElement[] = [];
    const imagesContainer = imagesContainerRef.current;

    if (!imagesContainer) return;

    while (imagesContainer.firstChild) {
      imagesContainer.removeChild(imagesContainer.firstChild);
    }

    mobileSlidesData.forEach((item, index) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.className = "spotlight-img";
      imgWrapper.style.cursor = "pointer";

      const handleClick: EventListener = (e) => {
        if (hasMovedRef.current) {
          hasMovedRef.current = false;
          return;
        }

        const variantId = mobileSlidesData[index].variantId;
        if (variantId) {
          handleNavigate(variantId);
        }
      };

      imgWrapper.addEventListener("click", handleClick);
      listenersRef.current.push({
        el: imgWrapper,
        type: "click",
        handler: handleClick,
      });

      const handleTouchStart: EventListener = (e) => {
        const touchEvent = e as TouchEvent;
        clickStartPosRef.current = {
          x: touchEvent.touches[0].clientX,
          y: touchEvent.touches[0].clientY,
          time: Date.now(),
        };
        hasMovedRef.current = false;
      };

      imgWrapper.addEventListener("touchstart", handleTouchStart);
      listenersRef.current.push({
        el: imgWrapper,
        type: "touchstart",
        handler: handleTouchStart,
      });

      const handleTouchMove: EventListener = (e) => {
        const touchEvent = e as TouchEvent;
        if (!clickStartPosRef.current) return;
        const deltaX = Math.abs(
          touchEvent.touches[0].clientX - clickStartPosRef.current.x,
        );
        const deltaY = Math.abs(
          touchEvent.touches[0].clientY - clickStartPosRef.current.y,
        );
        if (deltaX > 10 || deltaY > 10) hasMovedRef.current = true;
      };

      imgWrapper.addEventListener("touchmove", handleTouchMove);
      listenersRef.current.push({
        el: imgWrapper,
        type: "touchmove",
        handler: handleTouchMove,
      });

      const handleMouseDown: EventListener = (e) => {
        const mouseEvent = e as MouseEvent;
        clickStartPosRef.current = {
          x: mouseEvent.clientX,
          y: mouseEvent.clientY,
          time: Date.now(),
        };
        hasMovedRef.current = false;
      };

      imgWrapper.addEventListener("mousedown", handleMouseDown);
      listenersRef.current.push({
        el: imgWrapper,
        type: "mousedown",
        handler: handleMouseDown,
      });

      const handleMouseMove: EventListener = (e) => {
        const mouseEvent = e as MouseEvent;
        if (!clickStartPosRef.current) return;
        const deltaX = Math.abs(
          mouseEvent.clientX - clickStartPosRef.current.x,
        );
        const deltaY = Math.abs(
          mouseEvent.clientY - clickStartPosRef.current.y,
        );
        if (deltaX > 10 || deltaY > 10) hasMovedRef.current = true;
      };

      imgWrapper.addEventListener("mousemove", handleMouseMove);
      listenersRef.current.push({
        el: imgWrapper,
        type: "mousemove",
        handler: handleMouseMove,
      });

      const imgElement = document.createElement("img");
      imgElement.src = item.thumbnail;

      imgWrapper.appendChild(imgElement);
      imagesContainerRef.current?.appendChild(imgWrapper);
      newImageElements.push(imgWrapper);
    });

    setImageElements(newImageElements);
    isInitializedRef.current = true;

    ScrollTrigger.refresh();

    setTimeout(() => {
      if (spotlightBgImgRef.current) {
        gsap.to(spotlightBgImgRef.current, {
          opacity: 1,
          duration: 0.7,
          ease: "none",
        });
      }

      setTimeout(() => {
        playAutoIntroAnimation();
      }, 300);
    }, 150);
  }, [router]);

  useEffect(() => {
    if (!isInitializedRef.current || imageElements.length === 0) return;

    if (ctxRef.current) ctxRef.current.revert();

    const ctx = gsap.context(() => {
      const numSlides = mobileSlidesData.length;
      const scrollDistance = window.innerHeight * 80;

      const st = ScrollTrigger.create({
        trigger: spotlightRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.3,
        onUpdate: (self) => {
          if (!autoAnimationCompletedRef.current) {
            imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
            return;
          }

          const rawProgress = self.progress;
          const totalProgress = rawProgress * 12;

          let closestIndex = 0;
          let closestDist = Infinity;

          imageElements.forEach((img, index) => {
            const t = (((totalProgress + index / numSlides) % 1) + 1) % 1;
            const pos = getBezierPosition(t);

            const dist = Math.abs(t - 0.5);

            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = index;
            }

            const spread = 80;
            const offset = (t - 0.5) * spread;

            gsap.set(img, {
              x: pos.x - 100 + offset,
              y: pos.y - 75,
              opacity: 1,
            });
          });

          if (activeIndexRef.current !== closestIndex) {
            animateTitleChange(closestIndex);
          }

          if (currentImageIndexRef.current !== closestIndex) {
            smoothTransitionBackground(
              currentImageIndexRef.current,
              closestIndex,
            );
            currentImageIndexRef.current = closestIndex;
          }

          const lines =
            titlesContainerElementRef.current?.querySelectorAll(".line");
          if (lines) {
            gsap.set(lines, {
              opacity: rawProgress > 0.08 && rawProgress < 0.92 ? 1 : 0,
            });
          }
        },
      });

      scrollTriggerRef.current = st;
    }, spotlightRef);

    ctxRef.current = ctx;

    return () => {
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, [imageElements]);

  return (
    <>
      <section className="spotlight" ref={spotlightRef}>
        <div className="spotlight-bg">
          <div className="spotlight-bg-img" ref={spotlightBgImgRef}>
            <img
              className="bg-img current"
              src={mobileSlidesData[0]?.full}
              alt=""
              ref={spotlightBgImgInnerRef}
            />
            <img
              className="bg-img next"
              src={mobileSlidesData[0]?.full}
              alt=""
            />
          </div>
        </div>

        <div className="spotlight-images" ref={imagesContainerRef}></div>

        <div className="spotlight-ui">
          <div className="spotlight-intro-text-wrapper">
            <p className="spotlight-intro-text" ref={introText1Ref}>
              Featured Products
            </p>
            <p className="spotlight-intro-text" ref={introText2Ref}>
              — Shop Now
            </p>
          </div>

          <div className="spotlight-lines">
            <div className="line line-left" />
            <div className="line line-right" />
            <div className="spotlight-label">Discover</div>
          </div>

          <div className="spotlight-titles-container">
            <div className="spotlight-mask">
              <div className="title current" ref={currentTitleRef}>
                {mobileSlidesData[0]?.title}
              </div>
              <div className="title next" ref={nextTitleRef}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default function PreloaderWrapper(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? (
    <PreloaderMobile {...props} />
  ) : (
    <PreloaderComponent {...props} />
  );
}
