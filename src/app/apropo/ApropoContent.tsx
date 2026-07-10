"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Heart, Shield, Wind } from "lucide-react";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage, withLocale } from "@/lib/i18n/context";

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const values = [
  {
    icon: Heart,
    titleKey: "about.value1Title",
    descKey: "about.value1Desc",
  },
  {
    icon: Shield,
    titleKey: "about.value2Title",
    descKey: "about.value2Desc",
  },
  {
    icon: Wind,
    titleKey: "about.value3Title",
    descKey: "about.value3Desc",
  },
];

const stats = [
  { valueKey: "about.stat1Value", labelKey: "about.stat1Label" },
  { valueKey: "about.stat2Value", labelKey: "about.stat2Label" },
  { valueKey: "about.stat3Value", labelKey: "about.stat3Label" },
];

const galleryImages = [
  {
    src: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/1781221046155-224xz6q78g2.webp",
    altKey: "about.galleryImage1Alt",
    captionKey: "about.galleryImage1Caption",
  },
  {
    src: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/1781221055275-i4u2kxhorth.webp",
    altKey: "about.galleryImage2Alt",
    captionKey: "about.galleryImage2Caption",
  },
  {
    src: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/1781221037505-4f2p7nqju31.webp",
    altKey: "about.galleryImage3Alt",
    captionKey: "about.galleryImage3Caption",
  },
  {
    src: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/1781200907578-eqj4rm32aai.webp",
    altKey: "about.galleryImage4Alt",
    captionKey: "about.galleryImage4Caption",
  },
];

export function ApropoContent() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const galleryRef = useRef(null);
  const valuesRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-80px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  const { t, language } = useLanguage();

  return (
    <>
      {/* Hero Section — Storytelling Split */}
      <section ref={heroRef} className="relative w-full min-h-[50vh] md:min-h-[70vh] flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SIDE — Dark background with text */}
        <div className="order-2 md:order-1 w-full md:w-1/2 bg-warm-black flex flex-col justify-end p-10 md:p-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber mb-4"
          >
            {t("about.heroLabel")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
            className="heading-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("about.heroTitle1")}
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="divider-accent mt-8 max-w-[120px] origin-left"
          />
        </div>

        {/* RIGHT SIDE — Image composition */}
        <div className="order-1 md:order-2 w-full md:w-1/2 relative min-h-[35vh] md:min-h-0">
          {/* Main image fills the entire right side */}
          <img
            src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/1781200882874-jrl20iist7.webp"
            alt="Arabian Desert Home — Tentes de luxe Agafay"
            className="w-full h-full object-cover"
          />

          {/* Minimal overlay — no heavy gradients */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Smaller overlapping image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8, ease: smoothEase }}
            className="absolute bottom-6 -left-12 md:-left-20"
          >
            <img
              src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/1781272815539-j9ai7jss03b.webp"
              alt="Vue aérienne Arabian Desert Home — Désert Agafay"
              className="w-40 h-40 md:w-56 md:h-56 rounded-2xl border-2 border-amber/20 shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-20 md:py-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-4"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-7xl leading-none">
              {t("about.storySectionNumber")}
            </span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block mb-4"
          >
            {t("about.storyLabel")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-8"
          >
            {t("about.storyTitle1")}{" "}
            <span className="italic text-amber">{t("about.storyTitle2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
            className="body-editorial text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
          >
            {t("about.storyParagraph1")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: smoothEase }}
            className="body-editorial text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            {t("about.storyParagraph2")}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={storyInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="divider-accent mt-12 max-w-[120px] origin-left"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 md:py-28 px-6 md:px-10 pattern-dots">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-center mb-4"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-7xl leading-none">
              {t("about.statsSectionNumber")}
            </span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block text-center mb-4"
          >
            {t("about.statsLabel")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            className="heading-editorial text-3xl md:text-4xl text-center mb-16"
          >
            {t("about.statsTitle1")}{" "}
            <span className="italic text-amber">{t("about.statsTitle2")}</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.valueKey}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: smoothEase }}
                className="glass-card card-warm p-8 text-center"
              >
                <div className="divider-accent max-w-[60px] mx-auto mb-6" />
                <p className="mono-number text-5xl md:text-6xl text-amber mb-3">
                  {t(stat.valueKey)}
                </p>
                <p className="luxury-label text-muted-foreground">
                  {t(stat.labelKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section ref={galleryRef} className="py-20 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-4 text-center"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-7xl leading-none block">
              {t("about.gallerySectionNumber")}
            </span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block text-center mb-4"
          >
            {t("about.galleryLabel")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={galleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            className="heading-editorial text-3xl md:text-4xl lg:text-5xl text-center mb-16"
          >
            {t("about.galleryTitle1")}{" "}
            <span className="italic text-amber">{t("about.galleryTitle2")}</span>
          </motion.h2>

          {/* Bento-style grid: 2 large + 2 small */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First image — large */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={galleryInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
              className="relative h-80 md:h-[450px] overflow-hidden group rounded-2xl"
            >
              <img
                src={galleryImages[0].src}
                alt={t(galleryImages[0].altKey)}
                className="w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-amber/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-colors duration-400 rounded-2xl" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p className="luxury-label text-white/90">{t(galleryImages[0].captionKey)}</p>
              </div>
            </motion.div>

            {/* Second image — large */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={galleryInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: smoothEase }}
              className="relative h-80 md:h-[450px] overflow-hidden group rounded-2xl"
            >
              <img
                src={galleryImages[1].src}
                alt={t(galleryImages[1].altKey)}
                className="w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-amber/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-colors duration-400 rounded-2xl" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p className="luxury-label text-white/90">{t(galleryImages[1].captionKey)}</p>
              </div>
            </motion.div>

            {/* Third image — smaller */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={galleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: smoothEase }}
              className="relative h-72 md:h-[350px] overflow-hidden group rounded-2xl"
            >
              <img
                src={galleryImages[2].src}
                alt={t(galleryImages[2].altKey)}
                className="w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-amber/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-colors duration-400 rounded-2xl" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p className="luxury-label text-white/90">{t(galleryImages[2].captionKey)}</p>
              </div>
            </motion.div>

            {/* Fourth image — smaller */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={galleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8, ease: smoothEase }}
              className="relative h-72 md:h-[350px] overflow-hidden group rounded-2xl"
            >
              <img
                src={galleryImages[3].src}
                alt={t(galleryImages[3].altKey)}
                className="w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-amber/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-colors duration-400 rounded-2xl" />
              <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <p className="luxury-label text-white/90">{t(galleryImages[3].captionKey)}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 md:py-28 px-6 md:px-10 pattern-organic opacity-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-4 text-center"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-7xl leading-none block">
              {t("about.valuesSectionNumber")}
            </span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block text-center mb-4"
          >
            {t("about.valuesLabel")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            className="heading-editorial text-3xl md:text-4xl text-center mb-16"
          >
            {t("about.valuesTitle1")}{" "}
            <span className="italic text-amber">{t("about.valuesTitle2")}</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: smoothEase }}
                className="glass-card card-warm p-8 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg mb-3">
                  {t(value.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground body-editorial">
                  {t(value.descKey)}
                </p>
                <div className="divider-accent max-w-[60px] mx-auto mt-5" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        label={t("about.ctaLabel")}
        title={
          <>
            {t("about.ctaTitle1")}{" "}
            <span className="italic text-amber">{t("about.ctaTitle2")}</span>
          </>
        }
        buttonText={t("about.ctaButton")}
        buttonHref={withLocale(language, "/les-tentes")}
        buttonIcon={<Sparkles className="w-4 h-4" />}
      />
    </>
  );
}
