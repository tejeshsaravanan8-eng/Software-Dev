import type { ModuleId } from "./signal-progress";

export const MODULES: { id: ModuleId; number: string; title: string; tagline: string; description: string; topics: string[]; minutes: string; badge: string }[] = [
  { id: "fundamentals", number: "01", title: "AI Fundamentals", tagline: "Meet the pattern finders.", description: "Discover how examples become predictions. Change the inputs of a tiny classifier and see what it gets right—and what it misses.", topics: ["Data & models", "Training vs. prediction", "AI limitations"], minutes: "5–7 min", badge: "Pattern Spotter" },
  { id: "tools", number: "02", title: "AI Tools", tagline: "Turn curiosity into a skill.", description: "Build a clear prompt for a study assistant. Add context, ask for useful practice, and plan how you’ll check its work.", topics: ["Prompt design", "Study techniques", "Verification"], minutes: "4–6 min", badge: "Prompt Builder" },
  { id: "ethics", number: "03", title: "AI Ethics", tagline: "Keep your judgment in the loop.", description: "Make the call in three classroom situations. Protect privacy, spot bias, and use AI without giving away your own thinking.", topics: ["Academic integrity", "Privacy", "Bias & fairness"], minutes: "4–6 min", badge: "Responsible Thinker" },
];

// Invented measurements for a teaching example, not a real fruit dataset.
export const FRUIT_DATA = [
  { length: 14, width: 3, label: "Banana" }, { length: 16, width: 4, label: "Banana" }, { length: 18, width: 4.5, label: "Banana" },
  { length: 6, width: 6, label: "Orange" }, { length: 7, width: 6.5, label: "Orange" }, { length: 8, width: 8, label: "Orange" },
] as const;

/** Unscaled Euclidean distance in centimetres; the three nearest labels vote. */
export function classifyFruit(length: number, width: number) {
  const neighbors = FRUIT_DATA.map((fruit, index) => ({ ...fruit, index, distance: Math.hypot(fruit.length - length, fruit.width - width) }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index).slice(0, 3);
  const bananas = neighbors.filter(fruit => fruit.label === "Banana").length;
  return { label: bananas >= 2 ? "Banana" : "Orange", votes: Math.max(bananas, 3 - bananas), neighbors };
}

export function buildStudyPrompt(topic: string, parts: readonly string[]) {
  const subject = topic.trim() || "my class topic";
  return [
    parts.includes("context") && `I am a high school student studying ${subject}. Use vocabulary appropriate for grades 9–12.`,
    parts.includes("task") && `Help me practice ${subject}. Ask me questions and give hints before revealing answers. Let me do the thinking.`,
    parts.includes("format") && "Create three practice questions, one at a time: one recall, one application, and one explanation question. Wait for my response after each.",
    parts.includes("verify") && "Flag uncertain claims. Suggest what I should verify in my textbook or teacher-approved sources. Do not invent citations. I will check your explanations myself.",
  ].filter(Boolean).join("\n\n");
}

export const ETHICS_SCENARIOS = [
  { title: "Whose work is it?", category: "Academic integrity", situation: "Your teacher allows AI for brainstorming, but your essay must be your own. A chatbot offers a polished paragraph. What’s your next move?", options: ["Change a few words and submit it.", "Use the ideas to plan, write the paragraph myself, and disclose AI help as my teacher requires.", "Submit it with an AI credit; that makes any use okay."], correct: 1, explanation: "Permission has limits. Acknowledging AI does not make an otherwise prohibited use acceptable. Follow your teacher’s rules and keep the writing and reasoning your own." },
  { title: "Before you hit upload.", category: "Privacy", situation: "You want AI to summarize a class survey. The spreadsheet includes names, email addresses, and personal stories. What should you do?", options: ["Upload it—school projects are automatically private.", "Remove first names but keep emails and stories.", "Check school rules and permission first; use only the minimum non-identifying information."], correct: 2, explanation: "Names are not the only identifiers. Emails and combinations of personal details can identify someone too. Get approval and share only what is necessary with an approved tool." },
  { title: "A pattern worth questioning.", category: "Bias & fairness", situation: "An AI generates examples of scientists, but every example describes the same demographic group. How should you respond?", options: ["Question the pattern, request varied examples, and verify real people and contributions with reliable sources.", "Assume the examples fairly represent all scientists.", "Keep regenerating until the answer looks balanced; no checking needed."], correct: 0, explanation: "AI can repeat gaps and stereotypes in its data. Ask whose perspective is missing, broaden the examples, and check the facts. A more varied answer still needs verification." },
];
