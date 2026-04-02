import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 80 }: LoadingSpinnerProps) {
  const theme = useColorScheme() ?? "light";
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const outerSize = size;
  const borderWidth = size * 0.046; // 3.691/80 ratio from design

  return (
    <View
      className="items-center justify-center"
      style={{ width: outerSize, height: outerSize }}
    >
      <Animated.View
        style={[
          {
            width: outerSize * 1.1875, // 95/80 ratio from design
            height: outerSize * 1.1875,
            borderRadius: outerSize * 0.59375,
            borderWidth,
            borderColor: "transparent",
            borderTopColor: Colors[theme].brand.primary,
            borderRightColor: Colors[theme].brand.primary,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

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
        style={
          !transparent
            ? { backgroundColor: Colors[theme].background.page }
            : { backgroundColor: "rgba(0,0,0,0.5)" }
        }
      >
        <View className="items-center gap-3">
          <LoadingSpinner size={spinnerSize} />
          <View className="items-center gap-3">
            {title && (
              <Text
                className="font-heading text-2xl text-center"
                style={{ color: Colors[theme].text.primary }}
              >
                {title}
              </Text>
            )}
            {message && (
              <Text
                className="font-body text-base text-center"
                style={{ color: Colors[theme].text.secondary }}
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
