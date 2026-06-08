"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { useLanguage } from "@/lib/i18n/context";
import {
  Clock,
  ArrowRight,
  Check,
  Bus,
  Calendar,
} from "lucide-react";

// ============================================
// Types
// ============================================
interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  includes: string;
  schedule: string;
  transportIncluded: boolean;
  order: number;
  featured: boolean;
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
// Activities Page — Desert Aurora Design
// ============================================
export default function LesActivitesPage() {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const individualRef = useRef(null);
  const individualInView = useInView(individualRef, { once: true, margin: "-80px" });

  const experiencesRef = useRef(null);
  const experiencesInView = useInView(experiencesRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const individualActivities = activities.filter(
    (a) => a.category === "Activité"
  );
  const experienceActivities = activities.filter(
    (a) => a.category === "Expérience" || a.category === "Aventure"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* ── Hero Section — Magazine Editorial Overlap ── */}
        <section ref={heroRef} className="relative">
          {/* Wide Image — shorter than typical hero */}
          <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
            <img
              src="/images/exp-camel.png"
              alt="Activités au désert d'Agafay"
              className="w-full h-full object-cover"
            />
            {/* Bottom gradient fading to background for seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            {/* Subtle warm overlay for tone */}
            <div className="absolute inset-0 bg-amber/[0.06]" />
          </div>

          {/* Glass Card — overlaps image bottom edge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: smoothEase }}
            className="-mt-20 md:-mt-20 relative z-10 bg-background/90 backdrop-blur-xl border border-amber/10 rounded-t-3xl"
          >
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
                className="luxury-label text-amber block mb-4"
              >
                {t("activities.heroLabel")}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
                className="heading-display text-4xl md:text-6xl lg:text-7xl mb-5"
              >
                {t("activities.heroTitle")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                className="heading-editorial italic text-xl md:text-2xl text-muted-foreground"
              >
                {t("activities.heroSubtitle")}
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* ── Individual Activities Section ── */}
        <section
          ref={individualRef}
          className="py-20 md:py-28 px-6 md:px-10 relative"
        >
          {/* Pattern Background */}
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={individualInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("activities.individualSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={individualInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("activities.individualLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={individualInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("activities.individualTitle1")}
              <br />
              <span className="italic text-amber">{t("activities.individualTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={individualInView ? "visible" : "hidden"}
              custom={0.25}
              className="divider-accent max-w-xs mb-6"
            />
            <motion.p
              variants={revealUp}
              initial="hidden"
              animate={individualInView ? "visible" : "hidden"}
              custom={0.3}
              className="body-editorial text-muted-foreground max-w-2xl mb-16"
            >
              {t("activities.individualText")}
            </motion.p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-80 bg-muted rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {individualActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    variants={revealScale}
                    initial="hidden"
                    animate={individualInView ? "visible" : "hidden"}
                    custom={0.4 + i * 0.15}
                    className="group glass-card card-warm overflow-hidden"
                  >
                    {/* Image — Rounded top */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      {/* Warm hover overlay */}
                      <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                      {/* Amber subtle glow at top-right */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />

                      {/* Price Badge — Rounded pill */}
                      <div className="absolute top-4 right-4 bg-warm-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                        <span className="text-amber mono-number text-lg">
                          {activity.price} {activity.currency}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                      {/* Duration */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-amber" />
                        </div>
                        <span className="text-sm text-muted-foreground body-editorial">
                          {activity.duration}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="heading-editorial text-xl md:text-2xl mb-2 group-hover:text-amber transition-colors duration-400">
                        {activity.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 body-editorial">
                        {activity.description}
                      </p>

                      {/* Includes List */}
                      <div className="space-y-2">
                        {activity.includes.split(",").map((item, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 text-sm text-muted-foreground/70 body-editorial"
                          >
                            <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-amber" />
                            </div>
                            <span>{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Amber Divider ── */}
        <div className="divider-accent max-w-7xl mx-auto" />

        {/* ── Full Experiences Section ── */}
        <section
          ref={experiencesRef}
          className="py-20 md:py-28 px-6 md:px-10 relative"
        >
          {/* Pattern Background */}
          <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={experiencesInView ? "visible" : "hidden"}
              custom={0}
              className="mb-4"
            >
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
                {t("activities.experiencesSectionNumber")}
              </span>
            </motion.div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={experiencesInView ? "visible" : "hidden"}
              custom={0.1}
              className="luxury-label text-amber block mb-4"
            >
              {t("activities.experiencesLabel")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={experiencesInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-3xl md:text-5xl mb-4"
            >
              {t("activities.experiencesTitle1")}
              <br />
              <span className="italic text-amber">{t("activities.experiencesTitle2")}</span>
            </motion.h2>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={experiencesInView ? "visible" : "hidden"}
              custom={0.25}
              className="divider-accent max-w-xs mb-6"
            />
            <motion.p
              variants={revealUp}
              initial="hidden"
              animate={experiencesInView ? "visible" : "hidden"}
              custom={0.3}
              className="body-editorial text-muted-foreground max-w-2xl mb-16"
            >
              {t("activities.experiencesText")}
            </motion.p>

            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-64 bg-muted rounded-2xl"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {experienceActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    variants={revealScale}
                    initial="hidden"
                    animate={experiencesInView ? "visible" : "hidden"}
                    custom={0.4 + i * 0.2}
                    className="group glass-card card-warm overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Image — Rounded */}
                      <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover img-luxury"
                        />
                        {/* Warm hover overlay */}
                        <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />

                        {/* Category Badge — Rounded pill */}
                        <div className="absolute top-4 left-4">
                          <span className="luxury-label text-white/90 bg-warm-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                            {activity.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                        {/* Duration + Transport */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                              <Clock className="w-3 h-3 text-amber" />
                            </div>
                            <span className="text-sm text-muted-foreground body-editorial">
                              {activity.duration}
                            </span>
                          </div>
                          {activity.transportIncluded && (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                                <Bus className="w-3 h-3 text-amber" />
                              </div>
                              <span className="text-sm text-muted-foreground body-editorial">
                                {t("activities.transportIncluded")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="heading-editorial text-2xl md:text-3xl mb-2 group-hover:text-amber transition-colors duration-400">
                          {activity.name}
                        </h3>

                        {/* Amber Divider */}
                        <div className="divider-accent max-w-[80px] mb-4" />

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-2 body-editorial">
                          {activity.description}
                        </p>
                        <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6 body-editorial">
                          {activity.longDescription}
                        </p>

                        {/* Includes List */}
                        <div className="mb-6">
                          <span className="luxury-label text-amber block mb-3">
                            {t("activities.includes")}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activity.includes.split(",").map((item, j) => (
                              <div
                                key={j}
                                className="flex items-center gap-2 text-sm text-muted-foreground/70 body-editorial"
                              >
                                <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-amber" />
                                </div>
                                <span>{item.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Schedule */}
                        {activity.schedule && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-4 body-editorial">
                            <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                              <Calendar className="w-3 h-3 text-amber" />
                            </div>
                            <span>{activity.schedule}</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-auto pt-4 border-t border-amber/10">
                          <div className="flex items-baseline gap-2">
                            <span className="mono-number text-3xl text-amber">
                              {activity.price}
                            </span>
                            <span className="text-sm text-muted-foreground body-editorial">
                              {activity.currency} {t("activities.perPerson")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section
          ref={ctaRef}
          className="relative py-20 md:py-28 px-6 md:px-10 bg-warm-black text-center overflow-hidden"
        >
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber/[0.03] blob-2 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber/[0.04] blob-1 blur-3xl" />

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
            {t("activities.ctaLabel")}
          </motion.span>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-3xl md:text-5xl text-foreground mb-6"
          >
            {t("activities.ctaTitle")}
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
              {t("activities.ctaButton")}
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
