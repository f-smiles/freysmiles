import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MeshMatcapMaterial, AnimationMixer, TextureLoader } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
gsap.registerPlugin(ScrollTrigger);


function DoorModel() {
    const { scene, animations } = useGLTF("/models/animated_industrial_door.glb");
    const mixer = useRef(null);
    const action = useRef(null);
    const animationProgress = useRef(0); 
 
    useEffect(() => {
        const textureLoader = new TextureLoader();
        const matcapTexture = textureLoader.load(
            "../images/matcap-green-yellow-pink.png", 
        );
    
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material.map = null; 
                child.material = new MeshMatcapMaterial({ matcap: matcapTexture });
                child.material.needsUpdate = true;
            }
        });
    }, [scene]);
    
    useEffect(() => {
        if (animations.length > 0) {
            mixer.current = new AnimationMixer(scene);
    
            // Select the correct animation
            const clip = animations.find(anim => anim.name === "DoorOpening") || animations[3];
    
            if (!clip) {
                console.warn("No matching door animation found!");
                return;
            }
    
            console.log("Using Animation:", clip.name); // Debugging
    
            action.current = mixer.current.clipAction(clip);
            action.current.clampWhenFinished = true;
            action.current.setLoop(THREE.LoopOnce);
            action.current.paused = true; // ✅ Prevent auto-playing
            action.current.time = 0; // ✅ Ensure it starts from the beginning
            action.current.play(); // ✅ Play it, but manually control the progress
    
            // GSAP ScrollTrigger: Sync animation progress with scroll
            gsap.to(action.current, {
                time: clip.duration, // ✅ Animate from time 0 to full duration
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top 10%", // Adjust this if needed
                    end: "top -50%",
                    scrub: 2
                }
            });
        }
    }, [scene, animations]);
    
    useFrame((state, delta) => {
        mixer.current?.update(delta); 
    });

    return <primitive object={scene} position={[0, -1, 0]} scale={2} />;
}

export default function DoorScene() {
    return (
        <Canvas camera={{ position: [0, 5, 20], fov: 50 }}>

        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        

        <pointLight position={[0, 5, 10]} intensity={5} />
        <spotLight position={[0, 10, 10]} angle={0.3} intensity={3} />

        <DoorModel />
        <OrbitControls />
    </Canvas>
    );
}
