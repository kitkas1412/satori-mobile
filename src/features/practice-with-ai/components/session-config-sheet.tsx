// Bottom sheet để cấu hình phiên luyện tập AI trước khi bắt đầu.

import {
  ArrowUpDown,
  BookOpen,
  CheckSquare,
  Eye,
  Languages,
  Layers,
  Link2,
  Minus,
  Pencil,
  PenLine,
  Plus,
  ToggleLeft,
  Type,
  Zap,
} from "lucide-react-native";
import { useRef, useState, useEffect } from "react";
import {
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Backdrop, PrimaryButton } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type {
  ExerciseType,
  LessonResponse,
  SessionConfig,
  SessionType,
} from "@/features/practice-with-ai/api";

const TIMING_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };

const MAX_QUESTIONS = 10;
const MIN_QUESTIONS = 1;

const SESSION_TYPES: {
  value: SessionType;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "VOCAB_DRILL",
    label: "Luyện từ vựng",
    subtitle: "Ghi nhớ & kiểm tra",
    icon: null,
  },
  {
    value: "GRAMMAR_DRILL",
    label: "Luyện ngữ pháp",
    subtitle: "Cấu trúc câu",
    icon: null,
  },
  {
    value: "MIXED_LESSON",
    label: "Bài tổng hợp",
    subtitle: "Tất cả kỹ năng",
    icon: null,
  },
  {
    value: "KANJI_READING",
    label: "Đọc Kanji",
    subtitle: "Âm & nghĩa chữ Hán",
    icon: null,
  },
  {
    value: "SENTENCE_BUILD",
    label: "Xây dựng câu",
    subtitle: "Lắp ghép câu hoàn chỉnh",
    icon: null,
  },
];

const EXERCISE_TYPES: {
  value: ExerciseType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "MULTIPLE_CHOICE", label: "Trắc nghiệm", icon: null },
  { value: "FILL_BLANK", label: "Điền vào chỗ trống", icon: null },
  { value: "TRANSLATION", label: "Dịch thuật", icon: null },
  { value: "ORDERING", label: "Sắp xếp câu", icon: null },
  { value: "MATCHING", label: "Ghép đôi", icon: null },
  { value: "TRUE_FALSE", label: "Đúng / Sai", icon: null },
];

export interface SessionConfigSheetProps {
  visible: boolean;
  onClose: () => void;
  lesson: LessonResponse | null;
  onStart: (config: SessionConfig) => void;
}

function SessionTypeIcon({
  type,
  color,
}: {
  type: SessionType;
  color: string;
}) {
  const props = { size: 20, color, strokeWidth: 2 };
  switch (type) {
    case "VOCAB_DRILL":
      return <BookOpen {...props} />;
    case "GRAMMAR_DRILL":
      return <Pencil {...props} />;
    case "MIXED_LESSON":
      return <Layers {...props} />;
    case "KANJI_READING":
      return <Eye {...props} />;
    case "SENTENCE_BUILD":
      return <Type {...props} />;
  }
}

function ExerciseTypeIcon({
  type,
  color,
}: {
  type: ExerciseType;
  color: string;
}) {
  const props = { size: 15, color, strokeWidth: 2 };
  switch (type) {
    case "MULTIPLE_CHOICE":
      return <CheckSquare {...props} />;
    case "FILL_BLANK":
      return <PenLine {...props} />;
    case "TRANSLATION":
      return <Languages {...props} />;
    case "ORDERING":
      return <ArrowUpDown {...props} />;
    case "MATCHING":
      return <Link2 {...props} />;
    case "TRUE_FALSE":
      return <ToggleLeft {...props} />;
  }
}

