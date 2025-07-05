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

const vertex = /* glsl */ `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec2 u_resolution;
  uniform sampler2D u_texture;
  uniform float u_aspect;

  varying vec2 v_uv;

  void main()	{
    vec2 uv = v_uv;
    float screenAspect = u_resolution.x / u_resolution.y;
    float ratio = u_aspect / screenAspect;

    vec2 texCoord = vec2(
      mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x),
      uv.y
    );

    gl_FragColor = texture2D(u_texture, texCoord);
  }
`;

const postVertex = /* glsl */ `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
  }
`;

const postFragment = /* glsl */ `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_aspect;
  uniform float u_time;
  uniform float u_progress;
  uniform float u_velo;
  uniform int u_type;
  uniform sampler2D tDiffuse;

  varying vec2 v_uv;

	float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
		uv -= disc_center;
		uv *= u_resolution;
		float dist = sqrt(dot(uv, uv));
		return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
	}

	float map(float value, float min1, float max1, float min2, float max2) {
		return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
	}

	float remap(float value, float inMin, float inMax, float outMin, float outMax) {
		return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
	}

	float hash12(vec2 p) {
		float h = dot(p,vec2(127.1, 311.7));
		return fract(sin(h) * 43758.5453123);
	}

	// #define HASHSCALE3 vec3(.1031, .1030, .0973)
	vec2 hash2d(vec2 p)
	{
		vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
	}

  // distort effect without chromatic aberration
  // void main() {
  //   vec2 uv = v_uv;
  //   float c = circle(uv, u_mouse, 0.0, 0.2);
  //   vec2 offset = vec2(c * u_velo); // ✅ fixed

  //   float r = texture2D(tDiffuse, uv + offset * 0.5).r;
  //   float g = texture2D(tDiffuse, uv + offset * 0.525).g;
  //   float b = texture2D(tDiffuse, uv + offset * 0.55).b;

  //   gl_FragColor = vec4(r, g, b, 1.0);
  // }

  void main()	{
    vec2 uv = v_uv;
    vec4 color = vec4(1., 0., 0., 1.);

    float c = circle(uv, u_mouse, 0.0, 0.2);
    float r = texture2D(tDiffuse, uv.xy += c * (u_velo * .5)).x;
    float g = texture2D(tDiffuse, uv.xy += c * (u_velo * .525)).y;
    float b = texture2D(tDiffuse, uv.xy += c * (u_velo * .55)).z;
    color = vec4(r, g, b, 1.);

    gl_FragColor = color;
  }
`;

