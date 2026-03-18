import { Bell, BookOpen, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SectionHeader } from "@/components/ui/section-header";
import { AiBanner } from "../components/ai-banner";
import { AssignmentCard } from "../components/assignment-card";
import { useAssignments, mapAssignmentToCardProps, useAssignmentNavigation } from "../hooks";

type ActiveTab = "teacher" | "ai";

export function PracticeScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("teacher");
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useAssignments();
  const { handleAssignmentPress } = useAssignmentNavigation();

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
              color={activeTab === "teacher" ? theme.white : theme.textMuted}
              strokeWidth={2}
            />
            <Text
              className="font-heading text-sm"
              style={{
                color: activeTab === "teacher" ? theme.white : theme.textMuted,
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
              color={activeTab === "ai" ? theme.white : theme.textMuted}
              strokeWidth={2}
            />
            <Text
              className="font-heading text-sm"
              style={{
                color: activeTab === "ai" ? theme.white : theme.textMuted,
              }}
            >
              Ôn luyện AI
            </Text>
          </Pressable>
        </View>

        {activeTab === "teacher" ? (
          <View className="px-4 gap-3">
            <SectionHeader
              title="Bài tập từ giáo viên"
              subtitle="Hoàn thành các bài tập được giao bởi giáo viên"
              size="sm"
            />

            {isLoading ? (
              <ActivityIndicator color={theme.primary} />
            ) : isError ? (
              <Text
                className="font-body text-sm text-center"
                style={{ color: theme.textMuted }}
              >
                Không thể tải bài tập. Vui lòng thử lại.
              </Text>
            ) : !data?.content.length ? (
              <Text
                className="font-body text-sm text-center"
                style={{ color: theme.textMuted }}
              >
                Chưa có bài tập nào.
              </Text>
            ) : (
              data.content.map((item) => (
                <AssignmentCard
                  key={item.id}
                  {...mapAssignmentToCardProps(item)}
                  onPress={() => handleAssignmentPress(item)}
                />
              ))
            )}
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
