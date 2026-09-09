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
  titleText,
  hideEmptyState = false,
}: {
  cart: CartItem[];
  onRemove: (key: string) => void;
  dateFnsLocale: Locale;
  t: (key: string) => string;
  titleText?: string;
  hideEmptyState?: boolean;
}) {
  const SERVICE_ICON: Record<ServiceType, React.ElementType> = { suite: Tent, activity: Bike, daypass: Sun };
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const currency = cart[0]?.currency ?? "MAD";

  if (cart.length === 0 && hideEmptyState) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-4 h-4 text-amber" />
        <h3 className="luxury-label text-amber">{titleText ?? t("booking2.cartTitle")}{cart.length > 0 ? ` (${cart.length})` : ""}</h3>
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

type PrimaryType = "suite" | "activity" | "daypass";

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

  // The primary item — a tent stay, one activity, or one Day Pass.
  const [primaryType, setPrimaryType] = useState<PrimaryType>("suite");
  const [suiteId, setSuiteId] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [activityId, setActivityId] = useState("");
  const [dayPassId, setDayPassId] = useState("");
  const [primaryDate, setPrimaryDate] = useState<Date | undefined>();
  const [primaryAdults, setPrimaryAdults] = useState(2);
  const [primaryChildren, setPrimaryChildren] = useState(0);

  // Add-on activities — only offered once a tent stay or a Day Pass has its
  // date(s) set. Never offered on top of another activity, and Day Pass is
  // never offered as an add-on to a tent stay (redundant: tent guests
  // already have full property access).
  const [addOns, setAddOns] = useState<CartItem[]>([]);
  const [addOnActivityId, setAddOnActivityId] = useState("");
  const [addOnDate, setAddOnDate] = useState<Date | undefined>();
  const [addOnAdults, setAddOnAdults] = useState(2);
  const [addOnChildren, setAddOnChildren] = useState(0);

  // Personal info
  const [personal, setPersonal] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [specialReqs, setSpecialReqs] = useState("");

  const selectedSuite = suites.find((s) => s.id === suiteId);
  const maxAdults = primaryType === "suite" ? (selectedSuite?.maxGuests ?? 10) : 20;
  const maxChildren = primaryType === "suite" ? (selectedSuite?.maxChildren ?? 6) : 10;

  // Clamp guests when suite changes
  useEffect(() => {
    if (primaryType === "suite" && selectedSuite) {
      if (primaryAdults > selectedSuite.maxGuests) setPrimaryAdults(selectedSuite.maxGuests);
      if (primaryChildren > selectedSuite.maxChildren) setPrimaryChildren(selectedSuite.maxChildren);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suiteId]);

  useEffect(() => {
    fetch("/api/suites").then((r) => r.json()).then(setSuites).catch(() => {});
    fetch("/api/activities").then((r) => r.json()).then(setActivities).catch(() => {});
    fetch("/api/day-passes").then((r) => r.json()).then(setDayPasses).catch(() => {});
  }, []);

  // Changing the primary type starts a fresh selection — including add-ons,
  // since Day Pass add-ons are only meaningful attached to their own primary.
  function selectPrimaryType(next: PrimaryType) {
    if (next === primaryType) return;
    setPrimaryType(next);
    setSuiteId(""); setCheckIn(undefined); setCheckOut(undefined);
    setActivityId(""); setDayPassId(""); setPrimaryDate(undefined);
    setPrimaryAdults(2); setPrimaryChildren(0);
    setAddOns([]); setAddOnActivityId(""); setAddOnDate(undefined);
    setAddOnAdults(2); setAddOnChildren(0);
  }

  // Suggest the primary date as the add-on's starting date once it's known —
  // only as a default; the guest can still change it.
  useEffect(() => {
    if (addOnDate === undefined) {
      if (primaryType === "suite" && checkIn) setAddOnDate(checkIn);
      else if (primaryType === "daypass" && primaryDate) setAddOnDate(primaryDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, primaryDate]);

  const isPrimaryValid =
    primaryType === "suite"
      ? suiteId !== "" && checkIn !== undefined && checkOut !== undefined
      : primaryType === "activity"
      ? activityId !== "" && primaryDate !== undefined
      : dayPassId !== "" && primaryDate !== undefined;

  const showAddOnSection =
    primaryType === "suite" ? checkIn !== undefined :
    primaryType === "daypass" ? primaryDate !== undefined :
    false;

  const isAddOnValid = addOnActivityId !== "" && addOnDate !== undefined;

  function addActivityAddOn() {
    if (!isAddOnValid || !addOnDate) return;
    const act = activities.find((a) => a.id === addOnActivityId);
    if (!act) return;
    const unitPrice = priceForDate(act.price, toWindows(act.seasonalPrices), addOnDate);
    const price = addOnAdults * unitPrice + addOnChildren * Math.round(unitPrice * act.childPricePercent / 100);
    setAddOns((c) => [...c, {
      key: `${Date.now()}-${Math.random()}`,
      serviceType: "activity",
      itemId: act.id,
      name: localizeName(act.name, act.nameEn, act.nameEs, act.nameIt),
      date: addOnDate,
      guests: addOnAdults,
      children: addOnChildren,
      price,
      currency: act.currency,
    }]);
    setAddOnActivityId("");
    setAddOnAdults(2);
    setAddOnChildren(0);
    toast({ title: t("booking2.itemAdded") });
  }

  function removeAddOn(key: string) {
    setAddOns((c) => c.filter((item) => item.key !== key));
  }

  /** The primary item, in the same shape as an add-on, for review/submit. */
  function getPrimaryCartItem(): CartItem | null {
    if (primaryType === "suite" && selectedSuite && checkIn && checkOut) {
      return {
        key: "primary",
        serviceType: "suite",
        itemId: selectedSuite.id,
        name: localizeName(selectedSuite.name, selectedSuite.nameEn, selectedSuite.nameEs, selectedSuite.nameIt),
        checkIn, checkOut,
        guests: primaryAdults, children: primaryChildren,
        price: nightlyTotal(selectedSuite.price, toWindows(selectedSuite.seasonalPrices), checkIn, checkOut),
        currency: selectedSuite.currency,
      };
    }
    if (primaryType === "activity" && primaryDate) {
      const act = activities.find((a) => a.id === activityId);
      if (!act) return null;
      const unitPrice = priceForDate(act.price, toWindows(act.seasonalPrices), primaryDate);
      return {
        key: "primary",
        serviceType: "activity",
        itemId: act.id,
        name: localizeName(act.name, act.nameEn, act.nameEs, act.nameIt),
        date: primaryDate,
        guests: primaryAdults, children: primaryChildren,
        price: primaryAdults * unitPrice + primaryChildren * Math.round(unitPrice * act.childPricePercent / 100),
        currency: act.currency,
      };
    }
    if (primaryType === "daypass" && primaryDate) {
      const pass = dayPasses.find((p) => p.id === dayPassId);
      if (!pass) return null;
      const unitPrice = priceForDate(pass.price, toWindows(pass.seasonalPrices), primaryDate);
      return {
        key: "primary",
        serviceType: "daypass",
        itemId: pass.id,
        name: localizeName(pass.name, pass.nameEn, pass.nameEs, pass.nameIt),
        date: primaryDate,
        guests: primaryAdults, children: primaryChildren,
        price: primaryAdults * unitPrice + primaryChildren * Math.round(unitPrice * pass.childPricePercent / 100),
        currency: pass.currency,
      };
    }
    return null;
  }

  const primaryCartItem = getPrimaryCartItem();
  const allItems = primaryCartItem ? [primaryCartItem, ...addOns] : addOns;
  const grandTotal = allItems.reduce((sum, item) => sum + item.price, 0);
  const grandCurrency = allItems[0]?.currency ?? "MAD";

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
        items: allItems.map((item) => ({
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
  }, [personal, specialReqs, allItems]);

  const stepLabels = [
    t("booking2.stepService"),
    t("booking2.stepInfo"),
    t("booking2.stepReview"),
    "✓",
  ];

  function resetAll() {
    setStep(1);
    setPersonal({ firstName: "", lastName: "", email: "", phone: "" });
    selectPrimaryType("suite");
    setSuiteId(""); setCheckIn(undefined); setCheckOut(undefined);
    setActivityId(""); setDayPassId(""); setPrimaryDate(undefined);
    setPrimaryAdults(2); setPrimaryChildren(0);
    setAddOns([]);
    setSpecialReqs("");
    setManageUrl("");
  }

  const serviceTypeLabels: Record<PrimaryType, string> = {
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

            {/* ── Step 1: Primary item + optional activity add-ons ── */}
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
                      onClick={() => selectPrimaryType(type)}
                      className={`relative p-6 rounded-2xl text-left transition-all duration-400 cursor-pointer ${
                        primaryType === type
                          ? "border-2 border-amber bg-amber/[0.08] shadow-lg shadow-amber/10"
                          : "border border-border/50 bg-background/50 hover:border-amber/30 hover:bg-amber/[0.04]"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                        primaryType === type ? "bg-amber text-warm-black" : "bg-amber/10 border border-amber/15"
                      }`}>
                        <Icon className={`w-6 h-6 ${primaryType === type ? "text-warm-black" : "text-amber"}`} />
                      </div>
                      <p className="font-serif text-base mb-1">{title}</p>
                      <p className="text-xs text-muted-foreground body-editorial">{desc}</p>
                      {primaryType === type && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                          <Check className="w-3 h-3 text-warm-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {/* ── Suite flow ── */}
                  {primaryType === "suite" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseTent")} *
                        </Label>
                        <CarouselWrapper>
                          {suites.map((suite) => {
                            const name = localizeName(suite.name, suite.nameEn, suite.nameEs, suite.nameIt);
                            const cardPrice = checkIn ? priceForDate(suite.price, toWindows(suite.seasonalPrices), checkIn) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== suite.price;
                            return (
                              <button
                                key={suite.id}
                                type="button"
                                onClick={() => setSuiteId(suite.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  suiteId === suite.id
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
                                {suiteId === suite.id && (
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
                          seasonalWindows={toWindows(selectedSuite?.seasonalPrices)}
                          t={t}
                        />
                        <DatePicker
                          label={t("booking2.checkOut")}
                          value={checkOut}
                          onChange={setCheckOut}
                          disableBefore={checkIn ?? new Date()}
                          placeholder={t("booking2.selectDate")}
                          dateFnsLocale={dateFnsLocale}
                          seasonalWindows={toWindows(selectedSuite?.seasonalPrices)}
                          t={t}
                        />
                      </div>
                    </>
                  )}

                  {/* ── Activity flow (standalone — no add-ons) ── */}
                  {primaryType === "activity" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseActivity")} *
                        </Label>
                        <CarouselWrapper>
                          {activities.map((act) => {
                            const name = localizeName(act.name, act.nameEn, act.nameEs, act.nameIt);
                            const cardPrice = primaryDate ? priceForDate(act.price, toWindows(act.seasonalPrices), primaryDate) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== act.price;
                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => setActivityId(act.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  activityId === act.id
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
                                {activityId === act.id && (
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
                        value={primaryDate}
                        onChange={setPrimaryDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                        seasonalWindows={toWindows(activities.find((a) => a.id === activityId)?.seasonalPrices)}
                        t={t}
                      />
                    </>
                  )}

                  {/* ── Day Pass flow ── */}
                  {primaryType === "daypass" && (
                    <>
                      <div className="space-y-2">
                        <Label className="luxury-label text-xs">
                          {t("booking2.chooseDayPass")} *
                        </Label>
                        <CarouselWrapper>
                          {dayPasses.map((pass) => {
                            const name = localizeName(pass.name, pass.nameEn, pass.nameEs, pass.nameIt);
                            const cardPrice = primaryDate ? priceForDate(pass.price, toWindows(pass.seasonalPrices), primaryDate) : null;
                            const isSeasonal = cardPrice !== null && cardPrice !== pass.price;
                            return (
                              <button
                                key={pass.id}
                                type="button"
                                onClick={() => setDayPassId(pass.id)}
                                className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                  dayPassId === pass.id
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
                                {dayPassId === pass.id && (
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
                        value={primaryDate}
                        onChange={setPrimaryDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                        seasonalWindows={toWindows(dayPasses.find((p) => p.id === dayPassId)?.seasonalPrices)}
                        t={t}
                      />
                    </>
                  )}

                  {/* Guests counters */}
                  <div className="space-y-1">
                    <Label className="luxury-label text-xs block mb-1">
                      {t("booking2.guestsLabel")}
                      {primaryType === "suite" && selectedSuite && (
                        <span className="ml-2 text-muted-foreground font-normal normal-case">
                          — {t("booking2.maxGuestsPrefix")} {selectedSuite.maxGuests} {t("booking2.maxAdultsWord")} · {selectedSuite.maxChildren} {t("booking2.maxChildrenWord")}
                        </span>
                      )}
                    </Label>
                    {primaryType === "suite" && (
                      <p className="text-xs text-muted-foreground mb-3 body-editorial">
                        {t("booking2.tentPriceFixedNote")}
                      </p>
                    )}
                    <div className="rounded-2xl border border-border/50 bg-background/50 px-4">
                      <Counter
                        value={primaryAdults}
                        min={1}
                        max={maxAdults}
                        onChange={setPrimaryAdults}
                        label={t("booking2.adults")}
                        icon={Users}
                      />
                      <Counter
                        value={primaryChildren}
                        min={0}
                        max={maxChildren}
                        onChange={setPrimaryChildren}
                        label={t("booking2.children")}
                        icon={Baby}
                      />
                    </div>
                  </div>

                  {/* ── Optional activity add-ons — only after a tent or Day Pass has its date(s) ── */}
                  {showAddOnSection && (
                    <div className="pt-6 border-t border-border/30 space-y-5">
                      <div>
                        <h3 className="heading-editorial text-lg mb-1">{t("booking2.addActivityTitle")}</h3>
                        <p className="text-xs text-muted-foreground body-editorial">{t("booking2.addActivityDesc")}</p>
                      </div>

                      <CarouselWrapper>
                        {activities.map((act) => {
                          const name = localizeName(act.name, act.nameEn, act.nameEs, act.nameIt);
                          const cardPrice = addOnDate ? priceForDate(act.price, toWindows(act.seasonalPrices), addOnDate) : null;
                          const isSeasonal = cardPrice !== null && cardPrice !== act.price;
                          return (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => setAddOnActivityId(act.id)}
                              className={`relative overflow-hidden rounded-2xl text-left transition-all duration-400 cursor-pointer snap-start shrink-0 w-[200px] ${
                                addOnActivityId === act.id
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
                                {cardPrice !== null && (
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
                              {addOnActivityId === act.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                                  <Check className="w-3 h-3 text-warm-black" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </CarouselWrapper>

                      <DatePicker
                        label={t("booking2.preferredDate")}
                        value={addOnDate}
                        onChange={setAddOnDate}
                        placeholder={t("booking2.selectDate")}
                        dateFnsLocale={dateFnsLocale}
                        seasonalWindows={toWindows(activities.find((a) => a.id === addOnActivityId)?.seasonalPrices)}
                        t={t}
                      />

                      <div className="rounded-2xl border border-border/50 bg-background/50 px-4">
                        <Counter value={addOnAdults} min={1} max={20} onChange={setAddOnAdults} label={t("booking2.adults")} icon={Users} />
                        <Counter value={addOnChildren} min={0} max={10} onChange={setAddOnChildren} label={t("booking2.children")} icon={Baby} />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addActivityAddOn}
                          disabled={!isAddOnValid}
                          className="btn-outline inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          {t("booking2.addToCart")}
                        </button>
                      </div>

                      <CartList cart={addOns} onRemove={removeAddOn} dateFnsLocale={dateFnsLocale} t={t} hideEmptyState />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!isPrimaryValid}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                  <CartList cart={allItems} onRemove={(key) => key === "primary" ? undefined : removeAddOn(key)} dateFnsLocale={dateFnsLocale} t={t} />

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
                    disabled={allItems.length === 0 || isSubmitting}
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
                  {allItems.map((item) => (
                    <div key={item.key} className="flex justify-between text-sm gap-4">
                      <span className="text-muted-foreground">{serviceTypeLabels[item.serviceType]} — {item.name}</span>
                      <span className="text-right shrink-0">{item.price.toLocaleString("fr-FR")} {item.currency}</span>
                    </div>
                  ))}
                  <div className="h-px bg-border/30" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">{t("booking2.summaryTotal")}</span>
                    <span className="text-amber mono-number">{grandTotal.toLocaleString("fr-FR")} {grandCurrency}</span>
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

