"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ArrowRight,
  Check,
  Bus,
  Calendar,
  Horse,
  Bike,
} from "lucide-react";

interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  includes: string;
  schedule: string;
  transportIncluded: boolean;
  order: number;
  featured: boolean;
}

export default function LesActivitesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const individualRef = useRef(null);
  const individualInView = useInView(individualRef, { once: true, margin: "-80px" });

  const experiencesRef = useRef(null);
  const experiencesInView = useInView(experiencesRef, { once: true, margin: "-80px" });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const individualActivities = activities.filter(
    (a) => a.category === "Activité"
  );
  const experienceActivities = activities.filter(
    (a) => a.category === "Expérience" || a.category === "Aventure"
  );

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
              src="/images/exp-camel.png"
              alt="Activités au désert d'Agafay"
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
              Expériences
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6"
            >
              Activités
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="heading-editorial italic text-xl md:text-2xl text-white/70"
            >
              Aventure et découverte au désert
            </motion.p>
          </div>
        </section>

        {/* Individual Activities Section */}
        <section
          ref={individualRef}
          className="py-20 md:py-28 px-6 md:px-10"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={individualInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">01</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={individualInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Activités Individuelles
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={individualInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-5xl mb-4"
            >
              À votre <span className="italic">rythme</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={individualInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-editorial text-muted-foreground max-w-2xl mb-16"
            >
              Choisissez votre aventure parmi nos activités individuelles. Chaque
              expérience est encadrée par des professionnels pour votre sécurité
              et votre plaisir.
            </motion.p>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-80 bg-muted rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {individualActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={individualInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
                    className="group bg-card border border-border/50 overflow-hidden hover:border-terracotta/30 transition-all duration-500"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1.5">
                        <span className="text-terracotta text-mono-number text-lg">
                          {activity.price} {activity.currency}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-terracotta" />
                        <span className="text-sm text-muted-foreground">
                          {activity.duration}
                        </span>
                      </div>
                      <h3 className="heading-editorial text-xl md:text-2xl mb-2 group-hover:text-terracotta transition-colors duration-300">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {activity.description}
                      </p>
                      <div className="space-y-2">
                        {activity.includes.split(",").map((item, j) => (
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-16 bg-terracotta/30 max-w-7xl mx-auto" />

        {/* Full Experiences Section */}
        <section
          ref={experiencesRef}
          className="py-20 md:py-28 px-6 md:px-10 bg-obsidian/[0.03] dark:bg-obsidian/50"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={experiencesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">02</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={experiencesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta block mb-4"
            >
              Expériences Complètes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={experiencesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-5xl mb-4"
            >
              Vivez le désert <span className="italic">en entier</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={experiencesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-editorial text-muted-foreground max-w-2xl mb-16"
            >
              Nos expériences complètes combinent activités, gastronomie et
              transport pour une journée inoubliable dans le désert d&apos;Agafay.
              Tout est organisé, il ne vous reste qu&apos;à profiter.
            </motion.p>

            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-64 bg-muted rounded-none"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {experienceActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={experiencesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                    className="group grid grid-cols-1 lg:grid-cols-12 gap-0 bg-card border border-border/50 overflow-hidden hover:border-terracotta/30 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-luxury-label text-white/80 bg-black/30 backdrop-blur-sm px-3 py-1.5">
                          {activity.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-4 h-4 text-terracotta" />
                        <span className="text-sm text-muted-foreground">
                          {activity.duration}
                        </span>
                        {activity.transportIncluded && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-4">
                            <Bus className="w-4 h-4 text-terracotta" />
                            <span>Transport inclus</span>
                          </div>
                        )}
                      </div>

                      <h3 className="heading-editorial text-2xl md:text-3xl mb-2 group-hover:text-terracotta transition-colors duration-300">
                        {activity.name}
                      </h3>

                      <div className="w-12 h-px bg-terracotta mb-4" />

                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
                        {activity.longDescription}
                      </p>

                      {/* Includes List */}
                      <div className="mb-6">
                        <span className="text-luxury-label text-terracotta block mb-3">
                          Inclus
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activity.includes.split(",").map((item, j) => (
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

                      {/* Schedule */}
                      {activity.schedule && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-4">
                          <Calendar className="w-3.5 h-3.5 text-terracotta shrink-0" />
                          <span>{activity.schedule}</span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-auto pt-4 border-t border-border/30">
                        <div className="flex items-baseline gap-2">
                          <span className="text-mono-number text-3xl text-terracotta">
                            {activity.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {activity.currency} / personne
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
            Réservez Votre Aventure
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-display text-3xl md:text-5xl text-white mb-8"
          >
            Prêt pour le désert ?
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
