"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage } from "@/lib/i18n/context";
import { Check, Clock, Baby, AlertCircle, ArrowRight, Phone } from "lucide-react";

interface DayPass {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  includes: string;
  includesEn: string;
  order: number;
  image: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;


function PassRow({
  pass,
  index,
  isEn,
  t,
}: {
  pass: DayPass;
  index: number;
  isEn: boolean;
  t: (key: string) => string;
}) {
  const isReversed = index % 2 === 1;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const loc = (fr: string, en: string) => (isEn && en) ? en : fr;
  const includeItems = loc(pass.includes, pass.includesEn)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} min-h-[520px]`}
    >
      {/* Image side */}
      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: smoothEase }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${pass.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp"}')`,
          }}
        />
        <div
          className={`absolute inset-y-0 ${isReversed ? "right-0 w-24" : "left-0 w-24"} md:block hidden`}
          style={{
            background: `linear-gradient(to ${isReversed ? "left" : "right"}, var(--background), transparent)`,
          }}
        />
        <div className="absolute top-6 left-6 bg-warm-black/70 backdrop-blur-md border border-amber/20 px-4 py-2 rounded-2xl">
          {pass.originalPrice && (
            <span className="block text-white/40 line-through text-xs mono-number leading-none mb-0.5">
              {pass.originalPrice} {pass.currency}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="mono-number text-amber text-xl">{pass.price}</span>
            <span className="text-amber/60 text-xs">{pass.currency}/pers.</span>
          </div>
          {pass.originalPrice && (
            <span className="block text-red-400 text-[10px] font-medium mt-0.5">
              -{Math.round((1 - pass.price / pass.originalPrice) * 100)}% remise
            </span>
          )}
        </div>
        <div
          className={`absolute bottom-6 ${isReversed ? "left-6" : "right-6"} mono-number text-white/10 text-8xl leading-none select-none`}
        >
          0{index + 2}
        </div>
      </div>

      {/* Content side */}
      <div className="relative w-full md:w-1/2 bg-background flex items-center px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-md w-full">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="luxury-label text-amber block mb-3"
          >
            Day Pass
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}
            className="heading-display text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            {loc(pass.name, pass.nameEn)}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: smoothEase }}
            className="divider-accent max-w-[80px] origin-left mb-5"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="body-editorial text-muted-foreground mb-8"
          >
            {loc(pass.description, pass.descriptionEn)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
            className="space-y-2.5 mb-8"
          >
            <span className="luxury-label text-amber/70 block mb-3">
              {t("dayPass.includes")}
            </span>
            {includeItems.map((item, j) => (
              <div key={j} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-amber" />
                </div>
                <span className="body-editorial text-muted-foreground">{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: smoothEase }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href={isEn ? `/en/day-pass/${pass.slug}` : `/day-pass/${pass.slug}`}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              {t("dayPass.ctaButton")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="btn-outline inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {t("dayPass.contactButton") || "Nous Contacter"}
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function DayPassContent({ passes }: { passes: DayPass[] }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const loc = (fr: string, en: string) => (isEn && en) ? en : fr;
  const data = passes;

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const infoRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Hero — Split layout ── */}
      <section
        ref={heroRef}
        className="relative flex flex-col md:flex-row min-h-[55vh] md:min-h-[60vh] overflow-hidden"
      >
        {/* Mobile image strip */}
        <div className="relative w-full h-[28vh] md:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${data[0]?.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp"}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm-black/90" />
        </div>

        {/* Left: text */}
        <div className="relative w-full md:w-[55%] bg-warm-black flex items-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
          <div className="absolute inset-0 grain-overlay pointer-events-none" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-amber/[0.03] blob-1 blur-3xl" />

          <div className="relative z-10 max-w-lg">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4"
            >
              01
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
              className="luxury-label text-amber block mb-5"
            >
              {t("dayPass.heroLabel")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="heading-display text-4xl md:text-5xl lg:text-7xl text-white mb-5"
            >
              {t("dayPass.heroTitle")}{" "}
              <span className="italic text-amber">{t("dayPass.heroSubtitle")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: smoothEase }}
              className="body-editorial text-white/50 text-base md:text-lg max-w-md mb-8"
            >
              {t("dayPass.introText")}
            </motion.p>

            {/* Price range pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: smoothEase }}
              className="flex items-center gap-3 flex-wrap"
            >
              {data.map((pass) => (
                <span
                  key={pass.id}
                  className="px-3 py-1.5 rounded-full border border-amber/20 bg-amber/[0.06] text-amber mono-number text-sm flex items-baseline gap-1"
                >
                  {pass.originalPrice && (
                    <span className="text-white/30 line-through text-xs">{pass.originalPrice}</span>
                  )}
                  {pass.price} <span className="text-amber/60 text-xs">{pass.currency}/pers.</span>
                  {pass.originalPrice && (
                    <span className="text-red-400 text-[10px] ml-1">
                      -{Math.round((1 - pass.price / pass.originalPrice) * 100)}%
                    </span>
                  )}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: smoothEase }}
              className="divider-accent max-w-[120px] origin-left mt-8"
            />
          </div>
        </div>

        {/* Right: image */}
        <div className="hidden md:block relative w-[45%] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${data[0]?.image || "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp"}')`,
            }}
          />
          <div className="absolute inset-0 gradient-amber opacity-30" />
          <div
            className="absolute inset-y-0 left-0 w-16"
            style={{
              background: "linear-gradient(to right, var(--warm-black), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── Passes — Alternating editorial rows ── */}
      <section className="relative">
        {data.map((pass, i) => (
          <PassRow key={pass.id} pass={pass} index={i} isEn={isEn} t={t} />
        ))}
      </section>

      {/* ── Practical Info ── */}
      <section ref={infoRef} className="py-20 md:py-28 px-6 md:px-10 relative bg-warm-black">
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 divider-accent-wide" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber/[0.03] blob-2 blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-4"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
              {t("dayPass.infoSectionNumber")}
            </span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="luxury-label text-amber block mb-4"
          >
            {t("dayPass.infoLabel")}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={infoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: smoothEase }}
            className="heading-display text-3xl md:text-5xl text-white mb-4"
          >
            {t("dayPass.infoTitle1")}{" "}
            <span className="italic text-amber">{t("dayPass.infoTitle2")}</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={infoInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
            className="divider-accent max-w-xs origin-left mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: t("dayPass.hoursTitle"), text: t("dayPass.hoursText"), delay: 0.4 },
              { icon: Baby, title: t("dayPass.childrenTitle"), text: t("dayPass.childrenText"), delay: 0.5 },
              { icon: AlertCircle, title: t("dayPass.bookingTitle"), text: t("dayPass.bookingText"), delay: 0.6 },
            ].map(({ icon: Icon, title, text, delay }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                animate={infoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay, ease: smoothEase }}
                className="border border-amber/10 bg-amber/[0.03] rounded-2xl p-6 hover:border-amber/25 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber" />
                </div>
                <h3 className="heading-editorial text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 body-editorial">{text}</p>
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
