import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface PrimaryButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "danger" | "secondary";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  accessibilityLabel?: string;
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
}) => {
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isDisabled) return "bg-gray-300";

    switch (variant) {
      case "danger":
        return "bg-error-500";
      case "secondary":
        return "bg-gray-500";
      case "primary":
      default:
        return "bg-primary-default";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-[14px] items-center justify-center px-[14px] py-[16.5px] ${getBackgroundColor()} ${fullWidth ? "w-full" : ""}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
    >
      {loading ? (
        <ActivityIndicator color="hsl(220, 14%, 96%)" />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-heading text-lg text-[hsl(220,14%,96%)]">{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
