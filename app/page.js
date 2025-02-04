"use client";
import { Curtains, Plane } from "curtainsjs";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { Vector2, Vector4 } from "three";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Keyboard, Mousewheel } from "swiper/core";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import Matter from "matter-js";
import * as THREE from "three";
import { GUI } from "dat.gui";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
// framer motion
import { motion, stagger, useAnimate, useInView } from "framer-motion";
// headless ui
import { Disclosure, Transition } from "@headlessui/react";
// gsap
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap-trial/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import { SplitText } from "gsap-trial/SplitText";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import ChevronRightIcon from "./_components/ui/ChevronRightIcon";
import * as OGL from "ogl";

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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function LandingComponent() {
  useEffect(() => {
    const parallaxItems = gsap.utils.toArray("[data-item]");
    const tl = gsap.timeline();

    parallaxItems.forEach((item, index) => {
      if (index > 0) {
        tl.to(item, {
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: `+=${item.offsetHeight * index} top`,
            scrub: 1,
          },
          marginTop: `-${item.offsetHeight}`,
          ease: "power1.out",
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div>
        <section
        // className="relative"
        // style={{
        //   height: "100vh",
        // }}
        // data-item
        >
          <Hero />
        </section>
        <section
        // className="relative"
        // style={{
        //   height: "60vh",
        // }}
        // data-item
        >
          {/* <MarqueeSection /> */}
        </section>
        <section
        // className="relative" style={{}} data-item
        >
          <Stats />
        </section>
        <section>
          {/* <ImageGrid /> */}
        </section>
        <section>
          <NewSection />
        </section>

        <section
        // className="relative"
        // style={{
        //   height: "100vh",
        // }}
        // data-item
        >
          <Testimonials />
        </section>
        <LogoGrid />
        <Locations />
        <ContactUs />
        <GiftCards />
      </div>
    </>
  );
}

const Hero = () => {
  // const containerRef = useRef(null);
  // const div1Ref = useRef(null);
  // const div2Ref = useRef(null);
  // const div3Ref = useRef(null);
  // const div4Ref = useRef(null);
  // const listItemsRef = useRef(null);

  // useEffect(() => {
  //   gsap.set(div1Ref.current, { x: -100, y: -100 });
  //   gsap.set(div2Ref.current, { x: 100, y: -100 });
  //   gsap.set(div3Ref.current, { x: -100, y: 100 });
  //   gsap.set(div4Ref.current, { x: 100, y: 100 });
  //   gsap.to(div1Ref.current, {
  //     x: 0,
  //     y: 0,
  //     scrollTrigger: {
  //       trigger: containerRef.current,
  //       start: "top bottom",
  //       end: "center center",
  //       scrub: true,
  //     },
  //   });

  //   gsap.to(div2Ref.current, {
  //     x: 0,
  //     y: 0,
  //     scrollTrigger: {
  //       trigger: containerRef.current,
  //       start: "top bottom",
  //       end: "center center",
  //       scrub: true,
  //     },
  //   });

  //   gsap.to(div3Ref.current, {
  //     x: 0,
  //     y: 0,
  //     scrollTrigger: {
  //       trigger: containerRef.current,
  //       start: "top bottom",
  //       end: "center center",
  //       scrub: true,
  //     },
  //   });
  //   gsap.to(div4Ref.current, {
  //     x: 0,
  //     y: 0,
  //     scrollTrigger: {
  //       trigger: containerRef.current,
  //       start: "top bottom",
  //       end: "center center",
  //       scrub: true,
  //     },
  //   });
  // }, []);

  // const heroContentRef = useRef(null);
  // const bookButtonRef = useRef(null);

  // function animateHeroContent() {
  //   if (!heroContentRef.current) return;
  //   const lines = heroContentRef.current.querySelectorAll(".hero-content-line");
  //   lines.forEach((line, index) => {
  //     gsap.fromTo(
  //       line,
  //       { y: 20, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         duration: 1.5,
  //         ease: "power3.out",
  //         delay: index * 0.2,
  //       }
  //     );
  //   });
  // }

  // function animateBookButton() {
  //   if (!bookButtonRef.current) return;

  //   gsap.fromTo(
  //     bookButtonRef.current,
  //     { opacity: 0, y: 40 },
  //     { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
  //   );
  // }

  // useLayoutEffect(() => {
  //   animateHeroContent();
  //   animateBookButton();
  // }, []);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           animateElement(entry.target);
  //         }
  //       });
  //     },
  //     { threshold: 0.5 }
  //   );

  //   if (heroContentRef.current) {
  //     observer.observe(heroContentRef.current);
  //   }

  //   if (bookButtonRef.current) {
  //     observer.observe(bookButtonRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, []);

  // function animateElement(element) {
  //   if (element === heroContentRef.current) {
  //     const lines =
  //       heroContentRef.current.querySelectorAll(".hero-content-line");
  //     lines.forEach((line, index) => {
  //       gsap.fromTo(
  //         line,
  //         { y: 64, opacity: 0 },
  //         {
  //           y: 0,
  //           opacity: 1,
  //           duration: 1,
  //           ease: "power3.out",
  //           delay: index * 0.2,
  //         }
  //       );
  //     });
  //   } else if (element === bookButtonRef.current) {
  //     const button = bookButtonRef.current.querySelector(".book-button");
  //     const arrowIcon = bookButtonRef.current.querySelector(".arrow-icon");

  //     gsap.fromTo(
  //       button,
  //       { opacity: 0, y: 20 },
  //       { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
  //     );

  //     gsap.fromTo(
  //       arrowIcon,
  //       { scale: 0 },
  //       { scale: 1, duration: 1, ease: "power3.out" }
  //     );
  //   }
  // }

  // const [isScaled, setIsScaled] = useState(false);
  // const [showBookNow, setShowBookNow] = useState(false);

  // const handleClick = () => {
  //   setIsScaled(true);

  //   setTimeout(() => {
  //     setShowBookNow(true);
  //   }, 3500);
  // };

  // const itemRefs = useRef([]);
  // itemRefs.current = [];
  // const setMultipleRefs = (element) => {
  //   if (typeof listItemsRef === "function") {
  //     listItemsRef(element);
  //   } else if (listItemsRef) {
  //     listItemsRef.current = element;
  //   }

  //   if (typeof addToRefs === "function") {
  //     addToRefs(element);
  //   } else if (addToRefs) {
  //     addToRefs.current = element;
  //   }
  // };

  // const addToRefs = (el) => {
  //   if (el && !itemRefs.current.includes(el)) {
  //     itemRefs.current.push(el);
  //   }
  // };

  // const titleRef = useRef(null);

  // useEffect(() => {
  //   if (!titleRef.current) return;

  //   const titleSpans = titleRef.current.querySelectorAll("h1 > span");
  //   const titleSpansAfters = titleRef.current.querySelectorAll("h1 .after");

  //   const animSpanFrom = {
  //     "will-change": "opacity, transform",
  //     opacity: 0,
  //   };
  //   const animSpanTo = {
  //     duration: 0.62,
  //     opacity: 1,
  //     rotationX: 0,
  //     yPercent: 0,
  //     ease: "power1.inOut",
  //     stagger: {
  //       each: 0.1,
  //     },
  //   };

  //   gsap
  //     .timeline()
  //     .fromTo(
  //       titleSpans[0],
  //       { ...animSpanFrom, rotationX: 90, yPercent: -50 },
  //       animSpanTo
  //     )
  //     .fromTo(
  //       titleSpans[1],
  //       { ...animSpanFrom, rotationX: -90, yPercent: 50 },
  //       animSpanTo,
  //       "<"
  //     )
  //     .fromTo(
  //       titleSpansAfters,
  //       { width: "100%" },
  //       { duration: 0.72, ease: "expo.inOut", width: "0%" },
  //       "end"
  //     );
  // }, []);

  // const marqueeRef = useRef(null);

  // useEffect(() => {
  //   if (!marqueeRef.current) return;

  //   const marqueeSpans = marqueeRef.current.querySelectorAll(
  //     ".marquee__inner > span"
  //   );

  //   marqueeSpans.forEach((span, index) => {
  //     gsap.fromTo(
  //       span,
  //       {
  //         "will-change": "opacity, transform",
  //         opacity: 0,
  //         x: -50,
  //       },
  //       {
  //         duration: 0.62,
  //         opacity: 1,
  //         x: 0,
  //         ease: "power1.inOut",
  //         stagger: 0.1,
  //         delay: index * 0.1,
  //       }
  //     );
  //   });
  // }, []);

  // const paragraphRef = useRef(null);

  // useEffect(() => {
  //   const splitParent = new SplitText(paragraphRef.current, {
  //     type: "lines",
  //     linesClass: "lineParent",
  //   });
  //   const splitChild = new SplitText(paragraphRef.current, {
  //     type: "lines",
  //     linesClass: "lineChild",
  //   });

  //   const tl = gsap.timeline();

  //   tl.from(".lineChild", {
  //     yPercent: 100,
  //     autoAlpha: 0,
  //     delay: 0.5,
  //     duration: 0.65,
  //     stagger: 0.25,
  //     ease: "back",
  //   });

  //   return () => {
  //     splitParent.revert();
  //     splitChild.revert();
  //   };
  // }, []);

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      const easternTime = new Intl.DateTimeFormat("en-US", options).format(now);
      setTime(`${easternTime}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

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

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const imgSize = [1250, 833];

    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fragment = `
      precision highp float;
      uniform sampler2D tWater;
      uniform sampler2D tFlow;
      uniform float uTime;
      varying vec2 vUv;
      uniform vec4 res;
      void main() {
        vec3 flow = texture2D(tFlow, vUv).rgb;
        vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
        vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
        myUV -= flow.xy * (0.15 * 0.7);
        vec3 tex = texture2D(tWater, myUV).rgb;
        gl_FragColor = vec4(tex, 1.0);
      }
    `;

    // const renderer = new OGL.Renderer({ dpr: 2 });
    // const gl = renderer.gl;
    // containerRef.current.appendChild(gl.canvas);

    const renderer = new OGL.Renderer({ dpr: 2 });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    gl.canvas.style.borderRadius = "30px";
    gl.canvas.style.clipPath = "inset(0% round 30px)";

    renderer.setSize(window.innerWidth, 600);
    let aspect = 1;
    const mouse = new OGL.Vec2(-1);
    const velocity = new OGL.Vec2();

    function resize() {
      const width = 200;
      const height = 250;

      renderer.setSize(width, height);
      program.uniforms.res.value = new OGL.Vec4(width, height, 1, 1);
      aspect = width / height;
    }

    const flowmap = new OGL.Flowmap(gl);

    const geometry = new OGL.Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const texture = new OGL.Texture(gl, {
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const img = new Image();
    img.onload = () => (texture.image = img);
    img.crossOrigin = "Anonymous";
    // img.src = "../images/bubble.jpg";
    img.src = "../images/greencheckered.png";

    let a1, a2;
    var imageAspect = imgSize[1] / imgSize[0];
    if (window.innerHeight / window.innerWidth < imageAspect) {
      a1 = 1;
      a2 = window.innerHeight / window.innerWidth / imageAspect;
    } else {
      a1 = (window.innerWidth / window.innerHeight) * imageAspect;
      a2 = 1;
    }

    const program = new OGL.Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: texture },
        res: {
          value: new OGL.Vec4(window.innerWidth, window.innerHeight, a1, a2),
        },
        tFlow: flowmap.uniform,
      },
    });

    const mesh = new OGL.Mesh(gl, { geometry, program });

    window.addEventListener("resize", resize, false);
    resize();

    const isTouchCapable = "ontouchstart" in window;
    if (isTouchCapable) {
      window.addEventListener("touchstart", updateMouse, true);
      window.addEventListener("touchmove", updateMouse, { passive: true });
    } else {
      window.addEventListener("mousemove", updateMouse, true);
    }

    let lastTime;
    const lastMouse = new OGL.Vec2();

    function updateMouse(e) {
      e.preventDefault();

      const rect = gl.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.set(x / rect.width, 1 - y / rect.height);

      const sensitivity = (Math.min(rect.width, rect.height) / 300) * 3;

      if (!lastTime) {
        lastTime = performance.now();
        lastMouse.set(x, y);
      }

      const deltaX = (x - lastMouse.x) * sensitivity;
      const deltaY = (y - lastMouse.y) * sensitivity;
      lastMouse.set(x, y);

      const time = performance.now();
      const delta = Math.max(5, time - lastTime);
      lastTime = time;

      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;
      velocity.needsUpdate = true;
    }

    function update(t) {
      requestAnimationFrame(update);

      if (!velocity.needsUpdate) {
        mouse.set(-1);
        velocity.set(0);
      }
      velocity.needsUpdate = false;

      flowmap.aspect = aspect;
      flowmap.mouse.copy(mouse);
      flowmap.velocity.lerp(velocity, velocity.len ? 0.25 : 0.15);
      flowmap.update();

      program.uniforms.uTime.value = t * 0.01;
      renderer.render({ scene: mesh });
    }
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("touchstart", updateMouse);
      window.removeEventListener("touchmove", updateMouse);
      containerRef.current.removeChild(gl.canvas);
    };
  }, []);

  return (
    <div className="flex h-screen w-full">
      {/* Left Section */}
      <div className="flex-[3] flex flex-col justify-center p-8 border-r border-black">
        {/* <div className="mt-[300px] w-full">
          <div className="stagger-line overflow-hidden">
            <h1 className="text-[10vw] font-semibold font-neue-montreal leading-none w-full text-left">
              <span className="stagger-letter">F</span>
              <span className="stagger-letter">r</span>
              <span className="stagger-letter">e</span>
              <span className="stagger-letter">y</span>
              <span className="stagger-letter">&nbsp;</span>
              <span className="stagger-letter">S</span>
              <span className="stagger-letter">m</span>
              <span className="stagger-letter">i</span>
              <span className="stagger-letter">l</span>
              <span className="stagger-letter">e</span>
              <span className="stagger-letter">s</span>
            </h1>
          </div>
        </div>
     */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "600px",
          }}
        >
          <div
            ref={containerRef}
            className="pointer-events-none"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          />
        </div>


      </div>

      {/* Right Section */}
      <div className="flex-[1] flex flex-col items-center justify-start  p-4">
        <div className="mb-6">
          <div
            className="lg:w-1/3 w-full flex flex-col justify-start items-start lg:pl-8 "

          ></div>
                  <div className="">
  <video
    // src="../videos/whitewavessvg.mp4"
    src="../images/holographic.mp4"
    className="object-cover w-3/4 max-h-[80vh] rounded-md"
    autoPlay
    loop
    muted
    playsInline
  ></video>
</div>
          {/* <img
        src="../images/ribbedimage.png"
    
        className="object-cover rounded-md"
      /> */}
        </div>
        {/* <div className="stagger-line overflow-hidden mt-[6vh]">
          <p className="font-helvetica-neue-light text-xl lg:text-xl font-light leading-relaxed">
            <span className="stagger-word">
              A confident smile begins with effective care tailored to each
              patient. At our practice, we’re dedicated to providing treatments
              that are not only scientifically sound but also crafted to bring
              out your best smile.
            </span>
            <br />
          </p>
        </div> */}
        <div className="font-neue-montreal flex gap-4 mt-6">
          <div>
            <p className="font-neue-montreal text-sm tracking-widest">
              • EST {time}
            </p>
          </div>
          {/* <button className="px-6 py-2 border border-black text-black font-medium rounded-full">
            Shop →
          </button>
          <button className="px-6 py-2 border border-black text-black font-medium rounded-full">
            Learn More →
          </button> */}
        </div>
      </div>
    </div>
  );
};

const MarqueeSection = () => {
  return (
    <section
      className="bg-black rounded-tl-[40px] rounded-tr-[40px] font-neue-montreal text-white flex"
      style={{
        height: "60vh",
      }}
    >
      <div className="line"></div>
      <div className="marquee-container">
        <div className="marqueed uppercase">
          <span>Because every smile is unique ✿</span>
          <span>Because every smile is unique ✿</span>
          <span>Because every smile is unique ✿</span>
        </div>
      </div>
      <div className="line"></div>
    </section>
  );
};

const Stats = () => {
  const colors = [
    ["#8ACBBA", "#E64627", "#AE74DC", "#2A286F"],
    ["#2A286F", "#F9931F", "#FD5CD0", "#F9E132"],
    ["#241F21", "#8ACBBA", "#E51932", "#006980"],
    ["#FD5CD0", "#F9931F", "#2A286F", "#E51932"],
    // ["#9BFFE3", "#C6FEF1", "#DAFFEF", "#F1FFEB"],
    // ["#8BE5C9", "#B4E5D8", "#C5E5D6", "#D9E4D7"],
    // ["#7FCCB7", "#A1CCBF", "#B1CCBE", "#C2CDC0"],
    // ["#6DB29D", "#86AFA4", "#99B4A8", "#A7B2A7"],
  ];
  // const textVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: { duration: 0.6, ease: "easeInOut" },
  //   },
  // };

  // const spanVariants = {
  //   hidden: { opacity: 0, width: "0rem", originX: 0.5 },
  //   visible: {
  //     opacity: 1,
  //     width: "6.5rem",
  //     transition: {
  //       duration: 1.2,
  //       ease: [0.22, 1, 0.36, 1],
  //     },
  //   },
  // };

  // const projects = [
  //   {
  //     title: "Clear Aligners",
  //     subtitle: "Invisalign",
  //     image: "../images/handgrid.png",
  //   },
  //   {
  //     title: "Braces",
  //     subtitle: "Damon Ultima",
  //     image: "../images/mainsectionimage.jpg",
  //   },
  //   {
  //     title: "Advanced Technology",
  //     subtitle: "3D i-Cat Imaging, Digital Scans",
  //     image: "../images/handbackground.png",
  //   },
  // ];

  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };
  const statRefs = useRef([]);

  useEffect(() => {
    statRefs.current.forEach((ref) => {
      if (!ref) return;

      const targetValue = parseInt(ref.dataset.target, 10);
      const digits = targetValue.toString().split("");

      ref.innerHTML = "";
      const containers = [];

      digits.forEach((digit) => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        wrapper.style.height = "1em";
        wrapper.style.display = "inline-block";

        const digitContainer = document.createElement("div");
        digitContainer.style.position = "relative";
        digitContainer.style.transform = "translateY(0)";
        digitContainer.style.transition = "transform 0.5s ease-out";

        for (let i = 0; i <= 9; i++) {
          const digitElement = document.createElement("div");
          digitElement.innerText = i;
          digitElement.style.height = "1em";
          digitElement.style.lineHeight = "1em";
          digitElement.style.textAlign = "center";
          digitContainer.appendChild(digitElement);
        }
        wrapper.appendChild(digitContainer);
        ref.appendChild(wrapper);
        containers.push({ container: digitContainer, value: digit });
      });

      containers.forEach(({ container, value }, index) => {
        gsap.to(container, {
          y: -value * 1 + "em",
          duration: 4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    });
  }, []);

  useEffect(() => {
    const lines = document.querySelectorAll(".stagger-line");

    lines.forEach((line) => {
      gsap.fromTo(
        line.querySelectorAll(".stagger-word"),
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
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

  const rows = 3;
  const cols = 6;
  const dx = 100;
  const dy = 100;
  const circleRefs = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });

    // forward Animation, each circle will animate from (0,0) to its grid position.
    // each diagonal grouping is (row+col)*0.3 to animate together
    circleRefs.current.forEach((circle) => {
      const col = parseInt(circle.getAttribute("data-col"), 10);
      const row = parseInt(circle.getAttribute("data-row"), 10);
      const forwardDelay = (row + col) * 0.3;

      tl.to(
        circle,
        {
          duration: 1.5,
          x: col * dx,
          y: row * dy,
          ease: "power2.inOut",
        },
        forwardDelay
      );
    });

    // longest delay starts with circle from the highest row+col val.
    const maxSum = rows + cols - 2; // maximum diagonal value (0-index)
    const forwardTotalTime = maxSum * 0.3 + 1.5;

    // reverse Animation: for each circle, reverse delay =  (maxSum - (row+col)) * 0.3. (highest=7)
    circleRefs.current.forEach((circle) => {
      const col = parseInt(circle.getAttribute("data-col"), 10);
      const row = parseInt(circle.getAttribute("data-row"), 10);
      const diagonal = row + col;
      const reverseDelay = (maxSum - diagonal) * 0.3;

      tl.to(
        circle,
        {
          duration: 1.5,
          x: 0,
          y: 0,
          ease: "power2.inOut",
        },
        forwardTotalTime + reverseDelay
      );
    });
  }, [cols, rows, dx, dy]);

  const circles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      circles.push({ id: `${row}-${col}`, row, col });
    }
  }

  const palette = [
    "#DFC0FC",
    "#E0FF65",
    // "#034CFF",
    // "#AE33FB",
  ];
  const getRandomColor = () =>
    palette[Math.floor(Math.random() * palette.length)];

  const paragraphRef = useRef(null);
  const [lineWidth, setLineWidth] = useState(0);
  const [lineFinished, setLineFinished] = useState(false);

  useEffect(() => {
    if (paragraphRef.current) {
      setLineWidth(paragraphRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className=" rounded-tl-[40px] rounded-tr-[40px] ">
      <section className="min-h-screen grid grid-cols-12 px-12">
        <div className="col-span-4  flex">
          <div
            className="lg:w-1/3 w-full flex flex-col justify-start items-start lg:pl-8 "
          >
            <svg className="pointer-events-none" width="1000" height="500" viewBox="-50 -50 1000 500">
              <g id="multiply-circles">
                {circles.map((circle, index) => (
                  <circle
                    key={circle.id}
                    ref={(el) => (circleRefs.current[index] = el)}
                    cx={0}
                    cy={0}
                    r={50}
                    fill={getRandomColor()}
                    data-row={circle.row}
                    data-col={circle.col}
       
                  />
                ))}
              </g>
            </svg>

            {/* <div className="">
              {colors.map((row, rowIndex) => (
                <div key={rowIndex} className="flex ">
                  {row.map((color, circleIndex) => (
                    <div
                      key={circleIndex}
                      className={`w-[100px] h-[100px] ${
                        (rowIndex + circleIndex) % 3 === 0
                          ? "rounded-[40px]"
                          : "rounded-full"
                      } transition-transform duration-300 ease-in-out hover:scale-75`}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              ))}
            </div> */}
          </div>
        </div>

        <div className="col-span-8 flex flex-col">
          <div className="mt-[6vh] ml-auto max-w-2xl">
            <motion.div
              className="pointer-events-none h-[1px] bg-black mt-2"
              initial={{ width: 0 }}
              animate={{ width: lineWidth }}
              transition={{ duration: 2, ease: "easeInOut" }}
              onAnimationComplete={() => setLineFinished(true)}
            />

            <div className="my-12"></div>

            <motion.p
              ref={paragraphRef}
              className="pointer-events-none font-neue-montreal lg:text-[20px] leading-relaxed text-right"
              initial={{ opacity: 0, y: 40 }}
              animate={lineFinished ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              A confident smile begins with effective care tailored to each
              patient. At our practice, we’re dedicated to providing treatments
              that are not only scientifically sound but also crafted to bring
              out your best smile.
              <br />
            </motion.p>
          </div>
          <div className="my-12"></div>
          {/* Stats Section */}
          <div className="flex flex-wrap sm:flex-nowrap justify-end mt-8 space-x-4 sm:space-x-6 md:space-x-12">
  <div className="text-center">
    <p className="font-neue-montreal text-[12px] sm:text-[15px] mb-4 sm:mb-10 tracking-wider">Years of Experience</p>
    <h2 className="font-neue-montreal text-[5rem] sm:text-[6rem] md:text-[7rem] font-light flex items-center gap-1 sm:gap-2">
      <span
        data-target="60"
        ref={(el) => (statRefs.current[0] = el)}
        className="pointer-events-none"
      >
        0
      </span>
      <span className="text-[2rem] sm:text-[3rem] align-center">+</span>
    </h2>
  </div>
  <div className="text-center">
    <p className="font-neue-montreal text-[12px] sm:text-[15px] mb-4 sm:mb-10 tracking-wider">Satisfied Patients</p>
    <h2 className="font-neue-montreal text-[5rem] sm:text-[6rem] md:text-[7rem] font-light flex items-center gap-1 sm:gap-2">
      <span
        data-target="25"
        ref={(el) => (statRefs.current[1] = el)}
        className="pointer-events-none flex"
      >
        0
      </span>
      <span className="text-[2rem] sm:text-[3rem]">k</span>
    </h2>
  </div>
  <div className="text-center">
    <p className="font-neue-montreal text-[12px] sm:text-[15px] mb-4 sm:mb-10 tracking-wider">Locations</p>
    <h2 className="font-neue-montreal text-[5rem] sm:text-[6rem] md:text-[7rem] font-light">
      <span
        data-target="4"
        ref={(el) => (statRefs.current[2] = el)}
        className="pointer-events-none"
      >
        0
      </span>
    </h2>
  </div>
</div>



        </div>
      </section>
      {/* <motion.div
          className="w-layout-blockcontainer textimagecontainer"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <div className="text-images-wrapper">
            <div className="text-images">
              <h2 className="heading-2">
                #1 Diamond and{" "}
                <motion.div
                  className="spanimage one"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                Invisalign Providers in Lehigh Valley. We've treated the most
                Invisalign cases{" "}
                <motion.div
                  className="spanimage two"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                delivering straighter smiles in 12-16 months{" "}
                <motion.div
                  className="spanimage three"
                  variants={spanVariants}
                  style={{ display: "inline-block", overflow: "hidden" }}
                ></motion.div>
                without wires
              </h2>
            </div>
          </div>
        </motion.div> */}

      {/* <div
          style={{ marginTop: "8rem" }}
          className="big-numbers-wrapper flex justify-around items-center"
        >
          <div
            className="big-numbers-card group transition-all duration-500 ease-in-out"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`big-numbers text-5xl font-bold ${
                hoveredCard && hoveredCard !== 1
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
              60+
            </div>
            <p
              className={`text-size-medium font-neue-montreal ${
                hoveredCard && hoveredCard !== 1
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
              Years of experience
            </p>
          </div>

          <div
            className="big-numbers-card group transition-all duration-500 ease-in-out"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`big-numbers text-5xl font-bold ${
                hoveredCard === 2 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              25k+
            </div>
            <p
              className={`text-size-medium font-neue-montreal ${
                hoveredCard === 2 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Satisfied patients
            </p>
          </div>

          <div
            className="big-numbers-card group transition-all duration-500 ease-in-out"
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`big-numbers text-5xl font-bold ${
                hoveredCard === 3 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              4+
            </div>
            <p
              className={`text-size-medium font-neue-montreal ${
                hoveredCard === 3 ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Locations
            </p>
          </div>
        </div> */}

      {/* <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-[4rem] font-neue-montreal">What we do</h2>
              <span className="text-6xl font-cursive italic text-gray-700 block mt-2 font-autumnchant">
                best
              </span>

        
            </div>
          </div>
        </section> */}

      {/* <div className="hero-wrapper flex flex-col justify-between items-center w-full pt-[15vh] pb-16 relative">

        <div className="w-layout-blockcontainer container mx-auto w-container max-w-[940px] sm:max-w-full lg:max-w-3xl">
          <div className="hero-header flex flex-col items-center text-center relative gap-4">
            <div
              className="heading opacity-0 transform translate-y-[10vh]"
              style={{
                transform: "translate3d(0, 10vh, 0) scale3d(1, 1, 1)",
                transition: "all 0.5s",
              }}
            >
            
            </div>
          </div>
        </div>

        <section className="hero relative flex justify-center items-center h-screen">
          <div className="hero-grid absolute inset-0 flex justify-center items-center z-0">
            <img
              src="../images/Hero-Background-Grid.svg"
              alt="Hero Grid"
              loading="lazy"
              className="w-[320vw] max-w-[1000px]" 
            />
          </div>

          <div className="z-20 hero-interaction-wrapper relative flex justify-center items-center z-20 space-x-2">
            <div className="hero-card bg-transparent z-30 rotate-[-4deg]">
              <img
                src="../images/freysmilepatient.jpg"
                alt="Hero Image 1"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
            <div className="hero-card bg-transparent z-20 rotate-[-2deg]">
              <img
                src="../images/blueorange.png"
                alt="Hero Image 2"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
            <div className="hero-card bg-transparent z-10 rotate-[2deg]">
              <img
                src="../images/gradientbg.jpeg"
                alt="Hero Image 3"
                className="object-cover w-[45vh] h-[55vh]"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div> */}
    </section>
  );
};
const NewSection = () => {
  //  const textContainerRef = useRef(null);
  // const splitTextInstances = useRef([]);
  // useEffect(() => {
  //   CustomEase.create("ease_pop", "M0,0 C0,0.24 0.08,1 1,1");

  //   const lines = textContainerRef.current.querySelectorAll("span.block");

  //   lines.forEach((line) => {
  //     const splitLine = new SplitText(line, { type: "words" });
  //     splitTextInstances.current.push(splitLine);

  //     gsap.fromTo(
  //       splitLine.words,
  //       { y: 50, opacity: 0 },
  //       {
  //         y: 0,
  //         opacity: 1,
  //         duration: 2,
  //         ease: "power3.inOut",
  //         stagger: 0.1,
  //         scrollTrigger: {
  //           trigger: line,
  //           start: "top 85%",
  //           end: "top 40%",
  //           toggleActions: "play none none reset",
  //           once: true,
  //           markers: false,
  //         },
  //       }
  //     );
  //   });

  //   return () => {
  //     splitTextInstances.current.forEach((splitInstance) =>
  //       splitInstance.revert()
  //     );
  //   };
  // }, []);

  const linkRef = useRef(null);

  useEffect(() => {
    const link = linkRef.current;

    const span1 = link.querySelector("[data-tha-span-1]");
    const span2 = link.querySelector("[data-tha-span-2]");

    const handleMouseEnter = () => {
      gsap.to([span1, span2], {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
    };

    const handleMouseLeave = () => {
      gsap.to([span1, span2], {
        yPercent: 0,
        duration: 0.8,
        ease: "power4.inOut",
      });
    };

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter);
      link.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const canvasRef = useRef(null);

  useEffect(() => {
    let engine;
    let render;

    const initSimulation = () => {
      const Engine = Matter.Engine;
      const Render = Matter.Render;
      const World = Matter.World;
      const Bodies = Matter.Bodies;
      const Mouse = Matter.Mouse;
      const MouseConstraint = Matter.MouseConstraint;

      engine = Engine.create();
      const world = engine.world;

      const containerElement = canvasRef.current;
      const containerWidth = containerElement.clientWidth;
      const containerHeight = containerElement.clientHeight;

      render = Render.create({
        element: containerElement,
        engine: engine,
        options: {
          width: containerWidth,
          height: containerHeight,
          pixelRatio: 2,
          background: "transparent",
          wireframes: false,
        },
      });

      // wall boundaries
      const ground = Bodies.rectangle(
        containerWidth / 2,
        containerHeight + 50,
        containerWidth,
        100,
        {
          isStatic: true,
          render: {
            fillStyle: "#000",
          },
        }
      );
      const wallLeft = Bodies.rectangle(
        -50,
        containerHeight / 2,
        100,
        containerHeight,
        {
          isStatic: true,
          render: {
            fillStyle: "#000",
          },
        }
      );
      const wallRight = Bodies.rectangle(
        containerWidth + 50,
        containerHeight / 2,
        100,
        containerHeight,
        {
          isStatic: true,
          render: {
            fillStyle: "#000",
          },
        }
      );
      const roof = Bodies.rectangle(
        containerWidth / 2,
        -50,
        containerWidth,
        100,
        {
          isStatic: true,
          render: {
            fillStyle: "#000",
          },
        }
      );

      const tags = [
        {
          x: 200,
          y: 100,
          w: 164,
          h: 56,
          texture: "../images/ico_star2.svg",
        },
        {
          x: 200,
          y: 100,
          w: 164,
          h: 56,
          texture: "../images/240by56(01).svg",
        },
        {
          x: 300,
          y: 200,
          w: 240,
          h: 56,
          texture: "../images/240by56(02).svg",
        },
        {
          x: 400,
          y: 300,
          w: 200,
          h: 56,
          texture: "../images/240by56(03).svg",
        },
        {
          x: 400,
          y: 300,
          w: 200,
          h: 56,
          texture: "../images/240by56(04).svg",
        },
      ];

      const radius = 20;
      const dynamicBodies = tags.map((tag) =>
        Bodies.rectangle(tag.x, tag.y, tag.w, tag.h, {
          chamfer: { radius },
          render: {
            sprite: {
              texture: tag.texture,
              xScale: 1,
              yScale: 1,
            },
          },
        })
      );

      // Add objects to world
      World.add(world, [ground, wallLeft, wallRight, roof, ...dynamicBodies]);

      // mouse dragging
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      });

      World.add(world, mouseConstraint);
      render.mouse = mouse;

      Engine.run(engine);
      Render.run(render);
    };

    initSimulation();

    return () => {
      if (engine) {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
      if (render) {
        render.canvas.remove();
        render.textures = {};
      }
    };
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <>
      <section className="flex items-center justify-center min-h-screen bg-black px-8 md:px-16">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/*left */}
          <div className="bg-[#CFF174] text-black p-8 md:p-16 rounded-md flex flex-col justify-center">
            <h1 className="font-helvetica-neue-light text-5xl md:text-6xl mb-4">
              A world of opportunity.
            </h1>
            <div
              ref={canvasRef}
              style={{ height: "400px", width: "500px" }}
            ></div>
            <div className="tracking-widest flex justify-center border border-black py-6 px-8">
              <a
                ref={linkRef}
                href="/book-now"
                data-tha
                style={{
                  display: "inline-block",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span
                  data-tha-span-1
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "HelveticaNeue-Light",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  BOOK NOW
                </span>
                <span
                  data-tha-span-2
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "HelveticaNeue-Light",
                    display: "inline-block",
                    position: "absolute",
                    top: "100%",
                    left: "0",
                  }}
                >
                  BOOK NOW
                </span>
              </a>
            </div>
          </div>

          {/*right*/}
          <div className="bg-black text-white border border-[#CFF174] p-8 md:p-16 rounded-md flex flex-col justify-between">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <clipPath id="clip0_224_605">
                  <path d="M50 50.5H50.5V50V49.5C23.2199 49.5 1.04241 27.6526 0.509799 0.5H199.491C198.957 27.6526 176.781 49.5 149.5 49.5V50V50.5H150C177.338 50.5 199.5 72.6619 199.5 100C199.5 125.033 180.918 145.726 156.795 149.038L156.791 150.028C180.949 153.556 199.5 174.363 199.5 199.5H0.5C0.5 174.363 19.0509 153.556 43.2094 150.028L43.2051 149.038C19.0823 145.726 0.5 125.033 0.5 100C0.5 72.6619 22.6619 50.5 50 50.5Z" />
                </clipPath>
              </defs>

              {/* use href for image to put inside the clip path */}
              <image
                href="../images/nowbook.png"
                width="200"
                height="200"
                clipPath="url(#clip0_224_605)"
                preserveAspectRatio="xMidYMid slice"
              />

              {/* shape outline*/}
              <path
                d="M50 50.5H50.5V50V49.5C23.2199 49.5 1.04241 27.6526 0.509799 0.5H199.491C198.957 27.6526 176.781 49.5 149.5 49.5V50V50.5H150C177.338 50.5 199.5 72.6619 199.5 100C199.5 125.033 180.918 145.726 156.795 149.038L156.791 150.028C180.949 153.556 199.5 174.363 199.5 199.5H0.5C0.5 174.363 19.0509 153.556 43.2094 150.028L43.2051 149.038C19.0823 145.726 0.5 125.033 0.5 100C0.5 72.6619 22.6619 50.5 50 50.5Z"
                fill="none"
                stroke="black"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div>
              <p className="mb-4"></p>
              <div className="container">
                <button
                  className={`circle circle1 ${hover ? "hover" : ""}`}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  Button 1
                </button>
                <button
                  className={`circle circle2 ${hover ? "hover" : ""}`}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  Button 2
                </button>

                <svg>
                  <filter id="fusion">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                    <feColorMatrix
                      values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 20 -10
            "
                    />
                  </filter>
                </svg>

                <style jsx>{`
                  .container {
                    position: relative;
                    width: 800px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    filter: url(#fusion);
                    transition: gap 0.3s ease;
                  }

                  .circle {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: none;
                    color: black;
                    font-size: 16px;
                    cursor: pointer;
                  }

                  .circle.circle1 {
                    min-width: 150px;
                    height: 50px;
                    border-radius: 25px;
                    background: linear-gradient(90deg, #f00, #0ff);
                    transition: transform 0.3s ease;
                  }

                  .circle.circle1::before {
                    --offset: -20px;
                    content: "";
                    position: absolute;
                    top: var(--offset);
                    left: var(--offset);
                    right: var(--offset);
                    bottom: var(--offset);
                    border-radius: 50px;
                    z-index: -1;
                    filter: blur(2px);
                  }

                  .circle.circle2 {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(90deg, #ffeb3b, #da00ff);
                    transition: transform 0.3s ease;
                  }

                  .circle2.hover {
                    transform: translateX(-20px);
                  }

                  .circle.circle2::before {
                    --offset: -30px;
                    content: "";
                    position: absolute;
                    top: var(--offset);
                    left: var(--offset);
                    right: var(--offset);
                    bottom: var(--offset);
                    border-radius: 50%;
                    z-index: -1;
                    filter: blur(30px);
                  }

                  svg {
                    width: 0;
                    height: 0;
                  }
                `}</style>
              </div>

              {/* <button
                type="submit"
                className="font-neue-montreal rounded-full bg-[#CFF174] text-black font-medium px-6 py-3 hover:bg-lime-500"
              >
                Start a conversation
              </button> */}

              {/* <p className="mt-6 text-sm text-gray-500">
            © 2025 TVP, L.L.C.
            <br />
            <a
              href="#privacy-policy"
              className="underline hover:no-underline"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#terms" className="underline hover:no-underline">
              Terms & Services
            </a>
          </p> */}
            </div>
          </div>
        </div>
      </section>
      {/* <section
      className="bg-[#C4CED2] min-h-screen flex items-center justify-center text-white"
    >
          <div className=" flex flex-col items-center justify-center ">
        <section className="py-20 px-8 flex flex-col lg:flex-row max-w-7xl mx-auto space-y-12 lg:space-y-0 lg:space-x-8">
          <div
            className="flex-1 flex flex-col justify-center items-start space-y-8 relative"
            ref={textContainerRef}
          >
            <h1 className="">
              <span className="text-[2.5rem] font-helvetica-neue-light block">
                Your first <span>consultation</span>
              </span>
              <span className="text-[2.5rem] font-helvetica-neue-light block">
                is{" "}
                <span className="text-[2.5rem] font-autumnchant text-black px-4 py-2 inline-block ">
                  always
                </span>{" "}
                on us
              </span>
            </h1>
            <span className="block text-[1.5rem] font-helvetica-neue-light">
              Find out which treatment plan suits you best.
            </span>
            
         
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div
               ref={wrapperRef}
              className="w-[360px] h-[660px]  rounded-full"
            >
              <img
                ref={imgRef}
                src="../images/mainsectionimage.jpg"
                alt="Consultation"
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 lg:pl-8 z-20">
            <button className="font-helvetica-neue-light border border-black text-black text-2xl py-6 px-12 rounded-lg">
              Need more info? <br /> Take our quiz
            </button>
          </div>
        </section>
      </div>
   
    </section> */}
    </>
  );
};

// function Mask() {
//   const useMousePosition = () => {
//     const [mousePosition, setMousePosition] = useState({ x: null, y: null });
//     const updateMousePosition = e => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     useEffect(() => {
//       window.addEventListener("mousemove", updateMousePosition);
//       return () => window.removeEventListener("mousemove", updateMousePosition);
//     }, []);

//     return mousePosition;
//   };

//   const [isHovered, setIsHovered] = useState(false);

//   const { x, y } = useMousePosition();

//   const size = isHovered ? 400 : 40;

//   return (
//     <main className="uniqueMain">
//       <motion.div
//         className="uniqueMask"
//         animate={{
//           WebkitMaskPosition: `${x - (size/2)}px ${y - (size/2)}px`,
//           WebkitMaskSize: `${size}px`,
//         }}
//         transition={{ type: "tween", ease: "backOut", duration: 0.5}}
//       >
//         <p onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}>
//           INVISALIGN DAMON BRACES ADVANCED ORTHONDOTIC CARE
//         </p>
//       </motion.div>

//       <div className="uniqueBody">
//         <p> We are your  <span>go-to provider </span> for advanced and discerning orthodontic care.</p>
//       </div>
//     </main>
//   )
// }
// SwiperCore.use([Keyboard, Mousewheel]);

function GSAPAnimateScrollSections() {
  // const listRef = useRef(null);

  // useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   const items = listRef.current.querySelectorAll(".list__item");

  //   items.forEach((item) => {
  //     const itemTitle = item.querySelector(".list__item__title");
  //     const itemTitleOutline = item.querySelector(".list__item__titleOutline");
  //     const itemImg = item.querySelector("img");

  //     gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: item,
  //           start: "0% 75%",
  //           end: "25% 50%",
  //           scrub: 3,
  //         },
  //       })
  //       .fromTo(
  //         [itemTitle, itemTitleOutline],
  //         { scale: 2, y: "100%" },
  //         { scale: 1, y: "0%", ease: "power2.inOut" }
  //       );

  //     gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: item,
  //           start: "50% 100%",
  //           end: "100% 50%",
  //           scrub: 3,
  //           onEnter: () =>
  //             gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
  //           onLeave: () =>
  //             gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
  //           onEnterBack: () =>
  //             gsap.to(itemTitleOutline, { opacity: 1, duration: 0.1 }),
  //           onLeaveBack: () =>
  //             gsap.to(itemTitleOutline, { opacity: 0, duration: 0.1 }),
  //         },
  //       })
  //       .fromTo(
  //         itemImg,
  //         { x: "60vw", y: "60vh", rotate: -30 },
  //         {
  //           x: "-60vw",
  //           y: "-60vh",
  //           rotate: 30,
  //           ease: "none",
  //         }
  //       );
  //   });
  // }, []);

  // const imageItems = [
  //   {
  //     imgSrc: "/images/patient25k.png",
  //     text: "25k+ Patients",
  //   },
  //   {
  //     imgSrc: "/images/lehighvalley.jpg",
  //     text: "4 Bespoke Locations",
  //   },
  //   {
  //     imgSrc: "/images/experiencedoctor.png",
  //     text: "50+ Years Experience",
  //   },
  // ];
  useEffect(() => {
    const viewHeight = window.innerHeight;

    document.querySelectorAll(".text-container").forEach((element) => {
      const top = element.getBoundingClientRect().top;
      const start = viewHeight - top;

      const firstText = element.querySelector(".parallax-text:first-child");
      const secondText = element.querySelector(".parallax-text:last-child");

      gsap.to(firstText, {
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: start + "px bottom",
          end: "bottom top",
        },
        x: "-54vw",
        ease: "none",
      });

      gsap.to(secondText, {
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: start + "px bottom",
          end: "bottom top",
        },
        x: "32vw",
        ease: "none",
      });
    });
  }, []);
  const textItems = [
    { title1: "50+ Years of ", title2: " Experience" },
    { title1: "4 Bespoke Locations", title2: "4 Bespoke Locations" },
    { title1: "25k Patients", title2: "25k Patients" },
  ];
  const imageStyles = [
    { width: "32vw", height: "48vw" },
    { width: "70vw", height: "auto" },
    { width: "32vw", height: "48vw" },
  ];

  useEffect(() => {
    gsap.defaults({ ease: "none" });

    const main = gsap.timeline();

    const sphereAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: ".home-main",
        start: "top 0",
        end: "bottom 100%",
        scrub: 1,
      },
    });

    sphereAnimation
      .to(".home-hero", {
        opacity: "0",
        duration: 2.4,
      })

      .to(
        "#middle-circle",
        {
          scale: 1,
          boxShadow: "rgb(255, 255, 255) 0px 3px 47px inset",
          transform: "translate(-50%, -50%) translate3d(0px, 0px, 0px)",
          duration: 2,
          transformOrigin: "50% 50%",
        },
        0
      )
      .to(
        "#first-circle",
        {
          transform: "translate(-50%, -50%) translate(-130%, 0px)",
          opacity: "1",
          filter: "blur(0px)",
          duration: 4,
          transformOrigin: "50% 50%",
        },
        3
      )
      .to(
        "#last-circle",
        {
          transform: "translate(-50%, -50%) translate(130%, 0px)",
          opacity: "1",
          filter: "blur(0px)",
          duration: 4,
          transformOrigin: "50% 50%",
        },
        3
      )
      .to(
        "#figure2",
        {
          scale: 1,
          filter: "blur(0)",
          opacity: "1",
          duration: 4,
        },
        0
      )
      .to(".home-main__content-sphere-desc", {
        scale: 1,
        transform: "translate(0px, 0px)",
        opacity: "1",
        duration: 4,
      });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(
        ".home-hero, .home-main__content-atom, #middle-circle, #first-circle, #last-circle, #figure2, .home-main__content-sphere-desc"
      );
    };
  }, []);

  const MobileLayout = () => {
    useGSAP(() => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#stats-section",
          start: "top 50%",
          end: "bottom 100%",
          scrub: 1,
        },
        defaults: { ease: "power1.in" },
      });

      tl.to(
        ".middle-circle",
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 4,
        },
        0
      )
        .to(
          ".middle-circle-text",
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 6,
          },
          0
        )
        .to(
          ".left-circle",
          {
            opacity: 1,
            filter: "blur(0px)",
            transform: "translate(0%, 0%)",
            duration: 6,
          },
          3
        );
      tl.to(
        ".right-circle",
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "translate(0%, 0%)",
          duration: 6,
        },
        3
      ).to("#stats-heading", {
        opacity: 1,
        transform: "translate(0%, 0%)",
        duration: 4,
      });
    });

    return (
      <section
        id="stats-section"
        className="relative block w-full h-[50vh] md:h-screen place-content-center place-items-center xl:hidden"
      >
        <div className="container flex items-center justify-center gap-2 px-8 py-4 mx-auto">
          <figure className="translate-x-1/2 opacity-0 blur-sm left-circle">
            <span className="block w-32 h-32 mb-4 border rounded-full md:w-48 md:h-48 place-content-center place-items-center border-zinc-100 aspect-square">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                60+ yrs
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              experience
            </p>
          </figure>
          <figure className="scale-0 opacity-0 blur-sm middle-circle">
            <span className="block w-40 h-40 md:w-60 md:h-60 mb-4 rounded-full place-content-center place-items-center aspect-square shadow-[inset_0_0_20px_rgba(255,255,255,1)] md:shadow-[inset_0_0_30px_rgba(255,255,255,1)] middle-circle-text opacity-0 blur-sm">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider  text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                25,000
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize opacity-0 middle-circle-text blur-sm font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              patients
            </p>
          </figure>
          <figure className="-translate-x-1/2 opacity-0 blur-sm right-circle">
            <span className="block w-32 h-32 mb-4 border rounded-full md:w-48 md:h-48 place-content-center place-items-center border-zinc-100 aspect-square">
              <p className="text-center leading-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)] font-agrandir-grandheavy text-[#ff6432] uppercase tracking-wider  text-[clamp(1rem,_0.5742rem_+_2.2707vw,_2.0275rem)]">
                4
              </p>
            </span>
            <p className="leading-4 tracking-wide text-center capitalize font-editorial-new text-[#171616] text-[clamp(1rem,_0.8029rem_+_1.0511vw,_1.475625rem)]">
              locations
            </p>
          </figure>
        </div>
        <div
          id="stats-heading"
          className="container w-full mx-auto translate-y-1/2 opacity-0 place-content-center"
        >
          <h2 className="w-full tracking-tighter text-center uppercase text-[clamp(3.75rem,_2.6316rem_+_5.5921vw,_8rem)] leading-[clamp(3.75rem,_2.6316rem_+_5.5921vw,_8rem)] font-agrandir-grandheavy text-zinc-100">
            About
          </h2>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* <section className="relative hidden home-main xl:block">
        <div className="home-main__content">
          <div className="home-main__content-sphere">
            <ul className="container mx-auto">
              <li
                className="font-helvetica-neue "
                id="first-circle"
                style={{ opacity: 0, filter: "blur(10px)" }}
              >
                <figure>
                  <h3>60+</h3>
                  <p className="mt-10 uppercase font-poppins ">
                    years of experience
                  </p>
                </figure>
              </li>
              <li
                className="font-bold font-neue-montreal"
                id="middle-circle"
                style={{ boxShadow: "inset 0 0 300px #fff" }}
              >
                <figure
                  id="figure2"
                  style={{ opacity: 0, filter: "blur(10px)" }}
                >
                  <h3 className="font-bold font-Lato">25k</h3>
                  <p className="mt-10 tracking-wide uppercase font-Lato">
                    patients
                  </p>
                </figure>
              </li>
              <li
                className=""
                id="last-circle"
                style={{ opacity: 0, filter: "blur(10px)" }}
              >
                <figure>
                  <h3 className="font-bold font-neue-montreal">4</h3>
                  <p className="mt-10 tracking-wide font-helvetica-now-thin">
                    unique locations
                  </p>
                </figure>
              </li>
            </ul>
            <div
              className="home-main__content-sphere-desc"
              style={{ transform: "translate(0, 137px)", opacity: 0 }}
            ></div>
          </div>
        </div>
      </section> */}

      <MobileLayout />
    </>
    // <section
    //   ref={listRef}
    //   className="flex flex-col items-center justify-center"
    // >
    //   {imageItems &&
    //     imageItems.map((item, index) => (
    //       <div
    //         key={index}
    //         className="relative flex items-end w-full h-screen pb-10 list__item"
    //       >
    //         <img
    //           src={item.imgSrc}
    //           alt={`Description ${index + 1}`}
    //           className="absolute z-20 object-cover"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             width: "33%",
    //             height: "auto",
    //             aspectRatio: "10 / 14",
    //             transform: "translate(-50%, -50%)",
    //           }}
    //         />
    //         <div
    //           className="absolute z-10 font-bold transform -translate-x-1/2 -translate-y-1/2 list__item__title top-1/2 left-1/2 text-8xl"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             transform: "translate(-50%, -50%)",
    //             fontSize: "12vw",
    //             fontFamily: '"Playfair Display"',
    //             lineHeight: "80%",
    //             color: "#221608",
    //           }}
    //         >
    //           {item.text}
    //         </div>
    //         <div
    //           className="absolute z-30 font-bold transform -translate-x-1/2 -translate-y-1/2 list__item__titleOutline top-1/2 left-1/2 text-8xl"
    //           style={{
    //             top: "50%",
    //             left: "50%",
    //             transform: "translate(-50%, -50%)",
    //             fontSize: "12vw",
    //             fontFamily: '"Playfair Display"',
    //             lineHeight: "80%",
    //             color: "transparent",
    //             WebkitTextStroke: "2px #221608",
    //           }}
    //         >
    //           {item.text}
    //         </div>
    //       </div>
    //     ))}
    // </section>
  );
}

const ImageGrid = () => {
  // const bodyRef = useRef(null);
  // const headerRef = useRef(null);
  // const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  // const [isHovering, setIsHovering] = useState(false);

  // useEffect(() => {
  //   const moveCursor = (e) => {
  //     setCursorPos({ x: e.clientX, y: e.clientY });
  //   };

  //   if (isHovering) {
  //     window.addEventListener("mousemove", moveCursor);
  //   }

  //   return () => {
  //     window.removeEventListener("mousemove", moveCursor);
  //   };
  // }, [isHovering]);

  // useEffect(() => {
  //   if (headerRef.current) {
  //     const tl = gsap.timeline();
  //     gsap.set(bodyRef.current, { autoAlpha: 1 });

  //     const pageHeading = headerRef.current.querySelector("h1");
  //     const pageBody = headerRef.current.querySelector("p");
  //     const separator = headerRef.current.querySelector("hr");
  //     const imageCards = gsap.utils.toArray(".image-card");

  //     gsap.set(imageCards, { autoAlpha: 0 });

  //     const childLines = new SplitText(pageHeading, {
  //       type: "lines",
  //       linesClass: "heading-line",
  //     });
  //     const parentLines = new SplitText(pageHeading, {
  //       type: "lines",
  //       linesClass: "heading-line-wrapper",
  //     });

  //     tl.from(childLines.lines, {
  //       duration: 1,
  //       y: 200,
  //       stagger: 0.25,
  //       delay: 1,
  //       ease: "power4.out",
  //     })
  //       .from(
  //         pageBody,
  //         {
  //           duration: 0.5,
  //           opacity: 0,
  //           x: -20,
  //         },
  //         "-=0.5"
  //       )
  //       .from(
  //         separator,
  //         {
  //           duration: 2,
  //           scale: 0,
  //           ease: "expo.inOut",
  //         },
  //         "-=1.1"
  //       )
  //       .to(
  //         imageCards,
  //         {
  //           duration: 0.75,
  //           autoAlpha: 1,
  //           y: -50,
  //           stagger: 0.5,
  //           ease: "power4.out",
  //         },
  //         "-=0.75"
  //       );

  // const scroll = new LocomotiveScroll({
  //   el: bodyRef.current,
  //   smooth: true,
  // });

  //     setTimeout(() => {
  //       scroll.update();
  //     }, 1000);
  //   }
  // }, []);

  // const images = [
  //   {
  //     title: "Top 1% of providers",
  //     src: "../images/invis.png",
  //     className: "image-portrait",

  //     url: "/invisalign",
  //   },
  //   {
  //     title: "Faster treatment times with fewer appointments",
  //     src: "../images/damon1.png",
  //     className: "image-landscape",

  //     url: "/braces",
  //   },
  //   {
  //     title: "Pioneering the most comfortable appliances since 2005",
  //     src: "../images/mountain.png",
  //     className: "image-landscape",

  //     url: "/why-choose-us",
  //   },
  // ];

  // const sections = [
  //   {
  //     id: 1,
  //     image: "https://picsum.photos/600/400?random=1",
  //     title: "Small Section",
  //     description: "This is a smaller section",
  //     bgColor: "bg-orange-600",
  //     colSpan: 1,
  //     rowSpan: 1, // Small section in the first column
  //   },
  //   {
  //     id: 2,
  //     image: "https://picsum.photos/600/400?random=2",
  //     title: "Large Section",
  //     description: "Expressing creativity by breaking the mold",
  //     bgColor: "bg-gray-200",
  //     colSpan: 1,
  //     rowSpan: 2, // Large section in the first column
  //   },
  //   {
  //     id: 3,
  //     image: "https://picsum.photos/600/400?random=3",
  //     title: "Section 3",
  //     description: "A brief description for section 3",
  //     bgColor: "bg-white",
  //     colSpan: 1,
  //     rowSpan: 1, // First section in the second column
  //   },
  //   {
  //     id: 4,
  //     image: "https://picsum.photos/600/400?random=4",
  //     title: "Section 4",
  //     description: "Another brief description",
  //     bgColor: "bg-blue-600",
  //     colSpan: 1,
  //     rowSpan: 1, // Second section in the second column
  //   },
  // ];
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
<div ref={sectionRef}>
  <div className="grid grid-cols-2 h-screen gap-4 p-4">
    {/* Column 1 */}
    <div className="grid grid-cols-2 gap-4">

      <div className="relative rounded-[60px] bg-[#B2E7EB]">
        <img
          src="../images/hand.jpeg"
          alt="Left Sub-Column Image"
          className="absolute inset-0 w-full h-full object-cover rounded-[60px] transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-20 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 text-white p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <h2 className="text-2xl font-neue-montreal">Clear Aligners</h2>
          <p className="font-neue-montreal text-lg">Invisalign</p>
        </div>
      </div>

      <div className="relative group  rounded-[60px] bg-[#FFE0DB]">
        <img
          src="../images/mainsectionimage.jpg"
          alt="Right Sub-Column Image"
          className="absolute inset-0 w-full h-full object-cover rounded-[60px] transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-10 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 text-white p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <h2 className="text-2xl font-neue-montreal">Braces</h2>
          <p className="font-neue-montreal text-lg">Damon Ultima</p>
        </div>
      </div>
    </div>

    {/* Column 2 */}
    <div className="flex flex-col gap-4">
      {/* Top */}
      <div className="h-1/3 bg-[#EFFD47] rounded-[60px] relative flex items-center justify-center">
        <div className="flex flex-col">
          <h2 className="text-[4rem] font-neue-montreal">What we do</h2>
          <span className="text-6xl font-cursive italic text-gray-700 mt-2 font-autumnchant">
            best
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex-grow relative group rounded-[60px] bg-[#F2BD4A]">
        <img
          src="../images/handbackground.png"
          alt="Bottom Image Column 2"
          className="absolute inset-0 w-full h-full object-cover rounded-[60px] transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-10 pointer-events-none"
          loading="lazy"
        />
        <div className="absolute inset-0 text-white p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <h2 className="text-2xl font-neue-montreal">Advanced Technology</h2>
          <p className="font-neue-montreal text-lg">
            3D i-Cat Imaging, Digital Scans
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    // <section className="bg-[#FBFBFB]">
    //   <div>
    //     <div
    //       className="container flex flex-col py-24 mx-auto overflow-hidden text-white lg:flex-row lg:items-start"
    //       ref={bodyRef}
    //     >
    //       <div
    //         className={`custom-cursor2 ${isHovering ? "rotate" : ""}`}
    //         style={{
    //           left: `${cursorPos.x}px`,
    //           top: `${cursorPos.y}px`,
    //           opacity: isHovering ? 1 : 0,
    //         }}
    //       >
    //         <p>CHECK </p>
    //         <p>IT OUT</p>
    //       </div>
    //       <div className="flex flex-wrap items-center justify-center min-h-screen p-0">
    //         {images.map((image, index) => (
    //           <a
    //             key={index}
    //             href={image.url}
    //             className={`group image-card relative flex items-center justify-center mb-20 ${
    //               image.className === "image-portrait"
    //                 ? "mx-4 w-[27vw] h-[37vw]"
    //                 : "mx-4 w-[40vw] h-[27vw]"
    //             }`}
    //             onMouseEnter={() => setIsHovering(true)}
    //             onMouseLeave={() => setIsHovering(false)}
    //           >
    //             <div className="image-header text-[35px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125 leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none">
    //               {image.title}
    //             </div>
    //             <img
    //               src={image.src}
    //               className="block object-cover w-full h-full"
    //             />
    //           </a>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

const LogoGrid = () => {
  const logos = [
    [
      "../images/movingbannerfiles/diamondplus.svg",
      "../images/movingbannerfiles/readers.png",
      "../images/movingbannerfiles/damonsystem.svg",
      "../images/movingbannerfiles/damonsystem.svg",
    ],
    [
      "../images/movingbannerfiles/topDentist_logo.png",
      "../images/movingbannerfiles/invisalign_invert.png",
      "../images/movingbannerfiles/ajodo.svg",
      "../images/movingbannerfiles/ABO_invert.png",
      "../images/movingbannerfiles/ABO_invert.png",
    ],
    [
      "../images/movingbannerfiles/valley.png",
      "../images/movingbannerfiles/top-Dentist.png",
      "../images/movingbannerfiles/aao_invert.png",
      "../images/movingbannerfiles/aao_invert.png",
    ],
  ];

  let isSphereCreated = false;

  useEffect(() => {
    console.log("sphere");
    if (isSphereCreated) {
      return;
    }
    isSphereCreated = true;
    console.log("createsphere");
    const createSphere = async () => {
      let majorPlatformVersion;
      const canvasSphereWrapp = document.querySelector("#ballcanvas");

      if (navigator.userAgentData) {
        try {
          if (navigator.userAgentData.platform === "Windows") {
            let ua = await navigator.userAgentData.getHighEntropyValues([
              "platformVersion",
            ]);
            majorPlatformVersion = parseInt(ua.platformVersion.split(".")[0]);
          }
        } catch (error) {
          console.error("version", error);

          majorPlatformVersion = undefined;
        }
      }

      let sW = canvasSphereWrapp.offsetWidth;
      let halfsW = sW / 2;
      let circleW = sW / 12;

      let Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Composite = Matter.Composite,
        World = Matter.World,
        Mouse = Matter.Mouse,
        Events = Matter.Events,
        MouseConstraint = Matter.MouseConstraint;

      let engine = Engine.create();

      let render = Render.create({
        element: canvasSphereWrapp,
        engine: engine,
        options: {
          isSensor: true,
          width: canvasSphereWrapp.offsetWidth,
          pixelRatio: "auto",
          height: canvasSphereWrapp.offsetHeight,
          background: "transparent",
          wireframes: false,
        },
      });

      if (majorPlatformVersion >= 13) {
        engine.timing.timeScale = 0.35;
      }

      engine.gravity.y = 1;
      engine.gravity.x = 0;
      engine.gravity.scale = 0.0025;

      let stack = [];
      const texts = ["INVISALIGN", "DAMON", "DIAMOND 1%"];

      let ballsWithText = [];

      for (let i = 0; i < 12; i++) {
        const ball = Bodies.circle(halfsW, halfsW, circleW, {
          density: 0.00001,
          restitution: 0.5,
          density: 0.05,
          collisionFilter: {
            category: 0x0003,
            mask: 0x0003 | 0x0001,
          },
          render: {
            fillStyle: "#1e90ff",
            // strokeStyle: 'white',
            // lineWidth: 1,
          },
        });
        ballsWithText.push({ ball, text: texts[i] });
        Composite.add(engine.world, ball);
      }
      Events.on(render, "afterRender", function () {
        const ctx = render.context;
        ballsWithText.forEach(({ ball, text }, index) => {
          const position = ball.position;

          const image = new Image();
          image.src = logos[Math.floor(index / 4)][index % 4];
          const aspectRatio = image.width / image.height;

          let imageWidth, imageHeight;
          if (aspectRatio > 1) {
            imageWidth = circleW;
            imageHeight = circleW / aspectRatio;
          } else {
            imageWidth = circleW * aspectRatio;
            imageHeight = circleW;
          }

          const destX = position.x - imageWidth / 2;
          const destY = position.y - imageHeight / 2;

          ctx.drawImage(image, destX, destY, imageWidth, imageHeight);
        });
      });

      let mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        });

      mouseConstraint.mouse.element.removeEventListener(
        "mousewheel",
        mouseConstraint.mouse.mousewheel
      );
      mouseConstraint.mouse.element.removeEventListener(
        "DOMMouseScroll",
        mouseConstraint.mouse.mousewheel
      );

      let shakeScene = function (engine, bodies) {
        let timeScale = 1000 / 60 / engine.timing.lastDelta;

        for (let i = 0; i < bodies.length; i++) {
          let body = bodies[i];

          if (!body.isStatic) {
            let forceMagnitude = 0.03 * body.mass * timeScale;

            Body.applyForce(body, body.position, {
              x:
                (forceMagnitude + Common.random() * forceMagnitude) *
                Common.choose([1, -1]),
              y: -forceMagnitude + Common.random() * -forceMagnitude,
            });
          }
        }
      };

      Events.on(mouseConstraint, "mousemove", function (event) {
        let foundPhysics = Matter.Query.point(stack, event.mouse.position);
        shakeScene(engine, foundPhysics);
      });

      Composite.add(engine.world, mouseConstraint);

      render.mouse = mouse;

      Render.run(render);

      let r = sW / 2;
      let parts = [];
      let pegCount = 32;
      let TAU = Math.PI * 2;
      for (let i = 0; i < pegCount; i++) {
        const segment = TAU / pegCount;
        let angle2 = (i / pegCount) * TAU + segment / 2;
        let x2 = Math.cos(angle2);
        let y2 = Math.sin(angle2);
        let cx2 = x2 * r + sW / 2;
        let cy2 = y2 * r + sW / 2;
        let rect = addRect({
          x: cx2,
          y: cy2,
          w: (10 / 1000) * sW,
          h: (400 / 1000) * sW,
          options: {
            angle: angle2,
            isStatic: true,
            density: 1,
            render: {
              fillStyle: "transparent",
              strokeStyle: "transparent",
              lineWidth: 0,
            },
          },
        });
        parts.push(rect);
      }

      function addBody(...bodies) {
        World.add(engine.world, ...bodies);
      }

      function addRect({ x = 0, y = 0, w = 10, h = 10, options = {} } = {}) {
        let body = Bodies.rectangle(x, y, w, h, options);
        addBody(body);
        return body;
      }

      let runner = Runner.create();

      Runner.run(runner, engine);
    };

    createSphere();

    return () => {};
  }, []);

  return (
    <div className="bg-[#F1F7FF] relative h-screen overflow-hidden">
  
      {/* <div className="grid grid-cols-2 gap-4">
        {logos.map((columnLogos, columnIndex) => (
          <div key={columnIndex} className="flex flex-col items-center">
            {columnLogos.map((logo, logoIndex) => (
              <div key={logoIndex} className="p-2">
                <img
                  src={logo}
                  alt={`Logo ${logoIndex + 1}`}
                  className="w-auto h-14"
                />
              </div>
            ))}
          </div>
        ))}
      </div> */}
      <div className="container flex flex-col-reverse items-center justify-center h-full gap-4 py-32 mx-auto overflow-hidden lg:py-0 lg:flex-row lg:overflow-visible">
        <div
          id="ballcanvas"
          className="z-10 w-full h-full lg:w-1/2 horizontal-item"
        />

        <div className="lg:w-1/2"
        >
          <p className="font-neue-montreal text-center text-[px]">
            Awards & Recognition
          </p>
          <div className="flex items-center mt-10">
            <div className="w-48 h-px bg-black"></div>
            <p className=" font-neue-montreal text-[15px] pl-4">
              Our greatest award is the success of our patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Testimonials() {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current: carousel } = carouselRef;
      const scrollAmount = carousel.offsetWidth;
      if (direction === "left") {
        carousel.scrollLeft -= scrollAmount;
      } else {
        carousel.scrollLeft += scrollAmount;
      }
    }
  };

  const headingRef = useRef(null);

  useEffect(() => {
    const split = new SplitText(headingRef.current, {
      type: "words, chars",
      charsClass: "char",
      wordsClass: "word",
      specialChars: ["Te", "mo", "al"],
    });

    document.querySelectorAll(".word").forEach((word) => {
      word.style.overflow = "hidden";
      word.style.display = "inline-block";
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".char", {
      y: "100%",
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });

    return () => {
      split.revert();
    };
  }, []);

  const items = [
    {
      name: "Lisa Moyer",
      year: "2023",
      description:
        "You will receive top-notch orthodontic care at Frey Smiles. Dr. Frey and his entire staff make every visit a pleasure. It is apparent at each appointment that Dr. Frey truly cares about his patients. He has treated both of our kids and my husband, and they all have beautiful smiles! I highly recommend!",
    },
    {
      name: "Karen Oneill",
      year: "2022",
      description:
        "I had an open bite and misaligned teeth most of my life. Dr. Frey fixed it and in record time. 1 1/2 years with Invisalign. Highly recommended! Friendly staff and easy to make appointments!",
    },
    {
      name: "Tanya Burnhauser",
      year: "2021",
      description:
        "Dr. Frey was my orthodontist when I was 11 years old. I'm now 42. I still talk about how amazing he was and the great work he did with my teeth. Thank you so much for giving the most beautiful smile!",
    },
  ];

  const [selectedDescription, setSelectedDescription] = useState(
    items[0].description
  );

  const menuRefs = useRef([]);

  useEffect(() => {
    menuRefs.current.forEach((menuLink) => {
      if (!menuLink) return;

      const text1 = menuLink.querySelector("[hoverstagger='text']:first-child");
      const text2 = menuLink.querySelector("[hoverstagger='text']:last-child");

      if (!text1 || !text2) return;

      const wrapCharacters = (element) => {
        const words = element.innerText.split(" ");
        element.innerHTML = words
          .map(
            (word) =>
              `<span class="word">${word
                .split("")
                .map(
                  (char, i) =>
                    `<span class="char ${
                      i % 2 === 0 ? "odd" : "even"
                    }">${char}</span>`
                )
                .join("")}</span>`
          )
          .join('<span class="space"> </span>');
      };

      wrapCharacters(text1);
      wrapCharacters(text2);

      gsap.set(text1.querySelectorAll(".char"), { visibility: "visible" });
      gsap.set(text2.querySelectorAll(".char"), { visibility: "visible" });

      gsap.set(text1.querySelectorAll(".odd"), { yPercent: 100 });
      gsap.set(text2.querySelectorAll(".odd"), { yPercent: 0 });
      gsap.set(text1.querySelectorAll(".even"), { yPercent: 0 });
      gsap.set(text2.querySelectorAll(".even"), { yPercent: -100 });

      gsap.to(text1.querySelectorAll(".odd"), {
        yPercent: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(
        text2.querySelectorAll(".odd"),
        { yPercent: -100, duration: 0.6, ease: "power2.out" },
        0
      );
      gsap.to(
        text1.querySelectorAll(".even"),
        { yPercent: 100, duration: 0.6, ease: "power2.out" },
        0
      );
      gsap.to(
        text2.querySelectorAll(".even"),
        { yPercent: 0, duration: 0.6, ease: "power2.out" },
        0
      );

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      tl.to(text1.querySelectorAll(".odd"), { yPercent: 0 });
      tl.to(text2.querySelectorAll(".odd"), { yPercent: -100 }, 0);
      tl.to(text1.querySelectorAll(".even"), { yPercent: 100 }, 0);
      tl.to(text2.querySelectorAll(".even"), { yPercent: 0 }, 0);

      menuLink.addEventListener("mouseenter", () => {
        gsap.set(text1.querySelectorAll(".odd"), { yPercent: 100 });
        gsap.set(text2.querySelectorAll(".odd"), { yPercent: 0 });
        gsap.set(text1.querySelectorAll(".even"), { yPercent: 0 });
        gsap.set(text2.querySelectorAll(".even"), { yPercent: -100 });

        tl.restart();
      });
    });
  }, []);

  return (
    <div className="w-full h-screen flex">
      <div className="bg-[#E8E2DA] w-1/3 flex flex-col justify-start  menu_link-wrap">
        <img
          className=" w-1/2 h-auto mx-auto"
          src="../images/freysmilesbg.png"
        />
        {[
          { name: "Lisa Moyer", title: "2023" },
          { name: "Karen Oneill", title: "2022" },
          { name: "Tanya Burnhauser", title: "2021" },
        ].map((item, index) => (
          <a
            key={index}
            hoverstagger="link"
            href="#"
            className="menu_link w-inline-block"
            ref={(el) => (menuRefs.current[index] = el)}
          >
            <div className="items-center menu_padding mb-10 ">
              <div className=" border-t border-black flex justify-between pt-4">
                <div className="menu_text-wrap">
                  <div hoverstagger="text" className="menu_link-text">
                    {item.name}
                  </div>
                  <div hoverstagger="text" className="menu_link-text is-2">
                    {item.name}
                  </div>
                </div>
                <div hoverstagger="text" className="menu_title">
                  [ {item.title} ]
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="bg-[#ECE4FF] w-2/3 flex flex-col h-screen">
        <div className="h-1/3 flex items-center justify-center">
          <div class="left-mid-block">
            <div class="movin-text-holder">
              <h1 class="moving-text">Testimonials </h1>
              <h1 class="moving-text">Testimonials</h1>
              <h1 class="moving-text">Testimonials </h1>
              <h1 class="moving-text">Testimonials </h1>
              <h1 class="moving-text">Testimonials</h1>
              <h1 class="moving-text">Testimonials </h1>
            </div>
          </div>
        </div>

        <div className="h-2/3 flex items-center justify-center border-t border-black">
          <div
            style={{
              fontFamily: "NeueMontrealBook",
              fontSize: "20px",
              color: "#333",
              padding: "20px",
              maxWidth: "700px",
            }}
            className="flex flex-col"
          >
            <div className="text-center">{selectedDescription}</div>
          </div>
        </div>
      </div>

      {/* <div  className="bg-[#FF6400] w-2/5">
        
        <h1 ref={headingRef}
          style={{
            fontSize: "3rem",
            lineHeight: "100%",
          }}
          className="font-helvetica-neue-light mt-32 mb-10 flex justify-center"
        >
          Testimonials
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "50px",
            padding: "20px",
            maxWidth: "800px",
            margin: "auto",
          }}
        >
          {items.map((item, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
              key={index}
            >
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#000",
                  marginBottom: "10px",
                }}
              ></div>
              <div
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "10px 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "NeueMontrealBook",
                    fontSize: "20px",

                    color: "#333",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedDescription(item.description)}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: "NeueMontrealBook",

                    color: "#999",
                    marginTop: "5px",
                  }}
                >
                  {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[#FF6400] w-3/5 flex items-center justify-center">
        <div
          style={{
            fontFamily: "NeueMontrealBook",
            fontSize: "20px",
            color: "#333",
            padding: "20px",
            maxWidth: "700px",
          }}
          className="flex flex-col"
        >
          <div className="text-center">{selectedDescription}</div>
        </div>
      </div> */}
    </div>
  );
}

function Locations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [scope, animate] = useAnimate();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [activeDisclosurePanel, setActiveDisclosurePanel] = useState(null);

  function toggleDisclosurePanels(newPanel) {
    if (activeDisclosurePanel) {
      if (
        activeDisclosurePanel.key !== newPanel.key &&
        activeDisclosurePanel.open
      ) {
        activeDisclosurePanel.close();
      }
    }
    setActiveDisclosurePanel({
      ...newPanel,
      open: !newPanel.open,
    });
  }

  const locations = [
    {
      location: "Allentown",
      addressLine1: "1251 S Cedar Crest Blvd",
      addressLine2: "Suite 210 Allentown, PA 18103",
      mapbox_map_title: "FreySmiles Allentown [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALLENTOWN,
      hours: [
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Wed: "8:00 AM - 5:30 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Bethlehem",
      addressLine1: "2901 Emrick Boulevard",
      addressLine2: "Bethlehem, PA 18020",
      mapbox_map_title: "FreySmiles Bethlehem [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_BETHLEHEM,
      hours: [{ Tue: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
    {
      location: "Schnecksville",
      addressLine1: "4155 Independence Drive",
      addressLine2: "Schnecksville, PA 18078",
      mapbox_map_title: "FreySmiles Schnecksville [w/ Colors]",
      mapbox_iframe_url:
        process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_SCHNECKSVILLE,
      hours: [
        { Mon: "11:00 AM - 7:00 PM" },
        { Tue: "11:00 AM - 7:00 PM" },
        { Thu: "7:00 AM - 4:30 PM" },
      ],
    },
    {
      location: "Lehighton",
      addressLine1: "1080 Blakeslee Blvd Dr E",
      addressLine2: "Lehighton, PA 18235",
      mapbox_map_title: "FreySmiles Lehighton [w/ Colors]",
      mapbox_iframe_url: process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_LEHIGHTON,
      hours: [{ Mon: "11:00 AM - 7:00 PM" }, { Thu: "7:00 AM - 4:30 PM" }],
    },
  ];

  const handleShowAllLocations = () => {
    activeDisclosurePanel.close();
    setSelectedLocation("All");
  };

  useEffect(() => {
    animate(
      "div",
      isInView
        ? {
            opacity: 1,
            transform: "translateX(0px)",
            scale: 1,
            filter: "blur(0px)",
          }
        : {
            opacity: 0,
            transform: "translateX(-50px)",
            scale: 0.3,
            filter: "blur(2px)",
          },
      {
        duration: 0.2,
        delay: isInView ? stagger(0.1, { startDelay: 0.15 }) : 0,
      }
    );
  }, [isInView]);

  const DrawEllipse = (props) => {
    useGSAP(() => {
      gsap.from(".draw", {
        drawSVG: "0%",
        ease: "expo.out",
        scrollTrigger: {
          trigger: "#locations-section",
          start: "clamp(top center)",
          scrub: true,
          pinSpacing: false,
          markers: false,
        },
      });
    });

    return (
      <svg
        width="508"
        height="122"
        viewBox="0 0 508 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          className="draw"
          d="M2 23.2421C28.9079 14.5835 113.098 -1.63994 234.594 2.73493C386.464 8.20351 515.075 37.5458 505.497 77.9274C503.774 85.1946 491.815 127.145 271.535 118.942C51.2552 110.739 32.8106 78.7919 45.7824 58.053C59.4644 36.1787 112.824 27.9758 193.548 27.9758"
          stroke="#ff6432"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const BezierCurve = () => {
    const container = useRef(null);
    const path = useRef(null);
    let progress = 0;
    let time = Math.PI / 2; // want the initial time value to be 1; in sine graph y = 1 when x = pi / 2
    let reqId = null; // everytime mouse enters and leaves line's bounding box, animation gets called causing simultaneous chains of it being called (this is bad), only want one request animation running at the same time
    let x = 0.5; // middle point is 1/2

    useEffect(() => {
      setPath(progress);
      window.addEventListener("resize", () => {
        setPath(progress);
      });
    }, []);

    {
      /*
      use svg container's width to get control point (center point) of quadratic bezier curve; control point = svg container's width / 2
      30 ==> svg height(60) divided by 2 to align the path within the center of the svg
    */
    }
    const setPath = (progress) => {
      if (container.current) {
        const width = container.current.offsetWidth;
        path.current.setAttributeNS(
          null,
          "d",
          `M 0 30 Q${width * x} ${30 + progress} ${width} 30`
        );
      }
    };

    const manageMouseEnter = () => {
      if (reqId) {
        window.cancelAnimationFrame(reqId);
        resetAnimation();
      }
    };

    const manageMouseMove = (e) => {
      const { movementY, clientX } = e;
      const { left, width } = path.current.getBoundingClientRect();
      // get value of x depending on where mouse is on the x-axis of the line
      x = (clientX - left) / width;
      progress += movementY;
      setPath(progress);
    };

    const manageMouseLeave = () => {
      animateOut();
    };

    {
      /*
      linear interpolation
      x: The value we want to interpolate from (start) => 10
      y: The target value we want to interpolate to (end) => 0
      a: The amount by which we want x to be closer to y => 10% or 0.1
      ex: value = lerp(value, 0, 0.1)
      if value = 10, bring that value close to 0 by 10% which will give 9
    */
    }
    const lerp = (x, y, a) => x * (1 - a) + y * a;

    // sine function, linear interpolation, recursivity
    const animateOut = () => {
      // sine function creates the "wobbly" line animation when mouse leaves the line
      const newProgress = progress * Math.sin(time);
      time += 0.25; // speed of bounce animation
      setPath(newProgress);
      progress = lerp(progress, 0, 0.05); // change 3rd lerp argument to change curve's bounce exaggeration

      // exit condition
      if (Math.abs(progress) > 0.75) {
        reqId = window.requestAnimationFrame(animateOut);
      } else {
        resetAnimation();
      }
    };

    const resetAnimation = () => {
      time = Math.PI / 2;
      progress = 0;
    };

    return (
      <>
        {/* line */}
        <div
          ref={container}
          className="mb-[30px] col-span-12 row-start-2 h-[1px] w-full relative"
        >
          {/* box for event listeners overlays the svg element */}
          <div
            onMouseEnter={manageMouseEnter}
            onMouseMove={(e) => {
              manageMouseMove(e);
            }}
            onMouseLeave={manageMouseLeave}
            className="h-[30px] relative -top-[15px] z-10 hover:h-[60px] hover:-top-[30px]"
          />
          <svg className="w-full h-[60px] -top-[30px] absolute">
            <path ref={path} strokeWidth={1} stroke="#FFF" fill="none" />
          </svg>
        </div>
      </>
    );
  };

  useEffect(() => {
    const title = document.querySelector(".content__title");
    const split = new SplitText(title, { type: "chars" });
    const chars = split.chars;

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        transformOrigin: "50% 100%",
        opacity: 0,
        rotationX: 90,
      },
      {
        ease: "power4",
        opacity: 1,
        stagger: 0.03,
        rotationX: 0,
        scrollTrigger: {
          trigger: title,
          start: "center bottom",
          end: "bottom top+=20%",
          scrub: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    gsap.to(".marquee-track.r h1", {
      scrollTrigger: {
        trigger: ".marquee-track.r h1",
        start: "top bottom",
        end: "400% top",
        scrub: 0.6,
      },
      xPercent: 25,
      duration: 3,
      ease: "linear",
    });
  }, []);

  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const childSplit = new SplitText(".text-heading h1", {
            type: "lines",
            linesClass: "split-child",
          });

          gsap.from(childSplit.lines, {
            duration: 2,
            xPercent: 25,
            autoAlpha: 0,
            ease: "Expo.easeOut",
            stagger: 0.12,
            repeat: -1,
          });

          observer.unobserve(entry.target);
        }
      });
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section id="flex locations-section" className="relative bg-[#0500F7]">
        <div
          id="locations-heading"
          className="relative block max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-[100rem] lg:px-8 lg:py-32"
        >
          <h1 className="font-helvetica-neue-light lg:text-5xl text-[#FFF]">
            Come see us at any of our{" "}
            <span className="relative inline-block my-8 leading-tight lowercase font-editorial-new underline-offset-8">
              four convenient locations
              {/* <img className="absolute w-full h-auto -ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" src="/../../images/ellipse.svg" /> */}
              <DrawEllipse className="absolute w-full h-auto -ml-2 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
            </span>{" "}
            or opt for a{" "}
            <span className=" relative leading-tight lowercase font-editorial-new decoration-wavy underline-offset-8 decoration-[#FFF] underline inline-block">
              virtual consultation
            </span>
          </h1>
          {/* arrow */}
          <svg
            className="hidden lg:block absolute bottom-0 translate-y-1/2 left-0 translate-x-64 w-36 h-36 rotate-[120deg] text-[#ff6432]"
            viewBox="0 0 77 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.33755 84.3973C0.297616 62.7119 2.93494 39.8181 19.4192 23.8736C28.2211 15.3599 42.4944 12.5723 47.6281 26.2359C51.1245 35.5419 51.542 51.9945 41.0605 57.0865C29.486 62.7095 40.2945 35.2221 41.9942 32.4952C49.9497 19.7313 59.7772 11.6122 72.2699 3.78281C76.9496 0.849879 73.7108 0.477284 70.0947 1.13476C66.9572 1.7052 63.4035 2.43717 60.5291 3.81975C59.6524 4.24143 65.7349 2.73236 66.6827 2.44768C70.7471 1.22705 75.4874 -0.0219285 75.9527 5.60812C76.0274 6.5127 75.9956 14.9844 74.7481 15.2963C74.099 15.4586 71.0438 10.27 70.4642 9.65288C66.6996 5.64506 63.5835 4.42393 58.2726 5.11792"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="font-neue-montreal text-[#171616]" ref={ref}>
          <motion.div
            id="locations-map"
            className="h-[60vh] overflow-hidden lg:absolute lg:right-0 lg:h-full lg:w-1/2"
            style={{
              opacity: isInView ? 1 : 0,
              filter: isInView ? "blur(0px)" : "blur(16px)",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <iframe
              className="w-full h-full rounded-lg"
              width="100%"
              height="100%"
              src={
                selectedLocation === "All"
                  ? process.env.NEXT_PUBLIC_MAPBOX_IFRAME_URL_ALL_LOCATIONS
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_iframe_url
              }
              title={
                selectedLocation === "All"
                  ? "FreySmiles All Locations [w/ Colors]"
                  : locations.find((l) => l.location === selectedLocation)
                      .mapbox_map_title
              }
            />
          </motion.div>

          <div
            className="font-neue-montreal text-[#171616]"
            id="locations-details"
          >
            <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:mt-0 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 xl:gap-x-24">
              {/* LOCATIONS LIST */}
              <motion.div
                className="flex flex-col mt-10"
                style={{
                  transform: isInView ? "none" : "translateX(-50px)",
                  opacity: isInView ? 1 : 0,
                  transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
                }}
              >
                <button
                  className={`${
                    selectedLocation === "All" ? "text-[#FFF]" : ""
                  } self-end transition-all duration-300 ease-linear w-max mr-6 mb-6 underline-offset-4 hover:text-[#FFF]`}
                  onClick={handleShowAllLocations}
                >
                  {selectedLocation === "All"
                    ? "Showing All Locations"
                    : "Show All Locations"}
                </button>

                <dl ref={scope}>
                  {locations.map((l, i) => (
                    <Disclosure
                      as="div"
                      key={l.location}
                      className={`${
                        selectedLocation === l.location ? "text-white" : ""
                      } px-4 py-6 transition-all duration-300 ease-linear cursor-pointer hover:text-white group text-white`}
                    >
                      {(panel) => {
                        const { open, close } = panel;
                        return (
                          <>
                            <BezierCurve />

                            <Disclosure.Button
                              className="grid w-full grid-cols-12 grid-rows-1 text-left sm:px-0"
                              onClick={() => {
                                if (!open) close();
                                toggleDisclosurePanels({ ...panel, key: i });
                                setSelectedLocation(l.location);
                              }}
                            >
                              <dt className="col-span-5 row-start-1">
                                <h6 className="text-xl font-neue-montreal text-[#FFF]">
                                  {l.location}
                                </h6>
                              </dt>
                              <dd className="col-span-7 row-start-1">
                                <span className="flex items-center justify-between">
                                  <p className="font-neue-montreal text-[#FFF]">
                                    {l.addressLine1}
                                    <br />
                                    {l.addressLine2}
                                  </p>
                                  <ChevronRightIcon className="w-6 h-6 ui-open:rotate-90 ui-open:transform text-[#FFF]" />
                                </span>
                              </dd>
                            </Disclosure.Button>
                            <Transition
                              show={open}
                              enter="transition-transform ease-out duration-300"
                              enterFrom="transform scale-y-0 opacity-0"
                              enterTo="transform scale-y-100 opacity-100"
                              leave="transition-transform ease-in duration-200"
                              leaveFrom="transform scale-y-100 opacity-100"
                              leaveTo="transform scale-y-0 opacity-0"
                            >
                              <Disclosure.Panel
                                as="div"
                                className="grid grid-cols-12"
                              >
                                <ul className="col-span-7 col-start-6 text-left text-[#FFF] mt-4 mb-2">
                                  <h6 className="font-medium uppercase">
                                    Office Hours:
                                  </h6>
                                  {l.hours.map((hour, index) => (
                                    <li key={index}>
                                      {Object.keys(hour)[0]}:{" "}
                                      {Object.values(hour)[0]}
                                    </li>
                                  ))}
                                </ul>
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        );
                      }}
                    </Disclosure>
                  ))}
                </dl>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const ContactUs = () => {
  useEffect(() => {
    const buttonText = new SplitText("#buttonText", { type: "chars" });
    const button = document.querySelector("button");

    const buttonHoverOn_tl = gsap.timeline({ paused: true });
    buttonHoverOn_tl
      .to(button, { y: -8, ease: "back.out(4)", duration: 1.2 }, 0)
      .to(
        buttonText.chars,
        { y: 3, stagger: 0.02, duration: 0.8, ease: "back.out(4)" },
        0
      )
      .to(
        buttonText.chars,
        { y: 1, stagger: 0.02, duration: 0.8, ease: "back.out(0)" },
        0.6
      );

    const buttonHoverOff_tl = gsap.timeline({ paused: true });
    buttonHoverOff_tl.to(button, { y: 0, duration: 2, ease: "circ.out" }, 0);

    button.addEventListener("mouseenter", () => {
      buttonHoverOff_tl.pause();
      buttonHoverOn_tl.restart();
    });

    button.addEventListener("mouseleave", () => {
      buttonHoverOn_tl.pause();
      buttonHoverOff_tl.restart();
    });

    return () => {
      buttonHoverOn_tl.kill();
      buttonHoverOff_tl.kill();
    };
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const imgSize = [1250, 833];

    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fragment = `
      precision highp float;
      uniform sampler2D tWater;
      uniform sampler2D tFlow;
      uniform float uTime;
      varying vec2 vUv;
      uniform vec4 res;
      void main() {
        vec3 flow = texture2D(tFlow, vUv).rgb;
        vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
        vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
        myUV -= flow.xy * (0.15 * 0.7);
        vec3 tex = texture2D(tWater, myUV).rgb;
        gl_FragColor = vec4(tex, 1.0);
      }
    `;

    const renderer = new OGL.Renderer({ dpr: 2 });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    let aspect = 1;
    const mouse = new OGL.Vec2(-1);
    const velocity = new OGL.Vec2();

    function resize() {
      let a1, a2;
      var imageAspect = imgSize[1] / imgSize[0];
      if (window.innerHeight / window.innerWidth < imageAspect) {
        a1 = 1;
        a2 = window.innerHeight / window.innerWidth / imageAspect;
      } else {
        a1 = (window.innerWidth / window.innerHeight) * imageAspect;
        a2 = 1;
      }
      mesh.program.uniforms.res.value = new OGL.Vec4(
        window.innerWidth,
        window.innerHeight,
        a1,
        a2
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
      aspect = window.innerWidth / window.innerHeight;
    }

    const flowmap = new OGL.Flowmap(gl);

    const geometry = new OGL.Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]),
      },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const texture = new OGL.Texture(gl, {
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const img = new Image();
    img.onload = () => (texture.image = img);
    img.crossOrigin = "Anonymous";
    img.src =
      "../images/whitesquiggle.png";

    let a1, a2;
    var imageAspect = imgSize[1] / imgSize[0];
    if (window.innerHeight / window.innerWidth < imageAspect) {
      a1 = 1;
      a2 = window.innerHeight / window.innerWidth / imageAspect;
    } else {
      a1 = (window.innerWidth / window.innerHeight) * imageAspect;
      a2 = 1;
    }

    const program = new OGL.Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        tWater: { value: texture },
        res: {
          value: new OGL.Vec4(window.innerWidth, window.innerHeight, a1, a2),
        },
        tFlow: flowmap.uniform,
      },
    });

    const mesh = new OGL.Mesh(gl, { geometry, program });

    window.addEventListener("resize", resize, false);
    resize();

    const isTouchCapable = "ontouchstart" in window;
    if (isTouchCapable) {
      window.addEventListener("touchstart", updateMouse, true);
      window.addEventListener("touchmove", updateMouse, { passive: true });
    } else {
      window.addEventListener("mousemove", updateMouse, true);
    }

    let lastTime;
    const lastMouse = new OGL.Vec2();

    function updateMouse(e) {
      e.preventDefault();
      if (e.changedTouches && e.changedTouches.length) {
        e.x = e.changedTouches[0].pageX;
        e.y = e.changedTouches[0].pageY;
      }
      if (e.x === undefined) {
        e.x = e.pageX;
        e.y = e.pageY;
      }
      mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);

      if (!lastTime) {
        lastTime = performance.now();
        lastMouse.set(e.x, e.y);
      }

      const deltaX = e.x - lastMouse.x;
      const deltaY = e.y - lastMouse.y;
      lastMouse.set(e.x, e.y);

      let time = performance.now();
      let delta = Math.max(10.4, time - lastTime);
      lastTime = time;
      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;
      velocity.needsUpdate = true;
    }

    function update(t) {
      requestAnimationFrame(update);
      if (!velocity.needsUpdate) {
        mouse.set(-1);
        velocity.set(0);
      }
      velocity.needsUpdate = false;
      flowmap.aspect = aspect;
      flowmap.mouse.copy(mouse);
      flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
      flowmap.update();
      program.uniforms.uTime.value = t * 0.01;
      renderer.render({ scene: mesh });
    }

    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("touchstart", updateMouse);
      window.removeEventListener("touchmove", updateMouse);
      containerRef.current.removeChild(gl.canvas);
    };
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center text-white relative"
      data-scroll-section
      data-scroll
      data-scroll-speed="1.2"
    >
      <div className="flex justify-center relative h-[600px]">
      <div ref={containerRef} />
        {/* <video
          src="../images/holographic.mp4"
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        /> */}

        <a href="mailto:info@freysmiles.com">
          <button
            className="font-helvetica-neue-light text-black absolute text-lg bg-white w-[150px] h-[150px] rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: "50%",
              left: "50%",
            }}
          >
            Contact Us
          </button>
        </a>
      </div>
    </section>
  );
};

function GiftCards() {
  return (
    <>
      <section className="min-h-screen relative group hover:cursor-pointer">
        <div className="absolute inset-0 w-full h-full flex justify-start items-start bg-[#FFF560] bg-opacity-80 text-white [clip-path:circle(50%_at_0%_0%)] lg:[clip-path:circle(30%_at_0%_0%)] lg:group-hover:[clip-path:circle(35%_at_0%_0%)] group-hover:bg-opacity-100 motion-safe:transition-[clip-path] motion-safe:duration-[2s] ease-out" />
        <Link
          href={`${process.env.NEXT_PUBLIC_SQUARE_GIFT_CARDS_URL}`}
          target="_blank"
          className="text-2xl font-neue-montreal absolute inset-0 w-full h-full pl-[12%] pt-[18%] lg:pl-[6%] lg:pt-[8%] lg:group-hover:pl-[8%] lg:group-hover:pt-[12%] group-hover:duration-[1s]"
        >
          Send a Gift Card
        </Link>
        <img
          src="../images/giftcardbg.png"
          alt="gift cards mockup"
          className="absolute inset-0 object-cover object-center w-full h-full -z-10"
        />
      </section>
    </>
  );
}
