"use client";
import { useControls } from "leva";
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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
const SmileyFace = ({ position = [0, 0, 0] }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const texture = useLoader(
    THREE.TextureLoader,
    "https://cdn.zajno.com/dev/codepen/cicada/texture.png"
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const generateNoiseTexture = (size = 512) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
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

    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(5, 5);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;

    return tex;
  };

  const noiseTexture = useMemo(() => generateNoiseTexture(), []);

  // const material = useMemo(() => new THREE.MeshPhysicalMaterial({
  //   color: new THREE.Color('#fdf6ec'),
  //   map: noiseTexture,
  //   metalness: 0.3,
  //   roughness: 0.1,
  //   transmission: 1,
  //   thickness: 1.5,
  //   transparent: true,
  //   clearcoat: 1,
  //   clearcoatRoughness: 0.05,
  //   iridescence: 1,
  //   iridescenceIOR: 1.6,
  //   iridescenceThicknessRange: [100, 300],
  //   sheen: 1,
  //   sheenRoughness: 0.05,
  // }), [noiseTexture]);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#fdf6ec"),
        metalness: 0.3,
        roughness: 0.1,
        transmission: 1,
        thickness: 1.5,
        transparent: true,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 1,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [100, 300],
        sheen: 1,
        sheenRoughness: 0.05,
        roughnessMap: noiseTexture,
        bumpMap: noiseTexture,
        bumpScale: 0.05,
      }),
    [noiseTexture]
  );

  const { ring, smile, leftEye, rightEye } = useMemo(() => {
    const arcSegments = 100;

    const ringCurve = new THREE.ArcCurve(0, 0, 5.6, 0, Math.PI * 2, false);
    const ringPoints = ringCurve
      .getPoints(arcSegments)
      .map((p) => new THREE.Vector3(p.x, p.y, 0));
    const ringPath = new THREE.CatmullRomCurve3(ringPoints, true);

    const ringRect = new THREE.Shape();
    const rw = 0.4;
    const rh = 0.6;
    ringRect.moveTo(-rw / 2, -rh / 2);
    ringRect.lineTo(rw / 2, -rh / 2);
    ringRect.lineTo(rw / 2, rh / 2);
    ringRect.lineTo(-rw / 2, rh / 2);
    ringRect.lineTo(-rw / 2, -rh / 2);

    const ringGeo = new THREE.ExtrudeGeometry(ringRect, {
      steps: arcSegments,
      bevelEnabled: false,
      extrudePath: ringPath,
    });

    const smilePath = new THREE.CurvePath();
    const smileCurve = new THREE.ArcCurve(0, -1.5, 2.4, Math.PI, 0, false);

    const smilePoints = smileCurve
      .getPoints(50)
      .map((p) => new THREE.Vector3(p.x, p.y, 0));
    const smileCatmull = new THREE.CatmullRomCurve3(smilePoints);

    const rectShape = new THREE.Shape();
    const w = 0.4;
    const h = 0.6;
    rectShape.moveTo(-w / 2, -h / 2);
    rectShape.lineTo(w / 2, -h / 2);
    rectShape.lineTo(w / 2, h / 2);
    rectShape.lineTo(-w / 2, h / 2);
    rectShape.lineTo(-w / 2, -h / 2);

    const smileGeo = new THREE.ExtrudeGeometry(rectShape, {
      steps: 50,
      bevelEnabled: false,
      extrudePath: smileCatmull,
    });

    const makeEye = (x, y) => {
      const geo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 32);
      geo.rotateX(Math.PI / 2);
      geo.translate(x, y, 0);
      return geo;
    };

    return {
      ring: ringGeo,
      smile: smileGeo,
      leftEye: makeEye(-2, 1),
      rightEye: makeEye(2, 1),
    };
  }, []);

  return (
    <group ref={groupRef} position={position} scale={[0.3, 0.3, 0.3]}>
      <mesh geometry={ring} material={material} />
      <mesh geometry={smile} material={material} />
      <mesh geometry={leftEye} material={material} />
      <mesh geometry={rightEye} material={material} />
    </group>
  );
};

