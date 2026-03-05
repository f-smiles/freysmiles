"use client";
import MouseTrail from "../book-now/mouse.jsx";
import { createPortal } from "react-dom";
import { Renderer, Program, Mesh, Plane, Uniform } from "wtc-gl";
import { Vec2, Mat2 } from "wtc-math";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import React, { useRef, useEffect, useState, useMemo, useLayoutEffect, Suspense } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import {Environment, Text, OrbitControls, useGLTF, Center, useAnimations } from "@react-three/drei";

import { useThree, useFrame, extend, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { NormalBlending } from 'three';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SplitText } from 'gsap/SplitText';
import { AnimatePresence } from "framer-motion";

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger, ScrambleTextPlugin, SplitText);


extend({ OrbitControls, EffectComposer });

const ParticleSystem = () => {
  const particlesCount = 27000;
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef();

  const positions = useMemo(() => new Float32Array(particlesCount * 3), []);
  const velocities = useMemo(() => new Float32Array(particlesCount * 3), []);

  const createSphere = (count, radius) => {
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
  };

  useEffect(() => {
    createSphere(particlesCount, 400);
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, []);

  const { size, gl } = useThree();
  const boundsRef = useRef();

  useEffect(() => {
    const canvasEl = gl.domElement;
    const handleMove = (e) => {
      const rect = canvasEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [gl]);

  useFrame(() => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i];
      pos[i + 1] += velocities[i + 1];
      pos[i + 2] += velocities[i + 2];

      const dist = Math.sqrt(pos[i] ** 2 + pos[i + 1] ** 2 + pos[i + 2] ** 2);
      const radius = 400;
if (dist > radius) {
  const nx = pos[i] / dist;
  const ny = pos[i + 1] / dist;
  const nz = pos[i + 2] / dist;

  // snap to surface
  pos[i] = nx * radius;
  pos[i + 1] = ny * radius;
  pos[i + 2] = nz * radius;

  // reflect velocity inward
  const dot =
    velocities[i] * nx +
    velocities[i + 1] * ny +
    velocities[i + 2] * nz;

  velocities[i] -= 2 * dot * nx;
  velocities[i + 1] -= 2 * dot * ny;
  velocities[i + 2] -= 2 * dot * nz;

  velocities[i] *= 0.6;
  velocities[i + 1] *= 0.6;
  velocities[i + 2] *= 0.6;
}
const dx = mouseRef.current.x - pos[i];
const dy = -mouseRef.current.y - pos[i + 1];
const distance = Math.sqrt(dx * dx + dy * dy);

const MOUSE_RADIUS = 120;
const MOUSE_STRENGTH = 0.04;

if (distance > 0 && distance < MOUSE_RADIUS) {
  const force =
    (1 - distance / MOUSE_RADIUS) * MOUSE_STRENGTH;

  velocities[i] -= (dx / distance) * force;
  velocities[i + 1] -= (dy / distance) * force;
}
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particlesCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
  color={0xff33cc} 
  size={2.6}
  sizeAttenuation
  transparent
  opacity={0.4}
  depthWrite={false}
  blending={NormalBlending}
/>

    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ParticleSystem />
      {/* <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
        screenSpacePanning={false} 
        maxPolarAngle={Math.PI / 2} 
      /> */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={1.5}
          height={300}
        />
      </EffectComposer>
    </>
  );
};

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

  const scrambleAnimation = () => {
    return gsap.to(scrambleRef.current, {
      duration: 0.8,
      scrambleText: {
        text: originalText.current,
        characters: charSets[charsType],
        speed: 1,
        revealDelay: 0.1,
        delimiter: "",
        tweenLength: false,
      },
      ease: "power1.out",
    });
  };

  useEffect(() => {
    const element = scrambleRef.current;
    if (!element) return;

    if (scrambleOnLoad) {
      gsap.set(element, {
        scrambleText: {
          text: originalText.current,
          chars: charSets[charsType],
          revealDelay: 0.5,
        },
      });
      scrambleAnimation();
    }

    const handleMouseEnter = () => scrambleAnimation();
    element.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [scrambleOnLoad, charsType]);

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

const RaymarchingShader = () => {
  const meshRef = useRef();
  const { size, viewport } = useThree();
  

  const uniforms = React.useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    mouse: { value: new THREE.Vector2(0, 0) }
  }), []);


  useEffect(() => {
    uniforms.resolution.value.set(size.width, size.height);
  }, [size]);

  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });


  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;


  const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = (2.0 * vUv - 1.0) * vec2(resolution.x / resolution.y, 1.0);
  float PI = 3.1415926535;

  float wave = sin((uv.x + uv.y - time * 0.25) * PI * 0.4);


  float subtleShift = 0.05 * sin((uv.x + uv.y + time * 0.1) * PI * 0.8);

  float combined = wave + subtleShift;

  float band = smoothstep(-0.6, 0.6, combined);

  vec3 darkest = vec3(0.78);
  vec3 midtone = vec3(0.88);
  vec3 highlight = vec3(0.98);

  vec3 color = mix(darkest, midtone, band);
  color = mix(color, highlight, pow(band, 2.0));

  gl_FragColor = vec4(color, 1.0);
}

  `;

  return (
<mesh ref={meshRef}>
  <planeGeometry args={[viewport.width, viewport.height]} />
  <shaderMaterial
    uniforms={uniforms}
    vertexShader={vertexShader}
    fragmentShader={fragmentShader}
  />
</mesh>

  );
};

function ShaderBackground() {
  const materialRef = useRef();
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
  });

return (
  <mesh>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3() }
      }}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
    />
  </mesh>
);
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
#define S(a,b,t) smoothstep(a,b,t)
precision mediump float;

uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;

mat2 Rot(float a)
{
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);

    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                   mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);

    return 0.5 + 0.5*n;
}

void main() {
    vec2 fragCoord = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
    vec2 uv = fragCoord / iResolution.xy;

    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv - 0.5;

    float degree = noise(vec2(iTime*.1, tuv.x*tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - .5) * 720. + 60.0));
    tuv.y *= ratio;

    // --- Soft wave drifting ---
    float frequency = 2.;
    float amplitude = 35.;
    float speed = iTime * 3.;

    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * (frequency * 1.4) + speed) / (amplitude * .5);

vec3 cold1 = vec3(0.86, 0.87, 0.94);
vec3 cold2 = vec3(0.75, 0.76, 0.84);
vec3 cold3 = vec3(0.66, 0.67, 0.73);

vec3 warm1 = vec3(1.00, 0.55, 0.85); 
vec3 warm2 = vec3(0.95, 0.72, 1.00); 

// vec3 warm1 = vec3(1.00, 0.55, 0.85); // hot pink
// vec3 warm2 = vec3(0.95, 0.69, 1.00); // lavender pink

    vec3 layer1 = mix(cold1, cold2, S(-0.5, 0.3, (tuv * Rot(radians(-5.))).x));
    layer1 = mix(layer1, cold3, S(-0.1, 0.7, (tuv * Rot(radians(-5.))).x));

    vec3 layer2 = mix(cold2, cold3, S(-0.8, 0.2, (tuv * Rot(radians(-5.))).x));
    layer2 = mix(layer2, cold1, S(-0.2, 0.9, (tuv * Rot(radians(-5.))).x));


    float dist = length(tuv * vec2(1.2, 1.0));
    float glow = smoothstep(0.7, 0.0, dist);    // soft radial falloff
    glow = pow(glow, 1.8);                     // softer edge

    vec3 warmGlow = mix(warm1, warm2, glow);


vec3 base = mix(layer1, layer2, S(.6, -.4, tuv.y));
vec3 col = mix(base, warmGlow, glow * 1.3);

col = mix(col, vec3(0.98, 0.97, 1.0), 0.05);

gl_FragColor = vec4(col, 1.0);
}
`;


