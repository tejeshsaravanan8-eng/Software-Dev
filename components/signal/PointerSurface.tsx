"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionSettings } from "./MotionSettings";
import type { ReactNode } from "react";

/** Pointer work goes straight to Motion values, never through per-frame React state. */
export function PointerSurface({ children, className = '', tilt = 3 }: { children: ReactNode; className?: string; tilt?: number }) {
  const { disabled } = useMotionSettings();
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 180, damping: 28 });
  const rotateY = useSpring(rawY, { stiffness: 180, damping: 28 });
  return <motion.div className={`pointer-surface ${className}`} style={{ rotateX: disabled ? 0 : rotateX, rotateY: disabled ? 0 : rotateY, transformPerspective: 1200 }}
    onPointerMove={event => {
      if (disabled || event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
      rawX.set((.5 - y) * tilt); rawY.set((x - .5) * tilt);
      event.currentTarget.style.setProperty('--pointer-x', `${x * 100}%`);
      event.currentTarget.style.setProperty('--pointer-y', `${y * 100}%`);
    }} onPointerLeave={() => { rawX.set(0); rawY.set(0); }}>
    {children}
  </motion.div>;
}
