"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  Minus,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Users,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
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
import { useLanguage } from "@/lib/i18n/context";

interface Suite {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxGuests: number;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export default function ReservezPage() {
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: "-80px" });

  const { toast } = useToast();
  const { language, t } = useLanguage();
  const dateLocale = language === "fr" ? fr : enUS;

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
          title: t("booking.reservationReceived"),
          description: t("booking.conciergeContact"),
        });
      } else {
        toast({
          title: t("booking.somethingWrong"),
          description: t("booking.tryAgain"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("booking.somethingWrong"),
        description: t("booking.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: t("booking.step1Label") },
    { number: 2, label: t("booking.step2Label") },
    { number: 3, label: "✓" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Section — Night desert with warm gradients */}
        <section ref={heroRef} className="relative h-[60vh] min-h-[450px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/night.png"
              alt="Book your stay at Arabian Desert Home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 gradient-warm" />
            <div className="absolute inset-0 gradient-amber" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Decorative blobs */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-amber/[0.04] blob-1" />
          <div className="absolute bottom-20 left-10 w-56 h-56 bg-amber/[0.03] blob-2" />

          {/* Grain overlay */}
          <div className="absolute inset-0 grain-overlay" />

          <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10 max-w-7xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: smoothEase }}
              className="luxury-label text-amber/80 mb-4"
            >
              {t("booking.label")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
              className="heading-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {t("booking.title1")} <br />
              <span className="italic text-amber">{t("booking.title2")}</span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={heroInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="divider-accent mt-8 max-w-[120px] origin-left"
            />
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-6 h-10 rounded-full border border-amber/30 flex items-start justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-amber"
              />
            </div>
          </motion.div>
        </section>

        {/* Booking Form */}
        <section ref={formRef} className="relative py-20 md:py-28 px-6 md:px-10 pattern-dots">
          <div className="max-w-3xl mx-auto">
            {/* Step Indicators — Rounded amber pills */}
            <div className="flex items-center justify-center gap-3 mb-16">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-400 cursor-pointer ${
                        currentStep > step.number
                          ? "bg-amber text-warm-black shadow-lg shadow-amber/20"
                          : currentStep === step.number
                          ? "border-2 border-amber text-amber bg-amber/10"
                          : "border border-border text-muted-foreground bg-background/50"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm mono-number">{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] tracking-[0.1em] uppercase mt-2 hidden sm:block transition-colors duration-300 ${
                        currentStep >= step.number ? "text-amber" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-20 h-[2px] mx-3 rounded-full transition-colors duration-500 ${
                        currentStep > step.number
                          ? "bg-gradient-to-r from-amber to-amber-light"
                          : "bg-border"
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
                  transition={{ duration: 0.5, ease: smoothEase }}
                  className="glass-card card-warm p-8 md:p-10"
                >
                  <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                    {t("booking.step1Label")}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8 body-editorial">
                    {t("booking.description")}
                  </p>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="luxury-label text-xs">
                          {t("booking.firstName")} *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalChange}
                          required
                          className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                          placeholder={t("booking.firstNamePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="luxury-label text-xs">
                          {t("booking.lastName")} *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalChange}
                          required
                          className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                          placeholder={t("booking.lastNamePlaceholder")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="luxury-label text-xs">
                          {t("booking.email")} *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalChange}
                          required
                          className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                          placeholder={t("booking.emailPlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="luxury-label text-xs">
                          {t("booking.phone")} <span className="text-muted-foreground">{t("booking.phoneOptional")}</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={personalInfo.phone}
                          onChange={handlePersonalChange}
                          className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300"
                          placeholder={t("booking.phonePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-10">
                    <button
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStep1Valid}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {t("booking.continue")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
                  transition={{ duration: 0.5, ease: smoothEase }}
                  className="glass-card card-warm p-8 md:p-10"
                >
                  <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                    {t("booking.step2Label")}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-8 body-editorial">
                    {t("booking.description")}
                  </p>

                  <div className="space-y-6">
                    {/* Suite Select */}
                    <div className="space-y-2">
                      <Label className="luxury-label text-xs">
                        {t("booking.suite")} *
                      </Label>
                      <Select
                        value={stayInfo.suiteId}
                        onValueChange={(value) =>
                          setStayInfo((prev) => ({ ...prev, suiteId: value }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 transition-all duration-300">
                          <SelectValue placeholder={t("booking.selectSuite")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {suites.map((suite) => (
                            <SelectItem key={suite.id} value={suite.id}>
                              {suite.name} — {suite.price} {suite.currency}/nuit
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Suite Selection Cards */}
                    {suites.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {suites.map((suite) => (
                          <button
                            key={suite.id}
                            type="button"
                            onClick={() => setStayInfo((prev) => ({ ...prev, suiteId: suite.id }))}
                            className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-400 cursor-pointer ${
                              stayInfo.suiteId === suite.id
                                ? "border-2 border-amber bg-amber/[0.08] shadow-lg shadow-amber/10"
                                : "border border-border/50 bg-background/50 hover:border-amber/30 hover:bg-amber/[0.04]"
                            }`}
                          >
                            <p className="font-serif text-sm mb-1">{suite.name}</p>
                            <p className="mono-number text-amber text-lg">
                              {suite.price} <span className="text-xs text-muted-foreground font-sans font-normal">{suite.currency}/nuit</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                              <Users className="w-3.5 h-3.5 text-amber/60" />
                              <span>{suite.maxGuests} {suite.maxGuests > 1 ? (language === "fr" ? "personnes" : "persons") : (language === "fr" ? "personne" : "person")}</span>
                            </div>
                            {stayInfo.suiteId === suite.id && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                                <Check className="w-3 h-3 text-warm-black" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Date Pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking.checkIn")} *
                        </Label>
                        <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 hover:border-amber/30 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center flex-shrink-0">
                                <CalendarIcon className="w-4 h-4 text-amber/70" />
                              </div>
                              <span className={stayInfo.checkIn ? "text-foreground" : "text-muted-foreground"}>
                                {stayInfo.checkIn
                                  ? format(stayInfo.checkIn, "dd MMMM yyyy", { locale: dateLocale })
                                  : t("booking.selectDate")}
                              </span>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="p-0 max-w-auto w-auto rounded-3xl">
                            <DialogHeader className="sr-only">
                              <DialogTitle>{t("booking.checkIn")}</DialogTitle>
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
                              className="rounded-3xl"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking.checkOut")} *
                        </Label>
                        <Dialog open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 hover:border-amber/30 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center flex-shrink-0">
                                <CalendarIcon className="w-4 h-4 text-amber/70" />
                              </div>
                              <span className={stayInfo.checkOut ? "text-foreground" : "text-muted-foreground"}>
                                {stayInfo.checkOut
                                  ? format(stayInfo.checkOut, "dd MMMM yyyy", { locale: dateLocale })
                                  : t("booking.selectDate")}
                              </span>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="p-0 max-w-auto w-auto rounded-3xl">
                            <DialogHeader className="sr-only">
                              <DialogTitle>{t("booking.checkOut")}</DialogTitle>
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
                              className="rounded-3xl"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Guests Counter */}
                    <div className="space-y-2">
                      <Label className="luxury-label text-xs">
                        {t("booking.guests")}
                      </Label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={decrementGuests}
                          disabled={stayInfo.guests <= 1}
                          className="w-10 h-10 rounded-full border border-border/50 hover:border-amber/30 hover:bg-amber/[0.06] flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-2xl mono-number text-amber w-12 text-center">
                          {stayInfo.guests}
                        </span>
                        <button
                          type="button"
                          onClick={incrementGuests}
                          disabled={stayInfo.guests >= 10}
                          className="w-10 h-10 rounded-full border border-border/50 hover:border-amber/30 hover:bg-amber/[0.06] flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-2">
                      <Label htmlFor="specialReqs" className="luxury-label text-xs">
                        {t("booking.specialRequests")} <span className="text-muted-foreground">{t("booking.specialRequestsOptional")}</span>
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
                        className="rounded-2xl border-border/50 focus:border-amber/50 focus:ring-amber/20 bg-background/50 resize-none transition-all duration-300"
                        placeholder={t("booking.specialRequestsPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-10">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-outline inline-flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("booking.back")}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isStep2Valid || isSubmitting}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
                          {t("booking.submitting")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {t("booking.submit")}
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: smoothEase }}
                  className="glass-card card-warm p-8 md:p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-amber/30 bg-amber/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-amber" />
                  </div>
                  <h2 className="heading-display text-3xl md:text-4xl mb-4">
                    {t("booking.thankYou")}
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8 body-editorial">
                    {t("booking.successMessage")}
                  </p>

                  {/* Booking Summary */}
                  <div className="max-w-md mx-auto glass-card p-8 text-left space-y-4 mb-10">
                    <p className="luxury-label text-amber mb-4">
                      {language === "fr" ? "Résumé de votre séjour" : "Your stay summary"}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking.suite")}</span>
                      <span>
                        {suites.find((s) => s.id === stayInfo.suiteId)?.name || "—"}
                      </span>
                    </div>
                    <div className="divider-accent" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking.checkIn")}</span>
                      <span>
                        {stayInfo.checkIn
                          ? format(stayInfo.checkIn, "dd MMMM yyyy", { locale: dateLocale })
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking.checkOut")}</span>
                      <span>
                        {stayInfo.checkOut
                          ? format(stayInfo.checkOut, "dd MMMM yyyy", { locale: dateLocale })
                          : "—"}
                      </span>
                    </div>
                    <div className="divider-accent" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking.guests")}</span>
                      <span>{stayInfo.guests}</span>
                    </div>
                  </div>

                  <button
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
                    className="btn-outline inline-flex items-center gap-2 cursor-pointer"
                  >
                    {language === "fr" ? "Nouvelle réservation" : "New Reservation"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
