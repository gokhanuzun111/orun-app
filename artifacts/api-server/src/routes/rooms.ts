import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { clubMembersTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../lib/auth";
import { ROOM_CLUB_MAP } from "../lib/registry";

const router = Router();

const roomIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/);

router.get("/rooms/:roomId", requireAuth, async (req: AuthRequest, res) => {
  const parsed = roomIdSchema.safeParse(req.params.roomId);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz oda" });
  const roomId = parsed.data;

  const clubId = ROOM_CLUB_MAP[roomId];
  if (!clubId) return res.status(404).json({ error: "Oda bulunamadı" });

  const userId = req.userId!;

  const hasAccess =
    clubId === "master" ||
    !!(await db.query.clubMembersTable.findFirst({
      where: and(eq(clubMembersTable.userId, userId), eq(clubMembersTable.clubId, clubId)),
    }));

  return res.json({ roomId, clubId, hasAccess });
});

export default router;
