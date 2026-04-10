import { IconButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBadges } from "../hooks";
import { EarnedBadgeCard, UnearnedBadgeCard } from "../components";

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

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const nearBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 200;
    if (nearBottom && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : isError ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
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
          scrollEventThrottle={200}
          onScroll={handleScroll}
          contentContainerStyle={{ gap: 16, paddingBottom: insets.bottom + 24 }}
        >
          {/* Section: Earned — carousel */}
          {earned.length > 0 && (
            <View style={{ gap: 8 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 18, color: theme.text.primary, paddingHorizontal: 16 }}
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
                contentContainerStyle={{ paddingHorizontal: 16 }}
                scrollEnabled={earned.length > 3}
              />
            </View>
          )}

          {/* Section: Unearned — grid */}
          {unearned.length > 0 && (
            <View style={{ gap: 8, paddingHorizontal: 16 }}>
              <Text
                className="font-heading"
                style={{ fontSize: 18, color: theme.text.primary }}
              >
                Thành tựu chưa đạt
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {unearned.map((item) => (
                  <UnearnedBadgeCard key={item.badgeId} badge={item} />
                ))}
              </View>
              {isFetchingNextPage && (
                <View style={{ alignItems: "center", paddingVertical: 8 }}>
                  <ActivityIndicator size="small" color={theme.brand.primary} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
