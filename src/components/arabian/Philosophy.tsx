"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Philosophy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <span className="text-luxury-label text-gold">The Experience</span>
        </motion.div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column — Large Typography */}
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-balance"
            >
              In the desert,
              <br />
              you don&apos;t escape
              <br />
              the world—
              <br />
              <span className="italic text-gold">you find it</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="divider-gold-wide mt-10 origin-left max-w-[120px]"
            />
          </div>

          {/* Right Column — Text + Image */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Arabian Desert Home was born from a singular vision: to create a
              sanctuary where luxury exists in perfect harmony with the raw
              beauty of the Agafay Desert. Every detail—from the hand-stitched
              Berber textiles to the organic shapes of our architecture—has been
              curated to honor the land and elevate the spirit.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-editorial text-muted-foreground leading-relaxed"
            >
              Here, time moves to the rhythm of the sun. Mornings begin with
              silence and mint tea. Afternoons unfold with purpose—whether
              exploring ancient trails, surrendering to the hammam, or simply
              watching the light shift across the stone. And when night falls,
              the desert reveals its most intimate secret: a sky so vast it
              makes philosophers of us all.
            </motion.p>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="relative aspect-[16/9] overflow-hidden mt-4"
            >
              <img
                src="/images/about.png"
                alt="Aerial view of Arabian Desert Home retreat in Agafay"
                className="w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-3 gap-8 pt-6 border-t border-border/50"
            >
              {[
                { value: "12", label: "Luxury Suites" },
                { value: "40km", label: "From Marrakech" },
                { value: "5★", label: "Experience" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-serif text-3xl md:text-4xl text-gold">
                    {stat.value}
                  </div>
                  <div className="text-luxury-label text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
