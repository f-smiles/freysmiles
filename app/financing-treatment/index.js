"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import {
  Sphere,
  OrbitControls,
  Environment,
  shaderMaterial,
} from "@react-three/drei";
import { Fluid } from "/utils/FluidCursorTemp.js";
import { Media } from "/utils/Media.js";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimation,
} from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger, MotionPathPlugin, SplitText } from "gsap-trial/all";
import { MorphSVGPlugin } from "gsap-trial/MorphSVGPlugin";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, SplitText, MorphSVGPlugin);

const StepsSection = () => {
  // useEffect(() => {
  //   const timeline = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: "#container",
  //       start: "top top",
  //       end: "bottom bottom",
  //       scrub: true,
  //     },
  //   });

  //   // Morph icon-1 to icon-2
  //   iconPaths[0].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon1-path${i}`,
  //       {
  //         morphSVG: `#icon2-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start"
  //     );
  //   });

  //   // Morph icon-2 to icon-3
  //   iconPaths[1].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon2-path${i}`,
  //       {
  //         morphSVG: `#icon3-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=2"
  //     );
  //   });

  //   // Morph icon-3 to icon-4
  //   iconPaths[2].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon3-path${i}`,
  //       {
  //         morphSVG: `#icon4-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=4"
  //     );
  //   });

  //   // Morph icon-4 to icon-5
  //   iconPaths[3].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon4-path${i}`,
  //       {
  //         morphSVG: `#icon5-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=6"
  //     );
  //   });

  //   // Morph icon-5 back to icon-1 (optional for looping)
  //   iconPaths[4].paths.forEach((_, i) => {
  //     timeline.to(
  //       `#icon5-path${i}`,
  //       {
  //         morphSVG: `#icon1-path${i}`,
  //         duration: 2,
  //         ease: "power1.inOut",
  //       },
  //       "start+=8"
  //     );
  //   });
  // }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full bg-[#D9CDE5] px-20 py-36 min-h-[200vh]"
    >
      <div className="w-3/5 flex overflow-y-auto">
        <div className="w-1/2 flex flex-col relative">
          <div className="relative h-full flex flex-col justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-6">
                <span className="font-neue-montreal text-sm w-6">
                  {step.number}
                </span>
              </div>
            ))}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gray-400 h-full"></div>
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-[#FE2F01] h-full"
              style={{ height: progressHeight }}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col space-y-40">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <h2 className="font-neue-montreal text-2xl">{step.title}</h2>
              <p className="text-gray-600 text-md font-neue-montreal">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/5 sticky top-0 h-screen flex flex-col justify-center items-center relative">
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col items-center space-y-6">
            {/* 
          <div className="flex justify-center">
   <div ref={container1Ref} >
    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[0].paths.map((path, i) => (
        <path
          key={`icon1-${i}`}
          ref={el => pathsRef.current[`icon1-${i}`] = el}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "#FF6E30" : "transparent"}
        />
      ))}
    </svg>
    </div>
    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[1].paths.map((path, i) => (
        <path
          key={`icon2-${i}`}
          d={path}
          stroke={i === 4 ? "#F5F5F7" : "#FF6E30"}
          strokeWidth="2"
          strokeLinecap={i === 4 ? "round" : "butt"}
          fill={i === 0 ? "#FF6E30" : "transparent"}
          strokeDasharray={i === 2 ? "7 7" : "none"}
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[2].paths.map((path, i) => (
        <path
          key={`icon3-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "transparent" : "#FF6E30"}
          strokeWidth="2"
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[3].paths.map((path, i) => (
        <path
          key={`icon4-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 0 ? "#FF6E30" : "transparent"}
          strokeWidth="2"
        />
      ))}
    </svg>

    <svg viewBox="0 0 180 180" className="w-32 h-32">
      {iconPaths[4].paths.map((path, i) => (
        <path
          key={`icon5-${i}`}
          d={path}
          stroke="#FF6E30"
          fill={i === 6 ? "#FF6E30" : "transparent"}
          strokeWidth="2"
        />
      ))}
    </svg>
  </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
function PixelCanvas({
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"],
  gap = 5,
  speed = 35,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pixelsRef = useRef([]);
  const reducedMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  class Pixel {
    constructor(ctx, x, y, color, speed, delay) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = this.getRandom(0.1, 0.9) * speed;
      this.size = 0;
      this.sizeStep = Math.random() * 0.4;
      this.minSize = 0.5;
      this.maxSizeInteger = 2;
      this.maxSize = this.getRandom(this.minSize, this.maxSizeInteger);
      this.delay = delay;
      this.counter = 0;
      this.counterStep = Math.random() * 4 + 1;
      this.isIdle = false;
      this.isReverse = false;
      this.isShimmer = false;
    }

    getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    draw() {
      const offset = this.maxSizeInteger * 0.5 - this.size * 0.5;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size);
    }

    appear() {
      this.isIdle = false;
      if (this.counter <= this.delay) {
        this.counter += this.counterStep;
        return;
      }

      if (this.size >= this.maxSize) {
        this.isShimmer = true;
      }

      if (this.isShimmer) {
        this.shimmer();
      } else {
        this.size += this.sizeStep;
      }

      this.draw();
    }

    shimmer() {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;

      this.size += this.isReverse ? -this.speed : this.speed;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      pixelsRef.current = [];
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const dx = x - width / 2;
          const dy = y - height / 2;
          const delay = reducedMotion.current ? 0 : Math.sqrt(dx * dx + dy * dy);

          pixelsRef.current.push(new Pixel(ctx, x, y, color, speed * 0.001, delay));
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixelsRef.current.forEach((p) => p.appear());
      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    render();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
    };
  }, [colors, gap, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

const FinancingTreatment = () => {
  // const canvasRef = useRef();

  // useEffect(() => {
  //   const camera = new THREE.PerspectiveCamera(
  //     45,
  //     window.innerWidth / window.innerHeight,
  //     1,
  //     100
  //   );
  //   camera.position.set(0, -0.5, 25);
  //   const scene = new THREE.Scene();
  //   const renderer = new THREE.WebGLRenderer({ alpha: true });
  //   renderer.setClearColor(0x000000, 0);

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   canvasRef.current.appendChild(renderer.domElement);

  //   const vertexShader = `
  //       varying vec2 vUv;
  //       void main() {
  //         vUv = uv;
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //       }
  //     `;

  //   const fragmentShader = `
  //       precision highp float;
  //       varying vec2 vUv;
  //       uniform vec3 u_c1;
  //       uniform vec3 u_c2;
  //       uniform float u_time;
  //       void main() {
  //         vec3 pX = vec3(vUv.x);
  //         vec3 pY = vec3(vUv.y);
  //         vec3 c1 = u_c1;
  //         vec3 c2 = u_c2;
  //         vec3 c3 = vec3(0.0, 1.0, 1.0); // aqua
  //         vec3 cmix1 = mix(c1, c2, pX + pY/2. + cos(u_time));
  //         vec3 cmix2 = mix(c2, c3, (pY - sin(u_time))*0.5);
  //         vec3 color = mix(cmix1, cmix2, pX * cos(u_time+2.));
  //         gl_FragColor = vec4(color, 1.0);
  //       }
  //     `;

  //   const uniforms = {
  //     u_c1: { type: "v3", value: new THREE.Vector3(0.9, 0.8, 0.3) },
  //     u_c2: { type: "v3", value: new THREE.Vector3(1.0, 0.54, 0.4) },
  //     u_time: { type: "f", value: 0 },
  //   };
  //   const shaderMaterial = new THREE.ShaderMaterial({
  //     uniforms,
  //     vertexShader,
  //     fragmentShader,
  //   });

  //   // const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   // const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   // scene.add(gum);

  //   // const bgGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
  //   // const bgMesh = new THREE.Mesh(bgGeometry, shaderMaterial);
  //   // scene.add(bgMesh);

  //   const gumGeometry = new THREE.SphereGeometry(5, 64, 64);
  //   const gum = new THREE.Mesh(gumGeometry, shaderMaterial);
  //   scene.add(gum);
  //   const clock = new THREE.Clock();
  //   const animate = () => {
  //     uniforms.u_time.value = clock.getElapsedTime();
  //     renderer.render(scene, camera);
  //     requestAnimationFrame(animate);
  //   };
  //   animate();

  //   const handleResize = () => {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   };
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     const canvasElement = renderer.domElement;
  //     if (canvasRef.current?.contains(canvasElement)) {
  //       canvasRef.current.removeChild(canvasElement);
  //     }
  //   };
  // }, []);

  // const containerRef = useRef(null);
  // const pathRef = useRef(null);
  // const dottedEllipsesRef = useRef([]);
  // const [ellipseFinalY, setEllipseFinalY] = useState(null);
  // const [isEllipseDrawn, setIsEllipseDrawn] = useState(false);
  // const [isOrbScaledDown, setIsOrbScaledDown] = useState(false);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     gsap.fromTo(
  //       containerRef.current,
  //       { opacity: 0 },
  //       { opacity: 1, duration: 2.5, ease: "power2.out" }
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!pathRef.current || !isOrbScaledDown) return;

  //   const path = pathRef.current;
  //   const pathLength = path.getTotalLength();

  //   gsap.set(path, {
  //     strokeDasharray: pathLength,
  //     strokeDashoffset: pathLength,
  //   });

  //   gsap.to(path, {
  //     strokeDashoffset: 0,
  //     duration: 2,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: path,
  //       start: "top 80%",
  //       end: "top 30%",
  //       scrub: 1,
  //     },
  //     onComplete: () => setIsEllipseDrawn(true),
  //   });
  // }, [isOrbScaledDown]);

  // useEffect(() => {
  //   if (!isEllipseDrawn) return;

  //   dottedEllipsesRef.current.forEach((el, i) => {
  //     if (el) {
  //       gsap.to(el, {
  //         opacity: 1,
  //         duration: 1,
  //         delay: i * 0.3,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: el,
  //           start: "top 70%",
  //           end: "top 20%",
  //           scrub: true,
  //         },
  //         top: ellipseFinalY ? `${ellipseFinalY + (i + 1) * 20}px` : "50%",
  //       });
  //     }
  //   });
  // }, [isEllipseDrawn]);

  // const ballRef = useRef(null);
  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   gsap.fromTo(
  //     ballRef.current,
  //     { y: 0 },
  //     {
  //       y: 400,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top center",
  //         end: "bottom center",
  //         scrub: true,
  //       },
  //       ease: "power1.out",
  //     }
  //   );
  // }, []);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const drawPathRef = useRef(null);

  useEffect(() => {
    const stepContent = [
      {
        title: "Complimentary consultation",
        description: "Initial consultations are always free of charge.",
      },
      {
        title: "Payment plans are available",
        description: "We offer a variety of payment plans at no interest.",
      },
      {
        title: "No hidden fees",
        description:
          "Comprehensive treatment plans include retainers and supervision",
      },
    ];
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    const path = drawPathRef.current;

    if (!section || !scrollContainer || !path) return;

    const scrollDistance = scrollContainer.scrollWidth - window.innerWidth;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const mainTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollContainer.style.transform = `translateX(${
          -scrollDistance * progress
        }px)`;
        path.style.strokeDashoffset = pathLength * (1 - progress);
      },
    });
    gsap.fromTo(
      textCurveRef.current,
      { attr: { startOffset: "150%" } },
      {
        attr: { startOffset: "-50%" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
        },
        ease: "none",
      }
    );
    const getCriticalPoints = () => {
      const points = [];
      let prevAngle = null;
      const samples = 150;
      const angleThreshold = 0.4; // the more speciifc the angle the more logged steps
      const minProgressDistance = 0.03; // dist etween points
      let lastValidProgress = -Infinity;

      for (let i = 1; i <= samples; i++) {
        const progress = i / samples;
        const currentPoint = path.getPointAtLength(progress * pathLength);
        const prevPoint = path.getPointAtLength(
          ((i - 1) / samples) * pathLength
        );

        const angle = Math.atan2(
          currentPoint.y - prevPoint.y,
          currentPoint.x - prevPoint.x
        );

        // Only count large direction changes
        if (
          prevAngle !== null &&
          Math.abs(angle - prevAngle) > angleThreshold &&
          progress - lastValidProgress >= minProgressDistance
        ) {
          points.push({
            point: currentPoint,
            progress,
            scrollPosition: scrollDistance * progress,
          });
          lastValidProgress = progress;
        }
        prevAngle = angle;
      }

      return points;
    };

    const criticalPoints = getCriticalPoints();

    const textMarkers = criticalPoints.map(
      ({ point, scrollPosition }, index) => {
        const content = stepContent[index] || {
          title: `Phase ${index + 1}`,
          description: "",
        };

        const marker = document.createElement("div");
        marker.className = "path-marker";
        marker.innerHTML = `
        <div class="marker-content">
          <p class="font-neuehaas45 marker-title text-[20px]">${content.title}</p>
          <p class="font-neuehaas45  marker-desc">${content.description}</p>
        </div>
      `;

        Object.assign(marker.style, {
          position: "absolute",
          left: `${point.x}px`,
          top: `${point.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: "0",
          willChange: "opacity",
          // border: '2px solid red',
          padding: "4px",
        });

        scrollContainer.appendChild(marker);

        ScrollTrigger.create({
          trigger: section,
          start: `top top+=${scrollPosition - 200}`,
          end: `top top+=${scrollPosition + 200}`,
          scrub: 0.5,
          onEnter: () => gsap.to(marker, { opacity: 1, duration: 0.3 }),
          onLeaveBack: () => gsap.to(marker, { opacity: 0, duration: 0.3 }),
        });

        return marker;
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      textMarkers.forEach((marker) => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
    };
  }, []);

  const cubeRef = useRef();

  useEffect(() => {
    gsap.to(cubeRef.current, {
      rotateY: 360,
      rotateX: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  const textPathRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    if (!textPathRef.current || !svgRef.current) return;
  
    gsap.to(textPathRef.current, {
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top +=40", 
        end: "bottom center",   
        scrub: true,
      },
      attr: { startOffset: "100%" },
      ease: "none",
    });
  }, []);
  

  const curveSvgRef = useRef();
  const textCurveRef = useRef();
  const filterRef = useRef();

  const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const clamp = (val, min, max) => Math.max(Math.min(val, max), min);

  useEffect(() => {
    let pathLength;
    let positionY;
    let svgRect;

    const startOffset = { value: 0, amt: 0.22 };
    const scroll = { value: window.scrollY, amt: 0.17 };
    let entered = false;

    const updateMetrics = () => {
      svgRect = curveSvgRef.current.getBoundingClientRect();
      positionY = svgRect.top + window.scrollY;
      pathLength = curveSvgRef.current.querySelector('path').getTotalLength();
    };

    const computeOffset = () => {
      return map(
        positionY - window.scrollY,
        window.innerHeight,
        0,
        pathLength,
        -pathLength / 2
      );
    };

    const updateTextOffset = () => {
      if (textCurveRef.current) {
        textCurveRef.current.setAttribute('startOffset', startOffset.value);
      }
    };

    const updateFilter = (distance) => {
      const maxScale = parseFloat(filterRef.current?.dataset.maxScale || 100);
      const minScale = parseFloat(filterRef.current?.dataset.minScale || 0);
      const newScale = clamp(map(distance, 0, 200, minScale, maxScale), minScale, maxScale);
      if (filterRef.current) {
        filterRef.current.scale.baseVal = newScale;
      }
    };

    const update = () => {
      const currentOffset = computeOffset();
      startOffset.value = !entered
        ? currentOffset
        : lerp(startOffset.value, currentOffset, startOffset.amt);
      updateTextOffset();

      const currentScroll = window.scrollY;
      scroll.value = !entered
        ? currentScroll
        : lerp(scroll.value, currentScroll, scroll.amt);
      const distance = Math.abs(scroll.value - currentScroll);
      updateFilter(distance);

      if (!entered) entered = true;
    };

    const render = () => {
      update();
      requestAnimationFrame(render);
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    render();

    return () => {
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  return (
    <>
<div className="bg-[#E5E5E4] min-h-screen pt-[160px] relative ">
<section className="relative flex items-center justify-center">


  <div className=" w-[40vw] h-[90vh] bg-[#FF8111] rounded-t-[600px] flex flex-col items-center justify-center px-8 pt-24 pb-20 z-10">
    <p className="font-neueroman text-[20px] uppercase leading-snug text-black">
    Orthodontic treatment is a transformative investment in both your
    appearance and long-term dental health — ideally, a once-in-a-lifetime
    experience. While many orthodontists can straighten teeth with braces or
    Invisalign, the quality of outcomes varies widely. With today's advanced
    technology, treatment goes far beyond alignment — it can enhance facial
    aesthetics and deliver truly life-changing results.
    </p>
  </div>

  <svg
    width="90vw"
    height="170vh"
    viewBox="-100 0 1100 1800" 
    xmlns="http://www.w3.org/2000/svg"
    ref={svgRef}
    className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
  >
    <defs>
      <path
        id="text-arc-path"
        d="M0,820 
           A450,450 0 0 1 900,820 
           L900,1440 
           L0,1440 
           Z"
        fill="none"
      />
    </defs>


    <path
      d="M0,820 
         A450,450 0 0 1 900,820 
         L900,1400 
         L0,1400 
         Z"
      fill="none"
      // stroke="#fe6531"
      // strokeWidth="4"
    />

 
<text
  className="text-[12vw] tracking-wide font-neueroman fill-[#000] font-sinistre"
  textAnchor="middle"
  dominantBaseline="middle"
>

      <textPath
        ref={textPathRef}
        href="#text-arc-path"
        startOffset="4%" 

        
      >
        GETTING STARTED
      </textPath>
    </text>
  </svg>
</section>






      <div className="overflow-hidden" style={{ height: "400vh" }}>
        
      <svg
        ref={curveSvgRef}
        className="svgtext"
        data-filter-type="distortion"
        width="120%"
        viewBox="0 0 1000 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="distortionFilter">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="1" result="noise" />
            <feDisplacementMap
              ref={filterRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              data-min-scale="0"
              data-max-scale="80"
            />
          </filter>
        </defs>

        <path
          id="text-curve"
          d="M 0 50 Q 100 0 200 100 Q 300 200 650 50 C 750 0 750 150 1000 50"
          fill="none"
        />
        <text filter="url(#distortionFilter)">
          <textPath className="font-neueroman uppercase text-[20px] fill-[#624B48]" ref={textCurveRef} href="#text-curve">
          Invest in your smile, with flexibility built in.
          </textPath>
        </text>
      </svg>

        <section
          ref={sectionRef}
          className="w-screen h-screen overflow-hidden flex items-center px-10"
        >
          <div ref={scrollContainerRef}>
            <svg
              width="3370"
              height="671"
              viewBox="0 0 3370 671"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={drawPathRef}
                d="M0.998047 1C0.998047 1 849.498 764.605 786.498 659.553C723.498 554.5 1725.51 370.052 1660.51 419.052C1595.5 468.052 2515.02 616.409 2491.26 660.981C2467.5 705.553 3369 419.052 3369 419.052"
                stroke="#EBFD15"
                strokeWidth="3"
              />
            </svg>
          </div>
        </section>
      </div>




      <section className="relative w-full h-screen font-neuehaas45">
      <section className="bg-[#FF621D]">


</section>
        <div className="items-start flex flex-col px-6">
        <div className="cube-outline">
        <div class="cube">
          <div className="cube-face cube-face--front">
            <div className="text-overlay">
              <p className="first-line font-neueroman uppercase">
                One year post-treatment follow-up
              </p>
              <p
                className=" font-neueroman uppercase"
                style={{
                  position: "absolute",
                  transform: "rotate(90deg)",
                  transformOrigin: "left top",
                  top: "40%",
                  left: "70%",
                  fontSize: ".8rem",
                  lineHeight: "1.2",
                  color: "black",
                  maxWidth: "120px",
                }}
              >
                Retainers and retention visits for one year post-treatment
                included.
              </p>
            </div>
          </div>

          <div class="cube-face cube-face--back">2</div>
          <div class="cube-face cube-face--top "></div>
          <div class="cube-face cube-face--bottom">4</div>
          <div class="cube-face cube-face--left"></div>
          <div class="cube-face cube-face--right"></div>
        </div>
      </div>
        </div>

    
  
      </section>
   {/* <div style={{ width: '100vw', height: '100vh', background: '#09090b' }}>
      <PixelCanvas
        colors={["#e879f9", "#38bdf8", "#a855f7"]} 
        gap={6}
        speed={45}
      />
    </div> */}
      </div>
      {/* <div ref={sectionRef} className="relative h-[200vh] bg-[#F2F2F4]">
        <Canvas
      gl={{ alpha: true }}
      style={{
         position: 'fixed',
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         pointerEvents: 'initial',  
         zIndex: 10
      }}
   >
      <EffectComposer>
         <Fluid />
      </EffectComposer>
   </Canvas>
        <div className="pointer-events-none h-screen flex items-center justify-center">
          <div className="relative h-screen bg-[#F2F2F4] flex items-center justify-center">

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9a3f03dd6c2c1edf4901e_sculpture%20Top.svg"
              alt="Sculpture Back"
              className="z-10 w-[300px] h-auto"
            />

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9b95746e31c40a01c2762_sculpture%20Bottom.svg"
              alt="Sculpture Front"
              className="absolute z-30 w-[300px] h-auto"
            />
          </div>

          <div
            ref={ballRef}
            className="absolute -top-10 z-20 w-24 h-24 bg-[#FDBA12] rounded-full"
          />
        </div>
      </div> */}
      {/* <div ref={canvasRef} className="w-32 h-32"></div> */}
    </>
  );
};

export default FinancingTreatment;
