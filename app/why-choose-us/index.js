"use client";
import Copy from "@/utils/Copy.jsx";

import FlutedGlassEffect from "/utils/glass";
// gsap
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  Text,
  shaderMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { Observer } from "gsap/Observer";
import { Curtains, useCurtains, Plane } from "react-curtains";
import { Vec2 } from "curtainsjs";
import SimplePlane from "./curtains";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  motion,
  useScroll,
  useTransform,
  stagger,
  useAnimate,
  useInView,
} from "framer-motion";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import SwiperCore, { Keyboard, Mousewheel } from "swiper/core";
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  Suspense,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
// framer motion
import GalaxyShape from "../_components/shapes/galaxy";
import Shape03 from "../_components/shapes/shape03";
import Shape05 from "../_components/shapes/shape05";
import Shape06 from "../_components/shapes/shape06";
import VennDiagram from "./vennDiagram";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollSmoother,
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    useGSAP
  );
}

export default function WhyChooseUs() {
  return (
    <>
      <>
        {/* <Hero /> */}
        <div className="relative w-full h-screen">
          <Canvas
            className="absolute inset-0 z-10"
            camera={{ position: [0, 6, 12], fov: 45 }}
            style={{ pointerEvents: "none" }}
          >
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={0.86} color={0xffffff} />
            <directionalLight
              position={[0, -10, -10]}
              intensity={1}
              color={0xffffff}
            />
            <RibbonAroundSphere />
          </Canvas>

          <div className="absolute inset-0 z-20 flex items-center justify-center"></div>
        </div>

        <CardStack />
        <StackCards />
        <Rays />
        <RepeatText />
        <MoreThanSmiles />
        {/* <About /> */}
        <VennDiagram />
        <Intro />
        {/* <div className="h-[100vh] w-auto">
          <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
            <SimplePlane />
          </Curtains>
        </div> */}
      </>
    </>
  );
}

const ImageShaderMaterial = shaderMaterial(
  {
    uTexture: null,
    uDataTexture: null,
    resolution: new THREE.Vector4(),
  },
  // vertex shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment shader
  `
  uniform sampler2D uTexture;
  uniform sampler2D uDataTexture;
  uniform vec4 resolution;
  varying vec2 vUv;

  void main() {

    float gridSize = 20.0;
    vec2 snappedUV = floor(vUv * gridSize) / gridSize;
    
    // get distortion values
    vec2 offset = texture2D(uDataTexture, snappedUV).rg;
    
    // apply distortion strenthg here
    vec2 distortedUV = vUv - 0.1 * offset; 
    

    vec4 color = texture2D(uTexture, distortedUV);
    
    gl_FragColor = color;
  }
  `
);

extend({ ImageShaderMaterial });

const PixelImage = ({ imgSrc, containerRef }) => {
  const materialRef = useRef();
  const { size, viewport } = useThree();
  const [textureReady, setTextureReady] = useState(false);
  const textureRef = useRef();
  const dataTextureRef = useRef();

  const mouseRef = useRef({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vX: 0,
    vY: 0,
  });

  const grid = 20;
  const settings = {
    mouseRadius: 0.2,
    strength: 0.9,
    relaxation: 0.9,
  };

  useEffect(() => {
    new THREE.TextureLoader().load(imgSrc, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      textureRef.current = tex;
      setTextureReady(true);
    });

    const data = new Float32Array(4 * grid * grid);
    for (let i = 0; i < grid * grid; i++) {
      const stride = i * 4;
      data[stride] = 0; // R (X distortion)
      data[stride + 1] = 0; // G (Y distortion)
      data[stride + 2] = 0; // B (not unused)
      data[stride + 3] = 1; // A
    }

    const dataTex = new THREE.DataTexture(
      data,
      grid,
      grid,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTex.needsUpdate = true;
    dataTextureRef.current = dataTex;
  }, [imgSrc]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef?.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = mouseRef.current;

      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;

      mouse.vX = (mouse.x - mouse.prevX) * 10;
      mouse.vY = (mouse.y - mouse.prevY) * 10;

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  useFrame(() => {
    const texture = dataTextureRef.current;
    if (!texture) return;

    const data = texture.image.data;
    const mouse = mouseRef.current;
    const maxDist = grid * settings.mouseRadius;

    for (let i = 0; i < data.length; i += 4) {
      data[i] *= settings.relaxation; // R
      data[i + 1] *= settings.relaxation; // G
    }

    const gridMouseX = mouse.x * grid;
    const gridMouseY = mouse.y * grid;

    for (let i = 0; i < grid; i++) {
      for (let j = 0; j < grid; j++) {
        const dx = gridMouseX - i;
        const dy = gridMouseY - j;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDist) {
          const index = 4 * (i + j * grid);
          const power = (1 - distance / maxDist) * settings.strength;

          data[index] += mouse.vX * power; // R channel (X distortion)
          data[index + 1] += mouse.vY * power; // G channel (Y distortion)
        }
      }
    }

    texture.needsUpdate = true;
  });

  if (!textureReady) return null;

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <imageShaderMaterial
        ref={materialRef}
        uTexture={textureRef.current}
        uDataTexture={dataTextureRef.current}
      />
    </mesh>
  );
};

