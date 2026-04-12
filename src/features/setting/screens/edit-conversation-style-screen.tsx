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

const CONVERSATION_STYLE_OPTIONS = [
  { value: "practical", label: "Thực hành" },
  { value: "academic", label: "Học thuật" },
  { value: "casual", label: "Thông thường" },
] as const;

export function EditConversationStyleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const { data: prefs } = useLearningPreferences();
  const { mutate: updatePrefs, isPending } = useUpdateLearningPreferences();

  const [selected, setSelected] = useState(prefs?.conversationStyle ?? "");

  const handleConfirm = () => {
    if (!selected) return;
    updatePrefs(
      { conversationStyle: selected },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Phong cách hội thoại"
          paddingTop={insets.top + 16}
          leftAction={
            <IconButton
              icon={<ChevronLeft size={24} color={theme.icon.primary} />}
              onPress={() => router.back()}
            />
          }
        />

        <View className="flex-1 px-4" style={{ gap: 12 }}>
          {CONVERSATION_STYLE_OPTIONS.map((option) => (
            <RadioOptionRow
              key={option.value}
              label={option.label}
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
