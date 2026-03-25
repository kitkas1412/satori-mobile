import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { View } from "react-native";
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
