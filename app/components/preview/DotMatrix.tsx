"use client";

import { useEffect, useRef } from "react";

/* ── canvas dot-matrix placeholder ──
   A grid of rounded-square dots where a random subset re-seeds every tick,
   so the pattern scrambles irregularly like a dot-matrix display. Inactive
   cells render grey to keep the grid regular. Drawing happens only after
   mount, so SSR markup stays stable. */
export function Dots({
  w,
  h = 10,
  circle = false,
}: {
  w: number;
  h?: number;
  circle?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);

    const cell = 4;
    const dot = 2.8; // rounded-square side
    const cols = Math.max(1, Math.floor(w / cell));
    const rows = Math.max(1, Math.floor(h / cell));
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2;

    // per-cell opacity; 0 = inactive (drawn grey so the grid stays regular)
    const state = new Float32Array(cols * rows);
    const reseed = (i: number) => {
      state[i] = Math.random() < 0.52 ? 0.4 + Math.random() * 0.6 : 0;
    };
    for (let i = 0; i < state.length; i++) reseed(i);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = state[r * cols + c];
          const x = c * cell + cell / 2;
          const y = r * cell + cell / 2;
          if (circle) {
            const dx = x - cx;
            const dy = y - cy;
            if (dx * dx + dy * dy > (radius - 1) * (radius - 1)) continue;
          }
          if (a) {
            ctx.fillStyle = "#64B300"; // brand green (matches --color-preview-accent)
            ctx.globalAlpha = a * 0.85;
          } else {
            ctx.fillStyle = "#8A8A8A";
            ctx.globalAlpha = 0.28;
          }
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x - dot / 2, y - dot / 2, dot, dot, 0.8);
          } else {
            ctx.rect(x - dot / 2, y - dot / 2, dot, dot);
          }
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    draw();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 140) return; // ~7 scrambles/sec
      last = t;
      const flips = Math.max(1, Math.floor(state.length * 0.2));
      for (let i = 0; i < flips; i++) {
        reseed(Math.floor(Math.random() * state.length));
      }
      draw();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [w, h, circle]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`block ${circle ? "rounded-full" : ""}`}
      style={{ width: w, height: h }}
    />
  );
}

/* ── a run of placeholder "words" ── */
export function DotLine({ widths, h = 10 }: { widths: number[]; h?: number }) {
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
      {widths.map((w, i) => (
        <Dots key={i} w={w} h={h} />
      ))}
    </span>
  );
}
