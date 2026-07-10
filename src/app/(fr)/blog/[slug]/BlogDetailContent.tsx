"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { useLanguage, withLocale, pickLocalized, type Language } from "@/lib/i18n/context";
import { CTASection } from "@/components/arabian/CTASection";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  createdAt: Date;
  titleEn: string;
  excerptEn: string;
  contentEn: string;
  titleEs?: string;
  excerptEs?: string;
  contentEs?: string;
  titleIt?: string;
  excerptIt?: string;
  contentIt?: string;
}

interface RelatedPost {
  id: string;
  title: string;
  titleEn: string;
  titleEs?: string;
  titleIt?: string;
  slug: string;
  image: string;
  category: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const COPY: Record<Language, {
  backToBlog: string; agafayDeserExperts: string; authorBio: string;
  agafayDesertGuide: string; ourLuxuryTents: string; allArticles: string;
  relatedArticles: string; experienceDesert: string; bookYourStay: string;
}> = {
  fr: {
    backToBlog: "Retour au Blog", agafayDeserExperts: "Experts du Désert d'Agafay",
    authorBio: "Notre équipe de passionnés du désert d'Agafay partage conseils, inspirations et récits pour votre prochaine escapade depuis Marrakech.",
    agafayDesertGuide: "Guide du Désert d'Agafay", ourLuxuryTents: "Nos Tentes de Luxe",
    allArticles: "Tous les articles", relatedArticles: "Articles similaires",
    experienceDesert: "Vivez le Désert", bookYourStay: "Réserver",
  },
  en: {
    backToBlog: "Back to Blog", agafayDeserExperts: "Agafay Desert Experts",
    authorBio: "Our team of Agafay desert enthusiasts shares tips, inspiration and stories for your next desert escape from Marrakech.",
    agafayDesertGuide: "Agafay Desert Guide", ourLuxuryTents: "Our Luxury Tents",
    allArticles: "All articles", relatedArticles: "Related Articles",
    experienceDesert: "Experience the Desert", bookYourStay: "Book Your Stay",
  },
  es: {
    backToBlog: "Volver al Blog", agafayDeserExperts: "Expertos del Desierto de Agafay",
    authorBio: "Nuestro equipo de apasionados del desierto de Agafay comparte consejos, inspiraciones y relatos para tu próxima escapada al desierto desde Marrakech.",
    agafayDesertGuide: "Guía del Desierto de Agafay", ourLuxuryTents: "Nuestras Tiendas de Lujo",
    allArticles: "Todos los artículos", relatedArticles: "Artículos relacionados",
    experienceDesert: "Vive el Desierto", bookYourStay: "Reserva tu Estancia",
  },
  it: {
    backToBlog: "Torna al Blog", agafayDeserExperts: "Esperti del Deserto di Agafay",
    authorBio: "Il nostro team di appassionati del deserto di Agafay condivide consigli, ispirazioni e racconti per la tua prossima fuga nel deserto da Marrakech.",
    agafayDesertGuide: "Guida del Deserto di Agafay", ourLuxuryTents: "Le Nostre Tende di Lusso",
    allArticles: "Tutti gli articoli", relatedArticles: "Articoli correlati",
    experienceDesert: "Vivi il Deserto", bookYourStay: "Prenota il Tuo Soggiorno",
  },
};

export function BlogDetailContent({ post, relatedPosts = [] }: { post: BlogPost; relatedPosts?: RelatedPost[] }) {
  const { language, t } = useLanguage();
  const c = COPY[language];

  const title = pickLocalized(language, post.title, post.titleEn, post.titleEs, post.titleIt);
  const excerpt = pickLocalized(language, post.excerpt, post.excerptEn, post.excerptEs, post.excerptIt);
  const content = pickLocalized(language, post.content, post.contentEn, post.contentEs, post.contentIt);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        {post.image ? (
          <img src={post.image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-warm-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-black via-warm-black/40 to-transparent" />

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
          className="absolute top-8 left-6 md:left-12"
        >
          <Link href={withLocale(language, "/blog")} className="flex items-center gap-2 text-white/70 hover:text-amber transition-colors text-sm luxury-label">
            <ArrowLeft className="w-4 h-4" />
            {c.backToBlog}
          </Link>
        </motion.div>

        {/* Category badge */}
        {post.category && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: smoothEase }}
            className="absolute bottom-24 left-6 md:left-12"
          >
            <span className="bg-amber/90 text-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full luxury-label">
              {post.category}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="heading-display text-3xl md:text-5xl lg:text-6xl text-white max-w-4xl"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-background py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8"
          >
            {post.author && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber/60" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber/60" />
              {format(new Date(post.createdAt), "d MMMM yyyy", { locale: language === "fr" ? frLocale : undefined })}
            </span>
          </motion.div>

          <div className="divider-accent max-w-[80px] mb-8" />

          {/* Excerpt */}
          {excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
              className="body-editorial text-lg text-muted-foreground mb-10 leading-relaxed italic border-l-2 border-amber/40 pl-5"
            >
              {excerpt}
            </motion.p>
          )}

          {/* Body */}
          {content && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              className="prose prose-neutral dark:prose-invert max-w-none body-editorial
                prose-headings:heading-editorial prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-amber prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Author bio */}
          <div className="mt-12 p-6 border border-amber/10 rounded-2xl bg-amber/[0.02]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                <User className="w-4 h-4 text-amber/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{post.author || "Arabian Desert Home"}</p>
                <p className="text-xs text-muted-foreground luxury-label">{c.agafayDeserExperts}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {c.authorBio}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href={withLocale(language, "/desert-agafay")} className="text-amber hover:underline cursor-pointer">
                {c.agafayDesertGuide}
              </Link>
              <Link href={withLocale(language, "/les-tentes")} className="text-amber hover:underline cursor-pointer">
                {c.ourLuxuryTents}
              </Link>
              <Link href={withLocale(language, "/day-pass")} className="text-amber hover:underline cursor-pointer">
                Day Pass
              </Link>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link href={withLocale(language, "/blog")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber transition-colors luxury-label">
              <ArrowLeft className="w-4 h-4" />
              {c.allArticles}
            </Link>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-background pb-16 md:pb-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="heading-editorial text-2xl md:text-3xl text-foreground mb-8">
              {c.relatedArticles}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={withLocale(language, `/blog/${rp.slug}`)} className="group block cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                    {rp.image ? (
                      <img
                        src={rp.image.split(",")[0]}
                        alt={pickLocalized(language, rp.title, rp.titleEn, rp.titleEs, rp.titleIt)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-warm-black" />
                    )}
                  </div>
                  {rp.category && (
                    <p className="text-[10px] uppercase tracking-widest text-amber/70 luxury-label mb-2">{rp.category}</p>
                  )}
                  <h3 className="text-base text-foreground group-hover:text-amber transition-colors duration-300 leading-snug">
                    {pickLocalized(language, rp.title, rp.titleEn, rp.titleEs, rp.titleIt)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        label="Arabian Desert Home"
        title={c.experienceDesert}
        buttonText={c.bookYourStay}
        buttonHref={withLocale(language, "/reservez-votre-sejour")}
      />
    </>
  );
}
