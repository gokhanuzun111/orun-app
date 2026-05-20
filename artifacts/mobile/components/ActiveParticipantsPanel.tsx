import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { type MembershipLevel, MEMBERSHIP_LABELS } from "@/constants/data";

interface Participant {
  id: string;
  handle: string;
  name: string;
  membershipLevel: MembershipLevel;
  joinedMinutesAgo: number;
}

interface ActiveParticipantsPanelProps {
  visible: boolean;
  onClose: () => void;
  participants: Participant[];
  totalCount: number;
  maxCapacity: number;
  recentlyJoined?: string | null;
  recentlyLeft?: string | null;
}

const LEVEL_COLORS: Record<MembershipLevel, string> = {
  0: "#9ca3af",
  1: "#6b7280",
  2: "#3b82f6",
  3: "#8b5cf6",
};

export function ActiveParticipantsPanel({
  visible,
  onClose,
  participants,
  totalCount,
  maxCapacity,
  recentlyJoined,
  recentlyLeft,
}: ActiveParticipantsPanelProps) {
  const colors = useColors();
  const translateX = useRef(new Animated.Value(320)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 320,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted && !visible) return null;

  const fillRatio = Math.min(1, totalCount / maxCapacity);
  const isFull = totalCount >= maxCapacity;

  return (
    <>
      {visible && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          />
        </Pressable>
      )}

      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.background,
            borderLeftColor: colors.border,
            transform: [{ translateX }],
          },
        ]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <View style={[styles.panelHeader, { borderBottomColor: colors.border }]}>
          <View style={styles.panelTitleRow}>
            <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.panelTitle, { color: colors.foreground }]}>
              Aktif Katılımcılar
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} testID="close-participants-panel">
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <View style={[styles.capacitySection, { borderBottomColor: colors.border }]}>
          <View style={styles.capacityRow}>
            <Text style={[styles.capacityCount, { color: colors.foreground }]}>
              {totalCount}
              <Text style={[styles.capacityMax, { color: colors.mutedForeground }]}>
                /{maxCapacity}
              </Text>
            </Text>
            <Text
              style={[
                styles.capacityLabel,
                { color: isFull ? "#ef4444" : colors.mutedForeground },
              ]}
            >
              {isFull ? "ODA DOLU" : "kişi mevcut"}
            </Text>
          </View>
          <View style={[styles.capacityBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.capacityFill,
                {
                  width: `${fillRatio * 100}%` as `${number}%`,
                  backgroundColor: isFull
                    ? "#ef4444"
                    : fillRatio > 0.85
                    ? "#f59e0b"
                    : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {(recentlyJoined || recentlyLeft) && (
          <View
            style={[
              styles.activityBanner,
              {
                backgroundColor: recentlyJoined ? colors.card : colors.muted,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Feather
              name={recentlyJoined ? "user-plus" : "user-minus"}
              size={11}
              color={recentlyJoined ? colors.primary : colors.mutedForeground}
            />
            <Text style={[styles.activityText, { color: recentlyJoined ? colors.primary : colors.mutedForeground }]}>
              {recentlyJoined
                ? `${recentlyJoined} odaya katıldı`
                : `${recentlyLeft} odadan ayrıldı`}
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {participants.map((p) => (
            <View
              key={p.id}
              style={[styles.participantRow, { borderBottomColor: colors.border }]}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: LEVEL_COLORS[p.membershipLevel] + "22" },
                ]}
              >
                <Text
                  style={[
                    styles.avatarInitial,
                    { color: LEVEL_COLORS[p.membershipLevel] },
                  ]}
                >
                  {p.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.participantInfo}>
                <Text style={[styles.participantName, { color: colors.foreground }]}>
                  {p.name}
                </Text>
                <Text style={[styles.participantHandle, { color: colors.mutedForeground }]}>
                  {p.handle}
                </Text>
              </View>
              <View style={styles.participantRight}>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: LEVEL_COLORS[p.membershipLevel] + "22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelText,
                      { color: LEVEL_COLORS[p.membershipLevel] },
                    ]}
                  >
                    {MEMBERSHIP_LABELS[p.membershipLevel]}
                  </Text>
                </View>
                <Text style={[styles.joinedTime, { color: colors.mutedForeground }]}>
                  {p.joinedMinutesAgo === 0
                    ? "şimdi"
                    : p.joinedMinutesAgo < 60
                    ? `${p.joinedMinutesAgo}dk`
                    : `${Math.floor(p.joinedMinutesAgo / 60)}sa`}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const TURKISH_NAMES = [
  "Ahmet", "Mehmet", "Mustafa", "Ali", "Hüseyin", "İbrahim", "Hasan",
  "Ömer", "Emre", "Burak", "Kaan", "Tarık", "Sercan", "Oğuz", "Cem",
  "Berk", "Deniz", "Arda", "Yusuf", "Murat", "Kemal", "Volkan", "Selim",
  "Erkan", "Onur", "Baran", "Furkan", "Uğur", "Tunç", "Soner",
  "Zeynep", "Ayşe", "Fatma", "Elif", "Selin", "Merve", "Büşra",
  "Esra", "Ceyda", "Gizem", "Nida", "Pınar", "Alara", "İpek",
];

export function generateParticipants(count: number, seed: number = 0): Participant[] {
  const participants: Participant[] = [];
  const usedNames = new Set<string>();
  const levels: MembershipLevel[] = [1, 1, 2, 2, 3, 3, 3];

  for (let i = 0; i < Math.min(count, 40); i++) {
    let name: string;
    let attempts = 0;
    do {
      const idx = (seed + i * 7 + attempts) % TURKISH_NAMES.length;
      name = TURKISH_NAMES[idx];
      attempts++;
    } while (usedNames.has(name) && attempts < 100);
    usedNames.add(name);

    const handle = `@${name.toLowerCase().replace("ı", "i").replace("ğ", "g").replace("ü", "u").replace("ş", "s").replace("ö", "o").replace("ç", "c").replace("İ", "i")}${(seed + i * 13) % 99 + 1}`;
    const level = levels[(seed + i * 3) % levels.length] as MembershipLevel;
    const joinedMinutesAgo = Math.floor(((seed + i * 17) % 180));

    participants.push({
      id: `p-${seed}-${i}`,
      handle,
      name,
      membershipLevel: level,
      joinedMinutesAgo,
    });
  }

  return participants;
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    borderLeftWidth: 1,
    zIndex: 100,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  panelTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  panelTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  closeBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  capacitySection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  capacityRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  capacityCount: { fontFamily: "Inter_600SemiBold", fontSize: 22 },
  capacityMax: { fontFamily: "Inter_400Regular", fontSize: 16 },
  capacityLabel: { fontFamily: "Inter_500Medium", fontSize: 10, letterSpacing: 1 },
  capacityBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  capacityFill: { height: "100%", borderRadius: 2 },
  activityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  activityText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  list: { flex: 1 },
  listContent: { paddingVertical: 4 },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  participantInfo: { flex: 1, gap: 2 },
  participantName: { fontFamily: "Inter_500Medium", fontSize: 13 },
  participantHandle: { fontFamily: "Inter_400Regular", fontSize: 11 },
  participantRight: { alignItems: "flex-end", gap: 4 },
  levelBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  levelText: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 0.8 },
  joinedTime: { fontFamily: "Inter_400Regular", fontSize: 10 },
});
