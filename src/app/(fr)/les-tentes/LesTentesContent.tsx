"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { TentsBooking, type TentSuite } from "@/components/arabian/TentsBooking";

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

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-8 md:pt-36 md:pb-12">
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
            className="body-editorial text-white/60 text-sm md:text-base max-w-2xl"
          >
            {hero.text}
          </motion.p>
        </div>
      </section>

      <TentsBooking suites={suites} />
    </>
  );
}
