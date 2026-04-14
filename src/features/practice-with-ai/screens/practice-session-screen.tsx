// Màn hình luyện tập với AI — hiển thị từng câu hỏi trắc nghiệm.
// Luồng: khởi tạo session → người dùng chọn đáp án → xác nhận → câu tiếp theo
//        → hoàn thành → chuyển sang màn hình kết quả

import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoadingOverlay, PrimaryButton, ProgressBar } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type {
  AnswerResponse,
  Items,
  SessionType,
} from "../api/practice-with-ai.types";
import {
  FeedbackPanel,
  FillBlankSection,
  MatchingSection,
  MultipleChoiceSection,
  QuestionCard,
  SentenceOrderSection,
  SessionHeader,
  TranslationSection,
  TrueFalseSection,
} from "../components";
import { usePracticeSession, useSubmitAnswer } from "../hooks";

const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  VOCAB_DRILL: "Từ vựng",
  GRAMMAR_DRILL: "Ngữ pháp",
  MIXED_LESSON: "Hỗn hợp",
};

export function PracticeSessionScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const {
    lessonId,
    sessionType,
    preset,
    itemTypes,
    selectedVocabIds,
    selectedGrammarIds,
  } = useLocalSearchParams<{
    lessonId: string;
    sessionType: string;
    preset?: string;
    itemTypes: string;
    selectedVocabIds?: string;
    selectedGrammarIds?: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([]);
  const [confirmedMatchingPairs, setConfirmedMatchingPairs] = useState<
    { leftId: number; rightId: number }[]
  >([]);
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
    if (lessonId && sessionType && itemTypes) {
      startSession({
        lessonId,
        sessionType: sessionType as SessionType,
        ...(preset ? { preset: preset as "QUICK" | "STANDARD" | "FULL" } : {}),
        itemTypes: JSON.parse(itemTypes),
        selectedVocabIds: selectedVocabIds
          ? JSON.parse(selectedVocabIds)
          : null,
        selectedGrammarIds: selectedGrammarIds
          ? JSON.parse(selectedGrammarIds)
          : null,
      });
    }
  }, []);

  function handleToggleWord(id: number) {
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id],
    );
  }

  function handleMatchingPairsChange(
    pairs: { leftId: number; rightId: number }[],
  ) {
    setConfirmedMatchingPairs(pairs);
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

    // MATCHING: submit trực tiếp, không qua FeedbackPanel
    if (currentItem.itemType === "MATCHING") {
      if (confirmedMatchingPairs.length === 0) return;
      const userAnswer = confirmedMatchingPairs
        .map(({ leftId, rightId }) => `${leftId}:${rightId}`)
        .join(",");
      submitAnswer(
        {
          sessionId: sessionData.session.sessionId,
          itemId: currentItem.id,
          userAnswer,
        },
        {
          onSuccess: (result) => {
            setStreak((s) => (result.correct ? s + 1 : 0));
            if (result.sessionCompleted || currentIndex + 1 >= totalItems) {
              router.replace({
                pathname: "/practice-result",
                params: { practiceSessionId: sessionData.session.sessionId },
              });
            } else {
              setCurrentIndex((i) => i + 1);
              setConfirmedMatchingPairs([]);
              setSelectedOptionId(null);
              setSelectedWordIds([]);
              setAnswerResult(null);
              setShowHint(false);
            }
          },
        },
      );
      return;
    }

    // Phase 2: feedback đã hiển thị → chuyển câu tiếp
    if (answerResult !== null) {
      if (answerResult.sessionCompleted || currentIndex + 1 >= totalItems) {
        router.replace({
          pathname: "/practice-result",
          params: { practiceSessionId: sessionData.session.sessionId },
        });
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOptionId(null);
        setSelectedWordIds([]);
        setAnswerResult(null);
        setShowHint(false);
      }
      return;
    }

    if (currentItem.itemType === "SENTENCE_ORDER") {
      if (selectedWordIds.length === 0) return;
      const userAnswer = selectedWordIds
        .map((id) => currentItem.options.find((o) => o.id === id)?.text ?? "")
        .join(" ");
      submitAnswer(
        {
          sessionId: sessionData.session.sessionId,
          itemId: currentItem.id,
          userAnswer,
        },
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
  const totalItems = session?.totalItems ?? 0;
  const completedCount = currentIndex + (answerResult !== null ? 1 : 0);
  const progress = totalItems > 0 ? completedCount / totalItems : 0;
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

        {/* Fixed top: header + progress + question card */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 16,
          }}
        >
          <SessionHeader
            sessionTypeLabel={sessionTypeLabel}
            currentIndex={currentIndex}
            totalItems={totalItems}
            streak={streak}
            theme={theme}
            onClose={handleClose}
          />

          <ProgressBar progress={progress} height={6} />

          {currentItem && (
            <QuestionCard
              itemType={currentItem.itemType}
              question={currentItem.question}
              hint={currentItem.hint}
              showHint={showHint}
              onToggleHint={() => setShowHint((v) => !v)}
              theme={theme}
            />
          )}
        </View>

        {/* Answer area */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          {currentItem && (
            <>
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
                  key={currentIndex}
                  currentItem={currentItem}
                  isSubmitting={isSubmitting}
                  theme={theme}
                  onConfirmedPairsChange={handleMatchingPairsChange}
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
        </View>

        {/* Bottom: feedback + confirm button */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            gap: 8,
            backgroundColor: theme.background.page,
          }}
        >
          {answerResult !== null && (
            <FeedbackPanel answerResult={answerResult} theme={theme} />
          )}
          <PrimaryButton
            text={
              currentItem?.itemType === "MATCHING"
                ? "Tiếp tục"
                : answerResult !== null
                  ? "Tiếp theo"
                  : "Xác nhận"
            }
            onPress={handleConfirm}
            disabled={
              !currentItem ||
              (currentItem.itemType === "MATCHING"
                ? confirmedMatchingPairs.length <
                  currentItem.options.filter((o) => o.side === "LEFT").length
                : selectedOptionId === null &&
                  selectedWordIds.length === 0 &&
                  answerResult === null)
            }
            loading={isSubmitting}
          />
        </View>
      </View>
    </>
  );
}
