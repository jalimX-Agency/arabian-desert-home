"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Check, Bus, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

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
  images: string;
  category: string;
  includes: string;
  schedule: string;
  transportIncluded: boolean;
  featured: boolean;
  nameEn: string;
  descriptionEn: string;
  longDescriptionEn: string;
  includesEn: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function ActiviteDetailContent({ activity }: { activity: Activity }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const name        = (isEn && activity.nameEn)            ? activity.nameEn            : activity.name;
  const description = (isEn && activity.descriptionEn)     ? activity.descriptionEn     : activity.description;
  const longDesc    = (isEn && activity.longDescriptionEn) ? activity.longDescriptionEn : activity.longDescription;
  const inclSrc     = (isEn && activity.includesEn)        ? activity.includesEn        : activity.includes;

  const includesList = inclSrc ? inclSrc.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={activity.image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 left-6 md:left-12"
        >
          <Link href={isEn ? "/en/les-activites" : "/les-activites"} className="flex items-center gap-2 text-white/70 hover:text-amber transition-colors text-sm luxury-label">
            <ArrowLeft className="w-4 h-4" />
            {t("activityDetail.back")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 right-6 md:right-12 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full"
        >
          <span className="text-amber mono-number text-xl">{activity.price} {activity.currency}</span>
          <span className="text-white/40 text-xs ml-1">{t("activityDetail.perPerson")}</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: smoothEase }}
            className="inline-block bg-amber/20 border border-amber/30 px-3 py-1 rounded-full luxury-label text-amber text-xs mb-3"
          >
            {activity.category}
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
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: smoothEase }}
            className="space-y-4"
          >
            {(() => {
              const extras = activity.images ? activity.images.split(",").map(s => s.trim()).filter(Boolean) : [];
              const all = [activity.image, ...extras].filter(Boolean);
              return all.length > 1 ? (
                <>
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <img src={all[0]} alt={name} className="w-full h-full object-cover img-luxury" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {all.slice(1, 3).map((img, i) => (
                      <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                        <img src={img} alt={`${name} ${i + 2}`} className="w-full h-full object-cover img-luxury" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={activity.image} alt={name} className="w-full h-full object-cover img-luxury" />
                </div>
              );
            })()}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}
          >
            <div className="flex flex-wrap gap-5 mb-8 text-sm text-muted-foreground">
              {activity.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber" />
                  <span>{activity.duration}</span>
                </div>
              )}
              {activity.schedule && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber" />
                  <span>{activity.schedule}</span>
                </div>
              )}
              {activity.transportIncluded && (
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber" />
                  <span>{t("activityDetail.transportIncluded")}</span>
                </div>
              )}
            </div>

            <div className="divider-accent max-w-[60px] mb-6" />

            <p className="body-editorial text-foreground/70 text-base leading-relaxed mb-4">{description}</p>
            {longDesc && (
              <p className="body-editorial text-muted-foreground text-sm leading-relaxed mb-8">{longDesc}</p>
            )}

            {includesList.length > 0 && (
              <div className="mb-8">
                <h3 className="luxury-label text-amber text-xs mb-3">{t("activityDetail.includes")}</h3>
                <ul className="space-y-2">
                  {includesList.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground body-editorial">
                      <Check className="w-3.5 h-3.5 text-amber shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/reservez-votre-sejour?type=activite&slug=${activity.slug}`}
                className="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                {t("activityDetail.bookButton")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline flex items-center justify-center gap-2 text-sm">
                {t("activityDetail.contactButton")}
              </Link>
            </div>
          </motion.div>
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
            {t("activityDetail.ctaTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="body-editorial text-muted-foreground mb-8"
          >
            {t("activityDetail.ctaSubtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`/reservez-votre-sejour?type=activite&slug=${activity.slug}`}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {t("activityDetail.ctaBook")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={isEn ? "/en/les-activites" : "/les-activites"} className="btn-outline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("activityDetail.ctaBack")}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
