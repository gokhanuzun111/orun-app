import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { MembershipLevel } from "@/constants/data";

export interface MemberLimits {
  chatMessages: number | null;
  monthlyTokens: number;
  dmMessages: number | null;
  canCreateEvents: boolean;
}

export const AI_TOKEN_COST = 50;

export const MEMBER_LIMITS: Record<MembershipLevel, MemberLimits> = {
  0: { chatMessages: 3,    monthlyTokens: 250,    dmMessages: 0,    canCreateEvents: false },
  1: { chatMessages: null, monthlyTokens: 5000,   dmMessages: 0,    canCreateEvents: false },
  2: { chatMessages: null, monthlyTokens: 20000,  dmMessages: 20,   canCreateEvents: false },
  3: { chatMessages: null, monthlyTokens: 100000, dmMessages: null, canCreateEvents: true  },
};

export const MEMBERSHIP_LABEL_FULL: Record<MembershipLevel, string> = {
  0: "ADAY — Ücretsiz",
  1: "ÜYE",
  2: "MÜDAVİM",
  3: "SEÇKİN",
};

function thisMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

export function useMessageLimits(level: MembershipLevel) {
  const limits = MEMBER_LIMITS[level];
  const [chatUsed, setChatUsed] = useState(0);
  const [tokensUsed, setTokensUsed] = useState(0);
  const month = thisMonthKey();
  const today = todayKey();

  useEffect(() => {
    AsyncStorage.getItem(`@orun:chat:${today}`).then(v => { if (v) setChatUsed(+v); });
    AsyncStorage.getItem(`@orun:tokens:${month}`).then(v => { if (v) setTokensUsed(+v); });
  }, [today, month]);

  const recordChat = useCallback(async () => {
    const n = chatUsed + 1;
    setChatUsed(n);
    await AsyncStorage.setItem(`@orun:chat:${today}`, String(n));
  }, [chatUsed, today]);

  const recordAI = useCallback(async () => {
    const n = tokensUsed + AI_TOKEN_COST;
    setTokensUsed(n);
    await AsyncStorage.setItem(`@orun:tokens:${month}`, String(n));
  }, [tokensUsed, month]);

  const tokensRemaining = Math.max(0, limits.monthlyTokens - tokensUsed);
  const aiRemaining = Math.floor(tokensRemaining / AI_TOKEN_COST);
  const chatRemaining = limits.chatMessages === null ? null : Math.max(0, limits.chatMessages - chatUsed);
  const canChat = limits.chatMessages === null || chatUsed < limits.chatMessages;
  const canAsk = tokensUsed + AI_TOKEN_COST <= limits.monthlyTokens;

  return {
    limits,
    chatUsed,
    tokensUsed,
    tokensRemaining,
    aiRemaining,
    chatRemaining,
    canChat,
    canAsk,
    recordChat,
    recordAI,
  };
}
