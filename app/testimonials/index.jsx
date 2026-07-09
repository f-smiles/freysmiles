"use client";
import { easing } from "maath";
import { Flip } from 'gsap/Flip';
import { Renderer, Program, Color, Mesh, Triangle, Vec2 } from "ogl";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  // useScroll
} from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from "@react-three/fiber";
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useCallback
} from "react";
import {
  EffectComposer,
  Bloom,
  Outline,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  OrbitControls,
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  shaderMaterial,
  Text,
  useTexture ,
  Image, ScrollControls, useScroll, 
} from "@react-three/drei";
import * as THREE from "three";
import { useControls } from "leva";
import { MeshStandardMaterial } from "three";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import ScrollList from "./scroll-list.jsx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
}


const FluidSimulation = ({ disabled }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 28,
      SPLAT_RADIUS: 0.0008,
    };

    let pointers = [];
    let splatStack = [];

    const { gl, ext } = getWebGLContext(canvas);

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
      };

      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension(
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const halfFloatTexType = isWebGL2
        ? gl.HALF_FLOAT
        : halfFloat.HALF_FLOAT_OES;
      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(
          gl,
          gl.RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }

      return {
        internalFormat,
        format,
      };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status != gl.FRAMEBUFFER_COMPLETE) return false;
      return true;
    }

    function pointerPrototype() {
      this.id = -1;
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.down = false;
      this.moved = false;
      this.color = [30, 0, 300];
    }

    pointers.push(new pointerPrototype());

    class GLProgram {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = gl.createProgram();

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          throw gl.getProgramInfoLog(this.program);

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i).name;
          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName
          );
        }
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(shader);

      return shader;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );

    const displayShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTexture;
void main() {
    vec3 rawColor = texture2D(uTexture, vUv).rgb;

    // Tone down bright white centers
    rawColor = clamp(rawColor, 0.0, 0.6);

    // More pink, less orange: soft pastel pink
    vec3 pinkTint = vec3(1.0, 0.75, 0.9);  // Reddish-pink tone

    // Blend the raw color and pink tint
    vec3 color = mix(rawColor, pinkTint, 0.4);  // Slightly more tinting

    // Feathered alpha for a wispy look
    float intensity = length(rawColor);
    float alpha = pow(intensity, 1.2) * smoothstep(0.0, 0.4, intensity);
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha * 0.7);  // Slightly softer visibility
}
    `
    );

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );

    const advectionManualFilteringShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (in sampler2D sam, in vec2 p) {
          vec4 st;
          st.xy = floor(p - 0.5) + 0.5;
          st.zw = st.xy + 1.0;
          vec4 uv = st * texelSize.xyxy;
          vec4 a = texture2D(sam, uv.xy);
          vec4 b = texture2D(sam, uv.zy);
          vec4 c = texture2D(sam, uv.xw);
          vec4 d = texture2D(sam, uv.zw);
          vec2 f = p - st.xy;
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main () {
          vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
          gl_FragColor = dissipation * bilerp(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      vec2 sampleVelocity (in vec2 uv) {
          vec2 multiplier = vec2(1.0, 1.0);
          if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
          if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
          if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
          if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
          return multiplier * texture2D(uVelocity, uv).xy;
      }

      void main () {
          float L = sampleVelocity(vL).x;
          float R = sampleVelocity(vR).x;
          float T = sampleVelocity(vT).y;
          float B = sampleVelocity(vB).y;
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
      }
    `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = vec2(abs(T) - abs(B), 0.0);
          force *= 1.0 / length(force + 0.00001) * curl * C;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }

      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }

      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    let textureWidth;
    let textureHeight;
    let density;
    let velocity;
    let divergence;
    let curl;
    let pressure;

    function initFramebuffers() {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;

      density = createDoubleFBO(
        2,
        textureWidth,
        textureHeight,
        rgba.internalFormat,
        rgba.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      velocity = createDoubleFBO(
        0,
        textureWidth,
        textureHeight,
        rg.internalFormat,
        rg.format,
        texType,
        ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      );
      divergence = createFBO(
        4,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      curl = createFBO(
        5,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
      pressure = createDoubleFBO(
        6,
        textureWidth,
        textureHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    function createFBO(texId, w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0 + texId);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId];
    }

    function createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(
        texId + 1,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );

      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      return (destination) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(
      baseVertexShader,
      ext.supportLinearFiltering
        ? advectionShader
        : advectionManualFilteringShader
    );
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader
    );

    initFramebuffers();

    let lastTime = Date.now();
    multipleSplats(parseInt(Math.random() * 20) + 5);

    function update() {
      resizeCanvas();

      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) multipleSplats(splatStack.pop());

      advectionProgram.bind();
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read[2]);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(density.write[1]);
      density.swap();

      for (let i = 0; i < pointers.length; i++) {
        const pointer = pointers[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      curlProgram.bind();
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read[2]);
      blit(curl[1]);

      vorticityProgram.bind();
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read[2]);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write[1]);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read[2]);
      blit(divergence[1]);

      clearProgram.bind();
      let pressureTexId = pressure.read[2];
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.write[1]);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      pressureTexId = pressure.read[2];
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.bindTexture(gl.TEXTURE_2D, pressure.read[0]);
        blit(pressure.write[1]);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        1.0 / textureWidth,
        1.0 / textureHeight
      );
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read[2]);
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read[2]);
      blit(velocity.write[1]);
      velocity.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind();
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
      blit(null);

      requestAnimationFrame(update);
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      );
      gl.uniform2f(
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      );
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blit(velocity.write[1]);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
      gl.uniform3f(
        splatProgram.uniforms.color,
        color[0] * 0.3,
        color[1] * 0.3,
        color[2] * 0.3
      );
      blit(density.write[1]);
      density.swap();
    }

    function multipleSplats(amount) {
      for (let i = 0; i < amount; i++) {
        const color = [
          Math.random() * 10,
          Math.random() * 10,
          Math.random() * 10,
        ];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }
    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        initFramebuffers();
      }
    }

    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      pointers[0].moved = true;
      pointers[0].dx = (e.offsetX - pointers[0].x) * 10.0;
      pointers[0].dy = (e.offsetY - pointers[0].y) * 10.0;
      pointers[0].x = e.offsetX;
      pointers[0].y = e.offsetY;

      const hue = Math.random();
      const sat = 0.6 + Math.random() * 0.3;
      const val = 0.8 + Math.random() * 0.2;

      function hsv2rgb(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        switch (i % 6) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
        return [r, g, b];
      }

      pointers[0].color = hsv2rgb(hue, sat, val);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        let pointer = pointers[i];
        pointer.moved = pointer.down;
        pointer.dx = (touches[i].pageX - pointer.x) * 10.0;
        pointer.dy = (touches[i].pageY - pointer.y) * 10.0;
        pointer.x = touches[i].pageX;
        pointer.y = touches[i].pageY;
      }
    };

    const handleMouseDown = () => {
      pointers[0].down = true;
      pointers[0].color = [
        Math.random() + 0.2,
        Math.random() + 0.2,
        Math.random() + 0.2,
      ];
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) pointers.push(new pointerPrototype());

        pointers[i].id = touches[i].identifier;
        pointers[i].down = true;
        pointers[i].x = touches[i].pageX;
        pointers[i].y = touches[i].pageY;
        pointers[i].color = [
          Math.random() + 0.2,
          Math.random() + 0.2,
          Math.random() + 0.2,
        ];
      }
    };

    const handleMouseLeave = () => {
      pointers[0].down = false;
    };

    const handleTouchEnd = (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++)
        for (let j = 0; j < pointers.length; j++)
          if (touches[i].identifier == pointers[j].id) pointers[j].down = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleTouchEnd);

    const animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

return (
  <canvas
    ref={canvasRef}
    style={{
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1,

      pointerEvents: disabled ? "none" : "auto",

      height: "-webkit-fill-available",
      minHeight: "-webkit-fill-available",
    }}
  />
);
};

function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const { gl } = renderer;
    gl.clearColor(0.93, 0.94, 0.96, 1.0); 

    const geometry = new Triangle(gl);

    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      uniform vec2 uResolution;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

