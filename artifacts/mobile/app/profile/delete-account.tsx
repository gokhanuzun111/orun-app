import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const CONFIRM_PHRASE = "HESABIMI SIL";

export default function DeleteAccountScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { deleteAccount } = useApp();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const canDelete = confirm.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleDelete = async () => {
    if (!canDelete || busy) return;
    setBusy(true);
    setError(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    try {
      await deleteAccount();
      router.replace("/onboarding" as Href);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Hesap silinemedi. Lütfen tekrar deneyin.";
      setError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setBusy(false);
    }
  };

  const confirmAndDelete = () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Hesabını kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz.")) {
        handleDelete();
      }
      return;
    }
    Alert.alert(
      "Hesabını sil",
      "Hesabını ve tüm verilerini kalıcı olarak sileceğiz. Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Sil", style: "destructive", onPress: handleDelete },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.navBar, { paddingTop: topPadding + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Hesabı Sil</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.warnBox, { borderColor: colors.destructive }]}>
          <Feather name="alert-triangle" size={20} color={colors.destructive} />
          <Text style={[styles.warnTitle, { color: colors.destructive }]}>Bu işlem geri alınamaz</Text>
          <Text style={[styles.warnText, { color: colors.mutedForeground }]}>
            Hesabını silersen profilin, kulüp üyeliklerin, mesajların ve tüm verilerin
            sunucudan kalıcı olarak silinir. İade ya da kurtarma yapılamaz.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            ONAYLAMAK İÇİN AŞAĞIYA YAZ
          </Text>
          <View style={[styles.codeBox, { backgroundColor: colors.muted, borderRadius: 8 }]}>
            <Text style={[styles.codeText, { color: colors.foreground }]}>{CONFIRM_PHRASE}</Text>
          </View>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder={CONFIRM_PHRASE}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: canDelete ? colors.destructive : colors.border,
              },
            ]}
          />
        </View>

        {error && (
          <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
        )}

        <Pressable
          disabled={!canDelete || busy}
          onPress={confirmAndDelete}
          style={[
            styles.deleteBtn,
            {
              backgroundColor: canDelete ? colors.destructive : colors.muted,
              opacity: busy ? 0.6 : 1,
            },
          ]}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteBtnText}>Hesabımı kalıcı olarak sil</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Vazgeç</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 24 },
  warnBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  warnTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 0.3 },
  warnText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19 },
  section: { gap: 10 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2 },
  codeBox: { paddingVertical: 10, paddingHorizontal: 14, alignItems: "center" },
  codeText: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 2 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    letterSpacing: 1.5,
  },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 13, textAlign: "center" },
  deleteBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff", letterSpacing: 0.3 },
  cancelBtn: { paddingVertical: 12, alignItems: "center" },
  cancelBtnText: { fontFamily: "Inter_500Medium", fontSize: 13 },
});
