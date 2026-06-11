"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage } from "@/lib/i18n/context";
import { Check, Clock, Baby, AlertCircle, Sun, Utensils, Music, ArrowRight } from "lucide-react";

interface DayPass {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  price: number;
  currency: string;
  includes: string;
  includesEn: string;
  order: number;
  image: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const revealUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: smoothEase },
  }),
};

const revealScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay, ease: smoothEase },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay },
  }),
};

const FALLBACK_PASSES: DayPass[] = [
  {
    id: "daypass-piscine-dejeuner",
    name: "Day Pass Piscine & Déjeuner",
    nameEn: "",
    slug: "daypass-piscine-dejeuner",
    description: "Profitez d'une journée ensoleillée au bord de la piscine avec un déjeuner gastronomique marocain inclus.",
    descriptionEn: "",
    price: 350,
    currency: "MAD",
    includes: "Accès piscine toute la journée, Serviettes de piscine, Déjeuner gastronomique, Thé à la menthe d'accueil",
    includesEn: "",
    order: 1,
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/daypass-pool.png",
  },
  {
    id: "daypass-diner-animation",
    name: "Piscine & Dîner avec Animation",
    nameEn: "",
    slug: "daypass-diner-animation",
    description: "Une soirée inoubliable avec accès piscine, dîner sous les étoiles et animation musicale gnawa.",
    descriptionEn: "",
    price: 500,
    currency: "MAD",
    includes: "Accès piscine, Dîner sous les étoiles, Animation musicale gnawa, Feu de camp, Thé à la menthe",
    includesEn: "",
    order: 2,
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/daypass-pool.png",
  },
  {
    id: "daypass-journee-complete",
    name: "Pass Journée Complète",
    nameEn: "",
    slug: "daypass-journee-complete",
    description: "L'expérience day pass ultime : piscine, déjeuner, activité au choix et dîner avec animation.",
    descriptionEn: "",
    price: 750,
    currency: "MAD",
    includes: "Accès piscine, Déjeuner gastronomique, 1 activité au choix, Dîner sous les étoiles, Animation musicale",
    includesEn: "",
    order: 3,
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/daypass-pool.png",
  },
];

const passIcons = [Sun, Utensils, Music];

