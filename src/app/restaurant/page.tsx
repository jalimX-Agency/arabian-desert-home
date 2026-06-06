"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Sparkles, Music } from "lucide-react";

interface DiningVenue {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  capacity: string | null;
  order: number;
}

export default function RestaurantPage() {
  const [venues, setVenues] = useState<DiningVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dining")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });

  const venuesRef = useRef(null);
  const venuesInView = useInView(venuesRef, { once: true, margin: "-80px" });

  const entertainmentRef = useRef(null);
  const entertainmentInView = useInView(entertainmentRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

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
              src="/images/restaurant-outdoor.png"
              alt="Restaurant en plein air au désert d'Agafay"
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
              Gastronomie
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6"
            >
              Restaurant
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              Laissez vos sens s&apos;évader
            </motion.p>
          </div>
        </section>

        {/* Intro Section */}
        <section ref={introRef} className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={introInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2 }}
              className="h-px w-16 bg-terracotta/30 max-w-[120px] mx-auto mb-10"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={introInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground"
            >
              Le chef propose une cuisine raffinée, élaborée à partir de produits
              frais et locaux. Chaque plat est une invitation au voyage, un
              hommage aux saveurs du Maroc et aux traditions culinaires berbères.
            </motion.p>
          </div>
        </section>

        {/* Venues Section */}
        <section
          ref={venuesRef}
          className="py-16 md:py-24 px-6 md:px-10 bg-obsidian/[0.03] dark:bg-obsidian/50"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={venuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">01</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={venuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Nos Espaces
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={venuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-5xl mb-16"
            >
              Trois lieux, <span className="italic">une même passion</span>
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse aspect-[4/3] bg-muted rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {venues.map((venue, i) => (
                  <motion.div
                    key={venue.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={venuesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                    className="group bg-card border border-border/50 overflow-hidden hover:border-terracotta/30 transition-all duration-500"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="heading-editorial text-xl md:text-2xl group-hover:text-terracotta transition-colors duration-300">
                          {venue.name}
                        </h3>
                        {venue.capacity && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-xs">{venue.capacity}</span>
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-px bg-terracotta mb-4" />
                      <p className="text-sm text-muted-foreground mb-3">
                        {venue.description}
                      </p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">
                        {venue.longDescription}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Evening Entertainment Section */}
        <section
          ref={entertainmentRef}
          className="py-20 md:py-28 px-6 md:px-10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={entertainmentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1 }}
              >
                <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none block mb-4">02</span>
                <span className="text-luxury-label text-terracotta block mb-4">
                  Animations
                </span>
                <h2 className="heading-editorial text-3xl md:text-4xl mb-6">
                  Des soirées <span className="italic">magiques</span>
                </h2>
                <div className="w-12 h-px bg-terracotta mb-8" />
                <p className="text-editorial text-muted-foreground mb-6">
                  Spectacles de danse orientale, jeux de lumières projetés sur
                  les dunes — chaque soirée au Arabian Desert Home est un
                  spectacle vivant, une célébration de la culture marocaine sous
                  les étoiles du désert.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 py-3 border-b border-border/30">
                    <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="heading-editorial text-base">
                        Danse orientale
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Spectacles envoûtants chaque soir
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-3 border-b border-border/30">
                    <Music className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="heading-editorial text-base">
                        Musique live
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Gnawa et musique traditionnelle au feu de camp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 py-3">
                    <Sparkles className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="heading-editorial text-base">
                        Jeux de lumières
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Projections magiques sur les dunes
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={entertainmentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/images/night.png"
                    alt="Soirée d'animation au désert"
                    className="w-full h-full object-cover img-luxury"
                  />
                </div>
                {/* Pricing Note */}
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-background/90 backdrop-blur-sm border border-terracotta/15 p-6 max-w-sm">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Le tarif pour les adultes varie entre{" "}
                    <span className="text-terracotta text-mono-number">200</span> et{" "}
                    <span className="text-terracotta text-mono-number">250 DH</span>,
                    selon le menu choisi.
                  </p>
                </div>
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
            Réservez Votre Table
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-display text-3xl md:text-5xl text-white mb-8"
          >
            Le désert vous attend
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/reservez-votre-sejour">
              <Button
                variant="outline"
                className="border-terracotta/50 text-terracotta hover:bg-terracotta/10 hover:text-terracotta hover:border-terracotta rounded-none px-10 py-6 text-luxury-label tracking-[0.2em]"
              >
                Réserver Maintenant
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
