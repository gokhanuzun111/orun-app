import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MembershipBadge } from "@/components/MembershipBadge";
import { CLUBS, INTERESTS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const joinedClubs = CLUBS.filter(c => user.joinedClubs.includes(c.id));
  const interests = INTERESTS.filter(i => user.interests.includes(i.id));

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const membershipDescriptions = [
    "Sınırlı erişim. Odalara katılmak için yükseltme yapın.",
    "Herkese açık odalara, kulüplere ve Akış'a tam erişim.",
    "Premium odalar, gelişmiş eşleştirme ve erken erişim.",
    "Seçilmiş etkinlikler, öncelikli AI eşleştirme ve Rezerv odaları.",
    "Yalnızca davet ile. ORUN üyeliğinin en yüksek kademesi.",
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Text style={[styles.wordmark, { color: colors.foreground }]}>PROFİL</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/profile/settings");
          }}
          style={styles.iconBtn}
        >
          <Feather name="settings" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.avatarInitial, { color: colors.primary }]}>
              {user.handle.replace("@", "").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.handleRow}>
              <Text style={[styles.handle, { color: colors.foreground }]}>{user.handle}</Text>
              <MembershipBadge level={user.membershipLevel} size="md" />
            </View>
            {user.bio && (
              <Text style={[styles.bio, { color: colors.mutedForeground }]}>{user.bio}</Text>
            )}
            <Text style={[styles.memberSince, { color: colors.mutedForeground }]}>
              {user.memberSince}'den beri üye
            </Text>
          </View>
        </View>

        <View style={[styles.statsRow, { borderColor: colors.border }]}>
          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: colors.foreground }]}>{joinedClubs.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Kulüp</Text>
          </View>
          <View style={[styles.statSep, { backgroundColor: colors.border }]} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: colors.foreground }]}>{user.reputation}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>İtibar</Text>
          </View>
          <View style={[styles.statSep, { backgroundColor: colors.border }]} />
          <View style={styles.statBlock}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{user.membershipLevel}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Kademe</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ÜYELİK</Text>
          <Pressable
            onPress={() => router.push("/profile/membership")}
            style={[styles.membershipCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
          >
            <View style={{ flex: 1 }}>
              <MembershipBadge level={user.membershipLevel} size="md" />
              <Text style={[styles.membershipDesc, { color: colors.mutedForeground }]}>
                {membershipDescriptions[user.membershipLevel]}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {joinedClubs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>KULÜPLERİM</Text>
            <View style={styles.clubsList}>
              {joinedClubs.map(club => (
                <View key={club.id} style={[styles.clubRow, { borderColor: colors.border }]}>
                  <View style={[styles.clubDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.clubName, { color: colors.foreground }]}>{club.name}</Text>
                  <Text style={[styles.clubCount, { color: colors.mutedForeground }]}>
                    {club.memberCount.toLocaleString("tr-TR")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>İLGİ ALANLARI</Text>
            <View style={styles.interestChips}>
              {interests.map(interest => (
                <View
                  key={interest.id}
                  style={[styles.interestChip, { borderColor: colors.border, borderRadius: 6 }]}
                >
                  <Text style={[styles.interestLabel, { color: colors.mutedForeground }]}>
                    {interest.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.aiSectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>AI KİŞİLİK ANALİZİ</Text>
            <View style={[styles.aiPoweredBadge, { backgroundColor: colors.muted, borderRadius: 4 }]}>
              <Feather name="cpu" size={9} color={colors.primary} />
              <Text style={[styles.aiPoweredText, { color: colors.primary }]}>ORUN AI</Text>
            </View>
          </View>
          <View style={[styles.aiSummaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.aiSummaryText, { color: colors.foreground }]}>
              "{user.handle.replace("@", "")} konuşmalarında analitik bir bakış açısı sergiliyor. Derin tartışmalara yatkınlığı ve fikir alışverişine verdiği önem, onu Odalar'da değerli bir katılımcı yapıyor."
            </Text>
            <View style={[styles.aiSummaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.aiTraitRow}>
              {["Analitik", "Meraklı", "Derinlemesine"].map(trait => (
                <View key={trait} style={[styles.aiTrait, { borderColor: colors.primary }]}>
                  <Text style={[styles.aiTraitText, { color: colors.primary }]}>{trait}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.aiDisclaimer, { color: colors.mutedForeground }]}>
              Odaların katılım geçmişine göre oluşturulmuştur
            </Text>
          </View>
        </View>
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
  wordmark: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 4 },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  scrollContent: { gap: 0 },
  heroSection: { paddingHorizontal: 24, paddingBottom: 24, flexDirection: "row", gap: 16, alignItems: "flex-start" },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitial: { fontFamily: "Inter_700Bold", fontSize: 26 },
  userInfo: { flex: 1, gap: 8 },
  handleRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" as const },
  handle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  bio: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
  memberSince: { fontFamily: "Inter_400Regular", fontSize: 11 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  statBlock: { flex: 1, alignItems: "center", paddingVertical: 16, gap: 4 },
  statNum: { fontFamily: "Inter_700Bold", fontSize: 20 },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.3 },
  statSep: { width: 1, marginVertical: 12 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  membershipCard: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    gap: 12,
  },
  membershipDesc: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 18, marginTop: 8 },
  clubsList: { gap: 0 },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  clubDot: { width: 5, height: 5, borderRadius: 3 },
  clubName: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  clubCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
  interestChips: { flexDirection: "row", flexWrap: "wrap" as const, gap: 8 },
  interestChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  interestLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  aiSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  aiPoweredBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3 },
  aiPoweredText: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1 },
  aiSummaryCard: { padding: 16, borderWidth: 1, gap: 12 },
  aiSummaryText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 21, fontStyle: "italic" as const },
  aiSummaryDivider: { height: 1 },
  aiTraitRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" as const },
  aiTrait: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderRadius: 4 },
  aiTraitText: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.5 },
  aiDisclaimer: { fontFamily: "Inter_400Regular", fontSize: 10, letterSpacing: 0.3 },
});
