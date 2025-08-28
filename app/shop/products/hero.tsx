"use client";
import { gsap } from "gsap";
import { useRef, useEffect, useMemo } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import FlutedGlassEffect from "../../../utils/glass";

function RepellingLines({
  text = "SHOP",
  orientation = "horizontal",
  nLines = 60,
  nPoints = 160,
  paddingPct = 10,
  radius = 80,
  maxSpeed = 28,
  strokeColor = "#d6c4ad",
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
      // use the actual CSS size of the canvas
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
const Marquee = () => {
  const items = [
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
    { word: "Click here to shop gift cards" },
  ];

  return (
    <div className="relative overflow-hidden w-screen bg-[#F0EF59]">
      <div className="flex animate-marquee min-w-full hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="px-4 py-4 text-[12px] whitespace-nowrap">
            {item.word}
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const slices = [
    { id: 1, containerHeight: 50, translateY: -420 },
    { id: 2, containerHeight: 50, translateY: -370 },
    { id: 3, containerHeight: 50, translateY: -320 },
    { id: 4, containerHeight: 320, translateY: -0 },
  ];

  const lineRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const path = lineRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.out",
    });
  }, []);

  // useEffect(() => {
  //   const triggers: ScrollTrigger[] = [];

  //   gsap.utils.toArray<HTMLElement>(".img-container").forEach((container) => {
  //     const img = container.querySelector("img") as HTMLImageElement | null;

  //     if (img) {
  //       const trigger = gsap.fromTo(
  //         img,
  //         { yPercent: -20, ease: "none" },
  //         {
  //           yPercent: 20,
  //           ease: "none",
  //           scrollTrigger: {
  //             trigger: container,
  //             scrub: true,
  //           },
  //         }
  //       ).scrollTrigger as ScrollTrigger;

  //       triggers.push(trigger);
  //     }
  //   });

  //   return () => {
  //     triggers.forEach((trigger) => trigger.kill());
  //   };
  // }, []);
  return (
    <section>
      <FrameBox>
        <div className="w-[78%] max-w-[900px] aspect-[16/9]">
          <RepellingLines
            text="SHOP"
            orientation="horizontal"
            nLines={60}
            nPoints={200}
            amplitude={10}
            terraces={25}
            blurPx={5}
            paddingPct={12}
            strokeColor="#EEDCC7"
            lineWidth={0.5}
            threshold={0.08}
            softness={0.15}
          />
        </div>
      </FrameBox>
     
    </section>
  );
};

function FrameBox({ children }) {
  return (
    <section className="relative w-full h-[100svh] bg-black text-[#d6c4ad]">
      <span className="pointer-events-none absolute left-0 right-0 top-[23%] border-t border-[#6c5f4d]/80" />
      <span className="pointer-events-none absolute left-0 right-0 bottom-[20%] border-t border-[#6c5f4d]/80" />

      <div
        className="
          grid w-full h-full border border-[#3a342c]
          grid-cols-[minmax(220px,0.9fr)_minmax(0,2.6fr)_minmax(220px,0.9fr)]
          grid-rows-[minmax(120px,1fr)_1fr_minmax(120px,1fr)]
          divide-x divide-[#3a342c] 
        "
      >

        <div />
        <div />
        <div />


        <div className="uppercase font-khteka p-6 text-[11px] leading-4 tracking-wider text-[#b7a992]/70 flex items-center">
          <div>
            <div>Our gift cards can be used toward any part of treatment—and they never expire.</div>
            <div>Send one digitally</div>
            <div>or choose a physical card</div>
          </div>
        </div>

        {/* RepellingLines */}
        <div className="relative flex items-center justify-center overflow-visible">
          <div className="relative z-[1] w-[calc(100%-1rem)] h-[calc(100%-3rem)] flex items-center justify-center">
            {children}
          </div>
        </div>


        <div className="font-khteka uppercase p-6 text-[11px] leading-4 tracking-wider text-[#b7a992]/70 flex items-center text-left">
          <div>We’ve curated a handful of products to elevate your routine—nothing extra.</div>
        </div>


        <div />
        <div />
        <div />
      </div>
    </section>
  );
}
export default Hero;
