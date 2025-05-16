"use client";
// gsap
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
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
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import SwiperCore, { Keyboard, Mousewheel } from "swiper/core";
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/all";
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
        <Canvas
          camera={{ position: [0, 6, 12], fov: 45 }}
          style={{ width: "100vw", height: "100vh" }}
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.86} color={0xffffff} />
          <directionalLight
            position={[0, -10, -10]}
            intensity={1}
            color={0xffffff}
          />

          {/* <OrbitControls /> */}
          {/* <RibbonAroundSphere /> */}
        </Canvas>

        <CardStack />
        <StackCards />
        <Rays />
        <RepeatText />
        <MoreThanSmiles />
        <About />
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
      t.flipY = true;
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
      new THREE.Vector3(0, -0.7791210925776592, 4.938924045885809),
      new THREE.Vector3(
        3.8972287305003155,
        0.390385708530144,
        3.107936202961956
      ),
      new THREE.Vector3(
        4.859258415665126,
        -0.3968854951588747,
        -1.109040237509834
      ),
      new THREE.Vector3(
        2.082282719004117,
        1.4028390529397634,
        -4.3239036913044595
      ),
      new THREE.Vector3(
        -2.012218566064509,
        -1.8686426688797089,
        -4.178414895675252
      ),
      new THREE.Vector3(
        -4.730483545820437,
        -1.2069668652552943,
        -1.0797020000434934
      ),
      new THREE.Vector3(
        -3.6656012860016367,
        -1.7372838238901793,
        2.9232194798394224
      ),
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
        uvs.push(j / segments, i);
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
      )


    return () => {
      introTL.kill();
    };
  }, [onFinished]);

  return (
<main
  ref={wrapperRef}
  className="relative w-full h-screen overflow-hidden"
>
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
    
    <path d="M100,700.5A600,600 0 1 11301,700.5A600,600 0 1 1100,700.5" fill="none" stroke="black" strokeWidth="1" />
  <path d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5" fill="none" stroke="black" strokeWidth="1" />
  <path d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5" fill="none" stroke="black" strokeWidth="1" />
  <path d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5" fill="none" stroke="black" strokeWidth="1" />



    
    <text
     dy="-20"
      ref={(el) => (circleTextRefs.current[1] = el)}
      className="circles__text circles__text--1"
    >
<textPath xlinkHref="#circle-1" textLength="2550">
  Low dose 3d digital radiographs Low dose 3d digital radiographs
</textPath>

    </text>
    <text
         dy="-20"
      ref={(el) => (circleTextRefs.current[2] = el)}
      className="circles__text circles__text--2"
    >
      <textPath xlinkHref="#circle-2" textLength="2001">
        Accelerated Treatment&nbsp;
      </textPath>
    </text>
    <text
         dy="-20"
      ref={(el) => (circleTextRefs.current[3] = el)}
      className="circles__text circles__text--3"
    >
      <textPath xlinkHref="#circle-3" textLength="1341">
        Invisalign Invisalign Invisalign&nbsp;
      </textPath>
    </text>

  </svg>
</main>
  );
};
function Hero() {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imageRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(imageRefs.current, { opacity: 0, y: "100%" });
    gsap.set(boxRefs.current, { y: "0%" });
    gsap.set(contentRef.current, { opacity: 0 });

    tl.to(overlayRef.current, {
      y: "-100%",
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.add(() => {
      imageRefs.current.forEach((image, index) => {
        gsap.to(boxRefs.current[index], {
          y: "-100%",
          duration: 1.8,
          ease: "power2.inOut",
          delay: index * 0.2,
        });

        gsap.to(image, {
          opacity: 1,
          y: "0%",
          rotate: 0,
          duration: 1.5,
          ease: "power2.out",
          delay: index * 0.2,
        });
      });
    }, "+=0.2");

    tl.to(
      contentRef.current,
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=1"
    );
  }, []);

  const title = "Experts in";
  const imageUrl = "../images/crystal.png";
  const svgRef = useRef(null);
  let lastScrollTop = 0;
  const rotationFactor = 5;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (svgRef.current) {
        if (scrollTop > lastScrollTop) {
          svgRef.current.style.transform = `rotate(${
            scrollTop / rotationFactor
          }deg)`;
        } else {
          svgRef.current.style.transform = `rotate(${
            scrollTop / rotationFactor
          }deg)`;
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // mobile
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathRef = useRef(null);
  const cardsectionRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(path, {
          strokeDashoffset: pathLength,
          ease: "none",
          scrollTrigger: {
            trigger: cardsectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      },
    });

    // Pin section
    ScrollTrigger.create({
      trigger: cardsectionRef.current,
      start: "top top",
      end: "+=150%",
      pin: true,
      pinSpacing: true,
    });
  }, []);
  return (
    <>
      <div className="relative h-screen w-full bg-[#FEF9F8] text-black">
        <div ref={overlayRef} className="absolute inset-0 bg-black z-20"></div>

        <div
          className="absolute inset-0 flex items-center justify-center text-3xl font-helvetica-neue-light z-20"
          style={{ mixBlendMode: "difference", color: "white" }}
        >
          <section className="relative w-full mx-auto my-16  md:h-16">
            <h2 className="text-[3vw] ml-20">{title}</h2>

            <div className="mt-4 ml-20 h-[3rem] overflow-hidden">
              <ul
                style={{
                  animation: "scroll-text-up 5s infinite",
                }}
              >
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Invisalign</h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Damon Braces</h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">
                    Accelerated Treatment
                  </h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">
                    Low-Dose 3D Radiographs
                  </h1>
                </li>
                <li className="py-1">
                  <h1 className="font-neue-montreal text-3xl">Invisalign</h1>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div ref={contentRef}>
          <div className="absolute top-1/4 right-10 flex flex-col gap-8">
            {[
              "../images/landscapeimage.jpg ",
              "../images/iphonemockup.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className={`wrapper-img relative overflow-hidden ${
                  index === 0
                    ? "w-[300px] h-[388px] absolute top-[120px] right-[-100px] rotate-[-10deg]"
                    : "w-[450px] h-[275px] absolute bottom-[80px] left-[-400px] rotate-[8deg]"
                }`}
              >
                <div
                  ref={(el) => (boxRefs.current[index] = el)}
                  className="box absolute inset-0 bg-black"
                ></div>

                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  src={src}
                  alt={`Placeholder ${index + 1}`}
                  className="absolute w-full h-full object-cover opacity-0"
                />
              </div>
            ))}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 951 367"
          fill="none"
          className="w-full max-w-lg h-auto"
        >
          <path
            ref={pathRef}
            d="M926 366V41.4C926 32.7 919 25.6 910.2 25.6C904.6 25.6 899.7 28.4 897 32.9L730.2 333.3C727.5 338 722.3 341.2 716.5 341.2C707.8 341.2 700.7 334.2 700.7 325.4V41.6C700.7 32.9 693.7 25.8 684.9 25.8C679.3 25.8 674.4 28.6 671.7 33.1L504.7 333.3C502 338 496.8 341.2 491 341.2C482.3 341.2 475.2 334.2 475.2 325.4V41.6C475.2 32.9 468.2 25.8 459.4 25.8C453.8 25.8 448.9 28.6 446.2 33.1L280.2 333.3C277.5 338 272.3 341.2 266.5 341.2C257.8 341.2 250.7 334.2 250.7 325.4V41.6C250.7 32.9 243.7 25.8 234.9 25.8C229.3 25.8 224.4 28.6 221.7 33.1L54.7 333.3C52 338 46.8 341.2 41 341.2C32.3 341.2 25.2 334.2 25.2 325.4V1"
            stroke="#0C0EFE"
            strokeWidth="40"
            strokeMiterlimit="10"
            strokeLinejoin="round"
            style={{ strokeDasharray: "3202.1", strokeDashoffset: "0px" }}
          />
        </svg>
      </div>

      {/* <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 480 480"
    width="64"
    height="64"
    className=""
    style={{ opacity: "1"}}
    xmlSpace="preserve"
  >
    <path
      fill="#000"
      d="M205.2 0H0v205.2C15.3 99.2 99.2 15.3 205.2 0M480 205.2V0H274.8c106.1 15.3 190 99.2 205.2 205.2M274.8 480H480V274.8c-15.2 106.1-99.1 190-205.2 205.2M0 274.8V480h205.2C99.2 464.8 15.3 380.9 0 274.8"
    />
  </svg> */}

      {/* <section className="px-8 py-20">
        <div className="max-w-5xl ml-20">
          <div className="flex items-start gap-4">
            <svg
              className="min-w-[164px] w-[164px] h-auto mt-2"
              fill="none"
              viewBox="0 0 96 94"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m38.9704 60.3997c0-2.4217 1.8628-4.2845 4.2845-4.2845h10.4318c2.4216 0 4.2845-1.8628 4.2845-4.2845v-10.0593c0-2.4216 1.8628-4.2845 4.2845-4.2845h33.7171v18.6283h-33.7171c-2.4217 0-4.2845 1.8628-4.2845 4.2845v32.972h-19.0008zm-38.00165-4.2845v-18.6283h33.71715c2.4216 0 4.2845-1.8628 4.2845-4.2844v-32.972031h19.0008v32.972031c0 2.4216-1.8629 4.2844-4.2845 4.2844h-10.4318c-2.4217 0-4.2845 1.8629-4.2845 4.2845v10.0593c0 2.4217-1.8629 4.2845-4.2845 4.2845z"
                fill="#B3EA85"
              />
            </svg>

            <h2 className="text-[3.5vw] leading-tight font-light">
              <span className="italic text-[#B3EA85] font-saolitalic">
                About Us
              </span>{" "}
              <span className="font-neuehaas45 text-black">
                Experts in Invisalign, Braces, Accelerated Treatment, Low Dose
                3D Digital Radiographs.
              </span>
            </h2>
          </div>
        </div>
      </section> */}
    </>
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

  return (
    <>
      <div className="bg-[#F0EEE9]">
        <section className="px-6 py-12 md:px-12">
          <div className="font-neuehaas45 flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(1rem,2vw,1.75rem)] font-neue uppercase">
            <span className="font-neuehaas45">
              All. <sup className="text-xs align-super">(16)</sup>
            </span>
            <span>
              — INVISALIGN. <sup className="text-xs align-super">(2k)</sup>
            </span>
            <span>
              — Accelerated Treatment.{" "}
              <sup className="text-xs align-super">(12)</sup>
            </span>
            <span>
              — Low-dose digital 3d radiographs{" "}
              <sup className="text-xs align-super">(15)</sup>
            </span>
            <span>
              Damon Braces. <sup className="text-xs align-super">(2k)</sup>
            </span>
            <span>
              — Experiences. <sup className="text-xs align-super">(5)</sup>
            </span>
            <span>
              — Technology. <sup className="text-xs align-super">(8)</sup>
            </span>
          </div>

          <div className="mt-12 w-full flex gap-4">
            {/* Left image */}
            <div className="w-1/2">
              <img
                src="/images/signonmetalrack.png"
                alt="metalrack"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-1/2">
              <img
                src="/images/testdisplay.png"
                alt="placeholder"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        <p className="text-[18px] ml-10 mb-10 max-w-lg font-neuehaas45 leading-tight tracking-tight">
          At Frey Smiles, we use cutting-edge CBCT 3D imaging to capture every
          detail with unmatched precision—empowering our team to plan with
          clarity, accuracy, and the level of expertise your smile deserves.
        </p>
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
          {/* <div className="absolute left-[65%] -top-[5%] z-20">
<svg
width="360"
height="738"
viewBox="0 0 630 738"
xmlns="http://www.w3.org/2000/svg"
className="text-pink-400"
>
{Array.from({ length: 7 }).map((_, colIndex) => {
const x = colIndex * 100;
const yOffset = colIndex % 2 === 0 ? 34.275 : -34.275;
return (
<g key={colIndex} transform={`translate(${x} ${yOffset})`}>
  {Array.from({ length: 10 }).map((_, rowIndex) => (
    <rect
      key={rowIndex}
      x="0"
      y={rowIndex * 76}
      width="20"
      height="20"
      fill="currentColor"
    />
  ))}
</g>
);
})}
</svg>
</div> */}
        </section>

        <div className="mt-10 w-full flex justify-center flex-row gap-6">
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
        </div>
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
  // useEffect(() => {
  //   let tlMain = gsap
  //     .timeline({
  //       scrollTrigger: {
  //         trigger: ".section-height",
  //         start: "top top",
  //         end: "98% bottom",
  //         scrub: 1,
  //       },
  //     })
  //     .to(".track", {
  //       xPercent: -100,
  //       ease: "none",
  //     });

  //   gsap
  //     .timeline({
  //       scrollTrigger: {
  //         trigger: ".giving-panel_wrap",
  //         containerAnimation: tlMain,
  //         start: "left left",
  //         end: "right right",
  //         scrub: true,
  //       },
  //     })
  //     .to(".giving-panel", { xPercent: 100, ease: "none" })
  //     .to(".giving-panel_photo", { scale: 1 }, 0)
  //     .fromTo(
  //       ".giving-panel_contain.is-2",
  //       { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
  //       {
  //         clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  //         ease: "none",
  //       },
  //       0
  //     );
  // }, []);

  const imagesContainerRef = useRef(null);

  const [images, setImages] = useState([
    "../images/morethansmiles1.png",
    "../images/morethansmiles2.png",
    "../images/morethansmiles3.png",
    "../images/morethansmiles4.png",
    "../images/morethansmiles5.png",
    "../images/morethansmiles6.png",
  ]);

  useEffect(() => {
    if (!imagesContainerRef.current) return;

    const imageElements =
      imagesContainerRef.current.querySelectorAll(".gallery-img");
    const timeline = gsap.timeline({ ease: "none" });

    let z = 100000000000;
    let moveLeft = true;

    // last image=highest z-index
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imageElements.forEach((image, index) => {
              gsap.set(image, { zIndex: z - index });
            });

            timeline.fromTo(
              imageElements,
              {
                x: (i) => (i % 2 === 0 ? -400 : 400),
                y: "300%",
              },
              {
                x: 0,
                y: 0,
                duration: 1.5,
                stagger: -0.4,
                rotation: () => 20 * Math.random() - 10,
              }
            );

            timeline.play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of the container is visible
    );

    observer.observe(imagesContainerRef.current);

    // Move clicked image to the back of the stack
    imageElements.forEach((image) => {
      image.addEventListener("click", () => {
        const moveDirection = moveLeft ? "-125%" : "125%";
        moveLeft = !moveLeft; // alternate direction each click

        // lowest index in stack
        let minZIndex = Infinity;
        imageElements.forEach((img) => {
          let zIndex = parseInt(img.style.zIndex, 10);
          if (zIndex < minZIndex) {
            minZIndex = zIndex;
          }
        });

        // the clicked image becomes the lowest index
        z = minZIndex - 1;

        timeline
          .to(image, { x: moveDirection, duration: 0.5 }) // move out
          .to(image, { zIndex: z, duration: 0.01 }) // update z-index when it's away from stack
          .to(image, { x: 0, duration: 0.5 }); // move back under the stack
      });
    });

    return () => {
      imageElements.forEach((image) =>
        image.removeEventListener("click", () => {})
      );
    };
  }, [images]);
  const btnRef = useRef();
  const hitRef = useRef();

  useEffect(() => {
    const btn = btnRef.current;
    const hit = hitRef.current;

    hit.onpointermove = (e) => {
      const domPt = new DOMPoint(e.x, e.y);
      let svgPt = domPt.matrixTransform(btn.getScreenCTM().inverse());

      gsap
        .timeline({ defaults: { duration: 0.3, ease: "power3" } })
        .to(".hit", { x: svgPt.x / 7, y: svgPt.y / 7 }, 0)
        .to(".bg", { x: svgPt.x / 2.5, y: svgPt.y / 2.5 }, 0)
        .to(".txt", { x: svgPt.x / 2, y: svgPt.y / 2 }, 0)
        .to(".bg", { attr: { fill: "#000" } }, 0)
        .to(".txt", { attr: { fill: "rgb(0,0,0)" } }, 0);
    };

    hit.onpointerleave = (e) => {
      gsap
        .timeline({ defaults: { duration: 0.3, ease: "power2" } })
        .to(".bg", { attr: { fill: "#E8674A" } }, 0)
        .to(".txt", { attr: { fill: "rgb(255,255,255)" } }, 0)
        .to(
          ".hit, .bg, .txt",
          { duration: 0.7, ease: "elastic.out(0.8)", x: 0, y: 0 },
          0
        );
    };
  }, []);

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

  const wrapperRef = useRef(null);
  const itemsRef = useRef([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;

    let ctx = gsap.context(() => {
      const section = wrapperRef.current;
      const list = section.querySelector(".projects-collection-list");

      const totalWidth = list.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      gsap.to(list, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="horizontal-section" ref={wrapperRef}>
        <div className="page-wrapper">
          <div className="projects-collection-list">
            {images.map((img, i) => (
              <div key={i} className="project-item">
                <a href="#" className="project-tile w-inline-block">
                  <ProjectImage imageUrl={img} index={i} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="px-20 py-20 bg-[#FEF9F8] text-black flex flex-col justify-between">
        <div className="flex justify-between ">
          <div className="w-[40%] text-left text-neutral-500 leading-snug ">
            <p className="font-neuehaas45 text-[17px]">
              Frey Smiles is committed to making world-class orthodontic care
              accessible to all. In 2011, we launched a non-profit initiative
              called More Than Smiles, dedicated to providing treatment for
              individuals who may not have the means to access it. The program
              also focuses on educating the community about dental and
              orthodontic health.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-end text-[14px]">
          {/* 
        <div className="space-y-2">
          <p className="font-medium">Services</p>
          <section className="morethansmiles">
        <div ref={imagesContainerRef} className="imagestack">
          {images.map((url, index) => (
            <img key={index} src={url} className="gallery-img" alt="gallery" />
          ))}
        </div>
      </section>
        </div> */}
        </div>
      </section>
      <section className="px-8 py-20 min-h-screen ">
        <div className="ml-20">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-[1vw] leading-tight font-light">
              <span className="text-[#ff007f] font-neuehaas45">
                OUR NON-PROFIT
              </span>{" "}
              <span className="ml-6 text-[2.5vw] font-neuehaas45 text-black">
                If you know someone who could benefit from this{" "}
                <span className="font-saolitalic">gift,</span> please visit our
                website for details on how to{" "}
                <span className="font-saolitalic">nominate</span> a candidate.
              </span>
            </h2>
            <div className="w-full flex justify-start -mt-20">
              <a
                href="https://morethansmiles.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  ref={btnRef}
                  className="w-full max-w-xl cursor-pointer h-full"
                  viewBox="-50 -50 100 100"
                >
                  <circle className="bg" r="22.4" fill="#E8674A" />
                  <text
                    className="txt fill-white text-[5.5px] tracking-[0.2px] text-center font-neue-montreal"
                    x="0"
                    y="2"
                    textAnchor="middle"
                  >
                    Nominate
                  </text>
                  <circle
                    ref={hitRef}
                    className="hit"
                    r="42"
                    fill="rgba(0,0,0,0)"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>

    // <section className="w-full min-h-screen ">
    //   <div className="section-height">
    //     <div className="sticky-element">
    //       <div className="track">
    //         <div className="track-flex">
    //           <div className="giving-panel_wrap">
    //             <div className="giving-panel">
    //               <div className="giving-panel_contain">
    //                 <p className="giving-panel_text">GIVING</p>
    //                 <div className="giving-panel_img is-1">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/morethansmiles2.png"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="giving-panel_img is-2">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/morethansmiles3.png"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="giving-panel_img is-3">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/hand.jpeg"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="giving-panel_contain is-2">
    //                 <p className="giving-panel_text">GIVING</p>
    //                 <div className="giving-panel_img is-1">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/morethansmiles5.png"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="giving-panel_img is-2">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/wavyborderpatient.png"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="giving-panel_img is-3">
    //                   <div className="giving-panel_img-height">
    //                     <img
    //                       src="../images/morethansmiles4.png"
    //                       loading="eager"
    //                       alt=""
    //                       className="giving-panel_photo"
    //                     />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* <div className="flex flex-col items-center justify-center text-[180px] leading-none">
    //     <div className="flex items-center self-start ml-60">
    //       <span className="underline-custom">MORE</span>
    //       <img
    //         className="w-32 h-auto ml-4"
    //         src="../images/morethansmiles2.png"
    //         alt="More Than Smiles"
    //         style={{ transform: "rotate(10deg)" }}
    //       />
    //     </div>
    //     <div className="flex items-center ml-20">
    //       <img
    //         className="w-32 h-auto mr-2"
    //         src="../images/morethansmiles.png"
    //         alt="More Than Smiles"
    //         style={{ transform: "rotate(-10deg)" }}
    //       />
    //       <span className="underline-custom">THAN</span>
    //     </div>
    //     <div className="flex items-center self-start ml-60">
    //       <span className="underline-custom">SMILES</span>
    //       <img
    //         className="w-32 h-auto ml-4"
    //         src="../images/morethansmiles3.png"
    //         alt="More Than Smiles"
    //         style={{ transform: "rotate(10deg)" }}
    //       />
    //     </div>
    //   </div> */}

    //   {/* <div className="container flex flex-col-reverse mx-auto md:flex-row md:justify-between"> */}

    //   {/* <div className="flex flex-col items-center justify-center w-full md:w-1/2">
    //       <img
    //         className="mt-16 rounded-lg"
    //         src="/../../images/smilescholarship.jpg"
    //         alt="Frey Smiles patient receiving FreySmile scholarship"
    //       />
    //     </div> */}
    //   {/* </div> */}
    // </section>
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
