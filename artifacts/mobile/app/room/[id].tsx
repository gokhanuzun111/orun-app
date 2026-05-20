import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MessageBubble } from "@/components/MessageBubble";
import { LanguageAssistant } from "@/components/LanguageAssistant";
import { PrivateAIPanel } from "@/components/PrivateAIPanel";
import { ReportModal } from "@/components/ReportModal";
import { ActiveParticipantsPanel, generateParticipants } from "@/components/ActiveParticipantsPanel";
import {
  ROOMS,
  ROOM_MESSAGES_MAP,
  CLUB_MESSAGE_CATEGORY,
  LANGUAGE_AI_MESSAGES,
  LANGUAGE_CONFIG,
  type Message,
} from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { checkRoomAccess } from "@/hooks/useRoomAccess";
import { useMessageLimits } from "@/hooks/useMessageLimits";

const FAKE_HANDLES = [
  "Ahmet", "Mehmet", "Burak", "Selin", "Zeynep", "Kaan", "Deniz",
  "Emre", "Gizem", "Berk", "Pınar", "Arda", "Merve", "Onur", "Alara",
];

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const room = ROOMS.find(r => r.id === id);
  const isLangRoom = room?.isLanguageRoom === true;
  const langKey = room?.targetLanguage ?? "en";
  const langConfig = LANGUAGE_CONFIG[langKey];

  const clubId = room?.clubId ?? "master";
  const msgCategory = CLUB_MESSAGE_CATEGORY[clubId] ?? "general";
  const initialMessages: Message[] = isLangRoom
    ? (LANGUAGE_AI_MESSAGES[langKey] ?? [])
    : (ROOM_MESSAGES_MAP[msgCategory] ?? ROOM_MESSAGES_MAP.general);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [showAssistant, setShowAssistant] = useState(isLangRoom);
  const [showPrivateAI, setShowPrivateAI] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [bypassGate, setBypassGate] = useState(false);
  const [slotOpenedBanner, setSlotOpenedBanner] = useState(false);

  const [liveCount, setLiveCount] = useState(room?.memberCount ?? 0);
  const [recentlyJoined, setRecentlyJoined] = useState<string | null>(null);
  const [recentlyLeft, setRecentlyLeft] = useState<string | null>(null);
  const [participants, setParticipants] = useState(() =>
    generateParticipants(room?.memberCount ?? 0, Math.floor(Math.random() * 50))
  );

  const presenceFlash = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);

  const [reportVisible, setReportVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ handle: string; content: string } | null>(null);

  const { chatRemaining, aiRemaining, tokensRemaining, canChat, canAsk, recordChat, recordAI } =
    useMessageLimits(user.membershipLevel);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (!room) return;
    const maxCap = room.maxCapacity;
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const isFull = prev >= maxCap;
        const shouldLeave = isFull || (prev > 5 && Math.random() < 0.4);
        if (shouldLeave) {
          const name = FAKE_HANDLES[Math.floor(Math.random() * FAKE_HANDLES.length)];
          setRecentlyLeft(name);
          setRecentlyJoined(null);
          setParticipants(old => old.filter((_, i) => i !== 0));
          animatePresence();
          setTimeout(() => setRecentlyLeft(null), 3500);
          return Math.max(0, prev - 1);
        } else {
          const name = FAKE_HANDLES[Math.floor(Math.random() * FAKE_HANDLES.length)];
          setRecentlyJoined(name);
          setRecentlyLeft(null);
          setParticipants(old => [
            {
              id: `live-${Date.now()}`,
              handle: `@${name.toLowerCase().replace(/[^a-z]/g, "")}${Math.floor(Math.random() * 99) + 1}`,
              name,
              membershipLevel: ([1, 2, 3] as const)[Math.floor(Math.random() * 3)],
              joinedMinutesAgo: 0,
            },
            ...old,
          ]);
          animatePresence();
          setTimeout(() => setRecentlyJoined(null), 3500);
          return Math.min(maxCap, prev + 1);
        }
      });
    }, __DEV__ ? 1500 : 6000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [room?.id]);

  useEffect(() => {
    if (!room) return;
    if (
      room.memberCount >= room.maxCapacity &&
      liveCount < room.maxCapacity &&
      !slotOpenedBanner
    ) {
      setSlotOpenedBanner(true);
      if (notifyRequested) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [liveCount, notifyRequested]);

  useEffect(() => {
    setParticipants(prev => {
      if (prev.length > liveCount) return prev.slice(0, liveCount);
      return prev;
    });
  }, [liveCount]);

  function animatePresence() {
    Animated.sequence([
      Animated.timing(presenceFlash, { toValue: 0.4, duration: 180, useNativeDriver: true }),
      Animated.timing(presenceFlash, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }

  const handleSend = (text?: string) => {
    const content = (text ?? inputText).trim();
    if (!content) return;
    if (!canChat) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMsg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      author: user.handle.replace("@", ""),
      handle: user.handle,
      content,
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      membershipLevel: user.membershipLevel,
    };
    setMessages(prev => [newMsg, ...prev]);
    if (!text) setInputText("");
    recordChat();

    if (isLangRoom) {
      setTimeout(() => {
        const aiReply = generateAIReply(content, langKey);
        const aiMsg: Message = {
          id: Date.now().toString() + "-ai",
          author: "ORUN Dil AI",
          handle: "@orun.dil",
          content: aiReply,
          timestamp: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          membershipLevel: 3,
          isAI: true,
        };
        setMessages(prev => [aiMsg, ...prev]);
      }, 1200);
    }
  };

  if (!room) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Oda bulunamadı</Text>
      </View>
    );
  }

  const access = checkRoomAccess(room, user);

  if (!access.allowed && !(access.reason === "room_full" && bypassGate)) {
    const isRoomFull = access.reason === "room_full";
    const showSlotBanner = isRoomFull && liveCount < room.maxCapacity;

    const gateConfig =
      access.reason === "not_member"
        ? {
            icon: "user-x" as const,
            title: "Kulüp Üyesi Değilsiniz",
            subtitle: "Bu odaya girmek için önce ilgili kulübe katılmanız gerekiyor.",
            detail: `${room.clubName} kulübüne katıldıktan 7 gün sonra tüm odalara erişebilirsiniz.`,
            badge: null,
          }
        : access.reason === "too_new"
        ? {
            icon: "clock" as const,
            title: "Bekleme Süresi",
            subtitle: "Kaliteli tartışma için yeni üyeler bir bekleme süresine tabidir.",
            detail:
              "Kulübe yeni katılanların odalara erişimi 7 gün sonra açılır. Dil odaları ve ORUN genel kanalı bu kuraldan muaftır.",
            badge: access.daysLeft === 1 ? "1 GÜN KALDI" : `${access.daysLeft} GÜN KALDI`,
          }
        : {
            icon: "users" as const,
            title: "Oda Kapasitesi Doldu",
            subtitle: "Bu oda şu an maksimum kapasitede.",
            detail: `Her oda en fazla ${room.maxCapacity} aktif katılımcı alabilir. Yer açılınca uygulama içi bildirim alabilirsiniz.`,
            badge: `${liveCount}/${room.maxCapacity}`,
          };

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.gateHeader,
            {
              paddingTop: topPadding + 8,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.roomName, { color: colors.foreground }]}>{room.name}</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.gateBody}>
          {showSlotBanner && (
            <Pressable
              testID="slot-opened-banner"
              onPress={() => {
                if (liveCount < room.maxCapacity) {
                  setBypassGate(true);
                }
              }}
              style={[styles.slotBanner, { backgroundColor: colors.primary }]}
            >
              <View style={styles.slotBannerContent}>
                <Feather name="unlock" size={14} color={colors.primaryForeground} />
                <Text style={[styles.slotBannerText, { color: colors.primaryForeground }]}>
                  Bir kişilik yer açıldı! Giriş yapmak için dokunun.
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.primaryForeground} />
            </Pressable>
          )}

          <View
            style={[
              styles.gateIconWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name={gateConfig.icon} size={28} color={colors.mutedForeground} />
          </View>

          {gateConfig.badge && (
            <View style={[styles.gateBadge, { backgroundColor: colors.muted }]}>
              <Text
                style={[
                  styles.gateBadgeText,
                  { color: isRoomFull && liveCount >= room.maxCapacity ? "#ef4444" : colors.primary },
                ]}
              >
                {gateConfig.badge}
              </Text>
            </View>
          )}

          <Text style={[styles.gateTitle, { color: colors.foreground }]}>{gateConfig.title}</Text>
          <Text style={[styles.gateSubtitle, { color: colors.mutedForeground }]}>
            {gateConfig.subtitle}
          </Text>

          <View
            style={[
              styles.gateDetailBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.gateDetail, { color: colors.mutedForeground }]}>
              {gateConfig.detail}
            </Text>
          </View>

          {isRoomFull && slotOpenedBanner && (
            <Pressable
              testID="slot-opened-banner"
              onPress={() => {
                if (liveCount >= room.maxCapacity) {
                  setSlotOpenedBanner(false);
                  return;
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setBypassGate(true);
              }}
              style={[
                styles.slotOpenedBanner,
                { backgroundColor: colors.primary },
              ]}
            >
              <Feather name="bell" size={15} color={colors.primaryForeground} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.slotOpenedTitle, { color: colors.primaryForeground }]}>
                  Yer Açıldı!
                </Text>
                <Text style={[styles.slotOpenedSubtitle, { color: colors.primaryForeground }]}>
                  Odaya girebilirsiniz — dokunun.
                </Text>
              </View>
              <Feather name="arrow-right" size={15} color={colors.primaryForeground} />
            </Pressable>
          )}

          <View style={[styles.gateRoomInfo, { borderColor: colors.border }]}>
            <Text style={[styles.gateRoomLabel, { color: colors.mutedForeground }]}>ODA</Text>
            <Text style={[styles.gateRoomName, { color: colors.foreground }]}>{room.name}</Text>
            <Text style={[styles.gateRoomMeta, { color: colors.mutedForeground }]}>
              {liveCount}/{room.maxCapacity} aktif · {room.clubName}
            </Text>
          </View>

          {isRoomFull && (
            <Pressable
              testID="notify-when-space"
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setNotifyRequested(v => !v);
              }}
              style={[
                styles.notifyBtn,
                {
                  backgroundColor: notifyRequested ? colors.primary : colors.card,
                  borderColor: notifyRequested ? colors.primary : colors.border,
                },
              ]}
            >
              <Feather
                name={notifyRequested ? "bell" : "bell"}
                size={15}
                color={notifyRequested ? colors.primaryForeground : colors.foreground}
              />
              <Text
                style={[
                  styles.notifyBtnText,
                  { color: notifyRequested ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {notifyRequested ? "Bildirim Kaydedildi" : "Yer Açılınca Bildir"}
              </Text>
              {notifyRequested && (
                <Feather name="check" size={14} color={colors.primaryForeground} />
              )}
            </Pressable>
          )}

          {notifyRequested && (
            <View style={[styles.notifyConfirm, { backgroundColor: colors.muted, borderRadius: 8 }]}>
              <Text style={[styles.notifyConfirmText, { color: colors.mutedForeground }]}>
                Yer açılınca bu ekranda titreşimli uyarı alacaksınız. Yer açıldı banneri tüm bekleyenlere gösterilir.
              </Text>
            </View>
          )}

          <Pressable
            onPress={() => router.back()}
            style={[
              styles.gateBackBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.gateBackText, { color: colors.foreground }]}>Geri Dön</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isChatLimited = chatRemaining !== null && chatRemaining <= 3;
  const isChatBlocked = !canChat;
  const isFull = liveCount >= room.maxCapacity;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop: topPadding + 8,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </Pressable>
            <View style={styles.headerInfo}>
              <View style={styles.roomTitleRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.roomName, { color: colors.foreground }]}>{room.name}</Text>
                {isLangRoom && (
                  <View
                    style={[styles.langFlag, { backgroundColor: colors.muted, borderRadius: 4 }]}
                  >
                    <Text style={styles.langFlagText}>{langConfig?.flag ?? ""}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.roomMeta, { color: colors.mutedForeground }]}>
                {liveCount} kişi · {room.clubName}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            {isLangRoom && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAssistant(v => !v);
                }}
                style={[
                  styles.actionToggle,
                  {
                    backgroundColor: showAssistant ? colors.primary : colors.muted,
                    borderRadius: 8,
                  },
                ]}
                testID="toggle-assistant"
              >
                <Feather
                  name="cpu"
                  size={14}
                  color={showAssistant ? colors.primaryForeground : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.actionToggleText,
                    { color: showAssistant ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  DİL
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowPrivateAI(v => !v);
              }}
              style={[
                styles.actionToggle,
                {
                  backgroundColor: showPrivateAI ? colors.primary : colors.muted,
                  borderRadius: 8,
                },
              ]}
              testID="toggle-private-ai"
            >
              <Feather
                name="zap"
                size={14}
                color={showPrivateAI ? colors.primaryForeground : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.actionToggleText,
                  { color: showPrivateAI ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                AI
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowParticipants(v => !v);
              }}
              style={styles.menuBtn}
              testID="toggle-participants"
            >
              <Feather
                name="users"
                size={18}
                color={showParticipants ? colors.primary : colors.mutedForeground}
              />
            </Pressable>
            <Pressable style={styles.menuBtn}>
              <Feather name="more-horizontal" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <View
          style={[styles.topicBanner, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={[styles.topicLabel, { color: colors.mutedForeground }]}>KONU</Text>
          <Text style={[styles.topicText, { color: colors.foreground }]} numberOfLines={2}>
            {room.topic}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.presenceStrip,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: presenceFlash,
            },
          ]}
        >
          <View style={styles.presenceAvatars}>
            {Array.from({ length: Math.min(7, liveCount) }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.presenceAvatar,
                  {
                    backgroundColor: i === 0 ? colors.primary : colors.card,
                    borderColor: colors.background,
                    marginLeft: i > 0 ? -8 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.presenceInitial,
                    {
                      color:
                        i === 0 ? colors.primaryForeground : colors.mutedForeground,
                    },
                  ]}
                >
                  {participants[i]?.name.charAt(0) ?? String.fromCharCode(65 + i)}
                </Text>
              </View>
            ))}
            {liveCount > 7 && (
              <View
                style={[
                  styles.presenceAvatar,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.background,
                    marginLeft: -8,
                  },
                ]}
              >
                <Text style={[styles.presenceInitial, { color: colors.mutedForeground, fontSize: 7 }]}>
                  +{liveCount - 7}
                </Text>
              </View>
            )}
          </View>
          <Pressable
            style={styles.presenceMeta}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowParticipants(true);
            }}
          >
            <View style={[styles.presenceLive, { backgroundColor: isFull ? "#ef4444" : colors.primary }]} />
            <Text style={[styles.presenceCount, { color: colors.mutedForeground }]}>
              {liveCount}/{room.maxCapacity} · {room.lastActivity}
            </Text>
            <Feather name="chevron-right" size={11} color={colors.mutedForeground} />
          </Pressable>
        </Animated.View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwn={item.handle === user.handle}
              onLongPress={() => {
                if (item.handle !== user.handle && !item.isAI) {
                  setReportTarget({ handle: item.handle, content: item.content });
                  setReportVisible(true);
                }
              }}
            />
          )}
          inverted
          contentContainerStyle={[styles.messageList, { paddingTop: bottomPadding + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {isLangRoom && showAssistant && (
          <LanguageAssistant
            targetLanguage={langKey as "en" | "it" | "es" | "de"}
            onSendPrompt={text => handleSend(text)}
          />
        )}

        {showPrivateAI && (
          <PrivateAIPanel
            room={room}
            aiRemaining={aiRemaining}
            tokensRemaining={tokensRemaining}
            canAsk={canAsk}
            onRecordAI={recordAI}
            onClose={() => setShowPrivateAI(false)}
            clubMessages={messages.map(m => `${m.author}: ${m.content}`)}
          />
        )}

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingBottom: bottomPadding + 10,
            },
          ]}
        >
          {isChatBlocked ? (
            <View style={[styles.blockedBar, { backgroundColor: colors.muted, borderRadius: 10 }]}>
              <Feather name="moon" size={13} color={colors.mutedForeground} />
              <Text style={[styles.blockedText, { color: colors.mutedForeground }]}>
                Bu ay için mesaj limitinize ulaştınız.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              {isChatLimited && (
                <View style={[styles.limitBadge, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.limitBadgeText, { color: "#ef4444" }]}>
                    {chatRemaining} mesaj
                  </Text>
                </View>
              )}
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={
                  isLangRoom
                    ? `${langConfig?.name ?? ""} veya Türkçe yaz...`
                    : "Konuşmaya katkıda bulun..."
                }
                placeholderTextColor={colors.mutedForeground}
                multiline
                style={[styles.input, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
                testID="room-message-input"
              />
              <Pressable
                onPress={() => handleSend()}
                disabled={!inputText.trim()}
                testID="room-send-btn"
                style={({ pressed }) => [
                  styles.sendBtn,
                  {
                    backgroundColor: inputText.trim() ? colors.primary : colors.muted,
                    borderRadius: 8,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Feather
                  name="arrow-up"
                  size={16}
                  color={inputText.trim() ? colors.primaryForeground : colors.mutedForeground}
                />
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      <ReportModal
        visible={reportVisible}
        onClose={() => { setReportVisible(false); setReportTarget(null); }}
        authorHandle={reportTarget?.handle}
        messagePreview={reportTarget?.content}
      />
      <ActiveParticipantsPanel
        visible={showParticipants}
        onClose={() => setShowParticipants(false)}
        participants={participants}
        totalCount={liveCount}
        maxCapacity={room.maxCapacity}
        recentlyJoined={recentlyJoined}
        recentlyLeft={recentlyLeft}
      />
    </View>
  );
}

function generateAIReply(userMessage: string, lang: string): string {
  const replies: Record<string, string[]> = {
    en: [
      "Harika bir mesaj! Küçük bir önerim: daha doğal bir ifade için 'I would like to...' yerine 'I'd love to...' kullanabilirsiniz. Çok daha akıcı gelir.",
      "Perfect grammar! Bunu duyduğuma sevindim. Bu konuyu genişletmek ister misiniz? Native speakers genellikle bu cümleyi şöyle bitirir...",
      "Good attempt! Bu cümleyi daha natural hale getirmek için şunu deneyin: present perfect tense ile 'I've been thinking about...' şeklinde başlayın.",
      "Excellent! İngilizce'nizde gerçekten ilerleme görüyorum. Bu konuşma kalıbını pekiştirmek için günde 5 dakika pratik yapmanızı öneririm.",
    ],
    it: [
      "Molto bene! Küçük bir düzeltme: bu bağlamda 'sono andato/a' (passato prossimo) kullanmak daha doğal.",
      "Ottimo lavoro! İtalyanca'nızda gerçekten güzel bir akış var. Bir ipucu: İtalyanlar konuşurken çok jest kullanır.",
      "Bravo/Brava! Bu cümle grammatica açısından doğru. Sadece tonlamanıza dikkat edin.",
    ],
    es: [
      "¡Muy bien! Küçük bir not: ser ve estar ayrımına dikkat edin.",
      "¡Excelente! Bu subjuntivo kullanımı mükemmel. İspanyolca öğrenenler için en zor konulardan biri — başardınız!",
      "Perfecto gramaticalmente. Bir ipucu: İspanya İspanyolcası ile Latin Amerika İspanyolcası arasında bazı farklar var.",
    ],
    de: [
      "Sehr gut! Wortstellung'a dikkat: Almanca'da zaman zarfı cümlede ikinci sıraya geldiğinde fiil de yer değiştirir.",
      "Ausgezeichnet! Artikeli doğru kullandınız. der/die/das konusu çok zor — bu başarı gerçekten önemli.",
      "Gut gemacht! Küçük bir düzeltme: bu fiil güçlü bir fiil, düzensiz çekimi var.",
    ],
  };
  const langReplies = replies[lang] ?? replies["en"];
  return langReplies[Math.floor(Math.random() * langReplies.length)];
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  headerInfo: { flex: 1, gap: 3 },
  roomTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  roomName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  langFlag: { paddingHorizontal: 6, paddingVertical: 2 },
  langFlagText: { fontSize: 12 },
  roomMeta: { fontFamily: "Inter_400Regular", fontSize: 11 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionToggleText: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 0.5 },
  menuBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  topicBanner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 3,
  },
  topicLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
  topicText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic" as const,
  },
  presenceStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  presenceAvatars: { flexDirection: "row", alignItems: "center" },
  presenceAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  presenceInitial: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 0.2 },
  presenceMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  presenceLive: { width: 5, height: 5, borderRadius: 3 },
  presenceCount: { fontFamily: "Inter_400Regular", fontSize: 11 },
  messageList: { paddingTop: 12 },
  inputBar: { paddingHorizontal: 14, paddingTop: 10, borderTopWidth: 1 },
  inputWrap: { flexDirection: "row", alignItems: "flex-end", borderWidth: 1, padding: 8, gap: 8 },
  limitBadge: {
    position: "absolute",
    top: -10,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  limitBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  input: { flex: 1, fontSize: 14, lineHeight: 20, maxHeight: 100, paddingHorizontal: 6, paddingVertical: 4 },
  sendBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  blockedBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  blockedText: { fontFamily: "Inter_400Regular", fontSize: 12, flex: 1 },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 100,
  },
  slotBanner: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  slotBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  slotBannerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  gateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  gateBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  gateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  gateBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  gateBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1.5 },
  gateTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18, textAlign: "center", letterSpacing: 0.2 },
  gateSubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", lineHeight: 21 },
  gateDetailBox: { borderWidth: 1, borderRadius: 10, padding: 16, width: "100%" },
  gateDetail: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 19, textAlign: "center" },
  gateRoomInfo: { alignItems: "center", gap: 3, paddingTop: 12, borderTopWidth: 1, width: "100%" },
  gateRoomLabel: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.5 },
  gateRoomName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  gateRoomMeta: { fontFamily: "Inter_400Regular", fontSize: 11 },
  notifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    justifyContent: "center",
  },
  notifyBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  notifyConfirm: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "100%",
  },
  notifyConfirmText: { fontFamily: "Inter_400Regular", fontSize: 12, textAlign: "center", lineHeight: 18 },
  gateBackBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, borderWidth: 1 },
  gateBackText: { fontFamily: "Inter_500Medium", fontSize: 14, letterSpacing: 0.2 },
  slotOpenedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
  },
  slotOpenedTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  slotOpenedSubtitle: { fontFamily: "Inter_400Regular", fontSize: 12, opacity: 0.9 },
});
