"use client";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense} from "react";
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
import { Canvas, useFrame, useThree, extend, useLoader } from "@react-three/fiber";
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
    if (e.key === 'ArrowLeft') {
      targetPosition.current += slideUnit;
      targetDistortionFactor.current = Math.min(1.0, targetDistortionFactor.current + 0.3);
    } else if (e.key === 'ArrowRight') {
      targetPosition.current -= slideUnit;
      targetDistortionFactor.current = Math.min(1.0, targetDistortionFactor.current + 0.3);
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
    // Initialize event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Clean up event listeners
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color(0xe3e3db);
      }}
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
  settings
}) => {
  const slidesRef = useRef([]);
  const { scene } = useThree();
  

  const imagePaths = [
    '/images/blobnew.png',
    '/images/fscards.png',
    '/images/sch.png',
    '/images/fsstickers.png',
    '/images/blobnew.png',
  ];


  const textures = useLoader(THREE.TextureLoader, imagePaths);


  useEffect(() => {
    textures.forEach(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
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
        opacity: 1
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = index * (slideWidth + gap);
      

      mesh.userData = {
        originalVertices: Float32Array.from(geometry.attributes.position.array),
        index,
        targetX: 0,
        currentX: 0
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


    slides.forEach(slide => {
      slide.position.x -= totalWidth / 2;
      slide.userData.targetX = slide.position.x;
      slide.userData.currentX = slide.position.x;
    });

    slidesRef.current = slides;

    return () => {
      slides.forEach(slide => {
        scene.remove(slide);
        slide.geometry.dispose();
        slide.material.dispose();
      });
    };
  }, [textures, slideCount, slideWidth, slideHeight, gap, scene, totalWidth]);


  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 1000;
    const deltaTime = lastTime.current ? (time - lastTime.current) / 1000 : 0.016;
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

   
    const currentVelocity = Math.abs(currentPosition.current - prevPos) / deltaTime;
    velocityHistory.current.push(currentVelocity);
    velocityHistory.current.shift();

    const avgVelocity = velocityHistory.current.reduce((sum, val) => sum + val, 0) / 
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


      const isWrapping = Math.abs(baseX - slide.userData.targetX) > slideWidth * 2;
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
const YourCare = () => {
  const slide = [
    {
      title: "Brush and Floss",
      imageUrl: "../images/purplefloss.jpeg",
      text: "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics.",
    },
    {
      title: "General Soreness",
      imageUrl: "../images/soreness.jpg",
      text: "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
    },
    {
      title: "Loose teeth",
      imageUrl: "../images/lime_worm.svg",
      text: "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly.",
    },
    {
      title: "Loose wire/band",
      imageUrl: "../images/lime_worm.svg",
      text: "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment.",
    },
    {
      title: "Rubberbands",
      imageUrl: "../images/lime_worm.svg",
      text: "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. ",
    },
    {
      title: "Athletics",
      imageUrl:
        "https://i.postimg.cc/g09w3j9Q/e21673ee1426e49ea1cd7bc5b895cbec.jpg",
      text: "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. ",
    },
    {
      title: "How long will I be in braces?",
      imageUrl:
        "https://i.postimg.cc/T35Lymsn/597b0f5fc5aa015c0ca280ebd1e4293b.jpg",
      text: "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away.",
    },
    {
      title: "Eating with braces",
      imageUrl:
        "https://i.postimg.cc/NMB5Pnjx/62f64bc801260984785ff729f001a120.gif",
      text: "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
    },
  ];

  return (
    <>
<div className="relative w-full h-[100vh]">
  <Slideshow />
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

export default YourCare