"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Heart, Gem } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function Events() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const eventTypes = [
    {
      icon: Heart,
      title: t("events.intimateTitle"),
      description: t("events.intimateDesc"),
    },
    {
      icon: Sparkles,
      title: t("events.weddingTitle"),
      description: t("events.weddingDesc"),
    },
    {
      icon: Gem,
      title: t("events.retreatTitle"),
      description: t("events.retreatDesc"),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative py-24 md:py-36 px-6 md:px-10"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/events.png"
          alt=""
          className="w-full h-full object-cover opacity-20 dark:opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-luxury-label text-gold block mb-4"
          >
            {t("events.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            {t("events.title1")}
            <br />
            <span className="italic">{t("events.title2")}</span>
          </motion.h2>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
              className="group p-8 md:p-10 border border-border/50 hover:border-gold/30 transition-all duration-500 bg-background/50 backdrop-blur-sm"
            >
              <event.icon className="w-6 h-6 text-gold mb-6" />

              <h3 className="font-serif text-2xl mb-4">{event.title}</h3>

              <div className="w-8 h-px bg-gold/50 mb-6 group-hover:w-16 transition-all duration-500" />

              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>

              <button className="mt-8 text-luxury-label text-gold hover:text-gold-light transition-colors">
                {t("events.enquire")}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Centered CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-16 md:mt-24"
        >
          <p className="text-editorial text-muted-foreground mb-6">
            {t("events.everyEvent")}
          </p>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 text-gold border border-gold/40 px-8 py-4 text-luxury-label hover:bg-gold/10 transition-all duration-300"
          >
            {t("events.planEvent")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
