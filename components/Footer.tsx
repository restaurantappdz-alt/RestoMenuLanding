"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

/** Footer — tagline, Privacy/Terms links, language + theme switchers. */
export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-10 sm:px-8 md:flex-row md:justify-between">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold tracking-tight text-heading">RestoMenu</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <p className="text-xs text-faint">{t("tagline")}</p>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6 text-sm text-body">
          <a href="#" className="transition-colors duration-200 hover:text-gold">
            {t("privacy")}
          </a>
          <a href="#" className="transition-colors duration-200 hover:text-gold">
            {t("terms")}
          </a>
        </nav>

        {/* Language + theme */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <p className="border-t border-line py-5 text-center text-xs text-faint">{t("rights")}</p>
    </footer>
  );
}