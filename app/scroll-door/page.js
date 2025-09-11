'use client'
import './css/style.css'
import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls, ScrollControls, useAnimations, useGLTF, useScroll } from '@react-three/drei'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

function DoorScene({ ...props }) {
  const scroll = useScroll()
  const { scene, nodes, animations } = useGLTF('/models/openingclosingdoor3d.glb')
  const { actions } = useAnimations(animations, scene)
  useLayoutEffect(() => Object.values(nodes).forEach((node) => (node.receiveShadow = node.castShadow = true)))
  useEffect(() => void (actions['Action'].play().paused = true), [actions])
  useFrame((state, delta) => {
    const action = actions['Action']
    const offset = scroll.offset
    action.time = THREE.MathUtils.damp(action.time, (action.getClip().duration / 2) * offset, 100, delta)
  })

  return <primitive object={scene} {...props} />
}

const DoorCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 800] }}>
      <Suspense fallback={null}>
        <ScrollControls pages={3}>
          <DoorScene scale={200} position={[0, 0, 0]} />
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}

const OceanScene = () => {
  const { scene, gl, camera } = useThree();
  const waterRef = useRef();
  const meshRef = useRef();

  useEffect(() => {
    camera.position.set(-10, 5, 30); //-x moves the right part of door back positive moves it forward
    camera.lookAt(0, -5, 0);
  }, [camera]);

  useEffect(() => {
    const waterNormals = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/waternormals.jpg"
    );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterRef.current = water;


    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const sun = new THREE.Vector3();

    const updateSun = () => {
      const theta = Math.PI * (0.49 - 0.5);
      const phi = 2 * Math.PI * (0.205 - 0.5);

      sun.x = Math.cos(phi);
      sun.y = Math.sin(phi) * Math.sin(theta);
      sun.z = Math.sin(phi) * Math.cos(theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();
      scene.environment = pmremGenerator.fromScene(sky).texture;
    };

    updateSun();

    return () => {
      scene.remove(water);
      scene.remove(sky);
    };
  }, [scene, gl]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time) * 20 + 5;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.z = time * 0.51;
    }

    if (waterRef.current) {
      waterRef.current.material.uniforms["time"].value += 1.0 / 60.0;
    }
  });

  return (
    <>
      <OrbitControls
        maxPolarAngle={Math.PI * 0.495}
        target={[0, 10, 0]}
        minDistance={30.0}
        maxDistance={30.0}
      />
      <mesh ref={meshRef} position={[0, 10, 0]}>
        <meshStandardMaterial roughness={0} color="white" />
      </mesh>
    </>
  )
}

extend({ Water, Sky })

const OceanCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 800] }}>
      <Suspense fallback={null}>
        <ScrollControls pages={3}>
          <OceanScene scale={1} position={[0, 2.5, 0]} />
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}

export default function Page() {
  return (
    <div className="relative w-screen h-screen">
      <div className='absolute top-0 left-0 w-full h-full'>
        <OceanCanvas />
      </div>
      <DoorCanvas />
    </div>
  )
}