"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "We came for a night and stayed for three. The silence, the stars, the way the light moves across the stone—nothing prepares you for how deeply this place touches your soul.",
    author: "Isabelle & Marc",
    location: "Paris, France",
    rating: 5,
  },
  {
    quote:
      "I've stayed at Aman, Six Senses, and One&Only around the world. Arabian Desert Home stands shoulder to shoulder with all of them—yet feels utterly unlike any of them. That is its magic.",
    author: "James Worthington",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "The hammam under the stars was transcendent. Our butler, Hassan, anticipated every need before we knew we had it. This is not a hotel—it is a portal to another way of being.",
    author: "Ayumi Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
  },
];

export function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-luxury-label text-gold block mb-6"
        >
          Reflections
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="heading-editorial text-4xl md:text-5xl mb-16"
        >
          Words from the
          <br />
          <span className="italic">Desert</span>
        </motion.h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[280px]">
          {testimonials.map((t, i) => (
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
              <Quote className="w-8 h-8 text-gold/30 mb-8" />

              <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-balance mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-3.5 h-3.5 fill-gold text-gold"
                  />
                ))}
              </div>

              <p className="font-serif text-lg">{t.author}</p>
              <p className="text-luxury-label text-muted-foreground mt-1">
                {t.location}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === active
                  ? "bg-gold w-8"
                  : "bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
