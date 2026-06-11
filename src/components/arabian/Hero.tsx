"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png"
          alt="Arabian Desert Home — Luxury retreat at golden hour in the Agafay Desert"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Location Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="luxury-label text-white/70">
            {t("hero.location")}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl max-w-5xl text-balance"
        >
          {t("hero.heading1")}
          <br />
          <span className="italic text-terracotta">{t("hero.heading2")}</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="body-editorial text-white/70 text-lg md:text-xl max-w-xl mt-6"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="h-px w-16 bg-terracotta/30 mt-10 max-w-xs origin-left"
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="luxury-label text-white/50 text-[10px]">
          {t("hero.discover")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>

      {/* Corner Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-24 right-8 md:right-12 hidden md:flex flex-col items-end gap-2"
      >
        <div className="w-16 h-px bg-terracotta/40" />
        <span className="text-[9px] tracking-[0.4em] text-white/40 uppercase">
          {t("hero.established")}
        </span>
      </motion.div>
    </section>
  );
}
