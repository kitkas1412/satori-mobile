// Màn hình kết quả/chi tiết bài nộp viết.
// Hiển thị hai trạng thái:
// - Chưa chấm (SUBMITTED): thông báo đang chờ + tùy chọn hủy nộp bài
// - Đã chấm (GRADED): điểm số, nhận xét giáo viên + ảnh bài làm

import { CheckCircle2, ChevronLeft, Clock, X } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ImageViewerModal,
  LoadingOverlay,
  PrimaryButton,
  ScreenHeader,
} from "@/components/ui";
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

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: theme.background.page }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <LoadingOverlay visible={isCancelling} title="Đang hủy nộp bài..." />

      {/* Header: tiêu đề thay đổi theo trạng thái chấm bài */}
      <ScreenHeader
        title={isGraded ? "Bài tập đã nộp" : "Chi tiết bài nộp"}
        showDivider
        leftAction={
          <Pressable onPress={handleGoHome} hitSlop={8}>
            <ChevronLeft size={24} color={theme.text.primary} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ImageViewerModal
        visible={previewIndex !== null}
        images={imageUrls}
        initialIndex={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
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
        {/* Phần hero: icon trạng thái + tiêu đề + mô tả */}
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
            {/* Màu xanh lá khi đã chấm, màu xanh dương khi chờ chấm */}
            <CheckCircle2
              size={80}
              color={isGraded ? theme.success.default : theme.brand.primary}
              strokeWidth={1.5}
            />
          </View>
          <Text
            className="font-heading text-xl"
            style={{ color: theme.text.primary }}
          >
            {isGraded ? "Bài tập đã được chấm điểm" : "Đã nộp bài thành công!"}
          </Text>
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.text.secondary, opacity: 0.7 }}
          >
            {isGraded
              ? "Hãy xem nhận xét của giáo viên"
              : "Đang chờ giáo viên chấm bài"}
          </Text>
        </View>

        {/* Banner chờ chấm — chỉ hiển thị khi bài chưa được chấm */}
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
                <Clock
                  size={14}
                  color={theme.brand.primary}
                  strokeWidth={1.5}
                />
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.brand.primary }}
                >
                  Thời gian chấm bài thường từ 1-3 ngày
                </Text>
              </View>
            }
          />
        )}

        {/* Banner điểm số + nhận xét — chỉ hiển thị khi đã được chấm */}
        {isGraded && (
          <StatusBanner
            type="success"
            title="Kết quả đánh giá"
            extra={
              <>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-body text-sm"
                    style={{ color: theme.text.primary }}
                  >
                    Điểm số:
                  </Text>
                  <Text
                    className="font-heading text-2xl"
                    style={{ color: theme.success.default }}
                  >
                    {Math.round(score)}/100
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: theme.background.surface,
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  {writingResult?.feedback ? (
                    <Text
                      className="font-body text-xs"
                      style={{ color: theme.text.secondary, lineHeight: 19 }}
                    >
                      {writingResult.feedback}
                    </Text>
                  ) : (
                    <Text
                      className="font-body text-xs text-center"
                      style={{ color: theme.text.secondary, opacity: 0.5 }}
                    >
                      Giáo viên chưa để lại nhận xét
                    </Text>
                  )}
                </View>
              </>
            }
          />
        )}

        {/* Thẻ ảnh bài làm đã nộp */}
        <View
          style={{
            backgroundColor: theme.background.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border.subtle,
            padding: 16,
            gap: 12,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="font-heading text-sm"
              style={{ color: theme.text.primary }}
            >
              Hình ảnh đã nộp ({imageUrls.length})
            </Text>
            {imageUrls.length > 0 && (
              <Text
                className="font-body text-xs"
                style={{ color: theme.brand.primary }}
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
                    <Pressable onPress={() => setPreviewIndex(index)}>
                      <Image
                        source={{ uri: url }}
                        style={{
                          width: 103,
                          height: 103,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: theme.border.subtle,
                        }}
                        resizeMode="cover"
                      />
                    </Pressable>
                    {/* Số thứ tự ảnh */}
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
                  backgroundColor: theme.border.subtle,
                  opacity: 0.6,
                }}
              >
                <X size={28} color={theme.text.primary} strokeWidth={1.5} />
              </View>
              <Text
                className="font-heading text-sm"
                style={{ color: theme.text.primary }}
              >
                Chưa có hình ảnh
              </Text>
              <Text
                className="font-body text-xs text-center"
                style={{ color: theme.text.secondary, opacity: 0.6 }}
              >
                Bài nộp này không có hình ảnh đính kèm
              </Text>
            </View>
          )}
        </View>

        {/* Banner cảnh báo hủy nộp bài — chỉ hiển thị khi chưa chấm */}
        {!isGraded && (
          <StatusBanner
            type="warning"
            title="Lưu ý"
            description="Nếu hủy nộp bài, bạn sẽ phải làm lại từ đầu. Giáo viên sẽ không nhận được bài làm của bạn."
          />
        )}
      </ScrollView>

      {/* Thanh nút cố định dưới cùng: Quay về + Hủy nộp bài (nếu chưa chấm) */}
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
        <View className="flex-row gap-3">
          <PrimaryButton
            text="Quay về"
            onPress={handleGoHome}
            style={{ flex: 1 }}
          />

          {!isGraded && (
            <PrimaryButton
              text="Hủy nộp bài"
              onPress={handleCancelSubmission}
              disabled={isCancelling}
              loading={isCancelling}
              variant="danger"
              style={{ flex: 1 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}
