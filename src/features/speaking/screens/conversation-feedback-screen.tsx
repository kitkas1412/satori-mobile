// Màn hình kết quả sau khi hoàn thành session hội thoại.
// Hiển thị 5 tabs: Báo cáo tổng thể, Chính xác, Phát âm, Nhiệm vụ, Phức tạp.
// Có 2 mode:
//   - Post-session: không có conversationId param → đọc từ Zustand store, CTA "Tiếp tục" → /conversation-reward
//   - Review: có conversationId param → fetch từ API, CTA "Làm lại" → /conversation-detail

import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { PrimaryButton, ScreenHeader } from "@/components/ui";
import { useConversationStore } from "@/stores";
import {
  FeedbackOverviewTab,
  FeedbackAccuracyTab,
  FeedbackPronunciationTab,
  FeedbackMissionTab,
  FeedbackComplexityTab,
} from "@/features/speaking/components";
import { useLatestFeedback } from "@/features/speaking/hooks";

// ─── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { key: "overview", label: "Báo cáo tổng thể" },
  { key: "accuracy", label: "Chính xác" },
  { key: "pronunciation", label: "Phát âm" },
  { key: "mission", label: "Nhiệm vụ" },
  { key: "complexity", label: "Phức tạp" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Main screen ───────────────────────────────────────────────────────────────

export function ConversationFeedbackScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { conversationId } = useLocalSearchParams<{ conversationId?: string }>();
  const isReviewMode = !!conversationId;

  const storeFeedback = useConversationStore((s) => s.feedback);
  const { data: apiFeedback, isLoading, isError } = useLatestFeedback(
    isReviewMode ? conversationId : undefined,
  );

  const feedback = isReviewMode ? apiFeedback : storeFeedback;

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  function handleCTA() {
    if (isReviewMode) {
      router.push({
        pathname: "/conversation-detail",
        params: { conversationId },
      });
    } else {
      router.replace("/conversation-reward");
    }
  }

  if (isReviewMode && isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background.page, paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color={theme.brand.primary} />
      </View>
    );
  }

  if (isReviewMode && isError) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background.page, paddingTop: insets.top }}
      >
        <Text className="font-body text-base" style={{ color: theme.text.secondary }}>
          Không thể tải kết quả. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  if (!feedback) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background.page, paddingTop: insets.top }}
      >
        <Text className="font-body text-base" style={{ color: theme.text.secondary }}>
          Không có dữ liệu phản hồi.
        </Text>
      </View>
    );
  }

  const { accuracy, pronunciation, taskCompletion, complexity, qualitativeSummary } =
    feedback;

  function renderTabContent() {
    switch (activeTab) {
      case "overview":
        return <FeedbackOverviewTab qualitativeSummary={qualitativeSummary} />;
      case "accuracy":
        return <FeedbackAccuracyTab accuracy={accuracy} />;
      case "pronunciation":
        return (
          <FeedbackPronunciationTab
            pronunciation={pronunciation}
            pronunciationFeedback={qualitativeSummary.pronunciationFeedback}
          />
        );
      case "mission":
        return (
          <FeedbackMissionTab
            taskCompletion={taskCompletion}
            taskCompletionFeedback={qualitativeSummary.taskCompletionFeedback}
          />
        );
      case "complexity":
        return (
          <FeedbackComplexityTab
            complexity={complexity}
            complexityFeedback={qualitativeSummary.complexityFeedback}
          />
        );
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: theme.background.page,
        paddingTop: insets.top + 16,
      }}
    >
      {/* Header */}
      <ScreenHeader
        title="Kết quả đánh giá"
        titleSize="2xl"
        leftAction={
          isReviewMode ? (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={22} color={theme.icon.primary} strokeWidth={2} />
            </TouchableOpacity>
          ) : undefined
        }
      />

      {/* Divider */}
      <View className="h-px" style={{ backgroundColor: theme.border.subtle }} />

      {/* Tab Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          gap: 4,
          alignItems: "center",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className="rounded-2xl px-3 py-1"
              style={{
                backgroundColor: isActive
                  ? theme.brand.primary
                  : theme.background.surface,
                borderWidth: 0.5,
                borderColor: isActive ? theme.brand.primary : theme.border.subtle,
              }}
            >
              <Text
                className="font-body text-xs"
                style={{
                  color: isActive ? theme.text.onBrand : theme.text.primary,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* CTA */}
      <View
        className="px-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <PrimaryButton
          text={isReviewMode ? "Làm lại" : "Tiếp tục"}
          variant="dark"
          onPress={handleCTA}
        />
      </View>
    </View>
  );
}
