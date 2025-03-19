"use client";
import {useControls} from "leva";
import Splitting from "splitting";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
// import DotPattern from "../svg/DotPattern";
import {
  motion,
  useScroll,
  useSpring,
  useAnimation,
  useTransform,
} from "framer-motion";
import gsap from "gsap";

import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";
import * as THREE from "three";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";

const SmileyFace = ({ position = [0, 0, 0] }) => {
  const circleRadius = 6;
  const groupRef = useRef(); 
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003; 
    }
  });

  const texture = useLoader(THREE.TextureLoader, 'https://cdn.zajno.com/dev/codepen/cicada/texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const circlePath = new THREE.Path();
  circlePath.absarc(0, 0, circleRadius, 0, Math.PI * 2, false);
  const circlePoints = circlePath.getPoints(100).map((p) => new THREE.Vector3(p.x, p.y, 0));

  const smileCurve = new THREE.EllipseCurve(0, -2, 3, 2, Math.PI, 0, false, 0);
  const smilePoints = smileCurve.getPoints(50).map((p, index, arr) => {
    if (index === arr.length - 1) return null;
    return new THREE.Vector3(p.x, p.y, 0);
  }).filter(Boolean);

  const generateNoiseTexture = (size = 512) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.repeat.set(5, 5);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;

    return texture;
  };

  const noiseTexture = useMemo(() => generateNoiseTexture(), []);

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    map: noiseTexture,
    metalness: 1,
    roughness: 0.2,
    transmission: 1,
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [200, 600],
    sheen: 1,
    sheenRoughness: 0.2,
  }), [texture]);

  const createTube = (points, radius = 0.4, isClosed = false) => {
    const path = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(path, 100, radius, 32, isClosed);
  };

  return (
    <group ref={groupRef} position={position} scale={[0.3, 0.3, 0.3]}>
      <mesh geometry={createTube(circlePoints, 0.4, true)} material={material} />
      <mesh geometry={createTube(smilePoints, 0.4, false)} material={material} />
    </group>
  );
};

