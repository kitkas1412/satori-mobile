// Component wrapper cho một section (chủ đề lớn) trên màn hình SpeakingScreen.
// Tự fetch danh sách topics của section, transform sang format cần thiết,
// render UI collapsible, và báo cáo lên parent khi section có topic chưa được luyện tập.

import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { ConversationCard } from "./conversation-card";
import { useConversations } from "@/features/speaking/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import type { Topic, PracticeStatus } from "@/features/speaking/api";

/** Chuyển điểm độ khó thành nhãn hiển thị: 1 = Dễ, 2 = Trung Bình, khác = Khó */
function difficultyLabel(score: number): string {
  if (score === 1) return "Dễ";
  if (score === 2) return "Trung Bình";
  return "Khó";
}

interface TopicSectionProps {
  section: Topic;
  /** Hiển thị viền highlight khi đây là section cần học tiếp theo */
  showFirstUnpracticedBorder: boolean;
  /** Callback báo lên parent sau khi section đã loaded conversations (dù còn unpracticed hay không) */
  onSectionResolved: (
    sectionId: string,
    orderIndex: number,
    hasUnpracticed: boolean,
  ) => void;
  /** Callback điều hướng sang màn hình chi tiết conversation */
  onConversationPress: (conversationId: string, practiceStatus: PracticeStatus) => void;
  /** True nếu đây là section chứa conversation card đầu tiên chưa practiced */
  isTargetSection?: boolean;
  /** Callback trả về (cardY, cardHeight) tương đối với root View của section khi target card layout xong */
  onScrollToCard?: (cardY: number, cardHeight: number) => void;
  /** Tăng mỗi lần màn hình được focus, dùng để trigger lại scroll và re-report */
  focusTrigger?: number;
}

export function TopicSection({
  section,
  showFirstUnpracticedBorder,
  onSectionResolved,
  onConversationPress,
  isTargetSection,
  onScrollToCard,
  focusTrigger,
}: TopicSectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: topics } = useConversations(section.id);
  const cardPositions = useRef<Record<string, { y: number; height: number }>>(
    {},
  );
  // Y offset của cards container relative to section root View.
  // Cần cộng vào cardY để tính đúng vị trí tuyệt đối trong FlatList content.
  const cardsContainerOffsetRef = useRef<number>(0);

  const accentColor =
    section.orderIndex % 2 === 0 ? theme.purple.default : theme.brand.primary;

  // Transform dữ liệu topic API sang format hiển thị
  const conversations =
    topics?.map((topic) => ({
      id: topic.id,
      title: topic.title,
      subtitle: difficultyLabel(topic.difficultyScore),
      status: "active" as const,
      practiced: topic.practiced,
      practiceStatus: topic.practiceStatus,
    })) ?? [];

  const practicedCount = conversations.filter((c) => c.practiceStatus === "COMPLETED").length;

  /** true nếu section còn ít nhất một topic chưa được luyện tập */
  const hasUnpracticed =
    topics?.some((t) => t.practiceStatus !== "COMPLETED") ?? false;

  const firstUnpracticedIndex = showFirstUnpracticedBorder
    ? conversations.findIndex((c) => c.practiceStatus !== "COMPLETED")
    : -1;

  // Báo lên parent sau khi conversations đã loaded (dù còn unpracticed hay đã COMPLETED hết).
  // focusTrigger trong deps để force re-report mỗi lần màn hình được focus.
  useEffect(() => {
    if (topics === undefined) return;
    onSectionResolved(section.id, section.orderIndex, hasUnpracticed);
  }, [
    topics,
    hasUnpracticed,
    section.id,
    section.orderIndex,
    onSectionResolved,
    focusTrigger,
  ]);

  // Tự động expand nếu đây là section chứa card cần scroll đến.
  // Không đưa isExpanded vào deps để user vẫn có thể tự collapse sau khi auto-expand.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isTargetSection && hasUnpracticed && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isTargetSection, hasUnpracticed]);

  // Tự động đóng section khi đã hoàn thành toàn bộ và không phải target.
  // Bỏ isExpanded khỏi deps để user vẫn có thể tự mở lại để xem mà không bị đóng liên tục.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!hasUnpracticed && !isTargetSection && isExpanded) {
      setIsExpanded(false);
    }
  }, [hasUnpracticed, isTargetSection]);

  // Scroll đến card đầu tiên chưa practiced khi section này trở thành target.
  // Dùng stored positions thay vì onLayout để hoạt động cả khi cards đã mounted rồi.
  useEffect(() => {
    if (!isTargetSection || firstUnpracticedIndex === -1) return;
    const target = conversations[firstUnpracticedIndex];
    if (!target) return;
    const pos = cardPositions.current[target.id];
    if (pos) {
      onScrollToCard?.(cardsContainerOffsetRef.current + pos.y, pos.height);
    }
  }, [isTargetSection]);

  return (
    <View className="gap-2">
      {/* Header */}
      <Pressable
        onPress={() => setIsExpanded((prev) => !prev)}
        className="gap-1"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-1 items-center">
            <View
              className="px-2 py-[2px] rounded-[3px]"
              style={{ backgroundColor: accentColor }}
            >
              <Text
                className="text-xs font-body"
                style={{ color: theme.text.onBrand }}
              >
                Chủ đề {section.orderIndex}
              </Text>
            </View>
            <Text
              className="text-xs font-body"
              style={{ color: theme.text.secondary }}
            >
              {practicedCount}/{conversations.length} HỘI THOẠI
            </Text>
          </View>
          {isExpanded ? (
            <ChevronDown size={24} color={theme.text.secondary} />
          ) : (
            <ChevronRight size={24} color={theme.text.secondary} />
          )}
        </View>
        <View>
          <Text
            className="text-xl font-bold font-heading"
            style={{ color: theme.text.primary }}
          >
            {section.title}
          </Text>
          <Text
            className="text-sm font-body"
            style={{ color: theme.text.secondary }}
          >
            {section.descriptionVi}
          </Text>
        </View>
      </Pressable>

      {/* Lesson Cards */}
      {isExpanded && (
        <View
          onLayout={(e) => {
            cardsContainerOffsetRef.current = e.nativeEvent.layout.y;
          }}
        >
          {conversations.map((conversation, index) => {
            const isFirstUnpracticed = index === firstUnpracticedIndex;
            return (
              <View
                key={conversation.id}
                onLayout={(e) => {
                  const { y, height } = e.nativeEvent.layout;
                  cardPositions.current[conversation.id] = { y, height };
                  if (isFirstUnpracticed && isTargetSection) {
                    onScrollToCard?.(cardsContainerOffsetRef.current + y, height);
                  }
                }}
              >
                {index > 0 &&
                  !isFirstUnpracticed &&
                  index !== firstUnpracticedIndex + 1 && (
                    <View
                      style={{
                        marginHorizontal: 16,
                        height: 1,
                        backgroundColor: theme.border.subtle,
                      }}
                    />
                  )}
                <ConversationCard
                  title={conversation.title}
                  subtitle={conversation.subtitle}
                  status={conversation.status}
                  practiceStatus={conversation.practiceStatus}
                  showBorder={showFirstUnpracticedBorder && isFirstUnpracticed}
                  accentColor={accentColor}
                  onPress={() => onConversationPress(conversation.id, conversation.practiceStatus)}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
