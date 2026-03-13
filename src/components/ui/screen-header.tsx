import React from "react";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

interface ScreenHeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  paddingTop?: number;
  titleSize?: "xl" | "2xl";
}

export function ScreenHeader({
  title,
  leftAction,
  rightAction,
  paddingTop = 0,
  titleSize = "xl",
}: ScreenHeaderProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const titleClass =
    titleSize === "2xl"
      ? "font-heading text-2xl flex-1"
      : "font-heading text-xl flex-1";

  return (
    <View
      className="flex-row items-center px-4 pb-4 gap-2"
      style={{ paddingTop }}
    >
      {leftAction}
      <Text
        className={titleClass}
        style={{ color: theme.textDefault }}
        numberOfLines={1}
      >
        {title}
      </Text>
      {rightAction}
    </View>
  );
}
