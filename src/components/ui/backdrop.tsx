import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TIMING_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };

interface BackdropProps {
  visible: boolean;
  onPress?: () => void;
  className?: string;
  pointerEvents?: "none" | "box-none" | "auto";
}

export function Backdrop({
  visible,
  onPress,
  className,
  pointerEvents,
}: BackdropProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 0.5 : 0, TIMING_CONFIG);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseClass = `absolute inset-0 bg-black${className ? ` ${className}` : ""}`;

  return (
    <Animated.View
      className={baseClass}
      style={animatedStyle}
      pointerEvents={onPress ? "auto" : (pointerEvents ?? "none")}
    >
      {onPress && <Pressable className="absolute inset-0" onPress={onPress} />}
    </Animated.View>
  );
}
