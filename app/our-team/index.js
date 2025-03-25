"use client";
import { Item } from "../../utils/Item";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { SplitText } from "gsap-trial/all";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowLeftIcon from "../_components/ui/ArrowLeftIcon";
import ArrowRightIcon from "../_components/ui/ArrowRightIcon";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
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
      uMediaSize: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
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


    gsap.to(uniforms.uMouseEnter, { value: 1, duration: 1.2, ease: "power2.out" });
    gsap.to(uniforms.uMouseEnterMask, { value: 1, duration: 0.7, ease: "power2.out" });
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

const ShaderHoverEffect = () => {
  const images = [
    { name: "Alyssa", url: "../images/team_members/Alyssascan.png",    description: "Treatment Coordinator",},
    { name: "Nicolle", url: "../images/team_members/Nicollewaving.png",   description: "Specialized Orthodontic Assistant", },
    { name: "Lexi", url: "../images/team_members/Lexiworking.png",   description: "Treatment Coordinator" },
    { name: "Elizabeth", url: "../images/team_members/Elizabethaao.png",   description: "Patient Services", },
    { name: "Adriana", url: "../images/team_members/Adriana-Photoroom.jpg" ,description: "Insurance Coordinator"},
  ];
  const [hoveredImage, setHoveredImage] = useState(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    mouse.current.x = e.clientX / window.innerWidth;
    mouse.current.y = e.clientY / window.innerHeight;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" onMouseMove={handleMouseMove}>
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
  
    tl.call(() => {
      setIsRevealing(false);
      setShowContent(true);
    }, null, "+=0.2");
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
          ease: "power3.out"
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
const contentRef = useRef(null)
  
  return (
    <div className="our-team-page ">
  <div
    className={`fixed inset-0 z-50 flex transition-transform duration-1000 ${
      isRevealing ? "translate-y-0" : "-translate-y-full"
    }`}
  >
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        ref={(el) => (panelRefs.current[i] = el)}
        className="h-full w-1/4 bg-[#E1F572]"
      />
    ))}

<div className="absolute inset-0 z-40 flex justify-center items-center">

      <h2 ref={titleRef} className="uppercase content__title1">
        <span style={{ lineHeight: "1.2" }}>Meet Our Team</span>
      </h2>
    </div>
  </div>



<div ref={contentRef} className="relative z-0">
      <div className="bg-[#F7F7F7] relative ">
      <section className="py-[10em] sm:py-[10em]">
          
          <div className="mx-auto mb-12 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 ">

              <div className="flex flex-col overflow-hidden">
     
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    className="font-neuehaasdisplaylight  text-[14px] overflow-hidden"
                    initial={{
                      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                      y: 20,
                    }}
                    animate={isRevealing ? {} : {
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      y: 0,
                    }}
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
     
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 px-6 py-1 mx-auto max-w-7xl lg:px-8">
            
            <div className="col-span-12 col-start-1 grid-rows-2 space-y-8 lg:col-span-6">
            <div
                id="controls"
                className="font-neuehaasdisplaylight  flex items-center justify-start row-span-1 row-start-1 space-x-4 "
              >
                <button
                  className=" z-0 p-3"
                  onClick={toggleSwitchDoctor}
                >
     <svg width="20" height="20" viewBox="0 0 100 267" xmlns="http://www.w3.org/2000/svg"
                stroke="black" fill="none" strokeWidth="10" transform="rotate(-90)">
                <path d="M49.894 2.766v262.979" strokeLinecap="square"></path>
                <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
              </svg>
                </button>
                <span className="text-[12px] t">
                  0{!switchDoctor ? index : index + 1} / 02
                </span>
                <button
                  className="z-3"
                  onClick={toggleSwitchDoctor}
                >
  <svg width="20" height="20" viewBox="0 0 100 267" xmlns="http://www.w3.org/2000/svg"
                stroke="black" fill="none" strokeWidth="10" transform="rotate(90)">
                <path d="M49.894 2.766v262.979" strokeLinecap="square"></path>
                <path d="M99.75 76.596C73.902 76.596 52.62 43.07 49.895 0 47.168 43.07 25.886 76.596.036 76.596"></path>
              </svg>
                </button>
              </div>
           
              <div className="row-span-1 row-start-2">
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
                  <p ref={doctorBioRef} className="font-neuehaasdisplaylight ">
                    Dr. Daniel Frey pursued his pre-dental requisites at the
                    University of Pittsburgh, majoring in Biology. Dr. Frey
                    excelled in his studies and was admitted to Temple
                    University&apos;s dental school, graduating at the top of
                    his class with the prestigious Summa Cum Laude designation.
                    Continuing his education, Dr. Frey was admitted to the
                    esteemed orthodontic residency program at the University of
                    the Pacific in San Francisco where he worked with students
                    and faculty from around the world and utilized cutting-edge
                    orthodontic techniques. During his time in San Francisco, he
                    conducted research in three-dimensional craniofacial
                    analysis and earned his Master of Science degree. Dr. Frey
                    is a member of the American Association of Orthodontists and
                    the American Dental Association. In his leisure time, he
                    enjoys staying active outdoors, camping, playing music, and
                    spending time with loved ones.
                  </p>
                ) : (
                  <p style={{ visibility: "hidden" }} ref={doctorBioRef} className="font-neuehaasdisplaylight">
                    Dr. Gregg Frey is an orthodontist based in Pennsylvania, who
                    graduated from Temple University School of Dentistry with
                    honors and served in the U.S. Navy Dental Corps before
                    establishing his practice in the Lehigh Valley. He is a
                    Diplomat of the American Board of Orthodontics and has
                    received numerous distinctions, accreditations, and honors,
                    including being named one of America&apos;s Top
                    Orthodontists by the Consumer Review Council of America.
                    This distinction is held by fewer than 25% of orthodontists
                    nationwide. ABO certification represents the culmination of
                    5-10 years of written and oral examinations and independent
                    expert review of actual treated patients. Recently Dr. Frey
                    voluntarily re-certified. Dr. Frey enjoys coaching soccer,
                    vintage car racing, and playing the drums.
                  </p>
                )}
              </div>
         
            </div>
            <div className="col-span-5 lg:col-span-3 lg:col-start-7">
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
              <figcaption>
                <h5 className="mt-5 font-neue-montreal text-[14px]">
                  {!switchDoctor ? "Dr. Gregg Frey" : "Dr. Dan Frey"}
                </h5>
                <p className="font-neue-montreal text-[14px]">
                  {!switchDoctor ? "DDS" : "DMD, MSD"}
                </p>
              </figcaption>
            </div>
            <div className="col-span-5 lg:col-span-2 lg:col-start-11">
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

                    {/* <img
                      className="absolute bottom-0 w-90 h-90"
                      src="../images/threedots.svg"
                      alt="Green Squiggle"
                    /> */}
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
                  >
                    {/* <div className="svg-container">
                      {svgs.map((svg) => (
                        <div
                          key={svg.id}
                          className="svg-wrapper"
                          style={{
                            position: "absolute",
                            right: `${svg.right}px`,
                            transition: "right 2s ease-out",
                          }}
                        >
                          <svg
                            width={svgWidth}
                            height={svgWidth}
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100,0 A100,100 0 0,1 100,200 A100,100 0 0,1 100,0 Z"
                              fill="#F3F2ED"
                            />
                          </svg>
                        </div>
                      ))}
                    </div> */}
                  </div>
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
                    <a className="horizontalItemLink">
                 
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      
      </div>
      <div>
      </div>

