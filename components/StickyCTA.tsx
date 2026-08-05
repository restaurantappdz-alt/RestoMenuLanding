"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Mobile-only sticky bottom CTA bar — appears after scrolling past ~25% of
 *  the page, fades out near the contact section (so it never covers the form).
 *  Uses transform/opacity only; respects reduced motion and safe-area insets. */
export default function StickyCTA() {
  const t = useTranslations("nav");
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      const contact = document.getElementById("contact");
      let near = false;
      if (contact) {
        const r = contact.getBoundingClientRect();
        near = r.top < window.innerHeight * 0.7;
      }
      setShow(scrolled > total * 0.2 && !near);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 200, damping: 24 }}
          className="fixed inset-x-0 bottom-0 z-50 md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="border-t border-gold/20 bg-[#0b0c10]/85 px-4 py-3 backdrop-blur-xl">
            <a
              href="#contact"
              className="btn-gold w-full min-h-12"
              aria-label={t("join")}
            >
              {t("join")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
