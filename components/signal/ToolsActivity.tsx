"use client";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { buildStudyPrompt } from "@/lib/signal-learning";
import { PROMPT_PARTS } from "@/lib/signal-progress";
import { useProgress } from "./ProgressProvider";

const blocks = [
  { id: "context", label: "Give context", description: "Say what you’re studying and your learning level." },
  { id: "task", label: "Set a learning task", description: "Ask for practice and hints, so you do the thinking." },
  { id: "format", label: "Shape the response", description: "Ask for three questions, delivered one at a time." },
  { id: "verify", label: "Plan your fact-check", description: "Flag uncertainty and check teacher-approved sources." },
];
export function ToolsActivity() {
  const [topic, setTopic] = useState("cell biology");
  const [parts, setParts] = useState<string[]>(["context"]);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const { progress, submit, loading, busy } = useProgress();
  const complete = progress.completed.includes("tools");
  const prompt = buildStudyPrompt(topic, parts);
  const ready = topic.trim().length >= 2 && parts.length === 4;
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(prompt); toast.success("Study prompt copied."); }
    catch { promptRef.current?.focus(); promptRef.current?.select(); toast.info("Prompt selected. Use your device’s Copy command."); }
  }
  return <div className="activity-grid">
    <div className="activity-lesson">
      <span className="activity-kicker"><MessageSquareText size={16} aria-hidden="true" /> EXPERIMENT 02 · PROMPT DESIGN</span>
      <h3>Better questions.<br />Better practice.</h3>
      <p>A chatbot predicts text; it isn’t a source of guaranteed truth. Give it a specific learning job, then check the result. Build a prompt you could use in a school-approved AI tool.</p>
      <div className="practice-examples"><h4>Use AI to strengthen your thinking.</h4><p><strong>Study assistant:</strong> practice recall, request a hint, then explain the answer yourself.</p><p><strong>Writing support:</strong> request feedback on your own outline when your teacher allows it.</p><p><strong>Code helper:</strong> ask for an explanation, then test the code and describe how it works.</p></div>
      <aside className="insight-note"><strong>Check the answer, not just the wording.</strong><p>Compare factual claims with your textbook or reliable original sources. Open citations and confirm they support the claim. Check calculations yourself. A confident tone is not evidence.</p></aside>
    </div>
    <div className="experiment-surface prompt-surface">
      <div className="surface-heading"><strong>Your prompt workshop</strong><span>{parts.length} / 4 building blocks</span></div>
      <label className="field-label" htmlFor="study-topic">What are you studying?</label>
      <input id="study-topic" className="text-input" type="text" maxLength={80} value={topic} onChange={event => setTopic(event.target.value)} aria-describedby="topic-hint" />
      <p id="topic-hint" className="micro-copy">Use a class topic, without personal information. At least 2 characters.</p>
      <fieldset className="prompt-blocks"><legend className="sr-only">Add four building blocks to your prompt</legend>
        {blocks.map(block => <label className={`prompt-block ${parts.includes(block.id) ? 'is-selected' : ''}`} key={block.id} htmlFor={`part-${block.id}`}><Checkbox id={`part-${block.id}`} checked={parts.includes(block.id)} onCheckedChange={checked => setParts(values => checked === true ? [...new Set([...values, block.id])] : values.filter(value => value !== block.id))} /><span><strong>{block.label}</strong><span>{block.description}</span></span></label>)}
      </fieldset>
      <div className="prompt-preview-heading"><label htmlFor="prompt-preview">Your assembled prompt</label><button type="button" className="text-button" disabled={!prompt} onClick={() => void copyPrompt()}><Copy size={15} aria-hidden="true" />Copy</button></div>
      <textarea ref={promptRef} id="prompt-preview" className="prompt-preview" readOnly value={prompt || "Select a building block above to start your prompt."} rows={9} />
      <p className="micro-copy">This workshop assembles your instructions; it does not send them to an AI service.</p>
      <button type="button" className="action-button" disabled={!ready || loading || busy || complete} onClick={() => void submit({ kind: "tools", topic: topic.trim(), parts: PROMPT_PARTS.filter(part => parts.includes(part)) })}>{complete ? "Prompt Builder earned" : busy ? "Saving…" : "Finish prompt & earn 40 XP"}{complete ? <CheckCircle2 size={17} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</button>
      {!complete && <p className="micro-copy">Add all four building blocks to complete this intro.</p>}
      {complete && <p className="completion-note"><CheckCircle2 size={17} aria-hidden="true" />Badge saved. You can keep editing and copying your prompt.</p>}
    </div>
  </div>;
}
