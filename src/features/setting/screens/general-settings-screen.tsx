import { IconButton, ScreenAsyncView, ScreenHeader } from "@/components/ui";
import { ProfileRow } from "@/features/profile-management/components";
import { useLearningPreferences } from "@/features/setting/hooks";
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


export function GeneralSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data: prefs, isLoading, isError } = useLearningPreferences();

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
          <View className="pb-2">
            <Text
              className="font-heading text-base mb-3"
              style={{ color: theme.text.primary }}
            >
              Mục tiêu học tập
            </Text>

            <ProfileRow
              label="Mục tiêu học mỗi ngày"
              value={
                prefs?.dailyStudyGoalMinutes != null
                  ? `${prefs.dailyStudyGoalMinutes} phút`
                  : "—"
              }
              onChangePress={() => router.push("/edit-daily-goal")}
            />

            <View style={{ height: 8 }} />

            <ProfileRow
              label="Thời gian học ưa thích"
              value={
                prefs?.preferredStudyTime
                  ? (STUDY_TIME_LABELS[prefs.preferredStudyTime] ??
                    prefs.preferredStudyTime)
                  : "—"
              }
              onChangePress={() => router.push("/edit-study-time")}
            />

            <View style={{ height: 8 }} />

            <ProfileRow
              label="Tốc độ học"
              value={
                prefs?.learningPace
                  ? (PACE_LABELS[prefs.learningPace] ?? prefs.learningPace)
                  : "—"
              }
              onChangePress={() => router.push("/edit-learning-pace")}
            />

          </View>

          {/* Card 2 — Ngôn ngữ & Hội thoại */}
          <View className="pb-2">
            <Text
              className="font-heading text-base mb-3"
              style={{ color: theme.text.primary }}
            >
              Ngôn ngữ & Hội thoại
            </Text>

            <ProfileRow
              label="Phong cách ngôn ngữ"
              value={
                prefs?.preferredFormality
                  ? (FORMALITY_LABELS[prefs.preferredFormality] ??
                    prefs.preferredFormality)
                  : "—"
              }
              onChangePress={() => router.push("/edit-formality")}
            />

            <View style={{ height: 8 }} />

            <ProfileRow
              label="Phong cách hội thoại"
              value={
                prefs?.conversationStyle
                  ? (CONVERSATION_STYLE_LABELS[prefs.conversationStyle] ??
                    prefs.conversationStyle)
                  : "—"
              }
              onChangePress={() => router.push("/edit-conversation-style")}
            />
          </View>

        </ScreenAsyncView>
      </ScrollView>
    </View>
  );
}
