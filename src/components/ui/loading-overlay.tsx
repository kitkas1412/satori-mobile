import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  const theme = useColorScheme() ?? "light";
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View
        className="flex-1 items-center justify-center"
        style={!transparent ? { backgroundColor: Colors[theme].background } : { backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className="items-center gap-3">
          <LoadingSpinner size={spinnerSize} />
          <View className="items-center gap-3">
            {title && (
              <Text
                className="font-heading text-2xl text-center"
                style={{ color: Colors[theme].textDefault }}
              >
                {title}
              </Text>
            )}
            {message && (
              <Text
                className="font-body text-base text-center"
                style={{ color: Colors[theme].textMuted }}
              >
                {message}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
