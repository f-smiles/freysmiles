"use client";
import Copy from "@/utils/Copy.jsx";
import normalizeWheel from "normalize-wheel";
import {
  Renderer,
  Camera,
  Transform,
  Mesh,
  Program,
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
      
      // Add organic variation based on distortion and position
      elevation += (vDistortion * 0.5 + dot(normalize(vNormal), dir) * 0.1 + 
                  sin(vPosition.x * 5.0 + uTime * 0.2) * 0.05 +
                  cos(vPosition.y * 7.0 + uTime * 0.15) * 0.05 +
                  sin(vPosition.z * 3.0 + uTime * 0.1) * 0.05);
      
      float timeOffset = sin(uTime * 0.3) * 0.1;
      float rimFactor = vFresnel * uRimEffect;
      
      // Dynamic gradient that changes with time
      float gradient = 1.0 + pow(rimFactor, 2.0) * (5.0 + sin(uTime * 0.5) * 2.0);
      
      float contourValue;
      
      // Enhanced contour patterns with more organic feel
      if (uScrollProgress < 0.33) {
        // Starting with more complex organic pattern
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
      
      // Sharper lines with organic variation
      float lineVal = 1.0 - contour(contourValue, uLineWidth * (0.9 + sin(uTime * 0.4) * 0.1), 
                                   uLineSharpness * (1.0 + cos(uTime * 0.2) * 0.2));
      
      // Rim enhancement with organic variation
      lineVal = mix(lineVal, step(uLineWidth * (1.5 + sin(uTime * 0.5) * 0.5), 
                                 abs(fract(contourValue) - 0.5)), 
                   rimFactor * (0.7 + sin(uTime * 0.6) * 0.1));
      
      // Dynamic color mixing with more variation
      float colorMix = 0.5 + 0.5 * sin(vElevation * 7.0 + uTime * 0.5 + vDistortion * 3.0);
      colorMix = mix(colorMix, rimFactor, uColorShift * (1.0 + sin(uTime * 0.4) * 0.2));
      
      vec3 lineColor = mixColor(uLineColorA, uLineColorB, colorMix);
      
      // Base color with organic highlights
      vec3 color = lineColor * lineVal;
      
      // Enhanced lighting effects
      if (uUseHighlights) {
        // Dynamic lighting direction
        vec3 lightDir = normalize(vec3(
          sin(uScrollProgress * 6.28 + uTime * 0.3), 
          0.8 + 0.2 * cos(uTime * 0.4),
          cos(uScrollProgress * 6.28 + uTime * 0.25)
        ));
        
        // Specular highlight with organic variation
        vec3 halfVector = normalize(lightDir + vViewDir);
        float specular = pow(max(0.0, dot(vNormal, halfVector)), 
                     16.0 + sin(uTime * 0.5) * 4.0);
        
        color += vec3(specular) * lineVal * uHighlightIntensity * (1.0 + sin(uTime * 0.7) * 0.2);
        
        // Organic ambient occlusion
        float ao = 1.0 - uOcclusion * (1.0 - dot(vNormal, vec3(0.0, 1.0, 0.0))) * 
                  (0.9 + 0.1 * sin(vPosition.y * 10.0 + uTime * 0.2));
        color *= ao;
      }
      
      // Organic noise to break up perfection
      color *= (0.95 + hash(vPosition * 500.0) * 0.1);
      
      // Enhanced glow with pulse effect
      float glowPulse = 0.8 + 0.2 * sin(uTime * 0.8);
      vec3 glowColor = uGlowColor * pow(rimFactor, 1.5) * uGlowIntensity * glowPulse;
      color += glowColor;
      
      // Alpha with organic variation
      float alpha = lineVal * (0.7 + 0.1 * sin(uTime * 0.9)) + 
                   rimFactor * (0.3 + 0.1 * cos(uTime * 0.6));
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

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
      trigger: containerRef.current, 
      start: "top bottom+=200", 
      end: "bottom top", 
      onEnter: () => {
        isActiveRef.current = true;
        materialsRef.current.forEach(mat => {
          mat.uniforms.uScrollProgress.value = 0;
        });
      },
      onLeave: () => {
        isActiveRef.current = false;
      },
      onEnterBack: () => {
        isActiveRef.current = true;
      },
      onLeaveBack: () => {
        isActiveRef.current = false;
      },
      onUpdate: (self) => {
        if (isActiveRef.current) {
          scrollProgressRef.current = self.progress;
          updateForScrollProgress(self.progress);
        }
      }
    });
  
  };

  const updateForScrollProgress = (progress) => {
    materialsRef.current.forEach((mat) => {
      mat.uniforms.uScrollProgress.value = progress;
    });
    3;

    if (scrollProgressRef.current < 0.25) {
      const localProgress = scrollProgressRef.current * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.3, 0.5, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(
        0.5,
        0.3,
        localProgress
      ); 
      settingsRef.current.twist = gsap.utils.interpolate(
        1.5,
        2.0,
        localProgress
      ); 
      settingsRef.current.colorShift = gsap.utils.interpolate(
        0.4,
        0.6,
        localProgress
      ); 
      settingsRef.current.glowIntensity = gsap.utils.interpolate(
        0.7,
        0.5,
        localProgress
      ); 

      groupRef.current.rotation.x = gsap.utils.interpolate(
        0.1,
        0.3,
        localProgress
      );
      groupRef.current.rotation.y = gsap.utils.interpolate(
        Math.PI * 0.2,
        Math.PI * 0.5,
        localProgress
      );
    } else if (scrollProgressRef.current < 0.5) {
      const localProgress = (scrollProgressRef.current - 0.25) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.5, 0.4, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(
        0.3,
        0.6,
        localProgress
      );
      settingsRef.current.twist = gsap.utils.interpolate(
        2.0,
        1.0,
        localProgress
      );
      settingsRef.current.colorShift = gsap.utils.interpolate(
        0.6,
        0.8,
        localProgress
      );
      settingsRef.current.glowIntensity = gsap.utils.interpolate(
        0.5,
        0.8,
        localProgress
      );

      groupRef.current.rotation.x = gsap.utils.interpolate(
        0.3,
        Math.PI * 0.25,
        localProgress
      );
      groupRef.current.rotation.y = gsap.utils.interpolate(
        Math.PI * 0.5,
        Math.PI * 0.75,
        localProgress
      );
    } else if (scrollProgressRef.current < 0.75) {
      const localProgress = (scrollProgressRef.current - 0.5) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.4, 0.2, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(
        0.6,
        0.2,
        localProgress
      );
      settingsRef.current.twist = gsap.utils.interpolate(
        1.0,
        0.5,
        localProgress
      );
      settingsRef.current.colorShift = gsap.utils.interpolate(
        0.8,
        0.9,
        localProgress
      );
      settingsRef.current.glowIntensity = gsap.utils.interpolate(
        0.8,
        0.6,
        localProgress
      );

      groupRef.current.rotation.x = Math.PI * 0.25;
      groupRef.current.rotation.y = gsap.utils.interpolate(
        Math.PI * 0.75,
        Math.PI,
        localProgress
      );
    } else {
      const localProgress = (scrollProgressRef.current - 0.75) * 4.0;
      settingsRef.current.gap = gsap.utils.interpolate(0.2, 0.1, localProgress);
      settingsRef.current.distortion = gsap.utils.interpolate(
        0.2,
        0.0,
        localProgress
      );
      settingsRef.current.twist = gsap.utils.interpolate(
        0.5,
        0.0,
        localProgress
      );
      settingsRef.current.colorShift = gsap.utils.interpolate(
        0.9,
        0.0,
        localProgress
      );
      settingsRef.current.glowIntensity = gsap.utils.interpolate(
        0.6,
        0.2,
        localProgress
      );

      groupRef.current.rotation.x = gsap.utils.interpolate(
        Math.PI * 0.25,
        0,
        localProgress
      );
      groupRef.current.rotation.y = gsap.utils.interpolate(
        Math.PI,
        Math.PI * 2,
        localProgress
      );
    }

    materialsRef.current.forEach((mat) => {
      mat.uniforms.uDistortion.value = settingsRef.current.distortion;
      mat.uniforms.uTwist.value = settingsRef.current.twist;
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

const animate = () => {
  requestAnimationFrame(animate);

  if (!isActiveRef.current) return; 

  const elapsedTime = clockRef.current.getElapsedTime();
  materialsRef.current.forEach((material) => {
    material.uniforms.uTime.value = elapsedTime;
  });

  groupRef.current.rotation.z = Math.sin(elapsedTime * 0.15) * 0.1;
  rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="webgl" />
    </div>
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

  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      const inner = section.querySelector(".parallax-inner");
  
      gsap.fromTo(
        inner,
        { y: 0 },
        {
          y: -100, // adjust how much you want the content to "float" upward
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
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
      <div className="">
      <section ref={(el) => el && sectionRefs.current.push(el)} className="mt-[20vh] z-10 relative min-h-screen">
      <div className="parallax-inner relative min-h-screen">
          <Copy>
            <div className="relative ml-10 text-[32px] sm:text-[32px] leading-tight text-black font-light font-neuehaasdisplaythin">
              <span className="font-normal">Our doctors </span>{" "}
              <span className="font-light">have treated</span>{" "}
              <span className="font-saolitalic">thousands</span>{" "}
              <span className="font-medium">of patients</span> <br />
              <span className="font-normal">with this </span>{" "}
              <span className="font-light font-saolitalic">leading edge</span>{" "}
              <span className="font-light ">appliance</span>{" "}
              <span className="font-normal">system.</span>{" "}
            </div>
          </Copy>

          <div className="mt-[10vh] w-full border-t border-gray-300 max-w-7xl mx-auto text-[11px]">
            <div className="font-khteka flex border-b border-gray-300">
              <div className="w-1/3 p-5">
                <p className="uppercase font-khteka text-[13px]">Accolades</p>
              </div>
              <div className=" uppercase flex-1 flex flex-col justify-center">
                <div className="flex border-b border-gray-300 py-4 items-center px-5">
                  <div className="flex-1 uppercase">
                    6x Winner Best Orthodontist
                  </div>
                  <div className="w-[350px] text-left text-black pr-6">
                    {" "}
                    Best of the Valley
                  </div>
                  <div className="w-[80px] text-right  cursor-pointer">
                    DATE
                  </div>
                </div>
                <div className="flex border-b border-gray-300 py-4 items-center px-5">
                  <div className="flex-1 "> 5x Winner Best Orthodontist</div>
                  <div className="w-[350px] text-left text-black pr-6">
                    Readers' Choice The Morning Call
                  </div>
                  <div className="w-[80px] text-right cursor-pointer">DATE</div>
                </div>
                <div className="flex py-4 items-center px-5 ">
                  <div className="flex-1 ">
                    {" "}
                    Nationally Recognized Top Orthodontist
                  </div>
                  <div className="w-[350px] text-left text-black pr-6">
                    Top Dentists
                  </div>
                  <div className="w-[80px] text-right  cursor-pointer">
                    DATE
                  </div>
                </div>
              </div>
            </div>
            <div className="font-khteka flex">
              <div className="w-1/3 p-5">
                <p className="font-khteka uppercase text-[13px]">Expertise</p>
              </div>
              <div className="uppercase flex-1 flex flex-col justify-center">
                <div className="flex border-b border-gray-300 py-4 items-center px-5">
                  <div className="flex-1  uppercase">INVISALIGN</div>
                  <div className="w-[350px] text-left text-black pr-6">
                    {" "}
                    25+ Years of Experience
                  </div>
                  <div className="w-[80px] text-right underline cursor-pointer"></div>
                </div>
                <div className="flex border-b border-gray-300 py-4 items-center px-5">
                  <div className="flex-1 ">Invisalign Teen</div>
                  <div className="w-[350px] text-left text-black pr-6">
                    5000+ Cases Treated
                  </div>
                  <div className="w-[80px] text-right underline cursor-pointer"></div>
                </div>
                <div className="flex py-4 items-center px-5">
                  <div className="flex-1 ">Diamond Plus</div>
                  <div className="w-[350px] text-left text-black pr-6">
                    {" "}
                    Top 1% of All Providers
                  </div>
                  <div className="w-[80px] text-right underline cursor-pointer"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center px-4 sm:px-8 lg:px-12 py-10">
            <img
              ref={imageRef}
              src="/images/manholdinglaptop.png"
              className="max-w-[90%] sm:max-w-[90%] lg:max-w-[90%] h-auto"
              alt="Man holding laptop"
            />
          </div>
</div>
</section>
<section ref={(el) => el && sectionRefs.current.push(el)} className="bg-white relative z-20 min-h-screen">
<div className="parallax-inner relative min-h-screen">
        <MorphingSphere />

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
                Unlike braces, Invisalign doesn’t obscure your smile with wires
                or brackets. That means early progress is easier to see and
                appreciate.
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
                and researched fabrication processes in the world. Each aligner
                is engineered to fit complex tooth arrangements with precision
                and is continuously updated to maintain accuracy throughout the
                course of treatment.
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
                average tooth morphology. With Invisalign, your treatment begins
                in our office using advanced 3D scanning technology to capture
                the precise contours of your teeth. From this data, our doctors
                develop a fully customized plan, guiding a sequence of aligners
                engineered to move your teeth into alignment with exacting
                precision.
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
                Traditional braces complicate even the most basic oral hygiene.
                With Invisalign, your aligners come off completely—allowing
                unrestricted access for brushing and flossing around every
                surface of every tooth.
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
                No wires or brackets. No dietary limitations. No interruptions.
                Just a treatment that fits your life.
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
                morphology, movement in all three dimensions can begin as early
                as the first week. This level of control allows for greater
                efficiency—and in many cases, a shorter overall treatment time
                compared to braces.
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6 p-6">
            <img
              src="/images/adobetest.png"
              className="max-w-[45%] h-auto rounded-md"
            />
            <img
              src="/images/adobetest.png"
              className="max-w-[45%] h-auto rounded-md"
            />
          </div>

          <div className="font-neuehaas45 flex justify-center items-center mx-auto max-w-[650px] relative min-h-screen">
            The power of Invisalign lies not just in the clear aligners, but in
            the precision of digitally guided treatment planning. Each case is
            custom-designed by our doctors using comprehensive, board-eligible
            diagnostic records. It represents a departure from conventional
            orthodontics—never before have we been able to prescribe such
            targeted and controlled tooth movements.
          </div>
          <div className="font-neuehaas45 flex justify-center items-center mx-auto max-w-[650px] relative min-h-screen">
          While mail-order aligner
            companies may promise convenience, they often overlook critical
            aspects of dental malocclusion—such as bite alignment, arch
            coordination, and skeletal discrepancies. Additionally, these
            systems lack high-quality diagnostic records, bypass 3D imaging, and
            rely on generic assumptions with remote planning by providers you’ll
            never meet. You won’t have the opportunity to choose who oversees
            your treatment or assess their qualifications. These systems often
            produce oversimplified plans that can result in more complex issues
            down the line.
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
                        src="/images/boxtest.jpg"
                        alt="Frysta"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="font-neuehaas45 flex items-center justify-between w-[100%]">
                    <div>
                      <h3 className="text-[16px]  text-gray-800">Flex Plan</h3>
                      <p className="font-neuehaas45 text-sm text-gray-500 max-w-5xl">
                        Designed for adult patients seeking a streamlined
                        treatment with fewer in-office visits—resulting in a
                        lower overall investment. Includes 6–8 total
                        appointments spaced for optimal efficiency, without
                        compromising results. These cases span 8–14 months and
                        must meet certain clinical qualifications. Treatment
                        includes two sets of aligners. Every qualifying patient
                        can expect results that are satisfactory to both them
                        and the treating doctor.
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
