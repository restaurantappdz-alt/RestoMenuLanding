"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, SPRING_SOFT } from "@/components/motion";

/** Problem — two-column comparison ("The Old Way" vs "With RestoMenu"). */
export default function Problem() {
  const t = useTranslations("problem");
  const oldWay = t.raw("oldWay.bullets") as string[];
  const newWay = t.raw("newWay.bullets") as string[];

  return (
    <section id="problem" className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={
          <>
            {t("title")}
          </>
        }
      />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={SPRING_SOFT}
        className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-body"
      >
        {t("description")}
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Old way — dimmed */}
        <motion.div
          variants={fadeUp}
          className="glass rounded-2xl p-8 opacity-70"
        >
          <h3 className="mb-6 text-lg font-bold text-faint">{t("oldWay.title")}</h3>
          <ul className="space-y-4">
            {oldWay.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/15">
                  <HiOutlineX size={12} className="text-red-400" />
                </span>
                <span className="text-sm text-body">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* With RestoMenu — glowing gold border */}
        <motion.div variants={fadeUp} className="relative">
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gold/10 opacity-60 blur-xl" />
          <div className="glass relative rounded-2xl border-gold/50 bg-gold/[0.04] p-8">
            <h3 className="mb-6 text-lg font-bold text-gold">{t("newWay.title")}</h3>
            <ul className="space-y-4">
              {newWay.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20">
                    <HiOutlineCheck size={12} className="text-gold" />
                  </span>
                  <span className="text-sm text-heading">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}