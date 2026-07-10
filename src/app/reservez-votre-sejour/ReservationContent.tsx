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
  Baby,
  Tent,
  Bike,
  Sun,
  Sparkles,
} from "lucide-react";
import { format, type Locale } from "date-fns";
import { fr as frLocale, enUS, es as esLocale, it as itLocale } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, pickLocalized } from "@/lib/i18n/context";

const DATE_LOCALES = { fr: frLocale, en: enUS, es: esLocale, it: itLocale };

interface Suite {
  id: string;
  name: string;
  nameEn?: string;
  nameEs?: string;
  nameIt?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  maxGuests: number;
  maxChildren: number;
  childPricePercent: number;
  image?: string;
}

interface Activity {
  id: string;
  name: string;
  nameEn?: string;
  nameEs?: string;
  nameIt?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  childPricePercent: number;
  image?: string;
  duration?: string;
}

interface DayPass {
  id: string;
  name: string;
  nameEn?: string;
  nameEs?: string;
  nameIt?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  childPricePercent: number;
  image?: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

type ServiceType = "suite" | "activity" | "daypass";

function CarouselWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  }

  return (
    <div className="relative group/carousel">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center text-amber hover:bg-amber hover:text-warm-black hover:border-amber transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Previous"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-none"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full bg-background border border-border/60 shadow-md flex items-center justify-center text-amber hover:bg-amber hover:text-warm-black hover:border-amber transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
        aria-label="Next"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function Counter({
  value,
  min,
  max,
  onChange,
  label,
  icon: Icon,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-amber" />
        </div>
        <span className="text-sm body-editorial">{label}</span>
        <span className="text-xs text-muted-foreground">({min}–{max})</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-border/50 hover:border-amber/30 hover:bg-amber/[0.06] flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xl mono-number text-amber w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-border/50 hover:border-amber/30 hover:bg-amber/[0.06] flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function DatePicker({
  label,
  value,
  onChange,
  disableBefore,
  placeholder,
  dateFnsLocale,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  disableBefore?: Date;
  placeholder: string;
  dateFnsLocale: Locale;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <Label className="luxury-label text-xs">{label} *</Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 hover:border-amber/30 px-4 py-3 text-left text-sm transition-all duration-300 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-4 h-4 text-amber/70" />
            </div>
            <span className={value ? "text-foreground" : "text-muted-foreground"}>
              {value ? format(value, "dd MMMM yyyy", { locale: dateFnsLocale }) : placeholder}
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-auto w-auto rounded-3xl">
          <DialogHeader className="sr-only"><DialogTitle>{label}</DialogTitle></DialogHeader>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => { onChange(d); setOpen(false); }}
            disabled={(d) => d < (disableBefore ?? new Date(new Date().setHours(0, 0, 0, 0)))}
            initialFocus
            className="rounded-3xl"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ReservationContent() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const { toast } = useToast();
  const { t, language } = useLanguage();
  const dateFnsLocale = DATE_LOCALES[language];
  const localizeName = (base: string, en?: string, es?: string, it?: string) =>
    pickLocalized(language, base, en, es, it);

  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState<ServiceType>("suite");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data
  const [suites, setSuites] = useState<Suite[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dayPasses, setDayPasses] = useState<DayPass[]>([]);

  // Personal info
  const [personal, setPersonal] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  // Suite state
  const [selectedSuiteId, setSelectedSuiteId] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  // Activity/daypass state
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [selectedDayPassId, setSelectedDayPassId] = useState("");
  const [singleDate, setSingleDate] = useState<Date | undefined>();

  // Shared counters
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialReqs, setSpecialReqs] = useState("");

  const selectedSuite = suites.find((s) => s.id === selectedSuiteId);
  const maxAdults = serviceType === "suite" ? (selectedSuite?.maxGuests ?? 10) : 20;
  const maxChildren = serviceType === "suite" ? (selectedSuite?.maxChildren ?? 6) : 10;

  // Clamp adults/children when suite changes
  useEffect(() => {
    if (serviceType === "suite" && selectedSuite) {
      if (adults > selectedSuite.maxGuests) setAdults(selectedSuite.maxGuests);
      if (children > selectedSuite.maxChildren) setChildren(selectedSuite.maxChildren);
    }
  }, [selectedSuiteId]);

  useEffect(() => {
    fetch("/api/suites").then((r) => r.json()).then(setSuites).catch(() => {});
    fetch("/api/activities").then((r) => r.json()).then(setActivities).catch(() => {});
    fetch("/api/day-passes").then((r) => r.json()).then(setDayPasses).catch(() => {});
  }, []);

  // Suite price is flat (whole tent per night, not per person)
  function calcTotal(): number {
    if (serviceType === "suite" && selectedSuite && checkIn && checkOut) {
      const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
      return selectedSuite.price * nights;
    }
    if (serviceType === "activity") {
      const act = activities.find((a) => a.id === selectedActivityId);
      if (!act) return 0;
      return adults * act.price + children * Math.round(act.price * act.childPricePercent / 100);
    }
    if (serviceType === "daypass") {
      const pass = dayPasses.find((p) => p.id === selectedDayPassId);
      if (!pass) return 0;
      return adults * pass.price + children * Math.round(pass.price * pass.childPricePercent / 100);
    }
    return 0;
  }

  function selectedCurrency(): string {
    if (serviceType === "suite") return selectedSuite?.currency ?? "MAD";
    if (serviceType === "activity") return activities.find((a) => a.id === selectedActivityId)?.currency ?? "MAD";
    return dayPasses.find((p) => p.id === selectedDayPassId)?.currency ?? "MAD";
  }

  const isPersonalValid =
    personal.firstName.trim() !== "" &&
    personal.lastName.trim() !== "" &&
    personal.email.trim() !== "";

  const isDetailsValid =
    serviceType === "suite"
      ? selectedSuiteId !== "" && checkIn !== undefined && checkOut !== undefined
      : serviceType === "activity"
      ? selectedActivityId !== "" && singleDate !== undefined
      : selectedDayPassId !== "" && singleDate !== undefined;

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        ...personal,
        serviceType,
        guests: adults,
        children,
        specialReqs: specialReqs || undefined,
      };

      if (serviceType === "suite") {
        payload.suiteId = selectedSuiteId;
        payload.checkIn = checkIn?.toISOString();
        payload.checkOut = checkOut?.toISOString();
      } else if (serviceType === "activity") {
        payload.activityId = selectedActivityId;
        payload.date = singleDate?.toISOString();
      } else {
        payload.dayPassId = selectedDayPassId;
        payload.date = singleDate?.toISOString();
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStep(4);
      } else {
        toast({ title: t("booking2.errorTitle"), description: t("booking2.errorDesc"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("booking2.errorTitle"), description: t("booking2.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [personal, serviceType, adults, children, specialReqs, selectedSuiteId, checkIn, checkOut, selectedActivityId, selectedDayPassId, singleDate]);

  const stepLabels = [
    t("booking2.stepService"),
    t("booking2.stepInfo"),
    t("booking2.stepDetails"),
    "✓",
  ];

  const total = calcTotal();

  function resetAll() {
    setStep(1);
    setPersonal({ firstName: "", lastName: "", email: "", phone: "" });
    setSelectedSuiteId(""); setCheckIn(undefined); setCheckOut(undefined);
    setSelectedActivityId(""); setSelectedDayPassId(""); setSingleDate(undefined);
    setAdults(2); setChildren(0); setSpecialReqs("");
  }

  function getSuccessSummaryName(): string {
    if (serviceType === "suite") {
      const s = suites.find((x) => x.id === selectedSuiteId);
      return s ? localizeName(s.name, s.nameEn, s.nameEs, s.nameIt) : "—";
    }
    if (serviceType === "activity") {
      const a = activities.find((x) => x.id === selectedActivityId);
      return a ? localizeName(a.name, a.nameEn, a.nameEs, a.nameIt) : "—";
    }
    const p = dayPasses.find((x) => x.id === selectedDayPassId);
    return p ? localizeName(p.name, p.nameEn, p.nameEs, p.nameIt) : "—";
  }

  const serviceTypeLabels: Record<ServiceType, string> = {
    suite: t("booking2.serviceTypeSuiteLabel"),
    activity: t("booking2.serviceTypeActivityLabel"),
    daypass: "Day Pass",
  };

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-[50vh] min-h-[380px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/DJI_0020-scaled.webp"
            alt="Réservez votre séjour au désert d'Agafay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 gradient-warm" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute inset-0 grain-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-14 md:pb-20 px-6 md:px-10 max-w-7xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="luxury-label text-amber/80 mb-3"
          >
            {t("booking2.heroLabel")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: smoothEase }}
            className="heading-display text-white text-4xl sm:text-5xl md:text-6xl"
          >
            {t("booking2.heroTitle1")}{" "}
            <span className="italic text-amber">{t("booking2.heroTitle2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* Form */}
      <section className="relative py-16 md:py-24 px-6 md:px-10 pattern-dots">
        <div className="max-w-3xl mx-auto">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              return (
                <div key={n} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-400 ${
                        step > n
                          ? "bg-amber text-warm-black shadow-lg shadow-amber/20"
                          : step === n
                          ? "border-2 border-amber text-amber bg-amber/10"
                          : "border border-border text-muted-foreground bg-background/50"
                      }`}
                    >
                      {step > n ? <Check className="w-4 h-4" /> : <span className="text-sm mono-number">{n}</span>}
                    </div>
                    <span className={`text-[9px] tracking-[0.1em] uppercase mt-1.5 hidden sm:block transition-colors duration-300 ${step >= n ? "text-amber" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-8 md:w-14 h-[2px] mx-2 rounded-full transition-colors duration-500 ${step > n ? "bg-amber" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">

            {/* ── Step 1: Service Type ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className="glass-card card-warm p-8 md:p-10"
              >
                <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                  {t("booking2.chooseExperienceTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 body-editorial">
                  {t("booking2.chooseExperienceDesc")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {(
                    [
                      { type: "suite" as const, icon: Tent, title: t("booking2.serviceTypeTentTitle"), desc: t("booking2.serviceTypeTentDesc") },
                      { type: "activity" as const, icon: Bike, title: t("booking2.serviceTypeActivityTitle"), desc: t("booking2.serviceTypeActivityDesc") },
                      { type: "daypass" as const, icon: Sun, title: "Day Pass", desc: t("booking2.serviceTypeDayPassDesc") },
                    ] as const
                  ).map(({ type, icon: Icon, title, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setServiceType(type)}
                      className={`relative p-6 rounded-2xl text-left transition-all duration-400 cursor-pointer ${
                        serviceType === type
                          ? "border-2 border-amber bg-amber/[0.08] shadow-lg shadow-amber/10"
                          : "border border-border/50 bg-background/50 hover:border-amber/30 hover:bg-amber/[0.04]"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                        serviceType === type ? "bg-amber text-warm-black" : "bg-amber/10 border border-amber/15"
                      }`}>
                        <Icon className={`w-6 h-6 ${serviceType === type ? "text-warm-black" : "text-amber"}`} />
                      </div>
                      <p className="font-serif text-base mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground body-editorial">{desc}</p>
                      {serviceType === type && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                          <Check className="w-3 h-3 text-warm-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary inline-flex items-center gap-2 cursor-pointer"
                  >
                    {t("booking2.continue")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Personal Details ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className="glass-card card-warm p-8 md:p-10"
              >
                <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                  {t("booking2.yourInfoTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 body-editorial">
                  {t("booking2.yourInfoDesc")}
                </p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="luxury-label text-xs">
                        {t("booking2.firstName")} *
                      </Label>
                      <Input
                        id="firstName"
                        value={personal.firstName}
                        onChange={(e) => setPersonal((p) => ({ ...p, firstName: e.target.value }))}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50"
                        placeholder={t("booking2.firstNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="luxury-label text-xs">
                        {t("booking2.lastName")} *
                      </Label>
                      <Input
                        id="lastName"
                        value={personal.lastName}
                        onChange={(e) => setPersonal((p) => ({ ...p, lastName: e.target.value }))}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50"
                        placeholder={t("booking2.lastNamePlaceholder")}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="luxury-label text-xs">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personal.email}
                        onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                        required
                        className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50"
                        placeholder="jean@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="luxury-label text-xs">
                        {t("booking2.phone")}{" "}
                        <span className="text-muted-foreground">{t("booking2.phoneOptional")}</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={personal.phone}
                        onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                        className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50"
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <button onClick={() => setStep(1)} className="btn-outline inline-flex items-center gap-2 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    {t("booking2.back")}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!isPersonalValid}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {t("booking2.continue")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Service Details ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className="glass-card card-warm p-8 md:p-10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs luxury-label">
                    {serviceTypeLabels[serviceType]}
                  </span>
                </div>
                <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                  {t("booking2.bookingDetailsTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 body-editorial">
                  {t("booking2.bookingDetailsDesc")}
                </p>

                <div className="space-y-6">
                  {/* ── Suite flow ── */}
                  {serviceType === "suite" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseTent")} *
                        </Label>
                        <CarouselWrapper>
                          {suites.map((suite) => {
                            const name = localizeName(suite.name, suite.nameEn, suite.nameEs, suite.nameIt);
                            return (
                              <button
                                key={suite.id}
                                type="button"
                                onClick={() => setSelectedSuiteId(suite.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  selectedSuiteId === suite.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {suite.image && (
                                  <img src={suite.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  <div className="flex items-baseline gap-1 flex-wrap">
                                    {suite.originalPrice && (
                                      <span className="text-muted-foreground line-through text-xs mono-number">{suite.originalPrice}</span>
                                    )}
                                    <span className="mono-number text-amber text-base">{suite.price}</span>
                                    <span className="text-xs text-muted-foreground">{suite.currency}{t("booking2.perNight")}</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {t("booking2.wholeTent")}
                                  </p>
                                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-amber/60" />{suite.maxGuests}</span>
                                    <span className="flex items-center gap-1"><Baby className="w-3 h-3 text-amber/60" />{suite.maxChildren}</span>
                                  </div>
                                </div>
                                {selectedSuiteId === suite.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                                    <Check className="w-3 h-3 text-warm-black" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </CarouselWrapper>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DatePicker
                          label={t("booking2.checkIn")}
                          value={checkIn}
                          onChange={setCheckIn}
                          placeholder={t("booking2.selectDate")}
                          dateFnsLocale={dateFnsLocale}
                        />
                        <DatePicker
                          label={t("booking2.checkOut")}
                          value={checkOut}
                          onChange={setCheckOut}
                          disableBefore={checkIn ?? new Date()}
                          placeholder={t("booking2.selectDate")}
                          dateFnsLocale={dateFnsLocale}
                        />
                      </div>
                    </>
                  )}

                  {/* ── Activity flow ── */}
                  {serviceType === "activity" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseActivity")} *
                        </Label>
                        <CarouselWrapper>
                          {activities.map((act) => {
                            const name = localizeName(act.name, act.nameEn, act.nameEs, act.nameIt);
                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => setSelectedActivityId(act.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  selectedActivityId === act.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {act.image && (
                                  <img src={act.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  <div className="flex items-baseline gap-1 flex-wrap">
                                    {act.originalPrice && (
                                      <span className="text-muted-foreground line-through text-xs mono-number">{act.originalPrice}</span>
                                    )}
                                    <span className="mono-number text-amber text-base">{act.price}</span>
                                    <span className="text-xs text-muted-foreground">{act.currency}{t("booking2.perPerson")}</span>
                                  </div>
                                  {act.duration && <p className="text-xs text-muted-foreground mt-0.5">{act.duration}</p>}
                                </div>
                                {selectedActivityId === act.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                                    <Check className="w-3 h-3 text-warm-black" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </CarouselWrapper>
                      </div>
                      <DatePicker
                        label={t("booking2.preferredDate")}
                        value={singleDate}
                        onChange={setSingleDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                      />
                    </>
                  )}

                  {/* ── Day Pass flow ── */}
                  {serviceType === "daypass" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseDayPass")} *
                        </Label>
                        <CarouselWrapper>
                          {dayPasses.map((pass) => {
                            const name = localizeName(pass.name, pass.nameEn, pass.nameEs, pass.nameIt);
                            return (
                              <button
                                key={pass.id}
                                type="button"
                                onClick={() => setSelectedDayPassId(pass.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  selectedDayPassId === pass.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {pass.image && (
                                  <img src={pass.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  <div className="flex items-baseline gap-1 flex-wrap">
                                    {pass.originalPrice && (
                                      <span className="text-muted-foreground line-through text-xs mono-number">{pass.originalPrice}</span>
                                    )}
                                    <span className="mono-number text-amber text-base">{pass.price}</span>
                                    <span className="text-xs text-muted-foreground">{pass.currency}{t("booking2.perPerson")}</span>
                                  </div>
                                </div>
                                {selectedDayPassId === pass.id && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                                    <Check className="w-3 h-3 text-warm-black" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </CarouselWrapper>
                      </div>
                      <DatePicker
                        label={t("booking2.preferredDate")}
                        value={singleDate}
                        onChange={setSingleDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                      />
                    </>
                  )}

                  {/* Guests counters */}
                  <div className="space-y-1">
                    <Label className="luxury-label text-xs block mb-1">
                      {t("booking2.guestsLabel")}
                      {serviceType === "suite" && selectedSuite && (
                        <span className="ml-2 text-muted-foreground font-normal normal-case">
                          — {t("booking2.maxGuestsPrefix")} {selectedSuite.maxGuests} {t("booking2.maxAdultsWord")} · {selectedSuite.maxChildren} {t("booking2.maxChildrenWord")}
                        </span>
                      )}
                    </Label>
                    {serviceType === "suite" && (
                      <p className="text-xs text-muted-foreground mb-3 body-editorial">
                        {t("booking2.tentPriceFixedNote")}
                      </p>
                    )}
                    <div className="rounded-2xl border border-border/50 bg-background/50 px-4">
                      <Counter
                        value={adults}
                        min={1}
                        max={maxAdults}
                        onChange={setAdults}
                        label={t("booking2.adults")}
                        icon={Users}
                      />
                      <Counter
                        value={children}
                        min={0}
                        max={maxChildren}
                        onChange={setChildren}
                        label={t("booking2.children")}
                        icon={Baby}
                      />
                    </div>
                  </div>

                  {/* Special requests */}
                  <div className="space-y-2">
                    <Label htmlFor="specialReqs" className="luxury-label text-xs">
                      {t("booking2.specialRequests")}{" "}
                      <span className="text-muted-foreground">{t("booking2.specialRequestsOptional")}</span>
                    </Label>
                    <Textarea
                      id="specialReqs"
                      value={specialReqs}
                      onChange={(e) => setSpecialReqs(e.target.value)}
                      rows={3}
                      className="rounded-2xl border-border/50 focus:border-amber/50 bg-background/50 resize-none"
                      placeholder={t("booking2.specialRequestsPlaceholder")}
                    />
                  </div>

                  {/* Live price summary */}
                  {total > 0 && (
                    <div className="rounded-2xl border border-amber/20 bg-amber/[0.04] p-4">
                      <p className="luxury-label text-amber mb-2">{t("booking2.estimatedTotal")}</p>
                      <p className="mono-number text-3xl text-amber">
                        {total.toLocaleString("fr-FR")} <span className="text-base text-muted-foreground font-sans font-normal">{selectedCurrency()}</span>
                      </p>
                      {children > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 body-editorial">
                          {adults} {t("booking2.adults")} + {children} {t("booking2.children")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-10">
                  <button onClick={() => setStep(2)} className="btn-outline inline-flex items-center gap-2 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    {t("booking2.back")}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!isDetailsValid || isSubmitting}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
                        {t("booking2.sending")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {t("booking2.sendRequest")}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="glass-card card-warm p-8 md:p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-amber/30 bg-amber/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-amber" />
                </div>
                <h2 className="heading-display text-3xl md:text-4xl mb-4">
                  {t("booking2.thankYouTitle")}
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-10 body-editorial">
                  {t("booking2.thankYouDesc")}
                </p>

                <div className="max-w-md mx-auto glass-card p-6 text-left space-y-3 mb-10">
                  <p className="luxury-label text-amber mb-3">
                    {t("booking2.summary")}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("booking2.summaryService")}</span>
                    <span className="font-medium">{serviceTypeLabels[serviceType]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{serviceType === "suite" ? t("booking2.summaryTent") : serviceType === "activity" ? t("booking2.summaryActivity") : "Day Pass"}</span>
                    <span>{getSuccessSummaryName()}</span>
                  </div>
                  <div className="h-px bg-border/30" />
                  {serviceType === "suite" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("booking2.checkIn")}</span>
                        <span>{checkIn ? format(checkIn, "dd MMM yyyy", { locale: dateFnsLocale }) : "—"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t("booking2.checkOut")}</span>
                        <span>{checkOut ? format(checkOut, "dd MMM yyyy", { locale: dateFnsLocale }) : "—"}</span>
                      </div>
                    </>
                  )}
                  {serviceType !== "suite" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking2.summaryDate")}</span>
                      <span>{singleDate ? format(singleDate, "dd MMM yyyy", { locale: dateFnsLocale }) : "—"}</span>
                    </div>
                  )}
                  <div className="h-px bg-border/30" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("booking2.summaryAdults")}</span>
                    <span>{adults}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("booking2.summaryChildren")}</span>
                      <span>{children}</span>
                    </div>
                  )}
                  <div className="h-px bg-border/30" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{t("booking2.summaryTotal")}</span>
                    <span className="text-amber mono-number">{total.toLocaleString("fr-FR")} {selectedCurrency()}</span>
                  </div>
                </div>

                <button
                  onClick={resetAll}
                  className="btn-outline inline-flex items-center gap-2 cursor-pointer"
                >
                  {t("booking2.newReservation")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