export function DayPassContent({ passes }: { passes: DayPass[] }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const loc = (fr: string, en: string) => (isEn && en) ? en : fr;
  const data = passes.length > 0 ? passes : FALLBACK_PASSES;

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const passesRef = useRef(null);
  const passesInView = useInView(passesRef, { once: true, margin: "-80px" });
  const infoRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden bg-gradient-to-br from-warm-black via-background to-amber/[0.03]"
      >
        <div className="absolute inset-0 pattern-dots pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber/[0.04] blob-1 blur-3xl" />
        <div className="absolute bottom-5 left-10 w-56 h-56 bg-amber/[0.03] blob-2 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block mb-4"
          >
            {t("dayPass.heroLabel")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            className="heading-display text-4xl md:text-6xl lg:text-8xl text-foreground mb-6"
          >
            {t("dayPass.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
            className="heading-editorial italic text-xl md:text-2xl text-muted-foreground mb-8"
          >
            {t("dayPass.heroSubtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={heroInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.55, ease: smoothEase }}
            className="divider-accent max-w-[120px] mx-auto mb-10"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.map((pass, i) => {
              const Icon = passIcons[i] || Sun;
              return (
                <motion.div
                  key={pass.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: smoothEase }}
                  className="glass-card p-4 text-center group hover:bg-amber/[0.04] transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-amber" />
                  </div>
                  <h3 className="heading-editorial text-lg mb-1">{loc(pass.name, pass.nameEn)}</h3>
                  <span className="mono-number text-xl text-amber">{pass.price}</span>
                  <span className="text-xs text-muted-foreground ml-1 body-editorial">{pass.currency}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Passes Cards ── */}
      <section ref={passesRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div variants={fadeIn} initial="hidden" animate={passesInView ? "visible" : "hidden"} custom={0} className="divider-accent max-w-[120px] mx-auto mb-10" />
            <motion.h2 variants={revealUp} initial="hidden" animate={passesInView ? "visible" : "hidden"} custom={0.2} className="heading-display text-3xl md:text-5xl mb-4">
              {t("dayPass.introTitle1")}
              <br />
              <span className="italic text-amber">{t("dayPass.introTitle2")}</span>
            </motion.h2>
            <motion.p variants={revealUp} initial="hidden" animate={passesInView ? "visible" : "hidden"} custom={0.3} className="body-editorial text-muted-foreground max-w-2xl mx-auto">
              {t("dayPass.introText")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.map((pass, i) => {
              const Icon = passIcons[i] || Sun;
              return (
                <motion.div
                  key={pass.id}
                  variants={revealScale}
                  initial="hidden"
                  animate={passesInView ? "visible" : "hidden"}
                  custom={0.5 + i * 0.15}
                  className="group glass-card card-warm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={pass.image} alt={pass.name} className="w-full h-full object-cover img-luxury" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-amber" />
                        </div>
                        <span className="luxury-label text-white/80">Day Pass</span>
                      </div>
                      <h3 className="heading-editorial text-2xl text-white group-hover:text-amber transition-colors duration-400">
                        {loc(pass.name, pass.nameEn)}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-6 body-editorial">{loc(pass.description, pass.descriptionEn)}</p>

                    <div className="mb-6 flex-1">
                      <span className="luxury-label text-amber block mb-3">{t("dayPass.includes")}</span>
                      <div className="space-y-2.5">
                        {loc(pass.includes, pass.includesEn).split(",").map((item, j) => (
                          <div key={j} className="flex items-center gap-2.5 text-sm text-muted-foreground/70">
                            <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-amber" />
                            </div>
                            <span className="body-editorial">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-amber/10 space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="mono-number text-4xl text-amber">{pass.price}</span>
                        <span className="text-sm text-muted-foreground body-editorial">
                          {pass.currency} {t("dayPass.perPerson")}
                        </span>
                      </div>
                      <Link
                        href={`/day-pass/${pass.slug}`}
                        className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
                      >
                        Voir les détails
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Practical Info ── */}
      <section ref={infoRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={fadeIn} initial="hidden" animate={infoInView ? "visible" : "hidden"} custom={0} className="mb-4">
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
              {t("dayPass.infoSectionNumber")}
            </span>
          </motion.div>
          <motion.span variants={revealUp} initial="hidden" animate={infoInView ? "visible" : "hidden"} custom={0.1} className="luxury-label text-amber block mb-4">
            {t("dayPass.infoLabel")}
          </motion.span>
          <motion.h2 variants={revealUp} initial="hidden" animate={infoInView ? "visible" : "hidden"} custom={0.2} className="heading-display text-3xl md:text-5xl mb-4">
            {t("dayPass.infoTitle1")}
            <br />
            <span className="italic text-amber">{t("dayPass.infoTitle2")}</span>
          </motion.h2>
          <motion.div variants={fadeIn} initial="hidden" animate={infoInView ? "visible" : "hidden"} custom={0.3} className="divider-accent max-w-xs mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: t("dayPass.hoursTitle"), text: t("dayPass.hoursText"), delay: 0.4 },
              { icon: Baby, title: t("dayPass.childrenTitle"), text: t("dayPass.childrenText"), delay: 0.5 },
              { icon: AlertCircle, title: t("dayPass.bookingTitle"), text: t("dayPass.bookingText"), delay: 0.6 },
            ].map(({ icon: Icon, title, text, delay }) => (
              <motion.div
                key={title}
                variants={revealScale}
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                custom={delay}
                className="glass-card card-warm p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground body-editorial">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label={t("dayPass.ctaLabel")}
        title={t("dayPass.ctaTitle")}
        buttonText={t("dayPass.ctaButton")}
        buttonHref="/contact"
      />
    </>
  );
}