const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const el = document.createElement("textarea");
    el.style.position = "fixed";
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    el.style.zIndex = "-9999";

    textareaRef.current = el;
    document.body.appendChild(el);

    return () => {
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, []);

  const handleCopy = async () => {
    let success = false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {}
    }

    if (!success && textareaRef.current) {
      const el = textareaRef.current;
      el.value = text;
      el.setSelectionRange(0, text.length);
      success = document.execCommand("copy");
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="relative w-[280px] h-[48px] rounded-md overflow-hidden group"
    >

      <div className="absolute inset-0 p-px bg-neutral-600 rounded-md overflow-hidden">
        <div className="glowing-border absolute inset-0 w-[90px] h-[90px]"></div>
      </div>


      <div className="absolute inset-[1px] bg-black rounded-md flex items-center justify-center text-[12px] tracking-wider">
        <span
          className={`transition-opacity duration-300 ${
            copied ? "opacity-0" : "opacity-100"
          }`}
        >
          {label}
        </span>

        <span
          className={`absolute transition-opacity duration-300 ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          COPIED
        </span>
      </div>
    </button>
  );
};

export default function BookNow() {
  
  const fadeUpMaskedVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        transition: { duration: 1, ease: "easeOut", delay: 2 },
      },
    },
  };

  const contentRef = useRef(null);


  const cardsectionRef = useRef(null);
  const [linesComplete, setLinesComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);


const containerOneRef = useRef(null);
  const h1Ref = useRef(null);

useEffect(() => {
 if (typeof window === "undefined" || !h1Ref.current) return;

  const split = new SplitText(h1Ref.current, { types: "chars" });
  const chars = split.chars;


  gsap.set(chars, {
    y: 100,
    rotation: 2,    
    opacity: 0,
    force3D: true
  });

  gsap.to(chars, {
    y: 0,
    rotation: 0,
    opacity: 1,
    duration: 1,    
    ease: "power3.inOut",
    stagger: 0.1,   
  });

  return () => split.revert();
}, []);

const [open, setOpen] = useState(false);

useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [open]);
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  const [errors, setErrors] = useState({});
const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const res = await fetch("/api/apply", {
    method: "POST",
    body: formData, 
  });

  if (res.ok) {
    alert("Application submitted successfully!");
    form.reset();
    setResumeName("");
  } else {
    alert("Something went wrong. Please try again.");
  }
};

const [resumeName, setResumeName] = useState("");
const [time, setTime] = useState("");

useEffect(() => {
  const update = () => {
    const now = new Date();
    setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
  };

  update();
  const interval = setInterval(update, 1000);
  return () => clearInterval(interval);
}, []);
  return (
    <>
    {/* <div style={{height: '100vh', width: '100vw'}}>
<Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
  <ambientLight intensity={0.5} />

  <directionalLight position={[4, 6, 4]} intensity={1.4} />
  <directionalLight position={[-3, 2, 2]} intensity={0.9} color="#fff4ee" />
  <directionalLight position={[0, 3, -6]} intensity={1.1} />

  <Environment files='/images/studio_small_03_4k.hdr' />

  <Suspense fallback={null}>
    <PortalJourneyModel position={[0, -0.6, 0]} scale={0.5} />
  </Suspense>
</Canvas>
    </div> */}

{/* <App /> */}

 {/* <div className="absolute inset-0 -z-10">
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      className="w-full h-full"
    >
      <ShaderBackground />
    </Canvas>
  </div>

<div className="flex flex-col lg:flex-row w-full h-screen">
            <div className="w-1/2 relative h-screen">
              <Canvas
                camera={{ position: [0, 0, 1000], fov: 75 }}
                gl={{ alpha: true }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              >
                <Scene />
              </Canvas>

              <div className="relative z-10 flex flex-col justify-center h-full items-center">
                <div className="flex flex-col gap-6 text-sm uppercase">
                  <p className="text-[11px] text-white  uppercase font-ibmplex">
                    // Contact Us
                  </p>
                  <div>
<p className="text-[11px] text-white mb-1 font-ibmplex uppercase">
  <span className="block">
    <ScrambleText text="GENERAL" />
  </span>
</p>
                    <p className="text-[11px] text-white leading-[1.6] font-ibmplex">
                       <span className="block">
                      <ScrambleText text="info@freysmiles.com" />
                   </span>
                    </p>
                   <p className="text-[11px] text-white leading-[1.6] font-ibmplex">
                     <span className="block">
                                    <ScrambleText text="(610)437-4748" charsType="numbers" />
                     </span>
             
                           </p>
              
                  </div>

                  <div>
                    <p className="text-[11px] text-white mb-1 font-ibmplex uppercase">
                      <ScrambleText text="ADDRESS" className="mr-10" />
                    </p>
                    <p className="text-[11px] text-white leading-[1.5] font-ibmplex">
                      <ScrambleText text="Frey Smiles" charsType="numbers" />
                      <br />
                      <ScrambleText
                        text="1250 S Cedar Crest Blvd"
                        charsType="numbers"
                      />
                      <br />
                      <ScrambleText text="Allentown PA" charsType="numbers" />
                    </p>
                  </div>
                </div>
              </div>
            </div>



<div className="acuity-font w-full lg:w-1/2 h-[50vh] lg:h-full flex items-center justify-center">
  <div className="w-full h-full p-[5vh]">
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=37690830"
        title="Schedule Appointment"
        className="w-full h-full"
        frameBorder="0"
        allow="payment"
      />
    </div>
  </div>
</div>
</div> */}
  <section className="w-full h-screen bg-[#f2f2f2] text-black grid grid-rows-[auto_1fr_auto]">

      <div className="flex items-center justify-between px-12 pt-6 text-xs tracking-wide">

        <div className=""></div>
        <div className="text-right font-neuehaas45">
         <div>40° 36' N 75° 29' W</div>
         <div>{time}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center px-12">

        <div>
          <h1 className="text-[64px] uppercase font-neuehaas45">
           Frey Smiles
          </h1>
        </div>

        <div className="flex justify-center">
      <PerlinParticles />
        </div>

        <div className="flex justify-between font-neuehaas45 justify-end text-[14px] tracking-[0.015em]">
         <span>Early Orthodontics</span><span>Adult Orthodontics</span> <span>Book</span>
        </div>

      </div>


      <div className="flex justify-center pb-6 text-xs font-neuehaas35 tracking-widest">
        SCROLL
      </div>

    </section>
{/* <section
  className="
    bg-black
    relative
    z-10
    w-full
    h-screen



    text-white

    overflow-hidden
  "
>


  <div className="flex items-center justify-center">
  <div className="overflow-hidden pb-[0.1em]">
    <h1
      className=" text-[32px] lg:text-[34px] font-canelathin text-center leading-[1.2]"
      ref={h1Ref}
    >
website coming soon

    </h1>
  </div>
  </div>



  <div className="flex items-start justify-center">
 <div
    className="
      flex flex-col
      w-[280px]
      text-center
      text-[14px] lg:text-[16px]
      font-neuehaas45 leading-relaxed
      max-w-[500px]
      w-full      
      gap-3
    "
  >

    <CopyButton 
      text="610-437-4748" 
      label="copy 610-437-4748" 
    />
    <CopyButton 
      text="info" 
      label="copy email" 
    />

</div>
  </div>

  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="circle-loader relative">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`circle circle-${i}`} />
      ))}
    </div>
  </div>

<div
  className="relative z-10 flex flex-col items-center"
  ref={containerOneRef}
>


</div>

      <div className="font-neuehaas45 absolute top-[85%] right-16 py-2 px-4 z-10">
<button
  type="button"
  onClick={() => setOpen(true)}
  className="flex items-center gap-2"
>
  <span className="opacity-60 text-sm">→</span>
  Join Our Team
</button>
      </div>
{typeof window !== "undefined" &&
  createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
transition={{
  duration: 1,
  ease: [0.22, 1, 0.36, 1],
  exit: {
    opacity: {
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1]
    },
    backdropFilter: {
      duration: 0.4 
    }
  }
}}
          className="fixed inset-0 z-50 bg-black/80 
                     flex items-center justify-center
                     font-neuehaas45 tracking-wide"
          onClick={handleClose}
        >
        <motion.div
  key="panel"
  initial={{
    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
    scale: 0.9,
    opacity: 0
  }}
  animate={{
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    scale: 1,
    opacity: 1
  }}
  exit={{
    clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
    scale: 0.92,
    opacity: 0
  }}
  transition={{
    duration: 1.2,
    ease: [0.16, 1, 0.3, 1],
    
    clipPath: { 
      duration: 1.4,
      ease: [0.34, 1.56, 0.64, 1]
    },
    
    scale: {
      duration: 0.8,
      ease: "backOut"
    },
    

    opacity: {
      duration: 1.0
    }
  }}

            className="relative w-full h-full 
                       bg-gradient-to-br
                       from-[#4E5353]
                       via-[#505456]
                       to-[#3E4243]
                       text-[#EDE5D7]
                       flex items-start justify-center
                       overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
    
          <div className="absolute inset-0 pointer-events-none z-[0]
                        bg-[radial-gradient(circle_at_45%_22%,rgba(140,130,170,0.10),transparent_55%)]" />

     
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <CanvasBallsAnimation />
          </div>

          <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-noise z-[2]" />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative z-[3] w-full"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-8 right-8 text-sm opacity-70 hover:opacity-100 
                         transition-opacity focus:outline-none focus:ring-2 focus:ring-white/30 
                         rounded px-2 py-1 text-[#EDE5D7]"
            >
              ✕ Close
            </button>
            
            <div className="w-full px-12 md:px-20 pt-14 md:pt-20 mb-8">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[28px] font-canelathin mb-10"
              >
                Start Your Application
                <span className="opacity-50 font-canelathin mx-2">—</span>
                <span className="text-[14px] tracking-wide opacity-70 align-middle font-neuehaas45 text-[#FEB44A]">
                For open positions at Frey Smiles
                </span>
              </motion.h2>
              
              <form
                onSubmit={handleSubmit}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8"
              >
  
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        Full Name
                      </label>
                      <input
                        name="name"
                        required
                        placeholder="Jane Doe"
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.65 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        Best way to reach you
                      </label>
                      <input
                        name="contact"
                        required
                        placeholder="Email or phone number"
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        High school graduation year
                      </label>
                      <select
                        name="gradYear"
                        required
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 40 }, (_, i) => {
                          const year = 2027 - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.75 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        Do you have experience working in dentistry or orthodontics?
                      </label>
                      <select
                        name="experience"
                        required
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      >
                        <option value="">Select</option>
                        <option value="no">No</option>
                        <option value="yes-dentistry">Yes — Dentistry</option>
                        <option value="yes-ortho">Yes — Orthodontics</option>
                        <option value="yes-both">Yes — Both</option>
                      </select>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        Position you're interested in
                      </label>
                      <select
                        name="role"
                        required
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      >
                        <option value="">Select role</option>
                        <option value="assistant">Clinical Assistant</option>
                        <option value="front-desk">Front Desk / Admin</option>
                        <option value="coordinator">Treatment Coordinator</option>
                        <option value="sterilization">Sterilization / Lab</option>
                        <option value="open">Open / Unsure</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.85 }}
                    >
                      <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                        How did you hear about us?
                      </label>
                      <select
                        name="source"
                        required
                        className="w-full bg-transparent border border-white/20 rounded-lg 
                                 px-4 py-3 
                                 text-[12px] leading-relaxed
                                 text-white/85
                                 placeholder:text-white/35
                                 tracking-[0.01em]
                                 focus:outline-none focus:border-white/60
                                 transition-colors"
                      >
                        <option value="">Select source</option>
                        <option value="website">Website</option>
                        <option value="social">Social Media</option>
                        <option value="friend">Friend / Employee</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                      When would you be available to start?
                    </label>
                    <input
                      name="availability"
                      required
                      placeholder="Immediately, in 2 weeks, next month…"
                      className="text-[12px] leading-relaxed
                               text-white/85
                               placeholder:text-white/35 opacity-70  
                               w-full bg-transparent border border-white/20 rounded-lg 
                               px-4 py-3 focus:outline-none focus:border-white/60
                               transition-colors"
                    />
                  </motion.div>
                </motion.div>

          
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-8"
                >
               
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.95 }}
                  >
                    <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                      Resume (PDF preferred)
                    </label>
                    <label className="flex items-center justify-center border border-white/30 
                                      rounded-lg px-6 py-4 cursor-pointer 
                                      hover:border-white transition-colors">
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setResumeName(e.target.files?.[0]?.name)}
                      />
                      {resumeName ? (
                        <span className="text-sm opacity-90">Selected: {resumeName}</span>
                      ) : (
                        <span className="text-[12px] leading-relaxed
                               text-white/85
                               placeholder:text-white/35 opacity-70">
                          Click to add resume
                        </span>
                      )}
                    </label>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                      What interests you about working with our practice?
                    </label>
                    <textarea
                      name="motivation"
                      maxLength={300}
                      rows={5}
                      required
                      placeholder="max 300 characters"
                      className="text-[12px] leading-relaxed
                               text-white/85
                               placeholder:text-white/35 opacity-70 
                               w-full bg-transparent border border-white/20 rounded-lg 
                               px-4 py-3 focus:outline-none focus:border-white/60 
                               resize-none transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.05 }}
                  >
                    <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                      Is there anything else you'd like us to know?
                    </label>
                    <textarea
                      name="notes"
                      rows={4}
                      placeholder="Optional"
                      className="text-[12px] leading-relaxed
                               text-white/85
                               placeholder:text-white/35 opacity-70  
                               w-full bg-transparent border border-white/20 rounded-lg 
                               px-4 py-3 focus:outline-none focus:border-white/60 
                               resize-none transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="pt-2 flex justify-end"
                  >
<button
  type="submit"
  className="up border text-[13px] uppercase tracking-widest 
             border border-white/20 rounded-lg px-10 py-5 
             transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
>
  Submit
</button>
                  </motion.div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.getElementById("modal-root")
)}


</section> */}
{/* <div className="acuity-font w-full lg:w-1/2 h-[50vh] lg:h-full flex items-center justify-center">
  <div className="w-full h-full p-[5vh]">
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <iframe
        src="https://app.acuityscheduling.com/schedule.php?owner=37690830"
        title="Schedule Appointment"
        className="w-full h-full"
        frameBorder="0"
        allow="payment"
      />
    </div>
  </div>
</div> */}
<section  className="relative w-full">
  {/* <div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    zIndex: 0 
  }}>
    <Canvas>
      <RaymarchingShader />
    </Canvas>
  </div> */}


      </section>

    </>
  );
}

const CanvasBallsAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();


    const BALL_COUNT = 38;
    const R = 2;
    const maxDistance = 260;
    const lineWidth = 0.6;

const ballColor = { r: 254, g: 180, b: 74 };

    const speedRange = 0.35;  // slower 

    let balls = [];

    const random = (min, max) => Math.random() * (max - min) + min;

    const createBall = () => ({
      x: random(0, width),
      y: random(0, height),
      vx: random(-speedRange, speedRange),
      vy: random(-speedRange, speedRange),
      r: R,
      alpha: random(0.4, 0.8),
    });

    const initBalls = () => {
      balls = [];
      for (let i = 0; i < BALL_COUNT; i++) {
        balls.push(createBall());
      }
    };

    const distance = (a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    };

    const updateBalls = () => {
      balls.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        // soft wrap
        if (b.x < -50) b.x = width + 50;
        if (b.x > width + 50) b.x = -50;
        if (b.y < -50) b.y = height + 50;
        if (b.y > height + 50) b.y = -50;
      });
    };

    const drawLines = () => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const dist = distance(b1, b2);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.2; 

            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawBalls = () => {
      balls.forEach((b) => {
        ctx.fillStyle = `rgba(${ballColor.r}, ${ballColor.g}, ${ballColor.b}, ${b.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawLines();
      drawBalls();
      updateBalls();

      animationRef.current = requestAnimationFrame(animate);
    };

    initBalls();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};



const PerlinParticles = () => {
  const vertexShader = `
//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 1.5 * n_xyz;
}

// Turbulence By Jaume Sanchez => https://codepen.io/spite/

varying vec2 vUv;
varying float noise;
varying float qnoise;
varying float displacement;

uniform float time;
uniform float pointscale;
uniform float decay;
uniform float complex;
uniform float waves;
uniform float eqcolor;
uniform bool fragment;

float turbulence( vec3 p) {
  float t = - 0.1;
  for (float f = 1.0 ; f <= 3.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }
  return t;
}

void main() {

  vUv = uv;

  noise = (1.0 *  - waves) * turbulence( decay * abs(normal + time));
  qnoise = (2.0 *  - eqcolor) * turbulence( decay * abs(normal + time));
  float b = pnoise( complex * (position) + vec3( 1.0 * time ), vec3( 100.0 ) );
  
  if (fragment == true) {
    displacement = - sin(noise) + normalize(b * 0.5);
  } else {
    displacement = - sin(noise) + cos(b * 0.5);
  }

  vec3 newPosition = (position) + (normal * displacement);
  gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, 1.0 );
  gl_PointSize = (pointscale);

}
`;

// MODIFIED: Purple-themed fragment shader
const fragmentShader = `
varying float qnoise;
varying float noise;

uniform float time;
uniform float grainStrength;
uniform float grainIntensity;
uniform float opacity;

// Function to generate pseudo-random noise
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    // Create purple shades based on qnoise and noise
    // Purple hues range from blue-purple (0.7) to pink-purple (0.9)
    
    // Base purple color with variation
    float hueVariation = sin(qnoise * 3.0) * 0.2; // Creates variation in purple shades
    
float r = 0.92 + 0.05 * sin(qnoise * 2.0);
float g = 0.65 + 0.06 * cos(noise * 2.0);
float b = 1.0 + 0.04 * sin(noise * 3.0);
    
    vec3 color = vec3(r, g, b);
    
    // Apply grain for texture
    vec2 grainUv = gl_FragCoord.xy / vec2(1024.0);
    float grain = rand(grainUv + time * 0.001) * grainIntensity;
    color += (grain - 0.5) * grainStrength;
    
    // Add some variation based on position for depth
float brightness = 1.05 + 0.06 * sin(qnoise * 5.0 + time * 2.0);
color *= brightness;

    gl_FragColor = vec4(color, opacity);
}
`;
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const primitiveRef = useRef(null);
  const materialRef = useRef(null);
  const guiRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const [options, setOptions] = useState({
    camera: {
      zoom: 12
    },
    perlin: {
      vel: 0.002,
      speed: 0.00001,
      perlins: 1.0,
      decay: 0.1,
      complex: 0.3,
      waves: 20.0,
      fragment: true
    },
    spin: {
      sinVel: 0.0,
      ampVel: 80.0
    },
    grain: {
      strength: 0.5,
      intensity: 0.5
    },
    blackAndWhite: true,
    detail: 50,
    opacity: 0.5
  });

  // Create scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, aspect, 1, 1000);
    camera.position.z = options.camera.zoom;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create primitive
    createPrimitive();



    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    startTimeRef.current = Date.now();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update when options change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.opacity.value = options.opacity;
    }
  }, [options.opacity]);

  useEffect(() => {
    if (materialRef.current) {
      updateMaterialUniforms();
    }
  }, [
    options.perlin.speed,
    options.perlin.perlins,
    options.perlin.decay,
    options.perlin.complex,
    options.perlin.waves,
    options.perlin.fragment,
    options.grain.strength,
    options.grain.intensity,
    options.blackAndWhite
  ]);

  const updateMaterialUniforms = () => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.time.value = options.perlin.speed * (Date.now() - startTimeRef.current);
    materialRef.current.uniforms.pointscale.value = options.perlin.perlins;
    materialRef.current.uniforms.decay.value = options.perlin.decay;
    materialRef.current.uniforms.complex.value = options.perlin.complex;
    materialRef.current.uniforms.waves.value = options.perlin.waves;
    materialRef.current.uniforms.fragment.value = options.perlin.fragment;
    materialRef.current.uniforms.grainStrength.value = options.grain.strength;
    materialRef.current.uniforms.grainIntensity.value = options.grain.intensity;
    materialRef.current.uniforms.blackAndWhite.value = options.blackAndWhite;
  };

  const createPrimitive = () => {
    if (!sceneRef.current) return;

    // Remove existing primitive
    if (primitiveRef.current) {
      sceneRef.current.remove(primitiveRef.current);
    }

    const geometry = new THREE.IcosahedronGeometry(3, options.detail);

    const material = new THREE.ShaderMaterial({
      wireframe: false,
      transparent: true,
      uniforms: {
        time: { value: 0.0 },
        pointscale: { value: options.perlin.perlins },
        decay: { value: options.perlin.decay },
        complex: { value: options.perlin.complex },
        waves: { value: options.perlin.waves },
        fragment: { value: options.perlin.fragment },
        grainStrength: { value: options.grain.strength },
        grainIntensity: { value: options.grain.intensity },
        blackAndWhite: { value: options.blackAndWhite },
        opacity: { value: options.opacity }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    materialRef.current = material;

    const mesh = new THREE.Points(geometry, material);
    const primitive = new THREE.Object3D();
    primitive.add(mesh);
    primitiveRef.current = primitive;
    sceneRef.current.add(primitive);
  };


  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !primitiveRef.current || !materialRef.current) return;

    const performance = Date.now() * 0.003;

    primitiveRef.current.rotation.y += options.perlin.vel;
    primitiveRef.current.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel * Math.PI) / 180;

    materialRef.current.uniforms.time.value = options.perlin.speed * (Date.now() - startTimeRef.current);
    materialRef.current.uniforms.pointscale.value = options.perlin.perlins;
    materialRef.current.uniforms.decay.value = options.perlin.decay;
    materialRef.current.uniforms.complex.value = options.perlin.complex;
    materialRef.current.uniforms.waves.value = options.perlin.waves;
    materialRef.current.uniforms.fragment.value = options.perlin.fragment;
    materialRef.current.uniforms.grainStrength.value = options.grain.strength;
    materialRef.current.uniforms.grainIntensity.value = options.grain.intensity;
    materialRef.current.uniforms.blackAndWhite.value = options.blackAndWhite;

    cameraRef.current.lookAt(sceneRef.current.position);
    rendererRef.current.render(sceneRef.current, cameraRef.current);

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="perlin-particles-container">
      <div ref={containerRef} id="container" className="canvas-container" />
      <div className="text-wrapper">
        <h2 className="small-text"></h2>
        <h1 className="text-line">
        <br />
       
        </h1>
        <h2 className="font-canelathin text-[24px]">full site access coming soon</h2>

      </div>
    </div>
  );
};
function App() {
  const footerRef = useRef(null);
  const mainRef = useRef(null);
  const svgPathsRef = useRef([]);
  const marqueeContentRef = useRef(null);


  const updateFooterMargin = () => {
    if (footerRef.current && mainRef.current) {
      const footerHeight = footerRef.current.offsetHeight;
      mainRef.current.style.marginBottom = `${footerHeight}px`;
    }
  };

  useEffect(() => {
    updateFooterMargin();
    if (svgPathsRef.current.length > 0 && marqueeContentRef.current) {
 
      const svgTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "bottom 80%",
          end: "bottom top",
          scrub: true,
          toggleActions: "play none none reverse",
          markers: false
        }
      });

      svgPathsRef.current.forEach((path, i) => {
        svgTimeline.fromTo(
          path,
          { opacity: 0, y: 75 },
          { opacity: 1, y: 0, ease: "power3.out" },
          i * 0.25
        );
      });
      ScrollTrigger.refresh();
    }


    const handleResize = () => {
      updateFooterMargin();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);


  const addToSvgPathsRef = (el) => {
    if (el && !svgPathsRef.current.includes(el)) {
      svgPathsRef.current.push(el);
    }
  };

  return (
    <>

    <OfficeChat />
    {/* <OfficeMessage /> */}
      {/* <div className="creativity-main-wrapper" ref={mainRef}>
<ContactHero />
      </div> */}


      {/* <footer className="creativity-footer" ref={footerRef}>

           
                <div className="absolute inset-0">
  <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      className="w-full h-full"
    >
      <ShaderBackground />
    </Canvas>

        </div>

          <div className="scene-layer">
    <Canvas
      camera={{ position: [0, 0, 1000], fov: 75 }}
      gl={{ alpha: true }}
    >
      <Scene />
    </Canvas>
  </div>
        
<div className="creativity-footer__marquee">
  
  <div className="creativity-footer__marquee-track" ref={marqueeContentRef}>
  <div className="creativity-footer__marquee-group">
      <span className="creativity-marquee-item">The</span>
      <span className="creativity-marquee-item">Future</span>
      <span className="creativity-marquee-item">Looks</span>
      <span className="creativity-marquee-item">Good</span>
      <span className="creativity-marquee-item">On</span>
        <span className="creativity-marquee-item">You</span>
    </div>

  <div className="creativity-footer__marquee-group">
      <span className="creativity-marquee-item">The</span>
      <span className="creativity-marquee-item">Future</span>
      <span className="creativity-marquee-item">Looks</span>
      <span className="creativity-marquee-item">Good</span>
      <span className="creativity-marquee-item">On</span>
        <span className="creativity-marquee-item">You</span>
    </div>
  <div className="creativity-footer__marquee-group">
      <span className="creativity-marquee-item">The</span>
      <span className="creativity-marquee-item">Future</span>
      <span className="creativity-marquee-item">Looks</span>
      <span className="creativity-marquee-item">Good</span>
      <span className="creativity-marquee-item">On</span>
        <span className="creativity-marquee-item">You</span>
    </div>
  </div>
</div>
        <div className="creativity-footer__center">
          
          <div className="creativity-footer__center-content">
      
            <p className="creativity-footer-text">
              
            <div className="relative z-10 flex flex-col justify-center h-full items-center">
        <div className="flex flex-col gap-6 text-sm uppercase">
                  <p className="text-[11px] text-white  uppercase font-ibmplex">
                    // Contact Us
                  </p>
                  <div>
<p className="text-[11px] text-white mb-1 font-ibmplex uppercase">
  <span className="block">
    <ScrambleText text="GENERAL" />
  </span>
</p>
                    <p className="text-[11px] text-white leading-[1.6] font-ibmplex">
                       <span className="block">
                      <ScrambleText text="info@freysmiles.com" />
                   </span>
                    </p>
                   <p className="text-[11px] text-white leading-[1.6] font-ibmplex">
                     <span className="block">
                                    <ScrambleText text="(610)437-4748" charsType="numbers" />
                     </span>
             
                           </p>
              
                  </div>

                  <div>
                    <p className="text-[11px] text-white mb-1 font-ibmplex uppercase">
                      <ScrambleText text="BOOKING" className="mr-10" />
                    </p>
                    <p className="text-[11px] text-white leading-[1.5] font-ibmplex">
                      <ScrambleText text="booking@freysmiles.com" charsType="numbers" />
                      <br />
                      <ScrambleText
                        text="FreySmiles"
                        charsType="numbers"
                      />
                      <br />
                      <ScrambleText text="Allentown PA" charsType="numbers" />
                    </p>
                  </div>
                </div>
      
              </div>
            </p>
          </div>
          
          <div className="creativity-footer__svg-animation">
<svg 
  width="100%" 
  viewBox="0 0 242 94" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  className="creativity-svg-animation"
>
  <g
    ref={addToSvgPathsRef}
    className="creativity-svg-path"
    transform="translate(6, 10) scale(2.5)"
  >
    <defs>
      <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A3A8F0" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#C6B5F7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#A0EACF" stopOpacity="0.2" />
      </linearGradient>

    </defs>

<g fill="url(#glassGradient)">
      <path d="M0 8H8V34H0V24H8V16H0V8Z" />
      <rect x="8" width="20" height="8" />
      <rect x="8" y="16" width="16" height="8" />
    </g>
  </g>

 
  <image
    ref={addToSvgPathsRef}
    href="/images/sshape.svg"
    x="80"
    y="0"
    width="80"
    height="94"
    className="creativity-svg-path"
  />

  <image
    ref={addToSvgPathsRef}
    href="/images/oshape.svg"
    x="160"
    y="0"
    width="80"
    height="94"
    className="creativity-svg-path"
  />

</svg>
          </div>
        </div>
        
<div className="creativity-footer__bottom">
  <div className="creativity-footer__bottom-links">
    <a href="#" className="creativity-footer__link"> Allentown</a>
    <span className="creativity-footer__separator">/</span>
    <a href="#" className="creativity-footer__link">Bethlehem </a>
    <span className="creativity-footer__separator">/</span>
    <a href="#" className="creativity-footer__link"> Schnecksville </a>
    <span className="creativity-footer__separator">/</span>
    <a href="#" className="creativity-footer__link"> Lehighton </a>
  </div>
</div>
      </footer> */}

    </>
  );
}


