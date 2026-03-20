import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="w-6 h-6 items-center justify-center"
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
    >
      <ArrowLeft size={24} color="hsla(0, 0%, 0%, 0.6)" />
    </TouchableOpacity>
  );
};
