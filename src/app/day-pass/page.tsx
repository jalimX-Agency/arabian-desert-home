"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Clock,
  Baby,
  AlertCircle,
  Sun,
  Utensils,
  Music,
  Sparkles,
} from "lucide-react";

interface DayPass {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  includes: string;
  order: number;
}

export default function DayPassPage() {
  const [passes, setPasses] = useState<DayPass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/day-passes")
      .then((res) => res.json())
      .then((data) => {
        setPasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const passesRef = useRef(null);
  const passesInView = useInView(passesRef, { once: true, margin: "-80px" });

  const rulesRef = useRef(null);
  const rulesInView = useInView(rulesRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const passIcons = [Sun, Utensils, Music];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="/images/daypass-pool.png"
              alt="Piscine avec vue sur le désert"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Day Pass
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6"
            >
              Day Pass
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              Une journée au désert
            </motion.p>
          </div>
        </section>

        {/* Intro + Passes Section */}
        <section ref={passesRef} className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={passesInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2 }}
                className="h-px w-16 bg-terracotta/30 max-w-[120px] mx-auto mb-10"
              />
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={passesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                className="heading-editorial text-3xl md:text-5xl mb-4"
              >
                Choisissez votre <span className="italic">expérience</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={passesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-editorial text-muted-foreground max-w-2xl mx-auto"
              >
                Profitez de la piscine, savourez notre cuisine et laissez-vous
                porter par la magie du désert d&apos;Agafay, à seulement 30
                minutes de Marrakech.
              </motion.p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-96 bg-muted rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {passes.map((pass, i) => {
                  const Icon = passIcons[i] || Sun;
                  return (
                    <motion.div
                      key={pass.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={passesInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                      className="group bg-card border border-border/50 overflow-hidden hover:border-terracotta/30 transition-all duration-500 flex flex-col"
                    >
                      {/* Header with image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src="/images/daypass-pool.png"
                          alt={pass.name}
                          className="w-full h-full object-cover img-luxury"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-6 right-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5 text-terracotta" />
                            <span className="text-luxury-label text-white/80">
                              Day Pass
                            </span>
                          </div>
                          <h3 className="heading-editorial text-2xl text-white">
                            {pass.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-6">
                          {pass.description}
                        </p>

                        {/* Includes */}
                        <div className="mb-6 flex-1">
                          <span className="text-luxury-label text-terracotta block mb-3">
                            Inclus
                          </span>
                          <div className="space-y-2">
                            {pass.includes.split(",").map((item, j) => (
                              <div
                                key={j}
                                className="flex items-center gap-2 text-sm text-muted-foreground/70"
                              >
                                <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                                <span>{item.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="pt-4 border-t border-border/30">
                          <div className="flex items-baseline gap-2">
                            <span className="text-mono-number text-4xl text-terracotta">
                              {pass.price}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {pass.currency} / personne
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Rules Section */}
        <section
          ref={rulesRef}
          className="py-20 md:py-28 px-6 md:px-10 bg-obsidian/[0.03] dark:bg-obsidian/50 pattern-lines"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={rulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">02</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={rulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Informations Pratiques
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={rulesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-4xl mb-12"
            >
              Bon à <span className="italic">savoir</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={rulesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-card border border-border/50 p-6"
              >
                <Clock className="w-6 h-6 text-terracotta mb-4" />
                <h3 className="heading-editorial text-lg mb-2">Horaires</h3>
                <p className="text-sm text-muted-foreground">
                  Ouvert tous les jours de 11h à 16h
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={rulesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="bg-card border border-border/50 p-6"
              >
                <Baby className="w-6 h-6 text-terracotta mb-4" />
                <h3 className="heading-editorial text-lg mb-2">Enfants</h3>
                <p className="text-sm text-muted-foreground">
                  -50% sur toutes les offres pour les enfants
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={rulesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="bg-card border border-border/50 p-6"
              >
                <AlertCircle className="w-6 h-6 text-terracotta mb-4" />
                <h3 className="heading-editorial text-lg mb-2">Réservation</h3>
                <p className="text-sm text-muted-foreground">
                  Réservation 24h à l&apos;avance requise
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          ref={ctaRef}
          className="py-20 md:py-28 px-6 md:px-10 bg-obsidian dark:bg-obsidian text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-luxury-label text-terracotta/60 block mb-4"
          >
            Réservez Votre Journée
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-display text-3xl md:text-5xl text-white mb-8"
          >
            Échappez-vous au désert
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-terracotta/50 text-terracotta hover:bg-terracotta/10 hover:text-terracotta hover:border-terracotta rounded-none px-10 py-6 text-luxury-label tracking-[0.2em]"
              >
                Nous Contacter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