export function SessionConfigSheet({
  visible,
  onClose,
  lesson,
  onStart,
}: SessionConfigSheetProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [sessionType, setSessionType] = useState<SessionType>("VOCAB_DRILL");
  const [questionCount, setQuestionCount] = useState(5);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([
    "MULTIPLE_CHOICE",
  ]);

  const [internalVisible, setInternalVisible] = useState(visible);
  const translateY = useSharedValue(600);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      translateY.value = withTiming(0, TIMING_CONFIG);
    } else {
      translateY.value = withTiming(600, TIMING_CONFIG, (finished) => {
        if (finished) runOnJS(setInternalVisible)(false);
      });
    }
  }, [visible]);

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Dùng ref để tránh stale closure trong PanResponder
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) {
          translateY.value = gs.dy;
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.5) {
          onCloseRef.current();
        } else {
          translateY.value = withTiming(0, TIMING_CONFIG);
        }
      },
      onPanResponderTerminate: () => {
        translateY.value = withTiming(0, TIMING_CONFIG);
      },
    }),
  ).current;

  function toggleExerciseType(type: ExerciseType) {
    setExerciseTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  }

  function handleStart() {
    onStart({ sessionType, questionCount, exerciseTypes });
  }

  return (
    <Modal
      visible={internalVisible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Backdrop visible={visible} onPress={onClose} />

        <Animated.View
          className="rounded-t-3xl"
          style={[
            panelAnimatedStyle,
            {
              backgroundColor: theme.background.page,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
              maxHeight: "92%",
            },
          ]}
        >
          {/* Drag handle + header — vùng kéo để đóng sheet */}
          <View {...panResponder.panHandlers}>
            <View className="items-center pt-3 pb-1">
              <View
                className="rounded-full"
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: theme.icon.primary,
                }}
              />
            </View>

            <View className="flex-row items-center px-5" style={{ height: 65 }}>
              <View className="flex-1 gap-0.5">
                <Text
                  className="font-heading text-lg"
                  style={{ color: theme.text.primary }}
                >
                  Cấu hình luyện tập
                </Text>
                {lesson && (
                  <Text
                    className="font-body text-xs"
                    style={{ color: theme.text.secondary }}
                  >
                    {lesson.title} · {lesson.vocabularyCount} từ vựng ·{" "}
                    {lesson.grammarPointCount} ngữ pháp
                  </Text>
                )}
              </View>
            </View>

            <View
              className="mx-5"
              style={{ height: 1, backgroundColor: theme.border.subtle }}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, gap: 20 }}
          >
            {/* Section A: Session type */}
            <View className="gap-2.5">
              <View className="flex-row items-center gap-1.5">
                <Zap size={14} color={theme.text.primary} strokeWidth={2} />
                <Text
                  className="font-heading text-[13px]"
                  style={{ color: theme.text.primary }}
                >
                  Loại phiên luyện tập
                </Text>
              </View>

              <View
                className="flex-row flex-wrap gap-y-[10px]"
                style={{ gap: 10 }}
              >
                {SESSION_TYPES.map((item) => {
                  const isSelected = sessionType === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => setSessionType(item.value)}
                      className="rounded-2xl p-[15px] gap-2"
                      style={{
                        width: "48%",
                        backgroundColor: theme.background.surface,
                        borderWidth: isSelected ? 1.5 : 1,
                        borderColor: isSelected
                          ? theme.brand.primary
                          : theme.border.subtle,
                      }}
                    >
                      <View
                        className="rounded-xl items-center justify-center"
                        style={{
                          width: 36,
                          height: 36,
                          backgroundColor: theme.brand.primarySubtle,
                        }}
                      >
                        <SessionTypeIcon
                          type={item.value}
                          color={
                            isSelected
                              ? theme.brand.primary
                              : theme.icon.secondary
                          }
                        />
                      </View>
                      <View className="gap-px">
                        <Text
                          className="font-heading text-[13px]"
                          style={{
                            color: isSelected
                              ? theme.text.primary
                              : theme.text.disabled,
                          }}
                        >
                          {item.label}
                        </Text>
                        <Text
                          className="font-body text-[10px]"
                          style={{
                            color: isSelected
                              ? theme.text.secondary
                              : theme.text.disabled,
                          }}
                        >
                          {item.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Section B: Question count */}
            <View className="gap-2.5">
              <View className="flex-row items-center gap-1.5">
                <CheckSquare
                  size={14}
                  color={theme.text.primary}
                  strokeWidth={2}
                />
                <Text
                  className="font-heading text-[13px]"
                  style={{ color: theme.text.primary }}
                >
                  Số câu hỏi
                </Text>
                <View className="rounded-full px-2 py-0.5 ml-1">
                  <Text
                    className="font-body text-[10px]"
                    style={{ color: theme.text.secondary }}
                  >
                    Tối đa {MAX_QUESTIONS}
                  </Text>
                </View>
              </View>

              <View
                className="flex-row items-center justify-between px-2 py-0.5 rounded-[18px]"
                style={{
                  height: 69,
                  borderWidth: 1,
                  borderColor: theme.border.subtle,
                  backgroundColor: theme.background.surface,
                }}
              >
                <Pressable
                  onPress={() =>
                    setQuestionCount((c) => Math.max(MIN_QUESTIONS, c - 1))
                  }
                  className="rounded-xl items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: theme.border.subtle,
                  }}
                >
                  <Minus size={18} color={theme.icon.primary} strokeWidth={2} />
                </Pressable>

                <View className="items-center gap-0.5">
                  <Text
                    className="font-heading"
                    style={{
                      fontSize: 32,
                      color: theme.text.primary,
                      lineHeight: 36,
                    }}
                  >
                    {questionCount}
                  </Text>
                  <Text
                    className="font-body text-[11px]"
                    style={{ color: theme.text.secondary }}
                  >
                    câu hỏi
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setQuestionCount((c) => Math.min(MAX_QUESTIONS, c + 1))
                  }
                  className="rounded-xl items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: theme.brand.primary,
                  }}
                >
                  <Plus size={18} color={theme.icon.onBrand} strokeWidth={2} />
                </Pressable>
              </View>
            </View>

            {/* Section C: Exercise types */}
            <View className="gap-2.5">
              <View className="flex-row items-center gap-1.5">
                <Layers size={14} color={theme.text.primary} strokeWidth={2} />
                <Text
                  className="font-heading text-[13px]"
                  style={{ color: theme.text.primary }}
                >
                  Dạng bài tập
                </Text>
                <View className="rounded-full px-2 py-0.5 ml-1">
                  <Text
                    className="font-body text-[10px]"
                    style={{ color: theme.text.secondary }}
                  >
                    Chọn nhiều
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {EXERCISE_TYPES.map((item) => {
                  const isSelected = exerciseTypes.includes(item.value);
                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => toggleExerciseType(item.value)}
                      className="flex-row items-center gap-2 rounded-2xl px-[15px]"
                      style={{
                        width: "48%",
                        height: 43,
                        backgroundColor: theme.border.subtle,
                        borderWidth: isSelected ? 1 : 1,
                        borderColor: isSelected
                          ? theme.brand.primary
                          : theme.border.subtle,
                      }}
                    >
                      <ExerciseTypeIcon
                        type={item.value}
                        color={
                          isSelected ? theme.text.primary : theme.text.disabled
                        }
                      />
                      <Text
                        className="font-heading text-[12px]"
                        style={{
                          color: isSelected
                            ? theme.text.primary
                            : theme.text.disabled,
                          flexShrink: 1,
                        }}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* CTA */}
          <View className="px-5 pt-3">
            <PrimaryButton text="Bắt đầu luyện tập" onPress={handleStart} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
