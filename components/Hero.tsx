"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { HiOutlineArrowRight, HiOutlinePlay } from "react-icons/hi";
import Magnetic from "@/components/Magnetic";
import PhoneFrame from "@/components/PhoneFrame";
import { SPRING_SOFT } from "@/components/motion";
import { pub } from "@/lib/basePath";

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03, delayChildren: 0.15 } },
};
const headlineLetter: Variants = {
  hidden: { y: "115%", opacity: 0 },
  // Gentle spring, settles in ~0.5s — calm, not bouncy
  show: { y: "0%", opacity: 1, transition: { type: "spring", stiffness: 170, damping: 18 } },
};

// Real phone screenshots served from public/screenshots/phone/ (3 images).
const PHONE_IMAGES = [
  pub("/screenshots/phone/phone-1.jpg"),
  pub("/screenshots/phone/phone-2.jpg"),
  pub("/screenshots/phone/phone-3.jpg"),
];

// Real TV screenshots served from public/screenshots/tv/ (3 images).
const TV_IMAGES = [
  pub("/screenshots/tv/tv-1.png"),
  pub("/screenshots/tv/tv-2.png"),
  pub("/screenshots/tv/tv-3.png"),
];

/** Hero — staggered headline, CTAs, floating phone + TV mockups (±2° tilt). */
export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const words = t.raw("words") as string[];

  // Arabic renders as one block (letters must stay joined — no per-letter split).
  const isArabic = locale === "ar";

  // Respect prefers-reduced-motion: no float loops, no mouse tilt.
  const reduceMotion = useReducedMotion();

  // Minimal mouse tilt (±2°) over the mockups — subtle, non-distracting.
  const mockupRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), {
    stiffness: 140,
    damping: 22,
  });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), {
    stiffness: 140,
    damping: 22,
  });

  return (
    <section
      id="top"
      className="relative flex min-h-screen min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 sm:gap-14 sm:py-20 sm:px-8 lg:grid-cols-2 lg:gap-6">
        {/* ---------- Copy ---------- */}
        <div className="text-center lg:text-start">
          {isArabic ? (
            <motion.h1
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...SPRING_SOFT, delay: 0.15, duration: 0.7 }}
              aria-label={words.join(" ")}
              className="text-4xl font-bold leading-[1.25] tracking-tight text-heading sm:text-6xl xl:text-7xl"
              dir="rtl"
            >
              {words.map((word, wi) => (
                <span key={wi} className={word.endsWith(".") ? "text-gold" : ""}>
                  {word}
                  {wi < words.length - 1 ? " " : ""}
                </span>
              ))}
            </motion.h1>
          ) : (
            <motion.h1
              initial="hidden"
              animate="show"
              variants={headlineContainer}
              aria-label={words.join(" ")}
              className="text-4xl font-bold leading-[1.08] tracking-tight text-heading sm:text-6xl xl:text-7xl"
            >
              {words.map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-1 align-bottom">
                  {word.split("").map((ch, ci) => (
                    <motion.span
                      key={ci}
                      variants={headlineLetter}
                      className={`inline-block ${word.endsWith(".") ? "text-gold" : ""}`}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  {wi < words.length - 1 && <span>&nbsp;</span>}
                </span>
              ))}
            </motion.h1>
          )}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.4 }}
            className="mx-auto mt-6 max-w-md text-base leading-relaxed text-body sm:text-lg lg:mx-0"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.55 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Magnetic>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                href="#contact"
                className="btn-gold min-h-12"
              >
                {t("getApp")} <HiOutlineArrowRight size={18} />
              </motion.a>
            </Magnetic>
            <Magnetic>
              <a href="#solution" className="btn-ghost min-h-12">
                <HiOutlinePlay size={16} /> {t("watchDemo")}
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* ---------- Mockups (float y ±6px over 6s + ±2° tilt) ---------- */}
        <motion.div
          ref={mockupRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.35 }}
          style={{ perspective: 900, rotateX, rotateY }}
          onMouseMove={reduceMotion ? undefined : (e) => {
            const rect = mockupRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
            mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
          }}
          onMouseLeave={reduceMotion ? undefined : () => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 lg:h-[520px] lg:flex-row lg:justify-center lg:gap-0"
        >
          {/* Phone — cycling screenshots */}
          <motion.div
            animate={reduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="lg:absolute lg:start-0 lg:top-2"
          >
            <PhoneMockup />
          </motion.div>
          {/* TV — live menu screenshot */}
          <motion.div
            animate={reduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="lg:absolute lg:end-0 lg:top-20"
          >
            <TvMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* Phone mockup — cycles the real screenshots with a fade carousel.
   Replace files in public/screenshots/phone/ to swap the images. */
function PhoneMockup() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [index, setIndex] = useState(0);

  // Cycle every 2.6s while the mockup is in view.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PHONE_IMAGES.length), 2600);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref}>
      <PhoneFrame className="w-56">
        {/* Screenshot crossfade — real images from public/screenshots/phone/ */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={PHONE_IMAGES[index]}
                alt={`${t("phoneLabel")} — Demo`}
                width={270}
                height={480}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gold LIVE badge */}
          <span className="absolute end-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-gold-ink">
            {t("live")}
          </span>

          {/* Carousel dots — overlaid at the screen bottom over a soft scrim */}
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent pb-2 pt-8">
            {PHONE_IMAGES.map((_, i) => (
              <span
                key={i}
                className={
                  i === index
                    ? "h-1.5 w-4 rounded-full bg-gold transition-all duration-300"
                    : "h-1.5 w-1.5 rounded-full bg-line"
                }
              />
            ))}
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* TV mockup — cycles the 3 TV screenshots (like the phone) inside a
   TV-style bezel with a brand strip, power LED and pedestal stand. */
function TvMockup() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [index, setIndex] = useState(0);

  // Cycle every 2.6s while the mockup is in view.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TV_IMAGES.length), 2600);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div className="relative isolate w-[300px] sm:w-[360px]">
      {/* Pulsing glow behind the TV — animates opacity only (cheap, and avoids
          the box-shadow repaint flicker when the screenshots swap). */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-gold/25 blur-3xl"
      />

      {/* Bezel */}
      <div
        ref={ref}
        className="rounded-[1.4rem] bg-gradient-to-b from-[#2b3040] to-[#14171f] p-2.5 ring-1 ring-white/10"
      >
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0d0f15]">
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={TV_IMAGES[index]}
                alt="RestoMenu — TV menu preview"
                width={640}
                height={360}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <span className="absolute end-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-gold-ink">
            {t("synced")}
          </span>
        </div>
        {/* Bottom bezel: brand + power LED */}
        <div className="flex items-center justify-between px-1.5 pt-2">
          <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">
            RestoMenu
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        </div>
      </div>
      {/* Stand: neck + pedestal base */}
      <div className="mx-auto h-4 w-8 rounded-b-md bg-gradient-to-b from-[#2b3040] to-[#1a1d26]" />
      <div className="mx-auto h-2 w-28 rounded-[3px] bg-gradient-to-b from-[#343a49] to-[#191c24]" />
    </div>
  );
}