// Màn hình chi tiết conversation, hiển thị trước khi người dùng bắt đầu luyện tập.
// Bao gồm: tên conversation, độ khó, mô tả và danh sách nhiệm vụ cần hoàn thành.
// Người dùng nhấn "Hiểu rồi" để chuyển sang màn hình luyện tập.

import { ListChecks, X } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { LoadingOverlay, PrimaryButton } from "@/components/ui";
import { useConversationDetail } from "@/features/speaking/hooks";
import { MissionItem } from "@/features/speaking/components";

/** Chuyển điểm độ khó thành nhãn hiển thị: 1 = Dễ, 2 = Trung Bình, khác = Khó */
function difficultyLabel(score: number): string {
  if (score === 1) return "Dễ";
  if (score === 2) return "Trung Bình";
  return "Khó";
}

interface ConversationDetailScreenProps {
  conversationId: string;
}

export function ConversationDetailScreen({
  conversationId,
}: ConversationDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { data: conversation, isLoading } =
    useConversationDetail(conversationId);

  /** Điều hướng sang màn hình luyện tập với conversationId, dùng replace để không quay lại được trang này */
  function handleStart() {
    router.replace({
      pathname: "/conversation-practice",
      params: { conversationId, title: conversation?.title ?? "" },
    });
  }

  return (
    <>
      <View
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
      >
        {/* Header */}
        <View
          className="flex-row items-center px-4 pb-4"
          style={{ paddingTop: insets.top }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={24} color={theme.icon.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-32 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {conversation && (
            <>
              {/* Title + difficulty badge */}
              <View className="flex-row items-center gap-3 flex-wrap">
                <Text
                  className="font-heading text-[28px] font-bold"
                  style={{ color: theme.text.primary }}
                >
                  {conversation.title}
                </Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: theme.brand.primarySubtle,
                  }}
                >
                  <Text
                    className="font-body text-xs font-semibold"
                    style={{ color: theme.brand.primary }}
                  >
                    {difficultyLabel(conversation.difficultyScore)}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text
                className="font-body text-sm mt-3 leading-6"
                style={{ color: theme.text.secondary }}
              >
                {conversation.descriptionVi}
              </Text>

              {/* Missions section */}
              {conversation.missions && conversation.missions.length > 0 && (
                <View className="mt-10">
                  {/* Section heading */}
                  <View className="flex-row items-center gap-3 mb-4">
                    <ListChecks
                      size={24}
                      color={theme.icon.primary}
                      strokeWidth={2}
                    />
                    <Text
                      className="font-heading text-xl font-bold"
                      style={{ color: theme.text.primary }}
                    >
                      Nhiệm vụ
                    </Text>
                  </View>

                  {/* Mission list */}
                  <View>
                    {conversation.missions.map((mission, index) => (
                      <View key={mission.id}>
                        {index > 0 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: theme.border.subtle,
                            }}
                          />
                        )}
                        <MissionItem mission={mission} index={index} />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* Footer button */}
        {conversation && (
          <View
            className="absolute bottom-0 left-0 right-0 px-6"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <PrimaryButton text="Hiểu rồi" onPress={handleStart} />
          </View>
        )}
      </View>

      <LoadingOverlay visible={isLoading} title="Đang tải..." />
    </>
  );
}
