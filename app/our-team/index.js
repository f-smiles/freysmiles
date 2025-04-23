"use client";
import { Item } from "../../utils/Item";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import { OrbitControls, Environment } from "@react-three/drei";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { SplitText } from "gsap-trial/all";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import {
  TextureLoader,
  CubeCamera,
  WebGLCubeRenderTarget,
  LinearMipmapLinearFilter,
  RGBFormat,
} from "three";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const vertexShader = `
uniform vec2 uOffset;
varying vec2 vUv;
const float PI = 3.14159265359;

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
    position.x += sin(uv.y * PI) * offset.x;
    position.y += sin(uv.x * PI) * offset.y;
    return position;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    pos = deformationCurve(pos, uv, uOffset);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;
const fragmentShader = `
uniform sampler2D iChannel0;
uniform vec2 uMeshSize;
uniform vec2 uMediaSize;
uniform vec2 uOffset;
uniform float uOpacity;
uniform float uMouseEnter;
uniform float uMouseEnterMask;
varying vec2 vUv;

vec2 distort(vec2 uv) {
    uv -= 0.5;
    float mRatio = uMeshSize.x / uMeshSize.y;
    float strength = 1.0 - (10.0 * (1.0 - uMouseEnter)) * (pow(uv.x * mRatio, 2.0) + pow(uv.y, 2.0));
    uv *= strength;
    uv += 0.5;
    return uv;
}

