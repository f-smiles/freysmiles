"use client";

import NormalizeWheel from "normalize-wheel";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as OGL from "ogl";
import {
  ScrollControls,
  useScroll as useThreeScroll,
  Scroll,
  Text,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  useLoader,
  useTexture,
} from "@react-three/fiber";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Texture,
  Mesh,
  Program,
} from "ogl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    SplitText,
    useGSAP,
    CustomEase,
    MotionPathPlugin
  );
}

gsap.registerPlugin(ScrollTrigger, SplitText);

const Braces = () => {
  useEffect(() => {
    const canvas = document.getElementById("shader-bg");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_mouse: { value: new THREE.Vector2() },
    };

    const vertexShader = `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
   precision mediump float;

uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 centeredUV = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  vec3 stone = vec3(0.94, 0.93, 0.91);
  vec2 orbCenter = vec2(-0.15, -0.05); // slightly left of center
  float orbDist = length(centeredUV - orbCenter);
  float orb = smoothstep(0.8, 0.0, orbDist); 
  vec3 glow = vec3(1.0, 0.93, 0.72); 
  vec3 color = mix(stone, glow, orb * 0.8); 
  gl_FragColor = vec4(color, 1.0);
}
 `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    const handleMouseMove = (e) => {
      uniforms.u_mouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
    };
  }, []);

  const sectionRef = useRef(null);
  const lineRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    gsap.set(lineRefs.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set(textRefs.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center-=100",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    lineRefs.current.forEach((line, i) => {
      tl.to(
        line,
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
        },
        i * 0.2
      );
    });

    textRefs.current.forEach((text, i) => {
      tl.to(
        text,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        i * 0.2 + 0.1
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const items = [
    "Cleaner braces",
    "Less discomfort",
    "Less time in treatment",
    "Fewer office visits",
    "Less frequent office visits",
    "Wider arches than other braces",
    "Fewer extractions of permanent teeth",
  ];
  const ELLIPSE_COUNT = 7;
  const ellipsesRef = useRef([]);

  useEffect(() => {
    ellipsesRef.current.forEach((el, i) => {
      gsap.to(el, {
        yPercent: i * 60,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-down",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
  }, []);

  const pathRef = useRef(null);
  const cardsectionRef = useRef(null);
  const textContainerRef = useRef(null);
  useEffect(() => {
    const path = pathRef.current;
    const text = textContainerRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: 0,
    });

    gsap.set(text, {
      opacity: 0,
      y: 30,
      filter: "blur(2px)",
    });

    const trigger = ScrollTrigger.create({
      trigger: cardsectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(path, {
          strokeDashoffset: progress * pathLength,
          ease: "none",
          overwrite: true,
        });

        const textFadeStart = 0.66;
        const textFadeDuration = 0.33;

        if (progress >= textFadeStart) {
          const textProgress = (progress - textFadeStart) / textFadeDuration;
          const easedProgress = gsap.parseEase("sine.out")(
            Math.min(1, textProgress)
          );

          gsap.to(text, {
            opacity: easedProgress,
            y: 30 * (1 - easedProgress),
            filter: `blur(${2 * (1 - easedProgress)}px)`,
            ease: "none",
            overwrite: true,
          });
        } else {
          gsap.to(text, {
            opacity: 0,
            y: 30,
            filter: "blur(2px)",
            overwrite: true,
            duration: 0.2,
          });
        }
      },
      onLeave: () => {
        gsap.to(text, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          overwrite: true,
          duration: 0.3,
        });
      },
    });

    return () => {
      if (trigger) trigger.kill();
      gsap.killTweensOf([path, text]);
    };
  }, []);

  return (
    <>
      <canvas
        id="shader-bg"
        className="fixed top-0 left-0 w-full min-h-screen z-[-1] pointer-events-none"
      />
      <div className="relative">
        <div className="min-h-screen flex flex-col items-center space-y-16 px-4">
          <div className="h-[33vh]" />

          <div className="text-[13px] max-w-[500px] font-neuehaas45 leading-snug tracking-wider">
            We love our patients so much we only use braces when we have to. Not
            because it’s cheaper. Not because it’s easier. Just because it’s
            what’s best. And when braces are needed? We're using the best
            ones—and getting them off as fast as humanly possible when there's
            no longer a need for braces which could cause staining and cavities.
          </div>
          <div className="h-[20vh]" />
          <img
            src="/images/ajomockupchair.png"
            className="w-2/3 object-contain"
            alt="AJO Mockup"
          />
        </div>

        <div className="h-[20vh]" />
        <div className="grid grid-cols-2 h-screen w-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl mx-auto">
              <section className="px-8 py-24 font-neuehaas45 text-sm tracking-tight">
                <div className="mb-10">
                  <h1 className="text-[42px] font-neuehaas45 tracking-wide flex items-center gap-2">
                    <span className="w-[1px] h-[42px] bg-black opacity-30"></span>
                    <span>Not Your</span>
                    {/* <span className="w-[1px] h-[42px] bg-black opacity-30"></span> */}
                    <span>Average Braces</span>
                  </h1>
                  <p className="mt-4 text-[12px] tracking-wider max-w-xs leading-snug font-neuehaas45 uppercase">
                    You may experience some <strong>or</strong> all of the many
                    benefits
                  </p>
                </div>
                <div ref={sectionRef} className="space-y-4">
                  {items.map((item, i) => (
                    <div key={item} className="space-y-4">
                      <div
                        ref={(el) => (lineRefs.current[i] = el)}
                        className="h-[1px] bg-[#cdccc9] w-full origin-left scale-x-0"
                      />
                      <div
                        ref={(el) => (textRefs.current[i] = el)}
                        className="tracking-wide font-neuehaas45 text-[13px]"
                      >
                        <li>{item}</li>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/images/7number.png"
              className="max-w-full max-h-[100vh] object-contain"
              alt="7graphic"
            />
          </div>
        </div>
        <section
          ref={cardsectionRef}
          className="h-[100vh] relative z-10 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 951 367"
            fill="none"
            className="w-full h-auto max-w-5xl pt-40 mx-auto"
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
        </section>
        <div className="flex flex-col justify-center items-center min-h-screen space-y-24 font-neuehaas45 px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl gap-12">
            <div className="max-w-[450px]">
              <h2 className="uppercase tracking-wider text-[12px] font-neuehaas35 mb-4">
                Cleaner by Design
              </h2>
              <p className="text-[15px] leading-snug font-neuehaas45">
                The self-closing door means no need for elastic ties — fewer
                materials in your mouth and less friction. The wire itself is a
                shape-memory alloy engineered to move teeth smoothly and
                efficiently.
              </p>
            </div>

            <div className="max-w-[450px]">
              <h2 className="uppercase tracking-wider text-[12px] font-neuehaas35 mb-4">
                Less Frequent Office Visits
              </h2>
              <p className="text-[15px] leading-snug font-neuehaas45">
                With Damon archwires, rubber ties are not a mandatory component.
                The sliding door keeps the wire secure until we choose to move
                it. No metal twist ties pretending to be high-tech.
              </p>
            </div>
          </div>

          <h2 className="text-[60px] font-saolitalic pt-4 pb-2">
            Vivre sa vie
          </h2>

          <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl gap-12">
            <div className="max-w-[450px]">
              <h2 className="uppercase tracking-wider text-[12px] font-neuehaas35 mb-4">
                Smarter Mechanics
              </h2>
              <p className="text-[15px] leading-snug font-neuehaas45">
                Damon braces uses a sliding door mechanism that reduces the
                amount of friction during tooth movement. This allows for more
                efficient initial tooth alignment. Not only is this faster
                movement completely healthy and safe, it will help you achieve
                the results in half the time.
              </p>
            </div>

            <div className="max-w-[450px]">
              <h2 className="uppercase tracking-wider text-[12px] font-neuehaas35 mb-4">
                Fewer Appointments. More Time for Personal Nonsense
              </h2>
              <p className="text-[15px] leading-snug font-neuehaas45">
                Traditional braces (aka twin brackets) often require monthly
                visits just to replace rubber bands that lose elasticity
                fast—and don’t even hold the wire that well. In some cases, the
                rubber’s so weak that doctors resort to metal twist ties. Yes.
                Think—barbed wire, but in your mouth.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-start py-24 px-4">
          <div className="max-w-2xl w-full text-[15px] font-neuehaas45 space-y-6 leading-snug">
            <h2 className="text-[14px] uppercase tracking-wider font-neuehaas35 mb-2">
              Considerations with Braces
            </h2>
            <p className="font-neuehaas45">
              Because of their complex geometry, brackets make thorough cleaning
              significantly more difficult. Plaque retention becomes almost
              inevitable — which increases the risk of permanent enamel damage
              and long-term discoloration due to decalcification.
            </p>

            <p className="font-neuehaas45">
              A successful outcome with braces comes down to three essentials:
              frequent and consistent hygiene practices, mindful eating, and
              staying consistent with appointments. The constellation of these
              habits works in tandem to keep your treatment efficient,
              comfortable, and on track.
            </p>

            <p className="font-neuehaas45">
              We’ve put together a few practical tips to help you stay on top of
              it all.
            </p>

            <div className="pt-6">
              <a
                href="/caring-for-your-braces"
                className="z-10 inline-flex items-center justify-center text-[14px] uppercase tracking-wide font-neuehaas35 border border-black px-6 py-2 hover:bg-black hover:text-white transition-all"
                role="button"
              >
                How to Care for Your Braces
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start py-24 px-4">
          <div className="w-full max-w-3xl pt-12">
            <p className="text-center text-[14px] font-neuehaas35 uppercase tracking-wide opacity-60 mb-2">
              A final note on treatment philosophy
            </p>
            <h3 className="text-center text-[32px] font-neuehaas45 leading-snug mb-4">
              In most cases, we still prefer finishing with clear aligners.
            </h3>
            <p className="text-[15px] leading-[1.2] font-neuehaas45 max-w-xl mx-auto">
              Our breadth of clinical experience with fixed appliances —
              including Damon Braces — has shaped our current methodology: we
              begin with braces when they offer a mechanical advantage, then
              transition to clear aligners to guide teeth into their final
              position. This hybrid approach creates a more cohesive treatment
              arc — not only improving precision and predictability, but also
              easing patients into the retention phase with less relapse and
              better long-term compliance.
            </p>
          </div>
        </div>

        <FluidSimulation />
        {/* <WebGLGalleryApp /> */}
      </div>
      <footer id="scroll-down" className=" relative overflow-hidden h-[100vh]">
        <div className="relative w-full h-full">
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(70deg) translateZ(1px) scaleY(.6)",
              height: "100%",
              width: "100%",
              position: "relative",
              transformOrigin: "center",
              perspective: "2000px",
              backfaceVisibility: "hidden",
            }}
            className="w__oval-animations relative w-full h-full"
          >
            {[...Array(ELLIPSE_COUNT)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (ellipsesRef.current[i] = el)}
                className="absolute w-[60vw] h-[24vw] rounded-full"
                style={{
                  left: "50%",
                  marginLeft: "-45vw",
                  border: "3px solid #f7f5f7",
                  boxSizing: "border-box",
                  // willChange: "transform",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transformOrigin: "center",
                  filter: "contrast(1.1)",
                }}
              />
            ))}
          </div>
          <div className="w__scroll-down__trigger" />
        </div>
      </footer>
      {/* <TextEffect 
    text="Braces" 
    font="NeueHaasRoman" 
    color="#ffffff" 
    fontWeight="normal" 
  /> */}
    </>
  );
};

export default Braces;

const FluidSimulation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 28,
      SPLAT_RADIUS: 0.0008,
    };

    let pointers = [];
    let splatStack = [];

    const { gl, ext } = getWebGLContext(canvas);

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
      };

      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl,
          gl.RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }

      return {
        internalFormat,
        format,
      };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status != gl.FRAMEBUFFER_COMPLETE) return false;
      return true;
    }

    function pointerPrototype() {
      this.id = -1;
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.down = false;
      this.moved = false;
      this.color = [30, 0, 300];
    }

    pointers.push(new pointerPrototype());

    class GLProgram {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = gl.createProgram();

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          throw gl.getProgramInfoLog(this.program);

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i).name;
          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName
          );
        }
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(shader);

      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
