"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export default function BookNow() {
  const [time, setTime] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      style={{
        background: `
          radial-gradient(
            circle at 70% 20%,
            rgba(255,255,255,0.7) 0%,
            rgba(255,255,255,0.4) 20%,
            rgba(240,240,240,0.6) 40%,
            rgba(220,220,220,0.8) 100%
          ),
          linear-gradient(
            180deg,
            #f5f5f5 0%,
            #e8e8e8 100%
          )
        `
      }}
      className="w-full h-screen  text-black grid grid-rows-[auto_1fr_auto] fixed overflow-y-auto"
    >
      <div
        className={`
          fixed top-0 left-0 right-0 z-[100]
          transform transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]
          ${showScheduler ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="relative">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-b-2xl overflow-hidden">
            <div className="relative w-full h-[90vh]">

              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent z-40 pointer-events-none">
                <div className="flex justify-end p-6 pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowScheduler(false)
                    }}
                    className="font-canelathin text-white hover:opacity-70 transition-opacity bg-black/20 px-5 py-2 rounded-full backdrop-blur-sm"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              
              <iframe
                src="https://freysmilesappointments.as.me/"
                title="Schedule Appointment"
                className="w-full h-full"
                frameBorder="0"
                allow="payment"
                style={{ marginTop: 0 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-[99]
          transition-all duration-500 ease-in-out
          ${showScheduler ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setShowScheduler(false)}
      />

      <div className="absolute top-6 left-0 right-0 flex justify-center items-center xl:hidden z-50">
        <div
          className="
            relative
            flex flex-wrap justify-center items-center gap-4
            px-5 py-3
            rounded-full
            text-[11px] font-neuehaas35 tracking-wider uppercase
            backdrop-blur-xl
            max-w-[90vw] mx-auto
          "
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(255,255,255,0.35) 0%,
                rgba(255,255,255,0.08) 40%,
                rgba(255,255,255,0.03) 100%
              )
            `,
            backdropFilter: "blur(20px) saturate(140%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: `
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.45) 0%,
                  rgba(255,255,255,0.12) 25%,
                  rgba(255,255,255,0.04) 50%,
                  rgba(255,255,255,0.0) 70%,
                  rgba(255,255,255,0.04) 85%,
                  rgba(255,255,255,0.12) 95%,
                  rgba(255,255,255,0.45) 100%
                ),
                radial-gradient(
                  circle at 0% 50%,
                  rgba(255,255,255,0.18),
                  transparent 40%
                ),
                radial-gradient(
                  circle at 100% 50%,
                  rgba(255,255,255,0.12),
                  transparent 40%
                )
              `,
            }}
          />

          <AnimatedText
            onClick={() => setShowScheduler(true)}
            text="Book Now"
            className="text-[11px] tracking-wider uppercase leading-none block"
          />

          <div className="w-px h-4 bg-white/20" />

          <a href="/early-orthodontics">
            <AnimatedText 
              text="Early Orthodontics"
              className="text-[11px] tracking-wider uppercase leading-none block"
            />
          </a>

          <div className="w-px h-4 bg-white/20" />

          <a href="/adult-orthodontics">
            <AnimatedText 
              text="Adult Orthodontics"
              className="text-[11px] tracking-wider uppercase leading-none block"
            />
          </a>
        </div>
      </div>

      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-full h-full xl:w-auto xl:h-auto">
          <Canvas
            camera={{ position: [0, 0, 1000], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0)
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "150vw",
              height: "150vh",
              maxWidth: "800px",
              maxHeight: "800px",
              zIndex: 0,
            }}
            className="xl:w-full xl:h-full"
          >
            <ParticleScene />
          </Canvas>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-12 pt-6 text-xs tracking-wide relative z-10">
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 items-center px-4 xl:px-12 gap-8 xl:gap-0 relative z-10">
        <div className="flex flex-col items-center xl:items-center order-2 xl:order-1">
          <h1 className="text-[24px] font-neuehaas35 tracking-[.02em] xl:text-[24px] text-center xl:text-left">
            please explore our new site
          </h1>
          <div className="py-2 text-[13px] font-neuehaas35 tracking-[0.07em]">
            ...more upgrades in the works
          </div>
        </div>

        <div className="flex justify-center items-center order-1 xl:order-2 h-[300px] xl:h-auto relative">
          <div className="text-[13px] flex flex-col xl:flex-row justify-center xl:justify-start gap-4 xl:gap-12 font-neuehaas35 tracking-[0.07em] items-center xl:items-start">
            <p className="text-[12px] text-black leading-[1.6] font-ibmplex">
              <span className="block">
                <ScrambleText text="info@freysmiles.com" />
              </span>
            </p>
            <p className="text-[12px] text-black leading-[1.6] font-ibmplex">
              <span className="block">
                <ScrambleText text="(610)437-4748" charsType="numbers" />
              </span>
            </p>
          </div>
        </div>

        <div className="hidden xl:flex justify-end order-3">
          <div
            className="
              relative
              flex items-center gap-6
              px-5 py-3
              rounded-full
              text-[11px] font-neuehaas35 tracking-wider uppercase
              backdrop-blur-xl
            "
            style={{
              background: `
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.35) 0%,
                  rgba(255,255,255,0.08) 40%,
                  rgba(255,255,255,0.03) 100%
                )
              `,
              backdropFilter: "blur(20px) saturate(140%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: `
                  linear-gradient(
                    180deg,
                    rgba(255,255,255,0.45) 0%,
                    rgba(255,255,255,0.12) 25%,
                    rgba(255,255,255,0.04) 50%,
                    rgba(255,255,255,0.0) 70%,
                    rgba(255,255,255,0.04) 85%,
                    rgba(255,255,255,0.12) 95%,
                    rgba(255,255,255,0.45) 100%
                  ),
                  radial-gradient(
                    circle at 0% 50%,
                    rgba(255,255,255,0.18),
                    transparent 40%
                  ),
                  radial-gradient(
                    circle at 100% 50%,
                    rgba(255,255,255,0.12),
                    transparent 40%
                  )
                `,
              }}
            />

            <AnimatedText
              onClick={() => setShowScheduler(true)}
              text="Book Now"
              className="relative text-[11px] tracking-wider uppercase leading-none block cursor-pointer"
            />
            
            <div className="w-px h-4 bg-white/20" />

            <a href="/early-orthodontics">
              <AnimatedText 
                text="Early Orthodontics"
                className="text-[11px] tracking-wider uppercase leading-none block"
              />
            </a>

            <div className="w-px h-4 bg-white/20" />

            <a href="/adult-orthodontics">
              <AnimatedText 
                text="Adult Orthodontics"
                className="text-[11px] tracking-wider uppercase leading-none block"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col xl:flex-row justify-center gap-4 xl:gap-8 pb-6 text-xs font-neuehaas35 tracking-widest items-center relative z-10"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <div>40° 36' N 75° 29' W</div>
        <div className="hidden xl:block">•</div>

        <div className="w-[90px] text-center">
          {time}
        </div>
      </div>
    </section>
  );
}

const AnimatedText = ({ 
  text, 
  className = "",
  as: Component = "span",
  splitType = "chars,words",
  animationDistance = -100,
  staggerAmount = 0.4,
  ease = "power4.inOut",
  textShadow = true,
  onClick, 
}) => {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const charsRef = useRef(null);

  useEffect(() => {
    splitRef.current = new SplitText(textRef.current, {
      type: splitType,
      wordsClass: "overflow-hidden"
    });

    charsRef.current = splitRef.current.chars;

    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, [text, splitType]); 

  const handleMouseEnter = () => {
    if (!charsRef.current) return;

    gsap.to(charsRef.current, {
      yPercent: animationDistance,
      ease: ease,
      stagger: {
        amount: staggerAmount,
        from: "random"
      }
    });
  };

  const handleMouseLeave = () => {
    if (!charsRef.current) return;

    gsap.to(charsRef.current, {
      yPercent: 0,
      ease: ease,
      stagger: {
        amount: staggerAmount,
        from: "random"
      },
      overwrite: true
    });
  };

  const textShadowStyle = textShadow ? { textShadow: '0 1em' } : {};

  return (
    <Component
      ref={textRef}
      className={className}
      style={textShadowStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick} 

    >
      {text}
    </Component>
  );
};

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
      duration: 0.8,
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
      ref={scrambleRef}
      className={`scramble-text inline-block ${className || ""}`}
      style={{ minWidth: `${text.length}ch` }}
    >
      {text}
    </span>
  );
};

const ParticleSystem = () => {
  const particlesCount = 27000;
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef();

  const positions = useMemo(() => new Float32Array(particlesCount * 3), []);
  const velocities = useMemo(() => new Float32Array(particlesCount * 3), []);

  const createSphere = (count, radius) => {
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
  };

  useEffect(() => {
    createSphere(particlesCount, 400);
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  }, []);

  const { size, gl } = useThree();
  const boundsRef = useRef();

  useEffect(() => {
    const canvasEl = gl.domElement;
    const handleMove = (e) => {
      const rect = canvasEl.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [gl]);

  useFrame(() => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i];
      pos[i + 1] += velocities[i + 1];
      pos[i + 2] += velocities[i + 2];

      const dist = Math.sqrt(pos[i] ** 2 + pos[i + 1] ** 2 + pos[i + 2] ** 2);
      const radius = 400;
      if (dist > radius) {
        const nx = pos[i] / dist;
        const ny = pos[i + 1] / dist;
        const nz = pos[i + 2] / dist;

        pos[i] = nx * radius;
        pos[i + 1] = ny * radius;
        pos[i + 2] = nz * radius;

        // reflect velocity inward
        const dot =
          velocities[i] * nx +
          velocities[i + 1] * ny +
          velocities[i + 2] * nz;

        velocities[i] -= 2 * dot * nx;
        velocities[i + 1] -= 2 * dot * ny;
        velocities[i + 2] -= 2 * dot * nz;

        velocities[i] *= 0.6;
        velocities[i + 1] *= 0.6;
        velocities[i + 2] *= 0.6;
      }
      const dx = mouseRef.current.x - pos[i];
      const dy = -mouseRef.current.y - pos[i + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      const MOUSE_RADIUS = 120;
      const MOUSE_STRENGTH = 0.04;

      if (distance > 0 && distance < MOUSE_RADIUS) {
        const force = (1 - distance / MOUSE_RADIUS) * MOUSE_STRENGTH;
        velocities[i] -= (dx / distance) * force;
        velocities[i + 1] -= (dy / distance) * force;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particlesCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xff33cc} 
        size={2.6}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

const ParticleScene = () => {
  return (
    <>
      <ParticleSystem />
      {/* <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
        screenSpacePanning={false} 
        maxPolarAngle={Math.PI / 2} 
      /> */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={1.5}
          height={300}
        />
      </EffectComposer>
    </>
  );
};