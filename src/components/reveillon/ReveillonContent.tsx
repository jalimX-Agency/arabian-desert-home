"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, Loader2, Flame, Sparkles, Tent, X, CalendarDays, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/arabian/WhatsAppIcon";
import { pickLocalized, type Language } from "@/lib/i18n/context";
import { currentLeadSource } from "@/lib/lead-source";
import { LANG_LOCALE } from "@/lib/reservation-lang";
import { formatMoney } from "@/lib/money";
import { eurToMad, SOIREE_CHILD_PERCENT, type ReveillonOffer, type ReveillonTent } from "@/lib/reveillon";
import { REVEILLON_COPY } from "./reveillon-copy";

const R2 = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery";
const IMG = {
  hero: `${R2}/night.png`,
  firePit: `${R2}/reveillon/fire-pit.webp`,
  performer: `${R2}/reveillon/fire-performer.webp`,
  gnawa: `${R2}/reveillon/gnawa.webp`,
  pool: `${R2}/reveillon/pool-sunset.webp`,
  tent: `${R2}/reveillon/tent.webp`,
  campfire: `${R2}/reveillon/campfire.webp`,
  path: `${R2}/reveillon/lantern-path.webp`,
};
const WHATSAPP_NUMBER = "212667370206";

interface TentChoice { key: number; suiteId: string; adults: number; children: number }

/** "390 €" with the indicative MAD amount under it, as on the printed offer. */
function Price({ eur, locale, big = false }: { eur: number; locale: string; big?: boolean }) {
  return (
    <span className="inline-flex flex-col">
      <span className={`mono-number text-amber ${big ? "text-3xl" : "text-lg"}`}>{formatMoney(eur, locale)} €</span>
      <span className="text-xs text-muted-foreground">≈ {formatMoney(eurToMad(eur), locale)} MAD</span>
    </span>
  );
}

