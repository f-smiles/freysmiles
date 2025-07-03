'use client'
import React, { useEffect, useRef } from 'react'
import { DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector2, Vector4, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
// import postVertex from '../shaders/postVertex.glsl'
// import postFragment from '../shaders/postFragment.glsl'
// import vertex from '../shaders/vertex.glsl'
// import fragment from '../shaders/fragment.glsl'

const items = [
  {
    imgSrc: "/images/test/1.jpg",
    altText: "test image 1",
    heading: "Cultural diversion",
    description: "A description",
  },
  {
    imgSrc: "/images/test/2.jpg",
    altText: "test image 2",
    heading: "Shamanic dance",
    description: "A description",
  },
  {
    imgSrc: "/images/test/3.jpg",
    altText: "test image 3",
    heading: "Conditioning",
    description: "A description",
  },
]

const vertexShader = /* glsl */ `
  uniform float time;
  uniform float progress;
  uniform vec2 resolution;
  varying vec2 vUv;
  uniform sampler2D texture1;

  const float pi = 3.1415925;

  void main() {
    vUv = uv;
    gl_Position = (projectionMatrix * modelViewMatrix * vec4(position, 1.0 ));
  }
`;

const fragmentShader = /* glsl */ `
  uniform float time;
  uniform float progress;
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform float uVelo;
  uniform int uType;

  float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv *= resolution * 0.5;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
  }

  void main() {
    vec2 newUV = vUv;
    vec4 color = vec4(1., 0., 0., 1.);
    float c = circle(newUV, uMouse, 0.0, 0.25);
    float r = texture2D(tDiffuse, newUV.xy += c * (uVelo * .5)).x;
    float g = texture2D(tDiffuse, newUV.xy += c * (uVelo * .525)).y;
    float b = texture2D(tDiffuse, newUV.xy += c * (uVelo * .55)).z;
    color = vec4(r, g, b, 1.);
    gl_FragColor = color;
  }
`;

const ImageCanvas = ({ imgSrc, altText, className }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef();
  const composerRef = useRef();
  const customPassRef = useRef();
  const cameraRef = useRef();
  const mouse = useRef(new Vector2(0, 0));
  const prevMouse = useRef(new Vector2(0, 0));
  const followMouse = useRef(new Vector2(0, 0));
  const speed = useRef(0);
  const targetSpeed = useRef(0);
  const time = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    // const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
    // camera.position.z = 1;
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(1);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    rendererRef.current = renderer;

    const container = containerRef.current;
    container.appendChild(renderer.domElement);
    container.style.opacity = '1';

    const texture = new TextureLoader().load(imgSrc);
    const mesh = new Mesh(
      new PlaneGeometry(2.4, 1.6),
      new MeshBasicMaterial({ map: texture })
    );
    scene.add(mesh);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const customPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new Vector2(1, containerRef.current.clientHeight / containerRef.current.clientWidth) },
        uMouse: { value: new Vector2(-10, -10) },
        uVelo: { value: 0 },
        time: { value: 0 }
      },
      vertexShader,
      fragmentShader,
    });
    customPass.renderToScreen = true;
    composer.addPass(customPass);

    composerRef.current = composer;
    customPassRef.current = customPass;

    const handleMouse = (e) => {
      mouse.current.x = e.clientX / containerRef.current.clientWidth;
      mouse.current.y = 1 - e.clientY / containerRef.current.clientHeight;
    };

    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      customPass.uniforms.resolution.value.y = height / width;
      camera.updateProjectionMatrix();
    };

    const updateSpeed = () => {
      const dx = prevMouse.current.x - mouse.current.x;
      const dy = prevMouse.current.y - mouse.current.y;
      speed.current = Math.sqrt(dx * dx + dy * dy);
      targetSpeed.current -= 0.1 * (targetSpeed.current - speed.current);
      followMouse.current.x -= 0.1 * (followMouse.current.x - mouse.current.x);
      followMouse.current.y -= 0.1 * (followMouse.current.y - mouse.current.y);
      prevMouse.current.copy(mouse.current);
    };

    const animate = () => {
      time.current += 0.1;
      updateSpeed();

      customPass.uniforms.time.value = time.current;
      customPass.uniforms.uMouse.value = followMouse.current;
      customPass.uniforms.uVelo.value = Math.min(targetSpeed.current, 0.05);
      targetSpeed.current *= 0.999;

      composer.render();
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouse);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [imgSrc]);

  return (
    <div ref={containerRef} className={`aberration-effect ${className}`}>
      <img src={imgSrc} alt={altText} />
    </div>
  )
}

