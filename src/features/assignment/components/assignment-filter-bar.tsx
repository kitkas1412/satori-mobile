// Filter bar cho danh sách bài tập.
// Hiển thị 2 pill button (Trạng thái, Lớp). Tap vào pill để expand options sang bên trái.

import { ChevronRight } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { LessonResponse } from "@/features/practice-with-ai/api/practice-with-ai.types";
import type { AssignmentStatusFilter, LearnerClass } from "../api/assignment.types";

const TIMING = { duration: 250, easing: Easing.out(Easing.cubic) };
// Giá trị maxWidth đủ lớn để chứa tất cả option chips khi expand
const MAX_OPTIONS_WIDTH = 800;

const STATUS_OPTIONS: { label: string; value: AssignmentStatusFilter }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Chưa làm", value: "NOT_STARTED" },
  { label: "Đang làm", value: "IN_PROGRESS" },
  { label: "Đã nộp", value: "SUBMITTED" },
  { label: "Đã chấm", value: "GRADED" },
  { label: "Quá hạn", value: "OVERDUE" },
];

interface AssignmentFilterBarProps {
  status: AssignmentStatusFilter;
  onStatusChange: (status: AssignmentStatusFilter) => void;
  classId: string | undefined;
  onClassChange: (classId: string | undefined) => void;
  classes: LearnerClass[];
  lessonId: string | undefined;
  onLessonChange: (lessonId: string | undefined) => void;
  lessons: LessonResponse[];
}

