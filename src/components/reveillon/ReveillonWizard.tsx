"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Loader2, Minus, Plus, Sparkles, Tent, Car, Footprints } from "lucide-react";
import { WhatsAppIcon } from "@/components/arabian/WhatsAppIcon";
import { pickLocalized, type Language } from "@/lib/i18n/context";
import { currentLeadSource } from "@/lib/lead-source";
import { LANG_LOCALE } from "@/lib/reservation-lang";
import { formatMoney } from "@/lib/money";
import { eurToMad, SOIREE_CHILD_PERCENT, type ReveillonOffer, type ReveillonTent } from "@/lib/reveillon";
import { REVEILLON_COPY } from "./reveillon-copy";
import { REVEILLON_UI } from "./reveillon-ui-copy";

type Formula = "soiree" | "night";
interface TentGuests { key: string; suiteId: string; adults: number; children: number }

const GOLD = "#d9a95b";

function Stepper({ label, hint, value, min = 0, max, onChange }: { label: string; hint?: string; value: number; min?: number; max: number; onChange: (v: number) => void }) {
  const btn = "w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white hover:border-[#d9a95b] hover:text-[#f0cf8a] disabled:opacity-25 disabled:hover:border-white/15 cursor-pointer transition-colors";
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm text-white">{label}</p>
        {hint && <p className="text-xs text-white/45">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`${label} −`} className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}><Minus className="w-4 h-4" /></button>
        <span className="font-mono text-lg w-6 text-center text-[#fbe9c6] tabular-nums" aria-live="polite">{value}</span>
        <button type="button" aria-label={`${label} +`} className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}><Plus className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function Money({ eur, locale, size = "md" }: { eur: number; locale: string; size?: "md" | "lg" }) {
  return (
    <span className="inline-flex flex-col items-end">
      <span className={`font-mono tabular-nums text-[#f0cf8a] ${size === "lg" ? "text-3xl" : "text-base"}`}>{formatMoney(eur, locale)} €</span>
      <span className="text-[11px] text-white/45">≈ {formatMoney(eurToMad(eur), locale)} MAD</span>
    </span>
  );
}

