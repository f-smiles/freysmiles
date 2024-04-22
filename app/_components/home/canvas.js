"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Canvas() {
  const vertexSrc = `
    precision mediump float;
    attribute vec4 position;
    varying vec2 vUv;
    void main() {
        gl_Position = position;
        vUv = vec2((position.x + 1.)/2., (-position.y + 1.)/2.);
    }
  `;

  const fragmentSrc = `
    precision mediump float;
    uniform float uTrans;
    uniform sampler2D uTexture0;
    uniform sampler2D uTexture1;
    uniform sampler2D uDisp;
    varying vec2 vUv;
    float quarticInOut(float t) {
        return t < 0.5 ? +8.0 * pow(t, 4.0) : -8.0 * pow(t - 1.0, 4.0) + 1.0;
    }
    void main() {
        vec4 disp = texture2D(uDisp, vec2(0., 0.5) + (vUv - vec2(0., 0.5)) * (0.2 + 0.8 * (1.0 - uTrans)));
        float trans = clamp(1.6 * uTrans - disp.r * 0.4 - vUv.x * 0.2, 0.0, 1.0);
        trans = quarticInOut(trans);
        vec4 color0 = texture2D(uTexture0, vec2(0.5 - 0.3 * trans, 0.5) + (vUv - vec2(0.5)) * (1.0 - 0.2 * trans));
        vec4 color1 = texture2D(uTexture1, vec2(0.5 + sin((1. - trans) * 0.1), 0.5) + (vUv - vec2(0.5)) * (0.9 + 0.1 * trans));
        gl_FragColor = mix(color0, color1 , trans);
    }
  `;

  const assetUrls = [
    "/../images/smilegirl.jpg",
    "/../images/1024mainsectionimage.jpg",
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/disp.jpg",
  ];

  const canvasRef = useRef(null);
  const obj = useRef({ trans: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    let cnt = 0;
    let textureArr = [];

    let program = gl.createProgram();

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexSrc);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentSrc);
    gl.compileShader(fShader);

    gl.attachShader(program, vShader);
    gl.deleteShader(vShader);
    gl.attachShader(program, fShader);
    gl.deleteShader(fShader);
    gl.linkProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const vertexLocation = gl.getAttribLocation(program, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const uTransLoc = gl.getUniformLocation(program, "uTrans");
    const textureLocArr = [
      gl.getUniformLocation(program, "uTexture0"),
      gl.getUniformLocation(program, "uTexture1"),
      gl.getUniformLocation(program, "uDisp"),
    ];

    const obj = { trans: 0 };

    function start() {
      loop();
    }

    function loop() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(vertexLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexLocation);

      textureArr.forEach((texture, index) => {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocArr[index], index);
      });

      gl.uniform1f(uTransLoc, obj.trans);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(loop);
    }

    function resize() {
      let size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      if (size > 512) size = 512;
      canvas.width = size;
      canvas.height = size * 2;
    }

    function loadImages() {
      assetUrls.forEach((url, index) => {
        let img = new Image();

        let texture = gl.createTexture();
        textureArr.push(texture);

        img.onload = function (_index, _img) {
          let texture = textureArr[_index];

          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGB,
            gl.RGB,
            gl.UNSIGNED_BYTE,
            _img
          );
          gl.generateMipmap(gl.TEXTURE_2D);

          cnt++;
          if (cnt === 3) start();
        }.bind(this, index, img);

        img.crossOrigin = " Anonymous";
        img.src = url;

        console.log(img);
      });
    }

    canvas.addEventListener("mouseenter", () => {
      gsap.killTweensOf(obj);
      gsap.to(obj, 1.5, { trans: 1 });
    });

    canvas.addEventListener("mouseleave", () => {
      gsap.killTweensOf(obj);
      gsap.to(obj, 1.5, { trans: 0 });
    });

    window.addEventListener("resize", () => {
      resize();
    });

    loadImages();
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mouseenter", () => {
        gsap.killTweensOf(obj);
        gsap.to(obj, 1.5, { trans: 1 });
      });
      canvas.removeEventListener("mouseleave", () => {
        gsap.killTweensOf(obj);
        gsap.to(obj, 1.5, { trans: 0 });
      });
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="border rounded-full border-zinc-800" />
  );
}
