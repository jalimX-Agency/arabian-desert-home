"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal dark:bg-charcoal text-white/70">
      {/* Pre-footer CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 text-center">
          <p className="text-luxury-label text-gold/60 mb-4">
            Réservez Votre Séjour
          </p>
          <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">
            Le désert vous attend
          </h3>
          <Link
            href="/reservez-votre-sejour"
            className="inline-flex items-center gap-2 border border-gold/50 text-gold px-10 py-4 text-luxury-label hover:bg-gold/10 transition-all duration-300"
          >
            Réserver Maintenant
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-wide text-white leading-tight">
                  Arabian
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 leading-tight">
                  Desert Home
                </span>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Bivouac de luxe dans le désert d&apos;Agafay, à 30 minutes de Marrakech.
              Six hectares de pure splendeur pour une expérience inoubliable.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-luxury-label text-gold/60 mb-6">Explorer</h4>
            <div className="space-y-3">
              {[
                { label: "L'ADH", href: "/" },
                { label: "Nos Tentes", href: "/les-tentes" },
                { label: "Restaurant", href: "/restaurant" },
                { label: "Activités", href: "/les-activites" },
                { label: "Day Pass", href: "/day-pass" },
                { label: "Événements", href: "/les-evenements" },
                { label: "Spa", href: "/spa" },
                { label: "À Propos", href: "/apropo" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-white/40 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-luxury-label text-gold/60 mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" />
                <span className="text-sm text-white/40">
                  Douar Ait Said Lchou,
                  <br />
                  Agafay, Marrakech
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold/50 shrink-0" />
                <span className="text-sm text-white/40">+212 667-370-206</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold/50 shrink-0" />
                <span className="text-sm text-white/40">
                  info@arabiandeserthome.com
                </span>
              </div>
            </div>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="text-luxury-label text-gold/60 mb-6">Suivez-nous</h4>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-white/30 mb-3">
              Restez informé de nos offres
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-gold/50 focus:outline-none"
              />
              <button className="bg-gold text-charcoal px-4 py-2.5 text-luxury-label hover:bg-gold-light transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Arabian Desert Home. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Conditions générales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
