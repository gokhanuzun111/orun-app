import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { sessionsTable, usersTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET environment variable is required (min 32 chars). Set it as a Replit Secret.",
  );
}
const JWT_EXPIRES_IN = "30d";
const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });
}

export async function revokeSession(token: string): Promise<void> {
  await db
    .update(sessionsTable)
    .set({ isRevoked: true })
    .where(eq(sessionsTable.tokenHash, hashToken(token)));
}

export type AuthRequest = Request & { userId?: number; user?: typeof usersTable.$inferSelect };

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yetkilendirme gerekli" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET!) as unknown as { sub: number };
    if (typeof payload.sub !== "number") {
      res.status(401).json({ error: "Geçersiz token" });
      return;
    }
    const session = await db.query.sessionsTable.findFirst({
      where: and(
        eq(sessionsTable.tokenHash, hashToken(token)),
        eq(sessionsTable.isRevoked, false),
      ),
    });
    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ error: "Oturum süresi dolmuş" });
      return;
    }
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, payload.sub),
    });
    if (!user || user.isBanned) {
      res.status(403).json({ error: "Erişim reddedildi" });
      return;
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Geçersiz token" });
    return;
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  await requireAuth(req, res, async () => {
    if (!req.user?.isAdmin) {
      res.status(403).json({ error: "Admin yetkisi gerekli" });
      return;
    }
    next();
  });
}
