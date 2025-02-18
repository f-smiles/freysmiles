"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, Suspense } from "react";
import gsap from "gsap";
import { SplitText } from "gsap-trial/all";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  OrbitControls,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { MeshStandardMaterial } from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const RotatingModel = () => {
  const { nodes } = useGLTF("/images/SVOX1F.glb");
  console.log(nodes);
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={modelRef} position={[0, 0, 0]} scale={[3, 3, 3]}>
      {nodes.mesh_0 && (
        <mesh geometry={nodes.mesh_0.geometry}>
          <meshPhysicalMaterial
            transmission={1}
            // transparent={true}
            roughness={0}
            metalness={0}
            thickness={0.2}
            ior={1.2}
            reflectivity={0.7}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            chromaticAberration={0.02}
          />
        </mesh>
      )}
      {nodes.mesh_0_1 && (
        <mesh geometry={nodes.mesh_0_1.geometry}>
          <meshPhysicalMaterial
            transmission={1}
            transparent={true}
            roughness={0}
            metalness={0}
            thickness={0.001}
            ior={1.2}
            reflectivity={0.5}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
            chromaticAberration={0.02}
          />
        </mesh>
      )}
    </group>
  );
};

const StickyColumnScroll = () => {
  const { scene } = useGLTF("/images/SVOX1F.glb");
  const ref = useRef();

  if (!scene) return null;

  const { nodes } = useGLTF("/images/SVOX1F.glb");
  const textRef = useRef(null);
  const bgTextColor = "#CECED3";
  const fgTextColor = "#161818";

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "words, chars" });

    gsap.fromTo(
      split.chars,
      { color: bgTextColor },
      {
        color: fgTextColor,
        stagger: 0.03,
        duration: 1,
        ease: "power2.out",
      }
    );

    return () => split.revert();
  }, []);
  const gradient1Ref = useRef(null);
  const image1Ref = useRef(null);
  useEffect(() => {
    if (!gradient1Ref.current || !image1Ref.current) return;

    gsap.to(".gradient-col", {
      y: "-20%",
      ease: "none",
      scrollTrigger: {
        trigger: gradient1Ref.current,
        scroller: "#right-column",
        start: "top bottom",
        end: "bottom top",
        scrub: 4,
      },
    });

    gsap.to(image1Ref.current, {
      y: "-60%",
      ease: "none",
      scrollTrigger: {
        trigger: image1Ref.current,
        scroller: "#right-column",
        start: "top 80%",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

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
        .to(".bg", { attr: { fill: "#5454EF" } }, 0)
        .to(".txt", { attr: { fill: "rgb(255,255,255)" } }, 0)
        .to(
          ".hit, .bg, .txt",
          { duration: 0.7, ease: "elastic.out(0.8)", x: 0, y: 0 },
          0
        );
    };
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          width: "50%",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          position: "relative",
          background: "#1C1B1B",
        }}
      >
        <Canvas
          camera={{ position: [0, 1, 3] }}
          gl={{ alpha: true }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        >
          <ambientLight intensity={4} />
          <directionalLight position={[5, 5, 5]} intensity={3} />
          <pointLight position={[-5, 5, 5]} intensity={3} color="#FFF" />
          <spotLight
            position={[0, 5, 5]}
            angle={0.5}
            intensity={5}
            penumbra={1}
          />

          <pointLight position={[0, 0, -5]} intensity={4} color="#FFF" />

          <Environment
            files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/lebombo_1k.hdr"
            background={false}
            intensity={0.8}
          />

          <Suspense fallback={<span>Loading</span>}>
            <RotatingModel />
          </Suspense>

          <OrbitControls minDistance={2} maxDistance={8} />
        </Canvas>
      </div>

      <div
        id="right-column"
        className=" min-h-screen"
        style={{
          width: "50%",
          height: "100vh",
          overflowY: "auto",
          // padding: "40px",
        }}
      >
        <section>
          <div>
            <div className="pl-10 pt-20 flex justify-start">
              <p
                ref={textRef}
                className="text-[1.5em] leading-[1.1] font-helvetica-neue   max-w-[700px]"
              >
                We are committed to setting the standard for exceptional
                service. Our communication is always open—every question is
                welcome, and every concern is met with care and professionalism.
              </p>
            </div>
            <div className="font-neue-montreal flex justify-between items-center p-10 relative">
              <div className="font-helvetica-neue-light max-w-[200px] ml-10 relative -top-10">
                Voted the best orthodontist in Lehigh Valley year after year
              </div>

              <div className="flex flex-col items-end">
                <p className="text-md font-helvetica-neue-light mb-2">
                  Top orthodontics
                </p>
                <h1 className="text-[220px]  leading-none ">1%</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20 relative" style={{ marginBottom: "50vh" }}>
          <div className="relative w-full h-full">
            <div ref={gradient1Ref} className="gradient-container">
              <div className="gradient-col">
                <div className="gradient-1 h-full"></div>
              </div>
              <div className="gradient-col">
                <div className="gradient-2 h-full"></div>
              </div>
              <div className="gradient-col">
                <div className="gradient-1 h-full"></div>
              </div>
              <div className="gradient-col">
                <div className="gradient-2 h-full"></div>
              </div>
            </div>
            <div className="rounded-2xl">
  <img
    ref={image1Ref}
    src="../images/patient25k.png"
    alt="patient"
    className="absolute top-[45%] right-[15%] w-[250px] h-auto "
  />
</div>
          </div>
       
          <div className="leading-[1.1] transform -translate-y-1/2 font-helvetica-neue text-[1.5em] max-w-[500px]">
            Our non-profit, More Than Smiles, provides world-class orthodontic
            care to deserving kids since 2011.
          </div>
    
          <div>
            <div className="flex">
          <h4 className="text-[17px] max-w-[450px] font-helvetica-neue-light ">
          Part of our More than Smiles mission is to educate our community about their dental and orthodontic health.
            If you know someone who could benefit from this gift, please visit
            the website for details on how to nominate a candidate.
          </h4>
          <div className="w-[250px] h-auto">
                        <img
                          src="../images/morethansmiles2.png"
                          loading="eager"
                          alt=""
                          className=""
                        />
                      </div>
                      </div>
          <a
            href="https://morethansmiles.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              ref={btnRef}
              className="w-4/5 max-w-xs cursor-pointer h-4/5"
              viewBox="-50 -50 100 100"
            >
              <circle className="bg" r="22.4" fill="#5454EF" />
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
        </section>

        <div class="gradient-container-2">
  <div class="gradient-col-2"></div>
  <div class="gradient-col-2"></div>
  <div class="gradient-col-2"></div>
  <div class="gradient-col-2"></div>
</div>

        <div>
        
        </div>
        <div className="w-[13em] h-auto">
          <img
            className="w-full object-contain rounded-[32px]"
            src="/images/testimonials/laniepurple.png"
            alt="Testimonial"
          />
          <p className="font-neue-montreal bottom-2 right-2 bg-white text-black p-2 text-sm">
            “FreySmiles is the best! I'm so happy with my smile and the
            confidence it's brought me!”
          </p>
        </div>
        <section style={{ marginBottom: "100vh" }}>
          <h1 className="font-neue-montreal text-xl">
            I am certainly going to miss Dr. Frey and his team!! The
            professionalism and kindness by each person does not go unnoticed!
            Dr. Frey has always been very patient and such a pleasure to be
            around. They celebrate the end of your Invisalign journey as if it
            was their own! I would, and do recommend Frey Smiles to anyone
            looking for perfect their smile. I came in for minor cosmetic
            adjustments, and Dr. Frey somehow made magic happen in ways I didn’t
            expect. I love my smile! Thank you so much team - and thank you to
            all the girls. I would mention names, but truly - everyone was so
            amazing!
          </h1>
          <h2 className="text-xl">-Stephanie N.</h2>
        </section>
        <section style={{ marginBottom: "100vh" }}>
          <h2 className="font-neue-montreal text-xl">
            I had an open bite and misaligned teeth most of my life. Dr Frey
            fixed it and in record time. 1 1/2 yrs with Invisalign’s. Highly
            recommended! Friendly staff and easy to make appointments!
          </h2>
          <p className="text-xl">Karen O.</p>
        </section>
      </div>
    </div>
  );
};

export default StickyColumnScroll;

{
  /* <div>
      <header className="flex flex-row w-full py-8 justify-center items-center fixed top-0 left-0 bg-slate-950 z-10">
        <div className="flex items-center justify-center max-w-6xl w-full">
          <a href="/" className="text-3xl text-slate-50" id="testimonials">
            Testimonials
          </a>
        </div>
      </header>

      <div id="smooth-wrapper" className="w-full">
        <main id="smooth-content">

          <section className="h-[100vh] w-full grid place-items-center bg-slate-950"></section>

    
          <section
            id="section-2"
            className="h-[100vh] w-full grid place-items-center bg-slate-900"
            aria-labelledby="section-2-heading"
          >
            <div
              id="img-container"
              className="share-grid gap-4 w-full h-full justify-center images-grid images-initial-grid"
            >
              <a
                id="image-1"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/800x801/ac1f2976aa/package-starter.jpg/m/"
                  alt="Image 1"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-2"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/500x501/32480d7ad2/process-analysis.jpg/m/"
                  alt="Image 2"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-3"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/501x501/44fb6f9a2f/process-development.jpg/m/"
                  alt="Image 3"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            <h1
              id="section-2-heading"
              className="text-5xl font-sans font-bold text-slate-50 max-w-[32rem] text-center share-grid"
            >
              How do we know we are who we say we are?
            </h1>
          </section>

       
          <section className="h-screen w-full grid place-items-center bg-yellow-100">
            <h1 className="text-5xl font-sans font-bold">Eh? World</h1>
          </section>
        </main>
      </div>
    </div> */
}
