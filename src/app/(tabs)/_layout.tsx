import { Tabs } from "expo-router";
import { Dumbbell, House, Mic, UserRound } from "lucide-react-native";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].surface,
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
        name="practice"
        options={{
          title: "Ôn tập",
          tabBarIcon: ({ color, focused }) => (
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
