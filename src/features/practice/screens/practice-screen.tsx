import { Bell, BookOpen, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SectionHeader } from "@/components/ui/section-header";
import { AiBanner } from "../components/ai-banner";
import { AssignmentCard } from "../components/assignment-card";
import type { AssignmentCardProps } from "../components/assignment-card";

type ActiveTab = "teacher" | "ai";

const MOCK_ASSIGNMENTS: AssignmentCardProps[] = [
  {
    title: "Luyện phát âm: Phụ âm đầu",
    subtitle: "Thực hành 15 từ",
    dueDate: "22/01/2026",
    status: "in_progress",
    progress: { current: 7, total: 15 },
  },
  {
    title: "Bài tập Unit 3: Gia đình",
    subtitle: "10 câu hỏi về từ vựng và ngữ pháp",
    dueDate: "25/01/2026",
    status: "not_started",
  },
  {
    title: "Hội thoại: Giới thiệu bản thân",
    subtitle: "Hoàn thành bài đối thoại",
    dueDate: "20/01/2026",
    status: "completed",
  },
];

export function PracticeScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("teacher");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const bellAction = (
    <View className="relative">
      <View className="w-9 h-9 bg-secondary-default rounded-full items-center justify-center">
        <Bell size={20} color={theme.textInverse} strokeWidth={2} />
      </View>
      <View className="absolute top-0 right-0 w-2 h-2 bg-error-default rounded-full" />
    </View>
  );

  return (
    <View className="flex-1 bg-background-default">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <ScreenHeader
          title="Ôn tập"
          rightAction={bellAction}
          paddingTop={insets.top + 16}
        />

        {/* Tab Switcher */}
        <View
          className="mx-4 flex-row bg-background-surface rounded-2xl p-1 mb-3"
          style={{ borderWidth: 0.6, borderColor: "rgba(0,0,0,0.05)" }}
        >
          <Pressable
            onPress={() => setActiveTab("teacher")}
            className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
            style={
              activeTab === "teacher"
                ? { backgroundColor: theme.primary }
                : undefined
            }
          >
            <BookOpen
              size={20}
              color={activeTab === "teacher" ? "#fff" : theme.textMuted}
              strokeWidth={2}
            />
            <Text
              className="font-heading text-sm"
              style={{
                color: activeTab === "teacher" ? "#fff" : theme.textMuted,
              }}
            >
              Bài tập GV
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("ai")}
            className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
            style={
              activeTab === "ai"
                ? { backgroundColor: theme.primary }
                : undefined
            }
          >
            <Sparkles
              size={20}
              color={activeTab === "ai" ? "#fff" : theme.textMuted}
              strokeWidth={2}
            />
            <Text
              className="font-heading text-sm"
              style={{
                color: activeTab === "ai" ? "#fff" : theme.textMuted,
              }}
            >
              Ôn luyện AI
            </Text>
          </Pressable>
        </View>

        {activeTab === "teacher" ? (
          <View className="px-4 gap-3">
            {/* Section heading */}
            <SectionHeader
              title="Bài tập từ giáo viên"
              subtitle="Hoàn thành các bài tập được giao bởi giáo viên"
              size="sm"
            />

            {/* Assignment cards */}
            {MOCK_ASSIGNMENTS.map((item, index) => (
              <AssignmentCard key={index} {...item} />
            ))}
          </View>
        ) : (
          <View className="px-4">
            <AiBanner />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
