import { CalendarDays, ChevronLeft, ImageIcon, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MarkdownText, PrimaryButton } from "@/components/ui";
import { useStartAssignment, useWritingSubmit } from "../hooks";

interface WritingScreenProps {
  id: string;
}

export function WritingScreen({ id }: WritingScreenProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { mutate, data, isPending, isError } = useStartAssignment();
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    if (id) mutate(id);
  }, [id]);

  useEffect(() => {
    if (data && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [data]);

  function getTimeSpentSeconds() {
    return Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
  }

  const { handleSubmit, isPending: isSubmitting } = useWritingSubmit({
    assignmentId: id,
    images,
    getTimeSpentSeconds,
  });

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Cần quyền truy cập",
        "Vui lòng cấp quyền truy cập camera trong Cài đặt.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const dueDate = data?.dueDate
    ? (() => {
        const d = new Date(data.dueDate);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : null;

  return (
    <View
      className="flex-1 bg-background-default"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        className="flex-row items-center px-4 gap-3"
        style={{
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <Pressable
          onPress={() =>
            Alert.alert(
              "Thoát bài tập?",
              "Tiến độ của bạn sẽ không được lưu.",
              [
                { text: "Tiếp tục làm", style: "cancel" },
                {
                  text: "Thoát",
                  style: "destructive",
                  onPress: () => router.back(),
                },
              ],
            )
          }
          hitSlop={8}
        >
          <ChevronLeft size={24} color={theme.textDefault} strokeWidth={2} />
        </Pressable>
        <Text
          className="font-heading text-lg"
          style={{ color: theme.textDefault }}
        >
          Nộp bài tập
        </Text>
      </View>

      {/* Content */}
      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : isError || !data ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted }}
          >
            Không thể tải bài tập. Vui lòng thử lại.
          </Text>
        </View>
      ) : (
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
                className="font-heading text-base"
                style={{ color: theme.textDefault }}
              >
                {data.title}
              </Text>

              {data.description ? (
                <Text
                  className="font-body text-xs"
                  style={{ color: theme.textMuted, lineHeight: 18 }}
                >
                  {data.description}
                </Text>
              ) : null}

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

              {data.writingContent?.prompt ? (
                <View
                  style={{
                    backgroundColor: theme.background,
                    borderRadius: 10,
                    padding: 12,
                    marginTop: 4,
                  }}
                >
                  <MarkdownText fontSize={13} color={theme.textDefault}>
                    {`Yêu cầu: ${data.writingContent.prompt}`}
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
                  className="font-heading text-sm"
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
                  <ImageIcon size={20} color={theme.primary} strokeWidth={2} />
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
              borderTopWidth: 1,
              borderTopColor: theme.border,
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
      )}
    </View>
  );
}
