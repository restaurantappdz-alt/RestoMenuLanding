"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n";

const LOCALES = locales as readonly string[];

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Static export disables middleware, so "/" must pick a locale on the client:
 * remembered choice (NEXT_LOCALE, written by the switcher) → phone/browser
 * language (best-fit on the primary subtag) → Arabic as the final fallback.
 */
function detectLocale(): Locale {
  const remembered = readCookie("NEXT_LOCALE");
  if (remembered && LOCALES.includes(remembered)) return remembered as Locale;

  const preferred = navigator.languages ?? [navigator.language];
  for (const lang of preferred) {
    const primary = lang.toLowerCase().split("-")[0];
    if (LOCALES.includes(primary)) return primary as Locale;
  }

  return "ar";
}

export default function RedirectToLocale() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${detectLocale()}`);
  }, [router]);

  return null;
}
