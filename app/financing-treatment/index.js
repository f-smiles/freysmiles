
"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Sphere, OrbitControls, Environment, shaderMaterial } from "@react-three/drei";
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


const OrbShaderMaterial = shaderMaterial(
  {
    time: 0,
    hover: 0,
    mousePos: new THREE.Vector2(0.5, 0.5),
    color1: new THREE.Color("#FDF69B"),
    color2: new THREE.Color("#FCD5C4"),
    color3: new THREE.Color("#ffd1a1"),
    rippleScale: 2.0,
    waveSpeed: 1.2, 
    refractionPower: 0.08,
    highlightStrength: 1.2, 
  },

  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vHoverEffect;
  varying float vDisplacement;
  uniform float time;
  uniform float hover;
  uniform vec2 mousePos;
  uniform float rippleScale;
  uniform float waveSpeed;

  float wave(vec2 p, float t) {
      return sin(20.0 * length(p) - t * 6.0) * 0.6 + 0.5;
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    vec2 uvMouse = mousePos;
    float dist = length(vUv - uvMouse);

    // 🔹 Stronger, Expanding Wave Effect
    float ripple = wave(vUv - uvMouse, time * waveSpeed);
    float rippleEffect = smoothstep(0.4, 0.0, dist) * hover * ripple * rippleScale;
    
    pos += normal * rippleEffect * 0.3; // 🔹 More pronounced displacement

    vHoverEffect = rippleEffect;
    vDisplacement = rippleEffect;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float refractionPower;
  uniform float highlightStrength;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vHoverEffect;
  varying float vDisplacement;

  void main() {

    vec3 baseColor = mix(color1, color2, vUv.y * 1.3);


    float specular = pow(vHoverEffect, 2.0) * highlightStrength;
    vec3 highlight = vec3(1.0, 0.5, 0.5) * specular;


    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    vec3 rimLight = vec3(0.8, 0.85, 1.0) * fresnel * 0.5;

    vec3 finalColor = baseColor + highlight + rimLight;
    finalColor *= 1.0 - smoothstep(0.8, 1.0, length(vUv - 0.5));

    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

extend({ OrbShaderMaterial });
const MovingOrb = ({ setEllipseFinalY, setIsOrbScaledDown }) => {
  const sphereRef = useRef();
  const shaderRef = useRef();
  const [finalSet, setFinalSet] = useState(false);
  const [hovered, setHovered] = useState(false);
  const targetMousePos = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame(({ clock }) => {
    if (sphereRef.current && shaderRef.current) {
      const scrollFactor = window.scrollY;
      const scaleFactor = Math.max(
        0.5, 
        1.5 - Math.max(0, scrollFactor - 150) * 0.004
      );
      
      sphereRef.current.position.set(
        (1.5 - scaleFactor) * 2.5,
        -scrollFactor * 0.002,
        -1
      );
      sphereRef.current.scale.setScalar(scaleFactor);

      shaderRef.current.time = clock.getElapsedTime();
      shaderRef.current.mousePos.lerp(targetMousePos.current, 0.1);
      shaderRef.current.mousePos.needsUpdate = true;

      if (scaleFactor === 0.5 && !finalSet) {
        const screenHeight = window.innerHeight;
        const adjustedFinalY = screenHeight / 2 - sphereRef.current.position.y * screenHeight * 1.2;
        setEllipseFinalY(adjustedFinalY);
        setIsOrbScaledDown(true);
        setFinalSet(true);
      }
    }
  });

  const handleMouseMove = (e) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    targetMousePos.current.set(x, y);
  };

  useEffect(() => {
    if (shaderRef.current) {
      gsap.to(shaderRef.current, {
        hover: hovered ? 1.0 : 0,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => {
          shaderRef.current.needsUpdate = true;
        }
      });
    }
  }, [hovered]);

  return (
    <Sphere
      ref={sphereRef}
      args={[3, 128, 128]}
      onPointerMove={handleMouseMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <orbShaderMaterial
        ref={shaderRef}
        key={OrbShaderMaterial.key}
        color1="#FDF69B"
        color2="#FCD5C4"
        rippleScale={1.5}
        waveSpeed={0.8}
        highlightStrength={1.2}
        transparent={false}
        depthWrite={true}
      />
    </Sphere>
  );
};





const FinancingTreatment = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const dottedEllipsesRef = useRef([]);
  const [ellipseFinalY, setEllipseFinalY] = useState(null);
  const [isEllipseDrawn, setIsEllipseDrawn] = useState(false);
  const [isOrbScaledDown, setIsOrbScaledDown] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.5, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (!pathRef.current || !isOrbScaledDown) return; 

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: path,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
      onComplete: () => setIsEllipseDrawn(true),
    });
  }, [isOrbScaledDown]); 


  useEffect(() => {
    if (!isEllipseDrawn) return;

    dottedEllipsesRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          opacity: 1,
          duration: 1,
          delay: i * 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "top 20%",
            scrub: true,
          },
          top: ellipseFinalY ? `${ellipseFinalY + (i + 1) * 20}px` : "50%",
        });
      }
    });
  }, [isEllipseDrawn]);
  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "200vh",
          background: "linear-gradient(to bottom, #f4e4d7, #ebbe9a)",
          opacity: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "60%",
            transform: "translateX(-50%)",
            fontSize: "4em",
            fontFamily: "NeueMontrealBook",
            maxWidth: "40vw",
            lineHeight: "1.2",
            zIndex: 2,
          }}
        >
          Your plan <br />
          is tailored <br />
          to your needs. <br />
        </div>

        <Canvas
          camera={{ position: [0, 0, 8] }}
          style={{
            position: "fixed",
            top: 0,
            right: -100,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
          }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[2, 2, 5]} intensity={2} color={"#ff9966"} />
          <MovingOrb setEllipseFinalY={setEllipseFinalY} setIsOrbScaledDown={setIsOrbScaledDown} />
          <OrbitControls enableZoom={false} />
    
          <Environment preset="sunset" background={false} />
        </Canvas>

        <div className="ellipse-container">
          {isOrbScaledDown && (
            <>
              <svg
                width="458"
                height="72"
                viewBox="0 0 458 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  top: ellipseFinalY ? `${ellipseFinalY}px` : "50%",
                  left: "70%",
                  transform: "translate(-50%, -50%)",
                  transition: "top 0.5s ease-out",
                }}
              >
  <path
    ref={pathRef}
    d="M229,0.5c62.9,0,120.6,4.1,161.9,10.5c20.7,3.3,37.4,7.1,49,11.4c5.8,2.1,10.2,4.4,13.2,6.7c3,2.3,4.5,4.6,4.5,6.9s-1.5,4.6-4.5,6.9c-3,2.3-7.4,4.5-13.2,6.7c-11.5,4.3-28.3,8.2-49,11.4c-41.4,6.5-98.6,10.5-161.9,10.5S108.6,67.5,67.2,61c-20.7-3.3-37.4-7.1-49-11.4C12.4,47.4,8,45.2,5,42.9c-3-2.3-4.5-4.6-4.5-6.9S2,31.4,5,29.1c3-2.3,7.4-4.5,13.2-6.7c11.5-4.3,28.3-8.2,49-11.4C108.6,4.5,165.8,0.5,229,0.5"
    stroke="black"
    strokeWidth="1"