function RibbonAroundSphere() {
  const ribbonRef = useRef();
  const segments = 1000;

  const frontTexture = useLoader(THREE.TextureLoader, "/images/front.png");
  const backTexture = useLoader(THREE.TextureLoader, "/images/back.png");

  useEffect(() => {
    [frontTexture, backTexture].forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 1);
      t.offset.setX(0.5);
      t.flipY = false;
    });
    backTexture.repeat.set(-1, 1);
  }, [frontTexture, backTexture]);

  useFrame(() => {
    if (frontTexture) frontTexture.offset.x += 0.001;
    if (backTexture) backTexture.offset.x -= 0.001;
  });

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        side: THREE.BackSide,
        transparent: true,
        roughness: 0.65,
        metalness: 0.25,
        alphaTest: 0.1,
        flatShading: true,
      }),
    [frontTexture]
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backTexture,
        side: THREE.FrontSide,
        transparent: true,
        roughness: 0.65,
        metalness: 0.25,
        alphaTest: 0.1,
        flatShading: true,
      }),
    [backTexture]
  );

  const geometry = useMemo(() => {
    const numPoints = 7;
    const radius = 5;

    // const curvePoints = Array.from({ length: numPoints }, (_, i) => {
    //   const theta = (i / numPoints) * Math.PI * 2;
    //   return new THREE.Vector3().setFromSphericalCoords(
    //     radius,
    //     Math.PI / 2 + 0.9 * (Math.random() - 0.5),
    //     theta
    //   );
    // });

    // console.log("Froze:", curvePoints.map((v) => v.toArray()));

    const curvePoints = [
      new THREE.Vector3(5, 0, 0),
      new THREE.Vector3(3.5, 2, 2.5),
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(-3.5, 2, -2.5),
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(-3.5, -2, 2.5),
      new THREE.Vector3(0, -3, 0),
      new THREE.Vector3(3.5, -2, -2.5),
    ];

    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    curve.tension = 0.7;

    const spacedPoints = curve.getSpacedPoints(segments);
    const frames = curve.computeFrenetFrames(segments, true);

    const dimensions = [-0.7, 0.7];
    const finalVertices = [];

    // build ribbon vertices along binormals
    dimensions.forEach((d) => {
      for (let i = 0; i <= segments; i++) {
        const base = spacedPoints[i];
        const offset = frames.binormals[i].clone().multiplyScalar(d);
        finalVertices.push(base.clone().add(offset));
      }
    });

    finalVertices[0].copy(finalVertices[segments]);
    finalVertices[segments + 1].copy(finalVertices[2 * segments + 1]);

    const geom = new THREE.BufferGeometry().setFromPoints(finalVertices);

    const indices = [];
    for (let i = 0; i < segments; i++) {
      const a = i;
      const b = i + segments + 1;
      const c = i + 1;
      const d = i + segments + 2;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
    geom.setIndex(indices);
    geom.computeVertexNormals();
    const uvs = [];
    for (let i = 0; i <= 1; i++) {
      for (let j = 0; j <= segments; j++) {
        uvs.push(1 - j / segments, i);
      }
    }
    geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    geom.clearGroups();
    geom.addGroup(0, indices.length, 0); // front material
    geom.addGroup(0, indices.length, 1); // back material

    return geom;
  }, []);

  return (
    <mesh
      ref={ribbonRef}
      geometry={geometry}
      material={[frontMaterial, backMaterial]}
    />
  );
}

const Intro = ({ texts = [], onFinished }) => {
  const wrapperRef = useRef(null);
  const circleTextRefs = useRef([]);

  useEffect(() => {
    const circleEls = circleTextRefs.current;
    gsap.set(circleEls, { transformOrigin: "50% 50%" });

    const introTL = gsap
      .timeline()
      .addLabel("start", 0)
      .to(
        circleEls,
        {
          duration: 30,
          ease: "linear",
          rotation: (i) => (i % 2 ? 360 : -360),
          repeat: -1,
          transformOrigin: "50% 50%",
        },
        "start"
      );

    return () => {
      introTL.kill();
    };
  }, [onFinished]);

  return (
    <main ref={wrapperRef} className="relative w-full h-screen overflow-hidden">
      <svg className="circles w-full h-full" viewBox="0 0 1400 1400">
        <defs>
          <path
            id="circle-0"
            d="M150,700.5A550.5,550.5 0 1 11251,700.5A550.5,550.5 0 1 1150,700.5"
          />
          <path
            id="circle-1"
            d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
          />
          <path
            id="circle-2"
            d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
          />
          <path
            id="circle-3"
            d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
          />
        </defs>

        <path
          d="M100,700.5A600,600 0 1 11301,700.5A600,600 0 1 1100,700.5"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
        <path
          d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
        <path
          d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
        <path
          d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />

        <text
          dy="-20"
          ref={(el) => (circleTextRefs.current[1] = el)}
          className="circles__text circles__text--1"
        >
          <textPath
            xlinkHref="#circle-1"
            textLength="2800"
            lengthAdjust="spacing"
          >
            Low-dose&nbsp; 3D&nbsp; digital&nbsp; radiographs&nbsp;
            Low-dose&nbsp; 3D&nbsp; digital&nbsp; radiographs&nbsp;
          </textPath>
        </text>
        <text
          dy="-20"
          ref={(el) => (circleTextRefs.current[2] = el)}
          className="circles__text circles__text--2"
        >
          <textPath xlinkHref="#circle-2" textLength="2000">
            Accelerated&nbsp;&nbsp;&nbsp; Treatment&nbsp;&nbsp;&nbsp;Accelerated
            &nbsp;&nbsp;&nbsp;Treatment&nbsp;&nbsp;&nbsp;
          </textPath>
        </text>
        <text
          dy="-20"
          ref={(el) => (circleTextRefs.current[3] = el)}
          className="circles__text circles__text--3"
        >
          <textPath xlinkHref="#circle-3" textLength="1341">
            Invisalign &nbsp;&nbsp;&nbsp;Invisalign&nbsp;&nbsp;&nbsp;
            Invisalign&nbsp;&nbsp;&nbsp; Invisalign&nbsp;&nbsp;&nbsp;
          </textPath>
        </text>
      </svg>
    </main>
  );
};
function Hero() {
  const overlayRef = useRef(null);
  const pathRef = useRef(null);
  const cardsectionRef = useRef(null);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    // Animate overlay
    gsap.to(overlayRef.current, {
      y: "-100%",
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Unlock scroll
        document.body.style.overflow = "auto";
      },
    });
  }, []);

  // useEffect(() => {
  //   const path = pathRef.current;
  //   const pathLength = path.getTotalLength();

  //   gsap.set(path, {
  //     strokeDasharray: pathLength,
  //     strokeDashoffset: pathLength,
  //   });

  //   gsap.to(path, {
  //     strokeDashoffset: 0,
  //     duration: 3,
  //     ease: "power2.out",
  //     onComplete: () => {
  //       gsap.to(path, {
  //         strokeDashoffset: pathLength,
  //         ease: "none",
  //         scrollTrigger: {
  //           trigger: cardsectionRef.current,
  //           start: "top top",
  //           end: "bottom top",
  //           scrub: 1,
  //         },
  //       });
  //     },
  //   });

  //   ScrollTrigger.create({
  //     trigger: cardsectionRef.current,
  //     start: "top top",
  //     end: "+=150%",
  //     pin: true,
  //     pinSpacing: true,
  //   });
  // }, []);

  return (
    <div className="border border-red-500 relative min-h-screen w-full bg-[#FEF9F8] text-black overflow-hidden">
      <div ref={overlayRef} className="fixed inset-0 bg-blue-100 z-50"></div>

      {/* <section
        ref={cardsectionRef}
        className="h-[100vh] relative z-10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 951 367"
          fill="none"
          className="w-full max-w-5xl mx-auto h-auto pt-40"
        >
          <path
            ref={pathRef}
            d="M926 366V41.4C926 32.7 919 25.6 910.2 25.6C904.6 25.6 899.7 28.4 897 32.9L730.2 333.3C727.5 338 722.3 341.2 716.5 341.2C707.8 341.2 700.7 334.2 700.7 325.4V41.6C700.7 32.9 693.7 25.8 684.9 25.8C679.3 25.8 674.4 28.6 671.7 33.1L504.7 333.3C502 338 496.8 341.2 491 341.2C482.3 341.2 475.2 334.2 475.2 325.4V41.6C475.2 32.9 468.2 25.8 459.4 25.8C453.8 25.8 448.9 28.6 446.2 33.1L280.2 333.3C277.5 338 272.3 341.2 266.5 341.2C257.8 341.2 250.7 334.2 250.7 325.4V41.6C250.7 32.9 243.7 25.8 234.9 25.8C229.3 25.8 224.4 28.6 221.7 33.1L54.7 333.3C52 338 46.8 341.2 41 341.2C32.3 341.2 25.2 334.2 25.2 325.4V1"
            stroke="#0C0EFE"
            strokeWidth="40"
            strokeMiterlimit="10"
            strokeLinejoin="round"
          />
        </svg>
      </section> */}
    </div>
  );
}

