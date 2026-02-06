import React from "react";
import { Text, View } from "react-native";

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
  const getTitleClass = () => {
    const base = "font-heading text-black";
    const alignClass = alignment === "center" ? "text-center" : "text-left";

    switch (size) {
      case "sm":
        return `${base} text-[14px] leading-[18px] ${alignClass}`;
      case "lg":
        return `${base} text-[20px] leading-[26px] ${alignClass}`;
      case "md":
      default:
        return `${base} text-[17px] leading-[22px] ${alignClass}`;
    }
  };

  const getSubtitleClass = () => {
    const base = "font-bodys text-black";
    const alignClass = alignment === "center" ? "text-center" : "text-left";

    switch (size) {
      case "sm":
        return `${base} text-[10px] ${alignClass}`;
      case "lg":
        return `${base} text-[14px] ${alignClass}`;
      case "md":
      default:
        return `${base} text-xs ${alignClass}`;
    }
  };

  const containerAlignClass =
    alignment === "center" ? "items-center" : "items-start";

  return (
    <View className={`flex-col ${containerAlignClass}`}>
      <Text className={getTitleClass()}>{title}</Text>
      {subtitle && <Text className={getSubtitleClass()}>{subtitle}</Text>}
    </View>
  );
};
