"use client";
import NormalizeWheel from 'normalize-wheel'
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense} from "react";
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
import { Canvas, useFrame, useThree, extend, useLoader, useTexture } from "@react-three/fiber";
import { Renderer, Camera, Transform, Plane, Texture, Mesh, Program } from 'ogl'



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

const Braces = () => {

  return (
    <>
<div
  className="relative min-h-screen overflow-hidden"
  style={{
    background: `linear-gradient(90deg, #8f8fa0 0%, #bdbdc6 50%, #e2e2e6 100%)`,
  }}
>

  <main className="relative z-20">
    {/* Your content here */}
  </main>
</div>


    {/* <div className="relative">
  <TextEffect 
    text="Braces" 
    font="NeueHaasRoman" 
    color="#ffffff" 
    fontWeight="normal" 
  />
  <WebGLGalleryApp />
</div> */}



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
}`

const vertex =`
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
`
function WebGLGalleryApp() {
  const canvasRef = useRef(null)
  const galleryRef = useRef(null)
  const mediasRef = useRef([])
  const scrollRef = useRef({ ease: 0.05, current: 0, target: 0, last: 0 })
  const rendererRef = useRef()
  const sceneRef = useRef()
  const cameraRef = useRef()
  const geometryRef = useRef()
  const viewportRef = useRef()
  const screenRef = useRef()
  const galleryHeightRef = useRef()

  useEffect(() => {
    const renderer = new Renderer({ canvas: canvasRef.current, alpha: true })
    const gl = renderer.gl
    const camera = new Camera(gl)
    camera.position.z = 5
    const scene = new Transform()
    const geometry = new Plane(gl, { heightSegments: 10 })
  
    rendererRef.current = renderer
    sceneRef.current = scene
    cameraRef.current = camera
    geometryRef.current = geometry
  
    const resize = () => {
      screenRef.current = {
        width: window.innerWidth,
        height: window.innerHeight
      }
  
      renderer.setSize(screenRef.current.width, screenRef.current.height)
  
      camera.perspective({
        aspect: gl.canvas.width / gl.canvas.height
      })
  
      const fov = camera.fov * (Math.PI / 180)
      const height = 2 * Math.tan(fov / 2) * camera.position.z
      const width = height * camera.aspect
  
      viewportRef.current = { width, height }
  
      const galleryBounds = galleryRef.current.getBoundingClientRect()
      galleryHeightRef.current = galleryBounds.height
  
      if (mediasRef.current.length) {
        mediasRef.current.forEach(media =>
          media.onResize({
            screen: screenRef.current,
            viewport: viewportRef.current
          })
        )
      }
    }
  
    resize()
  
    const figures = galleryRef.current.querySelectorAll('figure')
    const medias = Array.from(figures).map(element =>
      createMedia({
        element,
        geometry,
        gl,
        scene,
        screen: screenRef.current,
        viewport: viewportRef.current,
        vertex,
        fragment
      })
    )
    mediasRef.current = medias
  
    const update = () => {
      scrollRef.current.current = lerp(scrollRef.current.current, scrollRef.current.target, scrollRef.current.ease)
  
      const direction = scrollRef.current.current > scrollRef.current.last ? 'down' : 'up'
  
      mediasRef.current.forEach(media => media.update(scrollRef.current, direction))
  
      renderer.render({ scene, camera })
  
      scrollRef.current.last = scrollRef.current.current
  
      requestAnimationFrame(update)
    }
  
    update()
  
    window.addEventListener('resize', resize)
    window.addEventListener('wheel', e => {
      const normalized = NormalizeWheel(e)
      scrollRef.current.target += normalized.pixelY * 0.5
      
      // Limit scrolling to gallery bounds
      const galleryHeight = galleryRef.current.getBoundingClientRect().height
      const maxScroll = galleryHeight - window.innerHeight
      scrollRef.current.target = Math.max(0, Math.min(maxScroll, scrollRef.current.target))
    })
  
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="h-screen w-full webgl-canvas" />
      <div className="gallery1" ref={galleryRef}>
        <main>
          <section className="gallery-section">
            <header className="gallery-header">
              <h1 className="gallery-title">Planete Elevene</h1>
            </header>

            <div className="gallery1">
              {images.map((src, i) => (
                <figure key={i} className="gallery__item">
                  <img className="gallery__image" src={src} alt={`Gallery ${i + 1}`} />
                </figure>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

function createMedia({ element, geometry, gl, scene, screen, viewport, vertex, fragment }) {
  const img = element.querySelector('img')
  const bounds = element.getBoundingClientRect()
  const texture = new Texture(gl, { generateMipmaps: false })
  const image = new Image()
  image.crossOrigin = 'anonymous' 
  image.src = img.src

  const state = {
    plane: null,
    program: null,
  }

  const createMesh = () => {
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [viewport.width, viewport.height] },
        uStrength: { value: 0 }
      },
      transparent: true
    })

    const plane = new Mesh(gl, { geometry, program })
    plane.setParent(scene)

    state.plane = plane
    state.program = program
  }

  const updateScale = () => {
    state.plane.scale.x = viewport.width * bounds.width / screen.width
    state.plane.scale.y = viewport.height * bounds.height / screen.height
  }

  const updateX = (x = 0) => {
    state.plane.position.x =
      -(viewport.width / 2) +
      state.plane.scale.x / 2 +
      ((bounds.left - x) / screen.width) * viewport.width
  }

  const updateY = (y = 0) => {
    state.plane.position.y =
      (viewport.height / 2) -
      (state.plane.scale.y / 2) -
      ((bounds.top - y) / screen.height) * viewport.height
  }

  const onResize = (sizes) => {
    if (sizes) {
      if (sizes.screen) screen = sizes.screen
      if (sizes.viewport) {
        viewport = sizes.viewport
        state.program.uniforms.uViewportSizes.value = [viewport.width, viewport.height]
      }
    }
    updateBounds()
  }

  const updateBounds = () => {
    updateScale()
    updateX()
    updateY()
    state.program.uniforms.uPlaneSizes.value = [state.plane.scale.x, state.plane.scale.y]
  }

  const update = (scroll, direction) => {
    updateScale();
    updateX();
    updateY(scroll.current);
  
    // Calculate base strength
    const baseStrength = ((scroll.current - scroll.last) / screen.width) * 10;
    
    // Reverse the strength based on direction
    state.program.uniforms.uStrength.value = 
      direction === 'down' ? -Math.abs(baseStrength) : Math.abs(baseStrength);
  }

  image.onload = () => {
    texture.image = image
    state.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
  }

  createMesh()
  updateBounds()

  return {
    update,
    onResize,
    get plane() {
      return state.plane
    },
  }
}

const lerp = (a, b, t) => a + (b - a) * t

const images = [
  "/images/background_min.png",
  "/images/bracesrubberbands.png",
  "/images/image3.jpg",
  "/images/image4.jpg",
  "/images/image5.jpg",
  "/images/image6.jpg",

];