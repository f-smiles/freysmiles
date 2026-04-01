"use client"
import "./style.css";
import { gsap } from "gsap";
import { CustomEase, SplitText} from "gsap/all";
import Lenis from "@studio-freight/lenis";
import { useRef, useEffect, useMemo, useLayoutEffect, useState } from "react";
import * as THREE from "three";
gsap.registerPlugin(CustomEase, SplitText);

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
const CircleGridMouseFollow = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshesRef = useRef([]);
  const lerpedPositionRef = useRef(new THREE.Vector3());
  const animationIdRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;
    
    const resizeToContainer = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    resizeToContainer();

    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const width = 0.85;
    const geometry = new THREE.CircleGeometry(width, 64);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xEBFA84,
      emissive: 0xEBFA84,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 1.0,
      shininess: 120, 
      specular: 0x000000,
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xEBFA84, 1.2);
    rimLight.position.set(-4, 0, -6);
    scene.add(rimLight);

    const meshes = [];
    const gridX = 10;
    const gridY = 5;
    const gap = width * 0.1;
    const widthWithGap = width + gap;

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          (i - (gridX - 1) / 2) * widthWithGap * 2,
          (j - (gridY - 1) / 2) * widthWithGap * 2,
          0,
        );
        
        mesh.userData.originalRotation = mesh.rotation.clone();
        
        scene.add(mesh);
        meshes.push(mesh);
      }
    }
    meshesRef.current = meshes;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetPosition = new THREE.Vector3();

    const hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5);

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersectionPoint = new THREE.Vector3();
      const ray = new THREE.Ray();
      ray.origin.copy(raycaster.ray.origin);
      ray.direction.copy(raycaster.ray.direction);

      if (ray.intersectPlane(hitPlane, intersectionPoint)) {
        targetPosition.copy(intersectionPoint);

        gsap.to(lerpedPositionRef.current, {
          duration: 0.5,
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          ease: "power2.out",
        });
      }
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (meshesRef.current.length > 0) {
        meshesRef.current.forEach((mesh) => {
          const toMouse = new THREE.Vector3()
            .subVectors(lerpedPositionRef.current, mesh.position);
          
          const distance = toMouse.length();
          toMouse.normalize();
          
          const targetRotation = new THREE.Euler();
          
          targetRotation.x = -toMouse.y * 0.7;
          targetRotation.y = toMouse.x * 0.7;
          
          mesh.rotation.x += (targetRotation.x - mesh.rotation.x) * 0.1;
          mesh.rotation.y += (targetRotation.y - mesh.rotation.y) * 0.1;

          const influenceRadius = 6.0;
          const distanceFactor = THREE.MathUtils.clamp(
            1.0 - distance / influenceRadius,
            0,
            1
          );
          
          const circleNormal = new THREE.Vector3(0, 0, 1);
          circleNormal.applyEuler(mesh.rotation);
          const facingCamera = Math.abs(circleNormal.dot(new THREE.Vector3(0, 0, 1)));
          
          const minOpacity = 0.3;
          const targetOpacity = minOpacity + (1 - minOpacity) * facingCamera;
          
          mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
          
          const scaleBase = 0.95;
          const scaleEffect = 0.1 * distanceFactor;
          const finalScale = scaleBase + scaleEffect;
          
          mesh.scale.set(finalScale, finalScale, 1);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    
    function handleResize() {
      resizeToContainer();
    }

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            object.material.dispose();
          }
        });
      }

      rendererRef.current.dispose();
    };
  }, []);

  return <div ref={containerRef} className="dot-grid-canvas" />;
};
gsap.registerPlugin(SplitText, CustomEase);
CustomEase.create("slideshow-wipe", "0.625, 0.05, 0, 1");
const PreloaderComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
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

const blindsRefs = useRef([]);

