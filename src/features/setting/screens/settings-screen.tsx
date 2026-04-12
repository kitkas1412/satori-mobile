import {
  IconButton,
  LoadingOverlay,
  PrimaryButton,
  ScreenHeader,
} from "@/components/ui";
import { useLogout } from "@/features/authentication/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACCOUNT_ROWS = [
  { label: "Cài đặt chung", route: "/general-settings" },
  { label: "Giao diện", route: "/theme-selector" },
  { label: "Thông báo" },
];

export function SettingsScreen() {
  const router = useRouter();
  const { mutate: logoutUser, isPending } = useLogout();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => logoutUser(),
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: theme.background.page }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Cài đặt"
          paddingTop={insets.top + 16}
          leftAction={
            <IconButton
              icon={<ArrowLeft size={20} color={theme.icon.primary} />}
              onPress={() => router.back()}
            />
          }
        />

        <View className="px-4 gap-3">
          {/* Tài khoản card */}
          <View
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: theme.background.surface,
              borderWidth: 1,
              borderColor: theme.border.subtle,
            }}
          >
            <View className="px-4 py-4">
              <Text
                className="font-heading text-lg mb-3"
                style={{ color: theme.text.primary }}
              >
                Tài khoản
              </Text>

              {ACCOUNT_ROWS.map((row, index) => (
                <View key={row.label}>
                  {index > 0 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: theme.border.subtle,
                        marginVertical: 12,
                      }}
                    />
                  )}
                  <TouchableOpacity
                    className="flex-row items-center justify-between"
                    activeOpacity={0.6}
                    onPress={() => row.route && router.push(row.route as any)}
                  >
                    <Text
                      className="font-body text-sm"
                      style={{ color: theme.text.secondary }}
                    >
                      {row.label}
                    </Text>
                    <ChevronRight size={20} color={theme.icon.secondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Change password */}
          <PrimaryButton
            text="Thay đổi mật khẩu"
            onPress={() => router.push("/change-password")}
            variant="primary"
          />

          {/* Logout */}
          <PrimaryButton
            text="Đăng xuất"
            onPress={handleLogout}
            variant="danger"
            loading={isPending}
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={isPending} title="Đang đăng xuất..." />
    </>
  );
}
