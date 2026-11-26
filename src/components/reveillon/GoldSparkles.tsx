"use client";

import { useEffect, useRef } from "react";

/**
 * Gold dust drifting up and twinkling over the hero. A plain canvas (no library), capped
 * at 2× pixel ratio, paused when off screen or hidden, and still for reduced-motion users.
 */
export function GoldSparkles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, visible = true;
    type P = { x: number; y: number; r: number; vy: number; vx: number; phase: number; speed: number; hue: number };
    let parts: P[] = [];

    const spawn = (anywhere: boolean): P => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
      hue: 38 + Math.random() * 12,
    });

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (w * h) / 9000));
      parts = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!reduced) {
          p.y += p.vy; p.x += p.vx; p.phase += p.speed;
          if (p.y < -10) Object.assign(p, spawn(false));
        }
        const a = 0.35 + 0.65 * Math.abs(Math.sin(p.phase));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${a})`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${a})`;
        ctx.shadowBlur = p.r * 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
