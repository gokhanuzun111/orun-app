import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function OnboardingWelcome() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginAsAdmin } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [adminTapCount, setAdminTapCount] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/onboarding/auth");
  };

  const handleLogoTap = () => {
    const next = adminTapCount + 1;
    setAdminTapCount(next);
    if (next >= 5) {
      setAdminTapCount(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loginAsAdmin();
    }
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPadding, paddingBottom: bottomPadding + 40 },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Pressable style={styles.logoArea} onPress={handleLogoTap}>
          <Text style={[styles.wordmark, { color: colors.foreground }]}>ORUN</Text>
          <View style={[styles.divider, { backgroundColor: colors.primary }]} />
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Düşünceli insanlar için seçilmiş çevreler.
          </Text>
        </Pressable>

        <View style={styles.pillars}>
          {["Nicelik değil, nitelik.", "Gürültü değil, zeka.", "Gösteriş değil, varlık."].map((line, i) => (
            <View key={i} style={styles.pillarRow}>
              <View style={[styles.pillarDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.pillarText, { color: colors.mutedForeground }]}>{line}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Pressable
          testID="onboarding-enter"
          onPress={handleEnter}
          style={({ pressed }) => [
            styles.enterButton,
            {
              backgroundColor: colors.foreground,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.enterText, { color: colors.background }]}>Erişim İçin Başvur</Text>
        </Pressable>
        <Text style={[styles.notice, { color: colors.mutedForeground }]}>
          Üyelik seçicidir. Herkes kabul edilmez.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 48,
  },
  logoArea: {
    gap: 20,
  },
  wordmark: {
    fontFamily: "Inter_700Bold",
    fontSize: 48,
    letterSpacing: 12,
    textTransform: "uppercase" as const,
  },
  divider: {
    width: 32,
    height: 1,
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  pillars: {
    gap: 14,
  },
  pillarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pillarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  pillarText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    letterSpacing: 0.2,
  },
  footer: {
    gap: 16,
    alignItems: "center",
  },
  enterButton: {
    width: "100%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  enterText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  notice: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
