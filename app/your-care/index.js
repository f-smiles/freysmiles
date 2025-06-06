"use client";
import { Canvas, useFrame } from '@react-three/fiber';

import * as THREE from "three";
import { MeshDistortMaterial, useTexture } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense, useLayoutEffect } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as OGL from "ogl";
import {
  Billboard,
  ScrollControls,
  useScroll as useThreeScroll,
  Scroll,
  Text,
  OrbitControls,
  useGLTF,
  Image
} from "@react-three/drei";
import {
  useThree,
  extend,
  useLoader,
} from "@react-three/fiber";

const settings = {
  wheelSensitivity: 0.01,
  touchSensitivity: 0.01,
  momentumMultiplier: 2,
  smoothing: 0.1,
  slideLerp: 0.075,
  distortionDecay: 0.95,
  maxDistortion: 1.5,
  distortionSensitivity: 0.15,
  distortionSmoothing: 0.075,
};

const slideWidth = 3.0;
const slideHeight = 1.5;
const gap = 0.1;
const slideCount = 10;
const imagesCount = 5;
const totalWidth = slideCount * (slideWidth + gap);
const slideUnit = slideWidth + gap;


const Slide = ({ index, currentPosition, distortionFactor }) => {
  const meshRef = useRef();
  const geometryRef = useRef();
  const [originalVertices, setOriginalVertices] = useState([]);
  
  const imagePaths = [
    "/images/blobnew.png",
    "/images/fscards.png",
    "/images/sch.png",
    "/images/fsstickers.png",
    "/images/futuresmiles.png",
    "/images/iteromockupnoborder.png",
    
  ];
  
  const imageIndex = index % imagePaths.length;

  const texture = useTexture(imagePaths[imageIndex]);
  
  useEffect(() => {
    if (geometryRef.current) {
      const vertices = [...geometryRef.current.attributes.position.array];
      setOriginalVertices(vertices);
    }
  }, []);


  useFrame(() => {
    if (!meshRef.current || !geometryRef.current || originalVertices.length === 0) return;


    let baseX = index * slideUnit - currentPosition;
    baseX = ((baseX % totalWidth) + totalWidth) % totalWidth;
    if (baseX > totalWidth / 2) baseX -= totalWidth;

  
    const targetX = meshRef.current.userData.targetX || baseX;
    const currentX = meshRef.current.userData.currentX || baseX;
    
    const newTargetX = baseX;
    const newCurrentX = currentX + (newTargetX - currentX) * settings.slideLerp;
    
    meshRef.current.position.x = newCurrentX;
    meshRef.current.userData.targetX = newTargetX;
    meshRef.current.userData.currentX = newCurrentX;


    updateCurve(meshRef.current, newCurrentX, distortionFactor);
  });

  const updateCurve = (mesh, worldPositionX, distortionFactor) => {
    const distortionCenter = new THREE.Vector2(0, 0);
    const distortionRadius = 2.0;
    const maxCurvature = settings.maxDistortion * distortionFactor;

    const positionAttribute = geometryRef.current.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalVertices[i * 3];
      const y = originalVertices[i * 3 + 1];

      const vertexWorldPosX = worldPositionX + x;
      const distFromCenter = Math.sqrt(
        Math.pow(vertexWorldPosX - distortionCenter.x, 2) +
        Math.pow(y - distortionCenter.y, 2)
      );

      const distortionStrength = Math.max(0, 1 - distFromCenter / distortionRadius);
      const curveZ = Math.pow(Math.sin((distortionStrength * Math.PI) / 2), 1.5) * maxCurvature;

      positionAttribute.setZ(i, curveZ);
    }

    positionAttribute.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  };


  let scale = [1, 1, 1];
  if (texture) {
    const imgAspect = texture.image.width / texture.image.height;
    const slideAspect = slideWidth / slideHeight;
    if (imgAspect > slideAspect) {
      scale = [1, slideAspect / imgAspect, 1];
    } else {
      scale = [imgAspect / slideAspect, 1, 1];
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={[index * (slideWidth + gap) - totalWidth / 2, 0, 0]}
      scale={scale}
      userData={{ index }}
    >
      <planeGeometry args={[slideWidth, slideHeight, 32, 16]} ref={geometryRef} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        map={texture}
      />
    </mesh>
  );
};

