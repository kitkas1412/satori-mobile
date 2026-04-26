import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import type { EarnedBadge } from "../api";
import { chunkArray } from "../utils";
import { BadgeCard } from "./badge-card";

interface AchievementSectionProps {
  badges: EarnedBadge[];
  onPressViewAll: () => void;
  onPressBadge: (badgeId: string) => void;
}

export function AchievementSection({ badges, onPressViewAll, onPressBadge }: AchievementSectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const preview = badges.slice(0, 6);
  const rows = chunkArray(preview, 3);

  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 18, color: theme.text.primary }}
        >
          Thành tựu
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={12}
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={onPressViewAll}
        >
          <Text
            className="font-heading"
            style={{ fontSize: 14, color: theme.brand.primary }}
          >
            Xem tất cả{" "}
          </Text>
          <ChevronRight size={16} color={theme.brand.primary} />
        </TouchableOpacity>
      </View>

      {/* Badge grid */}
      <View style={{ gap: 7 }}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", gap: 8 }}>
            {row.map((badge) => (
              <BadgeCard
                key={badge.badgeId}
                iconUrl={badge.iconUrl}
                onPress={() => onPressBadge(badge.badgeId)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
