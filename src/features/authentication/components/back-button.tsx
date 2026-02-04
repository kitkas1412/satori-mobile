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
      accessibilityLabel="Quay lại"
      onPress={onPress}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
    >
      <ArrowLeft size={24} color="rgba(0,0,0,0.6)" />
    </TouchableOpacity>
  );
};
