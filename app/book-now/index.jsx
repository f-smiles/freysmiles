"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CopyButton } from "@/components/ui/shadcn-io/copy-button";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(SplitText);

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define S(a,b,t) smoothstep(a,b,t)
  precision mediump float;

  uniform float iTime;
  uniform vec3 iResolution;
  varying vec2 vUv;

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }
  // Created by inigo quilez - iq/2014
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
  }

  float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                        dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    return 0.5 + 0.5*n;
  }

  void main() {
    // Convert to fragCoord like Shadertoy
    vec2 fragCoord = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
    vec2 uv = fragCoord / iResolution.xy;
    float ratio = iResolution.x / iResolution.y;
    vec2 tuv = uv;
    tuv -= .5;
    // rotate with Noise
    float degree = noise(vec2(iTime*.1, tuv.x*tuv.y));
    tuv.y *= 1./ratio;
    tuv *= Rot(radians((degree-.5)*720.+75.));
    tuv.y *= ratio;
    
    // Wave warp with sin
    float frequency = 2.;
    float amplitude = 30.;
    float speed = iTime * 4.;
    tuv.x += sin(tuv.y*frequency+speed)/amplitude;
    tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
    
    
    // draw the image
    // Your 6 exact Frey gradient hex colors (adapted to the shader's color slots)
    vec3 colorWhite = vec3(0.9137, 0.8627, 0.8039); // #e9dccd (TOP, assigned to white)
    vec3 colorRed = vec3(0.9098, 0.7569, 0.6863); // #e8c1b0 (assigned to red)
    vec3 colorPurple = vec3(0.7686, 0.7216, 0.7882); // #c4b8c9 (assigned to purple)
    vec3 colorGreen = vec3(0.7176, 0.7490, 0.8471); // #b7bfd8 (assigned to green)
    vec3 colorBlue = vec3(0.6824, 0.7490, 0.8549); // #aebfda (BOTTOM, assigned to blue)
    vec3 colorYellow = vec3(0.8509, 0.7176, 0.7137); // #d9b7b6 (assigned to yellow)
    
    vec3 layer1 = mix(colorRed, colorYellow, S(-.6, .2, (tuv*Rot(radians(-5.))).x));
    layer1 = mix(layer1, colorWhite, S(-.6, .2, (tuv*Rot(radians(-5.))).x));
    layer1 = mix(layer1, colorPurple, S(-.2, .6, (tuv*Rot(radians(-5.))).x));
    
    vec3 layer2 = mix(colorRed, colorYellow, S(-.8, .2, (tuv*Rot(radians(-5.))).x));
    layer2 = mix(layer2, colorGreen, S(-.1, .9, (tuv*Rot(radians(-5.))).x));
    layer2 = mix(layer2, colorBlue, S(-.5, .5, (tuv*Rot(radians(-5.))).x));
    
    vec3 finalComp = mix(layer1, layer2, S(.7, -.5, tuv.y));
    
    vec3 col = finalComp;
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderBackground() {
  const materialRef = useRef();
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    materialRef.current.uniforms.iResolution.value.set(size.width, size.height, 1);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() }
        }}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

export default function BookNow() {
  const containerOneRef = useRef(null);
  const h1Ref = useRef(null);
  const telephone = "610-437-4748";
  const email = "info@freysmiles.com";
  
  useEffect(() => {
    if (!h1Ref.current) return;
    
    const split = SplitText.create(h1Ref.current, { types: "chars" });
    const chars = split.chars;
    
    gsap.set(chars, {
      y: 100,
      rotation: 2,    
      opacity: 0,
      force3D: true
    });

    gsap.to(chars, {
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1,    
      ease: "power3.inOut",
      stagger: 0.1,   
    });

    return () => split.revert();
  }, []);

  return (
    <div className="flex flex-col w-full md:flex-row">
      <section className="relative z-10 w-full h-[100dvh] flex flex-col items-center justify-center text-white p-8 overflow-hidden">

        <div className="absolute inset-0 -z-10">
          <Canvas
            orthographic
            camera={{ zoom: 1, position: [0, 0, 1] }}
            className="w-full h-full"
          >
            <ShaderBackground />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute w-[400px] h-[400px] border border-white/35 rounded-full top-[100px] right-10" />
          <div className="absolute w-[450px] h-[450px] border border-white/30 rounded-full bottom-[60px] left-0" />
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
          <div className="circle-loader relative">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`circle circle-${i}`} />
            ))}
          </div>
        </div>

        <div ref={containerOneRef} className="z-10 absolute top-1/2 -translate-y-1/2 overflow-hidden">
          <h1 ref={h1Ref} className="lowercase text-[32px] font-seaword text-center lg:text-[34px]">Website Coming Soon</h1>
          <Link href="#acuity-calendar" className="mt-[14px] flex flex-col items-center justify-center text-center font-seaword lowercase text-[16px] md:hidden">
            Book Now
            <ChevronDown className="animate-bounce size-5" />
          </Link>
        </div>

        <div className="absolute top-[80%] right-8 -translate-y-1/2 font-neuehaas35 text-[14px] text-left leading-relaxed z-10 lg:text-[16px]">
          <div className="flex flex-col gap-3 items-start">
            <div className="flex items-center justify-between rounded-full border border-zinc-50/50 pr-1">
              <input 
                value={telephone}
                readOnly 
                className="flex-1 px-3 py-2 bg-transparent font-neuehaas45 tracking-wider text-zinc-50"
              />
              <CopyButton
                content={telephone}
                onCopy={() => console.log("Number copied!")}
                className="rounded-full bg-zinc-50/50 text-zinc-950/50 hover:bg-zinc-50/100"
              />
            </div>
            <div className="flex items-center justify-between rounded-full border border-zinc-50/50/50 pr-1">
              <input 
                value={email} 
                readOnly 
                className="flex-1 px-3 py-2 bg-transparent font-neuehaas45 tracking-wider text-zinc-50"
              />
              <CopyButton
                content={email}
                onCopy={() => console.log("Email copied!")}
                className="rounded-full bg-zinc-50/50 text-zinc-950/50 hover:bg-zinc-50/100"
              />
            </div>
          </div>
        </div>
      </section>

      <div id="acuity-calendar" className="acuity-font w-full h-[100dvh] flex items-center justify-center bg-white">
        <iframe
          src={process.env.NEXT_PUBLIC_ACUITY_SCHEDULING_SRC}
          title="Schedule Appointment"
          width="100%"
          height="100%"
          frameBorder="0"
          allow="payment"
          className="border-0"
        ></iframe>
      </div>
    </div>
  );
}