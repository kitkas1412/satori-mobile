import { LoadingOverlay, PrimaryButton, ScreenHeader } from "@/components/ui";
import { useLogout } from "@/features/authentication/hooks";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/auth-store";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyRound, LogOut } from "lucide-react-native";
import { Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeSelector } from "../components/theme-selector";

export function ProfileScreen() {
  const { user } = useAuthStore();
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
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            logoutUser();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <ScreenHeader
          title="Cá nhân"
          paddingTop={insets.top + 16}
        />

        {user && (
          <View
            className="px-6 py-4 mx-4 rounded-2xl mb-4"
            style={{ backgroundColor: theme.cardBackground }}
          >
            <Text
              className="text-lg font-semibold mb-1"
              style={{ color: theme.textDefault }}
            >
              {user.fullName || "Người dùng"}
            </Text>
            <Text className="text-sm" style={{ color: theme.textMuted }}>
              {user.email}
            </Text>
          </View>
        )}

        <ThemeSelector />

        <View className="px-6 mt-4 gap-3">
          <PrimaryButton
            text="Thay đổi mật khẩu"
            onPress={() => router.push("/change-password")}
            icon={<KeyRound size={20} color="white" />}
            variant="primary"
            style={{ backgroundColor: theme.primary }}
          />

          <PrimaryButton
            text="Đăng xuất"
            onPress={handleLogout}
            icon={<LogOut size={20} color="white" />}
            variant="danger"
            loading={isPending}
            style={{ backgroundColor: theme.error }}
          />
        </View>
      </View>
      <LoadingOverlay visible={isPending} title="Đang đăng xuất..." />
    </>
  );
}
