"use client";

import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <HomePage />
      </main>
      
      <Footer />
    </div>
  );
}
