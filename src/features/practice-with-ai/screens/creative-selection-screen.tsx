// Màn hình chọn từ vựng / ngữ pháp cho preset CREATIVE.
// - VOCAB_DRILL    → danh sách từ vựng có checkbox
// - GRAMMAR_DRILL  → danh sách ngữ pháp có checkbox
// - MIXED_LESSON   → tab switcher Từ vựng | Ngữ pháp

import { Check, Square, X } from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { PrimaryButton } from "@/components/ui";
import { Colors, Primitive } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { GrammarItem, MasteryInfo, SessionType, VocabItem } from "../api/practice-with-ai.types";
import { useLessonItems } from "../hooks";

// ---------------------------------------------------------------------------
// Mastery helpers
// ---------------------------------------------------------------------------

type MasteryFilter = "ALL" | "CHUA_LUYEN" | "QUEN_THUOC" | "NAM_VUNG" | "THANH_THAO";

const MASTERY_FILTERS: { value: MasteryFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "CHUA_LUYEN", label: "Chưa luyện" },
  { value: "QUEN_THUOC", label: "Quen thuộc" },
  { value: "NAM_VUNG", label: "Nắm vững" },
  { value: "THANH_THAO", label: "Thành thạo" },
];

function getMasteryLabel(mastery: MasteryInfo | null): string {
  if (mastery === null) return "Chưa luyện";
  return mastery.label;
}

function getMasteryColor(mastery: MasteryInfo | null): string {
  if (mastery === null) return Primitive.neutral[600]; // #8090ae
  const lower = mastery.label.toLowerCase();
  if (lower.includes("quen") || mastery.level === "FAMILIAR") return Primitive.amber[300]; // #f59e0b
  if (lower.includes("nắm") || lower.includes("nam") || mastery.level === "PROFICIENT") return Primitive.blue[600]; // #5477e8
  if (lower.includes("thành") || lower.includes("thanh") || mastery.level === "MASTERED") return Primitive.green[500]; // #16a34a
  return Primitive.neutral[600];
}

