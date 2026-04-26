import { IconButton, ProgressBar, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBadgeDetail } from "../hooks";
import { formatDate } from "../utils";

export function BadgeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { badgeId } = useLocalSearchParams<{ badgeId: string }>();
  const { data, isLoading, isError } = useBadgeDetail(badgeId ?? "");

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.page }}>
      <ScreenHeader
        title=""
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<X size={24} color={theme.icon.primary} />}
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
      ) : isError || !data ? (
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
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 150,
            gap: 20,
          }}
        >
          {/* Badge icon */}
          <Image
            source={{ uri: data.iconUrl }}
            style={{ width: 128, height: 128 }}
            contentFit="contain"
          />

          {/* Earned date or not-earned label */}
          {data.learnerProgress.earned && data.learnerProgress.earnedAt ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: theme.background.surface,
                borderWidth: 1,
                borderColor: theme.border.subtle,
              }}
            >
              <Text
                className="font-heading"
                style={{ fontSize: 15, color: theme.brand.primary }}
              >
                {formatDate(data.learnerProgress.earnedAt)}
              </Text>
            </View>
          ) : (
            <View style={{ width: "100%", gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 13, color: theme.text.secondary }}>Tiến độ</Text>
                <Text className="font-heading" style={{ fontSize: 13, color: theme.text.primary }}>
                  {data.learnerProgress.currentValue}/{data.requirementValue}
                </Text>
              </View>
              <ProgressBar progress={data.learnerProgress.progressPercent / 100} />
            </View>
          )}

          {/* Description */}
          <Text
            className="font-body"
            style={{
              fontSize: 18,
              color: theme.text.secondary,
              textAlign: "center",
              lineHeight: 28,
            }}
          >
            {data.description}
          </Text>
        </View>
      )}
    </View>
  );
}
