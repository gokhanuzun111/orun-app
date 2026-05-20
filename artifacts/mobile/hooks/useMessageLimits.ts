import { useCallback, useEffect, useRef, useState } from "react";
import type { MembershipLevel } from "@/constants/data";
import { useTokens as apiUseTokens } from "@/services/membership";

export interface MemberLimits {
  chatMessages: number | null;
  monthlyTokens: number;
  dmMessages: number | null;
  canCreateEvents: boolean;
}

export const AI_TOKEN_COST = 150;
export const CHAT_TOKEN_COST = 10;

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

export function useMessageLimits(level: MembershipLevel) {
  const limits = MEMBER_LIMITS[level];
  const [tokensUsed, setTokensUsed] = useState(0);
  const [tokensAllowed, setTokensAllowed] = useState(limits.monthlyTokens);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;
    apiUseTokens(0)
      .then(({ tokensUsed: used, tokensAllowed: allowed }) => {
        setTokensUsed(used);
        setTokensAllowed(allowed);
      })
      .catch(() => {});
  }, []);

  const recordChat = useCallback(async () => {
    setTokensUsed(prev => prev + CHAT_TOKEN_COST);
    try {
      const res = await apiUseTokens(CHAT_TOKEN_COST);
      setTokensUsed(res.tokensUsed);
      setTokensAllowed(res.tokensAllowed);
    } catch {}
  }, []);

  const recordAI = useCallback(async () => {
    setTokensUsed(prev => prev + AI_TOKEN_COST);
    try {
      const res = await apiUseTokens(AI_TOKEN_COST);
      setTokensUsed(res.tokensUsed);
      setTokensAllowed(res.tokensAllowed);
    } catch {}
  }, []);

  const tokensRemaining = Math.max(0, tokensAllowed - tokensUsed);
  const aiRemaining = Math.floor(tokensRemaining / AI_TOKEN_COST);
  const chatRemaining = limits.chatMessages === null ? null : Math.max(0, limits.chatMessages - Math.floor(tokensUsed / CHAT_TOKEN_COST));
  const canChat = tokensRemaining >= CHAT_TOKEN_COST && (limits.chatMessages === null || (chatRemaining !== null && chatRemaining > 0));
  const canAsk = tokensRemaining >= AI_TOKEN_COST;

  return {
    limits,
    chatUsed: Math.floor(tokensUsed / CHAT_TOKEN_COST),
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
