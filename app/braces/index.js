"use client";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense} from "react";
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
import { Canvas, useFrame, useThree, extend, useLoader } from "@react-three/fiber";



const FluidSimulation = () => {
  const mountRef = useRef(null);

  useEffect(() => {

    const simulationVertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const simulationFragmentShader = `
      uniform sampler2D textureA;
      uniform vec2 mouse;
      uniform vec2 resolution;
      uniform float time;
      uniform int frame;
      varying vec2 vUv;

      const float delta = 1.4;  

      void main() {
          vec2 uv = vUv;
          if (frame == 0) {
              gl_FragColor = vec4(0.0);
              return;
          }
          
          vec4 data = texture2D(textureA, uv);
          float pressure = data.x;
          float pVel = data.y;
          
          vec2 texelSize = 1.0 / resolution;
          float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
          float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
          float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
          float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;
          
          if (uv.x <= texelSize.x) p_left = p_right;
          if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
          if (uv.y <= texelSize.y) p_down = p_up;
          if (uv.y >= 1.0 - texelSize.y) p_up = p_down;
          

          pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
          pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;
          
          pressure += delta * pVel;
          
          pVel -= 0.005 * delta * pressure;
          
          pVel *= 1.0 - 0.002 * delta;
          pressure *= 0.999;
          
          vec2 mouseUV = mouse / resolution;
          if(mouse.x > 0.0) {
              float dist = distance(uv, mouseUV);
              if(dist <= 0.02) { 
                  pressure += 2.0 * (1.0 - dist / 0.02);  // Increase intensity
              }
          }
          
          gl_FragColor = vec4(pressure, pVel, 
              (p_right - p_left) / 2.0, 
              (p_up - p_down) / 2.0);
      }
    `;

    const renderVertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const renderFragmentShader = `
      uniform sampler2D textureA;
      uniform sampler2D textureB;
      varying vec2 vUv;

      void main() {
          vec4 data = texture2D(textureA, vUv);
          
          vec2 distortion = 0.3 * data.zw;
          vec4 color = texture2D(textureB, vUv + distortion);
          
          vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
          vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
          float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;
          
          gl_FragColor = color + vec4(specular);
      }
    `;


    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });

    ctx.fillStyle = "#fb7427";
    ctx.fillRect(0, 0, width, height);

    const fontSize = Math.round(250 * window.devicePixelRatio);
    ctx.fillStyle = "#fef4b8";
    ctx.font = `bold ${fontSize}px Test Söhne`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.textRendering = "geometricPrecision";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillText("softhorizon", width / 2, height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;


    const handleResize = () => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;

      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.fillStyle = "#fb7427";
      ctx.fillRect(0, 0, newWidth, newHeight);

      const newFontSize = Math.round(250 * window.devicePixelRatio);
      ctx.fillStyle = "#fef4b8";
      ctx.font = `bold ${newFontSize}px Test Söhne`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("softhorizon", newWidth / 2, newHeight / 2);

      textTexture.needsUpdate = true;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    };

    const handleMouseLeave = () => {
      mouse.set(0, 0);
    };

    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;

      simMaterial.uniforms.textureA.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      requestAnimationFrame(animate);
    };

    animate();


    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};
const TextEffect = ({ text = "braces", font = "NeueHaasDisplay35", color = "#ffffff", fontWeight = "100" }) => {
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
    if (!planeMeshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
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
      y: targetMousePositionRef.current.y 
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
      y: prevPositionRef.current.y 
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
          currentContainer.addEventListener('mousemove', handleMouseMove);
          currentContainer.addEventListener('mouseenter', handleMouseEnter);
          currentContainer.addEventListener('mouseleave', handleMouseLeave);
        }
        window.addEventListener('resize', onWindowResize);
  
      } catch (error) {
        console.error("Font loading error:", error);

        if (!mounted) return;
        
        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);
  
        if (currentContainer) {
          currentContainer.addEventListener('mousemove', handleMouseMove);
          currentContainer.addEventListener('mouseenter', handleMouseEnter);
          currentContainer.addEventListener('mouseleave', handleMouseLeave);
        }
        window.addEventListener('resize', onWindowResize);
      }
    };
  
    init();
  
    return () => {
      mounted = false;
      cancelAnimationFrame(animationRef.current);

      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
        currentContainer.removeEventListener('mouseenter', handleMouseEnter);
        currentContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', onWindowResize);
      

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
        sceneRef.current.traverse(child => {
          child.material?.dispose();
          child.geometry?.dispose();
        });
      }
    };
  }, [text, font, color, fontWeight]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', cursor: 'none' }} />;
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


<div className="relative z-10">
  <FluidSimulation />
  <TextEffect 
    text="Braces" 
    font="NeueHaasRoman" 
    color="#ffffff" 
    fontWeight="normal" 
  />
</div>

      {/* <div style={{ width: "50vw", height: "100vh" }}>
        <FlutedGlassEffect
          imageUrl="/images/1.jpg"
          mode="mouse"
          motionFactor={-50}
          rotationAngle={45}
          segments={50}
          overlayOpacity={50}
          style={{ width: "100%", height: "100%" }}
        />
      </div> */}
    </>
  );
};

export default Braces;
