import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { LANGUAGE_CONFIG, QUICK_ACTIONS } from "@/constants/data";

interface LanguageAssistantProps {
  targetLanguage: "en" | "it" | "es" | "de";
  onSendPrompt: (text: string) => void;
}

const LANGUAGE_PHRASES: Record<string, { tr: string; target: string }[]> = {
  en: [
    { tr: "Merhaba, nasılsın?", target: "Hello, how are you?" },
    { tr: "Teşekkür ederim", target: "Thank you very much" },
    { tr: "Özür dilerim", target: "I'm sorry / Excuse me" },
    { tr: "Anlayamadım", target: "I didn't understand" },
    { tr: "Tekrar söyler misin?", target: "Could you say that again?" },
    { tr: "Ne anlama geliyor?", target: "What does it mean?" },
  ],
  it: [
    { tr: "Merhaba, nasılsın?", target: "Ciao, come stai?" },
    { tr: "Teşekkür ederim", target: "Grazie mille" },
    { tr: "Özür dilerim", target: "Mi dispiace / Scusi" },
    { tr: "Anlayamadım", target: "Non ho capito" },
    { tr: "Tekrar söyler misin?", target: "Può ripetere per favore?" },
    { tr: "Ne anlama geliyor?", target: "Cosa significa?" },
  ],
  es: [
    { tr: "Merhaba, nasılsın?", target: "Hola, ¿cómo estás?" },
    { tr: "Teşekkür ederim", target: "Muchas gracias" },
    { tr: "Özür dilerim", target: "Lo siento / Perdón" },
    { tr: "Anlayamadım", target: "No entendí" },
    { tr: "Tekrar söyler misin?", target: "¿Puedes repetir, por favor?" },
    { tr: "Ne anlama geliyor?", target: "¿Qué significa?" },
  ],
  de: [
    { tr: "Merhaba, nasılsın?", target: "Hallo, wie geht es dir?" },
    { tr: "Teşekkür ederim", target: "Vielen Dank" },
    { tr: "Özür dilerim", target: "Entschuldigung / Es tut mir leid" },
    { tr: "Anlayamadım", target: "Ich habe nicht verstanden" },
    { tr: "Tekrar söyler misin?", target: "Können Sie das wiederholen?" },
    { tr: "Ne anlama geliyor?", target: "Was bedeutet das?" },
  ],
};

const GRAMMAR_TIPS: Record<string, { title: string; tip: string }[]> = {
  en: [
    { title: "Present Perfect", tip: "Have/has + V3 — geçmişten bugüne bağlantılı eylemler için." },
    { title: "Phrasal Verbs", tip: "Look up, give up, run into — bağlamla öğrenin." },
    { title: "Articles", tip: "a/an — belirsiz, the — belirli. Özel isimler artıkel almaz." },
  ],
  it: [
    { title: "Congiuntivo", tip: "Dilek, şüphe, his bildiren cümlelerde kullanılır." },
    { title: "Passato Prossimo", tip: "Ho mangiato — yakın geçmiş için (Türkçe: yedim)." },
    { title: "Articoli", tip: "il/la/lo/i/le/gli — her ismin kendi artikeli var." },
  ],
  es: [
    { title: "Ser vs Estar", tip: "Ser = kalıcı özellikler, Estar = geçici durumlar." },
    { title: "Pretérito", tip: "Hablé, comí — tamamlanmış geçmiş eylemler için." },
    { title: "Subjuntivo", tip: "Quiero que vengas — istek ve dilek cümlelerinde." },
  ],
  de: [
    { title: "Der/Die/Das", tip: "Artikeli kelimeyle birlikte ezberleyin. İstisnaları var!" },
    { title: "Wortstellung", tip: "Fiil ikinci sıradadır: Ich gehe — Morgen gehe ich." },
    { title: "Perfekt", tip: "Haben/sein + Partizip II — günlük konuşmada geçmiş zaman." },
  ],
};

