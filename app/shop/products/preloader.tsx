"use client"
import "./style.css";
import { gsap } from "gsap";
import { CustomEase, SplitText, Flip} from "gsap/all";
import Lenis from "@studio-freight/lenis";
import { useRef, useEffect, useMemo, useLayoutEffect, useState, useCallback } from "react";
import * as THREE from "three";
gsap.registerPlugin(CustomEase, SplitText, Flip);
import { useRouter } from "next/navigation";

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
  
  // Only needed for desktop cursor tracking
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
    "/images/shop/caraorange.png"
  ];

  let imageIndex = 0;
  const spawnIntervalRef = useRef(null);
  const isMobileRef = useRef(false);

  const checkIsMobile = useCallback(() => {
    return window.innerWidth <= config.mobileBreakpoint || 
           'ontouchstart' in window || 
           navigator.maxTouchPoints > 0;
  }, []);

  const getRandomPosition = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const padding = 60;
    return {
      x: rect.left + padding + Math.random() * (rect.width - padding * 2),
      y: rect.top + padding + Math.random() * (rect.height - padding * 2)
    };
  }, []);

  const getEdgeSafePosition = useCallback((x, y, size) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    return {
      x: Math.max(rect.left + size/2, Math.min(rect.right - size/2, x)),
      y: Math.max(rect.top + size/2, Math.min(rect.bottom - size/2, y))
    };
  }, []);

  const createImage = useCallback((x, y, speed = 0.5, customRotation = null, sizeMultiplier = 1, index = 0, totalCount = 1) => {
    const imageSrc = images[imageIndex % images.length];
    imageIndex = (imageIndex + 1) % images.length;

    const progress = index / totalCount;
    // Original sizing logic
    let size = config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
    size = size * sizeMultiplier * (1 - progress * 0.2);
    
    const img = document.createElement("img");
    img.className = "trail-img";
    
    let rot;
    if (customRotation !== null) {
      rot = customRotation + (Math.sin(progress * Math.PI) * 15) + (Math.random() - 0.5) * 10;
    } else {
      const rotFactor = 1 + speed * 3; // maxRotationFactor was 3
      rot = (Math.random() - 0.5) * 30 * rotFactor; // baseRotation was 30
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
    
    img.offsetHeight; // Force reflow
    requestAnimationFrame(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
    });

    trailRef.current.push({
      element: img,
      rotation: rot,
      removeTime: Date.now() + config.imageLifespan
    });
  }, [getEdgeSafePosition]);

  // Mobile: Auto flame trail
  const createAutoFlameTrail = useCallback(() => {
    if (isSpawningRef.current || !containerRef.current || !isMobileRef.current) return;
    
    isSpawningRef.current = true;
    const startPos = getRandomPosition();
    const directionAngle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 0.6;
    
    for (let i = 0; i < config.autoSpawnImageCount; i++) {
      const distance = i * config.trailSpacing;
      const curveOffset = Math.sin(i * 0.3) * 12;
      const perpAngle = directionAngle + Math.PI / 2;
      
      const timeoutId = setTimeout(() => {
        const x = startPos.x + Math.cos(directionAngle) * distance + Math.cos(perpAngle) * curveOffset;
        const y = startPos.y + Math.sin(directionAngle) * distance + Math.sin(perpAngle) * curveOffset;
        const sizeMultiplier = 1 - (i / config.autoSpawnImageCount) * 0.3;
        const imageSpeed = speed * (0.6 + (i / config.autoSpawnImageCount) * 0.4);
        const rotation = directionAngle * (180 / Math.PI) + Math.sin(i * 0.5) * 15;
        
        createImage(x, y, imageSpeed, rotation, sizeMultiplier, i, config.autoSpawnImageCount);
        
        if (i === config.autoSpawnImageCount - 1) {
          setTimeout(() => { isSpawningRef.current = false; }, 200);
        }
      }, i * config.staggerDelay);
      activeTimeoutsRef.current.push(timeoutId);
    }
  }, [getRandomPosition, createImage]);

  // Desktop: Cursor trail
  const createCursorTrail = useCallback(() => {
    if (!flags.current.isCursorInContainer || !flags.current.isMoving || isMobileRef.current) return;
    
    const dx = mouseState.current.x - mouseState.current.lastX;
    const dy = mouseState.current.y - mouseState.current.lastY;
    const distance = Math.hypot(dx, dy);
    
    if (distance > config.mouseThreshold) {
      const directionAngle = Math.atan2(dy, dx);
      const speed = Math.min(distance / 50, 1);
      const trailLength = Math.min(Math.floor(speed * 8), 5);
      
      for (let i = 0; i < trailLength; i++) {
        const timeoutId = setTimeout(() => {
          const backX = mouseState.current.x - (dx * (i * 0.15));
          const backY = mouseState.current.y - (dy * (i * 0.15));
          const imageSpeed = speed * (1 - i * 0.1);
          const rotation = directionAngle * (180 / Math.PI) + (Math.random() - 0.5) * 30;
          const sizeMultiplier = 1 - i * 0.1;
          
          createImage(backX, backY, imageSpeed, rotation, sizeMultiplier, i, trailLength);
        }, i * config.staggerDelay);
        activeTimeoutsRef.current.push(timeoutId);
      }
      
      mouseState.current.lastX = mouseState.current.x;
      mouseState.current.lastY = mouseState.current.y;
    }
  }, [createImage]);

  const removeOldImages = useCallback(() => {
    const now = Date.now();
    while (trailRef.current.length > 0 && now >= trailRef.current[0].removeTime) {
      const imgObj = trailRef.current.shift();
      if (imgObj.element && imgObj.element.parentNode) {
        imgObj.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
        imgObj.element.style.transform = `translate(-50%, -50%) rotate(${imgObj.rotation + 360}deg) scale(0)`;
        setTimeout(() => imgObj.element.remove(), config.outDuration);
      }
    }
  }, []);

  // Setup based on device type
  const setupForDesktop = useCallback(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      mouseState.current.x = e.clientX;
      mouseState.current.y = e.clientY;
      flags.current.isCursorInContainer = 
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      
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
    
    // Start auto-spawning
    setTimeout(() => createAutoFlameTrail(), 500);
    spawnIntervalRef.current = setInterval(createAutoFlameTrail, config.autoSpawnInterval);
  }, [createAutoFlameTrail]);

  const handleResize = useCallback(() => {
    const wasMobile = isMobileRef.current;
    const isNowMobile = checkIsMobile();
    
    if (wasMobile !== isNowMobile) {
      isMobileRef.current = isNowMobile;
      
      // Clear all trails
      trailRef.current.forEach(t => t.element?.remove());
      trailRef.current = [];
      activeTimeoutsRef.current.forEach(clearTimeout);
      activeTimeoutsRef.current = [];
      isSpawningRef.current = false;
      
      // Clear intervals
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
      
      // Setup new mode
      if (isNowMobile) {
        setupForMobile();
      }
    }
  }, [checkIsMobile, setupForMobile]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    isMobileRef.current = checkIsMobile();
    
    // Setup desktop mouse tracking (always needed for cursor position)
    const cleanupDesktop = setupForDesktop();
    
    // Setup mobile auto-spawn if needed
    if (isMobileRef.current) {
      setupForMobile();
    }
    
    // Resize listener for responsive switching
    window.addEventListener('resize', handleResize);
    
    // Animation loop for cursor trails (only runs on desktop)
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
      window.removeEventListener('resize', handleResize);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (animationId) cancelAnimationFrame(animationId);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      activeTimeoutsRef.current.forEach(clearTimeout);
      trailRef.current.forEach(t => t.element?.remove());
    };
  }, [setupForDesktop, setupForMobile, handleResize, createCursorTrail, removeOldImages]);

  return (
    <div ref={containerRef} className="flame-trail-container">
      {children}
    </div>
  );
};

