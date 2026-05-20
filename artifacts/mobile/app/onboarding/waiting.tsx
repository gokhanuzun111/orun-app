import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function WaitingScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 1800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleEnterApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)/rooms");
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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.orb,
            {
              backgroundColor: colors.primary,
              opacity: pulseAnim,
              shadowColor: colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        />
        <Text style={[styles.title, { color: colors.foreground }]}>Başvuru Alındı</Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          AI'ımız yanıtlarınızı inceliyor. Bu genellikle birkaç saniye sürer.
        </Text>

        <View style={[styles.statusBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {[
            { label: "Özgünlük değerlendiriliyor", done: true },
            { label: "İlgi alanları analiz ediliyor", done: true },
            { label: "Topluluk uyumu kontrol ediliyor", done: false },
          ].map((item, i) => (
            <View key={i} style={styles.statusRow}>
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: item.done ? colors.primary : colors.border,
                    opacity: item.done ? 1 : pulseAnim,
                  },
                ]}
              />
              <Text style={[styles.statusLabel, { color: item.done ? colors.foreground : colors.mutedForeground }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.decisionBox, { borderColor: colors.primary, borderRadius: colors.radius }]}>
          <View style={[styles.decisionDot, { backgroundColor: colors.primary }]} />
          <View style={styles.decisionText}>
            <Text style={[styles.decisionTitle, { color: colors.primary }]}>KABUL EDİLDİNİZ</Text>
            <Text style={[styles.decisionBody, { color: colors.mutedForeground }]}>
              ORUN'a hoş geldiniz. Üye erişimi verildi.
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Pressable
          testID="enter-app"
          onPress={handleEnterApp}
          style={({ pressed }) => [
            styles.enterBtn,
            {
              backgroundColor: colors.foreground,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.enterBtnText, { color: colors.background }]}>ORUN'a Gir</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", gap: 28 },
  orb: { width: 48, height: 48, borderRadius: 24, marginBottom: 8 },
  title: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: 0.2, textAlign: "center" },
  body: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, textAlign: "center" },
  statusBox: { width: "100%", padding: 20, borderWidth: 1, gap: 14 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  decisionBox: { width: "100%", borderWidth: 1, padding: 20, flexDirection: "row", alignItems: "flex-start", gap: 14 },
  decisionDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5, flexShrink: 0 },
  decisionText: { flex: 1, gap: 6 },
  decisionTitle: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 2 },
  decisionBody: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
  footer: { paddingTop: 16 },
  enterBtn: { height: 52, alignItems: "center", justifyContent: "center" },
  enterBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 0.5 },
});
