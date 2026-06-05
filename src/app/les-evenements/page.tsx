"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Sparkles, Gem, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";

const eventTypes = [
  {
    icon: Heart,
    title: "Mariages au Désert",
    description:
      "Échangez vos vœux où la terre rencontre le ciel. Nos mariages au désert sont des rêves architecturaux — soieries drapées, lanternes en cascade, et un horizon qui s'étend à l'infini pour témoin.",
  },
  {
    icon: Sparkles,
    title: "Galas & Soirées",
    description:
      "Des soirées extraordinaires sous les étoiles du désert. Galas enchanteurs, dîners prestigieux et celebrations inoubliables dans un cadre naturel époustouflant.",
  },
  {
    icon: Gem,
    title: "Retraites Privées",
    description:
      "Séminaires d'entreprise, résidences créatives et retraites de direction dans une intimité absolue. Le désert dépouille le bruit, révélant clarté et connexion.",
  },
];

export default function EvenementsPage() {
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const quoteRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-80px" });
  const quoteInView = useInView(quoteRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/events-gala.png"
              alt="Événements de luxe au désert d'Agafay"
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
              Célébrez l&apos;Amour !
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Événements
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="divider-gold-wide mt-8 max-w-xs origin-left"
            />
          </div>
        </section>

        {/* Intro Text */}
        <section className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground"
            >
              Une expérience sensorielle unique, mêlant l&apos;émerveillement de la nature à la sophistication d&apos;événements raffinés
            </motion.p>
          </div>
        </section>

        {/* Event Types Cards */}
        <section ref={cardsRef} className="py-12 md:py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {eventTypes.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                  className="group p-8 md:p-10 border border-border/50 hover:border-gold/30 transition-all duration-500 bg-background/50 backdrop-blur-sm"
                >
                  <event.icon className="w-6 h-6 text-gold mb-6" />
                  <h3 className="font-serif text-2xl mb-4">{event.title}</h3>
                  <div className="w-8 h-px bg-gold/50 mb-6 group-hover:w-16 transition-all duration-500" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section ref={quoteRef} className="py-20 md:py-32 px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={quoteInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="divider-gold-wide max-w-[120px] mx-auto mb-12"
            />
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={quoteInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-serif text-2xl md:text-3xl lg:text-4xl italic leading-snug"
            >
              &ldquo;L&apos;alliance de traditions ancestrales et de prestations haut de gamme confère à ces soirées un caractère intemporel&rdquo;
            </motion.blockquote>
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
              Votre événement sur mesure
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl text-white mb-8"
            >
              Créons ensemble un moment inoubliable
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold rounded-none px-10 py-6 text-luxury-label"
                >
                  Planifiez votre événement
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
