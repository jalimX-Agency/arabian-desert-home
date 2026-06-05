"use client";

import { Navigation } from "@/components/arabian/Navigation";
import { Hero } from "@/components/arabian/Hero";
import { Philosophy } from "@/components/arabian/Philosophy";
import { Suites } from "@/components/arabian/Suites";
import { Experiences } from "@/components/arabian/Experiences";
import { NightInterlude } from "@/components/arabian/NightInterlude";
import { Dining } from "@/components/arabian/Dining";
import { Events } from "@/components/arabian/Events";
import { Testimonials } from "@/components/arabian/Testimonials";
import { BookingCTA } from "@/components/arabian/BookingCTA";
import { Footer } from "@/components/arabian/Footer";

export default function Home() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onBookingOpen={scrollToBooking} />
      
      <main className="flex-1">
        <Hero />
        <Philosophy />
        <Suites />
        <NightInterlude />
        <Experiences />
        <Dining />
        <Events />
        <Testimonials />
        <BookingCTA />
      </main>
      
      <Footer />
    </div>
  );
}
