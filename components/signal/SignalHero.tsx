"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Check, Pause, Play, Radio, Sparkles } from "lucide-react";
import { NeuralField } from "./NeuralField";
import { SaveStatus, useProgress } from "./ProgressProvider";
import { useSignalTools } from "./useSignalTools";
import { useMotionSettings } from "./MotionSettings";
import type { SignalDestination } from "./SignalHeader";

export function SignalHero({ onNavigate }: { onNavigate: (destination: SignalDestination) => void }) {
  const { progress, submit, busy, loading } = useProgress();
  const { disabled, systemReduced, toggle } = useMotionSettings();
  const [signals, setSignals] = useState(0);
  const signalButton = useRef<HTMLButtonElement>(null);
  async function sendSignal() {
    setSignals(value => value + 1);
    return progress.firstSignalSent ? progress : submit({ kind: 'signal' });
  }
  useSignalTools(progress, sendSignal);
  const enter = (delay: number) => ({ initial: { y: disabled ? 0 : 30, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: disabled ? 0 : .75, delay: disabled ? 0 : delay, ease: [.22, 1, .36, 1] as const } });
  return <section className="hero-section" aria-labelledby="hero-heading">
    <div className="page-width hero-cover">
      <div className="hero-copy">
        <motion.p className="hero-eyebrow" {...enter(0)}><span className="eyebrow-symbol" aria-hidden="true">✳</span>HUMAN CURIOSITY. MEET ARTIFICIAL INTELLIGENCE.</motion.p>
        <h1 id="hero-heading"><span className="headline-line"><motion.span {...enter(.06)}>Understand AI.</motion.span></span><span className="headline-line"><motion.span {...enter(.13)}>Think for</motion.span></span><span className="headline-line editorial-line"><motion.em {...enter(.2)}>yourself.</motion.em><motion.span {...enter(.3)} className="headline-arrow" aria-hidden="true"><ArrowDownRight strokeWidth={1.2} /></motion.span></span></h1>
        <motion.p {...enter(.25)} className="hero-description">Big ideas, hands-on experiments, and better questions. Learn how AI works—and how to use it thoughtfully in your schoolwork.</motion.p>
        <motion.div {...enter(.3)} className="hero-actions"><button type="button" className="primary-cta" onClick={() => onNavigate('fundamentals')}>Start your AI journey<ArrowUpRight size={21} aria-hidden="true" /></button><a className="hero-explore" href="#modules" onClick={event => { event.preventDefault(); onNavigate('modules'); }}>Find your curiosity<ArrowDown size={17} aria-hidden="true" /></a></motion.div>
        <motion.p {...enter(.35)} className="hero-reassurance"><span className="grade-tag">GRADES 9–12</span>No experience needed. Bring your brain.</motion.p>
      </div>
      <motion.div className="hero-experiment" {...enter(.18)}>
        <div className="experiment-caption"><span>YOUR FIRST EXPERIMENT</span><span>001 / SIGNAL</span></div>
        <div className="signal-observatory" role="group" aria-labelledby="observatory-heading" aria-describedby="observatory-description">
          <NeuralField paused={disabled} reducedMotion={disabled} signalCount={signals} />
          <div className="observatory-topline"><span><Radio size={14} aria-hidden="true" />THE CONNECTION ENGINE</span><button type="button" className="pause-control" onClick={toggle} aria-label={systemReduced ? 'Reduced motion is enabled in your device settings' : disabled ? 'Enable animations' : 'Pause all animations'} aria-disabled={systemReduced} disabled={systemReduced}>{disabled ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button></div>
          <div className="orbit-label orbit-label-left" aria-hidden="true">A small input.</div><div className="orbit-label orbit-label-right" aria-hidden="true">A new connection.</div>
          <span className="observatory-axis" aria-hidden="true">INPUT → PATTERN → POSSIBILITY</span>
          <div className="observatory-bottom"><h2 id="observatory-heading">It starts with a spark.</h2><p id="observatory-description">Move your cursor across the network, or send a signal to light up its connections.</p><button ref={signalButton} className="signal-trigger" type="button" onClick={() => void sendSignal()} disabled={loading || busy} aria-describedby="spark-reward"><Sparkles size={17} aria-hidden="true" />{busy ? 'Saving…' : 'Send a signal'}<ArrowUpRight size={17} aria-hidden="true" /></button><p id="spark-reward" className="spark-reward">{progress.firstSignalSent ? <><Check size={13} aria-hidden="true" />First spark earned · 10 XP</> : 'Your first spark earns 10 XP'}</p></div>
        </div>
        <div className="experiment-undertext"><span>Interactive illustration, not a trained model.</span><span aria-hidden="true">↳ TRY IT YOURSELF</span></div>
      </motion.div>
    </div>
    <div className="page-width hero-bottomline"><p>Understand.<br /><em>Experiment. Question.</em></p><dl><div><dd>03</dd><dt>Intro modules</dt></div><div><dd>130</dd><dt>XP to discover</dt></div><div><dd>03</dd><dt>Badges to earn</dt></div></dl><a href="#modules" className="scroll-cue" aria-label="Scroll to the three learning chapters" onClick={event => { event.preventDefault(); onNavigate('modules'); }}><ArrowDown size={24} aria-hidden="true" /></a></div>
    <div className="page-width"><SaveStatus announce={false} /></div>
  </section>;
}