void main() {
    vec3 rawColor = texture2D(uTexture, vUv).rgb;

    // Tone down bright white centers
    rawColor = clamp(rawColor, 0.0, 0.6);

    // More pink, less orange: soft pastel pink
    vec3 pinkTint = vec3(1.0, 0.75, 0.9);  // Reddish-pink tone

    // Blend the raw color and pink tint
    vec3 color = mix(rawColor, pinkTint, 0.4);  // Slightly more tinting

    // Feathered alpha for a wispy look
    float intensity = length(rawColor);
    float alpha = pow(intensity, 1.2) * smoothstep(0.0, 0.4, intensity);
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha * 0.7);  // Slightly softer visibility
}
    `
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );

    const advectionManualFilteringShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (in sampler2D sam, in vec2 p) {
          vec4 st;
          st.xy = floor(p - 0.5) + 0.5;
          st.zw = st.xy + 1.0;
          vec4 uv = st * texelSize.xyxy;
          vec4 a = texture2D(sam, uv.xy);
          vec4 b = texture2D(sam, uv.zy);
          vec4 c = texture2D(sam, uv.xw);
          vec4 d = texture2D(sam, uv.zw);
          vec2 f = p - st.xy;
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main () {
          vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
          gl_FragColor = dissipation * bilerp(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      vec2 sampleVelocity (in vec2 uv) {
          vec2 multiplier = vec2(1.0, 1.0);
          if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
          if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
          if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
          if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
          return multiplier * texture2D(uVelocity, uv).xy;
      }

      void main () {
          float L = sampleVelocity(vL).x;
          float R = sampleVelocity(vR).x;
          float T = sampleVelocity(vT).y;
          float B = sampleVelocity(vB).y;
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
      }
    `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = vec2(abs(T) - abs(B), 0.0);
          force *= 1.0 / length(force + 0.00001) * curl * C;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }

      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }

      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    let textureWidth;
    let textureHeight;
    let density;
    let velocity;
    let divergence;
    let curl;
    let pressure;

    function initFramebuffers() {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;

      density = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        rgba.internalFormat,
        rgba.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      velocity = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        rg.internalFormat,
        rg.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      divergence = createFBO(
        4,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        5,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        6,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    function createFBO(texId, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0 + texId);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId];
    }

    function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(
        texId + 1,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );

      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (destination) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(
      baseVertexShader,
      ext.supportLinearFiltering
        ? advectionShader
        : advectionManualFilteringShader
    );
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader
    );

    initFramebuffers();

    let lastTime = Date.now();
    multipleSplats(parseInt(Math.random() * 20) + 5);

    function update() {
      resizeCanvas();

      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) multipleSplats(splatStack.pop());

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read[2]);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(density.write[1]);
      density.swap();

      for (let i = 0; i < pointers.length; i++) {
        const pointer = pointers[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read[2]);
      blit(curl[1]);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write[1]);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read[2]);
      blit(divergence[1]);

      clearProgram.bind();
      let pressureTexId = pressure.read[2];
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.write[1]);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      pressureTexId = pressure.read[2];
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
        blit(pressure.write[1]);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read[2]);
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read[2]);
      blit(velocity.write[1]);
      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
      blit(null);

      requestAnimationFrame(update);
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      );
      gl.uniform2f(
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      );
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
      gl.uniform3f(
        splatProgram.uniforms.color,
        color[0] * 0.3,
        color[1] * 0.3,
        color[2] * 0.3
      );
      blit(density.write[1]);
      density.swap();
    }

    function multipleSplats(amount) {
      for (let i = 0; i < amount; i++) {
        const color = [
          Math.random() * 10,
          Math.random() * 10,
          Math.random() * 10,
        ];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }
    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        initFramebuffers();
      }
    }

    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      pointers[0].moved = true;
      pointers[0].dx = (e.offsetX - pointers[0].x) * 10.0;
      pointers[0].dy = (e.offsetY - pointers[0].y) * 10.0;
      pointers[0].x = e.offsetX;
      pointers[0].y = e.offsetY;

      const hue = Math.random();
      const sat = 0.6 + Math.random() * 0.3;
      const val = 0.8 + Math.random() * 0.2;

      function hsv2rgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
        return [r, g, b];
      }

      pointers[0].color = hsv2rgb(hue, sat, val);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        let pointer = pointers[i];
        pointer.moved = pointer.down;
        pointer.dx = (touches[i].pageX - pointer.x) * 10.0;
        pointer.dy = (touches[i].pageY - pointer.y) * 10.0;
        pointer.x = touches[i].pageX;
        pointer.y = touches[i].pageY;
      }
    };

    const handleMouseDown = () => {
      pointers[0].down = true;
      pointers[0].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2,
      ];
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) pointers.push(new pointerPrototype());

        pointers[i].id = touches[i].identifier;
        pointers[i].down = true;
        pointers[i].x = touches[i].pageX;
        pointers[i].y = touches[i].pageY;
        pointers[i].color = [
          Math.random() + 0.2,
          Math.random() + 0.2,
          Math.random() + 0.2,
        ];
      }
    };

    const handleMouseLeave = () => {
      pointers[0].down = false;
    };

    const handleTouchEnd = (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++)
        for (let j = 0; j < pointers.length; j++)
          if (touches[i].identifier == pointers[j].id) pointers[j].down = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleTouchEnd);

    const animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        height: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
      }}
    />
  );
};

