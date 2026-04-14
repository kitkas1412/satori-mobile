// Màn hình chính của feature Luyện nói.
// Hiển thị banner free-talk và danh sách các section (chủ đề) để người dùng chọn luyện tập.
// Tự động highlight section đầu tiên còn topic chưa được luyện.

import { useRef, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect, useIsFocused } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { BellButton, LoadingOverlay, ScreenHeader } from "@/components/ui";

import {
  ConversationBanner,
  TopicSection,
} from "@/features/speaking/components";
import { ChatbotFab } from "@/features/chatbot/components";
import { useAppStore } from "@/stores";
import {
  useTopics,
  useFirstUnpracticedSection,
  useConversationNavigation,
} from "@/features/speaking/hooks";
import type { Topic } from "@/features/speaking/api";
import { useProfile } from "@/features/profile-management/hooks";

export default function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();
  const language = useAppStore((state) => state.language);
  const { data: profile, refetch: refetchProfile } = useProfile();
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

  const { firstUnpracticedSectionId, handleHasUnpracticed, reset } =
    useFirstUnpracticedSection();
  const { handleConversationPress } = useConversationNavigation();

  const scrollViewRef = useRef<FlatList<Topic>>(null);
  const sectionYMap = useRef<Record<string, number>>({});
  const hasScrolledRef = useRef(false);
  const { height: screenHeight } = useWindowDimensions();
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusRefetching, setIsFocusRefetching] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchProfile()]);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      hasScrolledRef.current = false;
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
      const centeredY = totalY - screenHeight / 2 + cardHeight / 2;
      scrollViewRef.current?.scrollToOffset({
        offset: Math.max(0, centeredY),
        animated: true,
      });
      hasScrolledRef.current = true;
    },
    [screenHeight],
  );

  const blockedMessage = (() => {
    if (!profile?.enrolledClasses?.length) return "Bạn chưa có lớp. Vui lòng thử lại sau";
    const classStatus = profile?.enrolledClasses[0]?.status;
    if (classStatus === "not_started") return "Lớp của bạn chưa bắt đầu. Vui lòng thử lại sau";
    if (classStatus === "closed") return "Lớp của bạn đã kết thúc. Vui lòng thử lại sau";
    return null;
  })();

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
            <BellButton onPress={() => router.push("/notifications")} />
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
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
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
                      params: { jlptLevel, language, title: "Nói chuyện với AI" },
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
            renderItem={({ item: section, index }) => (
              <View
                onLayout={(e) => {
                  sectionYMap.current[section.id] = e.nativeEvent.layout.y;
                }}
              >
                <TopicSection
                  section={section}
                  // Section đầu tiên trong danh sách luôn được mở rộng mặc định
                  defaultExpanded={index === 0}
                  // Hiển thị viền highlight nếu chưa xác định được section nào,
                  // hoặc nếu đây chính là section cần học tiếp theo
                  showFirstUnpracticedBorder={
                    firstUnpracticedSectionId === null ||
                    firstUnpracticedSectionId === section.id
                  }
                  onHasUnpracticed={handleHasUnpracticed}
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
      <LoadingOverlay visible={isFocused && isLoading} title="Đang tải..." />
      <LoadingOverlay visible={isFocused && isFocusRefetching} title="Đang tải..." />
      {!blockedMessage && <ChatbotFab />}
    </>
  );
}
