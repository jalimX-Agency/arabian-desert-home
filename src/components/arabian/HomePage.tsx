"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  ChevronDown,
  Quote,
  Compass,
  Gem,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
// Animation Variants — Saharan Minimalism
// ============================================
const revealUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const revealScale = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
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
// 1. HERO SECTION — Cinematic Split + Parallax
// ============================================
function HeroSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src="/images/hero.png"
          alt="Arabian Desert Home — Luxury retreat at golden hour in the Agafay Desert"
          className="w-full h-full object-cover scale-110"
        />
        {/* Dark Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
      </motion.div>

      {/* Content — Asymmetric Left-Aligned */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-10 max-w-7xl mx-auto"
      >
        {/* Geometric Accent — Large Number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute top-32 right-8 md:right-10 font-serif text-[180px] md:text-[280px] leading-none text-terracotta/5 select-none pointer-events-none"
        >
          01
        </motion.div>

        {/* Location Tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="w-12 h-px bg-terracotta" />
          <span className="text-luxury-label text-terracotta/70">
            {t("hero.location")}
          </span>
        </motion.div>

        {/* Main Heading — Architectural Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="heading-display text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] max-w-5xl text-balance"
        >
          {t("hero.heading1")}
          <br />
          <span className="text-terracotta">{t("hero.heading2")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-editorial text-muted-foreground text-base md:text-lg max-w-lg mt-8"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-10 flex items-center gap-6"
        >
          <Link href="/reservez-votre-sejour">
            <Button className="bg-terracotta text-white hover:bg-terracotta-light rounded-none px-10 py-6 text-luxury-label tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_40px_oklch(0.62_0.08_30/20%)]">
              {t("hero.reserve")}
            </Button>
          </Link>
          <Link
            href="/les-tentes"
            className="hidden md:flex items-center gap-3 text-luxury-label text-terracotta/60 hover:text-terracotta transition-colors duration-500 group"
          >
            {t("suites.title")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — Minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-luxury-label text-muted-foreground/50 text-[9px]">
          {t("hero.discover")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-terracotta/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ============================================
// 2. FEATURES SECTION — Geometric Grid
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
      number: "01",
    },
    {
      icon: Flame,
      title: t("features.luxuryLifestyle"),
      description: t("features.luxuryLifestyleDesc"),
      number: "02",
    },
    {
      icon: Compass,
      title: t("features.friendlyService"),
      description: t("features.friendlyServiceDesc"),
      number: "03",
    },
    {
      icon: ShieldCheck,
      title: t("features.lifeguard"),
      description: t("features.lifeguardDesc"),
      number: "04",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 bg-background pattern-dots"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header — Asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 md:mb-28">
          <div className="md:col-span-4">
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="text-luxury-label text-terracotta block mb-4"
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
              <span className="text-terracotta">{t("features.title2")}</span>
            </motion.h2>
          </div>
        </div>

        {/* Feature Cards — Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terracotta/10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={revealScale}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0.4 + index * 0.15}
                className="group relative p-10 md:p-14 bg-background transition-all duration-700 hover:bg-terracotta/[0.03]"
              >
                {/* Number Accent */}
                <span className="absolute top-6 right-8 font-serif text-6xl text-terracotta/[0.06] group-hover:text-terracotta/10 transition-colors duration-700">
                  {feature.number}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 mb-8 border border-terracotta/20 flex items-center justify-center group-hover:border-terracotta/50 group-hover:bg-terracotta/5 transition-all duration-500">
                  <Icon className="w-5 h-5 text-terracotta" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-3xl mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-editorial text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom Line Accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-terracotta/30 transition-all duration-700" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 3. SUITES SECTION — Horizontal Scroll + Cinematic Cards
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
        {/* Section Header — Two Column */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
          <div>
            <motion.span
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="text-luxury-label text-terracotta block mb-4"
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
            className="text-editorial text-muted-foreground max-w-sm text-sm"
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
            const features = suite.features.split(",");

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
                  {/* Image Container — Tall Cinematic Ratio */}
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={suite.image}
                      alt={suite.name}
                      className="w-full h-full object-cover transition-transform duration-[1.4s] cubic-bezier(0.16,1,0.3,1) group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                    {/* Diagonal Top-Right Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20">
                      <div className="absolute top-0 right-0 w-full h-full bg-terracotta/10 clip-path-triangle"
                        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
                      />
                    </div>

                    {/* Card Content — Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                      {/* Size + Guests Label */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-luxury-label text-terracotta text-[9px]">
                          {suite.size}
                        </span>
                        <div className="w-4 h-px bg-terracotta/30" />
                        <span className="text-luxury-label text-terracotta text-[9px]">
                          {t("suites.upTo")} {suite.maxGuests}
                        </span>
                      </div>

                      {/* Suite Name */}
                      <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                        {suite.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                        {suite.tagline}
                      </p>

                      {/* Hover Content — Expand Up */}
                      <div
                        className={`transition-all duration-700 overflow-hidden ${
                          isHovered
                            ? "max-h-48 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground/70 mb-4 line-clamp-2">
                          {suite.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {features.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="text-[9px] tracking-[0.15em] uppercase text-terracotta/50 border border-terracotta/15 px-2.5 py-1"
                            >
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-mono-number text-2xl text-terracotta">
                              {suite.price}€
                            </span>
                            <span className="text-muted-foreground text-xs ml-1.5">
                              {t("suites.perNight")}
                            </span>
                          </div>
                          <span className="flex items-center gap-2 text-terracotta text-xs group/link">
                            {t("suites.viewTent")}
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
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
          <div className="w-8 h-px bg-terracotta/30" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 4. GALLERY SECTION — Masonry + Geometric Pattern
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
      className="relative py-28 md:py-40 px-6 md:px-10 bg-obsidian-light/50 dark:bg-obsidian-light/30"
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
              className="text-luxury-label text-terracotta block mb-4"
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
              <span className="text-terracotta">{t("gallery.title2")}</span>
            </motion.h2>
          </div>

          {/* Decorative Number */}
          <motion.span
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.4}
            className="font-serif text-8xl md:text-9xl text-terracotta/5 select-none"
          >
            03
          </motion.span>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              variants={revealScale}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.5 + index * 0.15}
              className={`group relative overflow-hidden cursor-pointer ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-[1.4s] cubic-bezier(0.16,1,0.3,1) group-hover:scale-110"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/20 transition-all duration-700" />
              {/* Corner Frame on Hover */}
              <div className="absolute inset-3 border border-terracotta/0 group-hover:border-terracotta/40 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. PACKAGES SECTION — Architectural Cards
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
      className="relative py-28 md:py-40 px-6 md:px-10 pattern-lines"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <motion.span
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="text-luxury-label text-terracotta block mb-4"
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

        {/* Pricing Cards — Asymmetric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={revealScale}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.3 + index * 0.12}
              className={`group relative flex flex-col p-8 md:p-10 border transition-all duration-700 ${
                pkg.highlighted
                  ? "border-terracotta bg-terracotta/5"
                  : "border-border/30 bg-card hover:border-terracotta/30"
              }`}
            >
              {/* Popular Badge — Sharp */}
              {pkg.highlighted && (
                <div className="absolute -top-px -right-px">
                  <span className="bg-terracotta text-white text-luxury-label text-[9px] px-4 py-1.5 block">
                    {t("packages.popular")}
                  </span>
                </div>
              )}

              {/* Package Name */}
              <h3 className="font-serif text-lg md:text-xl mb-2">
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="text-editorial text-xs text-muted-foreground mb-8 leading-relaxed">
                {pkg.description}
              </p>

              {/* Price — Bold Mono Number */}
              <div className="mb-8">
                <span className="text-mono-number text-5xl md:text-6xl text-terracotta">
                  {pkg.price}€
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  {t("packages.perNight")}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-terracotta/15 mb-8" />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Star className="w-3 h-3 text-terracotta mt-1 shrink-0 fill-terracotta" />
                    <span className="text-xs">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button — Sharp Architectural */}
              <Link href="/reservez-votre-sejour" className="block">
                <Button
                  className={`w-full rounded-none py-5 text-luxury-label tracking-[0.15em] transition-all duration-500 ${
                    pkg.highlighted
                      ? "bg-terracotta text-white hover:bg-terracotta-light hover:shadow-[0_0_30px_oklch(0.62_0.08_30/15%)]"
                      : "bg-transparent border border-terracotta/30 text-terracotta hover:bg-terracotta/10 hover:border-terracotta"
                  }`}
                >
                  {t("packages.book")}
                </Button>
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
    const timer = setInterval(() => {
      setActive((prev) => prev % (testimonials.length || 3) === (testimonials.length || 3) - 1 ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 overflow-hidden bg-obsidian-light/50 dark:bg-obsidian-light/30"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Label */}
        <motion.span
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-luxury-label text-terracotta block mb-8"
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
          <span className="text-terracotta">{t("testimonials.title2")}</span>
        </motion.h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[320px]">
          {displayTestimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                y: i === active ? 0 : 30,
                scale: i === active ? 1 : 0.97,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 flex flex-col items-center ${
                i !== active ? "pointer-events-none" : ""
              }`}
            >
              {/* Terracotta Quote Mark */}
              <div className="text-terracotta/20 mb-8">
                <Quote className="w-10 h-10" />
              </div>

              {/* Quote Text — Large Serif */}
              <p className="font-serif text-xl md:text-2xl lg:text-[1.75rem] leading-relaxed text-balance mb-10 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3 h-3 fill-terracotta text-terracotta"
                  />
                ))}
              </div>

              {/* Author */}
              <p className="font-serif text-lg">{testimonial.author}</p>
              <p className="text-luxury-label text-muted-foreground mt-1.5 text-[9px]">
                {testimonial.location}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots — Terracotta */}
        <div className="flex justify-center gap-2 mt-10">
          {displayTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-px transition-all duration-700 ${
                i === active
                  ? "bg-terracotta w-12"
                  : "bg-border w-6 hover:bg-muted-foreground"
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
// 7. CTA SECTION — Full-Bleed Cinematic
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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/night.png"
          alt="Magical night at Agafay Desert"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.span
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-luxury-label text-terracotta block mb-6"
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
          <span className="text-terracotta">{t("cta.title2")}</span>
        </motion.h2>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.4}
          className="h-px w-24 bg-terracotta/50 mb-8"
        />

        <motion.p
          variants={revealUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.5}
          className="text-editorial text-muted-foreground mb-12 max-w-lg"
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
            <Button className="bg-terracotta text-white hover:bg-terracotta-light rounded-none px-12 py-7 text-luxury-label tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_40px_oklch(0.62_0.08_30/20%)]">
              {t("cta.bookYourStay")}
            </Button>
          </Link>
          <Link
            href="/contact"
            className="text-luxury-label text-terracotta/60 hover:text-terracotta transition-colors duration-500"
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
