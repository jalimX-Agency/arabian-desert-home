"use client";

import { useState, useEffect } from "react";
import { useLanguage, withLocale } from "@/lib/i18n/context";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Users,
  Maximize2,
  BedDouble,
  Wind,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

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
  order: number;
  featured: boolean;
  type: string;
}

interface SuiteDetailPageProps {
  slug: string;
}

export function SuiteDetailPage({ slug }: SuiteDetailPageProps) {
  const { t, language } = useLanguage();
  const [suite, setSuite] = useState<Suite | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/suites?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setSuite(data);
        if (data?.images) {
          setGalleryImages(data.images.split(",").map((img: string) => img.trim()));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      </div>
    );
  }

  if (!suite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-display text-3xl mb-4">{t("suiteDetail.suiteNotFound")}</h1>
          <p className="body-editorial text-muted-foreground mb-8">
            {t("suiteDetail.suiteNotFoundDesc")}
          </p>
          <Link
            href="/les-tentes"
            className="inline-flex items-center gap-2 text-amber hover:text-amber-light transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("suiteDetail.backToTents")}
          </Link>
        </div>
      </div>
    );
  }

  const features = suite.features.split(",").map((f) => f.trim());
  const amenities = suite.amenities.split(",").map((a) => a.trim());
  const isChambre = suite.type === "chambre";
  const priceLabel = isChambre ? `${suite.price} MAD` : `${suite.price} €`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero Section — Cinematic + Warm ── */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-end overflow-hidden">
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${galleryImages[activeImageIndex] || suite.image}')` }}
        />
        {/* Warm Gradient Overlays */}
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 gradient-diagonal-warm" />
        <div className="absolute inset-0 gradient-amber" />

        {/* Decorative Blob */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-amber/[0.04] blob-1 blur-3xl" />

        {/* Grain Texture */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Image Navigation — Rounded Glass Circles */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-background/20 backdrop-blur-xl border border-white/10 text-foreground/80 hover:bg-background/40 hover:border-amber/30 hover:text-amber transition-all duration-300 cursor-pointer"
              aria-label={t("suiteDetail.previousImage")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-background/20 backdrop-blur-xl border border-white/10 text-foreground/80 hover:bg-background/40 hover:border-amber/30 hover:text-amber transition-all duration-300 cursor-pointer"
              aria-label={t("suiteDetail.nextImage")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Dots — Rounded-full Amber Pills */}
            <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-full transition-all duration-500 cursor-pointer ${
                    idx === activeImageIndex
                      ? "bg-amber w-8 h-2"
                      : "bg-white/20 w-2 h-2 hover:bg-white/40"
                  }`}
                  aria-label={`${t("suiteDetail.image")} ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-10 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href="/les-tentes"
                className="inline-flex items-center gap-2 text-foreground/40 hover:text-amber text-sm mb-6 transition-colors duration-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("suiteDetail.allTents")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="luxury-label text-amber block mb-3">
                {isChambre ? t("suiteDetail.room") : t("suiteDetail.suite")}
              </span>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl text-foreground mb-3">
                {suite.name}
              </h1>
              <p className="heading-editorial text-xl md:text-2xl text-amber/80 italic mb-4">
                {suite.tagline}
              </p>

              {/* Quick Stats — Rounded Pills */}
              <div className="flex flex-wrap items-center gap-3 text-foreground/50 text-sm">
                <span className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                  <Users className="w-4 h-4 text-amber/60" />
                  {suite.maxGuests} {t("suiteDetail.persons")}
                </span>
                <span className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                  <Maximize2 className="w-4 h-4 text-amber/60" />
                  {suite.size}
                </span>
                <span className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                  <BedDouble className="w-4 h-4 text-amber/60" />
                  {suite.bedType}
                </span>
                {suite.hasAC && (
                  <span className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
                    <Wind className="w-4 h-4 text-amber/60" />
                    {t("suiteDetail.airConditioning")}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="py-16 md:py-24 px-6 md:px-10 relative">
        {/* Pattern Background */}
        <div className="absolute inset-0 pattern-dots pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-16"
              >
                <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4">
                  01
                </span>
                <span className="luxury-label text-amber block mb-4">
                  {t("suiteDetail.about")}
                </span>
                <h2 className="heading-display text-2xl md:text-4xl mb-6">
                  {t("suiteDetail.aboutTitle1")} <span className="text-amber">{t("suiteDetail.aboutTitle2")}</span>
                </h2>
                <div className="divider-accent max-w-[120px] mb-8" />
                <p className="body-editorial text-muted-foreground leading-relaxed text-lg">
                  {suite.longDescription}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-16"
              >
                <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4">
                  02
                </span>
                <span className="luxury-label text-amber block mb-4">
                  {t("suiteDetail.features")}
                </span>
                <h2 className="heading-display text-2xl md:text-4xl mb-6">
                  {t("suiteDetail.featuresTitle1")} <span className="text-amber">{t("suiteDetail.featuresTitle2")}</span>
                </h2>
                <div className="divider-accent max-w-[120px] mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="glass-card card-warm flex items-center gap-3 py-4 px-5"
                    >
                      <div className="w-7 h-7 rounded-full border border-amber/20 bg-amber/10 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-amber" />
                      </div>
                      <span className="body-editorial text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Image Gallery */}
              {galleryImages.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mb-16"
                >
                  <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4">
                    03
                  </span>
                  <span className="luxury-label text-amber block mb-4">
                    {t("suiteDetail.gallery")}
                  </span>
                  <h2 className="heading-display text-2xl md:text-4xl mb-6">
                    {t("suiteDetail.galleryTitle1")} <span className="text-amber">{t("suiteDetail.galleryTitle2")}</span>
                  </h2>
                  <div className="divider-accent max-w-[120px] mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {galleryImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`relative overflow-hidden rounded-2xl group ${
                          idx === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${suite.name} — ${t("suiteDetail.image")} ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-[1.4s] cubic-bezier(0.25,0.46,0.45,0.94) group-hover:scale-105"
                        />
                        {/* Hover Overlay — Amber Tint */}
                        <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                        {/* Rounded Inner Frame Border on Hover */}
                        <div className="absolute inset-3 rounded-xl border border-amber/0 group-hover:border-amber/20 transition-all duration-500" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="sticky top-28"
              >
                {/* Price Card — Glass Card */}
                <div className="glass-card card-warm p-8 mb-6">
                  <div className="mb-6">
                    <span className="luxury-label text-amber block mb-2">
                      {t("suiteDetail.rate")}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="mono-number text-4xl text-amber">
                        {priceLabel}
                      </span>
                      <span className="body-editorial text-muted-foreground text-sm">
                        {t("suiteDetail.perNight")}
                      </span>
                    </div>
                    {isChambre && (
                      <p className="text-xs text-muted-foreground mt-2 body-editorial">
                        {t("suiteDetail.fullBoard")}
                      </p>
                    )}
                  </div>

                  <div className="divider-accent mb-6" />

                  {/* Quick Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full border border-amber/15 bg-amber/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-amber" />
                      </div>
                      <span className="body-editorial text-sm">
                        {suite.maxGuests} {suite.maxGuests > 1 ? t("suiteDetail.persons") : t("suiteDetail.person")} {t("suiteDetail.maxPersons")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full border border-amber/15 bg-amber/10 flex items-center justify-center">
                        <Maximize2 className="w-3.5 h-3.5 text-amber" />
                      </div>
                      <span className="body-editorial text-sm">{suite.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full border border-amber/15 bg-amber/10 flex items-center justify-center">
                        <BedDouble className="w-3.5 h-3.5 text-amber" />
                      </div>
                      <span className="body-editorial text-sm">{suite.bedType}</span>
                    </div>
                    {suite.hasAC && (
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full border border-amber/15 bg-amber/10 flex items-center justify-center">
                          <Wind className="w-3.5 h-3.5 text-amber" />
                        </div>
                        <span className="body-editorial text-sm">{t("suiteDetail.airConditioning")}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={withLocale(language, "/reservez-votre-sejour")}
                    className="btn-primary block w-full text-center cursor-pointer"
                  >
                    {t("suiteDetail.bookThisSuite")}
                  </Link>
                </div>

                {/* Amenities Card — Glass Card */}
                <div className="glass-card card-warm p-8">
                  <span className="luxury-label text-amber block mb-4">
                    {t("suiteDetail.amenities")}
                  </span>
                  <div className="space-y-3">
                    {amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-4 h-4 text-amber shrink-0" />
                        <span className="body-editorial text-sm text-muted-foreground">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Back Link */}
                <div className="mt-6 text-center">
                  <Link
                    href="/les-tentes"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-amber text-sm transition-colors duration-300 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("suiteDetail.seeAllTents")}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA — Warm Black Background ── */}
      <section className="relative py-20 md:py-28 px-6 md:px-10 bg-warm-black text-center overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/[0.03] blob-1 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-amber/[0.04] blob-3 blur-3xl" />

        {/* Grain Texture */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Divider Top */}
        <div className="absolute top-0 left-0 right-0 divider-accent-wide" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="luxury-label text-amber block mb-4">
            {t("suiteDetail.book")}
          </span>
          <h2 className="heading-display text-3xl md:text-5xl text-foreground mb-4">
            {suite.name}
          </h2>
          <p className="heading-editorial text-lg text-amber/60 italic mb-6">
            {suite.tagline}
          </p>
          <p className="body-editorial text-foreground/40 mb-10 max-w-xl mx-auto">
            {t("suiteDetail.startingFrom")} {priceLabel} {t("suiteDetail.perNight2")}
          </p>
          <Link
            href={withLocale(language, "/reservez-votre-sejour")}
            className="btn-primary inline-flex items-center gap-3 cursor-pointer"
          >
            {t("suiteDetail.bookThisSuite")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Divider Bottom */}
        <div className="absolute bottom-0 left-0 right-0 divider-accent-wide" />
      </section>
    </div>
  );
}
