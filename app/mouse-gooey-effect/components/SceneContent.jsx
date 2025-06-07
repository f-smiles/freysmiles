'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import gsap from 'gsap'


export default function SceneContent() {
  // const [textures, setTextures] = useState<{ image: THREE.Texture; hover: THREE.Texture } | null>(null)
  const meshRef = useRef()
  const [texture, setTexture] = useState({ imgSrc: '', hoverSrc: '' })
  const mouse = useRef(new THREE.Vector2(0, 0))
  const time = useRef(0)
  const { size, viewport } = useThree()

  const uniforms = useMemo(() => {
    return {
      u_image: { value: null },
      u_imagehover: { value: null },
      u_mouse: { value: mouse.current },
      u_time: { value: time.current },
      u_res: { value: new THREE.Vector2(size.width, size.height) },
    }
  }, [size])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      {/* <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        defines={{ PR: window.devicePixelRatio.toFixed(1) }}
        transparent
      /> */}
    </mesh>
    // <>
      // {/* <OrbitControls /> */}
      // {/* <DisplamentImage /> */}
      // {/* <Image /> */}
    // </>
  )
}

const ImageGooeyMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined
  },
  /*glsl*/`
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  /*glsl*/`
  varying vec2 vUv;
  uniform sampler2D tex;
  uniform sampler2D tex2;
  uniform sampler2D disp;
  uniform float _rot;
  uniform float dispFactor;
  uniform float effectFactor;
  void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r*effectFactor));
      vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - dispFactor) * (disp.r*effectFactor));
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <encodings_fragment>
  }`
)
extend({ ImageGooeyMaterial })

export const DisplamentImage = (props) => {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const [texture1, texture2, displacementTexture] = useTexture([
    "/images/textures/portrait2.jpg",
    "/images/textures/full_body2.jpg",
    "/images/textures/displacement/11.jpg"
  ])
  useFrame(() => {
    ref.current.dispFactor = THREE.MathUtils.lerp(ref.current.dispFactor, hovered ? 1 : 0, 0.055)
  })
  return (
    <mesh {...props} onPointerOver={(e) => setHover(true)} onPointerOut={(e) => setHover(false)}>
      <planeGeometry args={[2.25, 4]} />
      <imageGooeyMaterial ref={ref} texture1={texture1} texture2={texture2} displacementTexture={displacementTexture} />
    </mesh>
  )
}



export function OldSceneContent() {
  const meshRef = useRef()
  const mouse = useRef(new THREE.Vector2(0, 0))
  const { viewport, size, gl, scene } = useThree()

  const imageElement = document.querySelector('.tile__image')
  const imageSrc = imageElement?.src
  const hoverSrc = imageElement?.dataset.hover

  const [image, hover] = useTexture([imageSrc, hoverSrc])

  const uniforms = useMemo(() => ({
    u_image: { value: image },
    u_imagehover: { value: hover },
    u_mouse: { value: mouse.current },
    u_time: { value: 0 },
    u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), [image, hover])

  useEffect(() => {
    if (imageElement) imageElement.style.opacity = 0
  }, [])

  // const [offset, sizes] = useMemo(() => {
  //   if (!imageElement) return [new THREE.Vector2(), new THREE.Vector2()]
  //   const { width, height, top, left } = imageElement.getBoundingClientRect()
  //   const sizeVector = new THREE.Vector2(width, height)
  //   const offsetVector = new THREE.Vector2(
  //     left - window.innerWidth / 2 + width / 2,
  //     -top + window.innerHeight / 2 - height / 2
  //   )
  //   return [offsetVector, sizeVector]
  // }, [imageElement])

  const [meshTransform, setMeshTransform] = useState({
    offset: new THREE.Vector2(),
    size: new THREE.Vector2(),
  })

  useEffect(() => {
    const updateTransform = () => {
      if (!imageElement) return
      const { width, height, top, left } = imageElement.getBoundingClientRect()
      const offsetVector = new THREE.Vector2(
        left - window.innerWidth / 2 + width / 2,
        -top + window.innerHeight / 2 - height / 2
      )
      const sizeVector = new THREE.Vector2(width, height)

      setMeshTransform({ offset: offsetVector, size: sizeVector })
    }
    updateTransform()
    window.addEventListener('resize', updateTransform)

    return () => window.removeEventListener('resize', updateTransform)
  }, [imageElement])

  useEffect(() => {
    const handleMouseMove = (event) => {
      gsap.to(mouse.current, {
        duration: 0.5,
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        overwrite: true,
      })
    }
    const handleResize = () => uniforms.u_res.value.set(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // animates outline of shader mask
  // useFrame(() => uniforms.u_time.value += 0.01)

  return (
    <mesh
      ref={meshRef}
      position={[meshTransform.offset.x, meshTransform.offset.y, 0 ]}
      scale={[meshTransform.size.x, meshTransform.size.y, 1]}
      // position={[offset.x, offset.y, 0]}
      // scale={[sizes.x, sizes.y, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        defines={{ PR: window.devicePixelRatio.toFixed(1) }}
      />
    </mesh>
  )
}

const vertexShader = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix *
    vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec2 u_mouse;
  uniform vec2 u_res;

  uniform sampler2D u_image;
  uniform sampler2D u_imagehover;

  uniform float u_time;
  varying vec2 v_uv;

  float circle(in vec2 _st, in float _radius, in float blurriness){
    vec2 dist = _st;
    return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
  }

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise3(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    // We manage the device ratio by passing PR constant
    vec2 res = u_res * PR;
    vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
    // tip: use the following formula to keep the good ratio of your coordinates
    st.y *= u_res.y / u_res.x;

    // We readjust the mouse coordinates
    vec2 mouse = u_mouse * -0.5;

    vec2 circlePos = st + mouse;
    float c = circle(circlePos, 0.15, 2.) * 2.5;

    float offx = v_uv.x + sin(v_uv.y + u_time * .1);
    float offy = v_uv.y - u_time * 0.1 - cos(u_time * .001) * .01;

    float n = snoise3(vec3(offx, offy, u_time * .1) * 8.) - 1.;
    float finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.));

    vec4 image = texture2D(u_image, v_uv);
    vec4 hover = texture2D(u_imagehover, v_uv);

    vec4 finalImage = mix(image, hover, finalMask);
    gl_FragColor = finalImage;
  }
`