"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BedDouble, CalendarDays, Check, ChevronLeft, ChevronRight, Info, Maximize2, Users, Wind } from "lucide-react";
import { pickLocalized, useLanguage, withLocale, type Language } from "@/lib/i18n/context";
import {
  addDaysISO,
  bookingQuery,
  freeCancellationUntil,
  nightsBetweenISO,
  parseISODay,
  parseTentPicks,
  readStayFromQuery,
  todayISO,
  type StayDraft,
} from "@/lib/tent-stay";

export interface TentSuite {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  nameEs?: string;
  nameIt?: string;
  tagline: string;
  taglineEn?: string;
  taglineEs?: string;
  taglineIt?: string;
  description: string;
  descriptionEn?: string;
  descriptionEs?: string;
  descriptionIt?: string;
  features: string;
  featuresEn?: string;
  featuresEs?: string;
  featuresIt?: string;
  amenities: string;
  amenitiesEn?: string;
  amenitiesEs?: string;
  amenitiesIt?: string;
  image: string;
  images: string;
  maxGuests: number;
  maxChildren: number;
  bedType: string;
  size: string;
  hasAC: boolean;
  units: number;
  freeCancellationDays: number;
  currency: string;
}

interface StayInfo {
  suiteId: string;
  units: number;
  left: number;
  closed: boolean;
  nights: number;
  total: number;
  currency: string;
}

const LOCALE: Record<Language, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES", it: "it-IT" };

