"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { HiOutlineArrowRight } from "react-icons/hi";
import SectionHeading from "@/components/SectionHeading";
import PhoneFrame from "@/components/PhoneFrame";
import { SPRING_SOFT } from "@/components/motion";
import { pub } from "@/lib/basePath";

/**
 * Solution — "Control from Your Phone, Watch It Appear on TV".
 *
 * A flow of phone screenshots → animated arrows → the TV's live menu.
 * The phone cycles through real screenshots (public/screenshots/phone/) with
 * an AnimatePresence crossfade every 2.5s, inside a frame with a mouse-driven
 * 3D tilt and a pulsing gold edge. Arrows march toward the TV; on mobile the
 * whole flow stacks vertically with arrows rotated 90°.
 */

const FLOW_ARROWS = [0, 0.18, 0.36];

export default function Solution() {
  const t = useTranslations("solution");
  const reduceMotion = useReducedMotion();

  return (
    <section id="solution" className="relative flex min-h-[80vh] items-center py-14 sm:py-20 lg:min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("title")} <span className="text-gold">{t("titleAccent")}</span>
            </>
          }
        />

        {/* Composition: phone — arrows — TV (stacks vertically on mobile) */}
        <div className="relative mx-auto mt-14 flex max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
          {/* ---- Phone: looping screenshots, 3D tilt, glowing edge ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_SOFT}
            className="w-44 shrink-0 sm:w-52"
          >
            <PhoneCarousel />
          </motion.div>

          {/* ---- Marching arrows: continuous pulse toward the TV ---- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING_SOFT, delay: 0.2 }}
            className="flex shrink-0 flex-row items-center gap-7 lg:flex-col lg:gap-9"
          >
            {FLOW_ARROWS.map((delay) => (
              <div
                key={delay}
                className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 rotate-90 lg:rotate-0 rtl:lg:rotate-180"
              >
                <motion.span
                  animate={reduceMotion ? { x: 0, opacity: 0.7 } : { x: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay }}
                >
                  <HiOutlineArrowRight size={18} className="text-gold" />
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* ---- TV: full menu screen, subtle glow ---- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SOFT, delay: 0.15 }}
            className="w-full max-w-md shrink-0 lg:w-[440px]"
          >
            <TvMenu />
          </motion.div>
        </div>

        {/* Cloud note — subtle, italic, quiet */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_SOFT, delay: 0.35 }}
          className="mx-auto mt-12 max-w-xl text-center text-sm italic text-faint"
        >
          {t("cloudNote")}
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * PhoneCarousel — crossfades one screenshot every 2.5s while in view, inside
 * the shared PhoneFrame (machined-metal shell: cursor tilt, glare, gold glow).
 * -------------------------------------------------------------------------- */

// Real screenshots served from public/screenshots/phone/ (3 images).
const SCREEN_SRCS = [
  pub("/screenshots/phone/phone-1.jpg"),
  pub("/screenshots/phone/phone-2.jpg"),
  pub("/screenshots/phone/phone-3.jpg"),
];

// Real TV screenshots served from public/screenshots/tv/ (4 images).
const TV_IMAGES = [
  pub("/screenshots/tv/tv-1.png"),
  pub("/screenshots/tv/tv-2.png"),
  pub("/screenshots/tv/tv-3.png"),
  pub("/screenshots/tv/tv-4.jpg"),
];

function PhoneCarousel() {
  const t = useTranslations("solution");
  const screens = t.raw("screens") as { title: string; caption: string }[];

  // Cycle index every 2.5s — runs from mount (no intersection gating).
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SCREEN_SRCS.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <PhoneFrame className="w-full">
        {/* Screenshot crossfade + caption — real images from public/screenshots/phone/ */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={SCREEN_SRCS[index]}
                alt={screens[index].title}
                fill
                sizes="(max-width: 640px) 176px, 208px"
                className="object-cover"
              />
              {/* Caption — title + caption from solution.screens */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-10 pt-8">
                <p className="text-xs font-bold text-white">{screens[index].title}</p>
                <p className="text-[10px] text-gray-300">{screens[index].caption}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel dots */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {SCREEN_SRCS.map((_, i) => (
              <span
                key={i}
                className={
                  i === index
                    ? "h-1.5 w-4 rounded-full bg-gold transition-all duration-300"
                    : "h-1.5 w-1.5 rounded-full bg-white/20"
                }
              />
            ))}
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * TvMenu — cycles the 3 TV screenshots inside a TV-style bezel (brand strip,
 * power LED) on a pedestal stand, with the live "TV 1 · Counter" overlay.
 * Swap the demo looks by replacing files in public/screenshots/tv/.
 * -------------------------------------------------------------------------- */
function TvMenu() {
  const t = useTranslations("solution");
  const [index, setIndex] = useState(0);

  // Cycle every 2.5s — runs from mount (no intersection gating).
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % TV_IMAGES.length), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl p-2.5" style={{ perspective: 900 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: 0.15 }}
        className="relative isolate"
      >
        {/* Pulsing glow behind the TV — animates opacity only (no box-shadow
            repaint flicker when the screenshots swap). */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-gold/25 blur-3xl"
        />

        <div className="rounded-[1.4rem] bg-gradient-to-b from-[#2b3040] to-[#14171f] p-2.5 ring-1 ring-white/10">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0d0f15]">
            <AnimatePresence>
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={TV_IMAGES[index]}
                  alt={`${t("tvLabel")} — Demo`}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* TV header overlay */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-6 pt-2.5">
              <span className="text-xs font-bold text-white">{t("tvLabel")}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {t("synced")}
              </span>
            </div>

            {/* Carousel dots */}
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {TV_IMAGES.map((_, i) => (
                <span
                  key={i}
                  className={
                    i === index
                      ? "h-1.5 w-4 rounded-full bg-gold transition-all duration-300"
                      : "h-1.5 w-1.5 rounded-full bg-white/25"
                  }
                />
              ))}
            </div>
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
      </motion.div>

      {/* Stand: neck + pedestal base */}
      <div className="mx-auto h-4 w-8 rounded-b-md bg-gradient-to-b from-[#2b3040] to-[#1a1d26]" />
      <div className="mx-auto h-2 w-28 rounded-[3px] bg-gradient-to-b from-[#343a49] to-[#191c24]" />
    </div>
  );
}