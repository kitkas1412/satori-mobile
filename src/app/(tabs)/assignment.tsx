import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
import { AssignmentCard, AssignmentFilterBar } from "@/features/assignment/components";
import {
  useAssignmentNavigation,
  useAssignments,
  useClasses,
} from "@/features/assignment/hooks";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import { ChatbotFab } from "@/features/chatbot/components";
import { useUnreadNotificationsCount } from "@/features/notification/hooks";
import { useLessons } from "@/features/practice-with-ai/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProfile } from "@/features/profile-management/hooks";

export default function AssignmentTab() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [activeStatus, setActiveStatus] =
    useState<AssignmentStatusFilter>(undefined);
  const flatListRef = useRef<FlatList<Content>>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [activeClassId, setActiveClassId] = useState<string | undefined>(
    undefined,
  );
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(undefined);
  const { handleAssignmentPress, isLoadingSubmission } =
    useAssignmentNavigation((pathname, params) =>
      router.push({ pathname: pathname as any, params }),
    );
  const { hasUnread } = useUnreadNotificationsCount();
  const { data: classes } = useClasses();
  const { data: profile } = useProfile();
  const courseId = profile?.enrolledClasses[0]?.courseId;
  const { data: lessons } = useLessons(courseId);

  useEffect(() => {
    if (classes?.[0]?.id && activeClassId === undefined) {
      setActiveClassId(classes[0].id);
    }
  }, [classes]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchAssignments,
  } = useAssignments(activeStatus, activeClassId, activeLessonId);

  const [isFocusRefetching, setIsFocusRefetching] = useState(false);

  useFocusEffect(() => {
    const refetch = async () => {
      setIsFocusRefetching(true);
      await refetchAssignments();
      setIsFocusRefetching(false);
    };
    refetch();
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAssignments();
    setRefreshing(false);
  };

  const assignments = data?.pages.flatMap((p) => p.content) ?? [];

  const listHeader = (
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
      lessonId={activeLessonId}
      onLessonChange={(id) => {
        setActiveLessonId(id);
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }}
      lessons={lessons ?? []}
    />
  );

  const listFooter = isFetchingNextPage ? (
    <ActivityIndicator
      size="small"
      color={theme.brand.primary}
      style={{ marginVertical: 16 }}
    />
  ) : null;

  const listEmpty = (
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
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScreenHeader
        title="Bài tập"
        rightAction={
          <BellButton
            hasUnread={hasUnread}
            onPress={() => router.push("/notifications")}
          />
        }
        paddingTop={insets.top + 16}
      />

      <FlatList<Content>
        ref={flatListRef}
        data={assignments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <AssignmentCard
              {...mapAssignmentToCardProps(item)}
              onPress={() => handleAssignmentPress(item)}
            />
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

      <LoadingOverlay
        visible={isFocused && (isLoading || (isFetching && !isFetchingNextPage))}
        title="Đang tải bài tập..."
      />
      <LoadingOverlay
        visible={isFocused && isFocusRefetching}
        title="Đang tải..."
      />
      <LoadingOverlay
        visible={isFocused && isLoadingSubmission}
        title="Đang tải kết quả..."
      />
      <ChatbotFab />
    </View>
  );
}