const slidesData = [
  {
    id: 1,
    thumbnail: "/images/poladaymockup.png",
    full: "/images/shop/poladay95.png",
    alt: "Close-up of textured green headphones"
  },
  {
    id: 2,
    thumbnail: "/images/shop/caracarathumb.png",
    full: "/images/shop/caracocomockupfull.png",
    alt: "Close-up of a rounded corner of a brown leather phone case"
  },
 {
    id: 3,
    thumbnail: "/images/shop/15x12cocostrawberry.png",
    full: "/images/shop/strawberryfull.png",
    alt: "Close-up view of a rounded corner of a textured object"
  },
  {
    id: 4,
    thumbnail: "/images/shop/embertaketwo.png",
    full: "/images/shop/emberfull.png",
    alt: "Close-up of a curved corner of a sleek, modern device"
  },
    {
    id: 5,
    thumbnail: "/images/giftcardmockup.png",
    full: "/images/shop/giftcardmockupfull.png",
    alt: "Close-up of a corner of a tablet with a smooth glass screen"
  },
 
    {
    id: 6,
    thumbnail: "/images/shop/whiteinvisscene.png",
    full: "/images/shop/whiteinvisscenefull.png",
    alt: "Close-up view of a rounded corner of a textured object"
  },
   {
    id: 7,
    thumbnail: "/images/shop/pola35full.png",
    full: "/images/shop/pola35full.png",
    alt: "Close-up view of a rounded corner of a textured object"
  },
     {
    id: 8,
    thumbnail: "/images/shop/15x12cocomint.png",
    full: "/images/shop/cocomintfull.png",
    alt: "Close-up view of a rounded corner of a textured object"
  },
    {
    id: 9,
    thumbnail: "/images/shop/zimawhitefull.png",
    full: "/images/shop/zimawhitefull.png",
    alt: "Close-up view of a rounded corner of a textured object"
  }
];
  const centerIndex = Math.floor(slidesData.length / 2);

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
      onComplete: () => setIsLoading(false)
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

    const allLoaderImages = document.querySelectorAll('.crisp-loader__media');
    if (allLoaderImages.length) gsap.set(allLoaderImages, { opacity: 1 });

    // Animation 1: Main group slides in
    if (mainGroup) {
      tl.to(mainGroup, { xPercent: 0, duration: 2.5 }, 0);
    }

    // Animation 2: Side images scale down
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

    // Animation 3: Center image scales up
    if (scaleUpMedia) {
      tl.to(scaleUpMedia, {
        width: "100vw",
        height: "100dvh",
        duration: 1.5
      }, "-=1.5");
    }

    // Animation 4: Center image scales back down
    if (scaleUpMedia) {
      tl.to(scaleUpMedia, {
        width: "5em",
        height: "5em",
        duration: 1.2
      }, "+=0.2");
    }

    // Animation 5: Loader images fade out
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

    // Animation 6: Content scales up
    if (content) {
      tl.to(content, {
        scale: 1,
        opacity: 1,
        yPercent: 0,
        duration: 0.8,
        ease: "expo.out"
      }, "-=0.4");
    }

    // Animation 7: Heading words slide up
    if (splitInstanceRef.current?.words.length) {
      tl.to(splitInstanceRef.current.words, {
        yPercent: 0,
        opacity: 1,
        stagger: { each: 0.06, from: "start", ease: "power2.out" },
        ease: "back.out(0.6)",
        duration: 0.6
      }, "-=0.5");
    }

    // Animation 8: Navigation slides up
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

    // Animation 9: Small elements fade in
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
  const newIndex =
    targetIndex !== null
      ? targetIndex
      : direction === 1
      ? (currentIndex + 1) % slidesData.length
      : (currentIndex - 1 + slidesData.length) % slidesData.length;

  const currentSlide = slidesRef.current[previous];
  const upcomingSlide = slidesRef.current[newIndex];
  const cells = cellsMap.current[newIndex];

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
    },
  });

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
    });
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
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      rect.setAttribute("x", `${(x / cols) * 100}%`);
      rect.setAttribute("y", `${(y / rows) * 100}%`);
      rect.setAttribute("width", `${100 / cols}%`);
      rect.setAttribute("height", `${100 / rows}%`);
      rect.setAttribute("fill", "white");
      rect.setAttribute("opacity", 0);

      group.appendChild(rect);
      cells.push(rect);
    }
  }

  return cells;
};
const cellsMap = useRef([]);

useEffect(() => {
  cellsMap.current = blindsRefs.current.map((group) =>
    createCells(group)
  );
}, []);

const [viewportDimensions, setViewportDimensions] = useState({ width: 16, height: 9 });

useEffect(() => {
  const updateDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Use a normalized viewBox that maintains aspect ratio
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
  {slidesData.map((slide, index) => (
    <div
      key={slide.id}
      ref={(el) => (slidesRef.current[index] = el)}
      className="crisp-header__slider-slide"
    >
  <svg
  className="slide-svg"
  viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
  preserveAspectRatio="none"
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
    </div>
  ))}
</div>
      </div>


      <div className="crisp-loader">
        <div className="crisp-loader__wrap">
          <div className="crisp-loader__groups" ref={loaderGroupsRef}>
            <div 
              className="crisp-loader__group is--relative" 
              ref={mainGroupRef}
            >
              {slidesData.map((image, idx) => {
              const isCenter = idx === centerIndex;
                return (
                  <div 
                    key={`main-${idx}`} 
                    className={`crisp-loader__single ${isCenter ? 'is--center' : ''}`}
                  >
                    <div 
                      className={`crisp-loader__media ${
                        isCenter ? 'is--scaling is--radius' : ''
                      }`}
                      ref={
                        isCenter
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
                        className={`crisp-loader__cover-img ${
                          !isCenter ? 'is--scale-down' : ''
                        }`}
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
            <div className="dot-grid-wrapper" ref={dotGridWrapperRef}>
          <CircleGridMouseFollow />
        </div>
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