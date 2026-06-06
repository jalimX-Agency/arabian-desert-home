"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function Testimonials() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const testimonials = [
    {
      quote: t("reflections.t1Quote"),
      author: t("reflections.t1Author"),
      location: t("reflections.t1Location"),
      rating: 5,
    },
    {
      quote: t("reflections.t2Quote"),
      author: t("reflections.t2Author"),
      location: t("reflections.t2Location"),
      rating: 5,
    },
    {
      quote: t("reflections.t3Quote"),
      author: t("reflections.t3Author"),
      location: t("reflections.t3Location"),
      rating: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="text-mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">01</span>
        </motion.div>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-luxury-label text-terracotta block mb-6"
        >
          {t("reflections.label")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="heading-editorial text-4xl md:text-5xl mb-16"
        >
          {t("reflections.title1")}
          <br />
          <span className="italic">{t("reflections.title2")}</span>
        </motion.h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[280px]">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0,
                y: i === active ? 0 : 20,
                scale: i === active ? 1 : 0.98,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`absolute inset-0 flex flex-col items-center ${
                i !== active ? "pointer-events-none" : ""
              }`}
            >
              <Quote className="w-8 h-8 text-terracotta/30 mb-8" />

              <p className="heading-editorial text-xl md:text-2xl lg:text-3xl leading-relaxed text-balance mb-8 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-terracotta text-terracotta"
                  />
                ))}
              </div>

              <p className="heading-editorial text-lg">{testimonial.author}</p>
              <p className="text-luxury-label text-muted-foreground mt-1">
                {testimonial.location}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots — h-px lines instead of circles */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-px transition-all duration-500 ${
                i === active
                  ? "bg-terracotta w-8"
                  : "bg-border hover:bg-muted-foreground w-4"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
