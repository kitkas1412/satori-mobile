import {
  BaseInput,
  IconButton,
  LoadingOverlay,
  PrimaryButton,
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
import { Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function EditReminderScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs } = useLearningPreferences();
  const { mutate: updatePrefs, isPending } = useUpdateLearningPreferences();

  const [enabled, setEnabled] = useState(
    prefs?.streakReminderEnabled ?? false,
  );
  const [reminderTime, setReminderTime] = useState(
    prefs?.reminderTime ? prefs.reminderTime.slice(0, 5) : "08:00",
  );

  const isTimeValid = /^\d{2}:\d{2}$/.test(reminderTime);

  const handleConfirm = () => {
    updatePrefs(
      {
        streakReminderEnabled: enabled,
        reminderTime: enabled ? `${reminderTime}:00` : prefs?.reminderTime ?? null,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Nhắc nhở streak"
          paddingTop={insets.top + 16}
          leftAction={
            <IconButton
              icon={<ChevronLeft size={24} color={theme.icon.primary} />}
              onPress={() => router.back()}
            />
          }
        />

        <View className="flex-1 px-4" style={{ gap: 16 }}>
          {/* Toggle */}
          <View
            className="flex-row items-center justify-between rounded-2xl px-4 py-4"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <Text
              className="font-body text-base"
              style={{ color: theme.text.primary }}
            >
              Bật nhắc nhở
            </Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{
                false: theme.border.default,
                true: theme.brand.primary,
              }}
              thumbColor={theme.background.surface}
            />
          </View>

          {/* Time input — chỉ hiện khi enabled */}
          {enabled && (
            <BaseInput
              label="Giờ nhắc nhở"
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder="HH:mm"
              keyboardType="numbers-and-punctuation"
              error={
                reminderTime.length > 0 && !isTimeValid
                  ? "Định dạng giờ không hợp lệ (HH:mm)"
                  : undefined
              }
            />
          )}
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
            disabled={(enabled && !isTimeValid) || isPending}
            loading={isPending}
          />
        </View>
      </View>
      <LoadingOverlay visible={isPending} />
    </>
  );
}
