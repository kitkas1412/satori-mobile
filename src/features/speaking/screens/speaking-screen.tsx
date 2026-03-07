import { Bell } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ConversationBanner,
  LessonSection,
} from "@/features/speaking/components";
import { useAuthStore } from "@/stores";

const lessonsData = [
  {
    id: "1",
    lessonNumber: 1,
    lessonTitle: "Giới thiệu bản thân",
    lessonDescription:
      "Làm quen với các mẫu câu và từ vựng cơ bản để giới thiệu bản thân trong giao tiếp hằng ngày",
    completedCount: 0,
    totalCount: 6,
    badgeColor: "#4a67d6",
    defaultExpanded: true,
    lessons: [
      {
        id: "1-1",
        title: "Tự giới thiệu trong buổi họp",
        subtitle: "3 - 4 Minutes",
        type: "pronunciation" as const,
        status: "completed" as const,
      },
      {
        id: "1-2",
        title: "Phỏng vấn xin việc",
        subtitle: "4 - 5 Minutes",
        type: "conversation" as const,
        status: "active" as const,
      },
      {
        id: "1-3",
        title: "Gặp hàng xóm mới",
        subtitle: "3 - 4 Minutes",
        type: "conversation" as const,
        status: "locked" as const,
      },
    ],
  },
  {
    id: "2",
    lessonNumber: 2,
    lessonTitle: "Du lịch",
    lessonDescription:
      "Sử dụng từ vựng và mẫu câu giao tiếp phổ biến khi đi du lịch. Nội dung tập trung vào các tình huống thực tế",
    completedCount: 0,
    totalCount: 6,
    badgeColor: "#7440b6",
    defaultExpanded: false,
    lessons: [
      {
        id: "2-1",
        title: "Hỏi đường",
        subtitle: "3 - 4 Minutes",
        type: "conversation" as const,
        status: "locked" as const,
      },
      {
        id: "2-2",
        title: "Đặt phòng khách sạn",
        subtitle: "4 - 5 Minutes",
        type: "conversation" as const,
        status: "locked" as const,
      },
      {
        id: "2-3",
        title: "Mua vé tham quan",
        subtitle: "3 - 4 Minutes",
        type: "conversation" as const,
        status: "locked" as const,
      },
    ],
  },
];

export function SpeakingScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 bg-background-default">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-text-main text-xl font-heading">Luyện nói</Text>
        <View className="relative">
          <View className="w-9 h-9 bg-secondary-default rounded-full items-center justify-center">
            <Bell size={20} color="#475569" />
          </View>
          <View className="absolute top-0 right-0 w-[7px] h-[7px] bg-red-500 rounded-full" />
        </View>
      </View>

      {user?.status === "INACTIVE" ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text-muted text-base text-center font-body">
            Tính năng đang tạm khoá. Vui lòng thử lại sau
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-8 gap-4"
          showsVerticalScrollIndicator={false}
        >
          <ConversationBanner />

          {lessonsData.map((section) => (
            <LessonSection
              key={section.id}
              lessonNumber={section.lessonNumber}
              lessonTitle={section.lessonTitle}
              lessonDescription={section.lessonDescription}
              completedCount={section.completedCount}
              totalCount={section.totalCount}
              lessons={section.lessons}
              badgeColor={section.badgeColor}
              defaultExpanded={section.defaultExpanded}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
