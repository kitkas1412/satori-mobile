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
import { ClipboardList, X } from "lucide-react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { PrimaryButton, ScreenHeader, ScoreCircle } from "@/components/ui";
import { useConversationStore } from "@/stores";
import { MissionDetailsCard } from "@/features/speaking/components";
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

// ─── Inline helper components ──────────────────────────────────────────────────

function StatRow({
  label,
  value,
  theme,
  isLast = false,
}: {
  label: string;
  value: string | number;
  theme: (typeof Colors)["light"];
  isLast?: boolean;
}) {
  return (
    <View
      className="flex-row items-center justify-between py-1.5"
      style={
        !isLast
          ? { borderBottomWidth: 0.5, borderBottomColor: theme.border.subtle }
          : undefined
      }
    >
      <Text className="font-body text-xs" style={{ color: theme.text.secondary }}>
        {label}
      </Text>
      <Text className="font-heading text-xs" style={{ color: theme.text.primary }}>
        {value}
      </Text>
    </View>
  );
}

function FeedbackCard({
  title,
  text,
  theme,
}: {
  title: string;
  text: string;
  theme: (typeof Colors)["light"];
}) {
  return (
    <View
      className="rounded-xl p-4 gap-2 border"
      style={{
        backgroundColor: theme.background.surface,
        borderColor: theme.border.subtle,
      }}
    >
      <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
        {title}
      </Text>
      <Text
        className="font-body text-xs leading-5"
        style={{ color: theme.text.secondary }}
      >
        {text}
      </Text>
    </View>
  );
}

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

  // ─── Tab content renderers ────────────────────────────────────────────────────

  function renderOverviewTab() {
    return (
      <View className="gap-4">
        {/* Tóm tắt đánh giá */}
        <View
          className="rounded-xl p-4 gap-2 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Tóm tắt đánh giá
          </Text>
          <Text
            className="font-body text-xs leading-5"
            style={{ color: theme.text.secondary }}
          >
            {qualitativeSummary.overallAssessment}
          </Text>
          {qualitativeSummary.jlptEstimate ? (
            <View
              className="self-start rounded-md px-2 py-1"
              style={{ backgroundColor: theme.background.page }}
            >
              <Text
                className="font-body text-xs"
                style={{ color: theme.brand.primary }}
              >
                Ước tính: {qualitativeSummary.jlptEstimate}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Bước tiếp theo */}
        {qualitativeSummary.nextSteps?.length > 0 && (
          <View
            className="rounded-xl p-4 gap-2 border"
            style={{
              backgroundColor: theme.background.surface,
              borderColor: theme.border.subtle,
            }}
          >
            <Text
              className="font-heading text-sm"
              style={{ color: theme.text.primary }}
            >
              Bước tiếp theo
            </Text>
            <View className="gap-2">
              {qualitativeSummary.nextSteps.map((step, index) => (
                <View key={index} className="flex-row items-start gap-2">
                  <View
                    className="rounded-full items-center justify-center shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: theme.brand.primary,
                    }}
                  >
                    <Text
                      className="font-heading"
                      style={{ fontSize: 10, color: theme.text.onBrand }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    className="flex-1 font-body text-xs leading-5"
                    style={{ color: theme.text.secondary }}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  }

  function renderAccuracyTab() {
    const errorRateDisplay =
      accuracy.errorRate != null ? `${accuracy.errorRate}%` : "N/A";

    return (
      <View className="gap-4">
        {/* Score card */}
        <View
          className="rounded-xl p-4 gap-3 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Độ chính xác
          </Text>
          <View className="items-center py-2">
            <ScoreCircle score={accuracy.score} label="Điểm" />
          </View>
          <View>
            <StatRow
              label="Tổng số sửa lỗi"
              value={accuracy.totalCorrections}
              theme={theme}
            />
            <StatRow
              label="Số tin nhắn"
              value={accuracy.userMessageCount}
              theme={theme}
            />
            <StatRow
              label="Tỷ lệ lỗi"
              value={errorRateDisplay}
              theme={theme}
              isLast
            />
          </View>
        </View>

        <FeedbackCard title="Nhận xét" text={accuracy.feedback} theme={theme} />
      </View>
    );
  }

  function renderPronunciationTab() {
    return (
      <View className="gap-4">
        {/* Score card */}
        <View
          className="rounded-xl p-4 gap-3 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Độ chính xác
          </Text>
          <View className="items-center py-2">
            <ScoreCircle score={pronunciation.score} label="Điểm" />
          </View>
          <View>
            <StatRow
              label="Độ chính xác trung bình"
              value={`${pronunciation.averageAccuracy}%`}
              theme={theme}
            />
            <StatRow
              label="Độ trôi chảy trung bình"
              value={`${pronunciation.averageFluency}%`}
              theme={theme}
            />
            <StatRow
              label="Độ hoàn chỉnh trung bình"
              value={`${pronunciation.averageCompleteness}%`}
              theme={theme}
            />
            <StatRow
              label="Tổng số đánh giá"
              value={pronunciation.totalAssessed}
              theme={theme}
              isLast
            />
          </View>
        </View>

        <FeedbackCard title="Nhận xét" text={pronunciation.feedback} theme={theme} />

        <FeedbackCard
          title="Phản hồi phát âm"
          text={qualitativeSummary.pronunciationFeedback}
          theme={theme}
        />
      </View>
    );
  }

  function renderMissionTab() {
    const hasMissions = taskCompletion.details?.length > 0;

    return (
      <View className="gap-4">
        {/* Score card */}
        <View
          className="rounded-xl p-4 gap-3 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Nhiệm vụ
          </Text>
          <View className="items-center py-2">
            <ScoreCircle score={taskCompletion.score} label="Điểm" />
          </View>
        </View>

        <FeedbackCard
          title="Phản hồi nhiệm vụ"
          text={taskCompletion.feedback}
          theme={theme}
        />

        {hasMissions ? (
          <MissionDetailsCard missionDetails={taskCompletion.details} />
        ) : (
          <View
            className="rounded-xl p-8 items-center gap-3 border"
            style={{
              backgroundColor: theme.background.surface,
              borderColor: theme.border.subtle,
            }}
          >
            <View
              className="rounded-full items-center justify-center"
              style={{ width: 48, height: 48, backgroundColor: theme.border.subtle }}
            >
              <ClipboardList size={24} color={theme.icon.secondary} />
            </View>
            <Text
              className="font-body text-xs"
              style={{ color: theme.text.primary }}
            >
              Chưa có nhiệm vụ nào được ghi nhận.
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderComplexityTab() {
    const jlptEntries = Object.entries(complexity.jlptDistribution ?? {});
    const jlptDisplay =
      jlptEntries.length > 0
        ? jlptEntries.map(([level, count]) => `${level}: ${count}`).join(", ")
        : "Chưa có dữ liệu";

    return (
      <View className="gap-4">
        {/* Score card */}
        <View
          className="rounded-xl p-4 gap-3 border"
          style={{
            backgroundColor: theme.background.surface,
            borderColor: theme.border.subtle,
          }}
        >
          <Text className="font-heading text-sm" style={{ color: theme.text.primary }}>
            Phức tạp
          </Text>
          <View className="items-center py-2">
            <ScoreCircle score={complexity.score} label="Điểm" />
          </View>
          <View>
            <StatRow
              label="Số từ vựng duy nhất"
              value={complexity.uniqueVocabularyCount}
              theme={theme}
            />
            <StatRow
              label="Phân bố JLPT"
              value={jlptDisplay}
              theme={theme}
              isLast
            />
          </View>
        </View>

        <FeedbackCard title="Nhận xét" text={complexity.feedback} theme={theme} />

        <FeedbackCard
          title="Phản hồi từ vựng"
          text={qualitativeSummary.complexityFeedback}
          theme={theme}
        />
      </View>
    );
  }

  function renderTabContent() {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "accuracy":
        return renderAccuracyTab();
      case "pronunciation":
        return renderPronunciationTab();
      case "mission":
        return renderMissionTab();
      case "complexity":
        return renderComplexityTab();
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
