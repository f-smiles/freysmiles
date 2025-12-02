"use client";

import { Renderer, Program, Mesh, Plane, Uniform } from "wtc-gl";
import { Vec2, Mat2 } from "wtc-math";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Text, OrbitControls } from "@react-three/drei";
import { useThree, useFrame, extend, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { NormalBlending } from 'three';
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger, ScrambleTextPlugin, SplitText);

extend({ OrbitControls, EffectComposer });

const ParticleSystem = () => {
  const particlesCount = 20000;
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
        const factor = radius / dist;
        pos[i] *= factor;
        pos[i + 1] *= factor;
        pos[i + 2] *= factor;
      }

      const dx = mouseRef.current.x - pos[i];
      const dy = -mouseRef.current.y - pos[i + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repulsion = Math.max(0, 300 - distance) * 0.1;

      if (distance > 0) {
        pos[i] -= (dx / distance) * repulsion;
        pos[i + 1] -= (dy / distance) * repulsion;
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
    <span ref={scrambleRef} className={`scramble-text ${className || ""}`}>
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
// Created by inigo quilez - iq/2014
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
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
    // Convert to fragCoord like Shadertoy
    vec2 fragCoord = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
    vec2 uv = fragCoord / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv;
    tuv -= .5;
    // rotate with Noise
    float degree = noise(vec2(iTime*.1, tuv.x*tuv.y));
    tuv.y *= 1./ratio;
    tuv *= Rot(radians((degree-.5)*720.+75.));
    tuv.y *= ratio;
   
    // Wave warp with sin
    float frequency = 2.;
    float amplitude = 30.;
    float speed = iTime * 4.;
    tuv.x += sin(tuv.y*frequency+speed)/amplitude;
    tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
   
   
    // draw the image
    // Your 6 exact Frey gradient hex colors (adapted to the shader's color slots)
    vec3 colorWhite = vec3(0.9137, 0.8627, 0.8039); // #e9dccd (TOP, assigned to white)
    vec3 colorRed = vec3(0.9098, 0.7569, 0.6863); // #e8c1b0 (assigned to red)
    vec3 colorPurple = vec3(0.7686, 0.7216, 0.7882); // #c4b8c9 (assigned to purple)
    vec3 colorGreen = vec3(0.7176, 0.7490, 0.8471); // #b7bfd8 (assigned to green)
    vec3 colorBlue = vec3(0.6824, 0.7490, 0.8549); // #aebfda (BOTTOM, assigned to blue)
    vec3 colorYellow = vec3(0.8509, 0.7176, 0.7137); // #d9b7b6 (assigned to yellow)
   
    vec3 layer1 = mix(colorRed, colorYellow, S(-.6, .2, (tuv*Rot(radians(-5.))).x));
    layer1 = mix(layer1, colorWhite, S(-.6, .2, (tuv*Rot(radians(-5.))).x));
    layer1 = mix(layer1, colorPurple, S(-.2, .6, (tuv*Rot(radians(-5.))).x));
   
    vec3 layer2 = mix(colorRed, colorYellow, S(-.8, .2, (tuv*Rot(radians(-5.))).x));
    layer2 = mix(layer2, colorGreen, S(-.1, .9, (tuv*Rot(radians(-5.))).x));
    layer2 = mix(layer2, colorBlue, S(-.5, .5, (tuv*Rot(radians(-5.))).x));
   
    vec3 finalComp = mix(layer1, layer2, S(.7, -.5, tuv.y));
   
    vec3 col = finalComp;
   
    gl_FragColor = vec4(col, 1.0);
}
`;


const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Create hidden textarea fallback
    const el = document.createElement("textarea");
    el.style.position = "fixed";
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    el.style.zIndex = "-9999";
    textareaRef.current = el;
    document.body.appendChild(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const handleCopy = async () => {
    let success = false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn("Clipboard API failed:", err);
      }
    }

    if (!success && textareaRef.current) {
      const el = textareaRef.current;
      el.value = text;
      el.select();
      try {
        success = document.execCommand("copy");
      } catch (err) {
        console.warn("execCommand fallback failed:", err);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="
        relative px-5 py-2 rounded-full text-[12px] tracking-wider
        border-[0.2px] border-white transition-all duration-300
        text-white bg-transparent
        overflow-hidden
      "
    >

      <span
        className={`
          transition-opacity duration-300
          ${copied ? "opacity-0" : "opacity-100"}
        `}
      >
        {label}
      </span>

      <span
        className={`
          font-neuehaas45 absolute inset-0 flex items-center justify-center
          transition-opacity duration-300
          ${copied ? "opacity-100" : "opacity-0"}
        `}
      >
        COPIED
      </span>
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

  const starRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // useEffect(() => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const maxSize = Math.max(width, height);

  //   const starRect = starRef.current.getBoundingClientRect();
  //   const starWidth = starRect.width;
  //   const targetScale = (maxSize * 4) / starWidth;

  //   gsap.set(contentRef.current, { opacity: 0 });

  //   const tl = gsap.timeline({
  //     defaults: { duration: 2.8, ease: "power2.inOut" },
  //   });

  //   tl.set(starRef.current, {
  //     scale: 0.1,
  //     transformOrigin: "50% 50%",
  //   })
  //   .to(starRef.current, {
  //     scale: targetScale,
  //     duration: 2.5,
  //   })
  //   .to(contentRef.current, {
  //     opacity: 1,
  //     duration: 1.8,
  //   }, "-=2.6")
  //   .set(containerRef.current, { zIndex: -1 });
  // }, []);

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

  const sectionRef = useRef(null);
  const panelRef = useRef(null);

  // useEffect(() => {
  //   const ctx = gsap.context(() => {
  //     gsap.to(panelRef.current, {
  //       rotate: 7,
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top top",
  //         end: "+=1000",
  //         scrub: true,
  //         pin: true,
  //       },
  //     })
  //   }, sectionRef)

  //   return () => ctx.revert()
  // }, [])
const containerOneRef = useRef(null);
  const h1Ref = useRef(null);

useEffect(() => {
  if (!h1Ref.current) return;

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



  return (
    <>

<div className="flex flex-col lg:flex-row w-full h-screen">

<section
  className="relative z-10 w-full lg:w-1/2 h-[50vh] lg:h-full 
             flex flex-col items-center justify-center text-white p-8 overflow-hidden"
>

  <div className="absolute inset-0 -z-10">
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 1] }}
      className="w-full h-full"
    >
      <ShaderBackground />
    </Canvas>
  </div>

  <div className="pointer-events-none absolute inset-0 z-0">
    <div
      className="
        absolute 
        w-[400px] h-[400px]
        border border-white/35 
        rounded-full
        top-[100px]     
        right-[40px]   
      "
    />
    <div
      className="
        absolute 
        w-[450px] h-[450px]
        border border-white/30
        rounded-full
        bottom-[60px] 
        left-[0px]    
      "
    />
  </div>


  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="circle-loader relative">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`circle circle-${i}`} />
      ))}
    </div>
  </div>

  <div
    className="relative z-10 flex flex-col items-center overflow-hidden"
    ref={containerOneRef}
  >
    <h1
      className="lowercase text-[32px] lg:text-[34px] font-seaword text-center"
      ref={h1Ref}
    >
      Website Coming Soon
    </h1>
  </div>

<div
  className="
     text-[14px] lg:text-[16px]
    font-neuehaas35 leading-relaxed
    absolute top-[72%] right-8 z-10 text-left
    -translate-y-1/2
  "
>
  <div className="flex flex-col gap-3 items-start">
    <CopyButton 
      text="610-437-4748" 
      label="copy 610-437-4748" 
    />
    <CopyButton 
      text="info@freysmiles.com" 
      label="copy email" 
    />
  </div>
</div>
</section>

  <div className="acuity-font w-full lg:w-1/2 h-[50vh] lg:h-full flex items-center justify-center bg-white">
    <iframe
      src="https://app.acuityscheduling.com/schedule.php?owner=37690830"
      title="Schedule Appointment"
      width="100%"
      height="100%"
      frameBorder="0"
      allow="payment"
      className="border-0"
    ></iframe>
  </div>

</div>
{/* <section  className="relative w-full">
  <div style={{ 
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
  </div>

        <div className="relative z-10 ">
          
          <div
 
            className="flex justify-between w-full p-10 lg:p-20"
          >
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
                  <p className="text-xs text-[#9856D4] uppercase font-neueroman">
                    // Contact Us
                  </p>
                  <div>
                    <p className="text-[12px] mb-1 font-neueroman uppercase text-[#9856D4]">
                      <ScrambleText text="GENERAL" className="mr-10" />
                    </p>
                    <p className="text-[#9856D4] text-[12px] leading-snug font-khteka">
                      <ScrambleText text="info@freysmiles.com" />
                      <br />
                      <ScrambleText text="(610)437-4748" charsType="numbers" />
                    </p>
                  </div>

                  <div>
                    <p className="text-[12px] mb-1 font-neueroman uppercase text-[#9856D4]">
                      <ScrambleText text="ADDRESS" className="mr-10" />
                    </p>
                    <p className="text-[#9856D4] text-[12px] leading-tight font-khteka">
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

            <div className="acuity-font flex items-center justify-center w-1/2">
            <iframe src="https://app.acuityscheduling.com/schedule.php?owner=37685601&ref=embedded_csp" title="Schedule Appointment" width="100%" height="800" frameBorder="0" allow="payment"></iframe>
            
              <iframe
                src="https://app.acuityscheduling.com/schedule.php?owner=35912720"
                title="Schedule Appointment"
                className="w-full max-w-[820px] min-h-[90vh] "
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
<svg ref={starRef} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_116_153)"> <path d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z" fill="url(#paint0_linear_116_153)"/> </g> <defs> <linearGradient id="paint0_linear_116_153" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse"> <stop stop-color="#DF99F7"/> <stop offset="1" stop-color="#FFDBB0"/> </linearGradient> <clipPath id="clip0_116_153"> <rect width="200" height="200" fill="white"/> </clipPath> </defs> </svg>
</div> */}
    </>
  );
}
const SpiralShader = () => {
  const containerRef = useRef();
  const uniformsRef = useRef({});
  const requestIdRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() }
    };
    uniformsRef.current = uniforms;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++) {
          for(int i = 0; i < 5; i++) {
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    const animate = () => {
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
      requestIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestIdRef.current);
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
};
