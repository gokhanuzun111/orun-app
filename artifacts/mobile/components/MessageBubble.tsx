import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { type Message } from "@/constants/data";
import { MembershipBadge } from "./MembershipBadge";

interface MessageBubbleProps {
  message: Message;
  isOwn?: boolean;
  onLongPress?: () => void;
}

export function MessageBubble({ message, isOwn = false, onLongPress }: MessageBubbleProps) {
  const colors = useColors();

  if (message.isAI) {
    const isLangAI = message.handle === "@orun.dil";
    return (
      <View style={[styles.aiContainer, { borderColor: colors.primary }]}>
        <View style={styles.aiHeader}>
          <View style={[styles.aiDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.aiLabel, { color: colors.primary }]}>
            {isLangAI ? "ORUN DİL" : "ORUN"}
          </Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{message.timestamp}</Text>
        </View>
        <Text style={[styles.aiContent, { color: colors.foreground }]}>{message.content}</Text>
      </View>
    );
  }

  return (
    <Pressable onLongPress={onLongPress} delayLongPress={500} style={[styles.container, isOwn && styles.ownContainer]}>
      {!isOwn && (
        <View style={[styles.avatar, { backgroundColor: colors.muted, borderRadius: 16 }]}>
          <Text style={[styles.avatarText, { color: colors.mutedForeground }]}>
            {message.author.charAt(0)}
          </Text>
        </View>
      )}
      <View style={[styles.bubble, isOwn ? styles.ownSide : styles.otherSide]}>
        {!isOwn && (
          <View style={styles.meta}>
            <Text style={[styles.authorName, { color: colors.foreground }]}>{message.handle}</Text>
            <MembershipBadge level={message.membershipLevel} size="sm" />
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{message.timestamp}</Text>
          </View>
        )}
        <View
          style={[
            styles.bubbleInner,
            {
              backgroundColor: isOwn ? colors.primary : colors.card,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.content, { color: isOwn ? colors.primaryForeground : colors.foreground }]}>
            {message.content}
          </Text>
        </View>
        {isOwn && (
          <Text style={[styles.ownTime, { color: colors.mutedForeground }]}>{message.timestamp}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 10, marginBottom: 16, paddingHorizontal: 16 },
  ownContainer: { flexDirection: "row-reverse" },
  avatar: {
    width: 32, height: 32,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, alignSelf: "flex-end",
  },
  avatarText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  bubble: { maxWidth: "78%", gap: 6 },
  otherSide: { alignItems: "flex-start" },
  ownSide: { alignItems: "flex-end" },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" as const },
  authorName: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  time: { fontFamily: "Inter_400Regular", fontSize: 10 },
  ownTime: { fontFamily: "Inter_400Regular", fontSize: 10 },
  bubbleInner: { paddingHorizontal: 14, paddingVertical: 10 },
  content: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  aiContainer: {
    marginHorizontal: 16, marginBottom: 20,
    paddingHorizontal: 14, paddingVertical: 12,
    borderLeftWidth: 1, gap: 8,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  aiDot: { width: 5, height: 5, borderRadius: 3 },
  aiLabel: {
    fontFamily: "Inter_600SemiBold", fontSize: 10,
    letterSpacing: 1.5, textTransform: "uppercase" as const, flex: 1,
  },
  aiContent: {
    fontFamily: "Inter_400Regular", fontSize: 13,
    lineHeight: 20, fontStyle: "italic" as const,
  },
});
