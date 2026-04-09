import { IconButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft, Lock } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Badge } from "../api";
import { useBadges } from "../hooks";

const BADGE_CONFIG: Record<
  Badge["badgeType"],
  { emoji: string; bg: string }
> = {
  LEARNING_STREAK: { emoji: "🔥", bg: "#fef2f2" },
  AI_SPEAKING_COUNT: { emoji: "🗣️", bg: "#f5f3ff" },
  AI_PRACTICE_COUNT: { emoji: "💪", bg: "#f0fdf4" },
  LEARNING_LEVEL: { emoji: "🏆", bg: "#fffbeb" },
};

function EarnedBadgeCard({ badge }: { badge: Badge }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const config = BADGE_CONFIG[badge.badgeType];

  return (
    <View
      style={{
        width: 114,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        backgroundColor: theme.background.page,
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 8,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: config.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
      </View>

      <View style={{ alignItems: "center", gap: 2, width: "100%" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 11, color: theme.text.primary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
        <Text
          style={{ fontSize: 9, color: theme.text.secondary, textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      </View>
    </View>
  );
}

function UnearnedBadgeCard({ badge }: { badge: Badge }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const config = BADGE_CONFIG[badge.badgeType];

  return (
    <View
      style={{
        width: 114,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        backgroundColor: theme.background.page,
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 8,
        alignItems: "center",
        opacity: 0.65,
      }}
    >
      {/* Lock icon */}
      <View
        style={{
          position: "absolute",
          top: 9,
          right: 9,
        }}
      >
        <Lock size={14} color="#9ca3af" />
      </View>

      {/* Gray emoji circle */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#f3f4f6",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
      </View>

      {/* Name + description */}
      <View style={{ alignItems: "center", gap: 2, width: "100%" }}>
        <Text
          className="font-heading"
          style={{ fontSize: 11, color: "#6b7280", textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.name}
        </Text>
        <Text
          style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
          numberOfLines={2}
        >
          {badge.description}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={{ width: "100%", gap: 2 }}>
        <View
          style={{
            width: "100%",
            height: 4,
            borderRadius: 100,
            backgroundColor: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 4,
              borderRadius: 100,
              backgroundColor: "#3d5cc4",
              width: `${badge.progressPercent}%`,
            }}
          />
        </View>
        <Text
          style={{ fontSize: 9, color: "#9ca3af", textAlign: "center" }}
        >
          {badge.currentValue}/{badge.requirementValue}
        </Text>
      </View>
    </View>
  );
}

export function AchievementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBadges();

  const allBadges = data?.pages.flatMap((p) => p.content) ?? [];
  const earned = allBadges.filter((b) => b.earned);
  const unearned = allBadges.filter((b) => !b.earned);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.page }}>
      <ScreenHeader
        title="Tất cả huy hiệu"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ArrowLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : isError ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <Text
            className="font-body text-base text-center"
            style={{ color: theme.text.secondary }}
          >
            Không thể tải dữ liệu. Vui lòng thử lại.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 24 }}
        >
          {/* Section: Earned */}
          {earned.length > 0 && (
            <View style={{ gap: 8, paddingHorizontal: 16 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 18, color: theme.text.primary }}
              >
                Thành tựu cá nhân
              </Text>
              <FlatList
                data={earned}
                keyExtractor={(item) => item.badgeId}
                renderItem={({ item }) => <EarnedBadgeCard badge={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                scrollEnabled={earned.length > 3}
              />
            </View>
          )}

          {/* Section: Unearned */}
          {unearned.length > 0 && (
            <View style={{ gap: 8, paddingHorizontal: 16 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 18, color: theme.text.primary }}
              >
                Thành tựu chưa đạt
              </Text>
              <FlatList
                data={unearned}
                keyExtractor={(item) => item.badgeId}
                renderItem={({ item }) => <UnearnedBadgeCard badge={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <View style={{ width: 48, alignItems: "center", justifyContent: "center" }}>
                      <ActivityIndicator size="small" color={theme.brand.primary} />
                    </View>
                  ) : null
                }
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
