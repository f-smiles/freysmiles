'use client'
import React, { useEffect, useRef } from 'react'
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import postVertex from '../shaders/postVertex.glsl'
import postFragment from '../shaders/postFragment.glsl'

const items = [
  {
    imgSrc: "/images/test/1.jpg",
    altText: "test image 1",
  },
  {
    imgSrc: "/images/test/2.jpg",
    altText: "test image 2",
  },
  {
    imgSrc: "/images/test/3.jpg",
    altText: "test image 3",
  },
]

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

export default function Container() {
  return (
    <div className="">
      {items.map((item, i) => (
        <div key={item.heading} className={`item-${i + 1}-container`}>
          <ImageCanvas className={`item-${i + 1}`} imgSrc={item.imgSrc} altText={item.altText} />
        </div>
      ))}
    </div>
  )
}
