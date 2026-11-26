"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { Check, Plus, Sparkles, Tent, CalendarDays, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/arabian/WhatsAppIcon";
import { pickLocalized, type Language } from "@/lib/i18n/context";
import { LANG_LOCALE } from "@/lib/reservation-lang";
import { formatMoney } from "@/lib/money";
import { eurToMad, type ReveillonOffer, type ReveillonTent } from "@/lib/reveillon";
import { REVEILLON_COPY } from "./reveillon-copy";
import { REVEILLON_UI } from "./reveillon-ui-copy";
import { GoldSparkles } from "./GoldSparkles";
import { Countdown } from "./Countdown";
import { ReveillonWizard } from "./ReveillonWizard";

const R2 = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/reveillon/v2";
const IMG = {
  hero: `${R2}/hero.webp`,
  lanterns: `${R2}/lanterns.webp`,
  fireDuo: `${R2}/fire-duo.webp`,
  fireHoop: `${R2}/fire-hoop.webp`,
  sparkler: `${R2}/sparkler.webp`,
  sparkle: `${R2}/fireworks.webp`,
  fireworks: `${R2}/fireworks-sky.webp`,
  milkyway: `${R2}/milkyway.webp`,
  campfire: `${R2}/campfire.webp`,
  dinner: `${R2}/dinner.webp`,
};
const WHATSAPP_NUMBER = "212667370206";
const GOLD = "#d9a95b";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#f0cf8a]/80 mb-4">{children}</p>;
}

