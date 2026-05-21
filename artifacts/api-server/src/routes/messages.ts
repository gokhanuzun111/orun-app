import { Router } from "express";
import { z } from "zod";
import { eq, and, lt, isNull, desc } from "drizzle-orm";
import { db } from "../lib/db";
import { roomMessagesTable, clubMembersTable, usersTable } from "@workspace/db/schema";
import { requireAuth, type AuthRequest } from "../lib/auth";
import { ROOM_CLUB_MAP, containsProfanity } from "../lib/registry";
import { logger } from "../lib/logger";

const router = Router();

const MESSAGE_LIMIT = 50;
const MAX_CONTENT_LENGTH = 2000;

const roomIdSchema = z.string().min(1).max(64).regex(/^[a-z0-9_-]+$/);
const sendSchema = z.object({
  content: z.string().min(1).max(MAX_CONTENT_LENGTH),
});

router.get("/rooms/:roomId/messages", requireAuth, async (req: AuthRequest, res) => {
  const roomParsed = roomIdSchema.safeParse(req.params.roomId);
  if (!roomParsed.success) return res.status(400).json({ error: "Geçersiz oda" });
  const roomId = roomParsed.data;

  const clubId = ROOM_CLUB_MAP[roomId];
  if (!clubId) return res.status(404).json({ error: "Oda bulunamadı" });

  const userId = req.userId!;

  const isMember =
    clubId === "master" ||
    !!(await db.query.clubMembersTable.findFirst({
      where: and(eq(clubMembersTable.userId, userId), eq(clubMembersTable.clubId, clubId)),
    }));

  if (!isMember) return res.status(403).json({ error: "Bu odaya erişim izniniz yok" });

  const cursorParam = req.query.cursor;
  const cursorId = cursorParam ? parseInt(cursorParam as string, 10) : undefined;

  const rows = await db
    .select({
      id: roomMessagesTable.id,
      userId: roomMessagesTable.userId,
      content: roomMessagesTable.content,
      createdAt: roomMessagesTable.createdAt,
      handle: usersTable.handle,
      membershipLevel: usersTable.membershipLevel,
    })
    .from(roomMessagesTable)
    .innerJoin(usersTable, eq(roomMessagesTable.userId, usersTable.id))
    .where(
      and(
        eq(roomMessagesTable.roomId, roomId),
        isNull(roomMessagesTable.deletedAt),
        cursorId !== undefined ? lt(roomMessagesTable.id, cursorId) : undefined,
      ),
    )
    .orderBy(desc(roomMessagesTable.id))
    .limit(MESSAGE_LIMIT);

  const nextCursor = rows.length === MESSAGE_LIMIT ? rows[rows.length - 1].id : null;

  return res.json({
    messages: rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      handle: r.handle,
      membershipLevel: r.membershipLevel,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
    })),
    nextCursor,
  });
});

router.post("/rooms/:roomId/messages", requireAuth, async (req: AuthRequest, res) => {
  const roomParsed = roomIdSchema.safeParse(req.params.roomId);
  if (!roomParsed.success) return res.status(400).json({ error: "Geçersiz oda" });
  const roomId = roomParsed.data;

  const clubId = ROOM_CLUB_MAP[roomId];
  if (!clubId) return res.status(404).json({ error: "Oda bulunamadı" });

  const bodyParsed = sendSchema.safeParse(req.body);
  if (!bodyParsed.success) return res.status(400).json({ error: "Geçersiz mesaj içeriği" });
  const { content } = bodyParsed.data;

  if (containsProfanity(content)) {
    return res.status(422).json({ error: "Mesajınız uygunsuz içerik barındırıyor" });
  }

  const userId = req.userId!;

  const isMember =
    clubId === "master" ||
    !!(await db.query.clubMembersTable.findFirst({
      where: and(eq(clubMembersTable.userId, userId), eq(clubMembersTable.clubId, clubId)),
    }));

  if (!isMember) return res.status(403).json({ error: "Bu odaya mesaj gönderme izniniz yok" });

  try {
    const [row] = await db
      .insert(roomMessagesTable)
      .values({ roomId, userId, content })
      .returning();

    const sender = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: { handle: true, membershipLevel: true },
    });

    return res.status(201).json({
      id: row.id,
      userId: row.userId,
      handle: sender?.handle ?? "üye",
      membershipLevel: sender?.membershipLevel ?? 0,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
    });
  } catch (err) {
    logger.error({ err, roomId, userId }, "Failed to insert message");
    return res.status(500).json({ error: "Mesaj gönderilemedi" });
  }
});

export default router;
