"use client";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import Copy from "@/utils/Copy.jsx";
import {
  Sphere,
  OrbitControls,
  Environment,
  shaderMaterial,
} from "@react-three/drei";
import { Media } from "/utils/Media.js";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimation,
} from "framer-motion";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger, MotionPathPlugin, SplitText } from "gsap/all";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  TextPlugin,
  MotionPathPlugin,
  ScrollTrigger,
  SplitText,
  MorphSVGPlugin
);

const CardScanner = () => {
  const controlsRef = useRef(null);
  const speedIndicatorRef = useRef(null);
  const containerRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);
  const scannerRef = useRef(null);
  const cardStreamRef = useRef(null);
  const cardLineRef = useRef(null);
  const speedValueRef = useRef(null);
  const inspirationCreditRef = useRef(null);

  useEffect(() => {
    // Expose globals for button onclicks if needed, but we'll handle in React
    window.toggleAnimation = toggleAnimation;
    window.resetPosition = resetPosition;
    window.changeDirection = changeDirection;

    // Initialize after refs are set
    const init = () => {
      console.log('Initializing controllers...');
      if (cardStreamRef.current && cardLineRef.current && speedValueRef.current) {
        cardStream = new CardStreamController();
      }

      window.setScannerScanning = (active) => {
       
      };
    };

    // Delay init to ensure DOM is ready
    const timeoutId = setTimeout(init, 0);
    return () => {
      clearTimeout(timeoutId);
      // Cleanup
      if (particleSystem) particleSystem.destroy();
      if (particleScanner) particleScanner.destroy();
    };
  }, []);

  // Global vars for controllers (in real app, use state or context)
  let cardStream;
  let particleSystem;
  let particleScanner;

  const toggleAnimation = () => {
    if (cardStream) cardStream.toggleAnimation();
  };

  const resetPosition = () => {
    if (cardStream) cardStream.resetPosition();
  };

  const changeDirection = () => {
    if (cardStream) cardStream.changeDirection();
  };

  // CardStreamController class (adapted for refs, with fixed clipping logic)
  class CardStreamController {
    constructor() {
      this.container = cardStreamRef.current;
      this.cardLine = cardLineRef.current;
      this.speedIndicator = speedValueRef.current;

      this.position = -200; // Offset slightly left so first cards enter from right immediately
      this.velocity = 120;
      this.direction = -1;
      this.isAnimating = true;
      this.isDragging = false;

      this.lastTime = 0;
      this.lastMouseX = 0;
      this.mouseVelocity = 0;
      this.friction = 0.95;
      this.minVelocity = 30;

      this.containerWidth = 0;
      this.cardLineWidth = 0;

      this.init();
    }

    init() {
      this.populateCardLine();
      this.calculateDimensions();
      this.bindScroll();
      // this.setupEventListeners();
      // this.updateCardPosition();

  this.bindScroll();
      // this.animate();
      // this.startPeriodicUpdates();
    }
bindScroll() {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll progress (0 → 1)
    const progress = Math.min(scrollTop / scrollHeight, 1);

    // Update clipping directly
    const wrapper = this.cardLine.querySelector(".scanner-card-wrapper");
    const normalCard = wrapper.querySelector(".scanner-card-normal");
    const asciiCard = wrapper.querySelector(".scanner-card-ascii");

    normalCard.style.setProperty("--clip-left", `${progress * 100}%`);
    asciiCard.style.setProperty("--clip-right", `${100 - progress * 100}%`);
  });
}
    calculateDimensions() {
      this.containerWidth = this.container.offsetWidth;
      const cardWidth = 400;
      const cardGap = 60;
      const cardCount = this.cardLine.children.length;
      this.cardLineWidth = (cardWidth + cardGap) * cardCount;
      console.log('Dimensions calculated:', { containerWidth: this.containerWidth, cardLineWidth: this.cardLineWidth, cardCount });
    }

    setupEventListeners() {
      this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
      document.addEventListener("mousemove", (e) => this.onDrag(e));
      document.addEventListener("mouseup", () => this.endDrag());

      this.cardLine.addEventListener(
        "touchstart",
        (e) => this.startDrag(e.touches[0]),
        { passive: false }
      );
      document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), {
        passive: false,
      });
      document.addEventListener("touchend", () => this.endDrag());

      this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));
      this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
      this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());

      window.addEventListener("resize", () => this.calculateDimensions());
    }

    startDrag(e) {
      e.preventDefault();

      this.isDragging = true;
      this.isAnimating = false;
      this.lastMouseX = e.clientX;
      this.mouseVelocity = 0;

      const transform = window.getComputedStyle(this.cardLine).transform;
      if (transform !== "none") {
        const matrix = new DOMMatrix(transform);
        this.position = matrix.m41;
      }

      this.cardLine.style.animation = "none";
      this.cardLine.classList.add("scanner-dragging");

      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    }

    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();

      const deltaX = e.clientX - this.lastMouseX;
      this.position += deltaX;
      this.mouseVelocity = deltaX * 60;
      this.lastMouseX = e.clientX;

      this.cardLine.style.transform = `translateX(${this.position}px)`;
      this.updateCardClipping();
    }

    endDrag() {
      if (!this.isDragging) return;

      this.isDragging = false;
      this.cardLine.classList.remove("scanner-dragging");

      if (Math.abs(this.mouseVelocity) > this.minVelocity) {
        this.velocity = Math.abs(this.mouseVelocity);
        this.direction = this.mouseVelocity > 0 ? 1 : -1;
      } else {
        this.velocity = 120;
      }

      this.isAnimating = true;
      this.updateSpeedIndicator();

      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    animate() {
      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      if (this.isAnimating && !this.isDragging) {
        if (this.velocity > this.minVelocity) {
          this.velocity *= this.friction;
        } else {
          this.velocity = Math.max(this.minVelocity, this.velocity);
        }

        this.position += this.velocity * this.direction * deltaTime;
        this.updateCardPosition();
        this.updateSpeedIndicator();
      }

      requestAnimationFrame(() => this.animate());
    }

    updateCardPosition() {
      const containerWidth = this.containerWidth;
      const cardLineWidth = this.cardLineWidth;

      if (this.position < -cardLineWidth) {
        this.position = containerWidth;
      } else if (this.position > containerWidth) {
        this.position = -cardLineWidth;
      }

      this.cardLine.style.transform = `translateX(${this.position}px)`;
      this.updateCardClipping();
    }

    updateSpeedIndicator() {
      this.speedIndicator.textContent = Math.round(this.velocity);
    }

    toggleAnimation() {
      this.isAnimating = !this.isAnimating;
      const btn = controlsRef.current.querySelector(".scanner-control-btn");
      if (btn) {
        btn.innerHTML = this.isAnimating ? "⏸️ Pause" : "▶️ Play";
      }

      if (this.isAnimating) {
        this.cardLine.style.animation = "none";
      }
    }

    resetPosition() {
      this.position = -200; // Ensure first cards visible on reset
      this.velocity = 120;
      this.direction = -1;
      this.isAnimating = true;
      this.isDragging = false;

      this.cardLine.style.animation = "none";
      this.cardLine.style.transform = `translateX(${this.position}px)`;
      this.cardLine.classList.remove("scanner-dragging");

      this.updateSpeedIndicator();

      const btn = controlsRef.current.querySelector(".scanner-control-btn");
      if (btn) btn.innerHTML = "⏸️ Pause";
      console.log('Reset position:', this.position);
    }

    changeDirection() {
      this.direction *= -1;
      this.updateSpeedIndicator();
    }

    onWheel(e) {
      e.preventDefault();

      const scrollSpeed = 20;
      const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;

      this.position += delta;
      this.updateCardPosition();
      this.updateCardClipping();
    }

    generateCode(width, height) {
      const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const pick = (arr) => arr[randInt(0, arr.length - 1)];

      const header = [
        "// compiled preview • scanner demo",
        "/* generated for visual effect – not executed */",
        "const SCAN_WIDTH = 8;",
        "const FADE_ZONE = 35;",
        "const MAX_PARTICLES = 2500;",
        "const TRANSITION = 0.05;",
      ];

      const helpers = [
        "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
        "function lerp(a, b, t) { return a + (b - a) * t; }",
        "const now = () => performance.now();",
        "function rng(min, max) { return Math.random() * (max - min) + min; }",
      ];

      const particleBlock = (idx) => [
        `class Particle${idx} {`,
        "  constructor(x, y, vx, vy, r, a) {",
        "    this.x = x; this.y = y;",
        "    this.vx = vx; this.vy = vy;",
        "    this.r = r; this.a = a;",
        "  }",
        "  step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; }",
        "}",
      ];

      const scannerBlock = [
        "const scanner = {",
        "  x: Math.floor(window.innerWidth / 2),",
        "  width: SCAN_WIDTH,",
        "  glow: 3.5,",
        "};",
        "",
        "function drawParticle(ctx, p) {",
        "  ctx.globalAlpha = clamp(p.a, 0, 1);",
        "  ctx.drawImage(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);",
        "}",
      ];

      const loopBlock = [
        "function tick(t) {",
        "  // requestAnimationFrame(tick);",
        "  const dt = 0.016;",
        "  // update & render",
        "}",
      ];

      const misc = [
        "const state = { intensity: 1.2, particles: MAX_PARTICLES };",
        "const bounds = { w: window.innerWidth, h: 300 };",
        "const gradient = document.createElement('canvas');",
        "const ctx = gradient.getContext('2d');",
        "ctx.globalCompositeOperation = 'lighter';",
        "// ascii overlay is masked with a 3-phase gradient",
      ];

      const library = [];
      header.forEach((l) => library.push(l));
      helpers.forEach((l) => library.push(l));
      for (let b = 0; b < 3; b++) particleBlock(b).forEach((l) => library.push(l));
      scannerBlock.forEach((l) => library.push(l));
      loopBlock.forEach((l) => library.push(l));
      misc.forEach((l) => library.push(l));

      for (let i = 0; i < 40; i++) {
        const n1 = randInt(1, 9);
        const n2 = randInt(10, 99);
        library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`);
      }
      for (let i = 0; i < 20; i++) {
        library.push(`if (state.intensity > ${1 + (i % 3)}) { scanner.glow += 0.01; }`);
      }

      let flow = library.join(" ");
      flow = flow.replace(/\s+/g, " ").trim();
      const totalChars = width * height;
      while (flow.length < totalChars + width) {
        const extra = pick(library).replace(/\s+/g, " ").trim();
        flow += " " + extra;
      }

      let out = "";
      let offset = 0;
      for (let row = 0; row < height; row++) {
        let line = flow.slice(offset, offset + width);
        if (line.length < width) line = line + " ".repeat(width - line.length);
        out += line + (row < height - 1 ? "\n" : "");
        offset += width;
      }
      return out;
    }

    calculateCodeDimensions(cardWidth, cardHeight) {
      const fontSize = 11;
      const lineHeight = 13;
      const charWidth = 6;
      const width = Math.floor(cardWidth / charWidth);
      const height = Math.floor(cardHeight / lineHeight);
      return { width, height, fontSize, lineHeight };
    }

    createCardWrapper(index) {
      const wrapper = document.createElement("div");
      wrapper.className = "scanner-card-wrapper";

      const normalCard = document.createElement("div");
      normalCard.className = "scanner-card scanner-card-normal";

      const cardImages = [
        "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
        "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
        "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
        "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
        "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
      ];

      const cardImage = document.createElement("img");
      cardImage.className = "scanner-card-image";
      cardImage.src = cardImages[index % cardImages.length];
      cardImage.alt = "Credit Card";

      cardImage.onerror = () => {
        console.log(`Image failed for card ${index}, using fallback`);
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, 400, 250);
        gradient.addColorStop(0, "#667eea");
        gradient.addColorStop(1, "#764ba2");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 250);

        cardImage.src = canvas.toDataURL();
      };

      normalCard.appendChild(cardImage);

      const asciiCard = document.createElement("div");
      asciiCard.className = "scanner-card scanner-card-ascii";

      const asciiContent = document.createElement("div");
      asciiContent.className = "scanner-ascii-content";

      const { width, height, fontSize, lineHeight } = this.calculateCodeDimensions(400, 250);
      asciiContent.style.fontSize = fontSize + "px";
      asciiContent.style.lineHeight = lineHeight + "px";
      asciiContent.textContent = this.generateCode(width, height);

      asciiCard.appendChild(asciiContent);
      wrapper.appendChild(normalCard);
      wrapper.appendChild(asciiCard);

      return wrapper;
    }
updateCardClipping() {
  const scannerX = window.innerWidth / 2;
  const scannerWidth = 8;
  const scannerLeft = scannerX - scannerWidth / 2;
  const scannerRight = scannerX + scannerWidth / 2;
  let anyScanningActive = false;

  document.querySelectorAll(".scanner-card-wrapper").forEach((wrapper) => {
    const rect = wrapper.getBoundingClientRect();
    const cardLeft = rect.left;
    const cardRight = rect.right;
    const cardWidth = rect.width;

    const normalCard = wrapper.querySelector(".scanner-card-normal");
    const asciiCard = wrapper.querySelector(".scanner-card-ascii");

    // Beam intersects card
    if (cardLeft < scannerRight && cardRight > scannerLeft) {
      anyScanningActive = true;

      // distance of the beam across the card
      const intersectLeft = Math.max(scannerLeft - cardLeft, 0);
      const intersectRight = Math.min(scannerRight - cardLeft, cardWidth);

      // Percent progress through the card
      const progress = intersectRight / cardWidth;

      // Hide image from left → right
      normalCard.style.setProperty("--clip-left", `${progress * 100}%`);

      // Reveal ASCII from left → right — only clip the *right* side
      const remaining = 100 - progress * 100;
      asciiCard.style.setProperty("--clip-right", `${remaining}%`);

      if (!wrapper.hasAttribute("data-scanned") && intersectLeft > 0) {
        wrapper.setAttribute("data-scanned", "true");
        const scanEffect = document.createElement("div");
        scanEffect.className = "scanner-scan-effect";
        wrapper.appendChild(scanEffect);
        setTimeout(() => scanEffect.remove(), 600);
      }
    } else {
      // Reset visibility
      if (cardRight < scannerLeft) {
        // Left side (beam passed): fully ASCII
        normalCard.style.setProperty("--clip-left", "100%");
        asciiCard.style.setProperty("--clip-right", "0%");
      } else if (cardLeft > scannerRight) {
    
        normalCard.style.setProperty("--clip-left", "0%");
        asciiCard.style.setProperty("--clip-right", "100%");
      }
      wrapper.removeAttribute("data-scanned");
    }
  });

  if (window.setScannerScanning) {
    window.setScannerScanning(anyScanningActive);
  }
}

    updateAsciiContent() {
      document.querySelectorAll(".scanner-ascii-content").forEach((content) => {
        if (Math.random() < 0.15) {
          const { width, height } = this.calculateCodeDimensions(400, 250);
          content.textContent = this.generateCode(width, height);
        }
      });
    }

populateCardLine() {
  this.cardLine.innerHTML = "";
  const cardWrapper = this.createCardWrapper(0);
  this.cardLine.appendChild(cardWrapper);
  this.cardLine.style.justifyContent = "center";
}
    startPeriodicUpdates() {
      setInterval(() => {
        this.updateAsciiContent();
      }, 200);

      const updateClipping = () => {
        this.updateCardClipping();
        requestAnimationFrame(updateClipping);
      };
      updateClipping();
    }
  }



  return (
    <>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div ref={controlsRef} className="scanner-controls">
          <button
            className="scanner-control-btn"
            onClick={toggleAnimation}
          >
            ⏸️ Pause
          </button>
          <button
            className="scanner-control-btn"
            onClick={resetPosition}
          >
            🔄 Reset
          </button>
          <button
            className="scanner-control-btn"
            onClick={changeDirection}
          >
            ↔️ Direction
          </button>
        </div>

        <div ref={speedIndicatorRef} className="scanner-speed-indicator">
          Speed: <span ref={speedValueRef} id="speedValue">120</span> px/s
        </div>
<div style={{ height: "300vh" }} />
        <div ref={containerRef} className="scanner-container">

          <canvas ref={scannerCanvasRef} id="scannerCanvas" />
          <div ref={scannerRef} className="scanner-scanner" />

          <div ref={cardStreamRef} className="scanner-card-stream">
            <div ref={cardLineRef} id="cardLine" className="scanner-card-line" />
          </div>
        </div>

        <div className="scanner-inspiration-credit" ref={inspirationCreditRef}>
          Inspired by{' '}
          <a href="https://evervault.com/" target="_blank" rel="noopener noreferrer">
            @evervault.com
          </a>
        </div>
      </div>

      {/* Updated CSS with prefix */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
body {
  background: #000000;
  min-height: 100vh;
  overflow: auto; /* ✅ allow scrolling */
  font-family: "Arial", sans-serif;
}

        .scanner-controls {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
          z-index: 100;
        }

        .scanner-control-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .scanner-control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .scanner-speed-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          font-size: 16px;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(5px);
          z-index: 100;
        }

        .scanner-info {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.9);
          text-align: center;
          font-size: 14px;
          background: rgba(0, 0, 0, 0.3);
          padding: 15px 25px;
          border-radius: 20px;
          backdrop-filter: blur(5px);
          z-index: 100;
          line-height: 1.4;
        }

.scanner-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.scanner-card-stream {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  pointer-events: none;
}
        .scanner-card-line {
          display: flex;
          align-items: center;
          gap: 60px;
          white-space: nowrap;
          cursor: grab;
          user-select: none;
          will-change: transform;
        }

        .scanner-card-line:active {
          cursor: grabbing;
        }

        .scanner-card-line.scanner-dragging {
          cursor: grabbing;
        }

        .scanner-card-line.scanner-css-animated {
          animation: scanner-scrollCards 40s linear infinite;
        }

        @keyframes scanner-scrollCards {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        .scanner-card-wrapper {
          position: relative;
          width: 400px;
          height: 250px;
          flex-shrink: 0;
        }

        .scanner-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
        }

        .scanner-card-normal {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          color: white;
          z-index: 2;
          position: relative;
          overflow: hidden;
  clip-path: inset(0 0 0 var(--clip-left, 0%));
        }

        .scanner-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          transition: all 0.3s ease;
          filter: brightness(1.1) contrast(1.1);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .scanner-card-image:hover {
          filter: brightness(1.2) contrast(1.2);
        }

        .scanner-card-ascii {
          background: transparent;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
  clip-path: inset(0 var(--clip-right, 100%) 0 0);
  
        }

        .scanner-card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          border-radius: 5px;
          position: relative;
          margin-bottom: 20px;
        }

        .scanner-card-chip::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          bottom: 3px;
          background: linear-gradient(45deg, #e6c200, #f4d03f);
          border-radius: 2px;
        }

        .scanner-contactless {
          position: absolute;
          top: 60px;
          left: 20px;
          width: 25px;
          height: 25px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
        }

        .scanner-contactless::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 15px;
          height: 15px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
        }

        .scanner-card-number {
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 3px;
          margin-bottom: 15px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .scanner-card-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .scanner-card-holder {
          color: white;
          font-size: 14px;
          text-transform: uppercase;
        }

        .scanner-card-expiry {
          color: white;
          font-size: 14px;
        }

        .scanner-card-logo {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .scanner-ascii-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: rgba(220, 210, 255, 0.6);
          font-family: "Courier New", monospace;
          font-size: 11px;
          line-height: 13px;
          overflow: hidden;
          white-space: pre;
          animation: scanner-glitch 0.1s infinite linear alternate-reverse;
          margin: 0;
          padding: 0;
          text-align: left;
          vertical-align: top;
          box-sizing: border-box;
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 30%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 30%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }

        @keyframes scanner-glitch {
          0% {
            opacity: 1;
          }
          15% {
            opacity: 0.9;
          }
          16% {
            opacity: 1;
          }
          49% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          99% {
            opacity: 0.9;
          }
          100% {
            opacity: 1;
          }
        }

        .scanner-scanner {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 300px;
          border-radius: 30px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(0, 255, 255, 0.8),
            rgba(0, 255, 255, 1),
            rgba(0, 255, 255, 0.8),
            transparent
          );
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4);
          animation: scanner-scanPulse 2s ease-in-out infinite alternate;
          z-index: 10;
        }

        @keyframes scanner-scanPulse {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scaleY(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1.1);
          }
        }

        .scanner-scanner-label {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(0, 255, 255, 0.9);
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .scanner-scan-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 255, 0.4),
            transparent
          );
          animation: scanner-scanEffect 0.6s ease-out;
          pointer-events: none;
          z-index: 5;
        }

        @keyframes scanner-scanEffect {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .scanner-instructions {
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          max-width: 200px;
          text-align: right;
          z-index: 5;
        }

        #particleCanvas {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100vw;
          height: 250px;
          z-index: 0;
          pointer-events: none;
        }

        #scannerCanvas {
          position: absolute;
          top: 50%;
          left: -3px;
          transform: translateY(-50%);
          width: 100vw;
          height: 300px;
          z-index: 15;
          pointer-events: none;
        }

        .scanner-inspiration-credit {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: "Roboto Mono", monospace;
          font-size: 12px;
          font-weight: 900;
          color: #ff9a9c;
          z-index: 1000;
          text-align: center;
        }

        .scanner-inspiration-credit a {
          color: #ff9a9c;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .scanner-inspiration-credit a:hover {
          color: #ff7a7c;
        }
      `}</style>
    </>
  );
};