const fragment = `
precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;  
uniform vec3 uColor3;  
uniform vec3 uColor4; 
uniform float uTime;
uniform float uScroll;

varying vec2 vUv;

vec4 permute(vec4 x){ 
  return mod(((x*34.0)+1.0)*x,289.0); 
}

vec2 fade(vec2 t){ 
  return t*t*t*(t*(t*6.0-15.0)+10.0); 
}

float cnoise(vec2 P){
  vec4 Pi=floor(P.xyxy)+vec4(0.0,0.0,1.0,1.0);
  vec4 Pf=fract(P.xyxy)-vec4(0.0,0.0,1.0,1.0);
  Pi=mod(Pi,289.0);
  vec4 ix=Pi.xzxz, iy=Pi.yyww, fx=Pf.xzxz, fy=Pf.yyww;
  vec4 i=permute(permute(ix)+iy);
  vec4 gx=2.0*fract(i*0.0243902439)-1.0;
  vec4 gy=abs(gx)-0.5;
  vec4 tx=floor(gx+0.5);
  gx=gx-tx;
  vec2 g00=vec2(gx.x,gy.x), g10=vec2(gx.y,gy.y);
  vec2 g01=vec2(gx.z,gy.z), g11=vec2(gx.w,gy.w);
  vec4 norm=1.79284291400159-0.85373472095314*
    vec4(dot(g00,g00),dot(g01,g01),dot(g10,g10),dot(g11,g11));
  g00*=norm.x; g01*=norm.y; g10*=norm.z; g11*=norm.w;
  float n00=dot(g00,vec2(fx.x,fy.x));
  float n10=dot(g10,vec2(fx.y,fy.y));
  float n01=dot(g01,vec2(fx.z,fy.z));
  float n11=dot(g11,vec2(fx.w,fy.w));
  vec2 fade_xy=fade(Pf.xy);
  vec2 n_x=mix(vec2(n00,n01),vec2(n10,n11),fade_xy.x);
  float n_xy=mix(n_x.x,n_x.y,fade_xy.y);
  return 2.3*n_xy;
}

float fbm(vec2 p){
  float a = 0.0;
  float w = 0.55;
  a += w * cnoise(p*0.6);  w *= 0.55;
  a += w * cnoise(p*1.1);  w *= 0.55;
  a += w * cnoise(p*2.0);
  return a;
}


float pearlCloudFbm(vec2 p, float time) {
  float a = 0.0;
  float w = 0.5;
  float freq = 1.0;

  a += w * cnoise(p * 0.8 + vec2(time * 0.02, 0.0));
  w *= 0.65;
  freq *= 1.8;
  
  a += w * cnoise(p * freq + vec2(time * 0.03, time * 0.01));
  w *= 0.6;
  freq *= 2.2;
  
  a += w * cnoise(p * freq + vec2(time * 0.05, time * 0.02));
  
  return a * 0.5 + 0.5; // Normalize to 0-1
}


vec3 pearlColor(float intensity) {

  vec3 base = vec3(0.985, 0.99, 1.0);
  
  vec3 pinkPearl = vec3(1.0, 0.985, 0.995);
  vec3 bluePearl = vec3(0.98, 0.99, 1.0);
  
  float blend = sin(uTime * 0.1) * 0.5 + 0.5;
  vec3 iridescent = mix(pinkPearl, bluePearl, blend);
  
  return mix(base, iridescent, intensity * 0.3);
}


float pearlShimmer(vec2 uv) {
  vec2 p = uv * 3.0;
  float n1 = cnoise(p + uTime * 0.04);
  float n2 = cnoise(p * 1.7 + uTime * 0.03);
  

  float shimmer = (n1 * 0.5 + 0.5) * 0.6 + 
                  (n2 * 0.5 + 0.5) * 0.4;
  

  shimmer = pow(shimmer, 1.8);
  
  return shimmer;
}

void main() {
  float n = cnoise(vUv + uScroll + sin(uTime * 0.1));
  float t = 0.5 + 0.5 * n;
  t = pow(t, 0.4);
  t = mix(t, 1.0, 0.1);

vec3 peachToBlue = mix(uColor1, uColor2, t);

float neutralZone = smoothstep(0.25, 0.75, t);
neutralZone *= 1.0 - abs(t - 0.5) * 1.6;

vec3 color = mix(peachToBlue, uColor4, neutralZone * 0.22);

float lavenderBand = smoothstep(0.55, 0.72, t) * 
                     (1.0 - smoothstep(0.72, 0.88, t));

// stronger lavender presence
vec3 lavenderMix = mix(color, uColor2 * 1.1, lavenderBand * 0.32);

// controlled saturation lift
float lavenderLuma = dot(lavenderMix, vec3(0.299, 0.587, 0.114));
vec3 saturatedLavender = mix(vec3(lavenderLuma), lavenderMix, 1.12);

color = saturatedLavender;

// subtle lavender halo glow (pearl not neon)
vec3 lavenderHalo = vec3(0.96, 0.92, 1.0);
color += lavenderHalo * lavenderBand * 0.07;
  float vign = smoothstep(0.68, 1.10, distance(vUv, vec2(0.5)));
  float cornerMask = smoothstep(0.0, 0.35, distance(vUv, vec2(0.92, 0.06)));
  vign *= cornerMask;
  color = mix(color, uColor3, vign * 0.08);

  float valley = smoothstep(0.50, 0.28, t);
  color = mix(color, uColor3, valley * 0.08);
float overlap = smoothstep(0.4, 0.65, t) *
                (1.0 - smoothstep(0.65, 0.9, t));

float grayTopLeft = 1.0 - smoothstep(
    0.0, 0.8,
    distance(vUv, vec2(0.15, 0.85))
);

float grayBottomRight = 1.0 - smoothstep(
    0.0, 0.9,
    distance(vUv, vec2(0.85, 0.15))
);

// slightly cooler gray
vec3 coolGray = vec3(0.83, 0.85, 0.92);

// subtle texture in the gray so it doesn't look flat
float grayTexture = fbm(vUv * 0.8 + uTime * 0.005);
grayTexture = smoothstep(0.45, 0.75, grayTexture);

// apply textured gray
color = mix(color, coolGray, grayTopLeft * 0.65 * grayTexture);
color = mix(color, coolGray, grayBottomRight * 0.55 * grayTexture);
vec3 butter = vec3(1.0, 0.98, 0.90);
color = mix(color, butter, overlap * 0.12);
  float pearlClouds = pearlCloudFbm(
    vUv * 0.8 + 
    vec2(uScroll * 0.15, 0.0) + 
    vec2(0.0, sin(uTime * 0.02) * 0.1),
    uTime
  );
  
  // Create two cloud layers for depth
  float cloudLayer1 = pearlCloudFbm(vUv * 0.6 + vec2(uTime * 0.01), uTime * 0.5);
  float cloudLayer2 = pearlCloudFbm(vUv * 1.2 + vec2(uTime * 0.02), uTime * 0.7);

  float combinedClouds = (cloudLayer1 * 0.6 + cloudLayer2 * 0.4);

  float cloudMask = smoothstep(0.4, 0.85, combinedClouds);

  float cloudShimmer = pearlShimmer(vUv * 2.0 + vec2(uTime * 0.03));
cloudMask *= (1.0 + cloudShimmer * 0.06);

  vec3 pearlyCloudColor = pearlColor(combinedClouds);
  
  pearlyCloudColor += vec3(0.05, 0.05, 0.06) * cloudShimmer;

  color = mix(color, pearlyCloudColor, cloudMask * 0.45);

  float cloudGlow = smoothstep(0.3, 0.7, combinedClouds);
  vec3 cloudHalo = vec3(1.0, 0.995, 0.998);
  color += cloudHalo * cloudGlow * 0.08;

  float pearlyHighlights = pearlShimmer(vUv * 1.5);
  pearlyHighlights = smoothstep(0.5, 0.9, pearlyHighlights);
  
  vec3 highlightColor = pearlColor(pearlyHighlights);
  color = mix(color, highlightColor, pearlyHighlights * 0.08 * (t + 0.2));
  
  vec2 liftCenter = vec2(0.92, 0.06);
  float r = distance(vUv, liftCenter);
  float localLift = 1.0 - smoothstep(0.30, 0.95, r);
  localLift = pow(localLift, 1.4);
  
  vec3 pearlyLift = pearlColor(localLift);
  color = mix(color, pearlyLift, localLift * 0.25);
  
  float whiteField = fbm(vUv * 0.55 + uTime * 0.01);
  whiteField = smoothstep(0.35, 0.75, 0.5 + 0.5 * whiteField);
  whiteField *= (1.0 - localLift * 0.65);

  color += pearlColor(whiteField) * whiteField * 0.1;
  
  vec2 glowCenter = vec2(0.08, 0.92);
  float glow = 1.0 - smoothstep(0.0, 0.8, distance(vUv, glowCenter));
  
  vec3 pearlyGlow = mix(uColor1, pearlColor(glow), 0.6);
  color += pearlyGlow * glow * 0.07;
  
float peachMask = max(uColor1.r, uColor1.g * 0.9);
vec3 peachBoost = color * vec3(1.05, 1.03, 1.0);

color = mix(color, peachBoost, peachMask * 0.25);

float luma = dot(color, vec3(0.299, 0.587, 0.114));
color = mix(color, vec3(luma), 0.12);
color = pow(color, vec3(1.06));

float brightness = dot(color, vec3(0.299,0.587,0.114));
color += vec3(1.0) * pow(brightness, 2.5) * 0.04;

float milkNoise = fbm(vUv * 0.35 + uTime * 0.01);
milkNoise = smoothstep(0.2, 0.9, milkNoise);

vec3 milk = vec3(0.98, 0.985, 0.995);
color = mix(color, milk, 0.12 + milkNoise * 0.18);
float grayField = fbm(vUv * 0.45 + vec2(0.0, uTime * 0.008));
grayField = smoothstep(0.45, 0.8, grayField);

vec3 softGray = vec3(0.92, 0.93, 0.95);
color = mix(color, softGray, grayField * 0.12);
color = clamp(color, 0.0, 1.0);

float overallSheen = (sin(uTime * 0.05) * 0.5 + 0.5) * 0.03;
color += vec3(0.01, 0.01, 0.015) * overallSheen;

gl_FragColor = vec4(color, 1.0);
}
`;
    
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor1: { value: new Color("#F68128") }, 
        uColor2: { value: new Color("#AAAEC3") }, 
 uColor3: { value: new Color("#CFC8BE") },
         uColor4: { value: new Color("#E9E4DC") },
        
        uResolution: { value: new Vec2(gl.canvas.offsetWidth, gl.canvas.offsetHeight) },
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
    };

let targetScroll = 0;
let currentScroll = 0;

const handleScroll = () => {
  targetScroll = window.scrollY * 0.00015;
};

    let frameId;
const loop = (t) => {
  program.uniforms.uTime.value = t * 0.001;

  currentScroll += (targetScroll - currentScroll) * 0.06;
  program.uniforms.uScroll.value = currentScroll;

  renderer.render({ scene: mesh });
  frameId = requestAnimationFrame(loop);
};
    requestAnimationFrame(loop);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      program.dispose?.();
      renderer.dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
}

const TerminalPreloader = () => {
  
  const containerRef = useRef();
const specialChars = "⬝";
  const lines = [
  { id: 1, faded: "We are committed to setting the highest standard through", highlight: "exceptional service", top: 0 },
  { id: 2, faded: "That commitment is supported by our use of", highlight: "state-of-the-art technology", top: 20 },
  { id: 3, faded: "And strengthened by the expertise that comes from", highlight: "unmatched experience", top: 40 },
  ];

  useEffect(() => {
    const terminalLines = containerRef.current.querySelectorAll('.terminal-line');
    

    gsap.set(terminalLines, { opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" }
    });

    lines.forEach((line, index) => {
      const lineEl = terminalLines[index];
      if (!lineEl) return;


      const appearTime = index * 0.3;

      tl.to(
        lineEl,
        { opacity: 1, duration: 0.3 },
        appearTime
      );


      if (line.faded) {
        const fadedSpan = lineEl.querySelector('.faded');
        tl.to(
          fadedSpan,
          {
            duration: 0.8,
            scrambleText: {
              text: line.faded,
              chars: specialChars,
              revealDelay: 0,
              speed: 0.3
            }
          },
          appearTime + 0.1
        );
      }


      if (line.highlight) {
        const highlightSpan = lineEl.querySelector('.highlight');
        tl.to(
          highlightSpan,
          {
            duration: 0.8,
            scrambleText: {
              text: line.highlight,
              chars: specialChars,
              revealDelay: 0,
              speed: 0.3
            }
          },
          appearTime + (line.faded ? 0.5 : 0.1) 
        );
      }


      if (index % 3 === 0 && index > 0) {
        tl.add(() => {
          const spans = lineEl.querySelectorAll('span');
          spans.forEach(span => {
            const text = span.textContent;
            gsap.to(span, {
              duration: 0.2,
              scrambleText: {
                text: text,
                chars: specialChars,
                speed: 0.1
              },
              repeat: 1,
              yoyo: true
            });
          });
        }, `+=${Math.random() * 0.5}`);
      }
    });

    return () => tl.kill(); 
  }, []);

  return (
    
    <div className="terminal-preloader">
    

      <div className="terminal-container" ref={containerRef}>
        {lines.map((line) => (
          <div 
            key={line.id}
            className="terminal-line"
            style={{ top: `${line.top}px` }}
          >
            {line.faded && <span className="faded"></span>}
            {line.highlight && <span className="highlight"></span>}
          </div>
        ))}
      </div>

    
    </div>
  );
};

