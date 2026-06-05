"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus, Send, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function BookingCTA() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative py-24 md:py-36 px-6 md:px-10 bg-charcoal/[0.03] dark:bg-charcoal/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-luxury-label text-gold block mb-4"
            >
              Your Journey Awaits
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8"
            >
              Begin Your
              <br />
              <span className="italic">Desert Story</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-editorial text-muted-foreground mb-8"
            >
              Every stay at Arabian Desert Home is a bespoke experience. From
              the moment you enquire, our concierge team crafts a journey
              tailored entirely to your desires. No request is too extraordinary,
              no detail too small.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 mb-10"
            >
              {[
                "Complimentary airport transfer from Marrakech",
                "Personal butler assigned to your suite",
                "Curated experience itinerary upon arrival",
                "24-hour in-suite dining and concierge",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <p className="text-xs text-muted-foreground/50 mb-6">
                Starting from <span className="text-gold font-serif text-lg">$1,200</span> per night · Minimum 2-night stay
              </p>
            </motion.div>
          </div>

          {/* Right — Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <BookingForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BookingForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    suiteType: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: 2,
    specialReqs: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          checkIn: form.checkIn?.toISOString(),
          checkOut: form.checkOut?.toISOString(),
          suiteId: form.suiteType,
          totalAmount: 0,
        }),
      });

      if (res.ok) {
        toast({
          title: "Reservation Received",
          description: "Our concierge team will contact you within 24 hours.",
        });
        setStep(3);
      } else {
        throw new Error("Booking failed");
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="bg-background/50 backdrop-blur-sm border border-border/50 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-gold" />
        </div>
        <h3 className="font-serif text-2xl mb-3">Thank You</h3>
        <p className="text-sm text-muted-foreground">
          Your reservation request has been received. Our concierge team will
          reach out within 24 hours to finalize your desert experience.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background/50 backdrop-blur-sm border border-border/50 p-8 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                step >= s
                  ? "bg-gold text-charcoal"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <span className="text-luxury-label text-muted-foreground ml-2">
          {step === 1 ? "Your Details" : "Your Stay"}
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-luxury-label text-muted-foreground">
                First Name
              </Label>
              <Input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="mt-1.5 bg-transparent border-border/50 rounded-none focus:border-gold"
                placeholder="First name"
              />
            </div>
            <div>
              <Label className="text-luxury-label text-muted-foreground">
                Last Name
              </Label>
              <Input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className="mt-1.5 bg-transparent border-border/50 rounded-none focus:border-gold"
                placeholder="Last name"
              />
            </div>
          </div>
          <div>
            <Label className="text-luxury-label text-muted-foreground">
              Email
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 bg-transparent border-border/50 rounded-none focus:border-gold"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label className="text-luxury-label text-muted-foreground">
              Phone <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span>
            </Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1.5 bg-transparent border-border/50 rounded-none focus:border-gold"
              placeholder="+212 6XX XXX XXX"
            />
          </div>
          <Button
            onClick={() => setStep(2)}
            disabled={!form.firstName || !form.lastName || !form.email}
            className="w-full bg-gold text-charcoal hover:bg-gold-light rounded-none py-6 text-luxury-label"
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <Label className="text-luxury-label text-muted-foreground">
              Suite
            </Label>
            <Select
              value={form.suiteType}
              onValueChange={(v) => setForm({ ...form, suiteType: v })}
            >
              <SelectTrigger className="mt-1.5 bg-transparent border-border/50 rounded-none">
                <SelectValue placeholder="Select your suite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="royal-tent">
                  The Royal Tent — $1,200/night
                </SelectItem>
                <SelectItem value="oasis-pavilion">
                  The Oasis Pavilion — $1,800/night
                </SelectItem>
                <SelectItem value="sultan-suite">
                  The Sultan Suite — $2,200/night
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-luxury-label text-muted-foreground">
                Check In
              </Label>
              <PopoverDate
                date={form.checkIn}
                onSelect={(d) => setForm({ ...form, checkIn: d })}
                placeholder="Select date"
              />
            </div>
            <div>
              <Label className="text-luxury-label text-muted-foreground">
                Check Out
              </Label>
              <PopoverDate
                date={form.checkOut}
                onSelect={(d) => setForm({ ...form, checkOut: d })}
                placeholder="Select date"
              />
            </div>
          </div>

          <div>
            <Label className="text-luxury-label text-muted-foreground">
              Guests
            </Label>
            <div className="flex items-center gap-4 mt-1.5">
              <button
                onClick={() =>
                  setForm({ ...form, guests: Math.max(1, form.guests - 1) })
                }
                className="w-10 h-10 border border-border/50 flex items-center justify-center hover:border-gold transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-serif w-8 text-center">
                {form.guests}
              </span>
              <button
                onClick={() =>
                  setForm({ ...form, guests: Math.min(4, form.guests + 1) })
                }
                className="w-10 h-10 border border-border/50 flex items-center justify-center hover:border-gold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <Label className="text-luxury-label text-muted-foreground">
              Special Requests <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span>
            </Label>
            <Textarea
              value={form.specialReqs}
              onChange={(e) => setForm({ ...form, specialReqs: e.target.value })}
              className="mt-1.5 bg-transparent border-border/50 rounded-none focus:border-gold min-h-[80px]"
              placeholder="Dietary requirements, celebrations, special arrangements..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 rounded-none border-border/50 py-6"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !form.suiteType || !form.checkIn || !form.checkOut}
              className="flex-1 bg-gold text-charcoal hover:bg-gold-light rounded-none py-6 text-luxury-label"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request Reservation
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PopoverDate({
  date,
  onSelect,
  placeholder,
}: {
  date: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-1.5 h-10 border border-border/50 flex items-center px-3 text-sm text-left hover:border-gold transition-colors bg-transparent"
      >
        <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
        {date ? format(date, "MMM dd, yyyy") : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </button>
      <DialogContent className="w-auto p-0 bg-background border-border/50">
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setOpen(false);
          }}
          disabled={(d) => d < new Date()}
          className="rounded-none"
        />
      </DialogContent>
    </Dialog>
  );
}
