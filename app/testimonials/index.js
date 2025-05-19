"use client";
import MouseTrail from "./mouse.js";
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from "ogl";
import {
  motion,
  useInView,
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
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  EffectComposer,
  Bloom,
  Outline,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import gsap from "gsap";
import { SplitText } from "gsap/all";
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
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}

const lettersAndSymbols = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "-",
  "_",
  "+",
  "=",
  ";",
  ":",
  "<",
  ">",
  ",",
];

const TextAnimator = forwardRef(({ children, className }, ref) => {
  const textRef = useRef(null);
  const charsRef = useRef([]);
  const originalText = useRef("");

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current.textContent;
    textRef.current.innerHTML = "";

    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "1";
      span.style.transform = "translateY(0%)";
      textRef.current.appendChild(span);
      return span;
    });

    charsRef.current = chars;
    originalText.current = chars.map((span) => span.textContent); // 💾 Store clean original chars
  }, [children]);

  useImperativeHandle(ref, () => ({
    animate() {
      charsRef.current.forEach((char, position) => {
        gsap.fromTo(
          char,
          { opacity: 0, y: "100%" },
          {
            y: "0%",
            opacity: 1,
            duration: 0.03,
            repeat: 2,
            repeatRefresh: true,
            repeatDelay: 0.05,
            delay: position * 0.06,
            onRepeat: () => {
              char.textContent =
                lettersAndSymbols[
                  Math.floor(Math.random() * lettersAndSymbols.length)
                ];
            },
            onComplete: () => {
              const original = originalText.current[position];
              if (original !== undefined) {
                char.textContent = original;
              }
            },
          }
        );
      });
    },
  }));

  return (
    <span
      ref={textRef}
      // className={`hover-effect hover-effect--bg-south ${className || ''}`}
      // style={{ '--anim': 0 }}
    >
      {children}
    </span>
  );
});

const Testimonial = () => {
  const patients = [
    { name: "Lainie", duration: "20 months" },
    { name: "Ron L.", duration: "INVISALIGN" },
    { name: "Elizabeth", duration: "INVISALIGN, GROWTH APPLIANCE" },
    { name: "Kinzie", duration: "BRACES, 24 months" },
    { name: "Kasprenski" },
    { name: "Leanne", duration: "12 months" },
    { name: "Harold", duration: "Invisalign" },
    { name: "Rosie & Grace" },
    { name: "Keith", duration: "" },
    { name: "Justin", duration: "Invisalign, 2 years" },
    { name: "Kara" },
    { name: "Sophia", duration: "2 years, Braces" },
    { name: "Brynn" },
    { name: "Emma" },
    { name: "Brooke", duration: "2 years, Braces" },
    { name: "Nilaya", duration: "Braces" },
    { name: "Maria A." },
    { name: "Natasha K.", duration: "" },
    { name: "James C.", duration: "Invisalign, 2 years" },
    { name: "Devika K." },
    { name: "Ibis S.", duration: "Invisalign, 1 year" },
    { name: "Abigail" },
    { name: "Emma" },
    { name: "Karoun G", duration: "Motion Appliance, Invisalign" },
  ];
  const listRefs = useRef([]);

  useEffect(() => {
    listRefs.current.forEach((el) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <main className="demo-4">
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 2rem 2rem",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            color: "black",
          }}
        >
          Patient Cases
        </h2>

        <ul
          style={{
            margin: 0,
            padding: 0,
            width: "100%",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            counterReset: "item 0",
          }}
        >
          {patients.map((item, index) => {
            const nameRef = useRef();
            const durationRef = useRef();

            return (
              <li
                key={index}
                ref={(el) => (listRefs.current[index] = el)}
                className="list__item"
                onMouseEnter={() => {
                  nameRef.current?.animate();
                  durationRef.current?.animate();
                }}
              >
                <span className="list__item-col" aria-hidden="true" />
                <span className="list__item-col">
                  <TextAnimator ref={nameRef}>{item.name}</TextAnimator>
                </span>
                <span className="list__item-col list__item-col--last">
                  <TextAnimator ref={durationRef}>
                    {item.duration || "—"}
                  </TextAnimator>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
};

function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const { gl } = renderer;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);

    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      uniform vec2 uResolution;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uTime;
      uniform float uScroll;

      varying vec2 vUv;


      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, 289.0); 
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);
        vec4 norm = 1.79284291400159 - 0.85373472095314 * 
          vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
        g00 *= norm.x;
        g01 *= norm.y;
        g10 *= norm.z;
        g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
      }

      void main() {
        float noise = cnoise(vUv * 1.0 + uScroll + sin(uTime * 0.1));
        vec3 color = mix(uColor1, uColor2, noise);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor1: { value: new Color("#fdfaee") },
        uColor2: { value: new Color("#d6abb4") },
        uResolution: {
          value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight),
        },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };

    const handleScroll = () => {
      program.uniforms.uScroll.value = window.scrollY * 0.001;
    };

    let frameId;
    const loop = (t) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      frameId = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      program.dispose?.();
      renderer.dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
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
      duration: 1.5,
      scrambleText: {
        text: originalText.current,
        characters: charSets[charsType],
        speed: 0.8,
        revealDelay: 0,
        newChars: 0.3,
        delimiter: "",
        tweenLength: true,
      },
      ease: "power2.out",
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
          // revealDelay: 0.5,
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
      // className={` ${className || ""}`}
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

