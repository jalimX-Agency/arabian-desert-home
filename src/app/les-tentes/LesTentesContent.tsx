"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface Suite {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  price: number;
  currency: string;
  features: string;
  amenities: string;
  amenitiesEn: string;
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

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

const FALLBACK_SUITES: Suite[] = [
  {
    id: "tente-junior",
    name: "Tente Junior",
    nameEn: "",
    slug: "tente-junior",
    tagline: "Confort et intimité dans le désert",
    taglineEn: "",
    description: "Une tente élégante pour un séjour intime au cœur du désert d'Agafay, avec tout le confort nécessaire.",
    descriptionEn: "",
    longDescription: "La Tente Junior offre un espace chaleureux avec une décoration marocaine authentique, une literie premium et une vue imprenable sur les paysages désertiques.",
    price: 170,
    currency: "EUR",
    features: "Lit double, Salle de bain privée, Vue désert",
    amenities: "Climatisation, Petit-déjeuner inclus, WiFi",
    amenitiesEn: "",
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png",
    images: "",
    maxGuests: 2,
    bedType: "Double",
    size: "25m²",
    hasAC: true,
    order: 1,
    featured: false,
    type: "chambre",
  },
  {
    id: "tente-familiale",
    name: "Tente Familiale",
    nameEn: "",
    slug: "tente-familiale",
    tagline: "L'aventure en famille dans le désert",
    taglineEn: "",
    description: "Idéale pour les familles, cette tente spacieuse accueille jusqu'à 4 personnes avec tout le confort souhaité.",
    descriptionEn: "",
    longDescription: "La Tente Familiale dispose de deux espaces de couchage séparés, parfaite pour partager l'expérience désert en famille tout en bénéficiant d'un espace privatif.",
    price: 220,
    currency: "EUR",
    features: "2 chambres, Salle de bain privée, Terrasse",
    amenities: "Climatisation, Petit-déjeuner inclus, WiFi",
    amenitiesEn: "",
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png",
    images: "",
    maxGuests: 4,
    bedType: "Double + Lits simples",
    size: "40m²",
    hasAC: true,
    order: 2,
    featured: false,
    type: "chambre",
  },
  {
    id: "suite-chorfa",
    name: "Suite Chorfa",
    nameEn: "",
    slug: "suite-chorfa",
    tagline: "L'excellence absolue du désert",
    taglineEn: "",
    description: "Notre suite premium, une expérience unique alliant luxe berbère et confort contemporain au cœur du désert d'Agafay.",
    descriptionEn: "",
    longDescription: "La Suite Chorfa représente le summum de l'hospitalité désertique. Un espace palatial orné de zellige, de boiseries sculptées et d'une piscine privée face à l'horizon désertique.",
    price: 300,
    currency: "EUR",
    features: "Suite premium, Piscine privée, Salon séparé",
    amenities: "Climatisation, Petit-déjeuner inclus, WiFi, Service en chambre",
    amenitiesEn: "",
    image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png",
    images: "",
    maxGuests: 2,
    bedType: "King Size",
    size: "60m²",
    hasAC: true,
    order: 3,
    featured: true,
    type: "suite",
  },
];

function SuiteCard({ suite }: { suite: Suite }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const name = (isEn && suite.nameEn) ? suite.nameEn : suite.name;
  const tagline = (isEn && suite.taglineEn) ? suite.taglineEn : suite.tagline;
  const description = (isEn && suite.descriptionEn) ? suite.descriptionEn : suite.description;
  const amenitySrc = (isEn && suite.amenitiesEn) ? suite.amenitiesEn : suite.amenities;
  const features = suite.features ? suite.features.split(",") : [];
  const amenities = amenitySrc ? amenitySrc.split(",") : [];

  return (
    <motion.article
      variants={cardVariants}
      className="group glass-card card-warm overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={suite.image}
          alt={suite.name}
          className="w-full h-full object-cover img-luxury"
        />
        <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />

        {suite.featured && (
          <div className="absolute top-4 left-4 bg-amber/90 px-3 py-1 rounded-full">
            <span className="luxury-label text-warm-black text-xs">Prestige</span>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-warm-black/40 backdrop-blur-md px-4 py-2 rounded-full">
          <span className="text-amber mono-number text-lg">{suite.price} €</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber" />
            <span>{suite.maxGuests} pers.</span>
          </div>
          {suite.size && (
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-amber" />
              <span>{suite.size}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber fill-amber" />
            <span className="text-amber">5.0</span>
          </div>
        </div>

        <h3 className="heading-editorial text-xl md:text-2xl mb-1 group-hover:text-amber transition-colors duration-400">
          {name}
        </h3>
        <p className="text-xs text-amber/70 mb-3 luxury-label">{tagline}</p>

        <div className="divider-accent max-w-[60px] mb-4" />

        <p className="text-sm text-muted-foreground mb-6 body-editorial line-clamp-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {amenities.slice(0, 3).map((amenity, i) => (
            <span
              key={i}
              className="text-xs border border-amber/20 text-muted-foreground px-3 py-1 rounded-full body-editorial"
            >
              {amenity.trim()}
            </span>
          ))}
        </div>

        <Link
          href={`/les-tentes/${suite.slug}`}
          className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
        >
          Voir les détails
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export function LesTentesContent({ suites }: { suites: Suite[] }) {
  const data = suites.length > 0 ? suites : FALLBACK_SUITES;

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative flex flex-col md:flex-row min-h-[55vh] md:min-h-[65vh] overflow-hidden">
        <div className="relative w-full h-[30vh] md:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm-black/90" />
        </div>

        <div className="relative w-full md:w-[55%] bg-warm-black flex items-center px-6 md:px-12 lg:px-20 py-12 md:py-0">
          <div className="absolute inset-0 grain-overlay pointer-events-none" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-amber/[0.03] blob-1 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber/[0.02] blob-2 blur-3xl" />

          <div className="relative z-10 max-w-lg">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-4"
            >
              01
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
              className="luxury-label text-amber block mb-5"
            >
              Arabian Desert Home
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
              className="heading-display text-4xl md:text-5xl lg:text-7xl text-white mb-5"
            >
              Tentes de{" "}
              <span className="italic text-amber">Luxe</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: smoothEase }}
              className="body-editorial text-white/50 text-base md:text-lg max-w-md mb-8"
            >
              Une invitation à l&apos;évasion, où le raffinement du désert
              se révèle dans chaque détail de votre séjour.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: smoothEase }}
              className="divider-accent max-w-[120px] origin-left"
            />
          </div>
        </div>

        <div className="hidden md:block relative w-[45%] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/about.webp')" }}
          />
          <div className="absolute inset-0 gradient-amber opacity-30" />
          <div
            className="absolute inset-y-0 left-0 w-16"
            style={{
              background: "linear-gradient(to right, var(--warm-black), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── All Accommodations ── */}
      <section className="py-20 md:py-32 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="mb-12 md:mb-16"
          >
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-3">
              02
            </span>
            <span className="luxury-label text-amber block mb-3">Nos Hébergements</span>
            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl mb-4">
              Tentes &amp; Suites <span className="italic text-amber">de Luxe</span>
            </h2>
            <div className="divider-accent max-w-xs" />
            <p className="body-editorial text-muted-foreground mt-6 max-w-2xl">
              Des espaces d&apos;exception où le luxe du désert se révèle dans chaque
              détail. Petit-déjeuner inclus. Tarifs par nuit.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6"
          >
            {data.map((suite) => (
              <SuiteCard key={suite.id} suite={suite} />
            ))}
          </motion.div>
        </div>
      </section>

    </>
  );
}
