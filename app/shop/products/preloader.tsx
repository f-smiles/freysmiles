"use client"
import "./style.css";
import { gsap } from "gsap";
import { CustomEase, SplitText} from "gsap/all";
import Lenis from "@studio-freight/lenis";
import { useRef, useEffect, useMemo, useLayoutEffect, useState, useCallback } from "react";
import * as THREE from "three";
gsap.registerPlugin(CustomEase, SplitText);
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
  const imagePoolRef = useRef([]);
  

  const config = {
    imageCount: 14,
    imageLifespan: 600,
    removalDelay: 16,
    mouseThreshold: 40,
    scrollThreshold: 50,
    inDuration: 600,
    outDuration: 1200,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
    touchImageInterval: 40,
    minMovementForImage: 5,
  baseImageSize: 80,    
  minImageSize: 40,    
  maxImageSize: 120,  
    baseRotation: 30,
    maxRotationFactor: 3,
    speedSmoothingFactor: 0.25,
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

  const mouseState = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    prevX: 0,
    prevY: 0
  });
  
  const flags = useRef({
    isMoving: false,
    isCursorInContainer: false,
    isTouching: false,
    isScrolling: false,
    scrollTicking: false
  });

  const timers = useRef({
    lastRemovalTime: 0,
    lastTouchImageTime: 0,
    lastScrollTime: 0,
    lastMoveTime: Date.now()
  });

  const speedData = useRef({
    smoothedSpeed: 0,
    maxSpeed: 0
  });

  let imageIndex = 0;

  const isInContainer = useCallback((x, y) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }, []);

  const hasMovedEnough = useCallback(() => {
    const dx = mouseState.current.x - mouseState.current.lastX;
    const dy = mouseState.current.y - mouseState.current.lastY;
    return Math.hypot(dx, dy) > config.mouseThreshold;
  }, []);

  const hasMovedAtAll = useCallback(() => {
    const dx = mouseState.current.x - mouseState.current.prevX;
    const dy = mouseState.current.y - mouseState.current.prevY;
    return Math.hypot(dx, dy) > config.minMovementForImage;
  }, []);

  const calculateSpeed = useCallback(() => {
    const now = Date.now();
    const dt = now - timers.current.lastMoveTime;
    if (dt <= 0) return 0;
    
    const dist = Math.hypot(
      mouseState.current.x - mouseState.current.prevX,
      mouseState.current.y - mouseState.current.prevY
    );
    const raw = dist / dt;
    
    if (raw > speedData.current.maxSpeed) speedData.current.maxSpeed = raw;
    const norm = Math.min(raw / (speedData.current.maxSpeed || 0.5), 1);
    
    speedData.current.smoothedSpeed = 
      speedData.current.smoothedSpeed * (1 - config.speedSmoothingFactor) + 
      norm * config.speedSmoothingFactor;
    
    timers.current.lastMoveTime = now;
    return speedData.current.smoothedSpeed;
  }, []);



  const createImage = useCallback((speed = 0.5) => {
    const imageSrc = images[imageIndex % images.length];
    imageIndex = (imageIndex + 1) % images.length;

    const size = config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
    
    const img = document.createElement("img");
    img.className = "trail-img";
    const rotFactor = 1 + speed * (config.maxRotationFactor - 1);
    const rot = (Math.random() - 0.5) * config.baseRotation * rotFactor;

    img.src = imageSrc;
    img.width = img.height = size;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = mouseState.current.x - rect.left;
    const y = mouseState.current.y - rect.top;
    
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
    img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;
    
    containerRef.current?.appendChild(img);

    setTimeout(() => {
      img.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
    }, 10);

    trailRef.current.push({
      element: img,
      rotation: rot,
      removeTime: Date.now() + config.imageLifespan,
      isFlame: true
    });
  }, [config]);

  const createTrailImage = useCallback(() => {
    if (!flags.current.isCursorInContainer) return;
    if (flags.current.isMoving && hasMovedEnough() && hasMovedAtAll()) {
      mouseState.current.lastX = mouseState.current.x;
      mouseState.current.lastY = mouseState.current.y;
      const speed = calculateSpeed();
      createImage(speed);
      mouseState.current.prevX = mouseState.current.x;
      mouseState.current.prevY = mouseState.current.y;
    }
  }, [hasMovedEnough, hasMovedAtAll, calculateSpeed, createImage]);

  const createTouchTrailImage = useCallback(() => {
    if (!flags.current.isCursorInContainer || !flags.current.isTouching || !hasMovedAtAll()) return;
    
    const now = Date.now();
    if (now - timers.current.lastTouchImageTime < config.touchImageInterval) return;
    
    timers.current.lastTouchImageTime = now;
    const speed = calculateSpeed();
    createImage(speed);
    mouseState.current.prevX = mouseState.current.x;
    mouseState.current.prevY = mouseState.current.y;
  }, [hasMovedAtAll, calculateSpeed, createImage]);

  const createScrollTrailImage = useCallback(() => {
    if (!flags.current.isCursorInContainer || !flags.current.isScrolling) return;
    
    mouseState.current.lastX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    mouseState.current.lastY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
    createImage(0.5);
    mouseState.current.lastX = mouseState.current.x;
    mouseState.current.lastY = mouseState.current.y;
  }, [createImage]);

  const removeOldImages = useCallback(() => {
    const now = Date.now();
    if (now - timers.current.lastRemovalTime < config.removalDelay || !trailRef.current.length) return;
    
    if (now >= trailRef.current[0].removeTime) {
      const imgObj = trailRef.current.shift();
      imgObj.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
      imgObj.element.style.transform = `translate(-50%, -50%) rotate(${imgObj.rotation + 360}deg) scale(0)`;
      setTimeout(() => imgObj.element.remove(), config.outDuration);
      timers.current.lastRemovalTime = now;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const setInitialMousePos = (e) => {
      mouseState.current.x = mouseState.current.lastX = mouseState.current.prevX = e.clientX;
      mouseState.current.y = mouseState.current.lastY = mouseState.current.prevY = e.clientY;
      flags.current.isCursorInContainer = isInContainer(mouseState.current.x, mouseState.current.y);
      document.removeEventListener("mouseover", setInitialMousePos);
    };
    document.addEventListener("mouseover", setInitialMousePos);


    const handleMouseMove = (e) => {
      mouseState.current.prevX = mouseState.current.x;
      mouseState.current.prevY = mouseState.current.y;
      mouseState.current.x = e.clientX;
      mouseState.current.y = e.clientY;
      flags.current.isCursorInContainer = isInContainer(mouseState.current.x, mouseState.current.y);
      
      if (flags.current.isCursorInContainer && hasMovedAtAll()) {
        flags.current.isMoving = true;
        clearTimeout(window.moveTimeout);
        window.moveTimeout = setTimeout(() => {
          flags.current.isMoving = false;
        }, 100);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);


    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      mouseState.current.prevX = mouseState.current.x;
      mouseState.current.prevY = mouseState.current.y;
      mouseState.current.x = touch.clientX;
      mouseState.current.y = touch.clientY;
      mouseState.current.lastX = mouseState.current.x;
      mouseState.current.lastY = mouseState.current.y;
      flags.current.isCursorInContainer = true;
      flags.current.isTouching = true;
      timers.current.lastMoveTime = Date.now();
    };
    
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const dy = Math.abs(touch.clientY - mouseState.current.prevY);
      mouseState.current.prevX = mouseState.current.x;
      mouseState.current.prevY = mouseState.current.y;
      mouseState.current.x = touch.clientX;
      mouseState.current.y = touch.clientY;
      flags.current.isCursorInContainer = true;
      
      if (dy > Math.abs(touch.clientX - mouseState.current.prevX)) return;
      createTouchTrailImage();
    };
    
    const handleTouchEnd = () => {
      flags.current.isTouching = false;
    };
    
    containerRef.current.addEventListener("touchstart", handleTouchStart);
    containerRef.current.addEventListener("touchmove", handleTouchMove);
    containerRef.current.addEventListener("touchend", handleTouchEnd);

    const handleScroll = () => {
      flags.current.isCursorInContainer = isInContainer(mouseState.current.x, mouseState.current.y);
      if (flags.current.isCursorInContainer) {
        flags.current.isScrolling = true;
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
          flags.current.isScrolling = false;
        }, 100);
      }
    };
    
    const handleScrollThrottled = () => {
      const now = Date.now();
      if (now - timers.current.lastScrollTime < config.scrollThreshold) return;
      timers.current.lastScrollTime = now;
      
      if (!flags.current.scrollTicking && flags.current.isCursorInContainer) {
        requestAnimationFrame(() => {
          if (flags.current.isScrolling) createScrollTrailImage();
          flags.current.scrollTicking = false;
        });
        flags.current.scrollTicking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScrollThrottled, { passive: true });


    let animationId;
    const animate = () => {
      if (flags.current.isMoving || flags.current.isTouching || flags.current.isScrolling) {
        createTrailImage();
      }
      removeOldImages();
      animationId = requestAnimationFrame(animate);
    };
    animate();


    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mouseover", setInitialMousePos);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollThrottled);
      if (containerRef.current) {
        containerRef.current.removeEventListener("touchstart", handleTouchStart);
        containerRef.current.removeEventListener("touchmove", handleTouchMove);
        containerRef.current.removeEventListener("touchend", handleTouchEnd);
      }
      clearTimeout(window.moveTimeout);
      clearTimeout(window.scrollTimeout);
    };
  }, [isInContainer, hasMovedAtAll, createTouchTrailImage, createScrollTrailImage, createTrailImage, removeOldImages]);

  return (
    <div ref={containerRef} className="flame-trail-container">
      {children}
    </div>
  );
};

