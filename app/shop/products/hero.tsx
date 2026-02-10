"use client";
import { EffectComposer, Bloom, Selection, Select, ChromaticAberration } from "@react-three/postprocessing";
import { gsap } from "gsap";
import { CustomEase } from "gsap/all";
import Lenis from "@studio-freight/lenis";
import { useRef, useEffect, useMemo, useLayoutEffect, useState} from "react";
import { useFrame, extend, useThree, Canvas } from "@react-three/fiber";
import FlutedGlassEffect from "../../../utils/glass";
import { Vector2 } from "three";
import {
  OrbitControls,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  shaderMaterial,
  Center,
  useAnimations
} from "@react-three/drei";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
gsap.registerPlugin(SplitText, Physics2DPlugin, ScrollTrigger, CustomEase);

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      return;
    }

    const vsSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) / 2.0;
      }`;

    const fsSource = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
in vec2 v_texCoord;
out vec4 fragColor;

float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient) {
  vec2 uv = vec2(x.x + x.y*0.5, x.y);
  vec2 i0 = floor(uv);
  vec2 f0 = fract(uv);
  float cmp = step(f0.y, f0.x);
  vec2 o1 = vec2(cmp, 1.0-cmp);
  vec2 i1 = i0 + o1;
  vec2 i2 = i0 + vec2(1.0, 1.0);
  vec2 v0 = vec2(i0.x - i0.y * 0.5, i0.y);
  vec2 v1 = vec2(v0.x + o1.x - o1.y * 0.5, v0.y + o1.y);
  vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
  vec2 x0 = x - v0;
  vec2 x1 = x - v1;
  vec2 x2 = x - v2;
  vec3 iu, iv, xw, yw;
  if(any(greaterThan(period, vec2(0.0)))) {
    xw = vec3(v0.x, v1.x, v2.x);
    yw = vec3(v0.y, v1.y, v2.y);
    if(period.x > 0.0) xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
    if(period.y > 0.0) yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
    iu = floor(xw + 0.5*yw + 0.5);
    iv = floor(yw + 0.5);
  } else {
    iu = vec3(i0.x, i1.x, i2.x);
    iv = vec3(i0.y, i1.y, i2.y);
  }
  vec3 hash = mod(iu, 289.0);
  hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
  hash = mod((hash*34.0 + 10.0)*hash, 289.0);
  vec3 psi = hash * 0.07482 + alpha;
  vec3 gx = cos(psi);
  vec3 gy = sin(psi);
  vec2 g0 = vec2(gx.x, gy.x);
  vec2 g1 = vec2(gx.y, gy.y);
  vec2 g2 = vec2(gx.z, gy.z);
  vec3 w = 0.8 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2));
  w = max(w, 0.0);
  vec3 w2 = w*w;
  vec3 w4 = w2*w2;
  vec3 gdotx = vec3(dot(g0,x0), dot(g1,x1), dot(g2,x2));
  float n = dot(w4,gdotx);
  vec3 w3 = w2*w;
  vec3 dw = -8.0*w3*gdotx;
  vec2 dn0 = w4.x*g0 + dw.x*x0;
  vec2 dn1 = w4.y*g1 + dw.y*x1;
  vec2 dn2 = w4.z*g2 + dw.z*x2;
  gradient = 10.9*(dn0 + dn1 + dn2);
  return 10.9*n;
}

#define PI 3.1415926535897932384626433832795

float bounceOut(in float t) {
  const float a = 4.0 / 11.0;
  const float b = 8.0 / 11.0;
  const float c = 9.0 / 10.0;
  const float ca = 4356.0 / 361.0;
  const float cb = 35442.0 / 1805.0;
  const float cc = 16061.0 / 1805.0;
  float t2 = t * t;
  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72;
}
float bounceIn(in float t) { return 1.0 - bounceOut(1.0 - t); }

vec2 rot(vec2 v, float a){
  return mat2(cos(a), -sin(a), sin(a), cos(a)) * v;
}

void main() {
  vec2 fragCoord = v_texCoord * iResolution.xy;
  vec2 uv = fragCoord / iResolution.xy;
  vec2 st = uv * vec2(iResolution.x / iResolution.y, 1.0);

  st = rot(st, -PI / 10.0);

  vec2 mouse = iMouse.xy / iResolution.xy;


  vec2 gradient;
  float n = psrdnoise(st * 1.2, vec2(0.0), 0.2 * iTime + mouse.y * PI, gradient);


  float lines = cos((st.x * 0.3 + n * 0.25 + mouse.x + 0.2) * PI);


vec3 colorA = vec3(.92, .95, 1.0);     
vec3 colorB = vec3(0.4, 0.6, 1.0);   


  float wave = bounceIn(lines * 0.5 + 0.5);
float fade = smoothstep(0.0, 1.0, uv.x);


float blueBase = 0.15;

// final blend
float mixAmt = blueBase + wave * fade * 0.6;

vec3 col = mix(colorA, colorB, mixAmt);

  fragColor = vec4(col, 1.0);
}
`;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
      gl.viewport(0, 0, clientWidth, clientHeight);
      gl.uniform3f(iResLoc, clientWidth, clientHeight, 1.0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime = Date.now();
    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(iTimeLoc, currentTime);
      gl.uniform4f(iMouseLoc, 0.0, 0.0, 0.0, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

CustomEase.create("hop", "0.9, 0, 0.1, 1");
const Preloader = () => {
  const loaderRef = useRef(null);
  const svgRef = useRef(null);
  const counterTextRef = useRef(null);
  const heroBgRef = useRef(null);

  const animationRefs = useRef([]);

  useEffect(() => {
    requestAnimationFrame(() => {
      initializeAnimations();
    });

    return () => {
      animationRefs.current.forEach(anim => {
        if (anim && anim.kill) anim.kill();
      });
      animationRefs.current = [];
    };
  }, []);

  const initializeAnimations = () => {


    const textPaths = document.querySelectorAll(".wheelloader svg textPath");
    if (textPaths.length === 0) {
      return;
    }

    const startTextLengths = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("textLength"))
    );

    const startTextOffsets = Array.from(textPaths).map((tp) =>
      parseFloat(tp.getAttribute("startOffset"))
    );


    const targetTextLengths = [3800, 3600, 3400, 3200, 3000, 3200, 2600, 2400];
    const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];

    const maxOrbitRadius = orbitRadii[0];
    const maxAnimDuration = 1.25;
    const minAnimDuration = 1;

    textPaths.forEach((textPath, index) => {
      const animationDelay = (textPaths.length - 1 - index) * 0.1;
      const currentOrbitRadius = orbitRadii[index];
      
      const currentDuration =
        minAnimDuration +
        (currentOrbitRadius / maxOrbitRadius) * (maxAnimDuration - minAnimDuration);

      const pathLength = 2 * Math.PI * currentOrbitRadius * 3;
      const textLengthIncrease = targetTextLengths[index] - startTextLengths[index];
      const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
      const targetOffset = startTextOffsets[index] - offsetAdjustment;

      const anim = gsap.to(textPath, {
        attr: {
          textLength: targetTextLengths[index],
          startOffset: targetOffset + "%",
        },
        duration: currentDuration,
        delay: animationDelay,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0,
      });
      
      animationRefs.current.push(anim);
    });

    let loaderRotation = 0;

    function animateRotation() {
      const spinDirection = Math.random() < 0.5 ? 1 : -1;
      loaderRotation += 25 * spinDirection;

      const anim = gsap.to(svgRef.current, {
        rotation: loaderRotation,
        duration: 2,
        ease: "power2.inOut",
        onComplete: animateRotation,
      });
      
      animationRefs.current.push(anim);
    }

    animateRotation();

    const count = { value: 0 };
    
    const counterAnim = gsap.to(count, {
      value: 100,
      duration: 4,
      delay: 1,
      ease: "power1.out",
      onUpdate: function () {
        if (counterTextRef.current) {
          counterTextRef.current.textContent = Math.floor(count.value);
        }
      },
      onComplete: function () {
        const opacityAnim = gsap.to(".counter", {
          opacity: 0,
          duration: 0.5,
          delay: 1,
        });
        animationRefs.current.push(opacityAnim);
      },
    });
    
    animationRefs.current.push(counterAnim);

    const orbitTextElements = document.querySelectorAll(".orbit-text");
    if (orbitTextElements.length > 0) {
      gsap.set(orbitTextElements, { opacity: 0 });

      const orbitTextsReversed = Array.from(orbitTextElements).reverse();

      const fadeInAnim = gsap.to(orbitTextsReversed, {
        opacity: 1,
        duration: 0.75,
        stagger: 0.125,
        ease: "power1.out",
      });
      
      animationRefs.current.push(fadeInAnim);

      const fadeOutAnim = gsap.to(orbitTextsReversed, {
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        delay: 6,
        ease: "power1.out",
        onComplete: function () {
          const removeLoaderAnim = gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              if (loaderRef.current) {
                loaderRef.current.style.display = 'none';
              }
            },
          });
          
          animationRefs.current.push(removeLoaderAnim);

          const scaleBgAnim = gsap.to(".wheelhero-bg", {
            scale: 1,
            duration: 2,
            delay: -0.5,
            ease: "hop",
          });
          
          animationRefs.current.push(scaleBgAnim);

      const textRevealAnim = gsap.fromTo(
  ".hero-copy p .word",
  { y: "100%" },
  {
    y: 0,
    duration: 2,
    stagger: 0.1,
    ease: "hop",
  }
);
          animationRefs.current.push(textRevealAnim);
        },
      });
      
      animationRefs.current.push(fadeOutAnim);
    }
  };

  return (
    <>
<div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100svh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#0f0f0f",
    willChange: "opacity",
    zIndex: 9999,
  }} className="wheelloader" ref={loaderRef}>
  <svg 
    ref={svgRef}
    viewBox="-425 -425 1850 1850" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="wheelloader-orbit-1"
      d="M 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 500,-275 A 775,775 0 0,1 500,1275 A 775,775 0 0,1 499.99,-275"
    />
    <path
      id="wheelloader-orbit-2"
      d="M 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 500,-200 A 700,700 0 0,1 500,1200 A 700,700 0 0,1 499.99,-200"
    />
    <path
      id="wheelloader-orbit-3"
      d="M 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 500,-125 A 625,625 0 0,1 500,1125 A 625,625 0 0,1 499.99,-125"
    />
    <path
      id="wheelloader-orbit-4"
      d="M 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 500,-50 A 550,550 0 0,1 500,1050 A 550,550 0 0,1 499.99,-50"
    />
    <path
      id="wheelloader-orbit-5"
      d="M 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 500,25 A 475,475 0 0,1 500,975 A 475,475 0 0,1 499.99,25"
    />
    <path
      id="wheelloader-orbit-6"
      d="M 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 500,100 A 400,400 0 0,1 500,900 A 400,400 0 0,1 499.99,100"
    />
    <path
      id="wheelloader-orbit-7"
      d="M 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 500,175 A 325,325 0 0,1 500,825 A 325,325 0 0,1 499.99,175"
    />
    <path
      id="wheelloader-orbit-8"
      d="M 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 500,250 A 250,250 0 0,1 500,750 A 250,250 0 0,1 499.99,250"
    />
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-1" startOffset="30%" textLength="280">
        Shop
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-2" startOffset="31%" textLength="270">
        Your
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-3" startOffset="33%" textLength="300">
        Smile
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-4" startOffset="32%" textLength="280">
        Here
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-5" startOffset="30%" textLength="250">
        Buy
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-6" startOffset="31%" textLength="380">
        Something
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-7" startOffset="33%" textLength="180">
        Or
      </textPath>
    </text>
    <text className="orbit-text">
      <textPath href="#wheelloader-orbit-8" startOffset="32%" textLength="300">
        Don't
      </textPath>
    </text>
  </svg>

  <div className="counter">
    <p className="font-canelathin" ref={counterTextRef}>0</p>
  </div>
