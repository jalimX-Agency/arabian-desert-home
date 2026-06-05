"use client";

import { useState, useEffect } from "react";
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
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!suite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Suite introuvable</h1>
          <p className="text-muted-foreground mb-8">
            La suite que vous recherchez n&apos;existe pas.
          </p>
          <Link
            href="/les-tentes"
            className="inline-flex items-center gap-2 text-gold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux tentes
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
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end overflow-hidden">
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${galleryImages[activeImageIndex] || suite.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Image Navigation */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all duration-300"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all duration-300"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeImageIndex
                      ? "bg-gold w-6"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Image ${idx + 1}`}
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
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Link
                href="/les-tentes"
                className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm mb-6 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Toutes les tentes
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="text-luxury-label text-gold block mb-3">
                {isChambre ? "Chambre" : "Suite"}
              </span>
              <h1 className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-white mb-3">
                {suite.name}
              </h1>
              <p className="font-serif text-xl md:text-2xl text-gold/80 italic mb-4">
                {suite.tagline}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold/60" />
                  {suite.maxGuests} personnes
                </span>
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-gold/60" />
                  {suite.size}
                </span>
                <span className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-gold/60" />
                  {suite.bedType}
                </span>
                {suite.hasAC && (
                  <span className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gold/60" />
                    Climatisation
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16"
              >
                <span className="text-luxury-label text-gold block mb-4">
                  À propos
                </span>
                <h2 className="heading-editorial text-2xl md:text-3xl mb-6">
                  Un refuge <span className="italic">d&apos;exception</span>
                </h2>
                <div className="divider-gold max-w-xs mb-8" />
                <p className="text-editorial text-muted-foreground leading-relaxed text-lg">
                  {suite.longDescription}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16"
              >
                <span className="text-luxury-label text-gold block mb-4">
                  Caractéristiques
                </span>
                <h2 className="heading-editorial text-2xl md:text-3xl mb-6">
                  Ce qui rend cette suite <span className="italic">unique</span>
                </h2>
                <div className="divider-gold max-w-xs mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex items-center gap-3 py-3 border-b border-border/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-editorial">{feature}</span>
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
                  transition={{ duration: 0.8 }}
                  className="mb-16"
                >
                  <span className="text-luxury-label text-gold block mb-4">
                    Galerie
                  </span>
                  <h2 className="heading-editorial text-2xl md:text-3xl mb-6">
                    En <span className="italic">images</span>
                  </h2>
                  <div className="divider-gold max-w-xs mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className={`relative overflow-hidden ${
                          idx === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${suite.name} — Image ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all duration-300" />
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
                transition={{ duration: 0.8 }}
                className="sticky top-28"
              >
                {/* Price Card */}
                <div className="border border-border/50 p-8 mb-6">
                  <div className="mb-6">
                    <span className="text-luxury-label text-gold block mb-2">
                      Tarif
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl text-gold">
                        {priceLabel}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        / nuit
                      </span>
                    </div>
                    {isChambre && (
                      <p className="text-xs text-muted-foreground mt-2">
                        En pension complète
                      </p>
                    )}
                  </div>

                  <div className="divider-gold mb-6" />

                  {/* Quick Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gold/60" />
                      <span className="text-sm">
                        {suite.maxGuests} personne{suite.maxGuests > 1 ? "s" : ""} max
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Maximize2 className="w-4 h-4 text-gold/60" />
                      <span className="text-sm">{suite.size}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BedDouble className="w-4 h-4 text-gold/60" />
                      <span className="text-sm">{suite.bedType}</span>
                    </div>
                    {suite.hasAC && (
                      <div className="flex items-center gap-3">
                        <Wind className="w-4 h-4 text-gold/60" />
                        <span className="text-sm">Climatisation</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/reservez-votre-sejour"
                    className="block w-full bg-gold text-charcoal hover:bg-gold-light transition-colors duration-300 py-4 text-center text-luxury-label"
                  >
                    Réserver cette suite
                  </Link>
                </div>

                {/* Amenities Card */}
                <div className="border border-border/50 p-8">
                  <span className="text-luxury-label text-gold block mb-4">
                    Équipements
                  </span>
                  <div className="space-y-3">
                    {amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-sm text-muted-foreground">
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
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm transition-colors duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voir toutes les tentes
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-charcoal dark:bg-charcoal text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-luxury-label text-gold block mb-4">
            Réservez
          </span>
          <h2 className="heading-editorial text-3xl md:text-4xl text-white mb-4">
            {suite.name}
          </h2>
          <p className="font-serif text-lg text-gold/70 italic mb-6">
            {suite.tagline}
          </p>
          <p className="text-editorial text-white/60 mb-10 max-w-xl mx-auto">
            À partir de {priceLabel} par nuit. Réservez dès maintenant et
            préparez-vous à vivre une expérience inoubliable au cœur du
            désert d&apos;Agafay.
          </p>
          <Link
            href="/reservez-votre-sejour"
            className="inline-flex items-center gap-3 bg-gold text-charcoal hover:bg-gold-light px-10 py-4 text-luxury-label transition-colors duration-300"
          >
            Réserver cette suite
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
