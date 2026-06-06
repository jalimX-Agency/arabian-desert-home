"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { useLanguage } from "@/lib/i18n/context";
import { Users, ArrowRight, Sparkles, Music } from "lucide-react";

// ============================================
// Types
// ============================================
interface DiningVenue {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  capacity: string | null;
  order: number;
}

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
// Restaurant Page — Desert Aurora Design
// ============================================
export default function RestaurantPage() {
  const { t } = useLanguage();
  const [venues, setVenues] = useState<DiningVenue[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });

  const venuesRef = useRef(null);
  const venuesInView = useInView(venuesRef, { once: true, margin: "-80px" });

  const entertainmentRef = useRef(null);
  const entertainmentInView = useInView(entertainmentRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  useEffect(() => {
    fetch("/api/dining")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* ── Hero Section ── */}
        <section
          ref={heroRef}
          className="relative h-[60vh] md:h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/images/dining.png"
              alt="Restaurant en plein air au désert d'Agafay"
              className="w-full h-full object-cover"
            />
            {/* Warm Gradient Overlays */}
            <div className="absolute inset-0 gradient-warm" />
            <div className="absolute inset-0 gradient-amber" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Decorative Blob */}
          <div className="absolute top-20 right-10 w-80 h-80 bg-amber/[0.04] blob-1 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-amber/[0.03] blob-2 blur-3xl" />

          {/* Grain Texture */}
          <div className="absolute inset-0 grain-overlay pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="luxury-label text-amber block mb-4"
            >
              {t("restaurant.heroLabel")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="heading-display text-4xl md:text-6xl lg:text-8xl text-white mb-6"
            >
              {t("restaurant.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              {t("restaurant.heroSubtitle")}
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-12 flex justify-center"
            >
              <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-amber"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Intro Section ── */}
        <section ref={introRef} className="py-20 md:py-28 px-6 md:px-10 relative">
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
              {t("restaurant.introText")}
            </motion.p>
          </div>
        </section>

        {/* ── Venues Section ── */}
        <section
          ref={venuesRef}
          className="py-16 md:py-24 px-6 md:px-10 relative"
        >
          {/* Pattern Background */}
          <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={venuesInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("restaurant.venuesSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={venuesInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("restaurant.venuesLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={venuesInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("restaurant.venuesTitle1")}
              <br />
              <span className="italic text-amber">{t("restaurant.venuesTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={venuesInView ? "visible" : "hidden"}
              custom={0.3}
              className="divider-accent max-w-xs mb-16"
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse aspect-[4/3] bg-muted rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {venues.map((venue, i) => (
                  <motion.div
                    key={venue.id}
                    variants={revealScale}
                    initial="hidden"
                    animate={venuesInView ? "visible" : "hidden"}
                    custom={0.4 + i * 0.15}
                    className="group glass-card card-warm overflow-hidden"
                  >
                    {/* Image — Rounded top */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      {/* Warm hover overlay */}
                      <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                      {/* Amber subtle glow at top-right */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="heading-editorial text-xl md:text-2xl group-hover:text-amber transition-colors duration-400">
                          {venue.name}
                        </h3>
                        {venue.capacity && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                              <Users className="w-3 h-3 text-amber" />
                            </div>
                            <span className="text-xs">{venue.capacity}</span>
                          </div>
                        )}
                      </div>

                      {/* Amber Divider */}
                      <div className="divider-accent max-w-[60px] mb-4" />

                      <p className="text-sm text-muted-foreground mb-3 body-editorial">
                        {venue.description}
                      </p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed body-editorial">
                        {venue.longDescription}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Evening Entertainment Section ── */}
        <section
          ref={entertainmentRef}
          className="py-20 md:py-28 px-6 md:px-10 relative"
        >
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                variants={revealUp}
                initial="hidden"
                animate={entertainmentInView ? "visible" : "hidden"}
                custom={0}
              >
                <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-3">
                  {t("restaurant.entertainmentSectionNumber")}
                </span>
                <span className="luxury-label text-amber block mb-4">
                  {t("restaurant.entertainmentLabel")}
                </span>
                <h2 className="heading-display text-3xl md:text-4xl mb-6">
                  {t("restaurant.entertainmentTitle1")}
                  <br />
                  <span className="italic text-amber">{t("restaurant.entertainmentTitle2")}</span>
                </h2>
                <div className="divider-accent max-w-[120px] mb-8" />
                <p className="body-editorial text-muted-foreground mb-8">
                  {t("restaurant.entertainmentText")}
                </p>

                {/* Entertainment Items */}
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 rounded-2xl glass-card card-warm cursor-pointer group/item">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0 group-hover/item:bg-amber/20 group-hover/item:border-amber/30 transition-all duration-400">
                      <Sparkles className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <span className="heading-editorial text-base">
                        {t("restaurant.entertainmentDance")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5 body-editorial">
                        {t("restaurant.entertainmentDanceDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl glass-card card-warm cursor-pointer group/item">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0 group-hover/item:bg-amber/20 group-hover/item:border-amber/30 transition-all duration-400">
                      <Music className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <span className="heading-editorial text-base">
                        {t("restaurant.entertainmentMusic")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5 body-editorial">
                        {t("restaurant.entertainmentMusicDesc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl glass-card card-warm cursor-pointer group/item">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0 group-hover/item:bg-amber/20 group-hover/item:border-amber/30 transition-all duration-400">
                      <Sparkles className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <span className="heading-editorial text-base">
                        {t("restaurant.entertainmentLights")}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5 body-editorial">
                        {t("restaurant.entertainmentLightsDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={revealScale}
                initial="hidden"
                animate={entertainmentInView ? "visible" : "hidden"}
                custom={0.3}
                className="relative"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                  <img
                    src="/images/night.png"
                    alt="Soirée d'animation au désert"
                    className="w-full h-full object-cover img-luxury"
                  />
                  {/* Warm hover overlay */}
                  <div className="absolute inset-0 bg-amber/0 hover:bg-amber/10 transition-all duration-500 rounded-2xl" />
                </div>

                {/* Pricing Note — Glass Card */}
                <div className="absolute -bottom-6 -left-4 md:-left-8 glass-card p-6 max-w-sm">
                  <p className="text-sm text-muted-foreground leading-relaxed body-editorial">
                    {t("restaurant.pricingNote")}{" "}
                    <span className="text-amber mono-number">200</span>{" "}
                    {t("restaurant.pricingNoteAnd")}{" "}
                    <span className="text-amber mono-number">250 DH</span>
                    {", "}
                    {t("restaurant.pricingNoteCurrency")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section
          ref={ctaRef}
          className="relative py-20 md:py-28 px-6 md:px-10 bg-warm-black text-center overflow-hidden"
        >
          {/* Decorative Blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/[0.03] blob-1 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber/[0.04] blob-3 blur-3xl" />

          {/* Grain Texture */}
          <div className="absolute inset-0 grain-overlay pointer-events-none" />

          {/* Divider Top */}
          <div className="absolute top-0 left-0 right-0 divider-accent-wide" />

          <motion.span
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0}
            className="luxury-label text-amber block mb-4"
          >
            {t("restaurant.ctaLabel")}
          </motion.span>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-3xl md:text-5xl text-foreground mb-6"
          >
            {t("restaurant.ctaTitle")}
          </motion.h2>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.4}
            className="divider-accent-wide max-w-[120px] mx-auto mb-8"
          />
          <motion.div
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.5}
          >
            <Link
              href="/reservez-votre-sejour"
              className="btn-primary inline-flex items-center gap-3 cursor-pointer"
            >
              {t("restaurant.ctaButton")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Divider Bottom */}
          <div className="absolute bottom-0 left-0 right-0 divider-accent-wide" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
