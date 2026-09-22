"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Play, ScanLine } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LabeledSlider as MeasurementSlider } from "./LabeledSlider";
import { FRUIT_DATA, classifyFruit } from "@/lib/signal-learning";
import { useProgress } from "./ProgressProvider";

const x = (length: number) => 46 + (length - 3) / 17 * 352;
const y = (width: number) => 222 - (width - 2) / 8 * 176;

export function FundamentalsActivity() {
  const [length, setLength] = useState(12);
  const [width, setWidth] = useState(5);
  const [result, setResult] = useState<ReturnType<typeof classifyFruit> | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const { progress, submit, loading, busy } = useProgress();
  const complete = progress.completed.includes("fundamentals");
  function changeInput(dimension: "length" | "width", value: number) {
    (dimension === "length" ? setLength : setWidth)(value);
    setResult(null); setAnswer(""); setFeedback("");
  }
  async function checkAnswer() {
    if (answer !== "examples") { setFeedback("Look at the labeled points. This classifier compares measurements with examples; it doesn’t understand fruit like a person does. Try again."); return; }
    setFeedback("Correct. It uses the labels of nearby examples. Changing the examples or measurements can change the prediction.");
    if (!complete) await submit({ kind: "fundamentals", length, width, answer });
  }
  return <div className="activity-grid">
    <div className="activity-lesson">
      <span className="activity-kicker"><ScanLine size={16} aria-hidden="true" /> EXPERIMENT 01 · PATTERNS</span>
      <h3>Can a machine tell<br />fruit apart?</h3>
      <p>AI is a broad field of systems that perform tasks such as prediction or language generation. <strong>Machine learning</strong> is one approach: use examples to find patterns instead of writing every rule by hand.</p>
      <ol className="concept-steps">
        <li><span>1</span><div><strong>Start with data.</strong><p>These six invented fruit measurements have labels: banana or orange.</p></div></li>
        <li><span>2</span><div><strong>Build a model.</strong><p>This simple model keeps the examples. Other models learn parameters during training.</p></div></li>
        <li><span>3</span><div><strong>Make a prediction.</strong><p>Our classifier finds the three closest examples. Their labels vote on the new fruit. This step is called inference.</p></div></li>
      </ol>
      <aside className="insight-note"><strong>A prediction is not a fact.</strong><p>Six examples cannot represent every fruit. This model must pick banana or orange—even if you give it an apple’s measurements. Generative AI creates content rather than just choosing a label, and its output also needs checking.</p></aside>
    </div>
    <div className="experiment-surface">
      <div className="surface-heading"><strong>A tiny fruit classifier</strong><span>k = 3 neighbors</span></div>
      <figure className="classifier-figure">
        <svg viewBox="0 0 440 270" role="img" aria-labelledby="classifier-title classifier-desc">
          <title id="classifier-title">Fruit measurements and your test point</title>
          <desc id="classifier-desc">Six labeled examples: bananas are longer and narrower; oranges are shorter and wider. Your test fruit is {length} centimetres long and {width} centimetres wide.{result ? ` Its three nearest examples predict ${result.label}.` : " Run the classifier to compare."}</desc>
          {[2, 4, 6, 8, 10].map(tick => <g key={tick}><line x1="46" x2="398" y1={y(tick)} y2={y(tick)} className="chart-gridline" /><text x="31" y={y(tick) + 4} textAnchor="end" className="chart-label">{tick}</text></g>)}
          {[3, 7, 11, 15, 20].map(tick => <g key={tick}><line y1="46" y2="222" x1={x(tick)} x2={x(tick)} className="chart-gridline" /><text x={x(tick)} y="244" textAnchor="middle" className="chart-label">{tick}</text></g>)}
          <text x="222" y="266" textAnchor="middle" className="chart-label">Length (cm)</text>
          <text transform="translate(13 138) rotate(-90)" textAnchor="middle" className="chart-label">Width (cm)</text>
          {result?.neighbors.map(point => <line key={point.index} x1={x(length)} y1={y(width)} x2={x(point.length)} y2={y(point.width)} className="neighbor-line" />)}
          {FRUIT_DATA.map((point, index) => point.label === "Banana" ? <path key={index} d={`M ${x(point.length)} ${y(point.width)-7} l 7 13 h -14 Z`} fill="#7541bb" /> : <circle key={index} cx={x(point.length)} cy={y(point.width)} r="6.5" fill="#ba6416" />)}
          <path d={`M ${x(length)} ${y(width)-9} l 9 9 -9 9 -9 -9 Z`} fill="#14684e" stroke="#fffdf7" strokeWidth="2" />
        </svg>
        <figcaption><span><i className="legend-shape banana" />Banana</span><span><i className="legend-shape orange" />Orange</span><span><i className="legend-shape test-fruit" />Your input</span></figcaption>
      </figure>
      <div className="measurement-controls">
        <div><div className="range-label"><label id="length-label">Length</label><output>{length} cm</output></div><MeasurementSlider labelId="length-label" value={length} min={3} max={20} step={0.5} unit="centimetres" onChange={value => changeInput("length", value)} /></div>
        <div><div className="range-label"><label id="width-label">Width</label><output>{width} cm</output></div><MeasurementSlider labelId="width-label" value={width} min={2} max={10} step={0.5} unit="centimetres" onChange={value => changeInput("width", value)} /></div>
      </div>
      <p className="micro-copy">Distance uses both measurements in cm, with no scaling.</p>
      <button className="action-button" type="button" onClick={() => { setResult(classifyFruit(length, width)); setFeedback(""); }}><Play size={16} aria-hidden="true" />Run classifier</button>
      <div className="prediction-result" role="status">{result ? <><span>Prediction</span><strong>{result.label}</strong><p>{result.votes} of 3 neighbors voted {result.label.toLowerCase()}. This is a vote count, not a measure of certainty.</p></> : <p>Adjust the measurements, then run your first prediction.</p>}</div>
      {result && <div className="knowledge-check"><h4 id="fundamentals-question">What did this prediction depend on?</h4>
        <RadioGroup aria-labelledby="fundamentals-question" value={answer} onValueChange={value => { setAnswer(value); setFeedback(""); }}>
          {[['understanding', 'Human-like understanding of fruit'], ['examples', 'The measurements and labels of nearby examples'], ['internet', 'A live search of every fruit on the internet']].map(([value, label]) => <label className="choice-row" key={value} htmlFor={`fund-${value}`}><RadioGroupItem id={`fund-${value}`} value={value} /><span>{label}</span></label>)}
        </RadioGroup>
        <button type="button" className="action-button" disabled={!answer || busy || loading} onClick={() => void checkAnswer()}>{complete ? "Check answer again" : busy ? "Saving…" : "Check & earn 40 XP"}<ArrowRight size={16} aria-hidden="true" /></button>
        {feedback && <p className="activity-feedback" role="status">{feedback}</p>}
      </div>}
      {complete && <p className="completion-note"><CheckCircle2 size={17} aria-hidden="true" />Pattern Spotter earned. Keep experimenting—no extra XP for repeats.</p>}
    </div>
  </div>;
}
