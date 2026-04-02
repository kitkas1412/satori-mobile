// Màn hình chính của tính năng Ôn tập.
// Hiển thị hai tab: "Bài tập GV" (danh sách bài tập từ giáo viên) và "Ôn luyện AI" (banner AI).

import { Bell, BookOpen, Sparkles } from "lucide-react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { ChatbotFab } from "@/features/chatbot/components";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProfile } from "@/hooks/api/use-profile";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ScreenHeader } from "@/components/ui/screen-header";
import { AssignmentCard } from "@/features/assignment/components/assignment-card";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import {
  useAssignments,
  useAssignmentNavigation,
} from "@/features/assignment/hooks";
import { LessonCard, SessionConfigSheet } from "@/features/practice-with-ai/components";
import { useLessons } from "@/features/practice-with-ai/hooks";
import type {
  AssignmentStatusFilter,
  Content,
} from "@/features/assignment/api";
import type { Lesson, SessionConfig } from "@/features/practice-with-ai/api";

type ActiveTab = "teacher" | "ai";

const STATUS_FILTERS: { label: string; value: AssignmentStatusFilter }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Chưa làm", value: "NOT_STARTED" },
  { label: "Đang làm", value: "IN_PROGRESS" },
  { label: "Đã nộp", value: "SUBMITTED" },
  { label: "Đã chấm", value: "GRADED" },
  { label: "Quá hạn", value: "OVERDUE" },
];

