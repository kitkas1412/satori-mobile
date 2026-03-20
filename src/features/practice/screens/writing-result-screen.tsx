import { AlertTriangle, CheckCircle2, ChevronLeft, ImageOff, X } from "lucide-react-native";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePracticeStore } from "@/stores";

export function WritingResultScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const writingResult = usePracticeStore((s) => s.writingResult);
  const clearWritingResult = usePracticeStore((s) => s.clearWritingResult);

  const isGraded = writingResult?.status === "GRADED";

  const imageUrls = writingResult?.imageUrls ?? [];

  function handleGoHome() {
    clearWritingResult();
    router.replace("/(tabs)/practice");
  }

  function handleCancelSubmission() {
    Alert.alert(
      "Hủy nộp bài?",
      "Nếu hủy nộp bài, giáo viên sẽ không nhận được bài làm của bạn.",
      [
        { text: "Giữ lại", style: "cancel" },
        {
          text: "Hủy nộp bài",
          style: "destructive",
          onPress: () => {
            clearWritingResult();
            router.replace("/(tabs)/practice");
          },
        },
      ],
    );
  }

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
        <Pressable onPress={handleGoHome} hitSlop={8}>
          <ChevronLeft size={24} color={theme.textDefault} strokeWidth={2} />
        </Pressable>
        <Text className="font-heading text-lg" style={{ color: theme.textMuted }}>
          Bài tập đã nộp
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
          gap: 16,
        }}
      >
        {/* Success section */}
        <View className="items-center gap-3">
          <View style={{ position: "relative" }}>
            <View
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#00a63e",
                opacity: 0.15,
              }}
            />
            <CheckCircle2
              size={80}
              color="#00a63e"
              strokeWidth={1.5}
            />
          </View>
          <Text className="font-heading text-xl" style={{ color: theme.textMuted }}>
            Đã nộp bài thành công!
          </Text>
          <Text
            className="font-body text-sm text-center"
            style={{ color: theme.textMuted, opacity: 0.7 }}
          >
            Bài tập đã được gửi đến giáo viên
          </Text>
        </View>

        {/* Image card */}
        <View
          style={{
            backgroundColor: theme.cardBackground,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.1)",
            padding: 20,
          }}
        >
          {imageUrls.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {imageUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={{ width: 120, height: 120, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View className="items-center gap-3" style={{ paddingVertical: 16 }}>
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
              <Text className="font-heading text-sm" style={{ color: theme.textMuted }}>
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

        {/* Warning box */}
        {!isGraded && (
          <View
            style={{
              backgroundColor: "#fff1f0",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#ffccc7",
              padding: 16,
            }}
          >
            <View className="flex-row gap-2 items-start">
              <AlertTriangle
                size={20}
                color="#cf1322"
                strokeWidth={1.5}
                style={{ marginTop: 1 }}
              />
              <View className="flex-1 gap-1">
                <Text
                  className="font-heading text-sm"
                  style={{ color: "#cf1322" }}
                >
                  Lưu ý
                </Text>
                <Text
                  className="font-body text-xs"
                  style={{ color: "#cf1322", lineHeight: 19 }}
                >
                  Nếu hủy nộp bài, giáo viên sẽ không nhận được bài làm của bạn.
                </Text>
              </View>
            </View>
          </View>
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
        }}
      >
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleGoHome}
            className="flex-1 items-center justify-center rounded-xl"
            style={{ height: 48, backgroundColor: theme.primary }}
          >
            <Text className="font-heading text-sm" style={{ color: theme.white }}>
              Về trang chủ
            </Text>
          </Pressable>

          {!isGraded && (
            <Pressable
              onPress={handleCancelSubmission}
              className="flex-1 items-center justify-center rounded-xl"
              style={{
                height: 48,
                backgroundColor: theme.white,
                borderWidth: 2,
                borderColor: "#ff4d4f",
              }}
            >
              <Text className="font-heading text-sm" style={{ color: "#ff4d4f" }}>
                Hủy nộp bài
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
