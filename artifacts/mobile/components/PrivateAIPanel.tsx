import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Room } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { getClubAIPersona } from "@/hooks/useRoomAI";

const API_BASE = process.env["EXPO_PUBLIC_DOMAIN"]
  ? `https://${process.env["EXPO_PUBLIC_DOMAIN"]}:8080/api`
  : "http://localhost:8080/api";

interface PrivateMsg {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
}

interface Props {
  room: Room;
  aiRemaining: number | null;
  tokensRemaining?: number;
  canAsk: boolean;
  onRecordAI: () => Promise<void>;
  onClose: () => void;
  clubMessages?: string[];
}

export function PrivateAIPanel({ room, aiRemaining, tokensRemaining, canAsk, onRecordAI, onClose, clubMessages = [] }: Props) {
  const colors = useColors();
  const [messages, setMessages] = useState<PrivateMsg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const persona = getClubAIPersona(room.clubId);

  const sessionHistory = useRef<{ role: "user" | "ai"; content: string }[]>([]);

  const now = () =>
    new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const handleAsk = useCallback(async () => {
    const q = input.trim();
    if (!q || !canAsk || isLoading) return;

    const userMsg: PrivateMsg = {
      id: Date.now().toString(),
      role: "user",
      content: q,
      time: now(),
    };
    setMessages(prev => [userMsg, ...prev]);
    setInput("");
    setIsLoading(true);
    setAiError(null);

    sessionHistory.current.push({ role: "user", content: q });
    await onRecordAI();

    try {
      const recentMessages = [
        ...clubMessages.slice(-12),
        ...sessionHistory.current.slice(-6).map(m => `${m.role === "user" ? "Kullanıcı" : "AI"}: ${m.content}`),
      ];

      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          clubId: room.clubId,
          clubName: room.clubName,
          clubPersona: persona,
          recentMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "Yanıt alınamadı");
      }

      const reply: string = data.reply;
      sessionHistory.current.push({ role: "ai", content: reply });

      const aiMsg: PrivateMsg = {
        id: Date.now().toString() + "-ai",
        role: "ai",
        content: reply,
        time: now(),
      };
      setMessages(prev => [aiMsg, ...prev]);
    } catch (err: any) {
      setAiError("AI şu an yanıt veremiyor. Lütfen tekrar deneyin.");
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
      sessionHistory.current.pop();
    } finally {
      setIsLoading(false);
    }
  }, [input, canAsk, isLoading, room, persona, clubMessages, onRecordAI]);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.title, { color: colors.foreground }]}>AI ASISTAN</Text>
          <View style={[styles.badge, { backgroundColor: colors.muted }]}>
            <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>ÖZEL</Text>
          </View>
          {clubMessages.length > 0 && (
            <View style={[styles.badge, { backgroundColor: `${colors.primary}18` }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {clubMessages.length} mesaj öğrenildi
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {tokensRemaining !== undefined && (
            <View style={[styles.quota, { backgroundColor: colors.muted }]}>
              <Text style={[styles.quotaText, { color: tokensRemaining < 100 ? "#ef4444" : colors.primary }]}>
                {tokensRemaining.toLocaleString("tr-TR")} token
              </Text>
            </View>
          )}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {messages.length === 0 && !isLoading ? (
        <View style={styles.empty}>
          <Feather name="cpu" size={18} color={colors.mutedForeground} style={{ opacity: 0.6 }} />
          <Text style={[styles.personaText, { color: colors.mutedForeground }]}>{persona}</Text>
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            {room.clubName} hakkında gizlice soru sorun.{"\n"}Yanıtları yalnızca siz görürsünüz.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          inverted
          style={styles.list}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? [styles.userBubble, { backgroundColor: colors.primary }]
                  : [styles.aiBubble, { backgroundColor: colors.background, borderColor: colors.border }],
              ]}
            >
              {item.role === "ai" && (
                <Text style={[styles.aiLabel, { color: colors.primary }]}>AI</Text>
              )}
              <Text
                style={[
                  styles.bubbleText,
                  { color: item.role === "user" ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {item.content}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  {
                    color:
                      item.role === "user"
                        ? "rgba(255,255,255,0.55)"
                        : colors.mutedForeground,
                  },
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />
      )}

      {isLoading && (
        <View style={[styles.loading, { borderTopColor: colors.border }]}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Yanıt hazırlanıyor...
          </Text>
        </View>
      )}

      {aiError && (
        <View style={[styles.errorRow, { borderTopColor: colors.border }]}>
          <Feather name="alert-circle" size={12} color="#ef4444" />
          <Text style={styles.errorText}>{aiError}</Text>
        </View>
      )}

      <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
        {!canAsk ? (
          <View style={styles.limitRow}>
            <Feather name="moon" size={13} color={colors.mutedForeground} />
            <Text style={[styles.limitText, { color: colors.mutedForeground }]}>
              Bu ayın token kotanızı kullandınız. Gelecek ay yenilenir.
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={`${room.clubName} hakkında sorun...`}
              placeholderTextColor={colors.mutedForeground}
              multiline
              style={[styles.input, { color: colors.foreground }]}
              onSubmitEditing={handleAsk}
            />
            <Pressable
              onPress={handleAsk}
              disabled={!input.trim() || isLoading}
              style={[
                styles.sendBtn,
                {
                  backgroundColor:
                    input.trim() && !isLoading ? colors.primary : colors.muted,
                  borderRadius: 8,
                },
              ]}
            >
              <Feather
                name="arrow-up"
                size={14}
                color={
                  input.trim() && !isLoading
                    ? colors.primaryForeground
                    : colors.mutedForeground
                }
              />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, maxHeight: 360 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 7, flexShrink: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.2 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  quota: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  quotaText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  closeBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", gap: 6, paddingVertical: 18, paddingHorizontal: 24 },
  personaText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  hint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.7,
  },
  list: { maxHeight: 220 },
  bubble: {
    marginHorizontal: 12,
    marginVertical: 3,
    padding: 10,
    borderRadius: 10,
    maxWidth: "88%",
  },
  userBubble: { alignSelf: "flex-end" },
  aiBubble: { alignSelf: "flex-start", borderWidth: 1 },
  aiLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 3,
  },
  bubbleText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  bubbleTime: { fontFamily: "Inter_400Regular", fontSize: 10, marginTop: 3, alignSelf: "flex-end" },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopWidth: 1,
  },
  loadingText: { fontFamily: "Inter_400Regular", fontSize: 12, fontStyle: "italic" },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopWidth: 1,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#ef4444",
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    maxHeight: 70,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  limitRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
  },
  limitText: { fontFamily: "Inter_400Regular", fontSize: 12, flex: 1 },
});