const WavePlane = () => {
  const texture = useTexture("/images/iphonerock.jpg");
  const image = useRef();

  // const { amplitude, waveLength } = useControls({
  //   amplitude: { value: 0.1, min: 0, max: 2, step: 0.1 },
  //   waveLength: { value: 5, min: 0, max: 20, step: 0.5 },
  // });

  const amplitude = 0.1;
  const waveLength = 5;

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
    <mesh
      ref={image}
      scale={[2, 2, 1]}
      rotation={[-Math.PI * 0.4, 0.3, Math.PI / 2]}
    >
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

const Section = ({ children, onHoverStart, onHoverEnd }) => (
  <motion.div
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    style={{
      height: "15%",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "transparent",
      color: "black",
      fontSize: "1.2em",
      fontFamily: "HelveticaNeue-Light",
      userSelect: "none",
      position: "relative", // this is important
      zIndex: 2,
      width: "100%",
      boxSizing: "border-box",
      paddingLeft: "2rem",
    }}
  >
    {/* Top gradient line */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "1px",
        backgroundColor: "#fff0",
        backgroundImage: "linear-gradient(to right, #000, #fff0)",
        opacity: 0.4,
        transformOrigin: "0% 50%",
        transform: "translate(0px, 0px)",
        pointerEvents: "none", // ensures it doesn't block hover events
      }}
    />
    {children}
  </motion.div>
);

