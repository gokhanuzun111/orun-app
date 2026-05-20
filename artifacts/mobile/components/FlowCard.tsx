import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { type FlowItem } from "@/constants/data";
import { MembershipBadge } from "./MembershipBadge";

interface FlowCardProps {
  item: FlowItem;
}

export function FlowCard({ item }: FlowCardProps) {
  const colors = useColors();
  const isAI = item.handle === "@orun.ai";

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: isAI ? colors.primary : colors.border,
          borderLeftWidth: isAI ? 1 : 0,
          paddingLeft: isAI ? 16 : 0,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.muted, borderRadius: 20 }]}>
            <Text style={[styles.avatarInitial, { color: isAI ? colors.primary : colors.mutedForeground }]}>
              {item.author.charAt(0)}
            </Text>
          </View>
          <View style={styles.authorMeta}>
            <View style={styles.authorRow}>
              <Text style={[styles.authorName, { color: colors.foreground }]}>{item.author}</Text>
              <MembershipBadge level={item.membershipLevel} size="sm" />
            </View>
            <View style={styles.subRow}>
              <Text style={[styles.handle, { color: colors.mutedForeground }]}>{item.handle}</Text>
              <Text style={[styles.dot, { color: colors.border }]}> · </Text>
              <Text style={[styles.club, { color: colors.primary }]}>{item.clubName}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.timestamp}</Text>
      </View>

      <Text style={[styles.content, { color: colors.foreground }]}>{item.content}</Text>

      <View style={styles.footer}>
        <Text style={[styles.replyCount, { color: colors.mutedForeground }]}>
          {item.replyCount} yanıt
        </Text>
        <Text style={[styles.readMore, { color: colors.mutedForeground }]}>
          Odaya git →
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  authorInfo: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  authorMeta: {
    flex: 1,
    gap: 2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  authorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  handle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  dot: {
    fontSize: 12,
  },
  club: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    flexShrink: 0,
  },
  content: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  readMore: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
