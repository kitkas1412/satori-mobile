// Component wrapper cho một section (chủ đề lớn) trên màn hình SpeakingScreen.
// Tự fetch danh sách topics của section, transform sang format ThemeSection cần,
// và báo cáo lên parent khi section có topic chưa được luyện tập.

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ThemeSection } from "./theme-section";
import { useThemeTopics } from "@/features/speaking/hooks";
import type { Content } from "@/features/speaking/api";

/** Chuyển điểm độ khó thành nhãn hiển thị: 1 = Dễ, 2 = Trung Bình, khác = Khó */
function difficultyLabel(score: number): string {
  if (score === 1) return "Dễ";
  if (score === 2) return "Trung Bình";
  return "Khó";
}

interface TopicSectionProps {
  section: Content;
  /** Section đầu tiên trong danh sách sẽ được mở rộng mặc định */
  defaultExpanded: boolean;
  /** Hiển thị viền highlight khi đây là section cần học tiếp theo */
  showFirstUnpracticedBorder: boolean;
  /** Callback báo lên parent khi section này có topic chưa luyện tập */
  onHasUnpracticed: (sectionId: string, orderIndex: number) => void;
}

export function TopicSection({
  section,
  defaultExpanded,
  showFirstUnpracticedBorder,
  onHasUnpracticed,
}: TopicSectionProps) {
  const router = useRouter();
  const { data: topics } = useThemeTopics(section.id);

  // Transform dữ liệu topic API sang format mà ThemeSection yêu cầu
  const lessons =
    topics?.map((topic) => ({
      id: topic.id,
      title: topic.title,
      subtitle: difficultyLabel(topic.difficultyScore),
      status: "active" as const,
      practiced: topic.practiced,
    })) ?? [];

  /** true nếu section còn ít nhất một topic chưa được luyện tập */
  const hasUnpracticed = topics?.some((t) => !t.practiced) ?? false;

  // Báo lên parent mỗi khi trạng thái "có chưa luyện" thay đổi
  useEffect(() => {
    if (hasUnpracticed) {
      onHasUnpracticed(section.id, section.orderIndex);
    }
  }, [hasUnpracticed, section.id, section.orderIndex, onHasUnpracticed]);

  /** Điều hướng sang màn hình chi tiết topic khi người dùng chọn một lesson */
  function handleLessonPress(id: string) {
    const topic = topics?.find((t) => t.id === id);
    if (!topic) return;
    router.push({
      pathname: "/topic-detail",
      params: { topicId: topic.id },
    });
  }

  return (
    <ThemeSection
      lessonNumber={section.orderIndex}
      lessonTitle={section.title}
      lessonDescription={section.descriptionVi}
      completedCount={0}
      totalCount={section.topicCount}
      lessons={lessons}
      defaultExpanded={defaultExpanded}
      showFirstUnpracticedBorder={showFirstUnpracticedBorder}
      onLessonPress={handleLessonPress}
    />
  );
}
