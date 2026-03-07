import { ChevronDown, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LessonCard } from "./lesson-card";

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
  badgeColor: string;
  defaultExpanded?: boolean;
}

export function LessonSection({
  lessonNumber,
  lessonTitle,
  lessonDescription,
  completedCount,
  totalCount,
  lessons,
  badgeColor,
  defaultExpanded = true,
}: LessonSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
              style={{ backgroundColor: badgeColor }}
            >
              <Text className="text-text-inverse text-xs font-body">
                Bài {lessonNumber}
              </Text>
            </View>
            <Text className="text-text-muted text-xs font-body">
              {completedCount}/{totalCount} BÀI HỌC
            </Text>
          </View>
          {isExpanded ? (
            <ChevronDown size={24} color="#475569" />
          ) : (
            <ChevronRight size={24} color="#475569" />
          )}
        </View>
        <View>
          <Text className="text-text-main text-xl font-bold font-heading">
            {lessonTitle}
          </Text>
          <Text className="text-text-muted text-sm font-body">
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
              accentColor={badgeColor}
            />
          ))}
        </View>
      )}
    </View>
  );
}
