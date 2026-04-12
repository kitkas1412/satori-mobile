import {
  IconButton,
  LoadingOverlay,
  PrimaryButton,
  RadioOptionRow,
  ScreenHeader,
} from "@/components/ui";
import {
  useLearningPreferences,
  useUpdateLearningPreferences,
} from "@/features/setting/hooks";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DAILY_GOAL_OPTIONS = [
  { value: 10, label: "Thông thường", subtitle: "10 phút/ngày" },
  { value: 15, label: "Tiêu chuẩn", subtitle: "15 phút/ngày" },
  { value: 20, label: "Nghiêm túc", subtitle: "20 phút/ngày" },
] as const;

export function EditDailyGoalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs } = useLearningPreferences();
  const { mutate: updatePrefs, isPending } = useUpdateLearningPreferences();

  const currentValue = prefs?.dailyStudyGoalMinutes;
  const [selected, setSelected] = useState<number | null>(
    DAILY_GOAL_OPTIONS.some((o) => o.value === currentValue) ? (currentValue ?? null) : null,
  );

  const handleConfirm = () => {
    if (!selected) return;
    updatePrefs(
      { dailyStudyGoalMinutes: selected },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Mục tiêu học mỗi ngày"
          paddingTop={insets.top + 16}
          leftAction={
            <IconButton
              icon={<ChevronLeft size={24} color={theme.icon.primary} />}
              onPress={() => router.back()}
            />
          }
        />

        <View className="flex-1 px-4" style={{ gap: 12 }}>
          {DAILY_GOAL_OPTIONS.map((option) => (
            <RadioOptionRow
              key={option.value}
              label={option.label}
              subtitle={option.subtitle}
              selected={selected === option.value}
              onPress={() => setSelected(option.value)}
            />
          ))}
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <PrimaryButton
            text="Xác nhận"
            onPress={handleConfirm}
            disabled={!selected || isPending}
            loading={isPending}
          />
        </View>
      </View>
      <LoadingOverlay visible={isPending} />
    </>
  );
}