const testimonials = [
  {
    name: "Lainie",
    image: "../images/testimonials/lainielandscape.png",
    type: "20 months",
    project: "Lainie",

  },
    {
    name: "James",
    image: "../images/testimonials/Jamescontrast.png",
    type: "20 months",
    project: "Sabrinas",

  },
  {
    name: "Ron L.",
    image: "../images/testimonials/Ronlandscape.png",
    type: "Invisalign",
    project: "Ron L.",

  },
  {
    name: "Elizabeth",
    image: "../images/testimonials/elizabethmask.png",
    type: "Invisalign",
    project: "Elizabeth",

  },
  {
    name: "Kinzie",
    image: "../images/testimonials/kinzie.jpg",
    type: "Braces, 24 months",
    project: "Kinzie",

  },
  {
    name: "Kasprenski",
    image: "../images/testimonials/kasprenski.png",
    type: undefined,
    project: "Kasprenski",

  },
  {
    name: "Leanne",
    image: "../images/testimonials/Leannelandscape.png",
    type: "12 months",
    project: "Leanne",

  },
  {
    name: "Harold",
    image: "../images/testimonials/harold.png",
    type: "Invisalign",
    project: "Harold",

  },
  {
    name: "Abigail",
    image: "../images/testimonials/Abigailportrait.png",
    type: undefined,
    project: "Abigail",

  },
  {
    name: "Madi",
    image: "../images/testimonials/Madi.png",
    type: "",
    project: "Madi",

  },
  {
    name: "Justin",
    image: "../images/testimonials/hurlburt.png",
    type: "Invisalign, 2 years",
    project: "Justin",

  },
  {
    name: "Natalia",
    image: "../images/testimonials/Natalia.png",
    type: undefined,
    project: "Natalia",

  },
  {
    name: "Breanna",
    image: "../images/testimonials/Breanna.png",
    type: "2 years, Braces",
    project: "Breanna",

  },
  {
    name: "Ibis",
    image: "../images/testimonials/Ibis_Subero.jpg",
    type: undefined,
    project: "Ibis",

  },
  {
    name: "Natasha",
    image: "../images/testimonials/Natasha.png",
    type: undefined,
    project: "Natasha",

  },
  {
    name: "Alex",
    image: "../images/testimonials/Alex.png",
    type: "2 years, Braces",
    project: "Alex",

  },
  {
    name: "Nicolle",
    image: "../images/testimonials/Nicolle.png",
    type: "Braces",
    project: "Nilaya",

  },
  {
    name: "Maria A.",
    image: "../images/testimonials/Maria.png",
    type: undefined,
    project: "Maria A.",

  },
];

function IntroCirclesBackground() {
  const ref = useRef(null);

useLayoutEffect(() => {
  const paths = document.querySelectorAll('.bg-lines path');

  console.log('paths found:', paths.length);

  paths.forEach((path, i) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.4,
      ease: 'power1.out',
      delay: i * 0.3,
      scrollTrigger: {
        trigger: path.closest('svg'),
        start: 'top 75%',
      },
    });
  });
}, []);

useLayoutEffect(() => {
  const glowPaths = document.querySelectorAll('.bg-line.glow');

  glowPaths.forEach((path, i) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: `${length * 0.15} ${length}`,
      strokeDashoffset: 0,
    });

    gsap.to(path, {
      strokeDashoffset: -length,
      duration: 6 + i * 0.8,
      ease: 'none',
      repeat: -1,
    });
  });
}, []);
  return (
  <div
      ref={ref}
      aria-hidden
      className="
        pointer-events-none
        absolute inset-0
        overflow-visible
        z-0
        text-[#685AFF]
      "
    >
  {/* <svg 
  className="bg-lines background background--cover background--top svg-fix is-hidden--sm-down
    -translate-x-[10%]
     translate-y-[2%]
"
  width="1420" 
  height="1116" 
  viewBox="0 0 1420 1116" 
  
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  data-plugin="reveal"
  data-reveal-group=""
  data-reveal-distance="0"
>
  <path 
    vectorEffect="non-scaling-stroke"
    d="M430 90.0001V558.237C430 584.877 431.734 674.641 502.25 731.974C559.601 778.603 630.567 793.361 707.441 793.361C784.315 793.361 855.281 778.603 912.631 731.974C983.148 674.641 984.882 584.877 984.882 558.237V90.0001" 
    stroke="url(#paint0_linear_5002_247)" 
    strokeWidth=".7" 
    className="bg-line base"
    data-reveal-old="line block" 
    style={{ "--line-length": "1877.288467343321px" }}
  />
    <path 
    vectorEffect="non-scaling-stroke"
    d="M430 90.0001V558.237C430 584.877 431.734 674.641 502.25 731.974C559.601 778.603 630.567 793.361 707.441 793.361C784.315 793.361 855.281 778.603 912.631 731.974C983.148 674.641 984.882 584.877 984.882 558.237V90.0001" 
    stroke="url(#paint0_linear_5002_247)" 
    strokeWidth=".7" 
     className="bg-line glow"
    data-reveal-old="line block" 
    style={{ "--line-length": "1877.288467343321px" }}
  />
  <path 
    vectorEffect="non-scaling-stroke"
  
    d="M1450.05 840.084V613.435C1450.05 577.982 1447.75 458.521 1353.83 382.22C1277.45 320.165 1182.94 300.524 1080.55 300.524C978.172 300.524 883.659 320.165 807.279 382.22C713.364 458.521 711.055 577.982 711.055 613.435V793" 
    stroke="url(#paint1_linear_5002_247)" 
    strokeWidth=".7" 
  className="bg-line base" 
    data-reveal-old="line block" 
    style={{ "--line-length": "1604.3412038055833px" }}
  />
    <path 
    vectorEffect="non-scaling-stroke"

    d="M1450.05 840.084V613.435C1450.05 577.982 1447.75 458.521 1353.83 382.22C1277.45 320.165 1182.94 300.524 1080.55 300.524C978.172 300.524 883.659 320.165 807.279 382.22C713.364 458.521 711.055 577.982 711.055 613.435V793" 
    stroke="url(#paint1_linear_5002_247)" 
    strokeWidth=".7" 
     className="bg-line glow"
    data-reveal-old="line block" 
    style={{ "--line-length": "1604.3412038055833px" }}
  />
  <defs>
    <linearGradient 
      id="paint0_linear_5002_247" 
      x1="284.423" 
      y1="1461" 
      x2="999.65" 
      y2="351.857" 
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#D6D5DB" />
      <stop offset="1" stopColor="#D6D5DB" stopOpacity="0" />
    </linearGradient>
    <linearGradient 
      id="paint1_linear_5002_247" 
      x1="1848.68" 
      y1="771.505" 
      x2="516.976" 
      y2="670.931" 
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#D6D5DB" />
      <stop offset="1" stopColor="#D6D5DB" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg>

<svg 
className="
  l-focus__bottom-lines
  svg-fix
  absolute
  left-0
  bottom-0
  
  overflow-visible
  -translate-x-[20%]
  -translate-y-[0%]
  pointer-events-none
  hidden md:block
"
  width="1440"
  height="1104"
  viewBox="0 0 1440 1104"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path 
    d="M980 1104V669.124C980 642.484 978.266 552.72 907.75 495.387C850.399 448.758 779.433 434 702.559 434C625.685 434 554.719 448.758 497.369 495.387C426.852 552.72 425.118 642.484 425.118 669.124V1104" 
    stroke="url(#paint0_linear_2555_1025)" 
    strokeOpacity="0.15" 
    strokeWidth="1.2" 
    vectorEffect="non-scaling-stroke" 
    className="" 
    data-reveal-old="line block" 
    style={{ "--line-length": "1781.1614116665746px" }}
  />
  <path 
    d="M720 2.76566e-05V508.006C720 548.453 717.366 684.744 610.234 771.795C523.105 842.592 415.291 865 298.5 865C181.709 865 73.8953 842.592 -13.2344 771.795C-120.366 684.744 -123 548.453 -123 508.006V2.76566e-05" 
    stroke="url(#paint1_linear_2555_1025)" 
    strokeOpacity="0.2" 
    strokeWidth="1.2" 
    vectorEffect="non-scaling-stroke" 
    className="" 
    data-reveal-old="line block" 
    style={{ "--line-length": "2385.0443421114737px" }}
  />
  <defs>
    <linearGradient 
      id="paint0_linear_2555_1025" 
      x1="369" 
      y1="631" 
      x2="825.168" 
      y2="1151.17" 
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="currentColor" />
      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
    </linearGradient>
    <linearGradient 
      id="paint1_linear_2555_1025" 
      x1="578.544" 
      y1="780.928" 
      x2="262.168" 
      y2="320.698" 
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="currentColor" />
     <stop offset="1" stopColor="currentColor" stopOpacity="0" />
    </linearGradient>
  </defs>
</svg> */}
  
      {/* <svg
        className="bg-lines hidden md:block absolute top-0 left-1/2 -translate-x-1/2"
        width="1420"
        height="480"
        viewBox="0 0 1420 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.3" transform="translate(30 0)">
  
          <g opacity="0.5">
            <path
              d="M1280 -27.5596V139.995C1280 162.542 1278.53 238.517 1218.8 287.043C1170.22 326.509 1110.11 339 1045 339C979.885 339 919.776 326.509 871.198 287.043C811.469 238.517 810 162.542 810 139.995V-568"
              stroke="url(#paint0)"
              strokeWidth="1.2"
              className="bg-line base"
            />
              <path
              d="M1280 -27.5596V139.995C1280 162.542 1278.53 238.517 1218.8 287.043C1170.22 326.509 1110.11 339 1045 339C979.885 339 919.776 326.509 871.198 287.043C811.469 238.517 810 162.542 810 139.995V-568"
              stroke="url(#paint0)"
              strokeWidth="1.2"
              className="bg-line glow"
            />
          </g>


          <g opacity="0.5">
            <path
              d="M441 905.2V353.313C441 330.277 442.5 252.658 503.5 203.082C553.111 162.761 614.5 150 681 150C747.5 150 808.889 162.761 858.5 203.082C919.5 252.658 921 330.277 921 353.313V905.2"
              stroke="url(#paint1)"
              strokeOpacity="0.8"
              strokeWidth="1.2"
          className="bg-line base" 
          
            />
                <path
              d="M441 905.2V353.313C441 330.277 442.5 252.658 503.5 203.082C553.111 162.761 614.5 150 681 150C747.5 150 808.889 162.761 858.5 203.082C919.5 252.658 921 330.277 921 353.313V905.2"
              stroke="url(#paint1)"
              strokeOpacity="0.8"
              strokeWidth="1.2"
          className="bg-line glow" 
          
            />
          </g>
        </g>

        <defs>
          <linearGradient
            id="paint0"
            x1="1225.17"
            y1="282.606"
            x2="783.946"
            y2="147.534"
            gradientUnits="userSpaceOnUse"
          >
           <stop offset="0" stopColor="#D6D5DB" />
      <stop offset="1" stopColor="#D6D5DB" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="paint1"
            x1="521.544"
            y1="197.88"
            x2="978.646"
            y2="392.615"
            gradientUnits="userSpaceOnUse"
          >
         <stop offset="0" stopColor="#D6D5DB" />
      <stop offset="1" stopColor="#D6D5DB" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg> */}

    
    </div>
  );
}

