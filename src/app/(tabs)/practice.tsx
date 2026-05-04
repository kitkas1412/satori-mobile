import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
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

export default function PracticeTab() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [sheetLesson, setSheetLesson] = useState<LessonResponse | null>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { hasUnread } = useUnreadNotificationsCount();
  const courseId = profile?.enrolledClasses[0]?.courseId;

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
        await Promise.all([refetchLessons(), refetchProfile()]);
        setIsFocusRefetching(false);
      };
      refetch();
    }, [refetchLessons, refetchProfile]),
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchLessons(), refetchProfile()]);
    setRefreshing(false);
  };

  const blockedMessage = (() => {
    if (profile?.status !== "ACTIVE")
      return "Bạn chưa có lớp. Vui lòng thử lại sau";
    const classStatus = profile?.enrolledClasses[0]?.status;
    if (classStatus === "not_started")
      return "Lớp của bạn chưa bắt đầu. Vui lòng thử lại sau";
    return null;
  })();

  const listEmpty = !isLoadingLessons ? (
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

      <ScreenHeader
        title="Luyện tập với AI"
        rightAction={
          <BellButton
            hasUnread={hasUnread}
            onPress={() => router.push("/notifications")}
          />
        }
        paddingTop={insets.top + 16}
      />

      <FlatList<LessonResponse>
        data={blockedMessage ? [] : (lessons ?? [])}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <LessonCard
              title={item.title}
              vocabularyCount={item.vocabularyCount}
              grammarPointCount={item.grammarPointCount}
              onPress={() => setSheetLesson(item)}
            />
          </View>
        )}
        ListEmptyComponent={listEmpty}
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

      <LoadingOverlay
        visible={isFocused && isFocusRefetching}
        title="Đang tải..."
      />
      <LoadingOverlay
        visible={isFocused && isLoadingLessons}
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