const COPY: Record<Language, {
  title: string; subtitle: string; arrival: string; departure: string; adults: string; children: string;
  nights: (n: number) => string; pickDates: string; pickDatesShort: string; priceFor: (n: number) => string;
  perNight: string; breakfast: string; freeUntil: (d: string) => string; freeDays: (n: number) => string;
  notFree: string; onlyLeft: (n: number) => string; soldOut: string; closed: string; howMany: string;
  reserve: string; total: string; tents: (n: number) => string; details: string; maxAdults: (n: number) => string;
  maxChildren: (n: number) => string; needed: (n: number) => string; notEnough: string; loading: string;
  error: string; fits: string; photo: (i: number, n: number) => string; none: string; selectTents: string;
}> = {
  fr: {
    title: "Vérifiez les disponibilités et les prix",
    subtitle: "Choisissez vos dates : le prix de chaque tente s'affiche pour votre séjour.",
    arrival: "Arrivée", departure: "Départ", adults: "Adultes", children: "Enfants",
    nights: (n) => `${n} nuit${n > 1 ? "s" : ""}`,
    pickDates: "Choisissez vos dates pour voir le prix", pickDatesShort: "Prix selon vos dates",
    priceFor: (n) => `Prix pour ${n} nuit${n > 1 ? "s" : ""}`, perNight: "par nuit en moyenne",
    breakfast: "Petit-déjeuner inclus",
    freeUntil: (d) => `Annulation gratuite jusqu'au ${d}`,
    freeDays: (n) => `Annulation gratuite jusqu'à ${n} jour${n > 1 ? "s" : ""} avant l'arrivée`,
    notFree: "Annulation non gratuite pour ces dates",
    onlyLeft: (n) => `Plus que ${n} disponible${n > 1 ? "s" : ""}`, soldOut: "Complet sur ces dates",
    closed: "Non disponible sur ces dates", howMany: "Nombre de tentes",
    reserve: "Je réserve", total: "Total", tents: (n) => `${n} tente${n > 1 ? "s" : ""}`,
    details: "Voir les détails", maxAdults: (n) => `${n} adulte${n > 1 ? "s" : ""} max.`,
    maxChildren: (n) => `+ ${n} enfant${n > 1 ? "s" : ""}`,
    needed: (n) => `Pour votre groupe, comptez ${n} tentes de ce type`,
    notEnough: "La sélection ne couvre pas tous les voyageurs : ajoutez une tente.",
    loading: "Calcul des prix…", error: "Impossible de charger les disponibilités. Réessayez.",
    fits: "Convient à votre groupe", photo: (i, n) => `Photo ${i} sur ${n}`, none: "Aucune tente à afficher.",
    selectTents: "Choisissez le nombre de tentes",
  },
  en: {
    title: "Check availability and prices",
    subtitle: "Pick your dates: the price of each tent is shown for your stay.",
    arrival: "Check-in", departure: "Check-out", adults: "Adults", children: "Children",
    nights: (n) => `${n} night${n > 1 ? "s" : ""}`,
    pickDates: "Choose your dates to see the price", pickDatesShort: "Price depends on your dates",
    priceFor: (n) => `Price for ${n} night${n > 1 ? "s" : ""}`, perNight: "per night on average",
    breakfast: "Breakfast included",
    freeUntil: (d) => `Free cancellation until ${d}`,
    freeDays: (n) => `Free cancellation up to ${n} day${n > 1 ? "s" : ""} before arrival`,
    notFree: "Not free to cancel for these dates",
    onlyLeft: (n) => `Only ${n} left`, soldOut: "Sold out for these dates",
    closed: "Not available on these dates", howMany: "Number of tents",
    reserve: "Reserve", total: "Total", tents: (n) => `${n} tent${n > 1 ? "s" : ""}`,
    details: "See details", maxAdults: (n) => `${n} adult${n > 1 ? "s" : ""} max.`,
    maxChildren: (n) => `+ ${n} child${n > 1 ? "ren" : ""}`,
    needed: (n) => `For your group, plan on ${n} tents of this type`,
    notEnough: "The selection doesn't cover every guest: add a tent.",
    loading: "Working out prices…", error: "Couldn't load availability. Please try again.",
    fits: "Suits your group", photo: (i, n) => `Photo ${i} of ${n}`, none: "No tents to show.",
    selectTents: "Choose the number of tents",
  },
  es: {
    title: "Consulte disponibilidad y precios",
    subtitle: "Elija sus fechas: el precio de cada tienda se muestra para su estancia.",
    arrival: "Llegada", departure: "Salida", adults: "Adultos", children: "Niños",
    nights: (n) => `${n} noche${n > 1 ? "s" : ""}`,
    pickDates: "Elija sus fechas para ver el precio", pickDatesShort: "Precio según sus fechas",
    priceFor: (n) => `Precio por ${n} noche${n > 1 ? "s" : ""}`, perNight: "por noche de media",
    breakfast: "Desayuno incluido",
    freeUntil: (d) => `Cancelación gratuita hasta el ${d}`,
    freeDays: (n) => `Cancelación gratuita hasta ${n} día${n > 1 ? "s" : ""} antes de la llegada`,
    notFree: "Cancelación no gratuita para estas fechas",
    onlyLeft: (n) => `Solo quedan ${n}`, soldOut: "Completo en estas fechas",
    closed: "No disponible en estas fechas", howMany: "Número de tiendas",
    reserve: "Reservar", total: "Total", tents: (n) => `${n} tienda${n > 1 ? "s" : ""}`,
    details: "Ver detalles", maxAdults: (n) => `${n} adulto${n > 1 ? "s" : ""} máx.`,
    maxChildren: (n) => `+ ${n} niño${n > 1 ? "s" : ""}`,
    needed: (n) => `Para su grupo, cuente con ${n} tiendas de este tipo`,
    notEnough: "La selección no cubre a todos los viajeros: añada una tienda.",
    loading: "Calculando precios…", error: "No se pudo cargar la disponibilidad. Inténtelo de nuevo.",
    fits: "Adecuada para su grupo", photo: (i, n) => `Foto ${i} de ${n}`, none: "No hay tiendas que mostrar.",
    selectTents: "Elija el número de tiendas",
  },
  it: {
    title: "Verifica disponibilità e prezzi",
    subtitle: "Scegliete le date: il prezzo di ogni tenda viene mostrato per il vostro soggiorno.",
    arrival: "Arrivo", departure: "Partenza", adults: "Adulti", children: "Bambini",
    nights: (n) => `${n} nott${n > 1 ? "i" : "e"}`,
    pickDates: "Scegliete le date per vedere il prezzo", pickDatesShort: "Prezzo in base alle date",
    priceFor: (n) => `Prezzo per ${n} nott${n > 1 ? "i" : "e"}`, perNight: "a notte in media",
    breakfast: "Colazione inclusa",
    freeUntil: (d) => `Cancellazione gratuita fino al ${d}`,
    freeDays: (n) => `Cancellazione gratuita fino a ${n} giorn${n > 1 ? "i" : "o"} prima dell'arrivo`,
    notFree: "Cancellazione non gratuita per queste date",
    onlyLeft: (n) => `Ne ${n > 1 ? "restano" : "resta"} solo ${n}`, soldOut: "Completo in queste date",
    closed: "Non disponibile in queste date", howMany: "Numero di tende",
    reserve: "Prenota", total: "Totale", tents: (n) => `${n} tend${n > 1 ? "e" : "a"}`,
    details: "Vedi dettagli", maxAdults: (n) => `${n} adult${n > 1 ? "i" : "o"} max.`,
    maxChildren: (n) => `+ ${n} bambin${n > 1 ? "i" : "o"}`,
    needed: (n) => `Per il vostro gruppo servono ${n} tende di questo tipo`,
    notEnough: "La selezione non copre tutti i viaggiatori: aggiungete una tenda.",
    loading: "Calcolo dei prezzi…", error: "Impossibile caricare la disponibilità. Riprovate.",
    fits: "Adatta al vostro gruppo", photo: (i, n) => `Foto ${i} di ${n}`, none: "Nessuna tenda da mostrare.",
    selectTents: "Scegliete il numero di tende",
  },
};

