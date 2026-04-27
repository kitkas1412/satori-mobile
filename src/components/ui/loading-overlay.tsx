import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLoadingOverlayStore } from "@/stores/loading-overlay-store";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  transparent?: boolean;
}

// Messenger component: syncs visible prop into the global store, renders nothing.
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  title,
  message,
  transparent,
}) => {
  const { show, hide } = useLoadingOverlayStore();

  useEffect(() => {
    if (visible) {
      show({ title, message, transparent });
      return () => {
        hide();
      };
    }
  }, [visible, title, message, transparent]);

  return null;
};

// Renderer component: reads from the global store and renders the actual UI.
// Must be placed at root layout level to cover the tab bar.
export const LoadingOverlayRenderer: React.FC = () => {
  const theme = useColorScheme() ?? "light";
  const { counter, title, message, transparent } = useLoadingOverlayStore();

  if (counter === 0) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 999, elevation: 999 },
        !transparent
          ? { backgroundColor: Colors[theme].background.page }
          : { backgroundColor: "rgba(0,0,0,0.5)" },
      ]}
      className="items-center justify-center"
    >
      <View className="items-center gap-3">
        <LoadingSpinner />
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
  );
};
