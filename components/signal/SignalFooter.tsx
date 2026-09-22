import { ArrowUp, ArrowUpRight, BookOpenCheck } from "lucide-react";
import { Brand } from "./SignalHeader";

export function SignalFooter() {
  return <footer className="signal-footer"><div className="page-width">
    <div className="resource-strip"><div><p className="section-kicker">CURIOSITY DOESN’T END HERE</p><h2>Keep asking.<br /><em>Keep checking.</em></h2><p>Good questions deserve good sources. Explore the ideas behind your experiments.</p></div><nav aria-label="Learning references">
      {[['01', 'What is machine learning?', 'Google', 'https://developers.google.com/machine-learning/intro-to-ml/what-is-ml'], ['02', 'How nearest neighbors work', 'scikit-learn', 'https://scikit-learn.org/stable/modules/neighbors.html'], ['03', 'AI in education & research', 'UNESCO', 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research'], ['04', 'Understanding responsible AI', 'NIST', 'https://www.nist.gov/itl/ai-risk-management-framework']].map(([number, title, source, href]) => <a href={href} key={number} target="_blank" rel="noreferrer"><span className="resource-number">{number}</span><span>{title}<small>{source}</small></span><ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>)}
    </nav></div>
    <div className="academic-note"><BookOpenCheck size={24} aria-hidden="true" /><p><strong>Your learning. Your thinking. Your responsibility.</strong> Check your teacher’s AI policy, verify important claims, and acknowledge AI assistance when required.</p></div>
    <div className="footer-bottom"><Brand /><p>Made for curious minds in grades 9–12.</p><a href="#main" className="back-top">Back to the beginning<ArrowUp size={17} aria-hidden="true" /></a></div>
  </div></footer>;
