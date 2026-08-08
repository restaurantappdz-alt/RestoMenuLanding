"use client";

import { ThemeProvider } from "next-themes";

/**
 * Global providers (client-only). next-themes toggles the `dark` class on
 * <html>, so all theme styles come from Tailwind's `dark:` variants and the
 * CSS variables in globals.css. Dark is the default theme.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}