"use client";

import { ThemeProvider } from "next-themes";

/**
 * Global providers (client-only). The site is FORCED to light mode via
 * `forcedTheme` — next-themes always applies the light theme and ignores any
 * saved device preference or localStorage value, so every phone/PC sees the
 * same light site. The `.dark` block in globals.css never activates.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}