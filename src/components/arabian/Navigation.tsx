"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Suites", href: "#suites" },
  { label: "Adventures", href: "#adventures" },
  { label: "Dining", href: "#dining" },
  { label: "Events", href: "#events" },
];

interface NavigationProps {
  onBookingOpen: () => void;
}

export function Navigation({ onBookingOpen }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-wide leading-tight">
                Arabian
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground leading-tight">
                Desert Home
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-luxury-label text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA + Theme + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors duration-300"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <Button
              onClick={onBookingOpen}
              variant="outline"
              className="hidden md:flex text-luxury-label border-gold/40 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold rounded-none px-6"
            >
              Reserve
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-24 px-8"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="font-serif text-4xl py-3 border-b border-border/30 hover:text-gold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    onBookingOpen();
                  }}
                  className="w-full bg-gold text-charcoal hover:bg-gold-light rounded-none py-6 text-luxury-label"
                >
                  Reserve Your Escape
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
