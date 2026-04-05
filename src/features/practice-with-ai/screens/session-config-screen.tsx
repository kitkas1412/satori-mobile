// Màn hình thiết lập bài luyện tập: chọn dạng bài tập và số câu hỏi.
// Nhận lessonId + sessionType từ route params, điều hướng sang practice-session khi bắt đầu.

import {
  ArrowUpDown,
  CheckSquare,
  Languages,
  Link2,
  PenLine,
  ToggleLeft,
  X,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [questionCount, setQuestionCount] = useState("5");
  const questionInputRef = useRef<TextInput>(null);

  function handleCountChange(text: string) {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned === "") {
      setQuestionCount("");
      return;
    }
    const num = parseInt(cleaned, 10);
    setQuestionCount(num > 20 ? "20" : cleaned);
  }

  function handleStart() {
    const count = parseInt(questionCount || "5", 10);
    const safeCount = Math.max(1, Math.min(20, count));
    router.push({
      pathname: "/practice-session",
      params: {
        lessonId,
        sessionType,
        questionCount: String(safeCount),
        itemTypes: JSON.stringify([itemType]),
      },
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: theme.background.page }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <View className="flex-1" style={{ paddingTop: insets.top + 8 }}>
        {/* Header */}
        <View className="flex-row items-center px-4" style={{ height: 48 }}>
          <Pressable onPress={() => router.back()} hitSlop={30}>
            <X size={24} color={theme.icon.primary} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 gap-4" style={{ marginTop: 8 }}>
          {/* Title */}
          <Text
            className="font-heading"
            style={{ fontSize: 18, color: theme.text.primary }}
          >
            Thiết lập bài luyện tập
          </Text>

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
                gap: 8,
              }}
            >
              {EXERCISE_TYPES.filter((e) =>
                allowedItemTypes.includes(e.value),
              ).map((item) => {
                const isSelected = itemType === item.value;
                const iconColor = isSelected
                  ? theme.text.onBrand
                  : theme.text.disabled;
                const textColor = isSelected
                  ? theme.text.onBrand
                  : theme.text.disabled;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setItemType(item.value)}
                    className="flex-row items-center rounded-2xl"
                    style={{
                      width: "48%",
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

          {/* Số câu hỏi */}
          <View
            className="flex-row items-center justify-between"
            style={{ paddingVertical: 3, paddingHorizontal: 9 }}
          >
            <Text
              className="font-heading"
              style={{ fontSize: 14, color: theme.text.primary }}
            >
              Số câu hỏi
            </Text>

            <Pressable
              className="rounded-lg items-center justify-center"
              onPress={() => questionInputRef.current?.focus()}
              style={{
                width: 80,
                borderWidth: 1,
                borderColor: theme.brand.primary,
                backgroundColor: theme.info.subtle,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <TextInput
                ref={questionInputRef}
                value={questionCount}
                onChangeText={handleCountChange}
                keyboardType="number-pad"
                textAlign="right"
                className="font-heading"
                style={{
                  fontSize: 14,
                  color: theme.brand.primary,
                  padding: 0,
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* CTA */}
        <View
          className="px-4"
          style={{
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            paddingTop: 12,
          }}
        >
          <PrimaryButton text="Bắt đầu luyện tập" onPress={handleStart} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