function CircleReveal() {
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const section = document.querySelector(".circle-section");
    const circle = document.querySelector(".circle.yellow");
    const panels = gsap.utils.toArray(".panel");
    const panelTrack = document.querySelector(".panel-track");
    const numPanels = panels.length;

    if (!circle || !panelTrack) return;


    const scrollTween = gsap.to(panelTrack, {
      xPercent: -100 * (numPanels - 1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=6000",
        scrub: 1,
        pin: true,
      },
    });

    // circle color transitions
    const circleWidth = circle.offsetWidth;
    const colors = [".circle.red", ".circle.blue", ".circle.purple", ".circle.green", ".circle.pink"];

    colors.forEach((selector, i) => {
      const colorCircle = document.querySelector(selector);
      const triggerPanel = panels[i];
      if (!colorCircle || !triggerPanel) return;

      ScrollTrigger.create({
        trigger: triggerPanel,
        containerAnimation: scrollTween,
        scrub: true,
        start: () => `left center+=${circleWidth / 2}`,
        end: () => `left center-=${circleWidth / 2}`,
        onUpdate: (self) => {
          const pct = 100 - self.progress * 100;
          gsap.set(colorCircle, { clipPath: `inset(0% 0% 0% ${pct}%)` });
        },
      });
    });


    panels.forEach((panel) => {
      const el = panel.querySelector("h2");
      if (!el) return;

      const split = new SplitText(el, { type: "chars, words", charsClass: "chars" });

      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: el,
          containerAnimation: scrollTween, 
          start: "left 80%",
          end: "left 20%",
          toggleActions: "play none none none",
          markers: false,
        },
        y: 15,
        opacity: 0,
        stagger: 0.06,
        duration: 1.2,
        ease: "power3.out",
      });
    });
  });

  return () => ctx.revert();
}, []);
    const panelsRef = useRef(null);
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const colorLerp = (color1, color2, amount) => {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const r = Math.round(r1 + (r2 - r1) * amount);
  const g = Math.round(g1 + (g2 - g1) * amount);
  const b = Math.round(b1 + (b2 - b1) * amount);
  return rgbToHex(r, g, b);
};

  return (
    <section className="circle-section">
      <div className="pinned-content">
     

        <div className="left-text">
          <h3>
            Your Treatment
            <br />
            Your Pace
          </h3>
        </div>

        <div className="circle-wrapper">
          <div className="circle yellow" />
          <div className="circle red" />
          <div className="circle blue" />
<div className="circle purple">
            <svg
              viewBox="0 0 400 400"
              className="ring-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              {Array.from({ length: 40 }).map((_, i) => {
                const r = 200 - i * 4;
                const t = i / 39;
                const colors = ["#B8E3E9", "#E6E6FA", "#FFDAB9"]; // blue, lavender, peach
                const segment = Math.floor(t * 3);
                const localT = (t * 3) % 1;
                const startColor = colors[segment % 3];
                const endColor = colors[(segment + 1) % 3];
                const stroke = colorLerp(startColor, endColor, localT);

                return (
                  <circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={r}
                    stroke={stroke}
                    strokeWidth="1.3"
                    fill="none"
                    opacity={1 - t * 0.1}
                    style={{ filter: `drop-shadow(0 0 ${1 + t * 2}px rgba(255, 182, 193, 0.2))` }} // subtle pinkish glow for inner spiral vibe
                  />
                );
              })}
            </svg>
          </div>
          <div className="circle green" />
          <div className="circle pink" />
        </div>

 <div className="panel-track" ref={panelsRef}>
      <div className="panel">
        <h2>Complimentary Consultation</h2>
        <p>Initial consultations are always free of charge.</p>
      </div>
      <div className="panel">
        <h2>Timeline</h2>
        <p>Payment plans typically span 12–24 months.</p>
      </div>
      <div className="panel">
        <h2>Total Flexibility</h2>
        <p>
          Instant approvals and flexible financing with Klarna and OrthoBanc.
        </p>
      </div>
      <div className="panel">
        <h2>Transparency</h2>
        <p>All inclusive pricing — no hidden fees or unexpected add-ons.</p>
      </div>
      <div className="panel">
        <h2>Support</h2>
        <p>Continued care and follow-up for one year after treatment.</p>
      </div>
    </div>
      </div>

      <style jsx>{`
        .circle-section {
          position: relative;
          height: 300vh;
   background: #FEF9F8;
          overflow: hidden;
        }
.ring-svg {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  // filter: drop-shadow(0 0 10px rgba(170, 130, 255, 0.3))
  //         drop-shadow(0 0 20px rgba(60, 214, 210, 0.2));

}

        .pinned-content {
          position: relative;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          z-index: 0;
        }

     


        .left-text {
          position: absolute;
          left: 5%;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          width: 20vw;
        }

        .left-text h3 {
          font-family: "NeueHaasGroteskDisplayPro45Light";
          font-size: 1.8rem;
          line-height: 1.2;
        }

        .circle-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .circle {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          clip-path: inset(0% 0% 0% 100%);
        }

        .circle.yellow {
          background: #f5ff7d;
          z-index: 1;
          clip-path: inset(0% 0% 0% 0%);
        }

        .circle.red {
          background: #ff4d4d;
          z-index: 2;
        }

        .circle.blue {
          background: #4d7dff;
          z-index: 3;
        }

        .circle.purple {
          width: 400px;
  height: 400px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
          background: #FEF9F8;
  z-index: 4;
        }

        .circle.green {
          background: #91ff91;
          z-index: 5;
        }

        .circle.pink {
          background: #ff7fbf;
          z-index: 6;
        }

        .panel-track {
          position: absolute;
          top: 0;
          right: 0;
          height: 100vh;
          display: flex;
          flex-direction: row;
          z-index: 5;
          transform: translateX(100%);
          will-change: transform;
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          height: 100vh;
          width: 30vw;
          padding: 3rem;
          border-left: 1px solid rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
      background: rgba(255, 255, 255, 0.3); 
          justify-content: flex-start;
          padding-top: calc(66vh);
        }

        .panel h2 {
          font-size: 1.4rem;
          font-family: "NeueHaasGroteskDisplayPro45Light";
          margin-bottom: 0.5rem;
          color: #111;
        }

        .panel p {
          font-size: 1rem;
          font-family: "NeueHaasGroteskDisplayPro45Light";
          line-height: 1.5;
          color: #333;
        }
      `}</style>
    </section>
  );
}

