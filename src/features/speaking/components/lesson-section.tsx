import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LessonCard } from "./lesson-card";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface LessonSectionProps {
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
  }[];
  defaultExpanded?: boolean;
  onLessonPress?: (id: string) => void;
}

export function LessonSection({
  lessonNumber,
  lessonTitle,
  lessonDescription,
  completedCount,
  totalCount,
  lessons,
  defaultExpanded = true,
  onLessonPress,
}: LessonSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
              style={{ backgroundColor: theme.primary }}
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
        <View className="gap-2">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              subtitle={lesson.subtitle}
              type={lesson.type}
              status={lesson.status}
              onPress={() => onLessonPress?.(lesson.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
