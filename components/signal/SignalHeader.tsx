"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import { ArrowRight, AudioLines, Menu, Pause, Play, UserRound, X, Zap } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProgress } from "./ProgressProvider";
import { useMotionSettings } from "./MotionSettings";
import type { ModuleId } from "@/lib/signal-progress";
export type SignalDestination = ModuleId | "modules" | "lab" | "progress";
const navigation: { label: string; destination: SignalDestination }[] = [
  { label: "AI Fundamentals", destination: "fundamentals" },
  { label: "AI Tools", destination: "tools" },
  { label: "AI Ethics", destination: "ethics" },
];

export function Brand({ linked = true }: { linked?: boolean }) {
  const content = <><span className="brand-mark"><AudioLines size={24} strokeWidth={2.3} aria-hidden="true" /></span><span className="brand-word">signal<span className="brand-period">.</span></span></>;
  return linked ? <a className="brand" href="#main" aria-label="Signal home">{content}</a> : <span className="brand">{content}</span>;
}

export function SignalHeader({ onNavigate }: { onNavigate: (destination: SignalDestination) => void }) {
  const { progress, loading } = useProgress();
  const { xp } = progress;
  const { disabled, systemReduced, toggle } = useMotionSettings();
  const { scrollYProgress } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const afterMenuClose = useRef<(() => void) | null>(null);
  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (breakpoint.matches) setMenuOpen(false); };
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => breakpoint.removeEventListener("change", closeOnDesktop);
  }, []);

  return <header className="site-header">
    {!disabled && <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />}
    <div className="page-width header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item, index) => <a key={item.destination} href={"#ai-" + item.destination} className="nav-link" onClick={event => { event.preventDefault(); onNavigate(item.destination); }}>
          <span className="nav-index">0{index + 1}</span>{item.label}
        </a>)}
      </nav>
      <div className="header-actions">
        <button type="button" className="motion-toggle icon-button" onClick={toggle} aria-pressed={disabled} aria-label={systemReduced ? 'Reduced motion is on in your device settings' : disabled ? 'Enable animations' : 'Pause all animations'} disabled={systemReduced} title={disabled ? 'Motion paused' : 'Pause motion'}>{disabled ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>
        <motion.button type="button" className="xp-pill" onClick={() => onNavigate("progress")} aria-label={`View progress: ${xp} experience points`} whileTap={{ scale: 0.96 }}>
          <Zap size={15} strokeWidth={2.2} aria-hidden="true" />
          <span className="xp-number"><AnimatePresence mode="popLayout" initial={false}><motion.span key={xp} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.2 }}>{loading ? "–" : xp}</motion.span></AnimatePresence></span>
          <span>XP</span>
        </motion.button>
        <div className="user-status" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={xp % 100} aria-label="Experience toward the next level" aria-valuetext={`Level ${Math.floor(xp / 100) + 1} Explorer, ${xp % 100} of 100 XP toward the next level`} title={`${progress.completed.length} of 3 intro modules completed`}>
          <span className="user-avatar"><svg className="level-ring" viewBox="0 0 44 44" aria-hidden="true"><circle className="ring-track" cx="22" cy="22" r="19" /><circle className="ring-value" cx="22" cy="22" r="19" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - xp % 100} /></svg><UserRound size={17} aria-hidden="true" /></span>
          <span className="user-label">Explorer<span>Level {Math.floor(xp / 100) + 1} · {progress.completed.length}/3 intros</span></span>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><button type="button" className="menu-toggle" aria-label="Open navigation menu"><Menu size={23} aria-hidden="true" /></button></SheetTrigger>
          <SheetContent className="signal-menu" showCloseButton={false} onCloseAutoFocus={event => {
            if (afterMenuClose.current) { event.preventDefault(); const next = afterMenuClose.current; afterMenuClose.current = null; next(); }
          }}>
            <SheetHeader className="p-0 text-left">
              <div className="flex items-center justify-between"><Brand linked={false} /><SheetClose asChild><button className="icon-button" aria-label="Close navigation menu"><X size={22} aria-hidden="true" /></button></SheetClose></div>
              <SheetTitle className="sr-only">Explore Signal</SheetTitle>
              <SheetDescription className="mt-6 text-base">Understand AI. Make something useful. Keep your judgment.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="mobile-nav">
              {navigation.map((item, index) => <motion.a key={item.destination} href={"#ai-" + item.destination} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} onClick={event => {
                event.preventDefault();
                afterMenuClose.current = () => onNavigate(item.destination);
                setMenuOpen(false);
              }}><span>{item.label}</span><ArrowRight size={20} aria-hidden="true" /></motion.a>)}
            </nav>
            <div className="menu-bottom"><Zap size={18} aria-hidden="true" /><span>{xp} XP earned</span><span className="menu-level">Keep exploring</span></div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>;
}

