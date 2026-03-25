import { Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface MicButtonProps {
  isRecording: boolean;
  disabled: boolean;
  label: string;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function MicButton({
  isRecording,
  disabled,
  label,
  onPressIn,
  onPressOut,
}: MicButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View className="items-center gap-2">
      <Text className="font-body text-base" style={{ color: theme.text.secondary }}>{label}</Text>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        className="w-[62px] h-[62px] rounded-xl items-center justify-center"
        style={{
          backgroundColor: isRecording
            ? theme.error.default
            : disabled
              ? theme.border.default
              : theme.brand.primary,
        }}
      >
        <Mic size={32} color={theme.icon.onBrand} />
      </Pressable>
    </View>
  );
}