CustomEase.create("slideshow-wipe", "0.625, 0.05, 0, 1");

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
  const dotGridWrapperRef = useRef(null);

  const slideshowWrapRef = useRef(null);
  const slidesRef = useRef([]);
  const innerRef = useRef([]);
  const thumbsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 1.5;
  const hasDismissedHeadingRef = useRef(false);
  const blindsRefs = useRef([]);
  
  // Scroll navigation refs
  const scrollTimeoutRef = useRef(null);
  const accumulatedScrollRef = useRef(0);
  const isScrollingNavRef = useRef(false);

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
    const radiusMedia = radiusMediaRef.current;
    const smallElements = smallElementsRef.current;
    const sliderNav = sliderNavRef.current;
    const mainGroup = mainGroupRef.current;
    const content = contentRef.current;
    const headingContainer = headingContainerRef.current;

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => container.classList.remove('is--hidden'),
      onComplete: () => {
        sessionStorage.setItem("preloaderDone", "true") 
        setIsLoading(false) 
      }
    })

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

    const allLoaderImages = document.querySelectorAll('.crisp-loader__media');
    if (allLoaderImages.length) gsap.set(allLoaderImages, { opacity: 1 });

    // Animation timeline
    if (mainGroup) {
      tl.to(mainGroup, { xPercent: 0, duration: 2.5 }, 0);
    }

    if (scaleDownImages.length) {
      tl.to(scaleDownImages, {
        scale: 0.5,
        duration: 2,
        stagger: { each: 0.05, from: "edges", ease: "none" },
        onComplete: () => {
          if (radiusMedia) radiusMedia.classList.remove('is--radius');
        }
      }, "-=1.2");
    }

    if (scaleUpMedia) {
      tl.to(scaleUpMedia, {
        width: "100vw",
        height: "100dvh",
        duration: 1.5
      }, "-=1.5");
    }

    if (scaleUpMedia) {
      tl.to(scaleUpMedia, {
        width: "5em",
        height: "5em",
        duration: 1.2
      }, "+=0.2");
    }

    if (allLoaderImages.length) {
      tl.to(allLoaderImages, {
        opacity: 0,
        duration: 0.6,
        stagger: { each: 0.02, from: "center" },
        onStart: () => {
          const loader = document.querySelector('.crisp-loader');
          if (loader) gsap.set(loader, { pointerEvents: 'none' });
        },
        onComplete: () => {
          const loader = document.querySelector('.crisp-loader');
          if (loader) gsap.set(loader, { display: 'none' });
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
        stagger: { each: 0.06, from: "start", ease: "power2.out" },
        ease: "back.out(0.6)",
        duration: 0.6
      }, "-=0.5");
    }

    if (sliderNav.length) {
      gsap.set(sliderNav, { yPercent: 150, opacity: 0 });
      tl.to(sliderNav, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.05,
        ease: "expo.out",
        duration: 0.8
      }, "-=0.2");
    }

    if (smallElements.length) {
      tl.from(smallElements, {
        opacity: 0,
        ease: "power1.inOut",
        duration: 0.2
      }, "-=0.2");
    }

    tl.call(() => container.classList.remove('is--loading'), null, "+=0.1");
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
  const rebuildGrids = () => {
  cellsMap.current = blindsRefs.current.map((group) => createCells(group));
};
const createCells = (group) => {
  if (!group) return [];

  group.innerHTML = "";

const cols = window.innerWidth < 768 ? 6 : 10;

  const cellSize = window.innerWidth / cols;
  const rows = Math.ceil(window.innerHeight / cellSize);

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
useEffect(() => {
  rebuildGrids();

  const handleResize = () => {
    rebuildGrids();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
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
                  preserveAspectRatio="none"
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

export default PreloaderComponent;