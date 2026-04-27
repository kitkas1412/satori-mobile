// Màn hình thiết lập bài luyện tập: chọn dạng bài tập và mẫu bài tập.
// Nhận lessonId + sessionType từ route params, điều hướng sang practice-session khi bắt đầu.

import {
  ArrowUpDown,
  BookOpen,
  CheckSquare,
  Flame,
  Languages,
  Link2,
  Palette,
  PenLine,
  ToggleLeft,
  X,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ItemType, SessionType } from "@/features/practice-with-ai/api";

const SESSION_TYPE_ITEM_TYPES: Record<SessionType, ItemType[]> = {
  VOCAB_DRILL: [
    "MULTIPLE_CHOICE",
    "FILL_BLANK",
    "MATCHING",
    "TRUE_FALSE",
    "SENTENCE_ORDER",
    "TRANSLATION",
  ],
  GRAMMAR_DRILL: [
    "MULTIPLE_CHOICE",
    "FILL_BLANK",
    "TRUE_FALSE",
    "SENTENCE_ORDER",
    "TRANSLATION",
  ],
  KANJI_READING: ["MULTIPLE_CHOICE", "FILL_BLANK", "MATCHING"],
  MIXED_LESSON: [
    "MULTIPLE_CHOICE",
    "FILL_BLANK",
    "TRANSLATION",
    "SENTENCE_ORDER",
    "MATCHING",
    "TRUE_FALSE",
  ],
};

const EXERCISE_TYPES: {
  value: ItemType;
  label: string;
  icon: (color: string) => React.ReactNode;
}[] = [
  {
    value: "MULTIPLE_CHOICE",
    label: "Trắc nghiệm",
    icon: (color) => <CheckSquare size={15} color={color} strokeWidth={2} />,
  },
  {
    value: "FILL_BLANK",
    label: "Điền vào chỗ trống",
    icon: (color) => <PenLine size={15} color={color} strokeWidth={2} />,
  },
  {
    value: "TRANSLATION",
    label: "Dịch thuật",
    icon: (color) => <Languages size={15} color={color} strokeWidth={2} />,
  },
  {
    value: "SENTENCE_ORDER",
    label: "Sắp xếp câu",
    icon: (color) => <ArrowUpDown size={15} color={color} strokeWidth={2} />,
  },
  {
    value: "MATCHING",
    label: "Ghép đôi",
    icon: (color) => <Link2 size={15} color={color} strokeWidth={2} />,
  },
  {
    value: "TRUE_FALSE",
    label: "Đúng / Sai",
    icon: (color) => <ToggleLeft size={15} color={color} strokeWidth={2} />,
  },
];

type PracticeMode = "QUICK" | "STANDARD" | "FULL" | "CREATIVE";

const PRACTICE_MODES: {
  value: PracticeMode;
  label: string;
  description: string;
  icon: (color: string) => React.ReactNode;
  iconBgKey: "warning" | "info" | "error" | "purple";
  iconColorKey: "warning" | "info" | "error" | "purple";
}[] = [
  {
    value: "QUICK",
    label: "Khởi động",
    description: "5 câu thôi, không đau não đâu. Ôn xong còn kịp lướt TikTok!",
    icon: (color) => <Zap size={24} color={color} strokeWidth={2} />,
    iconBgKey: "warning",
    iconColorKey: "warning",
  },
  {
    value: "STANDARD",
    label: "Luyện tập",
    description: "10 câu – không quá chill, không quá mệt. Vừa đủ để não không phàn nàn.",
    icon: (color) => <BookOpen size={24} color={color} strokeWidth={2} />,
    iconBgKey: "info",
    iconColorKey: "info",
  },
  {
    value: "FULL",
    label: "Thử thách",
    description: "20 câu – dành cho ai tự nhận là simp của tiếng Nhật.",
    icon: (color) => <Flame size={24} color={color} strokeWidth={2} />,
    iconBgKey: "error",
    iconColorKey: "error",
  },
  {
    value: "CREATIVE",
    label: "Sáng tạo",
    description: "Bạn là nhạc trưởng – tự lựa chọn nội dung theo ý muốn riêng",
    icon: (color) => <Palette size={24} color={color} strokeWidth={2} />,
    iconBgKey: "purple",
    iconColorKey: "purple",
  },
];

