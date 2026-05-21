import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoomCard } from "@/components/RoomCard";
import { CLUBS, ROOMS, LANGUAGE_CONFIG, MASTER_ANNOUNCEMENTS, WEEKLY_SUMMARY } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const WAITING_DAYS = 7;

function daysSince(isoDate: string): number {
  const joined = new Date(isoDate).getTime();
  return Math.floor((Date.now() - joined) / (1000 * 60 * 60 * 24));
}

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, joinClub, leaveClub, joinWaitlist, leaveWaitlist, isOnWaitlist } = useApp();

  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [waitlistJustJoined, setWaitlistJustJoined] = useState(false);

  const club = CLUBS.find(c => c.id === id);
  const clubRooms = ROOMS.filter(r => r.clubId === id);
  const isJoined = user.joinedClubs.includes(id ?? "");
  const onWaitlist = isOnWaitlist(id ?? "");
  const isLanguageClub = id === "languages";
  const isFull = (club?.memberCount ?? 0) >= (club?.capacity ?? 2000);
  const spotsLeft = (club?.capacity ?? 2000) - (club?.memberCount ?? 0);
  const fillRatio = (club?.memberCount ?? 0) / (club?.capacity ?? 2000);

  const isMasterClub = id === "master";
  const joinDateStr = isJoined ? (user.clubJoinDates?.[id ?? ""] ?? null) : null;
  const daysElapsed = joinDateStr ? Math.max(0, Math.min(WAITING_DAYS, daysSince(joinDateStr))) : 0;
  const waitDaysLeft = WAITING_DAYS - daysElapsed;
  const roomsUnlocked = daysElapsed >= WAITING_DAYS;
  const showWaitBanner = isJoined && !isMasterClub && !isLanguageClub;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  if (!club) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Kulüp bulunamadı</Text>
      </View>
    );
  }

  const handleLeave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    leaveClub(id!);
  };

  const handleJoinAttempt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFull) {
      setShowEmailForm(true);
    } else {
      joinClub(id!);
    }
  };

  const handleWaitlistSubmit = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setEmailError("E-posta adresi gerekli");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Geçerli bir e-posta girin");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    joinWaitlist(id!, trimmed);
    setEmailInput("");
    setEmailError("");
    setShowEmailForm(false);
    setWaitlistJustJoined(true);
  };

  const handleLeaveWaitlist = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    leaveWaitlist(id!);
    setWaitlistJustJoined(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        {isJoined ? (
          <Pressable
            testID="leave-club-btn"
            onPress={handleLeave}
            style={[styles.navBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
          >
            <Text style={[styles.navBtnText, { color: colors.mutedForeground }]}>Ayrıl</Text>
          </Pressable>
        ) : onWaitlist ? (
          <Pressable
            onPress={handleLeaveWaitlist}
            style={[styles.navBtn, { borderColor: colors.primary, borderRadius: colors.radius }]}
          >
            <View style={styles.waitlistNavRow}>
              <View style={[styles.waitlistNavDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.navBtnText, { color: colors.primary }]}>Sıradayım</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            testID="join-club-btn"
            onPress={handleJoinAttempt}
            style={[
              styles.navBtn,
              {
                backgroundColor: isFull ? "transparent" : colors.foreground,
                borderColor: isFull ? colors.border : colors.foreground,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.navBtnText, { color: isFull ? colors.mutedForeground : colors.background }]}>
              {isFull ? "Sıraya Gir" : "Katıl"}
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <Text style={[styles.clubName, { color: colors.foreground }]}>{club.name}</Text>
          <Text style={[styles.clubDescription, { color: colors.mutedForeground }]}>
            {club.description}
          </Text>

          {isLanguageClub && (
            <View style={styles.langFlags}>
              {Object.values(LANGUAGE_CONFIG).map(lc => (
                <View key={lc.nativeName} style={[styles.langBadge, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 8 }]}>
                  <Text style={styles.langFlagEmoji}>{lc.flag}</Text>
                  <Text style={[styles.langBadgeName, { color: colors.foreground }]}>{lc.name}</Text>
                  <Text style={[styles.langBadgeLevel, { color: colors.mutedForeground }]}>{lc.level}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {club.memberCount.toLocaleString("tr-TR")}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Aktif Üye</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: isFull ? colors.primary : colors.foreground }]}>
                {isFull ? club.waitlistCount.toLocaleString("tr-TR") : spotsLeft.toLocaleString("tr-TR")}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {isFull ? "Bekleme" : "Boş Yer"}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{club.activeRooms}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Aktif Oda</Text>
            </View>
          </View>

          <View style={[styles.capacitySection, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.capacityHeader}>
              <Text style={[styles.capacityLabel, { color: colors.mutedForeground }]}>KAPASİTE</Text>
              <Text style={[styles.capacityFraction, { color: isFull ? colors.primary : colors.foreground }]}>
                {club.memberCount.toLocaleString("tr-TR")} / {club.capacity.toLocaleString("tr-TR")}
              </Text>
            </View>
            <View style={[styles.capacityBarBg, { backgroundColor: colors.muted }]}>
              <Animated.View
                style={[
                  styles.capacityBarFill,
                  {
                    backgroundColor: isFull ? colors.primary : colors.primary,
                    width: `${Math.min(100, fillRatio * 100)}%` as `${number}%`,
                    opacity: isFull ? 1 : 0.5,
                  },
                ]}
              />
            </View>
            {isFull ? (
              <Text style={[styles.capacityNote, { color: colors.mutedForeground }]}>
                Kulüp doldu. Üye ayrıldığında {club.waitlistCount > 0 ? "sıradaki kişi" : "ilk başvuran"} e-posta ile bilgilendirilir.
              </Text>
            ) : (
              <Text style={[styles.capacityNote, { color: colors.mutedForeground }]}>
                {spotsLeft.toLocaleString("tr-TR")} yer açık — hemen katılabilirsiniz.
              </Text>
            )}
          </View>
        </View>

        {isFull && !isJoined && !onWaitlist && showEmailForm && (
          <View style={[styles.emailSection, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.emailHeader}>
              <Feather name="mail" size={14} color={colors.primary} />
              <Text style={[styles.emailTitle, { color: colors.foreground }]}>Bekleme Listesine Gir</Text>
            </View>
            <Text style={[styles.emailDesc, { color: colors.mutedForeground }]}>
              Yer açıldığında sizi anında bilgilendireceğiz. Sıranız geldiğinde 48 saat içinde kabul etmeniz gerekir.
            </Text>
            <View style={[styles.emailInputWrap, { backgroundColor: colors.background, borderColor: emailError ? "#8B3A3A" : colors.border, borderRadius: colors.radius }]}>
              <TextInput
                value={emailInput}
                onChangeText={text => { setEmailInput(text); setEmailError(""); }}
                placeholder="ornek@mail.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.emailInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
                testID="waitlist-email-input"
              />
            </View>
            {emailError ? (
              <Text style={styles.emailErrorText}>{emailError}</Text>
            ) : null}
            <View style={styles.emailActions}>
              <Pressable
                onPress={() => { setShowEmailForm(false); setEmailError(""); }}
                style={[styles.emailCancelBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <Text style={[styles.emailCancelText, { color: colors.mutedForeground }]}>Vazgeç</Text>
              </Pressable>
              <Pressable
                onPress={handleWaitlistSubmit}
                style={[styles.emailSubmitBtn, { backgroundColor: colors.foreground, borderRadius: colors.radius }]}
                testID="waitlist-submit-btn"
              >
                <Text style={[styles.emailSubmitText, { color: colors.background }]}>Sıraya Gir</Text>
              </Pressable>
            </View>
          </View>
        )}

        {(onWaitlist || waitlistJustJoined) && !isJoined && (
          <View style={[styles.waitlistConfirm, { backgroundColor: colors.card, borderColor: colors.primary, borderRadius: colors.radius }]}>
            <View style={styles.waitlistConfirmHeader}>
              <View style={[styles.waitlistConfirmDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.waitlistConfirmTitle, { color: colors.primary }]}>BEKLEME LİSTESİNDESİNİZ</Text>
            </View>
            <Text style={[styles.waitlistConfirmBody, { color: colors.mutedForeground }]}>
              Yer açıldığında kayıtlı e-posta adresinize bildirim gönderilecek. Sıranız geldiğinde 48 saat içinde katılımı onaylamanız gerekiyor.
            </Text>
            {club.waitlistCount > 0 && (
              <Text style={[styles.waitlistPosition, { color: colors.foreground }]}>
                Yaklaşık sıra: #{(club.waitlistCount + 1).toLocaleString("tr-TR")}
              </Text>
            )}
            <Pressable onPress={handleLeaveWaitlist} style={styles.leaveWaitlistBtn}>
              <Text style={[styles.leaveWaitlistText, { color: colors.mutedForeground }]}>
                Listeden çık
              </Text>
            </Pressable>
          </View>
        )}

        {showWaitBanner && (
          roomsUnlocked ? (
            <View style={[styles.accessBanner, { backgroundColor: "#0F2B1A", borderColor: "#2E7D4F", borderRadius: colors.radius }]}>
              <View style={styles.accessBannerHeader}>
                <Feather name="check-circle" size={14} color="#4CAF7D" />
                <Text style={[styles.accessBannerTitle, { color: "#4CAF7D" }]}>ODALAR AÇILDI</Text>
              </View>
              <Text style={[styles.accessBannerBody, { color: "#7ABFA0" }]}>
                7 günlük bekleme süresi tamamlandı. Artık tüm odalara katılabilirsiniz.
              </Text>
            </View>
          ) : (
            <View style={[styles.waitBanner, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={styles.waitBannerHeader}>
                <Feather name="clock" size={13} color={colors.mutedForeground} />
                <Text style={[styles.waitBannerLabel, { color: colors.mutedForeground }]}>ODA ERİŞİMİ</Text>
              </View>
              <Text style={[styles.waitBannerTitle, { color: colors.foreground }]}>
                {waitDaysLeft === 1 ? "1 gün sonra" : `${waitDaysLeft} gün sonra`} odalara erişebilirsiniz
              </Text>
              <View style={styles.waitProgressRow}>
                <View style={[styles.waitProgressBg, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      styles.waitProgressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${(daysElapsed / WAITING_DAYS) * 100}%` as `${number}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.waitProgressLabel, { color: colors.mutedForeground }]}>
                  {daysElapsed}/{WAITING_DAYS}
                </Text>
              </View>
              <Text style={[styles.waitBannerNote, { color: colors.mutedForeground }]}>
                Üyeliğinizi pekiştirmek için 7 günlük bekleme süresi uygulanır.
              </Text>
            </View>
          )
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {isMasterClub && (
          <>
            <View style={styles.masterSection}>
              <View style={styles.sectionHeader}>
                <Feather name="bookmark" size={11} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>DUYURULAR</Text>
              </View>
              {MASTER_ANNOUNCEMENTS.map(ann => (
                <View
                  key={ann.id}
                  style={[
                    styles.announcementCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: ann.isPinned ? colors.primary : colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  {ann.isPinned && (
                    <View style={styles.pinnedRow}>
                      <Feather name="bookmark" size={10} color={colors.primary} />
                      <Text style={[styles.pinnedLabel, { color: colors.primary }]}>SABİTLENDİ</Text>
                    </View>
                  )}
                  <Text style={[styles.announcementTitle, { color: colors.foreground }]}>{ann.title}</Text>
                  <Text style={[styles.announcementBody, { color: colors.mutedForeground }]}>{ann.body}</Text>
                  <Text style={[styles.announcementDate, { color: colors.mutedForeground }]}>{ann.date}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.masterSection}>
              <View style={styles.sectionHeader}>
                <Feather name="trending-up" size={11} color={colors.mutedForeground} />
                <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>HAFTALIK ÖZET</Text>
              </View>
              <View style={[styles.weeklySummaryCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={[styles.weeklySummaryLabel, { color: colors.mutedForeground }]}>
                  Bu haftanın en aktif tartışmaları
                </Text>
                {WEEKLY_SUMMARY.map((item, index) => (
                  <View key={item.clubId} style={[styles.weeklyItem, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                    <View style={styles.weeklyRank}>
                      <Text style={[styles.weeklyRankNum, { color: index === 0 ? colors.primary : colors.mutedForeground }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.weeklyContent}>
                      <Text style={[styles.weeklyClubName, { color: colors.primary }]}>{item.clubName}</Text>
                      <Text style={[styles.weeklyTopic, { color: colors.foreground }]} numberOfLines={2}>
                        {item.topic}
                      </Text>
                    </View>
                    <Text style={[styles.weeklyReplies, { color: colors.mutedForeground }]}>
                      {item.replyCount}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </>
        )}

        {clubRooms.length > 0 && (
          <View style={styles.roomsSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>AKTİF ODALAR</Text>
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
            </View>
            {clubRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.aiSection}>
          <View style={styles.sectionHeader}>
            <View style={[styles.aiDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.aiLabel, { color: colors.primary }]}>ORUN GÖRÜŞÜ</Text>
          </View>
          <Text style={[styles.aiText, { color: colors.mutedForeground }]}>
            {isLanguageClub
              ? "Dil Odaları haftanın her günü 07:00 – 23:00 arasında aktif. AI asistan anlık gramer düzeltmeleri, kelime önerileri ve kültürel bağlam sağlıyor. Günde 20 dakika pratik, 3 ayda akıcılık hedefi için yeterli."
              : "Bu kulüp hafta içi 20:00 – 23:00 arasında en aktif dönemini yaşıyor. Üyeler genellikle bilgili, yanıtlarında ölçülü ve nadiren çatışmacı. Derinliğin genişliğe tercih edildiği iyi bir ortam."}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  navBtn: {
    paddingHorizontal: 18,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  navBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, letterSpacing: 0.3 },
  waitlistNavRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  waitlistNavDot: { width: 5, height: 5, borderRadius: 3 },
  scrollContent: { gap: 0 },
  heroSection: { paddingHorizontal: 24, paddingBottom: 20, gap: 14 },
  clubName: { fontFamily: "Inter_700Bold", fontSize: 30, letterSpacing: 0.2 },
  clubDescription: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 23 },
  langFlags: { flexDirection: "row", flexWrap: "wrap" as const, gap: 8 },
  langBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  langFlagEmoji: { fontSize: 16 },
  langBadgeName: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  langBadgeLevel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  stats: { flexDirection: "row", gap: 0 },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.3 },
  statDivider: { width: 1, height: 36, alignSelf: "center" },
  capacitySection: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  capacityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  capacityLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  capacityFraction: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  capacityBarBg: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  capacityBarFill: {
    height: 3,
    borderRadius: 2,
  },
  capacityNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  emailSection: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emailTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  emailDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  emailInputWrap: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emailInput: {
    fontSize: 14,
    lineHeight: 20,
  },
  emailErrorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#8B3A3A",
    marginTop: -4,
  },
  emailActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  emailCancelBtn: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emailCancelText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  emailSubmitBtn: {
    flex: 2,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  emailSubmitText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  waitlistConfirm: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  waitlistConfirmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waitlistConfirmDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  waitlistConfirmTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  waitlistConfirmBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  waitlistPosition: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  leaveWaitlistBtn: {
    paddingTop: 4,
  },
  leaveWaitlistText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textDecorationLine: "underline" as const,
  },
  divider: { height: 1, marginVertical: 20 },
  roomsSection: { paddingHorizontal: 16, gap: 0 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  activeDot: { width: 5, height: 5, borderRadius: 3 },
  aiSection: { paddingHorizontal: 24, paddingBottom: 8, gap: 12 },
  aiDot: { width: 5, height: 5, borderRadius: 3 },
  aiLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  aiText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 21,
    fontStyle: "italic" as const,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 100,
  },
  waitBanner: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  waitBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  waitBannerLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  waitBannerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
  },
  waitProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waitProgressBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  waitProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  waitProgressLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    minWidth: 28,
    textAlign: "right",
  },
  waitBannerNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  accessBanner: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 18,
    borderWidth: 1,
    gap: 8,
  },
  masterSection: { paddingHorizontal: 16, gap: 0 },
  announcementCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  pinnedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pinnedLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  announcementTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
  },
  announcementBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  announcementDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    letterSpacing: 0.2,
  },
  eventCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  eventTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
  },
  eventDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  eventMeta: { gap: 6 },
  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  eventMetaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    flex: 1,
  },
  eventAttendees: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  eventRsvpRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  rsvpBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  rsvpBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  weeklySummaryCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 0,
  },
  weeklySummaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 12,
  },
  weeklyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },
  weeklyRank: {
    width: 20,
    alignItems: "center",
    paddingTop: 2,
  },
  weeklyRankNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  weeklyContent: {
    flex: 1,
    gap: 3,
  },
  weeklyClubName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  weeklyTopic: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  weeklyReplies: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    paddingTop: 2,
  },
  accessBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  accessBannerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  accessBannerBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
});