const List = ({ onInteractionChange }) => {
  const testimonialsSectionRef = useRef(null);
  const testimonialsListRef = useRef(null);
  const testimonialPreviewRef = useRef(null);
const lastStackedIndex = useRef(null);
  const testimonialRefs = useRef([]);
  const nameRefs = useRef([]);
  const typeRefs = useRef([]);
  const nameHighlightRefs = useRef([]);
  const typeHighlightRefs = useRef([]);
const outroRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const activeTestimonial = useRef(null);
  const zCounter = useRef(1);
  const ticking = useRef(false);
  const isHovering = useRef(false);
  const lastScrollActive = useRef(null);
  const highlighterColors = ['neon', 'pink', 'green'];
  const scrollTicking = useRef(false);

  const scrambleText = (idx) => {
    const scramble = {
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      speed: 0.8,
      newChars: 0.3,
      revealDelay: 0,
      tweenLength: true,
    }
    
    const testimonialData = testimonials[idx];
    
    if (nameRefs.current[idx]) {
      gsap.to(nameRefs.current[idx], {
        duration: 1.5,
        ease: 'power2.out',
        scrambleText: { text: testimonialData.name, ...scramble },
      });
    }
    
    if (typeRefs.current[idx] && testimonialData.type) {
      gsap.to(typeRefs.current[idx], {
        duration: 1.5,
        ease: 'power2.out',
        scrambleText: { text: testimonialData.type, ...scramble },
      });
    }
  };

const getRandomColorClass = () => {
  const colors = highlighterColors;
  return colors[Math.floor(Math.random() * colors.length)];
};

const highlightText = (idx, activate = true) => {
  if (nameHighlightRefs.current[idx]) {
    const nameEl = nameHighlightRefs.current[idx];
    if (activate) {
      const colorClass = getRandomColorClass();
      nameEl.classList.add('active', colorClass);
      nameEl.dataset.color = colorClass;
    } else {
      nameEl.classList.remove('active', 'neon', 'pink', 'green');
      delete nameEl.dataset.color;
    }
  }

  if (typeHighlightRefs.current[idx] && testimonials[idx].type) {
    const typeEl = typeHighlightRefs.current[idx];
    if (activate) {
      const colorClass = nameHighlightRefs.current[idx]?.dataset.color || getRandomColorClass();
      typeEl.classList.add('active', colorClass);
    } else {
      typeEl.classList.remove('active', 'neon', 'pink', 'green');
    }
  }
};
const stackImage = (index, source = "scroll") => {
  const container = testimonialPreviewRef.current;
  const data = testimonials[index];
  if (!container || !data?.image) return;

  if (lastStackedIndex.current === index) return;

const mask = document.createElement("div");
mask.className = "preview-mask";

const img = document.createElement("img");
img.src = data.image;

img.style.width = "100%";
img.style.height = "100%";
img.style.objectFit = "cover";
img.style.transform = "scale(0)";
img.style.transformOrigin = "center center";
img.style.zIndex = zCounter.current++;

img.style.clipPath = `
  polygon(
    16px 0%,
    calc(100% - 16px) 0%,
    calc(100% - 16px) 16px,
    calc(100% - 16px) 32px,
    100% 32px,
    100% calc(100% - 48px),
    calc(100% - 16px) calc(100% - 48px),
    calc(100% - 16px) calc(100% - 32px),
    100% calc(100% - 32px),
    100% calc(100% - 16px),
    calc(100% - 16px) calc(100% - 16px),
    calc(100% - 32px) calc(100% - 16px),
    calc(100% - 32px) calc(100% - 32px),
    calc(100% - 16px) calc(100% - 32px),
    calc(100% - 16px) 100%,
    0% 100%,
    0% 16px,
    16px 16px
  )
`;
mask.appendChild(img);
container.appendChild(mask);

  gsap.to(img, {
    scale: 1,
    duration: 0.35,
    ease: "power2.out",
  });


  const images = container.querySelectorAll("img");
  if (images.length > 6) images[0].remove();

  lastStackedIndex.current = index;
};
const updatePreviewOnScroll = () => {
  if (!isTestimonialsVisible()) return;
  if (isHovering.current) return; // prioritize hover

  const sectionTop = testimonialsSectionRef.current.offsetTop;
  const centerY = window.scrollY + window.innerHeight / 2 - sectionTop;

  let closestIndex = null;
  let closestDistance = Infinity;

  rowCenters.current.forEach((rowCenter, index) => {
    if (!rowCenter) return;
    const distance = Math.abs(rowCenter - centerY);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  if (
    closestIndex !== null &&
    closestIndex !== lastScrollActive.current &&
    closestDistance < 120
  ) {
    // highlight swap
    if (lastScrollActive.current !== null) {
      highlightText(lastScrollActive.current, false);
    }
    highlightText(closestIndex, true);

    //  stack image on scroll index change
    stackImage(closestIndex, "scroll");

    lastScrollActive.current = closestIndex;
  }
};
  
  const mouseTicking = useRef(false);

useEffect(() => {
  const handleMouseMove = (e) => {
    lastMousePosition.current.x = e.clientX;
    lastMousePosition.current.y = e.clientY;

    if (!isHovering.current) return;

if (!mouseTicking.current) {
  requestAnimationFrame(() => {
    mouseTicking.current = false;
  });
  mouseTicking.current = true;
}
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);
useEffect(() => {
  const onScroll = () => {
    if (!isTestimonialsVisible()) {
const images = testimonialPreviewRef.current?.querySelectorAll("img");
images?.forEach((img) => {
  gsap.killTweensOf(img);
  gsap.to(img, {
    scale: 0,
    opacity: 0,
    duration: 0.35,
    ease: "power2.inOut",
    onComplete: () => img.remove(),
  });
});

lastStackedIndex.current = null;
zCounter.current = 1;

      activeTestimonial.current = null;
      isHovering.current = false;
      lastScrollActive.current = null;

      testimonials.forEach((_, index) => {
        highlightText(index, false);
      });

      return;
    }

if (!scrollTicking.current) {
  requestAnimationFrame(() => {
    updatePreviewOnScroll();
    scrollTicking.current = false;
  });
  scrollTicking.current = true;
}
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);

useEffect(() => {
  testimonialRefs.current.forEach((testimonial, index) => {
    if (!testimonial) return;

const enter = () => {
  activeTestimonial.current = index;
  isHovering.current = true;

  lastStackedIndex.current = null;

  highlightText(index, true);
  scrambleText(index);

  //  stack immediately on enter
  stackImage(index, "hover");
};

const leave = () => {
  activeTestimonial.current = null;
  isHovering.current = false;

  highlightText(index, false);

  lastStackedIndex.current = null;
};
    testimonial.addEventListener("mouseenter", enter);
    testimonial.addEventListener("mouseleave", leave);

    return () => {
      testimonial.removeEventListener("mouseenter", enter);
      testimonial.removeEventListener("mouseleave", leave);
    };
  });
}, []);
  
  const rowCenters = useRef([]);
useEffect(() => {
  const computeCenters = () => {
    rowCenters.current = testimonialRefs.current.map((el) =>
      el ? el.offsetTop + el.offsetHeight / 2 : null
    );
  };

  computeCenters();
  window.addEventListener("resize", computeCenters);
  return () => window.removeEventListener("resize", computeCenters);
}, []);

  const isTestimonialsVisible = () => {
    if (!testimonialsSectionRef.current) return false;

    const rect = testimonialsSectionRef.current.getBoundingClientRect();

    return (
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    );
  };
  const clearPreview = () => {
  const images = testimonialPreviewRef.current?.querySelectorAll("img");
  images?.forEach((img) => {
    gsap.killTweensOf(img);
    gsap.to(img, {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => img.remove(),
    });
  });

  lastStackedIndex.current = null;
  zCounter.current = 1;
};
  
  useEffect(() => {
  if (!outroRef.current) return;

  const trigger = ScrollTrigger.create({
    trigger: outroRef.current,
    start: "top center",
    onEnter: clearPreview,
    onEnterBack: clearPreview,
  });

  return () => trigger.kill();
}, []);
useEffect(() => {
  if (!testimonialsSectionRef.current || !onInteractionChange) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      onInteractionChange(entry.isIntersecting);
    },
    {
      threshold: 0.4,
    }
  );

  observer.observe(testimonialsSectionRef.current);

  return () => observer.disconnect();
}, [onInteractionChange]);


  return (
    <div className="testimonialsPage">

<section className="intro relative min-h-screen overflow-hidden">
  <IntroCirclesBackground />
  <div className="absolute inset-0 z-0 pointer-events-none">

    <JanusFace />

  </div>

  <div className="relative max-w-[1400px] mx-auto w-full flex flex-col md:flex-row">
    <div className="hidden md:block md:w-1/2 min-h-screen" />

    <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center px-6 md:px-0">
      <div className="max-w-[1200px] w-full">
        <div
          className="
            font-neuehaas45
            leading-[1.2]
            relative
            text-center md:text-left
          "
        >
          <TerminalPreloader />

        </div>
      </div>
    </div>
  </div>
</section>
      <section className="testimonials" ref={testimonialsSectionRef}>
<div className="flex flex-col items-center text-center mb-10 gap-1">
    <div className="flex items-baseline gap-2">

     <SlidingText 
        text="Select Cases"
        effect="2"
        totalCells={4}
      />


  </div>
        
  <span className="text-[15px] font-canelathin opacity-60">
    A visual archive of selected treatment outcomes
  </span>
</div>
<div className="flex items-center justify-between w-full">
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>

          <div className="flex-1 mx-2 border-b border-[#595252]/20"></div>
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>
        </div>
        <div className="testimonials-list" ref={testimonialsListRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial"
              ref={(el) => (testimonialRefs.current[index] = el)}
            >
              <div className="testimonial-content">
                <div className="testimonial-name">
                  <span 
                    className="highlighted-text col-left"
                    ref={(el) => (nameHighlightRefs.current[index] = el)}
                  >
                    <h1 
                      ref={(el) => (nameRefs.current[index] = el)}
                    >
                      {testimonial.name}
                    </h1>
                  </span>
                  <span 
                    className="highlighted-text col-right"
                    ref={(el) => (typeHighlightRefs.current[index] = el)}
                  >
                    <h1 
                      ref={(el) => (typeRefs.current[index] = el)}
                    >
                      {testimonial.type || ""}
                    </h1>
                  </span>
               
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


<div ref={outroRef} className="testimonials-outro-spacer" />
      <div className="testimonial-preview" ref={testimonialPreviewRef} />
    </div>
  );
};
const SlidingText = ({
  text = "Select Cases",
  totalCells = 4,
}) => {
  const containerRef = useRef(null);
  const innerRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !innerRefs.current.length) return;

    const setLayout = () => {
      const firstInner = innerRefs.current[0];
      const textWidth = firstInner.scrollWidth;

      container.style.setProperty("--text-width", `${textWidth}px`);
      container.style.setProperty("--gsplits", totalCells);

      const offset = textWidth / totalCells;
      
      innerRefs.current.forEach((inner, i) => {
        gsap.set(inner, { 
          x: -i * offset,
        });
      });
    };

    setLayout();
    window.addEventListener("resize", setLayout);

    return () => {
      window.removeEventListener("resize", setLayout);
    };
  }, [totalCells]);

useEffect(() => {
  const el = containerRef.current;
  if (!el || !innerRefs.current.length) return;

  const setLayout = () => {
    const firstInner = innerRefs.current[0];
    const textWidth = firstInner.scrollWidth;
    
    el.style.setProperty("--text-width", `${textWidth}px`);
    el.style.setProperty("--gsplits", totalCells);

    const offset = textWidth / totalCells;
    
    innerRefs.current.forEach((inner, i) => {
      gsap.set(inner, { 
        x: -i * offset,
      });
    });
  };

  setLayout();

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      const textWidth = parseFloat(el.style.getPropertyValue("--text-width"));
      const offset = textWidth / totalCells;

      gsap.fromTo(
        innerRefs.current,
        {
          x: (i) => -i * offset + (i % 2 === 0 ? -40 : 40),
          opacity: 0,
        },
        {
          x: (i) => -i * offset,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: "power2.out",
        }
      );
    },
    { threshold: 0.7 }
  );

  gsap.set(innerRefs.current, { opacity: 0 });
  
  observer.observe(el);


  const handleResize = () => {
    setLayout();
 
    if (!observer) {
      gsap.set(innerRefs.current, { opacity: 0 });
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', handleResize);
    gsap.killTweensOf(innerRefs.current);
  };
}, [totalCells]);

  return (
    <h3
      ref={containerRef}
      className="gtext font-neuehaasdisplaythin"
    >
      {Array.from({ length: totalCells }).map((_, i) => (
        <span key={i} className="gtext__box">
          <span
            className="gtext__box-inner"
            ref={(el) => (innerRefs.current[i] = el)}
          >
            {text}
          </span>
        </span>
      ))}
    </h3>
  );
};





  const reviews = [
    {
      name: "James Pica",
      text: "Frey Smiles has made the whole process from start to finish incredibly pleasant and sooo easy on my kids to follow. They were able to make a miracle happen with my son's tooth that was coming in sideways. He now has a perfect smile and I couldn't be happier. My daughter is halfway through her treatment and the difference already has been great. I 100% recommend this place to anyone!!!",
      color: "bg-[#9482A3]",
      image: "/images/_mesh_gradients/lightblue.png",

      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Thomas StPierre",
      text: "I had a pretty extreme case and it took some time, but FreySmiles gave me the smile I had always hoped for. Thank you!",
      color: "bg-[#EB7104]",
      image: "/images/_mesh_gradients/purplegrey.png",
      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "Fei Zhao",
      text: "Our whole experience for the past 10 years of being under Dr. Gregg Frey’s care and his wonderful staff has been amazing. My son and my daughter have most beautiful smiles, and they received so many compliments on their teeth. It has made a dramatic and positive change in their lives. Dr. Frey is a perfectionist, and his treatment is second to none. I recommend Dr. Frey highly and without any reservation.",
      color: "bg-[#80A192]",
      image: "/images/_mesh_gradients/pantonepinkblue.png",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Shelby Loucks",
      text: "THEY ARE AMAZING!! Great staff and wonderful building. HIGHLY recommend to anyone looking for an orthodontist.",
      color: "bg-[#A81919]",
      image: "/images/_mesh_gradients/LilyWhite.jpg",

      height: "h-[240px]",
      width: "w-[240px]",
    },
    {
      name: "Diana Gomez",
      text: "After arriving at my sons dentist on a Friday, his dentist office now informs me that they don’t have a referral. I called the Frey smiles office when they were closed and left a message. I received a call back within minutes from Dr. Frey himself who sent the referral over immediately ( on his day off!!!) how amazing! Not to mention the staff was amazing when were were there and my children felt so comfortable! Looking forward to a wonderful smile for my son!!",
      color: "bg-[#F3B700]",
      image: "/images/_mesh_gradients/pinkwhite.png",
      height: "h-[320px]",
      width: "w-[320px]",
    },
    {
      name: "Tracee Benton",
      text: "Dr. Frey and his orthodontist techs are the absolute best! The team has such an attention to detail I absolutely love my new smile and my confidence has significantly grown! The whole process of using Invisalign has been phenomenal. I highly recommend Dr. Frey and his team to anyone considering orthodontic work!",
      color: "bg-[#036523]",
      image: "/images/_mesh_gradients/purpledred.png",
    },
    {
      name: "Brandi Moyer",
      text: "My experience with Dr. Frey orthodontics has been nothing but great. The staff is all so incredibly nice and willing to help. And better yet, today I found out I may be ahead of my time line to greater aligned teeth!.",
      color: "bg-[#4C90B3]",
      image: "/images/_mesh_gradients/purpleyellow.png",
    },

    {
      name: "Andrew Cornell",
      text: "Over 20 years ago, I went to Dr. Frey to fix my cross bite and get braces. Since then, my smile looks substantially nicer. My entire mouth feels better as well. The benefits of orthodontics under Dr. Frey continue paying dividends.",
      color: "bg-[#56A0FC]",
      image: "/images/_mesh_gradients/greenwhite.png",
    },

    {
      name: "Vicki Weaver",
      text: "We have had all four of our children receive orthodontic treatment from Dr. Frey. Dr. Frey is willing to go above and beyond for his patients before, during, and after the treatment is finished. It shows in their beautiful smiles!! We highly recommend FreySmiles to all of our friends and family!",
      color: "bg-[#EA9CBE]",
      image: "/images/_mesh_gradients/blueyellowgradient.png",
    },

    {
      name: "Sara Moyer",
      text: "We are so happy that we picked Freysmiles in Lehighton for both of our girls Invisalign treatment. Dr. Frey and all of his staff are always so friendly and great to deal with. My girls enjoy going to their appointments and love being able to see the progress their teeth have made with each tray change. We are 100% confident that we made the right choice when choosing them as our orthodontist!",
      image: "/images/_mesh_gradients/turquoisegradient.png",
      height: "h-[320px]",
      width: "w-[320px]",
    },

    {
      name: "Mandee Kaur",
      image: "/images/_mesh_gradients/pinkparty.png",
      text: "I would highly recommend FreySmiles! Excellent orthodontic care, whether it’s braces or Invisalign, Dr. Frey and his team pay attention to detail in making sure your smile is flawless! I would not trust anyone else for my daughter’s care other than FreySmiles.",
      color: "bg-[#49ABA3]",
    },
  ];
  
const Testimonials = () => {

  const textRef = useRef(null);
  const bgTextColor = "#CECED3";
  const fgTextColor = "#161818";
const [disableFluid, setDisableFluid] = useState(false);
  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "words, chars" });

    gsap.fromTo(
      split.chars,
      { color: bgTextColor },
      {
        color: fgTextColor,
        stagger: 0.03,
        duration: 1,
        ease: "power2.out",
      }
    );

    return () => split.revert();
  }, []);
  const gradient1Ref = useRef(null);
  const image1Ref = useRef(null);
  const text1Ref = useRef(null);

  useEffect(() => {
    if (!gradient1Ref.current || !image1Ref.current) return;

    gsap.to(".gradient-col", {
      y: "-20%",
      ease: "none",
      scrollTrigger: {
        trigger: gradient1Ref.current,
        scroller: "#right-column",
        start: "top bottom",
        end: "bottom top",
        scrub: 4,
      },
    });

    gsap.to(image1Ref.current, {
      y: "-60%",
      ease: "none",
      scrollTrigger: {
        trigger: image1Ref.current,
        scroller: "#right-column",
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.to(text1Ref.current, {
      y: "-60%",
      ease: "none",
      scrollTrigger: {
        trigger: image1Ref.current,
        scroller: "#right-column",
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  const listRefs = useRef([]);

  useEffect(() => {
    listRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          duration: 0.6,
          ease: "power2.out",
        }
      );
    });
  }, []);



  useEffect(() => {
    const lines = gsap.utils.toArray("#smile-scroll-section .line");

    lines.forEach((line, index) => {
      const direction = index % 2 === 0 ? -1 : 1;

      gsap.to(line, {
        xPercent: direction * 50,
        ease: "none",
        scrollTrigger: {
          trigger: "#smile-scroll-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, []);

  const textRefs = useRef([]);

  useEffect(() => {
    textRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { filter: "blur(8px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          duration: 0.6,
          ease: "power2.out",
        }
      );
    });
  }, []);



const reviewsRef = useRef(null);   


const [trailEnabled, setTrailEnabled] = useState(true);
const testimonialRef = useRef(null);

useEffect(() => {
  const st = ScrollTrigger.create({
    trigger: testimonialRef.current,
    start: "top center",
    end: "bottom center",
    onEnter: () => setTrailEnabled(false),
    onLeave: () => setTrailEnabled(true),
    onEnterBack: () => setTrailEnabled(false),
    onLeaveBack: () => setTrailEnabled(true),
  });
  return () => st.kill();
}, []);
const [activeIndex, setActiveIndex] = useState(0);

const CLIPS = ["clip-a", "clip-b"];

const clipIds = useMemo(
  () => reviews.map(() => CLIPS[Math.floor(Math.random() * CLIPS.length)]),
  [reviews]
);

const movingBlobRef = useRef(null)
const points = [
  { x: 150, y: 60 },
  { x: 210, y: 110 },
  { x: 200, y: 190 },
  { x: 120, y: 210 },
  { x: 70,  y: 140 },
  { x: 100, y: 100 },
];

useLayoutEffect(() => {
  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: 'sine.inOut', duration: 1.6 },
  });

  points.forEach((p) => {
    tl.to(movingBlobRef.current, {
      attr: { cx: p.x, cy: p.y },
    });
  });
}, []);
 
  return (
    <>
{/* <FluidSimulation disabled={disableFluid} /> */}
<List onInteractionChange={setDisableFluid} />

      {/* <MouseTrail
        images={[
          "../images/mousetrail/flame.png",
          "../images/mousetrail/cat.png",
          "../images/mousetrail/pixelstar.png",
          "../images/mousetrail/avocado.png",
          "../images/mousetrail/ghost.png",
          "../images/mousetrail/pacman.png",
          "../images/mousetrail/evilrobot.png",
          "../images/mousetrail/thirdeye.png",
          "../images/mousetrail/alientcat.png",
          "../images/mousetrail/gotcha.png",
          "../images/mousetrail/karaokekawaii.png",
          "../images/mousetrail/mushroom.png",
          "../images/mousetrail/pixelcloud.png",
          "../images/mousetrail/pineapple.png",
          "../images/mousetrail/pixelsun.png",
          "../images/mousetrail/cherries.png",
          "../images/mousetrail/watermelon.png",
          "../images/mousetrail/dolphins.png",
          "../images/mousetrail/jellyfish.png",
          "../images/mousetrail/nyancat.png",
          "../images/mousetrail/donut.png",
          "../images/mousetrail/controller.png",
          "../images/mousetrail/dinosaur.png",
          "../images/mousetrail/headphones.png",
          "../images/mousetrail/porsche.png",
        ]}
      /> */}
      <Background />
      <section
        className="z-10 relative w-full px-6 md:px-12"
      >

      </section>
      <section className="w-full py-12">
          <section className="relative overflow-hidden mx-auto max-w-[1400px] px-10">

    
   <div className="flex items-center justify-between py-10 w-full">
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>

          <div className="flex-1 mx-2 border-b border-[#595252]/20"></div>
          <span className="inline-block w-3 h-3 transition-transform duration-300 ease-in-out hover:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 13 12"
              fill="none"
              className="w-full h-full"
            >
              <path
                d="M0.5 6.46154V5.53846H6.03846V0H6.96154V5.53846H12.5V6.46154H6.96154V12H6.03846V6.46154H0.5Z"
                fill="#000"
              />
            </svg>
          </span>
        </div>

  
      <div className="font-neuehaas45 absolute top-28 left-10 text-xs uppercase tracking-widest text-black/70">
 Every smile tells a story — these are some of our favorites.
      </div>
      <div className="w-full h-screen">
        <App />
      </div>

{/* <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">

  <g transform="translate(160 160) rotate(-24) skewX(-22) scale(1.18 0.86) translate(-160 -160)">

    <g transform="translate(160 160)" fill="black">


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="0 0 0" to="360 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(0)">
          <g transform="translate(120 0)">
            <g transform="rotate(90)"><ellipse rx="44" ry="26" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="45 0 0" to="405 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(45)">
          <g transform="translate(85 85)">
            <g transform="rotate(135)"><ellipse rx="40" ry="24" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="90 0 0" to="450 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(90)">
          <g transform="translate(0 120)">
            <g transform="rotate(180)"><ellipse rx="42" ry="26" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="135 0 0" to="495 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(135)">
          <g transform="translate(-85 85)">
            <g transform="rotate(225)"><ellipse rx="40" ry="24" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="180 0 0" to="540 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(180)">
          <g transform="translate(-120 0)">
            <g transform="rotate(270)"><ellipse rx="46" ry="28" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="225 0 0" to="585 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(225)">
          <g transform="translate(-85 -85)">
            <g transform="rotate(315)"><ellipse rx="40" ry="24" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="270 0 0" to="630 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(270)">
          <g transform="translate(0 -120)">
            <g transform="rotate(360)"><ellipse rx="42" ry="26" /></g>
          </g>
        </g>
      </g>


      <g>
        <animateTransform attributeName="transform" type="rotate"
          from="315 0 0" to="675 0 0" dur="18s" repeatCount="indefinite" />
        <g transform="rotate(315)">
          <g transform="translate(85 -85)">
            <g transform="rotate(405)"><ellipse rx="40" ry="24" /></g>
          </g>
        </g>
      </g>

    </g>
  </g>
</svg> */}
      <div className="absolute top-24 right-10 text-xs uppercase tracking-widest text-black/70 flex flex-col items-center gap-2">
         <div className="group
                        px-12 py-6 flex items-center gap-4
                        transition-transform duration-300 hover:scale-[1.02] cursor-pointer">

          <span className="text-2xl">
            <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="w-6 h-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"
  />
</svg>
          </span>

        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
    <Contents />
      </div>
{/* <TextSwirl /> */}

    </section>


      </section>


<section
  ref={reviewsRef}
  className="relative flex flex-wrap items-center justify-center min-h-screen gap-4 p-8 overflow-hidden"
>
  <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
  <defs>


    <clipPath id="clip-a" clipPathUnits="objectBoundingBox">
      <path d="M0.9979787,0.04976303l0,0.9004739c0,0.02617536,-0.02121801,0.04739336,-0.04739336,0.04739336l-0.3909621,0c-0.01231754,0,-0.02415166,-0.004796209,-0.03299289,-0.01336967l-0.0577346,-0.05598341c-0.008841232,-0.008575829,-0.02067536,-0.01336967,-0.03299052,-0.01336967l-0.2123436,0c-0.01231754,0,-0.02415166,0.004793839,-0.03299289,0.01336967l-0.0577346,0.05598341c-0.008841232,0.00857346,-0.02067536,0.01336967,-0.03299289,0.01336967l-0.04972986,0c-0.02617536,0,-0.04739336,-0.02121801,-0.04739336,-0.04739336l0,-0.9004739c0,-0.02617536,0.02121801,-0.04739336,0.04739336,-0.04739336l0.9004739,0c0.02617536,0,0.04739336,0.02121801,0.04739336,0.04739336z"/>
    </clipPath>


    <clipPath id="clip-b" clipPathUnits="objectBoundingBox">
      <path d="M0.002,0.95V0.05C0.002,0.025,0.025,0.002,0.05,0.002h0.39c0.012,0,0.024,0.0048,0.033,0.0134l0.058,0.056c0.009,0.009,0.021,0.013,0.033,0.013h0.212c0.012,0,0.024,-0.0048,0.033,-0.013l0.058,-0.056c0.009,-0.0086,0.021,-0.0134,0.033,-0.0134h0.05c0.025,0,0.047,0.021,0.047,0.047V0.95c0,0.025,-0.021,0.047,-0.047,0.047H0.05C0.025,0.997,0.002,0.975,0.002,0.95z"/>
    </clipPath>


  </defs>
</svg>
{/* <StackMotionEffect /> */}
{reviews.map((t, i) => {
  const clipId = CLIPS[i % CLIPS.length];

  return (
    <div
      key={i}
      style={{ zIndex: i }}
      className="
        relative
        w-[320px]
        min-h-[450px]
        flex
        flex-col
        justify-start

        bg-white/35
        backdrop-blur-md
        backdrop-saturate-150

        border border-white/40
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]

        will-change-transform
      "
    >

      <div className="relative w-full h-[240px] p-2">
        <div
          className="relative w-full h-full bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url(${t.image})`,
            clipPath: `url(#${clipId})`,
            WebkitClipPath: `url(#${clipId})`,
          }}
        >
          <div className="absolute inset-0 z-10 pointer-events-none tile-overlay" />
        </div>
      </div>


      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-[16px] leading-tight font-neuehaas35 text-center">
          {t.name}
        </h3>

        <p className="text-[12px] leading-snug font-neuehaas45 text-black/70">
          {t.text}
        </p>
      </div>
    </div>
  );
})}
</section>

   
      {/* <div style={{ display: "flex", height: "100vh", overflowY: "auto" }}>

          <div id="right-column" className="relative w-1/2">
            <section className="relative" style={{ marginBottom: "0vh" }}>
              <div className="relative w-full h-full">
                <div ref={gradient1Ref} className="gradient-container">
                  <div className="gradient-col">
                    <div className="h-full gradient-1"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-2"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-1"></div>
                  </div>
                  <div className="gradient-col">
                    <div className="h-full gradient-2"></div>
                  </div>
                </div>
                <div>
                  <img
                    ref={image1Ref}
                    src="../images/patient25k.png"
                    alt="patient"
                    className="absolute top-[45%] right-[15%] w-[250px] h-auto "
                  />
                </div>
              </div>
            </section>

            <div class="gradient-container-2">
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
              <div class="gradient-col-2"></div>
            </div>
          </div>
        </div> */}
    </>
  );
};


export default Testimonials;
class BentPlaneGeometry extends THREE.PlaneGeometry {
  constructor(radius, ...args) {
    super(...args)
    let p = this.parameters
    let hw = p.width * 0.5
    let a = new THREE.Vector2(-hw, 0)
    let b = new THREE.Vector2(0, radius)
    let c = new THREE.Vector2(hw, 0)
    let ab = new THREE.Vector2().subVectors(a, b)
    let bc = new THREE.Vector2().subVectors(b, c)
    let ac = new THREE.Vector2().subVectors(a, c)
    let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)))
    let center = new THREE.Vector2(0, radius - r)
    let baseV = new THREE.Vector2().subVectors(a, center)
    let baseAngle = baseV.angle() - Math.PI * 0.5
    let arc = baseAngle * 2
    let uv = this.attributes.uv
    let pos = this.attributes.position
    let mainV = new THREE.Vector2()
    for (let i = 0; i < uv.count; i++) {
      let uvRatio = 1 - uv.getX(i)
      let y = pos.getY(i)
      mainV.copy(c).rotateAround(center, arc * uvRatio)
      pos.setXYZ(i, mainV.x, y, -mainV.y)
    }
    pos.needsUpdate = true
  }
}

class MeshSineMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters = {}) {
    super(parameters)
    this.setValues(parameters)
    this.time = { value: 0 }
  }
  onBeforeCompile(shader) {
    shader.uniforms.time = this.time
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    )
  }
}

extend({ MeshSineMaterial, BentPlaneGeometry })
const App = () => (
  <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
    <fog attach="fog" args={['#a79', 8.5, 12]} />
    <ScrollControls pages={4} infinite>
      <Rig rotation={[0, 0, 0.15]}>
        <Carousel />
      </Rig>
      <Banner position={[0, -0.15, 0]} />
    </ScrollControls>
    {/* <Environment preset="dawn" background blur={0.5} /> */}
  </Canvas>
)

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta) // Move camera
    state.camera.lookAt(0, 0, 0) // Look at center
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.4 }) {
  const visibleReviews = reviews.slice(0, 8);
  const count = visibleReviews.length;

  return visibleReviews.map((review, i) => (
    <Card
      key={review.name}
      url={review.image}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}
function Card({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })
  return (
 <Image
  ref={ref}
  url={url}
  transparent
  side={THREE.DoubleSide}
  onPointerOver={pointerOver}
  onPointerOut={pointerOut}
  {...props}
>
  <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
</Image>
    
  )
}

function Banner(props) {
  const ref = useRef()
const texture = useTexture("/images/fslogostrip.png");

texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.anisotropy = 16;
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.needsUpdate = true;

  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.material.time.value += Math.abs(scroll.delta) * 4
    ref.current.material.map.offset.x += delta / 2
  })
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.18, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[18, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}
function JanusFace() {
  const [leftShapes, setLeftShapes] = useState([]);
  const [rightShapes, setRightShapes] = useState([]);

  const r = (from, to) => Math.random() * (to - from) + from;
  const ri = (from, to) => ~~r(from, to);
  const pick = (...args) => args[ri(0, args.length)];

const generateText = (length = 60, rowIndex = 0) => {
  return Array.from({ length }, (_, i) => {
    const shouldBlink = (i + rowIndex) % 4 === 0;

    return (
      <span
        key={i}
        className={shouldBlink ? "symbol symbol-blink" : "symbol"}
        style={
          shouldBlink
            ? {
                "--blink-delay": `${(i * 0.09 + rowIndex * 0.17) % 4}s`,
                "--blink-duration": `${3.5 + ((i + rowIndex) % 4) * 0.4}s`,
              }
            : undefined
        }
      >
        {String.fromCharCode(ri(0x25a0, 0x25fc))}
      </span>
    );
  });
};

  const generateBaseParagraphs = () => {
    const paragraphs = [];
    for (let i = 0; i < 50; i++) {
      const offset = r(45, 95);
      // const color = pick("#8fdcff", "#6fcfff", "#b3eaff", "#a1e4ff");
      const color ="#fff";
      const textLength = ri(25, 95);

      paragraphs.push({
        offset,
        color,
        textLength,
        key: i,
      });
    }
    return paragraphs;
  };

  const build = () => {
    const baseData = generateBaseParagraphs();

    // Left side
    const leftParas = baseData.map((data, i) => (
      <div
        key={i}
        className="text-line"
        style={{
          "--offset": data.offset,
          color: data.color,
          textAlign: "left",
          mask: `linear-gradient(to right, #fff, transparent calc(var(--offset) * 1%))`,
        }}
      >
{generateText(data.textLength, i)}
      </div>
    ));


    const rightParas = baseData.map((data, i) => (
      <div
        key={`r${i}`}
        className="text-line"
        style={{
          "--offset": data.offset,
          color: data.color,
          textAlign: "right",
          mask: `linear-gradient(to left, #fff, transparent calc(var(--offset) * 1%))`,
        }}
      >
{generateText(data.textLength, i)}
      </div>
    ));

    setLeftShapes(leftParas);
    setRightShapes(rightParas);
  };

  useEffect(() => {
    build();
  }, []);


  const shapePath =
    "0.25% 2px, 99.94% 0.27%, 99.75% 100%, 19.87% 100.03%, 0 100%, 30.61% 100.07%, 37.38% 99.82%, 44.21% 99.38%, 50.92% 99.34%, 71.39% 98.43%, 76.61% 98.79%, 82.65% 97.6%, 85.9% 95.73%, 90.12% 93.85%, 88.45% 89.91%, 87.41% 87.1%, 85.48% 85.09%, 84.96% 82.33%, 88.66% 81.41%, 90.55% 79.29%, 91.75% 77.23%, 91.23% 75.11%, 88.48% 73.75%, 90.93% 72.26%, 92.34% 70.16%, 91.59% 67.66%, 89.87% 64.91%, 87.01% 63.42%, 89.87% 62.01%, 93.04% 60.71%, 96.53% 58.57%, 97.8% 55.26%, 95.36% 53.2%, 91.46% 51.56%, 86.6% 49.21%, 83.43% 47%, 79.27% 44.12%, 77.05% 40.66%, 75.51% 37.07%, 75.49% 33.04%, 76.3% 28.93%, 75.99% 25.46%, 74.57% 22.25%, 72.88% 18.96%, 69.97% 15.51%, 66.59% 12.23%, 62.29% 9.2%, 57.33% 7.06%, 52.77% 5.2%, 46.55% 3.55%, 38.59% 1.5%, 27.73% 0.92%";

  const mirrorPolygon = (poly) => {
    return poly
      .split(",")
      .map((pt) => pt.trim())
      .map((pt) => {
        const [xRaw, y] = pt.split(/\s+/);
        const xPercent = parseFloat(xRaw);
        const mirroredX = (100 - xPercent).toFixed(2) + "%";
        return `${mirroredX} ${y}`;
      })
      .join(", ");
  };

  const leftShapePath = mirrorPolygon(shapePath);

  return (
    <div className="janus-main" onClick={build} style={{ cursor: "pointer" }}>
      <div className="janus-container">
        {/* Left Face */}
        <div className="face-container left-face">
          <div
            className="janus-shape left-shape"
            style={{ shapeOutside: `polygon(${leftShapePath})` }}
          />
          <div className="text-container left-text">{leftShapes}</div>
        </div>

        {/* Right Face */}
        <div className="face-container right-face">
          <div
            className="janus-shape right-shape"
            style={{ shapeOutside: `polygon(${shapePath})` }}
          />
          <div className="text-container right-text">{rightShapes}</div>
        </div>
      </div>
    </div>
  );
}
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const StackMotionEffect = () => {
  const wrapRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  
  const winsizeRef = useRef({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });

  const reviews = useMemo(() => {
    const repeatedReviews = [];
    while (repeatedReviews.length < 27) {
      repeatedReviews.push(...[
        {
          name: "James Pica",
          text: "Frey Smiles has made the whole process from start to finish incredibly pleasant and sooo easy on my kids to follow. They were able to make a miracle happen with my son's tooth that was coming in sideways. He now has a perfect smile and I couldn't be happier. My daughter is halfway through her treatment and the difference already has been great. I 100% recommend this place to anyone!!!",
       
          image: "/images/_mesh_gradients/lightblue.png",
  
        },
        {
          name: "Thomas StPierre",
          text: "I had a pretty extreme case and it took some time, but FreySmiles gave me the smile I had always hoped for. Thank you!",
    
          image: "/images/_mesh_gradients/purplegrey.png",
      
        },
        {
          name: "Fei Zhao",
          text: "Our whole experience for the past 10 years of being under Dr. Gregg Frey's care and his wonderful staff has been amazing. My son and my daughter have most beautiful smiles, and they received so many compliments on their teeth. It has made a dramatic and positive change in their lives. Dr. Frey is a perfectionist, and his treatment is second to none. I recommend Dr. Frey highly and without any reservation.",
   
          image: "/images/_mesh_gradients/pantonepinkblue.png",
  
        },
        {
          name: "Shelby Loucks",
          text: "THEY ARE AMAZING!! Great staff and wonderful building. HIGHLY recommend to anyone looking for an orthodontist.",
        
          image: "/images/_mesh_gradients/LilyWhite.jpg",
    
        },
        {
          name: "Diana Gomez",
          text: "After arriving at my sons dentist on a Friday, his dentist office now informs me that they don't have a referral. I called the Frey smiles office when they were closed and left a message. I received a call back within minutes from Dr. Frey himself who sent the referral over immediately ( on his day off!!!) how amazing! Not to mention the staff was amazing when were were there and my children felt so comfortable! Looking forward to a wonderful smile for my son!!",
          
          image: "/images/_mesh_gradients/pinkwhite.png",
     
        },
        {
          name: "Tracee Benton",
          text: "Dr. Frey and his orthodontist techs are the absolute best! The team has such an attention to detail I absolutely love my new smile and my confidence has significantly grown! The whole process of using Invisalign has been phenomenal. I highly recommend Dr. Frey and his team to anyone considering orthodontic work!",
        
          image: "/images/_mesh_gradients/purpledred.png",
        
        },
        {
          name: "Brandi Moyer",
          text: "My experience with Dr. Frey orthodontics has been nothing but great. The staff is all so incredibly nice and willing to help. And better yet, today I found out I may be ahead of my time line to greater aligned teeth!.",
         
          image: "/images/_mesh_gradients/purpleyellow.png",
        
        },
        {
          name: "Andrew Cornell",
          text: "Over 20 years ago, I went to Dr. Frey to fix my cross bite and get braces. Since then, my smile looks substantially nicer. My entire mouth feels better as well. The benefits of orthodontics under Dr. Frey continue paying dividends.",
         
          image: "/images/_mesh_gradients/greenwhite.png",
         
        },
        {
          name: "Vicki Weaver",
          text: "We have had all four of our children receive orthodontic treatment from Dr. Frey. Dr. Frey is willing to go above and beyond for his patients before, during, and after the treatment is finished. It shows in their beautiful smiles!! We highly recommend FreySmiles to all of our friends and family!",
         
          image: "/images/_mesh_gradients/blueyellowgradient.png",
      
        },
        {
          name: "Sara Moyer",
          text: "We are so happy that we picked Freysmiles in Lehighton for both of our girls Invisalign treatment. Dr. Frey and all of his staff are always so friendly and great to deal with. My girls enjoy going to their appointments and love being able to see the progress their teeth have made with each tray change. We are 100% confident that we made the right choice when choosing them as our orthodontist!",
          image: "/images/_mesh_gradients/turquoisegradient.png",
     
        },
        {
          name: "Mandee Kaur",
          image: "/images/_mesh_gradients/pinkparty.png",
          text: "I would highly recommend FreySmiles! Excellent orthodontic care, whether it's braces or Invisalign, Dr. Frey and his team pay attention to detail in making sure your smile is flawless! I would not trust anyone else for my daughter's care other than FreySmiles.",
    
  
        },
      ]);
    }

    return repeatedReviews.slice(0, 27);
  }, []);


  const initScrollEffect = useCallback(() => {
    if (!contentRef.current || !wrapRef.current) return;

    const validCards = cardsRef.current.filter(card => card !== null);
    if (validCards.length === 0) return;

    gsap.set(contentRef.current, {
      transform: 'rotate3d(1, 0, 0, -25deg) rotate3d(0, 1, 0, 50deg) rotate3d(0, 0, 1, 25deg)',
      opacity: 0
    });

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    tlRef.current = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: wrapRef.current,
    start: 'top bottom-=20%',
    end: '+=150%',
        scrub: .4,
        onEnter: () => gsap.set(contentRef.current, { opacity: 1 }),
        onEnterBack: () => gsap.set(contentRef.current, { opacity: 1 }),
        onLeave: () => gsap.set(contentRef.current, { opacity: 0 }),
        onLeaveBack: () => gsap.set(contentRef.current, { opacity: 0 }),
      },
    })
    .fromTo(validCards, {
      z: (pos) => -2.65 * winsizeRef.current.width - pos * 0.03 * winsizeRef.current.width,
    }, {
      z: (pos) => 1.4 * winsizeRef.current.width + (validCards.length - pos - 1) * 0.03 * winsizeRef.current.width,
    }, 0)
    .fromTo(validCards, {
      rotationZ: -220,
    }, {
      rotationY: -30,
      rotationZ: 120,
      stagger: 0.005,
    }, 0);
  }, []);


  const setCardRef = useCallback((el, index) => {
    cardsRef.current[index] = el;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = throttle(() => {
      winsizeRef.current = { 
        width: window.innerWidth, 
        height: window.innerHeight 
      };
      initScrollEffect();
    }, 100);

    window.addEventListener('resize', handleResize);
    

    setTimeout(initScrollEffect, 100); 
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [initScrollEffect]);

  return (
    <>
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
  <defs>
    <clipPath id="clip-a" clipPathUnits="objectBoundingBox">
      <path d="M0.9979787,0.04976303l0,0.9004739c0,0.02617536,-0.02121801,0.04739336,-0.04739336,0.04739336l-0.3909621,0c-0.01231754,0,-0.02415166,-0.004796209,-0.03299289,-0.01336967l-0.0577346,-0.05598341c-0.008841232,-0.008575829,-0.02067536,-0.01336967,-0.03299052,-0.01336967l-0.2123436,0c-0.01231754,0,-0.02415166,0.004793839,-0.03299289,0.01336967l-0.0577346,0.05598341c-0.008841232,0.00857346,-0.02067536,0.01336967,-0.03299289,0.01336967l-0.04972986,0c-0.02617536,0,-0.04739336,-0.02121801,-0.04739336,-0.04739336l0,-0.9004739c0,-0.02617536,0.02121801,-0.04739336,0.04739336,-0.04739336l0.9004739,0c0.02617536,0,0.04739336,0.02121801,0.04739336,0.04739336z"/>
    </clipPath>

    <clipPath id="clip-b" clipPathUnits="objectBoundingBox">
      <path d="M0.002,0.95V0.05C0.002,0.025,0.025,0.002,0.05,0.002h0.39c0.012,0,0.024,0.0048,0.033,0.0134l0.058,0.056c0.009,0.009,0.021,0.013,0.033,0.013h0.212c0.012,0,0.024,-0.0048,0.033,-0.013l0.058,-0.056c0.009,-0.0086,0.021,-0.0134,0.033,-0.0134h0.05c0.025,0,0.047,0.021,0.047,0.047V0.95c0,0.025,-0.021,0.047,-0.047,0.047H0.05C0.025,0.997,0.002,0.975,0.002,0.95z"/>
    </clipPath>
  </defs>
</svg>
      <div className="sme-wrap">
        <div ref={wrapRef} className="sme-wrap__inner">
          <div ref={contentRef} className="sme-content sme-content--1">
          {reviews.map((review, index) => (
<div
  key={`sme-review-${index}`}
  ref={(el) => setCardRef(el, index)}
  className="sme-card"
>
  <div
    className={`sme-card__img relative ${index % 2 === 0 ? "clip-a" : "clip-b"}`}
    style={{
      backgroundImage: `url(${review.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 z-10 pointer-events-none tile-overlay" />
  </div>
</div>
))}
          </div>
        </div>
      </div>
    </>
  );
};


const TextSwirl = () => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  const textItems = [
    "James Pica",
    "Thomas StPierre",
    "Fei Zhao",
    "Shelby Loucks",
    "Diana Gomez",
    "Tracee Benton",
    "Brandi Moyer",
    "Andrew Cornell",
    "Vicki Weaver",
    "Sara Moyer",
    "Mandee Kaur",
    "Anita Sutton",
    "Mary Ost",
    "Crystal Burke",
    "Ashley S",
    "Angie Lub",
    "Lauren Muniz",
    "Arthur Wines",
    "Ethan Ball"


  ];

  useEffect(() => {
    initAnimations();
    const handleResize = () => {
      ScrollTrigger.refresh(true);
      setTimeout(initAnimations, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);
const initAnimations = () => {
  gsap.set(elementsRef.current, {
    clearProps: 'transform,opacity,margin,marginLeft,marginTop', 
  });

  elementsRef.current.forEach((el) => {
    if (!el) return;

    const originalClass = 'pos-3';
    const targetClass = el.dataset.altPos || 'pos-8';
    const flipEase = 'expo.inOut';

    el.classList.add(targetClass);
    el.classList.remove(originalClass);


    const flipState = Flip.getState(el, {
      props: 'opacity,margin,margin-left,margin-top,transform', 
      simple: true
    });

    el.classList.add(originalClass);
    el.classList.remove(targetClass);

    Flip.to(flipState, {
      ease: flipEase,
      scrollTrigger: {
        trigger: el,
        start: 'clamp(bottom bottom-=10%)',
        end: 'clamp(center center)',
        scrub: true,
      },
    });

    Flip.from(flipState, {
      ease: flipEase,
      scrollTrigger: {
        trigger: el,
        start: 'clamp(center center)',
        end: 'clamp(top top)',
        scrub: true,
      },
    });
  });
};

  return (
    <div className="apptext text-black">

      <div className="flex-col" style={{  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily:"NeueHaasGroteskDisplayPro45Light" }}>
                <h1 className="text-[18px] mb-2">Scroll to see some of our patients</h1>
<div className="text-[16px]">Meet the smiles behind the hype</div>
      </div>


      <div className="grouptwo" ref={containerRef}>
        {textItems.map((text, index) => (
          <div
            key={index}
            className="el pos-3"
            data-alt-pos="pos-8"
            ref={el => elementsRef.current[index] = el}
          >
            {text}
          </div>
        ))}
      </div>


      <div style={{ height: '50vh' }}></div>
    </div>
  );
};


class MousePointer {
  constructor() {
    this.x = window.innerWidth * 0.5;
    this.y = window.innerHeight * 0.5;
    this.normal = { x: 0, y: 0 };
    this.isDown = false;

    this._setupListeners();
  }

  _setupListeners() {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const target = document.querySelector(".l-canvas") || window;

    if (isTouch) {
      target.addEventListener("touchstart", (e) => this._handleStart(e));
      target.addEventListener("touchend", () => this._handleEnd());
      target.addEventListener("touchmove", (e) => this._handleMove(e), {
        passive: false,
      });
    } else {
      window.addEventListener("mousedown", (e) => this._handleStart(e));
      window.addEventListener("mouseup", () => this._handleEnd());
      window.addEventListener("mousemove", (e) => this._handleMove(e));
    }
  }

  _handleStart(e) {
    this.isDown = true;
    this._updatePosition(e);
  }

  _handleEnd() {
    this.isDown = false;
  }

  _handleMove(e) {
    this._updatePosition(e);
  }

  _updatePosition(e) {
    const pos = this._getEventPosition(e);
    this.x = pos.x;
    this.y = pos.y;

    this.normal.x = this.x / window.innerWidth;
    this.normal.y = this.y / window.innerHeight;
  }

  _getEventPosition(e) {
    if (e.touches) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }
}

const mousePointer = new MousePointer();

const map = (num, toMin, toMax, fromMin, fromMax) => {
  if (num <= fromMin) return toMin;
  if (num >= fromMax) return toMax;
  const p = (toMax - toMin) / (fromMax - fromMin);
  return (num - fromMin) * p + toMin;
};

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const Contents = () => {
  const line = 10;
  const [blocks, setBlocks] = useState([]);
  const photoRef = useRef(null);
  const blocksRef = useRef(null);
  const animationRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const windowSize = useWindowSize();

  const useGPU = (el) => {
    gsap.set(el, { willChange: "transform, opacity" });
  };

  useEffect(() => {
    if (!photoRef.current || !blocksRef.current) return;

    const img = photoRef.current.querySelector("img");
    const block = blocksRef.current;
    const num = line * line;
    const newBlocks = [];

    for (let i = 0; i < num; i++) {
      const b = document.createElement("div");
      block.append(b);
      b.append(img.cloneNode(false));

      gsap.set(b, {
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
      });

      const imgEl = b.querySelector("img");
      useGPU(imgEl);
      useGPU(b);

      newBlocks.push({ con: b, img: imgEl });
    }

    setBlocks(newBlocks);

    return () => {
      gsap.killTweensOf("*");
      block.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const el = photoRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePos({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const update = () => {
    if (!photoRef.current) return;

    const minDimension = Math.min(windowSize.width, windowSize.height);
    gsap.set(photoRef.current, { width: minDimension * 0.75 });

    const mx = mousePos.x;
    const my = mousePos.y;

    const imgSize = photoRef.current.offsetWidth || 0;
    const size = imgSize / line;
    const scale = 50;

    blocks.forEach((val, i) => {
      const ix = Math.floor(i / line);
      const iy = i % line;

      const blockX = (ix + 0.5) / line;
      const blockY = (iy + 0.5) / line;

      const dx = blockX - mx;
      const dy = blockY - my;
      const d = Math.sqrt(dx * dx + dy * dy);

      const radius = 0.3;
      const opacity = Math.max(0, 1 - d / radius);

      gsap.to(val.con, {
        width: size + 2,
        height: size + 2,
        left: ix * size,
        top: iy * size,
        opacity,
        duration: 0.12,
        ease: "power2.out",
      });

      const size2 = scale * size;
      gsap.to(val.img, {
        scale,
        x: blockX * -size2,
        y: blockY * -size2,
        duration: 0.12,
        ease: "power2.out",
      });
    });

    animationRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [blocks, windowSize, mousePos]);

  return (
    <div className="js-photo" ref={photoRef}>
      <img src="../images/flower.jpeg" alt="" />
      <div className="js-photo-blocks" ref={blocksRef} />
    </div>
  );
};