export function AssignmentFilterBar({
  status,
  onStatusChange,
  classId,
  onClassChange,
  classes,
  lessonId,
  onLessonChange,
  lessons,
}: AssignmentFilterBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const scrollRef = useRef<ScrollView>(null);
  const [expanded, setExpanded] = useState<"status" | "class" | "lesson" | null>(null);

  const statusMaxWidth = useSharedValue(0);
  const statusOpacity = useSharedValue(0);
  const classMaxWidth = useSharedValue(0);
  const classOpacity = useSharedValue(0);
  const lessonMaxWidth = useSharedValue(0);
  const lessonOpacity = useSharedValue(0);
  const statusChevronDeg = useSharedValue(0);
  const classChevronDeg = useSharedValue(0);
  const lessonChevronDeg = useSharedValue(0);

  const statusOptionsStyle = useAnimatedStyle(() => ({
    maxWidth: statusMaxWidth.value,
    opacity: statusOpacity.value,
  }));

  const classOptionsStyle = useAnimatedStyle(() => ({
    maxWidth: classMaxWidth.value,
    opacity: classOpacity.value,
  }));

  const statusChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${statusChevronDeg.value}deg` }],
  }));

  const classChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${classChevronDeg.value}deg` }],
  }));

  const lessonOptionsStyle = useAnimatedStyle(() => ({
    maxWidth: lessonMaxWidth.value,
    opacity: lessonOpacity.value,
  }));

  const lessonChevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${lessonChevronDeg.value}deg` }],
  }));

  function closeAll() {
    statusMaxWidth.value = withTiming(0, TIMING);
    statusOpacity.value = withTiming(0, TIMING);
    classMaxWidth.value = withTiming(0, TIMING);
    classOpacity.value = withTiming(0, TIMING);
    lessonMaxWidth.value = withTiming(0, TIMING);
    lessonOpacity.value = withTiming(0, TIMING);
    statusChevronDeg.value = withTiming(0, TIMING);
    classChevronDeg.value = withTiming(0, TIMING);
    lessonChevronDeg.value = withTiming(0, TIMING);
  }

  function toggleFilter(filter: "status" | "class" | "lesson") {
    const isOpening = expanded !== filter;
    closeAll();

    if (isOpening) {
      setExpanded(filter);
      if (filter === "status") {
        statusMaxWidth.value = withTiming(MAX_OPTIONS_WIDTH, TIMING);
        statusOpacity.value = withTiming(1, TIMING);
        statusChevronDeg.value = withTiming(180, TIMING);
      } else if (filter === "class") {
        classMaxWidth.value = withTiming(MAX_OPTIONS_WIDTH, TIMING);
        classOpacity.value = withTiming(1, TIMING);
        classChevronDeg.value = withTiming(180, TIMING);
      } else {
        lessonMaxWidth.value = withTiming(MAX_OPTIONS_WIDTH, TIMING);
        lessonOpacity.value = withTiming(1, TIMING);
        lessonChevronDeg.value = withTiming(180, TIMING);
      }
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      setExpanded(null);
    }
  }

  function selectStatus(value: AssignmentStatusFilter) {
    onStatusChange(value);
    setExpanded(null);
    statusMaxWidth.value = withTiming(0, TIMING);
    statusOpacity.value = withTiming(0, TIMING);
    statusChevronDeg.value = withTiming(0, TIMING);
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }

  function selectClass(id: string) {
    onClassChange(id);
    setExpanded(null);
    classMaxWidth.value = withTiming(0, TIMING);
    classOpacity.value = withTiming(0, TIMING);
    classChevronDeg.value = withTiming(0, TIMING);
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }

  function selectLesson(id: string | undefined) {
    onLessonChange(id);
    setExpanded(null);
    lessonMaxWidth.value = withTiming(0, TIMING);
    lessonOpacity.value = withTiming(0, TIMING);
    lessonChevronDeg.value = withTiming(0, TIMING);
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }

  const statusPillActive = expanded === "status" || status !== undefined;
  const classPillActive = expanded === "class";
  const lessonPillActive = expanded === "lesson" || lessonId !== undefined;

  const statusLabel =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "Tất cả";
  const classLabel =
    classes.find((c) => c.id === classId)?.name ?? "Lớp";
  const lessonLabel =
    lessons.find((l) => l.id === lessonId)?.title ?? "Bài học";

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        alignItems: "center",
      }}
      style={{ marginBottom: 12, height: 38 }}
    >
      {/* Status pill button */}
      <Pressable
        onPress={() => toggleFilter("status")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: statusPillActive
            ? theme.brand.primary
            : theme.background.surface,
          borderWidth: 1,
          borderColor: statusPillActive
            ? theme.brand.primary
            : theme.border.subtle,
        }}
      >
        <Text
          className="font-heading text-sm"
          style={{
            color: statusPillActive ? theme.text.onBrand : theme.text.secondary,
          }}
        >
          {statusLabel}
        </Text>
        <Animated.View style={statusChevronStyle}>
          <ChevronRight
            size={14}
            color={statusPillActive ? theme.icon.onBrand : theme.icon.primary}
            strokeWidth={2.5}
          />
        </Animated.View>
      </Pressable>

      {/* Status options — slide ra bên phải của pill */}
      <Animated.View
        style={[
          {
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          },
          statusOptionsStyle,
        ]}
      >
        {STATUS_OPTIONS.map((option) => {
          const isSelected = option.value === status;
          return (
            <Pressable
              key={option.label}
              onPress={() => selectStatus(option.value)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.brand.primary
                  : theme.background.surface,
                borderWidth: 1,
                borderColor: isSelected
                  ? theme.brand.primary
                  : theme.border.subtle,
              }}
            >
              <Text
                className="font-heading text-sm"
                style={{
                  color: isSelected ? theme.text.onBrand : theme.text.secondary,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Lesson pill button */}
      <Pressable
        onPress={() => toggleFilter("lesson")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: lessonPillActive
            ? theme.brand.primary
            : theme.background.surface,
          borderWidth: 1,
          borderColor: lessonPillActive
            ? theme.brand.primary
            : theme.border.subtle,
        }}
      >
        <Text
          className="font-heading text-sm"
          numberOfLines={1}
          style={{
            color: lessonPillActive ? theme.text.onBrand : theme.text.secondary,
            maxWidth: 120,
          }}
        >
          {lessonLabel}
        </Text>
        <Animated.View style={lessonChevronStyle}>
          <ChevronRight
            size={14}
            color={lessonPillActive ? theme.icon.onBrand : theme.icon.primary}
            strokeWidth={2.5}
          />
        </Animated.View>
      </Pressable>

      {/* Lesson options — slide ra bên phải của pill */}
      <Animated.View
        style={[
          {
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          },
          lessonOptionsStyle,
        ]}
      >
        <Pressable
          onPress={() => selectLesson(undefined)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: lessonId === undefined
              ? theme.brand.primary
              : theme.background.surface,
            borderWidth: 1,
            borderColor: lessonId === undefined
              ? theme.brand.primary
              : theme.border.subtle,
          }}
        >
          <Text
            className="font-heading text-sm"
            style={{
              color: lessonId === undefined ? theme.text.onBrand : theme.text.secondary,
            }}
          >
            Tất cả
          </Text>
        </Pressable>
        {lessons.map((lesson) => {
          const isSelected = lesson.id === lessonId;
          return (
            <Pressable
              key={lesson.id}
              onPress={() => selectLesson(lesson.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.brand.primary
                  : theme.background.surface,
                borderWidth: 1,
                borderColor: isSelected
                  ? theme.brand.primary
                  : theme.border.subtle,
              }}
            >
              <Text
                className="font-heading text-sm"
                numberOfLines={1}
                style={{
                  color: isSelected ? theme.text.onBrand : theme.text.secondary,
                  maxWidth: 160,
                }}
              >
                {lesson.title}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Class pill button */}
      <Pressable
        onPress={() => toggleFilter("class")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: classPillActive
            ? theme.brand.primary
            : theme.background.surface,
          borderWidth: 1,
          borderColor: classPillActive
            ? theme.brand.primary
            : theme.border.subtle,
        }}
      >
        <Text
          className="font-heading text-sm"
          style={{
            color: classPillActive ? theme.text.onBrand : theme.text.secondary,
          }}
        >
          {classLabel}
        </Text>
        <Animated.View style={classChevronStyle}>
          <ChevronRight
            size={14}
            color={classPillActive ? theme.icon.onBrand : theme.icon.primary}
            strokeWidth={2.5}
          />
        </Animated.View>
      </Pressable>

      {/* Class options — slide ra bên phải của pill */}
      <Animated.View
        style={[
          {
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          },
          classOptionsStyle,
        ]}
      >
        {classes.map((cls) => {
          const isSelected = cls.id === classId;
          return (
            <Pressable
              key={cls.id}
              onPress={() => selectClass(cls.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? theme.brand.primary
                  : theme.background.surface,
                borderWidth: 1,
                borderColor: isSelected
                  ? theme.brand.primary
                  : theme.border.subtle,
              }}
            >
              <Text
                className="font-heading text-sm"
                style={{
                  color: isSelected ? theme.text.onBrand : theme.text.secondary,
                }}
              >
                {cls.name}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}
