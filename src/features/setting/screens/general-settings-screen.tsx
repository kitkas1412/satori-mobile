import { IconButton, ScreenAsyncView, ScreenHeader } from "@/components/ui";
import { ProfileRow } from "@/features/profile-management/components";
import { useProfile } from "@/features/profile-management/hooks";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STUDY_TIME_LABELS: Record<string, string> = {
  morning: "Buổi sáng",
  afternoon: "Buổi chiều",
  evening: "Buổi tối",
  night: "Ban đêm",
};

const PACE_LABELS: Record<string, string> = {
  slow: "Chậm",
  normal: "Bình thường",
  fast: "Nhanh",
};

const FORMALITY_LABELS: Record<string, string> = {
  polite: "Lịch sự",
  casual: "Thân mật",
  formal: "Trang trọng",
};

const CONVERSATION_STYLE_LABELS: Record<string, string> = {
  practical: "Thực hành",
  academic: "Học thuật",
  casual: "Thông thường",
};

const TOPIC_LABELS: Record<string, string> = {
  greetings: "Giao tiếp",
  shopping: "Mua sắm",
  food: "Ẩm thực",
  travel: "Du lịch",
  business: "Kinh doanh",
  culture: "Văn hóa",
};

function formatReminderTime(time: string | null): string {
  if (!time) return "—";
  return time.slice(0, 5);
}

export function GeneralSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, isError } = useProfile();

  const prefs = profile?.learningPreferences;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <ScreenHeader
        title="Cài đặt chung"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ChevronLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
      >
        <ScreenAsyncView
          isLoading={isLoading}
          isError={isError}
          isEmpty={!prefs}
          emptyText="Chưa có cài đặt học tập."
        >
          {/* Card 1 — Mục tiêu học tập */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <View className="px-4 pt-4 pb-2">
              <Text
                className="font-heading text-base mb-3"
                style={{ color: theme.text.primary }}
              >
                Mục tiêu học tập
              </Text>

              <ProfileRow
                label="Mục tiêu học mỗi ngày"
                value={prefs?.dailyStudyGoalMinutes != null ? `${prefs.dailyStudyGoalMinutes} phút` : "—"}
              />

              <View style={{ height: 8 }} />

              <ProfileRow
                label="Thời gian học ưa thích"
                value={prefs?.preferredStudyTime ? (STUDY_TIME_LABELS[prefs.preferredStudyTime] ?? prefs.preferredStudyTime) : "—"}
              />

              <View style={{ height: 8 }} />

              <ProfileRow
                label="Tốc độ học"
                value={prefs?.learningPace ? (PACE_LABELS[prefs.learningPace] ?? prefs.learningPace) : "—"}
              />
            </View>
          </View>

          {/* Card 2 — Ngôn ngữ & Hội thoại */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <View className="px-4 pt-4 pb-2">
              <Text
                className="font-heading text-base mb-3"
                style={{ color: theme.text.primary }}
              >
                Ngôn ngữ & Hội thoại
              </Text>

              <ProfileRow
                label="Phong cách ngôn ngữ"
                value={prefs?.preferredFormality ? (FORMALITY_LABELS[prefs.preferredFormality] ?? prefs.preferredFormality) : "—"}
              />

              <View style={{ height: 8 }} />

              <ProfileRow
                label="Phong cách hội thoại"
                value={prefs?.conversationStyle ? (CONVERSATION_STYLE_LABELS[prefs.conversationStyle] ?? prefs.conversationStyle) : "—"}
              />
            </View>
          </View>

          {/* Card 3 — Chủ đề yêu thích */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <View className="px-4 py-4">
              <Text
                className="font-heading text-base mb-3"
                style={{ color: theme.text.primary }}
              >
                Chủ đề yêu thích
              </Text>

              {prefs?.preferredTopics && prefs.preferredTopics.length > 0 ? (
                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  {prefs.preferredTopics.map((topic) => (
                    <View
                      key={topic}
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: theme.background.page,
                        borderWidth: 1,
                        borderColor: theme.border.subtle,
                      }}
                    >
                      <Text
                        className="font-body text-sm"
                        style={{ color: theme.text.secondary }}
                      >
                        {TOPIC_LABELS[topic] ?? topic}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text
                  className="font-body text-sm"
                  style={{ color: theme.text.secondary }}
                >
                  Chưa chọn chủ đề
                </Text>
              )}
            </View>
          </View>

          {/* Card 4 — Nhắc nhở */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <View className="px-4 pt-4 pb-2">
              <Text
                className="font-heading text-base mb-3"
                style={{ color: theme.text.primary }}
              >
                Nhắc nhở
              </Text>

              <ProfileRow
                label="Nhắc nhở streak"
                value={prefs?.streakReminderEnabled ? "Bật" : "Tắt"}
              />

              {prefs?.streakReminderEnabled && (
                <>
                  <View style={{ height: 8 }} />
                  <ProfileRow
                    label="Giờ nhắc nhở"
                    value={formatReminderTime(prefs.reminderTime)}
                  />
                </>
              )}
            </View>
          </View>
        </ScreenAsyncView>
      </ScrollView>
    </View>
  );
}