function ContactHero() {
  return (
    <section className="relative h-screen overflow-hidden">

<div className="relative h-full rounded-2xl border border-white/30 overflow-hidden flex flex-col">

<div className="relative flex-1  flex">
  <div className="absolute inset-0 -z-10">
             <Canvas>
                      <RaymarchingShader />
          </Canvas>
  
  </div>

  <div className="relative w-1/2 p-12 flex flex-col justify-center">

<p className="text-white/70 mt-4 font-neuehaas45">Have a question? Send us a message or book a visit.</p>

<div className="grid grid-cols-2 gap-6 max-w-xl">

<div className="font-neuehaas45 flex flex-col gap-2">


  <span className="text-[10px] tracking-widest text-white/80 uppercase ml-1">
    Name
  </span>


  <div className="relative h-18 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl px-6 flex items-center">
<input
  className="bg-transparent w-full text-lg text-black placeholder-black/60 outline-none border-none ring-0 focus:ring-0 focus:outline-none appearance-none"
/>
  </div>

</div>

<div className="font-neuehaas45 flex flex-col gap-2">


  <span className="text-[10px] tracking-widest text-white/80 uppercase ml-1">
    Email
  </span>

  <div className="relative h-18 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl px-6 flex items-center">
<input

  className="bg-transparent w-full text-lg text-black placeholder-black/60 outline-none border-none ring-0 focus:ring-0 focus:outline-none appearance-none"
/>
  </div>

</div>


<div className="font-neuehaas45 flex flex-col gap-2 col-span-2">


  <span className="text-[10px] tracking-widest text-white/80 uppercase ml-1">
    Message
  </span>

  <div className="relative h-32 rounded-2xl border border-white/40 bg-white/20 backdrop-blur-xl px-6 flex items-center">
<input
  className="bg-transparent w-full text-lg text-black placeholder-black/60 outline-none border-none ring-0 focus:ring-0 focus:outline-none appearance-none"
/>
  </div>

</div>

</div>

    <div className="mt-10">
      <button className="w-20 h-20 rounded-full border border-white/50 flex items-center justify-center text-white text-3xl hover:bg-white/10 transition">
        ↗
      </button>
    </div>
  </div>

  <div className="w-1/2 h-full p-10 flex items-center justify-center acuity-font">
    <div className="w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-lg">
      <iframe
        src="https://freysmilesappointments.as.me/"
        title="Schedule Appointment"
        className="w-full h-full"
        frameBorder="0"
        allow="payment"
      />
    </div>
  </div>

</div>
      </div>
    </section>
  );
}

