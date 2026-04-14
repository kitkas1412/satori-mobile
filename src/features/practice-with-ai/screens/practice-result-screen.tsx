import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Check, RefreshCw, X } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  LoadingOverlay,
  PrimaryButton,
  ScoreRing,
  ScreenHeader,
} from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePracticeSessionSummary } from "../hooks";
import { PracticeAnswerItem } from "../components";

export function PracticeResultScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { practiceSessionId } = useLocalSearchParams<{
    practiceSessionId?: string;
  }>();

  const {
    data: summary,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = usePracticeSessionSummary(practiceSessionId);

  function handleGoPracticeHome() {
    router.replace({ pathname: "/(tabs)/practice", params: { tab: "ai" } });
  }

  function handleContinue() {
    if (!summary || !practiceSessionId) {
      handleGoPracticeHome();
      return;
    }
    const hasReward =
      (summary.newBadgesEarned?.length ?? 0) > 0 ||
      summary.levelUp !== null ||
      summary.streakNotification?.is_first_activity_today === true;
    if (hasReward) {
      router.replace({
        pathname: "/practice-reward",
        params: { practiceSessionId },
      });
    } else {
      handleGoPracticeHome();
    }
  }

  if (!practiceSessionId) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-4"
        style={{ backgroundColor: theme.background.page }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Text
          className="font-heading text-base text-center"
          style={{ color: theme.text.primary }}
        >
          Không tìm thấy phiên luyện tập
        </Text>
        <PrimaryButton
          text="Về trang luyện tập"
          onPress={handleGoPracticeHome}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-4"
        style={{ backgroundColor: theme.background.page }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Text
          className="font-heading text-base text-center"
          style={{ color: theme.text.primary }}
        >
          Không thể tải kết quả luyện tập
        </Text>
        <Text
          className="font-body text-sm text-center"
          style={{ color: theme.text.secondary }}
        >
          Vui lòng kiểm tra kết nối và thử lại.
        </Text>
        <PrimaryButton
          text="Thử lại"
          onPress={() => {
            void refetch();
          }}
          icon={
            <RefreshCw size={16} color={theme.text.onBrand} strokeWidth={2} />
          }
        />
        <Pressable onPress={handleGoPracticeHome}>
          <Text
            className="font-body text-sm"
            style={{ color: theme.text.secondary }}
          >
            Về trang luyện tập
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!summary) {
    return null;
  }

  const wrongCount = Math.max(0, summary.totalItems - summary.correctItems);

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: theme.background.page }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <LoadingOverlay
        visible={isLoading || isFetching}
        title="Đang tải kết quả"
        message="Vui lòng đợi trong giây lát"
      />

      <ScreenHeader
        title="Kết quả"
        showDivider
        leftAction={
          <Pressable
            onPress={handleGoPracticeHome}
            hitSlop={8}
            className="items-center justify-center"
            style={{ width: 24, height: 24 }}
          >
            <X size={22} color={theme.icon.primary} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: insets.bottom + 92,
          gap: 24,
        }}
      >
        <View className="items-center gap-2">
          <ScoreRing score={summary.score} />
          <Text
            className="font-heading text-2xl"
            style={{ color: theme.text.primary }}
          >
            Hoàn thành tốt
          </Text>
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary }}
          >
            {summary.aiFeedback}
          </Text>
        </View>

        <View
          className="rounded-2xl p-5 gap-4"
          style={{
            backgroundColor: theme.background.surface,
            shadowColor: theme.border.strong,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between">
            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.success.default,
                }}
              >
                <Check size={20} color={theme.icon.onBrand} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  className="font-body-bold text-sm"
                  style={{ color: theme.text.secondary }}
                >
                  Câu đúng
                </Text>
                <Text
                  className="font-heading text-xl"
                  style={{ color: theme.text.primary }}
                >
                  {summary.correctItems}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.error.default,
                }}
              >
                <X size={20} color={theme.icon.onBrand} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  className="font-body-bold text-sm"
                  style={{ color: theme.text.secondary }}
                >
                  Câu sai
                </Text>
                <Text
                  className="font-heading text-xl"
                  style={{ color: theme.text.primary }}
                >
                  {wrongCount}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <Text
            className="font-heading text-base"
            style={{ color: theme.text.primary }}
          >
            Chi tiết câu trả lời
          </Text>

          {summary.items.map((item, index) => (
            <PracticeAnswerItem
              key={`${item.itemIndex}-${index}`}
              item={item}
              index={index}
              theme={theme}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.background.page,
        }}
      >
        <PrimaryButton
          text="Tiếp tục"
          onPress={handleContinue}
        />
      </View>
    </View>
  );
}