const ImageCanvas = ({ imgSrc, altText, className }) => {
  const containerRef = useRef(null)

  const activeContainers = new Set()

  useEffect(() => {
    const updateContainer = (container) => {
      if (!container.uniforms) return
      if (container.composer) container.composer.render()
      if (container.isMouseInsideContainer) {
        container.cursors.time += 0.1
        updateSpeed(container)
        container.shaderPass.uniforms.u_time.value = container.cursors.time
        container.shaderPass.uniforms.u_mouse.value = container.cursors.followMouse
        container.shaderPass.uniforms.u_velo.value = Math.min(container.cursors.targetSpeed, 0.05)
        container.cursors.targetSpeed *= 0.999
      }
    }

    const updateSpeed = (container) => {
      if (!container.uniforms) return
      const dx = container.cursors.prevMouse.x - container.cursors.mouse.x
      const dy = container.cursors.prevMouse.y - container.cursors.mouse.y
      container.cursors.speed = Math.sqrt(dx * dx + dy * dy)
      container.cursors.targetSpeed -= 0.1 * (container.cursors.targetSpeed - container.cursors.speed)
      container.cursors.followMouse.x -= 0.1 * (container.cursors.followMouse.x - container.cursors.mouse.x)
      container.cursors.followMouse.y -= 0.1 * (container.cursors.followMouse.y - container.cursors.mouse.y)
      container.cursors.prevMouse.copy(container.cursors.mouse)
    }

    function animate() {
      requestAnimationFrame(animate)
      activeContainers.forEach((container) => {
        if (container.isInView) {
          updateContainer(container)
        }
      })
    }

    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    function initHoverEffect(container) {
      container.scene = null
      container.camera = null
      container.renderer = null
      container.uniforms = null
      container.composer = null
      container.renderPass = null
      container.shaderPass = null
      container.cursors = {
        mouse: new Vector2(0, 0),
        prevMouse: new Vector2(0, 0),
        followMouse: new Vector2(0, 0),
        speed: 0,
        targetSpeed: 0,
        time: 0,
      }
      container.isMouseInsideContainer = null

      activeContainers.add(container)

      const loader = new TextureLoader()
      loader.loadAsync(imgSrc)
        .then((texture) => {
        setupScene(texture)
        setupEventListeners()
      })

      const setupScene = (texture) => {
        container.scene = new Scene()
        container.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
        container.uniforms = {
          u_texture: { value: texture },
          u_resolution: { value: new Vector2(container.clientWidth, container.clientHeight) },
          u_aspect: { value: texture.image.width / texture.image.height },
        }

        const geometry = new PlaneGeometry(2, 2)
        const shaderMaterial = new ShaderMaterial({
          uniforms: container.uniforms,
          vertexShader: vertex,
          fragmentShader: fragment,
        })
        const mesh = new Mesh(geometry, shaderMaterial)
        container.scene.add(mesh)

        container.renderer = new WebGLRenderer({ antialias: true, alpha: true })
        container.renderer.setPixelRatio(1)
        container.renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(container.renderer.domElement)

        container.composer = new EffectComposer(container.renderer)
        container.renderPass = new RenderPass(container.scene, container.camera)
        container.composer.addPass(container.renderPass)

        container.shaderPass = new ShaderPass({
          uniforms: {
            tDiffuse: { value: null },
            u_resolution: { value: new Vector2(1, container.clientHeight / container.clientWidth) },
            u_mouse: { value: new Vector2(-10, -10) },
            u_velo: { value: 0 },
            u_time: { value: 0 },
            u_aspect: { value: texture.image.width / texture.image.height },
          },
          vertexShader: postVertex,
          fragmentShader: postFragment,
        })
        container.shaderPass.renderToScreen = true
        container.composer.addPass(container.shaderPass)
        container.renderer.render(container.scene, container.camera)

        // Resize Observer
        let resizeTimeout
        const resizeObserver = new ResizeObserver(
          () => {
            if (resizeTimeout) return
            resizeTimeout = setTimeout(() => {
              if (container.renderer) container.renderer.setSize(container.clientWidth, container.clientHeight)
              if (container.uniforms) container.uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight)
              resizeTimeout = null
            }, 200)
          }
        )
        resizeObserver.observe(container)
      }

      const setupEventListeners = () => {
        let mouseMoveTimeout = null

        const handleMouseMove = (event) => {
          if (!mouseMoveTimeout) {
            mouseMoveTimeout = setTimeout(() => {
              updateCursorState(event.clientX, event.clientY)
              mouseMoveTimeout = null
            }, 16) // ~60fps
          }
        }

        const updateCursorState = (x, y) => {
          const rect = container.getBoundingClientRect()
          const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
          if (container.isMouseInsideContainer !== inside) {
            container.isMouseInsideContainer = inside
          }
          if (inside) {
            container.cursors.mouse.x = (x - rect.left) / rect.width
            container.cursors.mouse.y = 1.0 - (y - rect.top) / rect.height
          }
        }

        document.addEventListener('mousemove', handleMouseMove, { passive: true })

        const intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, i) => {
              container.isInView = entry.isIntersecting
              if (!container.isInView) {
                console.log(`container ${i} is not in view`)
              }
            })
          },
          { threshold: 0.1 }
        )
        intersectionObserver.observe(container)
      }

    }

    initHoverEffect(containerRef.current)
  }, [])

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

const OldImageCanvas = ({ imgSrc, altText, className }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef()
  const composerRef = useRef()
  const customPassRef = useRef()
  const cameraRef = useRef()

  useEffect(() => {
    if (!containerRef.current) return

    let mouse = new Vector2(0, 0)
    let prevMouse = new Vector2(0, 0)
    let followMouse = new Vector2(0, 0)
    let speed = 0
    let targetSpeed = 0
    let time = 0

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    cameraRef.current = camera

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(1)
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    rendererRef.current = renderer

    const container = containerRef.current
    container.appendChild(renderer.domElement)
    container.style.opacity = '1'

    const texture = new TextureLoader().load(imgSrc)
    const mesh = new Mesh(
      new PlaneGeometry(2.4, 1.6),
      new MeshBasicMaterial({ map: texture })
    )
    scene.add(mesh)

    // Post-processing setup
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

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
    })
    customPass.renderToScreen = true
    composer.addPass(customPass)

    composerRef.current = composer
    customPassRef.current = customPass

    const handleMouseMove = (e) => {
      mouse.x = e.clientX / containerRef.current.clientWidth
      mouse.y = 1 - e.clientY / containerRef.current.clientHeight
    }

    const handleResize = () => {
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      customPass.uniforms.resolution.value.y = height / width
      // camera.updateProjectionMatrix()
    }

    const updateSpeed = () => {
      const dx = prevMouse.x - mouse.x
      const dy = prevMouse.y - mouse.y
      speed = Math.sqrt(dx * dx + dy * dy)
      targetSpeed -= 0.1 * (targetSpeed - speed)
      followMouse.x -= 0.1 * (followMouse.x - mouse.x)
      followMouse.y -= 0.1 * (followMouse.y - mouse.y)
      prevMouse.copy(mouse)
    }

    const animate = () => {
      time += 0.1
      updateSpeed()

      customPass.uniforms.time.value = time
      customPass.uniforms.uMouse.value = followMouse
      customPass.uniforms.uVelo.value = Math.min(targetSpeed, 0.05)
      targetSpeed *= 0.999

      composer.render()
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [imgSrc])

  return (
    <div ref={containerRef} className={`aberration-effect ${className}`}>
      <img src={imgSrc} alt={altText} />
    </div>
  )
}