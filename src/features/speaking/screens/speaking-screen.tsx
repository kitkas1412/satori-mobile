import { Bell } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, ScreenHeader } from "@/components/ui";

import {
  ConversationBanner,
  ThemeSection,
} from "@/features/speaking/components";
import { useAuthStore } from "@/stores";
import {
  useConversationThemes,
  useThemeTopics,
} from "@/features/speaking/hooks";
import type { Content } from "@/features/speaking/api";

function TopicSection({
  section,
  defaultExpanded,
  showFirstUnpracticedBorder,
  onHasUnpracticed,
}: {
  section: Content;
  defaultExpanded: boolean;
  showFirstUnpracticedBorder: boolean;
  onHasUnpracticed: (sectionId: string, orderIndex: number) => void;
}) {
  const router = useRouter();
  const { data: topics } = useThemeTopics(section.id);

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
      practiced: topic.practiced,
    })) ?? [];

  const hasUnpracticed = topics?.some((t) => !t.practiced) ?? false;

  useEffect(() => {
    if (hasUnpracticed) {
      onHasUnpracticed(section.id, section.orderIndex);
    }
  }, [hasUnpracticed, section.id, section.orderIndex, onHasUnpracticed]);

  function handleLessonPress(id: string) {
    const topic = topics?.find((t) => t.id === id);
    if (!topic) return;
    router.push({
      pathname: "/topic-detail",
      params: { topicId: topic.id },
    });
  }

  return (
    <ThemeSection
      lessonNumber={section.orderIndex}
      lessonTitle={section.title}
      lessonDescription={section.descriptionVi}
      completedCount={0}
      totalCount={section.topicCount}
      lessons={lessons}
      defaultExpanded={defaultExpanded}
      showFirstUnpracticedBorder={showFirstUnpracticedBorder}
      onLessonPress={handleLessonPress}
    />
  );
}

export function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data: sections, isLoading, isError } = useConversationThemes();

  const [firstUnpracticedSectionId, setFirstUnpracticedSectionId] = useState<string | null>(null);
  const firstUnpracticedOrderIndexRef = useRef<number>(Infinity);

  const handleHasUnpracticed = useCallback((sectionId: string, orderIndex: number) => {
    if (orderIndex < firstUnpracticedOrderIndexRef.current) {
      firstUnpracticedOrderIndexRef.current = orderIndex;
      setFirstUnpracticedSectionId(sectionId);
    }
  }, []);

  return (
    <>
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <ScreenHeader
        title="Luyện nói"
        paddingTop={insets.top + 16}
        rightAction={
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
        }
      />

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
              showFirstUnpracticedBorder={
                firstUnpracticedSectionId === null ||
                firstUnpracticedSectionId === section.id
              }
              onHasUnpracticed={handleHasUnpracticed}
            />
          ))}
        </ScrollView>
      )}
    </View>
      <LoadingOverlay visible={isLoading} title="Đang tải..." />
    </>
  );
}
