"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
}

export function Experiences() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch(() => {
        setExperiences([
          {
            id: "1",
            name: t("experiences.camelTrek.name"),
            slug: "camel-trek",
            description: t("experiences.camelTrek.description"),
            longDescription: t("experiences.camelTrek.longDescription"),
            duration: t("experiences.camelTrek.duration"),
            price: 250,
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-camel.png",
            category: t("experiences.camelTrek.category"),
            featured: true,
          },
          {
            id: "2",
            name: t("experiences.hammam.name"),
            slug: "desert-hammam",
            description: t("experiences.hammam.description"),
            longDescription: t("experiences.hammam.longDescription"),
            duration: t("experiences.hammam.duration"),
            price: 350,
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/spa/exp-spa.png",
            category: t("experiences.hammam.category"),
            featured: true,
          },
          {
            id: "3",
            name: t("experiences.balloon.name"),
            slug: "balloon-voyage",
            description: t("experiences.balloon.description"),
            longDescription: t("experiences.balloon.longDescription"),
            duration: t("experiences.balloon.duration"),
            price: 550,
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/exp-balloon.png",
            category: t("experiences.balloon.category"),
            featured: true,
          },
        ]);
      });
  }, [t]);

  const active = experiences[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="adventures"
      className="relative py-24 md:py-36 px-6 md:px-10 bg-obsidian/[0.03] dark:bg-obsidian/50 pattern-lines"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <span className="mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">01</span>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="luxury-label text-terracotta block mb-4"
          >
            {t("experiences.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            {t("experiences.title1")}
            <br />
            <span className="italic">{t("experiences.title2")}</span>
          </motion.h2>
        </div>

        {/* Experience Display — Magazine Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left — Image */}
          <div className="lg:col-span-7">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                {/* Category Tag */}
                <div className="absolute top-6 left-6">
                  <span className="luxury-label text-white/80 bg-black/30 backdrop-blur-sm px-4 py-2">
                    {active.category}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2">
                    <span className="text-terracotta mono-number text-lg">
                      ${active.price}
                    </span>
                    <span className="text-white/50 text-xs ml-1">{t("experiences.perPerson")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Content + Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {active && (
              <motion.div
                key={active.id + "-content"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-4 h-4 text-terracotta" />
                  <span className="text-sm text-muted-foreground">
                    {active.duration}
                  </span>
                </div>

                <h3 className="heading-editorial text-3xl md:text-4xl mb-4">
                  {active.name}
                </h3>

                <div className="w-12 h-px bg-terracotta mb-6" />

                <p className="body-editorial text-muted-foreground mb-4">
                  {active.description}
                </p>
                <p className="text-sm text-muted-foreground/70 leading-relaxed mb-8">
                  {active.longDescription}
                </p>

                <button className="flex items-center gap-2 text-terracotta text-sm tracking-wider uppercase group/link">
                  {t("experiences.exploreJourney")}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </button>
              </motion.div>
            )}

            {/* Experience Navigation */}
            <div className="flex gap-4 mt-12 pt-8 border-t border-border/50">
              {experiences.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex-1 transition-all duration-500 text-left py-3 border-b-2 ${
                    i === activeIndex
                      ? "border-terracotta"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <span
                    className={`text-sm mono-number transition-colors duration-300 ${
                      i === activeIndex ? "text-terracotta" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`text-xs mt-1 transition-colors duration-300 line-clamp-1 ${
                      i === activeIndex
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {exp.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
