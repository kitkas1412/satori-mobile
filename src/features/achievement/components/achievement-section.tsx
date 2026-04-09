import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useAchievementProgress } from "../hooks";
import { BadgeCard } from "./badge-card";

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

export function AchievementSection() {
  const { data } = useAchievementProgress();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  if (!data) return null;

  const sorted = [...data.badgeProgress].sort((a, b) =>
    a.earned === b.earned ? 0 : a.earned ? -1 : 1
  );
  const preview = sorted.slice(0, 6);
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
          onPress={() => router.push("/achievements")}
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
              <BadgeCard key={badge.badgeId} badge={badge} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
