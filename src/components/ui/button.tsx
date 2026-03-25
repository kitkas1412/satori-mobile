import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors, Primitive } from "@/constants/theme";

interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "danger" | "secondary" | "dark";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
  fullWidth = true,
  accessibilityLabel,
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isDisabled) return theme.brand.primaryDisabled;

    switch (variant) {
      case "danger":
        return theme.error.default;
      case "primary":
      default:
        return theme.brand.primary;
    }
  };

  const textColor = theme.brand.onPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-[14px] items-center justify-center px-[14px] py-[16.5px] ${fullWidth ? "w-full" : ""}`}
      style={[{ backgroundColor: getBackgroundColor() }, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-heading text-lg" style={{ color: textColor }}>
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