const Marquee = () => {
  const items = [
    { image: "../images/invisalignset.png" },
    { image: "../images/alignercase.png" },
    { image: "../images/alignergraphic.png" },
    { image: "../images/teethiterographic.png" },
  ];

  return (
    <div className="relative flex max-w-[100vw] overflow-hidden py-5">
      <div className="flex w-max animate-marquee [--duration:30s] hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="h-24 w-24 flex items-center justify-center px-1"
          >
            <img
              src={item.image}
              alt="Marquee Image"
              className="h-20 w-auto object-contain block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
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

  const [isVisible, setIsVisible] = useState(false);
  const squigglyTextRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 } // Triggers when 50% of the element is in view
    );

    if (squigglyTextRef.current) {
      observer.observe(squigglyTextRef.current);
    }

    return () => {
      if (squigglyTextRef.current) {
        observer.unobserve(squigglyTextRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="font-neuehaas35 min-h-screen px-8 pt-32 bg-[radial-gradient(ellipse_at_5%_30%,_#f3f6fd_0%,_#e3eaf5_30%,_#f4e9f1_60%,_#d9e0ee_100%)]  relative text-black overflow-hidden">

     
        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[800px] h-[800px]">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight color="#ffe9c4" intensity={2} position={[0, 0, -2]} />

              <SmileyFace position={[0, 0, 0]} />
              <Environment preset="sunset" />

              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
        </div>

        {/* <div className="absolute inset-0 z-0 flex items-center justify-center">
  <img
    src="https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c2314d8792ff4df3b1512b_Icon%20Estratti%20Secchi%20Pura.webp"
    className="w-[300px] h-auto object-contain z-0"
    alt="Background Icon"
  />
</div> */}
          <div className="flex flex-row justify-between items-center">
          <div ref={textRef} className="text-4xl md:text-[4vw] leading-[1.1] content__title">
              <span>We obsess over details so</span>
              <span>the result feels effortless. </span>
              <span></span>
            </div>
           
            <p className="text-lg font-neuehaas35">
              Barely There. Always Working.
            </p>
            <p className="text-lg font-neuehaas35">Bespoke Solutions</p>
          </div>
          <div className="font-neuehaas35 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column */}
            <div className="space-y-12 relative">

                <div className="relative z-10">
                <h4 className="text-[14px] mt-18 font-neueroman uppercase mb-1">
                  Expertise
                </h4>
                <p className="text-lg font-neuehaas35">
                  Diamond Plus
                  <br />
                  Invisalign
                  <br />
                  Invisalign Teen
                </p>
                </div>
              <div>
             
              </div>
            </div>

            {/* Right column */}
            <div className=" text-black px-8 py-12">
              <div className="font-neuehaas35 gap-8 items-start">
                <div>
                  <h4 className="text-sm mb-6 z-10">Synopsis</h4>
                  <p className="font-neuehaas35 text-lg leading-relaxed">
  <span className="inline-block align-baseline border-l border-gray-400 pl-4 mr-2">
    Trusted by millions around the world,
  </span>
  Invisalign is a clear, comfortable, and confident choice for straightening smiles. We've proudly ranked among the top
  1% of certified Invisalign providers nationwide — every year since 2000.
</p>

                </div>
              </div>
            </div>
            
          </div>
        </div>
        <section className="relative h-[100vh] items-center justify-center px-10">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.5} />
          <WavePlane />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </section>
        <div
        // className="bg-[#F9F7F7]"
        style={{ display: "flex", height: "100vh", width: "100vw" }}
      >
        {/* Left */}

        {/* Right */}

        <div
          // style={{
          //   flex: 1,
          //   display: "flex",
          //   alignItems: "center",
          //   justifyContent: "center",
          //   padding: "2rem",
          // }}
        >
          <div
            // style={{
            //   fontFamily: "NeueHaasDisplayThin25",
            //   fontSize: "2rem",
            //   lineHeight: "1.1",
            // }}
          >
           
          </div>
        </div>
      </div>
      <div className="ml-10 text-5xl sm:text-5xl leading-tight text-black font-light font-neuehaasdisplay15light">
        <span className="font-normal">Our doctors </span>{" "}
        <span className="font-light">have treated</span>{" "}
        <span className="font-saolitalic">thousands</span>{" "}
        <span className="font-medium">of patients</span> <br />
        <span className="font-normal">with this </span>{" "}
        <span className="font-light font-saolitalic">leading edge</span>{" "}
        <span className="font-light ">appliance</span>{" "}
        <span className="font-normal">system.</span>{" "}
      </div>


      <section className="relative w-full min-h-screen flex flex-col justify-between px-16 py-20 pb-10">
        <div className="font-neue-montreal flex space-x-3">
          {["Diamond Plus", "Invisalign", "Invisalign Teen"].map(
            (tag, index) => (
              <span key={index} className="px-2  text-sm relative tag-brackets">
                {tag}
              </span>
            )
          )}
        </div>

        <div
          className="relative bg-[#FFF]"
          style={{ height: "600px", overflow: "hidden" }}
        >
          <motion.div
            initial={{ y: "0%" }}
            animate={controls}
            style={{
              position: "absolute",
              width: "100%",
              height: "15%",
              background: "rgb(245,227,24,.8)",
              zIndex: 1,
            }}
          />

          {[
            {
              text: "Fewer appointments, faster treatment",
              gradient:
                "radial-gradient(circle, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
            },
            {
              text: "Personalized care for every patient",
              gradient: "radial-gradient(circle, #A18CD1 0%, #FBC2EB 100%)",
            },
            {
              text: "Advanced technology at your service",
              gradient:
                "radial-gradient(circle, #FA8BFF 0%, #2BD2FF 50%, #2BFF88 100%)",
            },
            {
              text: "Comfortable and stress-free visits",
              gradient: "radial-gradient(circle, #FFD3A5 0%, #FD6585 100%)",
            },
          ].map((item, index) => (
            <Section key={index} onHoverStart={() => handleHover(index)}>
              <div className="relative flex items-center w-full">
                <div
                  className="w-4 h-4 rounded-full absolute left-[40px]"
                  style={{ background: item.gradient }}
                ></div>
                <span className="pl-40">{item.text}</span>
              </div>
            </Section>
          ))}
        </div>

        {/* <div className="image-content mt-16">
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
            </div> */}
      </section>

      <div className="flex flex-row justify-between">
        <div className="max-w-[700px] mt-10">
          <div className="flex items-center gap-24">
            <div className="font-neuehaasdisplayextralight text-sm whitespace-nowrap relative">
              Why Invisalign
              <div
                ref={squigglyTextRef}
                className="absolute left-0 bottom-[-5px] w-full"
              >
                <svg className="w-full" height="9" viewBox="0 0 101 9">
                  <path
                    d="M1 6.86925C5.5 5.89529 20.803 1.24204 22.5 1.30925C24.6212 1.39327 20.5 3.73409 19.5 4.26879C18.8637 4.60904 14.9682 6.39753 15.7268 6.96472C16.4853 7.5319 34.2503 1.07424 35.8216 1.00703C37.3928 0.939816 37.2619 1.37115 37 1.59522C37 1.59522 24.5598 6.65262 24.84 6.96472C25.1202 7.27681 39.3546 4.85181 45.5 3.73407C51.6454 2.61634 61.4661 1.31205 62.525 2.12081C63.3849 2.77753 57.6549 3.25627 55.6997 4.04288C48.4368 6.96472 69.5845 5.83575 70 6.14029"
                    stroke="#1D64EF"
                    fill="none"
                    strokeWidth="1.5"
                    pathLength="1"
                    style={{
                      strokeDasharray: "1",
                      strokeDashoffset: isVisible ? "0" : "1",
                      transition:
                        "stroke-dashoffset 0.6s cubic-bezier(0.7, 0, 0.3, 1)",
                    }}
                  />
                </svg>
              </div>
            </div>

            <h2 className="font-neuehaasdisplaylight text-[3rem] leading-[1.1] font-light">
              Invisalign has continued to
            </h2>
          </div>

          <h2 className="font-neuehaasdisplaylight text-[3rem] leading-[1.1] font-light">
            work for millions worldwide.
            <br />
            <span className="text-[#1D64EF]">Clear,&nbsp;</span>
            <span className="text-[#1D64EF]">comfortable,&nbsp;</span>
            <span className="text-[#1D64EF]">confident.</span>
            <br />
          </h2>
        </div>
      </div>
      </div>

 

      {/* <div className="feature-jacket">
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
   */}
    </>
  );
};
export default Invisalign;
