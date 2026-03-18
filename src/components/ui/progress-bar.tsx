import { View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ProgressBarProps {
  progress: number; // 0–1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  height = 8,
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const fillColor = color ?? theme.primary;
  const fill = Math.min(1, Math.max(0, progress));

  return (
    <View
      className="rounded-full overflow-hidden"
      style={{ height, backgroundColor: trackColor ?? theme.border }}
    >
      <View
        className="h-full rounded-full"
        style={{ backgroundColor: fillColor, width: `${fill * 100}%` }}
      />
    </View>
  );
}
