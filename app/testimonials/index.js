"use client";
import MouseTrail from "./mouse.js";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from "@react-three/fiber";
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
  shaderMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { MeshStandardMaterial } from "three";
import { ScrambleTextPlugin } from "gsap-trial/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}

const ScrambleText = ({
  text,
  className,
  scrambleOnLoad = true,
  charsType = "default", // 'default' | 'numbers' | 'letters'
}) => {
  const scrambleRef = useRef(null);
  const originalText = useRef(text);

  const charSets = {
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    numbers: "0123456789",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  };

  const scrambleAnimation = () => {
    return gsap.to(scrambleRef.current, {
      duration: 1.8,
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
        },
      });
      scrambleAnimation();
    }

    const handleMouseEnter = () => scrambleAnimation();
    element.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [scrambleOnLoad, charsType]);

  return (
    <span
      className={`scramble-wrapper ${className || ""}`}
      style={{ position: "relative", display: "inline-block" }}
    >
      <span style={{ visibility: "hidden", whiteSpace: "nowrap" }}>{text}</span>

      <span
        ref={scrambleRef}
        className="scramble-text"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </span>
  );
};

const ScrambleBlock = ({
  lines = [],
  className = "",
  scrambleOnLoad = true,
  charsType = "letters",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, i) => (
        <ScrambleText
          key={i}
          text={line}
          scrambleOnLoad={scrambleOnLoad}
          charsType={charsType}
        />
      ))}
    </div>
  );
};

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
    { name: "Ron L.", image: "../images/testimonials/Ron_Lucien.jpg" },
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
    { name: "Sophia L.", image: "../images/testimonials/Sophia_Lee.jpg" },
    // { name: "Brynn", image: "../images/testimonials/Brynn.jpeg" },
    { name: "Brynn", image: "../images/testimonials/brynnportrait.png" },
    { name: "Emma", image: "../images/testimonials/Emma.png" },
    {
      name: "Brooke W.",
      image: "../images/testimonials/Brooke_Walker.jpg",
    },
    { name: "Nilaya", image: "../images/testimonials/nilaya.jpeg" },
    {
      name: "Maria A.",
      image: "../images/testimonials/Maria_Anagnostou.jpg",
    },
    {
      name: "Natasha K.",
      image: "../images/testimonials/Natasha_Khela.jpg",
    },
    {
      name: "James C.",
      image: "../images/testimonials/James_Cipolla.jpg",
    },
    {
      name: "Devika K.",
      image: "/images/testimonials/Devika_Knafo.jpg",
    },
    {
      name: "Ibis S.",
      image: "../images/testimonials/Ibis_Subero.jpg",
    },
    {
      name: "Abigail",
      image: "../images/testimonials/abigail.png",
    },
    {
      name: "Emma",
      image: "../images/testimonials/EmmaF.png",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const timeoutRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayIndex, setDisplayIndex] = useState(null);
  const firstNameRef = useRef(null);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const animateIndices = (current) => {
      if (current === index) {
        setDisplayIndex(index);
        return;
      }

      const step = current < index ? 1 : -1;
      setDisplayIndex(current);

      timeoutRef.current = setTimeout(() => {
        animateIndices(current + step);
      }, 200);
    };

    const startFrom =
      displayIndex !== null
        ? displayIndex
        : activeIndex !== null
        ? activeIndex
        : 0;
    animateIndices(startFrom);
  };
  const handleMouseLeave = () => {
    setActiveIndex(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [lerpedPos, setLerpedPos] = useState({ x: 0, y: 0 });
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  useEffect(() => {
    let animationFrame;

    const update = () => {
      setLerpedPos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.15),
        y: lerp(prev.y, mousePos.y, 0.15),
      }));

      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos]);

  useEffect(() => {
    if (firstNameRef.current) {
      const rect = firstNameRef.current.getBoundingClientRect();

      setMousePos({
        x: rect.right + 24,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

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
      color: "bg-[#9482A3]",
      image: "/images/dragon.png",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Thomas StPierre",
      text: "I had a pretty extreme case and it took some time, but FreySmiles gave me the smile I had always hoped for. Thank you!",
      color: "bg-[#EB7104]",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "FEI ZHAO",
      text: "Our whole experience for the past 10 years of being under Dr. Gregg Frey’s care and his wonderful staff has been amazing. My son and my daughter have most beautiful smiles, and they received so many compliments on their teeth. It has made a dramatic and positive change in their lives. Dr. Frey is a perfectionist, and his treatment is second to none. I recommend Dr. Frey highly and without any reservation.",
      color: "bg-[#80A192]",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Diana Gomez",
      text: "After arriving at my sons dentist on a Friday, his dentist office now informs me that they don’t have a referral. I called the Frey smiles office when they were closed and left a message. I received a call back within minutes from Dr. Frey himself who sent the referral over immediately ( on his day off!!!) how amazing! Not to mention the staff was amazing when were were there and my children felt so comfortable! Looking forward to a wonderful smile for my son!!",
      color: "bg-[#F3B700]",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Brandi Moyer",
      text: "My experience with Dr. Frey orthodontics has been nothing but great. The staff is all so incredibly nice and willing to help. And better yet, today I found out I may be ahead of my time line to greater aligned teeth!.",
      color: "bg-[#4C90B3]",
    },
    {
      name: "Tracee Benton",
      text: "Dr. Frey and his orthodontist techs are the absolute best! The team has such an attention to detail I absolutely love my new smile and my confidence has significantly grown! The whole process of using Invisalign has been phenomenal. I highly recommend Dr. Frey and his team to anyone considering orthodontic work!",
      color: "bg-[#036523]",
    },

    {
      name: "Sara Moyer",
      text: "We are so happy that we picked Freysmiles in Lehighton for both of our girls Invisalign treatment. Dr. Frey and all of his staff are always so friendly and great to deal with. My girls enjoy going to their appointments and love being able to see the progress their teeth have made with each tray change. We are 100% confident that we made the right choice when choosing them as our orthodontist!",
      color: "bg-[#525252]",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Vicki Weaver",
      text: "We have had all four of our children receive orthodontic treatment from Dr. Frey. Dr. Frey is willing to go above and beyond for his patients before, during, and after the treatment is finished. It shows in their beautiful smiles!! We highly recommend FreySmiles to all of our friends and family!",
      color: "bg-[#EA9CBE]",
    },
    {
      name: "Andrew Cornell",
      text: "Over 20 years ago, I went to Dr. Frey to fix my cross bite and get braces. Since then, my smile looks substantially nicer. My entire mouth feels better as well. The benefits of orthodontics under Dr. Frey continue paying dividends.",
      color: "bg-[#56A0FC]",
    },
    {
      name: "Shelby Loucks",
      text: "THEY ARE AMAZING!! Great staff and wonderful building. HIGHLY recommend to anyone looking for an orthodontist.",
      color: "bg-[#A81919]",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "Mandee Kaur",
      text: "I would highly recommend FreySmiles! Excellent orthodontic care, whether it’s braces or Invisalign, Dr. Frey and his team pay attention to detail in making sure your smile is flawless! I would not trust anyone else for my daughter’s care other than FreySmiles.",
      color: "bg-[#49ABA3]",
    },
  ];

  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   const el = sectionRef.current;

  //   gsap.to(el, {
  //     yPercent: -100,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: el,
  //       start: "top top",
  //       end: "bottom top",
  //       scrub: true,

  //     },
  //   });
  // }, []);

  useEffect(() => {
    const lines = gsap.utils.toArray("#smile-scroll-section .line");

    lines.forEach((line, index) => {
      const direction = index % 2 === 0 ? -1 : 1;

      gsap.to(line, {
        xPercent: direction * 50,
        ease: "none",
        scrollTrigger: {
          trigger: "#smile-scroll-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  const canvasContainerRef = useRef();

  const sectionOneRef = useRef(null);
  const navBarRef = useRef(null);

  useEffect(() => {
    if (!sectionOneRef.current || !navBarRef.current) return;

    ScrollTrigger.create({
      trigger: sectionOneRef.current,
      start: "75% top",
      end: () => `+=${navBarRef.current.offsetTop + window.innerHeight}`,
      pin: true,
      pinSpacing: false,
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <section
        ref={sectionOneRef}
        className="z-10 relative w-full min-h-[110vh] bg-[#E3DEEA] flex flex-col px-12"
      >
        <div
          ref={canvasContainerRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            width: "50vw",
            height: "100vh",
          }}
        >
          <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
            <PixelImage
              containerRef={canvasContainerRef}
              imgSrc="/images/shinycircle.png"
            />
          </Canvas>
        </div>

        <div className="z-10 max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1"></div>
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
          <div className="flex-1 max-w-[500px] flex flex-col justify-center h-full min-h-[100vh]">
            <h2 className="flex justify-center font-neuehaas45 text-4xl md:text-5xl mb-6 uppercase">
              Join the smile club
            </h2>

            <div className="font-ibmregular text-sm leading-none tracking-tight uppercase font-bold relative">
              <span className="invisible block absolute">
                We are committed to setting the standard for exceptional
                service. Our communication is always open—every question is
                welcome, and every concern is met with care and professionalism.
              </span>

              <ScrambleBlock
                lines={[
                  "We are committed to setting the standard for exceptional service.",
                  "Our communication is always open—every question and every concern",
                  "is met with care and professionalism is welcome.",
                ]}
                scrambleOnLoad={true}
                charsType="letters"
              />
            </div>
          </div>
        </div>

        <div
          ref={navBarRef}
          className="absolute bottom-0 left-0 w-full bg-[#E3DEEA] pb-2" // remove py-6, control padding manually
        >
          <div className="flex items-center justify-center text-xs uppercase font-ibmregular text-black">
            OUR PATIENTS RESULTS
          </div>

          <div className="mt-1 w-full border-b border-[#D3D3D3]"></div>
        </div>
      </section>

      <section
        className="bg-[#E3DEEA] min-h-screen w-full px-6 relative "
        onMouseMove={handleMouseMove}
      >
        <div className="flex items-center justify-between w-full">
          <span className="w-3 h-3 inline-block transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>

          {/* <div className="flex-1 border-b mx-2"></div> */}
          <span className="w-3 h-3 inline-block transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>
        </div>

        <ul className="font-ibmplex uppercase text-[12px]">
          {patients.map((member, index) => (
            <li
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className="border-b border-[#D3D3D3] py-6 relative"
            >
              <div className="flex items-center relative">
                <span className="pl-[15%]">DATE COMPLETED</span>
                <span
                  ref={index === 0 ? firstNameRef : null}
                  className="pl-[25%]"
                >
                  {member.name}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <AnimatePresence mode="wait">
          {displayIndex !== null && (
            <motion.div
              className="fixed pointer-events-none z-50 w-[200px] h-[250px] rounded-2xl"
              style={{
                top: lerpedPos.y,
                left: lerpedPos.x + 24,
                transform: "translate(0, -50%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {displayIndex > 0 && (
                <motion.img
                  src={patients[displayIndex - 1]?.image}
                  alt="previous"
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}

              <motion.img
                key={`img-${displayIndex}`}
                src={patients[displayIndex].image}
                alt="current"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(0% 100% 0% 0%)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
            whileDrag={{ scale: 1.03 }}
            dragMomentum={false}
            className={`
      bg-[#F3F2F6]/70 text-black backdrop-blur-md
      w-[320px] min-h-[450px] flex flex-col justify-start
      border border-gray-300  relative cursor-grab active:cursor-grabbing
    `}
            style={{
              zIndex: i + 1,
            }}
          >
            <div className="p-4 flex flex-col gap-2">
              <div
                className="w-full h-[240px] bg-cover bg-center"
                style={{ backgroundImage: `url(${t.image})` }}
              />

              <h3 className="font-neuehaas45 text-xl leading-tight uppercase">
                {t.name}
              </h3>
              <p className="font-ibmregular text-[12px] leading-snug tracking-tight">
                {t.text}
              </p>
            </div>
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
export default StickyColumnScroll;
