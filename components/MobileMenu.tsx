"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineArrowRight, HiOutlineX } from "react-icons/hi";
import { SPRING_SOFT } from "@/components/motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Mobile drawer — full-screen overlay that slides in from the inline-end
 * (mirrored to the left in RTL). The navbar keeps a higher z-index
 * (`z-[60]` vs `z-50` here) so it stays visible above the overlay. Body
 * scroll is locked while open.
 */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const isRtl = locale === "ar";

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "#problem", label: t("problem.eyebrow") },
    { href: "#solution", label: t("solution.eyebrow") },
    { href: "#features", label: t("features.eyebrow") },
    { href: "#templates", label: t("templates.eyebrow") },
    { href: "#how-it-works", label: t("howItWorks.eyebrow") },
    { href: "#pricing", label: t("pricing.eyebrow") },
    { href: "#contact", label: t("contact.eyebrow") },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — dims the page behind the drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
          {/* Drawer — full screen, slides from the inline-end below the navbar */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={SPRING_SOFT}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-surface md:hidden"
          >
            {/* Content offset below the fixed navbar */}
            <div className="flex min-h-full flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-20 sm:px-8">
              {/* Top row: logo + close button */}
              <div className="flex items-center justify-between">
                <span className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold text-heading">RestoMenu</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="glass grid h-11 w-11 place-items-center rounded-full text-body transition-colors duration-300 hover:border-gold/40"
                >
                  <HiOutlineX size={20} className="text-gold" />
                </button>
              </div>

              {/* Section links */}
              <nav className="mt-8 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_SOFT, delay: 0.05 * i }}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-body transition-colors duration-150 hover:bg-line"
                  >
                    {l.label}
                    <HiOutlineArrowRight
                      size={16}
                      className="text-gold rtl:-scale-x-100"
                    />
                  </motion.a>
                ))}
              </nav>

              {/* Bottom: language + theme + CTA */}
              <div className="mt-auto flex flex-col gap-4 pt-8">
                <div className="flex items-center justify-between gap-4">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <a href="#contact" onClick={onClose} className="btn-gold w-full">
                  {t("nav.join")}
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