export function LanguageAssistant({ targetLanguage, onSendPrompt }: LanguageAssistantProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<"hızlı" | "ifadeler" | "gramer">("hızlı");
  const [customInput, setCustomInput] = useState("");
  const config = LANGUAGE_CONFIG[targetLanguage];
  const phrases = LANGUAGE_PHRASES[targetLanguage];
  const tips = GRAMMAR_TIPS[targetLanguage];
  const actions = QUICK_ACTIONS[targetLanguage];

  const handleQuickAction = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSendPrompt(prompt + " ");
  };

  const handleCustomSend = () => {
    if (!customInput.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSendPrompt(customInput.trim());
    setCustomInput("");
  };

  const handlePhrase = (phrase: { tr: string; target: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSendPrompt(`"${phrase.tr}" nasıl söylenir?`);
  };

  const TABS = ["hızlı", "ifadeler", "gramer"] as const;
  const TAB_LABELS: Record<typeof TABS[number], string> = {
    hızlı: "Hızlı",
    ifadeler: "İfadeler",
    gramer: "Gramer",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.header, { borderColor: colors.border }]}>
        <View style={styles.langInfo}>
          <View style={[styles.aiDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.langName, { color: colors.primary }]}>
            {config.name} AI Asistan
          </Text>
          <Text style={[styles.nativeName, { color: colors.mutedForeground }]}>
            · {config.nativeName}
          </Text>
        </View>
        <Text style={[styles.levelBadge, { color: colors.mutedForeground }]}>{config.level}</Text>
      </View>

      <View style={[styles.tabs, { borderColor: colors.border }]}>
        {TABS.map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomWidth: 1.5, borderBottomColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? colors.foreground : colors.mutedForeground,
                  fontFamily: activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                },
              ]}
            >
              {TAB_LABELS[tab]}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "hızlı" && (
        <View style={styles.quickSection}>
          <View style={styles.actionGrid}>
            {actions.map((action, i) => (
              <Pressable
                key={i}
                onPress={() => handleQuickAction(action.prompt)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    backgroundColor: colors.muted,
                    borderColor: colors.border,
                    borderRadius: 8,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.customInput, { borderColor: colors.border, borderRadius: 8 }]}>
            <TextInput
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="AI'ya bir şey sor..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.customTextInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
              onSubmitEditing={handleCustomSend}
              returnKeyType="send"
            />
            <Pressable
              onPress={handleCustomSend}
              disabled={!customInput.trim()}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: customInput.trim() ? colors.primary : colors.muted,
                  borderRadius: 6,
                },
              ]}
            >
              <Feather
                name="send"
                size={12}
                color={customInput.trim() ? colors.primaryForeground : colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>
      )}

      {activeTab === "ifadeler" && (
        <ScrollView style={styles.phraseList} showsVerticalScrollIndicator={false}>
          {phrases.map((p, i) => (
            <Pressable
              key={i}
              onPress={() => handlePhrase(p)}
              style={[styles.phraseRow, { borderColor: colors.border }]}
            >
              <View style={styles.phraseTexts}>
                <Text style={[styles.phraseTr, { color: colors.mutedForeground }]}>{p.tr}</Text>
                <Text style={[styles.phraseTarget, { color: colors.foreground }]}>{p.target}</Text>
              </View>
              <Feather name="corner-down-left" size={13} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      {activeTab === "gramer" && (
        <ScrollView style={styles.grammarList} showsVerticalScrollIndicator={false}>
          {tips.map((tip, i) => (
            <Pressable
              key={i}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSendPrompt(`${tip.title} hakkında daha fazla örnek verir misin?`);
              }}
              style={[styles.grammarCard, { backgroundColor: colors.muted, borderRadius: 8 }]}
            >
              <View style={[styles.grammarDot, { backgroundColor: colors.primary }]} />
              <View style={styles.grammarText}>
                <Text style={[styles.grammarTitle, { color: colors.foreground }]}>{tip.title}</Text>
                <Text style={[styles.grammarTip, { color: colors.mutedForeground }]}>{tip.tip}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    maxHeight: 240,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  langInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  langName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  nativeName: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  levelBadge: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 14,
  },
  tab: {
    paddingVertical: 9,
    marginRight: 20,
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  quickSection: {
    padding: 12,
    gap: 10,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap" as const,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  actionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  customInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  customTextInput: {
    flex: 1,
    fontSize: 13,
    height: 24,
  },
  sendBtn: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  phraseList: {
    maxHeight: 180,
  },
  phraseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  phraseTexts: {
    flex: 1,
    gap: 2,
  },
  phraseTr: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  phraseTarget: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  grammarList: {
    maxHeight: 180,
    padding: 12,
    gap: 8,
  },
  grammarCard: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    marginBottom: 8,
  },
  grammarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 5,
    flexShrink: 0,
  },
  grammarText: {
    flex: 1,
    gap: 4,
  },
  grammarTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  grammarTip: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },
});