/** Five-step booking: formula → guests → transfer → details → summary, then one request to /api/reveillon. */
export function ReveillonWizard({ lang, offer, onOfferChange, initialFormula, initialTentId }: {
  lang: Language;
  offer: ReveillonOffer;
  onOfferChange: (o: ReveillonOffer) => void;
  initialFormula?: Formula | null;
  /** Tent picked from a package card: starts with one of it selected. */
  initialTentId?: string | null;
}) {
  const c = REVEILLON_COPY[lang];
  const u = REVEILLON_UI[lang];
  const locale = LANG_LOCALE[lang];
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [formula, setFormula] = useState<Formula | null>(initialFormula ?? null);
  const [counts, setCounts] = useState<Record<string, number>>(initialTentId ? { [initialTentId]: 1 } : {});
  const [tents, setTents] = useState<TentGuests[]>([]);
  const [soiree, setSoiree] = useState({ adults: 2, children: 0 });
  const [extra, setExtra] = useState({ adults: 0, children: 0 });
  const [transport, setTransport] = useState(false);
  const [pickup, setPickup] = useState("");
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const tentName = (t: ReveillonTent) => pickLocalized(lang, t.name, t.nameEn, t.nameEs, t.nameIt);
  const tentOf = (id: string) => offer.tents.find((t) => t.suiteId === id);
  const availableTents = offer.tents.filter((t) => t.left > 0);
  const minTent = availableTents.length ? Math.min(...availableTents.map((t) => t.priceEur)) : null;

  // What the request will contain, whatever path the guest took.
  const soireeGuests = formula === "soiree" ? soiree : extra;
  const lines = formula === "night" ? tents : [];
  const total = useMemo(() => {
    const s = soireeGuests.adults * offer.soiree.priceEur + soireeGuests.children * offer.soiree.priceEur * (SOIREE_CHILD_PERCENT / 100);
    const t = lines.reduce((sum, x) => sum + (tentOf(x.suiteId)?.priceEur ?? 0), 0);
    return Math.round((s + t + (transport && offer.transport ? offer.transport.priceEur : 0)) * 100) / 100;
  }, [soireeGuests, lines, transport, offer]);

  /** Rebuilds the per-tent guest rows from the tent counts, keeping what was already typed. */
  function syncTents() {
    setTents((prev) => offer.tents.flatMap((t) => {
      const mine = prev.filter((x) => x.suiteId === t.suiteId);
      return Array.from({ length: counts[t.suiteId] ?? 0 }, (_, i) => mine[i] ?? { key: `${t.suiteId}-${i}`, suiteId: t.suiteId, adults: Math.min(2, t.maxGuests), children: 0 });
    }));
  }

  function validate(s: number): string {
    if (s === 0) {
      if (!formula) return c.errors.empty;
      if (formula === "night" && Object.values(counts).every((n) => !n)) return u.needTent;
    }
    if (s === 1) {
      const g = soireeGuests;
      if (formula === "soiree" && g.adults === 0) return u.needGuests;
      if (g.children > 0 && g.adults === 0) return c.errors.child_alone;
      if (g.adults + g.children > offer.soiree.seatsLeft) return c.errors.seats;
    }
    if (s === 3) {
      const { firstName, lastName, email, phone } = contact;
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return u.needContact;
    }
    return "";
  }

  function go(to: number) {
    if (to > step) {
      const err = validate(step);
      if (err) return setError(err);
      if (step === 0 && formula === "night") syncTents();
    }
    setError("");
    setDir(to > step ? 1 : -1);
    setStep(to);
    document.getElementById("reserver")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit() {
    if (!terms) return setError(c.errors.terms);
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reveillon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          lang,
          source: currentLeadSource(),
          acceptTerms: true,
          soiree: soireeGuests,
          tents: lines.map(({ suiteId, adults, children }) => ({ suiteId, adults, children })),
          transport: transport && offer.transport ? { transportId: offer.transport.id, pickup } : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(c.errors[data.code] ?? c.errors.generic);
        fetch("/api/reveillon", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((o) => o && onOfferChange(o)).catch(() => {});
        return;
      }
      setDone(data.manageUrl ?? "");
    } catch {
      setError(c.errors.generic);
    } finally {
      setSending(false);
    }
  }

  const input = "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#d9a95b]";
  const choice = (on: boolean) => `w-full text-left rounded-2xl border p-5 transition-all cursor-pointer ${on ? "border-[#d9a95b] bg-[#d9a95b]/10 shadow-[0_0_0_1px_#d9a95b]" : "border-white/12 bg-white/[0.03] hover:border-white/30"}`;

  if (done !== null) {
    return (
      <div className="rounded-3xl border border-[#d9a95b]/40 bg-white/[0.04] p-8 sm:p-12 text-center">
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-[#d9a95b]/15 flex items-center justify-center"><Check className="w-7 h-7 text-[#f0cf8a]" /></div>
        <h3 className="heading-display text-2xl sm:text-3xl text-white mb-3">{c.successTitle}</h3>
        <p className="text-white/70 max-w-lg mx-auto mb-8">{c.successBody}</p>
        {done && <a href={done} className="inline-flex rounded-full bg-[#d9a95b] px-7 py-3 text-sm font-semibold text-[#0b0f1f] hover:bg-[#f0cf8a] transition-colors">{c.successLink}</a>}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e1430]/80 backdrop-blur p-5 sm:p-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#f0cf8a]/80">{u.stepOf(step + 1, u.steps.length)}</p>
          <p className="text-sm text-white/80">{u.steps[step]}</p>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {u.steps.map((s, i) => (
            <button key={s} type="button" onClick={() => i < step && go(i)} disabled={i >= step} aria-label={s}
              className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-[#d9a95b]" : "bg-white/10"} ${i < step ? "cursor-pointer" : "cursor-default"}`} />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="heading-display text-xl sm:text-2xl text-white mb-2">{u.formulaTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button type="button" className={choice(formula === "soiree")} onClick={() => setFormula("soiree")} disabled={offer.soiree.seatsLeft === 0}>
                    <Sparkles className="w-6 h-6 text-[#f0cf8a] mb-3" />
                    <p className="text-lg text-white font-medium">{u.formulaSoireeTitle}</p>
                    <p className="text-sm text-white/55 mt-1 mb-4">{u.formulaSoireeText}</p>
                    <p className="text-sm text-white/80"><span className="font-mono text-[#f0cf8a] text-lg">{formatMoney(offer.soiree.priceEur, locale)} €</span> {c.perPerson}</p>
                    <p className="text-xs text-white/45">{offer.soiree.seatsLeft > 0 ? c.seatsLeft(offer.soiree.seatsLeft) : c.full} · {c.childHalf}</p>
                  </button>
                  <button type="button" className={choice(formula === "night")} onClick={() => setFormula("night")} disabled={availableTents.length === 0}>
                    <Tent className="w-6 h-6 text-[#f0cf8a] mb-3" />
                    <p className="text-lg text-white font-medium">{u.formulaNightTitle}</p>
                    <p className="text-sm text-white/55 mt-1 mb-4">{u.formulaNightText}</p>
                    {minTent !== null
                      ? <p className="text-sm text-white/80">{u.from} <span className="font-mono text-[#f0cf8a] text-lg">{formatMoney(minTent, locale)} €</span></p>
                      : <p className="text-sm text-red-300">{c.full}</p>}
                  </button>
                </div>

                {formula === "night" && (
                  <div className="pt-4">
                    <p className="text-sm text-white/80 mb-3">{u.tentsQuestion}</p>
                    {availableTents.length === 0 && <p className="text-sm text-white/55">{u.tentsNone}</p>}
                    <div className="space-y-3">
                      {offer.tents.map((t) => (
                        <div key={t.suiteId} className={`rounded-2xl border border-white/10 bg-white/[0.03] p-4 ${t.left === 0 ? "opacity-45" : ""}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-white font-medium">{tentName(t)}</p>
                              <p className="text-xs text-white/50">{c.forPersons(t.maxGuests)} · {c.packageNote}</p>
                              <p className={`text-xs mt-1 ${t.left > 0 ? "text-[#f0cf8a]/80" : "text-red-300"}`}>{t.left > 0 ? c.left(t.left) : c.full}</p>
                            </div>
                            <Money eur={t.priceEur} locale={locale} />
                          </div>
                          {t.left > 0 && (
                            <Stepper label={c.tentLine(tentName(t))} value={counts[t.suiteId] ?? 0} max={t.left}
                              onChange={(v) => setCounts((s) => ({ ...s, [t.suiteId]: v }))} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="heading-display text-xl sm:text-2xl text-white mb-2">{u.guestsTitle}</h3>
                {formula === "soiree" ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2">
                    <Stepper label={c.adults} value={soiree.adults} min={1} max={Math.max(1, offer.soiree.seatsLeft - soiree.children)} onChange={(v) => setSoiree((s) => ({ ...s, adults: v }))} />
                    <Stepper label={c.children} hint={c.childHalf} value={soiree.children} max={Math.max(0, offer.soiree.seatsLeft - soiree.adults)} onChange={(v) => setSoiree((s) => ({ ...s, children: v }))} />
                  </div>
                ) : (
                  <>
                    {tents.map((g) => {
                      const t = tentOf(g.suiteId);
                      if (!t) return null;
                      const set = (patch: Partial<TentGuests>) => setTents((prev) => prev.map((x) => (x.key === g.key ? { ...x, ...patch } : x)));
                      return (
                        <div key={g.key} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                          <p className="text-white font-medium mb-1">{tentName(t)} <span className="text-xs text-white/45">· {c.maxPersons(t.maxGuests)}</span></p>
                          <Stepper label={c.adults} value={g.adults} min={1} max={t.maxGuests - g.children} onChange={(v) => set({ adults: v })} />
                          <Stepper label={c.children} value={g.children} max={t.maxGuests - g.adults} onChange={(v) => set({ children: v })} />
                        </div>
                      );
                    })}
                    {offer.soiree.seatsLeft > 0 && (
                      <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                        <p className="text-white/90 text-sm">{u.extraGuests}</p>
                        <p className="text-xs text-white/45 mb-1">{u.extraGuestsHint} · {formatMoney(offer.soiree.priceEur, locale)} € {c.perPerson}</p>
                        <Stepper label={c.adults} value={extra.adults} max={Math.max(0, offer.soiree.seatsLeft - extra.children)} onChange={(v) => setExtra((s) => ({ ...s, adults: v }))} />
                        <Stepper label={c.children} hint={c.childHalf} value={extra.children} max={Math.max(0, offer.soiree.seatsLeft - extra.adults)} onChange={(v) => setExtra((s) => ({ ...s, children: v }))} />
                      </div>
                    )}
                  </>
                )}
                <p className="text-xs text-white/45">{c.childrenHint}</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="heading-display text-xl sm:text-2xl text-white mb-2">{u.transportTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button type="button" className={choice(transport)} onClick={() => setTransport(true)} disabled={!offer.transport}>
                    <Car className="w-6 h-6 text-[#f0cf8a] mb-3" />
                    <p className="text-white font-medium">{u.transportYes}</p>
                    {offer.transport && <p className="text-sm text-white/55 mt-1"><span className="font-mono text-[#f0cf8a]">{formatMoney(offer.transport.priceEur, locale)} €</span></p>}
                  </button>
                  <button type="button" className={choice(!transport)} onClick={() => setTransport(false)}>
                    <Footprints className="w-6 h-6 text-[#f0cf8a] mb-3" />
                    <p className="text-white font-medium">{u.transportNo}</p>
                  </button>
                </div>
                {transport && (
                  <div>
                    <label htmlFor="nye-pickup" className="text-xs text-white/55 block mb-1">{c.pickup}</label>
                    <input id="nye-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder={c.pickupPlaceholder} maxLength={200} className={input} />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="heading-display text-xl sm:text-2xl text-white mb-2">{u.contactTitle}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(["firstName", "lastName", "email", "phone"] as const).map((k) => (
                    <div key={k}>
                      <label htmlFor={`nye-${k}`} className="text-xs text-white/55 block mb-1">{c[k]}</label>
                      <input id={`nye-${k}`} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"}
                        autoComplete={k === "firstName" ? "given-name" : k === "lastName" ? "family-name" : k === "email" ? "email" : "tel"}
                        value={contact[k]} onChange={(e) => setContact((s) => ({ ...s, [k]: e.target.value }))} className={input} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label htmlFor="nye-notes" className="text-xs text-white/55 block mb-1">{c.notes}</label>
                    <textarea id="nye-notes" rows={3} value={contact.notes} onChange={(e) => setContact((s) => ({ ...s, notes: e.target.value }))} placeholder={c.notesPlaceholder} maxLength={1000} className={`${input} resize-none`} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <h3 className="heading-display text-xl sm:text-2xl text-white">{u.summaryTitle}</h3>
                <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
                  {lines.map((g) => {
                    const t = tentOf(g.suiteId)!;
                    return (
                      <li key={g.key} className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-white/85">{u.summaryTent(tentName(t), g.adults, g.children)}</span>
                        <span className="font-mono text-sm text-[#f0cf8a]">{formatMoney(t.priceEur, locale)} €</span>
                      </li>
                    );
                  })}
                  {soireeGuests.adults + soireeGuests.children > 0 && (
                    <li className="flex items-center justify-between gap-4 py-3">
                      <span className="text-sm text-white/85">{u.summarySoiree(soireeGuests.adults, soireeGuests.children)}</span>
                      <span className="font-mono text-sm text-[#f0cf8a]">{formatMoney(soireeGuests.adults * offer.soiree.priceEur + soireeGuests.children * offer.soiree.priceEur * SOIREE_CHILD_PERCENT / 100, locale)} €</span>
                    </li>
                  )}
                  {transport && offer.transport && (
                    <li className="flex items-center justify-between gap-4 py-3">
                      <span className="text-sm text-white/85">{u.summaryTransport}</span>
                      <span className="font-mono text-sm text-[#f0cf8a]">{formatMoney(offer.transport.priceEur, locale)} €</span>
                    </li>
                  )}
                </ul>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">{c.total}</p>
                    <p className="text-sm text-white/60 mt-1">{c.deposit} : <span className="font-mono text-white">{formatMoney(Math.round(total * 50) / 100, locale)} €</span></p>
                  </div>
                  <Money eur={total} locale={locale} size="lg" />
                </div>
                <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-white/10 p-4">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#d9a95b] cursor-pointer" />
                  <span className="text-sm text-white/80 leading-relaxed">{c.terms}</span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && <p role="alert" className="mt-5 text-sm text-red-300">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:border-white/40 cursor-pointer min-h-[44px]">
            <ChevronLeft className="w-4 h-4" />{u.back}
          </button>
        ) : (
          <a href={`https://wa.me/212667370206?text=${encodeURIComponent(c.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white min-h-[44px]">
            <WhatsAppIcon className="w-4 h-4" />{c.ctaWhatsApp}
          </a>
        )}
        {step < 4 ? (
          <button type="button" onClick={() => go(step + 1)} style={{ backgroundColor: GOLD }} className="inline-flex items-center gap-1.5 rounded-full px-7 py-3 text-sm font-semibold text-[#0b0f1f] hover:brightness-110 cursor-pointer min-h-[44px]">
            {u.next}<ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={sending} style={{ backgroundColor: GOLD }} className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-[#0b0f1f] hover:brightness-110 disabled:opacity-50 cursor-pointer min-h-[44px]">
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}{sending ? c.sending : c.submit}
          </button>
        )}
      </div>
    </div>
  );
}
