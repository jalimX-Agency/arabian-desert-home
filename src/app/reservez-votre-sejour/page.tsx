"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CalendarIcon, Minus, Plus, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Suite {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxGuests: number;
}

const steps = [
  { number: 1, label: "Vos Coordonnées" },
  { number: 2, label: "Votre Séjour" },
  { number: 3, label: "Confirmation" },
];

export default function ReservezPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: "-80px" });

  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [suites, setSuites] = useState<Suite[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [stayInfo, setStayInfo] = useState({
    suiteId: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: 2,
    specialReqs: "",
  });

  useEffect(() => {
    async function fetchSuites() {
      try {
        const res = await fetch("/api/suites");
        const data = await res.json();
        setSuites(data);
      } catch (error) {
        console.error("Failed to fetch suites:", error);
      }
    }
    fetchSuites();
  }, []);

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const incrementGuests = useCallback(() => {
    setStayInfo((prev) => ({
      ...prev,
      guests: Math.min(prev.guests + 1, 10),
    }));
  }, []);

  const decrementGuests = useCallback(() => {
    setStayInfo((prev) => ({
      ...prev,
      guests: Math.max(prev.guests - 1, 1),
    }));
  }, []);

  const isStep1Valid =
    personalInfo.firstName.trim() !== "" &&
    personalInfo.lastName.trim() !== "" &&
    personalInfo.email.trim() !== "";

  const isStep2Valid =
    stayInfo.suiteId !== "" &&
    stayInfo.checkIn !== undefined &&
    stayInfo.checkOut !== undefined;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedSuite = suites.find((s) => s.id === stayInfo.suiteId);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone || undefined,
          suiteId: stayInfo.suiteId,
          checkIn: stayInfo.checkIn?.toISOString(),
          checkOut: stayInfo.checkOut?.toISOString(),
          guests: stayInfo.guests,
          specialReqs: stayInfo.specialReqs || undefined,
          totalAmount: selectedSuite?.price || 0,
        }),
      });

      if (res.ok) {
        setCurrentStep(3);
        toast({
          title: "Réservation confirmée",
          description: "Nous vous contacterons sous 24h pour confirmer votre séjour.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer la réservation. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
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
        <section ref={heroRef} className="relative h-[60vh] min-h-[450px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero.png"
              alt="Réservez votre séjour au désert d'Agafay"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10 max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-terracotta/80 mb-4"
            >
              Séjournez au cœur du désert d&apos;Agafay
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="heading-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Réservez Votre <br />
              <span className="italic text-terracotta">Séjour</span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="h-px w-16 bg-terracotta/30 mt-8 max-w-xs origin-left"
            />
          </div>
        </section>

        {/* Booking Form */}
        <section ref={formRef} className="py-20 md:py-28 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-4 mb-16">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center border transition-all duration-500 ${
                        currentStep > step.number
                          ? "bg-terracotta border-terracotta text-obsidian"
                          : currentStep === step.number
                          ? "border-terracotta text-terracotta"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm text-mono-number">{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] tracking-[0.1em] uppercase mt-2 hidden sm:block ${
                        currentStep >= step.number ? "text-terracotta" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-20 h-px mx-3 transition-colors duration-500 ${
                        currentStep > step.number ? "bg-terracotta" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                    Vos Coordonnées
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    Renseignez vos informations personnelles pour la réservation
                  </p>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-luxury-label text-xs">
                          Prénom *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalChange}
                          required
                          className="border-border/50 focus:border-terracotta/50 rounded-none"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-luxury-label text-xs">
                          Nom *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalChange}
                          required
                          className="border-border/50 focus:border-terracotta/50 rounded-none"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-luxury-label text-xs">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalChange}
                          required
                          className="border-border/50 focus:border-terracotta/50 rounded-none"
                          placeholder="votre@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-luxury-label text-xs">
                          Téléphone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={handlePersonalChange}
                          className="border-border/50 focus:border-terracotta/50 rounded-none"
                          placeholder="+212 6XX-XXX-XXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-10">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStep1Valid}
                      className="bg-terracotta text-obsidian hover:bg-terracotta-light rounded-none px-8 py-5 text-luxury-label tracking-[0.2em] disabled:opacity-50"
                    >
                       Suivant
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Stay Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                    Votre Séjour
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8">
                    Choisissez votre suite et vos dates de séjour
                  </p>

                  <div className="space-y-6">
                    {/* Suite Select */}
                    <div className="space-y-2">
                      <Label className="text-luxury-label text-xs">Suite / Chambre *</Label>
                      <Select
                        value={stayInfo.suiteId}
                        onValueChange={(value) =>
                          setStayInfo((prev) => ({ ...prev, suiteId: value }))
                        }
                      >
                        <SelectTrigger className="w-full border-border/50 focus:border-terracotta/50 rounded-none">
                          <SelectValue placeholder="Sélectionnez votre suite" />
                        </SelectTrigger>
                        <SelectContent>
                          {suites.map((suite) => (
                            <SelectItem key={suite.id} value={suite.id}>
                              {suite.name} — {suite.price} {suite.currency}/nuit
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-luxury-label text-xs">Date d&apos;arrivée *</Label>
                        <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-border/50 hover:border-terracotta/50 rounded-none text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-terracotta/70" />
                              {stayInfo.checkIn
                                ? format(stayInfo.checkIn, "dd MMMM yyyy", { locale: fr })
                                : "Sélectionnez une date"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 max-w-auto w-auto">
                            <DialogHeader className="sr-only">
                              <DialogTitle>Date d&apos;arrivée</DialogTitle>
                            </DialogHeader>
                            <Calendar
                              mode="single"
                              selected={stayInfo.checkIn}
                              onSelect={(date) => {
                                setStayInfo((prev) => ({ ...prev, checkIn: date }));
                                setCheckInOpen(false);
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-luxury-label text-xs">Date de départ *</Label>
                        <Dialog open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-border/50 hover:border-terracotta/50 rounded-none text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-terracotta/70" />
                              {stayInfo.checkOut
                                ? format(stayInfo.checkOut, "dd MMMM yyyy", { locale: fr })
                                : "Sélectionnez une date"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 max-w-auto w-auto">
                            <DialogHeader className="sr-only">
                              <DialogTitle>Date de départ</DialogTitle>
                            </DialogHeader>
                            <Calendar
                              mode="single"
                              selected={stayInfo.checkOut}
                              onSelect={(date) => {
                                setStayInfo((prev) => ({ ...prev, checkOut: date }));
                                setCheckOutOpen(false);
                              }}
                              disabled={(date) =>
                                date < (stayInfo.checkIn || new Date())
                              }
                              initialFocus
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Guests Counter */}
                    <div className="space-y-2">
                      <Label className="text-luxury-label text-xs">Nombre de convives</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={decrementGuests}
                          disabled={stayInfo.guests <= 1}
                          className="border-border/50 hover:border-terracotta/50 rounded-none h-10 w-10"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-2xl text-mono-number w-12 text-center">
                          {stayInfo.guests}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={incrementGuests}
                          disabled={stayInfo.guests >= 10}
                          className="border-border/50 hover:border-terracotta/50 rounded-none h-10 w-10"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                      <Label htmlFor="specialReqs" className="text-luxury-label text-xs">
                        Demandes spéciales
                      </Label>
                      <Textarea
                        id="specialReqs"
                        value={stayInfo.specialReqs}
                        onChange={(e) =>
                          setStayInfo((prev) => ({
                            ...prev,
                            specialReqs: e.target.value,
                          }))
                        }
                        rows={4}
                        className="border-border/50 focus:border-terracotta/50 rounded-none resize-none"
                        placeholder="Toute demande particulière (allergies, anniversaire, etc.)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-10">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="border-border/50 hover:border-terracotta/50 rounded-none px-8 py-5 text-luxury-label tracking-[0.2em]"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStep2Valid || isSubmitting}
                      className="bg-terracotta text-obsidian hover:bg-terracotta-light rounded-none px-8 py-5 text-luxury-label tracking-[0.2em] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                          Réservation...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Confirmer
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-8 border border-terracotta/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-terracotta" />
                  </div>
                  <h2 className="heading-editorial text-3xl md:text-4xl mb-4">
                    Réservation <span className="italic">Confirmée</span>
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    Merci {personalInfo.firstName} ! Votre demande de réservation a été enregistrée.
                    Notre équipe vous contactera sous 24 heures pour confirmer les détails de votre séjour.
                  </p>

                  {/* Booking Summary */}
                  <div className="max-w-md mx-auto p-8 border border-terracotta/15 text-left space-y-4 mb-10">
                    <p className="text-luxury-label text-terracotta mb-4">Résumé de votre séjour</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Suite</span>
                      <span>
                        {suites.find((s) => s.id === stayInfo.suiteId)?.name || "—"}
                      </span>
                    </div>
                    <div className="divider-accent" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Arrivée</span>
                      <span>
                        {stayInfo.checkIn
                          ? format(stayInfo.checkIn, "dd MMMM yyyy", { locale: fr })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Départ</span>
                      <span>
                        {stayInfo.checkOut
                          ? format(stayInfo.checkOut, "dd MMMM yyyy", { locale: fr })
                          : "—"}
                      </span>
                    </div>
                    <div className="divider-accent" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Convives</span>
                      <span>{stayInfo.guests}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setPersonalInfo({ firstName: "", lastName: "", email: "", phone: "" });
                      setStayInfo({
                        suiteId: "",
                        checkIn: undefined,
                        checkOut: undefined,
                        guests: 2,
                        specialReqs: "",
                      });
                    }}
                    variant="outline"
                    className="border-terracotta/40 text-terracotta hover:bg-terracotta/10 hover:text-terracotta hover:border-terracotta rounded-none px-8 py-5 text-luxury-label tracking-[0.2em]"
                  >
                    Nouvelle réservation
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
