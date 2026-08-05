"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, SPRING_SOFT } from "@/components/motion";

/** Templates — two paths: built-in templates vs custom design. */
export default function Templates() {
  const t = useTranslations("templates");
  const names = t.raw("builtin.names") as string[];

  const previewStyles = [
    { name: "", bg: "bg-gradient-to-br from-[#1a1205] to-[#3a2a10]", dot: "bg-[#f5b041]", sub: "text-[#f5b041]/70" },
    { name: "", bg: "bg-gradient-to-br from-[#0d1a1f] to-[#1f3a40]", dot: "bg-[#2f7f8f]", sub: "text-[#4fafbf]/70" },
    { name: "", bg: "bg-gradient-to-br from-[#10101a] to-[#23233d]", dot: "bg-[#8b8bf0]", sub: "text-[#9d9df5]/70" },
  ];

  return (
    <section id="templates" className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={SPRING_SOFT}
        className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-body"
      >
        {t("subtitle")}
      </motion.p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Built-in templates */}
        <motion.div variants={fadeUp} className="glass card-lift rounded-2xl p-8">
          <h3 className="mb-6 text-lg font-bold text-heading">{t("builtin.title")}</h3>
          <div className="grid grid-cols-3 gap-3">
            {names.map((n, i) => (
              <div key={n} className="overflow-hidden rounded-xl border border-line">
                <div className={`relative h-24 ${previewStyles[i].bg}`}>
                  {/* Tiny fake menu rows */}
                  <div className="space-y-1.5 p-2.5">
                    <div className={`h-1 w-1.5 rounded-full ${previewStyles[i].dot}`} />
                    <div className="h-1 w-8 rounded-full bg-white/30" />
                    <div className="h-1 w-6 rounded-full bg-white/15" />
                    <div className="h-1 w-7 rounded-full bg-white/15" />
                  </div>
                </div>
                <p className="border-t border-line px-2 py-1.5 text-center text-xs font-semibold text-body">
                  {n}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-faint">{t("builtin.note")}</p>
        </motion.div>

        {/* Custom design */}
        <motion.div variants={fadeUp} className="glass card-lift relative flex flex-col rounded-2xl p-8">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gold/10 opacity-50 blur-xl" />
          <h3 className="relative mb-4 text-lg font-bold text-gold">{t("custom.title")}</h3>
          <p className="relative mb-8 leading-relaxed text-body">{t("custom.text")}</p>
          <div className="relative mt-auto">
            <a href="#contact" className="btn-ghost w-full sm:w-auto">
              <HiOutlineSparkles size={16} /> {t("custom.button")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}