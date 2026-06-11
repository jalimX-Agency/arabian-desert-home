"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function NightInterlude() {
  const { t } = useLanguage();
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
          src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/night.png"
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
          className="luxury-label text-terracotta/80 block mb-6"
        >
          {t("night.label")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="heading-display text-white text-4xl md:text-6xl lg:text-7xl text-balance"
        >
          {t("night.title1")}
          <br />
          <span className="italic text-terracotta">{t("night.title2")}</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="h-px w-16 bg-terracotta/30 mt-8 mb-8 mx-auto max-w-[120px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="body-editorial text-white/60 text-lg"
        >
          {t("night.description")}
        </motion.p>
      </motion.div>
    </section>
  );
}