/>
</svg>

{[...Array(5)].map((_, i) => (
 <svg
 key={i}
 ref={(el) => {
   if (el) dottedEllipsesRef.current[i] = el;
 }}
 width="458"
 height="72"
 viewBox="0 0 458 72"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 style={{
   position: "absolute",
   top: ellipseFinalY ? `${ellipseFinalY + (i + 1) * 20}px` : "50%",
   left: "70%",
   transform: "translate(-50%, -50%)",
   opacity: 0,
 }}
>
    <path
      d="M229,0.5c62.9,0,120.6,4.1,161.9,10.5c20.7,3.3,37.4,7.1,49,11.4c5.8,2.1,10.2,4.4,13.2,6.7c3,2.3,4.5,4.6,4.5,6.9s-1.5,4.6-4.5,6.9c-3,2.3-7.4,4.5-13.2,6.7c-11.5,4.3-28.3,8.2-49,11.4c-41.4,6.5-98.6,10.5-161.9,10.5S108.6,67.5,67.2,61c-20.7-3.3-37.4-7.1-49-11.4C12.4,47.4,8,45.2,5,42.9c-3-2.3-4.5-4.6-4.5-6.9S2,31.4,5,29.1c3-2.3,7.4-4.5,13.2-6.7c11.5-4.3,28.3-8.2,49-11.4C108.6,4.5,165.8,0.5,229,0.5"
      stroke="black"
      strokeWidth="1"
      fill="none"
      strokeDasharray="3, 6"
    />
  </svg>
))}

            </>
          )}
        </div>
      </div>
    </>
  );
};


export default FinancingTreatment;
