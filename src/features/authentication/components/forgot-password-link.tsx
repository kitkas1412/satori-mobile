import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="mt-2 py-2"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text className="font-heading text-[12px] text-primary-dark">
        Quên mật khẩu??
      </Text>
    </TouchableOpacity>
  );
};
