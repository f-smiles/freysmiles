"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import Copy from "@/utils/Copy.jsx";
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
import { ScrollTrigger, MotionPathPlugin, SplitText } from "gsap/all";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, SplitText, MorphSVGPlugin);

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
      <div class="relative inline-block">

  <img
    src="../images/filleddiamond.svg"
    alt="diamond background"
    class="block w-[400px] h-[400px]"  
  />


  <div
    class="marker-content absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
  >
    <p class="font-neuehaas45 marker-title text-[20px]">
      ${content.title}
    </p>
    <p class="font-neuehaas45 marker-desc">
      ${content.description}
    </p>
  </div>
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

  const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
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
      pathLength = curveSvgRef.current.querySelector("path").getTotalLength();
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
        textCurveRef.current.setAttribute("startOffset", startOffset.value);
      }
    };

    const updateFilter = (distance) => {
      const maxScale = parseFloat(filterRef.current?.dataset.maxScale || 100);
      const minScale = parseFloat(filterRef.current?.dataset.minScale || 0);
      const newScale = clamp(
        map(distance, 0, 200, minScale, maxScale),
        minScale,
        maxScale
      );
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
    window.addEventListener("resize", updateMetrics);
    render();

    return () => {
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  const starRef = useRef(null);
  useEffect(() => {
    const svg = starRef.current;
    const group = svg.querySelector(".shape-wrapper");
    const content = svg.querySelector(".scrolling-content");

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleFactor = Math.min(viewportWidth, viewportHeight) / 162;

    gsap.set(group, {
      scale: 0.1,
      opacity: 0,
      transformOrigin: "center center",
    });

    gsap.set(content, {
      opacity: 0,
      y: "20%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: "center center",
        end: "+=1500",
        scrub: 1,
        markers: false,
        pin: true,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(group, {
      opacity: 1,
      duration: 0.5,
    })
      .to(group, {
        rotation: 130,
        scale: scaleFactor * 1.1,
        duration: 4,
        ease: "none",
      })
      .to(
        content,
        {
          opacity: 1,
          y: "0%",
          duration: 2,
          ease: "power2.out",
        },
        "-=2"
      );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressInterval = useRef(null);
  const loadingDelay = useRef(null);

  useEffect(() => {
    startLoadingAnimation();

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (loadingDelay.current) clearTimeout(loadingDelay.current);
    };
  }, []);

  const startLoadingAnimation = () => {
    loadingDelay.current = setTimeout(() => {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval.current);
            setTimeout(reverseAnimation, 300);
          }
          return newProgress;
        });
      }, 300);
    }, 2000);
  };

  const reverseAnimation = () => {
    setIsComplete(true);
  };

  const processingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoadingAnimation();
          observer.disconnect();
        }
      },
      { threshold: 1 }
    );

    if (processingRef.current) {
      observer.observe(processingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const svgPathRef = useRef();
  const pathRef = useRef();
  const dotRef = useRef();

  useEffect(() => {
    if (!pathRef.current || !dotRef.current) return;

    gsap.set(dotRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 0,
      },
    });

    gsap.to(dotRef.current, {
      scrollTrigger: {
        trigger: svgPathRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      scale: 1,
      transformOrigin: "center center",
      ease: "none",
    });

    gsap.to(dotRef.current, {
      scrollTrigger: {
        trigger: svgPathRef.current,
        start: "bottom center",
        end: "+=100%",
        scrub: true,
        pin: true,
      },
      scale: 250,
      ease: "power1.inOut",
    });
  }, []);

  const lineRef = useRef();

  useEffect(() => {
    const path = lineRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
    });
  }, []);
  const textRef = useRef(null);
  const trackRef = useRef(null);
  const shapeRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    // Initialize GSAP timeline
    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(shapeRef.current, {
        duration: 1,
        scale: 30,
        rotate: 240,
        ease: "expo.in",
      })
      .to(
        textRef.current,
        {
          duration: 1,
          x: 0,
          ease: "power2.in",
        },
        0
      );

    const handleScroll = () => {
      const progress =
        window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
      tl.current.progress(progress);
      document.body.style.setProperty("--scroll", progress);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.current.kill();
    };
  }, []);
  useEffect(() => {
    const canvas = document.getElementById("shader-bg");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_mouse: { value: new THREE.Vector2() },
    };

    const vertexShader = `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
    precision mediump float;
    
    uniform vec2 u_resolution;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
    }
    
    float ease(float t) {
      return smoothstep(0.0, 1.0, t);
    }
    
    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      float y = ease(st.y);
    
      // Base vertical gradient: warm white to pale sky blue
      vec3 top = vec3(0.96, 0.96, 0.94);     // Warm beige-gray
      vec3 mid = vec3(0.94, 0.96, 0.96);     // Neutral pale gray-blue
      vec3 bottom = vec3(0.91, 0.94, 0.97);  // Pale sky blue
    
      vec3 color = mix(top, mid, smoothstep(0.0, 0.45, y));
      color = mix(color, bottom, smoothstep(0.5, 0.85, y));
    
      // Subtle grain texture
      float grain = (random(st * u_resolution.xy) - 0.5) * 0.003;
      color += grain;
    
      gl_FragColor = vec4(color, 1.0);
    }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    const handleMouseMove = (e) => {
      uniforms.u_mouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
    };
  }, []);
  return (
    <>
      {/* <div className="min-h-screen p-8 flex flex-col md:flex-row mx-auto items-center w-full gap-8 ">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="flex justify-center items-center my-auto w-full md:w-1/2 text-sm leading-relaxed space-y-4">
            <p className="font-neuehaas45">
              In non ligula at elit congue accumsan. Vestibulum ante ipsum
              primis in faucibus orci luctus et ultrices posuere cubilia curae;
              Integer id massa tincidunt, dapibus metus a, accumsan lorem.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 justify-center items-center">
          <img
            src="/images/klarna.png"
            alt="Large pink lowercase k"
            className="w-2/3 h-auto object-contain"
          />
        </div>
      </div> */}
      <div className="relative">
        <canvas
          id="shader-bg"
          className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
        />
        <div className="h-screen flex justify-center items-center">
          <div className="h-[90vh] backdrop-blur-xl bg-[#111]/10 shadow-sm max-w-7xl p-10">
            <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[140px] rounded-full top-1/3 left-[-140px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute w-[400px] h-[400px] bg-orange-500 opacity-20 blur-[140px] rounded-full top-[40%] left-[-100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute w-[400px] h-[400px] bg-sky-300 opacity-30 blur-[140px] rounded-full top-1/4 right-[-120px] pointer-events-none"></div>
            `
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative backdrop-blur-xl bg-white/70  shadow-[0_0_0_1px_rgba(255,255,255,0.5)] border border-white border-[4px] rounded-[8px] p-10">
                  <div className="absolute top-4 right-4 w-4 h-5 text-white text-xs flex items-center justify-center "></div>
                  <div className="space-y-2">
                    <span className="inline-block bg-black/10 text-[10px] uppercase px-2 py-1 rounded-full text-gray-600 font-khteka tracking-wider">
                      Transparent Pricing
                    </span>
                    <div>
                      <h3 className="font-neuehaas45 text-black text-[16px] mb-2">
                        No Hidden Fees
                      </h3>
                      <ul className="list-disc pl-[1.25em] text-sm text-gray-700 font-neuehaas45 space-y-1">
                        <li>All-inclusive pricing — from start to finish.</li>
                        <li>No up-charges for ceramic or “special” braces.</li>
                        <li>No surprise fees or unexpected add-ons.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-neuehaas45 text-black text-[16px] mb-2">
                        Flexible Monthly Plans
                      </h3>
                      <ul className="list-disc pl-[1.25em] text-sm text-gray-700 font-neuehaas45 space-y-1">
                        <li>Payment plans typically span 12–24 months.</li>
                        <li>
                          A manageable down payment, with monthly plans
                          available
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-md mx-auto mt-4">
                  <svg width="400" height="200" viewBox="0 0 200 100">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      stroke="grey"
                      stroke-width="6"
                      fill="none"
                    />
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      stroke="white"
                      stroke-width="6"
                      fill="none"
                      stroke-dasharray="100 250"
                      stroke-linecap="round"
                    />
                    <text
                      x="100"
                      y="70"
                      font-size="12"
                      text-anchor="middle"
                      fill="black"
                      className="font-neuehaas45"
                    >
                      250/month
                    </text>
                    <text
                      x="70"
                      y="60"
                      font-size="5"
                      text-anchor="end"
                      fill="black"
                      class="font-khteka uppercase"
                    >
                      Starting
                    </text>
                  </svg>

                  <div className="relative mt-4">
                    <div className="h-[1px] bg-black/20 rounded-full"></div>

                 
                    <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-[20%] h-[6px] bg-white rounded-full"></div>

                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>

                    <div className="absolute top-full left-[65%] mt-2 flex flex-col items-center">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                      <span className="mt-1 font-khteka text-[10px] uppercase">
                        Our price
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative backdrop-blur-xl bg-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.5)] border border-white border-[4px] rounded-[8px] p-10 flex flex-col justify-between">

  <div className="flex items-center gap-2 mb-4">
    <div className="w-10 h-5 bg-gray-300 rounded-full relative">
      <div className="w-4 h-4 bg-white rounded-full absolute left-0 top-0.5 shadow-md transition-all"></div>
    </div>
    <span className="text-xs text-gray-600 font-neuehaas45">
      AutoPay Enabled
    </span>
  </div>

  <div className="flex items-center justify-between mb-2">
    <h3 className="text-[14px] uppercase font-khteka text-gray-700 tracking-widest">
      💳 How Financing Works
    </h3>
    <span className="bg-[#ffe5f2] text-[#7f187f] text-[10px] uppercase px-2 py-1 rounded-full font-khteka tracking-wider">
      Klarna Partner
    </span>
  </div>


  <ul className="text-sm text-gray-700 font-neuehaas45 space-y-2 mb-4">
    <li>Instant monthly quote</li>
    <li>No impact on credit to explore</li>
    <li>Break into 4 or monthly options</li>
  </ul>


  <div className="w-full bg-gray-200 rounded-full h-[6px] relative mb-1">
    <div className="bg-[#ffb3d6] h-full rounded-full w-[65%]"></div>
  </div>
  <span className="text-[10px] text-[#7f187f] font-khteka uppercase tracking-wider">
    Prequalifying with Klarna...
  </span>


  <button className="mt-4 w-full bg-[#ffe5f2] border border-[#ffb3d6] text-[#7f187f] py-2 rounded-md text-xs font-khteka uppercase hover:bg-[#ffd6e9] transition-all">
    Continue with Klarna
  </button>


  <div className="mt-3 text-center">
    <span className="inline-block bg-pink-100 text-pink-800 text-[10px] px-3 py-1 rounded-full font-khteka">
      No interest if paid in full within 6 months
    </span>
  </div>
