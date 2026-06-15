"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function Philosophy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { t } = useLanguage();

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
          <span className="mono-number text-terracotta/30 text-6xl md:text-7xl leading-none block mb-3">01</span>
          <span className="luxury-label text-terracotta">{t("philosophy.label")}</span>
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
              {t("philosophy.title1")}
              <br />
              {t("philosophy.title2")}
              <br />
              {t("philosophy.title3")}
              <br />
              <span className="italic text-terracotta">{t("philosophy.title4")}</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="h-px w-16 bg-terracotta/30 mt-10 origin-left max-w-[120px]"
            />
          </div>

          {/* Right Column — Text + Image */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="body-editorial text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              {t("philosophy.paragraph1")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="body-editorial text-muted-foreground leading-relaxed"
            >
              {t("philosophy.paragraph2")}
            </motion.p>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="relative aspect-[16/9] overflow-hidden mt-4"
            >
              <img
                src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/1781200907578-eqj4rm32aai.webp"
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
                { value: "12", label: t("philosophy.stats.suites") },
                { value: "40km", label: t("philosophy.stats.distance") },
                { value: "5★", label: t("philosophy.stats.experience") },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="mono-number text-3xl md:text-4xl text-terracotta">
                    {stat.value}
                  </div>
                  <div className="luxury-label text-muted-foreground mt-1">
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
