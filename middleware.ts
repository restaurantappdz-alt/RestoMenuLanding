import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "fr", "ar"],
  // Used when no locale matches: phone language isn't supported → Arabic.
  defaultLocale: "ar",
  // Locale is always a prefix in the URL: /en, /fr, /ar
  localePrefix: "always",
});

export const config = {
  // Skip all paths that should not be internationalized.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};