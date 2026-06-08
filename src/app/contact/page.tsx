"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Instagram,
  Facebook,
  Clock,
  Compass,
} from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/context";

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const contactCards = [
  {
    icon: MapPin,
    labelKey: "contact.address",
    valueKey: "contact.addressValue",
  },
  {
    icon: Phone,
    labelKey: "contact.phone",
    valueKey: "contact.phoneValue",
  },
  {
    icon: Mail,
    labelKey: "contact.email",
    valueKey: "contact.emailValue",
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/arabiandeserthome", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/arabiandeserthome", label: "Facebook" },
  { icon: Compass, href: "https://wa.me/212667370206", label: "WhatsApp" },
];

export default function ContactPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const mapInView = useInView(mapRef, { once: true, margin: "-80px" });

  const { toast } = useToast();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: t("contact.toastSuccess"),
          description: t("contact.toastSuccessDesc"),
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: t("contact.toastError"),
          description: t("contact.toastErrorDesc"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("contact.toastError"),
        description: t("contact.toastErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Refined Typographic Hero with Contact Cards */}
        <section ref={heroRef} className="bg-gradient-to-b from-amber/[0.03] to-background">
          {/* Top part — Clean typographic header */}
          <div className="py-16 md:py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: smoothEase }}
                className="luxury-label text-amber/80 mb-4 block"
              >
                {t("contact.heroLabel")}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
                className="heading-display text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
              >
                {t("contact.heroTitle")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="body-editorial text-muted-foreground mt-4 max-w-md mx-auto"
              >
                {t("contact.heroSubtitle")}
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={heroInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="divider-accent mt-8 max-w-[120px] origin-center mx-auto"
              />
            </div>
          </div>

          {/* Bottom part — Contact info cards row */}
          <div className="px-6 pb-16 md:pb-24">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactCards.map((info, index) => (
                  <motion.div
                    key={info.labelKey}
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.15, ease: smoothEase }}
                    className="glass-card card-warm p-8 text-center"
                  >
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-amber" />
                    </div>
                    <p className="luxury-label text-amber/60 mb-3">
                      {t(info.labelKey)}
                    </p>
                    <p className="text-sm text-muted-foreground body-editorial">
                      {t(info.valueKey)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form + Map Side by Side */}
        <section ref={formRef} className="py-20 md:py-28 px-6 md:px-10 pattern-organic opacity-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Left: Form */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase }}
                  className="mb-4"
                >
                  <span className="mono-number text-amber/10 text-6xl md:text-7xl leading-none">
                    {t("contact.formSectionNumber")}
                  </span>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase }}
                  className="luxury-label text-amber block mb-4"
                >
                  {t("contact.formLabel")}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
                  className="heading-editorial text-3xl md:text-4xl mb-12"
                >
                  {t("contact.formTitle1")}{" "}
                  <span className="italic text-amber">{t("contact.formTitle2")}</span>
                </motion.h2>

                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  animate={formInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="luxury-label text-xs">
                        {t("contact.nameLabel")} *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                        placeholder={t("contact.namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="luxury-label text-xs">
                        {t("contact.emailLabel")} *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="luxury-label text-xs">
                        {t("contact.phoneLabel")}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                        placeholder="+212 6XX-XXX-XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="luxury-label text-xs">
                        {t("contact.subjectLabel")} *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                        placeholder={t("contact.subjectPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="luxury-label text-xs">
                      {t("contact.messageLabel")} *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 resize-none transition-all duration-300"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                  </div>

                  <div className="flex justify-start pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
                          {t("contact.sending")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {t("contact.sendButton")}
                        </span>
                      )}
                    </button>
                  </div>
                </motion.form>
              </div>

              {/* Right: Map + Social */}
              <div className="flex flex-col gap-8">
                {/* Map placeholder */}
                <motion.div
                  ref={mapRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={mapInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
                  className="glass-card card-warm overflow-hidden flex-1 min-h-[300px] relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-black/20 via-background to-amber/[0.04] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center mb-4">
                      <MapPin className="w-7 h-7 text-amber" />
                    </div>
                    <p className="heading-editorial text-lg mb-2">
                      {t("contact.mapPlaceholder")}
                    </p>
                    <p className="text-sm text-muted-foreground body-editorial max-w-xs">
                      {t("contact.addressValue")}
                    </p>
                    <div className="mt-4 px-5 py-2.5 rounded-full bg-amber/10 border border-amber/15">
                      <p className="luxury-label text-amber text-[0.6rem]">
                        <Clock className="w-3 h-3 inline mr-1.5" />
                        30 min from Marrakech
                      </p>
                    </div>
                  </div>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />
                </motion.div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={mapInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                  className="glass-card card-warm p-6"
                >
                  <p className="luxury-label text-amber/60 mb-4 text-center">
                    {t("contact.socialLabel")}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-amber/15 bg-amber/[0.04] flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/40 hover:bg-amber/[0.10] hover:shadow-lg hover:shadow-amber/10 transition-all duration-300 cursor-pointer"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
