"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Clock, ArrowUpRight } from "lucide-react";

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
            name: "Golden Hour Camel Trek",
            slug: "camel-trek",
            description: "Journey through time aboard the ship of the desert",
            longDescription: "As the sun paints the Agafay in shades of amber and rose, embark on a timeless journey aboard our gentle camels. Led by nomadic guides whose families have traversed these paths for generations, this is not merely a ride—it is a passage into the soul of the Sahara.",
            duration: "3 hours",
            price: 250,
            image: "/images/exp-camel.png",
            category: "Adventure",
            featured: true,
          },
          {
            id: "2",
            name: "Desert Hammam Ritual",
            slug: "desert-hammam",
            description: "Ancient wellness reborn in sacred stillness",
            longDescription: "Surrender to a centuries-old ritual beneath the open sky. Our desert hammam uses black soap from Marrakech, rhassoul clay from the Atlas Mountains, and rose water from Kelaat M'gouna. Each treatment is a meditation—a return to elemental simplicity.",
            duration: "2.5 hours",
            price: 350,
            image: "/images/exp-spa.png",
            category: "Wellness",
            featured: true,
          },
          {
            id: "3",
            name: "Dawn Balloon Voyage",
            slug: "balloon-voyage",
            description: "Rise above the earth as the desert awakens",
            longDescription: "Before the world stirs, ascend into the crystalline morning air. Our private balloon carries you over the lunar landscape of Agafay, the terracotta walls of distant kasbahs, and the snow-capped Atlas Mountains piercing the horizon.",
            duration: "4 hours",
            price: 550,
            image: "/images/exp-balloon.png",
            category: "Adventure",
            featured: true,
          },
        ]);
      });
  }, []);

  const active = experiences[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="adventures"
      className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal/[0.03] dark:bg-charcoal/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-luxury-label text-gold block mb-4"
          >
            Curated Journeys
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            Beyond the
            <br />
            <span className="italic">Horizon</span>
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
                  <span className="text-luxury-label text-white/80 bg-black/30 backdrop-blur-sm px-4 py-2">
                    {active.category}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2">
                    <span className="text-gold font-serif text-lg">
                      ${active.price}
                    </span>
                    <span className="text-white/50 text-xs ml-1">/ person</span>
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
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-sm text-muted-foreground">
                    {active.duration}
                  </span>
                </div>

                <h3 className="font-serif text-3xl md:text-4xl mb-4">
                  {active.name}
                </h3>

                <div className="w-12 h-px bg-gold mb-6" />

                <p className="text-editorial text-muted-foreground mb-4">
                  {active.description}
                </p>
                <p className="text-sm text-muted-foreground/70 leading-relaxed mb-8">
                  {active.longDescription}
                </p>

                <button className="flex items-center gap-2 text-gold text-sm tracking-wider uppercase group/link">
                  Explore This Journey
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
                      ? "border-gold"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      i === activeIndex ? "text-gold" : "text-muted-foreground"
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
