import React from "react";
import { Text, View } from "react-native";

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View className="flex-col items-start mt-8">
      <Text className="font-heading text-[17px] leading-[22px] text-black text-center">
        {title}
      </Text>
      <Text className="font-bodys text-xs text-black text-center">
        {subtitle}
      </Text>
    </View>
  );
};
