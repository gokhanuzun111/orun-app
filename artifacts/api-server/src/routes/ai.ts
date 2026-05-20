import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import OpenAI from "openai";
import { logger } from "../lib/logger";
import { requireAuth, type AuthRequest } from "../lib/auth";
import {
  allowedForLevel,
  getTokenUsage,
  incrementTokenUsage,
} from "../lib/tokenLimits";

const router = Router();

if (!process.env["AI_INTEGRATIONS_OPENAI_API_KEY"]) {
  logger.warn("AI_INTEGRATIONS_OPENAI_API_KEY missing — /ai/chat will fail at request time");
}

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
});

const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = (req as AuthRequest).userId;
    if (userId) return `user:${userId}`;
    return `ip:${ipKeyGenerator(req.ip ?? "unknown")}`;
  },
  message: { error: "Çok fazla istek — lütfen bir dakika sonra tekrar deneyin" },
});

const SYSTEM_TEMPLATE = (clubName: string, clubPersona: string) => `
Sen ORUN'un "${clubName}" kulübünün yapay zeka moderatörüsün.

Kişiliğin: ${clubPersona}

Görevlerin:
- Kulüp konularında derin uzmanlıkla yanıt ver
- Kısa, özlü ve zarif konuş (maks 120 kelime)
- Türkçe yanıt ver — resmi ama sıcak bir ton kullan
- Kulübün ruhuna uygun, kültürel derinliği olan yanıtlar üret
- Kulüp konuşma geçmişinden öğrenerek giderek daha özel ve derin bilgi sun

Sen zamanla kulübü tanıyan, her sohbetten beslenen bir akıl danışmanısın.
`.trim();

router.post("/ai/chat", requireAuth, aiRateLimit, async (req: AuthRequest, res) => {
  const { question, clubId, clubName, clubPersona, recentMessages } = req.body as {
    question: string;
    clubId: string;
    clubName: string;
    clubPersona: string;
    recentMessages?: string[];
  };

  if (!question || !clubName || !clubPersona) {
    res.status(400).json({ error: "question, clubName ve clubPersona zorunlu" });
    return;
  }
  if (question.length > 2000) {
    res.status(400).json({ error: "Soru çok uzun (maks 2000 karakter)" });
    return;
  }

  const user = req.user!;
  const allowed = allowedForLevel(user.membershipLevel);
  const usage = await getTokenUsage(user.id);
  const used = usage?.tokensUsed ?? 0;
  if (used >= allowed) {
    res.status(429).json({
      error: "Aylık token limitine ulaştınız",
      tokensUsed: used,
      tokensAllowed: allowed,
    });
    return;
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_TEMPLATE(clubName, clubPersona) },
  ];

  if (recentMessages && recentMessages.length > 0) {
    const context = recentMessages.slice(-15).join("\n");
    messages.push({
      role: "system",
      content: `Kulüp sohbet geçmişinden son mesajlar (bağlam için):\n${context}`,
    });
  }

  messages.push({ role: "user", content: question });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 200,
      temperature: 0.75,
    });

    const reply =
      completion.choices[0]?.message?.content ?? "Şu an yanıt veremiyorum, lütfen tekrar deneyin.";
    const consumed = completion.usage?.total_tokens ?? 300;

    await incrementTokenUsage(user.id, consumed);

    res.json({
      reply,
      tokensUsed: used + consumed,
      tokensAllowed: allowed,
    });
  } catch (err) {
    logger.error({ err, clubId, userId: user.id }, "AI chat error");
    res.status(500).json({ error: "AI yanıtı alınamadı" });
  }
});

export default router;
