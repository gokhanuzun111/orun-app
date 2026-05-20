import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Mode = "register" | "login";

export default function AuthScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginWithEmail, registerWithEmail } = useApp();

  const [mode, setMode] = useState<Mode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topPadding = Platform.OS === "web" ? 56 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const validate = () => {
    if (!email.trim() || !email.includes("@")) return "Geçerli bir e-posta girin.";
    if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
    if (mode === "register" && !name.trim()) return "Adınızı girin.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (mode === "register") {
        await registerWithEmail(name.trim(), email.trim(), password);
        router.push("/onboarding/consent");
      } else {
        await loginWithEmail(email.trim(), password);
      }
    } catch (e: any) {
      setError(e?.message ?? "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: "apple" | "google") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError("Sosyal giriş yakında aktif olacak.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.mutedForeground} />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.wordmark, { color: colors.foreground }]}>ORUN</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {mode === "register" ? "Başvurunuzu oluşturun." : "Tekrar hoş geldiniz."}
          </Text>
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={({ pressed }) => [
              styles.socialBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={() => handleSocial("apple")}
          >
            <Feather name="smartphone" size={16} color={colors.foreground} />
            <Text style={[styles.socialText, { color: colors.foreground }]}>Apple ile Giriş</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.socialBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={() => handleSocial("google")}
          >
            <Feather name="globe" size={16} color={colors.foreground} />
            <Text style={[styles.socialText, { color: colors.foreground }]}>Google ile Giriş</Text>
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>veya e-posta ile</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.form}>
          {mode === "register" && (
            <View style={styles.fieldWrap}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>AD SOYAD</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
                placeholder="Adınız"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>E-POSTA</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder="ornek@domain.com"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>ŞİFRE</Text>
            <View style={[styles.passWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.passInput, { color: colors.foreground }]}
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Pressable onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                <Feather name={showPass ? "eye-off" : "eye"} size={15} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: "#fee2e2", borderColor: "#fca5a5" }]}>
              <Feather name="alert-circle" size={13} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed || loading ? 0.8 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} size="small" />
            ) : (
              <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
                {mode === "register" ? "Başvuruyu Tamamla" : "Giriş Yap"}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
            {mode === "register" ? "Zaten üye misiniz?" : "Hesabınız yok mu?"}
          </Text>
          <Pressable onPress={() => { setMode(mode === "register" ? "login" : "register"); setError(null); }}>
            <Text style={[styles.switchLink, { color: colors.primary }]}>
              {mode === "register" ? "Giriş Yap" : "Başvur"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    gap: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },
  header: { gap: 8 },
  wordmark: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    letterSpacing: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  socialRow: { gap: 10 },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
  },
  socialText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  form: { gap: 18 },
  fieldWrap: { gap: 7 },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  passWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    height: 48,
    paddingLeft: 14,
    paddingRight: 8,
  },
  passInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    height: "100%",
  },
  eyeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#dc2626",
    flex: 1,
  },
  submitBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  switchText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  switchLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
});
