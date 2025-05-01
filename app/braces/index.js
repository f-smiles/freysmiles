"use client";

import { useRef, useEffect } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap-trial/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap-trial/DrawSVGPlugin";
import { SplitText } from "gsap-trial/SplitText";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import * as OGL from "ogl";
import { ScrollControls, useScroll as useThreeScroll,Scroll, Text,OrbitControls,useGLTF  } from "@react-three/drei";
import { Canvas, useFrame, useThree , extend} from "@react-three/fiber";

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

gsap.registerPlugin(ScrollTrigger);

const Braces = () => {
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

    gl.canvas.style.borderRadius = "20px";
    gl.canvas.style.clipPath = "inset(0% round 20px)";
    // gl.canvas.style.clipPath = "none";
    renderer.setSize(window.innerWidth, window.innerHeight);

    let aspect = 1;
    const mouse = new OGL.Vec2(-1);
    const velocity = new OGL.Vec2();

    function resize() {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      renderer.setSize(containerWidth, containerHeight);


      let a1, a2;
      var imageAspect = imgSize[1] / imgSize[0]; 
      var containerAspect = containerHeight / containerWidth;

      if (containerAspect < imageAspect) {
        a1 = 1;
        a2 = containerAspect / imageAspect;
      } else {
        a1 = imageAspect / containerAspect;
        a2 = 1;
      }


      program.uniforms.res.value = new OGL.Vec4(
        containerWidth,
        containerHeight,
        a1,
        a2
      );

      aspect = containerWidth / containerHeight;
    }

    const flowmap = new OGL.Flowmap(gl);
    const geometry = new OGL.Geometry(gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 3, -1, -1, 3]), // Covers full screen
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
    img.src = "../images/pinkredgradient.png";

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

      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      const baseFactor = 300;
      const scaleFactor = minDimension / baseFactor;

      if (!lastTime) {
        lastTime = performance.now();
        lastMouse.set(x, y);
      }

      const deltaX = (x - lastMouse.x) * scaleFactor * 0.3;
      const deltaY = (y - lastMouse.y) * scaleFactor * 0.3;
      lastMouse.set(x, y);

      const time = performance.now();
      const delta = Math.max(5, time - lastTime);
      lastTime = time;

      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;
      velocity.needsUpdate = true;
    }

    // function updateMouse(e) {
    //   e.preventDefault();

    //   const rect = gl.canvas.getBoundingClientRect();
    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;

    //   mouse.set(x / rect.width, 1 - y / rect.height);

    //   const sensitivity = (Math.min(rect.width, rect.height) / 300) * 3;

    //   if (!lastTime) {
    //     lastTime = performance.now();
    //     lastMouse.set(x, y);
    //   }

    //   const deltaX = (x - lastMouse.x) * sensitivity;
    //   const deltaY = (y - lastMouse.y) * sensitivity;
    //   lastMouse.set(x, y);

    //   const time = performance.now();
    //   const delta = Math.max(5, time - lastTime);
    //   lastTime = time;

    //   velocity.x = deltaX / delta;
    //   velocity.y = deltaY / delta;
    //   velocity.needsUpdate = true;
    // }
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
      if (containerRef.current && gl?.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, []);

  const slide = [
    {
      title: "Brush and Floss",
      imageUrl: "../images/purplefloss.jpeg",
      text: "Brushing and flossing during orthodontic treatment is more important than ever. Orthodontic appliances such as clear aligners, brackets, and wires interfere with normal self-cleansing mechanisms of the mouth. Research shows that only 10% of patients brush and floss consistently during active treatment. We're here to ensure you don't just get lost in the statistics.",
    },
    {
      title: "General Soreness",
      imageUrl: "../images/soreness.jpg",
      text: "When you get your braces on, you may feel general soreness in your mouth and teeth may be tender to biting pressures for 3 –5 days. Take Tylenol or whatever you normally take for headache or discomfort. The lips, cheeks and tongue may also become irritated for one to two weeks as they toughen and become accustomed to the braces. We will supply wax to put on the braces in irritated areas to lessen discomfort.",
    },
    {
      title: "Loose teeth",
      imageUrl: "../images/lime_worm.svg",
      text: "This is to be expected throughout treatment. The teeth must loosen first so they can move. The teeth will settle into the bone and soft tissue in their desired position after treatment is completed if retainers are worn correctly.",
    },
    {
      title: "Loose wire/band",
      imageUrl: "../images/lime_worm.svg",
      text: "When crowding and/or significant dental rotations is the case initially, a new wire placed at the office may eventually slide longer than the last bracket. In this case, depending on the orientation of the last tooth, it may poke into your cheek or gums. If irritation to the lips or You  can place orthodontic wax on the wire to reduce prevent stabbing. If the wire doesn't settle in on its own, it will benefit from being clipped within two weeks. Call our office to schedule an appointment.",
    },
    {
      title: "Rubberbands",
      imageUrl: "../images/lime_worm.svg",
      text: "To successfully complete orthodontic treatment, the patient must work together with the orthodontist. If the doctor has prescribed rubber bands it will be necessary for you to follow the prescription for an ideal result. Failure to follow protocol will lead to a less than ideal treatment result. Excessive broken brackets will delay treatment and lead to an incomplete result. Compromised results due to lack of compliance is not grounds for financial reconciliation. ",
    },
    {
      title: "Athletics",
      imageUrl:
        "https://i.postimg.cc/g09w3j9Q/e21673ee1426e49ea1cd7bc5b895cbec.jpg",
      text: "Braces and mouthguards typically don't mix. Molded mouthguards will prevent planned tooth movement. If you require a mouthguard for contact sports, we stock ortho-friendly mouthguards which may work. ",
    },
    {
      title: "How long will I be in braces?",
      imageUrl:
        "https://i.postimg.cc/T35Lymsn/597b0f5fc5aa015c0ca280ebd1e4293b.jpg",
      text: "Every year hundreds of parents trust our experience to provide beautiful, healthy smiles for their children. Deepending on case complexity and compliance, your time in braces may vary, but at FreySmiles Orthodontics case completion may only be typically only 12-22 months away.",
    },
    {
      title: "Eating with braces",
      imageUrl:
        "https://i.postimg.cc/NMB5Pnjx/62f64bc801260984785ff729f001a120.gif",
      text: "Something to keep in mind with braces is to take caution when eating hard foods, i.e., tough meats,hard breads, granola, and the like.  But you’ll need to protect yourorthodontic appliances when you eat for as long as you’re wearing braces.",
    },
  ];

  return (
    <>
<section className="relative w-full h-screen overflow-hidden text-white font-neueroman">
  {/* Background or canvas layer */}
  <div
    ref={containerRef}
    className="pointer-events-none absolute top-0 left-0 w-screen h-screen z-0"
  />

  {/* Foreground content */}
  <div className="relative z-10 h-full px-6 md:px-20 py-16 flex flex-col justify-between">
    {/* Top Text */}
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <div className="text-[10vw] leading-[0.9] font-bold uppercase whitespace-nowrap">
        DAMON
      </div>
      <div className="text-[10vw] leading-[0.9] font-bold uppercase whitespace-nowrap">
        BRACES
      </div>
    </div>

    {/* Curved SVG lines */}
    <svg className="absolute left-[14%] top-[42%] z-10" height="240" width="40">
      <path d="M20 0 Q0 120 20 240" stroke="white" fill="none" />
    </svg>
    <svg className="absolute left-[44%] top-[42%] z-10" height="240" width="40">
      <path d="M20 0 Q40 120 20 240" stroke="white" fill="none" />
    </svg>

    {/* Paragraph in bottom-right */}
    <div className="absolute bottom-6 right-6 max-w-sm text-[13px] leading-snug font-sans text-white/90">
      <p>
        TUX Karma is a young organization in development. We are trying things out,
        seeing what works, what doesn't. The approach you see on this page is what we are
        currently using. Come back in a few months, and we might be trying something else!
      </p>
    </div>
  </div>
</section>



    </>
  );
};

export default Braces;
