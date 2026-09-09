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
  Trash2,
  ShoppingBag,
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
import { priceForDate, nightlyTotal } from "@/lib/seasonal-price";

const DATE_LOCALES = { fr: frLocale, en: enUS, es: esLocale, it: itLocale };

interface SeasonalPriceWindow {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  price: number;
}

/** Converts the wire-format (string dates) seasonal windows into Date-based ones for pricing/calendar logic. */
function toWindows(sp: SeasonalPriceWindow[] | undefined) {
  return (sp ?? []).map((w) => ({
    startDate: new Date(w.startDate),
    endDate: new Date(w.endDate),
    price: w.price,
    label: w.label,
  }));
}

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
  seasonalPrices?: SeasonalPriceWindow[];
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
  seasonalPrices?: SeasonalPriceWindow[];
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
  seasonalPrices?: SeasonalPriceWindow[];
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

type ServiceType = "suite" | "activity" | "daypass";

interface CartItem {
  key: string;
  serviceType: ServiceType;
  itemId: string;
  name: string;
  checkIn?: Date;
  checkOut?: Date;
  date?: Date;
  guests: number;
  children: number;
  price: number;
  currency: string;
}

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

type SeasonalWindow = { startDate: Date; endDate: Date; price: number; label: string };

const seasonalModifierClassName =
  "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-amber";

function SeasonalLegend({ seasonalWindows, t }: { seasonalWindows: SeasonalWindow[]; t: (key: string) => string }) {
  if (seasonalWindows.length === 0) return null;
  return (
    <p className="px-4 pb-4 text-xs text-muted-foreground flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block shrink-0" />
      {t("booking2.seasonalLegend")}
    </p>
  );
}

function DatePicker({
  label,
  value,
  onChange,
  disableBefore,
  placeholder,
  dateFnsLocale,
  seasonalWindows = [],
  t,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  disableBefore?: Date;
  placeholder: string;
  dateFnsLocale: Locale;
  seasonalWindows?: SeasonalWindow[];
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const activeWindow = value
    ? seasonalWindows.find((w) => value >= w.startDate && value <= w.endDate)
    : undefined;

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
            captionLayout="dropdown"
            startMonth={disableBefore ?? new Date()}
            endMonth={new Date(new Date().getFullYear() + 2, 11)}
            selected={value}
            onSelect={(d) => { onChange(d); setOpen(false); }}
            disabled={(d) => d < (disableBefore ?? new Date(new Date().setHours(0, 0, 0, 0)))}
            modifiers={{ seasonal: (d: Date) => seasonalWindows.some((w) => d >= w.startDate && d <= w.endDate) }}
            modifiersClassNames={{ seasonal: seasonalModifierClassName }}
            initialFocus
            className="rounded-3xl"
          />
          <SeasonalLegend seasonalWindows={seasonalWindows} t={t} />
        </DialogContent>
      </Dialog>
      {activeWindow && (
        <p className="text-xs text-amber flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> {t("booking2.specialRatePrefix")} « {activeWindow.label} »
        </p>
      )}
    </div>
  );
}

