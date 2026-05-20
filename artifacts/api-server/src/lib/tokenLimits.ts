import { db } from "./db";
import { tokenUsageTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

export const MONTHLY_TOKENS: Record<number, number> = {
  0: 250,
  1: 5000,
  2: 20000,
  3: 100000,
};

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function getTokenUsage(userId: number, monthKey: string = getMonthKey()) {
  return db.query.tokenUsageTable.findFirst({
    where: and(
      eq(tokenUsageTable.userId, userId),
      eq(tokenUsageTable.monthKey, monthKey),
    ),
  });
}

export async function incrementTokenUsage(
  userId: number,
  amount: number,
  monthKey: string = getMonthKey(),
): Promise<void> {
  const existing = await getTokenUsage(userId, monthKey);
  if (existing) {
    await db
      .update(tokenUsageTable)
      .set({ tokensUsed: existing.tokensUsed + amount, updatedAt: new Date() })
      .where(eq(tokenUsageTable.id, existing.id));
  } else {
    await db.insert(tokenUsageTable).values({ userId, monthKey, tokensUsed: amount });
  }
}

export function allowedForLevel(level: number): number {
  return MONTHLY_TOKENS[level] ?? MONTHLY_TOKENS[0]!;
}
