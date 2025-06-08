'use client'
import { Canvas } from '@react-three/fiber'
import Model from './Model'

export default function ThreeCanvas() {
  return (
    <Canvas id="scene">
      <Model />
    </Canvas>
  )
}