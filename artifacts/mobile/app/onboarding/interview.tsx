import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type DimensionValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { AI_INTERVIEW_QUESTIONS } from "@/constants/data";
import { useApp } from "@/context/AppContext";

export default function InterviewScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { selectedInterests, completeOnboarding } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(AI_INTERVIEW_QUESTIONS.length).fill(""));
  const [handle, setHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currentAnswer = answers[currentQ] ?? "";
  const isLastQuestion = currentQ === AI_INTERVIEW_QUESTIONS.length - 1;
  const isHandleStep = currentQ === AI_INTERVIEW_QUESTIONS.length;
  const canAdvance = isHandleStep ? handle.trim().length >= 3 : currentAnswer.trim().length >= 20;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = async () => {
    if (!canAdvance) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isHandleStep) {
      setIsSubmitting(true);
      await completeOnboarding(handle.trim(), answers[1] ?? "", selectedInterests);
      router.replace("/onboarding/waiting");
      return;
    }
    if (isLastQuestion) {
      setCurrentQ(AI_INTERVIEW_QUESTIONS.length);
      return;
    }
    setCurrentQ(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentQ === 0) { router.back(); return; }
    setCurrentQ(prev => prev - 1);
  };

  const totalSteps = AI_INTERVIEW_QUESTIONS.length + 1;
  const progress = (currentQ / totalSteps) * 100;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.topBar, { paddingTop: topPadding + 12 }]}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: `${progress}%` as DimensionValue },
            ]}
          />
        </View>
        <Text style={[styles.stepCount, { color: colors.mutedForeground }]}>
          {currentQ + 1}/{totalSteps}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding + 120 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepLabel}>
          <Text style={[styles.stepNum, { color: colors.mutedForeground }]}>02 / 03</Text>
          {!isHandleStep && (
            <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
              Soru {currentQ + 1} / {AI_INTERVIEW_QUESTIONS.length}
            </Text>
          )}
        </View>

        <Text style={[styles.question, { color: colors.foreground }]}>
          {isHandleStep
            ? "ORUN kullanıcı adınızı seçin."
            : AI_INTERVIEW_QUESTIONS[currentQ]}
        </Text>

        {!isHandleStep && (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>
            Düşünceli, özgün yanıtlar. Doğru ya da yanlış cevap yoktur — yalnızca gerçek olanlar.
          </Text>
        )}

        {isHandleStep ? (
          <View style={[styles.handleInputWrap, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.atSign, { color: colors.mutedForeground }]}>@</Text>
            <TextInput
              ref={inputRef}
              value={handle}
              onChangeText={setHandle}
              placeholder="kullaniciadi"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.handleInput, { color: colors.foreground, fontFamily: "Inter_500Medium" }]}
              testID="handle-input"
            />
          </View>
        ) : (
          <TextInput
            ref={inputRef}
            value={currentAnswer}
            onChangeText={text => {
              const updated = [...answers];
              updated[currentQ] = text;
              setAnswers(updated);
            }}
            placeholder="Cevabınızı buraya yazın..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            textAlignVertical="top"
            style={[
              styles.textArea,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                fontFamily: "Inter_400Regular",
              },
            ]}
            testID={`interview-answer-${currentQ}`}
          />
        )}

        {!isHandleStep && (
          <Text style={[styles.charCount, { color: currentAnswer.length < 20 ? colors.mutedForeground : colors.primary }]}>
            {currentAnswer.length} karakter{currentAnswer.length < 20 ? ` · devam etmek için ${20 - currentAnswer.length} karakter daha` : ""}
          </Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPadding + 20 }]}>
        <Pressable
          testID={isHandleStep ? "submit-interview" : "next-question"}
          onPress={handleNext}
          disabled={!canAdvance || isSubmitting}
          style={({ pressed }) => [
            styles.nextBtn,
            {
              backgroundColor: canAdvance ? colors.foreground : colors.muted,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.nextBtnText, { color: canAdvance ? colors.background : colors.mutedForeground }]}>
            {isHandleStep
              ? (isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder")
              : isLastQuestion
                ? "Son Adım"
                : "Sonraki Soru"}
          </Text>
          <Feather
            name={isHandleStep ? "check" : "arrow-right"}
            size={16}
            color={canAdvance ? colors.background : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  progressTrack: { flex: 1, height: 2, borderRadius: 1, overflow: "hidden" },
  progressFill: { height: 2, borderRadius: 1 },
  stepCount: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1, flexShrink: 0 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { gap: 20 },
  stepLabel: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepNum: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 2 },
  questionLabel: { fontFamily: "Inter_400Regular", fontSize: 11 },
  question: { fontFamily: "Inter_700Bold", fontSize: 22, lineHeight: 32, letterSpacing: 0.1 },
  hint: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20, fontStyle: "italic" as const },
  textArea: { height: 160, padding: 16, fontSize: 14, lineHeight: 22, borderWidth: 1 },
  charCount: { fontFamily: "Inter_400Regular", fontSize: 11 },
  handleInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    gap: 4,
  },
  atSign: { fontFamily: "Inter_500Medium", fontSize: 16 },
  handleInput: { flex: 1, fontSize: 16, height: "100%" },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  nextBtn: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 0.3 },
});
