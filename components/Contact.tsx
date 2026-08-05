"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import SectionHeading from "@/components/SectionHeading";
import { fadeUp, SPRING_SOFT } from "@/components/motion";

type Status = "idle" | "loading" | "success" | "error";

/** Contact — contact info card + message form (fake 1.6s submit). */
export default function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const info = [
    { icon: HiOutlineMail, label: t("info.email"), value: "hello@restomenu.app", latin: true },
    { icon: HiOutlinePhone, label: t("info.phone"), value: "+213 555 12 34 56", latin: true },
    { icon: HiOutlineLocationMarker, label: t("info.location"), value: t("info.locationValue") },
    { icon: HiOutlineClock, label: t("info.hours"), value: t("info.hoursValue") },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.name.trim() || !validEmail || !form.message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1600);
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-5 py-14 sm:py-20 sm:px-8">
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

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="grid gap-6 lg:grid-cols-5"
      >
        {/* Info card */}
        <motion.div variants={fadeUp} className="glass card-lift rounded-2xl p-8 lg:col-span-2">
          <ul className="space-y-7">
            {info.map(({ icon: Icon, label, value, latin }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                  <Icon size={20} aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-faint rtl:tracking-normal">
                    {label}
                  </span>
                  {/* Latin content (email/phone) stays LTR inside RTL locales. */}
                  <span dir={latin ? "ltr" : undefined} className="mt-0.5 block font-semibold text-heading">
                    {value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Message form */}
        <motion.form
          variants={fadeUp}
          onSubmit={submit}
          className="glass rounded-2xl p-8 lg:col-span-3"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder={t("namePlaceholder")}
              aria-label={t("namePlaceholder")}
              className="glass w-full rounded-full px-5 py-3.5 text-base text-heading placeholder:text-faint focus:border-gold/60 focus:outline-none"
            />
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder={t("emailPlaceholder")}
              aria-label={t("emailPlaceholder")}
              className="glass w-full rounded-full px-5 py-3.5 text-base text-heading placeholder:text-faint focus:border-gold/60 focus:outline-none"
            />
          </div>
          <textarea
            rows={5}
            value={form.message}
            onChange={set("message")}
            placeholder={t("messagePlaceholder")}
            aria-label={t("messagePlaceholder")}
            className="glass mt-4 w-full resize-none rounded-2xl px-5 py-3.5 text-base text-heading placeholder:text-faint focus:border-gold/60 focus:outline-none"
          />

          <div className="mt-5 flex items-center gap-4">
            <button type="submit" className="btn-gold shrink-0 min-h-12" disabled={status === "loading"}>
              {status === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-ink/30 border-t-gold-ink" />
              ) : (
                <>
                  {t("submit")} <HiOutlinePaperAirplane size={16} className="rtl:-scale-x-100" />
                </>
              )}
            </button>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm font-semibold text-emerald-400"
                >
                  <HiOutlineCheckCircle size={18} /> {t("success")}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold text-red-400"
                >
                  {t("error")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
