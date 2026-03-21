import { CalendarDays, CameraIcon, ImageIcon, X } from "lucide-react-native";
import { useEffect } from "react";
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

  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

  const { handleSubmit, isPending: isSubmitting } = useWritingSubmit({
    assignmentId: id,
    images,
  });
  const { handleExit } = useExitAssignment(() => router.back());

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <LoadingOverlay visible={isPending} title="Đang tải bài tập..." />
      <LoadingOverlay visible={isSubmitting} title="Đang nộp bài..." />

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
            {/* Assignment Info Card */}
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

            {/* Your Work Card */}
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
              {/* Card header */}
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

              {/* Action buttons */}
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

              {/* Image preview area */}
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
          </ScrollView>

          {/* Bottom submit bar */}
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
              disabled={images.length === 0 || isSubmitting}
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
