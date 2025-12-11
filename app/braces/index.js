"use client";

import NormalizeWheel from "normalize-wheel";
import * as THREE from "three";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useState, Suspense } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import * as OGL from "ogl";
import {
  ScrollControls,
  useScroll as useThreeScroll,
  Scroll,
  Text,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  useLoader,
  useTexture,
} from "@react-three/fiber";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Texture,
  Mesh,
  Program,
} from "ogl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    DrawSVGPlugin,
    ScrollTrigger,
    SplitText,
    useGSAP,
    CustomEase,
    MotionPathPlugin
  );
}

gsap.registerPlugin(ScrollTrigger, SplitText);

const FluidSimulation = () => {
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
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        height: "-webkit-fill-available",
        minHeight: "-webkit-fill-available",
      }}
    />
  );
};
function RepellingLines({
  text = "BRACES",
  orientation = "horizontal",
  nLines = 60,
  nPoints = 160,
  paddingPct = 10,
  radius = 80,
  maxSpeed = 28,
  strokeColor = "#C4C3D0",
  lineWidth = 0.5,
  showPoints = false,
  fontPx = 420,
  fontFamily = "'NeueHaasGroteskDisplayPro45Light', sans-serif",
  textMargin = 0.1, // fraction of min(W,H)
  blurPx = 4,
  amplitude = 10, // raise height inside letters
  terraces = 25, // 1 = off; higher = more contour steps
  threshold = 0.04,
  softness = 0.2,
  invert = false,
  strokeMask = false,
  maskScaleX = 1.3,
  maskBaseline = 0.5,
}) {
  const canvasRef = useRef(null);

  const rafRef = useRef(null);
  const WRef = useRef(0);
  const HRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const linesRef = useRef([]); // array of lines; each line is array of {x,y}
  const homesLineRef = useRef([]); // home coordinate for the line (y if horizontal, x if vertical)
  const homesPointRef = useRef([]); // home coord for each point along the line (x if horizontal, y if vertical)

  // offscreen mask
  const maskCanvasRef = useRef(null);
  const maskDataRef = useRef(null);
  const maskWRef = useRef(0);
  const maskHRef = useRef(0);

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const mid = (...vals) => {
    if (vals.length < 3) return vals[0] ?? 0;
    const s = vals.slice().sort((a, b) => a - b);
    return s[Math.round((s.length - 1) / 2)];
  };
  const hypotAbs = (dx, dy) => Math.hypot(Math.abs(dx), Math.abs(dy));
  const smoothstep = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0 || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const pt = (x, y) => ({ x, y });

  const buildMask = (W, H) => {
    let off = maskCanvasRef.current;
    if (!off) {
      off = document.createElement("canvas");
      maskCanvasRef.current = off;
    }
    off.width = W;
    off.height = H;
    const g = off.getContext("2d");
    g.clearRect(0, 0, W, H);

    const pad = Math.min(W, H) * textMargin;
    const targetW = (W - pad * 2) / Math.max(0.0001, maskScaleX);

    g.font = `700 ${fontPx}px ${fontFamily}`;
    g.textAlign = "center";
    g.textBaseline = "middle";

    const rawWidth = Math.max(1, g.measureText(text).width);
    const scaleByWidth = Math.min(1, targetW / rawWidth);
    const px = Math.max(10, Math.round(fontPx * scaleByWidth));
    g.font = `700 ${px}px ${fontFamily}`;

    g.save();
    g.filter = `blur(${blurPx}px)`;
    g.fillStyle = "#fff";
    g.strokeStyle = "#fff";

    const cx = W * 0.5;
    const cy = H * maskBaseline;
    g.translate(cx, cy);
    g.scale(maskScaleX, 1);

    if (strokeMask) {
      g.lineWidth = Math.max(1, px * 0.08);
      g.strokeText(text, 0, 0);
    } else {
      g.fillText(text, 0, 0);
    }
    g.restore();

    const img = g.getImageData(0, 0, W, H);
    maskDataRef.current = img.data;
    maskWRef.current = W;
    maskHRef.current = H;
  };

  const sampleAlpha = (x, y) => {
    const W = maskWRef.current;
    const H = maskHRef.current;
    const data = maskDataRef.current;
    if (!data) return 0;
    const ix = clamp(x | 0, 0, W - 1);
    const iy = clamp(y | 0, 0, H - 1);
    const a = data[(iy * W + ix) * 4 + 3];
    return a / 255;
  };

  const layout = (W, H) => {
    const lines = [];
    const homesLine = [];
    const homesPoint = [];
    const pad = (orientation === "horizontal" ? H : W) * (paddingPct / 100);

    if (orientation === "horizontal") {
      const yStart = pad;
      const yEnd = H - pad;
      for (let i = 0; i <= nLines; i++) {
        const y = Math.round(yStart + (i / nLines) * (yEnd - yStart));
        homesLine.push(y);
        const line = [];
        if (i === 0) homesPoint.length = 0;
        for (let j = 0; j <= nPoints; j++) {
          const x = Math.round((j / nPoints) * W);
          line.push(pt(x, y));
          if (i === 0) homesPoint.push(x);
        }
        lines.push(line);
      }
    } else {
      const xStart = pad;
      const xEnd = W - pad;
      for (let i = 0; i <= nLines; i++) {
        const x = Math.round(xStart + (i / nLines) * (xEnd - xStart));
        homesLine.push(x);
        const line = [];
        if (i === 0) homesPoint.length = 0;
        for (let j = 0; j <= nPoints; j++) {
          const y = Math.round((j / nPoints) * H);
          line.push(pt(x, y));
          if (i === 0) homesPoint.push(y);
        }
        lines.push(line);
      }
    }

    linesRef.current = lines;
    homesLineRef.current = homesLine;
    homesPointRef.current = homesPoint;
  };

  const updateLine = (line, lineHome) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    if (orientation === "horizontal") {
      for (let j = line.length - 1; j >= 0; j--) {
        const p = line[j];
        const homeX = homesPointRef.current[j];
        const baseHomeY = lineHome;

        // displacement from text mask at (homeX, baseHomeY)
        const a = sampleAlpha(homeX, baseHomeY);
        const terr = terraces > 1 ? Math.round(a * terraces) / terraces : a;
        const s = smoothstep(threshold, threshold + softness, terr);
        const dir = invert ? -1 : 1;
        const dispY = dir * amplitude * s;
        const homeY = baseHomeY - dispY;

        // force toward (homeX, homeY)
        let hvx = 0,
          hvy = 0;
        if (p.x !== homeX || p.y !== homeY) {
          const dx = homeX - p.x;
          const dy = homeY - p.y;
          const d = hypotAbs(dx, dy);
          const f = Math.max(d * 0.2, 1);
          const ang = Math.atan2(dy, dx);
          hvx = f * Math.cos(ang);
          hvy = f * Math.sin(ang);
        }

        let mvx = 0,
          mvy = 0;
        const mdx = p.x - mx;
        const mdy = p.y - my;
        if (!(mdx > radius || mdy > radius || mdy < -radius || mdx < -radius)) {
          const ang = Math.atan2(mdy, mdx);
          const d = hypotAbs(mdx, mdy);
          const f = Math.max(0, Math.min(radius - d, radius));
          mvx = f * Math.cos(ang);
          mvy = f * Math.sin(ang);
        }

        const vx = Math.round(mid((mvx + hvx) * 0.9, maxSpeed, -maxSpeed));
        const vy = Math.round(mid((mvy + hvy) * 0.9, maxSpeed, -maxSpeed));
        if (vx) p.x += vx;
        if (vy) p.y += vy;
        line[j] = p;
      }
    }
    return line;
  };

  const draw = (ctx, W, H) => {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // or "screen"
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "transparent";

    const lines = linesRef.current;
    const homesLine = homesLineRef.current;

    for (let i = 0; i < lines.length; i++) {
      const line = updateLine(lines[i], homesLine[i]);
      lines[i] = line;

      ctx.beginPath();

      if (orientation === "horizontal") {
        ctx.moveTo(line[0].x, line[0].y);
        for (let j = 1; j < line.length - 1; j++) {
          const cur = line[j];
          const next = line[j + 1];
          const xc = (cur.x + next.x) / 2;
          const yc = (cur.y + next.y) / 2;
          ctx.quadraticCurveTo(cur.x, cur.y, xc, yc);
        }
        ctx.lineTo(line[line.length - 1].x, line[line.length - 1].y);
      } else {
        ctx.moveTo(line[line.length - 1].x, line[line.length - 1].y);
        for (let j = line.length - 2; j > 0; j--) {
          const cur = line[j];
          const prev = line[j - 1];
          const xc = (cur.x + prev.x) / 2;
          const yc = (cur.y + prev.y) / 2;
          ctx.quadraticCurveTo(cur.x, cur.y, xc, yc);
        }
        ctx.lineTo(line[0].x, line[0].y);
      }

      ctx.stroke();

      if (showPoints) {
        for (let j = 0; j < line.length; j++) {
          const d = line[j];
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      const Wcss = canvas.clientWidth;
      const Hcss = canvas.clientHeight;

      WRef.current = Wcss;
      HRef.current = Hcss;

      canvas.width = Math.round(Wcss * dpr);
      canvas.height = Math.round(Hcss * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildMask(Wcss, Hcss);
      layout(Wcss, Hcss);
    };

    const updateMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const leaveMouse = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    setSize();
    canvas.addEventListener("pointermove", updateMouse);
    canvas.addEventListener("pointerleave", leaveMouse);
    window.addEventListener("resize", setSize);

    const loop = () => {
      draw(ctx, WRef.current, HRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", updateMouse);
      canvas.removeEventListener("pointerleave", leaveMouse);
      window.removeEventListener("resize", setSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text,
    orientation,
    nLines,
    nPoints,
    paddingPct,
    radius,
    maxSpeed,
    fontPx,
    fontFamily,
    textMargin,
    blurPx,
    amplitude,
    terraces,
    threshold,
    softness,
    invert,
    strokeMask,
    strokeColor,
    lineWidth,
    showPoints,
  ]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: "880px", height: "600px", display: "block" }}
      />
    </div>
  );
}
const Braces = () => {
  useEffect(() => {
    const canvas = document.getElementById("shader-bg");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_mouse: { value: new THREE.Vector2() },
    };

    const vertexShader = `
      varying vec2 v_uv;
      void main() {
        v_uv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
   precision mediump float;

uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 centeredUV = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  vec3 stone = vec3(0.94, 0.93, 0.91);
  vec2 orbCenter = vec2(-0.15, -0.05); // slightly left of center
  float orbDist = length(centeredUV - orbCenter);
  float orb = smoothstep(0.8, 0.0, orbDist); 
  vec3 glow = vec3(1.0, 0.93, 0.72); 
  vec3 color = mix(stone, glow, orb * 0.8); 
  gl_FragColor = vec4(color, 1.0);
}
 `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };

    const handleMouseMove = (e) => {
      uniforms.u_mouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
    };
  }, []);

  const sectionRef = useRef(null);
  const lineRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    gsap.set(lineRefs.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set(textRefs.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top center-=100",
        end: "bottom bottom",
        toggleActions: "play none none none",
      },
    });

    lineRefs.current.forEach((line, i) => {
      tl.to(
        line,
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
        },
        i * 0.2
      );
    });

    textRefs.current.forEach((text, i) => {
      tl.to(
        text,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        i * 0.2 + 0.1
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const items = [
    "Cleaner braces",
    "Less discomfort",
    "Less time in treatment",
    "Fewer office visits",
    "Less frequent office visits",
    "Wider arches than other braces",
    "Fewer extractions of permanent teeth",
  ];
  const ELLIPSE_COUNT = 7;
  const ellipsesRef = useRef([]);

  useEffect(() => {
    ellipsesRef.current.forEach((el, i) => {
      gsap.to(el, {
        yPercent: i * 60,
        ease: "none",
        scrollTrigger: {
          trigger: "#scroll-down",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
  }, []);

  const pathRef = useRef(null);
  const cardsectionRef = useRef(null);
  const textContainerRef = useRef(null);
  useEffect(() => {
    const path = pathRef.current;
    const text = textContainerRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: 0,
    });

    gsap.set(text, {
      opacity: 0,
      y: 30,
      filter: "blur(2px)",
    });

    const trigger = ScrollTrigger.create({
      trigger: cardsectionRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(path, {
          strokeDashoffset: progress * pathLength,
          ease: "none",
          overwrite: true,
        });

        const textFadeStart = 0.66;
        const textFadeDuration = 0.33;

        if (progress >= textFadeStart) {
          const textProgress = (progress - textFadeStart) / textFadeDuration;
          const easedProgress = gsap.parseEase("sine.out")(
            Math.min(1, textProgress)
          );

          gsap.to(text, {
            opacity: easedProgress,
            y: 30 * (1 - easedProgress),
            filter: `blur(${2 * (1 - easedProgress)}px)`,
            ease: "none",
            overwrite: true,
          });
        } else {
          gsap.to(text, {
            opacity: 0,
            y: 30,
            filter: "blur(2px)",
            overwrite: true,
            duration: 0.2,
          });
        }
      },
      onLeave: () => {
        gsap.to(text, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          overwrite: true,
          duration: 0.3,
        });
      },
    });

    return () => {
      if (trigger) trigger.kill();
      gsap.killTweensOf([path, text]);
    };
  }, []);

  return (
    <>

    <LandscapeBackground />
<section className="relative w-full h-screen overflow-hidden pointer-events-none">


<img
  src="/images/oval_desktop_top.svg"
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[95%] scale-[0.9] max-w-[1600px] h-auto z-1 pointer-events-none opacity-90"
  alt="top oval"
/>

<img
  src="/images/oval_desktop_bot.svg"
  className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-5.5%] scale-[0.9] max-w-[1600px] h-auto z-1 pointer-events-none opacity-90"
  alt="bottom oval"
/>



{/* 
<div className="absolute z-20 text-left text-[13px] font-medium tracking-wide"
     style={{
       top: '15.5%',
       left: '6%',
     }}>
  <p className="uppercase mb-2 text-xs font-neuehaas35">Smile Design Studio</p>
  <p className="text-xs font-neuehaas35 max-w-xs">Braces that don’t just straighten / they shine 🌈</p>
</div> */}

 
  <div className="inline-flex items-center absolute bottom-40 right-24 z-20">
  <div className="w-[9px] h-[9px]">
  <img
    src="/images/small_title.svg"
    className="w-full h-full filter brightness-0"
    alt=""
  />
</div>
   
    <button className="uppercase px-1 py-2 text-[10px] font-neuehaas35 text-black">
      Scroll to explore
    </button>
      <div className="w-[9px] h-[9px] -scale-x-100">
  <img
    src="/images/small_title.svg"
    className="w-full h-full filter brightness-0"
    alt=""
  />
</div>
  </div>
</section>
          <div className="w-[78%] max-w-[900px] aspect-[16/9]">
          <RepellingLines
            text="BRACES"
            orientation="horizontal"
            nLines={60}
            nPoints={200}
            amplitude={10}
            terraces={25}
            blurPx={5}
            paddingPct={12}
            strokeColor="#000"
            // #93FAAF
            lineWidth={0.5}
            threshold={0.08}
            softness={0.15}
          />
        </div>

      <div className="relative">
        <div className="min-h-screen flex flex-col items-center space-y-16 px-4">
          <div className="h-[33vh]" />

          <div className="text-[13px] max-w-[500px] text-white font-neuehaas45 leading-snug tracking-wider">
            We love our patients so much we only use braces when we have to. Not
            because it’s cheaper. Not because it’s easier. Just because it’s
            what’s best. And when braces are needed? We're using the best
            ones—and getting them off as fast as humanly possible when there's
            no longer a need for braces which could cause staining and cavities.
          </div>
          <div className="h-[20vh]" />
        
        </div>

        <div className="h-[20vh]" />
        <div className="grid grid-cols-2 h-screen w-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl mx-auto">
              <section className="px-8 py-24 font-neuehaas45 text-sm tracking-tight">
                <div className="mb-10">
                  <h1 className="text-[42px] font-neuehaas45 tracking-wide flex items-center gap-2">
                    <span className="w-[1px] h-[42px] bg-black opacity-30"></span>
                    <span>Not Your</span>
              
                    <span>Average Braces</span>
                          <span className="w-[1px] h-[42px] bg-black opacity-30"></span>
                  </h1>
                  <p className="mt-4 text-[13px] tracking-wider max-w-xs leading-snug font-neuehaas35">
                    You may experience some or all of the many
                    benefits
                  </p>
                </div>
                <div ref={sectionRef} className="space-y-4">
                  {items.map((item, i) => (
                    <div key={item} className="space-y-4">
                      <div
                        ref={(el) => (lineRefs.current[i] = el)}
                        className="h-[1px] bg-[#cdccc9] w-full origin-left scale-x-0"
                      />
                      <div
                        ref={(el) => (textRefs.current[i] = el)}
                        className="font-neuehaas35 tracking-wide text-[13px]"
                      >
                        <li>{item}</li>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <img
              src="/images/fsstickers.png"
              className="max-w-full max-h-[100vh] object-contain"
              alt="7graphic"
            />
          </div>
        </div>
        <section
          ref={cardsectionRef}
          className="h-[100vh] relative z-10 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 951 367"
            fill="none"
            className="w-full h-auto max-w-5xl pt-40 mx-auto"
          >
            <path
              ref={pathRef}
              d="M926 366V41.4C926 32.7 919 25.6 910.2 25.6C904.6 25.6 899.7 28.4 897 32.9L730.2 333.3C727.5 338 722.3 341.2 716.5 341.2C707.8 341.2 700.7 334.2 700.7 325.4V41.6C700.7 32.9 693.7 25.8 684.9 25.8C679.3 25.8 674.4 28.6 671.7 33.1L504.7 333.3C502 338 496.8 341.2 491 341.2C482.3 341.2 475.2 334.2 475.2 325.4V41.6C475.2 32.9 468.2 25.8 459.4 25.8C453.8 25.8 448.9 28.6 446.2 33.1L280.2 333.3C277.5 338 272.3 341.2 266.5 341.2C257.8 341.2 250.7 334.2 250.7 325.4V41.6C250.7 32.9 243.7 25.8 234.9 25.8C229.3 25.8 224.4 28.6 221.7 33.1L54.7 333.3C52 338 46.8 341.2 41 341.2C32.3 341.2 25.2 334.2 25.2 325.4V1"
              stroke="#0C0EFE"
              strokeWidth="40"
              strokeMiterlimit="10"
              strokeLinejoin="round"
            />
          </svg>
        </section>
<div className="flex flex-col justify-center items-center min-h-screen">
<div className="w-full max-w-[1200px] px-4 py-24 
  bg-[#d2d2cf]/30 
  backdrop-blur-md 
  border border-white/30 
  rounded-2xl 
">
    <div className="flex flex-col md:flex-row justify-between w-full gap-12">
      <div className="max-w-[450px]">
<h2 className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-[#B0C85D] uppercase tracking-wide text-[12px] font-neuehaas35 mb-4">
          Cleaner by Design
        </h2>
        <p className="text-[14px] text-[#2C2C2C] leading-snug font-neuehaas45">
          The self-closing door means no need for elastic ties — fewer materials
          in your mouth and less friction. The wire itself is a shape-memory
          alloy engineered to move teeth smoothly and efficiently.
        </p>
      </div>

      <div className="max-w-[450px]">
<h2 className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-[#B0C85D] uppercase tracking-wide text-[12px] font-neuehaas35 mb-4">
  Less Frequent Office Visits
</h2>
        <p className="text-[14px] text-[#2C2C2C] leading-snug font-neuehaas45">
          With Damon archwires, rubber ties are not a mandatory component. The
          sliding door keeps the wire secure until we choose to move it.
        </p>
      </div>
    </div>

    <div className="flex justify-center items-center">
     <PulsingGrid />
    </div>

    <div className="flex flex-col md:flex-row justify-between w-full gap-12">
      <div className="max-w-[450px]">
<h2 className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-[#B0C85D] uppercase tracking-wide text-[12px] font-neuehaas35 mb-4">
          Smarter Mechanics
        </h2>
        <p className="text-[14px] text-[#2C2C2C] leading-snug font-neuehaas45">
          Damon braces use a sliding door mechanism that reduces friction during
          tooth movement. This allows for more efficient alignment.
        </p>
      </div>

      <div className="max-w-[450px]">
<h2 className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-[#B0C85D] uppercase tracking-wide text-[12px] font-neuehaas35 mb-4">
          Fewer Appointments. More Time for Personal Nonsense
        </h2>
        <p className="text-[14px] text-[#2C2C2C] leading-snug font-neuehaas45">
          Traditional braces often require monthly visits just to replace rubber
          bands that lose elasticity fast — and don’t even hold the wire that
          well.
        </p>
      </div>
    </div>
  </div>
</div>
        <div className="flex justify-center items-start py-24 px-4">
          <div className="max-w-2xl w-full text-[15px] font-neuehaas45 space-y-6 leading-snug">
            <h2 className="text-[14px] uppercase tracking-wider font-neuehaas35 mb-2">
              Considerations with Braces
            </h2>
            <p className="font-neuehaas45">
              Because of their complex geometry, brackets make thorough cleaning
              significantly more difficult. Plaque retention becomes almost
              inevitable — which increases the risk of permanent enamel damage
              and long-term discoloration due to decalcification.
            </p>

            <p className="font-neuehaas45">
              A successful outcome with braces comes down to three essentials:
              frequent and consistent hygiene practices, mindful eating, and
              staying consistent with appointments. The constellation of these
              habits works in tandem to keep your treatment efficient,
              comfortable, and on track.
            </p>

            <p className="font-neuehaas45">
              We’ve put together a few practical tips to help you stay on top of
              it all.
            </p>

            <div className="pt-6">
              <a
                href="/caring-for-your-braces"
                className="z-10 inline-flex items-center justify-center text-[14px] uppercase tracking-wide font-neuehaas35 border border-black px-6 py-2 hover:bg-black hover:text-white transition-all"
                role="button"
              >
                How to Care for Your Braces
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start py-24 px-4">
          <div className="w-full max-w-3xl pt-12">
            <p className="text-center text-[14px] font-neuehaas35 uppercase tracking-wide opacity-60 mb-2">
              A final note on treatment philosophy
            </p>
            <h3 className="text-center text-[32px] font-neuehaas45 leading-snug mb-4">
              In most cases, we still prefer finishing with clear aligners.
            </h3>
            <p className="text-[15px] leading-[1.2] font-neuehaas45 max-w-xl mx-auto">
              Our breadth of clinical experience with fixed appliances —
              including Damon Braces — has shaped our current methodology: we
              begin with braces when they offer a mechanical advantage, then
              transition to clear aligners to guide teeth into their final
              position. This hybrid approach creates a more cohesive treatment
              arc — not only improving precision and predictability, but also
              easing patients into the retention phase with less relapse and
              better long-term compliance.
            </p>
          </div>
        </div>

        <FluidSimulation />
     
      </div>
      <footer id="scroll-down" className=" relative overflow-hidden h-[100vh]">
        <div className="relative w-full h-full">
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(70deg) translateZ(1px) scaleY(.6)",
              height: "100%",
              width: "100%",
              position: "relative",
              transformOrigin: "center",
              perspective: "2000px",
              backfaceVisibility: "hidden",
            }}
            className="w__oval-animations relative w-full h-full"
          >
            {[...Array(ELLIPSE_COUNT)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (ellipsesRef.current[i] = el)}
                className="absolute w-[60vw] h-[24vw] rounded-full"
                style={{
                  left: "50%",
                  marginLeft: "-45vw",
                  border: "3px solid #f7f5f7",
                  boxSizing: "border-box",
                  // willChange: "transform",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transformOrigin: "center",
                  filter: "contrast(1.1)",
                }}
              />
            ))}
          </div>
          <div className="w__scroll-down__trigger" />
        </div>
      </footer>
      {/* <TextEffect 
    text="Braces" 
    font="NeueHaasRoman" 
    color="#ffffff" 
    fontWeight="normal" 
  /> */}
    </>
  );
};

export default Braces;


const LandscapeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    const vsSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) / 2.0;
      }`;

    const fsSource = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
in vec2 v_texCoord;
out vec4 fragColor;

#define S smoothstep
#define AA 1
#define T iTime*1.2 // Slowed down from 4.0 to 0.5 for dreamy pace
#define PI 3.1415926535897932384626433832795
#define TAU 6.283185

#define MAX_STEPS 300
#define MAX_DIST 60.
#define SURF_DIST .0001

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0., 1. );
    return mix( b, a, h ) - k*h*(1.0-h);
}
mat3 rotationMatrixY (float theta)
{
    float c = cos (theta);
    float s = sin (theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}
mat3 rotationMatrixX(float theta){
	float c = cos (theta);
	float s = sin (theta);
	return mat3(
		vec3(1, 0, 0),
		vec3(0, c, -s),
		vec3(0, s, c)
	);
}
mat3 rotationMatrixZ(float theta){
	float c = cos (theta);
	float s = sin (theta);
	return mat3(
		vec3(c, -s, 0),
		vec3(s, c, 0),
		vec3(0, 0, 1)
	);
}
vec3 rotateX (vec3 p, float theta)
{
	return rotationMatrixX(theta) * p;
}
vec3 rotateY (vec3 p, float theta)
{
    return p*rotationMatrixY(theta); 
}
vec3 rotateZ (vec3 p, float theta)
{
	return p*rotationMatrixZ(theta); 
}

float rounding( in float d, in float h )
{
    return d - h;
}


float opUnion( float d1, float d2 )
{
    return min(d1,d2);
}


float opSmoothUnion( float d1, float d2, float k )
{
    float h = max(k-abs(d1-d2),0.0);
    return min(d1, d2) - h*h*0.25/k;
}


float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}
// ================================
// SDF
// ================================
float sdCircle( in vec3 p, in float r )
{
	return length(p)-r;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdCappedCylinder( vec3 p, float h, float r )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(h,r);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
float sdCappedTorus(in vec3 p, in vec2 sc, in float ra, in float rb)
{
  p.x = abs(p.x);
  float k = (sc.y*p.x>sc.x*p.y) ? dot(p.xy,sc) : length(p.xy);
  return sqrt( dot(p,p) + ra*ra - 2.0*ra*k ) - rb;
}
float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus(vec3 p, float la, float lb, float h, float ra)
{
  p = abs(p);
  vec2 b = vec2(la,lb);
  float f = clamp( (ndot(b,b-2.0*p.xz))/dot(b,b), -1.0, 1.0 );
  vec2 q = vec2(length(p.xz-0.5*b*vec2(1.0-f,1.0+f))*sign(p.x*b.y+p.z*b.x-b.x*b.y)-ra, p.y-h);
  return min(max(q.x,q.y),0.0) + length(max(q,0.0));
}
float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}
float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}
float sdPlane( vec3 p, vec3 n, float h )
{
  // n must be normalized
  return dot(p,n) + h;
}


// ================================
// FBM
// ===============================

float hash(vec3 p) {
  // Simple fast hash function to scatter values
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  // Smooth interpolated value noise
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}
const mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64 );

float fbm(vec3 p) {
  // Fractal Brownian Motion using the procedural noise above
  float f = 0.0;
  float amplitude = 0.5;
  mat3 m = mat3( 0.00,  0.80,  0.60,
                -0.80,  0.36, -0.48,
                -0.60, -0.48,  0.64 );
  for (int i = 0; i < 5; i++) {
    f += amplitude * noise(p);
    p = m * p * 1.8;     // rotate and scale to reduce repetition
    amplitude *= 0.5;
  }
  return f;
}
const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( vec2 p )
{
    float f = 0.0;
    f += 0.5000*texture( iChannel2, p/256.0 ).x; p = m2*p*2.02;
    f += 0.2500*texture( iChannel2, p/256.0 ).x; p = m2*p*2.03;
    f += 0.1250*texture( iChannel2, p/256.0 ).x; p = m2*p*2.01;
    f += 0.0625*texture( iChannel2, p/256.0 ).x;
    return f/0.9375;
}


//===============================
// TERRAIN
//=============================== 

vec2 terrainMap(vec3 pos){
    float hPlane = smoothstep(-0.5, 0.5,  0.2 * sin(pos.z* 2.) * sin(pos.x));
    float plane = sdPlane(pos, vec3(0.0,2.1,0.0),hPlane);
    //ROCKS
    vec3 q = vec3( mod(abs(pos.x),7.0)-2.5,pos.y,mod(abs(pos.z+3.0),7.0)-3.0);
    vec2 id = vec2( floor(pos.x/7.0)-2.5, floor((pos.z+3.0)/7.0)-3.0);
    float fid = id.x*121.1 + id.y*31.7;
    float h   = 1.8 + 1.0 * sin(fid*21.7);
    float wid = 1.0 + 0.8 * sin(fid*31.7);
    float len = 1.0 + 0.8 * sin(fid*41.7);
    h   = min(max(h, 1.),2.2);
    len = max(len, 1.5);
    wid = max(wid, 1.5);
    float ellip = sdEllipsoid(q, vec3(wid,h,len));
    ellip -= 0.04*smoothstep(-1.0,1.0,sin(5.0*pos.x)+cos(5.0*pos.y)+sin(5.0*pos.z));
    

    //TORUS
    q = vec3( mod(abs(pos.x+5.0),14.0)-5.,pos.y+0.1,mod(abs(pos.z+3.0),14.0)-3.0);
    float torus = sdCappedTorus(q, vec2(1.,0), 1.5, 0.35);
    torus -= 0.05*smoothstep(-1.0,1.0,sin(9.0*pos.x)+cos(5.0*pos.y)+sin(5.0*pos.z));
    
    float d = opSmoothUnion(torus, ellip, 0.5);
    d = opUnion(d, plane);
    
    
    float material;
    if( abs(d) < 0.001)
        material = 4.; 
    if(abs(d -plane) <0.0001) 
        material = 5.;
    return vec2(d, material);
}


//===============================

vec2 path(in float z){ 
    //return vec2(0);
    float a = sin(z * 0.1);
    float b = cos(z * 0.8/2.0);
    return vec2(a*1.5 - b*1., b + a*1.5); 
}


vec2 map(in vec3 pos)
{
    
    float material;

    vec3 terrainPos = pos;
    terrainPos.xz -= path(pos.z);
    vec2 terrain = terrainMap(terrainPos);

    float d = terrain.x;
    material = terrain.y;
    
    return vec2(d, material);
}


vec2 RayMarch(vec3 ro, vec3 rd, out int mat) {
	float dO=0.;
    float dM=MAX_DIST;
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        vec2 res = map(p);
        float dS = 0.75*res.x;
        mat = int(map(p).y);
        if(dS<dM) dM = dS;
        dO += dS;
        if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
    }
    
    return vec2(dO, dM);
}

vec3 GetNormal(vec3 p) {
  float h = max(0.00025, 0.5*abs(map(p).x));  // adaptive step
  vec2 e = vec2(h, 0.0);
  float dx = map(p + e.xyy).x - map(p - e.xyy).x;
  float dy = map(p + e.yxy).x - map(p - e.yxy).x;
  float dz = map(p + e.yyx).x - map(p - e.yyx).x;
  return normalize(vec3(dx, dy, dz));
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}

float calcAO( in vec3 pos, in vec3 nor, in float time )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float h = 0.01 + 0.12*float(i)/4.0;
        float d = map( pos+h*nor).x;
        occ += (h-d)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );
}

// https://iquilezles.org/articles/rmshadows
float calcSoftshadow( in vec3 ro, in vec3 rd, float tmin, float tmax, const float k )
{
	float res = 1.0;
    float t = tmin;
    for( int i=0; i<50; i++ )
    {
		float h = map( ro + rd*t).x;
        res = min( res, k*h/t );
        t += clamp( h, 0.02, 0.20 );
        if( res<0.005 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}




void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 m = vec2(0.5, 0.3); // Fixed mouse for level flyover (adjust y for pitch)
    
    vec3 col = vec3(0.,0.,0.);
    vec3 ro = vec3(0, 1., 1.)*3.5;
    ro.yz *= Rot(-m.y*3.14+1.);
    //ro.xz *= Rot(-m.x*6.2831);
    ro.z = ro.z - T;
    
    ro.x += path(ro.z).x;
    
    ro.y = max(ro.y, -0.1);
    ro.y = min(ro.y, 1.);
    

    for(int x=0; x<AA; x++) {
        for(int y=0; y<AA; y++) {
            
            vec2 offs = vec2(x, y)/float(AA) -.5;

            vec2 uv = (fragCoord+offs-.5*iResolution.xy)/iResolution.y;
            vec3 dir = vec3(ro.x, 1, path(ro.z).y - T);
            vec3 rd = R(uv, ro, dir, 1.);
            
// Sky base color 
col = vec3(0.92, 0.86, 0.98);

// Slight gradient darkening near top of sky
col -= max(rd.y, 0.0) * 0.7;

// Clouds (dusty white)
vec2 sc = ro.xz + rd.xz * (200.0 - ro.y) / rd.y;
float cloudNoise = smoothstep(0.4, 0.9, fbm(0.0005 * sc));
col = mix(col, vec3(1.0, 0.95, 0.92), 0.5 * cloudNoise); // warmer clouds


col += 0.1 * exp(-15.0 * abs(rd.y));

            int mat = -1;
            float dist = RayMarch(ro, rd, mat).x;
            
            
            vec3 p = ro + rd * dist;
            vec3 movingPos = p;
            movingPos.z += T;
            movingPos.xz = path(movingPos.z);
            vec3 f0;
            switch(mat){
               // Ground
case 4:
  f0 = vec3(0.);

  // Sample desaturated texture color
  vec3 gd = 0.33 * texture(iChannel1, p.xy * 2.0).xyz
          + 0.33 * texture(iChannel1, p.yz).xyz
          + 0.33 * texture(iChannel1, p.xz).xyz;
  gd *= 0.5;

  // Noise variation
  float variation = fbm(p.xz * 0.2 + iTime * 0.1);

  // Desert-inspired tones
  vec3 dustyPink     = vec3(0.75, 0.6, 0.62); // dreamy pink-terracotta
  vec3 powderBlue    = vec3(0.72, 0.78, 0.95); // soft lavender-blue
  vec3 cloudPurple   = vec3(0.6, 0.5, 0.7);    // dusty violet

  // Strata-like blend
  vec3 blended = mix(dustyPink, powderBlue, smoothstep(0.4, 0.8, variation));
  blended = mix(blended, cloudPurple, smoothstep(0.7, 1.0, variation));

  // Final composite
  col = 0.5 * blended + 0.5 * gd;
  break;
                case 5: 
                    col *= vec3(0.5, 0.4, 0.2);
                case -1:
                    //col *= vec3(1.,1.,1.);
                    break;
            }
            

            if(dist<MAX_DIST) {
                
                vec3 lightPos = vec3(0.,10.,4.);
                //vec3 lightPos = movingPos + vec3(0.,10.,4.);
                vec3 l = normalize(lightPos);
                vec3 n = GetNormal(p);
                
                float occ = calcAO(p, n, iTime);
                //Top Light
                {
                    
                    float dif = clamp(dot(n, l), 0., 1.);
                    vec3 ref = reflect(rd, n);
                    vec3 spe = vec3(1.0) * smoothstep(0.4,0.6,ref.y);
                     float fre = clamp(1.0+dot(rd, n), 0., 1.);
                  spe *= f0 + (1.0 - f0) * pow(fre, 5.0);
                    spe *= 6.0;
                    //float shadow = calcSoftshadow(p, l, 0.1, 2.0, 32.0 );
                   // dif *= shadow;
                    col += 0.55*vec3(0.7,0.7,0.9)*dif*occ;
                    col += vec3(0.7,0.7,0.9)*spe*dif*f0;  
                }
            
                //Side Light
                {
                    vec3 lightPos = normalize(vec3(-2.7,1.2,-0.4));
                    float dif = clamp(dot(n, lightPos), 0., 1.);
                    float shadow = calcSoftshadow(p, lightPos, 0.001, 2.0, 16.0 );

                    vec3 hal = normalize(lightPos-rd);
                    vec3 spe = vec3(1.) * pow(clamp(dot(hal, n), 0., 1.),32.0);
                    spe *= f0 + (1.-f0) * pow(1.-+clamp(dot(hal, lightPos), 0., 1.),5.0);

                    dif *= shadow;
                    col += 0.5*vec3(1.0,0.6,0.3)*dif*occ;
                    col += 1.0*vec3(1.0,0.6,0.3)*spe*f0;
                }
                
                //Bottom light
                {
                    float dif = clamp(0.5 -0.5 * n.y,0.0 ,1.);
                    col += 0.15*dif*occ;
                }
                //Reactor Light
                {
                    //vec3 lightPos = normalize(vec3(abs(movingPos.x) - 0.5,0.0, lenReactor));
                    //float dif = clamp(dot(n, lightPos), 0., 1.);
                    
                    //float shadow = calcSoftshadow(p, lightPos, 0.001, 0.5, 8.0 );
                    
                    //col += (0.7 + 0.3 * sin(iTime))*vec3(1.0,1.0,2.) * dif * shadow;
                    
                }
                col = mix( col, 0.9*vec3(0.5, 0.4, 0.2), 1.0-exp( -0.000005*dist*dist*dist ) );  // Increased fog coefficient (from 0.00001 to 0.000005) for dreamier haze
            }
            
            
        }
    }
    
    
    col /= float(AA*AA);
    
    col = clamp(col,0.0,1.0);
    col = col*col*(3.0-2.0*col);
    
    
    fragColor = vec4(col,1.0);
}

void main() {
  vec2 fragCoord = v_texCoord * iResolution.xy;
  mainImage(fragColor, fragCoord);
}
`;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    const iMouseLoc = gl.getUniformLocation(program, 'iMouse');
    const iChannel0Loc = gl.getUniformLocation(program, 'iChannel0');
    const iChannel1Loc = gl.getUniformLocation(program, 'iChannel1');
    const iChannel2Loc = gl.getUniformLocation(program, 'iChannel2');

    // Fallback textures (1x1 for simplicity; replace with real seamless ones for better results)
    // iChannel0: Metal (not used after ship removal, but kept for completeness) - silverish
    const tex0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.uniform1i(iChannel0Loc, 0);

    // iChannel1: Ground/rock texture - earthy brown
    const tex1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([139, 69, 19, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.uniform1i(iChannel1Loc, 1);

    // iChannel2: Noise texture - blue noise for FBM (grayscale)
    const tex2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.uniform1i(iChannel2Loc, 2);
const resizeCanvas = () => {
  const { clientWidth, clientHeight } = canvas;
  const dpr = window.devicePixelRatio || 1;

  canvas.width  = clientWidth  * dpr;
  canvas.height = clientHeight * dpr;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform3f(iResLoc, canvas.width, canvas.height, 1.0);
};

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime = Date.now();
    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(iTimeLoc, currentTime);
      gl.uniform4f(iMouseLoc, 0.0, 0.0, 0.0, 0.0); // Fixed, as mouse is hardcoded in shader
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(tex0);
      gl.deleteTexture(tex1);
      gl.deleteTexture(tex2);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-1"
    />
  );
};





const TextEffect = ({
  text = "braces",
  font = "NeueHaasDisplay35",
  color = "#ffffff",
  fontWeight = "100",
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const planeMeshRef = useRef(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const prevPositionRef = useRef({ x: 0.5, y: 0.5 });
  const easeFactorRef = useRef(0.02);
  const animationRef = useRef(null);
  const textureRef = useRef(null);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
      vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
      vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

      vec2 mouseDirection = u_mouse - u_prevMouse;

      vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
      float pixelDistanceToMouse = length(pixelToMouseDirection);
      float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

      vec2 uvOffset = strength * -mouseDirection * 0.4;
      vec2 uv = vUv - uvOffset;

      vec4 color = texture2D(u_texture, uv);
      gl_FragColor = color;
    }
  `;

  const createTextTexture = (text, font, size, color, fontWeight = "100") => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const canvasWidth = window.innerWidth * 2;
    const canvasHeight = window.innerHeight * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = color || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = size || Math.floor(canvasWidth * 2);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = `${fontWeight} ${fontSize}px "${font || "NeueHaasRoman"}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;

    const scaleFactor = Math.min(1, (canvasWidth * 1) / textWidth);
    const aspectCorrection = canvasWidth / canvasHeight;

    ctx.setTransform(
      scaleFactor,
      0,
      0,
      scaleFactor / aspectCorrection,
      canvasWidth / 2,
      canvasHeight / 2
    );

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = fontSize * 0.005;
    for (let i = 0; i < 3; i++) {
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    textureRef.current = texture;
    return texture;
  };

  const initializeScene = (texture) => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1 / aspectRatio,
      -1 / aspectRatio,
      0.1,
      1000
    );
    camera.position.z = 1;
    cameraRef.current = camera;

    const shaderUniforms = {
      u_mouse: { type: "v2", value: new THREE.Vector2() },
      u_prevMouse: { type: "v2", value: new THREE.Vector2() },
      u_texture: { type: "t", value: texture },
    };

    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );
    planeMeshRef.current = planeMesh;

    scene.add(planeMesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);
  };

  const reloadTexture = () => {
    const newTexture = createTextTexture(text, font, null, color, fontWeight);
    planeMeshRef.current.material.uniforms.u_texture.value = newTexture;
    if (textureRef.current) {
      textureRef.current.dispose();
    }
    textureRef.current = newTexture;
  };

  const animateScene = () => {
    if (
      !planeMeshRef.current ||
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    ) {
      return;
    }

    const { x: mouseX, y: mouseY } = mousePositionRef.current;
    const { x: targetX, y: targetY } = targetMousePositionRef.current;
    const { x: prevX, y: prevY } = prevPositionRef.current;
    const easeFactor = easeFactorRef.current;

    mousePositionRef.current.x += (targetX - mouseX) * easeFactor;
    mousePositionRef.current.y += (targetY - mouseY) * easeFactor;

    planeMeshRef.current.material.uniforms.u_mouse.value.set(
      mousePositionRef.current.x,
      1.0 - mousePositionRef.current.y
    );

    planeMeshRef.current.material.uniforms.u_prevMouse.value.set(
      prevX,
      1.0 - prevY
    );

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animateScene);
  };

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;

    easeFactorRef.current = 0.035;
    const rect = containerRef.current.getBoundingClientRect();
    prevPositionRef.current = {
      x: targetMousePositionRef.current.x,
      y: targetMousePositionRef.current.y,
    };

    targetMousePositionRef.current.x = (event.clientX - rect.left) / rect.width;
    targetMousePositionRef.current.y = (event.clientY - rect.top) / rect.height;
  };

  const handleMouseEnter = (event) => {
    if (!containerRef.current) return;

    easeFactorRef.current = 0.01;
    const rect = containerRef.current.getBoundingClientRect();

    mousePositionRef.current.x = targetMousePositionRef.current.x =
      (event.clientX - rect.left) / rect.width;
    mousePositionRef.current.y = targetMousePositionRef.current.y =
      (event.clientY - rect.top) / rect.height;
  };

  const handleMouseLeave = () => {
    easeFactorRef.current = 0.01;
    targetMousePositionRef.current = {
      x: prevPositionRef.current.x,
      y: prevPositionRef.current.y,
    };
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    const aspectRatio = window.innerWidth / window.innerHeight;
    cameraRef.current.left = -1;
    cameraRef.current.right = 1;
    cameraRef.current.top = 1 / aspectRatio;
    cameraRef.current.bottom = -1 / aspectRatio;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    reloadTexture();
  };
  useEffect(() => {
    let mounted = true;
    const currentContainer = containerRef.current;

    const init = async () => {
      try {
        const fontSize = Math.floor(window.innerWidth * 2);
        await document.fonts.load(`${fontWeight} ${fontSize}px "${font}"`);
        await document.fonts.ready;

        if (!mounted) return;

        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);

        if (currentContainer) {
          currentContainer.addEventListener("mousemove", handleMouseMove);
          currentContainer.addEventListener("mouseenter", handleMouseEnter);
          currentContainer.addEventListener("mouseleave", handleMouseLeave);
        }
        window.addEventListener("resize", onWindowResize);
      } catch (error) {
        console.error("Font loading error:", error);

        if (!mounted) return;

        const texture = createTextTexture(text, font, null, color, fontWeight);
        initializeScene(texture);
        animationRef.current = requestAnimationFrame(animateScene);

        if (currentContainer) {
          currentContainer.addEventListener("mousemove", handleMouseMove);
          currentContainer.addEventListener("mouseenter", handleMouseEnter);
          currentContainer.addEventListener("mouseleave", handleMouseLeave);
        }
        window.addEventListener("resize", onWindowResize);
      }
    };

    init();

    return () => {
      mounted = false;
      cancelAnimationFrame(animationRef.current);

      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
        currentContainer.removeEventListener("mouseenter", handleMouseEnter);
        currentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", onWindowResize);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement?.remove();
      }
      if (planeMeshRef.current) {
        planeMeshRef.current.material?.dispose();
        planeMeshRef.current.geometry?.dispose();
      }
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => {
          child.material?.dispose();
          child.geometry?.dispose();
        });
      }
    };
  }, [text, font, color, fontWeight]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", cursor: "none" }}
    />
  );
};

function PulsingGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 180;
    canvas.height = 180;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;
    let lastTime = 0;

    // Grid parameters
    const gridSize = 5; // 5x5 grid
    const spacing = 15;

    // Animation parameters
    const breathingSpeed = 0.5;
    const waveSpeed = 1.2;
    const colorPulseSpeed = 1.0;

    let animationFrameId;

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Breathing effect (expansion/contraction)
      const breathingFactor = Math.sin(time * breathingSpeed) * 0.2 + 1.0;

      // Center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();

      // Draw pulsing grid
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (row === Math.floor(gridSize / 2) && col === Math.floor(gridSize / 2))
            continue;

          const baseX = (col - (gridSize - 1) / 2) * spacing;
          const baseY = (row - (gridSize - 1) / 2) * spacing;
          const distance = Math.sqrt(baseX * baseX + baseY * baseY);
          const maxDistance = (spacing * Math.sqrt(2) * (gridSize - 1)) / 2;
          const normalizedDistance = distance / maxDistance;
          const angle = Math.atan2(baseY, baseX);

          const radialPhase = (time - normalizedDistance * waveSpeed) % 1;
          const radialWave = Math.sin(radialPhase * Math.PI * 2) * 4;

          const breathingX = baseX * breathingFactor;
          const breathingY = baseY * breathingFactor;

          const waveX = centerX + breathingX + Math.cos(angle) * radialWave;
          const waveY = centerY + breathingY + Math.sin(angle) * radialWave;

          const baseSize = 1.5 + (1 - normalizedDistance) * 1.5;
          const pulseFactor = Math.sin(time * 2 + normalizedDistance * 5) * 0.6 + 1;
          const size = baseSize * pulseFactor;

          const blueAmount =
            Math.sin(time * colorPulseSpeed + normalizedDistance * 3) * 0.3 + 0.3;
          const whiteness = 1 - blueAmount;
          const r = Math.floor(255 * whiteness + 200 * blueAmount);
          const g = Math.floor(255 * whiteness + 220 * blueAmount);
          const b = 255;

          const opacity =
            0.5 +
            Math.sin(time * 1.5 + angle * 3) * 0.2 +
            normalizedDistance * 0.3;

          // Draw connecting lines
          if (row > 0 && col > 0 && row < gridSize - 1 && col < gridSize - 1) {
            const neighbors = [
              { r: row - 1, c: col },
              { r: row, c: col + 1 },
              { r: row + 1, c: col },
              { r: row, c: col - 1 },
            ];
            for (const neighbor of neighbors) {
              const nBaseX = (neighbor.c - (gridSize - 1) / 2) * spacing;
              const nBaseY = (neighbor.r - (gridSize - 1) / 2) * spacing;
              const nBreathingX = nBaseX * breathingFactor;
              const nBreathingY = nBaseY * breathingFactor;
              const lineDistance = Math.sqrt(
                Math.pow(col - neighbor.c, 2) + Math.pow(row - neighbor.r, 2)
              );
              const lineOpacity =
                0.1 + Math.sin(time * 1.5 + lineDistance * 2) * 0.05;

              ctx.beginPath();
              ctx.moveTo(waveX, waveY);
              ctx.lineTo(centerX + nBreathingX, centerY + nBreathingY);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }

          // Draw dot
          ctx.beginPath();
          ctx.arc(waveX, waveY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      id="pulsing-grid"
      className="relative w-[180px] h-[180px] flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}