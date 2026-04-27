import {
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
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOPIC_OPTIONS = [
  { value: "greetings", label: "Giao tiếp" },
  { value: "shopping", label: "Mua sắm" },
  { value: "food", label: "Ẩm thực" },
  { value: "travel", label: "Du lịch" },
  { value: "business", label: "Kinh doanh" },
  { value: "culture", label: "Văn hóa" },
] as const;

export function EditTopicsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs } = useLearningPreferences();
  const { mutate: updatePrefs, isPending } = useUpdateLearningPreferences();

  const [selected, setSelected] = useState<string[]>(
    prefs?.preferredTopics ?? [],
  );

  const toggleTopic = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    updatePrefs(
      { preferredTopics: selected },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Chủ đề yêu thích"
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
            paddingBottom: 24,
          }}
        >
          <View className="flex-row flex-wrap" style={{ gap: 12 }}>
            {TOPIC_OPTIONS.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => toggleTopic(option.value)}
                  activeOpacity={0.7}
                  className="rounded-2xl px-5 py-3"
                  style={{
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
                    className="font-body text-sm"
                    style={{
                      color: isSelected
                        ? theme.text.onBrand
                        : theme.text.secondary,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <PrimaryButton
            text="Xác nhận"
            onPress={handleConfirm}
            disabled={selected.length === 0 || isPending}
            loading={isPending}
          />
        </View>
      </View>
      <LoadingOverlay visible={isPending} />
    </>
  );
}
