import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Save achievements only; prompts, answers, names, and emails are not retained.
export const signalAchievements = sqliteTable("signal_achievements", {
  userId: text("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  earnedAt: integer("earned_at").notNull(),
}, table => [primaryKey({ columns: [table.userId, table.achievementId] })]);