export function SessionConfigScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { lessonId, sessionType } = useLocalSearchParams<{
    lessonId: string;
    sessionType: SessionType;
  }>();

  const allowedItemTypes =
    SESSION_TYPE_ITEM_TYPES[sessionType] ?? EXERCISE_TYPES.map((e) => e.value);
  const [itemType, setItemType] = useState<ItemType>(allowedItemTypes[0]);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("QUICK");

  function handleStart() {
    if (practiceMode === "CREATIVE") {
      router.push({
        pathname: "/creative-selection",
        params: {
          lessonId,
          sessionType,
          itemTypes: JSON.stringify([itemType]),
        },
      });
    } else {
      router.push({
        pathname: "/practice-session",
        params: {
          lessonId,
          sessionType,
          itemTypes: JSON.stringify([itemType]),
          preset: practiceMode,
        },
      });
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View className="flex-1" style={{ paddingTop: insets.top + 8 }}>
        {/* Header */}
        <View
          className="flex-row items-center gap-2 px-4"
          style={{ height: 48, opacity: 0.9 }}
        >
          <Pressable
            onPress={() =>
              router.replace("/(tabs)/practice")
            }
            hitSlop={30}
          >
            <X size={24} color={theme.icon.primary} strokeWidth={2} />
          </Pressable>
          <Text
            className="font-heading"
            style={{ fontSize: 18, color: theme.text.primary }}
          >
            Thiết lập bài luyện tập
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Dạng bài tập */}
          <View className="gap-2">
            <Text
              className="font-heading"
              style={{ fontSize: 14, color: theme.text.primary }}
            >
              Dạng bài tập
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                columnGap: 16,
                rowGap: 8,
              }}
            >
              {EXERCISE_TYPES.filter((e) =>
                allowedItemTypes.includes(e.value),
              ).map((item) => {
                const isSelected = itemType === item.value;
                const iconColor = isSelected
                  ? theme.icon.onBrand
                  : theme.text.primary;
                const textColor = isSelected
                  ? theme.text.onBrand
                  : theme.text.primary;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setItemType(item.value)}
                    className="flex-row items-center rounded-2xl"
                    style={{
                      width: "47%",
                      height: 43,
                      paddingHorizontal: 15,
                      gap: 8,
                      backgroundColor: isSelected
                        ? theme.brand.primary
                        : theme.border.subtle,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? theme.brand.primary
                        : theme.border.subtle,
                    }}
                  >
                    {item.icon(iconColor)}
                    <Text
                      className="font-body text-xs flex-1"
                      style={{ color: textColor }}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Mẫu bài tập */}
          <View className="gap-2">
            <Text
              className="font-heading"
              style={{ fontSize: 14, color: theme.text.primary }}
            >
              Mẫu bài tập
            </Text>

            <View style={{ gap: 10 }}>
              {PRACTICE_MODES.map((mode) => {
                const isSelected = practiceMode === mode.value;
                const iconBg = theme[mode.iconBgKey].subtle;
                const iconColor = theme.icon[mode.iconColorKey];
                return (
                  <Pressable
                    key={mode.value}
                    onPress={() => setPracticeMode(mode.value)}
                    style={{
                      backgroundColor: theme.background.surface,
                      borderWidth: isSelected ? 1.23 : 1,
                      borderColor: isSelected
                        ? theme.brand.primary
                        : theme.border.subtle,
                      borderRadius: 14,
                      padding: isSelected ? 1.23 : 0.615,
                      ...(isSelected && Platform.OS === "ios"
                        ? {
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            shadowOffset: { width: 0, height: 1 },
                          }
                        : isSelected
                          ? { elevation: 2 }
                          : {}),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                      }}
                    >
                      {/* Icon */}
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          backgroundColor: iconBg,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {mode.icon(iconColor)}
                      </View>

                      {/* Text */}
                      <View style={{ flex: 1 }}>
                        <Text
                          className="font-body"
                          style={{
                            fontSize: 15,
                            lineHeight: 22.5,
                            color: isSelected
                              ? theme.brand.primary
                              : theme.text.primary,
                          }}
                        >
                          {mode.label}
                        </Text>
                        <Text
                          className="font-body"
                          style={{
                            fontSize: 11,
                            lineHeight: 15.4,
                            color: theme.text.secondary,
                          }}
                        >
                          {mode.description}
                        </Text>
                      </View>

                      {/* Radio */}
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          borderWidth: 1.846,
                          borderColor: isSelected
                            ? theme.brand.primary
                            : theme.icon.disabled,
                          backgroundColor: theme.background.surface,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isSelected && (
                          <View
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: 5.5,
                              backgroundColor: theme.brand.primary,
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* bottom spacing */}
          <View style={{ height: 8 }} />
        </ScrollView>

        {/* CTA */}
        <View
          className="px-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            paddingTop: 12,
          }}
        >
          <PrimaryButton text="Tiếp tục" onPress={handleStart} />
        </View>
      </View>
    </View>
  );
}
