"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { useLanguage } from "@/lib/i18n/context";

// ============================================
// Types
// ============================================
interface SpaTreatment {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  source: string;
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
// Spa Page — Desert Aurora Design
// ============================================
export default function SpaPage() {
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<SpaTreatment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });

  const treatmentsRef = useRef(null);
  const treatmentsInView = useInView(treatmentsRef, { once: true, margin: "-80px" });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  useEffect(() => {
    async function fetchData() {
      try {
        const [spaRes, testRes] = await Promise.all([
          fetch("/api/spa"),
          fetch("/api/testimonials"),
        ]);
        const spaData = await spaRes.json();
        const testData = await testRes.json();
        setTreatments(spaData);
        setTestimonials(testData.filter((item: Testimonial) => item.source === "spa"));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
              src="/images/spa-treatment.png"
              alt="Spa de luxe au désert d'Agafay"
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
              {t("spa.heroLabel")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="heading-display text-4xl md:text-6xl lg:text-8xl text-white mb-6"
            >
              {t("spa.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              {t("spa.heroSubtitle")}
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
              {t("spa.introText")}
            </motion.p>
          </div>
        </section>

        {/* ── Treatments Grid ── */}
        <section
          ref={treatmentsRef}
          className="py-16 md:py-24 px-6 md:px-10 relative"
        >
          <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={treatmentsInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("spa.treatmentsSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={treatmentsInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("spa.treatmentsLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={treatmentsInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("spa.treatmentsTitle1")}
              <br />
              <span className="italic text-amber">{t("spa.treatmentsTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={treatmentsInView ? "visible" : "hidden"}
              custom={0.3}
              className="divider-accent max-w-xs mb-16"
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-2xl mb-6" />
                    <div className="h-6 bg-muted rounded-2xl w-3/4 mb-3" />
                    <div className="h-4 bg-muted rounded-2xl w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {treatments.map((treatment, index) => (
                  <motion.div
                    key={treatment.id}
                    variants={revealScale}
                    initial="hidden"
                    animate={treatmentsInView ? "visible" : "hidden"}
                    custom={0.4 + index * 0.15}
                    className="group glass-card card-warm overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={treatment.image}
                        alt={treatment.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      {/* Warm hover overlay */}
                      <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                      {/* Price badge */}
                      <div className="absolute top-4 right-4 bg-warm-black/40 backdrop-blur-md rounded-full px-5 py-2">
                        <span className="text-amber mono-number text-lg">
                          {treatment.price} {treatment.currency}
                        </span>
                      </div>
                      {/* Amber subtle glow at top-right */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      <h3 className="heading-editorial text-xl md:text-2xl mb-3 group-hover:text-amber transition-colors duration-400">
                        {treatment.name}
                      </h3>

                      {/* Duration */}
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-amber" />
                        </div>
                        <span className="text-sm text-muted-foreground body-editorial">
                          {t("spa.duration")}: {treatment.duration}
                        </span>
                      </div>

                      {/* Amber Divider */}
                      <div className="divider-accent max-w-[60px] mb-4" />

                      <p className="text-sm text-muted-foreground leading-relaxed body-editorial">
                        {treatment.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Testimonials Section ── */}
        {testimonials.length > 0 && (
          <section
            ref={testimonialsRef}
            className="py-20 md:py-28 px-6 md:px-10 relative"
          >
            <div className="absolute inset-0 pattern-dots pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                custom={0}
                className="mb-4 text-center"
              >
                <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                  {t("spa.testimonialsSectionNumber")}
                </span>
              </motion.div>
              <motion.span
                variants={revealUp}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                custom={0.1}
                className="luxury-label text-amber block text-center mb-4"
              >
                {t("spa.testimonialsLabel")}
              </motion.span>
              <motion.h2
                variants={revealUp}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                custom={0.2}
                className="heading-display text-3xl md:text-4xl text-center mb-16"
              >
                {t("spa.testimonialsTitle1")}
                <br />
                <span className="italic text-amber">{t("spa.testimonialsTitle2")}</span>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    variants={revealScale}
                    initial="hidden"
                    animate={testimonialsInView ? "visible" : "hidden"}
                    custom={0.4 + index * 0.15}
                    className="glass-card card-warm p-8"
                  >
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="heading-editorial text-lg md:text-xl italic mb-6 leading-relaxed text-foreground/90">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Divider */}
                    <div className="divider-accent max-w-[60px] mb-4" />

                    {/* Author */}
                    <div>
                      <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground body-editorial">{testimonial.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

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
            {t("spa.ctaLabel")}
          </motion.span>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-3xl md:text-5xl text-foreground mb-6"
          >
            {t("spa.ctaTitle")}
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
              {t("spa.ctaButton")}
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
