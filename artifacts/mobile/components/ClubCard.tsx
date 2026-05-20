import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import type { ComponentProps } from "react";
import { type Club } from "@/constants/data";

interface ClubCardProps {
  club: Club;
  joined?: boolean;
  onWaitlist?: boolean;
}

type FeatherName = ComponentProps<typeof Feather>["name"];
const ICON_MAP: Record<string, FeatherName> = {
  bicycle: "wind",
  watch: "clock",
  "wine-glass-empty": "droplet",
  smoking: "feather",
  book: "book",
  film: "film",
  anchor: "anchor",
  music: "music",
  plane: "navigation",
  utensils: "coffee",
  dumbbell: "activity",
  car: "truck",
  brain: "eye",
  landmark: "map-pin",
  shirt: "layers",
  "chart-line": "trending-up",
  seedling: "sun",
  tree: "triangle",
  mountain: "triangle",
  campground: "triangle",
  cube: "box",
  gamepad: "sliders",
  bullseye: "crosshair",
  language: "globe",
  flask: "droplet",
};

export function ClubCard({ club, joined = false, onWaitlist = false }: ClubCardProps) {
  const colors = useColors();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconName: FeatherName = ICON_MAP[club.icon] ?? "circle";
  const isFull = club.memberCount >= club.capacity;
  const fillRatio = club.memberCount / club.capacity;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/club/${club.id}` as Href);
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        testID={`club-card-${club.id}`}
        onPressIn={() => { scale.value = withTiming(0.97, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
        onPress={handlePress}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: joined ? colors.primary : colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.muted, borderRadius: colors.radius - 2 }]}>
          <Feather name={iconName} size={18} color={joined ? colors.primary : colors.mutedForeground} />
        </View>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, { color: colors.foreground }]}>{club.name}</Text>
            {joined && <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />}
            {onWaitlist && !joined && (
              <View style={[styles.waitlistBadge, { borderColor: colors.primary }]}>
                <Text style={[styles.waitlistBadgeText, { color: colors.primary }]}>SIRADA</Text>
              </View>
            )}
          </View>
          <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
            {club.description}
          </Text>
          <View style={styles.footer}>
            <View style={styles.stat}>
              <Feather name="users" size={11} color={colors.mutedForeground} />
              <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                {club.memberCount.toLocaleString("tr-TR")}
                <Text style={{ color: colors.mutedForeground, opacity: 0.5 }}>/{club.capacity.toLocaleString("tr-TR")}</Text>
              </Text>
            </View>
            {isFull && club.waitlistCount > 0 && (
              <View style={styles.stat}>
                <Feather name="clock" size={11} color={colors.mutedForeground} />
                <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                  {club.waitlistCount.toLocaleString("tr-TR")} bekliyor
                </Text>
              </View>
            )}
            {!isFull && (
              <View style={styles.stat}>
                <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.statText, { color: colors.mutedForeground }]}>
                  {(club.capacity - club.memberCount).toLocaleString("tr-TR")} yer açık
                </Text>
              </View>
            )}
          </View>
          <View style={[styles.capacityBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.capacityFill,
                {
                  backgroundColor: isFull ? colors.primary : colors.primary,
                  width: `${Math.min(100, fillRatio * 100)}%` as `${number}%`,
                  opacity: isFull ? 1 : 0.6,
                },
              ]}
            />
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={colors.border} style={styles.arrow} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 1,
    borderWidth: 0,
    borderBottomWidth: 1,
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.1,
    flex: 1,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  waitlistBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderRadius: 3,
  },
  waitlistBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 8,
    letterSpacing: 1,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  capacityBar: {
    height: 2,
    borderRadius: 1,
    marginTop: 6,
    overflow: "hidden",
  },
  capacityFill: {
    height: 2,
    borderRadius: 1,
  },
  arrow: {
    flexShrink: 0,
  },
});