function matchesMasteryFilter(mastery: MasteryInfo | null, filter: MasteryFilter): boolean {
  if (filter === "ALL") return true;
  if (filter === "CHUA_LUYEN") return mastery === null;
  const label = getMasteryLabel(mastery).toLowerCase();
  if (filter === "QUEN_THUOC") return label.includes("quen");
  if (filter === "NAM_VUNG") return label.includes("nắm") || label.includes("nam");
  if (filter === "THANH_THAO") return label.includes("thành") || label.includes("thanh");
  return true;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterChips({
  active,
  onChange,
  theme,
}: {
  active: MasteryFilter;
  onChange: (v: MasteryFilter) => void;
  theme: (typeof Colors)["light"];
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {MASTERY_FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <Pressable
            key={f.value}
            onPress={() => onChange(f.value)}
            style={{
              backgroundColor: isActive ? theme.brand.primary : theme.background.surface,
              borderWidth: 1,
              borderColor: isActive ? theme.brand.primary : theme.border.subtle,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text
              className="font-body"
              style={{
                fontSize: 14,
                color: isActive ? theme.text.onBrand : theme.text.secondary,
              }}
            >
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function VocabCard({
  item,
  selected,
  onToggle,
  theme,
}: {
  item: VocabItem;
  selected: boolean;
  onToggle: () => void;
  theme: (typeof Colors)["light"];
}) {
  const borderColor = selected ? theme.brand.primary : theme.border.subtle;
  const masteryColor = getMasteryColor(item.mastery);

  return (
    <Pressable
      onPress={onToggle}
      style={{ flexDirection: "row", gap: 8 }}
    >
      {/* Left box — kanji + reading */}
      <View
        style={{
          width: 70,
          height: 70,
          backgroundColor: theme.background.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <Text
          className="font-body-semibold"
          style={{
            fontSize: 15,
            color: theme.text.primary,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {item.japaneseText}
        </Text>
        {!!item.reading && (
          <Text
            style={{
              fontSize: 10,
              color: theme.text.secondary,
              textAlign: "center",
            }}
            numberOfLines={1}
          >
            {item.reading}
          </Text>
        )}
      </View>

      {/* Right box — meaning + checkbox + mastery */}
      <View
        style={{
          flex: 1,
          height: 70,
          backgroundColor: theme.background.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          padding: 11,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          className="font-body"
          style={{
            fontSize: 14,
            color: theme.text.secondary,
            flex: 1,
            marginRight: 8,
          }}
          numberOfLines={2}
        >
          {item.meaningVi}
        </Text>

        <View
          style={{
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Checkbox */}
          <View style={{ width: 15, height: 15 }}>
            {selected ? (
              <Check size={15} color={theme.brand.primary} strokeWidth={2.5} />
            ) : (
              <Square size={15} color={theme.border.default} strokeWidth={1.5} />
            )}
          </View>

          {/* Mastery label */}
          <Text
            className="font-heading"
            style={{ fontSize: 12, color: masteryColor }}
          >
            {getMasteryLabel(item.mastery)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function GrammarCard({
  item,
  selected,
  onToggle,
  theme,
}: {
  item: GrammarItem;
  selected: boolean;
  onToggle: () => void;
  theme: (typeof Colors)["light"];
}) {
  const borderColor = selected ? theme.brand.primary : theme.border.subtle;
  const masteryColor = getMasteryColor(item.mastery);

  return (
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: theme.background.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
        padding: 11,
      }}
    >
      {/* Top row: pattern + checkbox */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <Text
          className="font-heading"
          style={{
            fontSize: 12.5,
            color: theme.brand.primary,
            flex: 1,
            marginRight: 8,
          }}
          numberOfLines={2}
        >
          {item.pattern}
        </Text>
        <View style={{ width: 15, height: 15 }}>
          {selected ? (
            <Check size={15} color={theme.brand.primary} strokeWidth={2.5} />
          ) : (
            <Square size={15} color={theme.border.default} strokeWidth={1.5} />
          )}
        </View>
      </View>

      {/* Meaning */}
      <Text
        className="font-body"
        style={{
          fontSize: 11.5,
          lineHeight: 16,
          color: theme.text.secondary,
          marginBottom: 4,
        }}
        numberOfLines={2}
      >
        {item.meaningVi}
      </Text>

      {/* Mastery label */}
      <Text
        className="font-heading"
        style={{ fontSize: 12, color: masteryColor, alignSelf: "flex-end" }}
      >
        {getMasteryLabel(item.mastery)}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Tab Switcher (MIXED_LESSON only)
// ---------------------------------------------------------------------------

function TabSwitcher({
  activeTab,
  vocabCount,
  grammarCount,
  onSelect,
  theme,
}: {
  activeTab: "vocab" | "grammar";
  vocabCount: number;
  grammarCount: number;
  onSelect: (tab: "vocab" | "grammar") => void;
  theme: (typeof Colors)["light"];
}) {
  return (
    <View
      style={{
        backgroundColor: Primitive.neutral[200],
        borderRadius: 12,
        height: 39,
        padding: 3,
        flexDirection: "row",
      }}
    >
      {(["vocab", "grammar"] as const).map((tab) => {
        const isActive = activeTab === tab;
        const label = tab === "vocab" ? "Từ vựng" : "Ngữ pháp";
        const count = tab === "vocab" ? vocabCount : grammarCount;
        return (
          <Pressable
            key={tab}
            onPress={() => onSelect(tab)}
            style={{
              flex: 1,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              backgroundColor: isActive ? theme.background.surface : "transparent",
              ...(isActive && Platform.OS === "ios"
                ? { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }
                : isActive
                  ? { elevation: 2 }
                  : {}),
            }}
          >
            <Text
              className="font-heading"
              style={{
                fontSize: 13,
                color: isActive ? theme.brand.primary : theme.icon.disabled,
              }}
            >
              {label}
            </Text>
            <View
              style={{
                borderRadius: 9999,
                paddingHorizontal: 5,
                paddingVertical: 1,
                backgroundColor: isActive ? Primitive.neutral[200] : "transparent",
              }}
            >
              <Text
                className="font-heading"
                style={{
                  fontSize: 11,
                  color: isActive ? theme.brand.primary : theme.icon.disabled,
                }}
              >
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export function CreativeSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { lessonId, sessionType, itemTypes } = useLocalSearchParams<{
    lessonId: string;
    sessionType: SessionType;
    itemTypes: string;
  }>();

  const { data, isPending } = useLessonItems(lessonId);

  const [selectedVocabIds, setSelectedVocabIds] = useState<Set<string>>(new Set());
  const [selectedGrammarIds, setSelectedGrammarIds] = useState<Set<string>>(new Set());
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>("ALL");
  const [activeTab, setActiveTab] = useState<"vocab" | "grammar">("vocab");

  const vocabulary = data?.vocabulary ?? [];
  const grammar = data?.grammar ?? [];

  const filteredVocab = vocabulary.filter((v) => matchesMasteryFilter(v.mastery, masteryFilter));
  const filteredGrammar = grammar.filter((g) => matchesMasteryFilter(g.mastery, masteryFilter));

  function toggleVocab(id: string) {
    setSelectedVocabIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function toggleGrammar(id: string) {
    setSelectedGrammarIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function handleContinue() {
    router.push({
      pathname: "/practice-session",
      params: {
        lessonId,
        sessionType,
        itemTypes,
        selectedVocabIds: JSON.stringify([...selectedVocabIds]),
        selectedGrammarIds: JSON.stringify([...selectedGrammarIds]),
      },
    });
  }

  // Determine title
  const title =
    sessionType === "VOCAB_DRILL"
      ? "Lựa chọn từ vựng"
      : sessionType === "GRAMMAR_DRILL"
        ? "Lựa chọn ngữ pháp"
        : "Lựa chọn nội dung";

  // Determine if CTA should be enabled
  const hasSelection =
    sessionType === "VOCAB_DRILL"
      ? selectedVocabIds.size > 0
      : sessionType === "GRAMMAR_DRILL"
        ? selectedGrammarIds.size > 0
        : selectedVocabIds.size > 0 || selectedGrammarIds.size > 0;

  // Which list to show
  const showVocab = sessionType === "VOCAB_DRILL" || (sessionType === "MIXED_LESSON" && activeTab === "vocab");
  const showGrammar = sessionType === "GRAMMAR_DRILL" || (sessionType === "MIXED_LESSON" && activeTab === "grammar");

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View className="flex-1" style={{ paddingTop: insets.top + 8 }}>
        {/* Header */}
        <View
          className="flex-row items-center gap-2 px-4"
          style={{ height: 48, opacity: 0.9 }}
        >
          <Pressable onPress={() => router.back()} hitSlop={30}>
            <X size={24} color={theme.icon.primary} strokeWidth={2} />
          </Pressable>
          <Text
            className="font-heading"
            style={{ fontSize: 18, color: theme.text.primary }}
          >
            {title}
          </Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 16,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Tab switcher (MIXED_LESSON only) */}
          {sessionType === "MIXED_LESSON" && (
            <TabSwitcher
              activeTab={activeTab}
              vocabCount={vocabulary.length}
              grammarCount={grammar.length}
              onSelect={setActiveTab}
              theme={theme}
            />
          )}

          {/* Mastery filter chips */}
          <FilterChips
            active={masteryFilter}
            onChange={setMasteryFilter}
            theme={theme}
          />

          {/* Loading state */}
          {isPending && (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <Text
                className="font-body"
                style={{ fontSize: 14, color: theme.text.secondary }}
              >
                Đang tải...
              </Text>
            </View>
          )}

          {/* Vocab list */}
          {!isPending && showVocab && (
            <View style={{ gap: 6 }}>
              {filteredVocab.length === 0 ? (
                <Text
                  className="font-body text-sm text-center"
                  style={{ color: theme.text.secondary, paddingVertical: 16 }}
                >
                  Không có từ vựng nào
                </Text>
              ) : (
                filteredVocab.map((item) => (
                  <VocabCard
                    key={item.id}
                    item={item}
                    selected={selectedVocabIds.has(item.id)}
                    onToggle={() => toggleVocab(item.id)}
                    theme={theme}
                  />
                ))
              )}
            </View>
          )}

          {/* Grammar list */}
          {!isPending && showGrammar && (
            <View style={{ gap: 6 }}>
              {filteredGrammar.length === 0 ? (
                <Text
                  className="font-body text-sm text-center"
                  style={{ color: theme.text.secondary, paddingVertical: 16 }}
                >
                  Không có ngữ pháp nào
                </Text>
              ) : (
                filteredGrammar.map((item) => (
                  <GrammarCard
                    key={item.id}
                    item={item}
                    selected={selectedGrammarIds.has(item.id)}
                    onToggle={() => toggleGrammar(item.id)}
                    theme={theme}
                  />
                ))
              )}
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View
          className="px-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            paddingTop: 12,
          }}
        >
          <PrimaryButton
            text="Tiếp tục"
            onPress={handleContinue}
            disabled={!hasSelection || isPending}
          />
        </View>
      </View>
    </View>
  );
}
