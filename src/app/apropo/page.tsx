"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "6", label: "Hectares" },
  { value: "10", label: "Tentes-Suites" },
  { value: "30 min", label: "de Marrakech" },
];

export default function ApropoPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const galleryRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/about.png"
              alt="Arabian Desert Home — Notre histoire"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10 max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold/80 mb-4"
            >
              Notre Histoire
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              À Propos
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="divider-gold-wide mt-8 max-w-xs origin-left"
            />
          </div>
        </section>

        {/* Story Section */}
        <section ref={storyRef} className="py-20 md:py-32 px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              Niché entre les dunes dorées du désert d&apos;Agafay et la vue imprenable sur les montagnes de l&apos;Atlas, notre hôtel offre une expérience unique et authentique à quelques kilomètres de Marrakech.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={storyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Notre établissement est bien plus qu&apos;un simple lieu de séjour – c&apos;est une immersion dans la culture marocaine, un havre de paix où luxe, nature, et tranquillité se rencontrent.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 md:py-28 px-6 md:px-10 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                  className="text-center"
                >
                  <div className="divider-gold-wide max-w-[60px] mx-auto mb-6" />
                  <p className="font-serif text-5xl md:text-6xl text-gold mb-3">
                    {stat.value}
                  </p>
                  <p className="text-luxury-label text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section ref={galleryRef} className="py-20 md:py-32 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={galleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold block text-center mb-4"
            >
              Galerie
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={galleryInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-4xl lg:text-5xl text-center mb-16"
            >
              Découvrez notre <span className="italic">univers</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={galleryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative h-80 md:h-[450px] overflow-hidden group"
              >
                <img
                  src="/images/night.png"
                  alt="Nuit au désert — Arabian Desert Home"
                  className="w-full h-full object-cover img-luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-luxury-label text-white/80">Sous les étoiles</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={galleryInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative h-80 md:h-[450px] overflow-hidden group"
              >
                <img
                  src="/images/dining.png"
                  alt="Restaurant — Arabian Desert Home"
                  className="w-full h-full object-cover img-luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-luxury-label text-white/80">Art de la table</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 md:py-28 px-6 md:px-10 bg-charcoal dark:bg-charcoal">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold/60 block mb-4"
            >
              Votre séjour
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl text-white mb-8"
            >
              Découvrez nos tentes-suites
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/les-tentes">
                <Button
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold rounded-none px-10 py-6 text-luxury-label"
                >
                  Explorer les tentes
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
