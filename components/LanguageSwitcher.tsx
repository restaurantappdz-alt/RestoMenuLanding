"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineChevronDown, HiOutlineGlobeAlt } from "react-icons/hi";
import { locales, type Locale } from "@/i18n";
import { SPRING_SOFT } from "@/components/motion";

const FLAGS: Record<Locale, string> = { en: "🇬🇧", fr: "🇫🇷", ar: "🇸🇦" };
const NATIVE: Record<Locale, string> = { en: "English", fr: "Français", ar: "العربية" };

/**
 * Locale switcher with two variants:
 * - "dropdown" (default): compact globe + active language, opens an animated menu.
 * - "toggle": inline segmented control (EN / FR / AR) for headers with room.
 * Uses next-intl navigation so switching keeps the current path and only swaps
 * the locale prefix (/en → /fr → /ar). Arabic renders RTL automatically via
 * the <html dir> set in the layout.
 */
export default function LanguageSwitcher({
  variant = "dropdown",
  compact = false,
  align = "end",
}: {
  variant?: "dropdown" | "toggle";
  compact?: boolean;
  align?: "start" | "end";
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchTo = (next: Locale) => {
    router.replace(pathname, { locale: next });
    setOpen(false);
  };

  if (variant === "toggle") {
    return (
      <div
        role="group"
        aria-label="Change language"
        className="glass flex items-center gap-0.5 rounded-full p-1"
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-label={`Switch to ${NATIVE[l]}`}
            aria-current={l === locale ? "true" : undefined}
            title={NATIVE[l]}
            className={`grid h-9 min-w-11 place-items-center rounded-full px-3 text-xs font-bold transition-colors duration-200 ${
              l === locale ? "bg-gold/15 text-gold" : "text-body hover:text-gold"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        className="glass flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-body transition-colors duration-300 hover:border-gold/40"
      >
        <HiOutlineGlobeAlt size={15} className="text-gold" />
        <span>{FLAGS[locale]}</span>
        {!compact && <span className="hidden sm:inline">{NATIVE[locale]}</span>}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <HiOutlineChevronDown size={13} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.ul
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={SPRING_SOFT}
              className={`glass absolute top-full z-20 mt-2 w-36 overflow-hidden rounded-xl py-1 ${
                align === "end" ? "end-0" : "start-0"
              }`}
            >
              {locales.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => switchTo(l)}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-start text-xs font-medium transition-colors duration-150 hover:bg-line ${
                      l === locale ? "text-gold" : "text-body"
                    }`}
                  >
                    <span>{FLAGS[l]}</span>
                    <span>{NATIVE[l]}</span>
                    {l === locale && <HiOutlineGlobeAlt size={11} className="ms-auto text-gold" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}