export default function GridContainer() {
  return (
    <div className="grid-container">
      {items.map((item, i) => (
        <div key={item.heading} className={`item-${i + 1}-container`}>
          <ImageCanvas className={`item-${i + 1}`} imgSrc={item.imgSrc} altText={item.altText} />
          <div className="image__info">
            <h2 className="image__heading">{item.heading}</h2>
            <p className="image__description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const oldSetupScene = (texture) => {
  container.renderer = new WebGLRenderer({ antialias: true, alpha: true })
  container.renderer.setPixelRatio(1) // window.devicePixelRatio
  container.renderer.setSize(container.clientWidth, container.clientHeight)
  container.renderer.sortObjects = false
  container.renderer.outputEncoding = sRGBEncoding
  // container.renderer.setClearColor(new Color(0, 0, 0))
  container.appendChild(container.renderer.domElement)

  container.scene = new Scene()
  container.camera = new PerspectiveCamera(70, container.clientWidth / container.clientHeight, 100, 1000)
  container.camera.position.set(0, 0, 400)
  container.camera.lookAt(0, 0, 0)

  // container.clock = new Clock(true)

  if (container.mesh) container.scene.remove(container.mesh)

  // const geometry = new PlaneGeometry(1, 1)
  // const phongMaterial = new MeshPhongMaterial({
  //   color : 0xffffff,
  //   precision: 'mediump',
  // })
  // container.mesh = new Mesh(geometry, phongMaterial)
  // container.scene.add(container.mesh)

  // container.scene.add(new AmbientLight(0x222222))
  // const directionalLight = new DirectionalLight(0xffffff)
  // directionalLight.position.set(1, 1, 1)
  // container.scene.add(directionalLight)

  // Define the shader uniforms
  container.uniforms = {
    u_time : { type : 'f', value : 0.0 },
    u_frame : { type : 'f', value : 0.0 },
    u_resolution : {
      type : 'v2',
      value : new Vector2(container.clientWidth, container.clientHeight),
    },
    u_mouse : {
      type : 'v2',
      value : new Vector2(0.5, 0.5),
    },
    u_texture : { type: 't', value : texture },
  }

  // Create the shader material
  const shaderMaterial = new ShaderMaterial({
    uniforms: container.uniforms,
    vertexShader,
    fragmentShader,
  })

  const mesh = new Mesh(new PlaneGeometry(2, 2), shaderMaterial)
  container.scene.add(mesh)

  // Initialize the effect composer
  container.composer = new EffectComposer(container.renderer)
  container.composer.addPass(new RenderPass(container.scene, container.camera))

  // Add the post-processing effect
  const shaderPass = new ShaderPass(shaderMaterial, 'u_texture')
  shaderPass.renderToScreen = true
  container.composer.addPass(shaderPass)
  container.composer.render()
}

const oldInitHoverEffect = (container) => {
container.scene = null
container.camera = null
container.renderer = null
container.composer = null
container.renderPass = null
container.customPass = null
container.geometry = null
container.material = null

activeContainers.add(container)

const loader = new TextureLoader()
loader.loadAsync(imgSrc)
  .then((texture) => {
    setupScene(texture)
  })

const setupScene = (texture) => {
  container.scene = new Scene()
  container.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  container.renderer = new WebGLRenderer({ antialias: true, alpha: true })
  container.renderer.setPixelRatio(1) // window.devicePixelRatio
  container.renderer.setSize(container.clientWidth, container.clientHeight)
  container.renderer.sortObjects = false
  container.renderer.outputEncoding = SRGBColorSpace // THREE.SRGBColorSpace
  container.appendChild(container.renderer.domElement)

  container.composer = new EffectComposer(container.renderer)
  container.renderPass = new RenderPass(container.scene, container.camera)
  container.composer.addPass(container.renderPass)

  // custom shader pass
  let counter = 0.0
  const myEffect = {
    uniforms: {
      tDiffuse: { value: null },
      distort: { value: 0 },
      resolution: { value: new Vector2(1., container.clientHeight / container.clientWidth) },
      uMouse: { value: new Vector2(-10, -10) },
      uVelo: { value: 0 },
      uScale: { value: 0 },
      uType: { value: 0 },
      time: { value: 0 },
    },
    vertexShader: postVertex,
    fragmentShader: postFragment,
  }

  container.customPass = new ShaderPass(myEffect)
  container.customPass.renderToScreen = true
  container.composer.addPass(container.customPass)

  container.geometry = new PlaneGeometry(1, 1)
  container.material = new ShaderMaterial({
    extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
    side: DoubleSide, // THREE.DoubleSide
    uniforms: {
      time: { type: "f", value: 0 },
      progress: { type: "f", value: 0 },
      angle: { type: "f", value: 0 },
      texture1: { type: "t", value: null },
      texture2: { type: "t", value: null },
      resolution: { type: "v4", value: new Vector4() },
      uvRate1: { value: new Vector2(1, 1) }
    },
    // wireframe: true,
    transparent: true,
    vertexShader: vertex,
    fragmentShader: fragment
  })

  let resizeTimeout
  const resizeObserver = new ResizeObserver(
    () => {
      if (resizeTimeout) return
      resizeTimeout = setTimeout(() => {
        if (container.renderer) container.renderer.setSize(container.clientWidth, container.clientHeight)
        if (container.customPass) container.customPass.uniforms.resolution.value.y = container.clientHeight / container.clientWidth
        resizeTimeout = null
      }, 200)
    }
  )
  resizeObserver.observe(container)
  container.renderer.render(container.scene, container.camera)
}
}