const SlidesContainer = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [targetPosition, setTargetPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);
  const [currentDistortionFactor, setCurrentDistortionFactor] = useState(0);
  const [targetDistortionFactor, setTargetDistortionFactor] = useState(0);
  const [peakVelocity, setPeakVelocity] = useState(0);
  const [velocityHistory, setVelocityHistory] = useState([0, 0, 0, 0, 0]);
  const lastTimeRef = useRef(0);
  const prevPosRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchLastXRef = useRef(0);


  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) : 0.016;
    lastTimeRef.current = time;

    const prevPos = prevPosRef.current;
    prevPosRef.current = currentPosition;

    if (isScrolling) {
      setTargetPosition(prev => prev + autoScrollSpeed);
      const speedBasedDecay = 0.97 - Math.abs(autoScrollSpeed) * 0.5;
      setAutoScrollSpeed(prev => prev * Math.max(0.92, speedBasedDecay));

      if (Math.abs(autoScrollSpeed) < 0.001) {
        setAutoScrollSpeed(0);
      }
    }

    setCurrentPosition(prev => prev + (targetPosition - prev) * settings.smoothing);


    const currentVelocity = Math.abs(currentPosition - prevPos) / deltaTime;
    const newVelocityHistory = [...velocityHistory.slice(1), currentVelocity];
    setVelocityHistory(newVelocityHistory);

    const avgVelocity = newVelocityHistory.reduce((sum, val) => sum + val, 0) / newVelocityHistory.length;

    if (avgVelocity > peakVelocity) {
      setPeakVelocity(avgVelocity);
    }

    const velocityRatio = avgVelocity / (peakVelocity + 0.001);
    const isDecelerating = velocityRatio < 0.7 && peakVelocity > 0.5;

    setPeakVelocity(prev => prev * 0.99);


    const movementDistortion = Math.min(1.0, currentVelocity * 0.1);
    if (currentVelocity > 0.05) {
      setTargetDistortionFactor(prev => Math.max(prev, movementDistortion));
    }

    if (isDecelerating || avgVelocity < 0.2) {
      const decayRate = isDecelerating ? settings.distortionDecay : settings.distortionDecay * 0.9;
      setTargetDistortionFactor(prev => prev * decayRate);
    }

    setCurrentDistortionFactor(prev => 
      prev + (targetDistortionFactor - prev) * settings.distortionSmoothing
    );
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setTargetPosition(prev => prev + slideUnit);
        setTargetDistortionFactor(prev => Math.min(1.0, prev + 0.3));
      } else if (e.key === 'ArrowRight') {
        setTargetPosition(prev => prev - slideUnit);
        setTargetDistortionFactor(prev => Math.min(1.0, prev + 0.3));
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const wheelStrength = Math.abs(e.deltaY) * 0.001;
      setTargetDistortionFactor(prev => Math.min(1.0, prev + wheelStrength));
      setTargetPosition(prev => prev - e.deltaY * settings.wheelSensitivity);
      setIsScrolling(true);
      setAutoScrollSpeed(
        Math.min(Math.abs(e.deltaY) * 0.0005, 0.05) * Math.sign(e.deltaY)
      );

      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const handleTouchStart = (e) => {
      touchStartXRef.current = e.touches[0].clientX;
      touchLastXRef.current = touchStartXRef.current;
      setIsScrolling(false);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - touchLastXRef.current;
      touchLastXRef.current = touchX;

      const touchStrength = Math.abs(deltaX) * 0.02;
      setTargetDistortionFactor(prev => Math.min(1.0, prev + touchStrength));

      setTargetPosition(prev => prev - deltaX * settings.touchSensitivity);
      setIsScrolling(true);
    };

    const handleTouchEnd = () => {
      const velocity = (touchLastXRef.current - touchStartXRef.current) * 0.005;
      if (Math.abs(velocity) > 0.5) {
        setAutoScrollSpeed(-velocity * settings.momentumMultiplier * 0.05);
        setTargetDistortionFactor(Math.min(
          1.0,
          Math.abs(velocity) * 3 * settings.distortionSensitivity
        ));
        setIsScrolling(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(window.scrollTimeout);
    };
  }, []);

  return (
    <>
      {Array.from({ length: slideCount }).map((_, i) => (
        <Slide 
          key={i} 
          index={i} 
          currentPosition={currentPosition} 
          distortionFactor={currentDistortionFactor} 
        />
      ))}
    </>
  );
};