function CartList({
  cart,
  onRemove,
  dateFnsLocale,
  t,
}: {
  cart: CartItem[];
  onRemove: (key: string) => void;
  dateFnsLocale: Locale;
  t: (key: string) => string;
}) {
  const SERVICE_ICON: Record<ServiceType, React.ElementType> = { suite: Tent, activity: Bike, daypass: Sun };
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const currency = cart[0]?.currency ?? "MAD";

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-4 h-4 text-amber" />
        <h3 className="luxury-label text-amber">{t("booking2.cartTitle")}{cart.length > 0 ? ` (${cart.length})` : ""}</h3>
      </div>
      {cart.length === 0 ? (
        <p className="text-sm text-muted-foreground body-editorial">{t("booking2.cartEmpty")}</p>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => {
            const Icon = SERVICE_ICON[item.serviceType];
            const dates = item.checkIn && item.checkOut
              ? `${format(item.checkIn, "d MMM", { locale: dateFnsLocale })} → ${format(item.checkOut, "d MMM yyyy", { locale: dateFnsLocale })}`
              : item.date
              ? format(item.date, "d MMM yyyy", { locale: dateFnsLocale })
              : "";
            return (
              <div key={item.key} className="flex items-center gap-3 p-3 rounded-2xl border border-border/40 bg-background/50">
                <div className="w-9 h-9 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {dates} · {item.guests} {item.guests > 1 ? t("booking2.adults") : t("booking2.adults")}
                    {item.children > 0 ? `, ${item.children} ${t("booking2.children")}` : ""}
                  </p>
                </div>
                <span className="mono-number text-amber text-sm shrink-0">{item.price.toLocaleString("fr-FR")} {item.currency}</span>
                <button
                  type="button"
                  onClick={() => onRemove(item.key)}
                  title={t("booking2.removeItem")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <span className="text-sm font-medium">{t("booking2.summaryTotal")}</span>
            <span className="mono-number text-amber text-lg">{total.toLocaleString("fr-FR")} {currency}</span>
          </div>
        </div>
      )}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manageUrl, setManageUrl] = useState("");

  // Data
  const [suites, setSuites] = useState<Suite[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dayPasses, setDayPasses] = useState<DayPass[]>([]);

  // Cart — the reservation being built, can hold several items of different types
  const [cart, setCart] = useState<CartItem[]>([]);

  // Item builder — the form used to configure and add one item to the cart
  const [builderType, setBuilderType] = useState<ServiceType>("suite");
  const [builderSuiteId, setBuilderSuiteId] = useState("");
  const [builderActivityId, setBuilderActivityId] = useState("");
  const [builderDayPassId, setBuilderDayPassId] = useState("");
  const [builderCheckIn, setBuilderCheckIn] = useState<Date | undefined>();
  const [builderCheckOut, setBuilderCheckOut] = useState<Date | undefined>();
  const [builderDate, setBuilderDate] = useState<Date | undefined>();
  const [builderAdults, setBuilderAdults] = useState(2);
  const [builderChildren, setBuilderChildren] = useState(0);

  // Personal info
  const [personal, setPersonal] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [specialReqs, setSpecialReqs] = useState("");

  const builderSuite = suites.find((s) => s.id === builderSuiteId);
  const maxAdults = builderType === "suite" ? (builderSuite?.maxGuests ?? 10) : 20;
  const maxChildren = builderType === "suite" ? (builderSuite?.maxChildren ?? 6) : 10;

  // Clamp adults/children when suite changes
  useEffect(() => {
    if (builderType === "suite" && builderSuite) {
      if (builderAdults > builderSuite.maxGuests) setBuilderAdults(builderSuite.maxGuests);
      if (builderChildren > builderSuite.maxChildren) setBuilderChildren(builderSuite.maxChildren);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builderSuiteId]);

  useEffect(() => {
    fetch("/api/suites").then((r) => r.json()).then(setSuites).catch(() => {});
    fetch("/api/activities").then((r) => r.json()).then(setActivities).catch(() => {});
    fetch("/api/day-passes").then((r) => r.json()).then(setDayPasses).catch(() => {});
  }, []);

  function resetBuilder() {
    setBuilderSuiteId(""); setBuilderActivityId(""); setBuilderDayPassId("");
    setBuilderCheckIn(undefined); setBuilderCheckOut(undefined); setBuilderDate(undefined);
    setBuilderAdults(2); setBuilderChildren(0);
  }

  const isBuilderValid =
    builderType === "suite"
      ? builderSuiteId !== "" && builderCheckIn !== undefined && builderCheckOut !== undefined
      : builderType === "activity"
      ? builderActivityId !== "" && builderDate !== undefined
      : builderDayPassId !== "" && builderDate !== undefined;

  function addToCart() {
    if (!isBuilderValid) return;

    if (builderType === "suite" && builderSuite && builderCheckIn && builderCheckOut) {
      const price = nightlyTotal(builderSuite.price, toWindows(builderSuite.seasonalPrices), builderCheckIn, builderCheckOut);
      setCart((c) => [...c, {
        key: `${Date.now()}-${Math.random()}`,
        serviceType: "suite",
        itemId: builderSuite.id,
        name: localizeName(builderSuite.name, builderSuite.nameEn, builderSuite.nameEs, builderSuite.nameIt),
        checkIn: builderCheckIn,
        checkOut: builderCheckOut,
        guests: builderAdults,
        children: builderChildren,
        price,
        currency: builderSuite.currency,
      }]);
    } else if (builderType === "activity" && builderDate) {
      const act = activities.find((a) => a.id === builderActivityId);
      if (!act) return;
      const unitPrice = priceForDate(act.price, toWindows(act.seasonalPrices), builderDate);
      const price = builderAdults * unitPrice + builderChildren * Math.round(unitPrice * act.childPricePercent / 100);
      setCart((c) => [...c, {
        key: `${Date.now()}-${Math.random()}`,
        serviceType: "activity",
        itemId: act.id,
        name: localizeName(act.name, act.nameEn, act.nameEs, act.nameIt),
        date: builderDate,
        guests: builderAdults,
        children: builderChildren,
        price,
        currency: act.currency,
      }]);
    } else if (builderType === "daypass" && builderDate) {
      const pass = dayPasses.find((p) => p.id === builderDayPassId);
      if (!pass) return;
      const unitPrice = priceForDate(pass.price, toWindows(pass.seasonalPrices), builderDate);
      const price = builderAdults * unitPrice + builderChildren * Math.round(unitPrice * pass.childPricePercent / 100);
      setCart((c) => [...c, {
        key: `${Date.now()}-${Math.random()}`,
        serviceType: "daypass",
        itemId: pass.id,
        name: localizeName(pass.name, pass.nameEn, pass.nameEs, pass.nameIt),
        date: builderDate,
        guests: builderAdults,
        children: builderChildren,
        price,
        currency: pass.currency,
      }]);
    }

    toast({ title: t("booking2.itemAdded") });
    resetBuilder();
  }

  function removeFromCart(key: string) {
    setCart((c) => c.filter((item) => item.key !== key));
  }

  const isPersonalValid =
    personal.firstName.trim() !== "" &&
    personal.lastName.trim() !== "" &&
    personal.email.trim() !== "" &&
    personal.phone.trim() !== "";

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...personal,
        specialReqs: specialReqs || undefined,
        items: cart.map((item) => ({
          serviceType: item.serviceType,
          suiteId: item.serviceType === "suite" ? item.itemId : undefined,
          activityId: item.serviceType === "activity" ? item.itemId : undefined,
          dayPassId: item.serviceType === "daypass" ? item.itemId : undefined,
          checkIn: item.checkIn?.toISOString(),
          checkOut: item.checkOut?.toISOString(),
          date: item.date?.toISOString(),
          guests: item.guests,
          children: item.children,
        })),
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setManageUrl(data.manageUrl ?? "");
        setStep(4);
      } else {
        toast({ title: t("booking2.errorTitle"), description: t("booking2.errorDesc"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("booking2.errorTitle"), description: t("booking2.errorDesc"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personal, specialReqs, cart]);

  const stepLabels = [
    t("booking2.stepService"),
    t("booking2.stepInfo"),
    t("booking2.stepReview"),
    "✓",
  ];

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCurrency = cart[0]?.currency ?? "MAD";

  function resetAll() {
    setStep(1);
    setPersonal({ firstName: "", lastName: "", email: "", phone: "" });
    setCart([]);
    resetBuilder();
    setSpecialReqs("");
    setManageUrl("");
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

            {/* ── Step 1: Build cart — add one or more items ── */}
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
                  {t("booking2.addItemsTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 body-editorial">
                  {t("booking2.addItemsDesc")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
                      onClick={() => setBuilderType(type)}
                      className={`relative p-5 rounded-2xl text-left transition-all duration-400 cursor-pointer ${
                        builderType === type
                          ? "border-2 border-amber bg-amber/[0.08] shadow-lg shadow-amber/10"
                          : "border border-border/50 bg-background/50 hover:border-amber/30 hover:bg-amber/[0.04]"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        builderType === type ? "bg-amber text-warm-black" : "bg-amber/10 border border-amber/15"
                      }`}>
                        <Icon className={`w-5 h-5 ${builderType === type ? "text-warm-black" : "text-amber"}`} />
                      </div>
                      <p className="font-serif text-sm mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground body-editorial">{desc}</p>
                      {builderType === type && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                          <Check className="w-3 h-3 text-warm-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {/* ── Suite flow ── */}
                  {builderType === "suite" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseTent")} *
                        </Label>
                        <CarouselWrapper>
                          {suites.map((suite) => {
                            const name = localizeName(suite.name, suite.nameEn, suite.nameEs, suite.nameIt);
                            const cardPrice = builderCheckIn ? priceForDate(suite.price, toWindows(suite.seasonalPrices), builderCheckIn) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== suite.price;
                            return (
                              <button
                                key={suite.id}
                                type="button"
                                onClick={() => setBuilderSuiteId(suite.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  builderSuiteId === suite.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {suite.image && (
                                  <img src={suite.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {t("booking2.wholeTent")}
                                  </p>
                                  {cardPrice === null ? (
                                    <p className="text-[10px] text-amber/80 mt-1">
                                      {t("booking2.priceAfterDates")}
                                    </p>
                                  ) : (
                                    <>
                                      <div className="flex items-baseline gap-1 flex-wrap mt-1">
                                        {suite.originalPrice && !isSeasonal && (
                                          <span className="text-muted-foreground line-through text-xs mono-number">{suite.originalPrice}</span>
                                        )}
                                        <span className="mono-number text-amber text-base">{cardPrice}</span>
                                        <span className="text-xs text-muted-foreground">{suite.currency}{t("booking2.perNight")}</span>
                                      </div>
                                      {isSeasonal && (
                                        <p className="text-[10px] text-amber flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5" />{t("booking2.specialRatePrefix")}
                                        </p>
                                      )}
                                    </>
                                  )}
                                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-amber/60" />{suite.maxGuests}</span>
                                    <span className="flex items-center gap-1"><Baby className="w-3 h-3 text-amber/60" />{suite.maxChildren}</span>
                                  </div>
                                </div>
                                {builderSuiteId === suite.id && (
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
                          value={builderCheckIn}
                          onChange={setBuilderCheckIn}
                          placeholder={t("booking2.selectDate")}
                          dateFnsLocale={dateFnsLocale}
                          seasonalWindows={toWindows(builderSuite?.seasonalPrices)}
                          t={t}
                        />
                        <DatePicker
                          label={t("booking2.checkOut")}
                          value={builderCheckOut}
                          onChange={setBuilderCheckOut}
                          disableBefore={builderCheckIn ?? new Date()}
                          placeholder={t("booking2.selectDate")}
                          dateFnsLocale={dateFnsLocale}
                          seasonalWindows={toWindows(builderSuite?.seasonalPrices)}
                          t={t}
                        />
                      </div>
                    </>
                  )}

                  {/* ── Activity flow ── */}
                  {builderType === "activity" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseActivity")} *
                        </Label>
                        <CarouselWrapper>
                          {activities.map((act) => {
                            const name = localizeName(act.name, act.nameEn, act.nameEs, act.nameIt);
                            const cardPrice = builderDate ? priceForDate(act.price, toWindows(act.seasonalPrices), builderDate) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== act.price;
                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => setBuilderActivityId(act.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  builderActivityId === act.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {act.image && (
                                  <img src={act.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  {act.duration && <p className="text-xs text-muted-foreground">{act.duration}</p>}
                                  {cardPrice === null ? (
                                    <p className="text-[10px] text-amber/80 mt-1">
                                      {t("booking2.priceAfterDates")}
                                    </p>
                                  ) : (
                                    <>
                                      <div className="flex items-baseline gap-1 flex-wrap mt-1">
                                        {act.originalPrice && !isSeasonal && (
                                          <span className="text-muted-foreground line-through text-xs mono-number">{act.originalPrice}</span>
                                        )}
                                        <span className="mono-number text-amber text-base">{cardPrice}</span>
                                        <span className="text-xs text-muted-foreground">{act.currency}{t("booking2.perPerson")}</span>
                                      </div>
                                      {isSeasonal && (
                                        <p className="text-[10px] text-amber flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5" />{t("booking2.specialRatePrefix")}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                                {builderActivityId === act.id && (
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
                        value={builderDate}
                        onChange={setBuilderDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                        seasonalWindows={toWindows(activities.find((a) => a.id === builderActivityId)?.seasonalPrices)}
                        t={t}
                      />
                    </>
                  )}

                  {/* ── Day Pass flow ── */}
                  {builderType === "daypass" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseDayPass")} *
                        </Label>
                        <CarouselWrapper>
                          {dayPasses.map((pass) => {
                            const name = localizeName(pass.name, pass.nameEn, pass.nameEs, pass.nameIt);
                            const cardPrice = builderDate ? priceForDate(pass.price, toWindows(pass.seasonalPrices), builderDate) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== pass.price;
                            return (
                              <button
                                key={pass.id}
                                type="button"
                                onClick={() => setBuilderDayPassId(pass.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  builderDayPassId === pass.id
                                    ? "border-2 border-amber bg-amber/[0.08]"
                                    : "border border-border/50 bg-background/50 hover:border-amber/30"
                                }`}
                              >
                                {pass.image && (
                                  <img src={pass.image} alt={name} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3">
                                  <p className="font-serif text-sm mb-1">{name}</p>
                                  {cardPrice === null ? (
                                    <p className="text-[10px] text-amber/80 mt-1">
                                      {t("booking2.priceAfterDates")}
                                    </p>
                                  ) : (
                                    <>
                                      <div className="flex items-baseline gap-1 flex-wrap mt-1">
                                        {pass.originalPrice && !isSeasonal && (
                                          <span className="text-muted-foreground line-through text-xs mono-number">{pass.originalPrice}</span>
                                        )}
                                        <span className="mono-number text-amber text-base">{cardPrice}</span>
                                        <span className="text-xs text-muted-foreground">{pass.currency}{t("booking2.perPerson")}</span>
                                      </div>
                                      {isSeasonal && (
                                        <p className="text-[10px] text-amber flex items-center gap-1">
                                          <Sparkles className="w-2.5 h-2.5" />{t("booking2.specialRatePrefix")}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                                {builderDayPassId === pass.id && (
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
                        value={builderDate}
                        onChange={setBuilderDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                        seasonalWindows={toWindows(dayPasses.find((p) => p.id === builderDayPassId)?.seasonalPrices)}
                        t={t}
                      />
                    </>
                  )}

                  {/* Guests counters */}
                  <div className="space-y-1">
                    <Label className="luxury-label text-xs block mb-1">
                      {t("booking2.guestsLabel")}
                      {builderType === "suite" && builderSuite && (
                        <span className="ml-2 text-muted-foreground font-normal normal-case">
                          — {t("booking2.maxGuestsPrefix")} {builderSuite.maxGuests} {t("booking2.maxAdultsWord")} · {builderSuite.maxChildren} {t("booking2.maxChildrenWord")}
                        </span>
                      )}
                    </Label>
                    {builderType === "suite" && (
                      <p className="text-xs text-muted-foreground mb-3 body-editorial">
                        {t("booking2.tentPriceFixedNote")}
                      </p>
                    )}
                    <div className="rounded-2xl border border-border/50 bg-background/50 px-4">
                      <Counter
                        value={builderAdults}
                        min={1}
                        max={maxAdults}
                        onChange={setBuilderAdults}
                        label={t("booking2.adults")}
                        icon={Users}
                      />
                      <Counter
                        value={builderChildren}
                        min={0}
                        max={maxChildren}
                        onChange={setBuilderChildren}
                        label={t("booking2.children")}
                        icon={Baby}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addToCart}
                      disabled={!isBuilderValid}
                      className="btn-outline inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      {t("booking2.addToCart")}
                    </button>
                  </div>

                  <div className="pt-6 border-t border-border/30">
                    <CartList cart={cart} onRemove={removeFromCart} dateFnsLocale={dateFnsLocale} t={t} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 mt-10">
                  <div className="flex justify-end w-full">
                    <button
                      onClick={() => setStep(2)}
                      disabled={cart.length === 0}
                      className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {t("booking2.continue")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {cart.length === 0 && (
                    <p className="text-xs text-muted-foreground">{t("booking2.cartRequiredNote")}</p>
                  )}
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
                        {t("booking2.phone")} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={personal.phone}
                        onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                        required
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

            {/* ── Step 3: Review & Submit ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: smoothEase }}
                className="glass-card card-warm p-8 md:p-10"
              >
                <h2 className="heading-editorial text-2xl md:text-3xl mb-2">
                  {t("booking2.reviewTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mb-8 body-editorial">
                  {t("booking2.reviewDesc")}
                </p>

                <div className="space-y-6">
                  <CartList cart={cart} onRemove={removeFromCart} dateFnsLocale={dateFnsLocale} t={t} />

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
                </div>

                <div className="flex justify-between mt-10">
                  <button onClick={() => setStep(2)} className="btn-outline inline-flex items-center gap-2 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    {t("booking2.back")}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={cart.length === 0 || isSubmitting}
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

                <div className="max-w-md mx-auto glass-card p-6 text-left space-y-3 mb-8">
                  <p className="luxury-label text-amber mb-3">
                    {t("booking2.summary")}
                  </p>
                  {cart.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm gap-4">
                      <span className="text-muted-foreground">{serviceTypeLabels[item.serviceType]} — {item.name}</span>
                      <span className="text-right shrink-0">{item.price.toLocaleString("fr-FR")} {item.currency}</span>
                    </div>
                  ))}
                  <div className="h-px bg-border/30" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{t("booking2.summaryTotal")}</span>
                    <span className="text-amber mono-number">{cartTotal.toLocaleString("fr-FR")} {cartCurrency}</span>
                  </div>
                </div>

                {manageUrl && (
                  <div className="max-w-md mx-auto mb-10 p-4 rounded-2xl border border-amber/20 bg-amber/[0.04]">
                    <p className="text-xs text-muted-foreground body-editorial mb-3">
                      {t("booking2.manageLinkNote")}
                    </p>
                    <a
                      href={manageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2 text-sm cursor-pointer"
                    >
                      {t("booking2.manageLinkButton")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

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
