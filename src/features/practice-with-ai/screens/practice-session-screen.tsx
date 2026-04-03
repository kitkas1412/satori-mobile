// Màn hình luyện tập với AI — hiển thị từng câu hỏi trắc nghiệm.
// Luồng: khởi tạo session → người dùng chọn đáp án → xác nhận → câu tiếp theo
//        → hoàn thành → chuyển sang màn hình kết quả

import { Flame, Lightbulb, X, Zap } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { LoadingOverlay, PrimaryButton, ProgressBar } from "@/components/ui";
import { Colors, Primitive } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePracticeSession, useSubmitAnswer } from "../hooks";
import type { Items, SessionType } from "../api/practice-with-ai.types";

const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  VOCAB_DRILL: "Từ vựng",
  GRAMMAR_DRILL: "Ngữ pháp",
  MIXED_LESSON: "Hỗn hợp",
  KANJI_READING: "Kanji",
  SENTENCE_BUILD: "Câu",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function PracticeSessionScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { lessonId, sessionType, questionCount, itemTypes } =
    useLocalSearchParams<{
      lessonId: string;
      sessionType: string;
      questionCount: string;
      itemTypes: string;
    }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const {
    mutate: startSession,
    data: sessionData,
    isPending: isInitializing,
    isError: isInitError,
  } = usePracticeSession();

  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();

  useEffect(() => {
    console.log("[PracticeSession] isInitializing:", isInitializing);
  }, [isInitializing]);

  useEffect(() => {
    console.log("[PracticeSession] isSubmitting:", isSubmitting);
  }, [isSubmitting]);

  useEffect(() => {
    if (lessonId && sessionType && questionCount && itemTypes) {
      startSession({
        lessonId,
        sessionType: sessionType as SessionType,
        itemCount: parseInt(questionCount, 10),
        itemTypes: JSON.parse(itemTypes),
      });
    }
  }, []);

  function handleClose() {
    Alert.alert(
      "Kết thúc buổi học",
      "Tiến độ sẽ không được lưu. Bạn chắc chắn chứ?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Kết thúc",
          style: "destructive",
          onPress: () => router.replace("/(tabs)/practice"),
        },
      ],
    );
  }

  function handleConfirm() {
    if (!sessionData || selectedOptionId === null) return;

    const currentItem: Items = sessionData.items[currentIndex];
    const selectedOption = currentItem.options.find(
      (o) => o.id === selectedOptionId,
    );
    if (!selectedOption) return;

    submitAnswer(
      {
        sessionId: sessionData.session.sessionId,
        itemId: currentItem.id,
        userAnswer: selectedOption.text,
      },
      {
        onSuccess: (result) => {
          setStreak((s) => (result.correct ? s + 1 : 0));

          if (result.sessionCompleted) {
            router.replace({
              pathname: "/practice-result",
              params: { practiceSessionId: sessionData.session.sessionId },
            });
          } else {
            setCurrentIndex((i) => i + 1);
            setSelectedOptionId(null);
            setShowHint(false);
          }
        },
      },
    );
  }

  if (isInitError) {
    return (
      <View
        className="flex-1 items-center justify-center px-8 gap-4"
        style={{
          paddingTop: insets.top,
          backgroundColor: theme.background.page,
        }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Text
          className="font-heading text-base text-center"
          style={{ color: theme.text.primary }}
        >
          Không thể khởi tạo phiên luyện tập
        </Text>
        <PrimaryButton
          text="Về trang luyện tập"
          onPress={() => router.replace("/(tabs)/practice")}
        />
      </View>
    );
  }

  const items = sessionData?.items ?? [];
  const session = sessionData?.session;
  const currentItem: Items | undefined = items[currentIndex];
  const totalItems = session?.totalItems ?? parseInt(questionCount ?? "0", 10);
  const progress = totalItems > 0 ? currentIndex / totalItems : 0;
  const sessionTypeLabel =
    SESSION_TYPE_LABEL[sessionType as SessionType] ?? sessionType;

  return (
    <>
      <View
        className="flex-1"
        style={{
          paddingTop: insets.top,
          backgroundColor: theme.background.page,
        }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <LoadingOverlay
          visible={isInitializing || isSubmitting}
          title="Đang xử lý..."
          message="Vui lòng đợi trong giây lát"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom, 16) + 92,
            gap: 16,
          }}
        >
          {/* Header row: X | badge + câu số | streak */}
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={24} color={theme.icon.primary} strokeWidth={2} />
            </TouchableOpacity>

            <View className="flex-1 items-center gap-[3px]">
              <View
                className="flex-row items-center gap-[5px] rounded-full"
                style={{
                  paddingHorizontal: 10.5,
                  paddingVertical: 1,
                  backgroundColor: theme.border.subtle,
                  borderWidth: 0.5,
                  borderColor: theme.brand.primary,
                }}
              >
                <Zap
                  size={10}
                  color={theme.brand.primary}
                  fill={theme.brand.primary}
                />
                <Text
                  className="font-heading"
                  style={{ fontSize: 11, color: theme.brand.primary }}
                >
                  {sessionTypeLabel}
                </Text>
              </View>
              <Text
                className="font-body text-xs"
                style={{ color: theme.text.secondary }}
              >
                Câu {currentIndex + 1} / {totalItems}
              </Text>
            </View>

            <View className="flex-row items-center gap-[3px]">
              <Flame
                size={14}
                color={Primitive.amber[300]}
                fill={Primitive.amber[300]}
              />
              <Text
                className="font-heading"
                style={{ fontSize: 16, color: Primitive.amber[300] }}
              >
                {streak}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <ProgressBar progress={progress} height={6} />

          {/* Question card + options */}
          {currentItem && (
            <>
              {/* Question card */}
              <View
                style={{
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 21,
                  gap: 14,
                  backgroundColor: theme.background.surface,
                  borderWidth: 1,
                  borderColor: theme.border.subtle,
                }}
              >
                {/* "TRẮC NGHIỆM" label */}
                <View className="flex-row items-center gap-1.5">
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.brand.primary,
                    }}
                  />
                  <Text
                    className="font-body"
                    style={{
                      fontSize: 11,
                      letterSpacing: 0.55,
                      color: theme.text.secondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Trắc nghiệm
                  </Text>
                </View>

                {/* Question text */}
                <Text
                  className="font-heading"
                  style={{
                    fontSize: 18,
                    lineHeight: 26,
                    color: theme.text.primary,
                  }}
                >
                  {currentItem.question}
                </Text>

                {/* Hint */}
                <TouchableOpacity
                  onPress={() => setShowHint((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="gap-1"
                >
                  <View className="flex-row items-center gap-1.5">
                    <Lightbulb size={14} color={theme.text.secondary} />
                    <Text
                      className="font-body text-xs"
                      style={{ color: theme.text.secondary }}
                    >
                      Xem gợi ý
                    </Text>
                  </View>
                  {showHint && currentItem.hint ? (
                    <Text
                      className="font-body text-sm"
                      style={{ color: theme.text.secondary, marginTop: 4 }}
                    >
                      {currentItem.hint}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>

              {/* Answer options */}
              {currentItem.itemType === "MULTIPLE_CHOICE" ? (
                <View style={{ gap: 10 }}>
                  {currentItem.options.map((option, index) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => setSelectedOptionId(option.id)}
                        disabled={isSubmitting}
                        style={{
                          height: 62,
                          borderRadius: 16,
                          borderWidth: 1.23,
                          borderColor: isSelected
                            ? theme.brand.primary
                            : theme.border.subtle,
                          backgroundColor: isSelected
                            ? theme.brand.primary
                            : theme.background.surface,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 17,
                          gap: 14,
                        }}
                      >
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            borderWidth: 1,
                            borderColor: isSelected
                              ? theme.icon.onBrand
                              : theme.border.default,
                            backgroundColor: isSelected
                              ? theme.brand.primary
                              : theme.background.surface,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            className="font-heading"
                            style={{
                              fontSize: 13,
                              color: isSelected
                                ? theme.icon.onBrand
                                : theme.icon.disabled,
                            }}
                          >
                            {OPTION_LETTERS[index] ?? String(index + 1)}
                          </Text>
                        </View>

                        <Text
                          className="font-heading flex-1"
                          style={{
                            fontSize: 15,
                            lineHeight: 22,
                            color: isSelected
                              ? theme.text.onBrand
                              : theme.text.disabled,
                          }}
                        >
                          {option.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View
                  className="rounded-2xl p-5 items-center justify-center"
                  style={{
                    backgroundColor: theme.background.surface,
                    borderWidth: 1,
                    borderColor: theme.border.subtle,
                    minHeight: 80,
                  }}
                >
                  <Text
                    className="font-body text-sm text-center"
                    style={{ color: theme.text.secondary }}
                  >
                    Loại câu hỏi này chưa được hỗ trợ
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Bottom sticky confirm button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            backgroundColor: theme.background.page,
          }}
        >
          <PrimaryButton
            text="Xác nhận"
            onPress={handleConfirm}
            disabled={selectedOptionId === null || !currentItem}
            loading={isSubmitting}
          />
        </View>
      </View>
    </>
  );
}
