import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AiBanner, LessonSection } from "@/features/practice/components";

// Mock data - replace with real data from API
const lessonsData = [
  {
    id: "1",
    lessonNumber: 1,
    lessonTitle: "TÊN BÀI HỌC",
    lessonDescription: "Mô tả chủ đề",
    completedCount: 0,
    totalCount: 6,
    badgeColor: "#3b82f6", // info
    lessons: [
      {
        id: "1-1",
        title: "Bài học 1 - Tên chủ đề",
        subtitle: "Phát âm",
        type: "pronunciation" as const,
        status: "completed" as const,
      },
      {
        id: "1-2",
        title: "Bài học 1 - Tên chủ đề",
        subtitle: "Nhấn âm",
        type: "stress" as const,
        status: "active" as const,
      },
      {
        id: "1-3",
        title: "Bài học 2 - Tên chủ đề",
        subtitle: "Cuộc hội thoại",
        type: "conversation" as const,
        status: "locked" as const,
      },
    ],
  },
  {
    id: "2",
    lessonNumber: 2,
    lessonTitle: "TÊN BÀI HỌC",
    lessonDescription: "Mô tả chủ đề",
    completedCount: 0,
    totalCount: 6,
    badgeColor: "#b185db", // tertiary
    lessons: [
      {
        id: "2-1",
        title: "Bài học 1 - Tên chủ đề",
        subtitle: "Phát âm",
        type: "pronunciation" as const,
        status: "completed" as const,
      },
      {
        id: "2-2",
        title: "Bài học 1 - Tên chủ đề",
        subtitle: "Nhấn âm",
        type: "stress" as const,
        status: "active" as const,
      },
      {
        id: "2-3",
        title: "Bài học 2 - Tên chủ đề",
        subtitle: "Cuộc hội thoại",
        type: "conversation" as const,
        status: "locked" as const,
      },
    ],
  },
];

export default function ConversationPracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-default">
      <StatusBar style="dark" hidden={true} />

      {/* Header */}
      <View
        className="px-4 flex-row items-center gap-2 h-12"
        style={{ paddingTop: insets.top }}
      >
        <Pressable
          className="w-6 h-12 justify-center"
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#475569" strokeWidth={2} />
        </Pressable>
        <Text className="text-text-muted text-xl font-bold font-heading">
          Luyện hội thoại
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-2 pb-8 gap-4"
      >
        {/* AI Banner */}
        <AiBanner />

        {/* Lesson Sections */}
        {lessonsData.map((section) => (
          <LessonSection
            key={section.id}
            lessonNumber={section.lessonNumber}
            lessonTitle={section.lessonTitle}
            lessonDescription={section.lessonDescription}
            completedCount={section.completedCount}
            totalCount={section.totalCount}
            lessons={section.lessons}
            badgeColor={section.badgeColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}
