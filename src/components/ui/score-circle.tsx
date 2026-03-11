import React from "react";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface ScoreCircleProps {
  score: number | null;
  label: string;
}

export function ScoreCircle({ score, label }: ScoreCircleProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const displayScore = score != null ? Math.round(score) : "--";

  return (
    <View className="items-center gap-1 flex-1">
      <View
        className="w-16 h-16 rounded-full items-center justify-center border-2"
        style={{ borderColor: theme.primary }}
      >
        <Text className="font-heading text-xl" style={{ color: theme.primary }}>
          {displayScore}
        </Text>
      </View>
      <Text
        className="font-body text-xs text-center"
        style={{ color: theme.textMuted }}
      >
        {label}
      </Text>
    </View>
  );
}
