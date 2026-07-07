"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  createdAt: string;
  titleEn: string;
  excerptEn: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

function PostCard({ post, index, isEn }: { post: BlogPost; index: number; isEn: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const title = isEn && post.titleEn ? post.titleEn : post.title;
  const excerpt = isEn && post.excerptEn ? post.excerptEn : post.excerpt;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: smoothEase }}
      className="group glass-card card-warm overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden relative">
        {post.image ? (
          <img
            src={post.image}
            alt={title}
            className="w-full h-full object-cover img-luxury transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-amber/[0.06] flex items-center justify-center">
            <span className="mono-number text-amber/20 text-5xl">✦</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-4 left-4 bg-amber/90 text-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full luxury-label">
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-7">
        <h2 className="heading-editorial text-xl md:text-2xl mb-3 group-hover:text-amber transition-colors duration-300 line-clamp-2">
          {title}
        </h2>
        <div className="divider-accent max-w-[50px] mb-4" />
        {excerpt && (
          <p className="body-editorial text-sm text-muted-foreground mb-5 line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/60 mb-5">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-amber/50" />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-amber/50" />
            {format(new Date(post.createdAt), "d MMM yyyy", { locale: isEn ? undefined : frLocale })}
          </span>
        </div>

        <Link
          href={isEn ? `/en/blog/${post.slug}` : `/blog/${post.slug}`}
          className="btn-outline inline-flex items-center justify-center gap-2 text-sm mt-auto"
        >
          {isEn ? "Read article" : "Lire l'article"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function BlogContent({ posts }: { posts: BlogPost[] }) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative py-24 md:py-32 px-6 md:px-10 bg-warm-black overflow-hidden">
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber/[0.03] blob-1 blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber block mb-5"
          >
            {isEn ? "Articles & Inspirations" : "Articles & Inspirations"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: smoothEase }}
            className="heading-display text-5xl md:text-7xl text-white mb-6"
          >
            {isEn ? "The Blog" : "Le Blog"}{" "}
            <span className="italic text-amber">{isEn ? "of the Desert" : "du Désert"}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="body-editorial text-white/50 text-lg max-w-xl mx-auto"
          >
            {isEn
              ? "Stories, tips and inspirations from the heart of the Agafay Desert."
              : "Récits, conseils et inspirations au cœur du désert d'Agafay."}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.45, ease: smoothEase }}
            className="divider-accent max-w-[80px] mx-auto mt-8"
          />
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16 md:py-24 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <span className="luxury-label text-amber block mb-3">
                {isEn ? "Coming soon" : "Bientôt disponible"}
              </span>
              <p className="body-editorial text-muted-foreground">
                {isEn ? "No articles published yet." : "Aucun article publié pour le moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} isEn={isEn} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
