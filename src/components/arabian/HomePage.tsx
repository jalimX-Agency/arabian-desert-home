"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Crown,
  Heart,
  Shield,
  ArrowRight,
  ChevronDown,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// Types
// ============================================
interface Suite {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  features: string;
  amenities: string;
  image: string;
  images: string;
  maxGuests: number;
  bedType: string;
  size: string;
  hasAC: boolean;
  order: number;
  featured: boolean;
  type: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
  source: string;
  order: number;
}

// ============================================
// Animation Variants
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ============================================
// 1. HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
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
          <span className="text-luxury-label text-white/70">
            Agafay Desert · Marrakech
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl max-w-5xl text-balance"
        >
          Découvrez l&apos;art de
          <br />
          <span className="italic text-gold">RelaxVacances</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-editorial text-white/70 text-lg md:text-xl max-w-xl mt-6"
        >
          Vivez une expérience unique au cœur du désert d&apos;Agafay
        </motion.p>

        {/* Decorative Gold Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="divider-gold-wide mt-10 max-w-xs origin-left"
        />

        {/* Reserve Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-8"
        >
          <Link href="/reservez-votre-sejour">
            <Button className="bg-gold text-charcoal hover:bg-gold-light rounded-none px-10 py-6 text-luxury-label tracking-[0.2em] transition-all duration-300">
              Réserver
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-luxury-label text-white/50 text-[10px]">
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// 2. FEATURES SECTION
// ============================================
const features = [
  {
    icon: Star,
    title: "Commodités de Classe",
    description:
      "Des prestations haut de gamme soigneusement sélectionnées pour votre confort absolu au cœur du désert.",
  },
  {
    icon: Crown,
    title: "Mode de Vie Luxueux",
    description:
      "Un art de vivre raffiné où chaque détail est pensé pour sublimer votre séjour dans notre écrin désertique.",
  },
  {
    icon: Heart,
    title: "Friendly Services",
    description:
      "Une équipe dévouée et attentionnée, disponible à chaque instant pour anticiper vos moindres désirs.",
  },
  {
    icon: Shield,
    title: "Lifeguard 24/7",
    description:
      "Sécurité et tranquillité d'esprit assurées jour et nuit par notre équipe de surveillance qualifiée.",
  },
];

function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="text-luxury-label text-gold block mb-4"
          >
            Nos Atouts
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            L&apos;excellence au
            <br />
            <span className="italic">cœur du désert</span>
          </motion.h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0.3 + index * 0.15}
                className="group relative p-8 md:p-10 border border-border/50 bg-card hover:border-gold/30 transition-all duration-500 text-center"
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-gold" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl md:text-2xl mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-editorial text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner accent */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 3. SUITES PREVIEW SECTION
// ============================================
const fallbackSuites: Suite[] = [
  {
    id: "1",
    name: "Suite Chorfa",
    slug: "suite-chorfa",
    tagline: "L'élégance au cœur du désert",
    description:
      "Suite double avec lit king-size et vue imprenable sur les montagnes de l'Atlas",
    longDescription: "",
    price: 300,
    currency: "EUR",
    features:
      "Lit King Size,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
    amenities: "",
    image: "/images/suite-royal.png",
    images: "",
    maxGuests: 2,
    bedType: "1 très grand lit double",
    size: "45m²",
    hasAC: true,
    order: 1,
    featured: true,
    type: "suite",
  },
  {
    id: "2",
    name: "Suite Junior",
    slug: "suite-junior",
    tagline: "Intimité et confort au désert",
    description:
      "Suite junior avec lit double et aménagements premium pour un séjour inoubliable",
    longDescription: "",
    price: 300,
    currency: "EUR",
    features:
      "Lit Double,Salle de Bain Privative,Terrasse Privée,Petit Déjeuner Inclus",
    amenities: "",
    image: "/images/suite-sultan.png",
    images: "",
    maxGuests: 2,
    bedType: "1 très grand lit double",
    size: "40m²",
    hasAC: true,
    order: 2,
    featured: true,
    type: "suite",
  },
  {
    id: "3",
    name: "Suite Familiale",
    slug: "suite-familiale",
    tagline: "Le désert en famille, le luxe en partage",
    description:
      "Suite familiale avec lit double et lit simple, idéale pour les familles",
    longDescription: "",
    price: 300,
    currency: "EUR",
    features:
      "Lit Double + Lit Simple,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
    amenities: "",
    image: "/images/suite-oasis.png",
    images: "",
    maxGuests: 4,
    bedType: "1 très grand lit double + 1 lit simple",
    size: "55m²",
    hasAC: true,
    order: 3,
    featured: true,
    type: "suite",
  },
];

function SuitesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [suites, setSuites] = useState<Suite[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/suites?featured=true")
      .then((res) => res.json())
      .then((data) => {
        const featured = data.filter((s: Suite) => s.featured);
        setSuites(featured.length > 0 ? featured : fallbackSuites);
      })
      .catch(() => {
        setSuites(fallbackSuites);
      });
  }, []);

  const displaySuites = suites.length > 0 ? suites : fallbackSuites;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <motion.span
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0}
              className="text-luxury-label text-gold block mb-4"
            >
              Hébergement
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.2}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
            >
              Nos Tentes
            </motion.h2>
          </div>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.4}
            className="text-editorial text-muted-foreground max-w-md"
          >
            Chaque tente est un monde à part — conçue avec intention, pensée
            pour la sérénité, et dotée de toutes les indulgences.
          </motion.p>
        </div>

        {/* Suite Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {displaySuites.slice(0, 3).map((suite, index) => {
            const isHovered = hoveredIndex === index;
            const features = suite.features.split(",");

            return (
              <motion.div
                key={suite.id}
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                custom={0.5 + index * 0.15}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative cursor-pointer"
              >
                <Link href={`/les-tentes/${suite.slug}`}>
                  {/* Image Container */}
                  <div
                    className={`relative overflow-hidden transition-all duration-700 ${
                      isHovered ? "aspect-[3/4]" : "aspect-[3/5]"
                    }`}
                  >
                    <img
                      src={suite.image}
                      alt={suite.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Card Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-px bg-gold" />
                        <span className="text-luxury-label text-gold text-[10px]">
                          {suite.size} · Jusqu&apos;à {suite.maxGuests}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
                        {suite.name}
                      </h3>
                      <p className="text-sm text-white/60 mb-1 line-clamp-1">
                        {suite.tagline}
                      </p>
                      <p className="text-sm text-white/50 mb-4 line-clamp-2">
                        {suite.description}
                      </p>

                      {/* Hover Content */}
                      <div
                        className={`transition-all duration-500 overflow-hidden ${
                          isHovered
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex flex-wrap gap-2 mb-4">
                          {features.slice(0, 4).map((f) => (
                            <span
                              key={f}
                              className="text-[10px] tracking-widest uppercase text-white/50 border border-white/20 px-2 py-1"
                            >
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gold font-serif text-xl">
                              {suite.price}€
                            </span>
                            <span className="text-white/40 text-sm ml-1">
                              / nuit
                            </span>
                          </div>
                          <span className="flex items-center gap-2 text-gold text-sm group/link">
                            Voir la tente
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 4. GALLERY SECTION
// ============================================
const galleryImages = [
  {
    src: "/images/about.png",
    alt: "Vue aérienne du camp Arabian Desert Home dans le désert d'Agafay",
  },
  {
    src: "/images/dining.png",
    alt: "Dîner raffiné sous les étoiles au désert d'Agafay",
  },
  {
    src: "/images/night.png",
    alt: "Ambiance nocturne magique au campement de luxe",
  },
  {
    src: "/images/exp-camel.png",
    alt: "Promenade en dromadaire au coucher du soleil",
  },
];

function GallerySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal/[0.03] dark:bg-charcoal/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="text-luxury-label text-gold block mb-4"
          >
            Galerie
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            Expérience à travers
            <br />
            <span className="italic">les images</span>
          </motion.h2>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.4 + index * 0.15}
              className="group relative overflow-hidden aspect-[3/4] cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
              {/* Subtle border accent on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. PACKAGES SECTION
// ============================================
const packages = [
  {
    name: "Honeymoon Suite Package",
    price: 249,
    description:
      "Suite lune de miel avec dîner aux chandelles, spa privé et coucher de soleil exclusif au désert.",
    features: [
      "Suite lune de miel privée",
      "Dîner aux chandelles",
      "Soin spa pour couple",
      "Balade dromadaire offerte",
      "Petit déjeuner au lit",
    ],
    highlighted: true,
  },
  {
    name: "Suite Room Package",
    price: 209,
    description:
      "Suite premium avec terrasse privée et vue panoramique sur les montagnes de l'Atlas.",
    features: [
      "Suite avec terrasse privée",
      "Vue panoramique Atlas",
      "Accès spa & hammam",
      "Dîner gastronomique inclus",
      "Conciergerie 24h/24",
    ],
    highlighted: false,
  },
  {
    name: "Deluxe Room Package",
    price: 149,
    description:
      "Chambre deluxe tout confort avec accès complet aux installations du camp.",
    features: [
      "Chambre deluxe climatisée",
      "Accès piscine & spa",
      "Petit déjeuner inclus",
      "Restaurant du camp",
      "Wi-Fi gratuit",
    ],
    highlighted: false,
  },
  {
    name: "Superior Room Package",
    price: 109,
    description:
      "Chambre supérieure authentique pour une expérience désertique accessible et mémorable.",
    features: [
      "Chambre supérieure",
      "Petit déjeuner marocain",
      "Accès piscine",
      "Douche chaude privative",
      "Parking gratuit",
    ],
    highlighted: false,
  },
];

function PackagesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="text-luxury-label text-gold block mb-4"
          >
            Nos Offres
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.2}
            className="heading-editorial text-4xl md:text-5xl lg:text-6xl"
          >
            Forfaits &amp; Séjours
          </motion.h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              variants={scaleIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.3 + index * 0.15}
              className={`group relative flex flex-col p-8 md:p-10 border transition-all duration-500 ${
                pkg.highlighted
                  ? "border-gold bg-gold/5 dark:bg-gold/10"
                  : "border-border/50 bg-card hover:border-gold/30"
              }`}
            >
              {/* Popular Badge */}
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold text-charcoal text-luxury-label text-[10px] px-4 py-1">
                    Populaire
                  </span>
                </div>
              )}

              {/* Package Name */}
              <h3 className="font-serif text-lg md:text-xl mb-2">
                {pkg.name}
              </h3>

              {/* Description */}
              <p className="text-editorial text-xs text-muted-foreground mb-6 leading-relaxed">
                {pkg.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="heading-display text-4xl md:text-5xl text-gold">
                  {pkg.price}€
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  / Nuit
                </span>
              </div>

              {/* Divider */}
              <div className="divider-gold mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Star className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0 fill-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/reservez-votre-sejour" className="block">
                <Button
                  className={`w-full rounded-none py-5 text-luxury-label tracking-[0.15em] transition-all duration-300 ${
                    pkg.highlighted
                      ? "bg-gold text-charcoal hover:bg-gold-light"
                      : "bg-transparent border border-gold/40 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold"
                  }`}
                >
                  Réserver
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 6. TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  const fallbackTestimonials: Testimonial[] = [
    {
      id: "1",
      quote:
        "Une expérience incroyable au cœur du désert d'Agafay. L'accueil chaleureux et la beauté des lieux nous ont transportés. Un séjour inoubliable que nous recommandons à tous.",
      author: "Marie & Pierre D.",
      location: "Lyon, France",
      rating: 5,
      source: "general",
      order: 1,
    },
    {
      id: "2",
      quote:
        "Les tentes sont magnifiques et le confort est au rendez-vous. Le dîner sous les étoiles avec la musique live était un moment magique. Merci pour cette pause hors du temps.",
      author: "Sophie L.",
      location: "Bruxelles, Belgique",
      rating: 5,
      source: "general",
      order: 2,
    },
    {
      id: "3",
      quote:
        "Le personnel est aux petits soins, la piscine avec vue sur le désert est un rêve éveillé. On reviendra pour le hammam et les balades à cheval !",
      author: "Ahmed B.",
      location: "Casablanca, Maroc",
      rating: 5,
      source: "general",
      order: 3,
    },
  ];

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.length > 0 ? data : fallbackTestimonials);
      })
      .catch(() => {
        setTestimonials(fallbackTestimonials);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => prev % (testimonials.length || 3) === (testimonials.length || 3) - 1 ? 0 : prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden bg-charcoal/[0.03] dark:bg-charcoal/50"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Label */}
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-luxury-label text-gold block mb-6"
        >
          Témoignages
        </motion.span>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.2}
          className="heading-editorial text-4xl md:text-5xl mb-16"
        >
          Ce que disent nos
          <br />
          <span className="italic">invités</span>
        </motion.h2>

        {/* Testimonial Content */}
        <div className="relative min-h-[280px]">
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
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
          {displayTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i === active
                  ? "bg-gold w-8"
                  : "bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Aller au témoignage ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 7. CTA SECTION
// ============================================
function CTASection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/night.png"
          alt="Nuit magique au désert d'Agafay"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.span
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0}
          className="text-luxury-label text-gold block mb-6"
        >
          Votre séjour vous attend
        </motion.span>

        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.2}
          className="heading-editorial text-4xl md:text-5xl lg:text-6xl text-white mb-6"
        >
          Réservez maintenant pour un luxe
          <br />
          <span className="italic text-gold">inoubliable</span> et une{" "}
          <span className="italic text-gold">tranquillité</span>
        </motion.h2>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.5}
          className="divider-gold-wide max-w-[200px] mx-auto mb-8"
        />

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.6}
          className="text-editorial text-white/60 mb-10 max-w-lg mx-auto"
        >
          Le désert d&apos;Agafay vous offre une évasion hors du commun.
          Réservez dès maintenant et laissez-vous transporter par la magie des
          lieux.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          custom={0.8}
        >
          <Link href="/reservez-votre-sejour">
            <Button className="bg-gold text-charcoal hover:bg-gold-light rounded-none px-12 py-7 text-luxury-label tracking-[0.2em] transition-all duration-300">
              Réservez Votre Séjour
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HOME PAGE — Main Export
// ============================================
export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SuitesSection />
      <GallerySection />
      <PackagesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
