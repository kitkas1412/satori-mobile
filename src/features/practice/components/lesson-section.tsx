import { Text, View } from "react-native";
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
}

export function LessonSection({
  lessonNumber,
  lessonTitle,
  lessonDescription,
  completedCount,
  totalCount,
  lessons,
  badgeColor,
}: LessonSectionProps) {
  return (
    <View className="gap-2">
      {/* Header */}
      <View className="gap-1">
        <View className="flex-row gap-1 items-center">
          <View
            className="px-1 rounded-[3px]"
            style={{ backgroundColor: badgeColor }}
          >
            <Text className="text-[#f3f4f6] text-tiny-xs font-body">
              Bài {lessonNumber}
            </Text>
          </View>
          <Text className="text-text-muted text-tiny-xs font-body">
            {completedCount}/{totalCount} BÀI HỌC
          </Text>
        </View>
        <View>
          <Text className="text-text-muted text-xs font-bold font-heading">
            {lessonTitle}
          </Text>
          <Text className="text-text-muted text-tiny-xs font-body">
            {lessonDescription}
          </Text>
        </View>
      </View>

      {/* Lesson Cards */}
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
    </View>
  );
}
