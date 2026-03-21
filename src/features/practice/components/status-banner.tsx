import { AlertTriangle, Award, Info } from "lucide-react-native";
import { Text, View } from "react-native";

const BANNER_CONFIG = {
  info: {
    borderColor: "#91caff",
    backgroundColor: "#e6f4ff",
    textColor: "#0958d9",
    Icon: Info,
  },
  success: {
    borderColor: "#b7eb8f",
    backgroundColor: "#f6ffed",
    textColor: "#389e0d",
    Icon: Award,
  },
  warning: {
    borderColor: "#ffccc7",
    backgroundColor: "#fff1f0",
    textColor: "#cf1322",
    Icon: AlertTriangle,
  },
} as const;

interface StatusBannerProps {
  type: keyof typeof BANNER_CONFIG;
  title: string;
  description?: string;
  extra?: React.ReactNode;
}

export function StatusBanner({ type, title, description, extra }: StatusBannerProps) {
  const { borderColor, backgroundColor, textColor, Icon } = BANNER_CONFIG[type];

  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor,
        backgroundColor,
        padding: 16,
        gap: 8,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Icon size={20} color={textColor} strokeWidth={1.5} />
        <Text className="font-heading text-sm" style={{ color: textColor }}>
          {title}
        </Text>
      </View>
      {description ? (
        <Text
          className="font-body text-xs"
          style={{ color: textColor, lineHeight: 19 }}
        >
          {description}
        </Text>
      ) : null}
      {extra}
    </View>
  );
}
