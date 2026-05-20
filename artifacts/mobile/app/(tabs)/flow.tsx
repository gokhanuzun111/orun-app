import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlowCard } from "@/components/FlowCard";
import { FLOW_ITEMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["Tümü", "Kulüpler", "AI Seçimi", "Takip"];

export default function FlowScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("Tümü");
  const [refreshing, setRefreshing] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.wordmark, { color: colors.foreground }]}>AKIŞ</Text>
          <View style={styles.liveTag}>
            <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.liveText, { color: colors.primary }]}>CANLI</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          AI tarafından seçilmiş, vaktinize değer sohbetler.
        </Text>
        <View style={styles.filters}>
          {FILTERS.map(filter => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterBtn,
                {
                  borderBottomWidth: activeFilter === filter ? 1 : 0,
                  borderBottomColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: activeFilter === filter ? colors.foreground : colors.mutedForeground,
                    fontFamily: activeFilter === filter ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <FlatList
        data={FLOW_ITEMS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FlowCard item={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingHorizontal: 20, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false), 1000);
        }}
        refreshing={refreshing}
        ListFooterComponent={
          <View style={styles.footer}>
            <Feather name="check-circle" size={16} color={colors.mutedForeground} />
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Güncel bilgilere yetiştiniz
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 0, gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  wordmark: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 4 },
  liveTag: { flexDirection: "row", alignItems: "center", gap: 5 },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  liveText: { fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  filters: { flexDirection: "row", gap: 20, marginTop: 12 },
  filterBtn: { paddingBottom: 10 },
  filterText: { fontSize: 13, letterSpacing: 0.2 },
  divider: { height: 1, marginBottom: 4 },
  list: { paddingTop: 4 },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  footerText: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
