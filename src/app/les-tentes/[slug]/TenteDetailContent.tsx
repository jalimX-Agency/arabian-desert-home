"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Maximize2, Star, Check, Wind, BedDouble, ArrowRight } from "lucide-react";
import { useLanguage, withLocale, pickLocalized } from "@/lib/i18n/context";

interface Suite {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  features: string;
  amenities: string;
  image: string;
  images: string;
  maxGuests: number;
  bedType: string;
  size: string;
  hasAC: boolean;
  featured: boolean;
  type: string;
  nameEn: string;
  taglineEn: string;
  descriptionEn: string;
  longDescriptionEn: string;
  featuresEn: string;
  amenitiesEn: string;
  nameEs?: string;
  taglineEs?: string;
  descriptionEs?: string;
  longDescriptionEs?: string;
  featuresEs?: string;
  amenitiesEs?: string;
  nameIt?: string;
  taglineIt?: string;
  descriptionIt?: string;
  longDescriptionIt?: string;
  featuresIt?: string;
  amenitiesIt?: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function TenteDetailContent({ suite }: { suite: Suite }) {
  const { language, t } = useLanguage();

  const name        = pickLocalized(language, suite.name, suite.nameEn, suite.nameEs, suite.nameIt);
  const tagline     = pickLocalized(language, suite.tagline, suite.taglineEn, suite.taglineEs, suite.taglineIt);
  const description = pickLocalized(language, suite.description, suite.descriptionEn, suite.descriptionEs, suite.descriptionIt);
  const longDesc    = pickLocalized(language, suite.longDescription, suite.longDescriptionEn, suite.longDescriptionEs, suite.longDescriptionIt);
  const featSrc     = pickLocalized(language, suite.features, suite.featuresEn, suite.featuresEs, suite.featuresIt);
  const amenSrc     = pickLocalized(language, suite.amenities, suite.amenitiesEn, suite.amenitiesEs, suite.amenitiesIt);

  const featuresList = featSrc ? featSrc.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const amenitiesList = amenSrc ? amenSrc.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const extraImages = suite.images ? suite.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const allImages = [suite.image, ...extraImages].filter(Boolean);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={suite.image} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 left-6 md:left-12"
        >
          <Link href={withLocale(language, "/les-tentes")} className="flex items-center gap-2 text-white/70 hover:text-amber transition-colors text-sm luxury-label">
            <ArrowLeft className="w-4 h-4" />
            {t("suiteDetail.backToTents")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 right-6 md:right-12 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full"
        >
          <span className="text-amber mono-number text-xl">{suite.price} {suite.currency === "EUR" ? "€" : suite.currency}</span>
          <span className="text-white/40 text-xs ml-1">{t("suiteDetail.perNight")}</span>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
          {suite.featured && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
              className="inline-block bg-amber/90 px-3 py-1 rounded-full luxury-label text-black text-xs mb-3"
            >
              Prestige
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="heading-editorial text-4xl md:text-6xl text-white mb-2"
          >
            {name}
          </motion.h1>
          {tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              className="luxury-label text-amber/80 text-sm"
            >
              {tagline}
            </motion.p>
          )}
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
            {allImages.length > 1 ? (
              <>
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img src={allImages[0]} alt={name} className="w-full h-full object-cover img-luxury" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {allImages.slice(1, 3).map((img, i) => (
                    <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                      <img src={img} alt={`${name} ${i + 2}`} className="w-full h-full object-cover img-luxury" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src={suite.image} alt={name} className="w-full h-full object-cover img-luxury" />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}
          >
            <div className="flex flex-wrap gap-5 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber" />
                <span>{suite.maxGuests} {t("suiteDetail.persons")}</span>
              </div>
              {suite.size && (
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-amber" />
                  <span>{suite.size}</span>
                </div>
              )}
              {suite.bedType && (
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-amber" />
                  <span>{suite.bedType}</span>
                </div>
              )}
              {suite.hasAC && (
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-amber" />
                  <span>{t("suiteDetail.airConditioning")}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber fill-amber" />
                <span className="text-amber">5.0</span>
              </div>
            </div>

            <div className="divider-accent max-w-[60px] mb-6" />

            <p className="body-editorial text-foreground/70 text-base leading-relaxed mb-4">{description}</p>
            {longDesc && (
              <p className="body-editorial text-muted-foreground text-sm leading-relaxed mb-8">{longDesc}</p>
            )}

            {featuresList.length > 0 && (
              <div className="mb-6">
                <h3 className="luxury-label text-amber text-xs mb-3">{t("suiteDetail.features")}</h3>
                <ul className="space-y-2">
                  {featuresList.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground body-editorial">
                      <Check className="w-3.5 h-3.5 text-amber shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {amenitiesList.length > 0 && (
              <div className="mb-8">
                <h3 className="luxury-label text-amber text-xs mb-3">{t("suiteDetail.amenities")}</h3>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((a, i) => (
                    <span key={i} className="text-xs border border-amber/20 text-muted-foreground px-3 py-1 rounded-full body-editorial">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`${withLocale(language, "/reservez-votre-sejour")}?type=tente&slug=${suite.slug}`}
                className="btn-primary flex items-center justify-center gap-2 text-sm"
              >
                {t("suiteDetail.bookThisSuite")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={withLocale(language, "/contact")} className="btn-outline flex items-center justify-center gap-2 text-sm">
                {t("nav.contact")}
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
            {t("suiteDetail.book")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="body-editorial text-muted-foreground mb-8"
          >
            {t("suiteDetail.startingFrom")} {suite.price} {suite.currency === "EUR" ? "€" : suite.currency} {t("suiteDetail.perNight2")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`${withLocale(language, "/reservez-votre-sejour")}?type=tente&slug=${suite.slug}`}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {t("nav.bookNow")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={withLocale(language, "/les-tentes")} className="btn-outline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("suiteDetail.seeAllTents")}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
