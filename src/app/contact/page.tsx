"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Douar Ait Said Lchou, Agafay, Marrakech",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+212 667-370-206",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@arabiandeserthome.com",
  },
];

export default function ContactPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  const { toast } = useToast();

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
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais.",
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
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
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
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-charcoal">
          <div className="absolute inset-0 bg-charcoal" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold/80 mb-4"
            >
              Nous Contacter
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Contact
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="divider-gold-wide mt-8 max-w-[120px] origin-center"
            />
          </div>
        </section>

        {/* Contact Info Cards */}
        <section ref={infoRef} className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={infoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                  className="p-8 border border-border/50 hover:border-gold/30 transition-all duration-500 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-luxury-label text-gold/60 mb-2">{info.label}</p>
                  <p className="text-sm text-muted-foreground">{info.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section ref={formRef} className="py-12 md:py-20 px-6 md:px-10 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold block text-center mb-4"
            >
              Écrivez-nous
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-3xl md:text-4xl text-center mb-12"
            >
              Envoyez votre <span className="italic">message</span>
            </motion.h2>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-luxury-label text-xs">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background border-border/50 focus:border-gold/50 rounded-none"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-luxury-label text-xs">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background border-border/50 focus:border-gold/50 rounded-none"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-luxury-label text-xs">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background border-border/50 focus:border-gold/50 rounded-none"
                    placeholder="+212 6XX-XXX-XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-luxury-label text-xs">
                    Sujet
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background border-border/50 focus:border-gold/50 rounded-none"
                    placeholder="Objet de votre message"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-luxury-label text-xs">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="bg-background border-border/50 focus:border-gold/50 rounded-none resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold text-charcoal hover:bg-gold-light rounded-none px-10 py-6 text-luxury-label"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Envoyer
                      <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
