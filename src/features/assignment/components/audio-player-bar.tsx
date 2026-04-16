// Thanh audio player hiển thị trong màn hình bài tập khi có audioUrl.
// Hiển thị nút phát/dừng, thanh tiến trình và thời gian hiện tại / tổng thời lượng.
// Hỗ trợ tap và hold & drag để seek đến vị trí bất kỳ.

import { Pause, Play } from "lucide-react-native";
import { useRef } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Colors } from "@/constants/theme";
import { IconButton, ProgressBar } from "@/components/ui";

interface AudioPlayerBarProps {
  theme: typeof Colors.light;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  toggle: () => void;
  onSeek: (seconds: number) => void;
}

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
  const barWidth = useRef(0);

  function calcSeek(absoluteX: number, barX: number): number {
    const localX = absoluteX - barX;
    const ratio = Math.min(Math.max(localX / barWidth.current, 0), 1);
    return ratio * duration;
  }

  const barXRef = useRef(0);

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((e) => {
      onSeek(calcSeek(e.absoluteX, barXRef.current));
    })
    .onUpdate((e) => {
      onSeek(calcSeek(e.absoluteX, barXRef.current));
    });

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
          className="flex-1"
          onLayout={(e) => {
            barWidth.current = e.nativeEvent.layout.width;
            barXRef.current = e.nativeEvent.layout.x;
          }}
        >
          <ProgressBar progress={progress} />
        </View>
      </GestureDetector>
      <Text className="text-xs" style={{ color: theme.text.secondary }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </View>
  );
}
