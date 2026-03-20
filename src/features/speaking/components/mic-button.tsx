import { Mic } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

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
  return (
    <View className="items-center gap-2">
      <Text className="font-body text-base text-text-muted">{label}</Text>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        className={`w-[62px] h-[62px] rounded-xl items-center justify-center ${
          isRecording
            ? "bg-error-default"
            : disabled
              ? "bg-border"
              : "bg-primary-dark"
        }`}
      >
        <Mic size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