</div>
              <div className="relative backdrop-blur-xl bg-white/70  shadow-[0_0_0_1px_rgba(255,255,255,0.5)] border border-white border-[4px] rounded-[8px] p-10">
                <div className="flex justify-between mt-4 px-6">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-black/10"
                    ></div>
                  ))}
                </div>
                <h3 className="text-[14px] uppercase font-khteka text-gray-700 tracking-widest mb-4">
                  📱 Your Treatment, Your Pace
                </h3>

                <p className="text-sm text-gray-700 font-neuehaas45 mb-6">
                  Got questions? Text us anytime and a team member will
                  personally walk you through your options.
                </p>

                <button className="w-full bg-black text-white py-2 rounded-md text-sm font-khteka uppercase hover:bg-gray-900 transition-all">
                  Text Our Team
                </button>
              </div>
            </div>
            `
          </div>
        </div>
      </div>
      <div className="bg-[#F2F3F5] min-h-screen pt-[160px] relative ">
        <section className="relative flex items-center justify-center">
          <div className=" w-[36vw] h-[90vh] bg-[#FF8111] rounded-t-[600px] flex flex-col items-center justify-center px-8 pt-24 pb-20 z-10">
            <Copy>
              {" "}
              <p className="font-neueroman text-[18px] uppercase leading-snug text-black">
                Orthodontic treatment is a transformative investment in both
                your appearance and long-term dental health — ideally, a
                once-in-a-lifetime experience. While many orthodontists can
                straighten teeth with braces or Invisalign, the quality of
                outcomes varies widely. With today's advanced technology,
                treatment goes far beyond alignment — it can enhance facial
                aesthetics and deliver truly life-changing results.
              </p>
            </Copy>
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
              className="text-[12vw] tracking-wide font-neueroman fill-[#FEB448] font-sinistre"
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
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.01"
                  numOctaves="1"
                  result="noise"
                />
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
              <textPath
                className="font-neueroman uppercase text-[20px] fill-[#624B48]"
                ref={textCurveRef}
                href="#text-curve"
              >
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
        <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-24 gap-12 w-full">
          {/* LEFT CONTENT */}
          <div className="flex-1 flex flex-col gap-8">
            <h2 className="text-5xl font-neueroman leading-tight">
              {" "}
              Stress-Free Payments
              <br />
              Made Simple
            </h2>

            <p className="text-base font-neuehaas45 max-w-md">
              We’ve partnered with Klarna to offer flexible, hassle-free payment
              options. Split your costs over time with zero fuss, zero stress —
              no forms, no fine print. Just flexibility that fits your flow.
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center relative">
            <div className="relative w-2/3">
              <img src="../images/iphoneoutline.png" className="w-full" />
              <div
                ref={processingRef}
                id="processing"
                className={`absolute inset-0 flex flex-col justify-center items-center ${
                  isComplete ? "complete" : "uncomplete"
                }`}
              >
                <div className="text-[14px] font-neuehaas45 mx-auto text-center">
                  <h1 className="text-[20px]">Processing</h1>
                  <h2 className="text-[14px]">
                    Please wait while we process your request
                  </h2>
                </div>
                <div className="relative mx-auto my-[30px]">
                  <div class="gears">
                    <div class="gear-wrapper gear-wrapper-1">
                      <svg
                        version="1.1"
                        className="gear gear-1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-2">
                      <svg
                        version="1.1"
                        className="gear gear-2"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-3">
                      <svg
                        version="1.1"
                        className="gear gear-3"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-4">
                      <svg
                        version="1.1"
                        className="gear gear-4"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        enableBackground="new 0 0 512 512"
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="loading-bar">
                    <span style={{ width: `${progress}%` }}></span>
                  </div>
                  <svg
                    className="checkmark checkmark-success"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                  >
                    <circle
                      className="checkmark-circle"
                      cx="25"
                      cy="25"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark-check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-[300px] space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-neuehaas45 uppercase">
                  <span>Remaining balance</span>
                </div>
                <div className="bg-black/10 h-2 rounded-full relative overflow-hidden">
                  <div className="bg-lime-300 h-full rounded-full w-[75%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-neuehaas45 uppercase">
                  <span>NEXT PAYMENT DUE</span>
                </div>
                <div className="bg-black/10 h-2 rounded-full relative overflow-hidden">
                  <div className="bg-purple-300 h-full rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <svg
          ref={starRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 162 162"
          style={{ enableBackground: "new 0 0 162 162" }}
        >
          <g
            className="shape-wrapper"
            style={{ transformOrigin: "center center" }}
          >
            <path
              className="hsc-img-path"
              d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
              fill="#EAFE08"
            />
          </g>

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="scrolling-content"
            style={{
              fontFamily: "sans-serif",
              fontSize: "4px",
              fill: "black",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <tspan x="50%" dy="-1em">
              AFFORDABLE FINANCING
            </tspan>
            <tspan x="50%" dy="1.2em">
              NO HIDDEN COSTS
            </tspan>
          </text>
        </svg>
        <section className="relative w-full h-screen font-neuehaas45">
          <svg viewBox="-960 -540 1920 1080" width="100%" height="100%">
            <path
              ref={lineRef}
              strokeLinecap="round"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="4"
              stroke="rgb(248,134,63)"
              strokeOpacity="1"
              strokeWidth="1.5"
              d="M-954,-192 C-954,-192 -659,-404 -520,-431 C-379,-454 -392,-360 -588,-33 C-730,212 -926,640 -350,397 C135.86099243164062,192.0279998779297 324,-61 523,-160 C705.1939697265625,-250.63900756835938 828,-256 949,-194"
            />
          </svg>
          <section className="bg-[#FF621D]"></section>
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
      </div>
      <section className="relative">
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden px-5">
          <svg
            ref={svgPathRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1484 3804"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto"
          >
            <defs>
              <clipPath id="svg-clip-path">
                <rect width="1484" height="3804" x="0" y="0" />
              </clipPath>
            </defs>

            <g clipPath="url(#svg-clip-path)">
              <g
                transform="matrix(1,0,0,1,742,1902)"
                opacity="1"
                style={{ display: "block" }}
              >
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    id="text-follow-path"
                    ref={pathRef}
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    fillOpacity="0"
                    strokeMiterlimit="4"
                    stroke="rgb(0,0,19)"
                    strokeOpacity="1"
                    strokeWidth="1"
                    d="M-110,-1890 C-110,-1890 -110,-1780 -110,-1780 C-110,-1780 -630,-1780 -630,-1780 C-685.22900390625,-1780 -730,-1735.22900390625 -730,-1680 C-730,-1680 -730,-1310 -730,-1310 C-730,-1254.77099609375 -685.22900390625,-1210 -630,-1210 C-630,-1210 -10,-1210 -10,-1210 C45.229000091552734,-1210 90,-1165.22900390625 90,-1110 C90,-1110 90,-1050 90,-1050 C90,-1050 630,-1050 630,-1050 C685.22802734375,-1050 730,-1005.22900390625 730,-950 C730,-950 730,240 730,240 C730,295.22900390625 685.22802734375,340 630,340 C630,340 -270,340 -270,340 C-270,340 -270,1000 -270,1000 C-270,1000 390,1000 390,1000 C445.22900390625,1000 490,1044.77099609375 490,1100 C490,1100 490,1630 490,1630 C490,1685.22900390625 445.22900390625,1730 390,1730 C390,1730 -110,1730 -110,1730 C-110,1730 -110,1890 -110,1890"
                  />
                  <image
                    href="/images/outlineshape.png"
                    x="-100"
                    y="-1940"
                    width="800"
                    height="800"
                  />
                  <text
                    x="50"
                    y="-1720"
                    fill="black"
                    font-size="46"
                    font-family="NeueHaasRoman, sans-serif"
                  >
                    <tspan x="20" dy="1.4em">
                      Initial consultations
                    </tspan>
                    <tspan x="20" dy="4.5em">
                      Whether in person or virtual,
                    </tspan>
                    <tspan x="20" dy="1.2em">
                      your first consultation is free.
                    </tspan>
                  </text>

                  <image
                    href="/images/chatbubble.svg"
                    x="-500"
                    y="-940"
                    width="800"
                    height="800"
                  />
                  <text
                    x="-300"
                    y="-620"
                    fill="white"
                    font-size="40"
                    font-family="NeueHaasRoman, sans-serif"
                  >
                    <tspan x="-300" dy="-5.2em">
                      Full Evaluation
                    </tspan>
                    <tspan x="-400" dy="1.4em">
                      This initial visit includes an
                    </tspan>
                    <tspan x="-400" dy="1.4em">
                      in-depth orthodontic evaluation
                    </tspan>
                    <tspan x="-250" dy="5.4em">
                      digital radiographs and
                    </tspan>
                    <tspan x="-250" dy="1.2em">
                      professional imaging.
                    </tspan>
                  </text>

                  <image
                    href="/images/outlineshape2.png"
                    x="-100"
                    y="240"
                    width="800"
                    height="800"
                  />
                  <text
                    x="-100"
                    y="520"
                    fill="black"
                    font-size="30"
                    font-family="NeueHaasRoman, sans-serif"
                  >
                    <tspan x="100" dy="1.4em">
                      Plan and Prepare
                    </tspan>
                    <tspan x="-60" dy="1.4em">
                      We encourage all decision-makers to attend
                    </tspan>
                    <tspan x="-40" dy="1.2em">
                      the initial visit so we can discuss the path
                    </tspan>
                    <tspan x="-40" dy="1.2em">
                      ahead with clarity and transparency —
                    </tspan>
                    <tspan x="-40" dy="1.2em">
                      ensuring everyone is aligned on expectations,
                    </tspan>
                    <tspan x="-40" dy="1.2em">
                      preferences, and the ideal time to begin.
                    </tspan>
                  </text>
                  <image
                    href="/images/outlineshape3.png"
                    x="-400"
                    y="940"
                    width="800"
                    height="800"
                  />
                  <text
                    x="-300"
                    y="1050"
                    fill="white"
                    font-size="30"
                    font-family="NeueHaasRoman, sans-serif"
                  >
                    <tspan x="-300" dy="3.4em">
                      Treatment Roadmap
                    </tspan>
                    <tspan x="-360" dy="1.4em">
                      {" "}
                      If treatment isn’t yet needed,
                    </tspan>
                    <tspan x="-360" dy="1.2em">
                      no cost observation check-ups will be
                    </tspan>
                    <tspan x="-360" dy="1.4em">
                      coordinated every 6-12 months until
                    </tspan>
                    <tspan x="-360" dy="1.5em">
                      {" "}
                      treatment is needed. These are
                    </tspan>
                    <tspan x="-360" dy="3.6em">
                      shorter and fun visits where
                    </tspan>
                    <tspan x="-360" dy="1.2em">
                      where you'll have access to
                    </tspan>
                    <tspan x="-360" dy="1.2em">
                      to all four of our locations
                    </tspan>
                    <tspan x="-360" dy="1.3em">
                      to play video games and
                    </tspan>
                    <tspan x="-340" dy="1.3em">
                      get to know our team.
                    </tspan>
                  </text>
                </g>
              </g>

              <g
                ref={dotRef}
                transform="matrix(.7,0,0,.7,132.8538055419922,692)"
                opacity="1"
                style={{ display: "block" }}
              >
                <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                  <path
                    fill="rgb(0,0,254)"
                    fillOpacity="1"
                    d="M0,-12 C6.622799873352051,-12 12,-6.622799873352051 12,0 C12,6.622799873352051 6.622799873352051,12 0,12 C-6.622799873352051,12 -12,6.622799873352051 -12,0 C-12,-6.622799873352051 -6.622799873352051,-12 0,-12z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </section>

      {/* <div style={{ width: '100vw', height: '100vh', background: '#09090b' }}>
      <PixelCanvas
        colors={["#e879f9", "#38bdf8", "#a855f7"]} 
        gap={6}
        speed={45}
      />
    </div> */}

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