const Testimonials = () => {
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

  const listRefs = useRef([]);

  useEffect(() => {
    listRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          duration: 0.6,
          ease: "power2.out",
        }
      );
    });
  }, []);

  const patients = [
    {
      name: "Lainie",
      image: "../images/testimonials/laniepurple.png",
      duration: "20 months",
    },
    {
      name: "Ron L.",
      image: "../images/testimonials/Ron_Lucien.jpg",
      duration: "INVISALIGN",
    },
    {
      name: "Elizabeth",
      image: "../images/testimonials/elizabethpatient.jpeg",
      duration: "INVISALIGN, GROWTH APPLIANCE",
    },
    {
      name: "Kinzie",
      image: "../images/testimonials/kinzie1.jpg",
      duration: "BRACES, 24 months",
    },
    { name: "Kasprenski", image: "../images/testimonials/kasprenski.jpg" },
    {
      name: "Leanne",
      image: "../images/testimonials/leanne.png",
      duration: "12 months",
    },
    {
      name: "Harold",
      image: "../images/testimonials/Narvaez.jpg",
      duration: "Invisalign",
    },
    { name: "Rosie & Grace", image: "../images/testimonials/Rosiegrace.png" },
    {
      name: "Keith",
      image: "../images/testimonials/hobsonblue.png",
      duration: "",
    },
    {
      name: "Justin",
      image: "../images/testimonials/hurlburt.jpeg",
      duration: "Invisalign, 2 years",
    },
    { name: "Kara", image: "../images/testimonials/Kara.jpeg" },
    {
      name: "Sophia",
      image: "../images/testimonials/Sophia_Lee.jpg",
      duration: "2 years, Braces",
    },
    { name: "Brynn", image: "../images/testimonials/brynnportrait.png" },
    { name: "Emma", image: "../images/testimonials/Emma.png" },
    {
      name: "Brooke",
      image: "../images/testimonials/Brooke_Walker.jpg",
      duration: "2 years, Braces",
    },
    {
      name: "Nilaya",
      image: "../images/testimonials/nilaya.jpeg",
      duration: "Braces",
    },
    {
      name: "Maria A.",
      image: "../images/testimonials/Maria_Anagnostou.jpg",
    },
    {
      name: "Natasha K.",
      image: "../images/testimonials/Natasha_Khela.jpg",
      duration: "",
    },
    {
      name: "James C.",
      image: "../images/testimonials/James_Cipolla.jpg",
      duration: "Invisalign, 2 years",
    },
    {
      name: "Devika K.",
      image: "/images/testimonials/Devika_Knafo.jpg",
    },
    {
      name: "Ibis S.",
      image: "../images/testimonials/Ibis_Subero.jpg",
      duration: "Invisalign, 1 year",
    },
    {
      name: "Abigail",
      image: "../images/testimonials/abigail.png",
    },
    {
      name: "Emma",
      image: "../images/testimonials/EmmaF.png",
    },
    {
      name: "Karoun G",
      duration: "Motion Appliance, Invisalign",
      // image: "../images/testimonials/EmmaF.png",
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      image: "/images/_mesh_gradients/background_min.png",

      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Thomas StPierre",
      text: "I had a pretty extreme case and it took some time, but FreySmiles gave me the smile I had always hoped for. Thank you!",
      color: "bg-[#EB7104]",
      image: "/images/_mesh_gradients/sherbert.svg",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "FEI ZHAO",
      text: "Our whole experience for the past 10 years of being under Dr. Gregg Frey’s care and his wonderful staff has been amazing. My son and my daughter have most beautiful smiles, and they received so many compliments on their teeth. It has made a dramatic and positive change in their lives. Dr. Frey is a perfectionist, and his treatment is second to none. I recommend Dr. Frey highly and without any reservation.",
      color: "bg-[#80A192]",
      image: "/images/_mesh_gradients/purplepeach.jpg",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Diana Gomez",
      text: "After arriving at my sons dentist on a Friday, his dentist office now informs me that they don’t have a referral. I called the Frey smiles office when they were closed and left a message. I received a call back within minutes from Dr. Frey himself who sent the referral over immediately ( on his day off!!!) how amazing! Not to mention the staff was amazing when were were there and my children felt so comfortable! Looking forward to a wonderful smile for my son!!",
      color: "bg-[#F3B700]",
      image: "/images/_mesh_gradients/HarvestGold.jpg",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Brandi Moyer",
      text: "My experience with Dr. Frey orthodontics has been nothing but great. The staff is all so incredibly nice and willing to help. And better yet, today I found out I may be ahead of my time line to greater aligned teeth!.",
      color: "bg-[#4C90B3]",
      image: "/images/_mesh_gradients/LightSkyBlue.jpg",
    },
    {
      name: "Tracee Benton",
      text: "Dr. Frey and his orthodontist techs are the absolute best! The team has such an attention to detail I absolutely love my new smile and my confidence has significantly grown! The whole process of using Invisalign has been phenomenal. I highly recommend Dr. Frey and his team to anyone considering orthodontic work!",
      color: "bg-[#036523]",
      image: "/images/_mesh_gradients/Milkyway.jpg",
    },

    {
      name: "Sara Moyer",
      text: "We are so happy that we picked Freysmiles in Lehighton for both of our girls Invisalign treatment. Dr. Frey and all of his staff are always so friendly and great to deal with. My girls enjoy going to their appointments and love being able to see the progress their teeth have made with each tray change. We are 100% confident that we made the right choice when choosing them as our orthodontist!",

      image: "/images/_mesh_gradients/blueorange.png",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Vicki Weaver",
      text: "We have had all four of our children receive orthodontic treatment from Dr. Frey. Dr. Frey is willing to go above and beyond for his patients before, during, and after the treatment is finished. It shows in their beautiful smiles!! We highly recommend FreySmiles to all of our friends and family!",
      color: "bg-[#EA9CBE]",
      image: "/images/_mesh_gradients/Watusi.jpg",
    },
    {
      name: "Andrew Cornell",
      text: "Over 20 years ago, I went to Dr. Frey to fix my cross bite and get braces. Since then, my smile looks substantially nicer. My entire mouth feels better as well. The benefits of orthodontics under Dr. Frey continue paying dividends.",
      color: "bg-[#56A0FC]",
      image: "/images/_mesh_gradients/Tumbleweed.jpg",
    },
    {
      name: "Shelby Loucks",
      text: "THEY ARE AMAZING!! Great staff and wonderful building. HIGHLY recommend to anyone looking for an orthodontist.",
      color: "bg-[#A81919]",
      image: "/images/_mesh_gradients/purplegrey.png",

      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "Mandee Kaur",
      image: "/images/_mesh_gradients/Sunset.jpg",
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

  const isPatientSectionInView = useInView(patientSectionRef, {
    margin: "-25% 0px -25% 0px",
  });

  const textRefs = useRef([]);

  useEffect(() => {
    textRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          duration: 0.6,
          ease: "power2.out",
        }
      );
    });
  }, []);

  const dragCardRef = useRef(null);
  return (
    <>
      <Background />

      <section
        ref={sectionOneRef}
        className="z-10 relative w-full min-h-[110vh] flex flex-col px-12"
      >
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
            <h2 className="flex justify-center mb-6 text-3xl uppercase font-neueroman md:text-4xl">
              Join the smile club
            </h2>

            <div className="font-chivomono text-[14px] leading-none  uppercase font-bold relative">
              <span className="absolute invisible block">
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

        <div ref={navBarRef} className="absolute bottom-0 left-0 w-full pb-2">
          <div className="flex items-center justify-center text-[14px] uppercase font-ibmregular gap-4">
            <span
              className={isPatientSectionInView ? "opacity-100" : "opacity-30"}
            >
              ●
            </span>
            <span>Our patient results</span>

            <span
              className={!isPatientSectionInView ? "opacity-100" : "opacity-30"}
            >
              ●
            </span>
            <span>Read the reviews</span>
          </div>

          <div className="mt-1 w-full border-b border-[#D3D3D3]"></div>
        </div>
      </section>
      <Testimonial />
      {/* <section
        ref={patientSectionRef}
        className="relative w-full min-h-screen px-6 overflow-hidden "
        onMouseMove={handleMouseMove}
      >
        <div className="flex items-center justify-between w-full">
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
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

          <div className="flex-1 mx-2 border-b"></div>
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
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
              ref={(el) => (textRefs.current[index] = el)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className="border-b border-[#D3D3D3] py-6 relative"
            >
              <div className="flex items-center w-full">
                <span className="w-1/2 text-left">{member.duration}</span>
                <span className="w-1/2 text-left">{member.name}</span>
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
                  className="absolute inset-0 object-cover w-full h-full rounded-2xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}

              <motion.img
                key={`img-${displayIndex}`}
                src={patients[displayIndex].image}
                alt="current"
                className="absolute inset-0 object-cover w-full h-full rounded-2xl"
                initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ clipPath: "inset(0% 100% 0% 0%)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section> */}

      <section
        ref={dragCardRef}
        className="relative flex flex-wrap items-center justify-center min-h-screen gap-4 p-8 overflow-hidden"
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            drag
            dragConstraints={dragCardRef}
            dragElastic={0.05}
            whileDrag={{ scale: 1.03, transition: { duration: 0.1 } }}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            dragMomentum={false}
            className="relative bg-[#F3F2F6]/70 text-black backdrop-blur-md
            w-[320px] min-h-[450px] flex flex-col justify-start
            border border-gray-300 cursor-grab active:cursor-grabbing
            will-change-transform"
            style={{ zIndex: i }}
          >
            <div className="relative w-full h-[240px] p-2">
              <div
                className="w-full h-full bg-cover bg-center rounded-[8px] overflow-hidden relative"
                style={{ backgroundImage: `url(${t.image})` }}
              >
                <div className="absolute inset-0 z-10 pointer-events-none tile-overlay" />
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4">
              <h3 className="text-xl leading-tight uppercase font-neuehaas45">
                {t.name}
              </h3>
              <p className="font-chivomono text-[12px] leading-snug tracking-tight">
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
              <span className="inline-flex items-center text-black font-agrandir-bold">
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

          <div id="right-column" className="relative w-1/2">
            <section className="relative" style={{ marginBottom: "0vh" }}>
              <div className="relative w-full h-full">
                <div ref={gradient1Ref} className="gradient-container">
                  <div className="gradient-col">
                    <div className="h-full gradient-1"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-2"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-1"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-2"></div>
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

            <div class="gradient-container-2">
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
            </div>
          </div>
        </div> */}
    </>
  );
};

export default Testimonials;
