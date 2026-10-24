"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { pickLocalized, useLanguage } from "@/lib/i18n/context";
import { TentsBooking, type TentSuite } from "@/components/arabian/TentsBooking";
import { currentTentOffer, type TentOffer } from "@/lib/tent-offer";

type OfferSuite = TentSuite & { price: number; nameEn?: string; seasonalPrices?: { startDate: string; endDate: string; price: number }[] };

const WHATSAPP_NUMBER = "212667370206";
const LOCALE = { fr: "fr-FR", en: "en-GB", es: "es-ES", it: "it-IT" } as const;

const OFFER_COPY = {
  fr: {
    offer: (tent: string, price: string, until: string) => `Offre : ${tent} à ${price} la nuit jusqu'au ${until}, petit-déjeuner inclus`,
    whatsapp: "Une question ? Réponse rapide sur WhatsApp",
    message: "Bonjour, je souhaite réserver une tente chez Arabian Desert Home. Mes dates : ",
  },
  en: {
    offer: (tent: string, price: string, until: string) => `Offer: ${tent} at ${price} a night until ${until}, breakfast included`,
    whatsapp: "A question? Quick answer on WhatsApp",
    message: "Hello, I would like to book a tent at Arabian Desert Home. My dates: ",
  },
  es: {
    offer: (tent: string, price: string, until: string) => `Oferta: ${tent} a ${price} la noche hasta el ${until}, desayuno incluido`,
    whatsapp: "¿Una pregunta? Respuesta rápida por WhatsApp",
    message: "Hola, me gustaría reservar una tienda en Arabian Desert Home. Mis fechas: ",
  },
  it: {
    offer: (tent: string, price: string, until: string) => `Offerta: ${tent} a ${price} a notte fino al ${until}, colazione inclusa`,
    whatsapp: "Una domanda? Risposta rapida su WhatsApp",
    message: "Buongiorno, vorrei prenotare una tenda presso Arabian Desert Home. Le mie date: ",
  },
} as const;

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const HERO_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp";

const HERO_COPY = {
  fr: { label: "Hébergements", title: "Nos tentes", accent: "au cœur du désert", text: "Dormez sous une tente de luxe à Agafay. Choisissez vos dates : prix, disponibilités et conditions d'annulation s'affichent pour votre séjour." },
  en: { label: "Accommodation", title: "Our tents", accent: "in the heart of the desert", text: "Sleep in a luxury tent in Agafay. Pick your dates: prices, availability and cancellation terms are shown for your stay." },
  es: { label: "Alojamiento", title: "Nuestras tiendas", accent: "en el corazón del desierto", text: "Duerma en una tienda de lujo en Agafay. Elija sus fechas: precios, disponibilidad y condiciones de cancelación para su estancia." },
  it: { label: "Alloggi", title: "Le nostre tende", accent: "nel cuore del deserto", text: "Dormite in una tenda di lusso ad Agafay. Scegliete le date: prezzi, disponibilità e condizioni di cancellazione per il vostro soggiorno." },
} as const;

export function LesTentesContent({ suites }: { suites: TentSuite[] }) {
  const { language } = useLanguage();
  const hero = HERO_COPY[language];
  const o = OFFER_COPY[language];

  // The running promotion (e.g. the ad's "from 130 €") with its end date, read from the
  // seasonal rates at view time, so it changes or disappears with the period by itself.
  const [offer, setOffer] = useState<TentOffer<OfferSuite> | null>(null);
  useEffect(() => {
    fetch("/api/suites")
      .then((r) => (r.ok ? r.json() : []))
      .then((list: OfferSuite[]) => setOffer(currentTentOffer(list)))
      .catch(() => {});
  }, []);

  const offerText = offer && o.offer(
    pickLocalized(language, offer.suite.name, offer.suite.nameEn, offer.suite.nameEs, offer.suite.nameIt),
    new Intl.NumberFormat(LOCALE[language], { style: "currency", currency: offer.currency, maximumFractionDigits: 0 }).format(offer.price),
    new Date(`${offer.until}T00:00:00Z`).toLocaleDateString(LOCALE[language], { day: "numeric", month: "long", timeZone: "UTC" }),
  );

  return (
    <>
      {/* Compact hero: the search and the tents start right below, within the first screen on a phone. */}
      <section className="relative overflow-hidden bg-warm-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-black/40 via-warm-black/60 to-warm-black" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-6 md:pt-36 md:pb-12">
          <motion.span
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="luxury-label text-amber block mb-3"
          >
            {hero.label}
          </motion.span>
          <motion.h1
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: smoothEase }}
            className="heading-display text-3xl md:text-5xl text-white mb-3"
          >
            {hero.title} <span className="italic text-amber">{hero.accent}</span>
          </motion.h1>
          <motion.p
                        transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
            className="hidden sm:block body-editorial text-white/60 text-sm md:text-base max-w-2xl"
          >
            {hero.text}
          </motion.p>

          <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
            {offerText && (
              <p className="inline-flex items-start gap-2 rounded-2xl bg-amber/15 border border-amber/40 px-3.5 py-2 text-sm text-amber">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{offerText}</span>
              </p>
            )}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(o.message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {o.whatsapp}
            </a>
          </div>
        </div>
      </section>

      <TentsBooking suites={suites} />
    </>
  );
}
