"use client";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
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
import {
  ScrollControls,
  useScroll as useThreeScroll,
  Scroll,
  Text,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue;
uniform float uRotation;
uniform float uSegments;
uniform float uOverlayOpacity;

void main() {
    float canvasAspect = resolution.x / resolution.y;
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); 


    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }


    vec2 rotatedUV = vec2(
        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,
        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5
    );


    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);
    float amplitude = 0.015; // The amplitude of the sine wave
    rotatedUV.x += amplitude * sin(sliceProgress * 3.14159265 * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));


    vec2 finalUV = vec2(
        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,
        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5
    );

vec2 clampedUV = clamp(finalUV, 0.0, 1.0);
vec4 color = texture2D(uTexture, clampedUV);


    if (uOverlayOpacity > 0.0) {
   
        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);
        color.rgb *= (1.0 - blackOverlayAlpha);

        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);
        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);
    }

    gl_FragColor = color;
}
`;

const FlutedGlassEffect = ({
  imageUrl,
  mode = "static",
  motionFactor = -50,
  rotationAngle = 0,
  segments = 80,
  overlayOpacity = 0,
  style = {},
  className = "",
}) => {
  const containerRef = useRef(null);
  const [imageAspect, setImageAspect] = useState(1);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const scene = useRef(new THREE.Scene());
  const camera = useRef(null);
  const renderer = useRef(null);
  const material = useRef(null);
  const plane = useRef(null);
  const animationId = useRef(null);
  const texture = useRef(null);

  const init = () => {
    const container = containerRef.current;

    const position = window.getComputedStyle(container).position;
    if (!["relative", "absolute", "fixed", "sticky"].includes(position)) {
      container.style.position = "relative";
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.setSize(width, height);
    renderer.current.setClearColor(0xeeeeee, 1);

    const rendererElement = renderer.current.domElement;
    rendererElement.style.position = "absolute";
    rendererElement.style.top = "0";
    rendererElement.style.left = "0";
    container.appendChild(rendererElement);

    const frustumSize = 1;
    camera.current = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    camera.current.position.set(0, 0, 2);

    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      setImageAspect(aspect);
      texture.current = new THREE.Texture(img);
      texture.current.needsUpdate = true;

      if (material.current) {
        material.current.uniforms.uTexture.value = texture.current;
        material.current.uniforms.uImageAspect.value = aspect;
      }
    };
    img.src = imageUrl;

    material.current = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        resolution: { value: new THREE.Vector4(width, height, 1, 1) },
        uTexture: { value: null },
        uMotionValue: { value: 0.5 },
        uRotation: { value: rotationAngle },
        uSegments: { value: segments },
        uOverlayColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        uOverlayColorWhite: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        uImageAspect: { value: imageAspect },
        uOverlayOpacity: { value: overlayOpacity },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    plane.current = new THREE.Mesh(geometry, material.current);
    scene.current.add(plane.current);

    animate();
  };

  const animate = () => {
    animationId.current = requestAnimationFrame(animate);
    renderer.current.render(scene.current, camera.current);
  };

  const handleResize = () => {
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (renderer.current) {
      renderer.current.setSize(width, height);
    }

    if (camera.current) {
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    }

    if (material.current) {
      material.current.uniforms.resolution.value.x = width;
      material.current.uniforms.resolution.value.y = height;
    }
  };

  const handleMouseMove = (event) => {
    if (mode !== "mouse" || !material.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    mouse.current.x = x;
    material.current.uniforms.uMotionValue.value = 0.5 + x * motionFactor * 0.1;

    mouse.current.y = 1.0 - event.clientY / window.innerHeight;
    material.current.uniforms.uMotionValue.value =
      0.5 + mouse.current.x * motionFactor * 0.1;
  };

  const handleScroll = () => {
    if (mode !== "scroll" || !material.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    const isInViewport = elemTop < window.innerHeight && elemBottom >= 0;

    if (isInViewport) {
      const totalHeight = window.innerHeight + container.offsetHeight;
      const scrolled = window.innerHeight - elemTop;
      const progress = scrolled / totalHeight;
      const maxMovement = 0.2;
      material.current.uniforms.uMotionValue.value =
        progress * maxMovement * motionFactor;
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (mode === "mouse") {
      window.addEventListener("mousemove", handleMouseMove);
    }

    if (mode === "scroll") {
      window.addEventListener("scroll", handleScroll);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (mode === "mouse") {
        window.removeEventListener("mousemove", handleMouseMove);
      }

      if (mode === "scroll") {
        window.removeEventListener("scroll", handleScroll);
      }

      window.removeEventListener("resize", handleResize);

      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }

      if (renderer.current && container.contains(renderer.current.domElement)) {
        container.removeChild(renderer.current.domElement);
      }
    };
  }, [mode]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (material.current) {
      material.current.uniforms.uRotation.value = rotationAngle;
      material.current.uniforms.uSegments.value = segments;
      material.current.uniforms.uOverlayOpacity.value = overlayOpacity;
    }
  }, [rotationAngle, segments, overlayOpacity]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
};
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
      <div style={{ width: "50vw", height: "100vh" }}>
        <FlutedGlassEffect
          imageUrl="/images/1.jpg"
          mode="mouse"
          motionFactor={-50}
          rotationAngle={45}
          segments={50}
          overlayOpacity={50}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </>
  );
};

export default Braces;
