// Màn hình chính của tính năng Ôn tập.
// Hiển thị hai tab: "Bài tập GV" (danh sách bài tập từ giáo viên) và "Ôn luyện AI" (banner AI).

import { BookOpen, Sparkles } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
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
import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { AssignmentCard } from "@/features/assignment/components/assignment-card";
import { AssignmentFilterBar } from "@/features/assignment/components/assignment-filter-bar";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import {
  useAssignments,
  useAssignmentNavigation,
  useClasses,
} from "@/features/assignment/hooks";
import {
  LessonCard,
  SessionTypesModal,
} from "@/features/practice-with-ai/components";
import { useLessons } from "@/features/practice-with-ai/hooks";
import type {
  AssignmentStatusFilter,
  Content,
} from "@/features/assignment/api";
import type { LessonResponse } from "@/features/practice-with-ai/api";

type ActiveTab = "teacher" | "ai";

export default function PracticeTab() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ActiveTab>("teacher");

  useEffect(() => {
    if (tab === "ai") setActiveTab("ai");
  }, [tab]);
  const [activeStatus, setActiveStatus] =
    useState<AssignmentStatusFilter>(undefined);
  const [sheetLesson, setSheetLesson] = useState<LessonResponse | null>(null);
  const flatListRef = useRef<FlatList<Content | LessonResponse>>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [activeClassId, setActiveClassId] = useState<string | undefined>(
    undefined,
  );
  const { handleAssignmentPress, isLoadingSubmission } =
    useAssignmentNavigation();
  const { data: profile } = useProfile();
  const { data: classes } = useClasses();
  const courseId = profile?.enrolledClasses[0]?.courseId;

  // Set default class từ API khi data load xong lần đầu
  useEffect(() => {
    if (classes?.[0]?.id && activeClassId === undefined) {
      setActiveClassId(classes[0].id);
    }
  }, [classes]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAssignments,
  } = useAssignments(activeStatus, activeClassId);
  const {
    data: lessons,
    isLoading: isLoadingLessons,
    isError: isErrorLessons,
    refetch: refetchLessons,
  } = useLessons(courseId);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "teacher") await refetchAssignments();
    else await refetchLessons();
    setRefreshing(false);
  };

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

  const listHeader = (
    <>
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
        <AssignmentFilterBar
          status={activeStatus}
          onStatusChange={(s) => {
            setActiveStatus(s);
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          }}
          classId={activeClassId}
          onClassChange={(id) => {
            setActiveClassId(id);
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
          }}
          classes={classes ?? []}
        />
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

      {/* Tiêu đề màn hình — nằm ngoài FlatList để không scroll */}
      <ScreenHeader
        title="Luyện tập"
        rightAction={<BellButton />}
        paddingTop={insets.top + 16}
      />

      <FlatList<Content | LessonResponse>
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
                title={(item as LessonResponse).title}
                vocabularyCount={(item as LessonResponse).vocabularyCount}
                grammarPointCount={(item as LessonResponse).grammarPointCount}
                onPress={() => setSheetLesson(item as LessonResponse)}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.brand.primary]}
            tintColor={theme.brand.primary}
          />
        }
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
      <SessionTypesModal
        visible={sheetLesson !== null}
        lesson={sheetLesson}
        onClose={() => setSheetLesson(null)}
        onNext={(sessionType) => {
          const lesson = sheetLesson;
          setSheetLesson(null);
          setTimeout(() => {
            router.push({
              pathname: "/session-config",
              params: { lessonId: lesson!.id, sessionType },
            });
          }, 350);
        }}
      />
      <ChatbotFab />
    </View>
  );
}
