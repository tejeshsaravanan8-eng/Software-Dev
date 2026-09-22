"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ETHICS_SCENARIOS } from "@/lib/signal-learning";
import { useProgress } from "./ProgressProvider";

export function EthicsActivity() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([-1, -1, -1]);
  const [verified, setVerified] = useState([false, false, false]);
  const [feedback, setFeedback] = useState("");
  const { progress, submit, loading, busy } = useProgress();
  const scenario = ETHICS_SCENARIOS[current];
  const complete = progress.completed.includes("ethics");
  function go(index: number) { setCurrent(index); setFeedback(""); }
  function check() {
    if (answers[current] === scenario.correct) {
      setVerified(values => values.map((value, index) => index === current ? true : value));
      setFeedback("Thoughtful choice. " + scenario.explanation);
    } else setFeedback("Take another look. " + scenario.explanation + " Choose again to put that idea into practice.");
  }
  return <div className="activity-grid">
    <div className="activity-lesson">
      <span className="activity-kicker"><ShieldCheck size={16} aria-hidden="true" /> EXPERIMENT 03 · YOUR JUDGMENT</span>
      <h3>Just because AI can,<br />should you?</h3>
      <p>Being good with AI includes knowing when to pause. Tools don’t take responsibility for your choices. You do.</p>
      <div className="ethics-principles">
        <div><span>01</span><p><strong>Keep it yours.</strong> Follow the assignment rules. Show your reasoning and acknowledge permitted AI help.</p></div>
        <div><span>02</span><p><strong>Protect people.</strong> Avoid sharing personal information. Check permission and the tool’s data practices first.</p></div>
        <div><span>03</span><p><strong>Question the pattern.</strong> Look for missing perspectives, stereotypes, and claims that need evidence.</p></div>
      </div>
      <aside className="insight-note"><strong>When the rules aren’t clear, ask.</strong><p>“May I use AI for this step, and how should I document it?” is a useful question for your teacher before you start.</p></aside>
    </div>
    <div className="experiment-surface ethics-surface">
      <div className="surface-heading"><strong>The judgment call</strong><span>{verified.filter(Boolean).length} / 3 resolved</span></div>
      <nav className="scenario-steps" aria-label="Ethics scenarios">{ETHICS_SCENARIOS.map((item, index) => <button key={item.title} type="button" aria-label={`Scenario ${index + 1}: ${item.category}${verified[index] ? ', resolved' : ''}`} aria-current={current === index ? "step" : undefined} className={current === index ? 'current' : ''} onClick={() => go(index)}>{verified[index] ? <CheckCircle2 size={17} aria-hidden="true" /> : `0${index + 1}`}<span>{item.category}</span></button>)}</nav>
      <span className="scenario-category">SCENARIO 0{current + 1} · {scenario.category}</span>
      <h4 className="scenario-title" id="scenario-title">{scenario.title}</h4>
      <p className="scenario-situation" id="scenario-situation">{scenario.situation}</p>
      <RadioGroup aria-labelledby="scenario-title" aria-describedby="scenario-situation" value={answers[current] < 0 ? '' : String(answers[current])} onValueChange={value => { setAnswers(values => values.map((old, index) => index === current ? Number(value) : old)); setVerified(values => values.map((old, index) => index === current ? false : old)); setFeedback(""); }}>
        {scenario.options.map((option, index) => <label key={`${current}-${index}`} className="choice-row" htmlFor={`ethics-${current}-${index}`}><RadioGroupItem id={`ethics-${current}-${index}`} value={String(index)} /><span>{option}</span></label>)}
      </RadioGroup>
      <div className="scenario-actions"><button type="button" className="action-button" disabled={answers[current] < 0} onClick={check}>Check my choice<ShieldCheck size={16} aria-hidden="true" /></button>
        {verified[current] && current < 2 && <button type="button" className="text-button" onClick={() => go(current + 1)}>Next scenario<ArrowRight size={16} aria-hidden="true" /></button>}</div>
      {(feedback || verified[current]) && <p className="activity-feedback" role="status">{feedback || scenario.explanation}</p>}
      {verified.every(Boolean) && <div className="ethics-finish"><p>You considered integrity, privacy, and fairness. That’s responsible AI in practice.</p><button type="button" className="action-button" disabled={loading || busy || complete} onClick={() => void submit({ kind: "ethics", answers })}>{complete ? "Responsible Thinker earned" : busy ? "Saving…" : "Finish intro & earn 40 XP"}<CheckCircle2 size={17} aria-hidden="true" /></button></div>}
      {complete && <p className="completion-note"><CheckCircle2 size={17} aria-hidden="true" />Badge saved. Revisit any scenario to practice.</p>}
    </div>
  </div>;
}
