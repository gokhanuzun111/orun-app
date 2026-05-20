import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { usersTable, tokenUsageTable, roomAccessTable, roomWaitlistTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthRequest } from "../lib/auth";

const router = Router();

const MONTHLY_TOKENS: Record<number, number> = {
  0: 250,
  1: 5000,
  2: 20000,
  3: 100000,
};

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

router.get("/membership", requireAuth, async (req: AuthRequest, res) => {
  const user = req.user!;
  const monthKey = getMonthKey();
  const usage = await db.query.tokenUsageTable.findFirst({
    where: and(
      eq(tokenUsageTable.userId, user.id),
      eq(tokenUsageTable.monthKey, monthKey),
    ),
  });
  const tokensUsed = usage?.tokensUsed ?? 0;
  const tokensAllowed = MONTHLY_TOKENS[user.membershipLevel] ?? 250;
  return res.json({
    membershipLevel: user.membershipLevel,
    tokensUsed,
    tokensAllowed,
    tokensRemaining: Math.max(0, tokensAllowed - tokensUsed),
    monthKey,
  });
});

router.post("/tokens/use", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ amount: z.number().int().positive().max(1000) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz miktar" });

  const user = req.user!;
  const monthKey = getMonthKey();
  const tokensAllowed = MONTHLY_TOKENS[user.membershipLevel] ?? 250;

  const existing = await db.query.tokenUsageTable.findFirst({
    where: and(eq(tokenUsageTable.userId, user.id), eq(tokenUsageTable.monthKey, monthKey)),
  });

  const currentUsage = existing?.tokensUsed ?? 0;
  const requested = parsed.data.amount;

  if (currentUsage + requested > tokensAllowed) {
    return res.status(429).json({
      error: "Aylık token limitine ulaştınız",
      tokensUsed: currentUsage,
      tokensAllowed,
    });
  }

  if (existing) {
    await db
      .update(tokenUsageTable)
      .set({ tokensUsed: currentUsage + requested, updatedAt: new Date() })
      .where(eq(tokenUsageTable.id, existing.id));
  } else {
    await db.insert(tokenUsageTable).values({
      userId: user.id,
      monthKey,
      tokensUsed: requested,
    });
  }

  return res.json({ tokensUsed: currentUsage + requested, tokensAllowed });
});

router.get("/rooms/:roomId/access", requireAuth, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  const user = req.user!;
  const access = await db.query.roomAccessTable.findFirst({
    where: and(eq(roomAccessTable.userId, user.id), eq(roomAccessTable.roomId, roomId)),
  });
  const waitlist = await db.query.roomWaitlistTable.findFirst({
    where: and(eq(roomWaitlistTable.userId, user.id), eq(roomWaitlistTable.roomId, roomId)),
  });
  return res.json({
    hasAccess: !!access,
    onWaitlist: !!waitlist,
    joinedAt: access?.joinedAt,
    waitlistJoinedAt: waitlist?.joinedAt,
  });
});

router.post("/rooms/:roomId/join", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ clubId: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "clubId gerekli" });

  const { roomId } = req.params;
  const { clubId } = parsed.data;
  const user = req.user!;

  const existing = await db.query.roomAccessTable.findFirst({
    where: and(eq(roomAccessTable.userId, user.id), eq(roomAccessTable.roomId, roomId)),
  });
  if (existing) return res.json({ joined: true, joinedAt: existing.joinedAt });

  const [entry] = await db.insert(roomAccessTable).values({
    userId: user.id,
    roomId,
    clubId,
  }).returning();

  await db.delete(roomWaitlistTable).where(
    and(eq(roomWaitlistTable.userId, user.id), eq(roomWaitlistTable.roomId, roomId)),
  );

  return res.status(201).json({ joined: true, joinedAt: entry.joinedAt });
});

router.post("/rooms/:roomId/waitlist", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({ clubId: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "clubId gerekli" });

  const { roomId } = req.params;
  const { clubId } = parsed.data;
  const user = req.user!;

  const existing = await db.query.roomWaitlistTable.findFirst({
    where: and(eq(roomWaitlistTable.userId, user.id), eq(roomWaitlistTable.roomId, roomId)),
  });
  if (existing) return res.json({ onWaitlist: true, joinedAt: existing.joinedAt });

  const [entry] = await db.insert(roomWaitlistTable).values({
    userId: user.id,
    roomId,
    clubId,
  }).returning();

  return res.status(201).json({ onWaitlist: true, joinedAt: entry.joinedAt });
});

router.delete("/rooms/:roomId/waitlist", requireAuth, async (req: AuthRequest, res) => {
  const { roomId } = req.params;
  await db.delete(roomWaitlistTable).where(
    and(eq(roomWaitlistTable.userId, req.userId!), eq(roomWaitlistTable.roomId, roomId)),
  );
  return res.json({ ok: true });
});

router.patch("/membership/level", requireAdmin, async (req: AuthRequest, res) => {
  const schema = z.object({ userId: z.number(), level: z.number().int().min(0).max(3) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });
  const [updated] = await db
    .update(usersTable)
    .set({ membershipLevel: parsed.data.level, updatedAt: new Date() })
    .where(eq(usersTable.id, parsed.data.userId))
    .returning();
  return res.json({ user: updated });
});

export default router;
