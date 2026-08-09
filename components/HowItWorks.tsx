"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  HiOutlineDesktopComputer,
  HiOutlineDeviceMobile,
  HiOutlinePlay,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp } from "@/components/motion";

const STEP_ICONS: IconType[] = [HiOutlineDeviceMobile, HiOutlineDesktopComputer, HiOutlinePlay];

/** How It Works — three numbered steps, fade-in sequence only. */
export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section id="how-it-works" className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="grid gap-6 md:grid-cols-3"
      >
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[i];
          return (
            <motion.div key={s.title} variants={fadeUp} className="glass relative rounded-2xl p-8">
              <span className="text-5xl font-bold text-gold/25">{i + 1}</span>
              <div className="mb-4 mt-2 grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10">
                <Icon size={20} className="text-gold" />
              </div>
              <h3 className="mb-1.5 text-lg font-bold text-heading">{s.title}</h3>
              <p className="text-sm leading-relaxed text-body">{s.body}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}