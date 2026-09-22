import { getChatGPTUser } from "@/app/chatgpt-auth";
import { earnAchievement, readProgress } from "@/db/signal";
import { deriveProgress, validateSubmission } from "@/lib/signal-progress";

export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie, oai-authenticated-user-id" } });
export async function GET() {
  try {
    const user = await getChatGPTUser();
    if (!user) return reply({ authenticated: false, progress: deriveProgress([]) });
    return reply({ authenticated: true, progress: await readProgress(user.userId) });
  } catch {
    return reply({ error: "We couldn’t load your saved progress. Please try again." }, 503);
  }
}
export async function POST(request: Request) {
  // JSON and same-origin requests prevent cross-site form submissions.
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return reply({ error: "This request must come from Signal." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Expected a JSON activity submission." }, 415);
  try {
    const user = await getChatGPTUser();
    if (!user) return reply({ error: "Sign in to save your XP and badges." }, 401);
    const body = await request.text();
    if (body.length > 2048) return reply({ error: "This activity submission is too large." }, 413);
    let input: unknown;
    try { input = JSON.parse(body); } catch { return reply({ error: "The activity submission could not be read." }, 400); }
    const achievement = validateSubmission(input);
    if (!achievement) return reply({ error: "Finish the activity’s steps before saving its badge." }, 400);
    return reply({ authenticated: true, progress: await earnAchievement(user.userId, achievement) });
  } catch {
    return reply({ error: "Your progress wasn’t saved. Your work is still here—please retry." }, 503);
  }
}
