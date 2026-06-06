"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Maximize2 } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";

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

export default function LesTentesPage() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/about.png')" }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          <div className="relative z-10 text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Arabian Desert Home
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-white mb-4"
            >
              Tentes de Luxe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-editorial text-white/70 text-lg md:text-xl max-w-xl mx-auto"
            >
              Une invitation à l&apos;évasion
            </motion.p>
          </div>
        </section>

        {/* Suites Section */}
        <section className="py-20 md:py-32 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Suites Group */}
                {suiteList.length > 0 && (
                  <div className="mb-24 md:mb-32">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8 }}
                      className="mb-12 md:mb-16"
                    >
                      <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none block mb-3">01</span>
                      <span className="text-luxury-label text-terracotta block mb-3">
                        Nos Suites
                      </span>
                      <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-4">
                        Suites <span className="italic">Prestige</span>
                      </h2>
                      <div className="divider-accent max-w-xs" />
                      <p className="text-editorial text-muted-foreground mt-6 max-w-2xl">
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

                {/* Chambres Group */}
                {chambres.length > 0 && (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8 }}
                      className="mb-12 md:mb-16"
                    >
                      <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none block mb-3">02</span>
                      <span className="text-luxury-label text-terracotta block mb-3">
                        Nos Chambres
                      </span>
                      <h2 className="heading-editorial text-3xl md:text-4xl lg:text-5xl mb-4">
                        Chambres <span className="italic">d&apos;Exception</span>
                      </h2>
                      <div className="divider-accent max-w-xs" />
                      <p className="text-editorial text-muted-foreground mt-6 max-w-2xl">
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

        {/* CTA Section */}
        <section className="py-20 md:py-28 px-6 md:px-10 bg-obsidian dark:bg-obsidian text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-luxury-label text-terracotta block mb-4">
              Votre Séjour
            </span>
            <h2 className="heading-editorial text-3xl md:text-4xl text-white mb-6">
              Le désert vous <span className="italic">appelle</span>
            </h2>
            <p className="text-editorial text-white/60 mb-10 max-w-xl mx-auto">
              Réservez votre tente de luxe et laissez-vous porter par la magie
              du désert d&apos;Agafay.
            </p>
            <Link
              href="/reservez-votre-sejour"
              className="inline-flex items-center gap-3 border border-terracotta/50 text-terracotta px-10 py-4 text-luxury-label tracking-[0.2em] hover:bg-terracotta/10 transition-all duration-300"
            >
              Réserver Maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SuiteCard({ suite }: { suite: Suite }) {
  const features = suite.features.split(",").map((f) => f.trim());
  const isChambre = suite.type === "chambre";
  const priceLabel = isChambre ? `${suite.price} MAD` : `${suite.price} €`;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className="group relative"
    >
      <Link href={`/${suite.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4]">
          <img
            src={suite.image}
            alt={suite.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Top Badge */}
          {suite.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-terracotta/90 text-obsidian px-3 py-1.5">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] tracking-widest uppercase font-medium">
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

            {/* Name & Tagline */}
            <h3 className="heading-editorial text-2xl md:text-3xl text-white mb-1.5">
              {suite.name}
            </h3>
            <p className="text-sm text-terracotta/80 mb-3 italic heading-editorial">
              {suite.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">
              {suite.description}
            </p>

            {/* Features as Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {features.map((f) => (
                <span
                  key={f}
                  className="text-[10px] tracking-widest uppercase text-white/50 border border-white/20 px-2.5 py-1"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-mono-number text-2xl text-terracotta">
                  {priceLabel}
                </span>
                <span className="text-white/40 text-sm ml-1">/ nuit</span>
              </div>
              <span className="flex items-center gap-2 text-terracotta text-sm group-hover:gap-3 transition-all duration-300">
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
