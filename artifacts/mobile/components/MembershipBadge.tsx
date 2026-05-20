import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { type MembershipLevel, MEMBERSHIP_LABELS } from "@/constants/data";

interface MembershipBadgeProps {
  level: MembershipLevel;
  size?: "sm" | "md";
}

export function MembershipBadge({ level, size = "sm" }: MembershipBadgeProps) {
  const colors = useColors();
  const label = MEMBERSHIP_LABELS[level];

  const badgeColor: Record<MembershipLevel, string> = {
    0: colors.mutedForeground,
    1: colors.mutedForeground,
    2: colors.primary,
    3: "#1B3A6B",
  };

  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          borderColor: badgeColor[level],
          paddingHorizontal: isSmall ? 6 : 8,
          paddingVertical: isSmall ? 2 : 3,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: badgeColor[level],
            fontSize: isSmall ? 8 : 10,
            letterSpacing: isSmall ? 1 : 1.5,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 0.5,
    borderRadius: 2,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase" as const,
  },
});
