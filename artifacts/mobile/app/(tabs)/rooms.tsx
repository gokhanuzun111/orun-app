import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoomCard } from "@/components/RoomCard";
import { ROOMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const ROOM_FILTERS = [
  { label: "Aktif", key: "active" },
  { label: "ORUN", key: "orun" },
  { label: "Dil", key: "language" },
  { label: "Motosiklet", key: "motorcycles" },
  { label: "Saat", key: "watches" },
  { label: "Bar", key: "whisky" },
  { label: "Puro", key: "cigars" },
  { label: "Kitap", key: "books" },
  { label: "Film", key: "film" },
  { label: "Havacılık", key: "aviation" },
  { label: "Gastronomi", key: "gastronomy" },
  { label: "Araba", key: "cars" },
  { label: "Felsefe", key: "philosophy" },
  { label: "Finans", key: "finance" },
  { label: "Müzik", key: "music" },
  { label: "Denizcilik", key: "maritime" },
  { label: "Spor", key: "fitness" },
  { label: "Tarih", key: "history" },
  { label: "Moda", key: "fashion" },
  { label: "Tarım", key: "agriculture" },
  { label: "Peyzaj", key: "landscaping" },
  { label: "Dağcılık", key: "mountaineering" },
  { label: "Kamp", key: "camping" },
  { label: "Maket", key: "models" },
  { label: "Dans", key: "dance" },
  { label: "Sim Racing", key: "simracing" },
  { label: "Atıcılık", key: "archery" },
  { label: "Parfüm", key: "perfume" },
];

export default function RoomsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("active");

  const filteredRooms = ROOMS.filter(r => {
    if (activeKey === "active") return r.isActive;
    if (activeKey === "language") return r.isLanguageRoom === true;
    if (activeKey === "orun") return r.clubId === "master";
    return r.clubId === activeKey;
  });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.wordmark, { color: colors.foreground }]}>ODALAR</Text>
          <View style={styles.titleRight}>
            <View style={styles.activeCount}>
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.activeText, { color: colors.mutedForeground }]}>
                {ROOMS.filter(r => r.isActive).length} canlı
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/profile")}
              style={[styles.profileBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              testID="profile-nav-btn"
            >
              <Feather name="user" size={15} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Gerçek zamanlı metin odaları — ses yok, gürültü yok.
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {ROOM_FILTERS.map(f => (
            <Pressable
              key={f.key}
              onPress={() => setActiveKey(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeKey === f.key ? colors.foreground : colors.card,
                  borderColor: activeKey === f.key ? colors.foreground : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeKey === f.key ? colors.background : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredRooms}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Bu kulüpte henüz oda yok.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RoomCard room={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    letterSpacing: 2,
  },
  titleRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  activeCount: { flexDirection: "row", alignItems: "center", gap: 6 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  profileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 4,
  },
  filterRow: {
    paddingVertical: 12,
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  emptyState: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