function Stepper({ label, value, min = 0, max, onChange }: { label: string; value: number; min?: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`${label} -1`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-amber/60 disabled:opacity-30 cursor-pointer transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <span className="mono-number w-6 text-center" aria-live="polite">{value}</span>
        <button type="button" aria-label={`${label} +1`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-amber/60 disabled:opacity-30 cursor-pointer transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/** The New Year's Eve page: story, programme, packages, live availability and the booking form. */
export function ReveillonContent({ lang, initialOffer }: { lang: Language; initialOffer: ReveillonOffer }) {
  const c = REVEILLON_COPY[lang];
  const locale = LANG_LOCALE[lang];
  const [offer, setOffer] = useState(initialOffer);
  const [soiree, setSoiree] = useState({ adults: 0, children: 0 });
  const [tents, setTents] = useState<TentChoice[]>([]);
  const [transport, setTransport] = useState(false);
  const [pickup, setPickup] = useState("");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const [terms, setTerms] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);

  // The page is cached for an hour: refresh seats and tents left as soon as it opens.
  useEffect(() => {
    fetch("/api/reveillon", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((o) => o && setOffer(o)).catch(() => {});
  }, []);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsappMessage)}`;
  const tentName = (t: ReveillonTent) => pickLocalized(lang, t.name, t.nameEn, t.nameEs, t.nameIt);
  const tentById = (id: string) => offer.tents.find((t) => t.suiteId === id);
  const chosenOf = (id: string) => tents.filter((t) => t.suiteId === id).length;

  const total = useMemo(() => {
    const soireeTotal = soiree.adults * offer.soiree.priceEur + soiree.children * offer.soiree.priceEur * (SOIREE_CHILD_PERCENT / 100);
    const tentsTotal = tents.reduce((s, t) => s + (tentById(t.suiteId)?.priceEur ?? 0), 0);
    const transportTotal = transport && offer.transport ? offer.transport.priceEur : 0;
    return Math.round((soireeTotal + tentsTotal + transportTotal) * 100) / 100;
  }, [soiree, tents, transport, offer]);

  function addTent(t: ReveillonTent) {
    if (chosenOf(t.suiteId) >= t.left) return;
    setTents((prev) => [...prev, { key: Date.now() + Math.random(), suiteId: t.suiteId, adults: Math.min(2, t.maxGuests), children: 0 }]);
  }

  function goToForm(pick?: ReveillonTent | "soiree") {
    if (pick === "soiree" && soiree.adults === 0) setSoiree({ adults: 2, children: soiree.children });
    else if (pick && pick !== "soiree" && chosenOf(pick.suiteId) === 0) addTent(pick);
    document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (soiree.adults + soiree.children === 0 && tents.length === 0) return setError(c.errors.empty);
    if (soiree.children > 0 && soiree.adults === 0) return setError(c.errors.child_alone);
    if (!terms) return setError(c.errors.terms);
    setSending(true);
    try {
      const res = await fetch("/api/reveillon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          lang,
          source: currentLeadSource(),
          acceptTerms: terms,
          soiree,
          tents: tents.map(({ suiteId, adults, children }) => ({ suiteId, adults, children })),
          transport: transport && offer.transport ? { transportId: offer.transport.id, pickup } : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(c.errors[data.code] ?? c.errors.generic);
        fetch("/api/reveillon", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((o) => o && setOffer(o)).catch(() => {});
        return;
      }
      setDone(data.manageUrl ?? "");
      document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setError(c.errors.generic);
    } finally {
      setSending(false);
    }
  }

  const input = "w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-base focus:outline-none focus:border-amber/60";

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[82vh] flex items-end overflow-hidden">
        <Image src={IMG.hero} alt={c.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pb-16 pt-40 text-white">
          <p className="luxury-label text-amber mb-4 flex items-center gap-2"><CalendarDays className="w-4 h-4" />{c.eyebrow}</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-7xl mb-5 max-w-3xl">{c.title}</h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mb-8 body-editorial">{c.subtitle}</p>
          {offer.open ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => goToForm()} className="btn-primary cursor-pointer">{c.ctaBook}</button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm hover:bg-white/10 transition-colors">
                <WhatsAppIcon className="w-4 h-4" />{c.ctaWhatsApp}
              </a>
            </div>
          ) : (
            <p className="text-white/80">{c.closed}</p>
          )}
          <p className="mt-6 text-sm text-white/70 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber" />
            {offer.soiree.seatsLeft > 0 ? c.limited(offer.soiree.seatsLeft) : c.soldOutSoiree}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="luxury-label text-amber/80 mb-3 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Désert d&apos;Agafay · Marrakech</p>
          <h2 className="heading-display text-3xl md:text-4xl mb-5">{c.introTitle}</h2>
          <p className="text-muted-foreground body-editorial leading-relaxed">{c.intro}</p>
        </div>
        <div className="relative aspect-[925/297] md:aspect-[16/9] rounded-2xl overflow-hidden">
          <Image src={IMG.firePit} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* Programme */}
      <section className="bg-foreground/[0.03] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <div>
            <p className="luxury-label text-amber/80 mb-3">{c.programmeLabel}</p>
            <h2 className="heading-display text-3xl md:text-4xl mb-8">{c.programmeTitle}</h2>
            <ol className="divide-y divide-border/50">
              {c.programme.map((p) => (
                <li key={p.time} className="grid grid-cols-[88px_1fr] gap-4 py-4">
                  <span className="mono-number text-amber text-lg">{p.time}</span>
                  <span className="text-sm md:text-base leading-relaxed">{p.text}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-3">{c.indicative}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 aspect-[435/407] rounded-2xl overflow-hidden">
              <Image src={IMG.performer} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={IMG.campfire} alt="" fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src={IMG.path} alt="" fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <p className="luxury-label text-amber/80 mb-3">{c.offersLabel}</p>
        <h2 className="heading-display text-3xl md:text-4xl mb-10">{c.offersTitle}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article className="glass-card card-warm p-6 flex flex-col">
            <Sparkles className="w-6 h-6 text-amber mb-4" />
            <h3 className="font-serif text-xl mb-1">{c.soiree}</h3>
            <p className="text-xs text-muted-foreground mb-4">{c.soireeFor}</p>
            <Price eur={offer.soiree.priceEur} locale={locale} big />
            <p className="text-xs text-muted-foreground mt-1 mb-4">{c.perPerson} · {c.childHalf}</p>
            <ul className="space-y-2 text-sm mb-6 flex-1">
              {c.includes.map((i) => <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-amber shrink-0 mt-0.5" />{i}</li>)}
            </ul>
            <p className={`text-xs mb-3 ${offer.soiree.seatsLeft > 0 ? "text-amber" : "text-red-500"}`}>
              {offer.soiree.seatsLeft > 0 ? c.seatsLeft(offer.soiree.seatsLeft) : c.full}
            </p>
            <button type="button" onClick={() => goToForm("soiree")} disabled={!offer.open || offer.soiree.seatsLeft === 0} className="btn-outline text-sm cursor-pointer disabled:opacity-40">{c.choose}</button>
          </article>
          {offer.tents.map((t) => (
            <article key={t.suiteId} className={`glass-card card-warm p-6 flex flex-col ${t.left === 0 ? "opacity-60" : ""}`}>
              <Tent className="w-6 h-6 text-amber mb-4" />
              <h3 className="font-serif text-xl mb-1">{c.soiree} + {tentName(t)}</h3>
              <p className="text-xs text-muted-foreground mb-4">{c.forPersons(t.maxGuests)}</p>
              <Price eur={t.priceEur} locale={locale} big />
              <p className="text-xs text-muted-foreground mt-1 mb-4">{c.packageNote}</p>
              <ul className="space-y-2 text-sm mb-6 flex-1">
                {[...c.includes, c.nightIncluded, c.breakfastIncluded].map((i) => <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-amber shrink-0 mt-0.5" />{i}</li>)}
              </ul>
              <p className={`text-xs mb-3 ${t.left > 0 ? "text-amber" : "text-red-500"}`}>{t.left > 0 ? c.left(t.left) : c.full}</p>
              <button type="button" onClick={() => goToForm(t)} disabled={!offer.open || t.left === 0} className="btn-outline text-sm cursor-pointer disabled:opacity-40">{t.left > 0 ? c.choose : c.full}</button>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <p className="luxury-label text-amber/80 mb-5">{c.galleryLabel}</p>
        <div className="grid grid-cols-3 gap-3">
          {[IMG.gnawa, IMG.pool, IMG.tent].map((src) => (
            <div key={src} className="relative aspect-[3/2] rounded-xl overflow-hidden">
              <Image src={src} alt="" fill sizes="(min-width: 768px) 300px, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section id="reserver" className="scroll-mt-24 bg-foreground/[0.03] py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="luxury-label text-amber/80 mb-3">{c.formLabel}</p>
          <h2 className="heading-display text-3xl md:text-4xl mb-3">{c.formTitle}</h2>

          {done !== null ? (
            <div className="glass-card card-warm p-8 mt-8 text-center">
              <Check className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-serif text-2xl mb-3">{c.successTitle}</h3>
              <p className="text-muted-foreground body-editorial mb-6">{c.successBody}</p>
              {done && <a href={done} className="btn-primary inline-block">{c.successLink}</a>}
            </div>
          ) : !offer.open ? (
            <p className="text-muted-foreground mt-6">{c.closed}</p>
          ) : (
            <form onSubmit={submit} className="space-y-6 mt-8" noValidate>
              <p className="text-muted-foreground body-editorial -mt-4">{c.formIntro}</p>

              <fieldset className="glass-card card-warm p-6 space-y-4">
                <legend className="sr-only">{c.soireeOnly}</legend>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg">{c.soireeOnly}</p>
                    <p className="text-xs text-muted-foreground">{formatMoney(offer.soiree.priceEur, locale)} € {c.perPerson} · {c.childHalf} · {c.seatsLeft(offer.soiree.seatsLeft)}</p>
                  </div>
                </div>
                <Stepper label={c.adults} value={soiree.adults} max={Math.max(0, offer.soiree.seatsLeft - soiree.children)} onChange={(v) => setSoiree((s) => ({ ...s, adults: v }))} />
                <Stepper label={c.children} value={soiree.children} max={Math.max(0, offer.soiree.seatsLeft - soiree.adults)} onChange={(v) => setSoiree((s) => ({ ...s, children: v }))} />
                <p className="text-xs text-muted-foreground">{c.childrenHint}</p>
              </fieldset>

              <fieldset className="glass-card card-warm p-6 space-y-4">
                <legend className="sr-only">{c.tentsTitle}</legend>
                <p className="font-serif text-lg">{c.tentsTitle}</p>
                {tents.map((choice) => {
                  const t = tentById(choice.suiteId);
                  if (!t) return null;
                  const update = (patch: Partial<TentChoice>) => setTents((prev) => prev.map((x) => (x.key === choice.key ? { ...x, ...patch } : x)));
                  return (
                    <div key={choice.key} className="rounded-xl border border-border/50 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{c.soiree} + {tentName(t)}</p>
                          <p className="text-xs text-muted-foreground">{formatMoney(t.priceEur, locale)} € · {c.maxPersons(t.maxGuests)}</p>
                        </div>
                        <button type="button" onClick={() => setTents((prev) => prev.filter((x) => x.key !== choice.key))} className="text-xs text-red-500 hover:underline cursor-pointer inline-flex items-center gap-1 min-h-[44px]">
                          <X className="w-3.5 h-3.5" />{c.remove}
                        </button>
                      </div>
                      <Stepper label={c.adults} value={choice.adults} min={1} max={t.maxGuests - choice.children} onChange={(v) => update({ adults: v })} />
                      <Stepper label={c.children} value={choice.children} max={t.maxGuests - choice.adults} onChange={(v) => update({ children: v })} />
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2">
                  {offer.tents.filter((t) => t.left > chosenOf(t.suiteId)).map((t) => (
                    <button key={t.suiteId} type="button" onClick={() => addTent(t)} className="btn-outline text-xs cursor-pointer inline-flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />{c.addTent(tentName(t))}
                    </button>
                  ))}
                </div>
              </fieldset>

              {offer.transport && (
                <fieldset className="glass-card card-warm p-6 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={transport} onChange={(e) => setTransport(e.target.checked)} className="mt-1 w-4 h-4 cursor-pointer" />
                    <span className="text-sm">{c.transport(`${formatMoney(offer.transport.priceEur, locale)} €`)}</span>
                  </label>
                  {transport && (
                    <div>
                      <label htmlFor="nye-pickup" className="text-xs text-muted-foreground block mb-1">{c.pickup}</label>
                      <input id="nye-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder={c.pickupPlaceholder} maxLength={200} className={input} />
                    </div>
                  )}
                </fieldset>
              )}

              <fieldset className="grid sm:grid-cols-2 gap-4">
                {(["firstName", "lastName", "email", "phone"] as const).map((k) => (
                  <div key={k}>
                    <label htmlFor={`nye-${k}`} className="text-xs text-muted-foreground block mb-1">{c[k]}</label>
                    <input id={`nye-${k}`} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} autoComplete={k === "firstName" ? "given-name" : k === "lastName" ? "family-name" : k === "email" ? "email" : "tel"}
                      required value={contact[k]} onChange={(e) => setContact((s) => ({ ...s, [k]: e.target.value }))} className={input} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="nye-notes" className="text-xs text-muted-foreground block mb-1">{c.notes}</label>
                  <textarea id="nye-notes" rows={3} value={contact.notes} onChange={(e) => setContact((s) => ({ ...s, notes: e.target.value }))} placeholder={c.notesPlaceholder} maxLength={1000} className={`${input} resize-none`} />
                </div>
              </fieldset>

              <div className="glass-card card-warm p-6 space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="luxury-label text-amber/70">{c.total}</span>
                  <Price eur={total} locale={locale} big />
                </div>
                {total > 0 && (
                  <p className="text-sm text-muted-foreground">{c.deposit} : <span className="mono-number text-foreground">{formatMoney(Math.round(total * 50) / 100, locale)} €</span></p>
                )}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 w-4 h-4 cursor-pointer" />
                  <span className="text-sm leading-relaxed">{c.terms}</span>
                </label>
                {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
                <button type="submit" disabled={sending} className="btn-primary w-full cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {sending ? c.sending : c.submit}
                </button>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
                  <WhatsAppIcon className="w-4 h-4" />{c.ctaWhatsApp}
                </a>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Practical info */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20">
        <p className="luxury-label text-amber/80 mb-3">{c.infoLabel}</p>
        <h2 className="heading-display text-3xl md:text-4xl mb-8">{c.infoTitle}</h2>
        <div className="divide-y divide-border/50">
          {c.faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium min-h-[44px]">
                {f.q}
                <Plus className="w-4 h-4 text-amber shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="text-muted-foreground body-editorial mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final call */}
      {offer.open && (
        <section className="relative py-24 overflow-hidden">
          <Image src={IMG.firePit} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
            <h2 className="heading-display text-3xl md:text-4xl mb-4">{c.finalTitle}</h2>
            <p className="text-white/80 mb-8">{c.finalBody}</p>
            <button type="button" onClick={() => goToForm()} className="btn-primary cursor-pointer">{c.ctaBook}</button>
          </div>
        </section>
      )}
    </div>
  );
}
