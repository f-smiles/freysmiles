'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';


const config = {
  maskRadius: 0.35,
  maskSpeed: 0.75,
  animationSpeed: 1.0,
  appearDuration: 0.4,
  disappearDuration: 0.3,
  turbulenceIntensity: 0.225,
  frameSkip: 0,
  effectType: 0,
  effectIntensity: 0.5,
  invertMask: false,
  duotoneColor1: [51, 102, 204],
  duotoneColor2: [230, 51, 51]
};


const vertexShader = `
  varying vec2 v_uv;
  
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_radius;
  uniform float u_speed;
  uniform float u_imageAspect;
  uniform float u_turbulenceIntensity;
  uniform int u_effectType;
  uniform vec3 u_effectColor1;
  uniform vec3 u_effectColor2;
  uniform float u_effectIntensity;
  uniform bool u_invertMask;

  varying vec2 v_uv;

  // Improved hash function for better randomness
  vec3 hash33(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zxy, p.yxz + 19.27);
    return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z));
  }

  // 2D hash function
  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract(vec2((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y));
  }

  // Simplex noise - smoother than Perlin, better for organic patterns
  float simplex_noise(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    
    // Determine which simplex we're in and the coordinates
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K2 * 2.0);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);
    
    // Calculate gradients and dot products
    vec3 x0 = d0;
    vec3 x1 = d1;
    vec3 x2 = d2;
    vec3 x3 = d3;
    
    vec4 h = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(x0, hash33(i) * 2.0 - 1.0),
      dot(x1, hash33(i + i1) * 2.0 - 1.0),
      dot(x2, hash33(i + i2) * 2.0 - 1.0),
      dot(x3, hash33(i + 1.0) * 2.0 - 1.0)
    );
    
    // Sum the contributions
    return 0.5 + 0.5 * 31.0 * dot(n, vec4(1.0));
  }

  // Curl noise for more fluid motion
  vec2 curl(vec2 p, float time) {
    const float epsilon = 0.001;
    
    float n1 = simplex_noise(vec3(p.x, p.y + epsilon, time));
    float n2 = simplex_noise(vec3(p.x, p.y - epsilon, time));
    float n3 = simplex_noise(vec3(p.x + epsilon, p.y, time));
    float n4 = simplex_noise(vec3(p.x - epsilon, p.y, time));
    
    float x = (n2 - n1) / (2.0 * epsilon);
    float y = (n4 - n3) / (2.0 * epsilon);
    
    return vec2(x, y);
  }

  // Improved ink marbling function for more organic and fluid patterns
  float inkMarbling(vec2 p, float time, float intensity) {
    // Create multiple layers of fluid motion
    float result = 0.0;
    
    // Base layer - large fluid movements
    vec2 flow = curl(p * 1.5, time * 0.1) * intensity * 2.0;
    vec2 p1 = p + flow * 0.3;
    result += simplex_noise(vec3(p1 * 2.0, time * 0.15)) * 0.5;
    
    // Medium details - swirls and eddies
    vec2 flow2 = curl(p * 3.0 + vec2(sin(time * 0.2), cos(time * 0.15)), time * 0.2) * intensity;
    vec2 p2 = p + flow2 * 0.2;
    result += simplex_noise(vec3(p2 * 4.0, time * 0.25)) * 0.3;
    
    // Fine details - small ripples and textures
    vec2 flow3 = curl(p * 6.0 + vec2(cos(time * 0.3), sin(time * 0.25)), time * 0.3) * intensity * 0.5;
    vec2 p3 = p + flow3 * 0.1;
    result += simplex_noise(vec3(p3 * 8.0, time * 0.4)) * 0.2;
    
    // Add some spiral patterns for more interesting visuals
    float dist = length(p - vec2(0.5));
    float angle = atan(p.y - 0.5, p.x - 0.5);
    float spiral = sin(dist * 15.0 - angle * 2.0 + time * 0.3) * 0.5 + 0.5;
    
    // Blend everything together
    result = mix(result, spiral, 0.3);
    
    // Normalize to 0-1 range
    result = result * 0.5 + 0.5;
    
    return result;
  }

  // Apply sepia effect
  vec3 applySepia(vec3 color) {
    float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
    float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
    float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
    return vec3(r, g, b);
  }

  // Apply duotone effect
  vec3 applyDuotone(vec3 color, vec3 color1, vec3 color2) {
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color1, color2, gray);
  }

  // Apply pixelate effect
  vec3 applyPixelate(sampler2D tex, vec2 uv, float pixelSize) {
    float dx = pixelSize * (1.0 / u_resolution.x);
    float dy = pixelSize * (1.0 / u_resolution.y);
    vec2 pixelatedUV = vec2(dx * floor(uv.x / dx), dy * floor(uv.y / dy));
    return texture2D(tex, pixelatedUV).rgb;
  }

  // Apply blur effect
  vec3 applyBlur(sampler2D tex, vec2 uv, float blurAmount) {
    float dx = blurAmount * (1.0 / u_resolution.x);
    float dy = blurAmount * (1.0 / u_resolution.y);
    
    vec3 sum = vec3(0.0);
    sum += texture2D(tex, uv + vec2(-dx, -dy)).rgb * 0.0625;
    sum += texture2D(tex, uv + vec2(0.0, -dy)).rgb * 0.125;
    sum += texture2D(tex, uv + vec2(dx, -dy)).rgb * 0.0625;
    sum += texture2D(tex, uv + vec2(-dx, 0.0)).rgb * 0.125;
    sum += texture2D(tex, uv).rgb * 0.25;
    sum += texture2D(tex, uv + vec2(dx, 0.0)).rgb * 0.125;
    sum += texture2D(tex, uv + vec2(-dx, dy)).rgb * 0.0625;
    sum += texture2D(tex, uv + vec2(0.0, dy)).rgb * 0.125;
    sum += texture2D(tex, uv + vec2(dx, dy)).rgb * 0.0625;
    
    return sum;
  }

  void main() {
    vec2 uv = v_uv;
    float screenAspect = u_resolution.x / u_resolution.y;
    float ratio = u_imageAspect / screenAspect;

    vec2 texCoord = vec2(
      mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x),
      uv.y
    );

    vec4 tex = texture2D(u_texture, texCoord);
    vec3 originalColor = tex.rgb;
    vec3 effectColor = originalColor;
    
    // Apply base effect based on effect type
    if (u_effectType == 1) {
      // Black and white
      float gray = dot(originalColor, vec3(0.299, 0.587, 0.114));
      effectColor = vec3(gray);
    } 
    else if (u_effectType == 2) {
      // Sepia
      effectColor = applySepia(originalColor);
    }
    else if (u_effectType == 3) {
      // Duotone
      effectColor = applyDuotone(originalColor, u_effectColor1, u_effectColor2);
    }
    else if (u_effectType == 4) {
      // Pixelate
      effectColor = applyPixelate(u_texture, texCoord, u_effectIntensity * 20.0);
    }
    else if (u_effectType == 5) {
      // Blur
      effectColor = applyBlur(u_texture, texCoord, u_effectIntensity * 5.0);
    }
    
    // Calculate ink marbling effect
    vec2 correctedUV = uv;
    correctedUV.x *= screenAspect;
    vec2 correctedMouse = u_mouse;
    correctedMouse.x *= screenAspect;

    float dist = distance(correctedUV, correctedMouse);
    
    // Use improved ink marbling
    float marbleEffect = inkMarbling(uv * 2.0 + u_time * u_speed * 0.1, u_time, u_turbulenceIntensity * 2.0);
    float jaggedDist = dist + (marbleEffect - 0.5) * u_turbulenceIntensity * 2.0;
    
    float mask = u_radius > 0.001 ? step(jaggedDist, u_radius) : 0.0;

    // For the default effect (0), we invert the colors
    vec3 invertedColor = vec3(0.0);
    if (u_effectType == 0) {
      float gray = dot(originalColor, vec3(0.299, 0.587, 0.114));
      invertedColor = vec3(1.0 - gray);
    } else {
      // For other effects, we show the original image
      invertedColor = originalColor;
    }

    // Apply the mask to blend between effect and inverted/original
    // If invertMask is true, we swap which color is inside vs outside the mask
    vec3 finalColor;
    if (u_invertMask) {
      finalColor = mix(invertedColor, effectColor, mask);
    } else {
      finalColor = mix(effectColor, invertedColor, mask);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;


const GridOverlay = () => {
  useEffect(() => {
    const gridColumns = document.querySelectorAll(".grid-column");
    gsap.set(gridColumns, {
      opacity: 0,
      scaleY: 0
    });
    
    gsap.to(gridColumns, {
      opacity: 1,
      scaleY: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.out",
      transformOrigin: "top"
    });
  }, []);

  return (
    <div className="grid-overlay">
      <div className="grid-overlay-inner">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="grid-column"></div>
        ))}
      </div>
    </div>
  );
};


const InversionLens = ({ src, className }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const img = new Image();
    img.src = src;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "high-performance",
      alpha: true
    });

    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);


    const loader = new THREE.TextureLoader();
    loader.load(src, (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 8;
      texture.generateMipmaps = false;

      const uniforms = {
        u_texture: { value: texture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        u_radius: { value: 0.0 },
        u_speed: { value: config.maskSpeed },
        u_imageAspect: { value: imageAspect },
        u_turbulenceIntensity: { value: config.turbulenceIntensity },
        u_effectType: { value: config.effectType },
        u_effectIntensity: { value: config.effectIntensity },
        u_invertMask: { value: config.invertMask },
        u_effectColor1: { 
          value: new THREE.Color(
            config.duotoneColor1[0] / 255,
            config.duotoneColor1[1] / 255,
            config.duotoneColor1[2] / 255
          )
        },
        u_effectColor2: { 
          value: new THREE.Color(
            config.duotoneColor2[0] / 255,
            config.duotoneColor2[1] / 255,
            config.duotoneColor2[2] / 255
          )
        }
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);


      container.scene = scene;
      container.camera = camera;
      container.renderer = renderer;
      container.uniforms = uniforms;
      container.isMouseInsideContainer = false;
      container.targetMouse = new THREE.Vector2(0.5, 0.5);
      container.lerpedMouse = new THREE.Vector2(0.5, 0.5);
      container.radiusTween = null;


      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.render(scene, camera);
    });


    const handleMouseMove = (e) => {
      if (!container.uniforms) return;

      const rect = container.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right && 
                    e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (container.isMouseInsideContainer !== inside) {
        container.isMouseInsideContainer = inside;

        if (container.radiusTween) {
          container.radiusTween.kill();
        }

        if (inside) {
          container.targetMouse.x = (e.clientX - rect.left) / rect.width;
          container.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
          container.radiusTween = gsap.to(container.uniforms.u_radius, {
            value: config.maskRadius,
            duration: config.appearDuration,
            ease: "power2.out"
          });
        } else {
          container.radiusTween = gsap.to(container.uniforms.u_radius, {
            value: 0,
            duration: config.disappearDuration,
            ease: "power2.in"
          });
        }
      }

      if (inside) {
        container.targetMouse.x = (e.clientX - rect.left) / rect.width;
        container.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };


    let animationId;
    let lastTime = 0;
    let frameCount = 0;

    const animate = (timestamp) => {
      animationId = requestAnimationFrame(animate);

      if (!container.uniforms) return;

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      frameCount++;
      if (config.frameSkip > 0 && frameCount % (config.frameSkip + 1) !== 0) return;

     
      container.lerpedMouse.lerp(container.targetMouse, 0.1);
      container.uniforms.u_mouse.value.copy(container.lerpedMouse);


      if (container.isMouseInsideContainer) {
        container.uniforms.u_time.value += 0.01 * config.animationSpeed * (deltaTime / 16.67);
      }


      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animationId = requestAnimationFrame(animate);


    window.addEventListener('mousemove', handleMouseMove);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (container.renderer) {
        container.removeChild(container.renderer.domElement);
      }
  
    };
  }, [src]);

  return <div ref={containerRef} className={`inversion-lens ${className}`}></div>;
};


const ProjectItem = ({ index, imageUrl, date, title, subtitle }) => {
  return (
    <div className={`item-${index}-container`}>
      <InversionLens src={imageUrl} className={`item-${index}`} />
      <div className="project-info">
        <div className="project-date">{date}</div>
        <div className="project-title">{title}</div>
        <div className="project-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};


const Scene = () => {
  return (
    <>
      <GridOverlay />
      
      <div className="grid-container">
        <header className="header">
          <div className="logo">Sonic Meditation</div>
          <nav className="nav">
            <div className="nav-item">Works</div>
            <div className="nav-item">Philosophy</div>
            <div className="nav-item">Process</div>
          </nav>
        </header>

        <ProjectItem
          index={1}
          imageUrl="https://cdn.cosmos.so/b1f1a774-ffad-48f8-8cf2-1c6ac0c75dd1?format=jpeg"
          date="VOLUME I"
          title="THE BLUE SILENCE"
          subtitle="Exploring the depths of consciousness"
        />

        <ProjectItem
          index={2}
          imageUrl="https://cdn.cosmos.so/9ed5e53a-bc97-4f58-bbde-3c4590687eb7?format=jpeg"
          date="SESSION 02"
          title="ETHEREAL LANDSCAPES"
          subtitle="Between dreams and reality"
        />

        <ProjectItem
          index={3}
          imageUrl="https://cdn.cosmos.so/17b5c6b8-91c7-420b-8b98-29ec22b1afbb?format=jpeg"
          date="PASSAGE III"
          title="RESONANT FREQUENCIES"
          subtitle="The harmony of dissonance"
        />

        <ProjectItem
          index={4}
          imageUrl="https://cdn.cosmos.so/84950878-95e5-4db6-8904-3340c303cf29?format=jpeg"
          date="CHAPTER IV"
          title="TEMPORAL DISTORTION"
          subtitle="Moments stretched into infinity"
        />
      </div>
    </>
  );
};

export default Scene;