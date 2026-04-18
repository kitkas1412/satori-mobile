import { Pause, Play } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { IconButton } from "@/components/ui";
import { Colors } from "@/constants/theme";

interface AudioPlayerBarProps {
  theme: typeof Colors.light;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  toggle: () => void;
  onSeek: (seconds: number) => void;
}

const THUMB_SIZE = 14;
const TRACK_HEIGHT = 4;
const HIT_AREA_HEIGHT = 20;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar({
  theme,
  isPlaying,
  progress,
  currentTime,
  duration,
  toggle,
  onSeek,
}: AudioPlayerBarProps) {
  const barRef = useRef<View>(null);
  const barWidthSV = useSharedValue(0);
  const barPageXSV = useSharedValue(0);
  const thumbPosition = useSharedValue(0); // 0–1
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value) {
      thumbPosition.value = withTiming(progress, { duration: 100 });
    }
  }, [progress]);

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      isDragging.value = true;
      const ratio = Math.min(
        Math.max((e.absoluteX - barPageXSV.value) / barWidthSV.value, 0),
        1,
      );
      thumbPosition.value = ratio;
      runOnJS(onSeek)(ratio * duration);
    })
    .onUpdate((e) => {
      const ratio = Math.min(
        Math.max((e.absoluteX - barPageXSV.value) / barWidthSV.value, 0),
        1,
      );
      thumbPosition.value = ratio;
      runOnJS(onSeek)(ratio * duration);
    })
    .onEnd(() => {
      isDragging.value = false;
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbPosition.value * barWidthSV.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: thumbPosition.value * barWidthSV.value - THUMB_SIZE / 2,
      },
    ],
  }));

  return (
    <View
      className="flex-row items-center gap-3 mx-4 my-3 px-4 py-3 rounded-xl"
      style={{
        backgroundColor: theme.background.surface,
        borderWidth: 1,
        borderColor: theme.border.subtle,
      }}
    >
      <IconButton
        onPress={toggle}
        icon={
          isPlaying ? (
            <Pause size={20} color={theme.icon.primary} strokeWidth={2} />
          ) : (
            <Play size={20} color={theme.icon.primary} strokeWidth={2} />
          )
        }
      />
      <GestureDetector gesture={panGesture}>
        <View
          ref={barRef}
          className="flex-1 justify-center"
          style={{ height: HIT_AREA_HEIGHT }}
          onLayout={() => {
            barRef.current?.measure((_x, _y, width, _height, pageX) => {
              barWidthSV.value = width;
              barPageXSV.value = pageX;
            });
          }}
        >
          {/* Track */}
          <View
            className="rounded-full"
            style={{ height: TRACK_HEIGHT, backgroundColor: theme.border.subtle }}
          >
            {/* Fill */}
            <Animated.View
              className="absolute left-0 top-0 h-full rounded-full"
              style={[{ backgroundColor: theme.brand.primary }, fillStyle]}
            />
          </View>
          {/* Thumb */}
          <Animated.View
            className="absolute rounded-full"
            style={[
              {
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                top: (HIT_AREA_HEIGHT - THUMB_SIZE) / 2,
                backgroundColor: theme.brand.primary,
              },
              thumbStyle,
            ]}
          />
        </View>
      </GestureDetector>
      <Text className="text-xs" style={{ color: theme.text.secondary }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </View>
  );
}
