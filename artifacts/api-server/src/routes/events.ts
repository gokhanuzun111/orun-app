import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { eventRsvpsTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../lib/auth";

const router = Router();

const eventIdSchema = z.string().min(1).max(128).regex(/^[a-zA-Z0-9_-]+$/);

router.get("/events/me/rsvps", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const rows = await db
    .select({ eventId: eventRsvpsTable.eventId, rsvpedAt: eventRsvpsTable.rsvpedAt })
    .from(eventRsvpsTable)
    .where(eq(eventRsvpsTable.userId, userId));
  return res.json({
    rsvps: rows.map((r) => ({
      eventId: r.eventId,
      rsvpedAt: r.rsvpedAt.toISOString(),
    })),
  });
});

router.post("/events/:eventId/rsvp", requireAuth, async (req: AuthRequest, res) => {
  const parsed = eventIdSchema.safeParse(req.params.eventId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz etkinlik" });
  const eventId = parsed.data;
  const userId = req.userId!;

  const [inserted] = await db
    .insert(eventRsvpsTable)
    .values({ userId, eventId })
    .onConflictDoNothing({ target: [eventRsvpsTable.userId, eventRsvpsTable.eventId] })
    .returning();

  let entry: typeof inserted | undefined = inserted;
  let created = true;
  if (!entry) {
    created = false;
    entry = await db.query.eventRsvpsTable.findFirst({
      where: and(eq(eventRsvpsTable.userId, userId), eq(eventRsvpsTable.eventId, eventId)),
    });
  }
  if (!entry) return res.status(500).json({ error: "RSVP kaydedilemedi" });
  return res
    .status(created ? 201 : 200)
    .json({ rsvped: true, rsvpedAt: entry.rsvpedAt.toISOString() });
});

router.delete("/events/:eventId/rsvp", requireAuth, async (req: AuthRequest, res) => {
  const parsed = eventIdSchema.safeParse(req.params.eventId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz etkinlik" });
  const eventId = parsed.data;
  const userId = req.userId!;
  await db
    .delete(eventRsvpsTable)
    .where(and(eq(eventRsvpsTable.userId, userId), eq(eventRsvpsTable.eventId, eventId)));
  return res.json({ ok: true });
});

export default router;
