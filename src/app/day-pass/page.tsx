"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { useLanguage } from "@/lib/i18n/context";
import {
  ArrowRight,
  Check,
  Clock,
  Baby,
  AlertCircle,
  Sun,
  Utensils,
  Music,
} from "lucide-react";

// ============================================
// Types
// ============================================
interface DayPass {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  includes: string;
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
// Day Pass Page — Desert Aurora Design
// ============================================
export default function DayPassPage() {
  const { t } = useLanguage();
  const [passes, setPasses] = useState<DayPass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/day-passes")
      .then((res) => res.json())
      .then((data) => {
        setPasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const passesRef = useRef(null);
  const passesInView = useInView(passesRef, { once: true, margin: "-80px" });

  const infoRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const passIcons = [Sun, Utensils, Music];

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
              src="/images/daypass-pool.png"
              alt="Piscine avec vue sur le désert"
              className="w-full h-full object-cover"
            />
            {/* Warm Gradient Overlays */}
            <div className="absolute inset-0 gradient-warm" />
            <div className="absolute inset-0 gradient-amber" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Decorative Blobs */}
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
              {t("dayPass.heroLabel")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="heading-display text-4xl md:text-6xl lg:text-8xl text-white mb-6"
            >
              {t("dayPass.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              {t("dayPass.heroSubtitle")}
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

        {/* ── Intro + Passes Section ── */}
        <section
          ref={passesRef}
          className="py-20 md:py-28 px-6 md:px-10 relative"
        >
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={passesInView ? "visible" : "hidden"}
                custom={0}
                className="divider-accent max-w-[120px] mx-auto mb-10"
              />
              <motion.h2
                variants={revealUp}
                initial="hidden"
                animate={passesInView ? "visible" : "hidden"}
                custom={0.2}
                className="heading-display text-3xl md:text-5xl mb-4"
              >
                {t("dayPass.introTitle1")}
                <br />
                <span className="italic text-amber">{t("dayPass.introTitle2")}</span>
              </motion.h2>
              <motion.p
                variants={revealUp}
                initial="hidden"
                animate={passesInView ? "visible" : "hidden"}
                custom={0.3}
                className="body-editorial text-muted-foreground max-w-2xl mx-auto"
              >
                {t("dayPass.introText")}
              </motion.p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-96 bg-muted rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {passes.map((pass, i) => {
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
                      {/* Header with image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src="/images/daypass-pool.png"
                          alt={pass.name}
                          className="w-full h-full object-cover img-luxury"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Warm hover overlay */}
                        <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                        {/* Amber subtle glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                        <div className="absolute bottom-4 left-6 right-6">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-amber" />
                            </div>
                            <span className="luxury-label text-white/80">
                              Day Pass
                            </span>
                          </div>
                          <h3 className="heading-editorial text-2xl text-white group-hover:text-amber transition-colors duration-400">
                            {pass.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-6 body-editorial">
                          {pass.description}
                        </p>

                        {/* Includes */}
                        <div className="mb-6 flex-1">
                          <span className="luxury-label text-amber block mb-3">
                            {t("dayPass.includes")}
                          </span>
                          <div className="space-y-2.5">
                            {pass.includes.split(",").map((item, j) => (
                              <div
                                key={j}
                                className="flex items-center gap-2.5 text-sm text-muted-foreground/70"
                              >
                                <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-amber" />
                                </div>
                                <span className="body-editorial">{item.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="pt-4 border-t border-amber/10">
                          <div className="flex items-baseline gap-2">
                            <span className="mono-number text-4xl text-amber">
                              {pass.price}
                            </span>
                            <span className="text-sm text-muted-foreground body-editorial">
                              {pass.currency} {t("dayPass.perPerson")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Practical Information Section ── */}
        <section
          ref={infoRef}
          className="py-20 md:py-28 px-6 md:px-10 relative"
        >
          <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("dayPass.infoSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("dayPass.infoLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("dayPass.infoTitle1")}
              <br />
              <span className="italic text-amber">{t("dayPass.infoTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={infoInView ? "visible" : "hidden"}
              custom={0.3}
              className="divider-accent max-w-xs mb-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hours */}
              <motion.div
                variants={revealScale}
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                custom={0.4}
                className="glass-card card-warm p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg mb-2">{t("dayPass.hoursTitle")}</h3>
                <p className="text-sm text-muted-foreground body-editorial">
                  {t("dayPass.hoursText")}
                </p>
              </motion.div>

              {/* Children */}
              <motion.div
                variants={revealScale}
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                custom={0.5}
                className="glass-card card-warm p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                  <Baby className="w-5 h-5 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg mb-2">{t("dayPass.childrenTitle")}</h3>
                <p className="text-sm text-muted-foreground body-editorial">
                  {t("dayPass.childrenText")}
                </p>
              </motion.div>

              {/* Reservation */}
              <motion.div
                variants={revealScale}
                initial="hidden"
                animate={infoInView ? "visible" : "hidden"}
                custom={0.6}
                className="glass-card card-warm p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                  <AlertCircle className="w-5 h-5 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg mb-2">{t("dayPass.bookingTitle")}</h3>
                <p className="text-sm text-muted-foreground body-editorial">
                  {t("dayPass.bookingText")}
                </p>
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/[0.03] blob-2 blur-3xl" />
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
            {t("dayPass.ctaLabel")}
          </motion.span>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-3xl md:text-5xl text-foreground mb-6"
          >
            {t("dayPass.ctaTitle")}
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
              href="/contact"
              className="btn-primary inline-flex items-center gap-3 cursor-pointer"
            >
              {t("dayPass.ctaButton")}
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