const TextEffect = ({
  text = "braces",
  font = "NeueHaasDisplay35",
  color = "#ffffff",
  fontWeight = "100",
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planeMeshRef = useRef(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const prevPositionRef = useRef({ x: 0.5, y: 0.5 });
  const easeFactorRef = useRef(0.02);
  const animationRef = useRef(null);
  const textureRef = useRef(null);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
      vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
      vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

      vec2 mouseDirection = u_mouse - u_prevMouse;

      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

      vec2 uvOffset = strength * -mouseDirection * 0.4;
      vec2 uv = vUv - uvOffset;

      vec4 color = texture2D(u_texture, uv);
      gl_FragColor = color;
    }
  `;

  const createTextTexture = (text, font, size, color, fontWeight = "100") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const canvasWidth = window.innerWidth * 2;
    const canvasHeight = window.innerHeight * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = color || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = size || Math.floor(canvasWidth * 2);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = `${fontWeight} ${fontSize}px "${font || "NeueHaasRoman"}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const scaleFactor = Math.min(1, (canvasWidth * 1) / textWidth);
    const aspectCorrection = canvasWidth / canvasHeight;

    ctx.setTransform(
      scaleFactor,
      0,
      0,
      scaleFactor / aspectCorrection,
      canvasWidth / 2,
      canvasHeight / 2
    );

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = fontSize * 0.005;
    for (let i = 0; i < 3; i++) {
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    textureRef.current = texture;
    return texture;
  };

  const initializeScene = (texture) => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1 / aspectRatio,
      -1 / aspectRatio,
      0.1,
      1000
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    const shaderUniforms = {
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_prevMouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: texture },
    };

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );
    planeMeshRef.current = planeMesh;

    scene.add(planeMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);
  };

  const reloadTexture = () => {
    const newTexture = createTextTexture(text, font, null, color, fontWeight);
    planeMeshRef.current.material.uniforms.u_texture.value = newTexture;
    if (textureRef.current) {
      textureRef.current.dispose();
    }
    textureRef.current = newTexture;
  };

  const animateScene = () => {
    if (
      !planeMeshRef.current ||
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    ) {
      return;
    }

    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    const { x: targetX, y: targetY } = targetMousePositionRef.current;
    const { x: prevX, y: prevY } = prevPositionRef.current;
    const easeFactor = easeFactorRef.current;

    mousePositionRef.current.x += (targetX - mouseX) * easeFactor;
    mousePositionRef.current.y += (targetY - mouseY) * easeFactor;

    planeMeshRef.current.material.uniforms.u_mouse.value.set(
      mousePositionRef.current.x,
      1.0 - mousePositionRef.current.y
    );

    planeMeshRef.current.material.uniforms.u_prevMouse.value.set(
      prevX,
      1.0 - prevY
    );

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animateScene);
  };

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;

    easeFactorRef.current = 0.035;
    const rect = containerRef.current.getBoundingClientRect();
    prevPositionRef.current = {
      x: targetMousePositionRef.current.x,
      y: targetMousePositionRef.current.y,
    };

    targetMousePositionRef.current.x = (event.clientX - rect.left) / rect.width;
    targetMousePositionRef.current.y = (event.clientY - rect.top) / rect.height;
  };

  const handleMouseEnter = (event) => {
    if (!containerRef.current) return;

    easeFactorRef.current = 0.01;
    const rect = containerRef.current.getBoundingClientRect();

    mousePositionRef.current.x = targetMousePositionRef.current.x =
      (event.clientX - rect.left) / rect.width;
    mousePositionRef.current.y = targetMousePositionRef.current.y =
      (event.clientY - rect.top) / rect.height;
  };

  const handleMouseLeave = () => {
    easeFactorRef.current = 0.01;
    targetMousePositionRef.current = {
      x: prevPositionRef.current.x,
      y: prevPositionRef.current.y,
    };
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    const aspectRatio = window.innerWidth / window.innerHeight;
    cameraRef.current.left = -1;
    cameraRef.current.right = 1;
    cameraRef.current.top = 1 / aspectRatio;
    cameraRef.current.bottom = -1 / aspectRatio;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    reloadTexture();
  };
  useEffect(() => {
    let mounted = true;
    const currentContainer = containerRef.current;

    const init = async () => {
      try {
        const fontSize = Math.floor(window.innerWidth * 2);
        await document.fonts.load(`${fontWeight} ${fontSize}px "${font}"`);
        await document.fonts.ready;

        if (!mounted) return;

        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);

        if (currentContainer) {
          currentContainer.addEventListener("mousemove", handleMouseMove);
          currentContainer.addEventListener("mouseenter", handleMouseEnter);
          currentContainer.addEventListener("mouseleave", handleMouseLeave);
        }
        window.addEventListener("resize", onWindowResize);
      } catch (error) {
        console.error("Font loading error:", error);

        if (!mounted) return;

        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);

        if (currentContainer) {
          currentContainer.addEventListener("mousemove", handleMouseMove);
          currentContainer.addEventListener("mouseenter", handleMouseEnter);
          currentContainer.addEventListener("mouseleave", handleMouseLeave);
        }
        window.addEventListener("resize", onWindowResize);
      }
    };

    init();

    return () => {
      mounted = false;
      cancelAnimationFrame(animationRef.current);

      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
        currentContainer.removeEventListener("mouseenter", handleMouseEnter);
        currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", onWindowResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement?.remove();
      }
      if (planeMeshRef.current) {
        planeMeshRef.current.material?.dispose();
        planeMeshRef.current.geometry?.dispose();
      }
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => {
          child.material?.dispose();
          child.geometry?.dispose();
        });
      }
    };
  }, [text, font, color, fontWeight]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", cursor: "none" }}
    />
  );
};

