"use client";
import MouseTrail from "./mouse.js";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import React, { useEffect, useState, useRef, Suspense, useMemo } from "react";
import {
  EffectComposer,
  Bloom,
  Outline,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
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

const RotatingModel = () => {
  const { nodes } = useGLTF("/images/SVOX1F.glb");
  console.log(nodes);
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
    }
  });
  const { clock } = useThree();

  return (
    <>
      <group ref={modelRef} position={[0, 0, 0]} scale={[3, 3, 3]}>
        {nodes.mesh_0 && (
          <mesh geometry={nodes.mesh_0.geometry}>
            <meshPhysicalMaterial
              transmission={1}
              thickness={1.5}
              roughness={0.07}
              clearcoat={1}
              clearcoatRoughness={0.2}
              envMapIntensity={1.5}
              metalness={0}
              reflectivity={0.9}
              sheen={0.3}
              color={"#FFFFFF"}
              iridescence={0.05}
              iridescenceIOR={1.1}
              // ior={1.47}
              iridescenceThicknessRange={[100, 500]}
            />
          </mesh>
        )}
        {nodes.mesh_0_1 && (
          <mesh geometry={nodes.mesh_0_1.geometry}>
            <meshPhysicalMaterial
              transmission={1}
              thickness={1.5}
              roughness={0.07}
              clearcoat={1}
              clearcoatRoughness={0.2}
              envMapIntensity={1.5}
              metalness={0}
              reflectivity={0.9}
              sheen={0.3}
              // ior={1.47}
              color={"#FFFFFF"}
              iridescence={0.05}
              iridescenceIOR={1.1}
              iridescenceThicknessRange={[100, 500]}
            />
          </mesh>
        )}
      </group>
      <EffectComposer>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[
            0.00002 + Math.sin(clock.elapsedTime) * 0.00005,
            0.00002 + Math.cos(clock.elapsedTime) * 0.00005,
          ]}
        />

        <Outline
          edgeStrength={5}
          pulseSpeed={0}
          visibleEdgeColor="#BCC6CC"
          hiddenEdgeColor="#BCC6CC"
        />
      </EffectComposer>
    </>
  );
};

