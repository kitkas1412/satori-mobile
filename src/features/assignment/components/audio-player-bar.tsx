// Thanh audio player hiển thị trong màn hình bài tập khi có audioUrl.
// Hiển thị nút phát/dừng, thanh tiến trình và thời gian hiện tại / tổng thời lượng.

import { Pause, Play } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { IconButton, ProgressBar } from "@/components/ui";

interface AudioPlayerBarProps {
  theme: typeof Colors.light;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  toggle: () => void;
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
}: AudioPlayerBarProps) {
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
      <View className="flex-1">
        <ProgressBar progress={progress} />
      </View>
      <Text className="text-xs" style={{ color: theme.text.secondary }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </View>
  );
}
