import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import FloatingIcons from "@/components/FloatingIcons";
import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/StickyCTA";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import Templates from "@/components/Templates";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  return (
    <main className="relative min-h-screen">
      <FloatingIcons />

      <Navbar />
      <StickyCTA />

      <Hero />
      <SectionDivider />
      <Problem />
      <SectionDivider />
      <Solution />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Templates />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <Pricing />
      <SectionDivider />
      <Contact />

      <Footer />
    </main>
  );
}