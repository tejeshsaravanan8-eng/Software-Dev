"use client";
import { useState } from "react";
import { ArrowLeftRight, Check, CornerDownRight, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LabeledSlider } from "./LabeledSlider";

const concepts = [
  { id: 'data', label: 'Examples', text: 'Data gives a model examples to work with. What those examples include—and miss—matters.' },
  { id: 'model', label: 'Patterns', text: 'A model uses patterns in its examples to map inputs to outputs. Different models do this in different ways.' },
  { id: 'prediction', label: 'Prediction', text: 'A new input produces an output. A prediction can be useful without being correct every time.' },
];

export function PatternPreview() {
  const [selected, setSelected] = useState('data');
  const stage = concepts.findIndex(concept => concept.id === selected);
  const columns = [[40, 112, 184], [30, 84, 140, 194], [70, 160]];
  return <div className="module-preview-widget pattern-preview">
    <div className="preview-label"><span>FOLLOW THE CONNECTION</span><span>01 ↗</span></div>
    <svg className="pattern-diagram" viewBox="0 0 360 224" role="img" aria-label={`Connection sketch highlighting ${concepts[stage].label}. This is an illustration, not a trained neural network.`}>
      {[0, 1].flatMap(column => columns[column].flatMap((y1, first) => columns[column + 1].map((y2, second) => <line key={`${column}-${first}-${second}`} x1={48 + column * 132} y1={y1} x2={180 + column * 132} y2={y2} className={column <= stage ? 'path-lit' : ''} />)))}
      {columns.flatMap((column, c) => column.map((y, row) => <g key={`${c}-${row}`}><circle cx={48 + c * 132} cy={y} r={c === stage ? 15 : 10} className={c === stage ? 'node-lit' : ''} /><circle cx={48 + c * 132} cy={y} r="3" className="node-center" /></g>))}
    </svg>
    <RadioGroup className="concept-picker" aria-label="Trace the AI process" value={selected} onValueChange={setSelected}>{concepts.map((concept, index) => <label key={concept.id} htmlFor={`preview-${concept.id}`} className={selected === concept.id ? 'selected' : ''}><RadioGroupItem id={`preview-${concept.id}`} value={concept.id} /><span>0{index + 1} {concept.label}</span></label>)}</RadioGroup>
    <p className="preview-explanation" aria-live="polite">{concepts[stage].text}</p>
  </div>;
}

export function PromptPreview() {
  const [reveal, setReveal] = useState(65);
  return <div className="module-preview-widget prompt-comparison">
    <div className="preview-label"><span>THE WAY YOU ASK MATTERS</span><ArrowLeftRight size={17} aria-hidden="true" /></div>
    <div className="comparison-window" aria-hidden="true">
      <div className="comparison-pane useful-prompt"><span>THE LEARNING BRIEF</span><p>“Quiz me on cell biology. Ask one question at a time. Give hints before answers.”</p><small><Check size={14} />Clear task. Room to think.</small></div>
      <div className="comparison-pane vague-prompt" style={{ clipPath: `inset(0 ${reveal}% 0 0)` }}><span>THE VAGUE REQUEST</span><p>“Tell me about<br />biology.”</p><small>Broad input. Unfocused practice.</small></div>
      <div className="comparison-divider" style={{ left: `${100 - reveal}%` }}><span><ArrowLeftRight size={17} /></span></div>
    </div>
    <div className="comparison-control"><label id="prompt-reveal-label">Reveal a more useful prompt</label><span>{reveal}%</span></div>
    <LabeledSlider labelId="prompt-reveal-label" value={reveal} min={0} max={100} unit="percent revealed" onChange={setReveal} />
    <p className="preview-explanation"><CornerDownRight size={15} aria-hidden="true" />Slide to compare a vague request with a specific learning task.</p>
    <span className="sr-only">Vague: Tell me about biology. Specific: Quiz me on cell biology. Ask one question at a time. Give hints before answers.</span>
  </div>;
}

export function EthicsPreview() {
  const [choice, setChoice] = useState('');
  return <div className="module-preview-widget ethics-preview">
    <div className="preview-label"><span>PAUSE. MAKE THE CALL.</span><Sparkles size={17} aria-hidden="true" /></div>
    <p className="preview-question" id="ethics-preview-question">Your teacher allows AI for brainstorming. How would you use it?</p>
    <RadioGroup aria-labelledby="ethics-preview-question" value={choice} onValueChange={setChoice}>
      <label className="ethics-preview-choice" htmlFor="preview-submit"><RadioGroupItem id="preview-submit" value="submit" /><span>Submit an AI-written paragraph.</span></label>
      <label className="ethics-preview-choice" htmlFor="preview-think"><RadioGroupItem id="preview-think" value="think" /><span>Explore ideas, then write it myself.</span></label>
    </RadioGroup>
    <div className="decision-response" role="status">{choice === 'think' ? <><Check size={18} aria-hidden="true" /><p>That keeps the thinking yours. Follow your teacher’s disclosure rules, too.</p></> : choice === 'submit' ? <><CornerDownRight size={18} aria-hidden="true" /><p>Brainstorming permission doesn’t cover submitting AI-written work. Try the other approach.</p></> : <><CornerDownRight size={18} aria-hidden="true" /><p>Choose an approach. See why the distinction matters.</p></>}</div>
  </div>;
}
