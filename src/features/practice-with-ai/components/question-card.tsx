import { Lightbulb } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors, Primitive } from "@/constants/theme";
import type { ItemType } from "../api/practice-with-ai.types";

type Theme = typeof Colors.light;

const ITEM_TYPE_LABEL: Partial<Record<ItemType, string>> = {
  MULTIPLE_CHOICE: "Trắc nghiệm",
  FILL_BLANK: "Điền vào chỗ trống",
};

export interface QuestionCardProps {
  itemType: ItemType;
  question: string;
  hint?: string;
  showHint: boolean;
  onToggleHint: () => void;
  theme: Theme;
}

export function QuestionCard({
  itemType,
  question,
  hint,
  showHint,
  onToggleHint,
  theme,
}: QuestionCardProps) {
  const displayQuestion =
    itemType === "FILL_BLANK"
      ? "Điền từ thích hợp vào chỗ trống để hoàn thành câu"
      : question;

  return (
    <View
      style={{
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 21,
        gap: 14,
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: theme.border.subtle,
      }}
    >
      {/* Item type label */}
      <View className="flex-row items-center gap-1.5">
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.brand.primary,
          }}
        />
        <Text
          className="font-body"
          style={{
            fontSize: 11,
            letterSpacing: 0.55,
            color: theme.text.secondary,
            textTransform: "uppercase",
          }}
        >
          {ITEM_TYPE_LABEL[itemType] ?? itemType}
        </Text>
      </View>

      {/* Question text */}
      <Text
        className="font-heading"
        style={{
          fontSize: 18,
          lineHeight: 26,
          color: theme.text.primary,
        }}
      >
        {displayQuestion}
      </Text>

      {/* Hint */}
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          onPress={onToggleHint}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Lightbulb size={14} color={Primitive.amber[300]} />
          <Text
            className="font-body text-xs"
            style={{ color: Primitive.amber[300] }}
          >
            {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
          </Text>
        </TouchableOpacity>
        {showHint && hint ? (
          <View
            style={{
              borderWidth: 0.5,
              borderColor: Primitive.amber[300],
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: theme.background.surface,
            }}
          >
            <Text
              className="font-body"
              style={{
                fontSize: 13,
                lineHeight: 19,
                color: Primitive.amber[300],
              }}
            >
              {hint}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
