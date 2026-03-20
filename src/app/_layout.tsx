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

import { QueryProvider } from "@/components/providers/query-provider";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthStore } from "@/stores/auth-store";
import "../../global.css";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isHydrated, segments]);

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
        name="topic-detail"
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
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <GluestackUIProvider mode="light">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </GluestackUIProvider>
    </QueryProvider>
  );
}
