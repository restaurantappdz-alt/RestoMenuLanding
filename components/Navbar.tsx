"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Magnetic from "@/components/Magnetic";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";

/**
 * Sticky glass navbar — keeps a higher z-index than the mobile drawer so it
 * stays visible above the overlay. Desktop: section links, language switcher
 * and "Contact". Mobile: logo, language switcher + hamburger opening a
 * spring-animated full-screen drawer (MobileMenu).
 */
export default function Navbar() {
  const t = useTranslations("nav");
  const ts = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);

  // Section links — same list as the mobile drawer.
  const links = [
    { href: "#problem", label: ts("problem.eyebrow") },
    { href: "#solution", label: ts("solution.eyebrow") },
    { href: "#features", label: ts("features.eyebrow") },
    { href: "#templates", label: ts("templates.eyebrow") },
    { href: "#how-it-works", label: ts("howItWorks.eyebrow") },
    { href: "#pricing", label: ts("pricing.eyebrow") },
    { href: "#contact", label: ts("contact.eyebrow") },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="glass fixed inset-x-0 top-0 z-[60] border-x-0 border-t-0 supports-[padding-top:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]"
      >
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo — gold dot after "Menu" */}
          <a href="#top" className="flex min-h-11 items-center gap-0.5">
            <span className="text-xl font-bold tracking-tight text-heading">RestoMenu</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </a>

          {/* Desktop section links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-body transition-colors duration-200 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop controls */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher variant="toggle" />
            <ThemeToggle />
            <Magnetic>
              <a href="#contact" className="btn-ghost !px-4 !py-2 text-sm sm:!px-6">
                {t("join")}
              </a>
            </Magnetic>
          </div>

          {/* Mobile controls — language picker stays visible in the bar */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="glass grid h-11 w-11 place-items-center rounded-full text-body transition-colors duration-300 hover:border-gold/40"
            >
              {menuOpen ? (
                <HiOutlineX size={18} className="text-gold" />
              ) : (
                <HiOutlineMenu size={18} className="text-gold" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Rendered OUTSIDE the header — the header's backdrop-filter would otherwise
          become the containing block for these `fixed` elements and squash the
          drawer into just the navbar's height. */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}