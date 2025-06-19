'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { TextureLoader, Vector2 } from 'three'
import gsap from 'gsap'

const items = [
  {
    src: '/images/members/edit/adriana-blurry-distortion-effect-1920px-1.jpg',
    hoverSrc: '/images/members/orig/adriana.png',
    role: 'Insurance Coordinator',
    name: 'Adriana',
  },
  {
    src: '/images/members/edit/alyssa-blurry-distortion-effect.jpg',
    hoverSrc: '/images/members/orig/alyssa.png',
    role: 'Treatment Coordinator',
    name: 'Alyssa',
  },
  {
    src: '/images/members/edit/elizabeth-blurry-distortion-effect-1.jpg',
    hoverSrc: '/images/members/orig/elizabeth.png',
    role: 'Patient Services',
    name: 'Elizabeth',
  },
  {
    src: '/images/members/edit/lexi-blurry-distortion-effect.jpg',
    hoverSrc: '/images/members/orig/lexi.png',
    role: 'Treatment Coordinator',
    name: 'Lexi',
  },
  {
    src: '/images/members/edit/nicole-blurry-distortion-effect.jpg',
    hoverSrc: '/images/members/orig/nicolle.png',
    role: 'Specialized Orthodontic Assistant',
    name: 'Nicole',
  },
]

const vertexShader = `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

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
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);


    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 =   v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);


    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;


    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float aspect = u_res.x / u_res.y;
    vec2 st = v_uv - vec2(0.5);
    st.x *= aspect;

    // get mouse position in same coordinate space
    vec2 mouse = u_mouse * vec2(aspect, 1.0);

    //circle's position relative to mouse
    vec2 circlePos = st - mouse;

    float c = circle(circlePos, 0.3, 2.0) * 2.5;
    float offx = v_uv.x + sin(v_uv.y + u_time * 0.1);
    float offy = v_uv.y - u_time * 0.1 - cos(u_time * 0.001) * 0.01;
    float n = snoise3(vec3(offx, offy, u_time * 0.1) * 8.0) - 1.0;
    float finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.0));
    vec4 image = texture2D(u_image, v_uv);
    vec4 hover = texture2D(u_imagehover, v_uv);
    vec4 finalImage = mix(image, hover, finalMask);
    gl_FragColor = finalImage;
  }
`;

const HoverReveal = ({ imgSrc, hoverSrc, container }) => {
  const meshRef = useRef(null)
  const mouse = useRef(new Vector2())

  const [hover, setHover] = useState(false)

  const { size } = useThree()

  const uniforms = useMemo(() => (
    {
      u_image: { value: null },
      u_imagehover: { value: null },
      u_mouse: { value: mouse.current },
      u_time: { value: 0 },
      u_res: { value: new Vector2(size.width, size.height) },
    }
  ), [size])

  useEffect(() => {
    if (!imgSrc || !hoverSrc) return

    const loader = new TextureLoader()
    loader.load(imgSrc, (texture) => {
      uniforms.u_image.value = texture
    })
    loader.load(hoverSrc, (texture) => {
      uniforms.u_imagehover.value = texture
    })
  }, [imgSrc, hoverSrc, uniforms])

  useFrame(() => {
    if (!imgSrc || !hoverSrc) return
    uniforms.u_time.value += 0.01
  })

  return (
    <mesh ref={meshRef} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <planeGeometry args={[container.current.offsetWidth / 100 ?? 2, container.current.offsetHeight / 100 ?? 2, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        defines={{ PR: window.devicePixelRatio.toFixed(1) }}
        transparent
      />
    </mesh>
  )
}

export default function GridContainer() {
  const containerRef = useRef(null)
  return (
    <div className='grid-container'>
      {items.map((item, i) => (
        <div key={item.src} className={`item-${i + 1}-container`}>
          <div className={`inversion-lens item-${i + 1}`}>
            <img src={item.src} data-hover={item.hoverSrc} alt="" />
            {/* canvas */}
            <div ref={containerRef} className="canvas-container">
              <Canvas gl={{ alpha: true }}>
                <ambientLight intensity={1} />
                <directionalLight position={[0, 0, 5]} />
                <HoverReveal imgSrc={item.src} hoverSrc={item.hoverSrc} container={containerRef} />
              </Canvas>
            </div>
          </div>
          <div className="member-info text-primary-foreground dark:text-primary">
            <div className="member-role">{item.role}</div>
            <div className="member-name">{item.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
