import { Tabs } from "expo-router";
import { ClipboardList, Dumbbell, House, Mic, UserRound } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].brand.primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background.page,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: "Nunito_700Bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => <House size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="speaking"
        options={{
          title: "Luyện nói",
          tabBarIcon: ({ color, focused }) => <Mic size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assignment"
        options={{
          title: "Bài tập",
          tabBarIcon: ({ color }) => (
            <ClipboardList size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Luyện tập với AI",
          tabBarIcon: ({ color }) => (
            <Dumbbell size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Cá nhân",
          tabBarIcon: ({ color, focused }) => (
            <UserRound size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
