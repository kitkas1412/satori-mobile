// Màn hình chính của tính năng Ôn tập.
// Hiển thị hai tab: "Bài tập GV" (danh sách bài tập từ giáo viên) và "Ôn luyện AI" (banner AI).

import { Bell, BookOpen, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SectionHeader } from "@/components/ui/section-header";
import { AiBanner } from "@/features/assignment/components/ai-banner";
import { AssignmentCard } from "@/features/assignment/components/assignment-card";
import { mapAssignmentToCardProps } from "@/features/assignment/utils";
import {
  useAssignments,
  useAssignmentNavigation,
} from "@/features/assignment/hooks";

type ActiveTab = "teacher" | "ai";

export default function PracticeTab() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ActiveTab>("teacher");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useAssignments();
  const { handleAssignmentPress, isLoadingSubmission } =
    useAssignmentNavigation();

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

  // Biểu tượng chuông thông báo với chấm đỏ báo có thông báo mới
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

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
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
                activeTab === "teacher"
                  ? theme.icon.onBrand
                  : theme.icon.primary
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
            onPress={() => setActiveTab("ai")}
            className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
            style={
              activeTab === "ai"
                ? { backgroundColor: theme.brand.primary }
                : { backgroundColor: theme.background.surface }
            }
          >
            <Sparkles
              size={20}
              color={
                activeTab === "ai" ? theme.icon.onBrand : theme.icon.primary
              }
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

        {activeTab === "teacher" ? (
          <View className="px-4 gap-3">
            <SectionHeader
              title="Bài tập từ giáo viên"
              subtitle="Hoàn thành các bài tập được giao bởi giáo viên"
              size="lg"
            />

            {/* Hiển thị lỗi, danh sách rỗng, hoặc danh sách bài tập */}
            {isError ? (
              <Text
                className="font-body text-sm text-center"
                style={{ color: theme.text.secondary }}
              >
                Không thể tải bài tập. Vui lòng thử lại.
              </Text>
            ) : !data?.content.length ? (
              <Text
                className="font-body text-sm text-center"
                style={{ color: theme.text.secondary }}
              >
                Chưa có bài tập nào.
              </Text>
            ) : (
              data.content.map((item) => (
                <AssignmentCard
                  key={item.id}
                  {...mapAssignmentToCardProps(item)}
                  onPress={() => handleAssignmentPress(item)}
                />
              ))
            )}
          </View>
        ) : (
          <View className="px-4">
            <AiBanner />
          </View>
        )}
      </ScrollView>

      {/* Overlay loading khi đang tải danh sách bài tập */}
      <LoadingOverlay visible={isLoading} title="Đang tải bài tập..." />
      {/* Overlay loading khi đang tải kết quả bài đã nộp */}
      <LoadingOverlay
        visible={isLoadingSubmission}
        title="Đang tải kết quả..."
      />
    </View>
  );
}
