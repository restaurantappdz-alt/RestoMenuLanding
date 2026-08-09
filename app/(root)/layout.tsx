import type { ReactNode } from "react";

/**
 * Second root layout (multiple-root-layouts pattern): "/" has no locale, so
 * it gets its own minimal root layout; all localized routes keep using
 * app/[locale]/layout.tsx as their root layout.
 */
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
