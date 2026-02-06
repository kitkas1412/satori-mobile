import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React from "react";
import { Text, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  title?: string;
  message?: string;
  spinnerSize?: number;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  title = "Đang xử lý...",
  message = "Vui lòng đợi trong giây lát",
  spinnerSize = 80,
  transparent = false,
}) => {
  if (!visible) return null;

  return (
    <View
      className={`absolute inset-0 items-center justify-center ${transparent ? "bg-black/50" : "bg-background-default"}`}
    >
      <View className="items-center gap-3">
        <LoadingSpinner size={spinnerSize} />
        <View className="items-center gap-3">
          {title && (
            <Text className="font-heading text-[24px] leading-[36px] text-[#374155] text-center">
              {title}
            </Text>
          )}
          {message && (
            <Text className="font-body text-[16px] leading-[24px] text-[#64748b] text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
