/** Shared rules: XP comes from unique achievements, never a client counter. */
export const MODULE_IDS = ["fundamentals", "tools", "ethics"] as const;
export type ModuleId = typeof MODULE_IDS[number];
export type AchievementId = ModuleId | "signal";
export const FIRST_SIGNAL_XP = 10;
export const MODULE_XP = 40;
export const MAX_XP = 130;
export type Progress = { completed: ModuleId[]; firstSignalSent: boolean; xp: number };
export type ProgressResponse = { authenticated: boolean; progress: Progress };
export type Submission =
  | { kind: "signal" }
  | { kind: "fundamentals"; length: number; width: number; answer: string }
  | { kind: "tools"; topic: string; parts: string[] }
  | { kind: "ethics"; answers: number[] };

export function deriveProgress(ids: readonly string[]): Progress {
  const unique = new Set(ids);
  const completed = MODULE_IDS.filter(id => unique.has(id));
  const firstSignalSent = unique.has("signal");
  return { completed, firstSignalSent, xp: completed.length * MODULE_XP + (firstSignalSent ? FIRST_SIGNAL_XP : 0) };
}
export const PROMPT_PARTS = ["context", "task", "format", "verify"] as const;
/** Also checked on the server before it records an achievement. */
export function validateSubmission(input: unknown): AchievementId | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const value = input as Record<string, unknown>;
  switch (value.kind) {
    case "signal": return "signal";
    case "fundamentals":
      return typeof value.length === "number" && Number.isFinite(value.length) && value.length >= 3 && value.length <= 20 &&
        typeof value.width === "number" && Number.isFinite(value.width) && value.width >= 2 && value.width <= 10 &&
        value.answer === "examples" ? "fundamentals" : null;
    case "tools":
      return typeof value.topic === "string" && value.topic.trim().length >= 2 && value.topic.trim().length <= 80 &&
        Array.isArray(value.parts) && value.parts.length === 4 && PROMPT_PARTS.every(part => (value.parts as unknown[]).includes(part)) ? "tools" : null;
    case "ethics":
      return Array.isArray(value.answers) && value.answers.length === 3 && value.answers.every((answer, i) => answer === [1, 2, 0][i]) ? "ethics" : null;
    default: return null;
  }
}
