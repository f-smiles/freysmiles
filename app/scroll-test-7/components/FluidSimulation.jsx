'use client'
import { useEffect, useRef } from "react";

export const FluidSimulation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1440,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 2.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 2,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 3000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 6,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
    };

    let gl, ext, dye, velocity, divergence, curl, pressure;
    let blurProgram, copyProgram, clearProgram, colorProgram, splatProgram;
    let advectionProgram, divergenceProgram, curlProgram, vorticityProgram;
    let pressureProgram, gradientSubtractProgram;
    let displayMaterial;
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;
    const pointers = [new PointerPrototype()];
    let blit;
    let animationId = null;
    let initAttempts = 0;
    const maxInitAttempts = 3;
    let splatRetryAttempts = 0;
    const maxSplatRetryAttempts = 3;

    const baseVertexShaderSource = `
      precision highp float;
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
    `;
    const blurVertexShaderSource = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          float offset = 1.33333333;
          vL = vUv - texelSize * offset;
          vR = vUv + texelSize * offset;
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;
    const blurShaderSource = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      uniform sampler2D uTexture;
      void main () {
          vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
          sum += texture2D(uTexture, vL) * 0.35294117;
          sum += texture2D(uTexture, vR) * 0.35294117;
          gl_FragColor = sum;
      }
    `;
    const copyShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `;
    const clearShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;
    const colorShaderSource = `
      precision mediump float;
      uniform vec4 color;
      void main () {
          gl_FragColor = color;
      }
    `;
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
      #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
      #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `;
    const splatShaderSource = `
      precision highp float;
      precision highp sampler2D;
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
    `;
    const advectionShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
      #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
      #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `;
    const divergenceShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;
    const curlShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;
    const vorticityShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;
    const pressureShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;
    const gradientSubtractShaderSource = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    function PointerPrototype() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = [0.3, 0.0, 1.0];
    }

    function getWebGLContext(canvas) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0.0, 0.0, 0.0, 0);

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
      let formatRGBA, formatRG, formatR;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      console.log("WebGL formats:", { formatRGBA, formatRG, formatR });

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

      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      console.log("Framebuffer status for format", internalFormat, ":", status === gl.FRAMEBUFFER_COMPLETE ? "Complete" : status);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = [];
        this.activeProgram = null;
        this.uniforms = [];
      }

      setKeywords(keywords) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);

        let program = this.programs[hash];
        if (program == null) {
          let fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }

        if (program == this.activeProgram) return;

        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }

      bind() {
        gl.useProgram(this.activeProgram);
      }
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function createProgram(vertexShader, fragmentShader) {
      if (!vertexShader || !fragmentShader) {
        console.error("createProgram failed: shader missing");
        return null;
      }

      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
      }

      return program;
    }

    function getUniforms(program) {
      let uniforms = [];
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    }

    function compileShader(type, source, keywords) {
      source = addKeywords(source, keywords);

      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    }

    function addKeywords(source, keywords) {
      if (keywords == null) return source;
      let keywordsString = "";
      keywords.forEach((keyword) => {
        keywordsString += "#define " + keyword + "\n";
      });
      return keywordsString + source;
    }

    function checkFramebuffers() {
      const fbos = [
        { name: "dye.read", fbo: dye?.read?.fbo },
        { name: "dye.write", fbo: dye?.write?.fbo },
        { name: "velocity.read", fbo: velocity?.read?.fbo },
        { name: "velocity.write", fbo: velocity?.write?.fbo },
        { name: "divergence", fbo: divergence?.fbo },
        { name: "curl", fbo: curl?.fbo },
        { name: "pressure.read", fbo: pressure?.read?.fbo },
        { name: "pressure.write", fbo: pressure?.write?.fbo },
      ];
      let allComplete = true;
      fbos.forEach(({ name, fbo }) => {
        if (fbo) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
          const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
          console.log(`Framebuffer ${name} status:`, status === gl.FRAMEBUFFER_COMPLETE ? "Complete" : status);
          if (status !== gl.FRAMEBUFFER_COMPLETE) allComplete = false;
        } else {
          console.warn(`Framebuffer ${name} not initialized`);
          allComplete = false;
        }
      });
      return allComplete;
    }

    function initFramebuffers() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);

      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

      gl.disable(gl.BLEND);

      if (dye == null)
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      else
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

      if (velocity == null)
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      else
        velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0);
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      let texelSizeX = 1.0 / w;
      let texelSizeY = 1.0 / h;

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);

      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          let temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      let newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
      if (target.width == w && target.height == h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function createTextureAsync(url) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));

      let obj = {
        texture,
        width: 1,
        height: 1,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };

      let image = new Image();
      image.onload = () => {
        obj.width = image.width;
        obj.height = image.height;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      };
      image.src = url;

      return obj;
    }

    function updateKeywords() {
      let displayKeywords = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }

    function calcDeltaTime() {
      let now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      let width = scaleByPixelRatio(canvas.clientWidth || window.innerWidth);
      let height = scaleByPixelRatio(canvas.clientHeight || window.innerHeight);
      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
        console.log("Canvas resized:", width, height);
        return true;
      }
      return false;
    }

    function updateColors(dt) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = generateColor();
        });
      }
    }

    function splat(x, y, dx, dy, color) {
      if (!gl || !splatProgram || !velocity || !dye) {
        console.warn("Splat failed: WebGL not fully initialized");
        return false;
      }
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
      return true;
    }

    function splatPointer(pointer) {
      let dx = pointer.deltaX * config.SPLAT_FORCE;
      let dy = pointer.deltaY * config.SPLAT_FORCE;
      return splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    }

    function correctRadius(radius) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function updatePointerDownData(pointer, id, posX, posY) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1.0 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer) {
      pointer.down = false;
    }

    function correctDeltaX(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function generateColor() {
      let c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.0015;
      c.g *= 0.0015;
      c.b *= 0.0015;
      return c;
    }

    function HSVtoRGB(h, s, v) {
      let r, g, b, i;
      i = Math.floor(h * 3);
      switch (i % 3) {
        case 0:
          (r = 60), (g = 184), (b = 211);
          break;
        case 1:
          (r = 194), (g = 112), (b = 243);
          break;
        case 2:
          (r = 255), (g = 39), (b = 119);
          break;
      }
      return { r, g, b };
    }

    function wrap(value, min, max) {
      let range = max - min;
      if (range == 0) return min;
      return ((value - min) % range) + min;
    }

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

      let min = Math.round(resolution);
      let max = Math.round(resolution * aspectRatio);

      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min };
      else return { width: min, height: max };
    }

    function scaleByPixelRatio(input) {
      let pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function hashCode(s) {
      if (s.length == 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function clickSplat(pointer) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      let dx = 10 * (Math.random() - 0.5);
      let dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    const multipleSplats = (amount) => {
      if (!gl || !dye || !velocity || !splatProgram) {
        console.warn("multipleSplats failed: WebGL not fully initialized");
        return false;
      }
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      let success = true;
      for (let i = 0; i < amount; i++) {
        const color = generateColor();
        color.r *= 10.0;
        color.g *= 10.0;
        color.b *= 10.0;
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        if (!splat(x / canvas.width, y / canvas.height, dx, dy, color)) {
          success = false;
        }
      }
      render(null);
      console.log(`multipleSplats(${amount}) ${success ? "succeeded" : "failed"}`);
      return success;
    };

    function initWebGL() {
      if (initAttempts >= maxInitAttempts) {
        console.error("Max WebGL initialization attempts reached");
        return;
      }
      initAttempts++;

      const rect = canvas.getBoundingClientRect();
      console.log("Canvas size (attempt", initAttempts, "):", rect.width, rect.height, "Visible:", canvas.offsetParent !== null, "Styles:", getComputedStyle(canvas));

      if (rect.width <= 0 || rect.height <= 0) {
        console.warn("Invalid canvas size, retrying...");
        requestAnimationFrame(initWebGL);
        return;
      }

      canvas.width = scaleByPixelRatio(rect.width || window.innerWidth);
      canvas.height = scaleByPixelRatio(rect.height || window.innerHeight);

      const context = getWebGLContext(canvas);
      gl = context.gl;
      ext = context.ext;

      if (!gl) {
        console.error("WebGL not supported, retrying...");
        requestAnimationFrame(initWebGL);
        return;
      }

      if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 512;
        config.SHADING = false;
      }

      const baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexShaderSource);
      const blurVertexShader = compileShader(gl.VERTEX_SHADER, blurVertexShaderSource);
      const blurShader = compileShader(gl.FRAGMENT_SHADER, blurShaderSource);
      const copyShader = compileShader(gl.FRAGMENT_SHADER, copyShaderSource);
      const clearShader = compileShader(gl.FRAGMENT_SHADER, clearShaderSource);
      const colorShader = compileShader(gl.FRAGMENT_SHADER, colorShaderSource);
      const splatShader = compileShader(gl.FRAGMENT_SHADER, splatShaderSource);
      const advectionShader = compileShader(gl.FRAGMENT_SHADER, advectionShaderSource);
      const divergenceShader = compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource);
      const curlShader = compileShader(gl.FRAGMENT_SHADER, curlShaderSource);
      const vorticityShader = compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource);
      const pressureShader = compileShader(gl.FRAGMENT_SHADER, pressureShaderSource);
      const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource);

      blurProgram = new Program(blurVertexShader, blurShader);
      copyProgram = new Program(baseVertexShader, copyShader);
      clearProgram = new Program(baseVertexShader, clearShader);
      colorProgram = new Program(baseVertexShader, colorShader);
      splatProgram = new Program(baseVertexShader, splatShader);
      advectionProgram = new Program(baseVertexShader, advectionShader);
      divergenceProgram = new Program(baseVertexShader, divergenceShader);
      curlProgram = new Program(baseVertexShader, curlShader);
      vorticityProgram = new Program(baseVertexShader, vorticityShader);
      pressureProgram = new Program(baseVertexShader, pressureShader);
      gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);

      displayMaterial = new Material(baseVertexShader, displayShaderSource);

      initFramebuffers();
      if (!checkFramebuffers()) {
        console.warn("Framebuffer initialization incomplete, retrying...");
        requestAnimationFrame(initWebGL);
        return;
      }

      updateKeywords();

      blit = (() => {
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        return (target, clear = false) => {
          if (target == null) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          } else {
            gl.viewport(0, 0, target.width, target.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
          }
          if (clear) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        };
      })();

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);

      const trySplats = () => {
        if (splatRetryAttempts >= maxSplatRetryAttempts) {
          console.error("Max splat retry attempts reached");
          return;
        }
        splatRetryAttempts++;
        const success = multipleSplats(4);
        console.log(`Splat attempt ${splatRetryAttempts}/${maxSplatRetryAttempts}: ${success ? "succeeded" : "failed"}`);
        if (!success) {
          setTimeout(trySplats, 300);
        }
      };

      setTimeout(() => {
        trySplats();
      }, 200);

      let didInitialSplats = false;
      const update = () => {
        if (!blurProgram || !dye || !velocity) {
          animationId = requestAnimationFrame(update);
          return;
        }

        if (!didInitialSplats && checkFramebuffers()) {
          didInitialSplats = true;
          requestAnimationFrame(() => trySplats());
        }

        const dt = calcDeltaTime();
        if (resizeCanvas()) {
          initFramebuffers();
          if (checkFramebuffers()) trySplats();
        }

        updateColors(dt);
        applyInputs();
        step(dt);
        render(null);

        animationId = requestAnimationFrame(update);
      };

      update();
      attachListeners();
    }

    function step(dt) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      let velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render(target) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target) {
      let width = target == null ? gl.drawingBufferWidth : target.width;
      let height = target == null ? gl.drawingBufferHeight : target.height;

      displayMaterial.bind();
      if (config.SHADING)
        gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      blit(target);
    }

    function onContextLost(e) {
      e.preventDefault();
      console.warn("WebGL context lost");
      if (animationId) cancelAnimationFrame(animationId);
    }

    function onContextRestored() {
      console.log("WebGL context restored, reinitializing...");
      disposeGL(true);
      initWebGL();
    }

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const posX = scaleByPixelRatio(e.clientX - rect.left);
      const posY = scaleByPixelRatio(e.clientY - rect.top);
      updatePointerDownData(pointers[0], -1, posX, posY);
      clickSplat(pointers[0]);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const posX = scaleByPixelRatio(e.clientX - rect.left);
      const posY = scaleByPixelRatio(e.clientY - rect.top);
      updatePointerMoveData(pointers[0], posX, posY, pointers[0].color);
      if (pointers[0].down) {
        splatPointer(pointers[0]);
      }
    };

    const handleMouseUp = () => {
      if (pointers[0]) {
        updatePointerUpData(pointers[0]);
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX - canvas.getBoundingClientRect().left);
        const posY = scaleByPixelRatio(touches[i].clientY - canvas.getBoundingClientRect().top);
        updatePointerDownData(pointers[0], touches[i].identifier, posX, posY);
        clickSplat(pointers[0]);
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX - canvas.getBoundingClientRect().left);
        const posY = scaleByPixelRatio(touches[i].clientY - canvas.getBoundingClientRect().top);
        updatePointerMoveData(pointers[0], posX, posY, pointers[0].color);
        if (pointers[0].down) {
          splatPointer(pointers[0]);
        }
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      updatePointerUpData(pointers[0]);
    };

    const handleResize = () => {
      if (resizeCanvas()) {
        initFramebuffers();
        if (checkFramebuffers()) multipleSplats(4);
      }
    };

    const attachListeners = () => {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("resize", handleResize);
      canvas.addEventListener("webglcontextlost", onContextLost, false);
      canvas.addEventListener("webglcontextrestored", onContextRestored, false);
      console.log("Event listeners attached");
    };

    const detachListeners = () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      console.log("Event listeners detached");
    };

    function disposeGL(skipLose = false) {
      try {
        if (animationId) cancelAnimationFrame(animationId);
        detachListeners();

        if (!gl) return;

        const delTarget = (t) => { if (t?.texture) gl.deleteTexture(t.texture); };
        const delDoubleFBO = (pair) => {
          if (!pair) return;
          delTarget(pair.read);
          delTarget(pair.write);
          if (pair.read?.fbo) gl.deleteFramebuffer(pair.read.fbo);
          if (pair.write?.fbo) gl.deleteFramebuffer(pair.write.fbo);
        };
        delDoubleFBO(dye);
        delDoubleFBO(velocity);
        if (divergence?.fbo) gl.deleteFramebuffer(divergence.fbo);
        if (curl?.fbo) gl.deleteFramebuffer(curl.fbo);
        delDoubleFBO(pressure);

        const delProgram = (p) => { if (p?.program) gl.deleteProgram(p.program); };
        delProgram(blurProgram);
        delProgram(copyProgram);
        delProgram(clearProgram);
        delProgram(colorProgram);
        delProgram(splatProgram);
        delProgram(advectionProgram);
        delProgram(divergenceProgram);
        delProgram(curlProgram);
        delProgram(vorticityProgram);
        delProgram(pressureProgram);
        delProgram(gradientSubtractProgram);

        if (displayMaterial?.programs) {
          displayMaterial.programs.forEach(prg => prg && gl.deleteProgram(prg));
          displayMaterial.programs.length = 0;
        }

        if (!skipLose) gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch (e) {
        console.warn('disposeGL error', e);
      } finally {
        gl = null;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Canvas is visible, initializing WebGL");
          initWebGL();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      disposeGL();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "auto",
        background: "transparent",
        zIndex: 1,
      }}
    />
  );
};