function splitList(value: string | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

function Gallery({ images, alt, label }: { images: string[]; alt: string; label: (i: number, n: number) => string }) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  if (n === 0) return <div className="w-full h-full bg-muted" />;
  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);
  return (
    <div className="relative w-full h-full group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={`${alt} — ${label(index + 1, n)}`}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="‹"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center cursor-pointer hover:bg-black/65 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="›"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 text-white flex items-center justify-center cursor-pointer hover:bg-black/65 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/55 text-white text-[11px] mono-number">
            {index + 1}/{n}
          </span>
        </>
      )}
    </div>
  );
}

export function TentsBooking({ suites }: { suites: TentSuite[] }) {
  const { language } = useLanguage();
  const c = COPY[language];
  const locale = LOCALE[language];

  const today = todayISO();
  const [stay, setStay] = useState<StayDraft>({ checkIn: "", checkOut: "", adults: 2, children: 0 });
  const [qty, setQty] = useState<Record<string, number>>({});
  const [info, setInfo] = useState<Record<string, StayInfo>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  const nights = nightsBetweenISO(stay.checkIn, stay.checkOut);
  const hasDates = nights > 0;

  // A stay carried over from another page (or a shared link) fills the search.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setStay(readStayFromQuery(query));
    const picks = parseTentPicks(query.get("tents"));
    if (picks.length) {
      const bySlug = new Map(suites.map((s) => [s.slug, s.id]));
      const next: Record<string, number> = {};
      for (const p of picks) {
        const id = bySlug.get(p.slug);
        if (id) next[id] = p.qty;
      }
      setQty(next);
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the address shareable: dates and guests stay in the URL.
  useEffect(() => {
    if (!hydrated.current) return;
    const url = new URL(window.location.href);
    for (const key of ["checkin", "checkout", "adults", "children", "tents"]) url.searchParams.delete(key);
    if (stay.checkIn) url.searchParams.set("checkin", stay.checkIn);
    if (stay.checkOut) url.searchParams.set("checkout", stay.checkOut);
    if (stay.checkIn) {
      url.searchParams.set("adults", String(stay.adults));
      url.searchParams.set("children", String(stay.children));
    }
    window.history.replaceState(null, "", url.toString());
  }, [stay]);

  // Prices and tents left only exist once there is a stay.
  useEffect(() => {
    if (!hasDates) {
      setInfo({});
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    fetch(`/api/availability?checkIn=${stay.checkIn}&checkOut=${stay.checkOut}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("availability"))))
      .then((rows: StayInfo[]) => {
        setInfo(Object.fromEntries(rows.map((r) => [r.suiteId, r])));
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setFailed(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [hasDates, stay.checkIn, stay.checkOut]);

  // Never keep more tents selected than are left.
  useEffect(() => {
    setQty((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const [id, q] of Object.entries(prev)) {
        const left = info[id]?.left;
        if (q > 0 && left !== undefined && q > left) {
          next[id] = left;
          changed = true;
        }
        if (!hasDates && q > 0) {
          next[id] = 0;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [info, hasDates]);

  const setCheckIn = useCallback((value: string) => {
    setStay((s) => {
      const out = s.checkOut && nightsBetweenISO(value, s.checkOut) >= 1 ? s.checkOut : value ? addDaysISO(value, 1) : "";
      return { ...s, checkIn: value, checkOut: value ? out : "" };
    });
  }, []);

  const dateLabel = (iso: string) => {
    const d = parseISODay(iso);
    return d ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(d) : iso;
  };
  const money = (amount: number, currency: string) =>
    new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

  const picks = suites
    .map((s) => ({ suite: s, qty: qty[s.id] ?? 0 }))
    .filter((p) => p.qty > 0);
  const totalTents = picks.reduce((sum, p) => sum + p.qty, 0);
  const currency = picks[0]?.suite.currency ?? suites[0]?.currency ?? "EUR";
  const grandTotal = picks.reduce((sum, p) => sum + (info[p.suite.id]?.total ?? 0) * p.qty, 0);
  const capacityAdults = picks.reduce((sum, p) => sum + p.suite.maxGuests * p.qty, 0);
  const capacityChildren = picks.reduce((sum, p) => sum + p.suite.maxChildren * p.qty, 0);
  const coversGroup = capacityAdults >= stay.adults && capacityAdults + capacityChildren >= stay.adults + stay.children;

  const reserveHref = `${withLocale(language, "/reservez-votre-sejour")}?${bookingQuery(
    stay,
    picks.map((p) => ({ slug: p.suite.slug, qty: p.qty })),
  )}`;

  const field = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber/40";

  return (
    <section className="relative px-4 sm:px-6 md:px-10 pb-28 md:pb-20 pt-8 md:pt-12">
      <div className="max-w-6xl mx-auto">
        {/* ── Search ── */}
        <div ref={searchRef} className="glass-card card-warm p-5 md:p-6 mb-8 scroll-mt-28">
          <h2 className="heading-display text-2xl md:text-3xl mb-1">{c.title}</h2>
          <p className="text-sm text-muted-foreground mb-5">{c.subtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="block">
              <span className="luxury-label text-[11px] text-amber block mb-1.5">{c.arrival}</span>
              <input
                type="date"
                value={stay.checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className={field}
              />
            </label>
            <label className="block">
              <span className="luxury-label text-[11px] text-amber block mb-1.5">{c.departure}</span>
              <input
                type="date"
                value={stay.checkOut}
                min={stay.checkIn ? addDaysISO(stay.checkIn, 1) : today}
                onChange={(e) => setStay((s) => ({ ...s, checkOut: e.target.value }))}
                className={field}
              />
            </label>
            <label className="block">
              <span className="luxury-label text-[11px] text-amber block mb-1.5">{c.adults}</span>
              <select
                value={stay.adults}
                onChange={(e) => setStay((s) => ({ ...s, adults: Number(e.target.value) }))}
                className={field}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="luxury-label text-[11px] text-amber block mb-1.5">{c.children}</span>
              <select
                value={stay.children}
                onChange={(e) => setStay((s) => ({ ...s, children: Number(e.target.value) }))}
                className={field}
              >
                {Array.from({ length: 9 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          {hasDates && (
            <p className="mt-4 text-sm text-foreground/80 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber" />
              {dateLabel(stay.checkIn)} → {dateLabel(stay.checkOut)} · {c.nights(nights)}
            </p>
          )}
        </div>

        {failed && <p className="mb-6 text-sm text-red-600">{c.error}</p>}
        {suites.length === 0 && <p className="text-muted-foreground">{c.none}</p>}

        {/* ── Tents, one row each ── */}
        <div className="space-y-5">
          {suites.map((suite) => {
            const name = pickLocalized(language, suite.name, suite.nameEn, suite.nameEs, suite.nameIt);
            const tagline = pickLocalized(language, suite.tagline, suite.taglineEn, suite.taglineEs, suite.taglineIt);
            const features = splitList(pickLocalized(language, suite.features, suite.featuresEn, suite.featuresEs, suite.featuresIt));
            const amenities = splitList(pickLocalized(language, suite.amenities, suite.amenitiesEn, suite.amenitiesEs, suite.amenitiesIt));
            const gallery = [suite.image, ...splitList(suite.images)].filter(Boolean);
            const row = info[suite.id];
            const left = row?.left;
            const selected = qty[suite.id] ?? 0;
            const soldOut = hasDates && row !== undefined && row.left <= 0;
            const breakfast = features.some((f) => /petit|breakfast|desayuno|colazione/i.test(f));
            const needed = Math.ceil(stay.adults / Math.max(1, suite.maxGuests));
            const deadline = hasDates ? freeCancellationUntil(stay.checkIn, suite.freeCancellationDays) : "";
            const freeStillPossible = hasDates && deadline >= today;
            const maxPick = Math.min(left ?? suite.units, suite.units);

            return (
              <article key={suite.id} className="glass-card card-warm overflow-hidden grid md:grid-cols-[320px_1fr_300px] lg:grid-cols-[360px_1fr_320px]">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[260px] bg-muted">
                  <Gallery images={gallery} alt={name} label={c.photo} />
                </div>

                <div className="p-5 md:p-6 flex flex-col">
                  <h3 className="heading-editorial text-xl md:text-2xl text-amber mb-1">
                    <Link href={withLocale(language, `/les-tentes/${suite.slug}`)} className="hover:underline underline-offset-4">
                      {name}
                    </Link>
                  </h3>
                  {tagline && <p className="text-sm text-muted-foreground mb-3">{tagline}</p>}

                  <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground/80 mb-3">
                    {suite.size && (
                      <li className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-amber" />{suite.size}</li>
                    )}
                    {suite.bedType && (
                      <li className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-amber" />{suite.bedType}</li>
                    )}
                    <li className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber" />
                      {c.maxAdults(suite.maxGuests)}{suite.maxChildren > 0 ? ` ${c.maxChildren(suite.maxChildren)}` : ""}
                    </li>
                    {suite.hasAC && (
                      <li className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-amber" />A/C</li>
                    )}
                  </ul>

                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
                    {Array.from(new Map([...features, ...amenities].map((f) => [f.toLowerCase(), f])).values()).slice(0, 8).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-foreground/75">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                    {hasDates && needed > 1 && (
                      <span className="text-xs text-amber flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />{c.needed(needed)}
                      </span>
                    )}
                    <Link
                      href={withLocale(language, `/les-tentes/${suite.slug}`)}
                      className="text-sm text-amber underline underline-offset-4 hover:text-amber/80"
                    >
                      {c.details}
                    </Link>
                  </div>
                </div>

                {/* Price / choice column — price only once there is a stay */}
                <div className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-border bg-foreground/[0.02] flex flex-col gap-3">
                  {!hasDates ? (
                    <>
                      <p className="text-sm font-medium text-foreground">{c.pickDates}</p>
                      <button
                        type="button"
                        onClick={() => {
                          searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                          (searchRef.current?.querySelector("input[type=date]") as HTMLInputElement | null)?.focus();
                        }}
                        className="btn-outline w-full text-sm cursor-pointer"
                      >
                        <CalendarDays className="w-4 h-4 inline mr-2" />
                        {c.arrival}
                      </button>
                      {breakfast && (
                        <p className="text-xs text-green-700 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{c.breakfast}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{c.freeDays(suite.freeCancellationDays)}</p>
                    </>
                  ) : loading && !row ? (
                    <p className="text-sm text-muted-foreground">{c.loading}</p>
                  ) : soldOut || row?.closed ? (
                    <p className="text-sm font-medium text-red-600">{row?.closed ? c.closed : c.soldOut}</p>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground">{c.priceFor(nights)}</p>
                        <p className="mono-number text-2xl text-amber">
                          {row ? money(row.total, row.currency) : "—"}
                        </p>
                        {row && nights > 1 && (
                          <p className="text-xs text-muted-foreground">
                            ≈ {money(Math.round(row.total / nights), row.currency)} {c.perNight}
                          </p>
                        )}
                      </div>
                      {left !== undefined && left <= 1 && (
                        <p className="text-xs font-medium text-red-600">{c.onlyLeft(left)}</p>
                      )}
                      {breakfast && (
                        <p className="text-xs text-green-700 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{c.breakfast}</p>
                      )}
                      <p className={`text-xs flex items-start gap-1.5 ${freeStillPossible ? "text-green-700" : "text-muted-foreground"}`}>
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        {freeStillPossible ? c.freeUntil(dateLabel(deadline)) : c.notFree}
                      </p>
                      <label className="block mt-1">
                        <span className="luxury-label text-[11px] text-amber block mb-1.5">{c.howMany}</span>
                        <select
                          value={selected}
                          onChange={(e) => setQty((q) => ({ ...q, [suite.id]: Number(e.target.value) }))}
                          className={field}
                        >
                          {Array.from({ length: maxPick + 1 }, (_, n) => n).map((n) => (
                            <option key={n} value={n}>
                              {n === 0 ? "0" : `${n} · ${row ? money(row.total * n, row.currency) : ""}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Summary / reserve ── */}
      <div className={`${totalTents > 0 ? "fixed inset-x-0 bottom-0" : "hidden"} z-[50] md:static md:block md:mt-8`}>
        <div className="max-w-6xl mx-auto md:px-0">
          <div className="bg-background/95 backdrop-blur-md border-t md:border border-border md:rounded-2xl shadow-2xl md:shadow-none pl-4 pr-20 md:px-5 py-3 md:py-5 flex flex-wrap items-center justify-between gap-3">
            {totalTents > 0 ? (
              <>
                <div>
                  <p className="text-sm text-foreground/80">
                    {c.tents(totalTents)} · {c.nights(nights)}
                  </p>
                  <p className="mono-number text-xl text-amber">
                    {c.total} {money(grandTotal, currency)}
                  </p>
                  {!coversGroup && <p className="text-xs text-red-600 mt-0.5">{c.notEnough}</p>}
                </div>
                <Link href={reserveHref} className="btn-primary cursor-pointer">
                  {c.reserve}
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{hasDates ? c.selectTents : c.pickDates}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
