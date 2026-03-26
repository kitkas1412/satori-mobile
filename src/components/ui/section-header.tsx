import React from "react";
import { Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type Size = "sm" | "md" | "lg";
type Alignment = "left" | "center";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: Size;
  alignment?: Alignment;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  size = "md",
  alignment = "left",
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const getTitleClass = () => {
    const base = "font-heading";
    const alignClass = alignment === "center" ? "text-center" : "text-left";

    switch (size) {
      case "sm":
        return `${base} text-sm ${alignClass}`;
      case "lg":
        return `${base} text-xl ${alignClass}`;
      case "md":
      default:
        return `${base} text-lg ${alignClass}`;
    }
  };

  const getSubtitleClass = () => {
    const base = "font-body";
    const alignClass = alignment === "center" ? "text-center" : "text-left";

    switch (size) {
      case "sm":
        return `${base} text-sm ${alignClass}`;
      case "lg":
        return `${base} text-sm ${alignClass}`;
      case "md":
      default:
        return `${base} text-xs ${alignClass}`;
    }
  };

  const containerAlignClass =
    alignment === "center" ? "items-center" : "items-start";

  return (
    <View className={`flex-col ${containerAlignClass}`}>
      <Text className={getTitleClass()} style={{ color: theme.text.primary }}>
        {title}
      </Text>
      {subtitle && (
        <Text
          className={getSubtitleClass()}
          style={{ color: theme.text.secondary }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};