const OfficeChat = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [intent, setIntent] = useState(null);
  const [typing, setTyping] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);
  const [question, setQuestion] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const chatContainerRef = useRef(null);
  const [moderationMessage, setModerationMessage] = useState(null);
const [showTeamForm, setShowTeamForm] = useState(false);
const [messageStep, setMessageStep] = useState(0);
const [officeMessage, setOfficeMessage] = useState("");
const [officeEmail, setOfficeEmail] = useState("");
const [officePhone, setOfficePhone] = useState("");

  useEffect(() => {
    if (!chatContainerRef.current) return;

    requestAnimationFrame(() => {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    });

  }, [step, typing, questionStep, intent, contactMethod, contactValue, moderationMessage]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);
  
  // useEffect(() => {
  //   if (step !== 1) return;
  //   setTyping(true);
  //   const t = setTimeout(() => {
  //     setTyping(false);
  //     setStep(2);
  //   }, 900);
  //   return () => clearTimeout(t);
  // }, [step]);

const handleIntentSelect = (selectedIntent) => {
  setIntent(selectedIntent);
  
  if (selectedIntent === "book") {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setTimeout(() => {
        setShowScheduler(true);
      }, 500);
    }, 900);
  }
  
  if (selectedIntent === "job") {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setTimeout(() => {
        setShowTeamForm(true);
      }, 500);
    }, 900);
  }
  
  if (selectedIntent === "ai") {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setQuestionStep(1);
    }, 900);
  }

  if (selectedIntent === "message") {
  setTyping(true);
  setTimeout(() => {
    setTyping(false);
    setMessageStep(1);
  }, 900);
}
};
const handleQuestionSubmit = async () => {
  if (!question.trim()) return;
  console.log("Submitting question:", question);
  const res = await fetch("/api/moderate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: question })
  });

  const data = await res.json();
  console.log("Moderation response:", data);

  if (data.flagged) {
    setModerationMessage(
      "Let's keep it respectful. Mind rephrasing that?"
    );
    return;
  }


  setModerationMessage(null);

  setTyping(true);

  setTimeout(() => {
    setTyping(false);
    setQuestionStep(2);

    setTimeout(() => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setQuestionStep(3);
      }, 900);
    }, 600);
  }, 900);
};
const handleOfficeMessageSubmit = async () => {
  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(officeEmail);

  const phoneValid =
    officePhone.replace(/\D/g, "").length >= 10;

  if (
    !officeMessage.trim() ||
    !emailValid ||
    !phoneValid
  ) {
    return;
  }

  setTyping(true);

  setTimeout(() => {
    setTyping(false);
    setMessageStep(2);
  }, 900);
};
  const handleContactSubmit = () => {
    if (!contactValue.trim()) return;
    
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setQuestionStep(4); 
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      <MouseTrail
        images={[
          "../images/mousetrail/flame.png",
          "../images/mousetrail/cat.png",
          "../images/mousetrail/pixelstar.png",
          "../images/mousetrail/avocado.png",
          "../images/mousetrail/ghost.png",
          "../images/mousetrail/pacman.png",
          "../images/mousetrail/evilrobot.png",
          "../images/mousetrail/thirdeye.png",
          "../images/mousetrail/alientcat.png",
          "../images/mousetrail/gotcha.png",
          "../images/mousetrail/karaokekawaii.png",
          "../images/mousetrail/mushroom.png",
          "../images/mousetrail/pixelcloud.png",
          "../images/mousetrail/pineapple.png",
          "../images/mousetrail/pixelsun.png",
          "../images/mousetrail/cherries.png",
          "../images/mousetrail/watermelon.png",
          "../images/mousetrail/dolphins.png",
          "../images/mousetrail/jellyfish.png",
          "../images/mousetrail/nyancat.png",
          "../images/mousetrail/donut.png",
          "../images/mousetrail/controller.png",
          "../images/mousetrail/dinosaur.png",
          "../images/mousetrail/headphones.png",
          "../images/mousetrail/porsche.png",
        ]}
      />  
 {visible && (
    <div className="relative w-full h-full">
   
      <div
        className={`
          absolute inset-0
          transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
             ${showScheduler || showTeamForm 
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0"
          }
        `}
      >
        <div
          className="w-full h-full px-[12vw] pt-[10vh] pb-[15vh] overflow-y-auto scroll-smooth"
          ref={chatContainerRef}
        >
          <div className="flex flex-col gap-8 max-w-3xl min-h-full">

            <div className="flex justify-start">
              <OfficeMessage />
            </div>
            

            <div className="flex justify-end">
              <UserResponse
                name={name}
                setName={setName}
                submitted={step >= 1}
              onSubmit={() => {
  if (!name.trim()) return;

  setTyping(true);

  setTimeout(() => {
    setTyping(false);
    setStep(1);
    setTimeout(() => {
      setStep(2);
    }, 900);

  }, 900);
}}
              />
            </div>
            
  
            {typing && !showScheduler && !showTeamForm && (
              <div className="flex justify-start">
                <OfficeTyping />
              </div>
            )}
            
            {step >= 1 && !showScheduler && !showTeamForm && (
              <div className="flex justify-start">
                <OfficeGreeting name={name} />
              </div>
            )}
            

{step >= 2  && !showScheduler && !showTeamForm && (
  <div className="flex justify-start">
    <OfficeFollowUp 
      intent={intent} 
      setIntent={handleIntentSelect}
    />
  </div>
)}


{intent === "ai" &&
 questionStep >= 1 &&
 !showScheduler &&
 
 !showTeamForm && (
  <>
    <div className="flex justify-start">
      <OfficeQuestionPrompt />
    </div>

    <div className="flex justify-end">
      <UserQuestion
        question={question}
        setQuestion={setQuestion}
        setModerationMessage={setModerationMessage}
        onSubmit={handleQuestionSubmit}
        isSubmitted={questionStep >= 2}
      />
    </div>

    {moderationMessage && (
      <div className="flex justify-start mt-4">
        <OfficeMessage customText={moderationMessage} />
      </div>
    )}
  </>
)}


{intent === "ai" &&
 questionStep >= 2 &&
 !showScheduler &&
 !showTeamForm && (
  <div className="flex justify-start">
    <OfficeContactPrompt name={name} />
  </div>
)}
{intent === "message" &&
 messageStep >= 1 &&
 !showScheduler &&
 !showTeamForm && (
  <>
    <div className="flex justify-start">
      <OfficeMessage customText="This goes straight to our team. Leave us a note and we’ll personally follow up." />
    </div>

    <div className="flex justify-end">
<UserMessage
  message={officeMessage}
  setMessage={setOfficeMessage}
  email={officeEmail}
  setEmail={setOfficeEmail}
  phone={officePhone}
  setPhone={setOfficePhone}
  onSubmit={handleOfficeMessageSubmit}
  isSubmitted={messageStep >= 2}
/>
    </div>
  </>
)}

            {questionStep >= 3 && !showScheduler && !showTeamForm&& (
              <div className="flex justify-end">
                <UserContact
                  contactMethod={contactMethod}
                  setContactMethod={setContactMethod}
                  contactValue={contactValue}
                  setContactValue={setContactValue}
                  onSubmit={handleContactSubmit}
                  isSubmitted={questionStep >= 4}
                />
              </div>
            )}

    
            {questionStep >= 4 && !showScheduler && !showTeamForm && (
              <div className="flex justify-start">
                <OfficeFinalThankYou 
                  name={name} 
                  contactMethod={contactMethod} 
                />
              </div>
            )}
          </div>
        </div>
      </div>


<div
  className={`
    absolute inset-0 z-40
    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${showScheduler
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6 pointer-events-none"}
  `}
>

  <div className="w-full h-full px-[6vw] py-[4vh] flex flex-col">

      <div className="flex flex-1 items-center justify-center">
   <div
  className="
    relative
    w-full max-w-[1100px]
    h-[90vh]
    rounded-2xl overflow-hidden
    backdrop-blur-xl border border-white/20 shadow-lg
    bg-white/60
  "
>
  <iframe
    src="https://app.acuityscheduling.com/schedule.php?owner=37690830"
    title="Schedule Appointment"
    className="w-full h-full z-10"
    frameBorder="0"
    allow="payment"
  />

  <button
    type="button"
    onClick={() =>{ setShowScheduler(false);  setIntent(null);
  setQuestionStep(0);}}
    className="
      absolute right-12 top-24 font-canelathin text-white z-50"
  >
     Back to chat
  </button>
</div>
      </div>


  </div>
</div>

<div
  className={`
    absolute inset-0 z-50
    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${showTeamForm 
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-6 pointer-events-none"
    }
  `}
>
  <div className="w-full h-full overflow-y-auto">

    <div className="font-neuehaas45 w-full h-full">
      <div className="relative w-full h-full bg-gradient-to-br from-[#4E5353] via-[#505456] to-[#3E4243] text-[#EDE5D7] overflow-y-auto p-12 md:p-20 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
        

        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-noise z-[2]" />
        <div className="relative ">
                      <button
          type="button"
          onClick={() => {
  setShowTeamForm(false);
  setIntent(null);
  setQuestionStep(0);
}}
          className="absolute top-[1%] right-8 text-sm opacity-70 hover:opacity-100 
                     transition-opacity focus:outline-none rounded px-2 py-1 text-[#EDE5D7] z-10"
        >
          ✕ Close
        </button>
          <h2 className="text-[28px] font-canelathin mb-10">
            Start Your Application
            <span className="opacity-50 font-canelathin mx-2">—</span>
            <span className="text-[14px] tracking-wide opacity-70 align-middle font-neuehaas45 text-[#FEB44A]">
              For open positions at Frey Smiles
            </span>
          </h2>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTyping(true);
              setTimeout(() => {
                setTyping(false);
                setShowTeamForm(false);
              }, 900);
            }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8"
          >

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    Best way to reach you
                  </label>
                  <input
                    name="contact"
                    required
                    placeholder="Email or phone number"
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    High school graduation year
                  </label>
                  <select
                    name="gradYear"
                    required
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 40 }, (_, i) => {
                      const year = 2027 - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    Do you have experience working in dentistry or orthodontics?
                  </label>
                  <select
                    name="experience"
                    required
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="">Select</option>
                    <option value="no">No</option>
                    <option value="yes-dentistry">Yes — Dentistry</option>
                    <option value="yes-ortho">Yes — Orthodontics</option>
                    <option value="yes-both">Yes — Both</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    Position you're interested in
                  </label>
                  <select
                    name="role"
                    required
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="">Select role</option>
                    <option value="assistant">Clinical Assistant</option>
                    <option value="front-desk">Front Desk / Admin</option>
                    <option value="coordinator">Treatment Coordinator</option>
                    <option value="sterilization">Sterilization / Lab</option>
                    <option value="open">Open / Unsure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                    How did you hear about us?
                  </label>
                  <select
                    name="source"
                    required
                    className="w-full bg-transparent border border-white/20 rounded-lg 
                             px-4 py-3 text-[12px] leading-relaxed text-white/85
                             placeholder:text-white/35 tracking-[0.01em]
                             focus:outline-none focus:border-white/60 transition-colors"
                  >
                    <option value="">Select source</option>
                    <option value="website">Website</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend / Employee</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                  When would you be available to start?
                </label>
                <input
                  name="availability"
                  required
                  placeholder="Immediately, in 2 weeks, next month…"
                  className="text-[12px] leading-relaxed text-white/85
                           placeholder:text-white/35 opacity-70  
                           w-full bg-transparent border border-white/20 rounded-lg 
                           px-4 py-3 focus:outline-none focus:border-white/60
                           transition-colors"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                  Resume (PDF preferred)
                </label>
                <label className="flex items-center justify-center border border-white/30 
                                  rounded-lg px-6 py-4 cursor-pointer 
                                  hover:border-white transition-colors">
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                    }}
                  />
                  <span className="text-[12px] leading-relaxed text-white/85 opacity-70">
                    Click to add resume
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                  What interests you about working with our practice?
                </label>
                <textarea
                  name="motivation"
                  maxLength={300}
                  rows={5}
                  required
                  placeholder="max 300 characters"
                  className="text-[12px] leading-relaxed text-white/85
                           placeholder:text-white/35 opacity-70  
                           w-full bg-transparent border border-white/20 rounded-lg 
                           px-4 py-3 focus:outline-none focus:border-white/60 
                           resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm opacity-70 mb-2 min-h-[38px] text-[#FEB44A]">
                  Is there anything else you'd like us to know?
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Optional"
                  className="text-[12px] leading-relaxed text-white/85
                           placeholder:text-white/35 opacity-70  
                           w-full bg-transparent border border-white/20 rounded-lg 
                           px-4 py-3 focus:outline-none focus:border-white/60 
                           resize-none transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="border text-[13px] uppercase tracking-widest 
                           border-white/20 rounded-lg px-10 py-5 
                           transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                           hover:border-white/60"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )}
    </div>
  );
};



