import { CheckCircle2, ChevronLeft, Clock, X } from "lucide-react-native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LoadingOverlay, ScreenHeader } from "@/components/ui";
import { useWritingResult } from "../hooks";
import { StatusBanner } from "../components";

export function WritingResultScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const {
    writingResult,
    isGraded,
    imageUrls,
    score,
    isCancelling,
    handleGoHome,
    handleCancelSubmission,
  } = useWritingResult();

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <LoadingOverlay visible={isCancelling} title="Đang hủy nộp bài..." />

      <ScreenHeader
        title={isGraded ? "Bài tập đã nộp" : "Chi tiết bài nộp"}
        showDivider
        leftAction={
          <Pressable onPress={handleGoHome} hitSlop={8}>
            <ChevronLeft size={24} color={theme.textDefault} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
          gap: 16,
        }}
      >
        {/* Hero section */}
        <View className="items-center gap-3">
          <View
            style={{
              width: 80,
              height: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 40,
                opacity: 0.2,
              }}
            />
            <CheckCircle2
              size={80}
              color={isGraded ? "#00a63e" : "#0958d9"}
              strokeWidth={1.5}
            />
          </View>
          <Text
            className="font-heading text-xl"
            style={{ color: theme.textMuted }}
          >
            {isGraded ? "Bài tập đã được chấm điểm" : "Đã nộp bài thành công!"}
          </Text>
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted, opacity: 0.7 }}
          >
            {isGraded
              ? "Hãy xem nhận xét của giáo viên"
              : "Đang chờ giáo viên chấm bài"}
          </Text>
        </View>

        {/* SUBMITTED: Waiting info card */}
        {!isGraded && (
          <StatusBanner
            type="info"
            title="Đang chờ chấm bài"
            description="Bài làm của bạn đã được gửi đến giáo viên. Kết quả sẽ được cập nhật sau khi giáo viên hoàn thành chấm bài."
            extra={
              <View
                className="flex-row items-center gap-2"
                style={{ opacity: 0.8 }}
              >
                <Clock size={14} color="#0958d9" strokeWidth={1.5} />
                <Text
                  className="font-body text-xs"
                  style={{ color: "#0958d9" }}
                >
                  Thời gian chấm bài thường từ 1-3 ngày
                </Text>
              </View>
            }
          />
        )}

        {/* GRADED: Score & feedback card */}
        {isGraded && (
          <StatusBanner
            type="success"
            title="Kết quả đánh giá"
            extra={
              <>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-body text-sm"
                    style={{ color: theme.textMuted }}
                  >
                    Điểm số:
                  </Text>
                  <Text
                    className="font-heading text-2xl"
                    style={{ color: "#389e0d" }}
                  >
                    {Math.round(score)}/100
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: theme.white,
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  {writingResult?.feedback ? (
                    <Text
                      className="font-body text-xs"
                      style={{ color: theme.textMuted, lineHeight: 19 }}
                    >
                      {writingResult.feedback}
                    </Text>
                  ) : (
                    <Text
                      className="font-body text-xs text-center"
                      style={{ color: theme.textMuted, opacity: 0.5 }}
                    >
                      Giáo viên chưa để lại nhận xét
                    </Text>
                  )}
                </View>
              </>
            }
          />
        )}

        {/* Image card */}
        <View
          style={{
            backgroundColor: theme.cardBackground,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            padding: 16,
            gap: 12,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="font-heading text-sm"
              style={{ color: theme.textMuted }}
            >
              Hình ảnh đã nộp ({imageUrls.length})
            </Text>
            {imageUrls.length > 0 && (
              <Text
                className="font-body text-xs"
                style={{ color: theme.primary }}
              >
                Nhấn để phóng to
              </Text>
            )}
          </View>
          {imageUrls.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {imageUrls.map((url, index) => (
                  <View key={index}>
                    <Image
                      source={{ uri: url }}
                      style={{
                        width: 103,
                        height: 103,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: theme.border,
                      }}
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        backgroundColor: "black",
                        borderRadius: 4,
                        width: 18,
                        height: 19,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        className="font-heading"
                        style={{ color: "white", fontSize: 10 }}
                      >
                        {index + 1}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View
              className="items-center gap-3"
              style={{ paddingVertical: 16 }}
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: theme.border,
                  opacity: 0.6,
                }}
              >
                <X size={28} color={theme.textMuted} strokeWidth={1.5} />
              </View>
              <Text
                className="font-heading text-sm"
                style={{ color: theme.textMuted }}
              >
                Chưa có hình ảnh
              </Text>
              <Text
                className="font-body text-xs text-center"
                style={{ color: theme.textMuted, opacity: 0.6 }}
              >
                Bài nộp này không có hình ảnh đính kèm
              </Text>
            </View>
          )}
        </View>

        {/* SUBMITTED: Warning card */}
        {!isGraded && (
          <StatusBanner
            type="warning"
            title="Lưu ý"
            description="Nếu hủy nộp bài, bạn sẽ phải làm lại từ đầu. Giáo viên sẽ không nhận được bài làm của bạn."
          />
        )}
      </ScrollView>

      {/* Bottom buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleGoHome}
            className="flex-1 items-center justify-center rounded-xl"
            style={{ height: 48, backgroundColor: theme.primary }}
          >
            <Text
              className="font-heading text-sm"
              style={{ color: theme.white }}
            >
              Quay về
            </Text>
          </Pressable>

          {!isGraded && (
            <Pressable
              onPress={handleCancelSubmission}
              disabled={isCancelling}
              className="flex-1 items-center justify-center rounded-xl"
              style={{
                height: 48,
                backgroundColor: theme.white,
                borderWidth: 2,
                borderColor: "#ff4d4f",
                opacity: isCancelling ? 0.5 : 1,
              }}
            >
              <Text
                className="font-heading text-sm"
                style={{ color: "#ff4d4f" }}
              >
                {isCancelling ? "Đang hủy..." : "Hủy nộp bài"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
