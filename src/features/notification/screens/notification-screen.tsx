import { IconButton, ScreenHeader } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotifications, useMarkReadNotification, useMarkAllReadNotification } from "@/features/notification/hooks";
import { useRouter } from "expo-router";
import { ChevronLeft, CheckCheck } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationItem } from "@/features/notification/components";

export function NotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { data, isLoading, isError, refetch } = useNotifications();

  const { mutate: markRead } = useMarkReadNotification();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllReadNotification();

  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const notifications = data?.content ?? [];

  const renderEmpty = () => {
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
            icon={<ChevronLeft size={24} color={theme.icon.primary} />}
            onPress={() => router.back()}
          />
        }
        rightAction={
          <IconButton
            icon={<CheckCheck size={22} color={theme.icon.primary} />}
            onPress={() => markAllRead()}
            disabled={isMarkingAll || notifications.length === 0}
          />
        }
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={theme.brand.primary} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.brand.primary}
            />
          }
        >
          {notifications.length === 0
            ? renderEmpty()
            : notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  theme={theme}
                  onPress={() => markRead({ notificationIds: [item.id] })}
                />
              ))}
        </ScrollView>
      )}
    </View>
  );
}
