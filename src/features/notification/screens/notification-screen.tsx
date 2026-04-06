import { IconButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotifications } from "@/features/notification/hooks";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NotificationItem } from "@/features/notification/api";

export function NotificationScreen() {
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
    refetch,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const notifications = data?.pages.flatMap((p) => p.content) ?? [];

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View
      className="px-4 py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: theme.border.subtle }}
    >
      <Text
        className={`text-sm mb-0.5 ${item.read ? "font-body" : "font-heading"}`}
        style={{ color: theme.text.primary }}
      >
        {item.title}
      </Text>
      <Text className="text-sm font-body" style={{ color: theme.text.secondary }}>
        {item.body}
      </Text>
      <Text className="text-xs font-body mt-1" style={{ color: theme.text.muted }}>
        {new Date(item.createdAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    if (isError) {
      return (
        <View className="flex-1 items-center justify-center px-8 mt-24">
          <Text
            className="text-base font-body text-center"
            style={{ color: theme.text.secondary }}
          >
            Không thể tải thông báo. Vui lòng thử lại.
          </Text>
        </View>
      );
    }
    return (
      <View className="flex-1 items-center justify-center px-8 mt-24">
        <Text
          className="text-base font-body text-center"
          style={{ color: theme.text.secondary }}
        >
          Chưa có thông báo nào
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background.page }}>
      <ScreenHeader
        title="Thông báo"
        paddingTop={insets.top + 16}
        leftAction={
          <IconButton
            icon={<ArrowLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator color={theme.brand.primary} />
              </View>
            ) : null
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.brand.primary}
            />
          }
        />
      )}
    </View>
  );
}
