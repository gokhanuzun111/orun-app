import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { type ComponentProps, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { INTERESTS } from "@/constants/data";
import { useApp } from "@/context/AppContext";

type FeatherName = ComponentProps<typeof Feather>["name"];
const ICON_MAP: Record<string, FeatherName> = {
  bicycle: "wind", watch: "clock", "wine-glass-empty": "droplet", smoking: "feather",
  book: "book", film: "film", anchor: "anchor", music: "music", plane: "navigation",
  utensils: "coffee", dumbbell: "activity", car: "truck", brain: "eye", landmark: "map-pin",
  shirt: "layers", "chart-line": "trending-up", seedling: "sun", tree: "triangle",
  mountain: "triangle", campground: "triangle", cube: "box", gamepad: "sliders",
  bullseye: "crosshair", language: "globe", flask: "droplet",
};

export default function InterestsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelectedInterests } = useApp();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    setSelectedInterests(selected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/onboarding/interview");
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 20 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[styles.step, { color: colors.mutedForeground }]}>01 / 03</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>İlgi Alanlarınız</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            En az üç tane seçin. Bunlar ORUN deneyiminizi şekillendirir.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {INTERESTS.map(interest => {
          const isSelected = selected.includes(interest.id);
          const iconName: FeatherName = ICON_MAP[interest.icon] ?? "circle";
          return (
            <Pressable
              key={interest.id}
              testID={`interest-${interest.id}`}
              onPress={() => toggleInterest(interest.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.foreground : colors.card,
                  borderColor: isSelected ? colors.foreground : colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Feather
                name={iconName}
                size={14}
                color={isSelected ? colors.background : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.chipLabel,
                  { color: isSelected ? colors.background : colors.foreground },
                ]}
              >
                {interest.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPadding + 24 }]}>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {selected.length} seçildi
        </Text>
        <Pressable
          testID="interests-continue"
          onPress={handleContinue}
          disabled={selected.length < 3}
          style={({ pressed }) => [
            styles.continueBtn,
            {
              backgroundColor: selected.length >= 3 ? colors.foreground : colors.muted,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.continueBtnText,
              { color: selected.length >= 3 ? colors.background : colors.mutedForeground },
            ]}
          >
            Devam Et
          </Text>
          <Feather
            name="arrow-right"
            size={16}
            color={selected.length >= 3 ? colors.background : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerText: { gap: 8 },
  step: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 2 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: 0.2 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 21 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap" as const, gap: 8, paddingBottom: 20 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
  },
  chipLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
    alignItems: "center",
  },
  count: { fontFamily: "Inter_400Regular", fontSize: 12 },
  continueBtn: {
    width: "100%",
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 0.3 },
});
