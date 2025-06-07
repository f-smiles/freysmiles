'use client'
import { Canvas } from '@react-three/fiber'
import SceneContent from './SceneContent'

export default function Scene() {
  const perspective = 800
  return (
    <>
      <section className="container">
        <article className="tile">
          <figure className="tile__figure">
            <img
              src="/images/images/base.jpg"
              data-hover="/images/images/hover.jpg"
              alt=""
              className="tile__image"
            />
          </figure>
        </article>
      </section>
      <Canvas
        gl={{ alpha: true }}
        camera={{
          fov: (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI,
          aspect: window.innerWidth / window.innerHeight,
          near: 1,
          far: 1000,
          position: [0, 0, perspective]
        }}
      >
        <ambientLight color={0xffffff} intensity={2} />
        <SceneContent />
      </Canvas>
    </>
  )
}

export function OldOldScene() {
  return (
    <>
      <section className="container">
        <article className="tile">
          <figure className="tile__figure">
            <img
              src="/images/images/base.jpg"
              data-hover="/images/images/hover.jpg"
              alt=""
              className="tile__image"
            />
          </figure>
        </article>
      </section>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <SceneContent />
      </Canvas>
    </>
  )
}

export function OldScene() {
  const perspective = 800

  return (
    <>
    <section className="container">
      <article className="tile">
        <figure className="tile__figure">
          <img
            src="/images/images/base.jpg"
            data-hover="/images/images/hover.jpg"
            className="tile__image"
            alt="My image"
            width="300"
          />
        </figure>
      </article>
    </section>

    <Canvas
      id="stage"
      camera={{
        fov: (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI,
        position: [0, 0, perspective],
        near: 1,
        far: 1000
      }}
      gl={{ alpha: true }}
      >
      <ambientLight color={0xffffff} intensity={2} />
      <SceneContent />
    </Canvas>
    </>
  )
}