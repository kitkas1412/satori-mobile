import React from "react";
import { TouchableOpacity } from "react-native";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
}

export function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity
      className="w-6 h-6 items-center justify-center"
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
    >
      {icon}
    </TouchableOpacity>
  );
}
