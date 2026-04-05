// Màn hình chính của feature Luyện nói.
// Hiển thị banner free-talk và danh sách các section (chủ đề) để người dùng chọn luyện tập.
// Tự động highlight section đầu tiên còn topic chưa được luyện.

import { Bell } from "lucide-react-native";
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
import { useRouter, useFocusEffect } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, ScreenHeader } from "@/components/ui";

import {
  ConversationBanner,
  TopicSection,
} from "@/features/speaking/components";
import { ChatbotFab } from "@/features/chatbot/components";
import { useAppStore, useAuthStore } from "@/stores";
import {
  useTopics,
  useFirstUnpracticedSection,
  useConversationNavigation,
} from "@/features/speaking/hooks";
import type { Topic } from "@/features/speaking/api";
import { useProfile } from "@/hooks/api/use-profile";

export default function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const language = useAppStore((state) => state.language);
  const { data: profile } = useProfile();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      hasScrolledRef.current = false;
      reset();
      setFocusTrigger((prev) => prev + 1);
    }, [reset]),
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
            <View className="relative">
              <View
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.icon.disabled }}
              >
                <Bell size={20} color={theme.icon.onBrand} />
              </View>
            </View>
          }
        />

        {/* Khoá tính năng nếu tài khoản người dùng đang bị tạm ngưng */}
        {user?.status === "INACTIVE" ? (
          <View className="flex-1 items-center justify-center px-4">
            <Text
              className="text-base text-center font-body"
              style={{ color: theme.text.secondary }}
            >
              Tính năng đang tạm khoá. Vui lòng thử lại sau
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
                 * Banner free-talk: lấy targetJlptLevel từ profile để truyền vào session.
                 * Nếu chưa cài đặt mục tiêu JLPT thì không điều hướng.
                 */}
                <ConversationBanner
                  onPress={() => {
                    const jlptLevel = profile?.learningPreferences?.targetJlptLevel;
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
      <LoadingOverlay visible={isLoading} title="Đang tải..." />
      <ChatbotFab />
    </>
  );
}
