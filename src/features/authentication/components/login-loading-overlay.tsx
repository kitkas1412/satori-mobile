import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React from "react";
import { Text, View } from "react-native";

interface LoginLoadingOverlayProps {
  visible: boolean;
}

export const LoginLoadingOverlay: React.FC<LoginLoadingOverlayProps> = ({
  visible,
}) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-background-default items-center justify-center">
      <View className="items-center gap-3">
        <LoadingSpinner size={80} />
        <View className="items-center gap-3">
          <Text className="font-heading text-[24px] leading-[36px] text-[#374155] text-center">
            Đang xử lý...
          </Text>
          <Text className="font-body text-[16px] leading-[24px] text-[#64748b] text-center">
            Vui lòng đợi trong giây lát
          </Text>
        </View>
      </View>
    </View>
  );
};