</div>
<section

  style={{
    position: "relative",
    width: "100%",
    height: "100svh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }}
>
<div
  className="wheelhero-bg"
  ref={heroBgRef}
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "50%",
    transform: "translate(-50%, -50%) scale(1.25)",
    overflow: "hidden",
  }}
>
  {/* <img
  src="/images/oval_desktop_top.svg"
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[95%] scale-[0.9] max-w-[1600px] h-auto z-1 pointer-events-none opacity-90"
  alt="top oval"
/>

<img
  src="/images/oval_desktop_bot.svg"
  className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-5.5%] scale-[0.9] max-w-[1600px] h-auto z-1 pointer-events-none opacity-90"
  alt="bottom oval"
/> */}

<video
  src="/videos/whitewaves.mp4"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }}
/>
</div>
      </section>
    </>
  );
};

const CONFIG = {
  color: "#fff",
  spread: 0.5,
  speed: 2,
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
uniform float uProgress;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSpread;
varying vec2 vUv;

float Hash(vec2 p) {
  vec3 p2 = vec3(p.xy, 1.0);
  return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f *= f * (3.0 - 2.0 * f);
  return mix(
    mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
    mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  v += noise(p * 1.0) * 0.5;
  v += noise(p * 2.0) * 0.25;
  v += noise(p * 4.0) * 0.125;
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
  
  float dissolveEdge = uv.y - uProgress * 1.2;
  

  float noiseScale = 25.0;
  float noiseValue = fbm(centeredUv * noiseScale);
  
  float d = dissolveEdge + noiseValue * uSpread;
  
  float pixelSize = 1.0 / uResolution.y;
  float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
  vec3 white = vec3(1.0);
  vec3 color = mix(uColor, white, 0.4);
  color *= 1.2;
  color = min(color, vec3(1.0));

  gl_FragColor = vec4(color, alpha);
}
`;

const HeroSection = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  const lenisRef = useRef(null);
  const animationIdRef = useRef(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const initThree = () => {
      const canvas = canvasRef.current;
      const hero = heroRef.current;
      
      if (!canvas || !hero) return;


      const scene = new THREE.Scene();
      sceneRef.current = scene;
      

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;
      

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      });
      rendererRef.current = renderer;

      const resize = () => {
        if (!hero) return;
        const width = hero.offsetWidth;
        const height = hero.offsetHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        if (materialRef.current) {
          materialRef.current.uniforms.uResolution.value.set(width, height);
        }
      };

      resize();


      const rgb = hexToRgb(CONFIG.color);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
          },
          uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
          uSpread: { value: CONFIG.spread },
        },
        transparent: true,
      });
      materialRef.current = material;


      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);


      const animate = () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uProgress.value = scrollProgressRef.current;
          renderer.render(scene, camera);
        }
        animationIdRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();
      };
    };

    const initLenis = () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenisRef.current = lenis;

      const raf = (time) => {
        lenis.raf(time);
        ScrollTrigger.update();
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenis.on('scroll', ScrollTrigger.update);

      lenis.on('scroll', ({ scroll }) => {
        if (!heroRef.current) return;
        const heroHeight = heroRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const maxScroll = Math.max(heroHeight - windowHeight, 0.1); // Prevent division by zero
        scrollProgressRef.current = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
      });

      return lenis;
    };

    const initTextAnimation = () => {
      if (!heroContentRef.current) return;

      const heroH2 = heroContentRef.current.querySelector('h2');
      if (!heroH2) return;

      const split = new SplitText(heroH2, { type: "words" });
      const words = split.words;

      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: heroContentRef.current,
        start: "top 25%",
        end: "bottom 100%",
        onUpdate: (self) => {
          const progress = self.progress;
          const totalWords = words.length;

          words.forEach((word, index) => {
            const wordProgress = index / totalWords;
            const nextWordProgress = (index + 1) / totalWords;

            let opacity = 0;

            if (progress >= nextWordProgress) {
              opacity = 1;
            } else if (progress >= wordProgress) {
              const fadeProgress =
                (progress - wordProgress) / (nextWordProgress - wordProgress);
              opacity = fadeProgress;
            }

            gsap.to(word, {
              opacity: opacity,
              duration: 0.1,
              overwrite: true,
            });
          });
        },
      });

      return split;
    };

    const init = () => {
      let lenisInstance;
      let splitInstance;

      try {
        initThree();
        lenisInstance = initLenis();
        splitInstance = initTextAnimation();
      } catch (error) {
        console.error('Initialization error:', error);
      }

      const handleResize = () => {
        if (rendererRef.current && heroRef.current) {
          const width = heroRef.current.offsetWidth;
          const height = heroRef.current.offsetHeight;
          rendererRef.current.setSize(width, height);
          rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          if (materialRef.current) {
            materialRef.current.uniforms.uResolution.value.set(width, height);
          }
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        
        if (lenisInstance) {
          lenisInstance.destroy();
        }
        
        if (splitInstance) {
          splitInstance.revert();
        }
        
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        if (meshRef.current && sceneRef.current) {
          sceneRef.current.remove(meshRef.current);
        }
        
        if (materialRef.current) {
          materialRef.current.dispose();
        }
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    };

    const cleanup = init();

    return cleanup;
  }, []); 

  return (
     <section className="scroll-effect__hero-section" ref={heroRef}>
      <div className="scroll-effect__hero-image">
           {/* <AnimatedBackground /> */}

        {/* <img 
          src="/images/3dprinting.png" 
          className="scroll-effect__hero-image-img"
        /> */}
      </div>

      <div className="scroll-effect__hero-header">
        <p className="scroll-effect__hero-description">
                  <Preloader />
        </p>
      </div>

      <canvas 
        className="scroll-effect__hero-canvas" 
        ref={canvasRef} 
      />

      <div className="scroll-effect__hero-content" ref={heroContentRef}>
{/* <CircleGridMouseFollow /> */}
     <h2 className="font-neuehaas35 scroll-effect__hero-subtitle">
          shop your smile. buy <span className="font-canelathin"> something</span> - or don't. just don't forget to floss
        </h2>
</div>
   

    </section>
  );
};



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
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;


    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    

    renderer.setClearColor(0x000000, 0); 
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;


    const width = 0.5;
    const geometry = new THREE.CircleGeometry(width, 64);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true, 
      opacity: 1.0
    });

    const meshes = [];
    const gridX = 8;
    const gridY = 8;
    const gap = 0.05;
    const widthWithGap = width + gap;

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
          i * widthWithGap * 2 - widthWithGap * (gridX - 1),
          j * widthWithGap * 2 - widthWithGap * (gridY - 1),
          0
        );
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
          ease: "power2.out"
        });
      }
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (meshesRef.current.length > 0) {
        meshesRef.current.forEach((mesh) => {
          mesh.lookAt(lerpedPositionRef.current);
        });
      }
      
      renderer.render(scene, camera);
    };

    animate();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'transparent',
        pointerEvents: 'all', 
        zIndex: 1 
      }}
    />
  );
};
const Marquee = () => {
  const text =
    "Reserve an appointment to experience our year end holiday courtesy of up to 700 dollars off full treatment";
  const repeatCount = 12;

  return (
    <div className="relative w-full overflow-hidden bg-[#F0EF59]">
      <div className="marquee">
<div className="marquee__group">
  {Array.from({ length: repeatCount }).map((_, i) => (
    <div
      key={`a-${i}`}
      className="flex items-center"
    >
      <span className="px-6 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide">
        {text}
      </span>


<span className="mx-4 text-[12px] font-light opacity-70">+</span>
    </div>
  ))}
</div>

<div className="marquee__group">
  {Array.from({ length: repeatCount }).map((_, i) => (
    <div
      key={`a-${i}`}
      className="flex items-center"
    >
      <span className="px-6 py-2 text-[12px] font-neuehaas45 whitespace-nowrap tracking-wide">
        {text}
      </span>


<span className="mx-4 text-[12px] font-light opacity-70">+</span>
    </div>
  ))}
</div>
      </div>
    </div>
  );
};


function DentalModel() {
  const { scene, animations } = useGLTF("/models/art_gallery_test.glb");
  const animatedRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, animatedRef);


  useEffect(() => {
    console.log("end mesh");
scene.traverse((child: any) => {
  if (!child.isMesh || !child.material) return;

  const mat = child.material as THREE.MeshStandardMaterial;

  if (mat.name.includes("Wall")) {
    mat.color.set("#f2f2f2");
    mat.roughness = 0.9;
  }

  if (mat.name.includes("Floor")) {
    mat.color.set("#e6e6e6");
    mat.roughness = 0.6;
  }

  if (mat.name.includes("Ceiling")) {
    mat.color.set("#fafafa");
    mat.roughness = 1.0;
  }

  mat.needsUpdate = true;
});

    console.log("end mesh");
  }, [scene]);


useEffect(() => {
  const tl = gsap.timeline({ delay: 1 });

  tl.from(".line-inner", {
    y: 100,
    skewY: 7,
    duration: 1.8,
    ease: "power4.out",
    stagger: 0.15
  });
}, []);
  useEffect(() => {
    if (!actions) return;

    const firstAction = Object.values(actions)[0];
    if (!firstAction) return;

    firstAction.reset();
    firstAction.setLoop(THREE.LoopRepeat, Infinity);
    firstAction.play();

    return () => firstAction.stop();
  }, [actions]);

  return (
    <group rotation={[0, 0, 0]} scale={1}>
      <group ref={animatedRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
const Hero: React.FC = () => {

  return (
    <section> 

      {/* <Marquee /> */}
<HeroSection />
{/* <div className="relative min-h-screen">

<section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen px-6 py-20">

<Canvas camera={{ position: [4, 3, 6], fov: 45 }}>
  <Environment files="/images/studio_small_03_4k.hdr" />


<ambientLight intensity={0.4} />

<directionalLight
  position={[5, 8, 5]}
  intensity={1.2}
  castShadow
/>

<directionalLight
  position={[-5, 4, -5]}
  intensity={0.6}
/>


  <DentalModel />

  <OrbitControls enableZoom={false} enablePan={false} />
</Canvas>

</section>
</div> */}
    </section>
  );
};

export default Hero;



