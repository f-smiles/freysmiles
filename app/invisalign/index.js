"use client";
import normalizeWheel from 'normalize-wheel';
import { Renderer, Camera, Transform, Mesh, Program, Texture, Plane } from 'ogl';
import { Fluid } from "/utils/FluidCursorTemp.js";
import Media from '/utils/OGLMedia.js';
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import Splitting from "splitting";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef, forwardRef, Suspense } from "react";
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
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { TextureLoader } from 'three';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const DistortedImage = ({ imageSrc, xOffset = 0, yOffset = 0 }) => {
  const ref = useRef();
  const texture = useTexture(imageSrc);
  const { viewport, size } = useThree();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollOffset = (scrollY / size.height) * viewport.height;
      ref.current.position.y = yOffset + scrollOffset;
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [viewport.height, size.height, yOffset]);

  return (
    <mesh ref={ref} position={[xOffset, 0, 0]} scale={[2.5, 2, 1]}>
      <planeGeometry args={[2, 3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};


function BulgeGallery() {
  const containerRef = useRef();
  const scrollData = useRef({ target: 0, current: 0, last: 0 });
  const meshes = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    const camera = new Camera(gl, { fov: 45 });
    const scene = new Transform();
    camera.position.z = 5;
    containerRef.current.appendChild(gl.canvas);

    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const viewport = {
      width: 2,
      height: 2 * (screen.height / screen.width),
    };

    renderer.setSize(screen.width, screen.height);


    const domImages = containerRef.current.querySelectorAll(".media");

    domImages.forEach((element) => {
      const img = element.querySelector("img");

      if (!img.complete) {
        img.onload = () => {
          const geometry = new Plane(gl, {
            widthSegments: 100,
            heightSegments: 100,
          });

          const media = new Media({
            element,
            image: img,
            geometry,
            gl,
            height: 2000,
            scene,
            screen,
            viewport,
          });

          media.update({ current: 0, last: 0 }, "down");
          meshes.current.push(media);
        };
      } else {
        const geometry = new Plane(gl, {
          widthSegments: 100,
          heightSegments: 100,
        });

        const media = new Media({
          element,
          image: img,
          geometry,
          gl,
          height: 2000,
          scene,
          screen,
          viewport,
        });

        media.update({ current: 0, last: 0 }, "down");
        meshes.current.push(media);
      }
    });

    const onResize = () => {
      screen.width = window.innerWidth;
      screen.height = window.innerHeight;
      viewport.height = 2 * (screen.height / screen.width);
      renderer.setSize(screen.width, screen.height);

      meshes.current.forEach((media) => {
        media.onResize({ screen, viewport, height: 2000 });
      });
    };

    const onScroll = () => {
      scrollData.current.target = window.scrollY;
    };

    const animate = () => {
      const y = scrollData.current;
      y.current += (y.target - y.current) * 0.1;

      const direction = y.target > y.last ? "down" : "up";

      meshes.current.forEach((media) => {
        media.update(y, direction);
      });

      y.last = y.current;

      renderer.render({ scene, camera });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);

    onResize();
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
<div ref={containerRef} className="relative w-full min-h-[100vh] overflow-visible" >
  <div className="media fixed  w-[400px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0">
    <img src="/images/invisalignphonemockup.png" className="w-full h-full object-contain" />
  </div>
</div>


  );
}



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

const WavePlane = forwardRef(({ uniformsRef }, ref) => {
  const texture = useTexture("/images/mockup_c.png");
  const gl = useThree((state) => state.gl);
  useMemo(() => {
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [texture, gl]);

  const image = useRef();
  const meshRef = ref || useRef();
  // const { amplitude, waveLength } = useControls({
  //   amplitude: { value: 0.1, min: 0, max: 2, step: 0.1 },
  //   waveLength: { value: 5, min: 0, max: 20, step: 0.5 },
  // });

  const amplitude = 0.2;
  const waveLength = 5;

  const uniforms = useRef({
    uTime: { value: 0 },
    uAmplitude: { value: amplitude },
    uWaveLength: { value: waveLength },
    uTexture: { value: texture },
  });

  useFrame(() => {
    uniforms.current.uTime.value += 0.04;
    // uniforms.current.uAmplitude.value = amplitude;
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

float wave   = uAmplitude * sin(position.y * uWaveLength + uTime);
float ripple = uAmplitude * 0.01 * sin((position.y + position.x) * 10.0 + uTime * 2.0);
float bulge  = uAmplitude * 0.05 * sin(position.y * 5.0 + uTime) *
                                      cos(position.x * 5.0 + uTime * 1.5);
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
  useEffect(() => {
    if (uniformsRef) {
      uniformsRef.current = uniforms.current;
    }
  }, [uniformsRef]);

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 1]}
      scale={[2, 2, 1]}
      rotation={[-Math.PI * 0.4, 0.3, Math.PI / 2]}
    >
      <planeGeometry args={[1.5, 2, 100, 200]} />
      <shaderMaterial
        wireframe={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
});
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
      position: "relative",
      zIndex: 2,
      width: "100%",
      boxSizing: "border-box",
      paddingLeft: "2rem",
    }}
  >
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
        pointerEvents: "none",
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

  const meshRef = useRef();
  useEffect(() => {
    const amplitudeProxy = { value: 0.2 };
    const dummyRotation = {
      x: -Math.PI * 0.4,
      y: 0.3,
      z: Math.PI / 2,
    };

    const positionProxy = { z: 1 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".canvas-section",
        start: "top top",
        end: "+=1200",
        scrub: 2,
        pin: true,
      },
    });

    // Rotation Animation
    tl.to(dummyRotation, {
      x: 0,
      y: 0,
      z: 0,
      ease: "none",
      onUpdate: () => {
        if (meshRef.current) {
          meshRef.current.rotation.set(
            dummyRotation.x,
            dummyRotation.y,
            dummyRotation.z
          );
          meshRef.current.position.z = positionProxy.z;
        }
        if (uniformsRef.current) {
          uniformsRef.current.uAmplitude.value = gsap.getProperty(
            amplitudeProxy,
            "value"
          );
        }
      },
    });

    // Amplitude Flattening
    tl.to(
      amplitudeProxy,
      {
        value: 0,
        ease: "none",
        onUpdate: () => {
          if (uniformsRef.current) {
            uniformsRef.current.uAmplitude.value = amplitudeProxy.value;
          }
        },
      },
      "<"
    );

    tl.to(
      positionProxy,
      {
        z: 2,
        ease: "none",
      },
      "<"
    );

    tl.to({}, { duration: 0.5 });
  }, []);

  const uniformsRef = useRef();

  const services = [
    { normal: "Nearly ", italic: "Invisible" },
    { normal: "Designed for Comfort" },
    { normal: "Tailored to", italic: "You" },
    { normal: "Removable", italic: "& Flexible" },
    { normal: "Proven", italic: "Results" },
  ];


 


  return (
    <>
<BulgeGallery />
      <div className=" font-neuehaas35 min-h-screen px-8 pt-32 relative text-black ">

      <Canvas
  gl={{ alpha: true }}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "initial",
    background: "transparent",
    zIndex: 0,
  }}
