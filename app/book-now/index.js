"use client";
import { ScrambleTextPlugin } from "gsap-trial/ScrambleTextPlugin";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "tw-elements";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Text } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger, ScrambleTextPlugin);

const TextEffect = ({ text = "braces", font = "NeueHaasDisplay35", fontWeight = "100" }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planeMeshRef = useRef(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const prevPositionRef = useRef({ x: 0.5, y: 0.5 });
  const easeFactorRef = useRef(0.02);
  const animationRef = useRef(null);
  const textureRef = useRef(null);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
      vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
      vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

      vec2 mouseDirection = u_mouse - u_prevMouse;

      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

      vec2 uvOffset = strength * -mouseDirection * 0.4;
      vec2 uv = vUv - uvOffset;

      vec4 color = texture2D(u_texture, uv);
      gl_FragColor = color;
    }
  `;

  const createTextTexture = (text, font, size, color, fontWeight = "100") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const canvasWidth = window.innerWidth * 2;
    const canvasHeight = window.innerHeight * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontSize = size || Math.floor(canvasWidth * 2);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = `${fontWeight} ${fontSize}px "${font || "NeueHaasRoman"}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const scaleFactor = Math.min(1, (canvasWidth * 1) / textWidth);
    const aspectCorrection = canvasWidth / canvasHeight;

    ctx.setTransform(
      scaleFactor,
      0,
      0,
      scaleFactor / aspectCorrection,
      canvasWidth / 2,
      canvasHeight / 2
    );

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = fontSize * 0.005;
    for (let i = 0; i < 3; i++) {
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    textureRef.current = texture;
    return texture;
  };

  const initializeScene = (texture) => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1 / aspectRatio,
      -1 / aspectRatio,
      0.1,
      1000
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    const shaderUniforms = {
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_prevMouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: texture },
    };

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );
    planeMeshRef.current = planeMesh;

    scene.add(planeMesh);
    planeMesh.scale.set(0.5, 0.5, 1); // scale to 50% 

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);
  };

  const reloadTexture = () => {
    const newTexture = createTextTexture(text, font, null, color, fontWeight);
    planeMeshRef.current.material.uniforms.u_texture.value = newTexture;
    if (textureRef.current) {
      textureRef.current.dispose();
    }
    textureRef.current = newTexture;
  };

  const animateScene = () => {
    if (!planeMeshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    const { x: targetX, y: targetY } = targetMousePositionRef.current;
    const { x: prevX, y: prevY } = prevPositionRef.current;
    const easeFactor = easeFactorRef.current;

    mousePositionRef.current.x += (targetX - mouseX) * easeFactor;
    mousePositionRef.current.y += (targetY - mouseY) * easeFactor;

    planeMeshRef.current.material.uniforms.u_mouse.value.set(
      mousePositionRef.current.x,
      1.0 - mousePositionRef.current.y
    );

    planeMeshRef.current.material.uniforms.u_prevMouse.value.set(
      prevX,
      1.0 - prevY
    );

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animateScene);
  };

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    
    easeFactorRef.current = 0.035;
    const rect = containerRef.current.getBoundingClientRect();
    prevPositionRef.current = { 
      x: targetMousePositionRef.current.x, 
      y: targetMousePositionRef.current.y 
    };

    targetMousePositionRef.current.x = (event.clientX - rect.left) / rect.width;
    targetMousePositionRef.current.y = (event.clientY - rect.top) / rect.height;
  };

  const handleMouseEnter = (event) => {
    if (!containerRef.current) return;
    
    easeFactorRef.current = 0.01;
    const rect = containerRef.current.getBoundingClientRect();

    mousePositionRef.current.x = targetMousePositionRef.current.x =
      (event.clientX - rect.left) / rect.width;
    mousePositionRef.current.y = targetMousePositionRef.current.y =
      (event.clientY - rect.top) / rect.height;
  };

  const handleMouseLeave = () => {
    easeFactorRef.current = 0.01;
    targetMousePositionRef.current = { 
      x: prevPositionRef.current.x, 
      y: prevPositionRef.current.y 
    };
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;
    
    const aspectRatio = window.innerWidth / window.innerHeight;
    cameraRef.current.left = -1;
    cameraRef.current.right = 1;
    cameraRef.current.top = 1 / aspectRatio;
    cameraRef.current.bottom = -1 / aspectRatio;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    reloadTexture();
  };
  useEffect(() => {
    let mounted = true;
    const currentContainer = containerRef.current;
  
    const init = async () => {
      try {

        const fontSize = Math.floor(window.innerWidth * 2);
        await document.fonts.load(`${fontWeight} ${fontSize}px "${font}"`);
        await document.fonts.ready;
  
        if (!mounted) return;
  

        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);
  

        if (currentContainer) {
          currentContainer.addEventListener('mousemove', handleMouseMove);
          currentContainer.addEventListener('mouseenter', handleMouseEnter);
          currentContainer.addEventListener('mouseleave', handleMouseLeave);
        }
        window.addEventListener('resize', onWindowResize);
  
      } catch (error) {
        console.error("Font loading error:", error);

        if (!mounted) return;
        
        const texture = createTextTexture(text, font, null, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);
  
        if (currentContainer) {
          currentContainer.addEventListener('mousemove', handleMouseMove);
          currentContainer.addEventListener('mouseenter', handleMouseEnter);
          currentContainer.addEventListener('mouseleave', handleMouseLeave);
        }
        window.addEventListener('resize', onWindowResize);
      }
    };
  
    init();
  
    return () => {
      mounted = false;
      cancelAnimationFrame(animationRef.current);
      

      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('mouseenter', handleMouseEnter);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', onWindowResize);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement?.remove();
      }
      if (planeMeshRef.current) {
        planeMeshRef.current.material?.dispose();
        planeMeshRef.current.geometry?.dispose();
      }
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.traverse(child => {
          child.material?.dispose();
          child.geometry?.dispose();
        });
      }
    };
  }, [text, font, fontWeight]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', cursor: 'none' }} />;
};
const ScrambleText = ({ 
  text, 
  className, 
  scrambleOnLoad = true,
  charsType = "default" // 'default' | 'numbers' | 'letters'
}) => {
  const scrambleRef = useRef(null);
  const originalText = useRef(text);

  
  const charSets = {
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    numbers: "0123456789",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
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
        }
      });
      scrambleAnimation();
    }

    const handleMouseEnter = () => scrambleAnimation();
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [scrambleOnLoad, charsType]);

  return (
    <span 
      ref={scrambleRef} 
      className={`scramble-text ${className || ''}`}
    >
      {text}
    </span>
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

  const sectionRef = useRef(null)
  const panelRef = useRef(null)

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

  return (
<>
<div>
    <TextEffect 
        text="BOOK" 
        font="NeueHaasRoman" 
        // color="#ffffff" 
        fontWeight="normal" 
      />
    </div>
<section
ref ={sectionRef}
  className="relative w-full min-h-screen bg-cover bg-center"
  style={{ backgroundImage: 'url(/images/portraitglass.jpg)' }}
>

  <div className="relative z-10 pl-10 pt-10 flex min-h-screen">

    <div
      ref={panelRef}
       className="w-full backdrop-blur-md bg-white/80 border border-white/20 shadow-md p-10 lg:p-20 flex justify-between">
      <div className="w-1/2">
        <p className="mt-20 uppercase font-neueroman text-xs mb-4">/ Contact Us</p>
      
        <div className="mt-10 uppercase text-sm flex flex-col gap-6">
        <div>
          <p className="text-[12px] mb-1 font-neueroman uppercase"> <ScrambleText text="GENERAL" className="mr-10" /></p>
          <p className="font-ibmregular text-sm leading-snug">
          <ScrambleText  text="info@freysmiles.com" />
            <br />
            <ScrambleText className="font-ibmregular"
      text="(610)437-4748" 
      charsType="numbers"
    />
          </p>
        </div>

        <div>
        <p className="text-[12px] mb-1 font-neueroman uppercase"> <ScrambleText text="ADDRESS" className="mr-10" /></p>
          <p className="font-ibmregular text-sm leading-tight">
          <ScrambleText className="font-ibmregular"
      text="Frey Smiles" 
      charsType="numbers"
    />
            <br />
            <ScrambleText className="font-ibmregular"
      text="1250 S Cedar Crest Blvd" 
      charsType="numbers"
    />
            <br />
            <ScrambleText className="font-ibmregular"
      text="Allentown PA" 
      charsType="numbers"
    />
          </p>
        </div>
      </div>

      <div className="mt-10">
        <span className="text-3xl">↓</span>
      </div>
      

      </div>



    <div className="w-1/2  flex items-center justify-center">
  <iframe
    src="https://app.acuityscheduling.com/schedule.php?owner=34613267"
    title="Schedule Appointment"
    className="w-full max-w-[820px] min-h-[90vh] "
  />
</div>
    </div>



  </div>
</section>


{/* <div ref={containerRef} className="fixed inset-0 flex items-center justify-center bg-black z-50">
<svg ref={starRef} width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_116_153)"> <path d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z" fill="url(#paint0_linear_116_153)"/> </g> <defs> <linearGradient id="paint0_linear_116_153" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse"> <stop stop-color="#DF99F7"/> <stop offset="1" stop-color="#FFDBB0"/> </linearGradient> <clipPath id="clip0_116_153"> <rect width="200" height="200" fill="white"/> </clipPath> </defs> </svg>
</div> */}



 
</>


  );
}
