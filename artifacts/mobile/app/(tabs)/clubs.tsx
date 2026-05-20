import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ClubCard } from "@/components/ClubCard";
import { CLUBS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["Tümü", "Eğitim", "Yaşam Tarzı", "Kültür", "Gastronomi", "Finans", "Teknik"];

export default function ClubsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isOnWaitlist } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered = CLUBS.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Tümü" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <Text style={[styles.wordmark, { color: colors.foreground }]}>KULÜPLER</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Kulüp ara..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            testID="clubs-search"
          />
          {search.length > 0 && (
            <Feather name="x" size={14} color={colors.mutedForeground} onPress={() => setSearch("")} />
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <View
              key={cat}
              onTouchEnd={() => setActiveCategory(cat)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeCategory === cat ? colors.foreground : "transparent",
                  borderColor: activeCategory === cat ? colors.foreground : colors.border,
                  borderRadius: colors.radius - 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: activeCategory === cat ? colors.background : colors.mutedForeground },
                ]}
              >
                {cat}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ClubCard club={item} joined={user.joinedClubs.includes(item.id)} onWaitlist={isOnWaitlist(item.id)} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={24} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Kulüp bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  wordmark: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, height: "100%" },
  filterRow: { gap: 8, paddingRight: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  filterLabel: { fontFamily: "Inter_500Medium", fontSize: 12, letterSpacing: 0.3 },
  list: { paddingTop: 4 },
  empty: { paddingTop: 60, alignItems: "center", gap: 12 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