>
<Suspense fallback={null}>
  <DistortedImage imageSrc="/images/invisalign_mockup_3.jpg" xOffset={-3.5} yOffset={0}  />
  <DistortedImage imageSrc="/images/invisalign_mockup_3.jpg"  xOffset={3.5} yOffset={-2.5}/>

  <EffectComposer>
    <Fluid backgroundColor="#F9F8F7" />
  </EffectComposer>
</Suspense>

</Canvas>


        <section className="pointer-events-none canvas-section relative h-[100vh] z-10">
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.5} />
            <WavePlane ref={meshRef} uniformsRef={uniformsRef} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </section>

        <div className="pointer-events-none flex flex-row items-center">
          <div
            ref={textRef}
            className="text-4xl md:text-[4vw] leading-[1.1] content__title"
          >
            <span>We obsess over details so</span>
            <span>the result feels effortless. </span>
            <span></span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[800px] h-[800px]">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight color="#ffe9c4" intensity={2} position={[0, 0, -2]} />

              <SmileyFace position={[0, 0, 0]} />
              <Environment preset="sunset" />

              <OrbitControls enableZoom={false} />
            </Canvas>
          </div>
          </div> */}

          {/* <div className=" flex items-center justify-center">
  <img
    src="https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c2314d8792ff4df3b1512b_Icon%20Estratti%20Secchi%20Pura.webp"
    className="w-[300px] h-auto object-contain z-0"
    alt="Background Icon"
  />
</div> */}
        </div>

        <div className="ml-10 text-[32px] sm:text-[32px] leading-tight text-black font-light font-neuehaasdisplaythin">
          <span className="font-normal">Our doctors </span>{" "}
          <span className="font-light">have treated</span>{" "}
          <span className="font-saolitalic">thousands</span>{" "}
          <span className="font-medium">of patients</span> <br />
          <span className="font-normal">with this </span>{" "}
          <span className="font-light font-saolitalic">leading edge</span>{" "}
          <span className="font-light ">appliance</span>{" "}
          <span className="font-normal">system.</span>{" "}
        </div>

        <section className="relative w-full flex flex-col h-screen px-16 py-20 pb-10">
          <h4 className="text-sm mb-6">Synopsis</h4>
          <p className="font-neuehaas35 text-[24px] leading-[1.2] max-w-[650px] mb-20">
            Trusted by millions around the world, Invisalign is a clear,
            comfortable, and confident choice for straightening smiles. We've
            proudly ranked among the top 1% of certified Invisalign providers
            nationwide — every year since 2000.
          </p>

          <div className=" font-neuehaas35 w-full border-t border-gray-300 text-sm leading-relaxed">
            <div className="flex border-b border-gray-300">
              <div className="w-1/3 p-5">
                <p className="font-neuehaas35 text-black">Accolades</p>
              </div>
              <div className="w-1/3 flex items-center justify-center p-5"></div>
              <div className="w-1/3 p-5 w-full">
                <div className="w-full  text-sm leading-relaxed font-neuehaas35">
                  <div className="flex border-b border-gray-300 py-3">
                    <div className="w-1/2 text-gray-500">
                      6x Winner Best Orthodontist
                    </div>
                    <div className="flex-1 text-black">Best of the Valley</div>
                  </div>
                  <div className="flex border-b border-gray-300 py-3">
                    <div className="w-1/2 text-gray-500">
                      5x Winner Best Orthodontist
                    </div>
                    <div className="flex-1 text-black">
                      Readers' Choice The Morning Call
                    </div>
                  </div>
                  <div className="flex border-b border-gray-300 py-3">
                    <div className="w-1/2 text-gray-500">
                      {" "}
                      Nationally Recognized Top Orthodontist
                    </div>
                    <div className="flex-1 text-black">Top Dentists</div>
                  </div>
                  <div className="flex py-3">
                    <div className="w-1/2 text-gray-500">Top 1%</div>
                    <div className="flex-1 text-black">
                      Diamond Plus Invisalign Provider
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-300">
              <div className="w-1/3 p-5">
                <p className="font-neuehaas35 text-black">Expertise</p>
              </div>
              <div className="w-1/3 p-5"></div>
              <div className="w-1/3 p-5 w-full">
                <div className="flex border-b border-gray-300 py-3">
                  <div className="w-1/2 text-gray-500">Invisalign</div>
                  <div className="flex-1 text-black">
                    25+ Years of Experience
                  </div>
                </div>
                <div className="flex border-b border-gray-300 py-3">
                  <div className="w-1/2 text-gray-500">Invisalign Teen</div>
                  <div className="flex-1 text-black">5000+ Cases Treated</div>
                </div>
                <div className="flex py-3">
                  <div className="w-1/2 text-gray-500">Diamond Plus</div>
                  <div className="flex-1 text-black">
                    Top 1% of All Providers
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-24">
            <div className="font-neuehaas35 text-md whitespace-nowrap relative">
              What's Invisalign
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

            {/* <div
            className="mt-10 relative"
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

              },
              {
                text: "Personalized care for every patient",

              },
              {
                text: "Advanced technology at your service",
         
              },
              {
                text: "Comfortable and stress-free visits",
            
              },
            ].map((item, index) => (
              <Section key={index} onHoverStart={() => handleHover(index)}>
                <div className="relative flex items-center w-full">
                  <div
                    className="w-4 h-4 rounded-full absolute left-[40px]"
                 
                  ></div>
                  <span className="pl-40">{item.text}</span>
                </div>
              </Section>
            ))}
          </div> */}
          </div>
        </section>
        <div className="min-h-screen relative">

          <div className="font-neuehaas45 perspective-1500 text-[#0414EA]">
            <div className="flip-wrapper">
              <div className="flip-container">
                <div className="face front">Nearly Invisible</div>
                <div className="face back">
                  Treatment so discreet, only your smile tells the story.
                </div>
              </div>

              <div className="flip-container">
                <div className="face front">Designed for Comfort</div>
                <div className="face back">
                  Engineered for comfort with smooth, precision-fit aligners.
                </div>
              </div>

              <div className="flip-container">
                <div className="face front">Tailored to You</div>
                <div className="face back">
                  Your journey starts with advanced 3D imaging. From there,
                  doctor-personalized plans guide a series of custom
                  aligners—engineered to move your teeth perfectly into place.
                </div>
              </div>

              <div className="flip-container">
                <div className="face front">Removable & Flexible</div>
                <div className="face back">No wires. No food rules.</div>
              </div>

              <div className="flip-container">
                <div className="face front">Proven Results</div>
                <div className="face back">
                  See real progress in months—not years.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[650px] relative min-h-screen">
          The power of Invisalign isn’t just in the clear aligners—it’s in the
          custom treatment designed by our doctors. At FreySmiles, every plan
          starts with a full facial evaluation, digital x-rays, and
          expert-crafted prescriptions to move your teeth safely and
          beautifully. As top providers in clear aligner therapy, Dr. Gregg and
          Dr. Daniel combine advanced technology with years of orthodontic
          experience to deliver personalized, safe results. While mail-order
          aligner companies offer convenience, they skip critical steps—no
          in-person exams, no x-rays, and no expert supervision. Aligners
          without expert oversight can lead to more than disappointment—they can
          cause lasting damage. Trust doctors, not delivery boxes, when it comes
          to your smile.
        </div>
      </div>
    </>
  );
};
export default Invisalign;
{
  /* <div className="image-content mt-16">
            <img
              ref={alignerRef}
              src="../images/invisalignset.png"
              alt="aligner"
              className="w-[400px] h-[400px] object-contain"
              style={{
                willChange: "transform",
              }}
            />
            <img src="../images/alignercase.png" />
          </div> */
}
