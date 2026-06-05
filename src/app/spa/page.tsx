"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";

interface SpaTreatment {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  source: string;
}

export default function SpaPage() {
  const heroRef = useRef(null);
  const treatmentsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const treatmentsInView = useInView(treatmentsRef, { once: true, margin: "-80px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const [treatments, setTreatments] = useState<SpaTreatment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [spaRes, testRes] = await Promise.all([
          fetch("/api/spa"),
          fetch("/api/testimonials"),
        ]);
        const spaData = await spaRes.json();
        const testData = await testRes.json();
        setTreatments(spaData);
        setTestimonials(testData.filter((t: Testimonial) => t.source === "spa"));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/spa-treatment.png"
              alt="Spa de luxe au désert d'Agafay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10 max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold/80 mb-4"
            >
              Un havre de paix pour votre bien-être
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Spa de Luxe
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="divider-gold-wide mt-8 max-w-xs origin-left"
            />
          </div>
        </section>

        {/* Intro Text */}
        <section className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-editorial text-lg md:text-xl text-muted-foreground"
            >
              Profitez de soins personnalisés, adaptés à vos besoins pour une expérience revitalisante unique
            </motion.p>
          </div>
        </section>

        {/* Treatments Grid */}
        <section ref={treatmentsRef} className="py-12 md:py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={treatmentsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold block text-center mb-4"
            >
              Nos Soins
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={treatmentsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-4xl lg:text-5xl text-center mb-16"
            >
              Rituels de <span className="italic">Bien-être</span>
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-none mb-6" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {treatments.map((treatment, index) => (
                  <motion.div
                    key={treatment.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={treatmentsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                    className="group border border-border/50 hover:border-gold/30 transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={treatment.image}
                        alt={treatment.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                      <div className="absolute top-4 right-4 bg-charcoal/80 backdrop-blur-sm px-4 py-2">
                        <span className="text-gold font-serif text-lg">
                          {treatment.price} {treatment.currency}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <h3 className="font-serif text-xl md:text-2xl mb-2">
                        {treatment.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-gold/70" />
                        <span className="text-sm text-muted-foreground">{treatment.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {treatment.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section ref={testimonialsRef} className="py-20 md:py-28 px-6 md:px-10 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-luxury-label text-gold block text-center mb-4"
              >
                Témoignages
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                className="heading-editorial text-3xl md:text-4xl text-center mb-16"
              >
                Ce que disent nos <span className="italic">invités</span>
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                    className="p-8 border border-border/50 bg-background"
                  >
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="font-serif text-lg md:text-xl italic mb-6 leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <p className="text-sm font-medium">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 md:py-28 px-6 md:px-10 bg-charcoal dark:bg-charcoal">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold/60 block mb-4"
            >
              Réservation
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl text-white mb-8"
            >
              Offrez-vous un moment de sérénité
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold rounded-none px-10 py-6 text-luxury-label"
                >
                  Réservez vos soins
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
