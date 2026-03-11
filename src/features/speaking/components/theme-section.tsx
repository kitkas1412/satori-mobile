import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TopicCard } from "./topic-card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface ThemeSectionProps {
  lessonNumber: number;
  lessonTitle: string;
  lessonDescription: string;
  completedCount: number;
  totalCount: number;
  lessons: {
    id: string;
    title: string;
    subtitle: string;
    type: "pronunciation" | "stress" | "conversation";
    status: "completed" | "active" | "locked";
    practiced?: boolean;
  }[];
  defaultExpanded?: boolean;
  showFirstUnpracticedBorder?: boolean;
  onLessonPress?: (id: string) => void;
}

export function ThemeSection({
  lessonNumber,
  lessonTitle,
  lessonDescription,
  completedCount,
  totalCount,
  lessons,
  defaultExpanded = true,
  showFirstUnpracticedBorder = true,
  onLessonPress,
}: ThemeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const accentColor = lessonNumber % 2 === 0 ? theme.purple : theme.primary;

  return (
    <View className="gap-2">
      {/* Header */}
      <Pressable
        onPress={() => setIsExpanded((prev) => !prev)}
        className="gap-1"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-1 items-center">
            <View
              className="px-2 py-[2px] rounded-[3px]"
              style={{ backgroundColor: accentColor }}
            >
              <Text
                className="text-xs font-body"
                style={{ color: theme.textInverse }}
              >
                Bài {lessonNumber}
              </Text>
            </View>
            <Text
              className="text-xs font-body"
              style={{ color: theme.textMuted }}
            >
              {completedCount}/{totalCount} BÀI HỌC
            </Text>
          </View>
          {isExpanded ? (
            <ChevronDown size={24} color="hsl(215, 19%, 35%)" />
          ) : (
            <ChevronRight size={24} color="hsl(215, 19%, 35%)" />
          )}
        </View>
        <View>
          <Text
            className="text-xl font-bold font-heading"
            style={{ color: theme.textDefault }}
          >
            {lessonTitle}
          </Text>
          <Text
            className="text-sm font-body"
            style={{ color: theme.textMuted }}
          >
            {lessonDescription}
          </Text>
        </View>
      </Pressable>

      {/* Lesson Cards */}
      {isExpanded && (
        <View>
          {lessons.map((lesson, index) => {
            const firstUnpracticedIndex = showFirstUnpracticedBorder
              ? lessons.findIndex((l) => !l.practiced)
              : -1;
            const isFirstUnpracticed = index === firstUnpracticedIndex;
            return (
              <View key={lesson.id}>
                {index > 0 &&
                  !isFirstUnpracticed &&
                  index !== firstUnpracticedIndex + 1 && (
                    <View
                      style={{
                        marginHorizontal: 16,
                        height: 1,
                        backgroundColor: theme.border,
                      }}
                    />
                  )}
                <TopicCard
                  title={lesson.title}
                  subtitle={lesson.subtitle}
                  type={lesson.type}
                  status={lesson.status}
                  practiced={lesson.practiced}
                  showBorder={showFirstUnpracticedBorder && isFirstUnpracticed}
                  accentColor={accentColor}
                  onPress={() => onLessonPress?.(lesson.id)}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
