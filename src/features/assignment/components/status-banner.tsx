// Banner thông báo trạng thái dùng chung trong tính năng Practice.
// Hỗ trợ ba loại: info (xanh dương), success (xanh lá), warning (đỏ).

import { AlertTriangle, Award, Info } from "lucide-react-native";
import { Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Cấu hình icon cho từng loại banner.
// Dùng object thay vì switch/if để dễ mở rộng thêm loại mới.
const BANNER_ICON = {
  info: Info,
  success: Award,
  warning: AlertTriangle,
} as const;

interface StatusBannerProps {
  type: keyof typeof BANNER_CONFIG;
  title: string;
  description?: string;
  extra?: React.ReactNode; // Nội dung tùy chỉnh hiển thị bên dưới description
}

export function StatusBanner({ type, title, description, extra }: StatusBannerProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const Icon = BANNER_ICON[type];
  const borderColor = theme[type].default;
  const backgroundColor = theme[type].subtle;
  const textColor = theme[type].default;

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
      {/* Hàng tiêu đề: icon + text */}
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
