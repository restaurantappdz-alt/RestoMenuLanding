"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineLightningBolt,
  HiOutlineLink,
  HiOutlinePlus,
  HiOutlineTranslate,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp } from "@/components/motion";

const ICONS: IconType[] = [
  HiOutlineLightningBolt,
  HiOutlineDesktopComputer,
  HiOutlineColorSwatch,
  HiOutlineTranslate,
  HiOutlinePlus,
  HiOutlineLink,
];

/** Features — compact responsive grid (2 cols mobile → 3 across on md+). */
export default function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section id="features" className="relative mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5"
      >
        {items.map((f, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="glass card-lift flex flex-col rounded-2xl p-4 hover:border-gold/40 sm:p-5"
            >
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg border border-gold/30 bg-gold/10 sm:h-10 sm:w-10">
                <Icon size={18} className="text-gold" />
              </div>
              <h3 className="mb-1 text-sm font-bold leading-snug text-heading sm:text-base">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-body sm:text-sm">{f.body}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}