void main() {
    vec2 uv = vUv;
    uv = distort(uv);
    vec4 tex = texture2D(iChannel0, uv);
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
}
`;

const ShaderPlane = ({ imageUrl, mouse }) => {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, imageUrl);

  const uniforms = useMemo(
    () => ({
      iChannel0: { value: texture },
      uMeshSize: { value: new THREE.Vector2(300, 400) },
      uMediaSize: {
        value: new THREE.Vector2(texture.image.width, texture.image.height),
      },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uOpacity: { value: 1.0 },
      uMouseEnter: { value: 0 },
      uMouseEnterMask: { value: 0 },
    }),
    [texture]
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const targetX = mouse.current.x;
    const targetY = mouse.current.y;

    gsap.to(meshRef.current.position, {
      x: (targetX - 0.5) * window.innerWidth,
      y: -(targetY - 0.5) * window.innerHeight,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(uniforms.uOffset.value, {
      x: (targetX - 0.5) * 0.2,
      y: (targetY - 0.5) * 0.2,
      duration: 0.3,
    });

    gsap.to(uniforms.uMouseEnter, {
      value: 1,
      duration: 1.2,
      ease: "power2.out",
    });
    gsap.to(uniforms.uMouseEnterMask, {
      value: 1,
      duration: 0.7,
      ease: "power2.out",
    });
  });

  return (
    <mesh ref={meshRef} scale={[300, 400, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

const images = [
  "../images/team_members/Adriana-Photoroom.jpg",
  "../images/team_members/Nicollewaving.png",
  "../images/team_members/Lexiworking.png",
  "../images/team_members/Elizabethaao.png",
  "../images/team_members/Alyssascan.png",
];

function ImageCard({ texture, index }) {
  const ref = useRef();
  const z = index * -1.5;
  const x = 0;
  const rotation = useMemo(() => [0, 0.1 * index, 0], [index]);

  return (
    <group ref={ref} position={[x, 0, z]} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2, 3, 0.02]} />
        <meshPhysicalMaterial
          map={texture}
          roughness={0.1}
          metalness={0.2}
          transparent
          transmission={0.2}
          thickness={0.1}
          ior={1.1}
          reflectivity={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          toneMapped={false}
          opacity={1}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const textures = useLoader(THREE.TextureLoader, images);

  return (
    <>
      {textures.map((tex, i) => (
        <ImageCard key={i} texture={tex} index={i} />
      ))}
      <Environment preset="sunset" />
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1.5} position={[5, 5, 5]} />

      <OrbitControls enableZoom={false} />
    </>
  );
}
const ShaderHoverEffect = () => {
  const images = [
    {
      name: "Alyssa",
      url: "../images/team_members/Alyssascan.png",
      description: "Treatment Coordinator",
    },
    {
      name: "Nicolle",
      url: "../images/team_members/Nicollewaving.png",
      description: "Specialized Orthodontic Assistant",
    },
    {
      name: "Lexi",
      url: "../images/team_members/Lexiworking.png",
      description: "Treatment Coordinator",
    },
    {
      name: "Elizabeth",
      url: "../images/team_members/Elizabethaao.png",
      description: "Patient Services",
    },
    {
      name: "Adriana",
      url: "../images/team_members/Adriana-Photoroom.jpg",
      description: "Insurance Coordinator",
    },
  ];
  const [hoveredImage, setHoveredImage] = useState(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    mouse.current.x = e.clientX / window.innerWidth;
    mouse.current.y = e.clientY / window.innerHeight;
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 100] }}>
        {hoveredImage && <ShaderPlane imageUrl={hoveredImage} mouse={mouse} />}
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col justify-between space-y-6 text-center">
          {images.map((img) => (
            <div
              key={img.name}
              className="flex flex-row justify-between font-neuehaasdisplaythin text-xl cursor-pointer w-96"
              onMouseEnter={() => setHoveredImage(img.url)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <span>{img.name}</span>
              <span className="text-sm text-gray-400">{img.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default function OurTeam() {
  const panelRefs = useRef([]);
  const titleRef = useRef(null);
  const [isRevealing, setIsRevealing] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    gsap.set(panelRefs.current, { y: "0%" });

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
    });

    if (titleRef.current) {
      const split = new SplitText(titleRef.current, {
        type: "chars",
        charsClass: "char",
      });

      split.chars.forEach((char) => {
        const wrap = document.createElement("span");
        wrap.classList.add("char-wrap");

        if (char.textContent === " ") {
          char.innerHTML = "&nbsp;";
        }

        char.parentNode.insertBefore(wrap, char);
        wrap.appendChild(char);
      });

      tl.fromTo(
        split.chars,
        {
          xPercent: 105,
          opacity: 0,
          transformOrigin: "0% 50%",
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.042,
          delay: 0.2,
        }
      );

      tl.to(
        titleRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "+=0.2"
      );
    }

    tl.fromTo(
      panelRefs.current,
      { y: "0%" },
      {
        y: "-100%",
        duration: 1.2,
        stagger: 0.08,
        ease: [0.65, 0, 0.35, 1],
      },
      "+=0.1"
    );

    tl.call(
      () => {
        setIsRevealing(false);
        setShowContent(true);
      },
      null,
      "+=0.2"
    );
  }, []);

  // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   return () => {
  //     if (ScrollTrigger) {
  //       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //     }
  //   };
  // }, []);

  const [index, setIndex] = useState(1);
  const [switchDoctor, setSwitchDoctor] = useState(false);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const doctorBioRef = useRef(null);

  const toggleSwitchDoctor = () => {
    setSwitchDoctor((prevState) => !prevState);
    setAnimationPlayed(false);
  };

  useEffect(() => {
    if (isRevealing) return;

    const clearAnimation = () => {
      gsap.killTweensOf(doctorBioRef.current);
    };

    const startAnimation = () => {
      setTimeout(() => {
        const doctorBio = doctorBioRef.current;
        if (doctorBio) {
          const splitText = new SplitText(doctorBio, { type: "lines" });

          gsap.set(doctorBio, { visibility: "visible" });

          gsap.from(splitText.lines, {
            duration: 2,
            xPercent: 20,
            autoAlpha: 0,
            ease: "Expo.easeOut",
            stagger: 0.12,
          });
        }
      }, 200);
    };

    if (doctorBioRef.current) {
      clearAnimation();
      startAnimation();
    }

    return () => clearAnimation();
  }, [switchDoctor, isRevealing]);

  useEffect(() => {
    if (!showContent) return;

    const container = document.querySelector(".horizontalScroller");
    if (!container) return;

    const containerWidth =
      container.scrollWidth - document.documentElement.clientWidth;

    gsap.to(container, {
      x: () => -containerWidth,
      scrollTrigger: {
        markers: false,
        trigger: ".horizontalWrapper",
        start: "top top",
        scrub: 0.5,
        pin: ".horizontalContainer",
        end: () => `+=${containerWidth}`,
        invalidateOnRefresh: true,
      },
    });
  }, [showContent]);

  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isFocused, setIsFocused] = useState(false);
  const isTouchDevice = "ontouchstart" in window;

  useEffect(() => {
    if (!isTouchDevice) {
      const moveCursor = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", moveCursor);
      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    }
  }, []);

  const greenCursorStyle = {
    position: "fixed",
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    width: isFocused ? "100px" : "10px",
    height: isFocused ? "100px" : "10px",
    borderRadius: "50%",
    backgroundColor: isFocused ? "rgb(210,246,90)" : "#FFFFFF",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    transition: "width 0.5s, height 0.5s, background-color 0.25s",
    zIndex: 9999,
    fontFamily: "NeueMontrealBook",
  };

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");

    lines.forEach((line) => {
      gsap.fromTo(
        line.querySelectorAll(".stagger-letter"),
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "-10%",
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  const textLines = [{ text: "Meet Our Team" }];

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");

    lines.forEach((line) => {
      const letters = line.querySelectorAll(".stagger-letter");

      gsap.fromTo(
        letters,
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  const lines = [
    "Our experience spans over 50 years-a testament to the precision,",
    "accuracy, and relevance of our vision, demonstrating our ability to adapt",
    "to the ever-changing nature of our industry.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const imageRefs = useRef([]);
  useEffect(() => {
    if (imageRefs.current[currentIndex]) {
      gsap.fromTo(
        imageRefs.current[currentIndex],
        {
          y: "100%",
          scale: 1.6,
        },
        {
          y: "0%",
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, [currentIndex]);

  const teamMembers = [
    {
      id: 1,
      name: "Alyssa",
      src: "../images/team_members/Alyssascan.png",
      alt: "Image 1",
      description: "Treatment Coordinator",
    },
    {
      id: 2,
      name: "Nicolle",
      src: "../images/team_members/Nicollewaving.png",
      alt: "Image 2",
      description: "Specialized Orthodontic Assistant",
    },
    {
      id: 3,
      name: "Lexi",
      src: "../images/team_members/Lexiworking.png",
      alt: "Image 3",
      description: "Treatment Coordinator",
    },
    {
      id: 4,
      name: "Elizabeth",
      src: "../images/team_members/Elizabethaao.png",
      alt: "Image 4",
      description: "Patient Services",
    },
    {
      id: 5,
      name: "Adriana",
      src: "../images/team_members/Adriana-Photoroom.jpg",
      alt: "Image 5",
      description: "Insurance Coordinator",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMember = teamMembers[selectedIndex];

  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const lastSectionRef = useRef(null);
  useLayoutEffect(() => {
    if (!wrapperRef.current || !lastSectionRef.current ) return;
    ScrollTrigger.getAll().forEach(t => t.kill());
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: lastSectionRef.current,
        start: "top top",
        end: `+=${window.innerWidth}`,
        scrub: 1,
        pin: wrapperRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: true
      }
    });
  

    tl.to(wrapperRef.current, { x: "-100vw", ease: "none" });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);
  

  return (
    <div>
      
      <div
        className={`fixed inset-0 z-50 flex transition-transform duration-1000 ${
          isRevealing ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (panelRefs.current[i] = el)}
            className="h-full w-1/4 bg-[#191919]"
          />
        ))}

        <div className="absolute inset-0 z-40 flex justify-center items-center">
          <h2 ref={titleRef} className="content__title1">
            <span style={{ lineHeight: "1.2" }}>Meet Our Team</span>
          </h2>
        </div>
      </div>

      <div className="bg-black relative ">
        <div ref={wrapperRef} className="flex w-screen">
          <div className="h-screen sticky top-0 py-[10em] sm:py-[10em] border-l border-b border-r border-black w-3/5 bg-[#EDECE6] rounded-[24px]">
            <section className="rounded-[24px] flex justify-center items-center bg-[#EDECE6]">
              <div className=" flex justify-center gap-6 overflow-hidden">
                <div className="w-[275px] mr-10">
                  <figure className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      style={{
                        position: "absolute",
                        width: "100%",
                        transition: "transform 1s",
                        transform: switchDoctor
                          ? "translateX(100%)"
                          : "translateX(0)",
                      }}
                      src="../../images/team_members/GreggFrey.png"
                      alt="Dr. Gregg Frey"
                    />
                    <img
                      style={{
                        position: "absolute",
                        width: "100%",
                        transition: "transform 1s",
                        transform: switchDoctor
                          ? "translateX(0)"
                          : "translateX(-100%)",
                      }}
                      src="../../images/team_members/DanFrey.png"
                      alt="Dr. Daniel Frey"
                    />
                  </figure>
                  <figcaption className="mt-5 ">
                    <p className="text-[16px] font-neuehaas45">
                      {!switchDoctor ? "Dr. Gregg Frey" : "Dr. Dan Frey"}
                    </p>
                    <p className="text-[12px] font-neuehaas45">
                      {!switchDoctor ? "DDS" : "DMD, MSD"}
                    </p>
                  </figcaption>
                </div>

                <div className="w-[200px]">
                  <figure
                    className="relative grayscale w-full aspect-[3/4] overflow-hidden cursor-pointer"
                    onClick={toggleSwitchDoctor}
                  >
                    <img
                      style={{
                        position: "absolute",
                        width: "100%",
                        transition: "transform 1s",
                        transform: switchDoctor
                          ? "translateX(0)"
                          : "translateX(-100%)",
                      }}
                      src="../../images/team_members/GreggFrey.png"
                      alt="Dr. Daniel Frey"
                    />
                    <img
                      style={{
                        position: "absolute",
                        width: "100%",
                        transition: "transform 1s",
                        transform: switchDoctor
                          ? "translateX(100%)"
                          : "translateX(0)",
                      }}
                      src="../../images/team_members/DanFrey.png"
                      alt="Dr. Gregg Frey"
                    />
                  </figure>
                </div>
              </div>
            </section>
          </div>

          <div ref={scrollRef} className="w-2/5 ">
            <div className="rounded-[24px] border-b border-b border-black bg-[#EDECE6]  py-[10em] sm:py-[10em] h-screen mx-auto lg:px-8 ">
              <div className="flex flex-col overflow-hidden">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    className="font-neuehaas45  text-[14px] overflow-hidden text-black"
                    initial={{
                      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                      y: 20,
                    }}
                    animate={
                      isRevealing
                        ? {}
                        : {
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                            y: 0,
                          }
                    }
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + index * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              <div className=" gap-8 px-6 py-1 mx-auto lg:px-8">
                <div className="lg:col-span-6">
                  <div
                    id="controls"
                    className="font-neuehaas35 flex items-center justify-start row-span-1 row-start-1 space-x-4 "
                  >
                    <button className=" z-0 p-3" onClick={toggleSwitchDoctor}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 100 267"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="black"
                        fill="none"
                        strokeWidth="10"
                        transform="rotate(-90)"
                      >
                        <path
                          d="M49.894 2.766v262.979"
                          strokeLinecap="square"
                        ></path>
                        <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
                      </svg>
                    </button>
                    <span className="text-[12px] text-black">
                      0{!switchDoctor ? index : index + 1} / 02
                    </span>
                    <button className="z-3" onClick={toggleSwitchDoctor}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 100 267"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="black"
                        fill="none"
                        strokeWidth="10"
                        transform="rotate(90)"
                      >
                        <path
                          d="M49.894 2.766v262.979"
                          strokeLinecap="square"
                        ></path>
                        <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="max-w-[600px]">
                    <motion.div
                      className="h-px mb-10 bg-gray-300"
                      initial={{ width: 0, transformOrigin: "left" }}
                      animate={isRevealing ? {} : { width: "40vw" }}
                      transition={{
                        duration: 1,
                        delay: 0.4,
                        ease: "easeInOut",
                      }}
                    ></motion.div>
                    {/* doctor bio */}
                    {switchDoctor ? (
                      <p
                        ref={doctorBioRef}
                        className="font-neuehaas45 text-black"
                      >
                        Dr. Daniel Frey pursued his pre-dental requisites at the
                        University of Pittsburgh, majoring in Biology. Dr. Frey
                        excelled in his studies and was admitted to Temple
                        University&apos;s dental school, graduating at the top
                        of his class with the prestigious Summa Cum Laude
                        designation. Continuing his education, Dr. Frey was
                        admitted to the esteemed orthodontic residency program
                        at the University of the Pacific in San Francisco where
                        he worked with students and faculty from around the
                        world and utilized cutting-edge orthodontic techniques.
                        During his time in San Francisco, he conducted research
                        in three-dimensional craniofacial analysis and earned
                        his Master of Science degree. Dr. Frey is a member of
                        the American Association of Orthodontists and the
                        American Dental Association. In his leisure time, he
                        enjoys staying active outdoors, camping, playing music,
                        and spending time with loved ones.
                      </p>
                    ) : (
                      <p
                        style={{ visibility: "hidden" }}
                        ref={doctorBioRef}
                        className="font-neuehaas45 text-black"
                      >
                        Dr. Gregg Frey is an orthodontist based in Pennsylvania,
                        who graduated from Temple University School of Dentistry
                        with honors and served in the U.S. Navy Dental Corps
                        before establishing his practice in the Lehigh Valley.
                        He is a Diplomat of the American Board of Orthodontics
                        and has received numerous distinctions, accreditations,
                        and honors, including being named one of America&apos;s
                        Top Orthodontists by the Consumer Review Council of
                        America. This distinction is held by fewer than 25% of
                        orthodontists nationwide. ABO certification represents
                        the culmination of 5-10 years of written and oral
                        examinations and independent expert review of actual
                        treated patients. Recently Dr. Frey voluntarily
                        re-certified. Dr. Frey enjoys coaching soccer, vintage
                        car racing, and playing the drums.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <section
              ref={lastSectionRef}
              className=" h-screen flex justify-center items-center rounded-[24px] bg-[#EDECE6]"
            >
              <p className="text-[16px] font-neuehaas45 text-center leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>
          </div>
        
          <div style={{ height: "200vh" }} />

        </div>
        <section

  className="min-h-screen bg-black overflow-hidden translate-x-full"
>
  <div className="w-screen h-screen grid grid-cols-3 grid-rows-3 text-[#333] font-neuehaas45 text-[14px] leading-relaxed">
    
    {/* Row 1 */}
    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-r border-black"></div>
    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-r border-black"></div>
    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-black"></div>

    {/* Row 2 */}
    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-r border-black">
      <a href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/">
        <p className="font-neuehaas35 ">
          Our members have received the designation of Specialized Orthodontic Assistant. 
          This is a voluntary certification program started by the American Association of Orthodontists 
          to recognize those in the profession for their knowledge and experience.
        </p>
      </a>
    </div>

    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-r border-black">
      <p className="font-neuehaas35 ">
        Fun fact — our team is made up of former FreySmiles patients, something we think is important, 
        because we have all experienced treatment and can help guide you through it.
      </p>
    </div>

    <a
      href="https://g.co/kgs/Sds93Ha"
      className="bg-[#f3f2ee] rounded-[20px] p-8 border-b border-black"
    >
      <p className="font-neuehaas35 ">
        This office is on 🔥! The orthodontists as well as every single staff member.
      </p>
    </a>

    {/* Row 3 */}
    <div className="bg-[#f3f2ee] rounded-[20px] p-8 border-r border-black">
      <p className="font-neuehaas35 ">Trained in CPR and first aid</p>
    </div>

    <a
      href="https://g.co/kgs/YkknjNg"
      className="bg-[#f3f2ee] rounded-[20px] p-8 border-r border-black"
    >
      <p className="font-neuehaas35 ">
        Had a wonderful experience at FreySmiles. Everyone is extremely professional, 
        polite, timely. Would highly recommend! — TK
      </p>
    </a>

    <div className="bg-[#f3f2ee] rounded-[20px] p-8">
      <p className="font-neuehaas35 ">
        We’ve invested in in-office trainings with leading clinical consultants 
        that have helped us develop systems and protocols streamlining our processes.
      </p>
    </div>
  </div>
</section>
        <div style={greenCursorStyle}>
          {isFocused && (
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              View
            </span>
          )}
        </div>


        <section className="overflow-x-auto overflow-y-hidden lg:overflow-hidden">
          <div
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
            className=" horizontalContainer"
          >
            <div className="horizontalWrapper">
              <div className="horizontalScroller">
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalFilled">
                    <a href="https://www.trapezio.com/training-resources/course-outlines/soa-prep-course-outline/">
                      <p>
                        Our members have received the designation of Specialized
                        Orthodontic Assistant. This is a voluntary certification
                        program started by the American Association of
                        Orthodontists to recognize those in the profession for
                        their knowledge and experience.
                      </p>
                    </a>
                  </div>

                  <div className=" horizontalItem horizontalFilled">
                    <p>
                      Fun fact-our team is made up of former FreySmiles
                      patients, something we think is important, because we have
                      all experienced treatment and can help guide you through
                      it.
                    </p>
                  </div>
                  <a
                    href="https://g.co/kgs/Sds93Ha"
                    className="horizontalItem horizontalBig"
                  >
                    <p>
                      This office is on 🔥! The orthodontists as well as every
                      single staff member.
                    </p>
                  </a>
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  ></div>
                </div>
                <div className="horizontalRow">
                  <div className="horizontalItem horizontalBig">
                    <p>Trained in CPR and first aid</p>
                  </div>
                  <div className="horizontalItem horizontalFilled ">
                    <a
                      href="https://g.co/kgs/YkknjNg"
                      // className="horizontalItemLink"
                    >
                      <p className>
                        Had a wonderful experience at FreySmiles. Everyone is
                        extremely professional, polite, timely. Would highly
                        recommend! -TK
                      </p>
                    </a>
                  </div>

                  <div className="horizontalItem horizontalFilled">
                    <p>Our team members are X-ray certified.</p>
                  </div>

                  <div className="horizontalItem horizontalFilled">
                    <p>
                      We’ve invested in in-office trainings with leading
                      clinical consultants that have helped us develop systems
                      and protocols streamlining our processes
                    </p>
                    <a className="horizontalItemLink"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    



      {/* <div className="bg-[#F7F7F7]">
          
      <div className=" flex justify-between w-full ">

        <div className="text-left text-gray-900">
          <h2 className="text-xl font-neuehaas35">
            {teamMembers[currentIndex].name}
          </h2>
          <p className="text-md font-neue-montreal">
            {teamMembers[currentIndex].description}
          </p>
        </div>

   

      </div>

        <div className="w-screen h-screen">
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
            <Scene />
          </Canvas>
        </div>
        
<div className=" relative w-[800px] h-[600px]">

  {teamMembers.map((member, index) => (
    <img
      key={member.id}
      src={member.src}
      alt={member.alt}
      className="absolute w-[60%] object-cover transition-transform duration-500"
      style={{
        top: `${index * 16}px`,          
        left: `${index * 80}px`,         
        zIndex: teamMembers.length - index 
      }}
    />
  ))}

</div>
      </div> */}
    </div>
  );
}

{
  /* bg-[#E2F600] */
}

{
  /*   
        <section ref={container} style={{ marginTop: "50vh" }}>
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                {...project}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section> */
}

{
  /* <div
          ref={carouselRef}
          className="relative z-10 min-h-[150vh]  pointer-events-none"
        >
          <div id="cursor" style={cursorStyle} className={className}>
            <div className="cursor__circle" style={cursorCircleStyle}>
              {!isDragging && (
                <>
                  Drag
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </>
              )}
            </div>
          </div>
          {items.map((item) => (
            <div key={item.num} className="carousel-item">
              <div className="carousel-box">
                <div className="titleCard">{item.title}</div>
                <div className="nameCard">{item.num}</div>
                <img src={item.imgSrc} alt={item.title} />
              </div>
            </div>
          ))}
        </div> */
}
