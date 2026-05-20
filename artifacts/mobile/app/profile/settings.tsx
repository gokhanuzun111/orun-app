import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import React, { type ComponentProps, useState } from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { MEMBERSHIP_LABELS } from "@/constants/data";
import { isRevenueCatSupported, presentCustomerCenter } from "@/services/revenuecat";

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout, user } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [roomInvites, setRoomInvites] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [langNotifs, setLangNotifs] = useState(true);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace("/onboarding" as Href);
  };

  type FeatherName = ComponentProps<typeof Feather>["name"];
  type RowType = "toggle" | "nav" | "destructive";

  type SettingRow = {
    id: string;
    label: string;
    icon: FeatherName;
    type: RowType;
    value?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
    sublabel?: string;
  };

  const sections: { title: string; rows: SettingRow[] }[] = [
    {
      title: "HESAP",
      rows: [
        {
          id: "handle",
          label: "Profili Düzenle",
          icon: "user",
          type: "nav",
          sublabel: "Kullanıcı adı, biyografi",
          onPress: () => {},
        },
        {
          id: "membership",
          label: "Üyelik",
          icon: "award",
          type: "nav",
          sublabel: MEMBERSHIP_LABELS[user.membershipLevel],
          onPress: () => router.push("/profile/membership"),
        },
        ...(isRevenueCatSupported()
          ? [{
              id: "manage-subscription",
              label: "Aboneliği Yönet",
              icon: "credit-card" as FeatherName,
              type: "nav" as RowType,
              sublabel: "İptal, yenileme, fatura geçmişi",
              onPress: async () => {
                try { await presentCustomerCenter(); } catch {}
              },
            }]
          : []),
        {
          id: "delete-account",
          label: "Hesabı Sil",
          icon: "trash-2",
          type: "destructive",
          sublabel: "Hesabını ve tüm verilerini kalıcı olarak siler",
          onPress: () => router.push("/profile/delete-account" as Href),
        },
      ],
    },
    {
      title: "BİLDİRİMLER",
      rows: [
        {
          id: "notifs",
          label: "Anlık bildirimler",
          icon: "bell",
          type: "toggle",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: "roomInvites",
          label: "Oda davetleri",
          icon: "message-circle",
          type: "toggle",
          value: roomInvites,
          onToggle: setRoomInvites,
        },
        {
          id: "aiSuggestions",
          label: "AI önerileri",
          icon: "zap",
          type: "toggle",
          value: aiSuggestions,
          onToggle: setAiSuggestions,
        },
        {
          id: "langNotifs",
          label: "Dil odası hatırlatıcıları",
          icon: "globe",
          type: "toggle",
          value: langNotifs,
          onToggle: setLangNotifs,
          sublabel: "Günlük pratik bildirimleri",
        },
      ],
    },
    {
      title: "TERCIHLER",
      rows: [
        {
          id: "compact",
          label: "Kompakt Akış",
          icon: "align-justify",
          type: "toggle",
          value: compactMode,
          onToggle: setCompactMode,
          sublabel: "Akış'ta daha kısa önizlemeler",
        },
      ],
    },
    {
      title: "DİL",
      rows: [
        {
          id: "lang-en",
          label: "İngilizce Pratik",
          icon: "book-open",
          type: "nav",
          sublabel: "🇬🇧 English",
          onPress: () => router.push("/room/lang-en" as Href),
        },
        {
          id: "lang-it",
          label: "İtalyanca Pratik",
          icon: "book-open",
          type: "nav",
          sublabel: "🇮🇹 Italiano",
          onPress: () => router.push("/room/lang-it" as Href),
        },
        {
          id: "lang-es",
          label: "İspanyolca Pratik",
          icon: "book-open",
          type: "nav",
          sublabel: "🇪🇸 Español",
          onPress: () => router.push("/room/lang-es" as Href),
        },
        {
          id: "lang-de",
          label: "Almanca Pratik",
          icon: "book-open",
          type: "nav",
          sublabel: "🇩🇪 Deutsch",
          onPress: () => router.push("/room/lang-de" as Href),
        },
      ],
    },
    {
      title: "MODERASYONç",
      rows: [
        {
          id: "blocked",
          label: "Engellenen üyeler",
          icon: "slash",
          type: "nav",
          onPress: () => {},
        },
        {
          id: "report",
          label: "Sorun bildir",
          icon: "flag",
          type: "nav",
          onPress: () => {},
        },
      ],
    },
    {
      title: "YASAL",
      rows: [
        {
          id: "privacy",
          label: "Gizlilik politikası",
          icon: "lock",
          type: "nav",
          onPress: () => Linking.openURL(`https://${process.env.EXPO_PUBLIC_DOMAIN}/legal/privacy`),
        },
        {
          id: "terms",
          label: "Kullanım koşulları",
          icon: "file-text",
          type: "nav",
          onPress: () => Linking.openURL(`https://${process.env.EXPO_PUBLIC_DOMAIN}/legal/terms`),
        },
      ],
    },
    {
      title: "",
      rows: [
        {
          id: "signout",
          label: "Çıkış Yap",
          icon: "log-out",
          type: "destructive",
          onPress: handleSignOut,
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Ayarlar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title !== "" && (
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
                {section.title}
              </Text>
            )}
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {section.rows.map((row, ri) => (
                <Pressable
                  key={row.id}
                  onPress={row.type !== "toggle" ? row.onPress : undefined}
                  style={[
                    styles.row,
                    ri < section.rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                    <Feather
                      name={row.icon}
                      size={15}
                      color={row.type === "destructive" ? colors.destructive : colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, { color: row.type === "destructive" ? colors.destructive : colors.foreground }]}>
                      {row.label}
                    </Text>
                    {row.sublabel && (
                      <Text style={[styles.rowSublabel, { color: colors.mutedForeground }]}>
                        {row.sublabel}
                      </Text>
                    )}
                  </View>
                  {row.type === "toggle" && (
                    <Switch
                      value={row.value}
                      onValueChange={row.onToggle}
                      trackColor={{ false: colors.muted, true: colors.primary }}
                      thumbColor={colors.foreground}
                    />
                  )}
                  {row.type === "nav" && (
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <Text style={[styles.version, { color: colors.mutedForeground }]}>ORUN 1.0.0</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 24 },
  section: { gap: 8 },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  card: { borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  iconBox: { width: 32, height: 32, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  rowText: { flex: 1, gap: 2 },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 14 },
  rowSublabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  version: { fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center", letterSpacing: 1, marginTop: 8 },
});
