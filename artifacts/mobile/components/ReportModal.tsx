import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  messagePreview?: string;
  authorHandle?: string;
}

const REPORT_REASONS = [
  { id: "spam", label: "Spam veya tekrarlayan içerik" },
  { id: "harassment", label: "Taciz veya zorbalık" },
  { id: "hate", label: "Nefret söylemi" },
  { id: "misinformation", label: "Yanıltıcı bilgi" },
  { id: "offtopic", label: "Oda konusuyla ilgisiz" },
  { id: "illegal", label: "Yasadışı içerik" },
  { id: "other", label: "Diğer" },
];

export function ReportModal({ visible, onClose, messagePreview, authorHandle }: ReportModalProps) {
  const colors = useColors();
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelected(null);
      setNote("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelected(null);
    setNote("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Rapor Et</Text>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {submitted ? (
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={40} color={colors.primary} />
            <Text style={[styles.successTitle, { color: colors.foreground }]}>Raporunuz Alındı</Text>
            <Text style={[styles.successBody, { color: colors.mutedForeground }]}>
              ORUN moderasyon ekibi en kısa sürede inceleyecek. Topluluğu korumaya yardım ettiğiniz için teşekkürler.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {authorHandle && (
              <View style={[styles.targetBox, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
                <Text style={[styles.targetLabel, { color: colors.mutedForeground }]}>Raporlanan kullanıcı</Text>
                <Text style={[styles.targetHandle, { color: colors.foreground }]}>{authorHandle}</Text>
                {messagePreview && (
                  <Text style={[styles.targetPreview, { color: colors.mutedForeground }]} numberOfLines={2}>
                    "{messagePreview}"
                  </Text>
                )}
              </View>
            )}

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Rapor Sebebi</Text>

            {REPORT_REASONS.map(reason => (
              <Pressable
                key={reason.id}
                style={[
                  styles.reasonRow,
                  {
                    borderColor: selected === reason.id ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                    backgroundColor: selected === reason.id ? `${colors.primary}10` : "transparent",
                  },
                ]}
                onPress={() => setSelected(reason.id)}
              >
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selected === reason.id ? colors.primary : colors.mutedForeground,
                      backgroundColor: selected === reason.id ? colors.primary : "transparent",
                    },
                  ]}
                />
                <Text style={[styles.reasonText, { color: colors.foreground }]}>{reason.label}</Text>
              </Pressable>
            ))}

            {selected === "other" && (
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.muted,
                    borderRadius: colors.radius,
                  },
                ]}
                placeholder="Açıklama ekleyin (isteğe bağlı)..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={setNote}
              />
            )}

            <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
              Raporlar ORUN yapay zekâ moderatörü tarafından 24 saat içinde incelenir. Kötüye kullanım tespitinde hesabınız gözden geçirilebilir.
            </Text>

            <Pressable
              style={[
                styles.submitBtn,
                {
                  backgroundColor: selected ? colors.primary : colors.muted,
                  borderRadius: colors.radius,
                },
              ]}
              onPress={handleSubmit}
              disabled={!selected}
            >
              <Text style={[styles.submitText, { color: selected ? "#fff" : colors.mutedForeground }]}>
                Raporu Gönder
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  closeBtn: { padding: 4 },
  content: { padding: 20, gap: 12, paddingBottom: 40 },
  targetBox: { padding: 14, gap: 4, marginBottom: 4 },
  targetLabel: { fontFamily: "Inter_400Regular", fontSize: 11, letterSpacing: 0.5 },
  targetHandle: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  targetPreview: { fontFamily: "Inter_400Regular", fontSize: 12, fontStyle: "italic" },
  sectionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5 },
  reasonText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  noteInput: {
    padding: 12,
    borderWidth: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 17,
    fontStyle: "italic",
  },
  submitBtn: { paddingVertical: 14, alignItems: "center", marginTop: 8 },
  submitText: { fontFamily: "Inter_600SemiBold", fontSize: 14, letterSpacing: 0.3 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 16 },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 18 },
  successBody: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 22, textAlign: "center" },
});