const CardStack = () => {
  const list1Ref = useRef(null);

  useEffect(() => {
    const container = list1Ref.current;
    const listChilds = container.querySelectorAll(".list-child");

    listChilds.forEach((el, i) => {
      gsap.set(el, {
        x: 0,
        y: 0,
        rotate: 0,
        zIndex: listChilds.length - i,
      });
    });

    const offsets = [
      { x: 100, y: -200, rotate: 17 },
      { x: -160, y: -280, rotate: -12 },
      { x: 200, y: -400, rotate: -12 },
      { x: -100, y: -500, rotate: 10 },
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 200px",
        end: `+=${listChilds.length * 200}`,
        scrub: true,
        pin: true,
        // markers: true,
      },
    });

    tl.add("animate");
    listChilds.forEach((el, i) => {
      tl.to(el, offsets[i], "animate");
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="bg-[#FEF9F8] ">
        <div className="l-wrapper ">
          <div className="list1" id="list1" ref={list1Ref}>
            <ul className="card-list list">
              <li className="list-child bg-[#c3531d] ">
                <div className="card-inner">
                  <h2 className="card-title">Tech-Savvy Teeth Things</h2>
                  <p className="card-subtitle">Goopless</p>
                  <div className="card-caption-box">
                    3D iTero scanning /<br />
                    low-dose Radiographs /<br />
                    3D printing
                  </div>
                </div>
              </li>
              <li className="list-child text-type1 bg-[#8dca9c]">
                <div className="card-inner">
                  <h2 className="card-title">Outcomes</h2>
                  <p className="card-subtitle">Over 25,000 patients</p>
                  <div className="card-caption-box">
                    Web Design & Dev /<br />
                    Art Direction /<br />
                    Illustration
                  </div>
                </div>
              </li>
              <li className="list-child text-type1 bg-[#E5AB38]">
                <div className="card-inner">
                  <h2 className="card-title">Specialists, not generalists</h2>
                  <p className="card-subtitle">
                    You wouldn’t hire a generalist surgeon
                  </p>
                  <div className="card-caption-box">
                    Board certified /<br />
                    ABO certified /<br />
                    Combined 50+ years experience
                  </div>
                </div>
              </li>
              <li className="list-child text-type1 bg-[#D6B6D1]">
                <div className="card-inner">
                  <h2 className="card-title">4 Locations</h2>
                  <p className="card-subtitle">IRL + URL</p>
                  <div className="card-caption-box">
                    Allentown / Bethlehem /<br />
                    Lehighton /<br />
                    Schnecksville
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const Rays = () => {
  const numRays = 10;
  const rays = Array.from({ length: numRays });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const minHeight = 0.5;
      const maxHeight = 110;
      const spacing = 36;

      Array.from({ length: numRays }).forEach((_, i) => {
        const baseHeight = maxHeight;
        const shrinkRatio = 0.85;
        const finalHeight = baseHeight * Math.pow(shrinkRatio, i);

        const offset = 24;
        const initialTop = offset + i * minHeight;
        const finalTop = Array.from({ length: i }).reduce((sum, _, j) => {
          const prevHeight = baseHeight * Math.pow(shrinkRatio, j);
          const spread = spacing * 1.25;
          return sum + prevHeight + spread;
        }, 0);

        gsap.fromTo(
          `.ray-${i}`,
          {
            height: minHeight,
            top: initialTop,
          },
          {
            height: finalHeight,
            top: finalTop,
            scrollTrigger: {
              trigger: ".sun-section",
              start: "top+=70% bottom",
              end: "+=160%",
              scrub: true,
            },
            ease: "none",
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const images = [
    { src: "/images/signonmetalrack.png", alt: "First Image" },
    { src: "/images/signonmetalrack.png", alt: "Second Image" },
    { src: "/images/signonmetalrack.png", alt: "Third Image" },
  ];

  useEffect(() => {
    const triggers = [];

    gsap.utils.toArray(".img-container").forEach((container) => {
      const img = container.querySelector("img");

      const trigger = gsap.fromTo(
        img,
        { yPercent: -20, ease: "none" },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            scrub: true,
          },
        }
      ).scrollTrigger;

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const sectionRef = useRef(null);
  const headingRefs = useRef([]);

  useGSAP(
    () => {
      gsap.set(headingRefs.current, { opacity: 0 });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              headingRefs.current.forEach((el) => {
                if (!el) return;

                gsap.set(el, { opacity: 0 });

                const childSplit = new SplitText(el, {
                  type: "lines",
                  linesClass: "split-child",
                });

                new SplitText(el, {
                  type: "lines",
                  linesClass: "split-parent",
                });

                gsap.set(childSplit.lines, {
                  yPercent: 100,
                  opacity: 1,
                });

                gsap.to(childSplit.lines, {
                  yPercent: 0,
                  duration: 1.5,
                  ease: "power4.out",
                  stagger: 0.1,
                  onStart: () => {
                    gsap.set(el, { opacity: 1 });
                  },
                });
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    },
    { scope: sectionRef }
  );

  return (
    <>
      <div className="bg-[#F0EEE9]">
        <main
          style={{
            margin: 0,
            padding: 0,
            background: "#171717",
            color: "white",
            fontFamily: "sans-serif",
            boxSizing: "border-box",
          }}
        >
          {images.map((img, i) => (
            <section
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              <div
                className="img"
                style={{
                  width: "min(80vw, 900px)",
                  padding: "10vw",
                }}
              >
                <div
                  className="img-container"
                  style={{
                    width: "100%",
                    paddingTop: "80%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "auto",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%) scale(1.4)",
                      transformOrigin: "center",
                    }}
                  />
                </div>
              </div>
            </section>
          ))}
        </main>
        {/* <div className="bg-[#DCDCDC] text-[#d2ff8c]"> */}


        <section ref={sectionRef} className="px-6 py-12 md:px-12">
          <div className="font-neuehaas45 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(1rem,2vw,1.75rem)] font-neue">
            <span className="uppercase text-[#d2ff8c] font-neuehaas45">
              All. <sup className="text-xs align-super">(16)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[0] = el)}>
              — Invisalign <sup className="text-xs align-super">(2k)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[1] = el)}>
              — Accelerated Treatment.{" "}
              <sup className="text-xs align-super">(12)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[2] = el)}>
              — Low-Dose Digital 3D Radiographs{" "}
              <sup className="text-xs align-super">(15)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[3] = el)}>
              Damon Braces. <sup className="text-xs align-super">(2k)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[4] = el)}>
              — iTero Lumina. <sup className="text-xs align-super">(5)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[5] = el)}>
              — 3D Printing. <sup className="text-xs align-super">(8)</sup>
            </span>
            <span ref={(el) => (headingRefs.current[6] = el)}>
              — Laser Therapy. <sup className="text-xs align-super">(8)</sup>
            </span>
          </div>

          <div className="mt-12 w-full flex gap-4">
            <div className="w-1/2">
              <div className="img-container relative overflow-hidden">
                <img
                  src="/images/signonmetalrack.png"
                  alt="metalrack"
                  className="w-full h-full object-contain"
                  style={{
                    transform: "translateY(0%) scale(1.0)",
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>

            <div className="w-1/2">
              <div className="img-container relative overflow-hidden">
                <img
                  src="/images/testdisplay.png"
                  alt="placeholder"
                  className="w-full h-full object-contain"
                  style={{
                    transform: "translateY(0%) scale(1.0)",
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <Copy>
          {" "}
          <p className="text-[20px] ml-10 mb-10 max-w-[600px] font-neuehaas45 leading-[1.2]">
            Certain treatment plans rely on precise growth timing to ensure
            stable, long-lasting results. Our 3D imaging technology lets us
            track the exact position and trajectory of traditionally problematic
            teeth—while also helping rule out certain pathologies. It’s changing
            the face of dentistry and orthodontics. Expect more advanced
            insights than what you’ll hear from most competitors.
          </p>
        </Copy>

        <div className="relative flex justify-center items-center h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-2/3 h-auto"
          >
            <source src="/videos/cbctscan.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex justify-end">
          <p className="text-[18px] mt-10 mr-10 max-w-lg font-neuehaas45 leading-tight tracking-tight">
            Our office was the first in the region to pioneer fully digital
            orthodontics—leading the way with 3D iTero scanning and in-house 3D
            printing for appliance design and fabrication.
          </p>
        </div>

        <div className="flex justify-start ml-20">
          <video
            src="../images/retaintracing.mp4"
            className="w-1/3 object-contain"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <section className="w-full min-h-screen ">
      
        </section>

        {/* <div className="mt-10 w-full flex justify-center flex-row gap-6">
          <div className="w-[540px] ">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 792 792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask id="mask-inverse-2">
                  <rect width="792" height="792" fill="white" />

                  <path
                    d="M268.094 181.48V-220.57H455.044V181.67L268.094 181.48Z"
                    fill="black"
                  />
                  <path
                    d="M457.805 339.69H824.685V613.44L457.825 613.52C457.825 613.52 457.825 613.52 457.815 613.52V770.55H1010.1V-220.24H824.685V182.58L457.805 182.65V339.68V339.69Z"
                    fill="black"
                  />
                  <path
                    d="M433.78 295.93C333.76 295.93 252.68 377.01 252.68 477.03C252.68 577.05 333.76 658.13 433.78 658.13"
                    fill="black"
                  />
                  <path
                    d="M432.105 658.129H457.805L457.805 295.949H432.105L432.105 658.129Z"
                    fill="black"
                  />
                  <path
                    d="M0.8125 0V792H791.193V0H0.8125ZM765.773 766.62H26.2225V25.38H765.773V766.62Z"
                    fill="black"
                  />
                  <path
                    d="M12.3712 -1360.27H-273.219V2200.43H12.3712V-1360.27Z"
                    fill="black"
                  />
                  <path
                    d="M1068.04 -1360.27H775.172V2228.28H1068.04V-1360.27Z"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="792" height="792" fill="#E3C3DA" />

              <image
                href="../images/freysmiles_insta.gif"
                width="792"
                height="792"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#mask-inverse-2)"
              />
            </svg>
          </div>
          <div className="w-[540px]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 792 792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <mask id="shape-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <path
                    d="M219.628 401.77C219.628 303.71 299.398 224.2 397.838 224.09C397.838 224.09 397.908 224.09 397.938 224.09C397.967 224.09 398.007 224.09 398.037 224.09C496.477 224.2 576.247 303.71 576.247 401.77C576.247 499.83 496.477 579.34 398.037 579.45C398.037 579.45 397.967 579.45 397.938 579.45C397.908 579.45 397.868 579.45 397.838 579.45C299.398 579.34 219.628 499.83 219.628 401.77ZM520.588 164.38H767.898V1063.42H1015.84V-268.16H767.898V-47.4501H520.588V164.39V164.38ZM-218.062 -268.16V1063.43H29.8775V842.89H276.487V631.05H29.8775V-268.16H-218.062Z"
                    fill="black"
                  />
                </mask>
              </defs>

              <rect width="100%" height="100%" fill="#AA4032" />

              <foreignObject width="100%" height="100%" mask="url(#shape-mask)">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  width="792"
                  height="792"
                  style={{ display: "block" }}
                >
                  <source src="../images/retaintracing.mp4" type="video/mp4" />
                </video>
              </foreignObject>
            </svg>
          </div>
        </div> */}
        {/* <div className="flex justify-center items-center" style={{ width:'500px', position: 'relative'}}>

  <svg
  className="masksvgshape"
        width="100%"
        height="100%"
  
          viewBox="0 0 792 792"
   >
    <defs>

      <clipPath id="svg-path" clipPathUnits="userSpaceOnUse">
        <path d="M219.628 401.77C219.628 303.71 299.398 224.2 397.838 224.09C397.838 224.09 397.908 224.09 397.938 224.09C397.967 224.09 398.007 224.09 398.037 224.09C496.477 224.2 576.247 303.71 576.247 401.77C576.247 499.83 496.477 579.34 398.037 579.45C398.037 579.45 397.967 579.45 397.938 579.45C397.908 579.45 397.868 579.45 397.838 579.45C299.398 579.34 219.628 499.83 219.628 401.77ZM520.588 164.38H767.898V1063.42H1015.84V-268.16H767.898V-47.4501H520.588V164.39V164.38ZM-218.062 -268.16V1063.43H29.8775V842.89H276.487V631.05H29.8775V-268.16H-218.062Z"/>
      </clipPath>
    </defs>
  </svg>


  <video
    src="../images/retaintracing.mp4"
    autoPlay
    muted
    loop
    playsInline
    style={{
      // width: '100%',
      // height: 'auto',
  
      clipPath: 'url(#svg-path)',
      WebkitClipPath: 'url(#svg-path)',
    }}
  />
</div> */}

        {/* <div className="w-2/3 ml-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-32 min-h-screen">

    <div className="rounded-3xl overflow-hidden bg-[#FAFF00] flex flex-col">
      <div className="aspect-[3/4] w-full">
        <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
          <SimplePlane />
        </Curtains>
      </div>
      <div className="p-4 bg-white flex justify-between items-end text-black">
        <div>
          <p className="text-sm font-medium">Lorem Ipsum</p>
          <p className="text-xs text-gray-500">Dolor sit amet consectetur</p>
        </div>
        <p className="text-xs text-gray-500">10MG</p>
      </div>
    </div>

    <div className="rounded-3xl overflow-hidden bg-[#8B5E3C] flex flex-col">
      <div className="aspect-[3/4] w-full">
        <img
          src="https://source.unsplash.com/600x800/?cbd,box"
          alt="Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-white flex justify-between items-end text-black">
        <div>
          <p className="text-sm font-medium">Lorem Ipsum</p>
          <p className="text-xs text-gray-500">Adipiscing elit sed do</p>
        </div>
        <p className="text-xs text-gray-500">10MG</p>
      </div>
    </div>
  </div>
</div> */}

        <section className="bg-[#F1F1F1] sun-section">
          <div className="sun-wrapper">
            <div className="sun-content leading-none">
              <div className="frame-line line-1">Benefits</div>

              <div className="frame-connector connector-1" />
              <div className="frame-line line-2">of working</div>
              <div className="frame-connector connector-2" />
              <div className="frame-line line-3">with us</div>
            </div>

            <div className="sun-mask">
              <div className="rays">
                {rays.map((_, i) => (
                  <div className={`ray ray-${i}`} key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const RepeatText = ({ text = "MTS", totalLayers = 7 }) => {
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
      className="relative w-full bg-[#FEF9F8] overflow-hidden"
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
                  transform: `translateY(calc(-60% + ${i * 3}px))`,
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

function StackCards() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const topPathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const bottomPathLength = useTransform(scrollYProgress, [0.5, 1], [0, 1]);
  const textRef = useRef(null);
  const blockRef = useRef(null);
  const isInView = useInView(blockRef, {
    margin: "0px 0px -10% 0px",
    once: true,
  });

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "words, chars" });

    const tl = gsap.fromTo(
      split.chars,
      { color: "#d4d4d4" },
      {
        color: "#000000",
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      split.revert();
    };
  }, []);

  useEffect(() => {
    let activeCard = null;
    let mouseX = 0;
    let mouseY = 0;

    const updateHoverState = () => {
      const blocks = document.querySelectorAll(".card-block");
      let hoveredCard = null;

      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const isHovering =
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom;

        if (isHovering) hoveredCard = block;
      });

      if (hoveredCard !== activeCard) {
        if (activeCard) {
          gsap.to(activeCard, {
            "--br": "0px",
            duration: 0.2,
            ease: "power2.out",
            overwrite: true,
          });
        }

        if (hoveredCard) {
          gsap.to(hoveredCard, {
            "--br": "100px",
            duration: 0.4,
            ease: "power2.out",
            overwrite: true,
          });
        }

        activeCard = hoveredCard;
      }
    };

    const handlePointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateHoverState();
    };

    const handleScroll = () => {
      updateHoverState();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef}>
      <section className="bg-[#FEF9F8]">
        <div className="blockcontainer">
          <p>
            <span></span>
            <span></span>
          </p>
          <p>
            <span></span>
            <span></span>
          </p>
          <p>
            <span></span>
            <span></span>
          </p>
        </div>

        <div className="w-48 h-48 translate-x-1/3 -z-10">
          <Shape06 />
        </div>
        <div
          ref={textRef}
          className="mx-auto font-neuehaas45 mb-60 text-[1.6vw] max-w-[900px] leading-[1.3]"
        >
          Our doctors aren’t just orthodontists — they’ve gone the extra miles
          (and years) to become true specialists. Dr. Gregg holds lifetime board
          certification, and Dr. Daniel is wrapping his up this year — a level
          fewer than 25% of orthodontists reach. When it comes to Invisalign- we
          don’t just do it — we lead it. As the region’s top Diamond Plus
          providers, we’ve treated thousands of cases and helped shape how clear
          aligners are used today.
          <br />
          <br />
          <span>TL;DR: You’re in very good hands.</span>
        </div>

        {/* <div className="mb-10 text-[30px] max-w-[900px] leading-[1.3]">
   
          </div> */}
        <div className="font-neuehaas45 min-h-screen text-[16px] leading-[1.1] px-10">
          {/* Block 1 */}
          <div className="border-t border-black w-full">
            <div
              className="card-block relative flex justify-between items-start py-16 px-20 w-full overflow-hidden bg-black"
              style={{ "--br": "0px" }}
            >
              <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[#FEF9F8] before:transition-none before:rounded-[var(--br)]" />

              <div className="relative z-10 text-sm text-[#ff007f] ">
                ABO Treatment Standards
              </div>

              <div className="relative z-10 leading-tight max-w-4xl text-black">
                <div>
                  We strive to attain finished results consistent with the
                  American Board of Orthodontics (ABO) qualitative standards.
                  Our doctors place great priority on the certification and
                  recertification process, ensuring that all diagnostic records
                  adhere to ABO standards.
                </div>
              </div>

              <div className="relative z-10 text-sm text-[#ff007f]">
                LEARN MORE
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="border-t border-black w-full">
            <div
              className="card-block relative flex justify-between items-start py-16 px-20 w-full overflow-hidden bg-black"
              style={{ "--br": "0px" }}
            >
              <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[#FEF9F8] before:transition-none before:rounded-[var(--br)]" />

              <div className="relative z-10 text-sm text-[#ff007f] ">
                Board Certification Process
              </div>

              <div className="relative z-10  leading-tight max-w-4xl text-black">
                <div>
                  Currently, Dr. Gregg is a certified orthodontist and is
                  preparing cases for recertification. Dr. Daniel is in the
                  final stages of obtaining his initial certification.
                </div>
              </div>

              <div className="relative z-10 text-sm text-[#ff007f] ">
                LEARN MORE
              </div>
            </div>
          </div>

          {/* Block 3 */}
          <div className="border-t border-black w-full">
            <div
              className="card-block relative flex justify-between items-start py-16 px-20 w-full overflow-hidden bg-black"
              style={{ "--br": "0px" }}
            >
              <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[#FEF9F8] before:transition-none before:rounded-[var(--br)]" />

              <div className="relative z-10 text-sm text-[#ff007f] ">
                Diagnostic Record Accuracy
              </div>

              <div className="relative z-10 leading-tight max-w-4xl text-black">
                <div>
                  To complement our use of cutting-edge diagnostic technology,
                  we uphold the highest standards for our records, ensuring
                  accuracy and precision throughout the treatment process.
                </div>
              </div>

              <div className="relative z-10 text-sm text-[#ff007f] ">
                LEARN MORE
              </div>
            </div>
          </div>

          {/* Block 4 */}
          <div className="border-t border-black w-full">
            <div
              className="card-block relative flex justify-between items-start py-16 px-20 w-full overflow-hidden bg-black"
              style={{ "--br": "0px" }}
            >
              <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[#FEF9F8] before:transition-none before:rounded-[var(--br)]" />

              <div className="relative z-10 text-sm text-[#ff007f] ">
                Trusted Expertise
              </div>

              <div className="relative z-10 leading-tight max-w-4xl">
                <div>
                  Our office holds the distinction of being the
                  longest-standing, active board-certified orthodontic office in
                  the area. With four offices in the Lehigh Valley, we have been
                  providing unparalleled orthodontic care for over four decades.
                </div>
              </div>

              <div className="relative z-10 text-sm text-[#ff007f] ">
                LEARN MORE
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

const About = () => {
  const timelineRef = useRef(null);
  const [swiper, setSwiper] = useState(null); // (vertical) swiper
  const [swiper2, setSwiper2] = useState(null); // (horizontal) swiper

  useEffect(() => {
    gsap.fromTo(
      ".lines__line.mod--timeline-1",
      { width: "0" },
      {
        width: "340px",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".lines__line.mod--timeline-2",
      { width: "0" },
      {
        width: "980px",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".timeline__line2",
      { width: "0" },
      {
        width: "100%",
        duration: 1,
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top center",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  useEffect(() => {
    if (swiper2) {
      swiper2.slideTo(2, 0);
    }

    const handleScroll = () => {
      const timelineElement = timelineRef.current;
      if (timelineElement) {
        const offset = timelineElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (offset.top < 0 && offset.bottom - windowHeight > 0) {
          const perc = Math.round(
            (100 * Math.abs(offset.top)) / (offset.height - windowHeight)
          );

          if (perc > 10 && perc < 30) {
            swiper?.slideTo(0, 1000);
            swiper2?.slideTo(0, 1000);
          } else if (perc >= 30 && perc < 55) {
            swiper?.slideTo(1, 1000);
            swiper2?.slideTo(1, 1000);
          } else if (perc >= 55) {
            swiper?.slideTo(2, 1000);
            swiper2?.slideTo(2, 1000);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [swiper, swiper2]);

  return (
    <section
      className="bg-[#FEF9F8] timeline-section timeline-section--timeline"
      ref={timelineRef}
    >
      <div className="timeline_sticky">
        <div className="content-timeline">
          <div className="timeline__lines-wrap">
            <div className="lines mod--timeline">
              <div className="lines__line mod--timeline-1"></div>
              <div className="lines__line mod--timeline-2"></div>
            </div>
          </div>

          {/* (Horizontal Swiper) */}
          <div className="timeline-grid mod--timeline w-layout-grid">
            <div className="timeline__col mod--2">
              <Swiper
                onSwiper={(swiper) => setSwiper2(swiper)}
                mousewheel={true}
                slidesPerView={1}
                spaceBetween={20}
                speed={800}
                allowTouchMove={false}
                initialSlide={2}
                wrapperClass="horizontal-wrapper"
                className="swiper swiper-reviews-numb"
              >
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2001</div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2009</div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide slide--reviews-numb">
                  <div className="timeline__year">2024</div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          <div className="timeline__line2"></div>
          <Swiper
            onSwiper={setSwiper}
            mousewheel={true}
            slidesPerView={1}
            speed={1000}
            allowTouchMove={false}
            initialSlide={0}
            direction="vertical"
            wrapperClass="vertical-wrapper"
            breakpoints={{
              992: {
                spaceBetween: 0,
                centeredSlides: false,
                slidesPerView: 1,
              },
              320: {
                spaceBetween: 48,
                centeredSlides: true,
                slidesPerView: 1,
              },
            }}
            className="swiper swiper--reviews"
          >
            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  <img
                    src="../images/diamondinvismockup1.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
                  {/* <div className="timeline__ico-title">
                    Invisalign <br />
                    Pioneers
                  </div> */}
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      Lehigh Valley&apos;s first Invisalign provider. Continuing
                      to hone our skill-set while testing new aligner systems.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Top 1%
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Diamond Plus
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Second Slide - Innovation */}

            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  <img
                    src="../images/doctorphotomasked.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
                  {/* <div className="timeline__ico-title">
                    Expertise <br />
                    Defined
                  </div> */}
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      Our doctors bring a combined 60 years of experience.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>Board
                        Certification
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>ABO
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {/* Third Slide - Board Certification (1995) */}
            <SwiperSlide className="swiper-slide slide--reviews">
              <div className="timeline-grid mod--timeline2">
                <div className="timeline__col mod--1">
                  <img
                    src="../images/fsajo.png"
                    loading="lazy"
                    alt=""
                    className="timeline__ico"
                  />
                  {/* <div className="timeline__ico-title">
                    Leading <br />
                    Recognition
                  </div> */}
                </div>
                <div className="timeline__col mod--4">
                  <div className="timeline__txt-block">
                    <p className="timeline__p">
                      We’ve had more patients featured on the cover of the
                      American Journal of Orthodontics than any other practice.
                    </p>
                    <div className="timeline__tags">
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>i-Tero
                      </div>
                      <div className="btn-tag">
                        <span className="btn-tag__star"></span>3D Fabrication
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

const ProjectImage = ({
  imageUrl,
  elems = 4,
  index = 0,
  stagger = -0.12,
  initialScale = 1.2,
  ease = "power2.inOut",
  duration = 0.8,
  animate = "scale",
  origin = "50% 50%",
  className = "project-img-wrapper",
}) => {
  const containerRef = useRef(null);
  const innerElemsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const innerElems = innerElemsRef.current;

    if (!container || innerElems.length === 0) return;

    gsap.set([container, innerElems[0]], { transformOrigin: origin });

    const hoverTimeline = gsap.timeline({ paused: true });

    gsap.set(innerElems[0], {
      [animate]: initialScale,
    });

    hoverTimeline.to(
      innerElems,
      {
        [animate]: (i) => +!i,
        duration,
        ease,
        stagger,
      },
      0
    );

    const handleMouseEnter = () => hoverTimeline.play();
    const handleMouseLeave = () => hoverTimeline.reverse();

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [elems, stagger, initialScale, ease, duration, animate, origin]);

  return (
    <div ref={containerRef} className={className}>
      {Array.from({ length: elems }).map((_, i) =>
        i === 0 ? (
          <div key={i} className="image-element__wrap">
            <div
              ref={(el) => (innerElemsRef.current[i] = el)}
              className="image__element"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          </div>
        ) : (
          <div
            key={i}
            ref={(el) => (innerElemsRef.current[i] = el)}
            className="image__element"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )
      )}
    </div>
  );
};

function MoreThanSmiles() {


  // const imagesContainerRef = useRef(null);

  // const [images, setImages] = useState([
  //   "../images/morethansmiles1.png",
  //   "../images/morethansmiles2.png",
  //   "../images/morethansmiles3.png",
  //   "../images/morethansmiles4.png",
  //   "../images/morethansmiles5.png",
  //   "../images/morethansmiles6.png",
  // ]);

  // useEffect(() => {
  //   if (!imagesContainerRef.current) return;

  //   const imageElements =
  //     imagesContainerRef.current.querySelectorAll(".gallery-img");
  //   const timeline = gsap.timeline({ ease: "none" });

  //   let z = 100000000000;
  //   let moveLeft = true;

  //   // last image=highest z-index
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           imageElements.forEach((image, index) => {
  //             gsap.set(image, { zIndex: z - index });
  //           });

  //           timeline.fromTo(
  //             imageElements,
  //             {
  //               x: (i) => (i % 2 === 0 ? -400 : 400),
  //               y: "300%",
  //             },
  //             {
  //               x: 0,
  //               y: 0,
  //               duration: 1.5,
  //               stagger: -0.4,
  //               rotation: () => 20 * Math.random() - 10,
  //             }
  //           );

  //           timeline.play();
  //           observer.disconnect();
  //         }
  //       });
  //     },
  //     { threshold: 0.2 } // Trigger when 20% of the container is visible
  //   );

  //   observer.observe(imagesContainerRef.current);

  //   // Move clicked image to the back of the stack
  //   imageElements.forEach((image) => {
  //     image.addEventListener("click", () => {
  //       const moveDirection = moveLeft ? "-125%" : "125%";
  //       moveLeft = !moveLeft; // alternate direction each click

  //       // lowest index in stack
  //       let minZIndex = Infinity;
  //       imageElements.forEach((img) => {
  //         let zIndex = parseInt(img.style.zIndex, 10);
  //         if (zIndex < minZIndex) {
  //           minZIndex = zIndex;
  //         }
  //       });

  //       // the clicked image becomes the lowest index
  //       z = minZIndex - 1;

  //       timeline
  //         .to(image, { x: moveDirection, duration: 0.5 }) // move out
  //         .to(image, { zIndex: z, duration: 0.01 }) // update z-index when it's away from stack
  //         .to(image, { x: 0, duration: 0.5 }); // move back under the stack
  //     });
  //   });

  //   return () => {
  //     imageElements.forEach((image) =>
  //       image.removeEventListener("click", () => {})
  //     );
  //   };
  // }, [images]);
 

  const cardRefs = useRef([]);

  useEffect(() => {
    const updateScales = () => {
      const centerX = window.innerWidth / 2;

      cardRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - cardCenter);

        const scale = gsap.utils.clamp(0.9, 1.2, 1.2 - distance / 600);
        gsap.to(el, {
          scale,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("scroll", updateScales);
    window.addEventListener("resize", updateScales);
    updateScales();

    return () => {
      window.removeEventListener("scroll", updateScales);
      window.removeEventListener("resize", updateScales);
    };
  }, []);


  const itemsRef = useRef([]);
  const [scrollY, setScrollY] = useState(0);


  const textRef = useRef(null);
  const blockRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "words, chars" });

    const tl = gsap.fromTo(
      split.chars,
      { color: "#d4d4d4" },
      {
        color: "#000000",
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      split.revert();
    };
  }, []);

  const canvasContainerRef = useRef();

  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const images = [
    "/images/morethansmiles1.png",
    "/images/morethansmiles2.png",
    "/images/morethansmiles3.png",
    "/images/morethansmiles4.png",
    "/images/morethansmiles5.png",
    "/images/morethansmiles6.png",
  ];
  
  useEffect(() => {
    if (!sectionRef.current || imageRefs.current.length === 0) return;
  
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=1500",
        scrub: true,
        pin: true,
      },
    });
  
    const customOrder = [0, 4, 1, 5, 2, 3];
  
    customOrder.forEach((index, i) => {
      const img = imageRefs.current[index];
      if (!img) return;
  
      tl.fromTo(
        img,
        { yPercent: 100 },
        {
          yPercent: -200,
  
          ease: "power2.out",
          duration: 1,
        },
        i * 0.2 
      );
    });
  
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);
  
  


  
  return (
    <>
<section
  ref={sectionRef}
  className="w-full h-screen px-6 md:px-12 py-10 relative"
>
<div className="flex justify-center items-end w-full absolute bottom-0 left-0 z-10 gap-x-[1.5vw] pointer-events-none">
  {images.map((src, i) => (
    <div key={i} className="w-[14vw] flex justify-center">
      <img
        ref={(el) => (imageRefs.current[i] = el)}
        src={src}
        className="w-full h-auto"
      />
    </div>
  ))}
</div>

  <div className="flex flex-row items-center justify-between  h-full">
  <p className="font-chivomono max-w-[600px] text-[0.95rem] leading-snug uppercase tracking-wide">
      We’re committed to making world-class orthodontic care accessible to all.
      In 2011, we launched More Than Smiles to provide treatment and promote
      community education around dental and orthodontic health. Learn how to
      nominate someone at our website.
    </p>
    <h1 className="text-[2.2vw] font-neuehaas45 uppercase tracking-wide mb-12">
      <div>Nominate someone who deserves</div>
      <div className="-ml-[100px]">a confident smile through our</div>
      <div className="-mr-[100px]">non-profit More Than Smiles.</div>
    </h1>
    <div className="z-10 absolute right-[3vw]">
              <a
                href="https://morethansmiles.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-full cursor-pointer"
                  viewBox="-50 -50 100 100"
                >
                  <circle
                    r="22.4"
                    fill="none"
                    stroke="#DFDFDF"
                    stroke-width=".5"
                  />
                  <text
                    className="txt fill-black text-[5.5px] tracking-[0.2px] text-center font-neue-montreal"
                    x="0"
                    y="2"
                    textAnchor="middle"
                  >
                    Nominate
                  </text>
                </svg>
              </a>
            </div>
  </div>

</section>


      <div
        ref={canvasContainerRef}
        style={{
          position: "absolute",
          // inset: 0,
          // zIndex: 0,
          width: "50vw",
          height: "100vh",
        }}
      >
        <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
          <PixelImage
            containerRef={canvasContainerRef}
            imgSrc="/images/portraitglass.jpg"
          />
        </Canvas>
      </div>
      {/* <section className="px-20 py-20 bg-[#FEF9F8] text-black flex flex-col justify-between">
        <div className="flex justify-between items-end text-[14px]">
          <div className="space-y-2">
            <section className="morethansmiles">
              <div ref={imagesContainerRef} className="imagestack">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className="gallery-img"
                    alt="gallery"
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section> */}

    </>
  );
}

function GridLayout() {
  useGSAP(() => {
    const isTouchDevice = "ontouchstart" in window;

    let targetMedias = gsap.utils.toArray(".media");

    const parallaxMouse = () => {
      document.addEventListener("mousemove", (e) => {
        targetMedias.forEach((targetMedia, i) => {
          const deltaX = (e.clientX - window.innerWidth / 2) * 0.01;
          const deltaY = (e.clientY - window.innerHeight / 2) * 0.01;

          gsap.to(targetMedia, {
            x: deltaX,
            y: deltaY,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          });
        });
      });

      document.addEventListener("mouseleave", (e) => {
        targetMedias.forEach((targetMedia) => {
          gsap.to(targetMedia, {
            x: 0,
            y: 0,
            scale: 1.02,
            duration: 0.75,
            ease: "power4",
          });
        });
      });
    };

    if (!isTouchDevice) {
      parallaxMouse();
    }
  });

  return (
    <section>
      <div className="grid grid-cols-8 h-[60dvh]">
        <div className="relative col-span-4 lg:col-span-5 h-full place-content-center place-items-center bg-[#20282D] text-center flex gap-2 p-8">
          <h2 className="text-2xl break-words lg:text-4xl xl:text-6xl font-editorial-new text-[#1d1f1b]">
            <span
              className="text-4xl lg:text-6xl xl:text-8xl font-nautica"
              style={{
                color: "#434840",
                WebkitTextFillColor: "#6a7265",
                WebkitTextStroke: "1px #434840",
              }}
            >
              We{" "}
            </span>
            have 50+ years of experience
          </h2>
          <GalaxyShape className="absolute inset-0 hidden object-cover object-center w-full h-full p-8 lg:block lg:p-16 text-[#444941]" />
        </div>
        <div className="relative h-full col-span-4 overflow-hidden lg:col-span-3">
          <img
            src="/../../images/pexels-cedric-fauntleroy-4269276_1920x2880.jpg"
            alt="dental chair"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              25,000+{" "}
            </span>
            patients treated
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/aurela-redenica-VuN-RYI4XU4-unsplash_2400x3600.jpg"
            alt="invisalign aligners and case"
            className="absolute inset-0 object-cover object-bottom w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              ABO{" "}
            </span>
            certified
          </p>
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/goby-D0ApR8XZgLI-unsplash_2400x1467.jpg"
            alt="hand reaching towards another hand offering pink toothbrush"
            className="absolute inset-0 object-cover object-right w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              10+{" "}
            </span>
            members
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/pexels-cedric-fauntleroy-4269491_1920x2880.jpg"
            alt="dental equipment"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
      </div>
      <div className="grid grid-cols-9 lg:h-[50vh]">
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">4 </span>
            locations
          </p>
        </div>
        <div className="relative min-h-[50vh] h-full col-span-9 lg:col-span-3 place-content-center overflow-hidden">
          <img
            src="/../../images/tony-litvyak-glPVwPr1FKo-unsplash_2400x3600.jpg"
            alt="woman smiling"
            className="absolute inset-0 object-cover object-center w-full h-full media"
          />
        </div>
        <div className="min-h-[50vh] h-full col-span-9 bg-[#988193] text-[#f4f4f4] lg:col-span-3 place-content-center place-items-center p-8">
          <p className="text-2xl tracking-wide text-center font-editorial-new">
            <span className="block uppercase font-agrandir-grandheavy">
              advanced{" "}
            </span>
            technology
          </p>
        </div>
      </div>
    </section>
  );
}
