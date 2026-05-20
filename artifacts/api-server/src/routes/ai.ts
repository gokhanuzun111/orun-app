import { Router } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
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

router.post("/ai/chat", async (req, res) => {
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

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM_TEMPLATE(clubName, clubPersona),
    },
  ];

  if (recentMessages && recentMessages.length > 0) {
    const context = recentMessages.slice(-15).join("\n");
    messages.push({
      role: "system",
      content: `Kulüp sohbet geçmişinden son mesajlar (bağlam için):\n${context}`,
    });
  }

  messages.push({
    role: "user",
    content: question,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 200,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content ?? "Şu an yanıt veremiyorum, lütfen tekrar deneyin.";
    res.json({ reply });
  } catch (err) {
    logger.error({ err, clubId }, "AI chat error");
    res.status(500).json({ error: "AI yanıtı alınamadı" });
  }
});

export default router;
