"use client";

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  Quote,
  Compass,
  Gem,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { useLanguage, withLocale, pickLocalized } from "@/lib/i18n/context";
import { CTASection } from "@/components/arabian/CTASection";

// ============================================
// Types
// ============================================
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

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  source: string;
  order: number;
}

// ============================================
// Animation Variants — Desert Aurora
// Smooth, flowing, organic transitions
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
// 1. HERO SECTION — Full Viewport + Parallax + Warm Aurora
// ============================================
function HeroSection() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Background Video with Parallax — falls back to poster image while buffering */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png"
          className="w-full h-full object-cover scale-[1.18]"
        >
          <source
            src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero-video.webm"
            type="video/webm"
          />
        </video>
        {/* Warm Cinematic Gradients — always dark regardless of theme */}
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.08 0.008 55 / 80%) 0%, oklch(0.08 0.008 55 / 25%) 45%, transparent 100%)" }} />
        <div className="absolute inset-0 gradient-amber" />
        {/* Watermark cover — bottom-right corner dark radial */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 35% 25% at 100% 100%, oklch(0.08 0.008 55 / 95%) 0%, transparent 100%)" }} />
      </motion.div>

      {/* Organic Decorative Blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: smoothEase }}
        className="absolute top-[15%] right-[5%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-amber/[0.04] blob-1 pointer-events-none"
      />

      {/* Large Decorative "01" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="absolute top-28 right-6 md:top-32 md:right-10 font-serif text-[160px] md:text-[260px] leading-none text-amber/[0.04] select-none pointer-events-none"
      >
        01
      </motion.div>

      {/* Content — Left Aligned */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-24 lg:pb-20 xl:pb-32 px-6 md:px-10 max-w-7xl mx-auto"
      >
        {/* Location Tag */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="w-10 h-px bg-gradient-to-r from-amber to-amber-light" />
          <span className="luxury-label text-amber/80">
            {t("hero.location")}
          </span>
        </motion.div>

        {/* Main Heading — "Arabian" in heading-display + "Desert Home" in luxury-label accent */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: smoothEase }}
          className="heading-display text-white text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[8.5rem] max-w-5xl text-balance"
        >
          <span className="sr-only">Bivouac de Luxe dans le Désert d&apos;Agafay — 30 min de Marrakech</span>
          <span aria-hidden="true">
            {t("hero.heading1")}
            <br />
            <span className="text-amber">{t("hero.heading2")}</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: smoothEase }}
          className="body-editorial text-muted-foreground text-base md:text-lg max-w-lg mt-8"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Row — Rounded Pill Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: smoothEase }}
          className="mt-10 flex items-center gap-6"
        >
          <Link href={withLocale(language, "/reservez-votre-sejour")}>
            <span className="btn-primary inline-block cursor-pointer hover:no-underline">
              {t("hero.reserve")}
            </span>
          </Link>
          <Link
            href={withLocale(language, "/les-tentes")}
            className="hidden md:flex items-center gap-3 luxury-label text-amber/60 hover:text-amber transition-colors duration-400 group cursor-pointer"
          >
            {t("suites.title")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — Animated Amber Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="luxury-label text-muted-foreground/50 text-[9px]">
          {t("hero.discover")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-amber/30 flex items-start justify-center pt-1.5"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-amber"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// 2. FEATURES SECTION — Rounded Glass Cards Grid
// ============================================
function FeaturesSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const features = [
    {
      icon: Gem,
      title: t("features.classAmenities"),
      description: t("features.classAmenitiesDesc"),
    },
    {
      icon: Flame,
      title: t("features.luxuryLifestyle"),
      description: t("features.luxuryLifestyleDesc"),
    },
    {
      icon: Compass,
      title: t("features.friendlyService"),
      description: t("features.friendlyServiceDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("features.lifeguard"),
      description: t("features.lifeguardDesc"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 bg-background pattern-dots"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 md:mb-28">
          <div className="md:col-span-4">
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="luxury-label text-amber block mb-4"
            >
              {t("features.label")}
            </motion.span>
          </div>
          <div className="md:col-span-8">
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-4xl md:text-6xl lg:text-7xl"
            >
              {t("features.title1")}
              <br />
              <span className="text-amber">{t("features.title2")}</span>
            </motion.h2>
          </div>
        </div>

        {/* Feature Cards — 2x2 Rounded Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={revealScale}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0.4 + index * 0.12}
                className="group glass-card card-warm p-8 md:p-10 cursor-pointer"
              >
                {/* Icon — Rounded Circle */}
                <div className="w-14 h-14 rounded-2xl bg-amber/10 border border-amber/15 flex items-center justify-center mb-6 group-hover:bg-amber/20 group-hover:border-amber/30 transition-all duration-400">
                  <Icon className="w-6 h-6 text-amber" />
                </div>

                {/* Title */}
                <h3 className="heading-editorial text-2xl md:text-3xl mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="body-editorial text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Amber Bottom Accent Line — Appears on Hover */}
                <div className="mt-6 h-0.5 rounded-full w-0 group-hover:w-full bg-gradient-to-r from-amber to-amber-light transition-all duration-700 ease-out" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 3. SUITES SECTION — Horizontal Scroll Carousel
// ============================================
function SuitesSection({ suites }: { suites: Suite[] }) {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="luxury-label text-amber block mb-4"
            >
              {t("suites.label")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-4xl md:text-6xl lg:text-7xl"
            >
              {t("suites.title")}
            </motion.h2>
          </div>
          <motion.p
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.4}
            className="body-editorial text-muted-foreground max-w-sm text-sm"
          >
            {t("suites.subtitle")}
          </motion.p>
        </div>

        {/* Horizontal Scroll Suite Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 md:gap-6 overflow-x-auto pb-6 -mx-6 px-6 md:-mx-10 md:px-10 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suites.slice(0, 3).map((suite, index) => {
            const isHovered = hoveredIndex === index;
            const features = suite.features ? suite.features.split(",") : [];

            return (
              <motion.div
                key={suite.id}
                variants={revealScale}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0.5 + index * 0.2}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative cursor-pointer snap-start shrink-0 w-[85vw] md:w-[400px] lg:w-[440px]"
              >
                <Link href={withLocale(language, `/les-tentes/${suite.slug}`)}>
                  {/* Image Container — Tall with rounded-2xl corners */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                    <img
                      src={suite.image}
                      alt={suite.name}
                      className="img-luxury w-full h-full object-cover group-hover:scale-110"
                    />
                    {/* Gradient Overlay at Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    {/* Amber subtle glow at top-right */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />

                    {/* Card Content — Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                      {/* Size + Guests Label */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="luxury-label text-amber text-[9px]">
                          {suite.size}
                        </span>
                        <div className="w-4 h-px bg-amber/30" />
                        <span className="luxury-label text-amber text-[9px]">
                          {t("suites.upTo")} {suite.maxGuests}
                        </span>
                      </div>

                      {/* Suite Name */}
                      <h3 className="heading-editorial text-3xl md:text-4xl text-foreground mb-2">
                        {suite.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                        {suite.tagline}
                      </p>

                      {/* Hover Content — Expand Up */}
                      <div
                        className={`transition-all duration-500 ease-out overflow-hidden ${isHovered
                          ? "max-h-56 opacity-100 mt-4"
                          : "max-h-0 opacity-0 mt-0"
                          }`}
                      >
                        <p className="text-xs text-muted-foreground/70 mb-4 line-clamp-2">
                          {suite.description}
                        </p>
                        {/* Feature Pills — Rounded */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {features.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="text-[9px] tracking-[0.15em] uppercase text-amber/60 bg-amber/[0.08] border border-amber/15 px-3 py-1 rounded-full"
                            >
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="mono-number text-2xl text-amber">
                              {suite.price}€
                            </span>
                            <span className="text-muted-foreground text-xs ml-1.5">
                              {t("suites.perNight")}
                            </span>
                          </div>
                          <span className="flex items-center gap-2 text-amber text-xs group/link cursor-pointer">
                            {t("suites.viewTent")}
                            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll Hint */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={1}
          className="flex items-center gap-3 mt-6 text-muted-foreground"
        >
          <div className="w-8 h-px bg-amber/30" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 4. GALLERY SECTION — Masonry/Bento + Rounded Corners
// ============================================

const BENTO_SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
];

function GallerySection({ galleryImages: rawGallery }: { galleryImages: { url: string; alt: string; altEn: string; altEs?: string; altIt?: string }[] }) {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const galleryImages = rawGallery.map((img, i) => ({
    url: img.url,
    alt: img.alt || img.altEn || "",
    altEn: img.altEn || img.alt || "",
    altEs: img.altEs || img.alt || "",
    altIt: img.altIt || img.alt || "",
    span: BENTO_SPANS[i % BENTO_SPANS.length],
  }));

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 pattern-organic"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="luxury-label text-amber block mb-4"
            >
              {t("gallery.label")}
            </motion.span>
            <motion.h2
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-display text-4xl md:text-6xl lg:text-7xl"
            >
              {t("gallery.title1")}
              <br />
              <span className="text-amber">{t("gallery.title2")}</span>
            </motion.h2>
          </div>

          {/* Decorative Number */}
          <motion.span
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.4}
            className="font-serif text-8xl md:text-9xl text-amber/[0.04] select-none"
          >
            03
          </motion.span>
        </div>

        {/* Masonry/Bento Grid — All Rounded Corners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.url}
              variants={revealScale}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.5 + index * 0.15}
              className={`group relative overflow-hidden cursor-pointer rounded-2xl ${image.span}`}
            >
              <img
                src={image.url}
                alt={pickLocalized(language, image.alt, image.altEn, image.altEs, image.altIt)}
                className="img-luxury w-full h-full object-cover group-hover:scale-110"
              />
              {/* Amber Overlay on Hover */}
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/15 transition-all duration-500 rounded-2xl" />
              {/* Rounded Frame Border on Hover */}
              <div className="absolute inset-3 border border-amber/0 group-hover:border-amber/40 rounded-xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. PACKAGES SECTION — Rounded Pricing Cards
// ============================================
function PackagesSection() {
  const { t, tArray, language } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const packages = [
    {
      name: t("packages.honeymoon.name"),
      price: 249,
      description: t("packages.honeymoon.description"),
      features: tArray("packages.honeymoon.features"),
      highlighted: true,
    },
    {
      name: t("packages.suiteRoom.name"),
      price: 209,
      description: t("packages.suiteRoom.description"),
      features: tArray("packages.suiteRoom.features"),
      highlighted: false,
    },
    {
      name: t("packages.deluxe.name"),
      price: 149,
      description: t("packages.deluxe.description"),
      features: tArray("packages.deluxe.features"),
      highlighted: false,
    },
    {
      name: t("packages.superior.name"),
      price: 109,
      description: t("packages.superior.description"),
      features: tArray("packages.superior.features"),
      highlighted: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="luxury-label text-amber block mb-4"
          >
            {t("packages.label")}
          </motion.span>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-4xl md:text-6xl lg:text-7xl"
          >
            {t("packages.title")}
          </motion.h2>
        </div>

        {/* Pricing Cards — Rounded 2xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={revealScale}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.3 + index * 0.12}
              className={`group relative flex flex-col p-8 md:p-10 rounded-2xl transition-all duration-400 ${pkg.highlighted
                ? "border-2 border-amber bg-amber/[0.04] shadow-lg shadow-amber/[0.05]"
                : "glass-card card-warm"
                }`}
            >
              {/* Popular Badge — Rounded Pill */}
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber to-amber-dark text-warm-black luxury-label text-[9px] px-5 py-1.5 rounded-full block shadow-md shadow-amber/20">
                    {t("packages.popular")}
                  </span>
                </div>
              )}

              {/* Package Name */}
              <h3 className="heading-editorial text-lg md:text-xl mb-2">
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="body-editorial text-xs text-muted-foreground mb-8 leading-relaxed">
                {pkg.description}
              </p>

              {/* Price — Mono Number */}
              <div className="mb-8">
                <span className="mono-number text-5xl md:text-6xl text-amber">
                  {pkg.price}€
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  {t("packages.perNight")}
                </span>
              </div>

              {/* Divider — Amber gradient */}
              <div className="h-px w-full bg-amber/15 mb-8" />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Star className="w-3 h-3 text-amber mt-1 shrink-0 fill-amber" />
                    <span className="text-xs">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button — Rounded Pill */}
              <Link href={withLocale(language, "/reservez-votre-sejour")} className="block">
                {pkg.highlighted ? (
                  <span className="btn-primary block text-center cursor-pointer w-full py-4">
                    {t("packages.book")}
                  </span>
                ) : (
                  <span className="btn-outline block text-center cursor-pointer w-full py-4">
                    {t("packages.book")}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 6. TESTIMONIALS SECTION — Full-Width Quote Slider
// ============================================

function ReviewSourceBadge({ source }: { source: string }) {
  if (source === "google") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </span>
    );
  }
  if (source === "tripadvisor") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#34E0A1" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-2.5 0-4.71-1.28-6-3.22.78.47 1.71.72 2.71.72 1.24 0 2.37-.45 3.26-1.18A4.254 4.254 0 0 0 15.29 16.5c1 0 1.93-.25 2.71-.72C16.71 17.72 14.5 19 12 19z"/>
        </svg>
        TripAdvisor
      </span>
    );
  }
  if (source === "booking") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#003580"/>
          <text x="4" y="18" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#fff">B.</text>
        </svg>
        Booking.com
      </span>
    );
  }
  if (source === "airbnb") {
    return (
      <span className="inline-flex items-center gap-1.5 border border-border/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#FF5A5F" aria-hidden="true">
          <path d="M12 2.163c-5.48 0-9.837 4.358-9.837 9.837 0 5.48 4.358 9.837 9.837 9.837 5.48 0 9.837-4.358 9.837-9.837 0-5.48-4.358-9.837-9.837-9.837zm0 17.674c-4.325 0-7.837-3.512-7.837-7.837 0-4.325 3.512-7.837 7.837-7.837 4.325 0 7.837 3.512 7.837 7.837 0 4.325-3.512 7.837-7.837 7.837zm0-13.5c-1.006 0-1.946.332-2.7.89L12 10.5l2.7-3.273A4.49 4.49 0 0 0 12 6.337zm0 9c-2.485 0-4.5-2.015-4.5-4.5 0-.74.18-1.438.497-2.053L12 13.5l4.003-4.716A4.478 4.478 0 0 1 16.5 10.837c0 2.485-2.015 4.5-4.5 4.5z"/>
        </svg>
        Airbnb
      </span>
    );
  }
  // general / default
  return (
    <span className="inline-flex items-center gap-1.5 border border-amber/20 rounded-full px-3 py-1 text-xs text-amber/60">
      <Star className="w-3 h-3 fill-amber text-amber" />
      Séjour vérifié
    </span>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-organic opacity-50" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Section Label */}
        <motion.span
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="luxury-label text-amber block mb-8"
        >
          {t("testimonials.label")}
        </motion.span>

        <motion.h2
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.2}
          className="heading-display text-4xl md:text-5xl mb-20"
        >
          {t("testimonials.title1")}
          <br />
          <span className="text-amber">{t("testimonials.title2")}</span>
        </motion.h2>

        {/* Testimonial Content — Glass Card */}
        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait">
            {testimonials.map((testimonial, i) =>
              i === active ? (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.7, ease: smoothEase }}
                  className="glass-card p-8 md:p-12 rounded-3xl"
                >
                  {/* Amber Quote Mark */}
                  <div className="text-amber/20 mb-6 flex justify-center">
                    <Quote className="w-10 h-10" />
                  </div>

                  {/* Quote Text — Large Serif */}
                  <p className="heading-editorial text-xl md:text-2xl lg:text-[1.75rem] leading-relaxed text-balance mb-10 italic text-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Rating Stars — Amber */}
                  <div className="flex justify-center gap-1.5 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber text-amber"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <p className="heading-editorial text-lg text-foreground">{testimonial.author}</p>
                  <p className="luxury-label text-muted-foreground mt-1.5 text-[9px]">
                    {testimonial.location}
                  </p>
                  {/* Source badge */}
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <ReviewSourceBadge source={testimonial.source} />
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Dots — Amber Pill Shapes */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 ${i === active
                ? "bg-amber w-8"
                : "bg-amber/20 w-2.5 hover:bg-amber/40"
                }`}
              aria-label={`${t("testimonials.goTo")} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG SECTION — Latest articles
// ============================================
interface BlogPostCard {
  id: string;
  title: string;
  titleEn: string;
  titleEs?: string;
  titleIt?: string;
  slug: string;
  excerpt: string;
  excerptEn: string;
  excerptEs?: string;
  excerptIt?: string;
  image: string;
  category: string;
}

function BlogSection({ posts }: { posts: BlogPostCard[] }) {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (!posts.length) return null;

  return (
    <section ref={ref} className="py-20 md:py-32 px-6 md:px-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 md:mb-20">
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="luxury-label text-amber/60 mb-4"
          >
            {t("blogSection.label")}
          </motion.p>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-display text-4xl md:text-6xl"
          >
            {t("blogSection.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.15 + i * 0.1}
            >
              <Link href={withLocale(language, `/blog/${post.slug}`)} className="group block cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                  {post.image ? (
                    <img
                      src={post.image.split(",")[0]}
                      alt={pickLocalized(language, post.title, post.titleEn, post.titleEs, post.titleIt)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-warm-black" />
                  )}
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-amber/90 text-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full luxury-label">
                      {post.category}
                    </span>
                  )}
                </div>
                <h3 className="heading-editorial text-xl md:text-2xl text-foreground group-hover:text-amber transition-colors duration-300 mb-3 line-clamp-2">
                  {pickLocalized(language, post.title, post.titleEn, post.titleEs, post.titleIt)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {pickLocalized(language, post.excerpt, post.excerptEn, post.excerptEs, post.excerptIt)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.5}
          className="mt-12 text-center"
        >
          <Link
            href={withLocale(language, "/blog")}
            className="inline-flex items-center gap-3 text-sm luxury-label text-amber hover:text-amber-dark transition-colors duration-300 cursor-pointer"
          >
            {t("blogSection.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOME PAGE — Main Export
// ============================================
interface HomePageProps {
  suites: Suite[];
  galleryImages: { url: string; alt: string; altEn: string }[];
  testimonials: Testimonial[];
  blogPosts?: BlogPostCard[];
}

export function HomePage({ suites, galleryImages, testimonials, blogPosts = [] }: HomePageProps) {
  const { t } = useLanguage();
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SuitesSection suites={suites} />
      <GallerySection galleryImages={galleryImages} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={blogPosts} />
      <CTASection
        label={t("cta.label")}
        title={
          <>
            {t("cta.title1")}
            <br />
            <span className="text-amber">{t("cta.title2")}</span>
          </>
        }
        description={t("cta.description")}
        buttonText={t("cta.bookYourStay")}
        buttonHref="/reservez-votre-sejour"
        secondaryButton={{ text: t("nav.contact"), href: "/contact" }}
        alignment="left"
      />
    </>
  );
}