const ScrollAnimation = () => {
  const stickySectionRef = useRef(null);
  const cardRefs = useRef([]);
  const textSectionRef = useRef(null);

  const cardsData = [
    {
      title: "Complimentary Consultation",
      description: "Initial consultations are always free of charge",
    },
    {
      title: "Payment Plans are Available",
      description: "We offer payment plans through Klarna and Ortho Banc",
    },
    {
      title: "No Hidden Fees",
      description:
        "Comprehensive treatment plans include a set of retainers and supervision",
    },
    {
      title: "One Year Post-Treatment Follow-Up",
      description: "",
    },
  ];

  const addToRefs = (el, index) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current[index] = el;
    }
  };

  useEffect(() => {
    const stickySection = stickySectionRef.current;
    const cards = cardRefs.current;
    const stickyHeight = window.innerHeight * 5;

    const transforms = [
      [
        [10, 50, -10, 10],
        [20, -10, -45, 20],
      ],
      [
        [0, 47.5, -10, 15],
        [-25, 15, -45, 30],
      ],
      [
        [0, 52.5, -10, 5],
        [15, -5, -40, 60],
      ],
      [
        [0, 50, 30, -80],
        [20, -10, 60, 5],
      ],
      [
        [0, 55, -15, 30],
        [25, -15, 60, 95],
      ],
    ];

    ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${stickyHeight}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        cards.forEach((card, index) => {
          if (!card) return;

          const delay = index * 0.1125;
          const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

          if (cardProgress > 0) {
            const cardStartX = 25;
            const cardEndX = -650;
            const yPos = transforms[index][0];
            const rotations = transforms[index][1];

            const cardX = gsap.utils.interpolate(
              cardStartX,
              cardEndX,
              cardProgress
            );

            const yProgress = cardProgress * 3;
            const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
            const yInterpolation = yProgress - yIndex;
            const cardY = gsap.utils.interpolate(
              yPos[yIndex],
              yPos[yIndex + 1],
              yInterpolation
            );

            const cardRotation = gsap.utils.interpolate(
              rotations[yIndex],
              rotations[yIndex + 1],
              yInterpolation
            );

            gsap.set(card, {
              xPercent: cardX,
              yPercent: cardY,
              rotation: cardRotation,
              opacity: 1,
            });
          } else {
            gsap.set(card, { opacity: 0 });
          }
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);



  
  return (
    <div className="relative">
  
      <section 
        className="movingcard-sticky-section h-screen w-full relative" 
        ref={stickySectionRef}
      >

        <div 
          className="absolute inset-0 flex flex-col items-center justify-center z-0"
          ref={textSectionRef}
        >
          <div className="w-full max-w-5xl px-8">
<h1 className="text-[3vw] sm:text-[4vw] lg:text-[3.5vw] font-neuehaas45 text-white leading-[1.1]">
  Orthodontic treatment is more than just straightening teeth —
  it’s about setting the foundation for long-term health, confidence,<br />
  and facial harmony.
</h1>
<div className="font-neuehaas45 mt-10 max-w-xl text-[16px] text-white leading-[1.2] mx-auto">

    While many orthodontists offer Invisalign or braces, the difference lies in how they approach treatment — what they’re aiming to achieve, and how precisely they execute it. Advances in modern orthodontics now allow us to do far more than align teeth. We can optimize jaw positioning, enhance facial balance, and design results that feel both natural and transformative.
    We understand that cost matters — but choosing an orthodontist is ultimately about trust. Who do you believe will deliver the best result? Who sees the full picture, not just the teeth? A slightly lower fee might save money in the short term, but true value comes from results that last a lifetime.

 
</div>

          </div>
        </div>

        {cardsData.map((card, index) => (
          <div
            className="movingcard-card absolute z-10"
            key={index}
            ref={(el) => addToRefs(el, index)}
          >
            <div className="movingcard-content">
              <div className="movingcard-title">
                <h2 className="movingcard-title-text font-neuehaas45">{card.title}</h2>
              </div>
              <div className="movingcard-description">
                <p className="movingcard-description-text font-neuehaas45">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>


    </div>
  );
};

const FinancingTreatment = () => {



  

  // const containerRef = useRef(null);
  // const pathRef = useRef(null);
  // const dottedEllipsesRef = useRef([]);
  // const [ellipseFinalY, setEllipseFinalY] = useState(null);
  // const [isEllipseDrawn, setIsEllipseDrawn] = useState(false);
  // const [isOrbScaledDown, setIsOrbScaledDown] = useState(false);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     gsap.fromTo(
  //       containerRef.current,
  //       { opacity: 0 },
  //       { opacity: 1, duration: 2.5, ease: "power2.out" }
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!pathRef.current || !isOrbScaledDown) return;

  //   const path = pathRef.current;
  //   const pathLength = path.getTotalLength();

  //   gsap.set(path, {
  //     strokeDasharray: pathLength,
  //     strokeDashoffset: pathLength,
  //   });

  //   gsap.to(path, {
  //     strokeDashoffset: 0,
  //     duration: 2,
  //     ease: "power2.out",
  //     scrollTrigger: {
  //       trigger: path,
  //       start: "top 80%",
  //       end: "top 30%",
  //       scrub: 1,
  //     },
  //     onComplete: () => setIsEllipseDrawn(true),
  //   });
  // }, [isOrbScaledDown]);

  // useEffect(() => {
  //   if (!isEllipseDrawn) return;

  //   dottedEllipsesRef.current.forEach((el, i) => {
  //     if (el) {
  //       gsap.to(el, {
  //         opacity: 1,
  //         duration: 1,
  //         delay: i * 0.3,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: el,
  //           start: "top 70%",
  //           end: "top 20%",
  //           scrub: true,
  //         },
  //         top: ellipseFinalY ? `${ellipseFinalY + (i + 1) * 20}px` : "50%",
  //       });
  //     }
  //   });
  // }, [isEllipseDrawn]);

  // const ballRef = useRef(null);
  // const sectionRef = useRef(null);

  // useEffect(() => {
  //   gsap.fromTo(
  //     ballRef.current,
  //     { y: 0 },
  //     {
  //       y: 400,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top center",
  //         end: "bottom center",
  //         scrub: true,
  //       },
  //       ease: "power1.out",
  //     }
  //   );
  // }, []);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const drawPathRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
    const stepContent = [
      {
        title: "Complimentary consultation",
        description: "Initial consultations are always free of charge.",
      },
      {
        title: "Payment plans are available",
        description: "We offer a variety of payment plans at no interest.",
      },
      {
        title: "No hidden fees",
        description:
          "Comprehensive treatment plans include retainers and supervision",
      },
    ];
    const section = sectionRef.current;
    const scrollContainer = scrollContainerRef.current;
    const path = drawPathRef.current;

    if (!section || !scrollContainer || !path) return;

    const scrollDistance = scrollContainer.scrollWidth - window.innerWidth;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const mainTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      pinSpacing: false,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        scrollContainer.style.transform = `translateX(${
          -scrollDistance * progress
        }px)`;
        path.style.strokeDashoffset = pathLength * (1 - progress);
      },
    });
    gsap.fromTo(
      textCurveRef.current,
      { attr: { startOffset: "150%" } },
      {
        attr: { startOffset: "-50%" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: true,
        },
        ease: "none",
      }
    );
    const getCriticalPoints = () => {
      const points = [];
      let prevAngle = null;
      const samples = 150;
      const angleThreshold = 0.4; // the more speciifc the angle the more logged steps
      const minProgressDistance = 0.03; // dist etween points
      let lastValidProgress = -Infinity;

      for (let i = 1; i <= samples; i++) {
        const progress = i / samples;
        const currentPoint = path.getPointAtLength(progress * pathLength);
        const prevPoint = path.getPointAtLength(
          ((i - 1) / samples) * pathLength
        );

        const angle = Math.atan2(
          currentPoint.y - prevPoint.y,
          currentPoint.x - prevPoint.x
        );

        // Only count large direction changes
        if (
          prevAngle !== null &&
          Math.abs(angle - prevAngle) > angleThreshold &&
          progress - lastValidProgress >= minProgressDistance
        ) {
          points.push({
            point: currentPoint,
            progress,
            scrollPosition: scrollDistance * progress,
          });
          lastValidProgress = progress;
        }
        prevAngle = angle;
      }

      return points;
    };

    const criticalPoints = getCriticalPoints();

    const textMarkers = criticalPoints.map(
      ({ point, scrollPosition }, index) => {
        const content = stepContent[index] || {
          title: `Phase ${index + 1}`,
          description: "",
        };

        const marker = document.createElement("div");
        marker.className = "path-marker";
        marker.innerHTML = `
      <div class="relative inline-block">

  <img
    src="../images/filleddiamond.svg"
    alt="diamond background"
    class="block w-[400px] h-[400px]"  
  />


  <div
    class="marker-content absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
  >
    <p class="font-neuehaas45 marker-title text-[20px]">
      ${content.title}
    </p>
    <p class="font-neuehaas45 marker-desc">
      ${content.description}
    </p>
  </div>
</div>

      `;

        Object.assign(marker.style, {
          position: "absolute",
          left: `${point.x}px`,
          top: `${point.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: "0",
          willChange: "opacity",
          // border: '2px solid red',
          padding: "4px",
        });

        scrollContainer.appendChild(marker);

        ScrollTrigger.create({
          trigger: section,
          start: `top top+=${scrollPosition - 200}`,
          end: `top top+=${scrollPosition + 200}`,
          scrub: 0.5,
          onEnter: () => gsap.to(marker, { opacity: 1, duration: 0.3 }),
          onLeaveBack: () => gsap.to(marker, { opacity: 0, duration: 0.3 }),
        });

        return marker;
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      textMarkers.forEach((marker) => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      });
    };
      });
  }, []);

  const cubeRef = useRef();

  useEffect(() => {
    gsap.to(cubeRef.current, {
      rotateY: 360,
      rotateX: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
  }, []);

  const textPathRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    if (!textPathRef.current || !svgRef.current) return;

    gsap.to(textPathRef.current, {
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top +=40",
        end: "bottom center",
        scrub: true,
      },
      attr: { startOffset: "100%" },
      ease: "none",
    });
  }, []);

  const curveSvgRef = useRef();
  const textCurveRef = useRef();
  const filterRef = useRef();

  const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const clamp = (val, min, max) => Math.max(Math.min(val, max), min);

  useEffect(() => {
    let pathLength;
    let positionY;
    let svgRect;

    const startOffset = { value: 0, amt: 0.22 };
    const scroll = { value: window.scrollY, amt: 0.17 };
    let entered = false;

    const updateMetrics = () => {
      svgRect = curveSvgRef.current.getBoundingClientRect();
      positionY = svgRect.top + window.scrollY;
      pathLength = curveSvgRef.current.querySelector("path").getTotalLength();
    };

    const computeOffset = () => {
      return map(
        positionY - window.scrollY,
        window.innerHeight,
        0,
        pathLength,
        -pathLength / 2
      );
    };

    const updateTextOffset = () => {
      if (textCurveRef.current) {
        textCurveRef.current.setAttribute("startOffset", startOffset.value);
      }
    };

    const updateFilter = (distance) => {
      const maxScale = parseFloat(filterRef.current?.dataset.maxScale || 100);
      const minScale = parseFloat(filterRef.current?.dataset.minScale || 0);
      const newScale = clamp(
        map(distance, 0, 200, minScale, maxScale),
        minScale,
        maxScale
      );
      if (filterRef.current) {
        filterRef.current.scale.baseVal = newScale;
      }
    };

    const update = () => {
      const currentOffset = computeOffset();
      startOffset.value = !entered
        ? currentOffset
        : lerp(startOffset.value, currentOffset, startOffset.amt);
      updateTextOffset();

      const currentScroll = window.scrollY;
      scroll.value = !entered
        ? currentScroll
        : lerp(scroll.value, currentScroll, scroll.amt);
      const distance = Math.abs(scroll.value - currentScroll);
      updateFilter(distance);

      if (!entered) entered = true;
    };

    const render = () => {
      update();
      requestAnimationFrame(render);
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    render();

    return () => {
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  const starRef = useRef(null);
  useEffect(() => {
    const svg = starRef.current;
    const group = svg.querySelector(".shape-wrapper");
    const content = svg.querySelector(".scrolling-content");

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleFactor = Math.min(viewportWidth, viewportHeight) / 162;

    gsap.set(group, {
      scale: 0.1,
      opacity: 0,
      transformOrigin: "center center",
    });

    gsap.set(content, {
      opacity: 0,
      y: "20%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: "center center",
        end: "+=1500",
        scrub: 1,
        markers: false,
        pin: true,
        toggleActions: "play none none reverse",
      },
    });

    tl.to(group, {
      opacity: 1,
      duration: 0.5,
    })
      .to(group, {
        rotation: 130,
        scale: scaleFactor * 1.1,
        duration: 4,
        ease: "none",
      })
      .to(
        content,
        {
          opacity: 1,
          y: "0%",
          duration: 2,
          ease: "power2.out",
        },
        "-=2"
      );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressInterval = useRef(null);
  const loadingDelay = useRef(null);

  useEffect(() => {
    startLoadingAnimation();

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (loadingDelay.current) clearTimeout(loadingDelay.current);
    };
  }, []);

  const startLoadingAnimation = () => {
    loadingDelay.current = setTimeout(() => {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval.current);
            setTimeout(reverseAnimation, 300);
          }
          return newProgress;
        });
      }, 300);
    }, 2000);
  };

  const reverseAnimation = () => {
    setIsComplete(true);
  };

  const processingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoadingAnimation();
          observer.disconnect();
        }
      },
      { threshold: 1 }
    );

    if (processingRef.current) {
      observer.observe(processingRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const svgPathRef = useRef();
  const pathRef = useRef();
  const dotRef = useRef();

  useEffect(() => {
    if (!pathRef.current || !dotRef.current) return;

    gsap.set(dotRef.current, {
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.5],
        start: 0,
        end: 0,
      },
    });

    gsap.to(dotRef.current, {
      scrollTrigger: {
        trigger: svgPathRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
      motionPath: {
        path: pathRef.current,
        align: pathRef.current,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      scale: 1,
      transformOrigin: "center center",
      ease: "none",
    });

    gsap.to(dotRef.current, {
      scrollTrigger: {
        trigger: svgPathRef.current,
        start: "bottom center",
        end: "+=100%",
        scrub: true,
        pin: true,
      },
      scale: 250,
      ease: "power1.inOut",
    });
  }, []);

  const lineRef = useRef();

  useEffect(() => {
    const path = lineRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
    });
  }, []);
  const textRef = useRef(null);
  const trackRef = useRef(null);
  const shapeRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(shapeRef.current, {
        duration: 1,
        scale: 30,
        rotate: 240,
        ease: "expo.in",
      })
      .to(
        textRef.current,
        {
          duration: 1,
          x: 0,
          ease: "power2.in",
        },
        0
      );

    const handleScroll = () => {
      const progress =
        window.pageYOffset / (document.body.offsetHeight - window.innerHeight);
      tl.current.progress(progress);
      document.body.style.setProperty("--scroll", progress);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      tl.current.kill();
    };
  }, []);
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
      vec2 st = gl_FragCoord.xy / u_resolution;
      float x = st.x, y = st.y;
    
      vec3 peachDust = vec3(0.89, 0.75, 0.65);
      vec3 mauveDust = vec3(0.82, 0.78, 0.88);
      vec3 duskBase  = vec3(0.92, 0.90, 0.92);
    
      // Distance from bottom-left
      float dist = length(st - vec2(0.0, 0.0));
    
      // Increase peach reach by bumping 0.7 → 0.9
      float peachWeight = smoothstep(2.1, 0.0, dist);
    
      vec3 blendColor = mix(mauveDust, peachDust, peachWeight);
      vec3 color = mix(blendColor, duskBase, 0.22);
    
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
  const arcRef = useRef(null);

  useEffect(() => {
    const arc = arcRef.current;

    arc.style.strokeDasharray = "100 250";
    arc.style.strokeDashoffset = "100";

    arc.getBoundingClientRect();

    arc.style.transition = "stroke-dashoffset 1.2s ease-out";
    arc.style.strokeDashoffset = "0";
  }, []);

  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  useEffect(() => {
    gsap.to(text2Ref.current, {
      duration: 1.5,
      text: "Your treatment, Your pace",
      ease: "none",
    });

    gsap.to(text3Ref.current, {
      duration: 1.2,
      text: "Got questions? Text us anytime and a team member will personally walk you through your options.",
      ease: "none",
    });
  }, []);

  const cardRef = useRef();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(cardRef.current, {
      scale: 0.85,
      ease: "none",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <>


      <div>
        <CircleReveal />
        {/* <CardScanner /> */}
        {/* <ScrollAnimation /> */}
        <canvas
          id="shader-bg"
          className="fixed top-0 left-0 w-full min-h-screen z-[-1] pointer-events-none"
        />
        <div className="relative z-0 h-screen w-full">

        <div ref={cardRef} className="relative">

          <div className="h-screen flex justify-center items-center">
            <div
              style={{
                padding: "20px",
                background: "rgba(0, 0, 0, 0.05)",
                boxShadow: `
                    inset 1px 1.5px 2px rgba(255, 255, 255, 0.6),
                    inset 1px -0.5px 2px rgba(255, 255, 255, 0.3),
                    0 0.6px 0.6px -1.25px rgba(0, 0, 0, 0.18),
                    0 2.29px 2.29px -2.5px rgba(0, 0, 0, 0.16),
                    0 10px 10px -3.75px rgba(0, 0, 0, 0.06)
                  `,
                backdropFilter: "blur(45px)",
                WebkitBackdropFilter: "blur(45px)",
                borderRadius: "30px",
              }}
              className="h-[90vh] max-w-7xl p-10"
            >
              {/* <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[140px] rounded-full top-1/3 left-[-140px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute w-[400px] h-[400px] bg-orange-500 opacity-20 blur-[140px] rounded-full top-[40%] left-[-100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute w-[400px] h-[400px] bg-sky-300 opacity-30 blur-[140px] rounded-full top-1/4 right-[-120px] pointer-events-none"></div> */}

              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="relative backdrop-blur-xl bg-white/70  shadow-[0_0_0_1px_rgba(255,255,255,0.5)] border border-white border-[4px] rounded-[8px] p-10">
                    <div className="absolute top-4 right-4 w-4 h-5 text-white text-xs flex items-center justify-center "></div>
                    <div className="space-y-2">
                      <span className="inline-block bg-black/10 text-[10px] uppercase px-3 py-2 rounded-full text-gray-600 font-khteka tracking-wider">
                        Transparent Pricing
                      </span>
                      <div>
                        <h3 className="font-neuehaas45 text-black text-[16px] mb-2">
                          No Hidden Fees
                        </h3>
                        <ul className="list-disc pl-[1.25em] text-sm text-gray-700 font-neuehaas45 space-y-1">
                          <li>All-inclusive pricing — from start to finish.</li>
                          <li>
                            No up-charges for ceramic or “special” braces.
                          </li>
                          <li>No surprise fees or unexpected add-ons.</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-neuehaas45 text-black text-[16px] mb-2">
                          Flexible Monthly Plans
                        </h3>
                        <ul className="list-disc pl-[1.25em] text-sm text-gray-700 font-neuehaas45 space-y-1">
                          <li>Payment plans typically span 12–24 months.</li>
                          <li>
                            A manageable down payment, with monthly plans
                            available
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-md mx-auto mt-4">
                    <svg width="400" height="200" viewBox="0 0 200 100">
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        stroke="grey"
                        stroke-width="6"
                        fill="none"
                      />
                      <path
                        ref={arcRef}
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        stroke="white"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="100 250"
                        strokeLinecap="round"
                      />
                      <text
                        x="100"
                        y="70"
                        font-size="12"
                        text-anchor="middle"
                        fill="black"
                        className="font-neuehaas45"
                      >
                        250/month
                      </text>
                      <text
                        x="70"
                        y="60"
                        font-size="5"
                        text-anchor="end"
                        fill="black"
                        class="font-khteka uppercase"
                      >
                        Starting
                      </text>
                    </svg>

                    <div className="relative mt-4">
                      <div className="h-[1px] bg-black/20 rounded-full"></div>

                      <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-[20%] h-[6px] bg-white rounded-full"></div>

                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>

                      <div className="absolute top-full left-[65%] mt-2 flex flex-col items-center">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
                        <span className="mt-1 font-khteka text-[10px] uppercase">
                          Our price
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    borderRadius: "16px",
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(7.4px)",
                    WebkitBackdropFilter: "blur(7.4px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "2rem",
                  }}
                  className="relative  p-10 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute left-0 top-0.5 shadow-md transition-all"></div>
                    </div>
                    <span className="text-xs text-gray-600 font-neuehaas45">
                      AutoPay Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] text-gray-700 font-neuehaas45">
                      Flexible monthly payments — as low as 0% APR. Exact rate
                      based on your credit profile.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center mt-[2px]">
                      <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-neuehaas45 font-semibold text-sm text-black">
                          Financing.
                        </span>
                        <span className="bg-[#ffe5f2] text-[#7f187f] text-[10px] uppercase px-2 py-0.5 rounded-full font-khteka tracking-wider">
                          Klarna
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-500 mt-0.5 font-neuehaas45">
                        Pay over 6 – 36 months.
                      </p>
                    </div>
                  </div>

                  <ul className="text-sm text-gray-700 font-neuehaas45 space-y-2 mb-4">
                    <li>Instant monthly quote</li>
                    <li>No impact on credit to explore</li>
                  </ul>

                  <div className="w-full bg-gray-200 rounded-full h-[6px] relative mb-1">
                    <div className="bg-[#ffb3d6] h-full rounded-full w-[65%]"></div>
                  </div>
                  {/* <div
                ref={processingRef}
                id="processing"
                className={`absolute inset-0 flex flex-col justify-center items-center ${
                  isComplete ? "complete" : "uncomplete"
                }`}
              >
                <div className="text-[14px] font-neuehaas45 mx-auto text-center">
                  <h1 className="text-[20px]">Processing</h1>
                  <h2 className="text-[14px]">
                    Please wait while we process your request
                  </h2>
                </div>
                <div className="relative mx-auto my-[30px]">
                  <div class="gears">
                    <div class="gear-wrapper gear-wrapper-1">
                      <svg
                        version="1.1"
                        className="gear gear-1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-2">
                      <svg
                        version="1.1"
                        className="gear gear-2"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-3">
                      <svg
                        version="1.1"
                        className="gear gear-3"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                    <div class="gear-wrapper gear-wrapper-4">
                      <svg
                        version="1.1"
                        className="gear gear-4"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        enableBackground="new 0 0 512 512"
                        xmlSpace="preserve"
                      >
                        <path
                          class="st0"
                          d="M507.6,232.1c0,0-9.3-3.5-36.2-6c-32.9-3-42.8-15.4-53.7-30.7h-0.2c-1.4-3.6-2.8-7.2-4.4-10.8l0.1-0.1
		c-3.1-18.6-4.8-34.3,16.3-59.7C446.7,104,450.8,95,450.8,95c-4-10.3-13.8-20-13.8-20s-9.7-9.7-20-13.8c0,0-9.1,4.1-29.8,21.4
		c-25.4,21.1-41.1,19.4-59.7,16.3l-0.1,0.1c-3.5-1.6-7.1-3.1-10.8-4.4v-0.2c-15.3-10.9-27.7-20.9-30.7-53.7c-2.5-26.9-6-36.2-6-36.2
		C269.8,0,256,0,256,0s-13.8,0-23.9,4.4c0,0-3.5,9.3-6,36.2c-3,32.9-15.4,42.8-30.7,53.7v0.2c-3.6,1.4-7.3,2.8-10.8,4.4l-0.1-0.1
		c-18.6,3.1-34.3,4.8-59.7-16.3C104,65.3,95,61.2,95,61.2C84.7,65.3,75,75,75,75s-9.7,9.7-13.8,20c0,0,4.1,9.1,21.4,29.8
		c21.1,25.4,19.4,41.1,16.3,59.7l0.1,0.1c-1.6,3.5-3.1,7.1-4.4,10.8h-0.2c-10.9,15.4-20.9,27.7-53.7,30.7c-26.9,2.5-36.2,6-36.2,6
		C0,242.3,0,256,0,256s0,13.8,4.4,23.9c0,0,9.3,3.5,36.2,6c32.9,3,42.8,15.4,53.7,30.7h0.2c1.4,3.7,2.8,7.3,4.4,10.8l-0.1,0.1
		c3.1,18.6,4.8,34.3-16.3,59.7C65.3,408,61.2,417,61.2,417c4.1,10.3,13.8,20,13.8,20s9.7,9.7,20,13.8c0,0,9-4.1,29.8-21.4
		c25.4-21.1,41.1-19.4,59.7-16.3l0.1-0.1c3.5,1.6,7.1,3.1,10.8,4.4v0.2c15.3,10.9,27.7,20.9,30.7,53.7c2.5,26.9,6,36.2,6,36.2
		C242.3,512,256,512,256,512s13.8,0,23.9-4.4c0,0,3.5-9.3,6-36.2c3-32.9,15.4-42.8,30.7-53.7v-0.2c3.7-1.4,7.3-2.8,10.8-4.4l0.1,0.1
		c18.6-3.1,34.3-4.8,59.7,16.3c20.8,17.3,29.8,21.4,29.8,21.4c10.3-4.1,20-13.8,20-13.8s9.7-9.7,13.8-20c0,0-4.1-9.1-21.4-29.8
		c-21.1-25.4-19.4-41.1-16.3-59.7l-0.1-0.1c1.6-3.5,3.1-7.1,4.4-10.8h0.2c10.9-15.3,20.9-27.7,53.7-30.7c26.9-2.5,36.2-6,36.2-6
		C512,269.8,512,256,512,256S512,242.2,507.6,232.1z M256,375.7c-66.1,0-119.7-53.6-119.7-119.7S189.9,136.3,256,136.3
		c66.1,0,119.7,53.6,119.7,119.7S322.1,375.7,256,375.7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="loading-bar">
                    <span style={{ width: `${progress}%` }}></span>
                  </div>
                  <svg
                    className="checkmark checkmark-success"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50"
                  >
                    <circle
                      className="checkmark-circle"
                      cx="25"
                      cy="25"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark-check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg>
                </div>
              </div> */}
                  <span className="text-[10px] text-[#7f187f] font-khteka uppercase tracking-wider">
                    Prequalifying with Klarna...
                  </span>
                  <div className="w-[300px] space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-neuehaas45 uppercase">
                        <span>Remaining balance</span>
                      </div>
                      <div className="bg-black/10 h-2 rounded-full relative overflow-hidden">
                        <div className="bg-lime-300 h-full rounded-full w-[75%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-neuehaas45 uppercase">
                        <span>NEXT PAYMENT DUE</span>
                      </div>
                      <div className="bg-black/10 h-2 rounded-full relative overflow-hidden">
                        <div className="bg-purple-300 h-full rounded-full w-[45%]"></div>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-[#ffe5f2] border border-[#ffb3d6] text-[#7f187f] py-2 rounded-md text-xs font-khteka uppercase hover:bg-[#ffd6e9] transition-all">
                    Continue with Klarna
                  </button>

                  <div className="mt-3 text-center"></div>
                </div>
                <div className="relative border border-white border-[4px] rounded-[8px] p-10">
                  <div className="flex justify-between mt-4 px-6">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-black/10"
                      ></div>
                    ))}
                  </div>

                  <div
                    className="text-[14px] uppercase font-khteka text-gray-700 tracking-widest mb-4"
                    ref={text2Ref}
                    id="text-2"
                  />

                  <div
                    className="text-sm text-gray-700 font-neuehaas45 mb-6 min-h-[40px]"
                    ref={text3Ref}
                    id="text-3"
                  />

                  <div className="relative w-full">
                    <img src="../images/iphoneoutline.png" className="w-full" />
                  </div>

                  <button className="w-full bg-black text-white py-2 rounded-md text-sm font-khteka uppercase hover:bg-gray-900 transition-all">
                    Text Our Team
                  </button>
                  <div className="flex-1 flex flex-col items-center relative"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="min-h-screen pt-[160px] relative ">
          <section className="relative flex items-center justify-center">
            <div className=" w-[36vw] h-[90vh] bg-[#FF8111] rounded-t-[600px] flex flex-col items-center justify-center px-8 pt-24 pb-20 z-10">
              <Copy>
                <p className="font-neueroman text-[18px] uppercase leading-snug text-black">
                  Orthodontic treatment is a transformative investment in both
                  your appearance and long-term dental health — ideally, a
                  once-in-a-lifetime experience. While many orthodontists can
                  straighten teeth with braces or Invisalign, the quality of
                  outcomes varies widely. With today's advanced technology,
                  treatment goes far beyond alignment — it can enhance facial
                  aesthetics and deliver truly life-changing results.
                </p>
              </Copy>
            </div>

            <svg
              width="90vw"
              height="170vh"
              viewBox="-100 0 1100 1800"
              xmlns="http://www.w3.org/2000/svg"
              ref={svgRef}
              className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
            >
              <defs>
                <path
                  id="text-arc-path"
                  d="M0,820 
           A450,450 0 0 1 900,820 
           L900,1440 
           L0,1440 
           Z"
                  fill="none"
                />
              </defs>

              <path
                d="M0,820 
         A450,450 0 0 1 900,820 
         L900,1400 
         L0,1400 
         Z"
                fill="none"
                // stroke="#fe6531"
                // strokeWidth="4"
              />

              <text
                className="text-[12vw] tracking-wide font-neueroman fill-[#FEB448] font-sinistre"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <textPath
                  ref={textPathRef}
                  href="#text-arc-path"
                  startOffset="4%"
                >
                  GETTING STARTED
                </textPath>
              </text>
            </svg>
          </section>
          <div className="overflow-hidden" style={{ height: "400vh" }}>
            <svg
              ref={curveSvgRef}
              className="svgtext"
              data-filter-type="distortion"
              width="120%"
              viewBox="0 0 1000 200"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="distortionFilter">
                  <feTurbulence
                    type="turbulence"
                    baseFrequency="0.01"
                    numOctaves="1"
                    result="noise"
                  />
                  <feDisplacementMap
                    ref={filterRef}
                    in="SourceGraphic"
                    in2="noise"
                    scale="0"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    data-min-scale="0"
                    data-max-scale="80"
                  />
                </filter>
              </defs>

              <path
                id="text-curve"
                d="M 0 50 Q 100 0 200 100 Q 300 200 650 50 C 750 0 750 150 1000 50"
                fill="none"
              />
              <text filter="url(#distortionFilter)">
                <textPath
                  className="font-neueroman uppercase text-[20px] fill-[#624B48]"
                  ref={textCurveRef}
                  href="#text-curve"
                >
                  Invest in your smile, with flexibility built in.
                </textPath>
              </text>
            </svg>

            <section
              ref={sectionRef}
              className="w-screen h-screen overflow-hidden flex items-center px-10"
            >
              <div ref={scrollContainerRef}>
                <svg
                  width="3370"
                  height="671"
                  viewBox="0 0 3370 671"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    ref={drawPathRef}
                    d="M0.998047 1C0.998047 1 849.498 764.605 786.498 659.553C723.498 554.5 1725.51 370.052 1660.51 419.052C1595.5 468.052 2515.02 616.409 2491.26 660.981C2467.5 705.553 3369 419.052 3369 419.052"
                    stroke="#EBFD15"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </section>
          </div>

          <svg
            ref={starRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 162 162"
            style={{ enableBackground: "new 0 0 162 162" }}
          >
            <g
              className="shape-wrapper"
              style={{ transformOrigin: "center center" }}
            >
              <path
                className="hsc-img-path"
                d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
                fill="#EAFE08"
              />
            </g>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="scrolling-content"
              style={{
                fontFamily: "sans-serif",
                fontSize: "4px",
                fill: "black",
                opacity: 0,
                pointerEvents: "none",
              }}
            >
              <tspan x="50%" dy="-1em">
                AFFORDABLE FINANCING
              </tspan>
              <tspan x="50%" dy="1.2em">
                NO HIDDEN COSTS
              </tspan>
            </text>
          </svg>
          <section className="relative w-full h-screen font-neuehaas45">
            <svg viewBox="-960 -540 1920 1080" width="100%" height="100%">
              <path
                ref={lineRef}
                strokeLinecap="round"
                strokeLinejoin="miter"
                fillOpacity="0"
                strokeMiterlimit="4"
                stroke="rgb(248,134,63)"
                strokeOpacity="1"
                strokeWidth="1.5"
                d="M-954,-192 C-954,-192 -659,-404 -520,-431 C-379,-454 -392,-360 -588,-33 C-730,212 -926,640 -350,397 C135.86099243164062,192.0279998779297 324,-61 523,-160 C705.1939697265625,-250.63900756835938 828,-256 949,-194"
              />
            </svg>
            <section className="bg-[#FF621D]"></section>
            <div className="items-start flex flex-col px-6">
              <div className="cube-outline">
                <div class="cube">
                  <div className="cube-face cube-face--front">
                    <div className="text-overlay">
                      <p className="first-line font-neueroman uppercase">
                        One year post-treatment follow-up
                      </p>
                      <p
                        className=" font-neueroman uppercase"
                        style={{
                          position: "absolute",
                          transform: "rotate(90deg)",
                          transformOrigin: "left top",
                          top: "40%",
                          left: "70%",
                          fontSize: ".8rem",
                          lineHeight: "1.2",
                          color: "black",
                          maxWidth: "120px",
                        }}
                      >
                        Retainers and retention visits for one year
                        post-treatment included.
                      </p>
                    </div>
                  </div>

                  <div class="cube-face cube-face--back">2</div>
                  <div class="cube-face cube-face--top "></div>
                  <div class="cube-face cube-face--bottom">4</div>
                  <div class="cube-face cube-face--left"></div>
                  <div class="cube-face cube-face--right"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section className="relative">
          <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden px-5">
            <svg
              ref={svgPathRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1484 3804"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto"
            >
              <defs>
                <clipPath id="svg-clip-path">
                  <rect width="1484" height="3804" x="0" y="0" />
                </clipPath>
              </defs>

              <g clipPath="url(#svg-clip-path)">
                <g
                  transform="matrix(1,0,0,1,742,1902)"
                  opacity="1"
                  style={{ display: "block" }}
                >
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path
                      id="text-follow-path"
                      ref={pathRef}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      fillOpacity="0"
                      strokeMiterlimit="4"
                      stroke="rgb(0,0,19)"
                      strokeOpacity="1"
                      strokeWidth="1"
                      d="M-110,-1890 C-110,-1890 -110,-1780 -110,-1780 C-110,-1780 -630,-1780 -630,-1780 C-685.22900390625,-1780 -730,-1735.22900390625 -730,-1680 C-730,-1680 -730,-1310 -730,-1310 C-730,-1254.77099609375 -685.22900390625,-1210 -630,-1210 C-630,-1210 -10,-1210 -10,-1210 C45.229000091552734,-1210 90,-1165.22900390625 90,-1110 C90,-1110 90,-1050 90,-1050 C90,-1050 630,-1050 630,-1050 C685.22802734375,-1050 730,-1005.22900390625 730,-950 C730,-950 730,240 730,240 C730,295.22900390625 685.22802734375,340 630,340 C630,340 -270,340 -270,340 C-270,340 -270,1000 -270,1000 C-270,1000 390,1000 390,1000 C445.22900390625,1000 490,1044.77099609375 490,1100 C490,1100 490,1630 490,1630 C490,1685.22900390625 445.22900390625,1730 390,1730 C390,1730 -110,1730 -110,1730 C-110,1730 -110,1890 -110,1890"
                    />
                    <image
                      href="/images/outlineshape.png"
                      x="-100"
                      y="-1940"
                      width="800"
                      height="800"
                    />
                    <text
                      x="50"
                      y="-1720"
                      fill="black"
                      font-size="46"
                      font-family="NeueHaasRoman, sans-serif"
                    >
                      <tspan x="20" dy="1.4em">
                        Initial consultations
                      </tspan>
                      <tspan x="20" dy="4.5em">
                        Whether in person or virtual,
                      </tspan>
                      <tspan x="20" dy="1.2em">
                        your first consultation is free.
                      </tspan>
                    </text>

                    <image
                      href="/images/chatbubble.svg"
                      x="-500"
                      y="-940"
                      width="800"
                      height="800"
                    />
                    <text
                      x="-300"
                      y="-620"
                      fill="white"
                      font-size="40"
                      font-family="NeueHaasRoman, sans-serif"
                    >
                      <tspan x="-300" dy="-5.2em">
                        Full Evaluation
                      </tspan>
                      <tspan x="-400" dy="1.4em">
                        This initial visit includes an
                      </tspan>
                      <tspan x="-400" dy="1.4em">
                        in-depth orthodontic evaluation
                      </tspan>
                      <tspan x="-250" dy="5.4em">
                        digital radiographs and
                      </tspan>
                      <tspan x="-250" dy="1.2em">
                        professional imaging.
                      </tspan>
                    </text>

                    <image
                      href="/images/outlineshape2.png"
                      x="-100"
                      y="240"
                      width="800"
                      height="800"
                    />
                    <text
                      x="-100"
                      y="520"
                      fill="black"
                      font-size="30"
                      font-family="NeueHaasRoman, sans-serif"
                    >
                      <tspan x="100" dy="1.4em">
                        Plan and Prepare
                      </tspan>
                      <tspan x="-60" dy="1.4em">
                        We encourage all decision-makers to attend
                      </tspan>
                      <tspan x="-40" dy="1.2em">
                        the initial visit so we can discuss the path
                      </tspan>
                      <tspan x="-40" dy="1.2em">
                        ahead with clarity and transparency —
                      </tspan>
                      <tspan x="-40" dy="1.2em">
                        ensuring everyone is aligned on expectations,
                      </tspan>
                      <tspan x="-40" dy="1.2em">
                        preferences, and the ideal time to begin.
                      </tspan>
                    </text>
                    <image
                      href="/images/outlineshape3.png"
                      x="-400"
                      y="940"
                      width="800"
                      height="800"
                    />
                    <text
                      x="-300"
                      y="1050"
                      fill="white"
                      font-size="30"
                      font-family="NeueHaasRoman, sans-serif"
                    >
                      <tspan x="-300" dy="3.4em">
                        Treatment Roadmap
                      </tspan>
                      <tspan x="-360" dy="1.4em">
                        {" "}
                        If treatment isn’t yet needed,
                      </tspan>
                      <tspan x="-360" dy="1.2em">
                        no cost observation check-ups will be
                      </tspan>
                      <tspan x="-360" dy="1.4em">
                        coordinated every 6-12 months until
                      </tspan>
                      <tspan x="-360" dy="1.5em">
                        {" "}
                        treatment is needed. These are
                      </tspan>
                      <tspan x="-360" dy="3.6em">
                        shorter and fun visits where
                      </tspan>
                      <tspan x="-360" dy="1.2em">
                        where you'll have access to
                      </tspan>
                      <tspan x="-360" dy="1.2em">
                        to all four of our locations
                      </tspan>
                      <tspan x="-360" dy="1.3em">
                        to play video games and
                      </tspan>
                      <tspan x="-340" dy="1.3em">
                        get to know our team.
                      </tspan>
                    </text>
                  </g>
                </g>

                <g
                  ref={dotRef}
                  transform="matrix(.7,0,0,.7,132.8538055419922,692)"
                  opacity="1"
                  style={{ display: "block" }}
                >
                  <g opacity="1" transform="matrix(1,0,0,1,0,0)">
                    <path
                      fill="rgb(0,0,254)"
                      fillOpacity="1"
                      d="M0,-12 C6.622799873352051,-12 12,-6.622799873352051 12,0 C12,6.622799873352051 6.622799873352051,12 0,12 C-6.622799873352051,12 -12,6.622799873352051 -12,0 C-12,-6.622799873352051 -6.622799873352051,-12 0,-12z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </section>
      </div>

      {/* <div ref={sectionRef} className="relative h-[200vh] bg-[#F2F2F4]">

        <div className="pointer-events-none h-screen flex items-center justify-center">
          <div className="relative h-screen bg-[#F2F2F4] flex items-center justify-center">

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9a3f03dd6c2c1edf4901e_sculpture%20Top.svg"
              alt="Sculpture Back"
              className="z-10 w-[300px] h-auto"
            />

            <img
              src="https://cdn.prod.website-files.com/63ca1c298ff20ed7487ad63e/64f9b95746e31c40a01c2762_sculpture%20Bottom.svg"
              alt="Sculpture Front"
              className="absolute z-30 w-[300px] h-auto"
            />
          </div>

          <div
            ref={ballRef}
            className="absolute -top-10 z-20 w-24 h-24 bg-[#FDBA12] rounded-full"
          />
        </div>
      </div> */}

    </>
  );
};


export default FinancingTreatment;
