"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ============================================
   CTASection - Cinematic Desert Call-to-Action
   Full-bleed background + Glass content card
   ============================================ */

interface CTASectionProps {
  label: string;
  title: ReactNode;
  description?: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: ReactNode;
  secondaryButton?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  alignment?: "center" | "left";
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const revealUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: smoothEase },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.8, delay, ease: smoothEase },
  }),
};

export function CTASection({
  label,
  title,
  description,
  buttonText,
  buttonHref,
  buttonIcon,
  secondaryButton,
  backgroundImage = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/night.png",
  alignment = "center",
}: CTASectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const isLeft = alignment === "left";

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-10 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Cinematic warm overlay */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        {/* Warm amber tint */}
        <div className="absolute inset-0 bg-amber/[0.04]" />
      </div>

      {/* Animated ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Vignette border glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto ${
          isLeft ? "text-left" : "text-center"
        }`}
      >
        {/* Glass card container */}
        <div
          className={`glass-premium p-10 md:p-16 ${
            isLeft ? "md:mr-auto md:ml-0 max-w-3xl" : "max-w-3xl mx-auto"
          }`}
        >
          {/* Label */}
          <motion.span
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0}
            className="luxury-label text-amber block mb-5"
          >
            {label}
          </motion.span>

          {/* Title */}
          <motion.h2
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.15}
            className="heading-display text-3xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            {title}
          </motion.h2>

          {/* Divider */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.3}
            className={`divider-accent-wide mb-8 ${
              isLeft ? "origin-left" : "origin-center mx-auto"
            } ${isLeft ? "" : "max-w-[120px]"}`}
          />

          {/* Description */}
          {description && (
            <motion.p
              variants={revealUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={0.4}
              className={`body-editorial text-muted-foreground mb-10 max-w-lg ${
                isLeft ? "" : "mx-auto"
              }`}
            >
              {description}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            variants={revealUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={0.5}
            className={`flex items-center gap-4 flex-wrap ${
              isLeft ? "justify-start" : "justify-center"
            }`}
          >
            <Link
              href={buttonHref}
              className="btn-primary inline-flex items-center gap-3 cursor-pointer hover:no-underline"
            >
              {buttonIcon}
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="luxury-label text-amber/60 hover:text-amber transition-colors duration-400 cursor-pointer"
              >
                {secondaryButton.text}
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
