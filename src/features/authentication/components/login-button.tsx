import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface LoginButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-[14px] items-center justify-center px-[14px] py-[16.5px] ${
        disabled ? "bg-gray-300" : "bg-primary-default"
      }`}
      accessibilityRole="button"
      accessibilityLabel="Đăng nhập"
    >
      <Text className="font-heading text-[18px] text-[#F3F4F6]">Đăng nhập</Text>
    </TouchableOpacity>
  );
};