const fragment = `precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  gl_FragColor.rgb = texture2D(tMap, uv).rgb;
  gl_FragColor.a = 1.0;
}`;

const vertex = `
#define PI 3.1415926535897932384626433832795

precision highp float;
precision highp int;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uStrength;
uniform vec2 uViewportSizes;

varying vec2 vUv;

void main() {
  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
  newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * -uStrength;
  vUv = uv;
  gl_Position = projectionMatrix * newPosition;
}
`;
function WebGLGalleryApp() {
  const canvasRef = useRef(null);
  const galleryRef = useRef(null);
  const mediasRef = useRef([]);
  const scrollRef = useRef({ ease: 0.05, current: 0, target: 0, last: 0 });
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const geometryRef = useRef();
  const viewportRef = useRef();
  const screenRef = useRef();
  const galleryHeightRef = useRef();

  useEffect(() => {
    const renderer = new Renderer({ canvas: canvasRef.current, alpha: true });
    const gl = renderer.gl;
    const camera = new Camera(gl);
    camera.position.z = 5;
    const scene = new Transform();
    const geometry = new Plane(gl, { heightSegments: 10 });

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    geometryRef.current = geometry;

    const resize = () => {
      screenRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      renderer.setSize(screenRef.current.width, screenRef.current.height);

      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height,
      });

      const fov = camera.fov * (Math.PI / 180);
      const height = 2 * Math.tan(fov / 2) * camera.position.z;
      const width = height * camera.aspect;

      viewportRef.current = { width, height };

      const galleryBounds = galleryRef.current.getBoundingClientRect();
      galleryHeightRef.current = galleryBounds.height;

      if (mediasRef.current.length) {
        mediasRef.current.forEach((media) =>
          media.onResize({
            screen: screenRef.current,
            viewport: viewportRef.current,
          })
        );
      }
    };

    resize();

    const figures = galleryRef.current.querySelectorAll("figure");
    const medias = Array.from(figures).map((element) =>
      createMedia({
        element,
        geometry,
        gl,
        scene,
        screen: screenRef.current,
        viewport: viewportRef.current,
        vertex,
        fragment,
      })
    );
    mediasRef.current = medias;

    const update = () => {
      scrollRef.current.current = lerp(
        scrollRef.current.current,
        scrollRef.current.target,
        scrollRef.current.ease
      );

      const direction =
        scrollRef.current.current > scrollRef.current.last ? "down" : "up";

      mediasRef.current.forEach((media) =>
        media.update(scrollRef.current, direction)
      );

      renderer.render({ scene, camera });

      scrollRef.current.last = scrollRef.current.current;

      requestAnimationFrame(update);
    };

    update();

    window.addEventListener("resize", resize);
    window.addEventListener("wheel", (e) => {
      const normalized = NormalizeWheel(e);
      scrollRef.current.target += normalized.pixelY * 0.5;

      const galleryHeight = galleryRef.current.getBoundingClientRect().height;
      const maxScroll = galleryHeight - window.innerHeight;
      scrollRef.current.target = Math.max(
        0,
        Math.min(maxScroll, scrollRef.current.target)
      );
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="h-screen w-full webgl-canvas" />
      <div className="gallery1" ref={galleryRef}>
        <main>
          <section className="gallery-section">
            <div className="gallery1">
              {images.map((src, i) => (
                <figure key={i} className="gallery__item">
                  <img
                    className="gallery__image"
                    src={src}
                    alt={`Gallery ${i + 1}`}
                  />
                </figure>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function createMedia({
  element,
  geometry,
  gl,
  scene,
  screen,
  viewport,
  vertex,
  fragment,
}) {
  const img = element.querySelector("img");
  const bounds = element.getBoundingClientRect();
  const texture = new Texture(gl, { generateMipmaps: false });
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = img.src;

  const state = {
    plane: null,
    program: null,
  };

  const createMesh = () => {
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [viewport.width, viewport.height] },
        uStrength: { value: 0 },
      },
      transparent: true,
    });

    const plane = new Mesh(gl, { geometry, program });
    plane.setParent(scene);

    state.plane = plane;
    state.program = program;
  };

  const updateScale = () => {
    state.plane.scale.x = (viewport.width * bounds.width) / screen.width;
    state.plane.scale.y = (viewport.height * bounds.height) / screen.height;
  };

  const updateX = (x = 0) => {
    state.plane.position.x =
      -(viewport.width / 2) +
      state.plane.scale.x / 2 +
      ((bounds.left - x) / screen.width) * viewport.width;
  };

  const updateY = (y = 0) => {
    state.plane.position.y =
      viewport.height / 2 -
      state.plane.scale.y / 2 -
      ((bounds.top - y) / screen.height) * viewport.height;
  };

  const onResize = (sizes) => {
    if (sizes) {
      if (sizes.screen) screen = sizes.screen;
      if (sizes.viewport) {
        viewport = sizes.viewport;
        state.program.uniforms.uViewportSizes.value = [
          viewport.width,
          viewport.height,
        ];
      }
    }
    updateBounds();
  };

  const updateBounds = () => {
    updateScale();
    updateX();
    updateY();
    state.program.uniforms.uPlaneSizes.value = [
      state.plane.scale.x,
      state.plane.scale.y,
    ];
  };

  const update = (scroll, direction) => {
    updateScale();
    updateX();
    updateY(scroll.current);

    // Calculate base strength
    const baseStrength = ((scroll.current - scroll.last) / screen.width) * 10;

    // Reverse the strength based on direction
    state.program.uniforms.uStrength.value =
      direction === "down" ? -Math.abs(baseStrength) : Math.abs(baseStrength);
  };

  image.onload = () => {
    texture.image = image;
    state.program.uniforms.uImageSizes.value = [
      image.naturalWidth,
      image.naturalHeight,
    ];
  };

  createMesh();
  updateBounds();

  return {
    update,
    onResize,
    get plane() {
      return state.plane;
    },
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

const images = [
  "/images/background_min.png",
  "/images/bracesrubberbands.png",
  "/images/adobetest.png",
  "/images/glassflower.jpeg",
  "/images/glassflower.jpeg",
  "/images/image6.jpg",
];
