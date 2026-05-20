import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function ConsentScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tosChecked, setTosChecked] = useState(false);
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);

  const allChecked = tosChecked && kvkkChecked && ageChecked;

  const handleContinue = () => {
    if (!allChecked) return;
    router.push("/onboarding/interests");
  };

  const CheckRow = ({
    checked,
    onToggle,
    children,
  }: {
    checked: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.primary : colors.border,
            backgroundColor: checked ? colors.primary : "transparent",
          },
        ]}
      >
        {checked && <Feather name="check" size={11} color="#fff" />}
      </View>
      <View style={styles.checkContent}>{children}</View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoMark}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        </View>

        <Text style={[styles.headline, { color: colors.foreground }]}>
          Devam etmeden önce
        </Text>
        <Text style={[styles.subtext, { color: colors.mutedForeground }]}>
          ORUN, sessiz ve seçkin bir dijital kulüp olarak tasarlanmıştır. Topluluğumuza katılmak için lütfen koşullarımızı onaylayın.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <CheckRow checked={tosChecked} onToggle={() => setTosChecked(!tosChecked)}>
            <Text style={[styles.checkLabel, { color: colors.foreground }]}>
              <Text
                style={[styles.link, { color: colors.primary }]}
                onPress={() => router.push("/legal")}
              >
                Kullanım Koşulları
              </Text>
              {'nı ve '}
              <Text
                style={[styles.link, { color: colors.primary }]}
                onPress={() => router.push("/legal")}
              >
                Gizlilik Politikası
              </Text>
              {'nı okudum, kabul ediyorum.'}
            </Text>
          </CheckRow>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <CheckRow checked={kvkkChecked} onToggle={() => setKvkkChecked(!kvkkChecked)}>
            <Text style={[styles.checkLabel, { color: colors.foreground }]}>
              <Text
                style={[styles.link, { color: colors.primary }]}
                onPress={() => router.push("/legal")}
              >
                KVKK Aydınlatma Metni
              </Text>
              {"'ni okudum; kişisel verilerimin işlenmesine onay veriyorum."}
            </Text>
          </CheckRow>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <CheckRow checked={ageChecked} onToggle={() => setAgeChecked(!ageChecked)}>
            <Text style={[styles.checkLabel, { color: colors.foreground }]}>
              18 yaşında veya daha büyük olduğumu beyan ediyorum.
            </Text>
          </CheckRow>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
          <Feather name="shield" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            ORUN verilerinizi asla üçüncü taraflarla ticari amaçla paylaşmaz. Topluluk kuralları ihlalinde hesabınız incelenebilir.
          </Text>
        </View>

        <Pressable
          style={[
            styles.continueBtn,
            {
              backgroundColor: allChecked ? colors.primary : colors.muted,
              borderRadius: colors.radius,
            },
          ]}
          onPress={handleContinue}
          disabled={!allChecked}
        >
          <Text style={[styles.continueBtnText, { color: allChecked ? "#fff" : colors.mutedForeground }]}>
            Devam Et
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, gap: 20 },
  logoMark: { alignItems: "center", marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  headline: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkContent: { flex: 1 },
  checkLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  link: { fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginHorizontal: 16 },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "flex-start",
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  continueBtn: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  continueBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
