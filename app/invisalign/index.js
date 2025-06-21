"use client";
import Copy from "@/utils/Copy.jsx";
import normalizeWheel from "normalize-wheel";
import {
  Renderer,
  Camera,
  Transform,
  Mesh,
  // Program,
  Texture,
  Plane,
} from "ogl";
import { Fluid } from "/utils/FluidCursorTemp.js";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import Splitting from "splitting";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  Suspense,
} from "react";
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

import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import * as THREE from "three";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { TextureLoader } from "three";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const RepeatText = ({ text = "FSF", totalLayers = 7 }) => {
  const containerRef = useRef();

  useEffect(() => {
    const containers = gsap.utils.toArray(".stack-word-layer");

    containers.forEach((el, i) => {
      const inner = el.querySelector(".stack-word-inner");

      gsap.fromTo(
        inner,
        { yPercent: 0 },
        {
          yPercent: 140,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: `top center`,
            end: "bottom top+=30%",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section
      className="relative w-full bg-[#FAFAFA] overflow-hidden"
      data-animation="stack-words"
      ref={containerRef}
    >
      {new Array(totalLayers).fill(0).map((_, i) => {
        const isLast = i === totalLayers - 1;

        return (
          <div
            key={i}
            className="overflow-hidden stack-word-layer"
            style={{
              height: isLast ? "20vw" : `${5 + i * 1.25}vw`,
              marginTop: i === 0 ? 0 : "-.5vw",
            }}
          >
            <div
              className="stack-word-inner will-change-transform flex justify-center overflow-visible"
              style={{ height: "100%" }}
            >
              <span
                className="text-[48vw] font-bold text-black leading-none block"
                style={{
                  transform: `translateY(calc(-65% + ${i * 1.5}px))`,
                }}
              >
                {text}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

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

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [viewport.height, size.height, yOffset]);

  return (
    <mesh ref={ref} position={[xOffset, 0, 0]} scale={[2.5, 2, 1]}>
      <planeGeometry args={[2, 3]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

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
    texture.colorSpace = THREE.SRGBColorSpace;
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
const MorphingSphere = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const groupRef = useRef(null);
  const leftSphereRef = useRef(null);
  const rightSphereRef = useRef(null);
  const materialsRef = useRef([]);
  const clockRef = useRef(new THREE.Clock());
  const scrollProgressRef = useRef(0);

  const settingsRef = useRef({
    lineCount: 35,
    lineWidth: 0.02,
    lineSharpness: 25.0,
    rimEffect: 0.8,
    rimIntensity: 3.0,
    rimWidth: 0.6,
    offset: 0.0,
    sphereDetail: 96,
    gap: 0.3,
    distortion: 0.4,
    twist: 1.2,
    useHighlights: true,
    highlightIntensity: 0.7,
    occlusion: 0.3,
    glowIntensity: 0.6,
    glowColor: new THREE.Color(0x3388ff),
    colorShift: 0.3,
    pulseSpeed: 0.5,
    lineColorA: new THREE.Color(0x88ccff),
    lineColorB: new THREE.Color(0x44aaff),
  });

  const helperFunctions = `
    float hash(float n) { 
      return fract(sin(n) * 43758.5453123); 
    }
    
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    
    float smootherstep(float edge0, float edge1, float x, float smoothness) {
      x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
      return pow(x, smoothness) * (smoothness + 1.0) - pow(x, smoothness + 1.0) * smoothness;
    }
    
    float contour(float val, float width, float sharpness) {
      float contourVal = abs(fract(val) - 0.5);
      return pow(smoothstep(0.0, width, contourVal), sharpness);
    }
    
    float fresnel(vec3 normal, vec3 viewDir, float power) {
      return pow(1.0 - abs(dot(normal, viewDir)), power);
    }
    
    // More complex noise functions for organic shapes
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f*f*(3.0-2.0*f);
      
      float n = i.x + i.y*157.0 + 113.0*i.z;
      return mix(
        mix(mix(hash(n+0.0), hash(n+1.0), f.x),
            mix(hash(n+157.0), hash(n+158.0), f.x), f.y),
        mix(mix(hash(n+113.0), hash(n+114.0), f.x),
            mix(hash(n+270.0), hash(n+271.0), f.x), f.y), f.z);
    }
    
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < octaves; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
        if (amplitude < 0.01) break;
      }
      
      return value;
    }
    
    // New: Worley noise for cellular patterns
    float worleyNoise(vec3 p) {
      float d = 1.0;
      for (int xo = -1; xo <= 1; xo++) {
        for (int yo = -1; yo <= 1; yo++) {
          for (int zo = -1; zo <= 1; zo++) {
            vec3 tp = floor(p) + vec3(xo, yo, zo);
            tp += hash(tp.x + hash(tp.y + hash(tp.z)));
            d = min(d, length(p - tp));
          }
        }
      }
      return d;
    }
    
    vec3 mixColor(vec3 colorA, vec3 colorB, float t) {
      return mix(colorA, colorB, t);
    }
  `;

  const vertexShader = `
    ${helperFunctions}
    
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vPosition;
    varying vec3 vOrigPosition;
    varying vec3 vWorldPosition;
    varying float vFresnel;
    varying float vElevation;
    varying float vDistortion;
    
    uniform float uRimEffect;
    uniform float uRimIntensity;
    uniform float uScrollProgress;
    uniform float uDistortion;
    uniform float uTwist;
    uniform float uTime;
    uniform float uPulseSpeed;
    uniform float uTentacleAmount;
    uniform float uSpikeAmount;
    
    vec3 twist(vec3 p, float strength) {
      float c = cos(strength * p.y);
      float s = sin(strength * p.y);
      mat2 m = mat2(c, -s, s, c);
      return vec3(m * p.xz, p.y).xzy;
    }
    
    float pulseEffect(float time, float speed) {
      return 0.5 * sin(time * speed) + 0.5;
    }
    
    // New: Create tentacle-like protrusions
    vec3 addTentacles(vec3 p, float amount) {
      if (amount < 0.001) return p;
      
      float tentacleNoise = worleyNoise(p * 3.0 + vec3(0.0, uTime * 0.1, 0.0));
      float tentacleMask = smoothstep(0.3, 0.7, tentacleNoise);
      vec3 tentacleDir = normalize(p + vec3(sin(p.y * 10.0), cos(p.z * 10.0), sin(p.x * 10.0)));
      return p + tentacleDir * tentacleMask * amount * 0.3;
    }
    
    // New: Create spike-like features
    vec3 addSpikes(vec3 p, float amount) {
      if (amount < 0.001) return p;
      
      float spikeNoise = noise(p * 10.0 + vec3(0.0, uTime * 0.05, 0.0));
      float spikeMask = step(0.7, spikeNoise);
      vec3 spikeDir = normalize(p);
      return p + spikeDir * spikeMask * amount * 0.2;
    }
    
    void main() {
      vOrigPosition = position;
      vec3 pos = position;
      
      // Apply initial organic deformation
      float organicNoise = fbm(pos * 2.0, 3) * 2.0 - 1.0;
      pos += normal * organicNoise * 0.2;
      
      // Add tentacles and spikes
      pos = addTentacles(pos, uTentacleAmount);
      pos = addSpikes(pos, uSpikeAmount);
      
      // Apply twist and distortion
      float pulse = pulseEffect(uTime, uPulseSpeed);
      float twistAmount = uTwist * (1.0 + pulse * 0.1);
      pos = twist(pos, twistAmount);
      
      float distortionAmount = uDistortion;
      float noiseValue = 0.0;
      
      if (distortionAmount > 0.0) {
        noiseValue = fbm(pos * 3.0 + vec3(0.0, uTime * 0.1, uScrollProgress * 10.0), 3) * 2.0 - 1.0;
        pos += normal * noiseValue * distortionAmount;
        vDistortion = noiseValue * distortionAmount;
      } else {
        vDistortion = 0.0;
      }
      
      // Calculate normals with all deformations
      vec3 transformedNormal = normalize(normal);
      float delta = 0.01;
      vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
      vec3 bitangent = normalize(cross(normal, tangent));
      
      vec3 posP1 = position + tangent * delta;
      vec3 posP2 = position + bitangent * delta;
      
      // Apply same deformations to neighbor points for normal calculation
      float organicNoiseP1 = fbm(posP1 * 2.0, 3) * 2.0 - 1.0;
      posP1 += normal * organicNoiseP1 * 0.2;
      posP1 = addTentacles(posP1, uTentacleAmount);
      posP1 = addSpikes(posP1, uSpikeAmount);
      posP1 = twist(posP1, twistAmount);
      
      float organicNoiseP2 = fbm(posP2 * 2.0, 3) * 2.0 - 1.0;
      posP2 += normal * organicNoiseP2 * 0.2;
      posP2 = addTentacles(posP2, uTentacleAmount);
      posP2 = addSpikes(posP2, uSpikeAmount);
      posP2 = twist(posP2, twistAmount);
      
      if (distortionAmount > 0.0) {
        float n1 = fbm(posP1 * 3.0 + vec3(0.0, uTime * 0.1, uScrollProgress * 10.0), 2) * 2.0 - 1.0;
        float n2 = fbm(posP2 * 3.0 + vec3(0.0, uTime * 0.1, uScrollProgress * 10.0), 2) * 2.0 - 1.0;
        posP1 += normal * n1 * distortionAmount;
        posP2 += normal * n2 * distortionAmount;
      }
      
      vec3 newTangent = normalize(posP1 - pos);
      vec3 newBitangent = normalize(posP2 - pos);
      transformedNormal = normalize(cross(newTangent, newBitangent));
      
      vNormal = normalMatrix * transformedNormal;
      vPosition = pos;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      vec3 worldCameraPos = cameraPosition;
      vec3 worldViewDir = normalize(worldCameraPos - vWorldPosition);
      vViewDir = worldViewDir;
      vFresnel = fresnel(normalize((modelMatrix * vec4(transformedNormal, 0.0)).xyz), worldViewDir, uRimIntensity * (1.0 + pulse * 0.2));
      vElevation = length(pos);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;


  const fragmentShader = `
  ${helperFunctions}

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPosition;
  varying vec3 vOrigPosition;
  varying vec3 vWorldPosition;
  varying float vFresnel;
  varying float vElevation;
  varying float vDistortion;
  
  uniform float uLineCount;
  uniform float uLineWidth;
  uniform float uLineSharpness;
  uniform float uRimEffect;
  uniform float uRimWidth;
  uniform float uOffset;
  uniform bool uUseHighlights;
  uniform float uHighlightIntensity;
  uniform float uOcclusion;
  uniform float uScrollProgress;
  uniform float uDistortion;
  uniform float uTime;
  uniform float uGlowIntensity;
  uniform vec3 uGlowColor;
  uniform float uColorShift;
  uniform vec3 uLineColorA;
  uniform vec3 uLineColorB;
  
  void main() {
    vec3 dir = normalize(vPosition);
    float elevation = vElevation;
  
    elevation += (vDistortion * 0.5 + dot(normalize(vNormal), dir) * 0.1 + 
                  sin(vPosition.x * 5.0 + uTime * 0.2) * 0.05 +
                  cos(vPosition.y * 7.0 + uTime * 0.15) * 0.05 +
                  sin(vPosition.z * 3.0 + uTime * 0.1) * 0.05);
  
    float timeOffset = sin(uTime * 0.3) * 0.1;
    float rimFactorRaw = vFresnel * uRimEffect;
    float rimFactor = clamp(rimFactorRaw, 0.0, 1.0); // less clamping now
  
    float gradient = 1.0 + pow(rimFactor, 2.0) * (5.0 + sin(uTime * 0.5) * 2.0);
  
    float contourValue;
  
    if (uScrollProgress < 0.33) {
      float noisePattern = fbm(vPosition * 2.0 + vec3(0.0, uTime * 0.1, 0.0), 2);
      contourValue = (elevation + uOffset + noisePattern * 0.3 + timeOffset) *
                     uLineCount * mix(1.0, gradient, uRimWidth);
    } else if (uScrollProgress < 0.66) {
      float localProgress = (uScrollProgress - 0.33) * 3.0;
      float pulseEffect = 0.3 + 0.2 * sin(uTime * 0.7);
      vec3 localPos = vPosition * (1.0 + sin(localProgress * 6.28) * pulseEffect);
      contourValue = length(localPos.xz) * uLineCount * (2.0 + sin(uTime * 0.3) * 0.5);
    } else {
      float localProgress = (uScrollProgress - 0.66) * 3.0;
      float noise1 = fbm(vPosition * 5.0 + vec3(uTime * 0.2, 0.0, uScrollProgress), 3);
      float noise2 = fbm(vPosition * 2.0 - vec3(0.0, uTime * 0.3, uScrollProgress * 3.0), 2);
      contourValue = (elevation * (noise1 * 0.7 + 0.3) + noise2 * 2.0) * uLineCount;
    }
  
    float lineVal = 1.0 - contour(contourValue, uLineWidth * (1.0 + sin(uTime * 0.4) * 0.15),
                                  uLineSharpness * (1.0 + cos(uTime * 0.2) * 0.3));
  
    lineVal = mix(lineVal, step(uLineWidth * (1.5 + sin(uTime * 0.5) * 0.5),
                                abs(fract(contourValue) - 0.5)),
                  rimFactor * 0.8); 
  

    vec3 lineColor = mix(vec3(0.7, 0.9, 1.4), vec3(0.3, 0.5, 1.0), sin(uTime * 0.3 + elevation * 5.0) * 0.5 + 0.5);
    vec3 color = lineColor * lineVal;
  
    //  Extra bloom from rim edges (like powder halo)
    float halo = smoothstep(0.2, 0.9, rimFactor);
    color += vec3(0.65, 0.8, 1.2) * halo * 0.1;
  

    // float ao = 1.0 - uOcclusion * (1.0 - dot(vNormal, vec3(0.0, 1.0, 0.0))) *
    //           (0.9 + 0.1 * sin(vPosition.y * 10.0 + uTime * 0.2));
    // color *= ao;
  
    //  Stronger glow
    float glowPulse = 0.9 + 0.2 * sin(uTime * 0.8);
    vec3 glowColor = vec3(0.5, 0.75, 1.4) * pow(rimFactor, 1.25) * uGlowIntensity * glowPulse;
    color += glowColor;
  
    //  Slight shimmer noise
    color *= (0.97 + hash(vPosition * 1000.0) * 0.1);
  
    // Clamp and output
    color = clamp(color, 0.0, 1.0);
    float alpha = lineVal * 0.7 + rimFactor * 0.35;
    gl_FragColor = vec4(color, alpha);
  }
  
  `;
  // const fragmentShader = `
  //   ${helperFunctions}
    
  //   varying vec3 vNormal;
  //   varying vec3 vViewDir;
  //   varying vec3 vPosition;
  //   varying vec3 vOrigPosition;
  //   varying vec3 vWorldPosition;
  //   varying float vFresnel;
  //   varying float vElevation;
  //   varying float vDistortion;
    
  //   uniform float uLineCount;
  //   uniform float uLineWidth;
  //   uniform float uLineSharpness;
  //   uniform float uRimEffect;
  //   uniform float uRimWidth;
  //   uniform float uOffset;
  //   uniform bool uUseHighlights;
  //   uniform float uHighlightIntensity;
  //   uniform float uOcclusion;
  //   uniform float uScrollProgress;
  //   uniform float uDistortion;
  //   uniform float uTime;
  //   uniform float uGlowIntensity;
  //   uniform vec3 uGlowColor;
  //   uniform float uColorShift;
  //   uniform vec3 uLineColorA;
  //   uniform vec3 uLineColorB;
    
  //   void main() {
  //     vec3 dir = normalize(vPosition);
  //     float elevation = vElevation;
      
  //     // Add organic variation based on distortion and position
  //     elevation += (vDistortion * 0.5 + dot(normalize(vNormal), dir) * 0.1 + 
  //                 sin(vPosition.x * 5.0 + uTime * 0.2) * 0.05 +
  //                 cos(vPosition.y * 7.0 + uTime * 0.15) * 0.05 +
  //                 sin(vPosition.z * 3.0 + uTime * 0.1) * 0.05);
      
  //     float timeOffset = sin(uTime * 0.3) * 0.1;
  //     float rimFactor = vFresnel * uRimEffect;
      
  //     // Dynamic gradient that changes with time
  //     float gradient = 1.0 + pow(rimFactor, 2.0) * (5.0 + sin(uTime * 0.5) * 2.0);
      
  //     float contourValue;
      
  //     // Enhanced contour patterns with more organic feel
  //     if (uScrollProgress < 0.33) {
  //       // Starting with more complex organic pattern
  //       float noisePattern = fbm(vPosition * 2.0 + vec3(0.0, uTime * 0.1, 0.0), 2);
  //       contourValue = (elevation + uOffset + noisePattern * 0.3 + timeOffset) * 
  //                     uLineCount * mix(1.0, gradient, uRimWidth);
  //     } else if (uScrollProgress < 0.66) {
  //       float localProgress = (uScrollProgress - 0.33) * 3.0;
  //       float pulseEffect = 0.3 + 0.2 * sin(uTime * 0.7);
  //       vec3 localPos = vPosition * (1.0 + sin(localProgress * 6.28) * pulseEffect);
  //       contourValue = length(localPos.xz) * uLineCount * (2.0 + sin(uTime * 0.3) * 0.5);
  //     } else {
  //       float localProgress = (uScrollProgress - 0.66) * 3.0;
  //       float noise1 = fbm(vPosition * 5.0 + vec3(uTime * 0.2, 0.0, uScrollProgress), 3);
  //       float noise2 = fbm(vPosition * 2.0 - vec3(0.0, uTime * 0.3, uScrollProgress * 3.0), 2);
  //       contourValue = (elevation * (noise1 * 0.7 + 0.3) + noise2 * 2.0) * uLineCount;
  //     }
      
  //     // Sharper lines with organic variation
  //     float lineVal = 1.0 - contour(contourValue, uLineWidth * (0.9 + sin(uTime * 0.4) * 0.1), 
  //                                  uLineSharpness * (1.0 + cos(uTime * 0.2) * 0.2));
      
  //     // Rim enhancement with organic variation
  //     lineVal = mix(lineVal, step(uLineWidth * (1.5 + sin(uTime * 0.5) * 0.5), 
  //                                abs(fract(contourValue) - 0.5)), 
  //                  rimFactor * (0.7 + sin(uTime * 0.6) * 0.1));
      
  //     // Dynamic color mixing with more variation
  //     float colorMix = 0.5 + 0.5 * sin(vElevation * 7.0 + uTime * 0.5 + vDistortion * 3.0);
  //     colorMix = mix(colorMix, rimFactor, uColorShift * (1.0 + sin(uTime * 0.4) * 0.2));
      
  //     vec3 lineColor = mixColor(uLineColorA, uLineColorB, colorMix);
      
  //     // Base color with organic highlights
  //     vec3 color = lineColor * lineVal;
      
  //     // Enhanced lighting effects
  //     if (uUseHighlights) {
  //       // Dynamic lighting direction
  //       vec3 lightDir = normalize(vec3(
  //         sin(uScrollProgress * 6.28 + uTime * 0.3), 
  //         0.8 + 0.2 * cos(uTime * 0.4),
  //         cos(uScrollProgress * 6.28 + uTime * 0.25)
  //       ));
        
  //       // Specular highlight with organic variation
  //       vec3 halfVector = normalize(lightDir + vViewDir);
  //       float specular = pow(max(0.0, dot(vNormal, halfVector)), 
  //                    16.0 + sin(uTime * 0.5) * 4.0);
        
  //       color += vec3(specular) * lineVal * uHighlightIntensity * (1.0 + sin(uTime * 0.7) * 0.2);
        
  //       // Organic ambient occlusion
  //       float ao = 1.0 - uOcclusion * (1.0 - dot(vNormal, vec3(0.0, 1.0, 0.0))) * 
  //                 (0.9 + 0.1 * sin(vPosition.y * 10.0 + uTime * 0.2));
  //       color *= ao;
  //     }
      
  //     // Organic noise to break up perfection
  //     color *= (0.95 + hash(vPosition * 500.0) * 0.1);
      
  //     // Enhanced glow with pulse effect
  //     float glowPulse = 0.8 + 0.2 * sin(uTime * 0.8);
  //     vec3 glowColor = uGlowColor * pow(rimFactor, 1.5) * uGlowIntensity * glowPulse;
  //     color += glowColor;
      
  //     // Alpha with organic variation
  //     float alpha = lineVal * (0.7 + 0.1 * sin(uTime * 0.9)) + 
  //                  rimFactor * (0.3 + 0.1 * cos(uTime * 0.6));
      
  //     gl_FragColor = vec4(color, alpha);
  //   }
  // `;

  const createGeometry = () => {
    if (leftSphereRef.current) {
      groupRef.current.remove(leftSphereRef.current);
      groupRef.current.remove(rightSphereRef.current);
    }

    const sphereDetail = parseInt(settingsRef.current.sphereDetail);
    const radius = 1;
    const leftGeometry = new THREE.SphereGeometry(
      radius,
      sphereDetail,
      sphereDetail,
      0,
      Math.PI,
      0,
      Math.PI
    );

    const rightGeometry = new THREE.SphereGeometry(
      radius,
      sphereDetail,
      sphereDetail,
      Math.PI,
      Math.PI,
      0,
      Math.PI
    );

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uLineCount: { value: settingsRef.current.lineCount },
        uLineWidth: { value: settingsRef.current.lineWidth },
        uLineSharpness: { value: settingsRef.current.lineSharpness },
        uRimEffect: { value: settingsRef.current.rimEffect },
        uRimIntensity: { value: settingsRef.current.rimIntensity },
        uRimWidth: { value: settingsRef.current.rimWidth },
        uOffset: { value: settingsRef.current.offset },
        uUseHighlights: { value: settingsRef.current.useHighlights },
        uHighlightIntensity: { value: settingsRef.current.highlightIntensity },
        uOcclusion: { value: settingsRef.current.occlusion },
        uScrollProgress: { value: 0.0 },
        uDistortion: { value: 0.5 },
        uTwist: { value: 1.5 },
        uTime: { value: 0.0 },
        uGlowIntensity: { value: 0.7 },
        uGlowColor: {
          value: new THREE.Color(
            0.2 + 0.4 * 0.3,
            0.5 + 0.4 * 0.2,
            0.8 + 0.4 * 0.1
          ),
        },
        uColorShift: { value: 0.4 },
        uPulseSpeed: { value: settingsRef.current.pulseSpeed },
        uLineColorA: { value: settingsRef.current.lineColorA },
        uLineColorB: { value: settingsRef.current.lineColorB },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const leftMaterial = material.clone();
    const rightMaterial = material.clone();

    leftSphereRef.current = new THREE.Mesh(leftGeometry, leftMaterial);
    rightSphereRef.current = new THREE.Mesh(rightGeometry, rightMaterial);

    const gap = 0.3 / 2;
    leftSphereRef.current.position.x = -gap;
    rightSphereRef.current.position.x = gap;

    groupRef.current.add(leftSphereRef.current);
    groupRef.current.add(rightSphereRef.current);

    materialsRef.current = [leftMaterial, rightMaterial];

    groupRef.current.rotation.x = 0.1;
    groupRef.current.rotation.y = Math.PI * 0.2;
  };

  const containerRef = useRef(null);
  const isActiveRef = useRef(false);
  const setupScrollAnimations = () => {
    scrollProgressRef.current = 0;
    updateForScrollProgress(0);

    ScrollTrigger.create({
      trigger: "section",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        updateForScrollProgress(self.progress);
      },
    });
  };

  const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clockRef.current.getElapsedTime();
    materialsRef.current.forEach((mat) => {
      mat.uniforms.uTime.value = elapsedTime;
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const updateForScrollProgress = (progress) => {
    materialsRef.current.forEach((mat) => {
      mat.uniforms.uScrollProgress.value = progress;
    });
  

    if (scrollProgressRef.current < 0.25) {
      const localProgress = scrollProgressRef.current * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.3, 0.4, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(0.5, 0.4, localProgress);
      settingsRef.current.twist = gsap.utils.interpolate(1.5, 1.8, localProgress);
      settingsRef.current.lineCount = gsap.utils.interpolate(35, 45, localProgress);
      settingsRef.current.lineWidth = gsap.utils.interpolate(0.02, 0.025, localProgress);
      settingsRef.current.colorShift = gsap.utils.interpolate(0.4, 0.5, localProgress);
      settingsRef.current.glowIntensity = gsap.utils.interpolate(0.7, 0.6, localProgress);
  
      groupRef.current.rotation.x = gsap.utils.interpolate(0.1, 0.3, localProgress);
      groupRef.current.rotation.y = gsap.utils.interpolate(Math.PI * 0.2, Math.PI * 0.5, localProgress);
  
    } else if (scrollProgressRef.current < 0.5) {
      const localProgress = (scrollProgressRef.current - 0.25) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.4, 0.35, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(0.4, 0.5, localProgress);
      settingsRef.current.twist = gsap.utils.interpolate(1.8, 1.6, localProgress);
      settingsRef.current.lineCount = gsap.utils.interpolate(45, 50, localProgress);
      settingsRef.current.lineWidth = gsap.utils.interpolate(0.025, 0.03, localProgress);
      settingsRef.current.colorShift = gsap.utils.interpolate(0.5, 0.7, localProgress);
      settingsRef.current.glowIntensity = gsap.utils.interpolate(0.6, 0.7, localProgress);
  
      groupRef.current.rotation.x = gsap.utils.interpolate(0.3, Math.PI * 0.25, localProgress);
      groupRef.current.rotation.y = gsap.utils.interpolate(Math.PI * 0.5, Math.PI * 0.75, localProgress);
  
    } else if (scrollProgressRef.current < 0.75) {
      const localProgress = (scrollProgressRef.current - 0.5) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.35, 0.3, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(0.5, 0.4, localProgress);
      settingsRef.current.twist = gsap.utils.interpolate(1.6, 1.4, localProgress);
      settingsRef.current.lineCount = gsap.utils.interpolate(50, 55, localProgress);
      settingsRef.current.lineWidth = gsap.utils.interpolate(0.03, 0.035, localProgress);
      settingsRef.current.colorShift = gsap.utils.interpolate(0.7, 0.8, localProgress);
      settingsRef.current.glowIntensity = gsap.utils.interpolate(0.7, 0.8, localProgress);
  
      groupRef.current.rotation.x = Math.PI * 0.25;
      groupRef.current.rotation.y = gsap.utils.interpolate(Math.PI * 0.75, Math.PI, localProgress);
  
    } else {
      const localProgress = (scrollProgressRef.current - 0.75) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.3, 0.25, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(0.4, 0.35, localProgress);
      settingsRef.current.twist = gsap.utils.interpolate(1.4, 1.2, localProgress); 
      settingsRef.current.lineCount = gsap.utils.interpolate(55, 60, localProgress); 
      settingsRef.current.lineWidth = gsap.utils.interpolate(0.035, 0.04, localProgress); 
      settingsRef.current.colorShift = gsap.utils.interpolate(0.8, 0.9, localProgress);
      settingsRef.current.glowIntensity = gsap.utils.interpolate(0.8, 0.9, localProgress);
  
      groupRef.current.rotation.x = gsap.utils.interpolate(Math.PI * 0.25, 0.1, localProgress); 
      groupRef.current.rotation.y = gsap.utils.interpolate(Math.PI, Math.PI * 1.5, localProgress); 
    }
  

    materialsRef.current.forEach((mat) => {
      mat.uniforms.uDistortion.value = settingsRef.current.distortion;
      mat.uniforms.uTwist.value = settingsRef.current.twist;
      mat.uniforms.uLineCount.value = settingsRef.current.lineCount;
      mat.uniforms.uLineWidth.value = settingsRef.current.lineWidth;
      mat.uniforms.uColorShift.value = settingsRef.current.colorShift;
      mat.uniforms.uGlowIntensity.value = settingsRef.current.glowIntensity;
      mat.uniforms.uGlowColor.value = new THREE.Color(
        0.2 + settingsRef.current.colorShift * 0.3,
        0.5 + settingsRef.current.colorShift * 0.2,
        0.8 + settingsRef.current.colorShift * 0.1
      );
    });
  
    if (leftSphereRef.current && rightSphereRef.current) {
      const gap = settingsRef.current.gap / 2;
      leftSphereRef.current.position.x = -gap;
      rightSphereRef.current.position.x = gap;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3.5);
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    group.rotation.y = Math.PI * 0.2;
    group.rotation.x = Math.PI * 0.1;

    createGeometry();
    setupScrollAnimations();
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer) renderer.dispose();
      if (scene) {
        scene.traverse((object) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (object.material.isShaderMaterial) {
                object.material.dispose();
              }
            }
          }
        });
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="webgl w-full h-full" />
    </>
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

  const controls = useAnimation();

  const handleHover = (index) => {
    controls.start({
      y: `${index * 100}%`,
      transition: { type: "tween", duration: 0.3 },
    });
  };

  const [isVisible, setIsVisible] = useState(false);

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

  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { scale: 1 },
      {
        scale: 0.7,
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
        transformOrigin: "center center",
        ease: "none",
      }
    );
  }, []);

  const containerRef = useRef();
  const lineRefs = useRef([]);
  const textRefs = useRef([]);
  const sectionLineRefs = useRef([]);

  const addToLineRefs = (el) => el && lineRefs.current.push(el);
  const addToTextRefs = (el) => el && textRefs.current.push(el);
  const addToSectionLineRefs = (el) => el && sectionLineRefs.current.push(el);

  useEffect(() => {
    gsap.set([...lineRefs.current, ...sectionLineRefs.current], {
      scaleX: 0,
      transformOrigin: "left center",
    });
    gsap.set(textRefs.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    sectionLineRefs.current.forEach((line) => {
      tl.to(
        line,
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
        },
        0
      );
    });

    lineRefs.current.forEach((line, i) => {
      tl.to(
        line,
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0.5 + i * 0.15
      );
    });

    textRefs.current.forEach((text, i) => {
      tl.to(
        text,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        0.7 + i * 0.07
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>

      {/* <div className=" font-neuehaas35 min-h-screen px-8 pt-32 relative text-black ">


        <Canvas
          className="pointer-events-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
          }}
        >
          <Suspense fallback={null}>
            <DistortedImage
              imageSrc="/images/invisalign_mockup_3.jpg"
              xOffset={-3.5}
              yOffset={0}
            />
            <DistortedImage
              imageSrc="/images/invisalign_mockup_3.jpg"
              xOffset={3.5}
              yOffset={-2.5}
            />
            <EffectComposer>
              <Fluid backgroundColor="#FFF" />
            </EffectComposer>
          </Suspense>
        </Canvas>
     
      </div> */}
      <div className="relative">
      <div className="fixed top-[20vh] transform  z-0 w-[300px] h-[300px]">
  <MorphingSphere />
</div>

        <section className="mt-[20vh] z-10 relative min-h-screen">

            <Copy>
              <div className="relative ml-10 text-[26px] sm:text-[26px] leading-tight text-black font-neuehaasdisplaythin">
                <span className="font-normal">Our doctors </span>{" "}
                <span className="font-light">have treated</span>{" "}
                <span className="font-saolitalic">thousands</span>{" "}
                <span className="font-medium">of patients</span> <br />
                <span className="font-normal">with the </span>{" "}
                <span className="font-light font-saolitalic">industry's leading</span>{" "}
                <span className="font-light ">appliance</span>{" "}
                <span className="font-normal">system.</span>{" "}
              </div>
            </Copy>
            <div
              ref={containerRef}
              className="mt-[10vh] w-full max-w-7xl mx-auto text-[11px] relative"
            >
              <div
                ref={addToSectionLineRefs}
                className="absolute top-0 left-0 right-0 h-[1px] bg-gray-300 origin-left"
              />

              <div className="font-khteka flex border-b border-gray-300">
                <div className="w-1/3 p-5">
                  <p className="uppercase font-khteka text-[13px]">Accolades</p>
                </div>
                <div className="uppercase flex-1 flex flex-col justify-center">
                  {[
                    ["6x Winner Best Orthodontist", "Best of the Valley"],
                    [
                      "5x Winner Best Orthodontist",
                      "Readers' Choice The Morning Call",
                    ],
                    ["Nationally Recognized Top Orthodontist", "Top Dentists"],
                  ].map(([left, right], i) => (
                    <div
                      key={i}
                      className="flex py-4 items-center px-5 relative"
                    >
                      {i < 2 && (
                        <div
                          ref={addToLineRefs}
                          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-300 origin-left"
                        />
                      )}
                      <div ref={addToTextRefs} className="flex-1">
                        {left}
                      </div>
                      <div
                        ref={addToTextRefs}
                        className="w-[350px] text-left text-black pr-6"
                      >
                        {right}
                      </div>
                      <div ref={addToTextRefs} className="w-[80px] text-right">
                        DATE
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="font-khteka flex">
                <div className="w-1/3 p-5">
                  <p className="uppercase font-khteka text-[13px]">Expertise</p>
                </div>
                <div className="uppercase flex-1 flex flex-col justify-center">
                  {[
                    ["INVISALIGN", "25+ Years of Experience"],
                    ["Invisalign Teen", "5000+ Cases Treated"],
                    ["Diamond Plus", "Top 1% of All Providers"],
                  ].map(([left, right], i) => (
                    <div
                      key={i}
                      className="flex py-4 items-center px-5 relative"
                    >
                      {i < 2 && (
                        <div
                          ref={addToLineRefs}
                          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-300 origin-left"
                        />
                      )}
                      <div ref={addToTextRefs} className="flex-1">
                        {left}
                      </div>
                      <div
                        ref={addToTextRefs}
                        className="w-[350px] text-left text-black pr-6"
                      >
                        {right}
                      </div>
                      <div ref={addToTextRefs} className="w-[80px] text-right">
                        DATE
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                ref={addToSectionLineRefs}
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-300 origin-left"
              />
            </div>

            <div className="flex justify-center items-center px-4 sm:px-8 lg:px-12 py-10">
              <img
                ref={imageRef}
                src="/images/ipadmockup.png"
                className="max-w-[90%] sm:max-w-[90%] lg:max-w-[90%] h-auto"
                alt="Man holding laptop"
              />
            </div>
     
          <div className="relative min-h-screen">
            <div className="flex flex-col items-center justify-center">
              <h4 className=" text-sm mb-6 font-neuehaas35">Synopsis</h4>
              <Copy>
                <p className="font-neuehaas45 text-[18px] leading-[1.2] max-w-[650px] mb-20">
                  Trusted by millions around the world, Invisalign is a clear,
                  comfortable, and confident choice for straightening smiles.
                  We've proudly ranked among the top 1% of certified Invisalign
                  providers nationwide — every year since 2000.
                </p>
              </Copy>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    01
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Teeth Remain Completely Visible
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  Unlike braces, Invisalign doesn’t obscure your smile with
                  wires or brackets. That means early progress is easier to see
                  and appreciate.
                </p>
              </div>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    02
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Designed for Comfort
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  Invisalign aligners are crafted using one of the most advanced
                  and researched fabrication processes in the world. Each
                  aligner is engineered to fit complex tooth arrangements with
                  precision and is continuously updated to maintain accuracy
                  throughout the course of treatment.
                </p>
              </div>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    03
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Tailored to You
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  While our team has extensive expertise in placing braces,
                  traditional brackets are ultimately prefabricated based on
                  average tooth morphology. With Invisalign, your treatment
                  begins in our office using advanced 3D scanning technology to
                  capture the precise contours of your teeth. From this data,
                  our doctors develop a fully customized plan, guiding a
                  sequence of aligners engineered to move your teeth into
                  alignment with exacting precision.
                </p>
              </div>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    04
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Ease of Cleaning
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  Traditional braces complicate even the most basic oral
                  hygiene. With Invisalign, your aligners come off
                  completely—allowing unrestricted access for brushing and
                  flossing around every surface of every tooth.
                </p>
              </div>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    05
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Removable & Flexible
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  No wires or brackets. No dietary limitations. No
                  interruptions. Just a treatment that fits your life.
                </p>
              </div>
            </div>
            <div className="relative py-12">
              <div className="relative z-10 px-10">
                <div className="flex items-center justify-start">
                  <div className="text-[#999] text-sm font-neuehaas45 mr-4">
                    06
                  </div>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center px-10 mt-8 gap-6">
                <h2 className="md:w-1/2 text-[20px] font-neuehaas45 text-black text-center md:text-left">
                  Treatment Duration
                </h2>
                <p className="md:w-1/2 text-[16px] max-w-[400px] font-neuehaas45 leading-[1.4] text-center md:text-left">
                  Because Invisalign is precisely engineered to your exact tooth
                  morphology, movement in all three dimensions can begin as
                  early as the first week. This level of control allows for
                  greater efficiency—and in many cases, a shorter overall
                  treatment time compared to braces.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-6 p-6">
              <img
                src="/images/manholdinglaptop.png"
                className="max-w-[45%] h-auto rounded-md"
              />
              <img
                src="/images/adobetest.png"
                className="max-w-[45%] h-auto rounded-md"
              />
            </div>

            <div className="font-neuehaas45 flex justify-center items-center mx-auto max-w-[650px] relative min-h-screen">
              The power of Invisalign lies not just in the clear aligners, but
              in the precision of digitally guided treatment planning. Each case
              is custom-designed by our doctors using comprehensive,
              board-eligible diagnostic records. It represents a departure from
              conventional orthodontics—never before have we been able to
              prescribe such targeted and controlled tooth movements.
            </div>
            <div className="font-neuehaas45 flex justify-center items-center mx-auto max-w-[650px] relative min-h-screen">
              While mail-order aligner companies may promise convenience, they
              often overlook critical aspects of dental malocclusion—such as
              bite alignment, arch coordination, and skeletal discrepancies.
              Additionally, these systems lack high-quality diagnostic records,
              bypass 3D imaging, and rely on generic assumptions with remote
              planning by providers you’ll never meet. You won’t have the
              opportunity to choose who oversees your treatment or assess their
              qualifications. These systems often produce oversimplified plans
              that can result in more complex issues down the line.
            </div>
            <div className=" font-neuehaas35 min-h-screen px-8 pt-32 relative text-black ">
              <div className="flex justify-center items-center text-center text-[30px] pb-20">
                Introducing two treatment approaches, built around your needs
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-8xl w-full">
                  <div className="flex flex-col items-center gap-[10px]">
                    <div className="flex flex-col items-center justify-center relative w-full overflow-hidden px-0 py-[70px] min-h-fit rounded-[8px] border border-solid border-[rgba(240,240,240)] bg-[rgba(240,240,240,0.19)] opacity-100">
                      <div className="relative w-[86%] aspect-[1.6] overflow-hidden rounded-[8px] border border-solid border-[rgb(240,240,240)]">
                        <img
                          src="/images/invisbox.png"
                          alt="Frysta"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="font-neuehaas45 flex items-center justify-between w-[100%]">
                      <div>
                        <h3 className="text-[16px]  text-gray-800">
                          Flex Plan
                        </h3>
                        <p className="font-neuehaas45 text-sm text-gray-500 max-w-5xl">
                          Designed for adult patients seeking a streamlined
                          treatment with fewer in-office visits—resulting in a
                          lower overall investment. Includes 6–8 total
                          appointments spaced for optimal efficiency, without
                          compromising results. These cases span 8–14 months and
                          must meet certain clinical qualifications. Treatment
                          includes two sets of aligners. Every qualifying
                          patient can expect results that are satisfactory to
                          both them and the treating doctor.
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-[10px]">
                    <div className="flex flex-col items-center justify-center relative w-full overflow-hidden px-0 py-[70px] min-h-fit rounded-[8px] border border-solid border-[rgba(240,240,240)] bg-[rgba(240,240,240,0.19)] opacity-100">
                      <div className="relative w-[86%] aspect-[1.6] overflow-hidden rounded-[8px] border border-solid border-[rgb(240,240,240)]">
                        <img
                          src="/images/invisalign_mockup_3.jpg"
                          alt="Folium"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="font-neuehaas45 flex items-center justify-between w-[100%]">
                      <div>
                        <h3 className="text-[16px]  text-gray-800">
                          Unlimited Smiles
                        </h3>
                        <p className="font-neuehaas45 text-sm text-gray-500">
                          Offers more hands-on support throughout your smile
                          journey, with extended appointment access and tailored
                          adjustments at every step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full flex flex-col min-h-screen ">
          {/* 
            <div className="relative">
          
              <RepeatText />
            </div> */}
        </section>
        {/* <div className="min-h-screen relative">
            <div className="font-neuehaas45 perspective-1500 text-[#0414EA]">
              <div className="flip-wrapper">
                <div className="flip-container">
                  <div className="face front">Teeth remain completely visible</div>
                  <div className="face back">
                    Initial results are more readily apparent than with braces. Wires and brackets obscure positioning you can not only view results faster. 
                  </div>
                </div>

                <div className="flip-container">
                  <div className="face front">Designed for Comfort</div>
                  <div className="face back">
                   Invisalign manufacturing is the most researched and advanced fabrication process in the world. Your aligners will accurately fit any complex tooth arrangement and will continue to through the course of treatment. 
                  </div>
                </div>

                <div className="flip-container">
                  <div className="face front">Tailored to You</div>
                  <div className="face back">
                    Although our doctors and our team are experts at placing braces, the braces are ultimately prefabricated based on average tooth morphology. Invisalign is made specifically to your tooth shape with our advanced 3d scanners. Your journey starts with advanced 3D imaging. From there,
                    doctor-personalized plans guide a series of custom
                    aligners—engineered to move your teeth perfectly into place.
                  </div>
                </div>

                <div className="flip-container">
                  <div className="face front">Removable & Flexible</div>
                  <div className="face back">No wires. No food limitations. </div>
                </div>

                <div className="flip-container">
                  <div className="face front">Ease of cleaning</div>
                  <div className="face back">
                    Not only can you completely clean your aligners, you can completely clean your teeth and floss between every tooth.
                  </div>
                </div>
                <div className="flip-container">
                  <div className="face front">Treatment duration</div>
                  <div className="face back">
                    Because Invisalign is made for your exact tooth shape and position, movement of all three dimensions can begin in the first week of treatment which can lead to shorter treatment time.dfg
                  </div>
                </div>
              </div>
            </div>
          </div> */}
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
        {/* <Suspense fallback={null}>
          <BulgeGallery
            slides={[
              { image: "/images/invisalignphonemockup.png" },
              { image: "/images/totebag2.jpg" },
            ]}
          />
        </Suspense> */}
        {/* <section className="pointer-events-none canvas-section relative h-[100vh] z-10">
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.5} />
            <WavePlane ref={meshRef} uniformsRef={uniformsRef} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </section> */}
      </div>
    </>
  );
};

export default Invisalign;

// const BulgeGallery = ({ slides }) => {
//   const canvasWrapperRef = useRef();

//   const vertexShader = `
// varying vec2 vUv;
// uniform float uScrollIntensity;

// void main() {
//   vUv = uv;
//   vec3 pos = position;

//   float wave = sin(uv.y * 3.1416); // 0 at top & bottom, 1 in center
//   float zOffset = wave * uScrollIntensity * 1.0;
//   pos.z += zOffset;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
// }

//   `;

//   const fragmentShader = `
//     varying vec2 vUv;
//     uniform sampler2D uTexture;

//     void main() {
//       gl_FragColor = texture2D(uTexture, vUv);
//     }
//   `;

//   useEffect(() => {
//     if (!canvasWrapperRef.current || !slides.length) return;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 10;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     canvasWrapperRef.current.appendChild(renderer.domElement);

//     const calculatePlaneDimensions = () => {
//       const fov = (camera.fov * Math.PI) / 180;
//       const viewHeight = 2 * Math.tan(fov / 2) * camera.position.z;
//       const height = viewHeight * 0.7;
//       const width = height * (8 / 11);
//       return { width, height };
//     };

//     const dimensions = calculatePlaneDimensions();
//     const loader = new THREE.TextureLoader();
//     const planes = [];
//     const textures = [];

//     slides.forEach((slide, index) => {
//       const texture = loader.load(slide.image);
//       texture.minFilter = THREE.LinearFilter;
//       textures.push(texture);

//       const material = new THREE.ShaderMaterial({
//         vertexShader,
//         fragmentShader,
//         uniforms: {
//           uScrollIntensity: { value: 0 },
//           uTexture: { value: texture },
//         },
//         side: THREE.DoubleSide,
//         transparent: true,
//       });

//       const geometry = new THREE.PlaneGeometry(
//         dimensions.width,
//         dimensions.height,
//         32,
//         32
//       );
//       const mesh = new THREE.Mesh(geometry, material);
//       mesh.position.y = -index * (dimensions.height + 1); // space out
//       scene.add(mesh);
//       planes.push(mesh);
//     });

//     let scrollY = 0;
//     let lastScroll = 0;
//     let scrollIntensity = 0;
//     let animationId;

//     const handleScroll = () => {
//       scrollY = (window.scrollY / window.innerHeight) * (dimensions.height + 1);
//     };

//     const animate = () => {
//       animationId = requestAnimationFrame(animate);

//       const delta = scrollY - lastScroll;
//       lastScroll = THREE.MathUtils.lerp(lastScroll, scrollY, 0.1);
//       scrollIntensity = THREE.MathUtils.lerp(
//         scrollIntensity,
//         Math.abs(delta) * 0.25,
//         0.2
//       );

//       camera.position.y = -lastScroll;

//       planes.forEach((plane) => {
//         plane.material.uniforms.uScrollIntensity.value = scrollIntensity;
//       });

//       renderer.render(scene, camera);
//     };

//     handleScroll();
//     animate();
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("scroll", handleScroll);
//       renderer.dispose();
//       planes.forEach((p) => {
//         p.geometry.dispose();
//         p.material.dispose();
//       });
//       textures.forEach((t) => t.dispose());
//       canvasWrapperRef.current?.removeChild(renderer.domElement);
//     };
//   }, [slides]);

//   return (
//     <div className="relative w-full">
//       {slides.map((_, i) => (
//         <div key={i} className="h-screen w-full" />
//       ))}

//       <div
//         ref={canvasWrapperRef}
//         className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
//       />
//     </div>
//   );
// };

// const FluidSimulation = () => {
//   const canvasRef = useRef(null);
//   const config = {
//     SIM_RESOLUTION: 128,
//     DYE_RESOLUTION: 1440,
//     CAPTURE_RESOLUTION: 512,
//     DENSITY_DISSIPATION: 2.5,
//     VELOCITY_DISSIPATION: 2,
//     PRESSURE: 0.1,
//     PRESSURE_ITERATIONS: 20,
//     CURL: 2,
//     SPLAT_RADIUS: 0.5,
//     SPLAT_FORCE: 6000,
//     SHADING: true,
//     COLOR_UPDATE_SPEED: 6,
//     BACK_COLOR: { r: 0, g: 0, b: 0 },
//   };

//   // Variables that need to persist between renders
//   const stateRef = useRef({
//     gl: null,
//     ext: null,
//     pointers: [],
//     dye: null,
//     velocity: null,
//     divergence: null,
//     curl: null,
//     pressure: null,
//     ditheringTexture: null,
//     lastUpdateTime: Date.now(),
//     colorUpdateTimer: 0.0,
//     programs: {},
//     displayMaterial: null,
//   });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const { gl, ext } = getWebGLContext(canvas);

//     stateRef.current.gl = gl;
//     stateRef.current.ext = ext;

//     if (!ext.supportLinearFiltering) {
//       config.DYE_RESOLUTION = 512;
//       config.SHADING = false;
//     }

//     // Initialize pointers
//     function pointerPrototype() {
//       this.id = -1;
//       this.texcoordX = 0;
//       this.texcoordY = 0;
//       this.prevTexcoordX = 0;
//       this.prevTexcoordY = 0;
//       this.deltaX = 0;
//       this.deltaY = 0;
//       this.down = false;
//       this.moved = false;
//       this.color = [30, 0, 300];
//     }

//     stateRef.current.pointers = [new pointerPrototype()];

//     // Initialize shaders and programs
//     initShadersAndPrograms();

//     // Initialize framebuffers
//     initFramebuffers();

//     // Start animation loop
//     const animationId = requestAnimationFrame(update);

//     // Set up event listeners
//     const handleMouseDown = (e) => handlePointerDown(e.clientX, e.clientY);
//     const handleMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
//     const handleMouseUp = () => handlePointerUp();
//     const handleTouchStart = (e) => {
//       e.preventDefault();
//       const touch = e.touches[0];
//       handlePointerDown(touch.clientX, touch.clientY);
//     };
//     const handleTouchMove = (e) => {
//       e.preventDefault();
//       const touch = e.touches[0];
//       handlePointerMove(touch.clientX, touch.clientY);
//     };
//     const handleTouchEnd = () => handlePointerUp();

//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mousemove', handleMouseMove);
//     canvas.addEventListener('mouseup', handleMouseUp);
//     canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
//     canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
//     canvas.addEventListener('touchend', handleTouchEnd);

//     // Initial splash
//     setTimeout(() => {
//       const pointer = stateRef.current.pointers[0];
//       pointer.texcoordX = 0.5;
//       pointer.texcoordY = 0.5;
//       clickSplat(pointer);
//     }, 0);

//     return () => {
//       cancelAnimationFrame(animationId);
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mousemove', handleMouseMove);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//       canvas.removeEventListener('touchstart', handleTouchStart);
//       canvas.removeEventListener('touchmove', handleTouchMove);
//       canvas.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, []);

//   const getWebGLContext = (canvas) => {
//     const params = {
//       alpha: true,
//       depth: false,
//       stencil: false,
//       antialias: false,
//       preserveDrawingBuffer: false
//     };

//     let gl = canvas.getContext('webgl2', params);

//     const isWebGL2 = !!gl;
//     if (!isWebGL2) {
//       gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
//     }

//     let halfFloat;
//     let supportLinearFiltering;
//     if (isWebGL2) {
//       gl.getExtension('EXT_color_buffer_float');
//       supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
//     } else {
//       halfFloat = gl.getExtension('OES_texture_half_float');
//       supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
//     }

//     gl.clearColor(0.0, 0.0, 0.0, 1.0);

//     const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
//     let formatRGBA;
//     let formatRG;
//     let formatR;

//     if (isWebGL2) {
//       formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
//       formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
//       formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
//     } else {
//       formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//       formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//       formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
//     }

//     return {
//       gl,
//       ext: {
//         formatRGBA,
//         formatRG,
//         formatR,
//         halfFloatTexType,
//         supportLinearFiltering
//       }
//     };
//   };

//   const getSupportedFormat = (gl, internalFormat, format, type) => {
//     if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
//       switch (internalFormat) {
//         case gl.R16F:
//           return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
//         case gl.RG16F:
//           return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
//         default:
//           return null;
//       }
//     }

//     return {
//       internalFormat,
//       format
//     };
//   };

//   const supportRenderTextureFormat = (gl, internalFormat, format, type) => {
//     let texture = gl.createTexture();
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

//     let fbo = gl.createFramebuffer();
//     gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

//     let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
//     return status == gl.FRAMEBUFFER_COMPLETE;
//   };

//   const initShadersAndPrograms = () => {
//     const { gl } = stateRef.current;

//     const compileShader = (type, source, keywords) => {
//       source = addKeywords(source, keywords);

//       const shader = gl.createShader(type);
//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);

//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.trace(gl.getShaderInfoLog(shader));
//       }

//       return shader;
//     };

//     const addKeywords = (source, keywords) => {
//       if (keywords == null) return source;
//       let keywordsString = '';
//       keywords.forEach(keyword => {
//         keywordsString += '#define ' + keyword + '\n';
//       });
//       return keywordsString + source;
//     };

//     const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
//       precision highp float;
//       attribute vec2 aPosition;
//       varying vec2 vUv;
//       varying vec2 vL;
//       varying vec2 vR;
//       varying vec2 vT;
//       varying vec2 vB;
//       uniform vec2 texelSize;
//       void main () {
//         vUv = aPosition * 0.5 + 0.5;
//         vL = vUv - vec2(texelSize.x, 0.0);
//         vR = vUv + vec2(texelSize.x, 0.0);
//         vT = vUv + vec2(0.0, texelSize.y);
//         vB = vUv - vec2(0.0, texelSize.y);
//         gl_Position = vec4(aPosition, 0.0, 1.0);
//       }
//     `);

//     const blurVertexShader = compileShader(gl.VERTEX_SHADER, `
//       precision highp float;
//       attribute vec2 aPosition;
//       varying vec2 vUv;
//       varying vec2 vL;
//       varying vec2 vR;
//       uniform vec2 texelSize;
//       void main () {
//         vUv = aPosition * 0.5 + 0.5;
//         float offset = 1.33333333;
//         vL = vUv - texelSize * offset;
//         vR = vUv + texelSize * offset;
//         gl_Position = vec4(aPosition, 0.0, 1.0);
//       }
//     `);

//     const createProgram = (vertexShader, fragmentShader) => {
//       let program = gl.createProgram();
//       gl.attachShader(program, vertexShader);
//       gl.attachShader(program, fragmentShader);
//       gl.linkProgram(program);

//       if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         console.trace(gl.getProgramInfoLog(program));
//       }

//       return program;
//     };

//     const getUniforms = (program) => {
//       let uniforms = [];
//       let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
//       for (let i = 0; i < uniformCount; i++) {
//         let uniformName = gl.getActiveUniform(program, i).name;
//         uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
//       }
//       return uniforms;
//     };

//     class Program {
//       constructor(vertexShader, fragmentShader) {
//         this.program = createProgram(vertexShader, fragmentShader);
//         this.uniforms = getUniforms(this.program);
//       }

//       bind() {
//         gl.useProgram(this.program);
//       }
//     }

//     class Material {
//       constructor(vertexShader, fragmentShaderSource) {
//         this.vertexShader = vertexShader;
//         this.fragmentShaderSource = fragmentShaderSource;
//         this.programs = [];
//         this.activeProgram = null;
//         this.uniforms = [];
//       }

//       setKeywords(keywords) {
//         let hash = 0;
//         for (let i = 0; i < keywords.length; i++) {
//           hash += hashCode(keywords[i]);
//         }

//         let program = this.programs[hash];
//         if (program == null) {
//           let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
//           program = createProgram(this.vertexShader, fragmentShader);
//           this.programs[hash] = program;
//         }

//         if (program == this.activeProgram) return;

//         this.uniforms = getUniforms(program);
//         this.activeProgram = program;
//       }

//       bind() {
//         gl.useProgram(this.activeProgram);
//       }
//     }

//     const displayShaderSource = `
//       precision highp float;
//       precision highp sampler2D;
//       varying vec2 vUv;
//       varying vec2 vL;
//       varying vec2 vR;
//       varying vec2 vT;
//       varying vec2 vB;
//       uniform sampler2D uTexture;
//       uniform sampler2D uDithering;
//       uniform vec2 ditherScale;
//       uniform vec2 texelSize;
//       vec3 linearToGamma (vec3 color) {
//         color = max(color, vec3(0));
//         return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
//       }
//       void main () {
//         vec3 c = texture2D(uTexture, vUv).rgb;
//       #ifdef SHADING
//         vec3 lc = texture2D(uTexture, vL).rgb;
//         vec3 rc = texture2D(uTexture, vR).rgb;
//         vec3 tc = texture2D(uTexture, vT).rgb;
//         vec3 bc = texture2D(uTexture, vB).rgb;
//         float dx = length(rc) - length(lc);
//         float dy = length(tc) - length(bc);
//         vec3 n = normalize(vec3(dx, dy, length(texelSize)));
//         vec3 l = vec3(0.0, 0.0, 1.0);
//         float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
//         c *= diffuse;
//       #endif
//         float a = max(c.r, max(c.g, c.b));
//         gl_FragColor = vec4(c, a);
//       }
//     `;

//     stateRef.current.displayMaterial = new Material(baseVertexShader, displayShaderSource);

//     const blurProgram = new Program(blurVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying vec2 vUv;
//       varying vec2 vL;
//       varying vec2 vR;
//       uniform sampler2D uTexture;
//       void main () {
//         vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
//         sum += texture2D(uTexture, vL) * 0.35294117;
//         sum += texture2D(uTexture, vR) * 0.35294117;
//         gl_FragColor = sum;
//       }
//     `));

//     const copyProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       uniform sampler2D uTexture;
//       void main () {
//         gl_FragColor = texture2D(uTexture, vUv);
//       }
//     `));

//     const clearProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       uniform sampler2D uTexture;
//       uniform float value;
//       void main () {
//         gl_FragColor = value * texture2D(uTexture, vUv);
//       }
//     `));

//     const colorProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       uniform vec4 color;
//       void main () {
//         gl_FragColor = color;
//       }
//     `));

//     const splatProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision highp float;
//       precision highp sampler2D;
//       varying vec2 vUv;
//       uniform sampler2D uTarget;
//       uniform float aspectRatio;
//       uniform vec3 color;
//       uniform vec2 point;
//       uniform float radius;
//       void main () {
//         vec2 p = vUv - point.xy;
//         p.x *= aspectRatio;
//         vec3 splat = exp(-dot(p, p) / radius) * color;
//         vec3 base = texture2D(uTarget, vUv).xyz;
//         gl_FragColor = vec4(base + splat, 1.0);
//       }
//     `));

//     const advectionProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision highp float;
//       precision highp sampler2D;
//       varying vec2 vUv;
//       uniform sampler2D uVelocity;
//       uniform sampler2D uSource;
//       uniform vec2 texelSize;
//       uniform vec2 dyeTexelSize;
//       uniform float dt;
//       uniform float dissipation;
//       vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
//         vec2 st = uv / tsize - 0.5;
//         vec2 iuv = floor(st);
//         vec2 fuv = fract(st);
//         vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
//         vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
//         vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
//         vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
//         return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
//       }
//       void main () {
//       #ifdef MANUAL_FILTERING
//         vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
//         vec4 result = bilerp(uSource, coord, dyeTexelSize);
//       #else
//         vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
//         vec4 result = texture2D(uSource, coord);
//       #endif
//         float decay = 1.0 + dissipation * dt;
//         gl_FragColor = result / decay;
//       }`,
//       stateRef.current.ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
//     ));

//     const divergenceProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       varying highp vec2 vL;
//       varying highp vec2 vR;
//       varying highp vec2 vT;
//       varying highp vec2 vB;
//       uniform sampler2D uVelocity;
//       void main () {
//         float L = texture2D(uVelocity, vL).x;
//         float R = texture2D(uVelocity, vR).x;
//         float T = texture2D(uVelocity, vT).y;
//         float B = texture2D(uVelocity, vB).y;
//         vec2 C = texture2D(uVelocity, vUv).xy;
//         if (vL.x < 0.0) { L = -C.x; }
//         if (vR.x > 1.0) { R = -C.x; }
//         if (vT.y > 1.0) { T = -C.y; }
//         if (vB.y < 0.0) { B = -C.y; }
//         float div = 0.5 * (R - L + T - B);
//         gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
//       }
//     `));

//     const curlProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       varying highp vec2 vL;
//       varying highp vec2 vR;
//       varying highp vec2 vT;
//       varying highp vec2 vB;
//       uniform sampler2D uVelocity;
//       void main () {
//         float L = texture2D(uVelocity, vL).y;
//         float R = texture2D(uVelocity, vR).y;
//         float T = texture2D(uVelocity, vT).x;
//         float B = texture2D(uVelocity, vB).x;
//         float vorticity = R - L - T + B;
//         gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
//       }
//     `));

//     const vorticityProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision highp float;
//       precision highp sampler2D;
//       varying vec2 vUv;
//       varying vec2 vL;
//       varying vec2 vR;
//       varying vec2 vT;
//       varying vec2 vB;
//       uniform sampler2D uVelocity;
//       uniform sampler2D uCurl;
//       uniform float curl;
//       uniform float dt;
//       void main () {
//         float L = texture2D(uCurl, vL).x;
//         float R = texture2D(uCurl, vR).x;
//         float T = texture2D(uCurl, vT).x;
//         float B = texture2D(uCurl, vB).x;
//         float C = texture2D(uCurl, vUv).x;
//         vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
//         force /= length(force) + 0.0001;
//         force *= curl * C;
//         force.y *= -1.0;
//         vec2 velocity = texture2D(uVelocity, vUv).xy;
//         velocity += force * dt;
//         velocity = min(max(velocity, -1000.0), 1000.0);
//         gl_FragColor = vec4(velocity, 0.0, 1.0);
//       }
//     `));

//     const pressureProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       varying highp vec2 vL;
//       varying highp vec2 vR;
//       varying highp vec2 vT;
//       varying highp vec2 vB;
//       uniform sampler2D uPressure;
//       uniform sampler2D uDivergence;
//       void main () {
//         float L = texture2D(uPressure, vL).x;
//         float R = texture2D(uPressure, vR).x;
//         float T = texture2D(uPressure, vT).x;
//         float B = texture2D(uPressure, vB).x;
//         float C = texture2D(uPressure, vUv).x;
//         float divergence = texture2D(uDivergence, vUv).x;
//         float pressure = (L + R + B + T - divergence) * 0.25;
//         gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
//       }
//     `));

//     const gradienSubtractProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
//       precision mediump float;
//       precision mediump sampler2D;
//       varying highp vec2 vUv;
//       varying highp vec2 vL;
//       varying highp vec2 vR;
//       varying highp vec2 vT;
//       varying highp vec2 vB;
//       uniform sampler2D uPressure;
//       uniform sampler2D uVelocity;
//       void main () {
//         float L = texture2D(uPressure, vL).x;
//         float R = texture2D(uPressure, vR).x;
//         float T = texture2D(uPressure, vT).x;
//         float B = texture2D(uPressure, vB).x;
//         vec2 velocity = texture2D(uVelocity, vUv).xy;
//         velocity.xy -= vec2(R - L, T - B);
//         gl_FragColor = vec4(velocity, 0.0, 1.0);
//       }
//     `));

//     stateRef.current.programs = {
//       blur: blurProgram,
//       copy: copyProgram,
//       clear: clearProgram,
//       color: colorProgram,
//       splat: splatProgram,
//       advection: advectionProgram,
//       divergence: divergenceProgram,
//       curl: curlProgram,
//       vorticity: vorticityProgram,
//       pressure: pressureProgram,
//       gradientSubtract: gradienSubtractProgram,
//     };

//     // Initialize blit
//     gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
//     gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(0);

//     stateRef.current.blit = (target, clear = false) => {
//       if (target == null) {
//         gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//       } else {
//         gl.viewport(0, 0, target.width, target.height);
//         gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
//       }
//       if (clear) {
//         gl.clearColor(0.0, 0.0, 0.0, 1.0);
//         gl.clear(gl.COLOR_BUFFER_BIT);
//       }
//       gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
//     };
//   };

//  // --- Framebuffer Utilities ---

// const createFBO = (w, h, internalFormat, format, type, param) => {
//   const gl = stateRef.current.gl;
//   gl.activeTexture(gl.TEXTURE0);

//   const texture = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

//   const fbo = gl.createFramebuffer();
//   gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
//   gl.viewport(0, 0, w, h);
//   gl.clear(gl.COLOR_BUFFER_BIT);

//   return {
//     texture,
//     fbo,
//     width: w,
//     height: h,
//     texelSizeX: 1.0 / w,
//     texelSizeY: 1.0 / h,
//     attach(id) {
//       gl.activeTexture(gl.TEXTURE0 + id);
//       gl.bindTexture(gl.TEXTURE_2D, texture);
//       return id;
//     }
//   };
// };

// const resizeFBO = (target, w, h, internalFormat, format, type, param) => {
//   const gl = stateRef.current.gl;
//   const newFBO = createFBO(w, h, internalFormat, format, type, param);
//   stateRef.current.programs.copy.bind();
//   gl.uniform1i(stateRef.current.programs.copy.uniforms.uTexture, target.attach(0));
//   stateRef.current.blit(newFBO);
//   return newFBO;
// };

// const createDoubleFBO = (w, h, internalFormat, format, type, param) => {
//   let fbo1 = createFBO(w, h, internalFormat, format, type, param);
//   let fbo2 = createFBO(w, h, internalFormat, format, type, param);

//   return {
//     width: w,
//     height: h,
//     texelSizeX: fbo1.texelSizeX,
//     texelSizeY: fbo1.texelSizeY,
//     get read() {
//       return fbo1;
//     },
//     set read(value) {
//       fbo1 = value;
//     },
//     get write() {
//       return fbo2;
//     },
//     set write(value) {
//       fbo2 = value;
//     },
//     swap() {
//       const temp = fbo1;
//       fbo1 = fbo2;
//       fbo2 = temp;
//     }
//   };
// };

// const resizeDoubleFBO = (target, w, h, internalFormat, format, type, param) => {
//   if (target.width === w && target.height === h) return target;

//   target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
//   target.write = createFBO(w, h, internalFormat, format, type, param);
//   target.width = w;
//   target.height = h;
//   target.texelSizeX = 1.0 / w;
//   target.texelSizeY = 1.0 / h;

//   return target;
// };

// // --- Init Framebuffers ---

// const initFramebuffers = () => {
//   const { gl, ext } = stateRef.current;
//   const simRes = getResolution(config.SIM_RESOLUTION);
//   const dyeRes = getResolution(config.DYE_RESOLUTION);

//   const texType = ext.halfFloatTexType;
//   const rgba = ext.formatRGBA;
//   const rg = ext.formatRG;
//   const r = ext.formatR;
//   const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

//   gl.disable(gl.BLEND);

//   if (!stateRef.current.dye) {
//     stateRef.current.dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
//   } else {
//     stateRef.current.dye = resizeDoubleFBO(stateRef.current.dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
//   }

//   if (!stateRef.current.velocity) {
//     stateRef.current.velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
//   } else {
//     stateRef.current.velocity = resizeDoubleFBO(stateRef.current.velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
//   }

//   stateRef.current.divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
//   stateRef.current.curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
//   stateRef.current.pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
// };
//   const updateKeywords = () => {
//     let displayKeywords = [];
//     if (config.SHADING) displayKeywords.push("SHADING");
//     stateRef.current.displayMaterial.setKeywords(displayKeywords);
//   };

//   const update = () => {
//     const dt = calcDeltaTime();
//     if (resizeCanvas()) {
//       initFramebuffers();
//     }
//     updateColors(dt);
//     applyInputs();
//     step(dt);
//     render(null);
//     stateRef.current.animationId = requestAnimationFrame(update);
//   };

//   const calcDeltaTime = () => {
//     let now = Date.now();
//     let dt = (now - stateRef.current.lastUpdateTime) / 1000;
//     dt = Math.min(dt, 0.016666);
//     stateRef.current.lastUpdateTime = now;
//     return dt;
//   };

//   const resizeCanvas = () => {
//     const canvas = canvasRef.current;
//     let width = scaleByPixelRatio(canvas.clientWidth);
//     let height = scaleByPixelRatio(canvas.clientHeight);
//     if (canvas.width != width || canvas.height != height) {
//       canvas.width = width;
//       canvas.height = height;
//       return true;
//     }
//     return false;
//   };

//   const updateColors = (dt) => {
//     stateRef.current.colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
//     if (stateRef.current.colorUpdateTimer >= 1) {
//       stateRef.current.colorUpdateTimer = wrap(stateRef.current.colorUpdateTimer, 0, 1);
//       stateRef.current.pointers.forEach(p => {
//         p.color = generateColor();
//       });
//     }
//   };

//   const applyInputs = () => {
//     stateRef.current.pointers.forEach(p => {
//       if (p.moved) {
//         p.moved = false;
//         splatPointer(p);
//       }
//     });
//   };
//   const step = (dt) => {
//     const { gl, programs, velocity, curl, divergence, pressure, dye, ext } = stateRef.current;

//     gl.disable(gl.BLEND);

//     // Curl
//     programs.curl.bind();
//     gl.uniform2f(programs.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
//     stateRef.current.blit(curl);

//     // Vorticity
//     programs.vorticity.bind();
//     gl.uniform2f(programs.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
//     gl.uniform1i(programs.vorticity.uniforms.uCurl, curl.attach(1));
//     gl.uniform1f(programs.vorticity.uniforms.curl, config.CURL);
//     gl.uniform1f(programs.vorticity.uniforms.dt, dt);
//     stateRef.current.blit(velocity.write);
//     velocity.swap();

//     // Divergence
//     programs.divergence.bind();
//     gl.uniform2f(programs.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0));
//     stateRef.current.blit(divergence);

//     // Clear pressure
//     programs.clear.bind();
//     gl.uniform1i(programs.clear.uniforms.uTexture, pressure.read.attach(0));
//     gl.uniform1f(programs.clear.uniforms.value, config.PRESSURE);
//     stateRef.current.blit(pressure.write);
//     pressure.swap();

//     // Pressure
//     programs.pressure.bind();
//     gl.uniform2f(programs.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
//     for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
//       gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1));
//       stateRef.current.blit(pressure.write);
//       pressure.swap();
//     }

//     // Gradient subtract
//     programs.gradientSubtract.bind();
//     gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, pressure.read.attach(0));
//     gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, velocity.read.attach(1));
//     stateRef.current.blit(velocity.write);
//     velocity.swap();

//     // Advection
//     programs.advection.bind();
//     gl.uniform2f(programs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
//     if (!ext.supportLinearFiltering) {
//       gl.uniform2f(programs.advection.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
//     }
//     let velocityId = velocity.read.attach(0);
//     gl.uniform1i(programs.advection.uniforms.uVelocity, velocityId);
//     gl.uniform1i(programs.advection.uniforms.uSource, velocityId);
//     gl.uniform1f(programs.advection.uniforms.dt, dt);
//     gl.uniform1f(programs.advection.uniforms.dissipation, config.VELOCITY_DISSIPATION);
//     stateRef.current.blit(velocity.write);
//     velocity.swap();

//     // Dye advection
//     if (!ext.supportLinearFiltering) {
//       gl.uniform2f(programs.advection.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
//     }
//     gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
//     gl.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
//     gl.uniform1f(programs.advection.uniforms.dissipation, config.DENSITY_DISSIPATION);
//     stateRef.current.blit(dye.write);
//     dye.swap();
//   };

//   const render = (target) => {
//     const { gl } = stateRef.current;
//     gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
//     gl.enable(gl.BLEND);
//     drawDisplay(target);
//   };

//   const drawDisplay = (target) => {
//     const { gl, displayMaterial, dye } = stateRef.current;
//     let width = target == null ? gl.drawingBufferWidth : target.width;
//     let height = target == null ? gl.drawingBufferHeight : target.height;

//     displayMaterial.bind();
//     if (config.SHADING) {
//       gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
//     }
//     gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
//     stateRef.current.blit(target);
//   };

//   const splatPointer = (pointer) => {
//     const dx = pointer.deltaX * config.SPLAT_FORCE;
//     const dy = pointer.deltaY * config.SPLAT_FORCE;
//     splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
//   };

//   const clickSplat = (pointer) => {
//     const color = generateColor();
//     color.r *= 10.0;
//     color.g *= 10.0;
//     color.b *= 10.0;
//     const dx = 10 * (Math.random() - 0.5);
//     const dy = 30 * (Math.random() - 0.5);
//     splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
//   };

//   const splat = (x, y, dx, dy, color) => {
//     const { gl, programs, velocity, dye } = stateRef.current;
//     const canvas = canvasRef.current;

//     programs.splat.bind();
//     gl.uniform1i(programs.splat.uniforms.uTarget, velocity.read.attach(0));
//     gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas.width / canvas.height);
//     gl.uniform2f(programs.splat.uniforms.point, x, y);
//     gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0);
//     gl.uniform1f(programs.splat.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
//     stateRef.current.blit(velocity.write);
//     velocity.swap();

//     gl.uniform1i(programs.splat.uniforms.uTarget, dye.read.attach(0));
//     gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b);
//     stateRef.current.blit(dye.write);
//     dye.swap();
//   };

//   const correctRadius = (radius) => {
//     const canvas = canvasRef.current;
//     const aspectRatio = canvas.width / canvas.height;
//     if (aspectRatio > 1) {
//       radius *= aspectRatio;
//     }
//     return radius;
//   };

//   const handlePointerDown = (clientX, clientY) => {
//     const canvas = canvasRef.current;
//     const pointer = stateRef.current.pointers[0];
//     const posX = scaleByPixelRatio(clientX);
//     const posY = scaleByPixelRatio(clientY);
//     updatePointerDownData(pointer, -1, posX, posY);
//     clickSplat(pointer);
//   };

//   const handlePointerMove = (clientX, clientY) => {
//     const canvas = canvasRef.current;
//     const pointer = stateRef.current.pointers[0];
//     const posX = scaleByPixelRatio(clientX);
//     const posY = scaleByPixelRatio(clientY);
//     const color = pointer.color;
//     updatePointerMoveData(pointer, posX, posY, color);
//   };

//   const handlePointerUp = () => {
//     const pointer = stateRef.current.pointers[0];
//     updatePointerUpData(pointer);
//   };

//   const updatePointerDownData = (pointer, id, posX, posY) => {
//     const canvas = canvasRef.current;
//     pointer.id = id;
//     pointer.down = true;
//     pointer.moved = false;
//     pointer.texcoordX = posX / canvas.width;
//     pointer.texcoordY = 1.0 - posY / canvas.height;
//     pointer.prevTexcoordX = pointer.texcoordX;
//     pointer.prevTexcoordY = pointer.texcoordY;
//     pointer.deltaX = 0;
//     pointer.deltaY = 0;
//     pointer.color = generateColor();
//   };

//   const updatePointerMoveData = (pointer, posX, posY, color) => {
//     const canvas = canvasRef.current;
//     pointer.prevTexcoordX = pointer.texcoordX;
//     pointer.prevTexcoordY = pointer.texcoordY;
//     pointer.texcoordX = posX / canvas.width;
//     pointer.texcoordY = 1.0 - posY / canvas.height;
//     pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
//     pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
//     pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
//     pointer.color = color;
//   };

//   const updatePointerUpData = (pointer) => {
//     pointer.down = false;
//   };

//   const correctDeltaX = (delta) => {
//     const canvas = canvasRef.current;
//     const aspectRatio = canvas.width / canvas.height;
//     if (aspectRatio < 1) {
//       delta *= aspectRatio;
//     }
//     return delta;
//   };

//   const correctDeltaY = (delta) => {
//     const canvas = canvasRef.current;
//     const aspectRatio = canvas.width / canvas.height;
//     if (aspectRatio > 1) {
//       delta /= aspectRatio;
//     }
//     return delta;
//   };

//   const generateColor = () => {
//     const c = HSVtoRGB(Math.random(), 1.0, 1.0);
//     c.r *= 0.0015;
//     c.g *= 0.0015;
//     c.b *= 0.0015;
//     return c;
//   };

//   const HSVtoRGB = (h, s, v) => {
//     const i = Math.floor(h * 3);
//     let r, g, b;

//     switch (i % 3) {
//       case 0: r = 60; g = 184; b = 211; break;
//       case 1: r = 194; g = 112; b = 243; break;
//       case 2: r = 255; g = 39; b = 119; break;
//     }

//     return { r, g, b };
//   };

//   const wrap = (value, min, max) => {
//     const range = max - min;
//     if (range === 0) return min;
//     return ((value - min) % range) + min;
//   };

//   const getResolution = (resolution) => {
//     const { gl } = stateRef.current;
//     let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
//     if (aspectRatio < 1) {
//       aspectRatio = 1.0 / aspectRatio;
//     }

//     const min = Math.round(resolution);
//     const max = Math.round(resolution * aspectRatio);

//     if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
//       return { width: max, height: min };
//     } else {
//       return { width: min, height: max };
//     }
//   };

//   const scaleByPixelRatio = (input) => {
//     const pixelRatio = window.devicePixelRatio || 1;
//     return Math.floor(input * pixelRatio);
//   };

//   const hashCode = (s) => {
//     if (s.length === 0) return 0;
//     let hash = 0;
//     for (let i = 0; i < s.length; i++) {
//       hash = ((hash << 5) - hash) + s.charCodeAt(i);
//       hash |= 0; // Convert to 32bit integer
//     }
//     return hash;
//   };

//   return (
//     <canvas
//       ref={canvasRef}

//     />
//   );
// };