const WavePlane = () => {
  const texture = useTexture("/images/iphonerock.jpg")
  const image = useRef(); 

  const { amplitude, waveLength } = useControls({
    amplitude: { value: 0.1, min: 0, max: 2, step: 0.1 },
    waveLength: { value: 5, min: 0, max: 20, step: 0.5 },
  });


  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: amplitude },
    uWaveLength: { value: waveLength },
    uTexture: { value: texture },
  });


  useFrame(() => {
    uniforms.current.uTime.value += 0.04; 
    uniforms.current.uAmplitude.value = amplitude;
    uniforms.current.uWaveLength.value = waveLength;
  });


  const vertexShader = `
   uniform float uTime;
uniform float uAmplitude;
uniform float uWaveLength;
varying vec2 vUv;
void main() {
    vUv = uv;
    vec3 newPosition = position;
    float wave = uAmplitude * sin(position.x * uWaveLength + uTime);
    float ripple = 0.01 * sin((position.x + position.y) * 10.0 + uTime * 2.0);
    float bulge = 0.05 * sin(position.x * 5.0 + uTime) * cos(position.y * 5.0 + uTime * 1.5);
    newPosition.z += wave + ripple + bulge;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

  `;

  const fragmentShader = `
  uniform sampler2D uTexture; 
  varying vec2 vUv; 
    void main() {
  gl_FragColor = texture2D(uTexture, vUv);
    }
  `;
  

  return (
    <mesh ref={image} scale={[2, 2, 1]} rotation={[-Math.PI * 0.4, 0.3, Math.PI / 2]}>
  <planeGeometry args={[2, 1, 100, 50]} />
      <shaderMaterial
        wireframe={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};
// function Invisalign() {
//   const sectionRef = useRef()
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["end end", "center center"],
//   })
//   const springScroll = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   })
//   const scale = useTransform(springScroll, [0, 1], [1.2, 0.9])
//   const transformText = useTransform(springScroll, [0, 1], ["0%", "150%"])
//   const transformCase = useTransform(springScroll, [0, 1], ["150%", "0%"])
//   const transformRetainer = useTransform(springScroll, [0, 1], ["-150%", "-100%"])

//   return (
//     <section ref={sectionRef} className="container flex flex-col-reverse py-24 mx-auto overflow-hidden lg:flex-row lg:items-start">

//       <div className="lg:w-1/2">
//         <motion.img style={{ translateY: transformCase }} className="object-cover w-full h-auto mx-auto object-start" src="/../../../images/invisalign_case_transparent.png" alt="invisalign case" />
//         <motion.img style={{ translateY: transformRetainer, scale }} className="object-cover w-3/4 h-auto object-start ml-36 lg:ml-24 xl:ml-36" src="/../../../images/invisalign_bottom.png" alt="invisalign bottom" />
//       </div>
//     </section>
//   )
// }

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const Section = ({ children, onHoverStart, onHoverEnd, gradient }) => (
  <motion.div
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    style={{
      height: "20%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "black",
      fontSize: "1.2em",
      fontFamily: "HelveticaNeue-Light",
      userSelect: "none",
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
      borderTop: "1px solid #DBDADD",
      gap: "5rem",
    }}
  >
    <div
      className="w-8 h-8 rounded-full"
      style={{ background: gradient }}
    ></div>
    {children}
  </motion.div>
);

const Invisalign = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.killTweensOf(".lineChild, .lineParent");

    const split = new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineChild",
    });
    new SplitText(headingRef.current, {
      type: "lines",
      linesClass: "lineParent",
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top bottom",
        toggleActions: "restart pause resume pause",
      },
    });
    tl.from(".lineChild", {
      y: 50,
      duration: 0.75,
      stagger: 0.25,
      autoAlpha: 0,
    });

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);


  const alignerRef = useRef(null);

  useEffect(() => {
    gsap.to(alignerRef.current, {
      y: -100,
      ease: "power1.out",
      scrollTrigger: {
        trigger: alignerRef.current,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  }, []);

  const cardRefs = useRef([]);

  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      const cardBg = card.querySelector(".feature-card-bg");
      const i = index + 1;

      const fade = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom-=25%",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });

      const scale = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom-=25%",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });

      if (index + 1 !== cardRefs.current.length) {
        fade.fromTo(cardBg, { opacity: 0 }, { opacity: `0.${index + 1}` });

        scale.to(card, { scale: 0.8 + i / 10 });
      }
    });
  }, []);

  const features = [
    {
      text: "Invisalign has worked for over a million smiles across the country. Some dentists and orthodontists may not feel comfortable recommending Invisalign to their patients, but as Diamond Plus providers of Invisalign and Invisalign Teen (top 1% of Invisalign providers in the US) we have the experience to deliver the smile you deserve. Dr. Gregg Frey and Dr. Daniel Frey have treated many hundreds of patients with this leading-edge appliance system. Their expertise shows in the smile results of their satisfied patients. The cost of Invisalign treatment is comparable to the cost of braces.",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      text: "Invisalign uses a series of customized, clear aligners to straighten teeth faster and with fewer office visits than traditional braces. Thousands of orthodontists in the United States and Canada use Invisalign to accurately and effectively treat their patients. This type of treatment in the hands of experts delivers fantastic results. Aligners are:",
      image: "https://picsum.photos/400/300?random=1",
    },
    {
      text: "Customized just for you – Your aligners are customized to fit your mouth. Dr. Frey and Dr. Frey uses advanced 3-D computer imaging technology to replicate an exact impression of your mouth and teeth, then our doctors customize each aligner treatment plan specific to your needs. This RX is sent to the lab that fabricates a series of your custom aligners so that they fit your mouth, and over time they move your teeth into the proper position.",
      image: "https://picsum.photos/400/300?random=1",
    },
  ];
  const textRef = useRef(null);
  useEffect(() => {
    gsap.registerPlugin(SplitText);
    const split = new SplitText(textRef.current, { type: "chars" });
    const chars = split.chars;

    gsap.fromTo(
      chars,
      {
        willChange: "transform",
        transformOrigin: "50% 0%",
        scaleY: 0,
        opacity: 0,
      },
      {
        ease: "back.out(1.7)",
        scaleY: 1,
        opacity: 1,
        stagger: 0.03, 
        duration: 1.2,
      }
    );

    return () => split.revert(); 
  }, []);

  const controls = useAnimation();

  const handleHover = (index) => {
    controls.start({
      y: `${index * 100}%`,
      transition: { type: "tween", duration: 0.3 },
    });
  };
  return (
    <>
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
  {/* Left */}
      <div style={{  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ fontFamily:"NeueHaasDisplayXThin",  fontSize: '3rem', lineHeight: '1.1' }}>
      <div ref={textRef} className="content__title" >
        <span>Ranked in the top</span>
        <span >1% of practitioners </span>
        <span>nationwide since 2000</span>
      </div>
    </div>
      </div>
      {/* Right */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <SmileyFace position={[0, 0, 0]} />
          <Environment preset="sunset" />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
    <div className="text-5xl sm:text-5xl leading-tight text-black font-light font-neuehaas-thin">
      <span className="font-normal">Our doctors</span>{" "}
      <span className="font-light">have </span>{" "}
      <span className="font-saolitalic">treated</span>{" "}
      <span className="font-medium">thousands of patients</span>{" "}
      <br />
      <span className="font-normal">with this </span>{" "}
      <span className="font-light font-saolitalic">leading edge</span>{" "}
      <span className="font-light ">appliance</span>{" "}
      <span className="font-normal">system.</span>{" "}
    </div>
       <section className="relative h-[100vh] items-center justify-center px-10">
        <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <WavePlane />
      <OrbitControls enableZoom={false}/>
    </Canvas>
      </section>
    
      <section className="relative w-full min-h-screen flex flex-col justify-between px-16 py-20">

        <div className="font-neue-montreal flex space-x-3 mt-6">
          {["Diamond Plus", "Invisalign", "Invisalign Teen"].map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${
                index === 0
                  ? "bg-gray-200 text-gray-600"
                  : "border border-gray-300"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

       <div className="flex flex-col">
       <p className="font-saol mt-8 text-[5em] leading-snug">
Why Invisalign?
        </p>     
       {/* <p className="w-1/2 mt-8 text-[1.8em] font-neue-montreal leading-snug">
        Under the skilled guidance of our doctors, countless individuals have experienced the transformative benefits of this advanced orthodontic treatment.
        </p>      */}
      <div className="relative w-2/3"
              style={{ height: "600px", overflow: "hidden" }}
            >
              <motion.div
                initial={{ y: "0%" }}
                animate={controls}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "20%",
                  background: "rgb(245,227,24,.6)",
                  zIndex: 1,
                }}
              />

<Section onHoverStart={() => handleHover(0)} gradient="linear-gradient(to bottom right, #FF9A8B, #FF6A88, #FF99AC)"> Fewer appointments, faster treatment</Section>
      <Section onHoverStart={() => handleHover(1)} gradient="linear-gradient(to bottom right, #A18CD1, #FBC2EB)"> Personalized care for every patient</Section>
      <Section onHoverStart={() => handleHover(2)} gradient="linear-gradient(to bottom right, #FA8BFF, #2BD2FF, #2BFF88)">Advanced technology at your service</Section>
      <Section onHoverStart={() => handleHover(3)} gradient="linear-gradient(to bottom right, #FFD3A5, #FD6585)">Comfortable and stress-free visits</Section>
            </div>

            </div>
            <div className="image-content mt-16">
              <img
                ref={alignerRef}
                src="../images/invisalignset.png"
                alt="aligner"
                className="w-[400px] h-[400px] object-contain"
                style={{
                  willChange: "transform",
                }}
              />
             <img src='../images/alignercase.png'/>
            </div>
      </section>


      <div className="feature-jacket">
        <ul className="feature-cards">
          {features.map((feature, index) => (
            <li
              className={`feature-card feature-card-${index + 1}`}
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <div>
                <span className="feature-card-bg"></span>
                <img
                  src={feature.image}
                  alt={`Feature ${index + 1}`}
                  className="feature-card w-full h-auto rounded-lg mb-4"
                />
                <p className="feature-card">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
  
    </>
  );
};
export default Invisalign;

