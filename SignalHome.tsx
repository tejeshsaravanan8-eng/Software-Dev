"use client";
import { useCallback, useEffect, useState } from "react";
import { MotionSettings, useMotionSettings } from "./MotionSettings";
import { MODULE_IDS, type ModuleId } from "@/lib/signal-progress";
import { ProgressProvider } from "./ProgressProvider";
import { SignalHeader, type SignalDestination } from "./SignalHeader";
import { SignalHero } from "./SignalHero";
import { LearningPath } from "./LearningPath";
import { InteractiveLab } from "./InteractiveLab";
import { ProgressDashboard } from "./ProgressDashboard";
import { SignalFooter } from "./SignalFooter";

function HomepageContent() {
  const [active, setActive] = useState<ModuleId>('fundamentals');
  const { disabled: reduced } = useMotionSettings();
  const navigate = useCallback((destination: SignalDestination) => {
    const module = MODULE_IDS.includes(destination as ModuleId);
    if (module) setActive(destination as ModuleId);
    const hash = module ? `ai-${destination}` : destination;
    window.history.replaceState(null, '', `#${hash}`);
    requestAnimationFrame(() => {
      const target = document.getElementById(module ? 'lab' : destination);
      target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      const focus = module ? document.getElementById(hash) : target;
      focus?.focus({ preventScroll: true });
    });
  }, [reduced]);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const module = MODULE_IDS.find(id => hash === `ai-${id}`);
    if (!module) return;
    setActive(module);
    const frame = requestAnimationFrame(() => {
      document.getElementById('lab')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div className="signal-app">
    <a href="#main" className="skip-link">Skip to main content</a>
    <SignalHeader onNavigate={navigate} />
    <main id="main" tabIndex={-1}>
      <SignalHero onNavigate={navigate} />
      <LearningPath onExplore={navigate} />
      <InteractiveLab active={active} onChange={id => {
        setActive(id);
        window.history.replaceState(null, '', `#ai-${id}`);
      }} />
      <ProgressDashboard onContinue={navigate} />
    </main>
    <SignalFooter />
  </div>;
}
export function SignalHome() {
  return <MotionSettings><ProgressProvider><HomepageContent /></ProgressProvider></MotionSettings>;
}
