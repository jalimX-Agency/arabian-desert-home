"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
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
}

interface RelatedPost {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  image: string;
  category: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function BlogDetailContent({ post, relatedPosts = [] }: { post: BlogPost; relatedPosts?: RelatedPost[] }) {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const title = isEn && post.titleEn ? post.titleEn : post.title;
  const excerpt = isEn && post.excerptEn ? post.excerptEn : post.excerpt;
  const content = isEn && post.contentEn ? post.contentEn : post.content;

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
          <Link href={isEn ? "/en/blog" : "/blog"} className="flex items-center gap-2 text-white/70 hover:text-amber transition-colors text-sm luxury-label">
            <ArrowLeft className="w-4 h-4" />
            {isEn ? "Back to Blog" : "Retour au Blog"}
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
              {format(new Date(post.createdAt), "d MMMM yyyy", { locale: isEn ? undefined : frLocale })}
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
                <p className="text-xs text-muted-foreground luxury-label">{isEn ? "Agafay Desert Experts" : "Experts du Désert d'Agafay"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {isEn
                ? "Our team of Agafay desert enthusiasts shares tips, inspiration and stories for your next desert escape from Marrakech."
                : "Notre équipe de passionnés du désert d'Agafay partage conseils, inspirations et récits pour votre prochaine escapade depuis Marrakech."}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href={isEn ? "/en/desert-agafay" : "/desert-agafay"} className="text-amber hover:underline cursor-pointer">
                {isEn ? "Agafay Desert Guide" : "Guide du Désert d'Agafay"}
              </Link>
              <Link href={isEn ? "/en/les-tentes" : "/les-tentes"} className="text-amber hover:underline cursor-pointer">
                {isEn ? "Our Luxury Tents" : "Nos Tentes de Luxe"}
              </Link>
              <Link href={isEn ? "/en/day-pass" : "/day-pass"} className="text-amber hover:underline cursor-pointer">
                Day Pass
              </Link>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link href={isEn ? "/en/blog" : "/blog"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber transition-colors luxury-label">
              <ArrowLeft className="w-4 h-4" />
              {isEn ? "All articles" : "Tous les articles"}
            </Link>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-background pb-16 md:pb-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="heading-editorial text-2xl md:text-3xl text-foreground mb-8">
              {isEn ? "Related Articles" : "Articles similaires"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={isEn ? `/en/blog/${rp.slug}` : `/blog/${rp.slug}`} className="group block cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
                    {rp.image ? (
                      <img
                        src={rp.image.split(",")[0]}
                        alt={isEn && rp.titleEn ? rp.titleEn : rp.title}
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
                    {isEn && rp.titleEn ? rp.titleEn : rp.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        label={isEn ? "Arabian Desert Home" : "Arabian Desert Home"}
        title={isEn ? "Experience the Desert" : "Vivez le Désert"}
        buttonText={isEn ? "Book Your Stay" : "Réserver"}
        buttonHref="/reservez-votre-sejour"
      />
    </>
  );
}