{/* <ShaderHoverEffect /> */}
{/* bg-[#E2F600] */}
      <div className="h-screen w-full flex flex-col items-center justify-center  px-10 relative">
      {/* <div
  className="absolute top-10 right-10 text-right text-gray-900"
  style={{
    fontSize: "72px",
    fontWeight: "200",
    fontFamily: "NeueMontrealBook",
  }}
>
<div
          style={{
            fontSize: "28px",
            fontWeight: "200",
            fontFamily: "HelveticaNeue-Light",
          }}
          className="text-right"
        >
          We're here to support you
          <br /> <span className="font-saolitalic">every</span> step of the way
        </div>
<div className="w-[60px]">
            <svg
      
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M63.93 30.1793H63.9983V0H31.999V0.0690724C49.052 0.0690724 62.9842 13.3921 63.93 30.1793Z"
        fill="currentColor"
      />
      <path
        d="M63.9315 33.8208C62.9858 50.608 49.0536 63.931 32.0006 63.931V64.0001H63.9999V33.8208H63.9315Z"
        fill="currentColor"
      />
      <path
        d="M31.9309 30.1793H31.9993V0H0V0.0690724C17.053 0.0690724 30.9852 13.3921 31.9309 30.1793Z"
        fill="currentColor"
      />
      <path
        d="M31.9309 33.8208C30.9852 50.608 17.053 63.931 0 63.931V64.0001H31.9993V33.8208H31.9309Z"
        fill="currentColor"
      />
    </svg>
    </div>
</div> */}

      <div className="flex items-center justify-between w-full max-w-5xl">

        <div className="text-left text-gray-900">
          <h2 className="text-xl font-editorial-new-italic">
            {teamMembers[currentIndex].name}
          </h2>
          <p className="text-md font-neue-montreal">
            {teamMembers[currentIndex].description}
          </p>
        </div>


        <div className="w-[300px] h-[400px] relative overflow-hidden flex-shrink-0">
          {teamMembers.map((member, index) => (
            <img
              key={member.id}
              ref={(el) => (imageRefs.current[index] = el)}
              src={member.src}
              alt={member.alt}
              className="absolute w-full h-full object-cover"
              style={{
                top: 0,
                left: 0,
                zIndex: index === currentIndex ? 2 : 1, 
              }}
            />
          ))}
        </div>
      
        <div
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  borderRadius: "50%", 
                  overflow: "hidden", 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <video
                  id="holovideo"
                  loop
                  muted
                  autoPlay
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(1.25)",
                    boxShadow: "0 0 50px #ebe6ff80",
                  }}
                >
                  <source
                    src="https://cdn.refokus.com/ttr/speaking-ball.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
      </div>


      <div className="absolute bottom-5 w-full flex left-10 space-x-4">
  {teamMembers.slice(0, 5).map((member, index) => (
    <div
      key={member.id}
      onClick={() => setCurrentIndex(index)}
      className={`w-20 h-20 border rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
        currentIndex === index ? "border-black" : "border-gray-300 opacity-50"
      }`}
    >
      <img
        src={member.src}
        alt={member.alt}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          currentIndex === index ? "scale-75" : "hover:scale-75"
        }`}
      />
    </div>
  ))}
</div>

    </div>
    </div>

    </div>
  );
}


  {/*   
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
        </section> */}

        {/* <div
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
        </div> */}