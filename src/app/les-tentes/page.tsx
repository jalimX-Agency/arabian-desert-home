"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Maximize2 } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { useLanguage } from "@/lib/i18n/context";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export default function LesTentesPage() {
  const { t } = useLanguage();
  const [suites, setSuites] = useState<Suite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suites")
      .then((res) => res.json())
      .then((data) => {
        setSuites(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const chambres = suites.filter((s) => s.type === "chambre");
  const suiteList = suites.filter((s) => s.type === "suite");

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* ── Hero Section — Split-Screen Cinematic ── */}
        <section className="relative flex flex-col md:flex-row min-h-[55vh] md:min-h-[65vh] overflow-hidden">
          {/* ── Mobile: Image Banner ── */}
          <div className="relative w-full h-[30vh] md:hidden overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/about.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm-black/90" />
          </div>

          {/* ── Left Side: Editorial Content (55%) ── */}
          <div className="relative w-full md:w-[55%] bg-warm-black flex items-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
            {/* Grain Texture */}
            <div className="absolute inset-0 grain-overlay pointer-events-none" />

            {/* Decorative Blob */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-amber/[0.03] blob-1 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber/[0.02] blob-2 blur-3xl" />

            {/* Content — Vertically Centered */}
            <div className="relative z-10 max-w-lg">
              {/* Decorative Number */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4"
              >
                01
              </motion.span>

              {/* Luxury Label */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                className="luxury-label text-amber block mb-5"
              >
                Arabian Desert Home
              </motion.span>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
                className="heading-display text-4xl md:text-5xl lg:text-7xl text-white mb-5"
              >
                Tentes de{" "}
                <span className="italic text-amber">Luxe</span>
              </motion.h1>

              {/* Editorial Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: smoothEase }}
                className="body-editorial text-white/50 text-base md:text-lg max-w-md mb-8"
              >
                Une invitation à l&apos;évasion, où le raffinement du désert
                se révèle dans chaque détail de votre séjour.
              </motion.p>

              {/* Animated Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: smoothEase }}
                className="divider-accent max-w-[120px] origin-left"
              />
            </div>
          </div>

          {/* ── Right Side: Full-Bleed Image (45%) ── */}
          <div className="hidden md:block relative w-[45%] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/about.png')" }}
            />
            {/* Very minimal warm tone overlay */}
            <div className="absolute inset-0 gradient-amber opacity-30" />

            {/* Diagonal Clip Edge — Left side of image */}
            <div
              className="absolute inset-y-0 left-0 w-16"
              style={{
                background:
                  "linear-gradient(to right, var(--warm-black), transparent)",
              }}
            />
          </div>
        </section>

        {/* ── Suites & Chambres Section ── */}
        <section className="py-20 md:py-32 px-6 md:px-10 relative">
          {/* Pattern Background */}
          <div className="absolute inset-0 pattern-dots pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* ── Suites Group ── */}
                {suiteList.length > 0 && (
                  <div className="mb-24 md:mb-32">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="mb-12 md:mb-16"
                    >
                      <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-3">
                        01
                      </span>
                      <span className="luxury-label text-amber block mb-3">
                        Nos Suites
                      </span>
                      <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-4">
                        Suites <span className="italic text-amber">Prestige</span>
                      </h2>
                      <div className="divider-accent max-w-xs" />
                      <p className="body-editorial text-muted-foreground mt-6 max-w-2xl">
                        Des espaces d&apos;exception où le luxe du désert se révèle
                        dans chaque détail. Tarifs en euros.
                      </p>
                    </motion.div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6"
                    >
                      {suiteList.map((suite) => (
                        <SuiteCard key={suite.id} suite={suite} />
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* ── Chambres Group ── */}
                {chambres.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="mb-12 md:mb-16"
                    >
                      <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-3">
                        02
                      </span>
                      <span className="luxury-label text-amber block mb-3">
                        Nos Chambres
                      </span>
                      <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-4">
                        Chambres <span className="italic text-amber">d&apos;Exception</span>
                      </h2>
                      <div className="divider-accent max-w-xs" />
                      <p className="body-editorial text-muted-foreground mt-6 max-w-2xl">
                        Un confort raffiné au cœur du désert, en pension complète.
                        Tarifs en dirhams marocains.
                      </p>
                    </motion.div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6"
                    >
                      {chambres.map((suite) => (
                        <SuiteCard key={suite.id} suite={suite} />
                      ))}
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── CTA Section ── */}
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
              Votre Séjour
            </span>
            <h2 className="heading-display text-3xl md:text-5xl text-foreground mb-6">
              Le désert vous <span className="italic text-amber">appelle</span>
            </h2>
            <p className="body-editorial text-foreground/40 mb-10 max-w-xl mx-auto">
              Réservez votre tente de luxe et laissez-vous porter par la magie
              du désert d&apos;Agafay.
            </p>
            <Link
              href="/reservez-votre-sejour"
              className="btn-primary inline-flex items-center gap-3 cursor-pointer"
            >
              Réserver Maintenant
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

/* ── Suite Card Component ── */
function SuiteCard({ suite }: { suite: Suite }) {
  const features = suite.features.split(",").map((f) => f.trim());
  const isChambre = suite.type === "chambre";
  const priceLabel = isChambre ? `${suite.price} MAD` : `${suite.price} €`;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
    >
      <Link href={`/${suite.slug}`} className="block cursor-pointer">
        {/* Image Container — Rounded with warm gradient overlay */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4]">
          <img
            src={suite.image}
            alt={suite.name}
            className="w-full h-full object-cover transition-transform duration-[1.2s] cubic-bezier(0.25,0.46,0.45,0.94) group-hover:scale-105"
          />
          {/* Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Amber Subtle Glow Top-Right */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber/[0.06] rounded-full blur-3xl" />

          {/* Featured Badge */}
          {suite.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber/90 text-warm-black rounded-full px-3 py-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] tracking-widest uppercase font-semibold">
                Prestige
              </span>
            </div>
          )}

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {/* Quick Info */}
            <div className="flex items-center gap-4 mb-3 text-white/50 text-xs">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {suite.maxGuests} pers.
              </span>
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                {suite.size}
              </span>
            </div>

            {/* Name */}
            <h3 className="heading-display text-2xl md:text-3xl text-white mb-1.5">
              {suite.name}
            </h3>
            {/* Tagline */}
            <p className="text-sm text-amber/80 mb-3 italic heading-editorial">
              {suite.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-white/50 mb-4 line-clamp-2 leading-relaxed body-editorial">
              {suite.description}
            </p>

            {/* Feature Tags — Rounded-full pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {features.map((f) => (
                <span
                  key={f}
                  className="text-[10px] tracking-widest uppercase text-amber/70 bg-amber/[0.08] border border-amber/15 rounded-full px-3 py-1"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div>
                <span className="mono-number text-2xl text-amber">
                  {priceLabel}
                </span>
                <span className="text-white/30 text-sm ml-1">/ nuit</span>
              </div>
              <span className="flex items-center gap-2 text-amber text-sm group-hover:gap-3 transition-all duration-400 cursor-pointer">
                Voir la suite
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
