"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

/** Sun/moon toggle wired to next-themes (persists in localStorage). */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: render the icon only after mount.
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-body transition-colors duration-300 hover:border-gold/40 md:h-9 md:w-9"
    >
      {isDark ? (
        <HiOutlineSun size={16} className="text-gold" />
      ) : (
        <HiOutlineMoon size={16} className="text-gold" />
      )}
    </button>
  );
}