const StickyColumnScroll = () => {
  const { scene } = useGLTF("/images/SVOX1F.glb");

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
  const text1Ref = useRef(null);

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
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.to(text1Ref.current, {
      y: "-60%",
      ease: "none",
      scrollTrigger: {
        trigger: image1Ref.current,
        scroller: "#right-column",
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  const pathRef = useRef();

  useEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
    });
  }, []);
  const patients = [
    { name: "Lainie", image: "../images/testimonials/laniepurple.png" },
    { name: "Ron Lucien", image: "../images/testimonials/Ron_Lucien.jpg" },
    {
      name: "Elizabeth",
      image: "../images/testimonials/elizabethpatient.jpeg",
    },
    { name: "Kinzie", image: "../images/testimonials/kinzie1.jpg" },
    { name: "Kasprenski", image: "../images/testimonials/kasprenski.jpg" },
    { name: "Leanne", image: "../images/testimonials/leanne.png" },
    { name: "Narvaez", image: "../images/testimonials/Narvaez.jpg" },
    { name: "Rosie & Grace", image: "../images/testimonials/Rosiegrace.png" },
    { name: "Hobson", image: "../images/testimonials/hobsonblue.png" },
    { name: "Hurlburt", image: "../images/testimonials/hurlburt.jpeg" },
    { name: "Kara", image: "../images/testimonials/Kara.jpeg" },
    { name: "Sophia Lee", image: "../images/testimonials/Sophia_Lee.jpg" },
    { name: "Brynn", image: "../images/testimonials/Brynn.jpeg" },
    { name: "Emma", image: "../images/testimonials/Emma.png" },
    {
      name: "Brooke Walker",
      image: "../images/testimonials/Brooke_Walker.jpg",
    },
    { name: "Nilaya", image: "../images/testimonials/nilaya.jpeg" },
    {
      name: "Maria Anagnostou",
      image: "../images/testimonials/Maria_Anagnostou.jpg",
    },
  ];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [hoveredImage, setHoveredImage] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (imageUrl, index) => {
    if (imageUrl !== hoveredImage) {
      setPreviousImage(hoveredImage);
      setHoveredImage(imageUrl);
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
    setPreviousImage(null);
  };

  const handleMouseMove = (e) => {
    const offsetY = e.pageY - sectionTop;
    x.set(e.clientX + 16);
    y.set(offsetY);
  };

  const patientSectionRef = useRef();
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    if (patientSectionRef.current) {
      const rect = patientSectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      setSectionTop(rect.top + scrollTop);
    }
  }, []);

  return (
    <>
      <section className="relative min-h-screen bg-[#EAF879] text-black flex flex-col items-center justify-center px-6 text-center">
        <MouseTrail
          images={[
            "../images/mousetrail/flame.png",
            "../images/mousetrail/cat.png",
            "../images/mousetrail/pixelstar.png",
            "../images/mousetrail/avocado.png",
            "../images/mousetrail/ghost.png",
            "../images/mousetrail/pacman.png",
            "../images/mousetrail/evilrobot.png",
            "../images/mousetrail/thirdeye.png",
            "../images/mousetrail/alientcat.png",
            "../images/mousetrail/gotcha.png",
            "../images/mousetrail/karaokekawaii.png",
            "../images/mousetrail/mushroom.png",
            "../images/mousetrail/pixelcloud.png",
            "../images/mousetrail/pineapple.png",
          ]}
        />

        <h1 className="text-[8vw] leading-[0.9] font-neueroman uppercase max-w-[800px]">
          JOIN THE SMILE CLUB
        </h1>

        <p className="max-w-3xl mt-10 text-[18px] leading-relaxed font-neuehaas45">
          We are committed to setting the standard for exceptional service. Our
          communication is always open—every question is welcome, and every
          concern is met with care and professionalism.
        </p>

   
      </section>
      {/* <header className="sticky top-0 w-full flex justify-between items-center py-2 border-b bg-[#F9F9F9] z-50">
          <div className="w-[64px] h-auto">
    
            <img src="../images/whitedots.svg" />
          </div>
          <nav className="flex space-x-6 text-sm">
            <h1 class="text-2xl font-bold">
              <span className="text-black font-agrandir-bold inline-flex items-center">
                TESTI
                <img
                  src="../images/mo.svg"
                  alt="MO"
                  className="h-[1em] mx-1 inline-flex"
                />
                NIALS
              </span>
            </h1>
          </nav>
        </header> */}
      <div className="bg-[#F9F9F9]">
        <svg
          viewBox="0 0 302 31"
          className="absolute left-0 -bottom-1 w-full h-[20px] z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.3,29.2C3.9,28,6.4,26.7,9,25.5c10.3-4.9,21.2-9.4,31.6-11.4s21.2-1,31,2.8s19.1,9.5,29.3,11.9
          s20.2-0.2,30.1-4.1c9.4-3.7,18.7-8.3,28.5-9.8s19.1,1.7,28.5,5.7s19.3,8.5,28.9,6.8c9.6-1.7,17.6-10.3,26-17
          c4.2-3.3,8.3-6.1,13.1-7.6c4.8-1.6,9.8-1.7,14.7-0.9c10.4,1.8,20.3,7.4,30,13.1"
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="-960 -540 1920 1080" width="100%" height="100%">
          <path
            ref={pathRef}
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
          <RibbonAroundSphere />
        </Canvas>
        {/* <section className="w-full text-black px-10 md:px-20 md:py-16 grid grid-rows-2">
  <div className="flex items-center justify-end">
    <div className="max-w-[640px] text-left text-gray-500 text-base leading-relaxed">
 
      <p
            ref={textRef}
            className="text-[1.5em] leading-[1.1] font-helvetica-neue max-w-[700px]"
          >
            We are committed to setting the standard for exceptional service.
            Our communication is always open—every question is welcome, and
            every concern is met with care and professionalism.
          </p>

    </div>
  </div>


</section> */}

        <section
          ref={patientSectionRef}
          className="min-h-screen w-full px-6 relative"
          onMouseMove={handleMouseMove}
        >
          <div className="absolute top-0 left-0 pointer-events-none z-50">
            <motion.div
              className="w-[180px] h-[250px] rounded-lg overflow-hidden"
              style={{ x, y }}
            >
              {previousImage && (
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${previousImage})` }}
                />
              )}
              {hoveredImage && (
                <motion.div
                  key={hoveredIndex}
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-center z-10"
                  style={{ backgroundImage: `url(${hoveredImage})` }}
                />
              )}
            </motion.div>
          </div>

          <ul className="font-neueroman uppercase text-[14px]">
            {patients.map((member, index) => (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(member.image, index)}
                onMouseLeave={handleMouseLeave}
                className="border-b py-2"
              >
                <span className="pl-[15%] block">{member.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
        // className="bg-[#fb542d] py-10"
        >
          {/* <h2 className="uppercase text-sm font-bold tracking-widest pb-2">
            STICKY SECTION
          </h2> */}

          {/* <Canvas
            camera={{ position: [0, 1.5, 4] }}
            gl={{ alpha: true }}
            style={{
              position: "fixed",
              top: "50%",
              right: "20%",
              transform: "translate(-95%, -50%)",
              width: "20vw",
              height: "100vh",
              zIndex: 0,
            }}
          >
            <ambientLight intensity={0.5} /> //lower to avoid washed out
            <directionalLight position={[4, 4, 4]} intensity={4} castShadow />
            <spotLight
              position={[3, 4, 3]}
              angle={0.2}
              intensity={4.5} //brightness
              penumbra={0.8}
              distance={8}
              castShadow
            />
            <pointLight position={[-4, 3, 2]} intensity={2} color="#000" />
            <pointLight position={[0, 0, -5]} intensity={3} color="#BCC6CC" />
            <Environment files="../images/studio_small_03_4k.hdr" />
            <EffectComposer></EffectComposer>
            <Suspense fallback={<span>Loading</span>}>
     
              <RotatingModel />
            </Suspense>
            <OrbitControls enableZoom={false} />
          </Canvas> */}
        </section>
        <section className="w-2/3 py-16"></section>

        {/* <div className="">
              <h3 className="font-bold font-helvetica-neue uppercase tracking-widest text-xs pt-2">
                Our Patients
              </h3>
              <ul className="font-neue-montreal border-t mt-2 pt-1 space-y-1">
                {patients
                  .slice(0, Math.ceil(patients.length / 2))
                  .map((member, index) => (
                    <li
                      key={index}
                      onMouseEnter={() =>
                        handleMouseEnter(member.image, "left")
                      }
                      onMouseLeave={handleMouseLeave}
                      className="border-b pb-1 cursor-pointer hover:bg-[#d3fd50]"
                    >
                      {member.name}
                    </li>
                  ))}
              </ul>
            </div> */}
        <div style={{ display: "flex", height: "100vh", overflowY: "auto" }}>
          <div
            id="left-column"
            style={{
              width: "40%",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              ref={text1Ref}
              className="leading-[1.2] font-helvetica-neue text-[2em] max-w-[500px] ml-10 relative "
            >
              Voted the best orthodontist in Lehigh Valley year after year
            </div>
          </div>

          <div
            id="right-column"
            className="relative"
            style={{
              width: "60%",
              overflowY: "auto",
              // padding: "40px",
            }}
          >
            <section className="relative" style={{ marginBottom: "0vh" }}>
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
                <div>
                  <img
                    ref={image1Ref}
                    src="../images/patient25k.png"
                    alt="patient"
                    className="absolute top-[45%] right-[15%] w-[250px] h-auto "
                  />
                </div>
              </div>
            </section>
            <div className="flex items-center justify-center pl-10  h-auto">
              <img
                className="h-[350px] max-w-[250px] object-contain rounded-[20px]"
                src="../images/testimonial1.png"
                alt="Testimonial"
              />
            </div>
            <div
              style={{ marginBottom: "10vh" }}
              className="mt-40 leading-[1.2] max-w-[560px] ml-auto "
            >
              <div className="flex items-end font-helvetica-neue-light text-[18px] ">
                I had an open bite and misaligned teeth most of my life. Dr Frey
                fixed it and in record time. 1 1/2 yrs with Invisalign’s. Highly
                recommended! Friendly staff and easy to make appointments!
              </div>
              <p className="text-[16px] font-helvetica-neue-light">Karen O.</p>
            </div>
            <p className="pl-10 max-w-[300px] justify-center items-center font-helvetica-neue-light text-black text-[16px]">
              “FreySmiles is the best! I'm so happy with my smile and the
              confidence it's brought me!” -Lainie
            </p>
            <div class="gradient-container-2">
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
            </div>

            <section style={{ marginBottom: "100vh" }}>
              <h1 className="font-neue-montreal text-xl">
                I am certainly going to miss Dr. Frey and his team!! The
                professionalism and kindness by each person does not go
                unnoticed! Dr. Frey has always been very patient and such a
                pleasure to be around. They celebrate the end of your Invisalign
                journey as if it was their own! I would, and do recommend Frey
                Smiles to anyone looking for perfect their smile. I came in for
                minor cosmetic adjustments, and Dr. Frey somehow made magic
                happen in ways I didn’t expect. I love my smile! Thank you so
                much team - and thank you to all the girls. I would mention
                names, but truly - everyone was so amazing!
              </h1>
              <h2 className="text-xl">-Stephanie N.</h2>
            </section>

            <section className="relative overflow-hidden">
              <img src="../images/neonsunpattern.svg" />
            </section>
          </div>
        </div>
      </div>
    </>
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