const SliderScene = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.z = 5;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};
const ThumbnailStrip = () => {
  const thumbnails = [
    "/images/blobnew.png",
    "/images/fscards.png",
    "/images/sch.png",
    "/images/fsstickers.png",
    "/images/futuresmiles.png",
    "/images/iteromockupnoborder.png",
  ];

  return (
    <div className="flex p-4 overflow-x-auto">
      {thumbnails.map((src, idx) => (
        <div
          key={idx}
          className="min-w-[80px] h-[60px] flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 hover:scale-105 transition-transform"
        >
          <img
            src={src}
            alt={`thumb-${idx}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

const YourCare = () => {
  return (
    <>
    {/* <div className="w-full h-screen">
        <Canvas dpr={[1, 1.5]}>
      <ScrollControls pages={4} infinite damping={0.15}>
        <Scene position={[0, 1.5, 0]} />
      </ScrollControls>
    </Canvas>
    </div> */}
      <div className="relative w-full h-screen overflow-hidden">
      <Canvas
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace, }}
      style={{ background: '#e3e3db' }}
      camera={{ position: [0, 0, 5], fov: 35 }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }}
    >
      <SliderScene />
      <SlidesContainer />
    </Canvas>

        <div className="absolute bottom-0 w-full h-[15%] z-10">
          <ThumbnailStrip />
        </div>
      </div>


    </>
  );
};

export default YourCare;



// const lerp = (start, end, alpha) => start + (end - start) * alpha;

// const Card = ({ url, active, hovered, ...props }) => {
//   const ref = useRef();
//   useFrame(() => {
//     const targetY = hovered ? 0.25 : 0;
//     const targetScale = hovered ? 1.4 : active ? 1.25 : 1;


//     ref.current.position.y = lerp(ref.current.position.y, targetY, 0.1);

//     const s = lerp(ref.current.scale.x, 1.618 * targetScale, 0.1);
//     ref.current.scale.set(s, lerp(ref.current.scale.y, targetScale, 0.1), 1);
//   });

//   return (
//     <group {...props}>
//       <Image
//         ref={ref}
//         transparent
//         radius={0.075}
//         url={url}
//         scale={[1.618, 1, 1]}
//         side={THREE.DoubleSide}
//       />
//     </group>
//   );
// };
// const imageUrls = [
//   "https://picsum.photos/id/1015/800/500",
//   "https://picsum.photos/id/1025/800/500",
//   "https://picsum.photos/id/1035/800/500",
//   "https://picsum.photos/id/1041/800/500",
//   "https://picsum.photos/id/1052/800/500",
//   "https://picsum.photos/id/1069/800/500",
//   "https://picsum.photos/id/1074/800/500",
//   "https://picsum.photos/id/1084/800/500",
// ];

// const Cards = ({ category, from = 0, len = Math.PI * 2, radius = 5.25, onPointerOver, onPointerOut, ...props }) => {
//   const [hovered, hover] = useState(null);
//   const textPosition = from + (imageUrls.length / 2 / imageUrls.length) * len;

//   return (
//     <group {...props}>
//       <Billboard position={[Math.sin(textPosition) * radius * 1.4, 0.5, Math.cos(textPosition) * radius * 1.4]}>
//         <Text fontSize={0.25} anchorX="center" color="black">
//           {category}
//         </Text>
//       </Billboard>
//       {imageUrls.map((url, i) => {
//         const angle = from + (i / imageUrls.length) * len;
//         return (
//           <Card
//             key={i}
//             onPointerOver={(e) => {
//               e.stopPropagation();
//               hover(i);
//               onPointerOver(i);
//             }}
//             onPointerOut={() => {
//               hover(null);
//               onPointerOut(null);
//             }}
//             position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
//             rotation={[0, Math.PI / 2 + angle, 0]}
//             active={hovered !== null}
//             hovered={hovered === i}
//             url={url}
//           />
//         );
//       })}
//     </group>
//   );
// };

// const ActiveCard = ({ hovered, ...props }) => {
//   const ref = useRef();
//   const url = hovered !== null && hovered < imageUrls.length ? imageUrls[hovered] : null;

//   useLayoutEffect(() => {
//     if (ref.current && ref.current.material) ref.current.material.zoom = 0.8;
//   }, [hovered]);

//   useFrame(() => {
//     if (ref.current && ref.current.material) {
//       ref.current.material.zoom = lerp(ref.current.material.zoom, 1, 0.1);
//       ref.current.material.opacity = lerp(ref.current.material.opacity, hovered !== null ? 1 : 0, 0.1);
//     }
//   });

//   return (
//     <Billboard {...props}>
//       <Text fontSize={0.5} position={[2.15, 3.85, 0]} anchorX="left" color="black">
//         {hovered !== null ? `ACTIVE\n${hovered}` : ''}
//       </Text>

//       {url && (
//         <Image
//           ref={ref}
//           transparent
//           radius={0.3}
//           position={[0, 1.5, 0]}
//           scale={[3.5, 1.618 * 3.5, 0.2, 1]}
//           url={url}
//         />
//       )}
//     </Billboard>
//   );
// };


// const Scene = ({ ...props }) => {
//   const ref = useRef();
//   const scroll = useThreeScroll();
//   const [hovered, hover] = useState(null);

//   useFrame((state) => {
//     if (ref.current) {
//       ref.current.rotation.y = -scroll.offset * (Math.PI * 2);


//       state.camera.position.x = lerp(state.camera.position.x, -state.pointer.x * 2, 0.1);
//       state.camera.position.y = lerp(state.camera.position.y, state.pointer.y * 2 + 4.5, 0.1);
//       state.camera.lookAt(0, 0, 0);
//     }
//   });

//   return (
//     <group ref={ref} {...props}>
//       <Cards category="spring" from={0} len={Math.PI / 4} onPointerOver={hover} onPointerOut={hover} />
//       <Cards category="summer" from={Math.PI / 4} len={Math.PI / 2} position={[0, 0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
//       <Cards category="autumn" from={Math.PI / 4 + Math.PI / 2} len={Math.PI / 2} onPointerOver={hover} onPointerOut={hover} />
//       <Cards category="winter" from={Math.PI * 1.25} len={Math.PI * 2 - Math.PI * 1.25} position={[0, -0.4, 0]} onPointerOver={hover} onPointerOut={hover} />
//       <ActiveCard hovered={hovered} />
//     </group>
//   );
// };


      {/* <div className="relative z-10">
  <FluidSimulation />
  <TextEffect 
    text="Braces" 
    font="NeueHaasRoman" 
    color="#ffffff" 
    fontWeight="normal" 
  />
</div> */}

      {/* <div style={{ width: "50vw", height: "100vh" }}>
        <FlutedGlassEffect
          imageUrl="/images/1.jpg"
          mode="mouse"
          motionFactor={-50}
          rotationAngle={45}
          segments={50}
          overlayOpacity={50}
          style={{ width: "100%", height: "100%" }}
        />
      </div> */}