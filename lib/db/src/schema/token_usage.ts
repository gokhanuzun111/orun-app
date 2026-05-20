import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const tokenUsageTable = pgTable("token_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  monthKey: text("month_key").notNull(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type TokenUsage = typeof tokenUsageTable.$inferSelect;
