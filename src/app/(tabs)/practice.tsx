// Màn hình chính của tính năng Ôn tập.
// Hiển thị hai tab: "Bài tập GV" (danh sách bài tập từ giáo viên) và "Ôn luyện AI" (banner AI).

import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BookOpen, Sparkles } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import type {
  AssignmentStatusFilter,
  Content,
} from "@/features/assignment/api";
import { AssignmentCard } from "@/features/assignment/components/assignment-card";
import { AssignmentFilterBar } from "@/features/assignment/components/assignment-filter-bar";
import {
  useAssignmentNavigation,
  useAssignments,
  useClasses,
} from "@/features/assignment/hooks";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import { ChatbotFab } from "@/features/chatbot/components";
import type { LessonResponse } from "@/features/practice-with-ai/api";
import {
  LessonCard,
  SessionTypesModal,
} from "@/features/practice-with-ai/components";
import { useLessons } from "@/features/practice-with-ai/hooks";
import { useUnreadNotificationsCount } from "@/features/notification/hooks";
import { useProfile } from "@/features/profile-management/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ActiveTab = "teacher" | "ai";

export default function PracticeTab() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const isFocused = useIsFocused();
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
    useAssignmentNavigation((pathname, params) =>
      router.push({ pathname: pathname as any, params }),
    );
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { unreadCount, hasMore } = useUnreadNotificationsCount();
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

  const [isFocusRefetching, setIsFocusRefetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const refetch = async () => {
        setIsFocusRefetching(true);
        if (activeTab === "teacher") await refetchAssignments();
        else await Promise.all([refetchLessons(), refetchProfile()]);
        setIsFocusRefetching(false);
      };
      refetch();
    }, [activeTab, refetchAssignments, refetchLessons, refetchProfile]),
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "teacher") await refetchAssignments();
    else await refetchLessons();
    await refetchProfile();
    setRefreshing(false);
  };

  const assignments = data?.pages.flatMap((p) => p.content) ?? [];

  const blockedMessage = (() => {
    if (profile?.status !== "ACTIVE")
      return "Bạn chưa có lớp. Vui lòng thử lại sau";
    const classStatus = profile?.enrolledClasses[0]?.status;
    if (classStatus === "not_started")
      return "Lớp của bạn chưa bắt đầu. Vui lòng thử lại sau";
    return null;
  })();

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
        {blockedMessage ? (
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            {blockedMessage}
          </Text>
        ) : isErrorLessons ? (
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
        rightAction={
          <BellButton
            badgeCount={unreadCount}
            showPlus={hasMore}
            onPress={() => router.push("/notifications")}
          />
        }
        paddingTop={insets.top + 16}
      />

      <FlatList<Content | LessonResponse>
        ref={flatListRef}
        data={
          activeTab === "teacher"
            ? assignments
            : blockedMessage
              ? []
              : (lessons ?? [])
        }
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
      <LoadingOverlay
        visible={isFocused && isLoading}
        title="Đang tải bài tập..."
      />
      {/* Overlay loading khi focus lại tab */}
      <LoadingOverlay
        visible={isFocused && isFocusRefetching}
        title="Đang tải..."
      />
      {/* Overlay loading khi đang tải kết quả bài đã nộp */}
      <LoadingOverlay
        visible={isFocused && isLoadingSubmission}
        title="Đang tải kết quả..."
      />
      {/* Overlay loading khi đang tải danh sách bài học AI */}
      <LoadingOverlay
        visible={isFocused && activeTab === "ai" && isLoadingLessons}
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
      {!blockedMessage && <ChatbotFab />}
    </View>
  );
}