/** The New Year's Eve page: midnight-blue and gold, live countdown, packages and the booking wizard. */
export function ReveillonContent({ lang, initialOffer }: { lang: Language; initialOffer: ReveillonOffer }) {
  const c = REVEILLON_COPY[lang];
  const u = REVEILLON_UI[lang];
  const locale = LANG_LOCALE[lang];
  const [offer, setOffer] = useState(initialOffer);
  const [wizard, setWizard] = useState<{ key: number; formula: "soiree" | "night" | null; tentId?: string }>({ key: 0, formula: null });

  // The page is cached for an hour: refresh seats and tents left as soon as it opens.
  useEffect(() => {
    fetch("/api/reveillon", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((o) => o && setOffer(o)).catch(() => {});
  }, []);

  // Signature 2: the programme's gold line fills from 17h30 to midnight as you scroll.
  const timeline = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsappMessage)}`;
  const tentName = (t: ReveillonTent) => pickLocalized(lang, t.name, t.nameEn, t.nameEs, t.nameIt);

  function book(formula: "soiree" | "night" | null = null, tentId?: string) {
    setWizard((w) => ({ key: w.key + 1, formula, tentId }));
    requestAnimationFrame(() => document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const ctaPrimary = "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-[#0b0f1f] transition hover:brightness-110 cursor-pointer";

  return (
    <div className="bg-[#070b1a] text-white overflow-x-clip">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <Image src={IMG.hero} alt={c.title} fill priority sizes="100vw" className="object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b1a]/50 via-transparent via-60% to-[#070b1a]/70" />
        <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-[#070b1a]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(217,169,91,0.18),transparent_55%)]" />
        <GoldSparkles />
        <span aria-hidden className="pointer-events-none absolute right-[-4vw] top-[14vh] select-none font-serif text-[34vw] md:text-[24vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,169,91,0.28)]">
          2027
        </span>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-14 md:pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#f0cf8a] mb-6 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />31 · 12 · 2026 — Agafay, Marrakech
          </p>
          <h1 className="heading-display text-[clamp(2.6rem,8vw,6.8rem)] leading-[0.95] max-w-4xl mb-6">
            {c.title}
          </h1>
          <p className="text-base md:text-lg text-white/75 max-w-xl mb-10 leading-relaxed">{c.subtitle}</p>

          <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-16">
            <Countdown labels={u.countdown} />
            {offer.open ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => book()} style={{ backgroundColor: GOLD }} className={ctaPrimary}>{c.ctaBook}</button>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-black/40 backdrop-blur px-7 py-3.5 text-sm hover:bg-black/60 transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />{c.ctaWhatsApp}
                </a>
              </div>
            ) : (
              <p className="text-white/70">{c.closed}</p>
            )}
          </div>
          <p className="mt-8 text-sm text-white/60 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f0cf8a]" />
            {offer.soiree.seatsLeft > 0 ? c.limited(offer.soiree.seatsLeft) : c.soldOutSoiree}
          </p>
        </div>

        {/* Marquee */}
        <div className="relative z-10 border-y border-[#d9a95b]/20 bg-[#070b1a]/80 backdrop-blur overflow-hidden">
          <div className="flex w-max animate-[nye-marquee_38s_linear_infinite] motion-reduce:animate-none py-4">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
                {u.marquee.map((m) => (
                  <span key={m} className="flex items-center font-serif text-lg md:text-2xl text-white/85 px-6">
                    {m}<span className="ml-12 text-[#d9a95b]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5">
          <Eyebrow><MapPin className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />Désert d&apos;Agafay</Eyebrow>
          <h2 className="heading-display text-4xl md:text-5xl leading-tight mb-6">{c.introTitle}</h2>
          <p className="text-white/70 leading-relaxed text-base md:text-lg">{c.intro}</p>
        </div>
        <div className="md:col-span-7 relative h-[420px] md:h-[560px]">
          <div className="absolute right-0 top-0 w-[78%] h-[78%] rounded-[28px] overflow-hidden">
            <Image src={IMG.lanterns} alt="" fill sizes="(min-width: 768px) 45vw, 80vw" className="object-cover" />
          </div>
          <div className="absolute left-0 bottom-0 w-[52%] h-[52%] rounded-[20px] overflow-hidden ring-8 ring-[#070b1a] -rotate-3">
            <Image src={IMG.fireDuo} alt="" fill sizes="(min-width: 768px) 30vw, 55vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── Programme ──────────────────────────────────── */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-[#070b1a] via-[#0b1230] to-[#070b1a]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <Eyebrow>{c.programmeLabel} · {u.programmeFrom}</Eyebrow>
            <h2 className="heading-display text-4xl md:text-5xl mb-12">{c.programmeTitle}</h2>
            <ol ref={timeline} className="relative pl-10">
              <span className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
              <motion.span style={{ scaleY: fill }} className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-[#d9a95b] to-[#fbe9c6]" />
              {c.programme.map((p, i) => {
                const midnight = i === c.programme.length - 1;
                return (
                  <li key={p.time} className="relative pb-9 last:pb-0">
                    <span className={`absolute -left-10 top-1 flex items-center justify-center rounded-full ${midnight ? "w-6 h-6 bg-[#d9a95b] shadow-[0_0_24px_#d9a95b]" : "w-6 h-6 border border-[#d9a95b]/60 bg-[#070b1a]"}`}>
                      {midnight && <Sparkles className="w-3.5 h-3.5 text-[#0b0f1f]" />}
                    </span>
                    <p className={`font-mono tabular-nums ${midnight ? "text-2xl text-[#fbe9c6]" : "text-lg text-[#f0cf8a]"}`}>{p.time}</p>
                    <p className={`mt-1 leading-relaxed ${midnight ? "text-white text-lg" : "text-white/70"}`}>{p.text}</p>
                  </li>
                );
              })}
            </ol>
            <p className="text-xs text-white/40 mt-8">{c.indicative}</p>
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[4/3] rounded-[24px] overflow-hidden">
              <Image src={IMG.sparkler} alt="" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-[18px] overflow-hidden">
              <Image src={IMG.fireHoop} alt="" fill sizes="(min-width: 1024px) 17vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-[18px] overflow-hidden">
              <Image src={IMG.campfire} alt="" fill sizes="(min-width: 1024px) 17vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32">
        <Eyebrow>{c.offersLabel}</Eyebrow>
        <h2 className="heading-display text-4xl md:text-5xl mb-14 max-w-3xl">{c.offersTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article className="relative flex flex-col rounded-[24px] border border-white/10 bg-white/[0.03] p-7">
            <Sparkles className="w-6 h-6 text-[#f0cf8a] mb-5" />
            <h3 className="font-serif text-2xl mb-1">{c.soiree}</h3>
            <p className="text-xs text-white/50 mb-6">{c.soireeFor}</p>
            <p className="font-mono text-4xl text-[#f0cf8a] tabular-nums">{formatMoney(offer.soiree.priceEur, locale)} €</p>
            <p className="text-xs text-white/45 mt-1">≈ {formatMoney(eurToMad(offer.soiree.priceEur), locale)} MAD · {c.perPerson}</p>
            <p className="text-xs text-white/45 mb-6">{c.childHalf}</p>
            <ul className="space-y-2.5 text-sm text-white/75 mb-8 flex-1">
              {c.includes.map((i) => <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-[#d9a95b] shrink-0 mt-0.5" />{i}</li>)}
            </ul>
            <p className={`font-mono text-[11px] uppercase tracking-[0.2em] mb-4 ${offer.soiree.seatsLeft > 0 ? "text-[#f0cf8a]/80" : "text-red-300"}`}>
              {offer.soiree.seatsLeft > 0 ? c.seatsLeft(offer.soiree.seatsLeft) : c.full}
            </p>
            <button type="button" onClick={() => book("soiree")} disabled={!offer.open || offer.soiree.seatsLeft === 0}
              className="rounded-full border border-[#d9a95b]/60 py-3 text-sm uppercase tracking-[0.15em] text-[#f0cf8a] hover:bg-[#d9a95b] hover:text-[#0b0f1f] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
              {c.choose}
            </button>
          </article>
          {offer.tents.map((t, i) => {
            const featured = i === 0 && t.left > 0;
            return (
              <article key={t.suiteId} className={`relative flex flex-col rounded-[24px] p-7 ${featured ? "border border-[#d9a95b] bg-gradient-to-b from-[#d9a95b]/15 to-white/[0.02] shadow-[0_30px_80px_-30px_rgba(217,169,91,0.45)]" : "border border-white/10 bg-white/[0.03]"} ${t.left === 0 ? "opacity-50" : ""}`}>
                {featured && <span className="absolute -top-3 left-7 rounded-full bg-[#d9a95b] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0b0f1f]">{u.featured}</span>}
                <Tent className="w-6 h-6 text-[#f0cf8a] mb-5" />
                <h3 className="font-serif text-2xl mb-1">{c.soiree} + {tentName(t)}</h3>
                <p className="text-xs text-white/50 mb-6">{c.forPersons(t.maxGuests)} · {c.packageNote}</p>
                <p className="font-mono text-4xl text-[#f0cf8a] tabular-nums">{formatMoney(t.priceEur, locale)} €</p>
                <p className="text-xs text-white/45 mt-1 mb-6">≈ {formatMoney(eurToMad(t.priceEur), locale)} MAD</p>
                <ul className="space-y-2.5 text-sm text-white/75 mb-8 flex-1">
                  {[...c.includes, c.nightIncluded, c.breakfastIncluded].map((x) => <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-[#d9a95b] shrink-0 mt-0.5" />{x}</li>)}
                </ul>
                <p className={`font-mono text-[11px] uppercase tracking-[0.2em] mb-4 ${t.left > 0 ? "text-[#f0cf8a]/80" : "text-red-300"}`}>{t.left > 0 ? c.left(t.left) : c.full}</p>
                <button type="button" onClick={() => book("night", t.suiteId)} disabled={!offer.open || t.left === 0}
                  style={featured ? { backgroundColor: GOLD } : undefined}
                  className={`rounded-full py-3 text-sm uppercase tracking-[0.15em] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${featured ? "text-[#0b0f1f] font-semibold hover:brightness-110" : "border border-[#d9a95b]/60 text-[#f0cf8a] hover:bg-[#d9a95b] hover:text-[#0b0f1f]"}`}>
                  {t.left > 0 ? c.choose : c.full}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <Eyebrow>{c.galleryLabel}</Eyebrow>
        <h2 className="heading-display text-4xl md:text-5xl mb-12">{u.galleryTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4">
          <div className="relative row-span-2 rounded-[22px] overflow-hidden"><Image src={IMG.milkyway} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" /></div>
          <div className="relative md:col-span-2 rounded-[22px] overflow-hidden"><Image src={IMG.fireDuo} alt="" fill sizes="(min-width: 768px) 50vw, 50vw" className="object-cover" /></div>
          <div className="relative row-span-2 rounded-[22px] overflow-hidden"><Image src={IMG.dinner} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" /></div>
          <div className="relative rounded-[22px] overflow-hidden"><Image src={IMG.sparkle} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" /></div>
          <div className="relative rounded-[22px] overflow-hidden"><Image src={IMG.lanterns} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" /></div>
        </div>
      </section>

      {/* ── Booking wizard ─────────────────────────────── */}
      <section id="reserver" className="scroll-mt-24 relative py-24 md:py-32 bg-[radial-gradient(ellipse_at_top,rgba(217,169,91,0.12),transparent_60%)]">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <Eyebrow>{c.formLabel}</Eyebrow>
          <h2 className="heading-display text-4xl md:text-5xl mb-4">{c.formTitle}</h2>
          <p className="text-white/60 mb-10">{c.formIntro}</p>
          {offer.open
            ? <ReveillonWizard key={wizard.key} lang={lang} offer={offer} onOfferChange={setOffer} initialFormula={wizard.formula} initialTentId={wizard.tentId} />
            : <p className="text-white/70">{c.closed}</p>}
        </div>
      </section>

      {/* ── Practical info ─────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <Eyebrow>{c.infoLabel}</Eyebrow>
        <h2 className="heading-display text-4xl md:text-5xl mb-10">{c.infoTitle}</h2>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {c.faq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-white/90 min-h-[44px]">
                {f.q}
                <Plus className="w-4 h-4 text-[#d9a95b] shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="text-white/60 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final call ─────────────────────────────────── */}
      {offer.open && (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <Image src={IMG.fireworks} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b1a] via-[#070b1a]/55 to-[#070b1a]/85" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
            <p className="heading-display text-[clamp(3.5rem,14vw,11rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(251,233,198,0.55)] mb-6">2027</p>
            <h2 className="heading-display text-3xl md:text-5xl mb-4 max-w-2xl">{c.finalTitle}</h2>
            <p className="text-white/75 mb-10 max-w-xl">{c.finalBody}</p>
            <button type="button" onClick={() => book()} style={{ backgroundColor: GOLD }} className={ctaPrimary}>{c.ctaBook}</button>
          </div>
        </section>
      )}
    </div>
  );
}