const UserQuestion = ({ question, setQuestion,  setModerationMessage, onSubmit, isSubmitted }) => {
  return (
    <div className="w-[420px]">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-canelathin text-neutral-700 mb-3">
          My question is...
        </div>
        <div className="relative">
          <input
            type="text"
            value={question}
              onChange={(e) => {
    setQuestion(e.target.value);
    setModerationMessage(null);
  }}

            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSubmitted) onSubmit();
            }}
            placeholder={isSubmitted ? "Question sent" : "Type your question here..."}
            disabled={isSubmitted}
            className={`
              w-full bg-neutral-100 rounded-full px-4 py-3 font-neuehaas45 text-[13px] outline-none
              ${isSubmitted 
                ? 'text-neutral-500 placeholder:text-neutral-400 cursor-default' 
                : 'placeholder:text-neutral-400'
              }
            `}
          />
          <button
            onClick={onSubmit}
            disabled={isSubmitted || !question.trim()}
            className={`
              absolute right-1 top-1/2 -translate-y-1/2 
              w-10 h-10 rounded-full 
              flex items-center justify-center text-lg
              transition-all duration-200
              ${isSubmitted || !question.trim()
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-white shadow hover:shadow-md text-neutral-900'
              }
            `}
          >
            {isSubmitted ? '✓' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};


