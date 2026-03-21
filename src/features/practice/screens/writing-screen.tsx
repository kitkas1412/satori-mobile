// Màn hình nộp bài viết.
// Học viên tải lên ảnh bài làm từ thư viện hoặc chụp trực tiếp, sau đó nhấn nộp bài.
// Nút nộp bài bị vô hiệu hóa nếu chưa chọn ảnh nào.

import {
  CalendarDays,
  CameraIcon,
  ImageIcon,
  Sparkles,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  LoadingOverlay,
  MarkdownText,
  PrimaryButton,
  ScreenAsyncView,
  ScreenHeader,
} from "@/components/ui";
import {
  useStartAssignment,
  useWritingSubmit,
  useExitAssignment,
  useWritingImages,
  useWritingEvaluate,
} from "../hooks";

interface WritingScreenProps {
  id: string;
}

export function WritingScreen({ id }: WritingScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { mutate, data, isPending, isError } = useStartAssignment();
  const {
    images,
    handlePickImage,
    handleTakePhoto,
    handleRemoveImage,
    dueDate,
  } = useWritingImages({ data });

  // Tự động gọi API bắt đầu bài tập ngay khi màn hình được mount
  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

  const { handleSubmit, isPending: isSubmitting } = useWritingSubmit({
    assignmentId: id,
    images,
  });
  const { handleExit } = useExitAssignment(() => router.back());

  const [evaluateFeedback, setEvaluateFeedback] = useState("");

  const { handleEvaluate, isPending: isEvaluating } = useWritingEvaluate({
    assignmentId: id,
    prompt: data?.writingContent?.prompt ?? "",
    images,
    onSuccess: (feedback) => setEvaluateFeedback(feedback),
  });

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <LoadingOverlay visible={isPending} title="Đang tải bài tập..." />
      <LoadingOverlay visible={isSubmitting} title="Đang nộp bài..." />
      <LoadingOverlay visible={isEvaluating} title="Đang đánh giá bài..." />

      {/* Header với nút X để thoát bài */}
      <ScreenHeader
        title="Nộp bài tập"
        showDivider
        leftAction={
          <Pressable onPress={handleExit} hitSlop={8}>
            <X size={24} color={theme.textDefault} strokeWidth={2} />
          </Pressable>
        }
        rightAction={<View style={{ width: 24 }} />}
      />

      <ScreenAsyncView
        isLoading={false}
        isError={!isPending && (isError || !data)}
        errorText="Không thể tải bài tập. Vui lòng thử lại."
      >
        <>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, gap: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Thẻ thông tin bài tập: tiêu đề, hạn nộp, yêu cầu đề bài */}
            <View
              style={{
                backgroundColor: theme.cardBackground,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.1)",
                padding: 16,
                gap: 8,
              }}
            >
              <Text
                className="font-heading text-lg"
                style={{ color: theme.textDefault }}
              >
                {data?.title}
              </Text>

              {dueDate ? (
                <View className="flex-row items-center gap-1.5">
                  <CalendarDays
                    size={14}
                    color={theme.textMuted}
                    strokeWidth={1.5}
                  />
                  <Text
                    className="font-body text-xs"
                    style={{ color: theme.textDefault, opacity: 0.7 }}
                  >
                    Hạn: {dueDate}
                  </Text>
                </View>
              ) : null}

              {data?.writingContent?.prompt ? (
                <View
                  style={{
                    backgroundColor: theme.background,
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 4,
                  }}
                >
                  <MarkdownText fontSize={14} color={theme.textDefault}>
                    {`Yêu cầu: ${data.writingContent?.prompt}`}
                  </MarkdownText>
                </View>
              ) : null}
            </View>

            {/* Thẻ bài làm: chọn/chụp ảnh và xem trước danh sách ảnh đã chọn */}
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
              {/* Header thẻ: tiêu đề + số lượng ảnh đã chọn */}
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-heading text-lg"
                  style={{ color: theme.textDefault }}
                >
                  Bài làm của bạn
                </Text>
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.textDefault, opacity: 0.7 }}
                >
                  {images.length} hình ảnh
                </Text>
              </View>

              {/* Nút chọn ảnh từ thư viện và chụp camera */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handlePickImage}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
                  style={{ height: 48, backgroundColor: theme.primary }}
                >
                  <ImageIcon size={20} color={theme.white} strokeWidth={2} />
                  <Text
                    className="font-heading text-sm"
                    style={{ color: theme.white }}
                  >
                    Chọn ảnh
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleTakePhoto}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl"
                  style={{
                    height: 48,
                    backgroundColor: theme.cardBackground,
                    borderWidth: 2,
                    borderColor: theme.primary,
                  }}
                >
                  <CameraIcon size={20} color={theme.primary} strokeWidth={2} />
                  <Text
                    className="font-heading text-sm"
                    style={{ color: theme.primary }}
                  >
                    Chụp ảnh
                  </Text>
                </Pressable>
              </View>

              {/* Khu vực xem trước: placeholder khi chưa có ảnh, hoặc danh sách ảnh cuộn ngang */}
              {images.length === 0 ? (
                <View
                  className="items-center justify-center"
                  style={{
                    height: 200,
                    borderWidth: 2,
                    borderColor: "#D1D5DC",
                    borderStyle: "dashed",
                    borderRadius: 10,
                    gap: 8,
                  }}
                >
                  <ImageIcon size={48} color={theme.border} strokeWidth={1} />
                  <Text
                    className="font-body text-sm"
                    style={{ color: theme.textDefault, opacity: 0.7 }}
                  >
                    Chưa có hình ảnh nào
                  </Text>
                  <Text
                    className="font-body text-xs"
                    style={{ color: theme.textDefault, opacity: 0.5 }}
                  >
                    Nhấn nút bên trên để thêm ảnh
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {images.map((img, index) => (
                      <View key={index} style={{ position: "relative" }}>
                        <Image
                          source={{ uri: img.uri }}
                          style={{ width: 100, height: 100, borderRadius: 8 }}
                        />
                        {/* Nút X để xóa ảnh khỏi danh sách */}
                        <Pressable
                          onPress={() => handleRemoveImage(index)}
                          hitSlop={4}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 99,
                            padding: 2,
                          }}
                        >
                          <X size={12} color="white" strokeWidth={2.5} />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              <Text
                className="font-body text-xs"
                style={{ color: theme.textDefault, opacity: 0.6 }}
              >
                Bạn có thể tải lên nhiều hình ảnh bài viết của mình
              </Text>
            </View>

            {/* Card nhận xét AI — luôn hiển thị */}
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
              {/* Header: icon + tiêu đề, nút Đánh giá lại khi đã có feedback */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Sparkles size={18} color={theme.primary} strokeWidth={2} />
                  <Text
                    className="font-heading text-base"
                    style={{ color: theme.textDefault }}
                  >
                    Nhận xét từ AI
                  </Text>
                </View>
                {evaluateFeedback ? (
                  <Pressable
                    onPress={() => handleEvaluate()}
                    disabled={isEvaluating || isSubmitting}
                    className="flex-row items-center gap-1"
                  >
                    <Sparkles
                      size={14}
                      color={
                        isEvaluating || isSubmitting
                          ? theme.textMuted
                          : theme.primary
                      }
                      strokeWidth={2}
                    />
                    <Text
                      className="font-body text-xs"
                      style={{
                        color:
                          isEvaluating || isSubmitting
                            ? theme.textMuted
                            : theme.primary,
                      }}
                    >
                      Đánh giá lại
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              {/* Chưa có feedback: mô tả + nút đánh giá */}
              {!evaluateFeedback ? (
                <>
                  <Text
                    className="font-body text-sm"
                    style={{ color: theme.textDefault, opacity: 0.7 }}
                  >
                    Nhờ AI đánh giá bài viết của bạn trước khi nộp để nhận góp
                    ý chi tiết.
                  </Text>
                  <Pressable
                    onPress={() => handleEvaluate()}
                    disabled={images.length === 0 || isEvaluating || isSubmitting}
                    className="flex-row items-center justify-center gap-2 rounded-xl"
                    style={{
                      height: 48,
                      borderWidth: 2,
                      borderColor:
                        images.length === 0 ? theme.border : theme.primary,
                    }}
                  >
                    <Sparkles
                      size={18}
                      color={
                        images.length === 0 ? theme.textMuted : theme.primary
                      }
                      strokeWidth={2}
                    />
                    <Text
                      className="font-heading text-sm"
                      style={{
                        color:
                          images.length === 0 ? theme.textMuted : theme.primary,
                      }}
                    >
                      AI Đánh giá
                    </Text>
                  </Pressable>
                </>
              ) : (
                /* Đã có feedback: hiển thị nội dung */
                <MarkdownText fontSize={14} color={theme.textDefault}>
                  {evaluateFeedback}
                </MarkdownText>
              )}
            </View>
          </ScrollView>

          {/* Thanh hành động cố định dưới cùng */}
          <View
            style={{
              paddingTop: 16,
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 8,
            }}
          >
            <PrimaryButton
              text="Nộp bài"
              onPress={handleSubmit}
              disabled={images.length === 0 || isSubmitting || isEvaluating}
              loading={isSubmitting}
              style={{
                backgroundColor:
                  images.length === 0 ? theme.border : theme.primary,
              }}
            />
          </View>
        </>
      </ScreenAsyncView>
    </View>
  );
}
