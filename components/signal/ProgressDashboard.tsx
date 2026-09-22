"use client";
import { motion } from "motion/react";
import { ArrowUpRight, Binary, CheckCircle2, LockKeyhole, MessageSquareText, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { MODULES } from "@/lib/signal-learning";
import { MAX_XP, type ModuleId } from "@/lib/signal-progress";
import { useProgress } from "./ProgressProvider";
import { useMotionSettings } from "./MotionSettings";
import { PointerSurface } from "./PointerSurface";

export function ProgressDashboard({ onContinue }: { onContinue: (module: ModuleId) => void }) {
  const { progress, loading, error, authenticated } = useProgress();
  const { disabled } = useMotionSettings();
  const completed = progress.completed.length;
  const next = MODULES.find(module => !progress.completed.includes(module.id));
  const icons = [Binary, MessageSquareText, ShieldCheck];
  const known = !loading && authenticated !== null;
  return <section className="progress-section" id="progress" aria-labelledby="progress-heading" tabIndex={-1}>
    <div className="page-width"><div className="section-heading"><div><p className="section-kicker">03 — LITTLE WINS, REAL PROGRESS</p><h2 id="progress-heading">Curiosity has<br /><em>its rewards.</em></h2></div><p>Three intros. Three badges with your name on them. Finish an activity, collect the XP, and see how far you’ve come.</p></div>
      <div className="progress-board">
        <div className="board-topline"><span><Sparkles size={16} aria-hidden="true" />YOUR EXPLORER LOG</span><span className="level-tag">LEVEL {Math.floor(progress.xp / 100) + 1} EXPLORER</span></div>
        <div className="progress-layout"><div className="progress-overview">
          <div className="xp-ring" role="img" aria-label={known ? `${progress.xp} of ${MAX_XP} total experience points earned` : 'Loading experience points'}>
            <svg viewBox="0 0 260 260" aria-hidden="true"><defs><linearGradient id="xp-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#b99aef" /><stop offset="55%" stopColor="#dda792" /><stop offset="100%" stopColor="#eabd64" /></linearGradient></defs>
              {Array.from({ length: 26 }, (_, i) => <line key={i} x1="130" y1="4" x2="130" y2={i % 5 === 0 ? 15 : 11} transform={`rotate(${i * 360 / 26} 130 130)`} className="xp-tick" />)}
              <circle cx="130" cy="130" r="101" className="xp-ring-track" /><motion.circle cx="130" cy="130" r="101" className="xp-ring-value" pathLength="100" strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - progress.xp / MAX_XP * 100 }} transition={{ duration: disabled ? 0 : 1.2, ease: [.22, 1, .36, 1] }} />
            </svg><div className="xp-ring-copy"><span>TOTAL EXPERIENCE</span><motion.strong key={progress.xp} initial={{ opacity: .5, y: disabled ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: disabled ? 0 : .3 }}>{known ? progress.xp : '–'}</motion.strong><span>/ {MAX_XP} XP</span></div>
          </div>
          <div className="first-signal-status"><Radio size={18} aria-hidden="true" /><span>First spark<small>{progress.firstSignalSent ? '10 XP collected' : 'Send a signal in the hero · 10 XP'}</small></span>{progress.firstSignalSent && <CheckCircle2 size={17} aria-hidden="true" />}</div>
        </div>
        <div className="badge-collection"><div className="badge-collection-heading"><h3>The collection</h3><span>{completed} / 3 UNLOCKED</span></div><div className="badge-slots">
          {MODULES.map((module, index) => {
            const earned = progress.completed.includes(module.id); const Icon = icons[index];
            return <PointerSurface key={module.id} className={`badge-slot badge-${module.id} ${earned ? 'is-earned' : ''}`} tilt={5}>
              <article><div className="badge-slot-top"><span>0{index + 1}</span>{earned ? <CheckCircle2 size={16} aria-label="Earned" /> : <LockKeyhole size={14} aria-label="Locked" />}</div><div className="badge-emblem"><Icon size={35} strokeWidth={1.4} aria-hidden="true" /><span className="badge-spark" aria-hidden="true">✦</span></div><h4>{module.badge}</h4><p>{module.title}</p><span className="badge-state">{earned ? 'COLLECTED · +40 XP' : 'COMPLETE INTRO · 40 XP'}</span><button type="button" className="badge-open" onClick={() => onContinue(module.id)} aria-label={`${earned ? 'Revisit' : 'Start'} ${module.title}`}>{earned ? 'Play it again' : 'Earn this badge'}<ArrowUpRight size={17} aria-hidden="true" /></button></article>
            </PointerSurface>;
          })}
        </div><div className="dashboard-progress-label"><span>Homepage intros completed</span><strong>{known ? completed : '–'} / 3</strong></div><ProgressBar value={completed / 3 * 100} aria-label="Homepage intro completion" aria-valuetext={`${completed} of 3 intros completed`} /><p className="xp-explanation">Each intro earns 40 XP once. Your first signal earns 10 more.</p></div></div>
        <div className="next-mission"><div><span>{next ? 'YOUR NEXT DISCOVERY' : 'ALL THREE INTROS COMPLETE'}</span><p>{next ? next.tagline : 'A more curious, capable you. Keep experimenting.'}</p></div><button type="button" className="action-button" onClick={() => onContinue(next?.id ?? 'fundamentals')}>{next ? `Explore ${next.title}` : 'Back to the lab'}<ArrowUpRight size={19} aria-hidden="true" /></button></div>
        <p className="board-save-status">{loading ? 'Loading your saved achievements…' : error ? 'Progress sync needs attention. Retry from the lab.' : authenticated ? 'Your achievements are saved. Come back and pick up where you left off.' : 'Sign in to save your XP and badges across visits.'}</p>
      </div>
    </div>
  </section>;
}
