import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface TextLinkProps extends TouchableOpacityProps {
  text: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

export const TextLink: React.FC<TextLinkProps> = ({
  text,
  variant = "primary",
  size = "md",
  align = "left",
  className,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "text-gray-600";
      case "danger":
        return "text-error-500";
      case "primary":
      default:
        return "";
    }
  };

  const getVariantStyle = () => {
    if (variant === "primary") return { color: theme.text.link };
    return undefined;
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-tiny-xs";
      case "lg":
        return "text-sm";
      case "md":
      default:
        return "text-xs";
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case "center":
        return "self-center";
      case "right":
        return "self-end";
      case "left":
      default:
        return "self-start";
    }
  };

  return (
    <TouchableOpacity
      className={`mt-2 py-2 ${getAlignClass()} ${className || ""}`}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      {...props}
    >
      <Text className={`font-heading ${getSizeClass()} ${getVariantClass()}`} style={getVariantStyle()}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
