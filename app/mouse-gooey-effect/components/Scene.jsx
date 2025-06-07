'use client'
import { useEffect, useRef, useState } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from '../glsl/vertexShader.glsl'
import fragmentShader from '../glsl/fragmentShader.glsl'

const perspective = 800

function FigureContent({ imageEl, mouse }) {
  const meshRef = useRef()

  const [image, hover] = useLoader(THREE.TextureLoader, [
    imageEl.src,
    imageEl.dataset.hover
  ])

  const { width, height, top, left } = imageEl.getBoundingClientRect()
  const sizes = new THREE.Vector2(width, height)
  const offset = new THREE.Vector2(
    left - window.innerWidth / 2 + width / 2,
    -top + window.innerHeight / 2 - height / 2
  )

  const uniforms = useRef({
    u_image: { value: image },
    u_imagehover: { value: hover },
    u_mouse: { value: mouse.current },
    u_time: { value: 0 },
    u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  })

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(offset.x, offset.y, 0)
      meshRef.current.scale.set(sizes.x, sizes.y, 1)
    }
  }, [])

  // useFrame(() => {
  //   uniforms.current.u_time.value += 0.01
  // })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        defines={{ PR: window.devicePixelRatio.toFixed(1) }}
      />
    </mesh>
  )
}
function Figure({ imageRef }) {
  const [imageEl, setImageEl] = useState(null)
  const mouse = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    if (imageRef.current) {
      setImageEl(imageRef.current)
      imageRef.current.style.opacity = '0'
    }

    const handleMouseMove = (e) => {
      gsap.to(mouse.current, {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!imageEl || !imageEl.src || !imageEl.dataset.hover) return null

  return <FigureContent imageEl={imageEl} mouse={mouse} />
}

export default function Scene() {
  const imageRef = useRef()
  return (
    <>
      <section className="container">
        <article className="tile">
          <figure className="tile__figure">
            <img
              ref={imageRef}
              src="/images/images/base.jpg"
              data-hover="/images/images/hover.jpg"
              alt=""
              className="tile__image"
            />
          </figure>
        </article>
      </section>
      <Canvas
        shadows
        gl={{ alpha: true }}
        camera={{ position: [0, 0, perspective] }}
        style={{ width: '100vw', height: '100vh'}}
      >
        <PerspectiveCamera
          position={[0, 0, perspective]}
          fov={(180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI}
          near={1}
          far={1000}
          />
        <ambientLight color={0xffffff} intensity={2} />
        <Figure imageRef={imageRef} />
      </Canvas>
    </>
  )
}