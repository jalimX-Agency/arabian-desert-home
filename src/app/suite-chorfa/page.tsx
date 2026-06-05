"use client";

import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { SuiteDetailPage } from "@/components/arabian/SuiteDetailPage";

export default function SuiteChorfaPage() {
  return (
    <>
      <Navigation />
      <SuiteDetailPage slug="suite-chorfa" />
      <Footer />
    </>
  );
}
