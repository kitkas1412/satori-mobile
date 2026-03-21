// Màn hình chính của feature Luyện nói.
// Hiển thị banner free-talk và danh sách các section (chủ đề) để người dùng chọn luyện tập.
// Tự động highlight section đầu tiên còn topic chưa được luyện.

import { Bell } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, ScreenHeader } from "@/components/ui";

import {
  ConversationBanner,
  TopicSection,
} from "@/features/speaking/components";
import { useAppStore, useAuthStore } from "@/stores";
import {
  useConversationThemes,
  useFirstUnpracticedSection,
} from "@/features/speaking/hooks";
import { useProfile } from "@/hooks/api/use-profile";

export function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const language = useAppStore((state) => state.language);
  const { data: profile } = useProfile();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { data: sections, isLoading, isError } = useConversationThemes();

  const { firstUnpracticedSectionId, handleHasUnpracticed } =
    useFirstUnpracticedSection();

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

        {/* Khoá tính năng nếu tài khoản người dùng đang bị tạm ngưng */}
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
                style={{ color: theme.textMuted }}
              >
                Không thể tải dữ liệu. Vui lòng thử lại sau.
              </Text>
            )}

            {sections?.map((section, index) => (
              <TopicSection
                key={section.id}
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
              />
            ))}
          </ScrollView>
        )}
      </View>
      <LoadingOverlay visible={isLoading} title="Đang tải..." />
    </>
  );
}