export default function PracticeTab() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ActiveTab>("teacher");
  const [activeStatus, setActiveStatus] =
    useState<AssignmentStatusFilter>(undefined);
  const [sheetLesson, setSheetLesson] = useState<Lesson | null>(null);
  const flatListRef = useRef<FlatList<Content | Lesson>>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAssignments(activeStatus);
  const { handleAssignmentPress, isLoadingSubmission } =
    useAssignmentNavigation();
  const { data: profile } = useProfile();
  const courseId = profile?.enrolledClasses[0]?.courseId;
  const {
    data: lessons,
    isLoading: isLoadingLessons,
    isError: isErrorLessons,
  } = useLessons(courseId);

  const assignments = data?.pages.flatMap((p) => p.content) ?? [];

  if (user?.status === "INACTIVE") {
    return (
      <View className="flex-1 bg-background-default items-center justify-center px-8">
        <StatusBar style="dark" />
        <Text className="font-body text-base text-text-muted text-center">
          Tính năng đang tạm khoá. Vui lòng thử lại sau
        </Text>
      </View>
    );
  }

  // Biểu tượng chuông thông báo
  const bellAction = (
    <View className="relative">
      <View
        className="w-9 h-9 rounded-full items-center justify-center"
        style={{ backgroundColor: theme.icon.disabled }}
      >
        <Bell size={20} color={theme.icon.onBrand} strokeWidth={2} />
      </View>
    </View>
  );

  const listHeader = (
    <>
      {/* Tiêu đề màn hình */}
      <ScreenHeader
        title="Luyện tập"
        rightAction={bellAction}
        paddingTop={insets.top + 16}
      />

      {/* Thanh chuyển đổi tab GV / AI */}
      <View
        className="border mx-4 flex-row rounded-2xl p-1 mb-3"
        style={{
          backgroundColor: theme.background.surface,
          borderWidth: 1,
          borderColor: theme.border.subtle,
        }}
      >
        <Pressable
          onPress={() => setActiveTab("teacher")}
          className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
          style={
            activeTab === "teacher"
              ? { backgroundColor: theme.brand.primary }
              : { backgroundColor: theme.background.surface }
          }
        >
          <BookOpen
            size={20}
            color={
              activeTab === "teacher" ? theme.icon.onBrand : theme.icon.primary
            }
            strokeWidth={2}
          />
          <Text
            className="font-heading text-base"
            style={{
              color:
                activeTab === "teacher"
                  ? theme.text.onBrand
                  : theme.text.primary,
            }}
          >
            Bài tập
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("ai");
            setActiveStatus(undefined);
          }}
          className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
          style={
            activeTab === "ai"
              ? { backgroundColor: theme.brand.primary }
              : { backgroundColor: theme.background.surface }
          }
        >
          <Sparkles
            size={20}
            color={activeTab === "ai" ? theme.icon.onBrand : theme.icon.primary}
            strokeWidth={2}
          />
          <Text
            className="font-heading text-base"
            style={{
              color:
                activeTab === "ai" ? theme.icon.onBrand : theme.icon.primary,
            }}
          >
            Luyện tập AI
          </Text>
        </Pressable>
      </View>

      {activeTab === "teacher" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          style={{ marginBottom: 12 }}
        >
          {STATUS_FILTERS.map((filter) => {
            const isActive = activeStatus === filter.value;
            return (
              <Pressable
                key={filter.label}
                onPress={() => {
                  setActiveStatus(filter.value);
                  flatListRef.current?.scrollToOffset({
                    offset: 0,
                    animated: false,
                  });
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive
                    ? theme.brand.primary
                    : theme.background.surface,
                  borderWidth: 1,
                  borderColor: isActive
                    ? theme.brand.primary
                    : theme.border.subtle,
                }}
              >
                <Text
                  className="font-body text-sm"
                  style={{
                    color: isActive ? theme.text.onBrand : theme.text.secondary,
                  }}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

    </>
  );

  const listFooter =
    activeTab === "teacher" && isFetchingNextPage ? (
      <ActivityIndicator
        size="small"
        color={theme.brand.primary}
        style={{ marginVertical: 16 }}
      />
    ) : null;

  const listEmpty =
    activeTab === "teacher" ? (
      <View className="px-4">
        {isError ? (
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            Không thể tải bài tập. Vui lòng thử lại.
          </Text>
        ) : (
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            Chưa có bài tập nào.
          </Text>
        )}
      </View>
    ) : activeTab === "ai" && !isLoadingLessons ? (
      <View className="px-4">
        {isErrorLessons ? (
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            Không thể tải bài học. Vui lòng thử lại.
          </Text>
        ) : (
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            Chưa có bài học nào.
          </Text>
        )}
      </View>
    ) : null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <FlatList<Content | Lesson>
        ref={flatListRef}
        data={activeTab === "teacher" ? assignments : (lessons ?? [])}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            {activeTab === "teacher" ? (
              <AssignmentCard
                {...mapAssignmentToCardProps(item as Content)}
                onPress={() => handleAssignmentPress(item as Content)}
              />
            ) : (
              <LessonCard
                title={(item as Lesson).title}
                vocabularyCount={(item as Lesson).vocabularyCount}
                grammarPointCount={(item as Lesson).grammarPointCount}
                onPress={() => setSheetLesson(item as Lesson)}
              />
            )}
          </View>
        )}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ListEmptyComponent={listEmpty}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Overlay loading khi đang tải lần đầu */}
      <LoadingOverlay visible={isLoading} title="Đang tải bài tập..." />
      {/* Overlay loading khi đang tải kết quả bài đã nộp */}
      <LoadingOverlay
        visible={isLoadingSubmission}
        title="Đang tải kết quả..."
      />
      {/* Overlay loading khi đang tải danh sách bài học AI */}
      <LoadingOverlay
        visible={activeTab === "ai" && isLoadingLessons}
        title="Đang tải bài học..."
      />
      <SessionConfigSheet
        visible={sheetLesson !== null}
        lesson={sheetLesson}
        onClose={() => setSheetLesson(null)}
        onStart={(config: SessionConfig) => {
          const lesson = sheetLesson;
          setSheetLesson(null);
          router.push({
            pathname: "/practice-session",
            params: {
              lessonId: lesson!.id,
              sessionType: config.sessionType,
              questionCount: String(config.questionCount),
            },
          });
        }}
      />
      <ChatbotFab />
    </View>
  );
}
