import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue;
uniform float uRotation;
uniform float uSegments;
uniform float uOverlayOpacity;

void main() {
    float canvasAspect = resolution.x / resolution.y;
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); 


    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }


    vec2 rotatedUV = vec2(
        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,
        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5
    );

    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);
    float amplitude = 0.015; // The amplitude of the sine wave
    rotatedUV.x += amplitude * sin(sliceProgress * 3.14159265 * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));

    vec2 finalUV = vec2(
        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,
        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5
    );

vec2 clampedUV = clamp(finalUV, 0.0, 1.0);
vec4 color = texture2D(uTexture, clampedUV);


    if (uOverlayOpacity > 0.0) {
        // Apply overlays with the specified opacity
        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);
        color.rgb *= (1.0 - blackOverlayAlpha);

        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);
        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);
    }

    gl_FragColor = color;
}
`;

const FlutedGlassEffect = ({
  imageUrl,
  mode = "static",
  motionFactor = -50,
  rotationAngle = 0,
  segments = 80,
  overlayOpacity = 0,
  style = {},
  className = ""
}) => {
  const containerRef = useRef(null);
  const [imageAspect, setImageAspect] = useState(1);
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const scene = useRef(new THREE.Scene());
  const camera = useRef(null);
  const renderer = useRef(null);
  const material = useRef(null);
  const plane = useRef(null);
  const animationId = useRef(null);
  const texture = useRef(null);


  const init = () => {
    const container = containerRef.current;
    
    const position = window.getComputedStyle(container).position;
    if (!['relative', 'absolute', 'fixed', 'sticky'].includes(position)) {
      container.style.position = 'relative';
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight;


    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.current.setSize(width, height);
    renderer.current.setClearColor(0xeeeeee, 1);
    

    const rendererElement = renderer.current.domElement;
    rendererElement.style.position = 'absolute';
    rendererElement.style.top = '0';
    rendererElement.style.left = '0';
    container.appendChild(rendererElement);


    const frustumSize = 1;
    camera.current = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    camera.current.position.set(0, 0, 2);


    const img = new Image();
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight;
      setImageAspect(aspect);
      texture.current = new THREE.Texture(img);
      texture.current.needsUpdate = true;
      
      if (material.current) {
        material.current.uniforms.uTexture.value = texture.current;
        material.current.uniforms.uImageAspect.value = aspect;
      }
    };
    img.src = imageUrl;

    material.current = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        resolution: { value: new THREE.Vector4(width, height, 1, 1) },
        uTexture: { value: null },
        uMotionValue: { value: 0.5 },
        uRotation: { value: rotationAngle },
        uSegments: { value: segments },
        uOverlayColor: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        uOverlayColorWhite: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        uImageAspect: { value: imageAspect },
        uOverlayOpacity: { value: overlayOpacity }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });


    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    plane.current = new THREE.Mesh(geometry, material.current);
    scene.current.add(plane.current);


    animate();
  };

  const animate = () => {
    animationId.current = requestAnimationFrame(animate);
    renderer.current.render(scene.current, camera.current);
  };

  const handleResize = () => {
    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    if (renderer.current) {
      renderer.current.setSize(width, height);
    }

    if (camera.current) {
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    }

    if (material.current) {
      material.current.uniforms.resolution.value.x = width;
      material.current.uniforms.resolution.value.y = height;
    }
  };


  const handleMouseMove = (event) => {
    if (mode !== 'mouse' || !material.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    mouse.current.x = x;
    material.current.uniforms.uMotionValue.value = 0.5 + x * motionFactor * 0.1;
    
    mouse.current.y = 1.0 - event.clientY / window.innerHeight;
    material.current.uniforms.uMotionValue.value = 0.5 + mouse.current.x * motionFactor * 0.1;
  };

  // Handle scroll
  const handleScroll = () => {
    if (mode !== 'scroll' || !material.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;


    const isInViewport = elemTop < window.innerHeight && elemBottom >= 0;

    if (isInViewport) {
      const totalHeight = window.innerHeight + container.offsetHeight;
      const scrolled = window.innerHeight - elemTop;
      const progress = scrolled / totalHeight;
      const maxMovement = 0.2;
      material.current.uniforms.uMotionValue.value = progress * maxMovement * motionFactor;
    }
  };


  useEffect(() => {
    const container = containerRef.current;
    
    if (mode === 'mouse') {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    if (mode === 'scroll') {
      window.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (mode === 'mouse') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (mode === 'scroll') {
        window.removeEventListener('scroll', handleScroll);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      
      if (renderer.current && container.contains(renderer.current.domElement)) {
        container.removeChild(renderer.current.domElement);
      }
    };
  }, [mode]);


  useEffect(() => {
    init();
  }, []);


  useEffect(() => {
    if (material.current) {
      material.current.uniforms.uRotation.value = rotationAngle;
      material.current.uniforms.uSegments.value = segments;
      material.current.uniforms.uOverlayOpacity.value = overlayOpacity;
    }
  }, [rotationAngle, segments, overlayOpacity]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
};

export default FlutedGlassEffect;
