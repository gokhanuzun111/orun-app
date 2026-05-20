import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  comparePassword,
  signToken,
  createSession,
  revokeSession,
  requireAuth,
  type AuthRequest,
} from "../lib/auth";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Geçersiz bilgiler", details: parsed.error.flatten() });
  }
  const { name, email, password } = parsed.data;
  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email.toLowerCase()),
  });
  if (existing) {
    return res.status(409).json({ error: "Bu e-posta zaten kayıtlı" });
  }
  const handle = `@${name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9_]/g, "").slice(0, 16)}`;
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      handle,
      membershipLevel: 0,
      joinedClubs: ["master"],
      clubJoinDates: { master: "2025-01-01T00:00:00.000Z" },
      memberSince: new Date().getFullYear().toString(),
    })
    .returning();
  const token = signToken(user.id);
  await createSession(user.id, token);
  const { passwordHash: _, ...safeUser } = user;
  return res.status(201).json({ token, user: safeUser });
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Geçersiz bilgiler" });
  }
  const { email, password } = parsed.data;
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email.toLowerCase()),
  });
  if (!user) {
    return res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }
  if (user.isBanned) {
    return res.status(403).json({ error: "Hesabınız askıya alınmıştır" });
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }
  const token = signToken(user.id);
  await createSession(user.id, token);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ token, user: safeUser });
});

router.post("/auth/logout", requireAuth, async (req: AuthRequest, res) => {
  const token = req.headers.authorization!.slice(7);
  await revokeSession(token);
  return res.json({ ok: true });
});

router.get("/auth/me", requireAuth, (req: AuthRequest, res) => {
  const { passwordHash: _, ...safeUser } = req.user!;
  return res.json({ user: safeUser });
});

router.patch("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    bio: z.string().max(300).optional(),
    interests: z.array(z.string()).optional(),
    handle: z.string().min(2).max(20).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });
  const [updated] = await db
    .update(usersTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(usersTable.id, req.userId!))
    .returning();
  const { passwordHash: _, ...safeUser } = updated;
  return res.json({ user: safeUser });
});

export default router;
