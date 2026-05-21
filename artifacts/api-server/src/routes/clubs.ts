import { Router } from "express";
import { z } from "zod";
import { eq, and, type ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { db } from "../lib/db";
import {
  clubMembersTable,
  clubWaitlistTable,
  usersTable,
} from "@workspace/db/schema";
import * as schema from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../lib/auth";

const router = Router();

const MASTER_CLUB_ID = "master";
const MASTER_JOIN_DATE = "2025-01-01T00:00:00.000Z";
const clubIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/);

type Tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

async function syncUserJoinedClubsCache(
  tx: Tx,
  userId: number,
): Promise<void> {
  const rows = await tx
    .select({ clubId: clubMembersTable.clubId, joinedAt: clubMembersTable.joinedAt })
    .from(clubMembersTable)
    .where(eq(clubMembersTable.userId, userId));
  const joinedClubs = [MASTER_CLUB_ID, ...rows.map((r) => r.clubId).filter((c) => c !== MASTER_CLUB_ID)];
  const clubJoinDates: Record<string, string> = { [MASTER_CLUB_ID]: MASTER_JOIN_DATE };
  for (const r of rows) {
    if (r.clubId !== MASTER_CLUB_ID) clubJoinDates[r.clubId] = r.joinedAt.toISOString();
  }
  await tx
    .update(usersTable)
    .set({ joinedClubs, clubJoinDates, updatedAt: new Date() })
    .where(eq(usersTable.id, userId));
}

router.get("/clubs/me", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const [memberships, waitlist] = await Promise.all([
    db
      .select({ clubId: clubMembersTable.clubId, joinedAt: clubMembersTable.joinedAt })
      .from(clubMembersTable)
      .where(eq(clubMembersTable.userId, userId)),
    db
      .select({ clubId: clubWaitlistTable.clubId, joinedAt: clubWaitlistTable.joinedAt })
      .from(clubWaitlistTable)
      .where(eq(clubWaitlistTable.userId, userId)),
  ]);
  return res.json({
    memberships: memberships.map((m) => ({
      clubId: m.clubId,
      joinedAt: m.joinedAt.toISOString(),
    })),
    waitlist: waitlist.map((w) => ({
      clubId: w.clubId,
      joinedAt: w.joinedAt.toISOString(),
    })),
  });
});

router.post("/clubs/:clubId/join", requireAuth, async (req: AuthRequest, res) => {
  const parsed = clubIdSchema.safeParse(req.params.clubId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz kulüp" });
  const clubId = parsed.data;
  const userId = req.userId!;

  const result = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(clubMembersTable)
      .values({ userId, clubId })
      .onConflictDoNothing({ target: [clubMembersTable.userId, clubMembersTable.clubId] })
      .returning();

    let entry: typeof inserted | undefined = inserted;
    let created = true;
    if (!entry) {
      created = false;
      entry = await tx.query.clubMembersTable.findFirst({
        where: and(eq(clubMembersTable.userId, userId), eq(clubMembersTable.clubId, clubId)),
      });
    }

    await tx
      .delete(clubWaitlistTable)
      .where(and(eq(clubWaitlistTable.userId, userId), eq(clubWaitlistTable.clubId, clubId)));

    await syncUserJoinedClubsCache(tx, userId);
    return { entry, created };
  });

  if (!result.entry) {
    return res.status(500).json({ error: "Kulübe katılım kaydedilemedi" });
  }
  return res
    .status(result.created ? 201 : 200)
    .json({ joined: true, joinedAt: result.entry.joinedAt.toISOString() });
});

router.delete("/clubs/:clubId/join", requireAuth, async (req: AuthRequest, res) => {
  const parsed = clubIdSchema.safeParse(req.params.clubId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz kulüp" });
  const clubId = parsed.data;
  if (clubId === MASTER_CLUB_ID) {
    return res.status(400).json({ error: "Ana kulüpten ayrılamazsınız" });
  }
  const userId = req.userId!;
  await db.transaction(async (tx) => {
    await tx
      .delete(clubMembersTable)
      .where(and(eq(clubMembersTable.userId, userId), eq(clubMembersTable.clubId, clubId)));
    await syncUserJoinedClubsCache(tx, userId);
  });
  return res.json({ ok: true });
});

router.post("/clubs/:clubId/waitlist", requireAuth, async (req: AuthRequest, res) => {
  const parsed = clubIdSchema.safeParse(req.params.clubId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz kulüp" });
  const clubId = parsed.data;
  const userId = req.userId!;

  const [inserted] = await db
    .insert(clubWaitlistTable)
    .values({ userId, clubId })
    .onConflictDoNothing({ target: [clubWaitlistTable.userId, clubWaitlistTable.clubId] })
    .returning();

  let entry: typeof inserted | undefined = inserted;
  let created = true;
  if (!entry) {
    created = false;
    entry = await db.query.clubWaitlistTable.findFirst({
      where: and(eq(clubWaitlistTable.userId, userId), eq(clubWaitlistTable.clubId, clubId)),
    });
  }
  if (!entry) return res.status(500).json({ error: "Bekleme listesine eklenemedi" });
  return res
    .status(created ? 201 : 200)
    .json({ onWaitlist: true, joinedAt: entry.joinedAt.toISOString() });
});

router.delete("/clubs/:clubId/waitlist", requireAuth, async (req: AuthRequest, res) => {
  const parsed = clubIdSchema.safeParse(req.params.clubId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz kulüp" });
  const clubId = parsed.data;
  const userId = req.userId!;
  await db
    .delete(clubWaitlistTable)
    .where(and(eq(clubWaitlistTable.userId, userId), eq(clubWaitlistTable.clubId, clubId)));
  return res.json({ ok: true });
});

export default router;
