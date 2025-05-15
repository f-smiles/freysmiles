"use client";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap-trial/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import { SplitText } from "gsap-trial/SplitText";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import * as OGL from "ogl";
import {
  ScrollControls,
  useScroll as useThreeScroll,
  Scroll,
  Text,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  useLoader,
} from "@react-three/fiber";
const Slideshow = () => {
  const settings = {
    wheelSensitivity: 0.01,
    touchSensitivity: 0.01,
    momentumMultiplier: 2,
    smoothing: 0.1,
    slideLerp: 0.075,
    distortionDecay: 0.95,
    maxDistortion: 1.5,
    distortionSensitivity: 0.1,
    distortionSmoothing: 0.075,
  };

  const slideWidth = 3.0;
  const slideHeight = 1.5;
  const gap = 0.1;
  const slideCount = 10;
  const imagesCount = 5;
  const totalWidth = slideCount * (slideWidth + gap);
  const slideUnit = slideWidth + gap;

  const [slides, setSlides] = useState([]);
  const currentPosition = useRef(0);
  const targetPosition = useRef(0);
  const isScrolling = useRef(false);
  const autoScrollSpeed = useRef(0);
  const lastTime = useRef(0);
  const touchStartX = useRef(0);
  const touchLastX = useRef(0);
  const prevPosition = useRef(0);

  const currentDistortionFactor = useRef(0);
  const targetDistortionFactor = useRef(0);
  const peakVelocity = useRef(0);
  const velocityHistory = useRef([0, 0, 0, 0, 0]);

  const correctImageColor = (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const updateCurve = (mesh, worldPositionX, distortionFactor) => {
    const distortionCenter = new THREE.Vector2(0, 0);
    const distortionRadius = 2.0;
    const maxCurvature = settings.maxDistortion * distortionFactor;

    const positionAttribute = mesh.geometry.attributes.position;
    const originalVertices = mesh.userData.originalVertices;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = originalVertices[i * 3];
      const y = originalVertices[i * 3 + 1];

      const vertexWorldPosX = worldPositionX + x;
      const distFromCenter = Math.sqrt(
        Math.pow(vertexWorldPosX - distortionCenter.x, 2) +
          Math.pow(y - distortionCenter.y, 2)
      );

      const distortionStrength = Math.max(
        0,
        1 - distFromCenter / distortionRadius
      );
      const curveZ =
        Math.pow(Math.sin((distortionStrength * Math.PI) / 2), 1.5) *
        maxCurvature;

      positionAttribute.setZ(i, curveZ);
    }

    positionAttribute.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      targetPosition.current += slideUnit;
      targetDistortionFactor.current = Math.min(
        1.0,
        targetDistortionFactor.current + 0.3
      );
    } else if (e.key === "ArrowRight") {
      targetPosition.current -= slideUnit;
      targetDistortionFactor.current = Math.min(
        1.0,
        targetDistortionFactor.current + 0.3
      );
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const wheelStrength = Math.abs(e.deltaY) * 0.001;
    targetDistortionFactor.current = Math.min(
      1.0,
      targetDistortionFactor.current + wheelStrength
    );

    targetPosition.current -= e.deltaY * settings.wheelSensitivity;
    isScrolling.current = true;
    autoScrollSpeed.current =
      Math.min(Math.abs(e.deltaY) * 0.0005, 0.05) * Math.sign(e.deltaY);

    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchLastX.current = touchStartX.current;
    isScrolling.current = false;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchLastX.current;
    touchLastX.current = touchX;

    const touchStrength = Math.abs(deltaX) * 0.02;
    targetDistortionFactor.current = Math.min(
      1.0,
      targetDistortionFactor.current + touchStrength
    );

    targetPosition.current -= deltaX * settings.touchSensitivity;
    isScrolling.current = true;
  };

  const handleTouchEnd = () => {
    const velocity = (touchLastX.current - touchStartX.current) * 0.005;
    if (Math.abs(velocity) > 0.5) {
      autoScrollSpeed.current = -velocity * settings.momentumMultiplier * 0.05;
      targetDistortionFactor.current = Math.min(
        1.0,
        Math.abs(velocity) * 3 * settings.distortionSensitivity
      );
      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      // onCreated={({ gl, scene }) => {
      //   scene.background = new THREE.Color(0xe3e3db);
      // }}
    >
      <Slides
        slideCount={slideCount}
        slideWidth={slideWidth}
        slideHeight={slideHeight}
        gap={gap}
        totalWidth={totalWidth}
        slideUnit={slideUnit}
        currentPosition={currentPosition}
        targetPosition={targetPosition}
        isScrolling={isScrolling}
        autoScrollSpeed={autoScrollSpeed}
        currentDistortionFactor={currentDistortionFactor}
        targetDistortionFactor={targetDistortionFactor}
        peakVelocity={peakVelocity}
        velocityHistory={velocityHistory}
        prevPosition={prevPosition}
        lastTime={lastTime}
        updateCurve={updateCurve}
        settings={settings}
      />
    </Canvas>
  );
};

const Slides = ({
  slideCount,
  slideWidth,
  slideHeight,
  gap,
  totalWidth,
  slideUnit,
  currentPosition,
  targetPosition,
  isScrolling,
  autoScrollSpeed,
  currentDistortionFactor,
  targetDistortionFactor,
  peakVelocity,
  velocityHistory,
  prevPosition,
  lastTime,
  updateCurve,
  settings,
}) => {
  const slidesRef = useRef([]);
  const { scene } = useThree();

  const imagePaths = [
    "/images/blobnew.png",
    "/images/fscards.png",
    "/images/sch.png",
    "/images/fsstickers.png",
    "/images/futurefreysmiles.png",
    "/images/iteromockupnoborder.png",
  ];

  const textures = useLoader(THREE.TextureLoader, imagePaths);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.premultiplyAlpha = true;
    });
  }, [textures]);

  useEffect(() => {
    if (textures.length === 0) return;

    const slides = [];

    const createSlide = (index) => {
      const geometry = new THREE.PlaneGeometry(slideWidth, slideHeight, 32, 16);
      const textureIndex = index % textures.length;

      const material = new THREE.MeshBasicMaterial({
        map: textures[textureIndex],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = index * (slideWidth + gap);

      mesh.userData = {
        originalVertices: Float32Array.from(geometry.attributes.position.array),
        index,
        targetX: 0,
        currentX: 0,
      };

      adjustAspectRatio(mesh, textures[textureIndex]);

      scene.add(mesh);
      slides.push(mesh);
      return mesh;
    };

    const adjustAspectRatio = (mesh, texture) => {
      const imgAspect = texture.image.width / texture.image.height;
      const slideAspect = slideWidth / slideHeight;

      if (imgAspect > slideAspect) {
        mesh.scale.y = slideAspect / imgAspect;
      } else {
        mesh.scale.x = imgAspect / slideAspect;
      }
    };

    for (let i = 0; i < slideCount; i++) {
      slides.push(createSlide(i));
    }

    slides.forEach((slide) => {
      slide.position.x -= totalWidth / 2;
      slide.userData.targetX = slide.position.x;
      slide.userData.currentX = slide.position.x;
    });

    slidesRef.current = slides;

    return () => {
      slides.forEach((slide) => {
        scene.remove(slide);
        slide.geometry.dispose();
        slide.material.dispose();
      });
    };
  }, [textures, slideCount, slideWidth, slideHeight, gap, scene, totalWidth]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 1000;
    const deltaTime = lastTime.current
      ? (time - lastTime.current) / 1000
      : 0.016;
    lastTime.current = time;

    const prevPos = currentPosition.current;

    if (isScrolling.current) {
      targetPosition.current += autoScrollSpeed.current;
      const speedBasedDecay = 0.97 - Math.abs(autoScrollSpeed.current) * 0.5;
      autoScrollSpeed.current *= Math.max(0.92, speedBasedDecay);

      if (Math.abs(autoScrollSpeed.current) < 0.001) {
        autoScrollSpeed.current = 0;
      }
    }

    currentPosition.current +=
      (targetPosition.current - currentPosition.current) * settings.smoothing;

    const currentVelocity =
      Math.abs(currentPosition.current - prevPos) / deltaTime;
    velocityHistory.current.push(currentVelocity);
    velocityHistory.current.shift();

    const avgVelocity =
      velocityHistory.current.reduce((sum, val) => sum + val, 0) /
      velocityHistory.current.length;

    peakVelocity.current = Math.max(peakVelocity.current, avgVelocity);
    peakVelocity.current *= 0.99;

    const movementDistortion = Math.min(1.0, currentVelocity * 0.1);
    if (currentVelocity > 0.05) {
      targetDistortionFactor.current = Math.max(
        targetDistortionFactor.current,
        movementDistortion
      );
    }

    const velocityRatio = avgVelocity / (peakVelocity.current + 0.001);
    const isDecelerating = velocityRatio < 0.7 && peakVelocity.current > 0.5;

    if (isDecelerating || avgVelocity < 0.2) {
      const decayRate = isDecelerating
        ? settings.distortionDecay
        : settings.distortionDecay * 0.9;
      targetDistortionFactor.current *= decayRate;
    }

    currentDistortionFactor.current +=
      (targetDistortionFactor.current - currentDistortionFactor.current) *
      settings.distortionSmoothing;
    slidesRef.current.forEach((slide) => {
      let baseX = slide.userData.index * slideUnit - currentPosition.current;
      baseX = ((baseX % totalWidth) + totalWidth) % totalWidth;

      if (baseX > totalWidth / 2) {
        baseX -= totalWidth;
      }

      const isWrapping =
        Math.abs(baseX - slide.userData.targetX) > slideWidth * 2;
      if (isWrapping) {
        slide.userData.currentX = baseX;
      }

      slide.userData.targetX = baseX;
      slide.userData.currentX +=
        (slide.userData.targetX - slide.userData.currentX) * settings.slideLerp;

      const wrapThreshold = totalWidth / 2 + slideWidth;
      if (Math.abs(slide.userData.currentX) < wrapThreshold * 1.5) {
        slide.position.x = slide.userData.currentX;
        updateCurve(slide, slide.position.x, currentDistortionFactor.current);
      }
    });
  });

  return null;
};

const ThumbnailStrip = () => {
  const thumbnails = [
    "/images/blobnew.png",
    "/images/fscards.png",
    "/images/sch.png",
    "/images/fsstickers.png",
    "/images/futurefreysmiles.png",
    "/images/iteromockupnoborder.png",
  ];

  return (
    <div className="flex overflow-x-auto  p-4">
      {thumbnails.map((src, idx) => (
        <div
          key={idx}
          className="min-w-[80px] h-[60px] flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 hover:scale-105 transition-transform"
        >
          <img
            src={src}
            alt={`thumb-${idx}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const YourCare = () => {
  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 top-0 h-[85%]">
          <Slideshow />
        </div>

        <div className="absolute bottom-0 w-full h-[15%] z-10">
          <ThumbnailStrip />
        </div>
      </div>

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
    </>
  );
};

export default YourCare;
