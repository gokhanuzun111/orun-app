import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { legalConsentsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../lib/auth";

const router = Router();

router.get("/consent", requireAuth, async (req: AuthRequest, res) => {
  const consents = await db.query.legalConsentsTable.findMany({
    where: eq(legalConsentsTable.userId, req.userId!),
  });
  return res.json({ consents });
});

router.post("/consent", requireAuth, async (req: AuthRequest, res) => {
  const schema = z.object({
    consentType: z.enum(["kvkk", "tos", "gizlilik"]),
    version: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz bilgiler" });

  const existing = await db.query.legalConsentsTable.findFirst({
    where: and(
      eq(legalConsentsTable.userId, req.userId!),
      eq(legalConsentsTable.consentType, parsed.data.consentType),
      eq(legalConsentsTable.version, parsed.data.version),
    ),
  });

  if (existing) return res.json({ consent: existing });

  const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress;
  const [consent] = await db.insert(legalConsentsTable).values({
    userId: req.userId!,
    consentType: parsed.data.consentType,
    version: parsed.data.version,
    ipAddress,
  }).returning();

  return res.status(201).json({ consent });
});

export default router;
