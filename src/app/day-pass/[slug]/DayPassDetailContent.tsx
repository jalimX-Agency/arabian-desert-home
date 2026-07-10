"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sun } from "lucide-react";
import { useLanguage, withLocale, pickLocalized } from "@/lib/i18n/context";

interface DayPass {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  includes: string;
  image: string;
  order: number;
  nameEn: string;
  descriptionEn: string;
  includesEn: string;
  nameEs?: string;
  descriptionEs?: string;
  includesEs?: string;
  nameIt?: string;
  descriptionIt?: string;
  includesIt?: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function DayPassDetailContent({ pass }: { pass: DayPass }) {
  const { language, t } = useLanguage();

  const name        = pickLocalized(language, pass.name, pass.nameEn, pass.nameEs, pass.nameIt);
  const description = pickLocalized(language, pass.description, pass.descriptionEn, pass.descriptionEs, pass.descriptionIt);
  const inclSrc     = pickLocalized(language, pass.includes, pass.includesEn, pass.includesEs, pass.includesIt);

  const includesList = inclSrc ? inclSrc.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {pass.image && <img src={pass.image} alt={name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 left-6 md:left-12"
        >
          <Link href={withLocale(language, "/day-pass")} className="flex items-center gap-2 text-white/70 hover:text-amber transition-colors text-sm luxury-label">
            <ArrowLeft className="w-4 h-4" />
            {t("dayPassDetail.back")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 right-6 md:right-12 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full"
        >
          <span className="text-amber mono-number text-xl">{pass.price} {pass.currency}</span>
          <span className="text-white/40 text-xs ml-1">{t("dayPassDetail.perPerson")}</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: smoothEase }}
            className="inline-block bg-amber/20 border border-amber/30 px-3 py-1 rounded-full luxury-label text-amber text-xs mb-3"
          >
            {t("dayPassDetail.badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="heading-editorial text-4xl md:text-6xl text-white"
          >
            {name}
          </motion.h1>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="bg-background py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: smoothEase }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sun className="w-5 h-5 text-amber" />
                <span className="luxury-label text-amber text-xs">{t("dayPassDetail.label")}</span>
              </div>

              <div className="divider-accent max-w-[60px] mb-6" />

              <p className="body-editorial text-foreground/70 text-base leading-relaxed mb-6">{description}</p>

              <div className="glass-card card-warm p-6 rounded-2xl text-center">
                <p className="luxury-label text-amber/60 text-xs mb-2">{t("dayPassDetail.rateLabel")}</p>
                <p className="mono-number text-amber text-4xl">{pass.price}</p>
                <p className="text-muted-foreground text-sm mt-1">{pass.currency}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}
            >
              {includesList.length > 0 && (
                <div>
                  <h3 className="luxury-label text-amber text-xs mb-5">{t("dayPassDetail.includes")}</h3>
                  <ul className="space-y-3">
                    {includesList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground body-editorial">
                        <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 flex flex-col gap-3">
                <Link
                  href={`${withLocale(language, "/contact")}?pass=${pass.slug}`}
                  className="btn-primary flex items-center justify-center gap-2 text-sm"
                >
                  {t("dayPassDetail.bookButton")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={withLocale(language, "/contact")} className="btn-outline flex items-center justify-center gap-2 text-sm">
                  {t("dayPassDetail.infoButton")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-background border-t border-border py-16 px-6 md:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="luxury-label text-amber block mb-4"
          >
            Arabian Desert Home
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="heading-editorial text-3xl md:text-4xl text-foreground mb-4"
          >
            {t("dayPassDetail.ctaTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="body-editorial text-muted-foreground mb-8"
          >
            {t("dayPassDetail.ctaSubtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={`${withLocale(language, "/contact")}?pass=${pass.slug}`} className="btn-primary flex items-center justify-center gap-2">
              {t("dayPassDetail.ctaBook")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={withLocale(language, "/day-pass")} className="btn-outline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("dayPassDetail.ctaBack")}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
