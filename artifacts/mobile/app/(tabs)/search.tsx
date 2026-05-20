import { Feather } from "@expo/vector-icons";
import React, { type ComponentProps, useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CLUBS, ROOMS, FLOW_ITEMS } from "@/constants/data";
import { useRouter, type Href } from "expo-router";

type FeatherName = ComponentProps<typeof Feather>["name"];

type SearchCategory = "tümü" | "kulüpler" | "odalar" | "kişiler";

interface SearchResult {
  id: string;
  type: "club" | "room" | "person" | "discussion";
  title: string;
  subtitle: string;
  meta?: string;
}

const SAMPLE_PEOPLE: SearchResult[] = [
  { id: "p1", type: "person", title: "@northwind", subtitle: "ÇEVRE · Kitaplar, Felsefe, Caz", meta: "2,1k rep" },
  { id: "p2", type: "person", title: "@velours", subtitle: "REZERV · Saat, Araba, Viski", meta: "4,8k rep" },
  { id: "p3", type: "person", title: "@saltpilot", subtitle: "ÜYE · Havacılık, Motosiklet", meta: "891 rep" },
  { id: "p4", type: "person", title: "@selin_k", subtitle: "ÜYE · Dil Odaları, Almanca", meta: "324 rep" },
];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("tümü");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const clubResults: SearchResult[] = CLUBS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  ).map(c => ({
    id: c.id,
    type: "club",
    title: c.name,
    subtitle: c.description,
    meta: `${c.memberCount.toLocaleString("tr-TR")} üye`,
  }));

  const roomResults: SearchResult[] = ROOMS.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.topic.toLowerCase().includes(query.toLowerCase())
  ).map(r => ({
    id: r.id,
    type: "room",
    title: r.name,
    subtitle: r.topic,
    meta: `${r.memberCount} kişi`,
  }));

  const discussionResults: SearchResult[] = FLOW_ITEMS.filter(f =>
    f.content.toLowerCase().includes(query.toLowerCase()) ||
    f.clubName.toLowerCase().includes(query.toLowerCase())
  ).map(f => ({
    id: f.id,
    type: "discussion",
    title: f.handle,
    subtitle: f.content.slice(0, 80) + "...",
    meta: f.clubName,
  }));

  const peopleResults: SearchResult[] = SAMPLE_PEOPLE.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const allResults = query.length >= 2
    ? [...clubResults, ...roomResults, ...peopleResults, ...discussionResults]
    : [];

  const filteredResults = category === "tümü"
    ? allResults
    : allResults.filter(r => {
        if (category === "kulüpler") return r.type === "club";
        if (category === "odalar") return r.type === "room";
        if (category === "kişiler") return r.type === "person";
        return true;
      });

  const ICON_MAP: Record<string, FeatherName> = {
    club: "grid",
    room: "message-circle",
    person: "user",
    discussion: "align-left",
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === "club") router.push(`/club/${result.id}` as Href);
    if (result.type === "room") router.push(`/room/${result.id}` as Href);
  };

  const SUGGESTED = ["Dil Odaları", "Japon Viskisi", "Porsche", "Stoacılık", "Vinil & Caz"];

  const CAT_LABELS: Record<SearchCategory, string> = {
    tümü: "Tümü", kulüpler: "Kulüpler", odalar: "Odalar", kişiler: "Kişiler",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding + 16 }]}>
        <Text style={[styles.wordmark, { color: colors.foreground }]}>ARAMA</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Kulüp, oda, kişi, sohbet ara..."
            placeholderTextColor={colors.mutedForeground}
            autoCorrect={false}
            style={[styles.searchInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            testID="search-input"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        {query.length >= 2 && (
          <View style={styles.categoryRow}>
            {(["tümü", "kulüpler", "odalar", "kişiler"] as SearchCategory[]).map(cat => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.catBtn,
                  {
                    backgroundColor: category === cat ? colors.foreground : "transparent",
                    borderColor: category === cat ? colors.foreground : colors.border,
                    borderRadius: 6,
                  },
                ]}
              >
                <Text style={[styles.catLabel, { color: category === cat ? colors.background : colors.mutedForeground }]}>
                  {CAT_LABELS[cat]}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {query.length < 2 ? (
        <View style={styles.suggestions}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>GÜNDEM</Text>
          {SUGGESTED.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => setQuery(s)}
              style={[styles.suggestRow, { borderColor: colors.border }]}
            >
              <Feather name="trending-up" size={14} color={colors.mutedForeground} />
              <Text style={[styles.suggestText, { color: colors.foreground }]}>{s}</Text>
              <Feather name="arrow-up-left" size={14} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleResultPress(item)}
              style={[styles.resultRow, { borderColor: colors.border }]}
            >
              <View style={[styles.resultIcon, { backgroundColor: colors.muted, borderRadius: 8 }]}>
                <Feather name={ICON_MAP[item.type] ?? "circle"} size={14} color={colors.mutedForeground} />
              </View>
              <View style={styles.resultText}>
                <Text style={[styles.resultTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.resultSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              {item.meta && (
                <Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>{item.meta}</Text>
              )}
            </Pressable>
          )}
          contentContainerStyle={[styles.results, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                "{query}" için sonuç bulunamadı
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  wordmark: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, height: "100%" },
  categoryRow: { flexDirection: "row", gap: 8 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  catLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 0.3 },
  suggestions: { paddingHorizontal: 20, paddingTop: 20, gap: 0 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 10, letterSpacing: 2, marginBottom: 12 },
  suggestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  suggestText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  results: { paddingTop: 8 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  resultIcon: { width: 36, height: 36, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  resultText: { flex: 1, gap: 3 },
  resultTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  resultSubtitle: { fontFamily: "Inter_400Regular", fontSize: 12 },
  resultMeta: { fontFamily: "Inter_400Regular", fontSize: 11, flexShrink: 0 },
  empty: { paddingTop: 40, alignItems: "center" },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
