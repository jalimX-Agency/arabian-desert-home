"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface Suite {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  features: string;
  image: string;
  maxGuests: number;
  size: string;
  featured: boolean;
}

export function Suites() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [suites, setSuites] = useState<Suite[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/suites")
      .then((res) => res.json())
      .then((data) => setSuites(data))
      .catch(() => {
        // Fallback data
        setSuites([
          {
            id: "1",
            name: "The Royal Tent",
            slug: "royal-tent",
            description: "Where desert grandeur meets intimate luxury",
            longDescription: "Step into a realm of understated opulence. The Royal Tent redefines desert living with its expansive interior, hand-carved cedar furnishings, and a private terrace that stretches toward the horizon.",
            price: 1200,
            features: "King Bed,Private Terrace,Berber Textiles,Butler Service,Mini Bar,AC & Heating",
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png",
            maxGuests: 2,
            size: "65m²",
            featured: true,
          },
          {
            id: "2",
            name: "The Sultan Suite",
            slug: "sultan-suite",
            description: "An oasis of palatial sophistication",
            longDescription: "The Sultan Suite is our most opulent offering—a private kingdom within the desert. Featuring a private plunge pool, hand-hammered copper bath, and an entrance hall adorned with zellige tilework.",
            price: 2200,
            features: "King Bed,Private Plunge Pool,Copper Bath,Zellige Entrance,Separate Living,Butler Service",
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png",
            maxGuests: 3,
            size: "95m²",
            featured: true,
          },
          {
            id: "3",
            name: "The Oasis Pavilion",
            slug: "oasis-pavilion",
            description: "Where the desert meets the sky",
            longDescription: "An architectural poem of light and space. The Oasis Pavilion features retractable walls that dissolve the boundary between interior and landscape. By day, the desert is your living room; by night, the cosmos your ceiling.",
            price: 1800,
            features: "King Bed,Retractable Walls,Outdoor Tub,Daybed,Panoramic View,Star Ceiling",
            image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png",
            maxGuests: 2,
            size: "80m²",
            featured: true,
          },
        ]);
      });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="suites"
      className="relative py-24 md:py-36 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
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
              {t("suites.label")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
            >
              {t("suites.heading1")}
              <br />
              <span className="italic">{t("suites.heading2")}</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="body-editorial text-muted-foreground max-w-md"
          >
            {t("suites.subtitle")}
          </motion.p>
        </div>

        {/* Suite Cards — Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {suites.map((suite, index) => {
            const isHovered = hoveredIndex === index;
            const features = suite.features.split(",");

            return (
              <motion.div
                key={suite.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative cursor-pointer"
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden transition-all duration-700 ${
                    isHovered ? "aspect-[3/4]" : "aspect-[3/5]"
                  }`}
                >
                  <img
                    src={suite.image}
                    alt={suite.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Always visible content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-px bg-terracotta" />
                      <span className="luxury-label text-terracotta text-[10px]">
                        {suite.size} · {t("suites.upTo")} {suite.maxGuests}
                      </span>
                    </div>
                    <h3 className="heading-editorial text-2xl md:text-3xl text-white mb-2">
                      {suite.name}
                    </h3>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">
                      {suite.description}
                    </p>

                    {/* Hover Content */}
                    <div
                      className={`transition-all duration-500 overflow-hidden ${
                        isHovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 mb-4">
                        {features.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] tracking-widest uppercase text-white/50 border border-white/20 px-2 py-1"
                          >
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-terracotta mono-number text-xl">
                            ${suite.price}
                          </span>
                          <span className="text-white/40 text-sm ml-1">
                            {t("suites.perNight")}
                          </span>
                        </div>
                        <span className="flex items-center gap-2 text-terracotta text-sm group/link">
                          {t("suites.viewTent")}
                          <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
