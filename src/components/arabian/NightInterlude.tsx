"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function NightInterlude() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="/images/night.png"
          alt="Milky Way over Arabian Desert Home at night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-luxury-label text-gold/80 block mb-6"
        >
          When Night Falls
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="heading-display text-white text-4xl md:text-6xl lg:text-7xl text-balance"
        >
          The Desert Speaks
          <br />
          <span className="italic text-gold">in Stars</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="divider-gold-wide mt-8 mb-8 mx-auto max-w-[120px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-editorial text-white/60 text-lg"
        >
          When the last light fades, the Agafay reveals its most intimate
          secret—a sky so vast it makes philosophers of us all.
        </motion.p>
      </motion.div>
    </section>
  );
}
