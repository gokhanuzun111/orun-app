import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface Tier {
  id: string;
  label: string;
  price: string | null;
  period: string;
  tag: string | null;
  features: string[];
  cta: string;
  locked: boolean;
  highlight: boolean;
}

const TIERS: Tier[] = [
  {
    id: "aday",
    label: "ADAY",
    price: "Ücretsiz",
    period: "",
    tag: "Mevcut Plan",
    features: [
      "1 kulübe erişim",
      "250 AI token / ay",
      "Oda okuma erişimi",
      "Bekleme listesine katılım",
    ],
    cta: "Mevcut Plan",
    locked: false,
    highlight: false,
  },
  {
    id: "uye",
    label: "ÜYE",
    price: "₺199",
    period: "/ay",
    tag: "Popüler",
    features: [
      "3 kulübe tam erişim",
      "5.000 AI token / ay",
      "Özel AI asistan",
      "Etkinlik RSVP önceliği",
      "Üye rozeti",
    ],
    cta: "ÜYE Ol",
    locked: false,
    highlight: true,
  },
  {
    id: "aktif",
    label: "MÜDAVİM",
    price: "₺349",
    period: "/ay",
    tag: null,
    features: [
      "8 kulübe tam erişim",
      "20.000 AI token / ay",
      "AI kişiselleştirme",
      "Özel oda oluşturma",
      "Öncelikli destek",
      "MÜDAVİM rozeti",
    ],
    cta: "MÜDAVİM Ol",
    locked: false,
    highlight: false,
  },
  {
    id: "seckin",
    label: "SEÇKİN",
    price: null,
    period: "",
    tag: "Yalnızca Davet",
    features: [
      "Tüm kulüplere erişim",
      "100.000 AI token / ay",
      "Özel etkinlik davetleri",
    ],
    cta: "Daveti Bekle",
    locked: true,
    highlight: false,
  },
];

export default function SubscriptionScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string>("uye");
  const [loading, setLoading] = useState(false);

  const topPadding = Platform.OS === "web" ? 56 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubscribe = async (tier: Tier) => {
    if (tier.locked || tier.id === "aday") return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    router.back();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPadding + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={18} color={colors.mutedForeground} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>ÜYELİK</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPadding + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            ORUN'un tüm{"\n"}ayrıcalıklarına erişin.
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            Seçilmiş topluluklara katılın, AI moderatörden öğrenin ve ağınızı derinleştirin.
          </Text>
        </View>

        <View style={styles.tiersCol}>
          {TIERS.map(tier => {
            const isSelected = selected === tier.id;
            return (
              <Pressable
                key={tier.id}
                onPress={() => { if (!tier.locked) setSelected(tier.id); }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: tier.highlight
                      ? colors.primary
                      : colors.card,
                    borderColor: isSelected
                      ? (tier.highlight ? "rgba(255,255,255,0.5)" : colors.primary)
                      : (tier.highlight ? "transparent" : colors.border),
                    opacity: pressed ? 0.92 : 1,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardTopLeft}>
                    <Text
                      style={[
                        styles.cardLabel,
                        { color: tier.highlight ? "rgba(255,255,255,0.85)" : colors.mutedForeground },
                      ]}
                    >
                      {tier.label}
                    </Text>
                    {tier.price !== null ? (
                      <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: tier.highlight ? "#fff" : colors.foreground }]}>
                          {tier.price}
                        </Text>
                        {tier.period ? (
                          <Text style={[styles.period, { color: tier.highlight ? "rgba(255,255,255,0.65)" : colors.mutedForeground }]}>
                            {tier.period}
                          </Text>
                        ) : null}
                      </View>
                    ) : (
                      <Text style={[styles.price, { color: colors.mutedForeground }]}>—</Text>
                    )}
                  </View>
                  {tier.tag && (
                    <View
                      style={[
                        styles.tagBadge,
                        {
                          backgroundColor: tier.highlight
                            ? "rgba(255,255,255,0.18)"
                            : tier.locked
                            ? colors.muted
                            : `${colors.primary}22`,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: tier.highlight
                              ? "#fff"
                              : tier.locked
                              ? colors.mutedForeground
                              : colors.primary,
                          },
                        ]}
                      >
                        {tier.tag}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.featureList}>
                  {tier.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Feather
                        name={tier.locked ? "lock" : "check"}
                        size={11}
                        color={
                          tier.locked
                            ? colors.mutedForeground
                            : tier.highlight
                            ? "rgba(255,255,255,0.75)"
                            : colors.primary
                        }
                      />
                      <Text
                        style={[
                          styles.featureText,
                          {
                            color: tier.locked
                              ? colors.mutedForeground
                              : tier.highlight
                              ? "rgba(255,255,255,0.85)"
                              : colors.foreground,
                          },
                        ]}
                      >
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>

                {isSelected && !tier.locked && tier.id !== "aday" && (
                  <Pressable
                    onPress={() => handleSubscribe(tier)}
                    style={[
                      styles.ctaBtn,
                      {
                        backgroundColor: tier.highlight ? "#fff" : colors.primary,
                        borderRadius: colors.radius,
                      },
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator
                        size="small"
                        color={tier.highlight ? colors.primary : colors.primaryForeground}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.ctaText,
                          { color: tier.highlight ? colors.primary : colors.primaryForeground },
                        ]}
                      >
                        {tier.cta}
                      </Text>
                    )}
                  </Pressable>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.legal, { color: colors.mutedForeground }]}>
          Abonelik App Store üzerinden yönetilir. İstediğiniz zaman iptal edebilirsiniz.
          Fiyatlar KDV dahildir.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  heroSection: { gap: 10 },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  tiersCol: { gap: 12 },
  card: {
    borderRadius: 14,
    padding: 18,
    gap: 14,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTopLeft: { gap: 4 },
  cardLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  price: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  period: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  tagBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  featureList: { gap: 8 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  ctaBtn: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  legal: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 17,
  },
});
