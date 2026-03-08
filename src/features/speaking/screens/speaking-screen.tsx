import { Bell } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

import {
  ConversationBanner,
  LessonSection,
} from "@/features/speaking/components";
import { useAuthStore } from "@/stores";
import { useLessonSections, useTopicsByTheme } from "@/features/speaking/hooks";
import type { LessonSectionItem } from "@/features/speaking/api";

function TopicSection({
  section,
  defaultExpanded,
}: {
  section: LessonSectionItem;
  defaultExpanded: boolean;
}) {
  const { data: topics } = useTopicsByTheme(section.id);

  const difficultyLabel = (score: number) => {
    if (score === 1) return "Dễ";
    if (score === 2) return "Trung Bình";
    return "Khó";
  };

  const lessons =
    topics?.map((topic) => ({
      id: topic.id,
      title: topic.title,
      subtitle: difficultyLabel(topic.difficultyScore),
      type: topic.isRoleplay
        ? ("conversation" as const)
        : ("pronunciation" as const),
      status: "active" as const,
    })) ?? [];

  return (
    <LessonSection
      lessonNumber={section.orderIndex}
      lessonTitle={section.title}
      lessonDescription={section.descriptionVi}
      completedCount={0}
      totalCount={section.topicCount}
      lessons={lessons}
      defaultExpanded={defaultExpanded}
    />
  );
}

export function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data: sections, isLoading, isError } = useLessonSections();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text
          className="text-xl font-heading"
          style={{ color: theme.textDefault }}
        >
          Luyện nói
        </Text>
        <View className="relative">
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.secondary }}
          >
            <Bell size={20} fill={theme.white} color={theme.white} />
          </View>
          <View
            className="absolute top-0 right-0 w-[7px] h-[7px] rounded-full"
            style={{ backgroundColor: theme.error }}
          />
        </View>
      </View>

      {user?.status === "INACTIVE" ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text
            className="text-base text-center font-body"
            style={{ color: theme.textDefault }}
          >
            Tính năng đang tạm khoá. Vui lòng thử lại sau
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-8 gap-4"
          showsVerticalScrollIndicator={false}
        >
          <ConversationBanner />

          {isLoading && (
            <ActivityIndicator
              size="large"
              color={theme.primary}
              className="mt-4"
            />
          )}

          {isError && (
            <Text
              className="text-sm font-body text-center mt-4"
              style={{ color: theme.textMuted }}
            >
              Không thể tải dữ liệu. Vui lòng thử lại sau.
            </Text>
          )}

          {sections?.map((section, index) => (
            <TopicSection
              key={section.id}
              section={section}
              defaultExpanded={index === 0}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