CustomEase.create("slideshow-wipe", "0.625, 0.05, 0, 1");
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
    }
  ];
const PreloaderComponent = ({ variants }) => {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true
    return !sessionStorage.getItem("preloaderDone")
  })
  const router = useRouter();

  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const loaderGroupsRef = useRef(null);
  const revealImagesRef = useRef([]);
  const scaleUpMediaRef = useRef(null);
  const scaleDownImagesRef = useRef([]);
  const radiusMediaRef = useRef(null);
  const smallElementsRef = useRef([]);
  const sliderNavRef = useRef([]);
  const splitInstanceRef = useRef(null);
  const mainGroupRef = useRef(null);
  const contentRef = useRef(null);
  const headingContainerRef = useRef(null); 

  const slideshowWrapRef = useRef(null);
  const slidesRef = useRef([]);
  const thumbsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 1.5;
  const hasDismissedHeadingRef = useRef(false);
  const blindsRefs = useRef([]);
  
  const scrollTimeoutRef = useRef(null);
  const accumulatedScrollRef = useRef(0);
  const isScrollingNavRef = useRef(false);


  
  const allSlides = useMemo(() => {
    if (!variants?.length) return []
    return slidesData.map((slide) => {
      const variant = variants.find(v => v.id === slide.variantId)
      if (!variant) {
        console.warn("No match:", slide.variantId)
      }
      return { ...slide, variant }
    })
  }, [variants])
  
  const centerIndex = Math.floor(slidesData.length / 2);

  useEffect(() => {
    if (isLoading) return; 
    
    document.body.style.overflow = "auto";
    document.body.style.height = "100vh";
    
    const scrollThreshold = 80; 
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (isAnimating || isScrollingNavRef.current) return;
      
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      
      if (Math.abs(delta) > 0) {
        accumulatedScrollRef.current += delta;
        
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        if (Math.abs(accumulatedScrollRef.current) >= scrollThreshold) {
          const direction = accumulatedScrollRef.current > 0 ? 1 : -1;
          isScrollingNavRef.current = true;
          navigate(direction);
          accumulatedScrollRef.current = 0;
          
          setTimeout(() => {
            isScrollingNavRef.current = false;
          }, animationDuration * 1000);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          accumulatedScrollRef.current = 0;
        }, 200);
      }
      
      lastScrollY = currentScrollY;
    };
    
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      document.body.style.overflow = "";
    };
  }, [isLoading, isAnimating]);

  useEffect(() => {
    if (isLoading) return;
    
    let wheelTimeout = null;
    let wheelAccumulated = 0;
    const wheelThreshold = 50;
    
    const handleWheel = (e) => {
      if (isAnimating || isScrollingNavRef.current) return;
      
      wheelAccumulated += e.deltaY;
      
      if (Math.abs(wheelAccumulated) >= wheelThreshold) {
        const direction = wheelAccumulated > 0 ? 1 : -1;
        isScrollingNavRef.current = true;
        navigate(direction);
        wheelAccumulated = 0;
        
        setTimeout(() => {
          isScrollingNavRef.current = false;
        }, animationDuration * 1000);
      }
      
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelAccumulated = 0;
      }, 150);
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [isLoading, isAnimating]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      initCrispLoadingAnimation();
    });
  }, []);

  useEffect(() => {
    if (slideshowWrapRef.current && !isLoading) {
      initSlideShow();
    }
  }, [isLoading]);
  
  const initCrispLoadingAnimation = () => {
    const container = containerRef.current;
    if (!container) return;

    const heading = headingRef.current;
    const scaleUpMedia = scaleUpMediaRef.current;
    const scaleDownImages = scaleDownImagesRef.current;
    const smallElements = smallElementsRef.current;
    const sliderNav = sliderNavRef.current;
    const mainGroup = mainGroupRef.current;
    const content = contentRef.current;
    const headingContainer = headingContainerRef.current;

    const images = scaleDownImages
      .map(el => el?.querySelector("img"))
      .filter(Boolean);

    gsap.set(images, {
      scale: 1,
      force3D: true,
      transformOrigin: "center center",
      willChange: "transform",
      backfaceVisibility: "hidden"
    });

    if (scaleUpMedia) {
      gsap.set(scaleUpMedia, {
        force3D: true,
        willChange: "transform, width, height",
        backfaceVisibility: "hidden",
        transformOrigin: "center center"
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => container.classList.remove("is--hidden"),
      onComplete: () => {
        sessionStorage.setItem("preloaderDone", "true");
        setIsLoading(false);

        if (scaleUpMedia) {
          gsap.set(scaleUpMedia, { willChange: "auto" });
        }
        images.forEach(img => {
          gsap.set(img, { willChange: "auto" });
        });
      }
    });

    if (heading) {
      if (headingContainer) {
        gsap.set(headingContainer, { overflow: "hidden" });
      }

      splitInstanceRef.current = new SplitText(heading, {
        type: "words",
        mask: "words"
      });

      gsap.set(splitInstanceRef.current.words, {
        yPercent: 110,
        opacity: 0
      });
    }

    if (mainGroup) gsap.set(mainGroup, { xPercent: 100 });
    if (content) gsap.set(content, { scale: 0.8, opacity: 0, yPercent: 20 });

    const allLoaderImages = document.querySelectorAll(".crisp-loader__media");
    if (allLoaderImages.length) {
      gsap.set(allLoaderImages, { opacity: 1 });
    }

    if (mainGroup) {
      tl.to(mainGroup, { xPercent: 0, duration: 2 }, 0);
    }

    if (images.length) {
      tl.to(images, {
        scale: 0.5,
        opacity: 0.9,
        duration: 1.8, 
        stagger: { 
          each: 0.03, 
          from: "edges",
          ease: "none" 
        },
        ease: "none",
        force3D: true,
        overwrite: true 
      }, "-=1.2");
    }

    if (scaleUpMedia) {
      tl.to(scaleUpMedia, {
        width: "100vw",
        height: "100dvh",
        duration: 1.5,
        ease: "power2.inOut",
        force3D: true,
        overwrite: true
      }, "-=1.5");

      tl.to(scaleUpMedia, {
        width: "5em",
        height: "5em",
        duration: .9,
        ease: "none",
        force3D: true,
        clearProps: "transform" 
      }, "+=0.05"); 
    }

    if (allLoaderImages.length) {
      tl.to(allLoaderImages, {
        opacity: 0,
        duration: 0.6,
        stagger: { each: 0.02, from: "center" },
        onStart: () => {
          const loader = document.querySelector(".crisp-loader");
          if (loader) gsap.set(loader, { pointerEvents: "none" });
        },
        onComplete: () => {
          const loader = document.querySelector(".crisp-loader");
          if (loader) gsap.set(loader, { display: "none" });
        }
      }, "-=0.1");
    }

    if (content) {
      tl.to(content, {
        scale: 1,
        opacity: 1,
        yPercent: 0,
        duration: 0.8,
        ease: "expo.out"
      }, "-=0.4");
    }

    if (splitInstanceRef.current?.words.length) {
      tl.to(splitInstanceRef.current.words, {
        yPercent: 0,
        opacity: 1,
        stagger: { each: 0.06, from: "start" },
        ease: "back.out(0.6)",
        duration: 0.6
      }, "-=0.5");
    }

    if (sliderNav.length) {
      gsap.set(sliderNav, { 
        yPercent: 120,
        opacity: 0,
        scale: 0.95
      });

      tl.to(sliderNav, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "none",
        stagger: {
          each: 0.06,
          ease: "none",
          from: 0
        },
        force3D: true
      }, "-=0.1");
    }
    
    if (smallElements.length) {
      tl.from(smallElements, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.inOut"
      }, "-=0.2");
    }

    tl.call(() => container.classList.remove("is--loading"), null, "+=0.1");
  };
  
  const initSlideShow = () => {
    slidesRef.current.forEach((slide, index) => {
      if (slide) slide.setAttribute('data-index', index);
    });
    
    thumbsRef.current.forEach((thumb, index) => {
      if (thumb) thumb.setAttribute('data-index', index);
    });

    if (slidesRef.current[currentIndex]) {
      slidesRef.current[currentIndex].classList.add('is--current');
    }
    
    if (thumbsRef.current[currentIndex]) {
      thumbsRef.current[currentIndex].classList.add('is--current');
    }
  };
  
  const navigate = (direction, targetIndex = null) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const previous = currentIndex;
    const newIndex = targetIndex !== null
      ? targetIndex
      : direction === 1
      ? (currentIndex + 1) % slidesData.length
      : (currentIndex - 1 + slidesData.length) % slidesData.length;

    const currentSlide = slidesRef.current[previous];
    const upcomingSlide = slidesRef.current[newIndex];
    const cells = cellsMap.current[newIndex];
    const headingContainer = headingContainerRef.current;

    const tl = gsap.timeline({
      onStart() {
        gsap.set(upcomingSlide, { zIndex: 2, autoAlpha: 1 });
        gsap.set(currentSlide, { zIndex: 1, autoAlpha: 1 });

        thumbsRef.current[previous]?.classList.remove("is--current");
        thumbsRef.current[newIndex]?.classList.add("is--current");
      },
      onComplete() {
        currentSlide?.classList.remove("is--current");
        setIsAnimating(false);
        setCurrentIndex(newIndex);
        hasDismissedHeadingRef.current = true;
      },
    });

    const currentContent = currentSlide?.querySelector(".slide-content");
    const content = upcomingSlide?.querySelector(".slide-content");

    if (currentContent) {
      const currentTitle = currentContent.querySelector(".slide-title");
      const currentSub = currentContent.querySelector(".slide-sub");
      const currentDescription = currentContent.querySelector(".slide-description");
      
      if (currentTitle) {
        const split = new SplitText(currentTitle, { type: "chars" });
        tl.to(split.chars, {
          yPercent: -110,
          opacity: 0,
          stagger: { each: 0.02, from: "end" },
          duration: 0.4,
          ease: "power2.in"
        }, 0);
      }

      if (currentSub) {
        const split = new SplitText(currentSub, { type: "chars" });
        tl.to(split.chars, {
          yPercent: -110,
          opacity: 0,
          stagger: { each: 0.015, from: "end" },
          duration: 0.35,
          ease: "power2.in"
        }, 0);
      }
      
      if (currentDescription) {
        const split = new SplitText(currentDescription, { type: "chars" });
        tl.to(split.chars, {
          yPercent: -110,
          opacity: 0,
          stagger: { each: 0.02, from: "end" },
          duration: 0.4,
          ease: "power2.in"
        }, 0);
      }
    }

    if (content) {
      const nextTitle = content.querySelector(".slide-title");
      const nextSub = content.querySelector(".slide-sub");
      const nextDescription = content.querySelector(".slide-description");
      
      if (nextTitle) {
        const split = new SplitText(nextTitle, { type: "chars" });
        gsap.set(split.chars, { yPercent: 110, opacity: 0 });
        tl.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: { each: 0.02, from: "start" },
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.2");
      }

      if (nextSub) {
        const split = new SplitText(nextSub, { type: "chars" });
        gsap.set(split.chars, { yPercent: 110, opacity: 0 });
        tl.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: { each: 0.015, from: "start" },
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.4");
      }
      
      if (nextDescription) {
        const split = new SplitText(nextDescription, { type: "chars" });
        gsap.set(split.chars, { yPercent: 110, opacity: 0 });
        tl.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: { each: 0.015, from: "start" },
          duration: 0.5,
          ease: "power3.out"
        }, "-=0.4");
      }
    }

    if (!hasDismissedHeadingRef.current && splitInstanceRef.current?.words?.length) {
      tl.to(splitInstanceRef.current.words, {
        yPercent: 110,
        opacity: 0,
        stagger: { each: 0.04, from: "end", ease: "power2.in" },
        duration: 0.45,
        ease: "power2.in"
      }, 0);

      if (headingContainer) {
        tl.to(headingContainer, {
          y: 40,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        }, 0);
      }
    }

    if (cells && cells.length) {
      const cols = 10;
      const rows = Math.ceil(cells.length / cols);
      const ordered = [];

      for (let x = cols - 1; x >= 0; x--) {
        const column = [];
        for (let y = 0; y < rows; y++) {
          const index = y * cols + x;
          if (cells[index]) {
            column.push(cells[index]);
          }
        }
        ordered.push(...gsap.utils.shuffle(column));
      }

      gsap.set(cells, { opacity: 0 });

      tl.to(ordered, {
        opacity: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "power3.out",
      }, hasDismissedHeadingRef.current ? 0 : 0.18);

      if (content) {
        tl.to(content, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out"
        }, "-=0.2");
      }
    }
  };

  const handleThumbClick = (index) => {
    if (isAnimating) return;
    navigate(1, index);
  };

  const addToRevealImages = (el) => {
    if (el && !revealImagesRef.current.includes(el)) {
      revealImagesRef.current.push(el);
    }
  };

  const addToScaleDown = (el) => {
    if (el && !scaleDownImagesRef.current.includes(el)) {
      scaleDownImagesRef.current.push(el);
    }
  };

  const addToSliderNav = (el) => {
    if (el && !sliderNavRef.current.includes(el)) {
      sliderNavRef.current.push(el);
    }
  };
  
  const createCells = (group) => {
    if (!group) return [];
    group.innerHTML = "";
    const cols = 10;
    const rows = Math.round((viewportDimensions.height / viewportDimensions.width) * cols);
    const cells = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const overlap = 0.1; 
        rect.setAttribute("x", `${(x / cols) * 100}%`);
        rect.setAttribute("y", `${(y / rows) * 100}%`);
        rect.setAttribute("width", `${100 / cols + overlap}%`);
        rect.setAttribute("height", `${100 / rows + overlap}%`);
        rect.setAttribute("fill", "white");
        rect.setAttribute("opacity", 0);
        rect.setAttribute("shape-rendering", "crispEdges");
        group.appendChild(rect);
        cells.push(rect);
      }
    }
    return cells;
  };
  
  const cellsMap = useRef([]);

  useEffect(() => {
    cellsMap.current = blindsRefs.current.map((group) => createCells(group));
  }, []);

  const [viewportDimensions, setViewportDimensions] = useState({ width: 16, height: 9 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewportDimensions({ width: 100, height: (100 * height) / width });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <>
      <section ref={containerRef} data-slideshow="wrap" className="crisp-header is--loading is--hidden">
        <div className="crisp-header__slider">
          <div className="crisp-header__slider-list">
            {allSlides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => (slidesRef.current[index] = el)}
                className="crisp-header__slider-slide"
              >
                <svg
                  className="slide-svg"
                  viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
                  preserveAspectRatio="xMidYMid slice" 
                  style={{ pointerEvents: "none" }} 
                >
                  <defs>
                    <mask id={`mask-${index}`}>
                      <rect width="100%" height="100%" fill="black" />
                      <g ref={(el) => (blindsRefs.current[index] = el)} />
                    </mask>
                  </defs>
                  <image
                    href={slide.full}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice" 
                    mask={`url(#mask-${index})`}
                  />
                </svg>
                <div
                  className="slide-content"
                  onClick={() => {
                    if (!slide.variant) {
                      console.warn("No variant for slide:", slide)
                      return
                    }
                    router.push(`/shop/products/${slide.variant.id}`)
                  }}
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    pointerEvents: "auto",
                    cursor: "pointer"
                  }}
                >
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-sub">{slide.subtitle}</p>
                  <p className="slide-description">{slide.description}</p>
                  <p className="slide-text">View Product</p>
                </div>
              </div>
            ))}
          </div>
          <FlameTrail />
        </div>

        <div className="crisp-loader">
          <div className="crisp-loader__wrap">
            <div className="crisp-loader__groups" ref={loaderGroupsRef}>
              <div className="crisp-loader__group is--relative" ref={mainGroupRef}>
                {allSlides.map((image, idx) => {
                  const isCenter = idx === centerIndex;
                  return (
                    <div key={`main-${idx}`} className={`crisp-loader__single ${isCenter ? 'is--center' : ''}`}>
                      <div 
                        className={`crisp-loader__media ${isCenter ? 'is--scaling is--radius' : ''}`}
                        ref={isCenter
                          ? (el) => {
                              scaleUpMediaRef.current = el;
                              radiusMediaRef.current = el;
                            }
                          : (el) => addToScaleDown(el)
                        }
                      >
                        <img
                          src={image.thumbnail}
                          alt={image.alt}
                          className={`crisp-loader__cover-img ${!isCenter ? 'is--scale-down' : ''}`}
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

        <div ref={contentRef} className="crisp-header__content">
          <div className="crisp-header__center">
            <div ref={headingContainerRef} className="crisp-header__heading-container">
              <h1 className="crisp-header__h1" ref={headingRef}>Browse our e-shop</h1>
            </div>
          </div>
          <div className="crisp-header__bottom">
            <div className="crisp-header__bottom__header">
              Select an item
            </div>
            <div className="crisp-header__slider-nav">
              {slidesData.map((slide, index) => (
                <button
                  key={slide.id}
                  ref={(el) => {
                    if (el) {
                      thumbsRef.current[index] = el;
                      addToSliderNav(el);
                    }
                  }}
                  data-slideshow="thumb"
                  className="crisp-header__slider-nav-btn"
                  onClick={() => handleThumbClick(index)}
                  type="button"
                >
                  <img
                    loading="eager"
                    src={slide.thumbnail}
                    alt={slide.alt}
                    className="crisp-loader__cover-img"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

function PreloaderMobile() {
  const [isLoading, setIsLoading] = useState(true);

  const stripRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    runAnimation();
  }, []);

  const runAnimation = () => {
    const strip = stripRef.current;
    const items = itemsRef.current;

    if (!strip || !items.length) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setIsLoading(false);
        sessionStorage.setItem("preloaderDone", "true");
      }
    });


    tl.fromTo(
      strip,
      { xPercent: 100 },
      {
        xPercent: 0,
        duration: 0.8,
        ease: "power2.out"
      },
      0
    );


    gsap.set(items, {
      yPercent: 120,
      opacity: 0
    });

    tl.to(
      items,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.4,
        stagger: {
          each: 0.05,
          from: 0
        },
        ease: "power2.out"
      },
      "-=0.3"
    );

tl.call(() => {
  const state = Flip.getState([strip, ...items]);


  strip.classList.add("is--vertical");

  Flip.from(state, {
    duration: 0.8,
    ease: "power2.inOut",
    stagger: {
      each: 0.04,
      from: "start"
    },
    absolute: true,
    nested: true 
  });

}, null, "+=0.15");

  };

  return (
    <section className="mobile-preloader">
      <div ref={stripRef} className="mobile-strip">
        {slidesData.map((slide, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="mobile-item"
          >
            <img src={slide.thumbnail} />
            <p>{slide.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function PreloaderWrapper(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile
    ? <PreloaderMobile {...props} />
    : <PreloaderComponent {...props} />;
}