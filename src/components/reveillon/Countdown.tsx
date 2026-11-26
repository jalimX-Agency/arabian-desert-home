"use client";

import { useEffect, useState } from "react";

/** Midnight on 1 January 2027 in Marrakech (UTC+1). */
const MIDNIGHT = Date.UTC(2026, 11, 31, 23, 0);

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live countdown to midnight, rendered only in the browser so the cached page never shows a stale time. */
export function Countdown({ labels, className = "" }: {
  labels: { title: string; days: string; hours: string; minutes: string; seconds: string; done: string };
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (now !== null && now >= MIDNIGHT) return <p className={`font-mono text-[#f0cf8a] ${className}`}>{labels.done}</p>;
  const t = now === null ? null : parts(MIDNIGHT - now);
  const cells = [
    { v: t?.d, l: labels.days },
    { v: t?.h, l: labels.hours },
    { v: t?.m, l: labels.minutes },
    { v: t?.s, l: labels.seconds },
  ];

  return (
    <div className={className} aria-label={labels.title}>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f0cf8a]/70 mb-3">{labels.title}</p>
      <div className="flex gap-2 sm:gap-3">
        {cells.map((c) => (
          <div key={c.l} className="min-w-[64px] sm:min-w-[78px] rounded-xl border border-[#d9a95b]/30 bg-white/[0.04] backdrop-blur px-2 py-3 text-center">
            <span className="block font-mono text-2xl sm:text-3xl tabular-nums text-[#fbe9c6]">{c.v === undefined ? "--" : String(c.v).padStart(2, "0")}</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/50 mt-1">{c.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
