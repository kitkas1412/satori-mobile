import { LoadingSpinner } from "@/components/ui/loading-spinner";
import React from "react";
import { Modal, Text, View } from "react-native";

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
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View
        className={`flex-1 items-center justify-center ${transparent ? "bg-black/50" : "bg-background-default"}`}
      >
        <View className="items-center gap-3">
          <LoadingSpinner size={spinnerSize} />
          <View className="items-center gap-3">
            {title && (
              <Text className="font-heading text-2xl text-[hsl(220,21%,27%)] text-center">
                {title}
              </Text>
            )}
            {message && (
              <Text className="font-body text-base text-[hsl(215,16%,47%)] text-center">
                {message}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
