// Card hiển thị thông tin tóm tắt của một bài học trong danh sách Luyện tập AI.

import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export interface LessonCardProps {
  title: string;
  vocabularyCount: number;
  grammarPointCount: number;
  onPress?: () => void;
}

export function LessonCard({
  title,
  vocabularyCount,
  grammarPointCount,
  onPress,
}: LessonCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-6 flex-row items-center justify-between"
      style={{
        backgroundColor: theme.border.subtle,
        borderWidth: 2,
        borderColor: theme.border.default,
      }}
    >
      <View className="flex-1 gap-1">
        <Text
          className="font-heading text-base"
          style={{ color: theme.text.primary }}
        >
          {title}
        </Text>
        <Text
          className="font-body text-sm"
          style={{ color: theme.text.secondary }}
        >
          {vocabularyCount} từ vựng · {grammarPointCount} ngữ pháp
        </Text>
      </View>
      <ChevronRight size={18} color={theme.icon.secondary} strokeWidth={2} />
    </Pressable>
  );
}
