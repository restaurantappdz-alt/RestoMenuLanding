"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HiOutlineCheck } from "react-icons/hi";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp } from "@/components/motion";

type Plan = {
  name: string;
  price: string;
  period: string;
  cta: string;
  badge?: string;
  features: string[];
};

/** Pricing — Starter / Pro (highlighted) / Premium. */
export default function Pricing() {
  const t = useTranslations("pricing");

  const plans: (Plan & { featured: boolean })[] = [
    { ...(t.raw("starter") as Plan), featured: false },
    { ...(t.raw("pro") as Plan), featured: true },
    { ...(t.raw("premium") as Plan), featured: false },
  ];

  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20 sm:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="grid items-stretch gap-6 md:grid-cols-3"
      >
        {plans.map((p) => (
          <motion.div
            key={p.name}
            variants={fadeUp}
            className={`relative flex flex-col rounded-2xl p-8 ${
              p.featured
                ? "glass border-gold/60 md:-translate-y-3"
                : "glass"
            }`}
          >
            {p.featured && (
              <>
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gold/10 opacity-60 blur-xl" />
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-ink rtl:translate-x-1/2">
                  {p.badge}
                </span>
              </>
            )}

            <h3 className={`text-lg font-bold ${p.featured ? "text-gold" : "text-heading"}`}>
              {p.name}
            </h3>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-heading">{p.price}</span>
              <span className="text-sm text-faint">{p.period}</span>
            </div>

            <ul className="mb-8 mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20">
                    <HiOutlineCheck size={12} className="text-gold" />
                  </span>
                  <span className="text-sm text-body">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`mt-auto ${p.featured ? "btn-gold w-full" : "btn-ghost w-full"}`}
            >
              {p.cta}
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}