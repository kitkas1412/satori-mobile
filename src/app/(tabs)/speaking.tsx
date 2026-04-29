// Màn hình chính của feature Luyện nói.
// Hiển thị banner free-talk và danh sách các section (chủ đề) để người dùng chọn luyện tập.
// Tự động highlight section đầu tiên còn topic chưa được luyện.

import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";
import { useUnreadNotificationsCount } from "@/features/notification/hooks";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatbotFab } from "@/features/chatbot/components";
import { useProfile } from "@/features/profile-management/hooks";
import type { Topic } from "@/features/speaking/api";
import {
  ConversationBanner,
  TopicSection,
} from "@/features/speaking/components";
import {
  useConversationNavigation,
  useFirstUnpracticedSection,
  useTopics,
} from "@/features/speaking/hooks";
import { useAppStore } from "@/stores";

export default function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const language = useAppStore((state) => state.language);
  const { data: profile, refetch: refetchProfile } = useProfile();
  const { unreadCount, hasMore } = useUnreadNotificationsCount();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTopics();
  const sections = data?.pages.flatMap((p) => p.content) ?? [];
  const firstPageSectionIds =
    data?.pages[0]?.content.map((s) => s.id) ?? [];

  const { firstUnpracticedSectionId, isResolved, handleSectionResolved, reset } =
    useFirstUnpracticedSection(firstPageSectionIds);
  const { handleConversationPress } = useConversationNavigation();

  const scrollViewRef = useRef<FlatList<Topic>>(null);
  const sectionYMap = useRef<Record<string, number>>({});
  const hasScrolledRef = useRef(false);
  const flatListHeightRef = useRef<number>(0);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusRefetching, setIsFocusRefetching] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    hasScrolledRef.current = false;
    setHasScrolled(false);
    reset();
    setFocusTrigger((prev) => prev + 1);
    await Promise.all([refetch(), refetchProfile()]);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      hasScrolledRef.current = false;
      setHasScrolled(false);
      reset();
      setFocusTrigger((prev) => prev + 1);
      const doRefetch = async () => {
        setIsFocusRefetching(true);
        await Promise.all([refetch(), refetchProfile()]);
        setIsFocusRefetching(false);
      };
      doRefetch();
    }, [reset, refetch]),
  );

  const handleScrollToCard = useCallback(
    (sectionId: string, cardY: number, cardHeight: number) => {
      if (hasScrolledRef.current) return;
      const sectionY = sectionYMap.current[sectionId] ?? 0;
      const totalY = sectionY + cardY;
      const centeredY = totalY - flatListHeightRef.current / 2 + cardHeight / 2;
      scrollViewRef.current?.scrollToOffset({
        offset: Math.max(0, centeredY),
        animated: true,
      });
      hasScrolledRef.current = true;
      setHasScrolled(true);
    },
    [],
  );

  const blockedMessage = (() => {
    if (profile?.status !== "ACTIVE")
      return "Bạn chưa có lớp. Vui lòng thử lại sau";
    const classStatus = profile?.enrolledClasses[0]?.status;
    if (classStatus === "not_started")
      return "Lớp của bạn chưa bắt đầu. Vui lòng thử lại sau";
    return null;
  })();

  // Phủ overlay cho đến khi: tất cả section trang đầu đã resolved
  // và (không có target để scroll HOẶC đã scroll xong lần đầu).
  const isPreparingScroll =
    !blockedMessage &&
    (!isResolved || (firstUnpracticedSectionId !== null && !hasScrolled));

  return (
    <>
      <View
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
      >
        {/* Header */}
        <ScreenHeader
          title="Luyện nói"
          paddingTop={insets.top + 16}
          rightAction={
            <BellButton
              badgeCount={unreadCount}
              showPlus={hasMore}
              onPress={() => router.push("/notifications")}
            />
          }
        />

        {blockedMessage ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text
              className="text-base text-center font-body"
              style={{ color: theme.text.secondary }}
            >
              {blockedMessage}
            </Text>
          </View>
        ) : (
          <FlatList<Topic>
            ref={scrollViewRef}
            className="flex-1"
            onLayout={(e) => {
              flatListHeightRef.current = e.nativeEvent.layout.height;
            }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 32,
              gap: 16,
            }}
            showsVerticalScrollIndicator={false}
            data={sections}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                {/*
                 * Banner free-talk: lấy jlptLevel từ lớp đang học để truyền vào session.
                 * Nếu chưa đăng ký lớp thì không điều hướng.
                 */}
                <ConversationBanner
                  onPress={() => {
                    const jlptLevel = profile?.enrolledClasses?.[0]?.jlptLevel;
                    if (!jlptLevel) return;
                    router.push({
                      pathname: "/conversation-practice",
                      params: {
                        jlptLevel,
                        language,
                        title: "Nói chuyện với AI",
                      },
                    });
                  }}
                />
                {isError && (
                  <Text
                    className="text-sm font-body text-center mt-4"
                    style={{ color: theme.text.secondary }}
                  >
                    Không thể tải dữ liệu. Vui lòng thử lại sau.
                  </Text>
                )}
              </>
            }
            renderItem={({ item: section }) => (
              <View
                onLayout={(e) => {
                  sectionYMap.current[section.id] = e.nativeEvent.layout.y;
                }}
              >
                <TopicSection
                  section={section}
                  // Chỉ section thắng cuộc mới vẽ viền highlight; overlay phủ tới khi resolved
                  // nên không lo nháy "không viền" trong lúc chờ.
                  showFirstUnpracticedBorder={
                    firstUnpracticedSectionId === section.id
                  }
                  onSectionResolved={handleSectionResolved}
                  onConversationPress={handleConversationPress}
                  isTargetSection={firstUnpracticedSectionId === section.id}
                  onScrollToCard={(cardY, cardHeight) =>
                    handleScrollToCard(section.id, cardY, cardHeight)
                  }
                  focusTrigger={focusTrigger}
                />
              </View>
            )}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator
                  size="small"
                  color={theme.brand.primary}
                  style={{ marginVertical: 16 }}
                />
              ) : null
            }
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.brand.primary]}
                tintColor={theme.brand.primary}
              />
            }
          />
        )}
      </View>
      <LoadingOverlay visible={isLoading} title="Đang tải..." />
      <LoadingOverlay visible={isFocusRefetching} title="Đang tải..." />
      <LoadingOverlay visible={isPreparingScroll} title="Đang tải..." />
      {!blockedMessage && <ChatbotFab />}
    </>
  );
}
