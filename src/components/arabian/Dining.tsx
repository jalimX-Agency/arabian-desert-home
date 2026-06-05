"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Dining() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="dining"
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left — Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold block mb-4"
            >
              Gastronomy
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8"
            >
              A Feast for
              <br />
              <span className="italic">the Senses</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="divider-gold-wide origin-left max-w-[120px] mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-editorial text-muted-foreground mb-6"
            >
              Under the canopy of a billion stars, our chef orchestrates a
              symphony of Moroccan flavors and international technique. Each dish
              tells a story—of ancient spice routes, of local farmers who tend
              the earth, of a culinary tradition that has nourished body and soul
              for millennia.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-sm text-muted-foreground/70 mb-10"
            >
              From the slow-braised lamb tagine with preserved lemons to the
              saffron-infused couscous, every meal is an event. Private dining
              under the stars, breakfast with the Atlas Mountains as your
              backdrop, or a clandestine picnic in a hidden oasis—the choice is
              yours.
            </motion.p>

            {/* Menu Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-4"
            >
              {[
                {
                  name: "Le Jardin Secret",
                  desc: "Private garden dining under lantern light",
                },
                {
                  name: "Dunes & Wine",
                  desc: "Curated wine pairing on the dune crest",
                },
                {
                  name: "Oasis Brunch",
                  desc: "Morning feast beside the reflecting pool",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-3 border-b border-border/30 group cursor-default"
                >
                  <div className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                  <div>
                    <span className="font-serif text-lg group-hover:text-gold transition-colors duration-300">
                      {item.name}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/dining.png"
                  alt="Luxury Moroccan fine dining under the stars at Arabian Desert Home"
                  className="w-full h-full object-cover img-luxury"
                />
              </div>

              {/* Floating Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-6 -left-4 md:-left-8 bg-background/90 backdrop-blur-sm border border-border/50 p-6 max-w-xs"
              >
                <p className="font-serif italic text-lg leading-snug">
                  &ldquo;The best meals are eaten with sand between your
                  toes&rdquo;
                </p>
                <span className="text-luxury-label text-gold mt-3 block">
                  — Our Chef
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
