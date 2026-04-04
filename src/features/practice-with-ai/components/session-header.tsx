import { Flame, X, Zap } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { Colors, Primitive } from "@/constants/theme";

type Theme = typeof Colors.light;

export interface SessionHeaderProps {
  sessionTypeLabel: string;
  currentIndex: number;
  totalItems: number;
  streak: number;
  theme: Theme;
  onClose: () => void;
}

export function SessionHeader({
  sessionTypeLabel,
  currentIndex,
  totalItems,
  streak,
  theme,
  onClose,
}: SessionHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={onClose}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <X size={24} color={theme.icon.primary} strokeWidth={2} />
      </TouchableOpacity>

      <View className="flex-1 items-center gap-[3px]">
        <View
          className="flex-row items-center gap-[5px] rounded-full"
          style={{
            paddingHorizontal: 10.5,
            paddingVertical: 1,
            backgroundColor: theme.border.subtle,
            borderWidth: 0.5,
            borderColor: theme.brand.primary,
          }}
        >
          <Zap
            size={10}
            color={theme.brand.primary}
            fill={theme.brand.primary}
          />
          <Text
            className="font-heading"
            style={{ fontSize: 11, color: theme.brand.primary }}
          >
            {sessionTypeLabel}
          </Text>
        </View>
        <Text
          className="font-body text-xs"
          style={{ color: theme.text.secondary }}
        >
          Câu {currentIndex + 1} / {totalItems}
        </Text>
      </View>

      <View className="flex-row items-center gap-[3px]">
        <Flame
          size={14}
          color={Primitive.amber[300]}
          fill={Primitive.amber[300]}
        />
        <Text
          className="font-heading"
          style={{ fontSize: 16, color: Primitive.amber[300] }}
        >
          {streak}
        </Text>
      </View>
    </View>
  );
}
