"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import {
  Sphere,
  OrbitControls,
  Environment,
  shaderMaterial,
} from "@react-three/drei";
import { Fluid } from "/utils/FluidCursorTemp.js";
import { Media } from "/utils/Media.js";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimation,
} from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger, MotionPathPlugin, SplitText } from "gsap-trial/all";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, SplitText, MorphSVGPlugin);

const StepsSection = () => {
  // useEffect(() => {
  //   const timeline = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: "#container",
  //       start: "top top",
  //       end: "bottom bottom",
  //       scrub: true,
  //     },
  //   });

  //   // Morph icon-1 to icon-2
  //   iconPaths[0].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon1-path${i}`,
  //       {
  //         morphSVG: `#icon2-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start"
  //     );
  //   });

  //   // Morph icon-2 to icon-3
  //   iconPaths[1].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon2-path${i}`,
  //       {
  //         morphSVG: `#icon3-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=2"
  //     );
  //   });

  //   // Morph icon-3 to icon-4
  //   iconPaths[2].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon3-path${i}`,
  //       {
  //         morphSVG: `#icon4-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=4"
  //     );
  //   });

  //   // Morph icon-4 to icon-5
  //   iconPaths[3].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon4-path${i}`,
  //       {
  //         morphSVG: `#icon5-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=6"
  //     );
  //   });

  //   // Morph icon-5 back to icon-1 (optional for looping)
  //   iconPaths[4].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon5-path${i}`,
  //       {
  //         morphSVG: `#icon1-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=8"
  //     );
  //   });
  // }, []);


  return (
    <div
      ref={containerRef}
      className="relative flex w-full bg-[#D9CDE5] px-20 py-36 min-h-[200vh]"
    >
      <div className="w-3/5 flex overflow-y-auto">
        <div className="w-1/2 flex flex-col relative">
          <div className="relative h-full flex flex-col justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-6">
                <span className="font-neue-montreal text-sm w-6">
                  {step.number}
                </span>
              </div>
            ))}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gray-400 h-full"></div>
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-[#FE2F01] h-full"
              style={{ height: progressHeight }}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col space-y-40">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <h2 className="font-neue-montreal text-2xl">{step.title}</h2>
              <p className="text-gray-600 text-md font-neue-montreal">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/5 sticky top-0 h-screen flex flex-col justify-center items-center relative">
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col items-center space-y-6">
            {/* 
          <div className="flex justify-center">
   <div ref={container1Ref} >
    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[0].paths.map((path, i) => (
        <path
          key={`icon1-${i}`}
          ref={el => pathsRef.current[`icon1-${i}`] = el}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "#FF6E30" : "transparent"}
        />
      ))}
    </svg>
    </div>
    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[1].paths.map((path, i) => (
        <path
          key={`icon2-${i}`}
          d={path}
          stroke={i === 4 ? "#F5F5F7" : "#FF6E30"}
          strokeWidth="2"
          strokeLinecap={i === 4 ? "round" : "butt"}
          fill={i === 0 ? "#FF6E30" : "transparent"}
          strokeDasharray={i === 2 ? "7 7" : "none"}
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[2].paths.map((path, i) => (
        <path
          key={`icon3-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "transparent" : "#FF6E30"}
          strokeWidth="2"
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[3].paths.map((path, i) => (
        <path
          key={`icon4-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "#FF6E30" : "transparent"}
          strokeWidth="2"
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[4].paths.map((path, i) => (
        <path
          key={`icon5-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 6 ? "#FF6E30" : "transparent"}
          strokeWidth="2"
        />
      ))}
    </svg>
  </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const FinancingTreatment = () => {
  // const canvasRef = useRef();

  // useEffect(() => {
  //   const camera = new THREE.PerspectiveCamera(
  //     45,
  //     window.innerWidth / window.innerHeight,
  //     1,
  //     100
  //   );
  //   camera.position.set(0, -0.5, 25);
  //   const scene = new THREE.Scene();
  //   const renderer = new THREE.WebGLRenderer({ alpha: true });
  //   renderer.setClearColor(0x000000, 0);

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   canvasRef.current.appendChild(renderer.domElement);

  //   const vertexShader = `
  //       varying vec2 vUv;
  //       void main() {
  //         vUv = uv;
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //       }
  //     `;

  //   const fragmentShader = `
  //       precision highp float;
  //       varying vec2 vUv;
  //       uniform vec3 u_c1;
  //       uniform vec3 u_c2;
  //       uniform float u_time;
  //       void main() {
  //         vec3 pX = vec3(vUv.x);
  //         vec3 pY = vec3(vUv.y);
  //         vec3 c1 = u_c1;
  //         vec3 c2 = u_c2;
  //         vec3 c3 = vec3(0.0, 1.0, 1.0); // aqua
  //         vec3 cmix1 = mix(c1, c2, pX + pY/2. + cos(u_time));
  //         vec3 cmix2 = mix(c2, c3, (pY - sin(u_time))*0.5);
  //         vec3 color = mix(cmix1, cmix2, pX * cos(u_time+2.));
  //         gl_FragColor = vec4(color, 1.0);
  //       }
  //     `;

  //   const uniforms = {
  //     u_c1: { type: "v3", value: new THREE.Vector3(0.9, 0.8, 0.3) },
  //     u_c2: { type: "v3", value: new THREE.Vector3(1.0, 0.54, 0.4) },
  //     u_time: { type: "f", value: 0 },
  //   };
  //   const shaderMaterial = new THREE.ShaderMaterial({
  //     uniforms,
  //     vertexShader,
  //     fragmentShader,
  //   });

  //   // const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   // const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   // scene.add(gum);

  //   // const bgGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  //   // const bgMesh = new THREE.Mesh(bgGeometry, shaderMaterial);
  //   // scene.add(bgMesh);

  //   const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   scene.add(gum);
  //   const clock = new THREE.Clock();
  //   const animate = () => {
  //     uniforms.u_time.value = clock.getElapsedTime();
  //     renderer.render(scene, camera);
  //     requestAnimationFrame(animate);
  //   };
  //   animate();

  //   const handleResize = () => {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   };
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     const canvasElement = renderer.domElement;
  //     if (canvasRef.current?.contains(canvasElement)) {
  //       canvasRef.current.removeChild(canvasElement);
  //     }
  //   };
  // }, []);

  // const containerRef = useRef(null);
  // const pathRef = useRef(null);
  // const dottedEllipsesRef = useRef([]);
  // const [ellipseFinalY, setEllipseFinalY] = useState(null);
  // const [isEllipseDrawn, setIsEllipseDrawn] = useState(false);
  // const [isOrbScaledDown, setIsOrbScaledDown] = useState(false);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     gsap.fromTo(
  //       containerRef.current,
  //       { opacity: 0 },
  //       { opacity: 1, duration: 2.5, ease: "power2.out" }
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!pathRef.current || !isOrbScaledDown) return;

  //   const path = pathRef.current;
  //   const pathLength = path.getTotalLength();

  //   gsap.set(path, {
  //     strokeDasharray: pathLength,
  //     strokeDashoffset: pathLength,
  //   });

  //   gsap.to(path, {
  //     strokeDashoffset: 0,
  //     duration: 2,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: path,
  //       start: "top 80%",
  //       end: "top 30%",
  //       scrub: 1,
  //     },
  //     onComplete: () => setIsEllipseDrawn(true),
  //   });
  // }, [isOrbScaledDown]);

  // useEffect(() => {
  //   if (!isEllipseDrawn) return;

  //   dottedEllipsesRef.current.forEach((el, i) => {
  //     if (el) {
  //       gsap.to(el, {
  //         opacity: 1,
  //         duration: 1,
  //         delay: i * 0.3,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: el,
  //           start: "top 70%",
  //           end: "top 20%",
  //           scrub: true,
  //         },
  //         top: ellipseFinalY ? `${ellipseFinalY + (i + 1) * 20}px` : "50%",
  //       });
  //     }
  //   });
  // }, [isEllipseDrawn]);

  // const ballRef = useRef(null);
  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   gsap.fromTo(
  //     ballRef.current,
  //     { y: 0 },
  //     {
  //       y: 400,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top center",
  //         end: "bottom center",
  //         scrub: true,
  //       },
  //       ease: "power1.out",
  //     }
  //   );
  // }, []);


  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const drawPathRef = useRef(null);

  
  useEffect(() => {
    const stepContent = [
      {
        title: "Complimentary consultation",
        description: "Initial consultations are always free of charge."
      },
      {
        title: "Payment plans are available",
        description: "We offer a variety of payment plans at no interest."
      },
      {
        title: "No hidden fees",
        description: "Comprehensive treatment plans include retainers and supervision"
      },
     
    ];
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    const path = drawPathRef.current;
  
    if (!section || !scrollContainer || !path) return;
  
    const scrollDistance = scrollContainer.scrollWidth - window.innerWidth;
    const pathLength = path.getTotalLength();
  

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
  
    const mainTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollContainer.style.transform = `translateX(${-scrollDistance * progress}px)`;
        path.style.strokeDashoffset = pathLength * (1 - progress);
      },
    });
  
    
    const getCriticalPoints = () => {
      const points = [];
      let prevAngle = null;
      const samples = 150; 
      const angleThreshold = 0.4; // the more speciifc the angle the more logged steps
      const minProgressDistance = 0.03; // dist etween points
      let lastValidProgress = -Infinity;
  
      for (let i = 1; i <= samples; i++) {
        const progress = i / samples;
        const currentPoint = path.getPointAtLength(progress * pathLength);
        const prevPoint = path.getPointAtLength(((i-1)/samples) * pathLength);
        
        const angle = Math.atan2(
          currentPoint.y - prevPoint.y,
          currentPoint.x - prevPoint.x
        );
  
        // Only count large direction changes
        if (prevAngle !== null && 
            Math.abs(angle - prevAngle) > angleThreshold &&
            (progress - lastValidProgress) >= minProgressDistance) {
          
          points.push({
            point: currentPoint,
            progress,
            scrollPosition: scrollDistance * progress
          });
          lastValidProgress = progress;
        }
        prevAngle = angle;
      }
  
  
      return points;
    };
  
    const criticalPoints = getCriticalPoints();
  
    const textMarkers = criticalPoints.map(({ point, scrollPosition }, index) => {
      const content = stepContent[index] || {
        title: `Phase ${index + 1}`,
        description: ""
      };
  
      const marker = document.createElement('div');
      marker.className = 'path-marker';
      marker.innerHTML = `
        <div class="marker-content">
          <p class="font-neuehaas45 marker-title">${content.title}</p>
          <p class="font-neuehaas45  marker-desc">${content.description}</p>
        </div>
      `;
      
      Object.assign(marker.style, {
        position: 'absolute',
        left: `${point.x}px`,
        top: `${point.y}px`,
        transform: 'translate(-50%, -50%)',
        opacity: '0',
        willChange: 'opacity',
        border: '2px solid red',
        padding: '4px'
      });
  
      scrollContainer.appendChild(marker);

      ScrollTrigger.create({
        trigger: section,
        start: `top top+=${scrollPosition - 200}`,
        end: `top top+=${scrollPosition + 200}`,
        scrub: 0.5,
        onEnter: () => gsap.to(marker, { opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(marker, { opacity: 0, duration: 0.3 }),
      });
  
      return marker;
    });
  

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      textMarkers.forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
    };
  }, []);
  
  


  return (
    <>
      <section className="relative w-full h-screen font-neuehaas45">
        <div className="items-start flex flex-col px-6">
          <div className="mt-36">
            <span className="text-[6vw]">Get</span>
            <span className="text-[6vw] ml-[1vw] -mt-[1vw] font-saolitalic">
              started
            </span>
            <p className="font-neuehaas35 text-[16px] mt-4 max-w-[550px]">
              Orthodontic treatment is a transformative investment in both your
              appearance and long-term dental health — ideally, a
              once-in-a-lifetime experience. While many orthodontists can
              straighten teeth with braces or Invisalign, the quality of
              outcomes varies widely. With today’s advanced technology,
              treatment goes far beyond alignment — it can enhance facial
              aesthetics and deliver truly life-changing results.
            </p>
          </div>
        </div>


        <div className="absolute right-10 bottom-10 text-right z-10">
          <p className="text-xl mb-[-1rem] font-neuehaas45 ">April</p>
          <h1 className="text-[20vw] leading-[0.85] font-bold">30</h1>
        </div>


        <div className="absolute bottom-6 left-6 animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
   
      </section>
      <div style={{ height: "400vh" }}>
  <section 
    ref={sectionRef}  
    className="w-screen h-screen overflow-hidden flex items-center px-10"
  >
    <div
      ref={scrollContainerRef}

    >
      <svg
        width="3370"
        height="671"
        viewBox="0 0 3370 671"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={drawPathRef}
          d="M0.998047 1C0.998047 1 849.498 764.605 786.498 659.553C723.498 554.5 1725.51 370.052 1660.51 419.052C1595.5 468.052 2515.02 616.409 2491.26 660.981C2467.5 705.553 3369 419.052 3369 419.052"
          stroke="#B1DD40"
          strokeWidth="3"
        />
       
      </svg>
    </div>
   

  </section>
</div>

      {/* <div ref={sectionRef} className="relative h-[200vh] bg-[#F2F2F4]">
        <Canvas
      gl={{ alpha: true }}
      style={{
         position: 'fixed',
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         pointerEvents: 'initial',  
         zIndex: 10
      }}
   >
      <EffectComposer>
         <Fluid />
      </EffectComposer>
   </Canvas>
        <div className="pointer-events-none h-screen flex items-center justify-center">
          <div className="relative h-screen bg-[#F2F2F4] flex items-center justify-center">

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9a3f03dd6c2c1edf4901e_sculpture%20Top.svg"
              alt="Sculpture Back"
              className="z-10 w-[300px] h-auto"
            />

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9b95746e31c40a01c2762_sculpture%20Bottom.svg"
              alt="Sculpture Front"
              className="absolute z-30 w-[300px] h-auto"
            />
          </div>

          <div
            ref={ballRef}
            className="absolute -top-10 z-20 w-24 h-24 bg-[#FDBA12] rounded-full"
          />
        </div>
      </div> */}
      {/* <div ref={canvasRef} className="w-32 h-32"></div> */}
    </>
  );
};

export default FinancingTreatment;
