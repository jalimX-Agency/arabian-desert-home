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
import { useLanguage } from "@/lib/i18n/context";

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
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src="/images/hero.png"
          alt="Arabian Desert Home — Luxury retreat at golden hour in the Agafay Desert"
          className="w-full h-full object-cover scale-110"
        />
        {/* Warm Cinematic Gradients — NOT cold/dark blue */}
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/25 to-transparent" />
        <div className="absolute inset-0 gradient-amber" />
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
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-10 max-w-7xl mx-auto"
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
          className="heading-display text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem] max-w-5xl text-balance"
        >
          {t("hero.heading1")}
          <br />
          <span className="text-amber">{t("hero.heading2")}</span>
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
          <Link href="/reservez-votre-sejour">
            <span className="btn-primary inline-block cursor-pointer hover:no-underline">
              {t("hero.reserve")}
            </span>
          </Link>
          <Link
            href="/les-tentes"
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
function SuitesSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [suites, setSuites] = useState<Suite[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fallbackSuites: Suite[] = [
    {
      id: "1",
      name: t("suiteData.chorfa.name"),
      slug: "suite-chorfa",
      tagline: t("suiteData.chorfa.tagline"),
      description: t("suiteData.chorfa.description"),
      longDescription: "",
      price: 300,
      currency: "EUR",
      features: t("suiteData.chorfa.features"),
      amenities: "",
      image: "/images/suite-royal.png",
      images: "",
      maxGuests: 2,
      bedType: "1 très grand lit double",
      size: "45m²",
      hasAC: true,
      order: 1,
      featured: true,
      type: "suite",
    },
    {
      id: "2",
      name: t("suiteData.junior.name"),
      slug: "suite-junior",
      tagline: t("suiteData.junior.tagline"),
      description: t("suiteData.junior.description"),
      longDescription: "",
      price: 300,
      currency: "EUR",
      features: t("suiteData.junior.features"),
      amenities: "",
      image: "/images/suite-sultan.png",
      images: "",
      maxGuests: 2,
      bedType: "1 très grand lit double",
      size: "40m²",
      hasAC: true,
      order: 2,
      featured: true,
      type: "suite",
    },
    {
      id: "3",
      name: t("suiteData.familiale.name"),
      slug: "suite-familiale",
      tagline: t("suiteData.familiale.tagline"),
      description: t("suiteData.familiale.description"),
      longDescription: "",
      price: 300,
      currency: "EUR",
      features: t("suiteData.familiale.features"),
      amenities: "",
      image: "/images/suite-oasis.png",
      images: "",
      maxGuests: 4,
      bedType: "1 très grand lit double + 1 lit simple",
      size: "55m²",
      hasAC: true,
      order: 3,
      featured: true,
      type: "suite",
    },
  ];

  useEffect(() => {
    fetch("/api/suites?featured=true")
      .then((res) => res.json())
      .then((data) => {
        const featured = data.filter((s: Suite) => s.featured);
        setSuites(featured.length > 0 ? featured : fallbackSuites);
      })
      .catch(() => {
        setSuites(fallbackSuites);
      });
  }, []);

  const displaySuites = suites.length > 0 ? suites : fallbackSuites;

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
          {displaySuites.slice(0, 3).map((suite, index) => {
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
                <Link href={`/les-tentes/${suite.slug}`}>
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
                        className={`transition-all duration-500 ease-out overflow-hidden ${
                          isHovered
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
function GallerySection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const galleryImages = [
    {
      src: "/images/about.png",
      alt: "Aerial view of Arabian Desert Home camp in Agafay Desert",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      src: "/images/dining.png",
      alt: "Fine dining under the stars in Agafay desert",
      span: "",
    },
    {
      src: "/images/night.png",
      alt: "Magical night ambiance at the luxury camp",
      span: "",
    },
    {
      src: "/images/exp-camel.png",
      alt: "Camel ride at sunset",
      span: "md:col-span-2",
    },
  ];

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
              key={image.src}
              variants={revealScale}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.5 + index * 0.15}
              className={`group relative overflow-hidden cursor-pointer rounded-2xl ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
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
  const { t, tArray } = useLanguage();
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
              className={`group relative flex flex-col p-8 md:p-10 rounded-2xl transition-all duration-400 ${
                pkg.highlighted
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
              <Link href="/reservez-votre-sejour" className="block">
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
function TestimonialsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  const fallbackTestimonials: Testimonial[] = [
    {
      id: "1",
      quote: t("testimonials.testimonial1.quote"),
      author: t("testimonials.testimonial1.author"),
      location: t("testimonials.testimonial1.location"),
      rating: 5,
      source: "general",
      order: 1,
    },
    {
      id: "2",
      quote: t("testimonials.testimonial2.quote"),
      author: t("testimonials.testimonial2.author"),
      location: t("testimonials.testimonial2.location"),
      rating: 5,
      source: "general",
      order: 2,
    },
    {
      id: "3",
      quote: t("testimonials.testimonial3.quote"),
      author: t("testimonials.testimonial3.author"),
      location: t("testimonials.testimonial3.location"),
      rating: 5,
      source: "general",
      order: 3,
    },
  ];

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.length > 0 ? data : fallbackTestimonials);
      })
      .catch(() => {
        setTestimonials(fallbackTestimonials);
      });
  }, []);

  useEffect(() => {
    const count = testimonials.length || 3;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;

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
            {displayTestimonials.map((testimonial, i) =>
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
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Dots — Amber Pill Shapes */}
        <div className="flex justify-center gap-2 mt-10">
          {displayTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 ${
                i === active
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
// 7. CTA SECTION — Full-Bleed Cinematic + Grain
// ============================================
function CTASection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden"
    >
      {/* Background Image with Warm Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/night.png"
          alt="Magical night at Agafay Desert"
          className="w-full h-full object-cover"
        />
        {/* Warm Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/20" />
        <div className="absolute inset-0 gradient-amber" />
      </div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.span
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="luxury-label text-amber block mb-6"
        >
          {t("cta.label")}
        </motion.span>

        <motion.h2
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.2}
          className="heading-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-8"
        >
          {t("cta.title1")}
          <br />
          <span className="text-amber">{t("cta.title2")}</span>
        </motion.h2>

        {/* Amber Divider */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.4}
          className="divider-accent-wide w-24 mb-8"
        />

        <motion.p
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.5}
          className="body-editorial text-muted-foreground mb-12 max-w-lg"
        >
          {t("cta.description")}
        </motion.p>

        <motion.div
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.7}
          className="flex items-center gap-4"
        >
          <Link href="/reservez-votre-sejour">
            <span className="btn-primary inline-block cursor-pointer hover:no-underline">
              {t("cta.bookYourStay")}
            </span>
          </Link>
          <Link
            href="/contact"
            className="luxury-label text-amber/60 hover:text-amber transition-colors duration-400 cursor-pointer"
          >
            {t("nav.contact")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOME PAGE — Main Export
// ============================================
export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SuitesSection />
      <GallerySection />
      <PackagesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
