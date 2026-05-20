import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MEMBERSHIP_LABELS, type MembershipLevel } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TIERS: {
  level: MembershipLevel;
  price: string;
  tokens: string;
  perks: string[];
  note?: string;
}[] = [
  {
    level: 0,
    price: "Ücretsiz",
    tokens: "250 AI token / ay",
    perks: ["Kulüpleri görüntüle", "Akış'ı oku", "Odaları izle", "250 AI token / ay"],
    note: "Gözlemci erişimi. Katılım için ÜYE olun.",
  },
  {
    level: 1,
    price: "₺299 / ay",
    tokens: "5.000 AI token / ay",
    perks: ["Odalara katıl ve gönderi yap", "5.000 AI token / ay", "Özel AI asistan", "Doğrudan mesajlar (kazanılmış)", "Tam arama"],
  },
  {
    level: 2,
    price: "₺899 / ay",
    tokens: "20.000 AI token / ay",
    perks: ["Üye'nin her şeyi", "20.000 AI token / ay", "MÜDAVİM'e özel odalar", "AI kişiselleştirme", "Erken etkinlik erişimi"],
  },
  {
    level: 3,
    price: "Yalnızca davet",
    tokens: "100.000 AI token / ay",
    perks: ["Her şeye tam erişim", "100.000 AI token / ay", "Özel etkinlik davetleri", "Seçilmiş tanışmalar", "Tüm kulüpler"],
    note: "Kazanılır ya da davet edilir. Satın alınamaz.",
  },
];

export default function MembershipScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const tierColor: Record<MembershipLevel, string> = {
    0: colors.mutedForeground,
    1: colors.mutedForeground,
    2: colors.primary,
    3: "#1B3A6B",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Üyelik</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          ORUN üyeliği katılım yoluyla kazanılır. Her kademe, topluluğa gerçek katkıyı ve AI kullanım hakkını yansıtır.
        </Text>

        {TIERS.map(tier => {
          const isCurrent = user.membershipLevel === tier.level;
          const color = tierColor[tier.level];

          return (
            <View
              key={tier.level}
              style={[
                styles.tierCard,
                {
                  backgroundColor: isCurrent ? colors.card : "transparent",
                  borderColor: isCurrent ? color : colors.border,
                  borderRadius: colors.radius,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.tierHeader}>
                <View style={styles.tierLeft}>
                  <View style={[styles.tierDot, { backgroundColor: color }]} />
                  <Text style={[styles.tierName, { color }]}>{MEMBERSHIP_LABELS[tier.level]}</Text>
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: color, borderRadius: 4 }]}>
                      <Text style={[styles.currentBadgeText, { color: colors.background }]}>MEVCUT</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.tierPrice, { color: colors.foreground }]}>{tier.price}</Text>
              </View>

              <View style={[styles.tokenRow, { backgroundColor: `${color}12`, borderRadius: 4 }]}>
                <Feather name="cpu" size={11} color={color} />
                <Text style={[styles.tokenText, { color }]}>{tier.tokens}</Text>
              </View>

              <View style={styles.perks}>
                {tier.perks.filter(p => !p.includes("token")).map((perk, i) => (
                  <View key={i} style={styles.perkRow}>
                    <Feather name="check" size={12} color={color} />
                    <Text style={[styles.perkText, { color: isCurrent ? colors.foreground : colors.mutedForeground }]}>
                      {perk}
                    </Text>
                  </View>
                ))}
              </View>

              {tier.note && (
                <Text style={[styles.note, { color: colors.mutedForeground }]}>{tier.note}</Text>
              )}

              {!isCurrent && tier.level !== 3 && tier.level > user.membershipLevel && (
                <Pressable
                  style={[styles.upgradeBtn, { backgroundColor: "#000", borderRadius: colors.radius - 2 }]}
                  onPress={() => router.push("/subscription")}
                >
                  <Text style={styles.upgradeBtnText}>
                     ile {MEMBERSHIP_LABELS[tier.level]}'e Yükselt
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}

        <Pressable
          style={[styles.legalLink, { borderColor: colors.border, borderRadius: colors.radius }]}
          onPress={() => router.push("/legal")}
        >
          <Feather name="file-text" size={14} color={colors.mutedForeground} />
          <Text style={[styles.legalText, { color: colors.mutedForeground }]}>Kullanım Koşulları · KVKK · Gizlilik</Text>
          <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 16, letterSpacing: 0.2 },
  content: { padding: 20, gap: 12 },
  intro: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 8,
    fontStyle: "italic" as const,
  },
  tierCard: { padding: 18, gap: 12 },
  tierHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tierLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  tierDot: { width: 6, height: 6, borderRadius: 3 },
  tierName: { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase" as const },
  currentBadge: { paddingHorizontal: 6, paddingVertical: 2 },
  currentBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 8, letterSpacing: 1 },
  tierPrice: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  tokenRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 5 },
  tokenText: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 0.3 },
  perks: { gap: 8 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  perkText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  note: { fontFamily: "Inter_400Regular", fontSize: 11, fontStyle: "italic" as const },
  upgradeBtn: { paddingVertical: 13, alignItems: "center", justifyContent: "center", marginTop: 4 },
  upgradeBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, letterSpacing: 0.2, color: "#fff" },
  legalLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  legalText: { fontFamily: "Inter_400Regular", fontSize: 12, flex: 1 },
});
