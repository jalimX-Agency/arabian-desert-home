"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Sparkles, Gem, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage } from "@/lib/i18n/context";

// ============================================
// Animation Constants — Desert Aurora
// ============================================
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

// ============================================
// Events Page — Desert Aurora Design
// ============================================
export default function EvenementsPage() {
  const { t } = useLanguage();

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });

  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });

  const quoteRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, margin: "-80px" });

  const galleryRef = useRef(null);
  const galleryInView = useInView(galleryRef, { once: true, margin: "-80px" });

  const eventTypes = [
    {
      icon: Heart,
      titleKey: "evenements.weddingTitle",
      descKey: "evenements.weddingDesc",
    },
    {
      icon: Sparkles,
      titleKey: "evenements.galaTitle",
      descKey: "evenements.galaDesc",
    },
    {
      icon: Gem,
      titleKey: "evenements.retreatTitle",
      descKey: "evenements.retreatDesc",
    },
  ];

  const [galleryImages, setGalleryImages] = useState<{ src: string; alt: string }[]>([]);

  useEffect(() => {
    fetch("/api/gallery?category=evenements")
      .then((r) => r.json())
      .then((data: { url: string; alt: string }[]) => {
        if (Array.isArray(data)) {
          setGalleryImages(data.map((img) => ({ src: img.url, alt: img.alt || "" })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* ── Hero Section — Cinematic Seamless Transition ── */}
        <section
          ref={heroRef}
          className="relative h-[45vh] md:h-[55vh] flex items-end overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/events/events-gala.png"
              alt="Événements de luxe au désert d'Agafay — Mariages & Galas"
              className="w-full h-full object-cover"
            />
            {/* Seamless Gradient — dark top fades to background color at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
          </div>

          {/* Hero Content — left-aligned at bottom */}
          <div className="relative z-10 w-full px-6 md:px-10 pb-12 md:pb-16">
            <div className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="luxury-label text-amber block mb-4"
              >
                {t("evenements.heroLabel")}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
                className="heading-display text-3xl md:text-5xl lg:text-7xl text-white mb-4"
              >
                {t("evenements.heroTitle")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                className="heading-editorial italic text-lg md:text-xl text-white/60 mb-6"
              >
                {t("evenements.heroSubtitle")}
              </motion.p>
              {/* Thin amber horizontal line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={heroInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.7, ease: smoothEase }}
                className="h-px w-24 md:w-32 bg-amber origin-left"
              />
            </div>
          </div>
        </section>

        {/* ── Intro Section ── */}
        <section ref={introRef} className="pt-8 md:pt-12 pb-20 md:pb-28 px-6 md:px-10 relative">
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={introInView ? "visible" : "hidden"}
              custom={0}
              className="divider-accent max-w-[120px] mx-auto mb-10"
            />
            <motion.p
              variants={revealUp}
              initial="hidden"
              animate={introInView ? "visible" : "hidden"}
              custom={0.3}
              className="body-editorial text-lg md:text-xl text-muted-foreground"
            >
              {t("evenements.introText")}
            </motion.p>
          </div>
        </section>

        {/* ── Event Types Cards ── */}
        <section
          ref={cardsRef}
          className="py-16 md:py-24 px-6 md:px-10 relative"
        >
          <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("evenements.eventTypesSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("evenements.eventTypesLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("evenements.eventTypesTitle1")}
              <br />
              <span className="italic text-amber">{t("evenements.eventTypesTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={cardsInView ? "visible" : "hidden"}
              custom={0.3}
              className="divider-accent max-w-xs mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {eventTypes.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.titleKey}
                    variants={revealScale}
                    initial="hidden"
                    animate={cardsInView ? "visible" : "hidden"}
                    custom={0.4 + index * 0.15}
                    className="group glass-card card-warm p-8 md:p-10"
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-6 group-hover:bg-amber/20 group-hover:border-amber/30 transition-all duration-400">
                      <Icon className="w-6 h-6 text-amber" />
                    </div>

                    {/* Title */}
                    <h3 className="heading-editorial text-2xl mb-4 group-hover:text-amber transition-colors duration-400">
                      {t(event.titleKey)}
                    </h3>

                    {/* Amber Divider */}
                    <div className="divider-accent max-w-[60px] mb-6 group-hover:max-w-[100px] transition-all duration-500" />

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed body-editorial">
                      {t(event.descKey)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Quote Section ── */}
        <section ref={quoteRef} className="py-20 md:py-32 px-6 md:px-10 relative">
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={quoteInView ? "visible" : "hidden"}
              custom={0}
              className="divider-accent max-w-[120px] mx-auto mb-12"
            />
            <motion.blockquote
              variants={revealUp}
              initial="hidden"
              animate={quoteInView ? "visible" : "hidden"}
              custom={0.3}
              className="heading-display text-2xl md:text-3xl lg:text-4xl italic leading-snug"
            >
              &ldquo;{t("evenements.quoteText")}&rdquo;
            </motion.blockquote>
          </div>
        </section>

        {/* ── Image Gallery ── */}
        {galleryImages.length > 0 && (
          <section className="py-16 md:py-24 px-6 md:px-10 relative">
            <div className="max-w-7xl mx-auto relative z-10">
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4">
                {t("evenements.gallerySectionNumber")}
              </span>
              <span className="luxury-label text-amber block mb-4">
                {t("evenements.galleryLabel")}
              </span>
              <h2 className="heading-display text-3xl md:text-5xl mb-16">
                {t("evenements.galleryTitle1")}
                <br />
                <span className="italic text-amber">{t("evenements.galleryTitle2")}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {galleryImages.map((img) => (
                  <div
                    key={img.src}
                    className="aspect-[4/3] overflow-hidden rounded-2xl relative group cursor-pointer"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover img-luxury"
                    />
                    <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                    <div className="absolute inset-3 rounded-xl border border-amber/0 group-hover:border-amber/20 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Section ── */}
        <CTASection
          label={t("evenements.ctaLabel")}
          title={t("evenements.ctaTitle")}
          buttonText={t("evenements.ctaButton")}
          buttonHref="/contact"
        />
      </main>

      <Footer />
    </div>
  );
}
