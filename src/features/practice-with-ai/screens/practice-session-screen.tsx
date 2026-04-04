// Màn hình luyện tập với AI — hiển thị từng câu hỏi trắc nghiệm.
// Luồng: khởi tạo session → người dùng chọn đáp án → xác nhận → câu tiếp theo
//        → hoàn thành → chuyển sang màn hình kết quả

import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { LoadingOverlay, PrimaryButton, ProgressBar } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePracticeSession, useSubmitAnswer } from "../hooks";
import type {
  AnswerResponse,
  Items,
  SessionType,
} from "../api/practice-with-ai.types";
import {
  FillBlankSection,
  MatchingSection,
  MultipleChoiceSection,
  QuestionCard,
  SentenceOrderSection,
  SessionHeader,
  TranslationSection,
  TrueFalseSection,
} from "../components";

const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  VOCAB_DRILL: "Từ vựng",
  GRAMMAR_DRILL: "Ngữ pháp",
  MIXED_LESSON: "Hỗn hợp",
  KANJI_READING: "Kanji",
  SENTENCE_BUILD: "Câu",
};

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
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<{ leftId: number; rightId: number }[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);

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

  function handleToggleWord(id: number) {
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id],
    );
  }

  function handleSelectLeft(id: number) {
    const isPaired = matchedPairs.some((p) => p.leftId === id);
    if (isPaired) {
      setMatchedPairs((prev) => prev.filter((p) => p.leftId !== id));
      return;
    }
    setSelectedLeftId((prev) => (prev === id ? null : id));
  }

  function handleSelectRight(id: number) {
    const isPaired = matchedPairs.some((p) => p.rightId === id);
    if (isPaired) {
      setMatchedPairs((prev) => prev.filter((p) => p.rightId !== id));
      return;
    }
    if (selectedLeftId === null) return;
    setMatchedPairs((prev) => [...prev, { leftId: selectedLeftId, rightId: id }]);
    setSelectedLeftId(null);
  }

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
    if (!sessionData || !currentItem) return;

    // Phase 2: feedback đã hiển thị → chuyển câu tiếp
    if (answerResult !== null) {
      if (answerResult.sessionCompleted) {
        router.replace({
          pathname: "/practice-result",
          params: { practiceSessionId: sessionData.session.sessionId },
        });
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
        setSelectedWordIds([]);
        setMatchedPairs([]);
        setSelectedLeftId(null);
        setAnswerResult(null);
        setShowHint(false);
      }
      return;
    }

    // Phase 1: submit câu trả lời
    if (currentItem.itemType === "MATCHING") {
      if (matchedPairs.length === 0) return;
      const userAnswer = matchedPairs
        .map(({ leftId, rightId }) => `${leftId}:${rightId}`)
        .join(",");
      submitAnswer(
        { sessionId: sessionData.session.sessionId, itemId: currentItem.id, userAnswer },
        {
          onSuccess: (result) => {
            setStreak((s) => (result.correct ? s + 1 : 0));
            setAnswerResult(result);
          },
        },
      );
      return;
    }

    if (currentItem.itemType === "SENTENCE_ORDER") {
      if (selectedWordIds.length === 0) return;
      const userAnswer = selectedWordIds
        .map((id) => currentItem.options.find((o) => o.id === id)?.text ?? "")
        .join(" ");
      submitAnswer(
        { sessionId: sessionData.session.sessionId, itemId: currentItem.id, userAnswer },
        {
          onSuccess: (result) => {
            setStreak((s) => (result.correct ? s + 1 : 0));
            setAnswerResult(result);
          },
        },
      );
      return;
    }

    if (selectedOptionId === null) return;
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
          setAnswerResult(result);
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
          <SessionHeader
            sessionTypeLabel={sessionTypeLabel}
            currentIndex={currentIndex}
            totalItems={totalItems}
            streak={streak}
            theme={theme}
            onClose={handleClose}
          />

          {/* Progress bar */}
          <ProgressBar progress={progress} height={6} />

          {/* Question card + options */}
          {currentItem && (
            <>
              {/* Question card */}
              <QuestionCard
                itemType={currentItem.itemType}
                question={currentItem.question}
                hint={currentItem.hint}
                showHint={showHint}
                onToggleHint={() => setShowHint((v) => !v)}
                theme={theme}
              />

              {/* Answer options */}
              {currentItem.itemType === "MULTIPLE_CHOICE" ? (
                <MultipleChoiceSection
                  currentItem={currentItem}
                  selectedOptionId={selectedOptionId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectOption={setSelectedOptionId}
                />
              ) : currentItem.itemType === "FILL_BLANK" ? (
                <FillBlankSection
                  currentItem={currentItem}
                  selectedOptionId={selectedOptionId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectOption={setSelectedOptionId}
                />
              ) : currentItem.itemType === "TRANSLATION" ? (
                <TranslationSection
                  currentItem={currentItem}
                  selectedOptionId={selectedOptionId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectOption={setSelectedOptionId}
                />
              ) : currentItem.itemType === "SENTENCE_ORDER" ? (
                <SentenceOrderSection
                  currentItem={currentItem}
                  selectedWordIds={selectedWordIds}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onToggleWord={handleToggleWord}
                />
              ) : currentItem.itemType === "MATCHING" ? (
                <MatchingSection
                  currentItem={currentItem}
                  matchedPairs={matchedPairs}
                  selectedLeftId={selectedLeftId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectLeft={handleSelectLeft}
                  onSelectRight={handleSelectRight}
                />
              ) : currentItem.itemType === "TRUE_FALSE" ? (
                <TrueFalseSection
                  currentItem={currentItem}
                  selectedOptionId={selectedOptionId}
                  answerResult={answerResult}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onSelectOption={setSelectedOptionId}
                />
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
            text={answerResult !== null ? "Tiếp theo" : "Xác nhận"}
            onPress={handleConfirm}
            disabled={
              (selectedOptionId === null &&
                selectedWordIds.length === 0 &&
                matchedPairs.length === 0 &&
                answerResult === null) ||
              !currentItem
            }
            loading={isSubmitting}
          />
        </View>
      </View>
    </>
  );
}
