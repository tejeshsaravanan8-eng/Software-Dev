"use client";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import { MODULES } from "@/lib/signal-learning";
import type { ModuleId } from "@/lib/signal-progress";
import { useProgress } from "./ProgressProvider";
import { useMotionSettings } from "./MotionSettings";
import { PointerSurface } from "./PointerSurface";
import { EthicsPreview, PatternPreview, PromptPreview } from "./ModulePreviews";

const titles = [<>Meet the<br /><em>pattern finders.</em></>, <>Make the tools<br /><em>work for you.</em></>, <>Keep your judgment<br /><em>in the loop.</em></>];
const previews = [PatternPreview, PromptPreview, EthicsPreview];

type CardProps = { index: number; enabled: boolean; nextMarker: RefObject<HTMLDivElement | null>; onExplore: (id: ModuleId) => void };
function ChapterCard({ index, enabled, nextMarker, onExplore }: CardProps) {
  const module = MODULES[index];
  const Preview = previews[index];
  const { progress } = useProgress();
  const [focused, setFocused] = useState(false);
  // Normal-flow markers supply stable measurements even while the cards are sticky.
  const { scrollYProgress } = useScroll({ target: nextMarker, offset: ['start end', 'start 20%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, index === 2 ? 1 : .94]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, index === 2 ? 0 : -3]);
  const complete = progress.completed.includes(module.id);
  return <div className={`stack-card-shell chapter-${module.id} ${focused ? 'has-focus' : ''}`} style={{ '--chapter-index': index } as CSSProperties}
    onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <motion.article className="stack-card" aria-labelledby={`chapter-heading-${module.id}`} style={{ scale: enabled && !focused ? scale : 1, rotateX: enabled && !focused ? rotateX : 0, transformPerspective: 1500, transformOrigin: 'center top' }}>
      <div className="chapter-spine"><span>CHAPTER {module.number}</span><span>{module.title}</span><span>{complete ? 'INTRO COMPLETE' : '40 XP TO EARN'}</span></div>
      <div className="chapter-body"><div className="chapter-copy"><p className="chapter-subject">{module.title}</p><h3 id={`chapter-heading-${module.id}`}>{titles[index]}</h3><p className="chapter-description">{module.description}</p><ul className="chapter-topics">{module.topics.map(topic => <li key={topic}>{topic}</li>)}</ul><div className="chapter-action"><button type="button" className="action-button" onClick={() => onExplore(module.id)}>{complete ? 'Revisit this intro' : 'Try the full intro'}<ArrowUpRight size={19} aria-hidden="true" /></button><span>{complete ? <><CheckCircle2 size={15} aria-hidden="true" />Badge earned</> : <><Clock3 size={15} aria-hidden="true" />{module.minutes}</>}</span></div></div><PointerSurface className="chapter-preview" tilt={3}><Preview /></PointerSurface></div>
    </motion.article>
  </div>;
}

export function LearningPath({ onExplore }: { onExplore: (id: ModuleId) => void }) {
  const { disabled } = useMotionSettings();
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null), second = useRef<HTMLDivElement>(null), third = useRef<HTMLDivElement>(null);
  const markers = [first, second, third];
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const host = track.current;
    if (!host) return;
    const cards = Array.from(host.querySelectorAll<HTMLElement>('.stack-card'));
    const measure = () => setFits(window.innerWidth >= 1024 && cards.every(card => card.offsetHeight + 170 <= window.innerHeight));
    const observer = new ResizeObserver(measure);
    cards.forEach(card => observer.observe(card));
    window.addEventListener('resize', measure, { passive: true }); measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const enabled = fits && !disabled;
  return <section id="modules" aria-labelledby="path-heading" className="chapter-section" tabIndex={-1}>
    <div className="page-width"><div className="section-heading"><div><p className="section-kicker">01 — A FIELD GUIDE TO AI</p><h2 id="path-heading">Go from <em>“what if?”</em><br />to <em>“I get it.”</em></h2></div><p>Three short chapters. Three different ways to see AI. Try an idea here, then take it for a spin in the lab.</p></div>
      <div ref={track} className={`stack-track ${enabled ? 'stack-enabled' : ''}`}>
        {MODULES.map((module, index) => <Fragment key={module.id}><div ref={markers[index]} className="stack-marker" aria-hidden="true" /><ChapterCard index={index} nextMarker={markers[Math.min(index + 1, 2)]} enabled={enabled} onExplore={onExplore} /></Fragment>)}
      </div>
      <div className="chapter-afterword"><span>READ THE IDEA. TRY THE EXPERIMENT. OWN THE SKILL.</span><span>↓ YOUR WORKBENCH IS NEXT</span></div>
    </div>
  </section>;
}
