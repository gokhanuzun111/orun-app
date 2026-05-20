import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { type Room, LANGUAGE_CONFIG } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { checkRoomAccess, useRoomAccessLabel, WAITING_DAYS } from "@/hooks/useRoomAccess";

interface RoomCardProps {
  room: Room;
}

const MOOD_LABELS = ["Sakin", "Aktif", "Canlı", "Yoğun", "Hareketli"];

function getRoomMood(memberCount: number, lastActivity: string): { label: string; intensity: number } {
  const recentActivity = lastActivity.includes("dk") || lastActivity.includes("sn") || lastActivity.includes("Az");
  const base = recentActivity ? Math.min(4, Math.floor(memberCount / 30)) : Math.max(0, Math.floor(memberCount / 40) - 1);
  return { label: MOOD_LABELS[Math.min(4, base)], intensity: Math.min(4, base) };
}

export function RoomCard({ room }: RoomCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { user } = useApp();
  const scale = useSharedValue(1);
  const mood = getRoomMood(room.memberCount, room.lastActivity);
  const langConfig = room.targetLanguage ? LANGUAGE_CONFIG[room.targetLanguage] : null;
  const access = checkRoomAccess(room, user);
  const accessLabel = useRoomAccessLabel(access);
  const isFull = room.memberCount >= room.maxCapacity;
  const fillRatio = Math.min(1, room.memberCount / room.maxCapacity);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const moodColor = [
    colors.mutedForeground,
    colors.mutedForeground,
    colors.primary,
    colors.primary,
    colors.primary,
  ][mood.intensity];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/room/${room.id}` as Href);
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        testID={`room-card-${room.id}`}
        onPressIn={() => { scale.value = withTiming(0.98, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
        onPress={handlePress}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: access.allowed ? colors.border : colors.muted,
            borderRadius: colors.radius,
            opacity: isFull ? 0.6 : 1,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {access.allowed ? (
              <View style={[styles.activePulse, { backgroundColor: colors.primary }]} />
            ) : (
              <Feather
                name={access.reason === "room_full" ? "users" : "lock"}
                size={12}
                color={colors.mutedForeground}
              />
            )}
            <Text
              style={[
                styles.name,
                { color: access.allowed ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {room.name}
            </Text>
            {langConfig && (
              <View style={[styles.langBadge, { backgroundColor: colors.muted, borderRadius: 4 }]}>
                <Text style={styles.langFlag}>{langConfig.flag}</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.clubTag, { color: colors.mutedForeground }]}>{room.clubName}</Text>
            <View style={styles.moodTag}>
              {!access.allowed && access.reason === "too_new" ? (
                <View style={[styles.waitPill, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.waitPillFill,
                      {
                        width: `${((WAITING_DAYS - access.daysLeft) / WAITING_DAYS) * 100}%` as any,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                  <Text style={[styles.waitPillText, { color: colors.mutedForeground }]}>
                    {WAITING_DAYS - access.daysLeft}/{WAITING_DAYS} gün
                  </Text>
                </View>
              ) : !access.allowed ? (
                <Text style={[styles.moodText, { color: colors.mutedForeground }]}>
                  {accessLabel}
                </Text>
              ) : (
                <>
                  <View style={[styles.moodDot, { backgroundColor: moodColor }]} />
                  <Text style={[styles.moodText, { color: moodColor }]}>{mood.label}</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.topicBox, { backgroundColor: colors.muted, borderRadius: colors.radius - 4 }]}>
          <Text style={[styles.topicLabel, { color: colors.mutedForeground }]}>TARTIŞILIYOR</Text>
          <Text
            style={[styles.topic, { color: access.allowed ? colors.foreground : colors.mutedForeground }]}
            numberOfLines={2}
          >
            {room.topic}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.presenceRow}>
            {access.allowed && Array.from({ length: Math.min(5, room.memberCount) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.presenceDot,
                  {
                    backgroundColor: i === 0 ? colors.primary : colors.mutedForeground,
                    opacity: 1 - i * 0.15,
                    marginLeft: i > 0 ? -3 : 0,
                  },
                ]}
              />
            ))}
            <Text style={[styles.statText, { color: colors.mutedForeground, marginLeft: access.allowed ? 6 : 0 }]}>
              {room.memberCount}/{room.maxCapacity}
            </Text>
          </View>

          <View style={styles.footerRight}>
            <View style={[styles.capacityBar, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.capacityFill,
                  {
                    width: `${fillRatio * 100}%` as any,
                    backgroundColor: isFull ? "#E05252" : fillRatio > 0.8 ? colors.primary : colors.mutedForeground,
                  },
                ]}
              />
            </View>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{room.lastActivity}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  header: { gap: 5 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activePulse: { width: 6, height: 6, borderRadius: 3 },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    letterSpacing: 0.1,
    flex: 1,
  },
  langBadge: { paddingHorizontal: 5, paddingVertical: 2 },
  langFlag: { fontSize: 12 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 14,
  },
  clubTag: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  moodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  moodDot: { width: 4, height: 4, borderRadius: 2 },
  moodText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  waitPill: {
    borderRadius: 4,
    overflow: "hidden",
    height: 18,
    minWidth: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  waitPillFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    opacity: 0.35,
  },
  waitPillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.4,
    paddingHorizontal: 6,
  },
  topicBox: { padding: 12, gap: 4 },
  topicLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
  topic: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  presenceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  presenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  footerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  capacityBar: {
    width: 60,
    height: 2,
    borderRadius: 1,
    overflow: "hidden",
  },
  capacityFill: {
    height: "100%",
    borderRadius: 1,
  },
  time: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
});