const UserContact = ({ 
  contactMethod, 
  setContactMethod, 
  contactValue, 
  setContactValue, 
  onSubmit,
  isSubmitted 
}) => {
  const contactOptions = [
    { value: "email", label: "📧 Email", placeholder: "your@email.com" },
    { value: "phone", label: "📱 Phone", placeholder: "(123) 456-7890" },
    { value: "other", label: "🕊️ Other", placeholder: "Instagram, LinkedIn, etc." }
  ];

  return (
    <div className="w-[420px]">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-canelathin text-neutral-700 mb-3">
          You can reach me via...
        </div>
        
        <div className="flex gap-2 mb-4">
          {contactOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => !isSubmitted && setContactMethod(option.value)}
              disabled={isSubmitted}
              className={`
                flex-1 px-3 py-2 rounded-full text-[11px] font-neuehaas45
                transition-all duration-200
                ${isSubmitted && contactMethod === option.value
                  ? 'bg-neutral-900 text-white'
                  : contactMethod === option.value 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }
                ${isSubmitted ? 'cursor-default opacity-80' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={contactValue}
            onChange={(e) => !isSubmitted && setContactValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSubmitted) onSubmit();
            }}
            placeholder={isSubmitted 
              ? "Contact info saved!" 
              : (contactOptions.find(opt => opt.value === contactMethod)?.placeholder || "How can we reach you?")
            }
            disabled={isSubmitted}
            className={`
              w-full bg-neutral-100 rounded-full px-4 py-3 font-neuehaas45 text-[13px] outline-none
              ${isSubmitted 
                ? 'text-neutral-500 placeholder:text-neutral-400 cursor-default' 
                : 'placeholder:text-neutral-400'
              }
            `}
          />
          <button
            onClick={onSubmit}
            disabled={isSubmitted || !contactMethod || !contactValue.trim()}
            className={`
              absolute right-1 top-1/2 -translate-y-1/2 
              w-10 h-10 rounded-full 
              flex items-center justify-center text-lg
              transition-all duration-200
              ${isSubmitted || !contactMethod || !contactValue.trim()
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-white shadow hover:shadow-md text-neutral-900'
              }
            `}
          >
            {isSubmitted ? '✓' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};
const UserMessage = ({
  message,
  setMessage,
  email,
  setEmail,
  phone,
  setPhone,
  onSubmit,
  isSubmitted
}) => {
const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const phoneValid = phone.replace(/\D/g, "").length >= 10;

const isValid =
  message.trim() &&
  emailValid &&
  phoneValid;
  return (
    <div className="w-[520px]">
      <div className="bg-white rounded-[36px] p-8 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">

        <div className="text-sm font-canelathin text-neutral-700 mb-6">
          My message is…
        </div>


        <div className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            disabled={isSubmitted}
            className="w-full font-neuehaas45 bg-neutral-100 rounded-full px-5 py-3 text-[12px] outline-none"
          />

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            disabled={isSubmitted}
            className="w-full font-neuehaas45 bg-neutral-100 rounded-full px-5 py-3 text-[12px] outline-none"
          />
        </div>


        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            disabled={isSubmitted}
            placeholder={
              isSubmitted
                ? "Message sent"
                : "Type your message here..."
            }
            className="w-full font-neuehaas45 bg-neutral-100 rounded-[24px] px-5 py-4 text-[12px] outline-none resize-none"
          />

          <button
            onClick={onSubmit}
            disabled={!isValid || isSubmitted}
            className={`
              absolute right-3 bottom-3
              w-11 h-11 rounded-full
              flex items-center justify-center text-lg
              transition-all duration-200
              ${
                !isValid || isSubmitted
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-white shadow hover:shadow-md text-neutral-900"
              }
            `}
          >
            {isSubmitted ? "✓" : "→"}
          </button>
        </div>
      </div>
    </div>
  );
};


const OfficeContactPrompt = ({ name }) => {
  return (
    <div className="max-w-[520px]">
        <div className="text-sm font-canelathin text-neutral-500 mb-2">
        <strong className="text-neutral-800">Concierge</strong>, Frey Smiles
      </div>
      <div className="bg-white rounded-full px-6 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] font-neuehaas45 text-[13px] leading-snug">
        Got it{name ? `, ${name}` : ""}! 🤍<br />
        How should we reach you — email or phone?
      </div>
    </div>
  );
};



const OfficeFinalThankYou = ({ name, contactMethod }) => {
  const getContactEmoji = () => {
    switch(contactMethod) {
      case 'email': return '📧';
      case 'phone': return '📱';
      default: return '🕊️';
    }
  };

  return (
    <div className="max-w-[520px]">
        <div className="text-sm font-canelathin text-neutral-500 mb-2">
        <strong className="text-neutral-800">Concierge</strong>, Frey Smiles
      </div>
      <div className="bg-white rounded-full px-6 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] font-neuehaas45 text-[12px] leading-snug">
        Perfect{name ? `, ${name}` : ""}! {getContactEmoji()}<br />
        We'll be in touch within 24 hours. 👋
      </div>
    </div>
  );
};


const OfficeFollowUp = ({ intent, setIntent }) => {
const options = [
  {
    id: "book",
    label: "Book an appointment",
  },
  {
    id: "job",
    label: "Apply for a job",
  },
  {
    id: "ai",
    label: "Ask our AI Smile Assistant",
    description: "Instant answers about treatment"
  },
  {
    id: "message",
    label: "Send a message to the office",
    description: "For patient-specific or urgent questions"
  }
];

  return (
    <div className="w-[520px]">
      <div className="bg-white rounded-[36px] px-8 py-7 shadow-[0_18px_45px_rgba(0,0,0,0.06)]">
        <div className="text-[13px] font-neuehaas45 mb-6">
          I would like to…
        </div>
        <div className="font-neuehaas45 text-[13px] flex flex-col gap-5">
      {options.map((option) => (
  <button
    key={option.id}
    onClick={() => setIntent(option.id)}
    className="flex items-start justify-between text-left text-neutral-500 hover:text-neutral-800 transition-colors"
  >
    <div className="flex flex-col">
      <span>{option.label}</span>
      <span className="text-[11px] text-neutral-400 mt-1">
        {option.description}
      </span>
    </div>

    <span
      className={`
        w-4 h-4 rounded-full border flex items-center justify-center mt-1
        ${intent === option.id ? "border-neutral-900" : "border-neutral-300"}
      `}
    >
      {intent === option.id && (
        <span className="w-2 h-2 rounded-full bg-neutral-900" />
      )}
    </span>
  </button>
))}
        </div>
      </div>
    </div>
  );
};

const OfficeQuestionPrompt = () => {
  return (
    <div className="max-w-[520px]">
            <div className="text-sm font-canelathin text-neutral-500 mb-2">
        <strong className="text-neutral-800">Concierge</strong>, Frey Smiles
      </div>
      <div className="bg-white rounded-full px-6 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] font-neuehaas45
       text-[13px] leading-snug">
        What's on your mind?
      </div>
    </div>
  );
};

const OfficeGreeting = ({ name }) => {
  return (
    <div className="max-w-[520px]">
            <div className="text-sm font-canelathin text-neutral-500 mb-2">
        <strong className="text-neutral-800">Concierge</strong>, Frey Smiles
      </div>
      <div className="bg-white rounded-full px-6 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] font-neuehaas45 text-[13px] leading-snug">
        Hi{name ? `, ${name}` : ""}! 👽 
        <br />
        What can we do for you today?
      </div>
    </div>
  );
};

const OfficeMessage = ({ customText }) => {
  const text = customText ?? "Hey there 👋 what should we call you?";

  return (
    <div className="max-w-[520px]">
      <div className="text-sm font-canelathin text-neutral-500 mb-2">
        <strong className="text-neutral-800">Concierge</strong>, Frey Smiles
      </div>
      <div className="font-neuehaas45 bg-white rounded-full px-6 py-4 text-[13px] leading-snug shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
        {text}
      </div>
    </div>
  );
};



const UserResponse = ({ name, setName, onSubmit }) => {
  return (
    <div className="w-[420px]">
      <div className="bg-white rounded-[32px] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-canelathin text-neutral-700 mb-3">
          I go by...
        </div>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="Your name"
            className="w-full bg-neutral-100 rounded-full px-4 py-3 font-neuehaas45 text-[13px] outline-none placeholder:text-neutral-400"
          />
          <button
            onClick={onSubmit}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-lg"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

const OfficeTyping = () => {
  return (
    <div className="bg-white rounded-full px-6 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] flex gap-2 items-center">
      <Dot delay="0ms" />
      <Dot delay="150ms" />
      <Dot delay="300ms" />
    </div>
  );
};

const Dot = ({ delay }) => (
  <span
    className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
    style={{ animationDelay: delay }}
  />
);



class MousePointer {
  constructor() {
    this.x = window.innerWidth * 0.5;
    this.y = window.innerHeight * 0.5;
    this.normal = { x: 0, y: 0 };
    this.isDown = false;

    this._setupListeners();
  }

  _setupListeners() {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const target = document.querySelector(".l-canvas") || window;

    if (isTouch) {
      target.addEventListener("touchstart", (e) => this._handleStart(e));
      target.addEventListener("touchend", () => this._handleEnd());
      target.addEventListener("touchmove", (e) => this._handleMove(e), {
        passive: false,
      });
    } else {
      window.addEventListener("mousedown", (e) => this._handleStart(e));
      window.addEventListener("mouseup", () => this._handleEnd());
      window.addEventListener("mousemove", (e) => this._handleMove(e));
    }
  }

  _handleStart(e) {
    this.isDown = true;
    this._updatePosition(e);
  }

  _handleEnd() {
    this.isDown = false;
  }

  _handleMove(e) {
    this._updatePosition(e);
  }

  _updatePosition(e) {
    const pos = this._getEventPosition(e);
    this.x = pos.x;
    this.y = pos.y;

    this.normal.x = this.x / window.innerWidth;
    this.normal.y = this.y / window.innerHeight;
  }

  _getEventPosition(e) {
    if (e.touches) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }
}

const mousePointer = new MousePointer();

const map = (num, toMin, toMax, fromMin, fromMax) => {
  if (num <= fromMin) return toMin;
  if (num >= fromMax) return toMax;
  const p = (toMax - toMin) / (fromMax - fromMin);
  return (num - fromMin) * p + toMin;
};

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

     