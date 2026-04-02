import {
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { useColorScheme as useNativeWindColorScheme } from "nativewind";

import { QueryProvider } from "@/components/providers/query-provider";
import { useTokenValidation } from "@/features/authentication/hooks";
import { abandonSessionApi } from "@/features/speaking/api";
import { ACTIVE_SESSION_STORAGE_KEY } from "@/features/speaking/hooks";
import { useAuthStore } from "@/stores/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../global.css";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

/**
 * Component điều hướng gốc của app, đồng thời đóng vai trò Auth Guard.
 *
 * Logic điều hướng:
 * - Chờ store load xong từ SecureStore (`isHydrated`) và kiểm tra token xong (`isValidating`)
 *   trước khi redirect, tránh flash màn hình login khi app khởi động.
 * - Nếu chưa đăng nhập và không ở trong nhóm auth → redirect về welcome.
 * - Nếu đã đăng nhập và đang ở trong nhóm auth → redirect về tabs (trang chính).
 *
 * `useTokenValidation` chạy ngầm khi app khởi động để kiểm tra accessToken còn hợp lệ không.
 * Nếu token hết hạn và refresh thất bại, auth store sẽ được clear → isAuthenticated = false
 * → useEffect này sẽ redirect về welcome tự động.
 */
function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const { isValidating } = useTokenValidation();

  useEffect(() => {
    // Chờ store load từ SecureStore trước khi kiểm tra
    if (!isHydrated) return;
    // Chờ quá trình validate token hoàn tất trước khi redirect
    if (isValidating) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isHydrated, isValidating, segments]);

  // Dọn dẹp session tồn đọng sau khi app bị force-quit giữa chừng.
  // Chạy sau khi token đã sẵn sàng để đảm bảo API call thành công.
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    const cleanupOrphanedSession = async () => {
      const orphanedSessionId = await AsyncStorage.getItem(
        ACTIVE_SESSION_STORAGE_KEY,
      );
      if (!orphanedSessionId) return;
      try {
        await abandonSessionApi(orphanedSessionId);
      } catch {
        // best-effort
      } finally {
        await AsyncStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      }
    };

    cleanupOrphanedSession();
  }, [isHydrated, isAuthenticated]);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/welcome"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/forgot-password"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/reset-password-otp"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/reset-password"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(auth)/reset-password-success"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="change-password"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="conversation-detail"
        options={{ headerShown: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="conversation-practice"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="conversation-feedback"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="assignment-quiz"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="assignment-result"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="assignment-writing"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="assignment-writing-result"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="practice-session"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="practice-result"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="theme-selector"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();

  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    OpenSans_400Regular,
    OpenSans_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setColorScheme(colorScheme ?? "light");
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </QueryProvider>
  );
}
