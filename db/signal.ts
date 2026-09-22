import { env } from "cloudflare:workers";
import { deriveProgress, type AchievementId } from "../lib/signal-progress";

function database() {
  if (!env.DB) throw new Error("Progress database is unavailable.");
  return env.DB;
}
export async function readProgress(userId: string) {
  const rows = await database().prepare("SELECT achievement_id FROM signal_achievements WHERE user_id = ?").bind(userId).all<{ achievement_id: string }>();
  return deriveProgress(rows.results.map(row => row.achievement_id));
}
export async function earnAchievement(userId: string, achievement: AchievementId) {
  const db = database();
  // A transaction, a unique key, and INSERT OR IGNORE make retries safe.
  const results = await db.batch([
    db.prepare("INSERT OR IGNORE INTO signal_achievements (user_id, achievement_id, earned_at) VALUES (?, ?, ?)").bind(userId, achievement, Date.now()),
    db.prepare("SELECT achievement_id FROM signal_achievements WHERE user_id = ?").bind(userId),
  ]);
  return deriveProgress((results[1].results as { achievement_id: string }[]).map(row => row.achievement_id));
}
