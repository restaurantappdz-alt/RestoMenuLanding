"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { SPRING_SOFT } from "@/components/motion";

/**
 * PhoneFrame — a machined-metal phone mockup shell (pure CSS, no images).
 *
 * Renders the screen `children` edge-to-edge on an OLED display (notchless),
 * with side buttons, a cursor-tracked glass glare, a ±6° spring 3D tilt, a
 * slow float loop with a grounding shadow, and a breathing gold glow. All
 * chrome is decorative (`aria-hidden`) — the screen content stays the
 * accessible content.
 *
 * Sizing: pass a width class via `className` (e.g. `w-56`, `w-full`); the
 * metal body is aspect-locked (428:868, iPhone 14 Pro proportions) so every
 * part scales with the width. `floating={false}` disables the ambient motion
 * (float loop + ground shadow + gold glow) while keeping the tilt/glare.
 */

interface PhoneFrameProps {
  children: React.ReactNode;
  /** Width/positioning classes for the root wrapper (e.g. "w-56"). */
  className?: string;
  /** Ambient motion: float loop + grounding shadow + breathing gold glow. */
  floating?: boolean;
}

// Chamfered metal edge — concentric rings + a gold-tinted inner highlight.
// Static multi-layer box-shadows (no repaint churn); only transform/opacity animate.
const FRAME_CHAMFER = [
  "0 0 0 2px #2f2d2c",
  "0 0 0 4px #0e0d0d",
  "0 0 0 8px #403f3d",
  "0 0 0 8.5px #1d1c1b",
  "inset 0 0 3px 2px rgba(245, 176, 65, 0.35)",
  "0 24px 60px rgba(0, 0, 0, 0.6)",
  "0 12px 24px rgba(0, 0, 0, 0.4)",
].join(", ");

// Subtle diagonal glass band — slides with the cursor. Kept low so it reads
// as a glass sheen on the obsidian surface, not a white streak.
const GLARE_GRADIENT =
  "linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 60%)";

export default function PhoneFrame({
  children,
  className,
  floating = true,
}: PhoneFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion: ambient loops and cursor tilt go static.
  const reduceMotion = useReducedMotion();

  // Cursor-tracked 3D tilt — calm ±6°, heavy spring so it glides, never snaps.
  const rotateX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30, mass: 2 });

  // Cursor-tracked glare — same cursor, gentler spring, transform-only motion.
  const glareX = useSpring(useMotionValue(0.5), { stiffness: 120, damping: 25 });
  const glareY = useSpring(useMotionValue(0.5), { stiffness: 120, damping: 25 });
  const glareXpx = useTransform(glareX, [0, 1], [5, -5]);
  const glareYpx = useTransform(glareY, [0, 1], [5, -5]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(offsetX * 6);
    rotateX.set(offsetY * -6);
    glareX.set(offsetX + 0.5);
    glareY.set(offsetY + 0.5);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(0.5);
    glareY.set(0.5);
  };

  return (
    <motion.div
      ref={rootRef}
      className={`relative isolate ${className ?? ""}`}
      style={{ perspective: 1200 }}
    >
      {/* Breathing gold glow — animates opacity only (no blur/repaint churn). */}
      {floating && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_SOFT, delay: 0.35 }}
          className="pointer-events-none absolute -inset-10 -z-10"
        >
          <motion.div
            className="h-full w-full rounded-full bg-gold/15 blur-3xl"
            animate={reduceMotion ? { opacity: 0.75 } : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Grounding shadow — widens & fades as the phone rises (opposite phase). */}
      {floating && (
        <motion.div
          aria-hidden
          animate={reduceMotion ? { opacity: 0.3 } : { scale: [1, 0.92, 1], opacity: [0.4, 0.22, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-7 left-1/2 -z-10 h-6 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl"
        />
      )}

      {/* Entrance: the shell slides in first… */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING_SOFT}
      >
        {/* Float loop — the whole phone drifts, the shadow breathes opposite. */}
        <motion.div
          animate={reduceMotion ? { y: 0 } : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* 3D tilt layer — springs toward the cursor, never snaps. */}
          <motion.div
            onMouseMove={reduceMotion ? undefined : onMouseMove}
            onMouseLeave={reduceMotion ? undefined : onMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
          >
            {/* Metal body — aspect-locked to iPhone 14 Pro proportions. */}
            <div
              className="relative aspect-[428/868] rounded-[26px] bg-gradient-to-b from-[#2a2826] to-[#14171f]"
              style={{ boxShadow: FRAME_CHAMFER }}
            >
              {/* Side buttons — protrude past the edge (inline-start side). */}
              <span
                aria-hidden
                className="absolute start-[-3px] top-[13%] h-[16px] w-[3px] rounded-[1.5px] bg-[#2a2826]"
              />
              <span
                aria-hidden
                className="absolute start-[-3px] top-[18%] h-[28px] w-[3px] rounded-[1.5px] bg-[#2a2826]"
              />
              <span
                aria-hidden
                className="absolute start-[-3px] top-[28%] h-[28px] w-[3px] rounded-[1.5px] bg-[#2a2826]"
              />
              {/* Power button (inline-end side). */}
              <span
                aria-hidden
                className="absolute end-[-3px] top-[20%] h-[52px] w-[3px] rounded-[1.5px] bg-[#2a2826]"
              />

              {/* OLED screen — a near-black rim keeps the screenshot off the metal. */}
              <div className="absolute inset-[5px] overflow-hidden rounded-[21px] bg-black">
                {/* …then the screen content… */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...SPRING_SOFT, delay: 0.18 }}
                  className="absolute inset-0"
                >
                  {children}
                </motion.div>

                {/* Glass glare — a diagonal band that slides with the cursor. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-4"
                  style={{ x: glareXpx, y: glareYpx, backgroundImage: GLARE_GRADIENT }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
