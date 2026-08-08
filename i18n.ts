import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export default getRequestConfig(async ({ requestLocale }) => {
  // Resolve the locale from the middleware-provided request param,
  // falling back to the default when unknown (e.g. the not-found path).
  let locale = (await requestLocale) as Locale | undefined;
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    // Merge app-level messages so the whole tree is translated.
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});