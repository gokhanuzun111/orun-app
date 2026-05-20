import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { reportsTable, bansTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin, type AuthRequest } from "../lib/auth";

const router = Router();

router.post("/reports", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    reportedUserId: z.number().int(),
    roomId: z.string().optional(),
    clubId: z.string().optional(),
    reason: z.string().min(1).max(100),
    details: z.string().max(1000).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });

  const [report] = await db.insert(reportsTable).values({
    reporterId: req.userId!,
    reportedUserId: parsed.data.reportedUserId,
    roomId: parsed.data.roomId,
    clubId: parsed.data.clubId,
    reason: parsed.data.reason,
    details: parsed.data.details ?? "",
  }).returning();

  return res.status(201).json({ report });
});

router.get("/admin/reports", requireAdmin, async (_req, res) => {
  const reports = await db.query.reportsTable.findMany({
    orderBy: [desc(reportsTable.createdAt)],
    limit: 100,
  });
  return res.json({ reports });
});

router.patch("/admin/reports/:id", requireAdmin, async (req: AuthRequest, res) => {
  const schema = z.object({ status: z.enum(["pending", "resolved", "dismissed"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz durum" });

  const [report] = await db
    .update(reportsTable)
    .set({ status: parsed.data.status, resolvedAt: new Date() })
    .where(eq(reportsTable.id, Number(req.params.id)))
    .returning();
  return res.json({ report });
});

router.post("/admin/ban", requireAdmin, async (req: AuthRequest, res) => {
  const schema = z.object({
    userId: z.number().int(),
    reason: z.string().min(1).max(500),
    expiresAt: z.string().datetime().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });

  await db.update(usersTable).set({ isBanned: true }).where(eq(usersTable.id, parsed.data.userId));
  const [ban] = await db.insert(bansTable).values({
    userId: parsed.data.userId,
    bannedById: req.userId!,
    reason: parsed.data.reason,
    expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
  }).returning();

  return res.status(201).json({ ban });
});

router.post("/admin/unban", requireAdmin, async (req: AuthRequest, res) => {
  const schema = z.object({ userId: z.number().int() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });
  await db.update(usersTable).set({ isBanned: false }).where(eq(usersTable.id, parsed.data.userId));
  return res.json({ ok: true });
});

export default router;
