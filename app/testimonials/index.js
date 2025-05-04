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


  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const lastIndex = useRef(null);
  const animationQueue = useRef([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    
    if (lastIndex.current === null) {

      setActiveIndex(index);
      lastIndex.current = index;
      return;
    }

    const direction = index > lastIndex.current ? "down" : "up";
    const step = direction === "down" ? 1 : -1;
    
 
    const sequence = [];
    for (let i = lastIndex.current; i !== index; i += step) {
      sequence.push(i + step);
    }


    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      animationQueue.current = [];
    }


    sequence.forEach((seqIndex, i) => {
      timeoutRef.current = setTimeout(() => {
        setActiveIndex(seqIndex);
      }, i ); 
    });

    lastIndex.current = index;
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setActiveIndex(null);
    lastIndex.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    animationQueue.current = [];
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

  const containerRef = useRef(null);

  const testimonials = [
    {
      name: "JAMES PICA",
      text: "Frey Smiles has made the whole process from start to finish incredibly pleasant and sooo easy on my kids to follow. They were able to make a miracle happen with my son's tooth that was coming in sideways. He now has a perfect smile and I couldn't be happier. My daughter is halfway through her treatment and the difference already has been great. I 100% recommend this place to anyone!!!",
      color: "bg-[#d85749]" ,
       height: "h-[320px]",
       width: "w-[360px]",
    },
    {
      name: "Thomas StPierre",
      text: "I had a pretty extreme case and it took some time, but FreySmiles gave me the smile I had always hoped for. Thank you!",
      color: "bg-[#16b5c2]",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "FEI ZHAO",
      text: "Our whole experience for the past 10 years of being under Dr. Gregg Frey’s care and his wonderful staff has been amazing. My son and my daughter have most beautiful smiles, and they received so many compliments on their teeth. It has made a dramatic and positive change in their lives. Dr. Frey is a perfectionist, and his treatment is second to none. I recommend Dr. Frey highly and without any reservation.",
      color: "bg-[#cbb52a]",
      height: "h-[320px]",
      width: "w-[360px]",
    },
    {
      name: "Diana Gomez",
      text: "After arriving at my sons dentist on a Friday, his dentist office now informs me that they don’t have a referral. I called the Frey smiles office when they were closed and left a message. I received a call back within minutes from Dr. Frey himself who sent the referral over immediately ( on his day off!!!) how amazing! Not to mention the staff was amazing when were were there and my children felt so comfortable! Looking forward to a wonderful smile for my son!!",
      color: "bg-[#E4A0F6]",
      height: "h-[320px]",
      width: "w-[360px]",
      
    },
    {
      name: "Brandi Moyer",
      text: "My experience with Dr. Frey orthodontics has been nothing but great. The staff is all so incredibly nice and willing to help. And better yet, today I found out I may be ahead of my time line to greater aligned teeth!.",
      color: "bg-[#FEBD01]",
    },
    {
      name: "Tracee Benton",
      text: "Dr. Frey and his orthodontist techs are the absolute best! The team has such an attention to detail I absolutely love my new smile and my confidence has significantly grown! The whole process of using Invisalign has been phenomenal. I highly recommend Dr. Frey and his team to anyone considering orthodontic work!",
      color: "bg-[#72A806]",
    },

      {
      name: "Sara Moyer",
      text: "We are so happy that we picked Freysmiles in Lehighton for both of our girls Invisalign treatment. Dr. Frey and all of his staff are always so friendly and great to deal with. My girls enjoy going to their appointments and love being able to see the progress their teeth have made with each tray change. We are 100% confident that we made the right choice when choosing them as our orthodontist!",
      color: "bg-[#9b84fb]",
      height: "h-[300px]",
      width: "w-[340px]",
    },
    {
      name: "Vicki Weaver",
      text: "We have had all four of our children receive orthodontic treatment from Dr. Frey. Dr. Frey is willing to go above and beyond for his patients before, during, and after the treatment is finished. It shows in their beautiful smiles!! We highly recommend FreySmiles to all of our friends and family!",
      color: "bg-[#FF984F]",
    },
    {
      name: "Andrew Cornell",
      text: "Over 20 years ago, I went to Dr. Frey to fix my cross bite and get braces. Since then, my smile looks substantially nicer. My entire mouth feels better as well. The benefits of orthodontics under Dr. Frey continue paying dividends.",
      color: "bg-[#08a1dc]",
    },
    {
      name: "Shelby Loucks",
      text: "THEY ARE AMAZING!! Great staff and wonderful building. HIGHLY recommend to anyone looking for an orthodontist.",
      color: "bg-[#bc5935]",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "Mandee Kaur",
      text: "I would highly recommend FreySmiles! Excellent orthodontic care, whether it’s braces or Invisalign, Dr. Frey and his team pay attention to detail in making sure your smile is flawless! I would not trust anyone else for my daughter’s care other than FreySmiles.",
      color: "bg-[#7ca6f5]",
    },
    

  ];
  
  return (
    <>
      <section className=" justify-center  items-center relative min-h-screen bg-[#EAF879] text-black flex flex-col ">
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
            // "../images/mousetrail/upsidedowncat.png",
            "../images/mousetrail/pixelsun.png",
            "../images/mousetrail/cherries.png",
            "../images/mousetrail/watermelon.png",
            "../images/mousetrail/dolphins.png",
            "../images/mousetrail/jellyfish.png",
            "../images/mousetrail/nyancat.png",
            "../images/mousetrail/donut.png",
            "../images/mousetrail/controller.png",
            "../images/mousetrail/dinosaur.png",
            "../images/mousetrail/headphones.png",
            "../images/mousetrail/porsche.png",
          ]}
        />

        <h1 className="items-center px-6 text-center text-[7vw] leading-[0.9] font-neueroman uppercase max-w-[800px]">
          JOIN THE SMILE CLUB
        </h1>

        <p className="max-w-[500px] mt-10 text-[18px] leading-relaxed font-neuehaas45">
          We are committed to setting the standard for exceptional service. Our
          communication is always open—every question is welcome, and every
          concern is met with care and professionalism.
        </p>
      </section>

      <section className="min-h-screen w-full px-6">
      <ul className="font-neueroman uppercase text-[14px]">
        {patients.map((member, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className="border-b relative"
          >
            <div className="flex items-center py-2 relative">
              <span className="pl-[15%]">DATE COMPLETED</span>
              <span className="pl-[25%]">{member.name}</span>
              
              <AnimatePresence>
                {(hoveredIndex === index || activeIndex === index) && (
                  <motion.div
                    key={activeIndex === index ? `active-${activeIndex}` : `hover-${hoveredIndex}`}
                    className="absolute left-[66%] bottom-0 w-[180px] origin-bottom"
                    initial={{ height: 0 }}
                    animate={{ height: "250px"}}
                    exit={{ height: 0}}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      backgroundImage: `url(${
                        activeIndex === index 
                          ? patients[activeIndex].image 
                          : patients[hoveredIndex].image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      zIndex: 10,
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </li>
        ))}
      </ul>
    </section>
    
      <section
  ref={containerRef}
  className="min-h-screen bg-[#EEE3FF] flex flex-wrap justify-center items-center gap-4 p-8 relative overflow-hidden"
>
  {testimonials.map((t, i) => (
    <motion.div
      key={i}
      drag
      dragConstraints={containerRef}
      dragElastic={0.1}
      whileDrag={{ scale: 1.05 }}
      dragMomentum={false} 
      className={`
        ${t.width || "w-[320px]"}
        ${t.height || "h-[270px]"}
        p-4 rounded-lg shadow-lg text-white
        ${t.color}
        cursor-grab active:cursor-grabbing
      `}
      style={{
        rotate: `${(i % 2 === 0 ? 1 : -1) * (5 + i * 2)}deg`,
        zIndex: i + 1,
      }}
    >
      <p className="text-[14px] leading-snug font-neueroman mb-4">“{t.text}”</p>
      <div className="text-[14px] font-neueroman uppercase">{t.name}</div>
    </motion.div>
  ))}
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
        {/* <Canvas
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

          <OrbitControls />
          <RibbonAroundSphere />
        </Canvas> */}

        {/* <section className="bg-[#fb542d] py-10">
          <Canvas
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
          </Canvas>
        </section> */}

        {/* <div style={{ display: "flex", height: "100vh", overflowY: "auto" }}>
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

          <div id="right-column" className="relative w-1/2">
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


            <div class="gradient-container-2">
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default StickyColumnScroll;
